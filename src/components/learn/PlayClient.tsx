"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Level } from "@/lib/levels";
import { getChapterMascot } from "@/lib/levels";
import { fetchLevel } from "@/lib/fetch-level";
import { Explainer } from "@/components/learn/Explainer";
import { CodeEditorPanel } from "@/components/learn/CodeEditorPanel";
import { SnakeGame } from "@/components/game/SnakeGame";
import { Play, Loader2, AlertTriangle, RefreshCw, Sparkles, Gamepad2 } from "lucide-react";

function ForgeError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="comic-card bg-[#f6d4da] p-5">
      <div className="font-comic flex items-center gap-2 text-2xl text-[#d62839]">
        <AlertTriangle className="h-6 w-6" />
        <span>THE FORGE IS COLD</span>
      </div>
      <p className="mt-2 font-bold">{message}</p>
      <button onClick={onRetry} className="comic-btn mt-3 bg-[#d62839] px-4 py-2 text-sm text-white">
        <RefreshCw className="h-4 w-4" />
        <span>TRY AGAIN</span>
      </button>
    </div>
  );
}

function ForgeNow({ onForge, levelId }: { onForge: () => void; levelId?: number }) {
  const chapterImage = getChapterMascot(levelId);
  return (
    <div className="comic-card bg-white p-5">
      <div className="font-comic flex items-center gap-2 text-2xl">
        <Image src={chapterImage} alt="Djano" width={24} height={24} className="h-6 w-6 object-contain" />
        <span>CHAPTER NOT FORGED YET</span>
      </div>
      <p className="mt-2 text-sm font-bold opacity-80">
        Press the button to let AI Guided Learning build this chapter while you play the Python Snake arcade:
        small steps, a check question, then your mission.
      </p>
      <button onClick={onForge} className="comic-btn mt-3 bg-[#d62839] px-5 py-2 text-white">
        <Play className="h-4 w-4" /> <span>FORGE LESSON & PLAY SNAKE</span>
      </button>
    </div>
  );
}

/** Inner component mounted with key=level.id so chapter changes reset state. */
function PlayInner({ level: initialLevel }: { level: Level }) {
  const isOutline = !!initialLevel.preview && !initialLevel.guidedLesson;
  const [level, setLevel] = useState<Level>(initialLevel);
  const [forging, setForging] = useState(isOutline);
  const [userPlayingSnake, setUserPlayingSnake] = useState(isOutline);
  const [error, setError] = useState("");
  const [wasCached, setWasCached] = useState(false);
  const [regenMode, setRegenMode] = useState(false);

  // Autoforge outline chapters on visit. setStates happen after await (async
  // callback), never synchronously in the effect body.
  useEffect(() => {
    if (!isOutline) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchLevel(initialLevel.id);
        if (cancelled) return;
        setLevel(data.level);
        setWasCached(data.cached);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setForging(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOutline, initialLevel.id]);

  // Automatically pre-forge the NEXT chapter in the background so the player never has to wait
  useEffect(() => {
    if (forging || initialLevel.id >= 100) return;

    const nextId = initialLevel.id + 1;
    const timer = window.setTimeout(() => {
      // Silently pre-forge next level with Gemini and cache on server
      fetchLevel(nextId).catch(() => undefined);
    }, 2000);

    return () => clearTimeout(timer);
  }, [forging, initialLevel.id]);

  const forge = useCallback(async () => {
    setForging(true);
    setUserPlayingSnake(true);
    setError("");
    try {
      const data = await fetchLevel(initialLevel.id);
      setLevel(data.level);
      setWasCached(data.cached);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setForging(false);
    }
  }, [initialLevel.id]);

  const refresh = useCallback(async () => {
    setRegenMode(true);
    setError("");
    try {
      const del = await fetch(`/api/level/${initialLevel.id}`, { method: "DELETE" });
      if (!del.ok) throw new Error("Could not clear the cached chapter");
      const data = await fetchLevel(initialLevel.id);
      setLevel(data.level);
      setWasCached(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRegenMode(false);
    }
  }, [initialLevel.id]);

  const needForge = isOutline && !level.guidedLesson;
  const isForgeReady = !forging && (Boolean(level.guidedLesson) || !level.preview);

  return (
    <div className="grid gap-4 lg:grid-cols-[45%_55%] lg:items-start">
      <div className="comic-card bg-white/70 p-4 backdrop-blur">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-black">
          {wasCached && !needForge && (
            <span className="inline-flex items-center gap-1 rounded border-2 border-[#191924] bg-white px-2 py-0.5 opacity-70">
              <Image src="/logo.png" alt="Djano" width={14} height={14} className="h-3.5 w-3.5 object-contain" /> GENERATED + CACHED
              <button
                className="ml-1 inline-flex items-center gap-0.5 underline disabled:opacity-50"
                onClick={refresh}
                disabled={regenMode}
                title="Regenerate this chapter with AI (discards the cached version)"
              >
                <RefreshCw className={`h-3 w-3 ${regenMode ? "animate-spin" : ""}`} /> REGENERATE
              </button>
            </span>
          )}
          {!userPlayingSnake && (
            <button
              onClick={() => setUserPlayingSnake(true)}
              className="ml-auto inline-flex items-center gap-1 rounded border border-[#191924] bg-white px-2 py-0.5 text-[11px] font-bold opacity-75 hover:opacity-100 transition dark:bg-[#262633]"
              title="Play Python Snake Arcade"
            >
              <Gamepad2 className="h-3.5 w-3.5 text-[#1f9d55]" />
              <span>SNAKE ARCADE</span>
            </button>
          )}
        </div>
        <Explainer level={level} />
      </div>

      <div className="lg:sticky lg:top-[120px] self-start">
        {error ? (
          <ForgeError message={error} onRetry={forge} />
        ) : userPlayingSnake || forging ? (
          <SnakeGame
            levelId={level.id}
            isForgeReady={isForgeReady}
            onStartChapter={() => setUserPlayingSnake(false)}
          />
        ) : needForge ? (
          <ForgeNow onForge={forge} levelId={level.id} />
        ) : (
          <CodeEditorPanel key={level.id} level={level} />
        )}
      </div>
    </div>
  );
}

export function PlayClient({ level }: { level: Level }) {
  // key=level.id remounts PlayInner per chapter: all state resets naturally.
  return <PlayInner key={level.id} level={level} />;
}
