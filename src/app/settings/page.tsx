"use client";

// Settings: cloud account, backup/restore, local data management
import { useRef, useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/game-store";
import { useAuth } from "@/lib/auth-client";
import {
  KeyRound,
  Trash2,
  Download,
  Upload,
  ArrowLeft,
  Database,
  CheckCircle2,
  Cloud,
  RefreshCw,
  LogOut,
} from "lucide-react";

const SAVE_KEY = "django-adventure-save";

export default function SettingsPage() {
  const [importError, setImportError] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { xp, gems, completed, currentLevel } = useGameStore();

  const {
    user,
    loading: authLoading,
    authenticated,
    isMongoConfigured,
    isGoogleConfigured,
    syncing,
    lastSync,
    loginWithGoogle,
    logout,
    syncToCloud,
  } = useAuth();

  function handleExport() {
    try {
      const raw = localStorage.getItem(SAVE_KEY) ?? "{}";
      const blob = new Blob([raw], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "django-adventure-progress.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* storage unavailable */
    }
  }

  function handleImportFile(file: File) {
    setImportError("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const state = parsed.state ?? parsed;
        if (!Array.isArray(state.completed) || typeof state.xp !== "number")
          throw new Error("bad file");
        localStorage.setItem(SAVE_KEY, JSON.stringify({ state, version: 0 }));
        window.location.reload();
      } catch {
        setImportError("That file is not a valid progress backup.");
      }
    };
    reader.readAsText(file);
  }

  function handleReset() {
    if (!window.confirm("Erase all XP, gems and completed levels on this device?")) return;
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      /* ignore */
    }
    window.location.reload();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/map" className="comic-btn bg-white px-3 py-1 text-sm dark:bg-[#262633]">
        <ArrowLeft className="h-4 w-4" />
        <span>BACK</span>
      </Link>

      <h1 className="font-comic mt-4 flex items-center gap-2 text-4xl">
        <KeyRound className="h-8 w-8" /> SETTINGS
      </h1>
      <p className="mt-1 text-sm font-bold opacity-70">
        Manage your cloud account and progress backups.
      </p>

      {/* Cloud Account Section */}
      <section className="comic-card mt-5 p-5 border-2 border-[#2f6bff] bg-[#2f6bff]/5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-comic flex items-center gap-2 text-2xl text-[#2f6bff]">
            <Cloud className="h-6 w-6" /> CLOUD ACCOUNT & SYNC
          </h2>
          {authenticated && (
            <span className="inline-flex items-center gap-1 rounded bg-[#1f9d55] px-2 py-0.5 text-xs font-black text-white">
              <CheckCircle2 className="h-3.5 w-3.5" /> CLOUD CONNECTED
            </span>
          )}
        </div>

        <p className="mt-1 text-sm font-bold opacity-80">
          Sign in to automatically backup and sync your levels, XP, and gems across all your devices.
        </p>

        {authLoading ? (
          <div className="mt-4 flex items-center gap-2 font-bold text-sm opacity-60">
            <RefreshCw className="h-4 w-4 animate-spin" /> Checking cloud connection...
          </div>
        ) : authenticated && user ? (
          <div className="mt-4 rounded-md border-2 border-[#191924] bg-white p-4 dark:border-black dark:bg-[#1f1f2e]">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#191924] bg-[#2f6bff] font-comic text-2xl text-white shadow-[2px_2px_0_#191924]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-comic text-lg leading-none">{user.name}</div>
                <div className="text-xs font-mono font-bold opacity-70 truncate">{user.email}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-black">
                  <span className="rounded bg-[#f2b705]/20 px-1.5 text-[#191924] dark:text-[#f2b705]">
                    {xp} XP
                  </span>
                  <span className="rounded bg-[#2f6bff]/20 px-1.5 text-[#2f6bff]">
                    {completed.length} Cleared
                  </span>
                  <span className="rounded bg-[#d62839]/20 px-1.5 text-[#d62839]">
                    Level {currentLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-black/10 pt-3 dark:border-white/10">
              <button
                onClick={syncToCloud}
                disabled={syncing}
                className="comic-btn bg-[#2f6bff] px-4 py-2 text-sm text-white"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                <span>{syncing ? "SYNCING..." : "SYNC TO CLOUD"}</span>
              </button>
              <button
                onClick={logout}
                className="comic-btn bg-white px-4 py-2 text-sm text-[#d62839] dark:bg-[#262633]"
              >
                <LogOut className="h-4 w-4" />
                <span>LOG OUT</span>
              </button>
            </div>
            {lastSync && (
              <p className="mt-2 text-xs font-mono opacity-60">
                Last cloud sync: {lastSync.toLocaleTimeString()}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={() => loginWithGoogle("/settings")}
              className="comic-btn flex items-center justify-center gap-2 bg-white px-5 py-3 font-comic text-lg text-[#191924] shadow-[4px_4px_0_#191924] dark:bg-[#262633] dark:text-white"
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
              <span>SIGN IN WITH GOOGLE</span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="rounded border border-black/20 bg-white/50 p-2 dark:bg-black/20">
                <span className="font-mono">CLOUD_DATABASE:</span>{" "}
                {isMongoConfigured ? (
                  <span className="text-[#1f9d55] font-black">Connected</span>
                ) : (
                  <span className="text-[#d62839] font-black">Not connected</span>
                )}
              </div>
              <div className="rounded border border-black/20 bg-white/50 p-2 dark:bg-black/20">
                <span className="font-mono">GOOGLE_AUTH:</span>{" "}
                {isGoogleConfigured ? (
                  <span className="text-[#1f9d55] font-black">Ready</span>
                ) : (
                  <span className="text-[#d62839] font-black">Not configured</span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Local Save & Backup Section */}
      <section className="comic-card mt-5 p-5">
        <h2 className="font-comic flex items-center gap-2 text-2xl">
          <Database className="h-6 w-6" /> LOCAL DEVICE PROGRESS
        </h2>
        <p className="mt-1 text-sm font-bold opacity-80">
          {xp} XP, {gems} gems, {completed.length} levels cleared, currently on level {currentLevel}. Stored under
          the browser key <code className="rounded bg-black/10 px-1 dark:bg-white/10">{SAVE_KEY}</code>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={handleExport} className="comic-btn bg-white px-4 py-2 text-sm dark:bg-[#262633]">
            <Download className="h-4 w-4" />
            <span>EXPORT BACKUP</span>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="comic-btn bg-white px-4 py-2 text-sm dark:bg-[#262633]"
          >
            <Upload className="h-4 w-4" />
            <span>IMPORT BACKUP</span>
          </button>
          <button onClick={handleReset} className="comic-btn bg-white px-4 py-2 text-sm dark:bg-[#262633]">
            <Trash2 className="h-4 w-4" />
            <span>RESET ALL</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
            }}
          />
        </div>
        {importError && <p className="mt-2 text-sm font-black text-[#d62839]">{importError}</p>}
      </section>
    </main>
  );
}

