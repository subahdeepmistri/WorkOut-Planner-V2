"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ReferralPanelProps {
  code: string;
}

export function ReferralPanel({ code }: ReferralPanelProps) {
  const [referralInput, setReferralInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function onRedeem(event: FormEvent) {
    event.preventDefault();

    const response = await fetch("/api/referrals/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: referralInput
      })
    });

    const json = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(json.error ?? "Unable to redeem code.");
      return;
    }

    setMessage("Referral applied. You unlocked bonus analytics trial time.");
    setReferralInput("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral system</CardTitle>
        <CardDescription>Share your code, invite users, and track conversion-ready growth.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-foreground/70">Your referral code</p>
          <p className="text-xl font-bold tracking-[0.14em] text-primary">{code}</p>
        </div>

        <form className="space-y-2" onSubmit={onRedeem}>
          <Input
            placeholder="Enter referral code"
            value={referralInput}
            onChange={(event) => setReferralInput(event.target.value.toUpperCase())}
          />
          <Button variant="outline" type="submit">
            Redeem code
          </Button>
        </form>

        {message ? <p className="text-sm text-foreground/80">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
