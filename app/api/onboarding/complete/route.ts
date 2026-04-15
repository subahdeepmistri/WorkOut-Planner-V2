import { prisma } from "@/lib/prisma";
import { requireServerViewer } from "@/lib/auth";
import { ok } from "@/lib/http";

export async function POST() {
  const viewer = await requireServerViewer();

  await prisma.settings.upsert({
    where: {
      userId: viewer.profile.id
    },
    create: {
      userId: viewer.profile.id
    },
    update: {}
  });

  await prisma.analyticsEvent.create({
    data: {
      userId: viewer.profile.id,
      eventName: "onboarding_completed",
      category: "engagement"
    }
  });

  return ok({ completed: true });
}
