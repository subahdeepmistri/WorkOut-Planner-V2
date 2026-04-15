# WorkOut-Planner-V2

Premium workout tracking SaaS/mobile-ready app built on Next.js 15, TypeScript, Tailwind, Zustand, Supabase, PostgreSQL, Prisma, and Stripe.

## Setup

```bash
npm install
cp .env.example .env.local
npx prisma migrate dev --name init
npm run dev
```

## Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind + shadcn-style component library
- Zustand state management
- Framer Motion interactions
- Supabase auth/session integration
- Prisma + PostgreSQL
- Stripe subscriptions
- PWA + offline queue

Architecture documentation: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
