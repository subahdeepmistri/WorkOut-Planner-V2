import Stripe from "stripe";
import { headers } from "next/headers";
import { env } from "@/lib/env.server";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/http";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

export async function POST(request: Request) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return fail("Stripe webhook is not configured.", 500);
  }

  const payload = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return fail("Missing stripe signature.", 400);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return fail("Invalid webhook signature.", 400);
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = String(subscription.customer);

    await prisma.subscription.updateMany({
      where: {
        stripeCustomerId: customerId
      },
      data: {
        tier: "PRO",
        status: subscription.status === "active" ? "ACTIVE" : "PAST_DUE",
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.billing_cycle_anchor * 1000),
        currentPeriodEnd: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = String(subscription.customer);

    await prisma.subscription.updateMany({
      where: {
        stripeCustomerId: customerId
      },
      data: {
        tier: "FREE",
        status: "CANCELED",
        cancelAtPeriodEnd: true
      }
    });
  }

  return ok({ received: true });
}
