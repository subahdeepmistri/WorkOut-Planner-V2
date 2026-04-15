import { prisma } from "@/lib/prisma";

export async function generateProgressionSuggestions(userId: string) {
  const latestSets = await prisma.exerciseSet.findMany({
    where: {
      session: {
        userId,
        status: "COMPLETED"
      },
      isCompleted: true,
      completedWeightKg: {
        not: null
      },
      completedReps: {
        not: null
      }
    },
    orderBy: {
      completedAt: "desc"
    },
    take: 80,
    include: {
      exercise: true
    }
  });

  const seen = new Set<string>();
  const suggestions: Array<{ exerciseId: string; exerciseName: string; recommendedDeltaKg: number; reason: string }> = [];

  for (const set of latestSets) {
    if (seen.has(set.exerciseId) || !set.completedWeightKg || !set.completedReps) {
      continue;
    }

    const reps = set.completedReps;
    seen.add(set.exerciseId);

    let recommendedDeltaKg = 0;
    let reason = "Keep the same load and focus on form quality.";

    if (reps >= 12) {
      recommendedDeltaKg = 2.5;
      reason = "You cleared the top rep range. Add 2.5kg next session.";
    } else if (reps <= 5) {
      recommendedDeltaKg = -2.5;
      reason = "You were near failure early. Drop 2.5kg and rebuild volume.";
    }

    suggestions.push({
      exerciseId: set.exerciseId,
      exerciseName: set.exercise.name,
      recommendedDeltaKg,
      reason
    });

    if (suggestions.length >= 6) {
      break;
    }
  }

  return suggestions;
}
