"use client";

import { CheckCircle2, Copy, MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionExerciseSet } from "@/modules/workout/types/session-client";
import { useSessionStore } from "@/state/use-session-store";

interface ExerciseSetRowProps {
  exerciseId: string;
  set: SessionExerciseSet;
}

function parseOptionalNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function ExerciseSetRow({ exerciseId, set }: ExerciseSetRowProps) {
  const updateSet = useSessionStore((state) => state.updateSet);
  const removeSet = useSessionStore((state) => state.removeSet);
  const duplicatePreviousSet = useSessionStore((state) => state.duplicatePreviousSet);
  const autoFillPreviousWeight = useSessionStore((state) => state.autoFillPreviousWeight);
  const markSetCompleted = useSessionStore((state) => state.markSetCompleted);

  return (
    <div className="rounded-lg border border-border/60 bg-card/80 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">Set {set.setNumber}</p>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={() => duplicatePreviousSet(exerciseId, set.setNumber)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => removeSet(exerciseId, set.setNumber)}>
            <MinusCircle className="h-4 w-4" />
          </Button>
          <Button size="icon" variant={set.isCompleted ? "secondary" : "outline"} onClick={() => markSetCompleted(exerciseId, set.setNumber, !set.isCompleted)}>
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Input
          type="number"
          placeholder="Target reps"
          value={set.targetReps ?? ""}
          onChange={(event) =>
            updateSet(exerciseId, set.setNumber, {
              targetReps: parseOptionalNumber(event.target.value)
            })
          }
        />
        <Input
          type="number"
          placeholder="Reps"
          value={set.completedReps ?? ""}
          onChange={(event) =>
            updateSet(exerciseId, set.setNumber, {
              completedReps: parseOptionalNumber(event.target.value)
            })
          }
        />
        <Input
          type="number"
          placeholder="Weight"
          value={set.completedWeightKg ?? ""}
          onChange={(event) =>
            updateSet(exerciseId, set.setNumber, {
              completedWeightKg: parseOptionalNumber(event.target.value)
            })
          }
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Button size="sm" variant="ghost" onClick={() => autoFillPreviousWeight(exerciseId, set.setNumber)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Auto-fill previous weight
        </Button>
      </div>
    </div>
  );
}
