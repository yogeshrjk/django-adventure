"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-client";
import { useGameStore } from "@/lib/game-store";
import { Cloud, LogIn, X, AlertTriangle, Sparkles } from "lucide-react";

const PROGRESS_DISMISS_KEY = "da-guest-notice-dismissed-progress";

export function GuestNoticeBanner() {
  const { authenticated, loading } = useAuth();
  const { completed, xp, currentLevel } = useGameStore();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Only check after auth has finished loading
    if (loading || authenticated) {
      setDismissed(true);
      return;
    }

    try {
      const raw = localStorage.getItem(PROGRESS_DISMISS_KEY);
      if (!raw) {
        setDismissed(false);
        return;
      }
      const data = JSON.parse(raw);
      const completedGained = completed.length - (data.dismissedAtCompleted ?? 0);
      const xpGained = xp - (data.dismissedAtXp ?? 0);
      const levelGained = currentLevel - (data.dismissedAtLevel ?? 0);

      // Re-prompt user once they make some progress (1+ level cleared, 1+ level advanced, or +20 XP gained)
      if (completedGained >= 1 || xpGained >= 20 || levelGained >= 1) {
        setDismissed(false);
      } else {
        setDismissed(true);
      }
    } catch {
      setDismissed(false);
    }
  }, [loading, authenticated, completed.length, xp, currentLevel]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      const data = {
        dismissedAtCompleted: completed.length,
        dismissedAtXp: xp,
        dismissedAtLevel: currentLevel,
        timestamp: Date.now(),
      };
      localStorage.setItem(PROGRESS_DISMISS_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  };

  if (loading || authenticated || dismissed) return null;

  const hasProgress = completed.length > 0 || xp > 0;

  return (
    <div
      role="status"
      className="border-b-2 border-[#191924] bg-[#f2b705] px-3 py-2 text-[#191924] shadow-sm dark:border-black transition-all"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 text-xs font-black">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#191924] text-white">
            <AlertTriangle className="h-3.5 w-3.5 text-[#f2b705]" />
          </span>
          <span className="leading-snug">
            {hasProgress ? (
              <span>
                <b>Unsaved Journey:</b> You have <u>{completed.length} cleared level{completed.length === 1 ? "" : "s"}</u> ({xp} XP) saved only on this device. Please sign in to save your progress, or you might lose your journey!
              </span>
            ) : (
              <span>
                <b>Playing as Guest:</b> Please sign in to save your progress, or you might lose your journey!
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            href="/signin"
            className="comic-btn bg-white px-2.5 py-1 text-xs text-[#191924] hover:bg-gray-100 dark:bg-[#262633] dark:text-white"
          >
            <LogIn className="h-3 w-3 text-[#2f6bff]" />
            <span>SIGN IN TO SAVE</span>
          </Link>
          <button
            onClick={handleDismiss}
            className="rounded p-1 text-[#191924] hover:bg-black/10"
            title="Dismiss until next progress milestone"
            aria-label="Dismiss guest notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
