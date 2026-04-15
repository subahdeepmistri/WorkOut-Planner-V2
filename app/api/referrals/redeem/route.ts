import { prisma } from "@/lib/prisma";
import { requireServerViewer } from "@/lib/auth";
import { fail, ok } from "@/lib/http";

export async function POST(request: Request) {
  const viewer = await requireServerViewer();
  const body = await request.json();
  const rawCode = String(body.code ?? "").trim().toUpperCase();

  if (!rawCode) {
    return fail("Referral code is required.");
  }

  const referral = await prisma.referralCode.findUnique({
    where: {
      code: rawCode
    }
  });

  if (!referral || referral.userId === viewer.profile.id) {
    return fail("Invalid referral code.", 404);
  }

  await prisma.$transaction([
    prisma.referralConversion.upsert({
      where: {
        referrerUserId_referredUserId: {
          referrerUserId: referral.userId,
          referredUserId: viewer.profile.id
        }
      },
      create: {
        referrerUserId: referral.userId,
        referredUserId: viewer.profile.id
      },
      update: {}
    }),
    prisma.referralCode.update({
      where: {
        id: referral.id
      },
      data: {
        totalUses: {
          increment: 1
        }
      }
    })
  ]);

  return ok({ redeemed: true });
}
