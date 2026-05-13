# 07 — Tech Stack Recommendation

## The overriding constraint

You are non-technical and will direct AI agents to build the code. That constraint dominates every choice in this BOM. The stack must satisfy three properties:

1. **Heavily represented in LLM training data.** AI agents write better code in technologies they've seen ten million times than in obscure ones. We pick the most-trained options at every layer.
2. **Managed services for everything load-bearing.** Auth, payments, DB, email, hosting — all delegated to providers with strong SDKs and webhook patterns. Bespoke infrastructure is the enemy of an AI-built product.
3. **Convention over configuration.** Frameworks and tools that have one obvious right way to do things, not ten valid choices. Less for an AI to argue with itself about, more code that matches mainline patterns.

This produces a boring, predictable, deeply-supported stack. That's the point.

---

## The full BOM

| Layer | Choice | Role |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | Pages, API routes, server actions, SSR/SSG |
| Styling | **Tailwind CSS** + **shadcn/ui** | Utility-first styling + owned component primitives |
| Type validation | **Zod** | Single schema for client + server validation |
| Forms | **React Hook Form** | Form state management |
| Database | **Postgres on Neon** | Serverless Postgres, branch-per-PR |
| ORM | **Prisma** | Schema-first ORM, AI-friendly migrations |
| Auth | **Clerk** | User mgmt, organizations (B2B!), multi-role, hosted UI |
| Payments | **Stripe Connect Express** | D2C charges, partner KYC + payouts |
| Email | **Resend** + **React Email** | Transactional email, TS-native templates |
| SMS | **Twilio Programmable Messaging** | Status updates (A2P 10DLC required) |
| File storage | **Vercel Blob** | CSV uploads, contract PDFs, generated invoices |
| Maps & addresses | **Google Maps Platform** | Places autocomplete, geocoding, static maps |
| Background jobs | **Inngest** | Durable workflows, webhook fan-in, scheduled jobs |
| Analytics + flags | **PostHog** | Product analytics, feature flags, session replay |
| Error tracking | **Sentry** | Frontend + server error capture |
| CMS (v0.1) | **MDX in repo** | Marketing content under version control |
| CMS (v1.x+) | **Sanity** (if content team grows) | Structured editorial content |
| Hosting | **Vercel** | Edge + serverless, preview deploys, image optim |
| DNS / WAF / CDN edge | **Cloudflare** | DNS, bot mitigation, cache rules |
| Search (v0.5) | **Postgres full-text** | Device + repair search; sufficient at MVP scale |
| Search (v1.x+ if needed) | **Algolia** | Add later if search becomes a primary surface |
| Observability | **Vercel Analytics** + **Sentry** + **PostHog** | Web vitals, errors, product analytics — three lanes |
| Repo + CI | **GitHub** + **GitHub Actions** + Vercel previews | Standard pipeline |

---

## Detail per choice

### Next.js 15 (App Router) + TypeScript

**Why:** The heaviest LLM-training-data Web framework on the planet. AI agents write Next.js + Tailwind code more accurately than any other stack combo, because of sheer corpus volume on GitHub, Stack Overflow, and YouTube.

**Concrete benefits for Crown Repair:**
- SSR for marketing pages → strong local SEO out of the box (see `10`)
- Server Actions reduce the API surface — fewer endpoints to design, fewer bugs to introduce
- Middleware handles role-gated routes (`/account/*`, `/shop/*`, `/admin/*`, `/b2b/dashboard/*`) at the edge before page render
- App Router's nested layouts perfectly match our 5 navigation variants (`02`)
- Vercel deployment is one-click

**TypeScript** is non-negotiable. AI-written code is much safer when the type system catches mistakes at edit time.

### Tailwind CSS + shadcn/ui

**Why Tailwind:** Same logic as Next.js — utility-first styling is the most-trained CSS pattern. AI agents apply tokens correctly when they're spelled `bg-accent` instead of `background-color: var(--color-accent)` in a separate file.

**Why shadcn/ui (not Material UI / Chakra / Mantine):**
- shadcn components are **copied into our repo**, not imported. We own them. They're restyled to match `06` once, then live in `src/components/ui/` like our own code.
- Built on Radix UI primitives → accessibility (keyboard nav, ARIA) is correct by default
- No runtime cost beyond what we use
- Heavily trained — most React component examples in the AI corpus follow shadcn patterns now

### Zod + React Hook Form

**Why:** Validate once, use everywhere. A `BookingFormSchema` defined in Zod is the source of truth for client-side validation (React Hook Form's resolver), server-side validation (Server Actions and API routes), and TypeScript types (`z.infer<typeof BookingFormSchema>`). One schema. No drift.

This pattern is heavily trained — AI agents pick it up easily.

### Postgres on Neon

**Why Postgres:** the obvious choice. Strong constraints, JSONB for flexibility, mature ecosystem, every ORM supports it well.

**Why Neon specifically:**
- Serverless Postgres — auto-pauses when idle (saves money in early days)
- **Database branching** — each PR gets an ephemeral DB branch; integrates natively with Vercel Preview Deploys. This is purpose-built for AI-assisted dev: every change is testable in isolation against a fresh DB without seeding ceremony
- Generous free tier; pricing scales sensibly
- Built on standard Postgres — easy to migrate off if Neon disappears (very low lock-in)

**Alternatives considered:**
- Supabase: tempting because of bundled auth + storage, but Clerk's B2B organization features beat Supabase Auth's for our exact use case
- Self-hosted on Railway/Fly: ops burden you can't carry
- PlanetScale: was great, but went MySQL-only and we want PostgreSQL features

### Prisma

**Why:** Best TypeScript ergonomics of any ORM. Schema-first migrations (one `schema.prisma` file is the source of truth for the DB shape and the generated client). AI agents understand Prisma migrations more reliably than they understand raw SQL migrations or Drizzle's schema-as-code pattern.

**Trade-offs we accept:**
- Slightly slower query performance than Drizzle (negligible at our scale)
- Generated client is large (acceptable; Vercel handles bundling fine)

### Clerk

**Why Clerk over Auth.js / Lucia / Supabase Auth:**
- **Built-in organizations** — Clerk's `Organization` concept maps 1:1 to our `Business` entity. Multi-user per org, role-based perms, invitation flow — all out of the box. Replicating this on Auth.js would be weeks of work and a source of bugs.
- Hosted sign-in / sign-up UI (we can theme it to match `06`) — zero auth UI to build
- Webhooks for user lifecycle (user.created, organization.created, etc.) → drive into our DB via Inngest
- Pre-built support for SSO later (Phase 1.x) — flip a switch when we're ready
- Multi-role support natural (customer, shop_staff, b2b_user, admin)

**Cost:** ~$25/mo until ~10K MAU, then it scales. Acceptable.

### Stripe Connect Express

**Why Stripe Connect (not Adyen, Square):**
- The marketplace pattern is what Connect is *for*. Hosted shop onboarding (KYC, payouts) means we don't handle sensitive identity docs or banking info ourselves.
- **Express** specifically (vs. Standard or Custom):
  - Express: Stripe hosts the entire shop dashboard for payouts; we don't need to build payout views
  - Standard: shops would create their own Stripe accounts and we'd connect — less control over our brand experience
  - Custom: we'd build the entire onboarding UI ourselves — way too much engineering

**For B2B invoicing**, we don't use Stripe at all — invoices are generated as PDFs and emailed (Phase 1.0; see `08`). Stripe Invoicing is an option later if we want hosted invoice payment, but not in v1.0.

### Resend + React Email

**Why:** TypeScript-native API; React-component-based email templates (live preview during dev, easy reuse of components like buttons + logo across emails); strong deliverability.

**Alternatives considered:**
- SendGrid: works but the templating story is worse and the API is verbose
- AWS SES: cheap but you'd build everything else (templating, retries, bounce handling)

### Twilio Programmable Messaging

**Why:** The default. Strong SDK, well-trained in AI corpus, reasonable pricing.

**Caveat:** **A2P 10DLC registration required** for sending business SMS in the US. 1-3 week processing time. Must be kicked off in Phase 0 (see `08`). Failing to register = blocked messages on major carriers.

### Vercel Blob

**Why:** Co-located with deploy; simple SDK; no separate bucket configuration. Used for CSV uploads, contract PDFs, generated invoice PDFs, partner shop photos.

**Alternatives considered:**
- S3 / R2: more powerful but adds another vendor and auth surface
- Supabase Storage: same answer as Supabase Auth — adds vendor without enough benefit

### Google Maps Platform

**Why:** Places autocomplete (booking step 6), geocoding (coverage gating), static maps (city pages, `/locations`).

**Why not Mapbox:** Mapbox is beautiful but Places coverage in suburban NC (Concord, Kannapolis) is weaker. Google's geocoding is more accurate for our specific market. We pay for it.

**Cost:** ~$200/mo free credit covers MVP usage easily; budget $50-150/mo at scale.

### Inngest

**Why durable workflows in general:**
- All async work in a marketplace is critical: payouts, webhook handling, invoice generation. Lost or duplicated execution = revenue loss or compliance issues.
- Inngest's model: events go in, functions handle them with built-in retries, exponential backoff, replay safety, observability dashboard, and dead-letter queue support.

**Why Inngest (not Trigger.dev, Temporal, Vercel Cron + Queues):**
- Trigger.dev is the close competitor; both work. Inngest's free tier is more generous and the docs are crisper for our patterns.
- Temporal is enterprise-grade but heavy for our scale
- Vercel Cron + Queues alone doesn't give us durable function execution; we'd have to invent the orchestration layer

**Locked in for ALL async work:** background jobs (invoice gen, payout reconciliation, reminders), webhook processing (Stripe, Twilio, Resend), scheduled tasks. No fork between "Cron for some things, Inngest for others." One tool, one mental model.

### PostHog

**Why:** Product analytics + feature flags + session replay in one tool. Self-hostable later if data sovereignty becomes a concern (school district contracts may demand this).

**Specific uses:**
- Funnel analytics (`03` step-transition events)
- Feature flags (every customer/shop-facing release ships behind a flag; see `08` testing strategy)
- Session replay for debugging real-customer issues
- Cohort + retention analysis post-launch

**Trade-off:** the free tier is generous (1M events/mo) but session replay quota is small. Budget $50-200/mo at scale.

### Sentry

**Why:** Industry standard. Catches frontend errors, server errors, transactions. Solid Next.js integration.

**Cost:** ~$26/mo at MVP scale.

### MDX in repo (v0.1 CMS)

**Why:** No CMS until we need one. Marketing pages live as `.mdx` files in the repo, edited by humans (or AI). Version-controlled, previewable in PRs, fast.

**When we upgrade to Sanity:** when there's a person (founder, ops lead, marketer) who needs to publish content WITHOUT a developer in the loop. Not before. Sanity is high quality but adds vendor + workflow overhead.

### Vercel + Cloudflare

**Why Vercel:**
- Built for Next.js (same company)
- Preview deploys per branch pair perfectly with Neon DB branches → every PR is fully testable
- Image optimization, edge network, serverless functions all integrated
- Generous free tier; Pro is $20/mo

**Why Cloudflare on top:**
- DNS management with a great UI
- Bot mitigation + basic WAF (free tier ample)
- We don't proxy traffic through Cloudflare for caching (Vercel handles that) — just DNS + edge protection

### Postgres full-text search (v0.5)

**Why:** sufficient for our scale. Device + brand + repair-category search runs against thousands of rows at most; Postgres `tsvector` + GIN indexes handle this in microseconds. No need for Algolia until search becomes a primary surface (it isn't for v0.5).

**When to add Algolia:** when search-driven discovery hits >10% of sessions and Postgres latency becomes user-perceived.

---

## Repository structure

```
crown-repair/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (marketing)/             # public marketing routes (grouped layout)
│   │   ├── (funnel)/                # booking funnel routes (`/book/*`)
│   │   ├── account/                 # customer dashboard
│   │   ├── shop/                    # partner shop dashboard
│   │   ├── b2b/                     # B2B portal + marketing
│   │   ├── admin/                   # admin
│   │   ├── api/
│   │   │   ├── webhooks/            # Stripe, Twilio, Resend webhooks
│   │   │   └── inngest/             # Inngest webhook entry
│   │   ├── layout.tsx               # root layout
│   │   └── globals.css              # design tokens + Tailwind base
│   ├── components/
│   │   ├── ui/                      # shadcn primitives (Button, Input, etc.)
│   │   ├── atoms/                   # custom atoms (Badge, IconSet, etc.)
│   │   ├── molecules/               # FormField, Card, etc.
│   │   ├── organisms/               # TopNav, ShopSelector, etc.
│   │   └── templates/               # MarketingLayout, FunnelLayout, etc.
│   ├── lib/
│   │   ├── db/                      # Prisma client + helpers
│   │   ├── auth/                    # Clerk helpers + middleware
│   │   ├── stripe/                  # Stripe SDK helpers
│   │   ├── inngest/                 # Inngest client + functions
│   │   ├── email/                   # Resend wrapper + React Email templates
│   │   ├── sms/                     # Twilio wrapper
│   │   ├── pricing/                 # pure pricing math (testable)
│   │   ├── slots/                   # slot-availability logic
│   │   └── analytics/               # PostHog event helpers
│   ├── server/
│   │   ├── actions/                 # Next Server Actions
│   │   └── api/                     # internal API helpers
│   └── content/                     # MDX content (legal pages, etc.)
├── prisma/
│   ├── schema.prisma                # entity definitions (`04`)
│   ├── migrations/
│   └── seed.ts                      # dev/staging seed data
├── public/                          # static assets, photography, icons
├── tests/
│   ├── e2e/                         # Playwright
│   └── unit/                        # Vitest (mirrors src/ structure)
├── docs/
│   └── planning/                    # THIS folder
├── .env.example
├── package.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## Environment variables (representative)

```
DATABASE_URL=postgresql://...
DIRECT_DATABASE_URL=postgresql://...           # for Prisma migrations bypassing pooler

CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
CLERK_WEBHOOK_SECRET=...

STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_CONNECT_CLIENT_ID=...

RESEND_API_KEY=...
RESEND_WEBHOOK_SECRET=...

TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_MESSAGING_SERVICE_SID=...

GOOGLE_MAPS_API_KEY=...
GOOGLE_MAPS_SERVER_KEY=...                     # separate, server-only, with stricter restrictions

INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

POSTHOG_KEY=...
SENTRY_DSN=...
SENTRY_AUTH_TOKEN=...

NEXT_PUBLIC_APP_URL=https://crownrepair.com
NEXT_PUBLIC_APP_ENV=production|staging|development
```

Three environment shapes: `production` (live on `crownrepair.com`), `staging` (live on `staging.crownrepair.com`, separate accounts at every provider), `development` (local; secrets via `.env.local`).

---

## Alternatives considered & explicitly rejected

| Alternative | Why rejected |
|---|---|
| **Remix** (instead of Next.js) | Smaller LLM corpus; Vercel integration tighter for Next.js; we lose nothing material |
| **Supabase** (instead of Clerk + Neon + Vercel Blob) | Tempting bundle, but Clerk's organization features beat Supabase Auth for our B2B use case; Neon's branching beats Supabase DB; bundle isn't worth losing those |
| **Auth.js / NextAuth** | Workable, but B2B organization + multi-role logic is "build it yourself"; Clerk gives us this in a checkbox |
| **Square Marketplace** (instead of Stripe Connect) | Stripe Connect Express is more mature for our model; Stripe's hosted onboarding is best-in-class |
| **Adyen** | Heavier integration; better for enterprises than marketplaces our size |
| **Self-hosted Postgres** (Railway, Fly) | Ops burden; you cannot carry it as a non-technical founder |
| **Drizzle ORM** | Excellent and faster than Prisma, but smaller LLM corpus; sticking with the most-trained option |
| **Trigger.dev** | Close to Inngest; we chose Inngest for slightly better free tier and crisper docs |
| **Trigger / BullMQ + Redis** | More moving parts than Inngest |
| **Webflow / Framer for marketing** | Tempting for the marketing site, but we'd diverge from the funnel codebase and re-engineer the bridge. One codebase wins. |
| **Custom Express backend** | Unnecessary — Next.js Server Actions + API routes cover us |
| **React Native mobile app** | Deferred to v1.x; PWA covers MVP |

---

## Cost shape at MVP scale (monthly, rough)

| Item | Cost |
|---|---|
| Vercel Pro | $20 |
| Neon Scale (or Pro) | $19-69 |
| Clerk (until ~10K MAU) | $25 |
| Stripe Connect | transactional % (Stripe's standard 2.9% + 30¢ on D2C; Connect transfer fees minimal) |
| Resend | $20 |
| Twilio | $0.0079/SMS — variable, ~$50-200/mo at MVP scale depending on volume |
| Sentry | $26 |
| PostHog | $0 (free tier covers v0.5; ~$50-200 at scale) |
| Inngest | $0 (free tier covers v0.5; $20-50 at scale) |
| Google Maps Platform | $0 (within $200 free credit at MVP volume) |
| Vercel Blob | $0-$10 |
| Cloudflare | $0 (free DNS) |
| Domain | $15/year |

**Total: ~$150-300/mo** baseline + transactional fees. This is a tiny operating cost relative to the GMV the platform processes.

---

## What this stack DOES NOT include (intentional)

- **Redis / KV store** — Next.js + Postgres handles session and caching needs at MVP scale; add Vercel KV (`@vercel/kv`) later if needed
- **Message queue** — Inngest replaces this
- **CDN beyond Vercel** — Vercel's edge + Cloudflare DNS is enough
- **Separate API service** — Next.js Server Actions are the API
- **Microservices** — monolith Next.js app, one repo, one deploy. Repeat after me: monoliths are good.
- **Service mesh, K8s, Docker orchestration** — none of these are appropriate for an AI-built MVP

---

## Migration paths if any of this becomes wrong

The whole point of the stack is low lock-in. If any vendor goes south:

| Vendor | Migrate to |
|---|---|
| Clerk | Auth.js + custom org logic (expensive but doable) |
| Neon | Any other Postgres (Supabase, Railway, AWS RDS) — schema is portable |
| Stripe | Adyen (significant work, but well-trodden path) |
| Vercel | Self-hosted Next.js on any provider; or Netlify |
| Resend | SendGrid, Postmark |
| Inngest | Temporal Cloud, Trigger.dev |
| PostHog | Mixpanel, Amplitude |
| Sentry | Rollbar, LogRocket |

No vendor is so deeply embedded that migration is impossible. That's deliberate.
