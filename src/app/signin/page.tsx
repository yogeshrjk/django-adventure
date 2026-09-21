"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { useGameStore } from "@/lib/game-store";
import {
  LogIn,
  UserPlus,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  ShieldCheck,
} from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const authError = searchParams.get("auth_error");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(authError || "");
  const [success, setSuccess] = useState(false);

  const { loginWithGoogle, refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "signin" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "signin" ? { email, password } : { email, password, name };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      setSuccess(true);
      await refreshUser();

      // Sync local game-store with cloud on first sign in
      const localState = useGameStore.getState();
      await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xp: localState.xp,
          gems: localState.gems,
          streak: localState.streak,
          completed: localState.completed,
          currentLevel: localState.currentLevel,
        }),
      }).catch(() => undefined);

      window.setTimeout(() => {
        router.push(redirectPath);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comic-card mx-auto max-w-md bg-white p-6 shadow-[8px_8px_0_#191924] dark:bg-[#191924]">
      {/* Header Tabs */}
      <div className="flex border-b-2 border-[#191924] pb-3 dark:border-black">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError("");
          }}
          className={`flex-1 py-2 text-center font-comic text-xl transition ${
            mode === "signin"
              ? "border-b-4 border-[#d62839] text-[#d62839] dark:text-[#f2b705]"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <LogIn className="h-5 w-5" /> SIGN IN
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError("");
          }}
          className={`flex-1 py-2 text-center font-comic text-xl transition ${
            mode === "signup"
              ? "border-b-4 border-[#2f6bff] text-[#2f6bff]"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <UserPlus className="h-5 w-5" /> CREATE ACCOUNT
          </span>
        </button>
      </div>

      {/* Error / Success Notifications */}
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border-2 border-[#d62839] bg-[#f6d4da] p-3 text-xs font-bold text-[#d62839] dark:bg-[#3a1d22]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-md border-2 border-[#1f9d55] bg-[#d7f0d8] p-3 text-xs font-bold text-[#1f9d55] dark:bg-[#1d3a2a]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Success! Teleporting to your dojo...</span>
        </div>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        {mode === "signup" && (
          <div>
            <label className="block text-xs font-black tracking-wider opacity-70" htmlFor="name">
              YOUR HERO NAME
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DjangoNinja"
              className="mt-1 w-full rounded-md border-2 border-[#191924] bg-white px-3 py-2 text-sm font-bold dark:border-black dark:bg-[#262633]"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-black tracking-wider opacity-70" htmlFor="email">
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hero@djangoadventure.com"
            className="mt-1 w-full rounded-md border-2 border-[#191924] bg-white px-3 py-2 text-sm font-bold dark:border-black dark:bg-[#262633]"
          />
        </div>

        <div>
          <label className="block text-xs font-black tracking-wider opacity-70" htmlFor="password">
            PASSWORD
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-md border-2 border-[#191924] bg-white px-3 py-2 pr-10 text-sm font-bold dark:border-black dark:bg-[#262633]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className={`comic-btn mt-2 w-full justify-center py-2.5 font-comic text-xl text-white ${
            mode === "signin" ? "bg-[#d62839]" : "bg-[#2f6bff]"
          }`}
        >
          <span>{loading ? "SAVING..." : mode === "signin" ? "SIGN IN" : "START QUEST"}</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-[#191924]/30 dark:border-white/20" />
        </div>
        <span className="relative rounded-full border border-black/20 bg-white px-3 py-0.5 text-[11px] font-black tracking-widest text-black/60 dark:bg-[#191924] dark:text-white/60">
          OR CONNECT WITH
        </span>
      </div>

      {/* Google OAuth Option */}
      <button
        type="button"
        onClick={() => loginWithGoogle(redirectPath)}
        className="comic-btn flex w-full items-center justify-center gap-3 bg-white py-2.5 font-comic text-lg text-[#191924] shadow-[3px_3px_0_#191924] dark:bg-[#262633] dark:text-white hover:bg-gray-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>CONTINUE WITH GOOGLE</span>
      </button>

      {/* Guest / Offline Mode */}
      <div className="mt-5 border-t border-black/10 pt-4 text-center dark:border-white/10">
        <Link
          href={redirectPath}
          className="inline-flex items-center gap-1.5 text-xs font-bold opacity-75 hover:opacity-100 hover:underline"
        >
          <Gamepad2 className="h-3.5 w-3.5" />
          <span>Continue as Guest (Play offline without account)</span>
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="halftone-hero min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <span className="flex h-12 w-12 items-center justify-center">
              <Image
                src="/logo.png"
                alt="Django Adventure"
                width={48}
                height={48}
                className="h-10 w-10 object-contain"
                priority
              />
            </span>
          </Link>
          <h1 className="font-comic text-4xl leading-none tracking-wide">
            DJANGO ADVENTURE
          </h1>
          <p className="mt-1 text-xs font-bold opacity-70">
            Sign in to save your 101 levels, gems, and XP to your cloud account.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="comic-card p-6 text-center font-comic text-xl">
              LOADING DOJO...
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
