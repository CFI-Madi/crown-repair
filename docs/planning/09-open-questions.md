# 09 — Open Questions

Things only you can decide. Each question lists: the decision needed, why it matters, my recommendation (where I have one), and the doc/phase it blocks.

Work through these in roughly this order — brand & legal first because everything else depends on them.

---

## A. Brand & identity

### A1. Final brand name

- **Working:** Crown Repair
- **Recommendation:** Lock it or replace it before Phase 0 starts. Trademark search USPTO + Google "[name] phone repair" to verify no Charlotte-area conflicts.
- **Blocks:** domain purchase, logo design, all visuals (`06`), legal entity name.

### A2. Logo + identity treatment

- **Options:** DIY (Canva/Figma), Fiverr/99designs ($100-1000), local agency ($3-15k), friend with design skills
- **Recommendation:** $500-1500 budget for a small studio or freelancer with brand-identity experience (not just a logo). Get: wordmark, secondary monogram, color application guide, type lockup, social avatar treatments. Studio I'd suggest: ask for portfolios with editorial / hospitality work (signals premium sensibility — most Fiverr work skews tech-startup).
- **Blocks:** all visuals; Phase 0 brand identity sprint.

### A3. Photography source

- **Options:** custom shoot ($2-5k for a half-day with a Charlotte commercial photographer), curated stock (Stocksy / Death to Stock at ~$200/year), illustration-heavy site (commission an illustrator)
- **Recommendation:** Custom half-day shoot for hero photography (shop interiors, hands-at-work, top devices on warm surfaces). Stock fills gaps for vertical pages.
- **Blocks:** Phase 0.1 marketing site quality.

### A4. Voice & tone tagline

- Candidate territories:
  - "Premium device repair, backed by Charlotte's best shops."
  - "The repair people you'd recommend to your mom."
  - "Phone repair, done right. Backed by warranty. Done in Charlotte."
- **Recommendation:** workshop with the brand designer; aim for confident, specific, not cute.
- **Blocks:** marketing copy.

---

## B. Pricing & money

### B1. Pricing model

- **Options:** flat rate per repair type per device class; variable (shop sets, we approve); premium tier
- **Recommendation:** flat rate per repair × device-model combo (transparent to customer); revisit after 90 days based on margin data. B2B gets tier-multiplied pricing.
- **Blocks:** `RepairOffering` data seed (`04`); funnel quote display (`03`).

### B2. Platform fee %

- The cut we keep before paying shop
- **Industry context:** Thumbtack-style marketplaces are 10-30% on transactions; uBreakiFix franchise model effectively takes ~25-40% as franchise fees
- **Recommendation:** start at 20% (shop gets 80% of customer payment). Adjustable per shop via contract. Revisit at month 3.
- **Blocks:** `Order.platformFeeCents` computation; partner shop conversations.

### B3. Premium service tier (same-day, expedited)

- **Question:** offer in v0.5 or defer?
- **Recommendation:** offer as a $20-40 upcharge for same-day if shop has capacity. Disable for v0.1 prototype (avoids dead-feature confusion in walkthroughs).
- **Blocks:** funnel step 10 add-on options.

### B4. B2B pricing model

- **Options:** flat % volume discount; per-account negotiated; tier-based (Standard / Education / Hospitality)
- **Recommendation:** tier-based. Three tiers: Standard B2B (10% off retail), Education (15% off retail), Hospitality (12% off retail). Custom-negotiated as exceptions for large accounts.
- **Blocks:** `PricingTier` seed; contract template.

### B5. Warranty upsell pricing

- **Default:** 90-day warranty included
- **Upsell options to lock in pricing:** 180-day extended (+$X), 365-day extended (+$Y)
- **Recommendation:** $25 for 180-day, $60 for 365-day on screen replacements. Different upsell pricing per repair category may make sense.
- **Blocks:** funnel step 10.

### B6. Tax handling

- **Options:** in-house computation, Stripe Tax, separate vendor
- **Recommendation:** Stripe Tax. $100/mo + per-transaction fee; saves a tax-compliance nightmare. NC has a 6.75% state rate; counties add 2-2.5%.
- **Blocks:** quote display in funnel; invoice generation.

---

## C. Warranty terms

### C1. Coverage duration

- **Recommendation:** 90 days default. Marketing leans into "fully warranted by Crown Repair, not just the shop" as differentiator.
- **Optional differentiator:** lifetime warranty on screen replacements only (limited to manufacturing defects, transferable, etc.)
- **Blocks:** legal terms; marketing copy; `Warranty.expiresAt` default.

### C2. What's covered

- Options: parts only / parts + labor / parts + labor + collateral damage / parts only excluding cosmetic
- **Recommendation:** parts + labor on the same repair issue. Explicitly excludes: water re-exposure after waterproof seal repair; physical damage to repaired part (new crack); collateral hardware failures.
- **Blocks:** legal terms.

### C3. Claim mechanism

- **Options:** return to original shop; any partner shop; mail-in only
- **Recommendation:** return to any partner shop in the network (this is a differentiator — "if your repair fails, walk into any Crown Repair shop"). The original shop is reimbursed by us at admin's discretion based on rework root cause.
- **Blocks:** warranty claim flow design (v1.0).

---

## D. Partner shop terms

### D1. Contract structure

- **Recommendation:** non-exclusive (shops can keep their walk-in business); no volume requirements; quality SLA (completion within committed slot ±2 hours; rework rate <5%; customer-reported issues responded to within 48 hours); 30-day termination by either party with cause.
- **Blocks:** Shop Partner Agreement template.

### D2. Onboarding criteria

- Recommended bar:
  - General liability insurance (≥$1M)
  - Active business license verification
  - At least 1 year of repair business history
  - Authorized parts sourcing (Apple-authorized, Samsung-authorized where available; otherwise documented sourcing chain)
  - Background-check policy for technicians who do on-site repairs (especially K-12 contexts)
  - Storefront photo approved by us (we use it in marketing)
- **Blocks:** Shop onboarding wizard design (v0.5).

### D3. Payout cadence

- **Options:** weekly, bi-weekly, on completion
- **Recommendation:** weekly automatic payout every Tuesday for prior Mon-Sun completed orders. Stripe Connect Express handles this natively.
- **Blocks:** payout job scheduling.

### D4. Dispute resolution process

- **Recommendation:** 3-stage:
  1. Customer reports issue → Crown ops contacts both parties within 24h
  2. Ops investigates (order events, photos, technician statements)
  3. Resolution: refund, re-repair at no cost, or no-action with documented reasoning
  - Maximum customer-facing turnaround: 5 business days
- **Blocks:** `/admin/disputes` queue design (v1.0).

### D5. Founding-cohort shop count

- Target for Phase 0.1 walkthroughs: 5-8 partner shops with LOIs
- Target for Phase 0.5 launch: 5-10 active shops across coverage cities
- **Recommendation:** 1-2 shops per coverage city for v0.5 to ensure coverage; expand later.
- **Blocks:** outreach timeline.

---

## E. B2B contract terms

### E1. Net terms

- **Recommendation:** Net 30 default. Net 15 for hospitality / property-mgmt (smaller invoices, faster cycles).
- **Blocks:** Business.netTermsDays seed; MSA template.

### E2. Minimum contract value or commitment

- **Recommendation:** no minimum for MVP — we want to sign business and prove the model. Add minimums later if low-volume accounts become a support drag.
- **Blocks:** sales conversations.

### E3. PO process

- **Question:** do we require POs on B2B orders, or accept open contract?
- **Recommendation:** optional. Some districts will require it; the funnel has an optional PO field (`03` B2B variant) and invoices reference it. Don't make it required.
- **Blocks:** B2B funnel field.

### E4. Standard MSA template

- **Recommendation:** draft by mid-Phase 0.5 with a contracts attorney. Charlotte business attorneys can handle this; budget $2-5k for the template package (MSA + DPA + Shop Partner Agreement). Get it reviewed before any school district conversation deep enough to send paper.
- **Blocks:** B2B sales.

### E5. Pre-sales legal & compliance package for school districts

**Concrete deliverables, not "needs legal review":**

| Deliverable | What it is | When |
|---|---|---|
| **Data Processing Agreement (DPA) template** | FERPA-aware DPA covering student PII residing on devices we touch (we don't store it, but we handle devices that contain it) | Phase 0.5 start |
| **Data retention & deletion policy** | How long we keep order/customer data; SLA on deletion requests; what survives deletion (financial records 7y per IRS) | Phase 0.5 start |
| **Security overview one-pager** | Encryption at rest/in transit; access controls; sub-processor list (Clerk, Stripe, Neon, Resend, Twilio, Vercel, Inngest, PostHog, Sentry, Google Maps); sub-processor change-notification process | Phase 0.5 start |
| **Breach notification process** | Timeline commitment (≤48h for incidents involving PII); contact path; what counts as a breach; drill cadence | Phase 0.5 start |
| **Insurance certificate** | General liability (≥$2M aggregate likely demanded); cyber liability (≥$1M); cert available on request | Phase 0.5 start |
| **Background-check policy for partner-shop technicians** | For techs doing on-site repairs at K-12 facilities; criminal-records check; reference checks | Phase 0.5 start |
| **Acceptable Use / fair-handling policy** | Conduct expected of techs handling student devices; what they may and may not access; chain-of-custody | Phase 0.5 start |
| **Vendor questionnaire response template** | School districts often send a 50-100-question security questionnaire (often SIG Lite). Pre-fill once; reuse. | Phase 0.5 mid |

**Blocks:** Any school district sales conversation past the discovery call.

---

## F. Operations

### F1. Service area precise boundaries

- 7 cities named, but which ZIPs exactly?
- **Recommendation:** map out the actual ZIPs covered. Start tight (high-density areas) and expand. Charlotte alone has ~30 ZIPs.
- **Blocks:** `CoverageArea.zipCodes` seed; `10` city-page accuracy.

### F2. Hours of operation expectations

- What hours does our customer-facing site promise?
- **Recommendation:** "Most repairs available 9 AM – 7 PM Mon-Sat, with limited Sunday availability." Don't over-promise; let shop hours be the source of truth.
- **Blocks:** marketing copy; trust signals.

### F3. Same-day vs. next-day standards

- **Recommendation:** "Most screen and battery repairs same-day when booked by noon. Diagnostic and complex repairs typically 24-48 hours."
- **Blocks:** marketing copy; honest customer expectations.

### F4. Device wipe policy ← informs `03` step 9 and `04` `DeviceIntakeConsent`

Decide the default offering:

- **Option A — Customer-responsible only:** we (partner technicians) touch nothing on the device. Cleanest legally, but some customers expect us to wipe before resale-of-old-parts scenarios.
- **Option B — Basic wipe attempted:** if a factory reset is appropriate to the repair (e.g., a screen replacement that requires testing in setup mode), the technician may perform one. No guarantees.
- **Option C — Full wipe on request:** explicit add-on, priced separately ($20-40). Tech follows a documented wipe procedure.

**Recommendation:** offer all three at step 9 with Customer-responsible as default. Confirm with insurance broker before locking — each option has distinct liability + partner-shop-training implications.

**This is the single biggest D2C liability surface aside from physical device damage.** Don't ship `03` step 9 without this decision.

**Blocks:** `03` step 9 final copy + radio options; partner shop training.

### F5. Liability insurance for devices in custody

- Who insures a device while it's at a partner shop or with an on-site technician?
- **Recommendation:** Crown Repair carries an aggregate care-custody-control policy that backstops partner shops' coverage. Specific limits TBD with broker.
- **Blocks:** insurance vendor engagement; D4 dispute resolution math.

### F6. Customer support staffing

- **Options:** founder only / outsourced service desk / in-house support
- **Recommendation:** founder handles all customer support for first 90 days (great PMF signal: you'll learn what's actually broken). Add part-time support at 50+ active orders/week.
- **Blocks:** support flow design (where do tickets go?).

---

## G. Legal & compliance

### G1. Legal entity setup

- **Question:** Is the LLC already formed?
- **Recommendation:** if not, form a NC LLC before signing any partner shop contracts or accepting any customer payments. Charlotte business attorneys handle this for $300-600.
- **Blocks:** Stripe Connect platform account (requires legal entity).

### G2. Required policies to draft

- Terms of Service
- Privacy Policy
- Warranty Terms (public-facing version of warranty contract)
- B2B MSA (master service agreement)
- B2B DPA (data processing agreement)
- Shop Partner Agreement
- Refund Policy
- Accessibility Statement
- Data Handling Policy (linked from booking step 9 — referenced in `03`)
- Acceptable Use Policy (covering shop technician conduct)
- **Recommendation:** all bundled into the same attorney engagement as the MSA template (E4). Budget $5-10k total for the legal package.

### G3. Trademark check on brand name

- **Recommendation:** USPTO TESS search before domain purchase; informal Google + state-level check too. If brand survives, file an application ($350-750 depending on classes).
- **Blocks:** brand name lock-in (A1).

### G4. BBB accreditation

- **Recommendation:** yes, accredit. Charlotte metro is BBB-heavy; the badge is meaningful local trust signal. ~$700/yr but worth it for the marketing surface.
- **Blocks:** trust strip on marketing site.

### G5. Accessibility commitment

- **Recommendation:** WCAG 2.1 AA. Already baked into `06`. Published Accessibility Statement at `/legal/accessibility` linking to a contact for accommodation requests.

---

## H. Marketing & growth

### H1. SEO target keywords

- **Recommendation:** local-intent first. Per city: "[city] phone repair", "[city] iphone screen repair", "[city] battery replacement", "screen repair near me [city]". Per device: "iphone 15 screen repair charlotte". Per vertical: "school chromebook repair charlotte". Full list lives in `10`.
- **Blocks:** content strategy execution.

### H2. Google Business Profile structure

- **Options:** one GBP per coverage city, or one GBP for the main business with service-area listings
- **Recommendation:** one per city. Use partner shop addresses with consent (gives us physical-address GBP, which Google strongly prefers). Service-area-business listings work too but rank slightly lower.
- **Blocks:** Phase 0 GBP creation (`08`).

### H3. Initial review acquisition

- **Recommendation:** at Phase 0.1 launch, contact partner shops' existing happy customers (with shop consent) and ask if they'd leave a Google review specifically mentioning Crown Repair (the new platform they're part of). Never fabricate; never solicit specific star ratings. Aim for ~20 reviews across the GBPs in launch month.

---

## I. Product decisions deferred to you

### I1. Mobile-first or desktop-equal priority?

- **Recommendation:** mobile-first for D2C (most customers find us on phone after dropping their phone — wait, after the phone they have for searches, ironically). Desktop-equal priority for dashboards (shop staff, B2B users, admin).

### I2. Customer account required to book?

- **Recommendation:** optional. Guest checkout works; account auto-created from email at completion (Clerk supports this pattern). Customer can claim the account later via "set a password" link.

### I3. B2B self-serve sign-up vs. sales-led only?

- **Recommendation:** sales-led for v1.0. Self-serve B2B sign-up is a v1.x feature when we have repeatable smaller-account playbooks.

### I4. Founding-shop equity / referral incentive

- **Question:** offer founding partner shops any incentive beyond standard payout terms?
- **Recommendation:** no equity. Optional: 15% platform fee instead of 20% for first 12 months as "founding partner pricing". Document explicitly in agreement.

### I5. Same-store vs cross-store warranty

- See C3 above

### I6. Marketing budget for launch

- **Recommendation:** $0 paid marketing for v0.1 launch. Local SEO + partner-shop referrals + B2B sales conversations only. Add Google Local Services ads in Phase 1.0 once organic conversion is proven.

---

## J. Strategic / longer-horizon (answer when you have time)

- When do we expand beyond Charlotte metro? What's the proof-point that justifies it?
- Do we eventually own/operate any physical locations, or stay 100% partner-network?
- How do we handle a partner shop going out of business mid-warranty? (D5 needs to address this)
- What happens to a device left uncollected for >30 days at a partner shop? (Industry standard: abandoned-property procedures, certified-mail notification.)
- Do we want B2C subscriptions for ongoing-protection plans?

---

## How to use this doc

Open this doc; for each question, either answer it inline (replace the recommendation with your decision) or note "punt to Phase 0.5" / "needs research" so it doesn't silently block.

Section A and Section E are the most time-sensitive — they unblock Phase 0 and the school-district sales pipeline respectively. Get a draft answer for every Section A and Section E item before Phase 0 starts.
