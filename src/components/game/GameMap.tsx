"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ALL_LEVELS } from "@/content/levels";
import type { Level, LevelTrack } from "@/lib/levels";
import { TRACK_COLORS, TRACK_LABEL, getChapterMascot } from "@/lib/levels";
import { useGameStore } from "@/lib/game-store";
import { fetchLevel } from "@/lib/fetch-level";
import {
  useGsapReveal,
  gsapFocusHighlight,
  gsapNodeHover,
  gsapNodeUnhover,
  gsapCelebrate,
} from "@/lib/gsap-helpers";
import {
  Lock,
  Star,
  Swords,
  Trophy,
  Navigation,
  Compass,
  Search,
  Sparkles,
  X,
  Play,
  Flame,
  Gem,
  CheckCircle2,
  Filter,
} from "lucide-react";
import gsap from "gsap";

type FilterType = "all" | "current" | "bosses" | "cleared";

export function GameMap() {
  const { completed, currentLevel, xp, gems } = useGameStore();
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [previewLevel, setPreviewLevel] = useState<Level | null>(null);

  const listRef = useGsapReveal<HTMLDivElement>();
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Group levels by world
  const worlds = useMemo(() => {
    const map = new Map<string, { track: LevelTrack; levels: Level[] }>();
    ALL_LEVELS.forEach((lvl) => {
      if (!map.has(lvl.world)) {
        map.set(lvl.world, { track: lvl.track, levels: [] });
      }
      map.get(lvl.world)!.levels.push(lvl);
    });
    return Array.from(map.entries()).map(([worldName, data]) => ({
      name: worldName,
      track: data.track,
      levels: data.levels,
    }));
  }, []);

  // Filtered levels based on search and tab filter
  const filteredLevels = useMemo(() => {
    return ALL_LEVELS.filter((lvl) => {
      const done = completed.includes(lvl.id);
      const isCurrent = lvl.id === currentLevel && !done;

      if (filter === "bosses" && !lvl.boss) return false;
      if (filter === "cleared" && !done) return false;
      if (filter === "current" && !isCurrent && !done) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          lvl.topic?.toLowerCase().includes(q) ||
          lvl.title.toLowerCase().includes(q) ||
          lvl.world.toLowerCase().includes(q) ||
          (lvl.concept && lvl.concept.toLowerCase().includes(q)) ||
          String(lvl.id) === q
        );
      }
      return true;
    });
  }, [completed, currentLevel, filter, search]);

  const totalLevels = ALL_LEVELS.length;
  const clearedCount = completed.length;
  const progressPercent = Math.min(100, Math.round((clearedCount / totalLevels) * 100));

  // Jump smoothly to the current level node
  const handleJumpToCurrent = () => {
    const el = document.getElementById(`map-node-${currentLevel}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      gsapFocusHighlight(el);
    }
  };

  // Jump to a world section
  const handleJumpToWorld = (worldName: string) => {
    const el = document.getElementById(`world-zone-${worldName.replace(/\s+/g, "-").toLowerCase()}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      gsapFocusHighlight(el);
    }
  };

  // Level preview modal animation
  useEffect(() => {
    if (previewLevel && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.8)" }
      );
    }
  }, [previewLevel]);

  // Silently pre-forge current and next level on map visit so they are ready ahead of time
  useEffect(() => {
    if (currentLevel >= 10 && currentLevel <= 100) {
      fetchLevel(currentLevel).catch(() => undefined);
      if (currentLevel < 100) {
        const timer = setTimeout(() => fetchLevel(currentLevel + 1).catch(() => undefined), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentLevel]);

  const handleCardClick = (e: React.MouseEvent<HTMLElement>, lvl: Level, locked: boolean, done: boolean) => {
    if (locked) {
      e.preventDefault();
      gsapFocusHighlight(e.currentTarget);
      return;
    }
    if (done) {
      gsapCelebrate(e.currentTarget);
    }
    setPreviewLevel(lvl);
  };

  return (
    <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
      {/* Top Hero Command Deck */}
      <div className="comic-card mb-6 overflow-hidden bg-[#191924] p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded border border-[#f2b705] bg-[#f2b705]/20 px-2.5 py-0.5 text-xs font-black text-[#f2b705]">
              <Compass className="h-3.5 w-3.5" /> 101-CHAPTER ROADMAP
            </span>
            <h1 className="font-comic mt-2 text-3xl sm:text-4xl tracking-wide">
              DJANGO ADVENTURE MAP
            </h1>
            <p className="mt-1 max-w-lg text-xs sm:text-sm font-bold text-white/75">
              Traverse 8 worlds from Python basics to shipping full-stack Django and DRF apps.
            </p>
          </div>

          <button
            onClick={handleJumpToCurrent}
            className="comic-btn bg-[#d62839] px-4 py-2 text-sm text-white transition-transform active:scale-95"
            title="Locate your current active quest"
          >
            <Navigation className="h-4 w-4 animate-spin-slow" />
            <span>FOCUS CURRENT: LV {currentLevel}</span>
          </button>
        </div>

        {/* Live Progress Bar */}
        <div className="mt-5 rounded-lg border-2 border-black bg-black/40 p-3">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1 text-[#f2b705]">
              <Trophy className="h-4 w-4" /> {clearedCount} / {totalLevels} CLEARED ({progressPercent}%)
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#f2b705]">
                <Star className="h-3.5 w-3.5 fill-[#f2b705]" /> {xp} XP
              </span>
              <span className="flex items-center gap-1 text-[#2f6bff]">
                <Gem className="h-3.5 w-3.5" /> {gems}
              </span>
            </div>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full border border-black bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f2b705] via-[#2f6bff] to-[#1f9d55] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Biome Quick-Travel Navigator */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-3">
          <span className="text-xs font-black tracking-wider text-white/60 mr-1">BIOMES:</span>
          {worlds.map((w) => {
            const worldCleared = w.levels.filter((l) => completed.includes(l.id)).length;
            const isAllDone = worldCleared === w.levels.length;
            return (
              <button
                key={w.name}
                onClick={() => handleJumpToWorld(w.name)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold text-white transition hover:bg-white/20 hover:scale-105 active:scale-95"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: TRACK_COLORS[w.track] }}
                />
                <span>{w.name}</span>
                <span className="opacity-60 text-[10px] font-mono">
                  {worldCleared}/{w.levels.length}
                </span>
                {isAllDone && <CheckCircle2 className="h-3 w-3 text-green-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="sticky top-16 z-30 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-[#191924] bg-[#f5f3ec]/95 p-2 backdrop-blur shadow-[3px_3px_0_#191924] dark:border-black dark:bg-[#14141c]/95">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2 text-xs font-black opacity-60 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> FILTER:
          </span>
          {(
            [
              { id: "all", label: "ALL" },
              { id: "current", label: "ACTIVE & DONE" },
              { id: "bosses", label: "BOSSES" },
              { id: "cleared", label: "CLEARED" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`rounded-md border-2 border-[#191924] px-3 py-1 text-xs font-black transition ${
                filter === t.id
                  ? "bg-[#191924] text-[#f2b705] shadow-[2px_2px_0_#191924] dark:bg-white dark:text-[#191924]"
                  : "bg-white text-[#191924] hover:bg-gray-100 dark:bg-[#262633] dark:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Search level or concept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border-2 border-[#191924] bg-white py-1 pl-8 pr-7 text-xs font-bold dark:border-black dark:bg-[#262633]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Map Nodes Stream */}
      <div ref={listRef} className="relative flex flex-col items-center gap-8 py-4">
        {worlds.map((w) => {
          // Check if any level in this world is in the filtered set
          const worldLevels = w.levels.filter((lvl) => filteredLevels.some((f) => f.id === lvl.id));
          if (worldLevels.length === 0) return null;

          const worldCleared = w.levels.filter((l) => completed.includes(l.id)).length;
          const isWorldDone = worldCleared === w.levels.length;

          return (
            <div
              key={w.name}
              id={`world-zone-${w.name.replace(/\s+/g, "-").toLowerCase()}`}
              className="w-full flex flex-col items-center gap-4"
            >
              {/* Biome Zone Header Banner */}
              <div
                className="w-full max-w-lg rounded-lg border-2 border-[#191924] p-3 shadow-[4px_4px_0_#191924] dark:border-black"
                style={{
                  background: isWorldDone
                    ? "#d7f0d8"
                    : `${TRACK_COLORS[w.track]}15`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black"
                      style={{ background: TRACK_COLORS[w.track] }}
                    />
                    <span className="font-comic text-xl leading-none text-[#191924] dark:text-white">
                      {w.name.toUpperCase()}
                    </span>
                    <span
                      className="rounded border border-[#191924] px-1.5 py-0.2 text-[10px] font-black uppercase"
                      style={{
                        background: TRACK_COLORS[w.track],
                        color: w.track === "python" ? "#191924" : "#ffffff",
                      }}
                    >
                      {TRACK_LABEL[w.track]}
                    </span>
                  </div>
                  <span className="rounded-full border border-black bg-white px-2 py-0.5 text-xs font-black dark:bg-[#262633]">
                    {worldCleared} / {w.levels.length} Cleared
                  </span>
                </div>
              </div>

              {/* Levels in this world */}
              <div className="relative flex flex-col items-center gap-5 w-full">
                {worldLevels.map((lvl) => {
                  const done = completed.includes(lvl.id);
                  const current = lvl.id === currentLevel && !done;
                  const locked = lvl.id > currentLevel && !done;
                  const offset = Math.sin(lvl.id / 2.3) * 65;
                  const chapterImg = getChapterMascot(lvl.id);

                  return (
                    <div
                      key={lvl.id}
                      id={`map-node-${lvl.id}`}
                      data-map-node
                      style={{ marginLeft: `${offset}px` }}
                      className="relative transition-all duration-200"
                    >
                      {/* Level Node Card */}
                      <button
                        onClick={(e) => handleCardClick(e, lvl, locked, done)}
                        onMouseEnter={(e) => !locked && gsapNodeHover(e.currentTarget)}
                        onMouseLeave={(e) => !locked && gsapNodeUnhover(e.currentTarget)}
                        className={`group flex w-80 items-center gap-3 rounded-lg border-2 border-[#191924] p-2.5 text-left shadow-[4px_4px_0_#191924] transition-all dark:border-black dark:shadow-[4px_4px_0_#000] ${
                          done
                            ? "bg-[#d7f0d8] hover:bg-[#c9ebd0] dark:bg-[#1d3a2a] dark:hover:bg-[#234633]"
                            : current
                              ? "bg-white ring-4 ring-[#f2b705] dark:bg-[#262633]"
                              : locked
                                ? "cursor-not-allowed bg-gray-200 opacity-60 dark:bg-[#2c2c38]"
                                : "bg-white hover:bg-gray-50 dark:bg-[#262633] dark:hover:bg-[#323242]"
                        }`}
                      >
                        {/* Chapter Mascot Thumbnail */}
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
                          {locked ? (
                            <div className="grid h-10 w-10 place-items-center rounded bg-gray-400 text-white dark:bg-gray-600">
                              <Lock className="h-5 w-5" />
                            </div>
                          ) : (
                            <Image
                              src={chapterImg}
                              alt={`Chapter ${lvl.id}`}
                              width={40}
                              height={40}
                              className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
                            />
                          )}

                          {lvl.boss && (
                            <span
                              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d62839] text-white"
                              title="Boss Level"
                            >
                              <Flame className="h-2.5 w-2.5 fill-white" />
                            </span>
                          )}
                        </div>

                        {/* Title & Info: the ACTUAL syllabus topic leads the card */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-comic text-base leading-none text-[#191924] dark:text-white">
                              {lvl.id}. {lvl.topic ?? lvl.title}
                            </span>
                            {lvl.boss && (
                              <span className="rounded bg-[#d62839] px-1 text-[9px] font-black text-white">
                                BOSS
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-xs font-bold opacity-70">
                            {lvl.concept || lvl.mission}
                          </p>
                        </div>

                        {/* Status / XP Chip */}
                        <div className="shrink-0 text-right">
                          {done ? (
                            <span className="flex items-center gap-1 rounded bg-[#1f9d55] px-1.5 py-0.5 text-[10px] font-black text-white">
                              <Trophy className="h-3 w-3" /> CLEAR
                            </span>
                          ) : current ? (
                            <span className="flex items-center gap-1 rounded bg-[#f2b705] px-1.5 py-0.5 text-[10px] font-black text-[#191924]">
                              <Navigation className="h-3 w-3" /> ACTIVE
                            </span>
                          ) : locked ? (
                            <span className="text-[10px] font-black opacity-50">LOCKED</span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-[11px] font-black text-[#d62839]">
                              <Play className="h-3 w-3 fill-[#d62839]" /> GO
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Level Preview Modal */}
      {previewLevel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setPreviewLevel(null)}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="comic-card w-full max-w-lg overflow-hidden bg-white p-6 shadow-[8px_8px_0_#191924] dark:bg-[#191924]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center">
                  <Image
                    src={getChapterMascot(previewLevel.id)}
                    alt="Chapter mascot"
                    width={52}
                    height={52}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded border border-black px-2 py-0.5 text-xs font-black uppercase text-white"
                      style={{ background: TRACK_COLORS[previewLevel.track] }}
                    >
                      {previewLevel.world} | LV {previewLevel.id}
                    </span>
                    {previewLevel.boss && (
                      <span className="rounded bg-[#d62839] px-2 py-0.5 text-xs font-black text-white">
                        BOSS BATTLE
                      </span>
                    )}
                  </div>
                  <h2 className="font-comic mt-1 text-2xl leading-none">
                    {previewLevel.topic ?? previewLevel.title}
                  </h2>
                  {previewLevel.topic && previewLevel.topic !== previewLevel.title && (
                    <p className="mt-1 text-xs font-bold opacity-60">Chapter: {previewLevel.title}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setPreviewLevel(null)}
                className="rounded border-2 border-black bg-gray-100 p-1 hover:bg-gray-200 dark:bg-gray-800"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-md border-2 border-[#191924] bg-[#f5f3ec] p-3 dark:bg-[#14141c]">
              <div className="text-xs font-black uppercase tracking-wider opacity-60">MISSION:</div>
              <p className="mt-1 text-sm font-bold leading-snug">{previewLevel.mission}</p>
            </div>

            {previewLevel.analogy10yo && (
              <div className="mt-3 rounded-md border-2 border-dashed border-[#f2b705] bg-[#f2b705]/10 p-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#191924] dark:text-[#f2b705]">
                  <Sparkles className="h-3.5 w-3.5" /> SIMPLE ANALOGY:
                </div>
                <p className="mt-1 text-xs font-bold leading-snug">{previewLevel.analogy10yo}</p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-xs font-black">
              <span className="flex items-center gap-1 text-[#f2b705]">
                <Star className="h-4 w-4 fill-[#f2b705]" /> REWARD: {previewLevel.xp} XP
              </span>
              <span className="flex items-center gap-1 text-[#2f6bff]">
                <Gem className="h-4 w-4" /> +1 GEM
              </span>
            </div>

            <div className="mt-5 flex gap-2">
              <Link
                href={`/play/${previewLevel.id}`}
                className="comic-btn flex-1 justify-center bg-[#d62839] py-3 text-center font-comic text-xl text-white"
                onClick={() => setPreviewLevel(null)}
              >
                <Play className="h-5 w-5" />
                <span>{completed.includes(previewLevel.id) ? "REPLAY QUEST" : "ENTER DOJO"}</span>
              </Link>
              <button
                onClick={() => setPreviewLevel(null)}
                className="comic-btn bg-white px-4 py-3 font-comic text-sm dark:bg-[#262633]"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

