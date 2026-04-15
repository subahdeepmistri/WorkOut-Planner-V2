import { startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/http";
import { requireServerViewer } from "@/lib/auth";

export async function GET(request: Request) {
  const viewer = await requireServerViewer();
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 30);

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId: viewer.profile.id
    },
    include: {
      stats: true,
      sets: {
        include: {
          exercise: true
        }
      },
      template: true
    },
    orderBy: {
      sessionDate: "desc"
    },
    take: Math.min(limit, 100)
  });

  return ok(sessions);
}

export async function POST(request: Request) {
  const viewer = await requireServerViewer();
  const body = await request.json();

  const sessionDate = body.sessionDate ? new Date(body.sessionDate) : new Date();

  const existing = await prisma.workoutSession.findFirst({
    where: {
      userId: viewer.profile.id,
      status: {
        in: ["ACTIVE", "DRAFT"]
      },
      sessionDate: {
        gte: startOfDay(sessionDate)
      }
    }
  });

  if (existing) {
    return ok(existing);
  }

  const session = await prisma.workoutSession.create({
    data: {
      userId: viewer.profile.id,
      templateId: body.templateId ?? null,
      sessionDate,
      status: "ACTIVE",
      startedAt: new Date()
    }
  });

  return ok(session, { status: 201 });
}
