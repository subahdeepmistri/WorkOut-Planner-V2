import { format } from "date-fns";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/stats/kpi-card";
import { VolumeTrendChart } from "@/components/charts/volume-trend-chart";
import { BodyFocusChart } from "@/components/charts/body-focus-chart";
import { WeeklyHeatmap } from "@/components/charts/weekly-heatmap";
import { requireServerViewer } from "@/lib/auth";
import { getStatsData } from "@/server/services/workout-query-service";

export default async function StatsPage() {
  const viewer = await requireServerViewer();
  const data = await getStatsData(viewer.profile.id);

  const totalVolume = data.sessions.reduce((sum, stat) => sum + Number(stat.totalVolumeKg), 0);
  const totalSets = data.sessions.reduce((sum, stat) => sum + stat.totalSets, 0);

  const trend = data.sessions.map((stat) => ({
    label: format(new Date(stat.createdAt), "MMM d"),
    volume: Number(stat.totalVolumeKg)
  }));

  const bodyFocus = data.focus
    ? [
        { focus: "Chest", value: data.focus.chest },
        { focus: "Back", value: data.focus.back },
        { focus: "Legs", value: data.focus.legs },
        { focus: "Shoulders", value: data.focus.shoulders },
        { focus: "Arms", value: data.focus.arms },
        { focus: "Core", value: data.focus.core },
        { focus: "Cardio", value: data.focus.cardio }
      ]
    : [];

  const heatmap = trend.slice(-28).map((item) => item.volume);

  return (
    <div className="space-y-4 pb-20">
      <PageHeader title="Stats Dashboard" subtitle="Lifetime analytics, monthly trends, and weekly volume heatmaps" />

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Lifetime volume" value={`${Math.round(totalVolume).toLocaleString()} kg`} />
        <KpiCard label="Total sets" value={totalSets.toLocaleString()} />
        <KpiCard label="Tracked sessions" value={data.sessions.length.toLocaleString()} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly trend</CardTitle>
        </CardHeader>
        <CardContent>
          <VolumeTrendChart data={trend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Body focus distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <BodyFocusChart data={bodyFocus} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly volume heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyHeatmap values={heatmap.length ? heatmap : [0, 0, 0, 0, 0, 0, 0]} />
        </CardContent>
      </Card>
    </div>
  );
}
