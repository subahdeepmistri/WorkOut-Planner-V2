import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AchievementUnlockCard } from "@/components/achievements/achievement-unlock-card";
import { RecordsPanel } from "@/components/achievements/records-panel";
import { requireServerViewer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPersonalRecords } from "@/server/services/workout-query-service";

export default async function RecordsPage() {
  const viewer = await requireServerViewer();
  const [records, achievements] = await Promise.all([
    getPersonalRecords(viewer.profile.id),
    prisma.achievement.findMany({
      where: { userId: viewer.profile.id },
      orderBy: { unlockedAt: "desc" },
      take: 6
    })
  ]);

  const flattened = records.map((record) => ({
    id: record.id,
    userId: record.userId,
    exerciseId: record.exerciseId,
    sessionId: record.sessionId,
    metric: record.metric,
    value: Number(record.value),
    achievedAt: record.achievedAt.toISOString(),
    createdAt: record.createdAt.toISOString(),
    exerciseName: record.exercise.name
  }));

  return (
    <div className="space-y-4 pb-20">
      <PageHeader title="Records Dashboard" subtitle="Personal bests, milestones, and badge unlocks" />

      <RecordsPanel records={flattened} />

      <Card>
        <CardHeader>
          <CardTitle>Achievement badges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement) => (
            <AchievementUnlockCard
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              unlockedAt={achievement.unlockedAt.toISOString()}
            />
          ))}
          {achievements.length === 0 ? (
            <p className="text-sm text-foreground/70">No achievements unlocked yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
