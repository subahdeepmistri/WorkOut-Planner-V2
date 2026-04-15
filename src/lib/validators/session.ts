import { z } from "zod";

export const setInputSchema = z.object({
  id: z.string().optional(),
  exerciseId: z.string(),
  setNumber: z.number().int().positive(),
  isWarmup: z.boolean().default(false),
  targetReps: z.number().int().nullable().optional(),
  completedReps: z.number().int().nullable().optional(),
  targetWeightKg: z.number().nullable().optional(),
  completedWeightKg: z.number().nullable().optional(),
  targetDurationSec: z.number().int().nullable().optional(),
  completedDurationSec: z.number().int().nullable().optional(),
  restSeconds: z.number().int().positive().default(90),
  isCompleted: z.boolean().default(false)
});

export const upsertSessionSchema = z.object({
  sessionId: z.string(),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "DISCARDED", "LOCKED"]).optional(),
  notes: z.string().max(1500).optional(),
  durationSeconds: z.number().int().nonnegative().optional(),
  disciplineScore: z.number().int().min(0).max(100).optional(),
  recoveryWarning: z.boolean().optional(),
  sets: z.array(setInputSchema)
});
