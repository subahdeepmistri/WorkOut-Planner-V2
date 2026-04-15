"use client";

import { create } from "zustand";
import { PlanTier } from "@/types/domain";

interface AppState {
  plan: PlanTier;
  activeSessionId?: string;
  streakCelebrationOpen: boolean;
  prCelebrationOpen: boolean;
  setPlan: (plan: PlanTier) => void;
  setActiveSessionId: (sessionId?: string) => void;
  setStreakCelebrationOpen: (open: boolean) => void;
  setPrCelebrationOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  plan: "FREE",
  streakCelebrationOpen: false,
  prCelebrationOpen: false,
  setPlan: (plan) => set({ plan }),
  setActiveSessionId: (activeSessionId) => set({ activeSessionId }),
  setStreakCelebrationOpen: (streakCelebrationOpen) => set({ streakCelebrationOpen }),
  setPrCelebrationOpen: (prCelebrationOpen) => set({ prCelebrationOpen })
}));
