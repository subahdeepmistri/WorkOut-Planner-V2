import { endOfMonth, startOfMonth, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  const [activeSession, recentSessions, streak, subscription] = await Promise.all([
    prisma.workoutSession.findFirst({
      where: {
        userId,
        status: {
          in: ["ACTIVE", "DRAFT"]
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    }),
    prisma.workoutSession.findMany({
      where: {
        userId,
        status: "COMPLETED"
      },
      include: {
        stats: true
      },
      orderBy: {
        sessionDate: "desc"
      },
      take: 6
    }),
    prisma.streak.findUnique({
      where: {
        userId
      }
    }),
    prisma.subscription.findUnique({
      where: {
        userId
      }
    })
  ]);

  const lifetime = recentSessions.reduce(
    (acc, session) => {
      acc.totalSessions += 1;
      acc.totalVolume += Number(session.stats?.totalVolumeKg ?? 0);
      acc.totalMinutes += Math.round((session.durationSeconds || 0) / 60);
      return acc;
    },
    {
      totalSessions: 0,
      totalVolume: 0,
      totalMinutes: 0
    }
  );

  return {
    activeSession,
    recentSessions,
    streak,
    subscription,
    lifetime
  };
}

export async function getSessionHistory(userId: string) {
  return prisma.workoutSession.findMany({
    where: {
      userId,
      status: {
        notIn: ["DISCARDED"]
      }
    },
    include: {
      template: true,
      stats: true
    },
    orderBy: {
      sessionDate: "desc"
    },
    take: 60
  });
}

export async function getPersonalRecords(userId: string) {
  return prisma.personalRecord.findMany({
    where: {
      userId
    },
    include: {
      exercise: true,
      session: true
    },
    orderBy: {
      achievedAt: "desc"
    },
    take: 50
  });
}

export async function getStatsData(userId: string) {
  const [sessions, focus] = await Promise.all([
    prisma.sessionStats.findMany({
      where: {
        userId,
        createdAt: {
          gte: subDays(new Date(), 90)
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    }),
    prisma.bodyFocusDistribution.findMany({
      where: {
        userId,
        monthStart: {
          gte: startOfMonth(subDays(new Date(), 120)),
          lte: endOfMonth(new Date())
        }
      },
      orderBy: {
        monthStart: "desc"
      },
      take: 1
    })
  ]);

  return {
    sessions,
    focus: focus[0] ?? null
  };
}

export async function getSettingsData(userId: string) {
  const [settings, subscription, referralCode] = await Promise.all([
    prisma.settings.findUnique({
      where: {
        userId
      }
    }),
    prisma.subscription.findUnique({
      where: {
        userId
      }
    }),
    prisma.referralCode.findUnique({
      where: {
        userId
      }
    })
  ]);

  return {
    settings,
    subscription,
    referralCode
  };
}
