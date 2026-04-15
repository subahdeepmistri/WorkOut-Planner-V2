import { Exercise, WorkoutSession } from "@/types/domain";
import { SessionDraft } from "@/modules/workout/types/session-client";

export function createDraftFromTemplate(
  session: { id: string; status: WorkoutSession["status"]; sessionDate: Date; startedAt: Date | null; durationSeconds: number; notes: string | null; disciplineScore: number; recoveryWarning: boolean },
  exercises: Array<{
    id: string;
    name: string;
    muscleGroup: Exercise["muscleGroup"];
    exerciseType: Exercise["exerciseType"];
    blockType: Exercise["blockType"];
    restSecondsDefault: number;
  }>
): SessionDraft {
  return {
    sessionId: session.id,
    status: session.status,
    sessionDate: session.sessionDate.toISOString().slice(0, 10),
    startedAt: session.startedAt?.toISOString() ?? new Date().toISOString(),
    durationSeconds: session.durationSeconds,
    notes: session.notes ?? "",
    disciplineScore: session.disciplineScore,
    recoveryWarning: session.recoveryWarning,
    exercises: exercises.map((exercise) => ({
      exerciseId: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      exerciseType: exercise.exerciseType,
      blockType: exercise.blockType,
      targetSets: exercise.blockType === "WARMUP" || exercise.blockType === "COOLDOWN" ? 1 : 3,
      sets: [
        {
          exerciseId: exercise.id,
          setNumber: 1,
          isWarmup: exercise.blockType === "WARMUP",
          targetReps: exercise.exerciseType === "CARDIO" ? null : 10,
          completedReps: null,
          targetWeightKg: null,
          completedWeightKg: null,
          targetDurationSec: exercise.exerciseType === "CARDIO" ? 300 : null,
          completedDurationSec: null,
          restSeconds: exercise.restSecondsDefault,
          isCompleted: false
        }
      ]
    }))
  };
}

export function createDraftFromSession(session: {
  id: string;
  status: WorkoutSession["status"];
  sessionDate: Date;
  startedAt: Date | null;
  durationSeconds: number;
  notes: string | null;
  disciplineScore: number;
  recoveryWarning: boolean;
  sets: Array<{
    id: string;
    exerciseId: string;
    setNumber: number;
    isWarmup: boolean;
    targetReps: number | null;
    completedReps: number | null;
    targetWeightKg: number | null;
    completedWeightKg: number | null;
    targetDurationSec: number | null;
    completedDurationSec: number | null;
    restSeconds: number;
    isCompleted: boolean;
    exercise: {
      id: string;
      name: string;
      muscleGroup: Exercise["muscleGroup"];
      exerciseType: Exercise["exerciseType"];
      blockType: Exercise["blockType"];
    };
  }>;
}): SessionDraft {
  const grouped = new Map<string, SessionDraft["exercises"][number]>();

  for (const set of session.sets) {
    if (!grouped.has(set.exerciseId)) {
      grouped.set(set.exerciseId, {
        exerciseId: set.exerciseId,
        name: set.exercise.name,
        muscleGroup: set.exercise.muscleGroup,
        exerciseType: set.exercise.exerciseType,
        blockType: set.exercise.blockType,
        targetSets: 0,
        sets: []
      });
    }

    const group = grouped.get(set.exerciseId);

    if (!group) {
      continue;
    }

    group.sets.push({
      id: set.id,
      exerciseId: set.exerciseId,
      setNumber: set.setNumber,
      isWarmup: set.isWarmup,
      targetReps: set.targetReps,
      completedReps: set.completedReps,
      targetWeightKg: set.targetWeightKg,
      completedWeightKg: set.completedWeightKg,
      targetDurationSec: set.targetDurationSec,
      completedDurationSec: set.completedDurationSec,
      restSeconds: set.restSeconds,
      isCompleted: set.isCompleted
    });
    group.targetSets += 1;
  }

  return {
    sessionId: session.id,
    status: session.status,
    sessionDate: session.sessionDate.toISOString().slice(0, 10),
    startedAt: session.startedAt?.toISOString() ?? undefined,
    durationSeconds: session.durationSeconds,
    notes: session.notes ?? "",
    disciplineScore: session.disciplineScore,
    recoveryWarning: session.recoveryWarning,
    exercises: Array.from(grouped.values())
  };
}
