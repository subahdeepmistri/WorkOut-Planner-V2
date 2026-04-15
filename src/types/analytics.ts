export const analyticsEvents = {
  SESSION_STARTED: "session_started",
  SESSION_COMPLETED: "session_completed",
  SESSION_DISCARDED: "session_discarded",
  SET_COMPLETED: "set_completed",
  PR_UNLOCKED: "pr_unlocked",
  STREAK_MILESTONE: "streak_milestone",
  ACHIEVEMENT_UNLOCKED: "achievement_unlocked",
  FEATURE_GATE_HIT: "feature_gate_hit",
  BILLING_CHECKOUT_STARTED: "billing_checkout_started",
  BILLING_CONVERTED: "billing_converted",
  REFERRAL_SHARED: "referral_shared",
  REFERRAL_CONVERTED: "referral_converted",
  REPORT_EXPORTED: "report_exported",
  APP_PWA_INSTALLED: "app_pwa_installed",
  OFFLINE_SYNC_COMPLETED: "offline_sync_completed"
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export interface AnalyticsPayload {
  userId?: string;
  sessionId?: string;
  eventName: AnalyticsEventName;
  category: "workout" | "engagement" | "subscription" | "retention" | "system";
  properties?: Record<string, unknown>;
}
