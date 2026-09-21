"use client";

// Authentication & cloud synchronization client hook
import { useEffect, useState, useCallback } from "react";
import { useGameStore } from "@/lib/game-store";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  xp: number;
  gems: number;
  streak: number;
  completedLevels: number[];
  currentLevel: number;
  updatedAt?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMongoConfigured, setIsMongoConfigured] = useState(false);
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsMongoConfigured(Boolean(data.isMongoConfigured));
        setIsGoogleConfigured(Boolean(data.isGoogleConfigured));

        // If user logged in and has cloud data, sync to local game store
        if (data.user) {
          const cloud = data.user;
          const { completed: localCompleted, xp: localXp, currentLevel: localLevel } = useGameStore.getState();

          // Merge local and cloud progress (keep highest)
          const mergedCompleted = Array.from(
            new Set([...localCompleted, ...(cloud.completedLevels || [])])
          );
          const mergedXp = Math.max(localXp, cloud.xp || 0);
          const mergedLevel = Math.max(localLevel, cloud.currentLevel || 0);

          useGameStore.setState({
            completed: mergedCompleted,
            xp: mergedXp,
            gems: Math.max(useGameStore.getState().gems, cloud.gems || 0),
            streak: Math.max(useGameStore.getState().streak, cloud.streak || 1),
            currentLevel: mergedLevel,
          });

          // Sync merged progress back to cloud
          syncToCloud();
        }
      }
    } catch (err) {
      console.error("Failed to load auth user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const syncToCloud = useCallback(async () => {
    if (syncing) return;
    try {
      setSyncing(true);
      const state = useGameStore.getState();
      const res = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xp: state.xp,
          gems: state.gems,
          streak: state.streak,
          completed: state.completed,
          currentLevel: state.currentLevel,
        }),
      });
      if (res.ok) {
        setLastSync(new Date());
      }
    } catch (err) {
      console.error("Cloud sync failed:", err);
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const loginWithGoogle = (redirectPath = "/") => {
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectPath)}`;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Reset game store progress and local storage
      useGameStore.getState().resetProgress();
      try {
        localStorage.removeItem("django-adventure-save");
        localStorage.removeItem("da-guest-notice-dismissed-progress");
      } catch {
        /* ignore */
      }
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return {
    user,
    loading,
    authenticated: Boolean(user),
    isMongoConfigured,
    isGoogleConfigured,
    syncing,
    lastSync,
    loginWithGoogle,
    logout,
    syncToCloud,
    refreshUser: fetchUser,
  };
}
