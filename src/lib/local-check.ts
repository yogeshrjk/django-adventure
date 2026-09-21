import type { Level } from "@/lib/levels";

export interface LocalVerdict {
  isCorrect: boolean;
  score: number;
  praise: string;
  fixHintKid: string;
}

/**
 * Counts non-overlapping occurrences of `needle` inside `haystack`.
 * Used by loop missions: "print Mango! three times" must see three, not one.
 */
export function countMatches(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let from = 0;
  for (;;) {
    const at = haystack.indexOf(needle, from);
    if (at === -1) return count;
    count += 1;
    from = at + needle.length;
  }
}

/**
 * Offline checker used when the network request fails or running offline.
 * Runs entirely in the browser: expected output, exact repeat counts, plus
 * keyword checks. Always kind, never an emoji.
 */
export function localCheck(level: Level, code: string, output: string): LocalVerdict {
  const test = level.tests?.[0];
  const expects = test?.expectContains ?? [];
  const counts = test?.expectCount ?? [];

  if (expects.length > 0 || counts.length > 0) {
    const missing = expects.filter((s) => !(output.includes(s) || code.includes(s)));
    const wrongCounts = counts
      .map(({ text, times }) => ({ text, times, got: countMatches(output, text) }))
      .filter((c) => c.got !== c.times);

    if (missing.length === 0 && wrongCounts.length === 0)
      return {
        isCorrect: true,
        score: 100,
        praise: "Your code works. Djano is proud of this run.",
        fixHintKid: "",
      };

    const problems: string[] = [];
    if (missing.length > 0) problems.push(`Missing expected text: ${missing.join(", ")}.`);
    for (const c of wrongCounts)
      problems.push(
        `"${c.text}" should appear ${c.times} time(s) in the output but appears ${c.got}. A loop has to do the repeating, so run the code and check the output.`
      );

    return {
      isCorrect: false,
      score: 40,
      praise: "Good try. You are close to the answer.",
      fixHintKid: `${problems.join(" ")} Hint: ${level.hints[0] ?? ""}`,
    };
  }

  const keywords: Record<number, string[]> = {
    7: ["python -m venv", "pip install django"],
    8: ["def home", "HttpResponse", "Hello, Castle!"],
    9: ["path(", "urlpatterns", "home"],
  };
  const keys = keywords[level.id] ?? [];
  const missing = keys.filter((k) => !code.includes(k));
  if (keys.length === 0 || missing.length === 0)
    return {
      isCorrect: true,
      score: 85,
      praise: "Strong attempt! Your code logic matches the required technique.",
      fixHintKid: "",
    };
  return {
    isCorrect: false,
    score: 45,
    praise: "Nice effort. Something is still missing.",
    fixHintKid: `Missing: ${missing.join(", ")}. Hint: ${level.hints[0] ?? ""}`,
  };
}
