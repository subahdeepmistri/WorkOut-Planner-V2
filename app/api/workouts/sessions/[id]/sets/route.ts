import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";
import { requireServerViewer } from "@/lib/auth";
import { upsertWorkoutSession } from "@/modules/workout/server/session-service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const viewer = await requireServerViewer();
  const { id } = await params;
  const body = await request.json();

  const session = await prisma.workoutSession.findFirst({
    where: {
      id,
      userId: viewer.profile.id
    }
  });

  if (!session) {
    return fail("Session not found.", 404);
  }

  const result = await upsertWorkoutSession({
    sessionId: id,
    sets: body.sets ?? [],
    durationSeconds: body.durationSeconds,
    status: body.status,
    notes: body.notes,
    disciplineScore: body.disciplineScore,
    recoveryWarning: body.recoveryWarning
  });

  return ok(result);
}
