import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/stats/kpi-card";
import { ReferralPanel } from "@/components/subscription/referral-panel";
import { requireServerViewer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ReferralsPage() {
  const viewer = await requireServerViewer();

  const referralCode = await prisma.referralCode.upsert({
    where: {
      userId: viewer.profile.id
    },
    create: {
      userId: viewer.profile.id,
      code: Math.random().toString(36).slice(2, 10).toUpperCase()
    },
    update: {}
  });

  const conversions = await prisma.referralConversion.count({
    where: {
      referrerUserId: viewer.profile.id
    }
  });

  return (
    <div className="space-y-4 pb-20">
      <PageHeader title="Referral System" subtitle="Invite loop, conversion, and retention engine" />

      <div className="grid gap-3 sm:grid-cols-2">
        <KpiCard label="Total referrals" value={referralCode.totalUses.toString()} />
        <KpiCard label="Converted referrals" value={conversions.toString()} />
      </div>

      <ReferralPanel code={referralCode.code} />
    </div>
  );
}
