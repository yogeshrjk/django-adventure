"use client";

import Link from "next/link";
import { ALL_LEVELS } from "@/content/levels";
import { TRACK_COLORS } from "@/lib/levels";
import { useGameStore } from "@/lib/game-store";
import { useAuth } from "@/lib/auth-client";
import {
  Play,
  Trophy,
  Swords,
  Lock,
  Navigation,
  Flag,
  Cloud,
  AlertCircle,
} from "lucide-react";

const MILESTONE_EVERY = 10;

export function JourneyCard() {
  const { xp, completed, currentLevel } = useGameStore();
  const { authenticated, loading } = useAuth();
  const current = ALL_LEVELS.find((l) => l.id === currentLevel) ?? ALL_LEVELS[0];
  const clearedCount = completed.length;

  // Checkpoints are the boss/milestone levels: 0, 10, 20, ... 100.
  const checkpoints = ALL_LEVELS.filter((l) => l.id % MILESTONE_EVERY === 0);
  const nextCheckpoint = checkpoints.find((c) => !completed.includes(c.id));
  const doneCheckpoints = checkpoints.filter((c) => completed.includes(c.id)).length;

  return (
    <section aria-label="Your journey" className="comic-card mt-8 bg-white p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-comic flex items-center gap-2 text-3xl">
          <Navigation className="h-7 w-7" /> YOUR JOURNEY
        </h2>
        <span
          className="rounded border-2 border-[#191924] px-2 py-0.5 text-xs font-black text-white"
          style={{ background: TRACK_COLORS[current.track] }}
        >
          {current.world}
        </span>
        <Link
          href={`/play/${current.id}`}
          className="comic-btn ml-auto bg-[#d62839] px-4 py-2 font-comic text-xl text-white"
        >
          <Play className="h-5 w-5" />
          <span>{clearedCount === 0 ? "START LEVEL 0" : `CONTINUE LEVEL ${current.id}`}</span>
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border-2 border-[#191924] bg-[#f5f3ec] p-3 text-center dark:bg-[#14141c]">
          <div className="font-comic text-3xl">LV {current.id}</div>
          <div className="text-xs font-black opacity-70">CURRENT LEVEL</div>
        </div>
        <div className="rounded-md border-2 border-[#191924] bg-[#f5f3ec] p-3 text-center dark:bg-[#14141c]">
          <div className="font-comic text-3xl">{xp}</div>
          <div className="text-xs font-black opacity-70">TOTAL XP</div>
        </div>
        <div className="rounded-md border-2 border-[#191924] bg-[#f5f3ec] p-3 text-center dark:bg-[#14141c]">
          <div className="font-comic text-3xl">
            {doneCheckpoints}/{checkpoints.length}
          </div>
          <div className="text-xs font-black opacity-70">CHECKPOINTS CLEARED</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-black opacity-70">
          <span>
            NEXT CHECKPOINT: LV {nextCheckpoint ? nextCheckpoint.id : "ALL DONE"}
            {nextCheckpoint ? ` — ${nextCheckpoint.topic ?? nextCheckpoint.title}` : ""}
          </span>
          <span>{clearedCount}/101 LEVELS</span>
        </div>
        <div className="mt-1 flex gap-1">
          {checkpoints.map((c) => {
            const done = completed.includes(c.id);
            const isNext = nextCheckpoint?.id === c.id;
            const isCurrent = c.id === current.id && !done;
            const isUnlocked = c.id <= currentLevel || done;
            const Icon = done ? Trophy : isCurrent ? Navigation : c.boss || c.id === 100 ? Swords : Flag;
            return (
              <Link
                key={c.id}
                href={`/play/${c.id}`}
                title={`LV ${c.id}: ${c.topic ?? c.title}${done ? " (cleared)" : ""}`}
                className={`flex h-10 flex-1 items-center justify-center rounded-md border-2 border-[#191924] text-xs font-black transition hover:-translate-y-0.5 ${
                  done
                    ? "bg-[#d7f0d8] dark:bg-[#1d3a2a]"
                    : isCurrent
                      ? "bg-[#f2b705]"
                      : isUnlocked
                        ? "bg-white dark:bg-[#262633]"
                        : "bg-gray-200 opacity-60 dark:bg-[#33333f]"
                }`}
                aria-label={`Level ${c.id}: ${c.topic ?? c.title}${done ? ", cleared" : isNext ? ", next checkpoint" : ""}`}
              >
                <Icon className="h-4 w-4" />
                <span className="ml-1 hidden sm:inline">{c.id}</span>
                {!isUnlocked && <Lock className="ml-0.5 h-3 w-3" />}
              </Link>
            );
          })}
        </div>
      </div>

      {!loading && !authenticated && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-md border-2 border-dashed border-[#f2b705] bg-[#f2b705]/15 p-2.5 text-xs font-black">
          <div className="flex items-center gap-1.5 text-[#191924] dark:text-[#f2b705]">
            <Cloud className="h-4 w-4 shrink-0" />
            <span>Playing as Guest: Please sign in to save your progress, or you might lose your journey!</span>
          </div>
          <Link
            href="/signin"
            className="comic-btn bg-white px-2.5 py-0.5 text-xs text-[#2f6bff] dark:bg-[#262633]"
          >
            Sign in to Save
          </Link>
        </div>
      )}
    </section>
  );
}
