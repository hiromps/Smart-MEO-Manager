# Project: Next.js + Clerk + Neon SaaS

## Tech Stack
- Next.js App Router
- Clerk for authentication
- Neon Postgres
- Prisma ORM
- shadcn/ui
- Vercel deployment

## Default Architecture Rules
- Always prefer App Router patterns.
- Always use Clerk as the source of truth for authentication.
- Use Neon Postgres as the primary relational database.
- Use Prisma for schema and database access.
- Design for multi-tenant SaaS from the beginning.
- Enforce API security best practices on all route handlers and server actions.
- Prefer server-side patterns for sensitive auth and data operations.
- Avoid client-side exposure of secrets or privileged logic.

## Preferred Skills
When relevant, prioritize these skills:
- nextjs-app-router-patterns
- clerk-auth
- neon-postgres
- database-design
- auth-implementation-patterns
- prisma-expert
- backend-architect
- api-security-best-practices
- saas-multi-tenant

Use these when needed:
- postgres-best-practices
- vercel-deployment
- shadcn

## Build Priorities
1. Secure auth foundation
2. Multi-tenant data model
3. Clean backend boundaries
4. Production-ready deployment structure
5. Maintainable UI components