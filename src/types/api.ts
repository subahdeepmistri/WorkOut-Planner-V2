import { Exercise, ExerciseSet, SessionStats, WorkoutSession, WorkoutTemplate } from "@/types/domain";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface SessionBundle {
  session: WorkoutSession;
  sets: ExerciseSet[];
  stats?: SessionStats;
}

export interface CreateSessionInput {
  templateId?: string;
  sessionDate: string;
}

export interface UpsertSessionInput {
  sessionId: string;
  status?: WorkoutSession["status"];
  notes?: string;
  durationSeconds?: number;
  disciplineScore?: number;
  recoveryWarning?: boolean;
  sets: Array<
    Pick<
      ExerciseSet,
      | "id"
      | "exerciseId"
      | "setNumber"
      | "isWarmup"
      | "targetReps"
      | "completedReps"
      | "targetWeightKg"
      | "completedWeightKg"
      | "targetDurationSec"
      | "completedDurationSec"
      | "restSeconds"
      | "isCompleted"
    >
  >;
}

export interface TemplateBundle {
  template: WorkoutTemplate;
  exercises: Exercise[];
}
