"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BillingActionsProps {
  hasActiveSubscription: boolean;
}

async function postToBilling(url: string) {
  const response = await fetch(url, {
    method: "POST"
  });
  const json = (await response.json()) as { data?: { url?: string }; error?: string };

  if (!response.ok || json.error || !json.data?.url) {
    throw new Error(json.error ?? "Unable to start billing flow");
  }

  window.location.href = json.data.url;
}

export function BillingActions({ hasActiveSubscription }: BillingActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      await postToBilling(hasActiveSubscription ? "/api/subscriptions/portal" : "/api/subscriptions/checkout");
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Billing failed");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button className="w-full" onClick={handleCheckout} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {hasActiveSubscription ? "Manage billing" : "Upgrade to Pro"}
      </Button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
