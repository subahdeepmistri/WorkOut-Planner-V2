"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RestTimer } from "@/components/workout/rest-timer";
import { ExerciseSetRow } from "@/components/workout/exercise-set-row";
import { SessionExercise } from "@/modules/workout/types/session-client";
import { useSessionStore } from "@/state/use-session-store";

interface ExerciseCardProps {
  exercise: SessionExercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const addSet = useSessionStore((state) => state.addSet);

  return (
    <Card className="space-y-0">
      <CardHeader>
        <CardTitle>{exercise.name}</CardTitle>
        <CardDescription>
          {exercise.muscleGroup} · {exercise.exerciseType} · Target sets: {exercise.targetSets}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {exercise.sets.map((set) => (
            <ExerciseSetRow key={`${exercise.exerciseId}-${set.setNumber}`} exerciseId={exercise.exerciseId} set={set} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => addSet(exercise.exerciseId)}>
            Add Set
          </Button>
          <RestTimer defaultSeconds={exercise.sets.at(-1)?.restSeconds ?? 90} />
        </div>
      </CardContent>
    </Card>
  );
}
