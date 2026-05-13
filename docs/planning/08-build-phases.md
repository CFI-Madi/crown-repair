# 08 — Build Phases

Concrete build order with dependencies, durations, and gates. Read alongside `01` (which defines the scope of each phase) and `07` (which defines the tech stack referenced throughout).

## Phase 0 — Foundations (week 1-2)

**Goal:** Get the rails in place so Phase 0.1 can move fast. Nothing user-facing ships beyond a styled "Coming Soon" page.

### Tasks
- **Brand name finalized** (depends on `09`) — blocks domain purchase, logo, all visuals
- **Domain purchased** and DNS pointed at Cloudflare
- **GitHub repo** created (private); initial Next.js + TypeScript scaffold
- **Vercel project** linked to repo with production + staging deployments
- **Tailwind + shadcn** installed; design tokens from `06` wired into `tailwind.config.ts` and `globals.css`
- **Typography setup** — Fraunces (Google Fonts) + General Sans (license check per `09`); configured via `next/font`
- **Brand identity sprint** (logo, type lockup, photography direction) — defer to vendor / designer / Fiverr per founder preference in `09`
- **Sentry + PostHog skeleton** installed, capturing dev events
- **PostHog feature flags enabled** (we use these from Phase 0.5)
- **Staging environment setup (non-negotiable)**:
  - Neon project with `main` (prod) branch + `staging` branch
  - Vercel: production deployment on `crownrepair.com`; staging deployment on `staging.crownrepair.com`
  - Per-PR preview deployments use ephemeral Neon branches (Neon × Vercel integration)
  - **Stripe Connect platform account in test mode** — separate from the live platform account; founding-cohort partner shops will onboard here first
  - Inngest dev/staging environment (separate from prod)
  - Clerk dev instance (separate from prod)
  - Resend test domain configured; Twilio sandbox credentials
- **Twilio A2P 10DLC registration kicked off** — brand + campaign approval takes 1-3 weeks; must be running by Phase 0.5. Required for SMS to major carriers.
- **Google Business Profile creation** — start verification for all 7 coverage cities now (5-14 days per city)
- **Photography brief** drafted; vendor selected; shoot scheduled (see `06` for direction)
- **Initial coverage area data** — ZIP lists per coverage city compiled (see `09` for precise boundaries)
- **One styled "Coming Soon" page** deployed to production domain

### Gate to Phase 0.1
- ✅ Design tokens live in code
- ✅ Coming Soon page deployed on production domain (200 OK, Core Web Vitals green)
- ✅ `staging.crownrepair.com` returns 200 with the same Coming Soon page
- ✅ Stripe Connect test-mode dashboard accessible
- ✅ Inngest dev env receiving test events
- ✅ All 7 GBPs submitted for verification
- ✅ Twilio A2P registration submitted

---

## Phase 0.1 — Prototype site (weeks 3-6)

**Goal:** A high-fidelity public marketing site + clickable booking funnel with no backend. We can walk shop partners and B2B prospects through the entire experience and watch them react. Real conversion data starts flowing (partial-funnel completion analytics).

### Deliverables — Marketing surface

All pages from `02`:
- `/` home with hero, trust strip, services preview, locations map, B2B teaser, testimonials placeholder, footer
- `/services` overview + 9 category pages (`/services/[category]`)
- `/devices` brand grid + brand pages (`/devices/apple`, `/devices/samsung`, `/devices/google`) + top 50 device-model pages
- `/locations` map + 7 city pages (each with unique 600-1200-word content per `10`)
- `/how-it-works`
- `/trust` (warranty, vetting, ratings story)
- `/warranty` (public terms summary)
- `/about`
- `/b2b` overview + 6 vertical pages
- `/b2b/contact` (lead capture form — submits to a webhook + email)
- `/contact`, `/support`
- `/legal/{terms, privacy, warranty-terms, refund, accessibility, data-handling}` (placeholder text where final legal copy is pending in `09`)

### Deliverables — Clickable booking funnel

- `/book/*` all 12 steps from `03`
- Hardcoded fake data:
  - Real device catalog (top 50 models with real photos)
  - 5-10 fake partner shops with plausible Charlotte-area addresses + photos
  - Fake slot availability (regenerates plausibly day-to-day)
  - Step 11 "Pay" button shows a Stripe-styled mock confirmation; nothing is charged
- Real state machine: state stored in localStorage, real navigation between steps, real validation
- Real consent capture at step 9 — generates a fake `cns_…` ID; not persisted

### Deliverables — Static mockup pages

- `/shop/dashboard` — static page with annotated screenshots/illustrations of what the real dashboard will look like
- `/b2b/dashboard` — same approach

### Deliverables — SEO & local presence

(Per `10` — these are launch-week deliverables, not deferred):
- All 7 city pages live with full schema markup
- All 7 GBPs verified, populated with photos + services + Q&A
- Sitemap submitted to Google Search Console + Bing
- Schema validated via Google Rich Results Test
- Photography shot and edited; no stock imagery on the live site

### Engineering tasks

- Build out the design system in code: every atom + molecule from `05` lives in `src/components/`
- Build the funnel state machine (localStorage-backed, no backend yet)
- Build the marketing layout templates (MarketingLayout, FunnelLayout)
- MDX content in `src/content/` for legal pages, B2B vertical content, city page content
- next/sitemap dynamic generation
- robots.txt per `02`
- Core Web Vitals monitoring (Vercel Analytics + Lighthouse CI in PRs)
- PostHog event instrumentation on every funnel step + every marketing CTA click

### Walkthroughs

- ≥3 partner shops walked through the prototype site by mid-Phase 0.1
- ≥2 B2B prospects walked through by end of Phase 0.1
- Feedback captured in a doc; structural issues fed back into planning revisions

### Gate to Phase 0.5
- ✅ All 7 city pages live with green Core Web Vitals
- ✅ All 7 GBPs verified
- ✅ Full booking funnel clickable end-to-end (every step, every state, mobile + desktop)
- ✅ At least 3 partner shops walked through; feedback captured
- ✅ At least 2 B2B prospects walked through
- ✅ Photography on every page (no stock-feeling fallbacks)
- ✅ Lighthouse a11y score ≥95 on all marketing pages

---

## Phase 0.5 — Working transactional MVP (weeks 7-16)

**Goal:** Real customers book, pay, get repairs done at real partner shops, and receive devices back with warranty. Real money flows. Real reviews start landing.

### Sequencing

These tasks are roughly sequential because most depend on auth + DB being live. Parallel-safe tasks are noted.

#### Track A — Foundation (weeks 7-8)

- Prisma schema implemented from `04`; migrations generated; staging DB seeded
- Clerk integration: customer auth on `/account` routes; role-aware Next.js middleware
- Connect Clerk webhooks → Inngest → DB (User row created on Clerk user.created event)
- Resend domain DNS verified; basic email scaffolding (React Email templates)
- Twilio number purchased; A2P 10DLC active by now; basic SMS scaffolding
- Inngest production environment configured

#### Track B — Booking funnel wired to DB (weeks 8-10)

- Replace hardcoded device data with `DeviceModel` + `DeviceBrand` from DB
- Replace hardcoded shop data with `Shop` from DB
- Slot availability logic (`src/lib/slots/`) — pure function unit-tested
- ZIP → CoverageArea resolution
- Real `DeviceIntakeConsent` capture at step 9
- Order creation with idempotency key

#### Track C — Stripe Connect Express (weeks 9-11)

- Platform account live in production
- Shop onboarding flow at `/shop/onboarding`:
  - Multi-step wizard (shop info → photos → capabilities → Stripe Connect handoff)
  - Stripe-hosted Connect Express onboarding for KYC + payouts
  - `account.updated` webhook handled via Inngest → updates `Shop.stripeOnboardingDone`
- Stripe Payment Element at booking step 11
- `payment_intent.succeeded` webhook → Order.status → `booked`
- Charge captured on shop acceptance (delayed-capture flow)
- Refund flow (admin-initiated)

#### Track D — Shop dashboard (weeks 10-12)

- Clerk login at `/shop/login`
- `/shop/dashboard` — KPI tiles + today's queue
- `/shop/jobs` — full job list with filters
- `/shop/jobs/[id]` — job detail with status actions (accept/decline/in-progress/ready/complete)
- **`OrderIntakePhoto` capture required at `accept → in_progress`** — the status-update button is server-side-gated; disabled in the UI until at least one intake photo is uploaded. UI is a drag-drop area + native camera-capture (mobile-first; shops typically use tablets behind the counter). Photos persist to Vercel Blob; `OrderIntakePhoto` rows (`04`) created with timestamp + `taken_by_user_id` server-side. Immutable once captured. **Load-bearing for dispute defense (Track G).**
- `/shop/payouts` — Stripe Connect Express dashboard embed
- `/shop/profile` + `/shop/availability` — shop self-service

#### Track E — Customer post-purchase (weeks 11-13)

- `/track/[orderId]` public tracker with signed URL
- `/account/orders` + `/account/orders/[id]` for authenticated customers
- `OrderTimeline` organism wired to `OrderEvent` rows
- Transactional emails: booking confirmation, shop accepted, in-progress, ready, complete, warranty info (each a React Email template, sent via Resend through an Inngest function)
- Transactional SMS: same triggers, opt-in respected
- Account claim flow (guest customer's order claims to their account if email matches at later sign-up)

#### Track F — Admin essentials (weeks 13-14)

- `/admin/dashboard` (basic KPI tiles)
- `/admin/{shops, orders, users}` CRUD
- `/admin/orders/[id]` with override actions (cancel, refund, reassign, force-status)
- `/admin/warranty-claims/new` internal form (no public UI yet)
- `/admin/webhooks` FailedWebhook queue with replay UI

#### Track G — Hardening (weeks 14-16)

- E2E tests (Playwright) running against staging on every PR
- Webhook idempotency tests (replay same event twice; verify one side-effect)
- Nightly reconciliation job (Inngest scheduled) catching divergent Stripe state
- Nightly `ShopMetrics` recompute job (Inngest scheduled — see `04`)
- Load test: simulate 100 concurrent bookings, verify no double-charges, no slot conflicts
- Manual QA walkthroughs of every flow (booking, shop accept-complete, payout)
- **Acceptance-deadline escalation** — Inngest function watches `Order.acceptanceDeadlineAt`; at deadline, reassigns to next-nearest shop with matching `capabilities`, or triggers a customer refund flow if no alternative exists. Customer notified at every transition per `03` Order lifecycle SLAs.
- **Dispute resolution v1** — implements the 3-stage process from `09` D4:
  - Customer-initiated dispute via `/track/[orderId]` ("report an issue") or email-to-support
  - Order transitions to `disputed`; `OrderEvent` logged with reason
  - Admin UI at `/admin/disputes/[orderId]` surfaces: `OrderIntakePhoto`s (intake evidence), full `OrderEvent` timeline, customer + shop contact, Stripe payment + refund controls, internal notes field
  - 5-business-day max turnaround enforced via Inngest scheduled reminders (24h, 48h, 96h escalation pings to ops)
  - Resolution actions: refund (full / partial), re-repair credit (creates a follow-up order with a `parent_order_id` reference), no-action with documented reasoning. Resolution always recorded as an `OrderEvent`.
- Pre-launch checklist signed off

### Gate to Phase 1.0 (= "v0.5 ready to promote publicly")

- ✅ End-to-end: a real customer books, pays; a real shop accepts, completes; customer picks up; shop gets paid
- ✅ ≥10 completed orders end-to-end in a 1-week soak test before promote-to-public
- ✅ Zero customer-facing or shop-facing critical bugs
- ✅ Webhook DLQ replayed at least once successfully (proving the recovery path)
- ✅ Nightly reconciliation runs cleanly for 1 consecutive week
- ✅ Playwright E2E suite green on every PR for the prior 2 weeks

### Slip order if Phase 0.5 falls behind

If schedule slips, slip in this order:
1. Admin reporting / admin polish (defer to v1.0)
2. Internal warranty form (workaround: admin CRUD on Warranty table directly)
3. Email/SMS copy polish (the system works; nicer copy can come later)

**Never slip** anything customer-facing (booking, payment, tracking, consent capture, status notifications) or shop-facing (job queue, accept/decline, payouts). If a customer- or shop-facing surface isn't ready, slip the phase launch instead — the floor for "live" is both loops working cleanly end-to-end.

---

## Phase 1.0 — B2B portal + admin polish (weeks 17-24)

**Goal:** Sign and serve the first major B2B account (target: a CMS-area school district) with production-grade tooling.

### Tasks

- **B2B portal scaffolding** — sidebar layout, role-gated routes via Clerk Organizations
- **B2B portal pages** (from `02`):
  - `/b2b/dashboard` — KPI tiles (active repairs, monthly spend, devices serviced YTD)
  - `/b2b/submit` — abbreviated booking funnel (skip auth, skip payment, route to invoice queue)
  - `/b2b/submit/bulk` — CSV upload + parse + validate + preview + submit
  - `/b2b/devices` — optional device inventory
  - `/b2b/orders` + `/b2b/orders/[id]` — order list + detail
  - `/b2b/invoices` + `/b2b/invoices/[id]` — invoice history + PDF download
  - `/b2b/users` — multi-user account management
  - `/b2b/settings` — billing contact, addresses, PO setup, contract download
- **B2B custom pricing tiers** — admin assigns tier to business; funnel + invoice generation respect tier multiplier
- **Monthly invoice generation** — Inngest scheduled function runs on the 1st of each month:
  - Groups completed orders per business by period
  - Computes subtotal/tax/total
  - Renders PDF (React PDF)
  - Stores PDF in Vercel Blob
  - Emails to billing contact (Resend)
  - Creates `Invoice` row with `status = sent`
  - Schedules a follow-up Inngest event for overdue check at `dueAt + 1 day`
- **Public warranty claim portal**:
  - `/warranty` (public terms + FAQ, MDX)
  - `/warranty/claim` (submission form, photo upload)
  - `/account/warranty-claims` + `[id]` for authenticated customers
- **Admin polish**:
  - `/admin/disputes` — dispute queue with status transitions
  - `/admin/contracts` — contract upload + management (Vercel Blob for PDFs)
  - `/admin/businesses/*` — full B2B account management
  - `/admin/reporting` — GMV by period, top shops, top B2B accounts, average repair time, NPS proxy

### Phase 1.0 testing notes

- B2B portal launches behind a per-account PostHog feature flag — turned on for one account at a time
- Bulk CSV launches "dark" (UI hidden, backend code in place) — flag-flipped only after at least 3 internal QA runs
- First real B2B account onboarded behind a feature flag, with weekly check-ins for the first month

### Gate to Phase 1.x consideration

- ✅ ≥1 signed B2B account running real submissions end-to-end (single + bulk CSV)
- ✅ ≥1 monthly invoice generated, sent, paid
- ✅ ≥1 public warranty claim submitted, processed, resolved
- ✅ Admin reporting reflects real GMV and operational metrics

---

## Phase 1.x — Deferred (not built until justified by usage)

- SSO/SAML for B2B (Clerk supports it; enable when a customer demands it)
- Native mobile apps
- Mail-in fulfillment
- Insurance partner integrations
- Referral / loyalty programs
- AI-assisted intake chat
- Multi-language (Spanish-Charlotte is a real market)
- Customer-to-customer marketplace
- Subscription warranty plans
- In-app messaging (use email + SMS for now)

---

## Testing strategy (applies across all phases)

### E2E (Playwright)

Runs against staging on every PR. Blocks merge on failure.

Test coverage:
- Full booking funnel — every variant: D2C drop-off, D2C on-site, B2B authenticated, deep-link pre-fill, no-availability fallback, consent-declined path, payment-declined path
- Shop accept → in-progress → ready → complete loop
- CSV bulk upload — happy path AND row-error path (where some rows fail validation)
- Warranty claim submission
- Account claim flow (guest → authenticated)
- Admin override actions (cancel, refund, reassign)

### Unit (Vitest)

Pure functions, sub-second feedback, runs locally + in CI:
- Pricing math (B2B tier multipliers, add-ons, taxes)
- CSV parsing + validation
- Payout calculations
- Slot-availability logic
- ZIP-to-coverage-area resolution
- Idempotency-key generation + comparison
- Webhook signature verification helpers

### Component (Vitest + React Testing Library + axe-core)

- Form validation states (error display, required-field handling)
- Accessibility checks on every page-level component (fails CI on AA violations)

### Integration

- Webhook handlers tested via Stripe CLI's local event forwarding
- Idempotency verified: replay the same event twice; assert single side-effect (one Payment update, not two)
- Inngest function tests for retry behavior

### Feature flags (PostHog)

- Every customer- or shop-facing release ships behind a PostHog flag
- Cohort rollout: internal → 10% → 100%
- B2B portal: per-account allowlist
- Bulk CSV: "dark" launch (UI hidden) before flag flip

### Manual QA

Each phase has a written manual-QA checklist (booking, warranty, B2B submit, payout, admin) — signed off before promote-to-prod. Living document in `docs/qa-checklists/`.

---

## Webhook reliability & idempotency (load-bearing from Phase 0.5 onward)

### Architecture

- **Every state-changing webhook routed through Inngest.** Stripe (and Twilio, Resend) POST to a thin handler at `/api/webhooks/{stripe|twilio|resend}` whose only job is:
  1. Verify upstream signature (Stripe `Stripe-Signature`, Twilio `X-Twilio-Signature`, Resend webhook secret)
  2. Enqueue an Inngest event with the full payload + `event_id` as idempotency key
  3. Return 200 immediately
- **The actual side-effects happen in Inngest functions** with automatic retries (exponential backoff, configurable per function), replay safety, and step-level observability.
- A 5xx in our app code never causes a webhook to be lost — Inngest holds the event durably.

### Idempotency

- `Order.idempotencyKey` and `Payment.idempotencyKey` (see `04`) — every state-changing handler is a pure function of `(eventId, payload)`. Safe to replay.
- Inngest event IDs serve as the function-run dedup key — duplicate enqueue is a no-op.
- Webhook handlers also dedupe on the upstream event ID (e.g., Stripe `evt_…`) by checking `FailedWebhook` or a small `ProcessedEvents` cache.

### Dead-letter queue

After Inngest exhausts retries, the event lands in `FailedWebhook` (`04`):
- Admin UI at `/admin/webhooks` lists pending entries
- Each entry shows source, event_id, event_type, payload (collapsible JSON), last_error, retry_count, created_at
- One-click "Replay" button re-enqueues the Inngest event with the original payload
- "Abandon" button marks it as resolved-without-replay (with required note)

### Critical Stripe webhooks to handle

- `payment_intent.succeeded` → Order → `booked`
- `payment_intent.payment_failed` → Order remains in `quote`; customer notified
- `transfer.created` → Payout row updated
- `transfer.failed` → Admin alert; Payout marked failed
- `account.updated` (Connect) → Shop.stripeOnboardingDone flag refresh
- `charge.refunded` → Order → `cancelled` or `disputed_resolved` per context
- `charge.dispute.created` → Order → `disputed`; admin notified urgently
- `payout.paid`, `payout.failed` → Payout status updates

### Signature verification

Every endpoint verifies its upstream signature. Reject + log + alert on mismatch. No exceptions.

### Nightly reconciliation

Inngest scheduled function runs nightly:
- Scans Stripe for payment intents whose state diverges from our DB (e.g., Stripe says succeeded, our DB says pending)
- Flags discrepancies in `/admin/dashboard`
- Auto-corrects when safe (e.g., webhook clearly missed); flags for human review when ambiguous

### Test discipline

Webhook handlers tested with replay (same event sent twice → one side-effect). Stripe's `stripe trigger` CLI used in CI to fire realistic events.

---

## Critical-path callouts (timeline-sensitive — start early in Phase 0)

| Item | Lead time | Phase started |
|---|---|---|
| Stripe Connect Express onboarding per shop | 1-7 days KYC processing | Phase 0 (test mode) |
| Twilio A2P 10DLC brand + campaign | 1-3 weeks | Phase 0 |
| Google Business Profile verification per city | 5-14 days (sometimes longer for SAB) | Phase 0 — all 7 cities |
| B2B legal package (MSA, DPA, security overview, retention policy, breach process, insurance cert — see `09`) | 2-6 weeks legal review | Phase 0.5 (school district sales demand these) |
| Photography shoot + edit | 2-3 weeks | Phase 0 mid; delivered by Phase 0.1 start |
| Local SEO city-page content (see `10`) | Drafting + review | Phase 0.1 (NOT deferred) |
| Brand identity (logo, type lockup) | 1-3 weeks depending on vendor | Phase 0 |
| Insurance broker engagement (general liability + cyber) | 2-4 weeks | Phase 0.5 |
| Background-check vendor for partner-shop techs (B2B requirement) | 1-2 weeks | Phase 0.5 |
