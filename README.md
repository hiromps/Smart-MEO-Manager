# Smart MEO Manager

Googleビジネスプロフィール運用を効率化する BtoB SaaS の初期 scaffold。

## Current status
- docs-first scaffold completed
- Prisma schema drafted
- dashboard/reviews/locations/templates UI skeleton pending or in progress

## Source of truth
See `GEMINI.md` and files under `docs/`.

## Stack
- Next.js App Router
- Tailwind + shadcn/ui
- Neon PostgreSQL
- Prisma
- Clerk
- Resend
- Stripe
- Cloudflare R2
- PostHog
- Sentry
- Vercel
- FastAPI only for Python-required workloads

## Important rules
- pnpm only
- Clerk is the auth source of truth
- Stripe webhook is the billing source of truth
- automatic AI reply posting is forbidden
