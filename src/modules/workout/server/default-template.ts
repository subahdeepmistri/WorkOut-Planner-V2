import { prisma } from "@/lib/prisma";

export async function ensureDefaultTemplate(userId: string) {
  const existing = await prisma.workoutTemplate.findFirst({
    where: { userId },
    include: { exercises: true }
  });

  if (existing) {
    return existing;
  }

  return prisma.workoutTemplate.create({
    data: {
      userId,
      name: "Daily Performance",
      description: "Balanced warm-up, strength, cardio, and cooldown.",
      targetDuration: 60,
      exercises: {
        create: [
          {
            name: "Dynamic Warm-Up",
            muscleGroup: "FULL_BODY",
            exerciseType: "MOBILITY",
            blockType: "WARMUP",
            orderInTemplate: 0,
            restSecondsDefault: 30
          },
          {
            name: "Barbell Squat",
            muscleGroup: "LEGS",
            exerciseType: "STRENGTH",
            blockType: "STRENGTH",
            orderInTemplate: 1,
            restSecondsDefault: 120
          },
          {
            name: "Bench Press",
            muscleGroup: "CHEST",
            exerciseType: "STRENGTH",
            blockType: "STRENGTH",
            orderInTemplate: 2,
            restSecondsDefault: 120
          },
          {
            name: "Assault Bike Intervals",
            muscleGroup: "CARDIO",
            exerciseType: "CARDIO",
            blockType: "CARDIO",
            orderInTemplate: 3,
            restSecondsDefault: 60
          },
          {
            name: "Cooldown Stretch",
            muscleGroup: "FULL_BODY",
            exerciseType: "MOBILITY",
            blockType: "COOLDOWN",
            orderInTemplate: 4,
            restSecondsDefault: 30
          }
        ]
      }
    },
    include: {
      exercises: true
    }
  });
}
