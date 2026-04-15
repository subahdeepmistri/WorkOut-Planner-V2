import { PlanTier } from "@/types/domain";

export const featureGateMap: Record<string, PlanTier> = {
  unlimitedHistory: "PRO",
  advancedRecords: "PRO",
  aiSuggestions: "PRO",
  exportReports: "PRO",
  progressionAnalytics: "PRO"
};

export const freePlanLimits = {
  historyDays: 7,
  maxTemplates: 3
};
