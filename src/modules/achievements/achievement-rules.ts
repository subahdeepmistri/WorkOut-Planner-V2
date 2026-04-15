import { WorkoutSession } from "@/types/domain";

interface AchievementRule {
  code: string;
  title: string;
  description: string;
  icon: string;
  check: (ctx: { totalSessions: number; streakDays: number; session: WorkoutSession }) => boolean;
}

export const achievementRules: AchievementRule[] = [
  {
    code: "FIRST_BLOOD",
    title: "First Session",
    description: "Completed your first tracked workout.",
    icon: "spark",
    check: ({ totalSessions }) => totalSessions >= 1
  },
  {
    code: "COMMIT_7",
    title: "Seven Day Discipline",
    description: "Maintained a 7 day streak.",
    icon: "flame",
    check: ({ streakDays }) => streakDays >= 7
  },
  {
    code: "LOCKED_IN",
    title: "Locked In",
    description: "Finished a fully locked workout session.",
    icon: "lock",
    check: ({ session }) => session.status === "LOCKED"
  }
];
