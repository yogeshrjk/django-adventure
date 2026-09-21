"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GameState {
  xp: number;
  gems: number;
  hearts: number;
  streak: number;
  completed: number[];
  currentLevel: number;
  addXp: (n: number) => void;
  addGems: (n: number) => void;
  spendGems: (n: number) => boolean;
  completeLevel: (id: number, xp: number) => void;
  setCurrentLevel: (id: number) => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      gems: 10, // Start with 10 free gems to unlock hints
      hearts: 5,
      streak: 1,
      completed: [],
      currentLevel: 0,
      addXp: (n) => set({ xp: get().xp + n }),
      addGems: (n) => set({ gems: get().gems + n }),
      spendGems: (n) => {
        const cur = get().gems;
        if (cur >= n) {
          set({ gems: cur - n });
          return true;
        }
        return false;
      },
      completeLevel: (id, xp) => {
        const { completed, xp: cur, gems, currentLevel } = get();
        if (completed.includes(id)) {
          set({ currentLevel: Math.max(currentLevel, Math.min(id + 1, 100)) });
          return;
        }
        const perfect = xp >= 30;
        set({
          completed: [...completed, id],
          xp: cur + xp,
          gems: gems + (perfect ? 5 : 2),
          currentLevel: Math.max(currentLevel, Math.min(id + 1, 100)),
        });
      },
      setCurrentLevel: (id) => set({ currentLevel: id }),
      resetProgress: () =>
        set({
          xp: 0,
          gems: 10,
          hearts: 5,
          streak: 1,
          completed: [],
          currentLevel: 0,
        }),
    }),
    { name: "django-adventure-save" }
  )
);
