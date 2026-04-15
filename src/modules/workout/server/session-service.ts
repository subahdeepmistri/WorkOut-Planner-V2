import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AnalyticsPayload } from "@/types/analytics";
import { upsertSessionSchema } from "@/lib/validators/session";

function toDecimal(value?: number | null) {
  if (value === null || value === undefined) {
    return null;
  }

  return new Prisma.Decimal(value);
}

export function computeSessionStats(
  sets: Array<{ completedWeightKg?: number | null; completedReps?: number | null; completedDurationSec?: number | null; isCompleted?: boolean; isWarmup?: boolean }>
) {
  const completedSets = sets.filter((set) => set.isCompleted);

  const totalVolume = completedSets.reduce((sum, set) => {
    return sum + (set.completedWeightKg ?? 0) * (set.completedReps ?? 0);
  }, 0);

  const totalReps = completedSets.reduce((sum, set) => sum + (set.completedReps ?? 0), 0);
  const totalDuration = completedSets.reduce((sum, set) => sum + (set.completedDurationSec ?? 0), 0);
  const warmupCompleted = completedSets.some((set) => set.isWarmup);

  return {
    totalVolumeKg: totalVolume,
    totalSets: completedSets.length,
    totalReps,
    totalDurationSec: totalDuration,
    averageIntensity: completedSets.length ? totalVolume / completedSets.length : 0,
    cardioMinutes: Math.round(totalDuration / 60),
    warmupCompleted,
    cooldownCompleted: completedSets.length > 0
  };
}

export async function upsertWorkoutSession(input: unknown) {
  const parsed = upsertSessionSchema.parse(input);

  const [session] = await prisma.$transaction([
    prisma.workoutSession.update({
      where: { id: parsed.sessionId },
      data: {
        status: parsed.status,
        notes: parsed.notes,
        durationSeconds: parsed.durationSeconds,
        disciplineScore: parsed.disciplineScore,
        recoveryWarning: parsed.recoveryWarning
      }
    }),
    prisma.exerciseSet.deleteMany({
      where: { sessionId: parsed.sessionId }
    })
  ]);

  const setRows = await Promise.all(
    parsed.sets.map((set) =>
      prisma.exerciseSet.create({
        data: {
          sessionId: parsed.sessionId,
          exerciseId: set.exerciseId,
          setNumber: set.setNumber,
          isWarmup: set.isWarmup,
          targetReps: set.targetReps,
          completedReps: set.completedReps,
          targetWeightKg: toDecimal(set.targetWeightKg),
          completedWeightKg: toDecimal(set.completedWeightKg),
          targetDurationSec: set.targetDurationSec,
          completedDurationSec: set.completedDurationSec,
          restSeconds: set.restSeconds,
          isCompleted: set.isCompleted,
          completedAt: set.isCompleted ? new Date() : null
        }
      })
    )
  );

  const stats = computeSessionStats(
    parsed.sets.map((set) => ({
      completedWeightKg: set.completedWeightKg,
      completedReps: set.completedReps,
      completedDurationSec: set.completedDurationSec,
      isCompleted: set.isCompleted,
      isWarmup: set.isWarmup
    }))
  );

  await prisma.sessionStats.upsert({
    where: { sessionId: parsed.sessionId },
    create: {
      userId: session.userId,
      sessionId: parsed.sessionId,
      totalVolumeKg: toDecimal(stats.totalVolumeKg) ?? 0,
      totalSets: stats.totalSets,
      totalReps: stats.totalReps,
      totalDurationSec: stats.totalDurationSec,
      averageIntensity: toDecimal(stats.averageIntensity) ?? 0,
      cardioMinutes: stats.cardioMinutes,
      warmupCompleted: stats.warmupCompleted,
      cooldownCompleted: stats.cooldownCompleted
    },
    update: {
      totalVolumeKg: toDecimal(stats.totalVolumeKg) ?? 0,
      totalSets: stats.totalSets,
      totalReps: stats.totalReps,
      totalDurationSec: stats.totalDurationSec,
      averageIntensity: toDecimal(stats.averageIntensity) ?? 0,
      cardioMinutes: stats.cardioMinutes,
      warmupCompleted: stats.warmupCompleted,
      cooldownCompleted: stats.cooldownCompleted
    }
  });

  return {
    session,
    sets: setRows,
    stats
  };
}

export function buildSessionAnalytics(
  eventName: AnalyticsPayload["eventName"],
  userId: string,
  sessionId: string,
  properties?: Record<string, unknown>
): AnalyticsPayload {
  return {
    eventName,
    category: "workout",
    userId,
    sessionId,
    properties
  };
}
