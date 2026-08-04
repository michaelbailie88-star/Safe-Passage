# Safe Passage

**The Lighthouse for Men Navigating Life's Storms.**

Safe Passage is a mission-driven startup whose first product is a digital platform designed to help men navigate life's storms through mental wellness, fatherhood support, accountability, and personal growth.

This is not simply a mental health application. It is a trusted ecosystem where men can rebuild themselves, reconnect with purpose, strengthen relationships, and find guidance during difficult seasons of life.

The long-term vision extends beyond software into education, community, events, coaching, corporate wellness, publishing, and strategic partnerships.

> **North Star Principle:** No man should have to navigate life's storms alone.

---

## Founder Brief & Startup Blueprint (v1.0)

Full documentation is organized by page/section in [`/docs`](./docs):

| # | Section |
|---|---------|
| 1 | [Executive Summary](./docs/01-executive-summary.md) |
| 2 | [Mission](./docs/02-mission.md) |
| 3 | [The Problem](./docs/03-the-problem.md) |
| 4 | [The Solution](./docs/04-the-solution.md) |
| 5 | [Target Audience](./docs/05-target-audience.md) |
| 6 | [Business Model](./docs/06-business-model.md) |
| 7 | [Technology](./docs/07-technology.md) |
| 8 | [Architecture](./docs/08-architecture.md) |
| 9 | [Product Roadmap](./docs/09-product-roadmap.md) |
| 10 | [Success Criteria](./docs/10-success-criteria.md) |
| 11 | [Non-Negotiables (Appendix)](./docs/11-non-negotiables.md) |
| 12 | [Final Instruction to CTO.new](./docs/12-final-instruction-to-cto.md) |

## Repo Structure

```
safe-passage/
├── apps/
│   ├── web/          # Main responsive web application (Next.js)
│   └── admin/         # Admin dashboard
├── packages/
│   ├── ui/            # Shared component library
│   ├── auth/          # Authentication logic
│   ├── database/       # Supabase/DB schema + client
│   ├── api/            # Shared API layer
│   ├── hooks/          # Shared React hooks
│   ├── types/          # Shared TypeScript types
│   └── utils/          # Shared utilities
├── docs/               # Founder brief, blueprint, product docs
├── public/             # Static assets
├── scripts/            # Build/dev/deploy scripts
├── tests/              # Test suites
└── .github/            # CI/CD workflows
```

## Tech Stack

Next.js · React · TypeScript · TailwindCSS · Supabase · Stripe · Resend · Cloudflare · Vercel

See [Technology](./docs/07-technology.md) and [Architecture](./docs/08-architecture.md) for details.

## Status

📋 Blueprint stage — scaffold only. No application code has been written yet. See [Product Roadmap](./docs/09-product-roadmap.md) for build phases.
