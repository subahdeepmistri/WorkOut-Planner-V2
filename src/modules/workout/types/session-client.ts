import { ExerciseType, MuscleGroup, SessionStatus, WorkoutBlockType } from "@/types/domain";

export interface SessionExerciseSet {
  id?: string;
  exerciseId: string;
  setNumber: number;
  isWarmup: boolean;
  targetReps?: number | null;
  completedReps?: number | null;
  targetWeightKg?: number | null;
  completedWeightKg?: number | null;
  targetDurationSec?: number | null;
  completedDurationSec?: number | null;
  restSeconds: number;
  isCompleted: boolean;
}

export interface SessionExercise {
  exerciseId: string;
  name: string;
  muscleGroup: MuscleGroup;
  exerciseType: ExerciseType;
  blockType: WorkoutBlockType;
  targetSets: number;
  sets: SessionExerciseSet[];
}

export interface SessionDraft {
  sessionId: string;
  status: SessionStatus;
  sessionDate: string;
  startedAt?: string;
  durationSeconds: number;
  notes?: string;
  disciplineScore: number;
  recoveryWarning: boolean;
  exercises: SessionExercise[];
}
