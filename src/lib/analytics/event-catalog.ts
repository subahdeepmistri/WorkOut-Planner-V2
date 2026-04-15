import { analyticsEvents } from "@/types/analytics";

export const analyticsEventCatalog = {
  [analyticsEvents.SESSION_STARTED]: {
    category: "workout",
    requiredProperties: ["sessionDate"]
  },
  [analyticsEvents.SESSION_COMPLETED]: {
    category: "workout",
    requiredProperties: ["durationSeconds", "totalVolumeKg"]
  },
  [analyticsEvents.SESSION_DISCARDED]: {
    category: "workout",
    requiredProperties: ["reason"]
  },
  [analyticsEvents.SET_COMPLETED]: {
    category: "workout",
    requiredProperties: ["exerciseId", "setNumber"]
  },
  [analyticsEvents.PR_UNLOCKED]: {
    category: "engagement",
    requiredProperties: ["exerciseId", "metric", "value"]
  },
  [analyticsEvents.STREAK_MILESTONE]: {
    category: "retention",
    requiredProperties: ["days"]
  },
  [analyticsEvents.ACHIEVEMENT_UNLOCKED]: {
    category: "engagement",
    requiredProperties: ["achievementCode"]
  },
  [analyticsEvents.FEATURE_GATE_HIT]: {
    category: "subscription",
    requiredProperties: ["feature"]
  },
  [analyticsEvents.BILLING_CHECKOUT_STARTED]: {
    category: "subscription",
    requiredProperties: ["tier"]
  },
  [analyticsEvents.BILLING_CONVERTED]: {
    category: "subscription",
    requiredProperties: ["tier", "priceId"]
  },
  [analyticsEvents.REFERRAL_SHARED]: {
    category: "retention",
    requiredProperties: ["channel"]
  },
  [analyticsEvents.REFERRAL_CONVERTED]: {
    category: "retention",
    requiredProperties: ["referrerUserId"]
  },
  [analyticsEvents.REPORT_EXPORTED]: {
    category: "engagement",
    requiredProperties: ["format"]
  },
  [analyticsEvents.APP_PWA_INSTALLED]: {
    category: "system",
    requiredProperties: []
  },
  [analyticsEvents.OFFLINE_SYNC_COMPLETED]: {
    category: "system",
    requiredProperties: ["itemCount"]
  }
} as const;
