import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireServerViewer } from "@/lib/auth";
import { createDraftFromSession } from "@/modules/workout/client/draft-factory";
import { SessionScreen } from "@/components/workout/session-screen";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const viewer = await requireServerViewer();
  const { id } = await params;

  const session = await prisma.workoutSession.findFirst({
    where: {
      id,
      userId: viewer.profile.id
    },
    include: {
      sets: {
        include: {
          exercise: true
        },
        orderBy: {
          setNumber: "asc"
        }
      }
    }
  });

  if (!session) {
    notFound();
  }

  const draft = createDraftFromSession({
    id: session.id,
    status: session.status,
    sessionDate: session.sessionDate,
    startedAt: session.startedAt,
    durationSeconds: session.durationSeconds,
    notes: session.notes,
    disciplineScore: session.disciplineScore,
    recoveryWarning: session.recoveryWarning,
    sets: session.sets.map((set) => ({
      id: set.id,
      exerciseId: set.exerciseId,
      setNumber: set.setNumber,
      isWarmup: set.isWarmup,
      targetReps: set.targetReps,
      completedReps: set.completedReps,
      targetWeightKg: set.targetWeightKg ? Number(set.targetWeightKg) : null,
      completedWeightKg: set.completedWeightKg ? Number(set.completedWeightKg) : null,
      targetDurationSec: set.targetDurationSec,
      completedDurationSec: set.completedDurationSec,
      restSeconds: set.restSeconds,
      isCompleted: set.isCompleted,
      exercise: {
        id: set.exercise.id,
        name: set.exercise.name,
        muscleGroup: set.exercise.muscleGroup,
        exerciseType: set.exercise.exerciseType,
        blockType: set.exercise.blockType
      }
    }))
  });

  return <SessionScreen initialDraft={draft} />;
}
