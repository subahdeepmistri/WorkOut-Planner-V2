import { createHash } from "crypto";
import { requireServerViewer } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const viewer = await requireServerViewer();

  const backups = await prisma.cloudBackup.findMany({
    where: {
      userId: viewer.profile.id
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 20
  });

  return ok(backups);
}

export async function POST(request: Request) {
  const viewer = await requireServerViewer();
  const body = await request.json();

  if (!body.payload) {
    return fail("Backup payload is required.");
  }

  const raw = JSON.stringify(body.payload);
  const checksum = createHash("sha256").update(raw).digest("hex");
  const storagePath = `backups/${viewer.profile.id}/${Date.now()}.json`;

  const backup = await prisma.cloudBackup.create({
    data: {
      userId: viewer.profile.id,
      storagePath,
      checksum,
      sizeBytes: raw.length
    }
  });

  return ok(backup, { status: 201 });
}
