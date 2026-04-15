import { prisma } from "@/lib/prisma";
import { requireServerViewer } from "@/lib/auth";
import { ensureDefaultTemplate } from "@/modules/workout/server/default-template";
import { createDraftFromSession, createDraftFromTemplate } from "@/modules/workout/client/draft-factory";
import { SessionScreen } from "@/components/workout/session-screen";

export default async function NewSessionPage() {
  const viewer = await requireServerViewer();
  const template = await ensureDefaultTemplate(viewer.profile.id);

  const activeSession = await prisma.workoutSession.findFirst({
    where: {
      userId: viewer.profile.id,
      status: {
        in: ["ACTIVE", "DRAFT"]
      }
    },
    include: {
      sets: {
        include: {
          exercise: true
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  const session =
    activeSession ??
    (await prisma.workoutSession.create({
      data: {
        userId: viewer.profile.id,
        templateId: template.id,
        sessionDate: new Date(),
        status: "ACTIVE",
        startedAt: new Date()
      }
    }));

  const draft = activeSession && activeSession.sets.length > 0
    ? createDraftFromSession({
        id: activeSession.id,
        status: activeSession.status,
        sessionDate: activeSession.sessionDate,
        startedAt: activeSession.startedAt,
        durationSeconds: activeSession.durationSeconds,
        notes: activeSession.notes,
        disciplineScore: activeSession.disciplineScore,
        recoveryWarning: activeSession.recoveryWarning,
        sets: activeSession.sets.map((set) => ({
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
      })
    : createDraftFromTemplate(
        {
          id: session.id,
          status: session.status,
          sessionDate: session.sessionDate,
          startedAt: session.startedAt,
          durationSeconds: session.durationSeconds,
          notes: session.notes,
          disciplineScore: session.disciplineScore,
          recoveryWarning: session.recoveryWarning
        },
        template.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          exerciseType: exercise.exerciseType,
          blockType: exercise.blockType,
          restSecondsDefault: exercise.restSecondsDefault
        }))
      );

  return <SessionScreen initialDraft={draft} />;
}
