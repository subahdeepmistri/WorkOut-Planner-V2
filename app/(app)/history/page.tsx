import Link from "next/link";
import { differenceInDays } from "date-fns";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeatureGateCallout } from "@/components/subscription/feature-gate-callout";
import { requireServerViewer } from "@/lib/auth";
import { getSessionHistory } from "@/server/services/workout-query-service";
import { canViewHistory } from "@/modules/subscription/feature-gates";
import { prisma } from "@/lib/prisma";

export default async function HistoryPage() {
  const viewer = await requireServerViewer();
  const [sessions, subscription] = await Promise.all([
    getSessionHistory(viewer.profile.id),
    prisma.subscription.findUnique({ where: { userId: viewer.profile.id } })
  ]);

  const tier = subscription?.tier ?? "FREE";

  return (
    <div className="space-y-4 pb-20">
      <PageHeader title="Session History" subtitle="Session timeline, stats, and progression context" />

      {tier === "FREE" ? (
        <FeatureGateCallout
          title="Free plan history limit"
          description="Free accounts can browse the last 7 days. Upgrade for full timeline access."
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Workout timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sessions.map((session) => {
            const age = differenceInDays(new Date(), new Date(session.sessionDate));
            const canOpen = canViewHistory(tier, age);

            return (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{new Date(session.sessionDate).toLocaleDateString()}</p>
                  <p className="text-xs text-foreground/70">
                    {session.template?.name ?? "Custom session"} · {session.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={canOpen ? "success" : "muted"}>{canOpen ? "Accessible" : "Pro only"}</Badge>
                  {canOpen ? (
                    <Link href={`/session/${session.id}`} className="text-sm font-semibold text-primary">
                      Open
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
