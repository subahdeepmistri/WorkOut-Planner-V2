import Stripe from "stripe";
import { env } from "@/lib/env.server";
import { requireServerViewer } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

export async function POST() {
  const viewer = await requireServerViewer();

  if (!stripe) {
    return fail("Stripe not configured.", 500);
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: viewer.profile.id }
  });

  if (!subscription?.stripeCustomerId) {
    return fail("No Stripe customer found.", 404);
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/billing`
  });

  return ok({ url: portal.url });
}
