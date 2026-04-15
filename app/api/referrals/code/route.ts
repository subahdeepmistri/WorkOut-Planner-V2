import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireServerViewer } from "@/lib/auth";
import { ok } from "@/lib/http";

function buildCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function GET() {
  const viewer = await requireServerViewer();

  const referralCode = await prisma.referralCode.upsert({
    where: {
      userId: viewer.profile.id
    },
    create: {
      userId: viewer.profile.id,
      code: buildCode()
    },
    update: {}
  });

  return ok(referralCode);
}
