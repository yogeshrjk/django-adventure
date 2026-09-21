"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGameStore } from "@/lib/game-store";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth-client";
import {
  Flame,
  Gem,
  Star,
  Sun,
  Moon,
  Menu,
  X,
  MapPin,
  Home,
  Play,
  Swords,
  Compass,
  LogIn,
  LogOut,
  Cloud,
  Settings,
  CheckCircle2,
} from "lucide-react";
import gsap from "gsap";

const PILL =
  "flex items-center gap-1 rounded border-2 border-[#191924] bg-white px-2 py-0.5 dark:border-black dark:bg-[#262633]";

export function TopHud() {
  const pathname = usePathname();
  const { xp, gems, streak, currentLevel } = useGameStore();
  const { dark, toggle } = useTheme();
  const { user, authenticated, loginWithGoogle, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Animate mobile menu with GSAP
  useEffect(() => {
    if (mobileMenuOpen && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -14, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b-2 border-[#191924] bg-[#f5f3ec]/95 backdrop-blur dark:border-black dark:bg-[#14141c]/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:gap-4">
        {/* Brand & Desktop Map Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
            <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center">
              <Image
                src="/logo.png"
                alt="Django Adventure Logo"
                width={36}
                height={36}
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
                priority
              />
            </span>
            <span className="font-comic text-xl sm:text-2xl tracking-wide">
              DJANGO <span className="hidden sm:inline">ADVENTURE</span>
            </span>
          </Link>

          <Link
            href="/map"
            className="comic-btn hidden bg-white px-3 py-1 text-sm dark:bg-[#262633] md:inline-flex"
          >
            <i className="bi bi-map-fill" aria-hidden="true" />
            <span>Map</span>
          </Link>
        </div>

        {/* Desktop Stats & Controls (md and up) */}
        <div className="hidden md:flex items-center gap-2 text-sm font-black">
          <span className={PILL}>
            <Star className="h-4 w-4 fill-[#f2b705] text-[#f2b705]" /> {xp} XP
          </span>
          <span className={PILL} title="Gems: Use to unlock hints">
            <Gem className="h-4 w-4 text-[#2f6bff]" /> {gems} Gems
          </span>
          <span className={PILL}>
            <Flame className="h-4 w-4 fill-[#e07b39] text-[#e07b39]" /> {streak}
          </span>
          <span className="rounded border-2 border-[#191924] bg-[#d62839] px-2 py-0.5 text-white dark:border-black">
            LV {currentLevel}
          </span>

          {/* User Auth Profile & Logout / Sign In Button */}
          {authenticated && user ? (
            <div className="flex items-center gap-1.5">
              <Link
                href="/settings"
                className="flex items-center gap-1.5 rounded border-2 border-[#191924] bg-white px-2 py-0.5 transition hover:bg-gray-50 dark:border-black dark:bg-[#262633]"
                title={`Logged in as ${user.name}`}
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#2f6bff] text-[10px] font-black text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="font-comic text-base tracking-wide max-w-[120px] truncate text-[#191924] dark:text-[#f2b705]">
                  {user.name}
                </span>
              </Link>
              <button
                onClick={logout}
                className="comic-btn bg-white px-2 py-1 text-xs text-[#d62839] dark:bg-[#262633]"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="comic-btn bg-white px-2.5 py-1 text-xs dark:bg-[#262633]"
              title="Sign in to backup progress to the cloud"
            >
              <LogIn className="h-3.5 w-3.5 text-[#2f6bff]" />
              <span>Sign In</span>
            </Link>
          )}

          <button
            onClick={toggle}
            className="comic-btn bg-white px-2 py-1 dark:bg-[#262633]"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={dark}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Header Controls: Clean Theme Toggle & Menu (Stats & Username in Drawer) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggle}
            className="comic-btn bg-white p-2 dark:bg-[#262633]"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="comic-btn bg-[#191924] p-2 text-white dark:bg-white dark:text-[#191924]"
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Level Completion Progress Bar */}
      <div className="h-1 w-full bg-[#191924]/10 dark:bg-white/10">
        <div
          className="h-full bg-[#d62839] transition-all duration-500"
          style={{ width: `${Math.min(100, (currentLevel / 100) * 100)}%` }}
        />
      </div>

      {/* Mobile Menu Drawer (Displays User Profile, Level, XP, Gems & Navigation) */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden border-b-2 border-[#191924] bg-[#f5f3ec] p-4 shadow-[0_6px_0_rgba(25,25,36,0.15)] dark:border-black dark:bg-[#181824]"
        >
          {/* User Status / Login Banner in Mobile Drawer */}
          {authenticated && user ? (
            <div className="mb-3 flex items-center justify-between rounded-md border-2 border-[#191924] bg-white p-3 dark:border-black dark:bg-[#262633]">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#191924] bg-[#2f6bff] font-comic text-base font-bold text-white shadow-[1px_1px_0_#191924]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="font-comic text-lg leading-none text-[#191924] dark:text-white">
                  {user.name}
                </div>
              </div>
              <button
                onClick={logout}
                className="comic-btn bg-white px-2.5 py-1 text-xs text-[#d62839] dark:bg-[#1c1c28]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="mb-3">
              <Link
                href="/signin"
                className="comic-btn w-full justify-center bg-white py-2.5 font-comic text-base text-[#191924] dark:bg-[#262633] dark:text-white"
              >
                <LogIn className="h-4 w-4 text-[#2f6bff]" />
                <span>SIGN IN / CREATE ACCOUNT</span>
              </Link>
            </div>
          )}

          {/* Full Mobile Player Stats Grid (XP, Gems, Level, Streak) */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-black">
            <div className="rounded-md border-2 border-[#191924] bg-white p-2 dark:border-black dark:bg-[#262633]">
              <Star className="mx-auto h-4 w-4 fill-[#f2b705] text-[#f2b705]" />
              <div className="mt-1">{xp} XP</div>
            </div>
            <div className="rounded-md border-2 border-[#191924] bg-white p-2 dark:border-black dark:bg-[#262633]">
              <Gem className="mx-auto h-4 w-4 text-[#2f6bff]" />
              <div className="mt-1">{gems} Gems</div>
            </div>
            <div className="rounded-md border-2 border-[#191924] bg-white p-2 dark:border-black dark:bg-[#262633]">
              <span className="inline-block rounded bg-[#d62839] px-1 text-[10px] text-white">LV</span>
              <div className="mt-1">Level {currentLevel}</div>
            </div>
            <div className="rounded-md border-2 border-[#191924] bg-white p-2 dark:border-black dark:bg-[#262633]">
              <Flame className="mx-auto h-4 w-4 fill-[#e07b39] text-[#e07b39]" />
              <div className="mt-1">{streak} Streak</div>
            </div>
          </div>

          {/* Direct Resume Quest Button */}
          <div className="mt-3">
            <Link
              href={`/play/${currentLevel}`}
              className="comic-btn w-full justify-center bg-[#d62839] py-2.5 text-center font-comic text-lg text-white"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>RESUME QUEST: LEVEL {currentLevel}</span>
            </Link>
          </div>

          {/* Navigation Links Grid */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-black">
            <Link
              href="/"
              className={`flex items-center gap-2 rounded-md border-2 border-[#191924] p-2.5 transition dark:border-black ${
                pathname === "/"
                  ? "bg-[#191924] text-white dark:bg-white dark:text-[#191924]"
                  : "bg-white dark:bg-[#262633]"
              }`}
            >
              <Home className="h-4 w-4 text-[#f2b705]" />
              <span>HOME</span>
            </Link>

            <Link
              href="/map"
              className={`flex items-center gap-2 rounded-md border-2 border-[#191924] p-2.5 transition dark:border-black ${
                pathname === "/map"
                  ? "bg-[#191924] text-white dark:bg-white dark:text-[#191924]"
                  : "bg-white dark:bg-[#262633]"
              }`}
            >
              <Compass className="h-4 w-4 text-[#2f6bff]" />
              <span>MAP (0-100)</span>
            </Link>

            <Link
              href="/settings"
              className={`col-span-2 flex items-center justify-between rounded-md border-2 border-[#191924] p-2.5 transition dark:border-black ${
                pathname === "/settings"
                  ? "bg-[#191924] text-white dark:bg-white dark:text-[#191924]"
                  : "bg-white dark:bg-[#262633]"
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-[#e07b39]" />
                <span>SETTINGS & BACKUP</span>
              </span>
              <span className="text-xs opacity-60">CLOUD & BACKUP</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
