import { ALL_LEVELS } from "@/content/levels";
import type { Level } from "@/lib/levels";

/**
 * Server-side Gemini client used by the /api/level/[levelId] route to forge
 * full lessons for outline chapters (10-100). The key comes from the
 * GEMINI_API_KEY environment variable and never reaches the browser.
 *
 * Generation is SYLLABUS-DRIVEN: each chapter teaches exactly the topic the
 * course designer wrote in src/content/levels.ts, connects back to what the
 * learner already knows, teases what comes next, and advances the running
 * project the learner is building (DinoShop, then their own capstone app).
 */

/** Model to use for forging chapters. */
const MODELS = ["gemini-3.5-flash-lite"];
const API_ROOT = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Gemini Guided Learning / LearnLM pedagogy, distilled from Google's published
 * LearnLM system-instruction guidance. The goal is deep understanding, not
 * answer delivery.
 */
const GUIDED_LEARNING_SYSTEM = `You are Djano, a warm, kind programming tutor inside the Django Adventure game. You are operating in GUIDED LEARNING mode (Google's LearnLM pedagogy). Follow these rules strictly:

- ACTIVELY TUTOR, DO NOT JUST ANSWER. Break every concept into a sequence of small, single-idea steps the learner can absorb one at a time. Each step builds on the previous one.
- STAY ON THE SYLLABUS. Teach exactly the topic assigned to the chapter, nothing else. Open by connecting to the previous chapter's topic and close by teasing the next chapter's topic. Do not drift into topics that belong to other chapters.
- BUILD THE RUNNING PROJECT. Whenever possible, use examples and the mission that advance the project goal stated in the chapter facts, so the learner is always constructing one real application, not isolated snippets.
- ONE NEW IDEA PER STEP. Keep each step short (2-4 sentences). Introduce exactly one concept, term or syntax element per step.
- ASSUME ZERO PRIOR KNOWLEDGE. The learner may never have seen this syntax in their life. Before any symbol appears in an example, name it and explain it in plain words: what the keyword means, what each variable holds, and what the brackets, quotes, colons and indentation are doing.
- NEVER USE UNTAUGHT SYNTAX. Check the ALREADY LEARNED list before using any helper. Do not reach for f-strings, list comprehensions, len(), .append(), + on text, or any other extra unless this chapter introduces it or an earlier chapter already taught it. If a helper genuinely makes the lesson clearer, teach it in its own step first.
- SAY THE QUIET PARTS OUT LOUD. Whenever code has a colon or indentation, tell the learner in words that the colon opens a block and the indented lines are the body that belongs to it.
- SHOW THE SHAPE BEFORE THE EXAMPLE. Every chapter gets a syntaxPattern: the topic's generic skeleton with <placeholders> for the parts the learner swaps, and syntaxParts explaining each piece in one plain sentence. A beginner must be able to copy the pattern and know what to replace.
- START FROM WHAT THE LEARNER KNOWS. Anchor each new idea to everyday mental models and game worlds (lunchboxes, treasure maps, castles, rockets, trains, merry-go-rounds).
- INSPIRE EXPLORATION. After explaining, end each step with one short question or invitation that makes the learner predict, try, or imagine ("What do you think happens if...?", "Find the pattern in the example").
- CHECK UNDERSTANDING. Include exactly one comprehension check: a small question with its answer, so learners can self-verify. It must test the mental model, not trivia.
- TAKEAWAYS THAT STICK. Finish with concrete takeaways: short, memorable rules of thumb the learner can recall without the screen.
- BE CONCRETE. Every step includes a tiny runnable Python snippet (1-6 lines) demonstrating exactly that step's idea.
- TONE: encouraging, playful, zero jargon without explanation, absolutely no emojis anywhere.
- For Django/DRF chapters, code may be illustrative (with comments showing the terminal commands or file names); for Python chapters, code must actually run.

You always reply with ONLY valid JSON matching the schema given in the user prompt. No markdown fences, no commentary.`;

interface GenStep {
  title: string;
  body: string;
  code: string;
  why: string;
}

interface SyntaxPartJson {
  token?: string;
  meaning?: string;
  placeholder?: boolean;
}

interface GeminiLevelJson {
  title?: string;
  storyKid?: string;
  mission?: string;
  analogy10yo?: string;
  exampleCode?: string;
  exampleWalkthrough?: string[];
  syntaxPattern?: string;
  syntaxParts?: SyntaxPartJson[];
  starterCode?: string;
  steps?: GenStep[];
  checkQuestion?: string;
  checkAnswer?: string;
  takeaways?: string[];
  hints?: string[];
  rubricForGemini?: string;
}

function clampStr(v: unknown, fallback: string, max: number): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > 0 ? s.slice(0, max) : fallback;
}

function sanitizeSteps(raw: unknown, fallbackConcept: string): GenStep[] {
  const steps: GenStep[] = [];
  if (Array.isArray(raw)) {
    for (const item of raw.slice(0, 6)) {
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      steps.push({
        title: clampStr(o.title, "Step", 120),
        body: clampStr(o.body, "", 600),
        code: clampStr(o.code, "# try it", 800),
        why: clampStr(o.why, "", 300),
      });
      if (steps.length >= 5) break;
    }
  }
  if (steps.length === 0) {
    steps.push({
      title: "Let us look together",
      body: `Gemini did not return steps for this chapter, so here is the core idea: ${fallbackConcept}. Read the example code, then try the mission.`,
      code: "# example",
      why: "",
    });
  }
  return steps;
}

function topicOf(level: Level | undefined): string {
  return level?.topic ?? level?.title ?? "";
}

function syllabusContext(outline: Level): string {
  const idx = ALL_LEVELS.findIndex((l) => l.id === outline.id);
  const before = ALL_LEVELS.slice(Math.max(0, idx - 3), idx).map((l) => `${l.id}. ${topicOf(l)}`);
  const after = ALL_LEVELS.slice(idx + 1, idx + 4).map((l) => `${l.id}. ${topicOf(l)}`);
  const fullSyllabus = ALL_LEVELS.map((l) => `${l.id}. ${topicOf(l)}`).join(", ");
  return [
    `FULL SYLLABUS (101 chapters): ${fullSyllabus}`,
    `ALREADY LEARNED (last 3 chapters): ${before.join(", ") || "nothing yet"}`,
    `COMES NEXT (next 3 chapters): ${after.join(", ") || "nothing - this is the finale"}`,
  ].join("\n");
}

export function buildGenerationPrompt(outline: Level): string {
  const isPythonChapter = outline.track === "python";
  const isCapstone = outline.track === "capstone";
  const projectBrief = isCapstone
    ? "the learner now builds THEIR OWN application step by step; every example and mission must guide their own project forward"
    : `the learner has been building ONE running project chapter by chapter: DinoShop, an online shop for dinosaur toys. Examples and the mission should advance that project: ${outline.projectGoal ?? "advance the shop with this chapter's topic"}`;
  return `Forge chapter ${outline.id} "${outline.title}" of the Django Adventure game.

SYLLABUS CONTEXT:
${syllabusContext(outline)}

CHAPTER FACTS:
- Chapter number: ${outline.id} of 100
- TOPIC TO TEACH (fixed by the syllabus, never change it): ${outline.topic}
- Technical scope: ${outline.concept}
- Track/world: ${outline.track} (${outline.world})
- Running project rule: ${projectBrief}
- Code style: ${isPythonChapter ? "real Python that runs in the browser (Pyodide); keep it dependency-free" : "illustrative Django/DRF Python with file-name and terminal-command comments; it will NOT run in the browser"}
- Audience: absolute beginners of all age groups, English, no emojis
- This chapter is ${outline.boss ? "a BOSS chapter: slightly bigger challenge, epic story, final mission combines 2-3 earlier ideas" : "a normal chapter"}

TEACHING RULES:
- Teach EXACTLY "${outline.topic}" (${outline.concept}). Do not teach neighboring topics.
- Begin the story by connecting to what the learner already learned (see ALREADY LEARNED), and end the takeaways by teasing the next topic.
- Keep the story flavor light; the lesson itself must be the syllabus topic.
- The learner may be a total beginner. Every symbol in exampleCode must be explained in a step before or as it appears.
- The mission must be a small variation of exampleCode: the same shape with different values, or exampleCode plus one new line. Never ask for syntax the learner has not seen in a step or in exampleCode.
- Walk through exampleCode line by line in "exampleWalkthrough": one short bullet per line or logical group, saying what that part does and what the learner sees printed.
- Write "syntaxPattern": the topic's generic syntax skeleton on 1-4 lines using <angle_bracket_placeholders> for everything the learner replaces (like <name>, <condition>, <times>). Keep fixed Python/Django words exactly as they must be typed.
- Write "syntaxParts": 3-7 entries, one per piece of syntaxPattern. "token" repeats the piece exactly as written in the pattern; "meaning" explains it in one beginner sentence; set "placeholder" true only for pieces the learner replaces with their own values.

Return ONLY valid JSON with exactly these keys:
{
  "title": "fun, friendly chapter title (max 60 chars) that still names the topic ${outline.topic}",
  "storyKid": "2-4 sentence adventure story setting up the chapter in the world of ${outline.world}, connected to the previous chapter's topic. Simple words, real excitement.",
  "mission": "one clear practice mission: ONE small concrete coding task the learner must write themselves. It must be solvable in 5-15 lines, directly practice ${outline.topic} (${outline.concept}) and advance the running project. State the exact expected result.",
  "analogy10yo": "1-2 sentence everyday analogy for the concept (lunchboxes, treasure maps, castles, trains, rockets...)",
  "exampleCode": "a 4-12 line complete example that demonstrates the concept, using only syntax this chapter or an earlier chapter introduced",
  "exampleWalkthrough": ["one bullet per line or logical group of exampleCode, in plain words: what that part does and what it prints"],
  "syntaxPattern": "the topic's generic skeleton, e.g. 'for <name> in range(<times>):' with <placeholders> for swappable pieces",
  "syntaxParts": [
    { "token": "for", "meaning": "one beginner sentence explaining this exact piece", "placeholder": false }
  ],
  "starterCode": "the starting editor content: mostly comments guiding the learner (do NOT include the solution)",
  "steps": [
    { "title": "step name", "body": "2-4 sentences, ONE idea, ends with a short explore-question or invitation", "code": "tiny 1-6 line snippet for just this step", "why": "one sentence why this works or when to use it" }
  ],
  "checkQuestion": "ONE comprehension-check question about the mental model (not trivia)",
  "checkAnswer": "the answer in 1-3 sentences",
  "takeaways": ["3-4 short memorable rules of thumb"],
  "hints": ["3 hints, progressively more explicit, last one nearly the solution, no emojis"],
  "rubricForGemini": "grading rubric for an AI reviewer: what a correct submission must contain, lenient on whitespace/quotes, strict on the concept"
}
Rules: 3-5 steps. Steps use guided-learning tone (ask, do not dump). exampleWalkthrough must cover every line of exampleCode, and must also point out any colon or indentation in words. ${isPythonChapter ? "The mission must be runnable in plain Python in the browser." : "The mission must be answerable as Django code in the editor (not runnable in browser)."} No emojis. No markdown fences in any field.`;
}

function fallbackLevel(outline: Level): Level {
  return {
    ...outline,
    storyKid:
      "Djano could not reach the Gemini forge right now, so here is the outline quest. Try again in a moment with FORGE LESSON.",
    analogy10yo: "Even a blocked road teaches the shape of the map. Retry to forge the full lesson.",
    hints: [
      "Press FORGE LESSON again to retry generation.",
      "Check that GEMINI_API_KEY is set on the server.",
      "The chapter generates once, then stays cached.",
    ],
  };
}

export interface ForgeResult {
  level: Level;
  ok: boolean;
  error?: string;
}

export async function forgeLevel(outline: Level): Promise<ForgeResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return {
      level: fallbackLevel(outline),
      ok: false,
      error: "GEMINI_API_KEY is not set on the server. Add it to .env.local and restart the dev server.",
    };
  }

  const body = {
    contents: [{ parts: [{ text: buildGenerationPrompt(outline) }] }],
    systemInstruction: { parts: [{ text: GUIDED_LEARNING_SYSTEM }] },
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  };

  try {
    let text: string | undefined;
    let lastError = "Gemini call failed";
    outer: for (const model of MODELS) {
      // Retry transient Google-side errors (429 rate limit, 503 high demand).
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise((r) => setTimeout(r, 1500 * attempt));
        const res = await fetch(`${API_ROOT}/${model}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(60_000),
        });
        if (res.ok) {
          const json = await res.json();
          text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) lastError = "Empty Gemini reply";
          break outer;
        }
        const detail = await res.text().catch(() => "");
        lastError = `Gemini HTTP ${res.status} (${model}) ${detail.slice(0, 200)}`;
        if (res.status !== 429 && res.status !== 503) break; // try next model
      }
    }
    if (!text) throw new Error(lastError);

    let parsed: GeminiLevelJson;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = JSON.parse(text.replace(/^```json\s*|```\s*$/g, "").trim());
    }

    const isPythonChapter = outline.track === "python";
    const generated: Level = {
      ...outline,
      title: clampStr(parsed.title, outline.title, 80),
      storyKid: clampStr(parsed.storyKid, outline.storyKid, 1200),
      mission: clampStr(parsed.mission, outline.mission, 600),
      analogy10yo: clampStr(parsed.analogy10yo, outline.analogy10yo, 600),
      exampleCode: clampStr(parsed.exampleCode, outline.exampleCode, 2000),
      exampleWalkthrough: Array.isArray(parsed.exampleWalkthrough)
        ? parsed.exampleWalkthrough.slice(0, 12).map((w) => clampStr(w, "", 400)).filter(Boolean)
        : outline.exampleWalkthrough,
      syntaxPattern: clampStr(parsed.syntaxPattern, "", 400) || undefined,
      syntaxParts: Array.isArray(parsed.syntaxParts)
        ? parsed.syntaxParts
            .slice(0, 8)
            .map((p) => {
              const o = (p ?? {}) as Record<string, unknown>;
              const token = clampStr(o.token, "", 80);
              const meaning = clampStr(o.meaning, "", 400);
              if (!token || !meaning) return null;
              return { token, meaning, placeholder: Boolean(o.placeholder) };
            })
            .filter((p): p is NonNullable<typeof p> => p !== null)
        : undefined,
      starterCode: clampStr(parsed.starterCode, outline.starterCode, 2000),
      language: "python",
      runnable: isPythonChapter,
      tests: [],
      rubricForGemini: clampStr(parsed.rubricForGemini, `Level ${outline.id}: accept any reasonable attempt at ${outline.concept}.`, 1200),
      hints: Array.isArray(parsed.hints) && parsed.hints.length > 0
        ? parsed.hints.slice(0, 4).map((h) => clampStr(h, "", 300)).filter(Boolean)
        : outline.hints,
      xp: outline.xp,
      boss: outline.boss,
      preview: false,
      concept: outline.concept,
      guidedLesson: {
        objective: `Truly understand ${outline.concept}.`,
        steps: sanitizeSteps(parsed.steps, String(outline.concept)),
        checkQuestion: clampStr(parsed.checkQuestion, "Can you explain the idea in your own words?", 600),
        checkAnswer: clampStr(parsed.checkAnswer, "", 600),
        takeaways: Array.isArray(parsed.takeaways)
          ? parsed.takeaways.slice(0, 5).map((t) => clampStr(t, "", 200)).filter(Boolean)
          : [],
        generatedBy: "Gemini Guided Learning",
      },
    };

    return { level: generated, ok: true };
  } catch (err) {
    return { level: fallbackLevel(outline), ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
