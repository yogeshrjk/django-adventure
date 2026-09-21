"use client";
import Image from "next/image";
import type { Level } from "@/lib/levels";
import { TRACK_COLORS, TRACK_LABEL, getChapterMascot } from "@/lib/levels";
import { Mascot, Speech } from "@/components/game/Mascot";
import { useGameStore } from "@/lib/game-store";
import {
  Lightbulb,
  Target,
  Sparkles,
  BookOpen,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ListChecks,
  Footprints,
  Gem,
  Braces,
} from "lucide-react";
import { useState } from "react";

function GuidedLessonCard({ level }: { level: Level }) {
  const lesson = level.guidedLesson!;
  const [openSteps, setOpenSteps] = useState<boolean[]>(() => lesson.steps.map((_, i) => i === 0));
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="comic-card border-2 border-[#f2b705] bg-[#f2b705]/10 p-4">
      <div className="font-comic flex items-center gap-2 text-xl text-[#d62839] dark:text-[#ff8a95]">
        <Footprints className="h-5 w-5" /> LEARNING PATH
      </div>
      <p className="mt-1 text-sm font-bold">{lesson.objective}</p>

      <ol className="mt-3 space-y-2">
        {lesson.steps.map((step, i) => {
          const open = openSteps[i];
          return (
            <li key={i} className="rounded-md border-2 border-[#191924] bg-white dark:bg-[#262633]">
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-left"
                onClick={() =>
                  setOpenSteps((arr) => arr.map((v, j) => (j === i ? !v : v)))
                }
                aria-expanded={open}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded border-2 border-[#191924] bg-[#f2b705] font-mono text-xs">
                  {i + 1}
                </span>
                <span className="flex-1 font-comic text-lg leading-none">{step.title}</span>
                {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {open && (
                <div className="border-t-2 border-dashed border-[#191924]/40 px-3 py-2">
                  <p className="text-sm font-bold">{step.body}</p>
                  <pre className="mt-2 overflow-x-auto rounded bg-[#191924] p-2 font-mono text-xs text-green-300">{step.code}</pre>
                  {step.why && <p className="mt-1 text-xs font-black opacity-70">Why: {step.why}</p>}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-3 rounded-md border-2 border-[#191924] bg-white p-3 dark:bg-[#262633]">
        <div className="font-comic flex items-center gap-2 text-lg text-[#2f6bff] dark:text-[#8fb0ff]">
          <HelpCircle className="h-5 w-5" /> CHECK YOUR UNDERSTANDING
        </div>
        <p className="mt-1 text-sm font-bold">{lesson.checkQuestion}</p>
        <button
          className="comic-btn mt-2 bg-white px-3 py-1 text-xs"
          onClick={() => setShowAnswer((s) => !s)}
        >
          <span>{showAnswer ? "Hide answer" : "Show answer"}</span>
        </button>
        {showAnswer && lesson.checkAnswer && (
          <p className="mt-2 rounded bg-[#d7f0d8] p-2 text-sm font-bold dark:bg-[#1d3a2a]">{lesson.checkAnswer}</p>
        )}
      </div>

      {lesson.takeaways.length > 0 && (
        <div className="mt-3 rounded-md border-2 border-[#191924] bg-white p-3 dark:bg-[#262633]">
          <div className="font-comic flex items-center gap-2 text-lg text-[#1f9d55] dark:text-[#7ee2a8]">
            <ListChecks className="h-5 w-5" /> TAKEAWAYS
          </div>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm font-bold">
            {lesson.takeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-2 flex items-center gap-1 text-xs font-black opacity-70">
        <Sparkles className="h-3.5 w-3.5" /> {lesson.generatedBy}
      </p>
    </div>
  );
}

export function Explainer({ level }: { level: Level }) {
  const [showHint, setShowHint] = useState(0);
  const [gemError, setGemError] = useState("");
  const { gems, spendGems } = useGameStore();
  const chapterImage = getChapterMascot(level.id);

  const handleUnlockHint = () => {
    if (showHint >= level.hints.length) return;
    if (spendGems(1)) {
      setShowHint((s) => s + 1);
      setGemError("");
    } else {
      setGemError("You need 1 Gem to unlock this hint! Clear any level to earn more gems.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Mascot size="sm" src={chapterImage} />
        <div>
          <span
            className={`rounded border-2 border-[#191924] px-2 py-0.5 text-xs font-black ${
              level.track === "python" ? "text-[#191924]" : "text-white"
            }`}
            style={{ background: TRACK_COLORS[level.track] }}
          >
            {TRACK_LABEL[level.track]} | LV {level.id}
          </span>
          <h1 className="font-comic text-3xl leading-none mt-1 sm:text-4xl">{level.topic ?? level.title}</h1>
          {level.topic && level.topic !== level.title && (
            <p className="mt-1 text-xs font-black uppercase tracking-wide opacity-60">Chapter: {level.title}</p>
          )}
        </div>
      </div>

      <Speech>
        <span className="font-comic text-lg text-[#d62839]">DJANO SAYS: </span>
        {level.storyKid}
      </Speech>

      {level.guidedLesson && <GuidedLessonCard level={level} />}

      <div className="comic-card border-dashed bg-[#f2b705]/15 p-4">
        <div className="font-comic mb-1 flex items-center gap-2 text-xl text-[#b07d00] dark:text-[#f2b705]">
          <BookOpen className="h-5 w-5" /> SIMPLE VERSION
        </div>
        <p className="font-bold">{level.analogy10yo}</p>
      </div>

      {level.syntaxPattern && (
        <div className="comic-card overflow-hidden p-4">
          <div className="font-comic mb-1 flex items-center gap-2 text-xl text-[#6d28d7] ">
            <Braces className="h-5 w-5" />SYNTAX
          </div>
          <pre className="overflow-x-auto bg-[#191924] p-4 font-mono text-sm font-bold leading-relaxed text-[#f2b705]">{level.syntaxPattern}</pre>
          {level.syntaxParts && level.syntaxParts.length > 0 && (
            <div className="border-t-2 border-[#191924] bg-white p-4 dark:bg-[#262633]">
              <ul className="space-y-2">
                {level.syntaxParts.map((part, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <code
                      className={`shrink-0 rounded border-2 border-[#191924] px-1.5 py-0.5 font-mono text-xs font-bold ${
                        part.placeholder
                          ? "bg-[#f2b705]/25 text-[#191924] dark:bg-[#f2b705]/20 dark:text-[#f2b705]"
                          : "bg-[#191924] text-[#7ee2a8]"
                      }`}
                    >
                      {part.token}
                    </code>
                    <span className="text-sm font-bold">{part.meaning}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs font-black opacity-60">
                Gold pieces are yours to replace with your own values. Green pieces are fixed Python words, type them exactly.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="comic-card overflow-hidden">
        <div className="flex items-center gap-2 border-b-2 border-[#191924] bg-[#191924] px-4 py-2 font-comic text-lg text-white">
          <Sparkles className="h-5 w-5" /> EXAMPLE TECHNIQUE
        </div>
        <pre className="overflow-x-auto bg-[#f5f3ec] p-4 font-mono text-sm font-bold dark:bg-[#14141c]">{level.exampleCode}</pre>
        {level.exampleWalkthrough && level.exampleWalkthrough.length > 0 && (
          <div className="border-t-2 border-[#191924] bg-white p-4 dark:bg-[#262633]">
            <div className="font-comic mb-1 flex items-center gap-2 text-lg text-[#6d28d9] dark:text-[#c4a2ff]">
              <ListChecks className="h-5 w-5" /> WHAT EACH LINE DOES
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm font-bold">
              {level.exampleWalkthrough.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="comic-card border-2 border-[#d62839] bg-[#d62839]/5 p-4">
        <div className="font-comic mb-1 flex items-center gap-2 text-xl text-[#d62839] dark:text-[#ff8a95]">
          <Target className="h-5 w-5" /> YOUR MISSION
        </div>
        <p className="font-bold">{level.mission}</p>
        <p className="mt-1 text-xs font-black opacity-70">
          Try it yourself in the editor. Reading the lesson is not the practice.
        </p>
      </div>

      <div className="comic-card bg-[#2f6bff]/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-comic flex items-center gap-2 text-xl text-[#2f6bff] dark:text-[#8fb0ff]">
            <Lightbulb className="h-5 w-5" /> STUCK? HINTS
          </div>
          {showHint < level.hints.length ? (
            <button
              className="comic-btn bg-white px-3 py-1 text-xs dark:bg-[#262633]"
              onClick={handleUnlockHint}
              title="Unlock a hint with 1 Gem"
            >
              <Gem className="h-3.5 w-3.5 text-[#2f6bff]" />
              <span>Unlock Hint {showHint + 1}/{level.hints.length} (1 Gem)</span>
            </button>
          ) : (
            <span className="text-xs font-black text-[#1f9d55]">
              All hints unlocked ({level.hints.length}/{level.hints.length})
            </span>
          )}
        </div>

        {gemError && (
          <p className="mt-2 text-xs font-bold text-[#d62839] dark:text-[#f2b705]">{gemError}</p>
        )}

        <ul className="mt-2 space-y-1 pl-1 text-sm font-bold">
          {level.hints.slice(0, showHint).map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#f2b705]" />
              <span>{h}</span>
            </li>
          ))}
          {showHint === 0 && (
            <li className="flex items-start gap-2 opacity-60">
              <Image
                src={chapterImage}
                alt="Djano"
                width={16}
                height={16}
                className="mt-0.5 h-4 w-4 shrink-0 object-contain"
              />
              <span>Use 1 Gem to reveal a step-by-step hint from Djano.</span>
            </li>
          )}
        </ul>
      </div>

      <div className="flex items-center gap-2 text-xs font-black opacity-70">
        <Zap className="h-4 w-4" />
        <span>
          Win {level.xp} XP plus gems | {level.runnable ? "Runs live in browser" : "Checked by AI"}
        </span>
      </div>
    </div>
  );
}
