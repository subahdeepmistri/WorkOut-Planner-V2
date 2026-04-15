import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/stats/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFounderMetrics } from "@/server/admin/founder-metrics";
import { prisma } from "@/lib/prisma";
import { requireServerViewer } from "@/lib/auth";

export default async function AdminPage() {
  await requireServerViewer();

  const [metrics, topEvents] = await Promise.all([
    getFounderMetrics(),
    prisma.analyticsEvent.groupBy({
      by: ["eventName"],
      _count: {
        eventName: true
      },
      orderBy: {
        _count: {
          eventName: "desc"
        }
      },
      take: 8
    })
  ]);

  return (
    <div className="space-y-4 pb-20">
      <PageHeader title="Founder Analytics" subtitle="DAU, WAU, retention, churn, conversion, and revenue" />

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="DAU" value={metrics.dau.toString()} />
        <KpiCard label="WAU" value={metrics.wau.toString()} />
        <KpiCard label="MRR" value={`$${metrics.monthlyRecurringRevenue.toLocaleString()}`} />
        <KpiCard label="Retention" value={`${(metrics.retentionRate * 100).toFixed(1)}%`} />
        <KpiCard label="Churn" value={`${(metrics.churnRate * 100).toFixed(1)}%`} />
        <KpiCard label="Pro conversion" value={`${(metrics.proConversionRate * 100).toFixed(1)}%`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top analytics events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topEvents.map((event) => (
            <div key={event.eventName} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
              <span>{event.eventName}</span>
              <span>{event._count.eventName}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
