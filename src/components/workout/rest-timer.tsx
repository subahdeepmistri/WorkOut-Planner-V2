"use client";

import { useEffect, useState } from "react";
import { TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestTimerProps {
  defaultSeconds: number;
}

export function RestTimer({ defaultSeconds }: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) {
      return;
    }

    const timeout = setTimeout(() => setSeconds((previous) => previous - 1), 1000);
    return () => clearTimeout(timeout);
  }, [running, seconds]);

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => setRunning((current) => !current)}>
        <TimerReset className="mr-2 h-4 w-4" />
        {running ? "Pause" : "Start Rest"}
      </Button>
      <span className="stat-chip">{seconds}s</span>
      <Button size="sm" variant="ghost" onClick={() => setSeconds(defaultSeconds)}>
        Reset
      </Button>
    </div>
  );
}
