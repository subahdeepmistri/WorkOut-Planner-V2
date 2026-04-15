# PulseForge Architecture

## 1) Production folder structure

- `app/`: Next.js 15 app router entries, authenticated route groups, API route handlers.
- `prisma/`: relational schema and migrations.
- `src/components/`: reusable UI, layout, charts, workout and subscription components.
- `src/state/`: Zustand app/session stores.
- `src/modules/`: feature modules for workout, analytics, subscriptions, achievements.
- `src/server/`: server-side services (founder metrics, query services).
- `src/lib/`: shared infrastructure (Prisma, Supabase, auth, env, PWA, offline queue).
- `src/types/`: domain models, analytics contracts, API types.

## 2) Frontend architecture

- App Router with route groups:
  - `(auth)`: sign-in/up + callback.
  - `(app)`: dashboard, session tracking, history, records, stats, settings, premium, billing, referrals, admin, reports.
- Design system: Tailwind + shadcn-style primitives in `src/components/ui`.
- State management: Zustand for active session tracking with debounced autosave.
- Animations: Framer Motion used for streak banners and extendable microinteractions.

## 3) Backend architecture

- Next.js API route handlers for BFF layer.
- Prisma ORM over PostgreSQL for strict domain modeling.
- Supabase Auth for session identity, with user profile upsert on first request.
- Stripe checkout + webhook processing for paid subscription lifecycle.

## 4) API route structure

- `GET/POST /api/workouts/templates`
- `GET/POST /api/workouts/sessions`
- `GET/PATCH/DELETE /api/workouts/sessions/:id`
- `POST /api/workouts/sessions/:id/sets`
- `POST /api/analytics/events`
- `GET /api/ai/progression`
- `POST /api/subscriptions/checkout`
- `POST /api/subscriptions/portal`
- `POST /api/subscriptions/webhook`
- `GET /api/referrals/code`
- `POST /api/referrals/redeem`
- `GET/POST /api/backups`
- `GET /api/founder/metrics`
- `GET/PATCH /api/settings`
- `POST /api/onboarding/complete`
- `GET /api/reports/export`

## 5) Database schema (Prisma)

Required tables implemented:

- `users`
- `workout_templates`
- `workout_sessions`
- `exercises`
- `exercise_sets`
- `session_stats`
- `personal_records`
- `achievements`
- `streaks`
- `body_focus_distribution`
- `settings`
- `subscriptions`

Additional startup scale tables:

- `analytics_events`
- `referral_codes`
- `referral_conversions`
- `cloud_backups`
- `email_notifications`

## 6) Authentication flow

1. User authenticates through Supabase email/password.
2. Callback exchanges auth code for session cookies.
3. Middleware refreshes session on each request.
4. `requireServerViewer()` guards protected routes.
5. User profile row is upserted in Prisma from Supabase identity.

## 7) Theme architecture

- CSS variables in `app/globals.css` for light and dark semantic tokens.
- `next-themes` + `ThemeProvider` for system/light/dark switching.
- Reusable utility classes (`glass-card`, chips, shadows) for premium visual consistency.

## 8) State management

- `useSessionStore`: active workout draft, set-level edits, autosave, offline queue fallback.
- `useAppStore`: plan tier, celebrations and global UX flags.

## 9) Component library system

- Base primitives in `src/components/ui`: button, card, input, tabs, dialog, progress, skeleton, badge.
- Feature components in domain folders (workout, charts, achievements, subscription).
- Mobile-first shell + fixed bottom nav for app-like UX.

## 10) Analytics event structure

- Canonical event constants in `src/types/analytics.ts`.
- Event catalog contract in `src/lib/analytics/event-catalog.ts` with category + required properties.
- Ingestion endpoint: `POST /api/analytics/events`.
- Founder metrics computed from event stream + subscription data.

## Phase coverage summary

- Phase 1: foundation complete.
- Phase 2: MVP screens + real-time autosave workflow implemented.
- Phase 3: premium features scaffolded (PR modal, streak UX, progression suggestions, dashboards).
- Phase 4: production polish baseline (theme modes, skeletons, transitions, error boundaries, PWA/offline, secure auth middleware).
- Phase 5: startup scale systems (Stripe billing, plan gating, onboarding, referrals, founder analytics, export/backups).

## Next execution steps

1. `npm install`
2. `npx prisma migrate dev --name init`
3. `npm run dev`
4. connect Supabase + Stripe env vars
5. run Lighthouse tuning and production deployment checks
