import { NextResponse } from "next/server";
import { localCheck } from "@/lib/local-check";
import type { Level } from "@/lib/levels";

function stripFences(text: string): string {
  return text.replace(/```json|```/g, "").trim();
}

const MODEL_NAME = "gemini-3.5-flash-lite";

export async function POST(request: Request) {
  try {
    const { level, code, output } = (await request.json()) as {
      level: Level;
      code: string;
      output: string;
    };

    if (!level) {
      return NextResponse.json({
        isCorrect: false,
        score: 0,
        praise: "Level not found.",
        fixHintKid: "Go back to map.",
        source: "local",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // If server has no Gemini key configured, use local offline checker
    if (!apiKey) {
      const fallback = localCheck(level, code, output);
      return NextResponse.json({ ...fallback, source: "local" });
    }

    const expectations = [
      ...(level.tests?.[0]?.expectContains ?? []).map((s) => `the output must contain "${s}"`),
      ...(level.tests?.[0]?.expectCount ?? []).map(
        (c) => `the output must show "${c.text}" exactly ${c.times} time(s), not fewer and not more`
      ),
    ].join("; ");

    const prompt = `You are Djano, a kind tutor in the Django Adventure game who teaches Python and Django to beginners of all ages. Use clear, simple language. Do not use emojis anywhere in the response.

LEVEL ${level.id}: ${level.topic ?? level.title} (chapter: ${level.title})
TOPIC THE STUDENT WAS LEARNING: ${level.topic ?? level.mission}
MISSION: ${level.mission}
RUBRIC: ${level.rubricForGemini}
EXPECTED OUTPUT: ${expectations || "judge only against the rubric"}
EXAMPLE (for reference only):
${level.exampleCode}

STUDENT CODE:
\`\`\`python
${code}
\`\`\`
BROWSER OUTPUT:
${output}

Decide if the student passes. Be lenient on formatting, trailing spaces and quotes, but verify the core logic.
If EXPECTED OUTPUT states that a text must appear a certain number of times, count the lines in BROWSER OUTPUT. Fewer or more than required is a fail, and the fix must explain in beginner words that a loop is what repeats the work (for example range(3) counts 0, 1, 2).
Never mark work correct when the expected text is missing from the output.
Return ONLY valid JSON with no markdown fences:
{"isCorrect": true/false, "score": 0-100, "praise": "1 sentence celebration or encouragement, no emojis", "fixHintKid": "1-2 sentence beginner-friendly fix with no emojis, empty string if correct"}`;

    let rawText = "";

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          MODEL_NAME
        )}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      } else {
        const err = await res.text();
        console.warn(`[AI Review] Gemini API error (${MODEL_NAME}):`, err);
      }
    } catch (err) {
      console.warn(`[AI Review] Failed to call ${MODEL_NAME}:`, err);
    }

    if (!rawText) {
      const fallback = localCheck(level, code, output);
      return NextResponse.json({ ...fallback, source: "local" });
    }

    const parsed = JSON.parse(stripFences(rawText));
    return NextResponse.json({
      isCorrect: Boolean(parsed.isCorrect),
      score: Math.max(0, Math.min(100, Number(parsed.score ?? 0))),
      praise: String(parsed.praise ?? "Good job!"),
      fixHintKid: String(parsed.fixHintKid ?? ""),
      source: "ai",
    });
  } catch (err) {
    console.error("AI review API error, falling back to local checker:", err);
    try {
      const body = await request.clone().json();
      const fallback = localCheck(body.level, body.code, body.output);
      return NextResponse.json({ ...fallback, source: "local" });
    } catch {
      return NextResponse.json({
        isCorrect: false,
        score: 0,
        praise: "Could not grade code at this moment.",
        fixHintKid: "Please check your code syntax and try again.",
        source: "local",
      });
    }
  }
}
