# 01 — Product Scope

## Vision & positioning

Crown Repair is a premium, vetted-partner-network repair marketplace. We are NOT a coupon site. We are NOT a deal aggregator. We are a trust layer: customers (consumers and businesses) book repairs through us with confidence that the device will be fixed correctly, the technician is vetted, the work is warranted, and the price was fair before they hit confirm.

**What we own:**
- The brand and customer relationship
- Pricing and quotes
- Warranty (platform-backed, honored regardless of which partner did the repair)
- Customer support and dispute resolution
- Payment processing and partner payouts
- B2B contracts and invoicing

**What partner shops own:**
- Physical repair fulfillment (parts, labor, premises)
- Diagnostic accuracy
- Technician training within Crown Repair's quality bar
- On-time delivery against committed slots
- On-site technician conduct (for B2B fleet repairs)

**What we are explicitly NOT doing:**
- Operating our own physical repair shops (we never own real estate or hire technicians directly)
- Selling parts, accessories, or refurbished devices (yet)
- Competing on price; we compete on trust, warranty, and convenience
- Operating outside the Charlotte metro for MVP

## Personas

Each persona drives a distinct surface of the product. The docs reference these by short name.

### 1. **D2C Consumer — "Maya, 32, Charlotte"**
- Cracked her iPhone 15 Pro screen yesterday; needs it fixed today or tomorrow
- Searched "iphone screen repair charlotte" and clicked two competitor results before finding us
- Cares about: speed, transparent pricing, real warranty, not getting upsold
- Will not create an account unless required; trusts us based on the website's polish + reviews
- Booking funnel completion is her only success metric

### 2. **B2B Buyer — School IT Director — "James, CMS-area, manages 4,200 student devices"**
- Has 200-400 device repair tickets per year (cracked Chromebooks, dead batteries, ports)
- Currently uses one or two local shops on a handshake basis; wants a single vendor with reporting and predictable billing
- Cares about: DPA/data-handling compliance (FERPA-adjacent), monthly invoicing, bulk submission, predictable response times, background-checked technicians on-site
- Sales-led — will sign a contract with explicit terms before any device goes anywhere
- Decision criteria: legal package (see `09`), references, pricing predictability, response SLA

### 3. **B2B Buyer — Property / Hotel / Fleet Manager — "Lena, 50-unit boutique hotel"**
- Steady stream of front-desk iPads, occasional guest-device incidents, fleet phones for staff
- Cares about: convenience, predictable pricing, one invoice per month, branded receipts for guest incidents
- Smaller contract value than schools but easier sales cycle

### 4. **Partner Shop Owner — "Marcus, 2-tech shop in NoDa"**
- Already runs a walk-in repair business; wants steady incremental volume
- Cares about: incoming job quality, fair pricing, prompt payouts, simple dashboard he can run on a tablet behind the counter
- Will accept ~70-80% of total repair price after platform fee; needs the volume to make math work
- Will accept/decline jobs based on slot availability; needs status changes to be one tap

### 5. **Internal Admin / Ops — "Founder + Ops Lead"**
- Manages shop onboarding, contract management, dispute resolution, B2B account success
- Cares about: visibility (one dashboard showing GMV, active orders, disputes), reporting export, manual override on every workflow when needed

---

## Phase v0.1 — Prototype (weeks 3-6)

**Goal:** A live, high-fidelity site we can walk shop partners and B2B prospects through. Zero backend. Zero real data. Pure trust-building artifact.

### In-scope
- Marketing pages, all polished and final-feeling:
  - `/` home
  - `/services` overview + `/services/[category]` for each repair type
  - `/devices` browse + `/devices/[brand]/[model]` for top 50 devices
  - `/locations` overview + `/locations/[city]` for each of 7 coverage cities (full local content per `10`)
  - `/how-it-works`
  - `/trust` (warranty, vetting, customer guarantees)
  - `/warranty` (terms summary)
  - `/about`
  - `/b2b` + `/b2b/{schools, property-management, hospitality, construction-trades, real-estate, insurance-warranty-partners}`
  - `/b2b/contact` (lead capture form to a webhook/email)
  - `/contact`, `/support`
  - `/legal/{terms, privacy, warranty-terms, refund, accessibility, data-handling}`
- Full clickable booking funnel (`/book/*`, all 12 steps per `03`), running entirely on hardcoded fake data:
  - Real device catalog (top 50 device models, real photos)
  - 5-10 fake partner shop entries with plausible Charlotte-area addresses
  - Fake time-slot availability
  - "Submit" goes to a confirmation screen with a generated fake order ID; nothing is persisted
- Static mockup pages for shop dashboard and B2B dashboard — illustrative screenshots embedded, not interactive
- Mobile responsive top to bottom
- All 7 city pages live with full local SEO per `10`
- All 7 Google Business Profiles created and verified
- Analytics (PostHog) wired for marketing funnel analysis

### Out-of-scope
- Any real backend; no DB, no auth, no payments
- Any real shop accounts or jobs
- Any real customer accounts
- Order tracking page (stubbed — "your tracking link will come via SMS when we go live")
- Warranty claim flow
- Admin tools
- B2B portal interaction (only the public marketing pages + lead form)

### Success criteria
- ≥3 partner shops sign LOI / verbal commitment to onboard after walkthrough
- ≥2 B2B prospects accept a follow-up meeting (school district or property manager)
- Marketing site Core Web Vitals all green per `10`
- 7 Google Business Profiles verified
- Local SEO rich-results validate on all city pages
- Photography brief executed; no stock-feeling images

---

## Phase v0.5 — Working transactional MVP (weeks 7-16)

**Goal:** A real customer can book a real repair, pay, get the work done at a real partner shop, and receive their device with a warranty. Real money flows.

### In-scope
- All `v0.1` marketing surfaces retained and refined as content matures
- Real database (Postgres on Neon) with the schema from `04`
- Customer auth via Clerk (optional account; can book without; auto-claim flow if email matches later)
- Real booking funnel (`/book/*`) wired to DB:
  - Real device catalog
  - Real partner shop list filtered by ZIP coverage
  - Real slot availability from shop hours + bookings
  - Real `DeviceIntakeConsent` capture (step 9 — see `03`/`04`)
- Stripe Connect Express onboarding for partner shops (`/shop/onboarding`)
- Stripe Checkout for D2C customer payments at funnel step 11; payment intent → Order creation; capture on shop acceptance
- Partner shop dashboard (`/shop/*`):
  - Login (Clerk)
  - Job queue (incoming, in-progress, ready, complete)
  - Accept / decline / mark-in-progress / mark-ready / mark-complete
  - Payout history (Stripe Connect Express dashboard embedded)
  - Profile + hours + capabilities edit
- Customer order tracking:
  - `/track/[orderId]` public (signed URL, from confirmation email/SMS)
  - `/account/orders` + `/account/orders/[id]` for authenticated customers
- Transactional notifications:
  - Email (Resend + React Email): booking confirmation, accept, in-progress, ready-for-pickup, complete, warranty info
  - SMS (Twilio): same triggers, opt-in at booking
- Basic admin (`/admin/{shops, orders, users}`): CRUD only — no fancy reporting yet
- Internal warranty claim entry (`/admin/warranty-claims/new`); no public-facing flow yet
- Webhook reliability per `08` (Inngest routing, idempotency keys, DLQ + replay UI)
- Sentry + PostHog + PostHog feature flags

### Out-of-scope
- B2B portal (`/b2b/dashboard` etc.) — defer to v1.0
- Bulk CSV submission
- Public warranty claim portal
- B2B custom pricing tiers
- Admin reporting dashboard (beyond the basic order list)
- Dispute management workflow (handled manually via admin CRUD)
- Native mobile app (responsive PWA only)

### Success criteria
- A real customer books, pays, and receives a completed repair
- A real partner shop accepts, completes, and receives a payout
- ≥10 completed orders end-to-end before promoting to public marketing
- Zero customer-facing or shop-facing critical bugs at promote-to-prod gate
- Webhook DLQ has been replayed at least once successfully (proving the recovery path)
- Nightly reconciliation job runs cleanly for 1 week pre-launch

---

## Phase v1.0 — B2B portal + admin polish (weeks 17-24)

**Goal:** Sign and serve the first major B2B account (target: a CMS-area school district) with production-grade tooling.

### In-scope
- B2B portal:
  - `/b2b/dashboard` — KPIs (active repairs, monthly spend, devices serviced)
  - `/b2b/submit` (single-device intake — abbreviated funnel)
  - `/b2b/submit/bulk` — CSV upload, validation, preview, submit (school district workflow)
  - `/b2b/devices` — device inventory (optional, for accounts that maintain one)
  - `/b2b/orders` + `/b2b/orders/[id]` — order history with filters
  - `/b2b/invoices` + `/b2b/invoices/[id]` — monthly invoice history, PDF download, payment status
  - `/b2b/users` — multi-user account management (no SSO yet)
  - `/b2b/settings` — billing contact, addresses, PO setup
- B2B custom pricing tiers (admin assigns tier to business; funnel respects tier)
- Monthly invoice generation:
  - Background job (Inngest scheduled) at month-end
  - PDF rendered via React PDF
  - Emailed to billing contact via Resend; status tracked (`sent → paid` or `sent → overdue`)
  - Net-30 default; configurable per account
- Public warranty claim portal:
  - `/warranty` (terms + how-to)
  - `/warranty/claim` (submission form)
  - `/account/warranty-claims` + `/account/warranty-claims/[id]`
- Admin polish:
  - Dispute queue (`/admin/disputes`)
  - Contract upload + management (`/admin/contracts`)
  - Reporting dashboard (`/admin/reporting`): GMV by week/month, top shops by volume, top B2B accounts, average repair time, NPS proxy
  - FailedWebhook replay UI (`/admin/webhooks`)

### Out-of-scope (deferred to v1.x)
- SSO / SAML for B2B (Clerk supports — enable when demand justifies)
- Native mobile apps
- Mail-in fulfillment
- Insurance partner integrations
- Referral / loyalty programs
- AI-assisted intake chat
- Spanish-language site

### Success criteria
- ≥1 signed B2B account running real submissions end-to-end (single + bulk CSV)
- ≥1 monthly invoice generated, sent, paid
- ≥1 public warranty claim submitted, processed, resolved
- Admin reporting reflects real GMV and operational metrics
- B2B portal feature flags enable rollout one account at a time

---

## Phase v1.x — Explicit non-goals for now

Listed here so AI agents and contractors don't accidentally build them. These may be revisited in strategic reviews if real demand emerges:

- SSO/SAML for B2B
- React Native mobile app (PWA is fine through v1.0)
- Mail-in fulfillment kits (logistics complexity not worth it pre-PMF)
- Insurance partner integrations (claims pre-fill from insurer system)
- Referral / loyalty programs
- AI / LLM-assisted intake chat
- Multi-language (Spanish-Charlotte is meaningful market but adds engineering + content overhead)
- Aftermarket sales (cases, screen protectors)
- Buy-back / trade-in
- Subscription warranty plans
- Same-day delivery service
- Tipping flow for technicians

## Permanent non-goals

Not strategic fits for the Crown Repair brand or business model. **Will not be revisited:**

- **Customer-to-customer marketplace** (peer-to-peer selling of refurbished devices). Inconsistent with our vetted-partner-network trust model; introduces fraud, fulfillment, and warranty edge cases we cannot underwrite as a platform. If we ever add device sales, it will be first-party retail of certified refurbished — not a peer-to-peer marketplace.

---

## How scope decisions get made post-launch

Any feature proposed for inclusion in a phase must clear three bars:

1. **A real customer or shop has asked for it** (anecdote ≥1, ideally ≥3)
2. **It moves a measurable metric** we already track in PostHog (conversion, retention, GMV, repair completion rate)
3. **It can be slipped without breaking what's in scope** — if it slips, the phase still ships

Anything failing those bars goes into v1.x.

## What slips first within a phase

If a phase falls behind schedule, slip in this order:
1. Admin reporting / admin polish (internal tooling)
2. Internal warranty form / claim UI polish (workaround: manual admin CRUD)
3. Notifications polish (the system works; nicer copy can come later)
4. Documentation polish

**Never slip:** anything customer-facing (booking, payment, tracking, consent capture, status notifications) or shop-facing (job queue, accept/decline, payout visibility). If a customer- or shop-facing surface isn't ready, slip the phase launch instead.
