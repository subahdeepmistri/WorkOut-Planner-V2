import { PageHeader } from "@/components/layout/page-header";
import { PlanCard } from "@/components/subscription/plan-card";
import { BillingActions } from "@/components/subscription/billing-actions";
import { requireServerViewer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BillingPage() {
  const viewer = await requireServerViewer();
  const subscription = await prisma.subscription.findUnique({
    where: {
      userId: viewer.profile.id
    }
  });

  const active = subscription?.tier === "PRO" && subscription?.status === "ACTIVE";

  return (
    <div className="space-y-4 pb-20">
      <PageHeader title="Billing & Plans" subtitle="Free vs Pro gating, Stripe billing, and startup-ready monetization" />

      <div className="grid gap-3 md:grid-cols-2">
        <PlanCard
          name="Free"
          price="$0"
          features={["7-day history", "Basic stats", "Manual tracking"]}
          ctaText="Current baseline"
          onSelect={() => undefined}
        />
        <PlanCard
          name="Pro"
          price="$19/mo"
          highlighted
          features={[
            "Unlimited history",
            "Advanced records",
            "AI suggestions",
            "Progression analytics",
            "Export reports"
          ]}
          ctaText={active ? "Manage plan" : "Upgrade now"}
          onSelect={() => undefined}
        />
      </div>

      <BillingActions hasActiveSubscription={Boolean(active)} />
    </div>
  );
}
