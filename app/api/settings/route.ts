import { prisma } from "@/lib/prisma";
import { requireServerViewer } from "@/lib/auth";
import { ok } from "@/lib/http";

export async function GET() {
  const viewer = await requireServerViewer();

  const settings = await prisma.settings.upsert({
    where: { userId: viewer.profile.id },
    create: { userId: viewer.profile.id },
    update: {}
  });

  return ok(settings);
}

export async function PATCH(request: Request) {
  const viewer = await requireServerViewer();
  const body = await request.json();

  const settings = await prisma.settings.upsert({
    where: { userId: viewer.profile.id },
    create: {
      userId: viewer.profile.id,
      theme: body.theme ?? "SYSTEM",
      weightUnit: body.weightUnit ?? "KG",
      notifications: body.notifications ?? true,
      emailNotifications: body.emailNotifications ?? true,
      hapticFeedback: body.hapticFeedback ?? true,
      autoLockWorkout: body.autoLockWorkout ?? false,
      restTimerDefaultSec: body.restTimerDefaultSec ?? 90
    },
    update: {
      theme: body.theme,
      weightUnit: body.weightUnit,
      notifications: body.notifications,
      emailNotifications: body.emailNotifications,
      hapticFeedback: body.hapticFeedback,
      autoLockWorkout: body.autoLockWorkout,
      restTimerDefaultSec: body.restTimerDefaultSec
    }
  });

  return ok(settings);
}
