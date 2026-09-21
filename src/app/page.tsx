"use client";

import Link from "next/link";
import Image from "next/image";
import { Mascot } from "@/components/game/Mascot";
import { IntroSplashHost, replayIntro } from "@/components/game/IntroSplash";
import { JourneyCard } from "@/components/game/JourneyCard";
import { useGameStore } from "@/lib/game-store";
import {
  Play,
  Map as MapIcon,
  Zap,
  Trophy,
  RotateCcw,
  Swords,
  Code2,
  BookOpen,
  Sparkles,
} from "lucide-react";

const TRACKS = [
  { color: "#f2b705", label: "0-19 Python" },
  { color: "#2f6bff", label: "8-29 Django + app" },
  { color: "#d62839", label: "30-49 DRF" },
  { color: "#1f9d55", label: "50-59 Ship it" },
  { color: "#191924", label: "80-100 Build your own" },
];

const FEATURES = [
  {
    icon: Swords,
    title: "101 LEVELS",
    desc: "Python to Django to DRF to deploy. Bosses guard every section of the path.",
  },
  {
    icon: Code2,
    title: "SPLIT DOJO",
    desc: "Story panel on the left, code editor on the right. Run, submit, get hints.",
  },
  {
    icon: BookOpen,
    title: "CRYSTAL CLEAR",
    desc: "Lunchbox variables, treasure-map URLs. No boring documentation.",
  },
  {
    icon: Sparkles,
    title: "AI COACH",
    desc: "Djano reviews your code instantly and gives smart step-by-step guidance.",
  },
];

export default function Home() {
  const { currentLevel, completed } = useGameStore();
  const hasStarted = completed.length > 0 || currentLevel > 0;
  const targetLevel = currentLevel || 0;

  return (
    <main className="halftone-hero">
      <IntroSplashHost />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="comic-btn inline-block bg-white px-3 py-1 text-xs">
              <i className="bi bi-lightning-charge-fill" aria-hidden="true" />
              <span>PYTHON | DJANGO | DRF</span>
            </span>
            <h1 className="font-comic mt-3 text-6xl leading-[0.9] sm:text-7xl">
              LEARN DJANGO
              <br />
              <span className="bg-[#191924] px-2 text-[#f2b705]">LIKE A GAME</span>
            </h1>
            <p className="mt-4 max-w-md text-lg font-bold">
              Start at <b>Level 0</b>, finish at <b>Level 100</b> able to build your own app. Story on the left,
              code on the right, and Djano the coach reviews every submission with AI.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/play/${targetLevel}`}
                className="comic-btn bg-[#d62839] px-6 py-3 font-comic text-2xl text-white"
              >
                <Play className="h-6 w-6" />
                <span>{hasStarted ? `CONTINUE LEVEL ${targetLevel}` : "START LEVEL 0"}</span>
              </Link>
              <Link href="/map" className="comic-btn bg-white px-6 py-3 font-comic text-2xl">
                <MapIcon className="h-6 w-6" />
                <span>SEE MAP</span>
              </Link>
            </div>
            <div className="mt-6 grid max-w-md grid-cols-3 gap-2 text-center text-xs font-black">
              <div className="comic-card bg-white p-2">
                <Zap className="mx-auto h-5 w-5" />
                <div className="mt-1">Python runs in browser</div>
              </div>
              <div className="comic-card bg-white p-2">
                <Image src="/logo.png" alt="AI coach" width={20} height={20} className="mx-auto h-5 w-5 object-contain" />
                <div className="mt-1">AI checks Django</div>
              </div>
              <div className="comic-card bg-white p-2">
                <Trophy className="mx-auto h-5 w-5" />
                <div className="mt-1">XP, gems, bosses</div>
              </div>
            </div>
          </div>
          <div className="comic-card bg-white p-6">
            <div className="flex items-start gap-3">
              <Mascot size="md" />
              <div className="speech-bubble flex-1 p-3 text-sm font-bold">
                Hi, I am <b>Djano</b>. I teach Django with tiny words and big battles.
                Variables are lunchboxes, URLs are treasure maps.{" "}
                {hasStarted ? `Ready for Level ${targetLevel}?` : "Ready for Level 0?"}
              </div>
            </div>
            <div className="mt-4 rounded-md border-2 border-[#191924] bg-[#191924] p-3 font-mono text-sm text-green-300">
              <div className="opacity-60"># level {targetLevel} preview</div>
              print(&quot;Hello, Django!&quot;)
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
              {TRACKS.map((t) => (
                <span
                  key={t.label}
                  className="rounded border-2 border-black px-2 py-1 text-white"
                  style={{ background: t.color }}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section aria-label="Django Adventure cinematic preview" className="mt-10">
          <div className="relative overflow-hidden rounded-lg border-2 border-[#191924] shadow-[6px_6px_0_#191924]">
            <video
              src="/hero-loop.mp4"
              className="aspect-[21/9] w-full bg-black object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/25 to-transparent p-5 sm:p-8">
              <p className="text-xs font-black tracking-[0.25em] text-[#f2b705]">FROM ZERO TO SHIPPED</p>
              <h2 className="font-comic mt-1 max-w-xl text-3xl leading-none text-white sm:text-5xl">
                100 LEVELS. ONE DJANGO APP AT THE END.
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/play/${targetLevel}`}
                  className="comic-btn bg-white px-5 py-2 font-comic text-xl"
                >
                  <Play className="h-5 w-5" />
                  <span>{hasStarted ? `CONTINUE LEVEL ${targetLevel}` : "BEGIN TRAINING"}</span>
                </Link>
                <button onClick={replayIntro} className="comic-btn bg-white/10 px-4 py-2 text-sm text-white">
                  <RotateCcw className="h-4 w-4" />
                  <span>REPLAY INTRO</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <JourneyCard />

        <div className="mt-10 grid gap-4 sm:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="comic-card bg-white p-4 dark:bg-[#191924]">
              <f.icon className="h-6 w-6 text-[#191924] dark:text-[#f2b705]" />
              <div className="font-comic mt-2 text-xl text-[#191924] dark:text-[#f2b705]">{f.title}</div>
              <div className="mt-1.5 text-sm font-bold opacity-80">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
