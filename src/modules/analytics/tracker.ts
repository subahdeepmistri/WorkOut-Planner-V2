"use client";

import { AnalyticsPayload } from "@/types/analytics";

export async function trackEvent(payload: AnalyticsPayload) {
  try {
    await fetch("/api/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch {
    // Analytics should never break UX.
  }
}
