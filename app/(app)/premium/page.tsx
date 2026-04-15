import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import { requireServerViewer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateProgressionSuggestions } from "@/modules/workout/server/progression-service";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PremiumPage() {
  const viewer = await requireServerViewer();
  const [suggestions, streak, achievements] = await Promise.all([
    generateProgressionSuggestions(viewer.profile.id),
    prisma.streak.findUnique({ where: { userId: viewer.profile.id } }),
    prisma.achievement.findMany({
      where: {
        userId: viewer.profile.id
      },
      orderBy: {
        unlockedAt: "desc"
      },
      take: 4
    })
  ]);

  return (
    <div className="space-y-4 pb-20">
      <PageHeader title="Premium Features" subtitle="AI progression, streak intelligence, and milestone automation" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Progressive overload AI suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {suggestions.map((suggestion) => (
            <div key={suggestion.exerciseId} className="rounded-lg border border-border/60 px-3 py-2">
              <p className="text-sm font-semibold">{suggestion.exerciseName}</p>
              <p className="text-sm text-foreground/75">{suggestion.reason}</p>
            </div>
          ))}
          {suggestions.length === 0 ? (
            <p className="text-sm text-foreground/70">No suggestion yet. Complete more workouts for pattern detection.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Streak and discipline scoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/75">
            Current streak: <strong>{streak?.currentDays ?? 0}</strong> days · Longest streak: {streak?.longestDays ?? 0} days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-secondary" />
            Plateau and recovery warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/75">
            Triggered automatically from session fatigue and stalled progression. Warning thresholds are adaptive.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent unlocks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="rounded-lg border border-border/60 px-3 py-2">
              <p className="text-sm font-semibold">{achievement.title}</p>
              <p className="text-xs text-foreground/70">{achievement.description}</p>
            </div>
          ))}
          {achievements.length === 0 ? <p className="text-sm text-foreground/70">No unlocks yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
