import Link from "next/link";
import { ArrowRight, Crown, Plus } from "lucide-react";
import { requireServerViewer } from "@/lib/auth";
import { getDashboardData } from "@/server/services/workout-query-service";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/stats/kpi-card";
import { StreakBanner } from "@/components/achievements/streak-banner";

export default async function DashboardPage() {
  const viewer = await requireServerViewer();
  const data = await getDashboardData(viewer.profile.id);

  return (
    <div className="space-y-5 pb-20">
      <PageHeader
        title="Workout Dashboard"
        subtitle="Real-time training momentum, progression, and discipline metrics"
        action={<ThemeToggle />}
      />

      {data.streak ? <StreakBanner days={data.streak.currentDays} /> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Sessions logged" value={`${data.lifetime.totalSessions}`} />
        <KpiCard label="Volume (kg)" value={Math.round(data.lifetime.totalVolume).toLocaleString()} />
        <KpiCard label="Training minutes" value={data.lifetime.totalMinutes.toLocaleString()} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily session</CardTitle>
          <CardDescription>
            {data.activeSession ? "Continue your active training session." : "Start a new adaptive session."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={data.activeSession ? `/session/${data.activeSession.id}` : "/session/new"}>
              <Plus className="mr-2 h-4 w-4" />
              {data.activeSession ? "Resume session" : "Start session"}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent sessions
            <Link href="/history" className="text-sm text-primary">
              View all
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.recentSessions.map((session) => (
            <Link
              key={session.id}
              href={`/session/${session.id}`}
              className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-muted/50"
            >
              <span>{new Date(session.sessionDate).toLocaleDateString()}</span>
              <span className="text-foreground/70">{Math.round(Number(session.stats?.totalVolumeKg ?? 0))}kg volume</span>
            </Link>
          ))}
          {data.recentSessions.length === 0 ? (
            <p className="text-sm text-foreground/70">No completed sessions yet.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-primary/40 bg-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-primary" />
            Upgrade to Pro
          </CardTitle>
          <CardDescription>
            Unlock unlimited history, AI progression, advanced records, and export reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/billing">
              See plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
