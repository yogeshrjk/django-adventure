import { NextResponse } from "next/server";
import { getLevel } from "@/content/levels";
import { readGeneratedLevel } from "@/lib/generated-levels";
import type { Level } from "@/lib/levels";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SENSEI_SYSTEM_PROMPT = `You are Sensei, a wise, encouraging master programmer and mentor inside the Django Adventure platform.
Your sole purpose is to teach and answer questions related to Python, Django, Django REST Framework (DRF), backend web development, database modeling, APIs, deployments, and programming logic.

Strict rules you must follow:
1. ONLY answer questions related to Python, Django, DRF, backend development, databases, web servers, and software engineering.
2. If a user asks about anything unrelated to programming, coding, or Python/Django (e.g. politics, gossip, gaming, recipes, general non-code trivia), politely decline: "I am Sensei, dedicated exclusively to the craft of Python and Django programming. Ask me your coding quests, bugs, or architectural dilemmas, and we shall master them together!"
3. Explain concepts clearly using intuitive real-world mental models and concise code examples.
4. Format all code snippets cleanly in markdown code blocks with language identifiers (e.g. \`\`\`python, \`\`\`html, \`\`\`bash).
5. Maintain a warm, encouraging dojo mentor tone. Strictly do NOT use any emojis in your responses.`;

const MODEL_NAME = "gemini-3.5-flash-lite";

/**
 * Resolves the chapter the learner has open from its id. The outline comes
 * from the trusted syllabus on disk (never from client text); the cached
 * Gemini-forged lesson is preferred when it exists so Sensei sees the same
 * lesson the learner sees.
 */
function resolveLevel(levelId: unknown): Level | null {
  const id = typeof levelId === "number" ? levelId : Number(levelId);
  if (!Number.isInteger(id) || id < 0 || id > 100) return null;
  const base = getLevel(id);
  if (!base) return null;
  return base.preview ? readGeneratedLevel(base.id) ?? base : base;
}

/** Builds the chapter-context block appended to Sensei's system prompt. */
function chapterContext(level: Level): string {
  const lines = [
    `CURRENT CHAPTER CONTEXT`,
    `The learner has chapter ${level.id} open right now: ${level.topic ?? level.title} (track: ${level.track}).`,
    `Chapter mission: ${level.mission}`,
    `Example technique shown on their screen:\n${level.exampleCode}`,
  ];
  if (level.syntaxPattern) {
    lines.push(`Topic syntax skeleton shown on their screen:\n${level.syntaxPattern}`);
    if (level.syntaxParts?.length) {
      lines.push(
        `Syntax pieces: ${level.syntaxParts.map((p) => `${p.token} = ${p.meaning}`).join(" | ")}`
      );
    }
  }
  if (level.hints?.length) {
    lines.push(`Official chapter hints (do not reveal all at once): ${level.hints.join(" | ")}`);
  }
  lines.push(
    `When the learner asks about "this", "the current topic", or "this chapter", answer about ${level.topic ?? level.title}. Stay inside this topic unless they clearly ask about something else. If they ask for the mission answer, guide with the smallest possible nudge instead of writing the solution.`,
    `Do not quote this context block itself; answer naturally.`
  );
  return lines.join("\n");
}

export async function POST(request: Request) {
  try {
    const { messages, levelId } = (await request.json()) as {
      messages: Message[];
      levelId?: unknown;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid conversation history." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({
        reply:
          "Sensei is currently meditating in the offline dojo. Please configure GEMINI_API_KEY in .env to connect directly to Sensei's AI mind.",
        success: true,
      });
    }

    // The open chapter, resolved server-side from the trusted syllabus.
    const level = resolveLevel(levelId);

    // Format messages for Gemini API
    const systemText = level
      ? `${SENSEI_SYSTEM_PROMPT}\n\n${chapterContext(level)}`
      : SENSEI_SYSTEM_PROMPT;
    const contents = [
      {
        role: "user",
        parts: [{ text: systemText }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood. I am Sensei, dedicated exclusively to guiding adventurers in Python, Django, and software engineering with clear wisdom, practical code examples, and no emojis." + (level ? ` The learner is on chapter ${level.id}: ${level.topic ?? level.title}. I will keep my answers inside that context.` : ""),
          },
        ],
      },
      ...messages.slice(-10).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        MODEL_NAME
      )}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Sensei Chat] Gemini API error (${MODEL_NAME}):`, errText);
      throw new Error(`Gemini HTTP error ${response.status}`);
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!replyText) {
      throw new Error("Empty response from Sensei AI");
    }

    return NextResponse.json({
      reply: replyText.trim(),
      success: true,
      context: level ? { levelId: level.id, topic: level.topic ?? level.title } : null,
    });
  } catch (err) {
    console.error("Sensei Chat error:", err);
    return NextResponse.json(
      {
        reply:
          "Sensei encountered a disturbance in the code dojo. Please try rephrasing your Python or Django question.",
        success: false,
      },
      { status: 500 }
    );
  }
}
