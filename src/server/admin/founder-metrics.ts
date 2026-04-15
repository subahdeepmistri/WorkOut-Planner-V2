import { subDays } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getFounderMetrics() {
  const now = new Date();
  const dayAgo = subDays(now, 1);
  const weekAgo = subDays(now, 7);
  const monthAgo = subDays(now, 30);

  const [dau, wau, activeSubs, totalSubs, converted, monthlyRevenue] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["userId"],
      where: {
        createdAt: { gte: dayAgo },
        userId: { not: null }
      }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["userId"],
      where: {
        createdAt: { gte: weekAgo },
        userId: { not: null }
      }
    }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count(),
    prisma.subscription.count({ where: { tier: "PRO" } }),
    prisma.subscription.aggregate({
      _count: {
        id: true
      },
      where: {
        tier: "PRO",
        status: "ACTIVE",
        currentPeriodStart: { gte: monthAgo }
      }
    })
  ]);

  const churnBase = totalSubs === 0 ? 0 : (totalSubs - activeSubs) / totalSubs;
  const conversion = totalSubs === 0 ? 0 : converted / totalSubs;

  return {
    dau: dau.length,
    wau: wau.length,
    retentionRate: Number((1 - churnBase).toFixed(3)),
    churnRate: Number(churnBase.toFixed(3)),
    proConversionRate: Number(conversion.toFixed(3)),
    monthlyRecurringRevenue: monthlyRevenue._count.id * 19
  };
}
