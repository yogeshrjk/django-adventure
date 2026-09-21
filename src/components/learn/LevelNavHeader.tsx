"use client";

import Link from "next/link";
import { useGameStore } from "@/lib/game-store";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function LevelNavHeader({ levelId }: { levelId: number }) {
  const { completed, currentLevel } = useGameStore();

  // Next level is unlocked only if current level has been completed or player has already progressed past it
  const isNextUnlocked = levelId < currentLevel || completed.includes(levelId);

  return (
    <div className="sticky top-14 sm:top-16 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 mb-3.5 flex items-center justify-between border-b-2 border-[#191924] bg-[#f5f3ec]/95 backdrop-blur shadow-[0_3px_0_rgba(25,25,36,0.1)] dark:border-black dark:bg-[#14141c]/95">
      <div className="flex items-center gap-2">
        {levelId > 0 ? (
          <Link href={`/play/${levelId - 1}`} className="comic-btn bg-white px-3.5 py-1 text-sm dark:bg-[#262633]" title="Previous Level">
            <ArrowLeft className="h-4 w-4" />
            <span>PREV</span>
          </Link>
        ) : (
          <span className="w-16" /> // Spacer for alignment
        )}
      </div>

      <span className="rounded border-2 border-black bg-[#191924] px-3.5 py-1 text-xs sm:text-sm font-black text-[#f2b705] shadow-[2px_2px_0_#000]">
        LEVEL {levelId} / 100
      </span>

      <div className="flex items-center gap-2">
        {isNextUnlocked && levelId < 100 ? (
          <Link href={`/play/${levelId + 1}`} className="comic-btn bg-[#d62839] px-3.5 py-1 text-sm text-white" title="Next Level">
            <span>NEXT</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="w-16" /> // Spacer for alignment
        )}
      </div>
    </div>
  );
}
