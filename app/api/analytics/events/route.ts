import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.eventName || !body.category) {
    return fail("eventName and category are required.");
  }

  const event = await prisma.analyticsEvent.create({
    data: {
      userId: body.userId ?? null,
      sessionId: body.sessionId ?? null,
      eventName: body.eventName,
      category: body.category,
      properties: body.properties ?? {}
    }
  });

  return ok(event, { status: 201 });
}
