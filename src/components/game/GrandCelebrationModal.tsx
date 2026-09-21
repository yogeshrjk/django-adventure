"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGameStore } from "@/lib/game-store";
import { gsapGrandCelebration, gsapPartyPopper } from "@/lib/gsap-helpers";
import {
  Trophy,
  Star,
  Gem,
  Swords,
  Crown,
  Sparkles,
  CheckCircle2,
  X,
  Compass,
  PartyPopper,
  Flame,
} from "lucide-react";
import gsap from "gsap";

export function GrandCelebrationModal({ onClose }: { onClose: () => void }) {
  const { xp, gems, completed } = useGameStore();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const trophyRef = useRef<HTMLDivElement | null>(null);
  const sunburstRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Trigger grand fireworks
    gsapGrandCelebration();

    // Animate modal entrance
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.8)" }
      );
    }

    // Animate rotating sunburst
    if (sunburstRef.current) {
      gsap.to(sunburstRef.current, {
        rotation: 360,
        repeat: -1,
        ease: "none",
        duration: 20,
      });
    }

    // Float trophy
    if (trophyRef.current) {
      gsap.to(trophyRef.current, {
        y: -10,
        scale: 1.05,
        duration: 1.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto"
    >
      <div
        ref={modalRef}
        className="comic-card relative w-full max-w-2xl overflow-hidden bg-[#191924] p-6 text-center text-white shadow-[10px_10px_0_#000] my-8"
      >
        {/* Animated Sunburst Background */}
        <div
          ref={sunburstRef}
          className="pointer-events-none absolute -top-48 -left-48 h-[600px] w-[600px] opacity-10 bg-[radial-gradient(circle,_transparent_20%,_#f2b705_20%,_#f2b705_40%,_transparent_40%,_transparent_60%,_#f2b705_60%,_#f2b705_80%,_transparent_80%)]"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border-2 border-white/40 bg-white/10 p-1.5 text-white hover:bg-white/20 transition"
          aria-label="Close grand celebration"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#f2b705] bg-[#f2b705]/20 px-3 py-1 text-xs font-black text-[#f2b705] mb-4">
          <Crown className="h-4 w-4" />
          <span>ULTIMATE VICTORY • 100 CHAPTERS CONQUERED</span>
        </div>

        {/* Golden Trophy Hero */}
        <div ref={trophyRef} className="mx-auto flex h-24 w-24 items-center justify-center mb-3">
          <div className="relative grid h-20 w-20 place-items-center rounded-2xl border-4 border-[#f2b705] bg-gradient-to-br from-[#f2b705] to-[#d62839] text-[#191924] shadow-[0_0_35px_rgba(242,183,5,0.6)]">
            <Trophy className="h-12 w-12 text-[#191924]" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-[#f2b705] animate-pulse" />
          </div>
        </div>

        {/* Grand Title */}
        <h1 className="font-comic text-4xl sm:text-5xl leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#f2b705] via-white to-[#f2b705]">
          CONGRATULATIONS!
          <br />
          LEVEL 100 CLEARED!
        </h1>

        <p className="mt-3 text-sm sm:text-base font-bold text-white/90 max-w-md mx-auto leading-relaxed">
          You have conquered the entire Django Adventure journey from Python variables all the way to
          deploying real-world full-stack Django & DRF applications!
        </p>

        {/* Stats Recap Grid */}
        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-lg border-2 border-[#191924] bg-white/10 p-3 backdrop-blur">
            <div className="font-comic text-2xl sm:text-3xl text-[#f2b705]">{xp}</div>
            <div className="text-[11px] font-black uppercase text-white/70">Total XP Earned</div>
          </div>
          <div className="rounded-lg border-2 border-[#191924] bg-white/10 p-3 backdrop-blur">
            <div className="font-comic text-2xl sm:text-3xl text-[#2f6bff]">{gems}</div>
            <div className="text-[11px] font-black uppercase text-white/70">Gems Collected</div>
          </div>
          <div className="rounded-lg border-2 border-[#191924] bg-white/10 p-3 backdrop-blur">
            <div className="font-comic text-2xl sm:text-3xl text-[#1f9d55]">
              {completed.length}/101
            </div>
            <div className="text-[11px] font-black uppercase text-white/70">Quests Mastered</div>
          </div>
        </div>

        {/* Mastery Seal */}
        <div className="mt-5 rounded-lg border-2 border-[#f2b705] bg-[#f2b705]/10 p-3 flex items-center justify-center gap-2 text-xs font-black text-[#f2b705]">
          <CheckCircle2 className="h-4 w-4" />
          <span>DJANO MASTER ARCHITECT CERTIFIED</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => gsapPartyPopper(90)}
            className="comic-btn bg-[#f2b705] px-4 py-2.5 font-comic text-lg text-[#191924]"
          >
            <PartyPopper className="h-5 w-5" />
            <span>MORE FIREWORKS!</span>
          </button>
          <Link
            href="/map"
            className="comic-btn bg-[#d62839] px-5 py-2.5 font-comic text-lg text-white"
            onClick={onClose}
          >
            <Compass className="h-5 w-5" />
            <span>VIEW COMPLETE MAP</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
