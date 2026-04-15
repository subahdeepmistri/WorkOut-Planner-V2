export const appRoutes = {
  dashboard: "/dashboard",
  session: "/session/new",
  history: "/history",
  records: "/records",
  stats: "/stats",
  premium: "/premium",
  referrals: "/referrals",
  billing: "/billing",
  settings: "/settings",
  admin: "/admin"
} as const;

export const authRoutes = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  callback: "/auth/callback"
} as const;
