"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Play, FastForward, Volume2, VolumeX, X } from "lucide-react";

const SEEN_KEY = "da-intro-seen";

export function IntroSplashHost() {
  const [visible, setVisible] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const dismiss = useCallback(() => {
    const el = overlayRef.current;
    if (!el) {
      setVisible(false);
      return;
    }
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable, dismiss anyway */
    }
    gsap.to(el, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.in",
      onComplete: () => setVisible(false),
    });
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (!seen) setVisible(true);
    const replay = () => {
      setEnded(false);
      setVisible(true);
    };
    window.addEventListener("da:replay-intro", replay);
    return () => window.removeEventListener("da:replay-intro", replay);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 34, scale: 0.97, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, dismiss]);

  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => undefined);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Django Adventure intro video"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0d15]/95 p-4 backdrop-blur-sm"
    >
      <div ref={cardRef} className="w-full max-w-4xl opacity-0">
        <div className="mb-3 flex items-center justify-between text-white">
          <span className="font-comic flex items-center gap-2 text-2xl tracking-wide">
            <i className="bi bi-play-circle-fill" aria-hidden="true" />
            DJANGO ADVENTURE
          </span>
          <button
            onClick={dismiss}
            className="comic-btn bg-white px-3 py-1 text-xs text-[#191924]"
            aria-label="Skip intro"
          >
            <X className="h-4 w-4" />
            <span>SKIP</span>
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border-2 border-white/20 shadow-[0_0_80px_rgba(214,40,57,0.35)]">
          <video
            ref={videoRef}
            src="/intro.mp4"
            className="aspect-video w-full bg-black"
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            onEnded={() => setEnded(true)}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={dismiss}
            className={`comic-btn px-6 py-2.5 font-comic text-xl text-white ${
              ended ? "bg-[#d62839]" : "bg-[#2f6bff]"
            }`}
          >
            {ended ? <Play className="h-5 w-5" /> : <FastForward className="h-5 w-5" />}
            <span>{ended ? "ENTER THE DOJO" : "SKIP TO TRAINING"}</span>
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="comic-btn bg-white/10 px-3 py-2 text-xs text-white"
            aria-label={muted ? "Unmute intro video" : "Mute intro video"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{muted ? "MUTED" : "SOUND ON"}</span>
          </button>
          <span className="ml-auto hidden text-xs font-bold text-white/50 sm:block">
            Level 0 to 100 | Python | Django | DRF
          </span>
        </div>
      </div>
    </div>
  );
}

export function replayIntro() {
  window.dispatchEvent(new CustomEvent("da:replay-intro"));
}
