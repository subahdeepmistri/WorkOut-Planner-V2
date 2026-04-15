import { PlanTier } from "@/types/domain";
import { featureGateMap, freePlanLimits } from "@/config/features";

export function hasFeatureAccess(tier: PlanTier, feature: keyof typeof featureGateMap) {
  const requiredTier = featureGateMap[feature];

  if (!requiredTier) {
    return true;
  }

  if (requiredTier === "FREE") {
    return true;
  }

  return tier === "PRO";
}

export function canViewHistory(tier: PlanTier, daysAgo: number) {
  if (tier === "PRO") {
    return true;
  }

  return daysAgo <= freePlanLimits.historyDays;
}
