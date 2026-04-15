import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";
import { requireServerViewer } from "@/lib/auth";
import { upsertWorkoutSession } from "@/modules/workout/server/session-service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const viewer = await requireServerViewer();
  const { id } = await params;

  const session = await prisma.workoutSession.findFirst({
    where: {
      id,
      userId: viewer.profile.id
    },
    include: {
      template: {
        include: {
          exercises: true
        }
      },
      sets: {
        include: {
          exercise: true
        },
        orderBy: {
          setNumber: "asc"
        }
      },
      stats: true
    }
  });

  if (!session) {
    return fail("Session not found.", 404);
  }

  return ok(session);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const viewer = await requireServerViewer();
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.workoutSession.findFirst({
    where: {
      id,
      userId: viewer.profile.id
    }
  });

  if (!existing) {
    return fail("Session not found.", 404);
  }

  const result = await upsertWorkoutSession({
    ...body,
    sessionId: id
  });

  return ok(result);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const viewer = await requireServerViewer();
  const { id } = await params;

  const session = await prisma.workoutSession.findFirst({
    where: {
      id,
      userId: viewer.profile.id
    }
  });

  if (!session) {
    return fail("Session not found.", 404);
  }

  await prisma.workoutSession.delete({ where: { id } });

  return ok({ id, deleted: true });
}
