"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSessionStore } from "@/state/use-session-store";

function formatSeconds(total: number) {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function SessionTimer() {
  const draft = useSessionStore((state) => state.draft);
  const setDuration = useSessionStore((state) => state.setDuration);
  const [, setTick] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!draft?.startedAt) {
      startRef.current = null;
      return;
    }

    startRef.current = new Date(draft.startedAt).getTime();

    const interval = setInterval(() => {
      setTick((current) => current + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [draft?.startedAt]);

  const duration = useMemo(() => {
    if (!draft) {
      return 0;
    }

    if (!startRef.current) {
      return draft.durationSeconds;
    }

    const elapsed = Math.max(0, Math.floor((Date.now() - startRef.current) / 1000));
    const total = Math.max(draft.durationSeconds, elapsed);

    if (total !== draft.durationSeconds) {
      setDuration(total);
    }

    return total;
  }, [draft, setDuration]);

  return (
    <div className="rounded-xl border border-border/70 bg-muted/40 px-4 py-3 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-foreground/70">Active Session Timer</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-primary">{formatSeconds(duration)}</p>
    </div>
  );
}
