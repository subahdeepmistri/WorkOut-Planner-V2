import { prisma } from "@/lib/prisma";
import { requireServerViewer } from "@/lib/auth";
import { ok } from "@/lib/http";

export async function GET() {
  const viewer = await requireServerViewer();

  const [sessions, records, streak] = await Promise.all([
    prisma.workoutSession.findMany({
      where: { userId: viewer.profile.id },
      include: { stats: true },
      orderBy: { sessionDate: "desc" }
    }),
    prisma.personalRecord.findMany({
      where: { userId: viewer.profile.id },
      include: { exercise: true }
    }),
    prisma.streak.findUnique({ where: { userId: viewer.profile.id } })
  ]);

  return ok({
    exportedAt: new Date().toISOString(),
    sessions,
    records,
    streak
  });
}
