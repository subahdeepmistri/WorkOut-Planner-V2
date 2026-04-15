"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SettingsFormProps {
  initial: {
    notifications: boolean;
    emailNotifications: boolean;
    hapticFeedback: boolean;
    autoLockWorkout: boolean;
    restTimerDefaultSec: number;
  };
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const [state, setState] = useState(initial);
  const [saved, setSaved] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaved(false);

    await fetch("/api/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(state)
    });

    setSaved(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="flex items-center justify-between gap-3 text-sm">
            Push notifications
            <input
              type="checkbox"
              checked={state.notifications}
              onChange={(event) => setState((previous) => ({ ...previous, notifications: event.target.checked }))}
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            Email notifications
            <input
              type="checkbox"
              checked={state.emailNotifications}
              onChange={(event) =>
                setState((previous) => ({ ...previous, emailNotifications: event.target.checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            Haptic-ready interactions
            <input
              type="checkbox"
              checked={state.hapticFeedback}
              onChange={(event) => setState((previous) => ({ ...previous, hapticFeedback: event.target.checked }))}
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            Auto-lock workout when finished
            <input
              type="checkbox"
              checked={state.autoLockWorkout}
              onChange={(event) => setState((previous) => ({ ...previous, autoLockWorkout: event.target.checked }))}
            />
          </label>

          <div className="space-y-2">
            <p className="text-sm font-medium">Default rest timer (sec)</p>
            <Input
              type="number"
              value={state.restTimerDefaultSec}
              onChange={(event) =>
                setState((previous) => ({
                  ...previous,
                  restTimerDefaultSec: Math.max(15, Number(event.target.value) || 90)
                }))
              }
            />
          </div>

          <Button type="submit">Save settings</Button>
          {saved ? <p className="text-sm text-success">Settings saved</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
