"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Editor from "@monaco-editor/react";
import type { Level } from "@/lib/levels";
import { getChapterMascot } from "@/lib/levels";
import { runPython } from "@/lib/pyodide";
import { useGameStore } from "@/lib/game-store";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth-client";
import { gsapCelebrate, gsapPartyPopper } from "@/lib/gsap-helpers";
import { GrandCelebrationModal } from "@/components/game/GrandCelebrationModal";
import {
  Play,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Terminal,
  ArrowRight,
  Sparkles,
  KeyRound,
  Cloud,
  PartyPopper,
  Trophy,
  Star,
  Gem,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkCode, getHint, type CheckResponse } from "@/lib/gemini-client";
import { countMatches } from "@/lib/local-check";

/** Spot classic beginner mistakes and explain them in plain words. */
function smartHint(code: string, stderr: string): string | null {
  if (/^\s*Print\s*\(/m.test(code))
    return "Spotted it: you typed Print with a capital P. Python only understands lowercase print. Change the P to p and run again.";
  if (/\bprint\s*=\s*/.test(code))
    return "You used print as a variable name, which breaks the print command. Rename your variable to something like message.";
  if (/^\s*print\s+["']/m.test(code))
    return "You are missing the brackets. It must be print(\"...\") with parentheses right after print.";
  if (/^\s*print\(.*[^)]\s*$/m.test(code))
    return "A closing bracket is missing. Every ( needs its partner ).";
  if (/NameError:\s*name\s*'(\w+)'/.test(stderr)) {
    const name = stderr.match(/NameError:\s*name\s*'(\w+)'/)?.[1];
    if (name && name.toLowerCase() === "print")
      return `Python does not know ${name}. The command is all-lowercase print. Capitals matter in Python.`;
    if (name)
      return `Python does not know the word ${name}. Check the spelling letter by letter, capitals included.`;
  }
  if (/SyntaxError/.test(stderr))
    return "Python is confused by the shape of a line. Check colons, brackets and quotes one line at a time.";
  return null;
}

export function CodeEditorPanel({ level }: { level: Level }) {
  const [code, setCode] = useState(level.starterCode);
  const [output, setOutput] = useState("Press RUN to test your technique.\n");
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [showGrandFinale, setShowGrandFinale] = useState(false);
  const { completeLevel, spendGems, addXp } = useGameStore();
  const { dark } = useTheme();
  const { authenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement | null>(null);

  async function handleRun() {
    if (!level.runnable) {
      setOutput("This is a Django level, so it cannot run in the browser.\nPress SUBMIT and Djano (AI) will review your code.\n");
      return;
    }
    setRunning(true);
    setOutput("Djano is warming up Python...\n");
    const test = level.tests?.[0];
    const res = await runPython(code, test?.assertCode);
    let text = "";
    if (res.stdout) text += `OUTPUT:\n${res.stdout}\n`;
    if (!res.stdout && !res.stderr) text += "(no output yet — did you use print?)\n";

    // A failed chapter check arrives as "TEST FAILED: ..." without a traceback.
    const testFailure = res.stderr.includes("TEST FAILED")
      ? res.stderr.slice(res.stderr.indexOf("TEST FAILED")).replace("TEST FAILED:", "").trim()
      : "";
    const runtimeError = testFailure ? "" : res.stderr;
    if (runtimeError) text += `ERROR:\n${runtimeError.slice(0, 2000)}\n`;

    const missing = (test?.expectContains ?? []).filter((s) => !res.stdout.includes(s));
    const wrongCounts = (test?.expectCount ?? [])
      .map((c) => ({ ...c, got: countMatches(res.stdout, c.text) }))
      .filter((c) => c.got !== c.times);

    if (res.success && missing.length === 0 && wrongCounts.length === 0 && res.stdout) {
      text += `\nLocal tests passed. Now press SUBMIT for XP.\n`;
    } else {
      if (missing.length > 0) text += `\nMissing expected text: ${missing.join(", ")}\n`;
      for (const c of wrongCounts) {
        text += `\n"${c.text}" should appear ${c.times} time(s) in the output, but it appears ${c.got}. Let the loop do the repeating instead of typing the line by hand.\n`;
      }
      // Only mention the failed check once the learner has actually produced output,
      // so a first RUN with an empty editor is not scolded.
      if (testFailure && res.stdout) text += `\nThe chapter check did not pass yet: ${testFailure}\n`;
      const hint = smartHint(code, res.stderr);
      if (hint) text += `\nDJANO SPOTS THE BUG: ${hint}\n`;
    }
    setOutput(text);
    setRunning(false);
  }

  async function handleSubmit() {
    setChecking(true);
    setResult(null);
    const data = await checkCode(level, code, output);
    setResult(data);
    if (data.isCorrect) {
      completeLevel(level.id, level.xp);
      requestAnimationFrame(() => {
        gsapCelebrate(resultRef.current);
        gsapPartyPopper(75);
      });

      // Grand finale fires only on the real end of the journey (Level 100), not mid-course bosses
      if (level.id === 100) {
        window.setTimeout(() => {
          setShowGrandFinale(true);
        }, 600);
      }

      // Auto sync progress to MongoDB Atlas in the background
      const curState = useGameStore.getState();
      fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xp: curState.xp,
          gems: curState.gems,
          streak: curState.streak,
          completed: curState.completed,
          currentLevel: curState.currentLevel,
        }),
      }).catch(() => undefined);
    }
    setChecking(false);
  }

  async function handleAiHint() {
    if (!spendGems(1)) {
      setOutput(
        (o) =>
          o +
          "\nDJANO SAYS: You need 1 Gem to request an AI hint. Clear levels or check your score to earn more gems!\n"
      );
      return;
    }
    setChecking(true);
    const { hint, source } = await getHint(level, code);
    setOutput((o) => o + `\nDJANO HINT (${source === "ai" ? "AI" : "local"}): ${hint}\n`);
    addXp(1);
    setChecking(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="monaco-comic">
        <div className="flex items-center justify-between border-b-2 border-[#191924] bg-[#191924] px-3 py-2 text-white">
          <span className="font-comic flex items-center gap-2 text-lg tracking-wide">
            <i className="bi bi-code-slash" aria-hidden="true" />
            CODE DOJO — LEVEL {level.id}
          </span>
          <span className="rounded bg-white/20 px-2 py-0.5 font-mono text-xs">python</span>
        </div>
        <Editor
          height="340px"
          defaultLanguage="python"
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme={dark ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontFamily: "JetBrains Mono, Menlo, monospace",
            padding: { top: 12 },
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={handleRun} disabled={running} className="comic-btn bg-[#191924] px-4 py-2 text-sm text-white">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          <span>{running ? "RUNNING" : "RUN"}</span>
        </button>
        <button onClick={handleSubmit} disabled={checking} className="comic-btn bg-[#d62839] px-5 py-2 text-sm text-white">
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span>{checking ? "REVIEWING" : "SUBMIT"}</span>
        </button>
        <button onClick={handleAiHint} disabled={checking} className="comic-btn bg-white px-4 py-2 text-sm" title="Ask Djano for an AI hint (Costs 1 Gem)">
          <Gem className="h-4 w-4 text-[#2f6bff]" />
          <span>ASK DJANO (1 GEM)</span>
        </button>
      </div>

      <div className="comic-card overflow-hidden">
        <div className="flex items-center gap-2 border-b-2 border-[#191924] bg-white px-3 py-1 font-comic text-lg dark:border-black dark:bg-[#262633]">
          <Terminal className="h-5 w-5" /> OUTPUT MONITOR
        </div>
        <pre className="max-h-48 overflow-auto whitespace-pre-wrap bg-[#191924] p-3 font-mono text-sm text-green-300 dark:bg-black">{output}</pre>
      </div>

      {result && (
        <div ref={resultRef} className={`comic-card p-4 ${result.isCorrect ? "bg-[#d7f0d8]" : "bg-[#f6d4da]"}`}>
          <div className="font-comic flex items-center gap-2 text-2xl">
            {result.isCorrect ? (
              <>
                <PartyPopper className="h-7 w-7 text-[#f2b705] animate-bounce" />
                <span className="text-[#1f9d55]">CONGRATULATIONS! LEVEL CLEAR!</span>
              </>
            ) : (
              <>
                <XCircle className="text-[#d62839]" />
                <span>NOT YET</span>
              </>
            )}
            <span className="ml-auto font-sans text-sm font-black">Score {result.score}/100</span>
          </div>
          <p className="mt-1 font-bold">{result.praise}</p>
          {!result.isCorrect && <p className="mt-1 font-bold">Next fix: {result.fixHintKid}</p>}
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-black opacity-80">
            {result.source === "ai" ? (
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Reviewed by AI
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Terminal className="h-3.5 w-3.5" /> Evaluated by local Python checker
              </span>
            )}
          </p>
          {result.isCorrect && (
            <>
              {!authLoading && !authenticated && (
                <div className="mt-2.5 flex items-center justify-between gap-2 rounded border border-black/20 bg-white/60 p-2 text-xs font-bold dark:bg-black/20">
                  <span className="flex items-center gap-1.5 opacity-80">
                    <Cloud className="h-3.5 w-3.5 text-[#2f6bff]" />
                    <span>Please sign in to save your progress, or you might lose your journey!</span>
                  </span>
                  <Link href="/signin" className="underline font-black text-[#2f6bff]">
                    Sign In
                  </Link>
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  className="comic-btn bg-[#191924] px-4 py-2 text-sm text-white"
                  onClick={() => router.push(`/play/${Math.min(level.id + 1, 100)}`)}
                >
                  <span>NEXT LEVEL {level.id + 1}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="comic-btn bg-white px-4 py-2 text-sm" onClick={() => router.push("/map")}>
                  <i className="bi bi-map-fill" aria-hidden="true" />
                  <span>MAP</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {showGrandFinale && (
        <GrandCelebrationModal onClose={() => setShowGrandFinale(false)} />
      )}
    </div>
  );
}
