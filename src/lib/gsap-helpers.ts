"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Gentle anime hover-float loop for a mascot or badge. */
export function useGsapFloat<T extends HTMLElement>(amplitude = 10, duration = 2.2) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const tween = gsap.to(ref.current, {
      y: -amplitude,
      duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, [amplitude, duration]);
  return ref;
}

/** Snappy comic bouncing loop for player location marker / mascot pin. */
export function useGsapBounce<T extends HTMLElement>(height = 12, duration = 0.8) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const tween = gsap.to(ref.current, {
      y: -height,
      duration,
      ease: "power2.out",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, [height, duration]);
  return ref;
}

/** Reveal-on-scroll for map nodes: fades/slides in once visible. */
export function useGsapReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = el.querySelectorAll<HTMLElement>("[data-map-node]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              { opacity: 0, y: 28, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.5)" }
            );
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Highlights and pops a specific node when focused/jumped to. */
export function gsapFocusHighlight(element: HTMLElement | null) {
  if (!element) return;
  gsap.fromTo(
    element,
    { scale: 0.94, rotate: -2 },
    { scale: 1.05, rotate: 1, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 3, onComplete: () => {
      gsap.to(element, { scale: 1, rotate: 0, duration: 0.2, ease: "power1.out" });
    }}
  );
}

/** Magnetic anime hover pop for interactive map nodes. */
export function gsapNodeHover(element: HTMLElement | null) {
  if (!element) return;
  gsap.to(element, {
    y: -6,
    scale: 1.03,
    duration: 0.2,
    ease: "back.out(2)",
    overwrite: "auto",
  });
}

/** Reset hover state for interactive map nodes. */
export function gsapNodeUnhover(element: HTMLElement | null) {
  if (!element) return;
  gsap.to(element, {
    y: 0,
    scale: 1,
    duration: 0.2,
    ease: "power2.out",
    overwrite: "auto",
  });
}

/** Anime impact burst: quick scale punch plus radiating particles. */
export function gsapCelebrate(container: HTMLElement | null) {
  if (!container) return;
  gsap.fromTo(
    container,
    { scale: 0.92, rotate: -1 },
    { scale: 1, rotate: 0, duration: 0.45, ease: "back.out(2.2)" }
  );
  const burst = document.createElement("div");
  burst.setAttribute("aria-hidden", "true");
  burst.style.position = "absolute";
  burst.style.inset = "0";
  burst.style.pointerEvents = "none";
  burst.style.overflow = "visible";
  container.style.position = "relative";
  container.appendChild(burst);

  const colors = ["#d62839", "#f2b705", "#2f6bff", "#1f9d55", "#6d28d9"];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("span");
    const size = 6 + Math.random() * 8;
    p.style.position = "absolute";
    p.style.left = "50%";
    p.style.top = "50%";
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.background = colors[i % colors.length];
    p.style.border = "2px solid #191924";
    p.style.borderRadius = i % 2 === 0 ? "50%" : "2px";
    burst.appendChild(p);
    gsap.to(p, {
      x: (Math.random() - 0.5) * 360,
      y: (Math.random() - 0.5) * 300,
      rotate: Math.random() * 540,
      opacity: 0,
      duration: 0.8 + Math.random() * 0.5,
      ease: "power3.out",
      onComplete: () => p.remove(),
    });
  }
  window.setTimeout(() => burst.remove(), 1600);
}

/** Full-screen anime Party Popper confetti blast from left and right corners. */
export function gsapPartyPopper(count = 70) {
  if (typeof window === "undefined") return;

  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  container.style.overflow = "hidden";
  document.body.appendChild(container);

  const colors = [
    "#f2b705", // gold
    "#d62839", // crimson
    "#2f6bff", // royal blue
    "#1f9d55", // green
    "#6d28d9", // purple
    "#ff007f", // hot pink
    "#00f5d4", // teal
  ];

  // Spawn particles from both corners
  const origins = [
    { x: window.innerWidth * 0.08, y: window.innerHeight * 0.9 },
    { x: window.innerWidth * 0.92, y: window.innerHeight * 0.9 },
    { x: window.innerWidth * 0.5, y: window.innerHeight * 0.8 },
  ];

  origins.forEach((origin, origIdx) => {
    const particlesPerOrigin = Math.floor(count / origins.length);
    for (let i = 0; i < particlesPerOrigin; i++) {
      const p = document.createElement("div");
      const isRibbon = i % 3 === 0;
      const isCircle = i % 3 === 1;
      const w = isRibbon ? 8 + Math.random() * 6 : 8 + Math.random() * 8;
      const h = isRibbon ? 16 + Math.random() * 12 : w;

      p.style.position = "absolute";
      p.style.left = `${origin.x}px`;
      p.style.top = `${origin.y}px`;
      p.style.width = `${w}px`;
      p.style.height = `${h}px`;
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.border = "1.5px solid #191924";
      p.style.borderRadius = isCircle ? "50%" : isRibbon ? "2px" : "3px";
      p.style.willChange = "transform, opacity";
      container.appendChild(p);

      // Angle: outward from corner towards center
      const baseAngle = origIdx === 0 ? -45 : origIdx === 1 ? -135 : -90;
      const angle = (baseAngle + (Math.random() - 0.5) * 65) * (Math.PI / 180);
      const velocity = 400 + Math.random() * 500;
      const targetX = Math.cos(angle) * velocity;
      const targetY = Math.sin(angle) * velocity;

      gsap.to(p, {
        x: targetX,
        y: targetY + 350, // gravity drop
        rotation: (Math.random() - 0.5) * 1080,
        scale: Math.random() * 0.5 + 0.6,
        opacity: 0,
        duration: 1.8 + Math.random() * 1.2,
        ease: "power2.out",
        onComplete: () => p.remove(),
      });
    }
  });

  window.setTimeout(() => container.remove(), 3500);
}

/** Grand finale continuous celebration with multiple fireworks waves. */
export function gsapGrandCelebration() {
  if (typeof window === "undefined") return;

  // 4 successive waves of party poppers
  gsapPartyPopper(100);
  window.setTimeout(() => gsapPartyPopper(90), 800);
  window.setTimeout(() => gsapPartyPopper(120), 1800);
  window.setTimeout(() => gsapPartyPopper(80), 3000);
}
