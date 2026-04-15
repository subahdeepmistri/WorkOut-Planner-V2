import { PageHeader } from "@/components/layout/page-header";
import { OnboardingFlow } from "@/components/layout/onboarding-flow";

export default function OnboardingPage() {
  return (
    <div className="space-y-4 pb-20">
      <PageHeader title="Onboarding" subtitle="Funnel-first setup for activation and retention" />
      <OnboardingFlow />
    </div>
  );
}
