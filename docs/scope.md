```markdown
# Scope: Smart MEO Manager

## Project Overview
**Smart MEO Manager** is a BtoB SaaS designed to streamline Google Business Profile (GBP) operations. It is targeted at restaurant operators, multi-store businesses, and MEO (Map Engine Optimization) agencies. The platform centralizes review management, leverages AI to draft responses, and provides comprehensive MEO analytics, all within a secure, multi-tenant architecture.

## Tech Stack & Constraints
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** Neon PostgreSQL, Prisma ORM
- **Authentication & Multi-tenancy:** Clerk (Organizations)
- **Emails:** Resend
- **Payments:** Stripe
- **Storage:** Cloudflare R2
- **Analytics & Monitoring:** PostHog, Sentry
- **Hosting:** Vercel
- **Backend (Python Workloads):** FastAPI (Restricted strictly to Python-required tasks)
- **Package Manager:** pnpm (Strictly required)

## In Scope
- **Multi-Tenant Architecture:** Organization-based tenant separation using Clerk.
- **Role-Based Access Control (RBAC):** Three distinct roles: `ADMIN`, `MEMBER`, and `READONLY`.
- **Google Business Profile Integration:** OAuth flow to connect and sync GBP locations and reviews.
- **Review Management:** Centralized list of reviews with filtering (by rating, date, reply status) and reply state tracking.
- **AI Reply Generation:** Automated drafting of review responses using AI based on review sentiment and context.
- **Human Approval Workflow:** Mandatory human-in-the-loop review process for AI drafts (Draft -> Approve -> Publish).
- **Template Management:** Create, store, and manage standardized reply templates.
- **KPI Dashboard & Analytics:** Store-specific MEO performance tracking, review metrics, and aggregate dashboards.
- **Notification System:** Alerts and status notifications.

## Out of Scope
- **Fully Automated Replies:** Direct auto-posting of AI-generated replies without human approval is explicitly prohibited.
- **Non-GBP Platforms:** Integration with other review sites or social media platforms (e.g., Yelp, TripAdvisor, Instagram, Facebook).
- **Complex Profile Editing:** Full GBP profile management (e.g., updating business hours, photos, or attributes) beyond MEO review and KPI functions.
- **Mobile Application:** Native iOS/Android apps (the web app will be fully responsive instead).

## MVP Milestones
- **Milestone 1: Foundation & Auth**
  - Next.js setup with `pnpm`, Tailwind, and shadcn/ui.
  - Clerk integration for authentication and Organization (tenant) management.
  - Database schema setup (Neon + Prisma) for users, tenants, roles, and basic entities.
- **Milestone 2: GBP Integration**
  - Google OAuth integration.
  - Fetching and syncing managed locations and their respective reviews.
- **Milestone 3: Review Hub & AI Workflow**
  - UI for review listing, filtering, and detail views.
  - Integration with AI for drafting replies.
  - Implementation of the human approval flow and direct posting to GBP.
  - Reply template CRUD.
- **Milestone 4: Dashboard & Notifications**
  - MEO KPI Dashboard (metrics aggregation per store/tenant).
  - Notification triggers (Resend) for new reviews and required approvals.
- **Milestone 5: Monetization & Monitoring**
  - Stripe integration for SaaS billing (subscriptions).
  - PostHog and Sentry integration for product analytics and error tracking.

## Deferred Features (Post-MVP)
- Advanced competitor tracking and comparative analytics.
- Bulk reply operations and mass template assignments.
- Integration of a dedicated Python/FastAPI microservice for advanced natural language processing or heavy data-science workloads.
- Scheduled review response publishing.
- Advanced custom report generation and export formats.
```
