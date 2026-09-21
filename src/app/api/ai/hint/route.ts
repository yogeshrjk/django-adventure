import { NextResponse } from "next/server";
import type { Level } from "@/lib/levels";

const MODEL_NAME = "gemini-3.5-flash-lite";

export async function POST(request: Request) {
  try {
    const { level, code } = (await request.json()) as {
      level: Level;
      code: string;
    };

    if (!level) {
      return NextResponse.json({
        hint: "Read the story panel carefully and try again.",
        source: "local",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({
        hint: level.hints[0] || "Review the example technique on the left.",
        source: "local",
      });
    }

    const prompt = `You are Djano teaching Python and Django to beginners. Use simple words and no emojis. Level ${level.id} about "${level.topic ?? level.title}" (${level.title}). Mission: ${level.mission}. Student code:\n${code}\nGive ONE tiny, helpful hint without giving away the full solution. Max 2 sentences.`;

    let text = "";

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
            generationConfig: { temperature: 0.7, maxOutputTokens: 150 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      } else {
        const err = await res.text();
        console.warn(`[AI Hint] Gemini API error (${MODEL_NAME}):`, err);
      }
    } catch (err) {
      console.warn(`[AI Hint] Failed to call ${MODEL_NAME}:`, err);
    }

    return NextResponse.json({
      hint: text || level.hints[0] || "Check the example on the left panel.",
      source: text ? "ai" : "local",
    });
  } catch (err) {
    console.error("AI hint API error, falling back to built-in hint:", err);
    try {
      const body = await request.clone().json();
      return NextResponse.json({
        hint: body?.level?.hints?.[0] || "Review the example technique on the left.",
        source: "local",
      });
    } catch {
      return NextResponse.json({
        hint: "Check the example on the left panel.",
        source: "local",
      });
    }
  }
}
