import type { Level } from "@/lib/levels";
import { localCheck } from "@/lib/local-check";

export interface CheckResponse {
  isCorrect: boolean;
  score: number;
  praise: string;
  fixHintKid: string;
  /** "ai" when Gemini reviewed, "local" for the offline checker. */
  source: "ai" | "local";
}

/**
 * Submits user code for grading. Calls the server-side Gemini review route
 * (which uses GEMINI_API_KEY from .env), with seamless fallback to the local checker.
 */
export async function checkCode(level: Level, code: string, output: string): Promise<CheckResponse> {
  if (!level) {
    return { isCorrect: false, score: 0, praise: "Level not found.", fixHintKid: "Go back to map.", source: "local" };
  }

  try {
    const res = await fetch("/api/ai/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, code, output }),
    });

    if (!res.ok) {
      throw new Error(`Review API error: ${res.status}`);
    }

    const data = await res.json();
    return {
      isCorrect: Boolean(data.isCorrect),
      score: typeof data.score === "number" ? data.score : 0,
      praise: data.praise || "Good job!",
      fixHintKid: data.fixHintKid || "",
      source: data.source || "ai",
    };
  } catch {
    return { ...localCheck(level, code, output), source: "local" };
  }
}

/**
 * Gets a contextual hint from Gemini via server route.
 * Falls back to the level's built-in hint list.
 */
export async function getHint(level: Level, code: string): Promise<{ hint: string; source: "ai" | "local" }> {
  if (!level) return { hint: "Read the story panel and try again.", source: "local" };

  try {
    const res = await fetch("/api/ai/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, code }),
    });

    if (!res.ok) throw new Error(`Hint API error: ${res.status}`);

    const data = await res.json();
    return {
      hint: data.hint || level.hints[0] || "Review the example technique on the left.",
      source: data.source || "ai",
    };
  } catch {
    return { hint: level.hints[0] || "Review the example technique on the left.", source: "local" };
  }
}
