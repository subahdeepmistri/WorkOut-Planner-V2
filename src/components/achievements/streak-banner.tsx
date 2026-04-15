"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBannerProps {
  days: number;
}

export function StreakBanner({ days }: StreakBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3"
    >
      <Flame className="h-5 w-5 text-accent" />
      <div>
        <p className="text-sm font-semibold">{days} day streak</p>
        <p className="text-xs text-foreground/70">Discipline compounds daily. Keep going.</p>
      </div>
    </motion.div>
  );
}
