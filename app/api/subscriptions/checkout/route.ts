import Stripe from "stripe";
import { requireServerViewer } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { env } from "@/lib/env.server";
import { prisma } from "@/lib/prisma";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

export async function POST() {
  const viewer = await requireServerViewer();

  if (!stripe || !process.env.STRIPE_PRO_PRICE_ID) {
    return fail("Stripe is not configured.", 500);
  }

  const subscription = await prisma.subscription.upsert({
    where: { userId: viewer.profile.id },
    create: {
      userId: viewer.profile.id,
      tier: "FREE",
      status: "TRIALING"
    },
    update: {}
  });

  const customer = subscription.stripeCustomerId
    ? { id: subscription.stripeCustomerId }
    : await stripe.customers.create({
        email: viewer.profile.email,
        metadata: {
          userId: viewer.profile.id
        }
      });

  if (!subscription.stripeCustomerId) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { stripeCustomerId: customer.id }
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1
      }
    ],
    success_url: `${env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/billing?status=success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/billing?status=cancelled`,
    allow_promotion_codes: true,
    metadata: {
      userId: viewer.profile.id
    }
  });

  return ok({ url: session.url });
}
