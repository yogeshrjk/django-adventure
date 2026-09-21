// Minimal Pyodide loader running in main thread (simple) + fallback.
// For MVP we lazy-load CDN pyodide. Tests checked via expectContains + assertCode eval.

let pyodideInstance: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any = null;
let loading: Promise<unknown> | null = null;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPyodide: any;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (!loading) {
    loading = (async () => {
      await loadScript("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
      pyodideInstance = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      });
      return pyodideInstance;
    })();
  }
  return loading;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  success: boolean;
}

export async function runPython(code: string, assertCode?: string): Promise<RunResult> {
  try {
    const py = await getPyodide();
    py.setStdout({ batched: () => {} });
    py.setStderr({ batched: () => {} });
    // capture via python redirect
    const wrapped = `
import sys, io
_stdout = io.StringIO()
_stderr = io.StringIO()
sys.stdout = _stdout
sys.stderr = _stderr
try:
${code
  .split("\n")
  .map((l) => "    " + l)
  .join("\n")}
    __user_error = None
except Exception as e:
    __user_error = e
    import traceback
    _stderr.write(traceback.format_exc())
${assertCode ? `if __user_error is None:\n    # __stdout_text lets an assertion count what the learner printed.\n    __stdout_text = _stdout.getvalue()\n    try:\n${assertCode.split("\n").map((l) => "        " + l).join("\n")}\n    except Exception as e:\n        __user_error = e\n        import traceback\n        _stderr.write("TEST FAILED: " + str(e))\n` : ""}
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`;
    await py.runPythonAsync(wrapped);
    const stdout: string = py.runPython("_stdout.getvalue()");
    const stderr: string = py.runPython("_stderr.getvalue()");
    const hasErr = await py.runPython("__user_error is not None");
    // Pyodide converts Python bool to a JS boolean
    const failed =
      hasErr === true ||
      String(hasErr) === "True" ||
      (stderr && stderr.includes("TEST FAILED"));
    return { stdout, stderr, success: !failed && !stderr.includes("Traceback") };
  } catch (e) {
    return { stdout: "", stderr: String(e), success: false };
  }
}
