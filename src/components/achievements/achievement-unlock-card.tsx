import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AchievementUnlockCardProps {
  title: string;
  description: string;
  unlockedAt: string;
}

export function AchievementUnlockCard({ title, description, unlockedAt }: AchievementUnlockCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          {title}
          <Badge tone="success">Unlocked</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/70">{description}</p>
        <p className="mt-2 text-xs text-foreground/60">{new Date(unlockedAt).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
}
