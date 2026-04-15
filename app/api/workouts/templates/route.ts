import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";
import { requireServerViewer } from "@/lib/auth";

export async function GET() {
  const viewer = await requireServerViewer();

  const templates = await prisma.workoutTemplate.findMany({
    where: { userId: viewer.profile.id },
    include: {
      exercises: {
        orderBy: {
          orderInTemplate: "asc"
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  return ok(templates);
}

export async function POST(request: Request) {
  const viewer = await requireServerViewer();
  const body = await request.json();

  if (!body.name) {
    return fail("Template name is required.");
  }

  const template = await prisma.workoutTemplate.create({
    data: {
      userId: viewer.profile.id,
      name: body.name,
      description: body.description ?? null,
      targetDuration: body.targetDuration ?? null,
      exercises: {
        create:
          body.exercises?.map((exercise: Record<string, unknown>, index: number) => ({
            name: String(exercise.name),
            muscleGroup: String(exercise.muscleGroup ?? "FULL_BODY"),
            exerciseType: String(exercise.exerciseType ?? "STRENGTH"),
            blockType: String(exercise.blockType ?? "STRENGTH"),
            orderInTemplate: index,
            restSecondsDefault: Number(exercise.restSecondsDefault ?? 90)
          })) ?? []
      }
    },
    include: {
      exercises: true
    }
  });

  return ok(template, { status: 201 });
}
