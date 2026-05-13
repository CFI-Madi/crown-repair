# Crown Repair — Planning Package

> **Working brand name:** Crown Repair. To be confirmed in [`09-open-questions.md`](./09-open-questions.md). All other docs refer to "Crown Repair" as a placeholder; once a final name is locked, a single search-and-replace finishes the rename.

This directory contains the full pre-build planning package for the Crown Repair phone/device repair marketplace. Read these documents BEFORE any application code is written.

## What this is

Crown Repair is a two-sided marketplace web platform for phone, tablet, and device repair, launching in Charlotte NC + surrounding metro (Concord, Gastonia, Rock Hill, Huntersville, Matthews, Kannapolis). Customers (D2C + B2B) book repairs on our site; vetted partner shops fulfill them. We own the brand, warranty, customer relationship, and pricing. Positioning is premium and trustworthy — explicitly not discount/coupon.

## How to read this package

Read in this order. Each doc takes 5-15 minutes.

| # | Document | Read first if you want to understand... |
|---|---|---|
| 01 | [Product Scope](./01-product-scope.md) | What we're building, what we're not building, and when |
| 02 | [Information Architecture](./02-information-architecture.md) | The full sitemap and URL structure |
| 03 | [Booking Flow Spec](./03-booking-flow-spec.md) | The most load-bearing user journey — every screen, every state |
| 04 | [Data Model](./04-data-model.md) | Entities, relationships, idempotency strategy |
| 05 | [Component Inventory](./05-component-inventory.md) | UI components by atomic-design level |
| 06 | [Design System](./06-design-system.md) | Color, type, spacing, motion tokens |
| 07 | [Tech Stack Recommendation](./07-tech-stack-recommendation.md) | The BOM and the reasoning behind every choice |
| 08 | [Build Phases](./08-build-phases.md) | Phase 0 → 0.1 → 0.5 → 1.0 → 1.x with gates |
| 09 | [Open Questions](./09-open-questions.md) | Decisions only the founder can make |
| 10 | [SEO & Local Presence](./10-seo-and-local-presence.md) | Launch-week local SEO discipline |

## Phasing summary

- **Phase 0** — Foundations (week 1-2). Domain, design system, staging, brand identity.
- **Phase 0.1** — Prototype site (weeks 3-6). High-fidelity marketing site + clickable non-functional booking funnel. Used for partner walkthroughs.
- **Phase 0.5** — Working transactional MVP (weeks 7-16). Real bookings, payments, shop fulfillment.
- **Phase 1.0** — B2B portal + admin polish (weeks 17-24). School districts and ops loops at production quality.
- **Phase 1.x** — Deferred (SSO, mobile native, mail-in, etc.).

## Key decisions already locked in

- **Fulfillment**: In-shop drop-off (D2C primary) + on-site/mobile (B2B fleets primary). No mail-in for MVP.
- **Stack**: Next.js (App Router) + TypeScript + Postgres (Neon) + Clerk + Stripe Connect Express + Vercel + Inngest. Full BOM in `07`.
- **B2B v1.0 scope**: Mid-tier portal (per-org dashboard, employee submissions, repair history, monthly PDF invoicing, manual sales-led onboarding) + bulk CSV upload for school districts. No SSO. See `01` and `08`.
- **Build context**: Founder is non-technical and directs AI agents; the stack is chosen for maximum LLM training-data coverage and minimum bespoke infrastructure.

## Conventions used in these docs

- **Files** use kebab-case (`some-page.tsx`), **routes** lowercase + hyphens (`/services/screen-replacement`).
- **IDs** are short prefixed nanoids: `ord_…` (order), `shp_…` (shop), `biz_…` (business), `pmt_…` (payment), `evt_…` (order event), `cns_…` (consent).
- **Money** is always integer cents in code and DB; never floats.
- **Timestamps** stored UTC; rendered in customer-local time based on the customer's address timezone.
- **Cross-references** use backtick-number notation (e.g., "see `04`") to refer to the doc by number.
- **TBDs** all live in `09-open-questions.md` — other docs reference them by name (e.g., "the platform fee % is TBD in `09`").

## What to do after reading this package

1. Answer as many questions in `09-open-questions.md` as you can today. Every answered question unblocks part of the build.
2. Lock the brand name (or accept "Crown Repair" as final).
3. Buy the domain (DNS via Cloudflare per `07`).
4. Approve the design direction in `06` (or push back on color/type — easy to revise here, expensive to revise later).
5. Walk through `03-booking-flow-spec.md` end-to-end mentally as a customer. If anything feels off, fix it in the doc before code is written.
6. Confirm Phase 0 and 0.1 timeline (`08`) is realistic given any external constraints (school district sales calendar, photography availability, etc.).

Then we start Phase 0.
