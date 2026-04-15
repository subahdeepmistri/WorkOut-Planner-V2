export type PlanTier = "FREE" | "PRO";

export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "EXPIRED";

export type SessionStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "DISCARDED" | "LOCKED";

export type WorkoutBlockType = "WARMUP" | "STRENGTH" | "CARDIO" | "COOLDOWN";

export type ExerciseType = "STRENGTH" | "CARDIO" | "MOBILITY";

export type MuscleGroup =
  | "CHEST"
  | "BACK"
  | "LEGS"
  | "SHOULDERS"
  | "ARMS"
  | "CORE"
  | "GLUTES"
  | "CALVES"
  | "FULL_BODY"
  | "CARDIO";

export type PRMetric = "HEAVIEST_WEIGHT" | "MAX_REPS" | "BEST_VOLUME" | "LONGEST_DURATION";

export interface UserProfile {
  id: string;
  authUserId: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  isLocked: boolean;
  targetDuration?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  templateId?: string | null;
  name: string;
  muscleGroup: MuscleGroup;
  exerciseType: ExerciseType;
  blockType: WorkoutBlockType;
  orderInTemplate: number;
  restSecondsDefault: number;
  aiSuggestedDeltaKg?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  templateId?: string | null;
  sessionDate: string;
  status: SessionStatus;
  startedAt?: string | null;
  endedAt?: string | null;
  durationSeconds: number;
  notes?: string | null;
  lockReason?: string | null;
  disciplineScore: number;
  recoveryWarning: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseSet {
  id: string;
  sessionId: string;
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
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionStats {
  id: string;
  userId: string;
  sessionId: string;
  totalVolumeKg: number;
  totalSets: number;
  totalReps: number;
  totalDurationSec: number;
  averageIntensity: number;
  cardioMinutes: number;
  warmupCompleted: boolean;
  cooldownCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;
  sessionId?: string | null;
  metric: PRMetric;
  value: number;
  achievedAt: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface Streak {
  id: string;
  userId: string;
  currentDays: number;
  longestDays: number;
  lastWorkoutDate?: string | null;
  freezeTokens: number;
  updatedAt: string;
}

export interface BodyFocusDistribution {
  id: string;
  userId: string;
  monthStart: string;
  chest: number;
  back: number;
  legs: number;
  shoulders: number;
  arms: number;
  core: number;
  cardio: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  userId: string;
  theme: "SYSTEM" | "LIGHT" | "DARK";
  weightUnit: "KG" | "LB";
  notifications: boolean;
  emailNotifications: boolean;
  hapticFeedback: boolean;
  autoLockWorkout: boolean;
  restTimerDefaultSec: number;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: PlanTier;
  status: SubscriptionStatus;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string | null;
  updatedAt: string;
}

export interface FounderMetrics {
  dau: number;
  wau: number;
  retentionRate: number;
  churnRate: number;
  proConversionRate: number;
  monthlyRecurringRevenue: number;
}

export interface SessionBlockSummary {
  blockType: WorkoutBlockType;
  exerciseCount: number;
  completedSets: number;
}
