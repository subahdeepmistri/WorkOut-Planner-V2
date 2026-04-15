import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "@/components/layout/settings-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireServerViewer } from "@/lib/auth";
import { getSettingsData } from "@/server/services/workout-query-service";

export default async function SettingsPage() {
  const viewer = await requireServerViewer();
  const data = await getSettingsData(viewer.profile.id);

  return (
    <div className="space-y-4 pb-20">
      <PageHeader title="Settings" subtitle="Preferences, notifications, and account controls" action={<ThemeToggle />} />

      <SettingsForm
        initial={{
          notifications: data.settings?.notifications ?? true,
          emailNotifications: data.settings?.emailNotifications ?? true,
          hapticFeedback: data.settings?.hapticFeedback ?? true,
          autoLockWorkout: data.settings?.autoLockWorkout ?? false,
          restTimerDefaultSec: data.settings?.restTimerDefaultSec ?? 90
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Plan status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Current plan: <strong>{data.subscription?.tier ?? "FREE"}</strong>
          </p>
          <p>
            Billing status: <strong>{data.subscription?.status ?? "TRIALING"}</strong>
          </p>
        </CardContent>
      </Card>

      <SignOutButton />
    </div>
  );
}
