"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OnboardingFlow() {
  const router = useRouter();

  async function completeOnboarding() {
    await fetch("/api/onboarding/complete", {
      method: "POST"
    });

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Let&apos;s set up your training stack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm text-foreground/80">
          <li>1. Pick your default training split and target volume.</li>
          <li>2. Enable autosave + offline mode for gym reliability.</li>
          <li>3. Connect notifications for streak and recovery prompts.</li>
          <li>4. Set your free/pro growth path and referral activation.</li>
        </ul>
        <Button onClick={completeOnboarding}>Complete onboarding</Button>
      </CardContent>
    </Card>
  );
}
