# 03 — Booking Flow Spec

This is the most load-bearing user journey in the product. If the funnel is wrong, everything downstream is wrong. Read end-to-end.

## Funnel diagram

```
Entry  (/, deep link, device page CTA, repair page CTA, location page CTA)
  ↓
Step 1: Device type
  ↓
Step 2: Brand
  ↓
Step 3: Model
  ↓
Step 4: Repair type
  ↓
Step 5: Service mode (drop-off vs. on-site; gated by ZIP/B2B)
  ↓
Step 6: ZIP / address
  ↓
Step 7: Shop + slot (drop-off)  OR  ETA window (on-site)
  ↓
Step 8: Contact info (+ optional account create)
  ↓
Step 9: Device data & wipe consent  ←  load-bearing liability surface
  ↓
Step 10: Quote summary + add-ons (warranty upgrade, expedite)
  ↓
Step 11: Payment (D2C: Stripe; B2B: invoice routing)
  ↓
Step 12: Confirmation
```

## Cross-cutting behaviors (apply to every step)

### State persistence
- Funnel state stored in localStorage under `crown.book.session.v1` with shape:
  ```
  { step, device, repair, mode, location, slot, contact, consent, addOns, sessionId, startedAt, deepLinkParams }
  ```
- Restored on `/book/*` entry; user can leave and return
- Session expires after 7 days; expired sessions clear on next entry
- On successful submit (step 11/12), session is wiped (or kept with `completed_at` for analytics)

### Back navigation
- Always works; never loses prior step data
- If user goes back across step 9 (consent), the consent record is invalidated; they must re-consent on the new path (consent is tied to the specific repair + device + mode combination)

### Loading states
- Network calls show skeleton states (not spinners over content)
- Slot grid (step 7), shop list (step 7), CSV row preview (B2B bulk): all use skeleton blocks

### Error states
- Network error: inline alert "Connection issue — retry" with retry button; current step state preserved
- Server validation error: field-level red border + helper text; never a modal
- Stripe error (step 11): inline at payment element; never loses prior funnel state

### Accessibility (WCAG 2.1 AA floor)
- Every step keyboard navigable (Tab, Enter, Esc for back)
- Focus moves to the first interactive element on step transition (visible focus ring per `06`)
- Screen-reader announces step change via `aria-live="polite"` region: "Step 3 of 12: Choose your model"
- Color is never the only indicator of state (icons + text always present)
- Form labels are explicit `<label>` elements; no placeholder-as-label antipattern
- Errors associated to inputs via `aria-describedby`

### Deep-link pre-fill
- Query params at `/book` entry: `?device=`, `?repair=`, `?zip=`, `?service=`, `?b2b=`, `?ref=`
- Pre-fill jumps user to the first incomplete step
- Invalid param (unknown device slug) silently ignored; user starts from step 1
- `?ref=` is captured into the session and rolled into analytics

### Analytics
Every step transition fires a PostHog event:
```
booking_step_entered  { step, sessionId, previousStep, msSinceLastStep, deepLinkParams, isB2B }
booking_step_exited   { step, sessionId, action: 'next'|'back'|'abandon', msInStep }
booking_completed     { sessionId, orderId, totalCents, deviceModelId, repairCategoryId, serviceMode, isB2B }
booking_abandoned     { sessionId, lastCompletedStep, ageMs }   // fired on session expire
```

### Stepper UI
- Visible at the top of each step on desktop (horizontal); collapsed to "Step X of 12" on mobile
- Clicking a completed step navigates back (forward steps are NOT clickable)
- States: completed (checkmark), current (highlighted), upcoming (muted)

### Save and resume
- A slim, dismissible banner sits above the Stepper (inside FunnelLayout's chrome) on steps 1-10 offering "Save quote — email me a link." Not shown on step 11 (Pay) or 12 (Confirmation) — by then the order has moved past a savable quote.
- Submitting the banner captures email, persists the session server-side (signed URL `/quote/[id]`), and emails a recovery link via Resend.
- The recovery link opens the funnel at the saved step with the session restored.

---

## Step 1 — Device type

**Purpose:** Filter the device catalog by physical category before drilling into brand/model.

**Layout:** 5-6 large image cards in a grid, each with an icon + label. Tap to advance.

**Options:**
- Phone
- Tablet
- Laptop
- Smartwatch
- Gaming console / handheld
- Other / I'm not sure

**Inputs:** none (selection-only)

**Validation:** none — selection advances immediately

**Empty / loading / error:** N/A (static page, no network)

**Edge case — "Other":** route to a diagnostic intake flow that collects free-text description + photos and routes to admin for human triage. Funnel branches off the standard path; not part of the main 12-step.

**B2B variant:** identical UI; B2B account context is carried in localStorage and surfaced as a banner ("Booking for [Business Name] — billed to your account").

---

## Step 2 — Brand

**Purpose:** Filter to the brand of the device.

**Layout:** Logo-led grid (Apple, Samsung, Google, OnePlus, Motorola, etc.) + search input + "My brand isn't here →" link.

**Inputs:** brand selection or search query

**Validation:** if searching → at least 2 characters before search fires

**Edge case — brand not listed:** "Don't see your brand?" CTA → diagnostic intake (off-funnel)

---

## Step 3 — Model

**Purpose:** Identify the exact device.

**Layout:** Image grid of device models. "Popular" models pinned to top (e.g., iPhone 15 series, 14 series for Apple). Search filter input at top. Each card shows model name + photo.

**Inputs:** model selection or search query

**Validation:** none beyond selection

**Edge cases:**
- Model not in catalog → "Don't see your exact model?" → diagnostic intake
- Search returns 0 results → "No matches — try a broader search or [contact us]"
- Year-ambiguous models (e.g., "iPad Air" with multiple generations) → secondary picker for generation/year

---

## Step 4 — Repair type

**Purpose:** Choose what's wrong with the device.

**Layout:** Icon-led list of repair categories with brief descriptions:
- Cracked screen
- Battery (won't hold charge, swelling, rapid drain)
- Charge port (won't charge, loose connection)
- Water damage
- Back glass
- Camera (lens, focus, blurry)
- Speaker / microphone
- Software / setup
- Not sure — I need a diagnostic

**Inputs:** single category selection

**Validation:** none beyond selection

**Edge case — "Not sure":** routes the customer into the [Diagnostic intake sub-flow](#diagnostic-intake-sub-flow). The main 12-step funnel does NOT continue — the customer answers a richer set of questions in the sub-flow and gets a manual quote within 24 hours.

**Cross-check:** if the selected combo (device model × repair category) has no `RepairOffering` row (see `04`), surface a "We can usually handle this — let us look at it" path that routes into the Diagnostic intake sub-flow with the device + repair category pre-filled. Don't block the customer; route them to the sub-flow.

---

## Step 5 — Service mode

**Purpose:** Choose drop-off at a partner shop vs. on-site technician visit.

**Layout:** Two large cards side-by-side:
- **Drop off at a shop** — "Bring your device to a nearby partner. Most repairs same-day."
- **On-site service** — "A vetted technician comes to you. Available in select areas." (badge: "B2B accounts use this by default")

**Eligibility logic:**
- On-site is gated by: ZIP coverage (computed retroactively at step 6 if not known) + `RepairOffering.on_site_eligible` flag (water damage and back glass typically aren't on-site eligible)
- If we don't yet have a ZIP, show both cards and validate at step 6
- If repair is not on-site eligible, the on-site card is locked with an inline explanation

**B2B variant:** on-site is the default selected card; drop-off is shown but de-emphasized.

**Edge case — only one mode available for this combo:** auto-select and advance with a brief toast ("This repair is in-shop only — we'll show you nearby shops next.")

---

## Step 6 — Location

**Purpose:** Capture the customer's ZIP (drop-off) or full address (on-site).

**Layout:**
- **Drop-off mode:** single ZIP input (5-digit numeric), with autocomplete suggestions via Google Places (limited to NC + adjacent SC ZIPs)
- **On-site mode:** full address input with Google Places autocomplete, then a map preview showing the address pin
- Below the input: a static map of our covered service area with all 7 cities highlighted

**Inputs:** ZIP (5-digit) or full address string

**Validation:**
- ZIP: 5 digits, must resolve to a `CoverageArea` row (see `04`)
- Address: must geocode successfully via Google; must fall within a service-area polygon (or, on-site, within an on-site shop's service radius)

**Empty state:** "Enter your ZIP to see nearby shops"

**Loading state:** skeleton on map; spinner inside input on autocomplete

**Error states:**
- ZIP not in coverage: "We're not in [ZIP] yet — get notified when we launch there" + email capture (creates a waitlist row)
- Address geocode fails: "We couldn't find that address — try again or [contact us]"
- Network timeout to Google Maps API: graceful fallback to manual ZIP entry without autocomplete (degraded but still functional)
- ZIP is just outside coverage (within ~5 miles): "We don't cover [their city] yet, but [nearest covered city] is X miles away" with link to switch

---

## Step 7 — Shop + slot OR ETA window

**Purpose:** Match customer to a partner shop + time slot (drop-off) or schedule an on-site visit.

### Drop-off variant

**Layout:**
- Map on left (showing customer's ZIP marker + 3-5 nearest shops, distance-sorted)
- Shop cards on right (sortable by distance, rating, soonest availability):
  - Shop name, address, distance
  - Shop photo (square)
  - Hours summary ("Open today until 7 PM")
  - Soonest slot pill ("Available today 4-6 PM")
  - "Select shop →" CTA
- Selected shop reveals a slot grid (next 7 days × half-day chunks AM/PM, OR hourly if shop's hours support it)

**Inputs:** shop selection + slot selection

**Validation:**
- Shop must be active (`Shop.status = active`) and have `capabilities` covering this device + repair combo
- Slot must not be already-booked (re-validated at step 11 submit)

**Empty state:** "No shops in your area" — fallback to waitlist email capture (shouldn't happen if step 6 validated; defensive)

**Loading state:** skeleton on map + cards

**Error states:**
- Slot taken between display and submit: "That slot was just taken — here are the next 3 available" (server returns next-best slots; UI animates the switch)
- Network error during slot fetch: retry button; cached slot grid from initial load remains visible (with a "may be stale" indicator)

### On-site variant

**Layout:**
- Address summary at top (editable back-link to step 6)
- Available ETA windows for the next 7 days as a grid (2-hour windows, e.g., "Tomorrow 10 AM – 12 PM")
- Each window shows the assigned partner shop name underneath (so the customer knows who's coming and can look them up)

**Inputs:** window selection

**Validation:** window not over-capacity; partner shop still active

**Edge case:** if no on-site shop has availability in next 7 days, offer drop-off fallback ("On-site is fully booked this week — would you like to drop off instead?") or waitlist email capture

---

## Step 8 — Contact info

**Purpose:** Get the customer's contact details so we can confirm and notify.

**Layout:** Form with:
- Name (full)
- Email
- Phone (US format with mask)
- Optional toggle: "Create an account so you can track this and future repairs" — auto-creates a Clerk user on submit if enabled
- Optional toggle: "Text me status updates" (default on)

**Inputs:** name, email, phone, optional password (if account opt-in)

**Validation:**
- Name: 2+ chars; allows letters, spaces, apostrophes, hyphens
- Email: RFC-compliant format; rejects disposable-email domains
- Phone: 10-digit US (or US + Canada NANP); extensions not supported in v0.5
- Password (if account opt-in): Clerk's defaults (min length, common-password rejection)

**Loading state:** "Saving..." spinner on submit

**Error states:**
- Inline field errors with `aria-describedby` association
- Edge case — email already has a Clerk account: "Looks like you already have an account — [sign in to continue] or [continue as guest]"

**B2B variant:** authenticated B2B users skip this step entirely; their contact info is on file. The `submitter` user from `BusinessUser` (see `04`) is recorded on the `Order`.

---

## Step 9 — Device data & wipe consent

**Purpose:** Capture the customer's explicit acknowledgment of data-handling expectations and choice of wipe scope. Single biggest D2C liability surface aside from device damage.

**Layout:**
- Header: "Before we repair your device"
- Paragraph 1: "You are responsible for backing up your data. We strongly recommend backing up before drop-off or before the technician arrives. Repairs sometimes require a factory reset; while rare, data loss is possible."
- Required checkbox: "I confirm I have backed up my data, or I accept the risk of data loss during repair."
- Section heading: "Data wipe preference"
- Three radio options (one must be selected — exact wording subject to legal review in `09`):
  - **Customer-responsible only** (default): "I'll handle any data wipe myself. The technician will not touch my data."
  - **Basic wipe attempted** — "If a factory reset is appropriate for the repair, the technician may perform one. No guarantees."
  - **Full wipe on request** — "Please perform a full data wipe as part of the repair." (Adds [TBD per `09`] to the price; shown only if the policy decision in `09` permits this as a paid add-on.)
- Link: "Read our full data-handling policy →" (opens `/legal/data-handling` in a new tab)
- Submit button: "Continue"

**Inputs:** required checkbox + required radio selection

**Validation:** both required; submit disabled until both are present; visually clear that they're required (asterisk + helper text)

**On submit:** create `DeviceIntakeConsent` row (`04`) with:
- `order_id` (will be linked when Order is created at step 11)
- `customer_id` (if authenticated, else null until account claim)
- `backup_acknowledged_at = now`
- `wipe_scope` = selected radio value
- `consent_at = now`
- `ip_address` (from request)
- `user_agent` (from request)
- `policy_version` (constant for current policy revision; bumped when policy text changes)

The consent row is created **before** the Order row at submit time, then linked to the Order when the Order is created. If the Order creation fails (Stripe error, etc.), the consent row remains and can be reattached on retry — it's never deleted.

**Empty / loading state:** N/A (static page)

**Error state:** if `DeviceIntakeConsent` insert fails (DB unavailable), block submit and surface "Saving your consent — please retry"; this is a legal record, not a soft event.

**Edge case — customer declines:** they cannot proceed without checking + selecting. Banner appears: "We require this consent to perform repairs. If you have questions, [call us] or [email us]." No funnel-bypass path.

**B2B variant:** B2B accounts have a master DPA at the contract level (see `09`) that covers data-handling consent for all of the account's submitted devices. For B2B-authenticated bookings, step 9 is skipped entirely; an automatic `OrderEvent` of type `admin_action` is logged with `payload = { reason: "consent_covered_by_contract", contract_id: ... }` for traceability.

---

## Step 10 — Quote summary + add-ons

**Purpose:** Show the customer the price, any add-ons, and a clear total.

**Layout:**
- Order summary card:
  - Device + repair (e.g., "iPhone 15 Pro — Screen replacement")
  - Service mode (drop-off at [Shop Name] / on-site at [Address])
  - Slot or window
  - Base price ($XXX)
- Add-ons (each toggleable):
  - **Extended warranty** — default 90 days included; upgrade to 180 days for $X or 365 days for $Y (TBD in `09`)
  - **Same-day priority** — "+$Y" — only shown if shop confirms same-day availability via capacity check
  - **Full data wipe** — shown only if customer selected this option in step 9 AND policy treats it as paid add-on (`09`)
- Subtotal + estimated tax (Stripe Tax computes) + total
- "Continue to payment →" CTA

**Inputs:** add-on toggles

**Validation:** N/A (toggles are optional)

**Edge case — base price not available for this combo:** show "Quote will be confirmed in-shop" and route to a deposit-only flow ($X deposit, balance on completion). The deposit is the only line item charged at step 11.

**B2B variant:** prices reflect the business's `PricingTier` multiplier (`04`); display shows "Standard price: $XXX / Your price: $YYY (tier: <name>)".

---

## Step 11 — Payment

### D2C variant

**Layout:**
- Order recap at top (collapsible)
- Stripe Payment Element (Card, Apple Pay, Google Pay, Link)
- Billing address (auto-filled from contact info; editable)
- "Pay $XXX" CTA (amber, prominent)

**On submit:**
1. Client: generate `Order.idempotency_key` (UUID v4 if not already set in session)
2. Client → Server: `POST /api/orders` with full funnel state + idempotency_key. Server upserts on idempotency_key: if exists, returns the existing Order; if not, creates Order with `status = quote`, links the `DeviceIntakeConsent` from step 9
3. Server: create Stripe `PaymentIntent` with the same idempotency_key (Stripe-side dedupe)
4. Server: return `clientSecret` to client
5. Client: confirm Stripe payment with the element
6. Stripe → Webhook handler (Inngest event): `payment_intent.succeeded` → update Order to `booked`, fire confirmation email + SMS (also via Inngest)

**Inputs:** payment info (handled by Stripe element)

**Validation:** Stripe handles card validation, 3DS challenge, etc.

**Error states:**
- Decline: inline error "Card declined — try another method"; funnel state preserved; payment intent retried with same idempotency key
- 3DS challenge: handled by Stripe element flow
- Network error: idempotency key prevents duplicate charge on retry
- Stripe webhook fails to fire (rare): Inngest nightly reconciliation catches divergence; customer can refresh `/track/[id]` and order will appear once webhook lands

**Edge case — network error AFTER payment but BEFORE order confirmation:** customer sees a "Hold on — confirming your payment" page that polls server every 2s; Inngest retries the payment-success webhook; once landed, customer is redirected to confirmation. Worst case: customer is on the holding page for 30s.

**Edge case — slot taken between step 7 and step 11:** server validates slot availability at order create; if conflict, return 409 + next-best slots; client re-presents step 7 with the conflict surfaced.

### B2B variant

- No Stripe charge
- Server creates Order with `status = booked` directly, `payment_id = null`, `business_id = <authenticated business>`
- Order rolls into the business's monthly invoice (v1.0 flow — see `08`)
- Client shows: "Order submitted — billed to your account at month-end" with order ID

---

## Step 12 — Confirmation

**Purpose:** Tell the customer what just happened and what to expect next.

**Layout:**
- Big check icon + "Repair booked"
- Order ID (`ord_8aZk2X9`) with copy button
- Recap card (device, repair, shop or address, slot, total)
- "What happens next":
  - "We'll text and email you when the shop accepts (usually within 30 minutes)"
  - [Drop-off:] "Bring your device to [Shop Name] at [Slot Start]"
  - [On-site:] "Be ready at [Address] during [Window]"
  - "Track your repair anytime: [link]"
- Tracking URL: `crownrepair.com/track/[orderId]` (signed)
- "Add to calendar" button (downloads `.ics`)
- "Create an account to see all your repairs" CTA (guests only; one-click upgrade if email matches Clerk user)
- Footer: "Need to change something? [Contact us]"

**On render:**
- Confirmation email + SMS already triggered by `payment_intent.succeeded` webhook
- localStorage session cleared
- `booking_completed` analytics event fired

**Edge case — SMS opt-in:** if customer didn't opt into SMS at step 8, show a one-tap toggle ("Get text updates on your repair") that registers consent and triggers an SMS confirmation immediately

---

## Diagnostic intake sub-flow

A 4-step branch OFF the main funnel, triggered when a customer can't be matched to a `RepairOffering`. Entry points:

- Step 2 — customer clicks "My brand isn't here"
- Step 3 — customer clicks "Don't see your exact model?"
- Step 4 — customer selects "Not sure — I need a diagnostic"
- Step 4 — selected device × repair combo has no `RepairOffering` (cross-check fallback)

This sub-flow does **NOT** create a confirmed `Order`. It creates an admin-queued lead that an ops team member reviews and quotes manually within 24 hours.

### Sub-step D1 — Describe issue + photos

- Free-text description (200-character min, 2000-character max)
- Photo upload — up to 5 images (PNG / JPG / HEIC, drag-drop or click-to-upload)
- "When did this start?" — optional dropdown (today / this week / this month / longer)
- **Validation:** description min 200 chars; at least 1 photo required
- Submit advances to D2; back returns to whichever main-funnel step the user entered from

### Sub-step D2 — Device + contact info

- Device type dropdown (Phone / Tablet / Laptop / Smartwatch / Gaming / Other)
- Make + model free-text (not constrained to catalog)
- Contact: name, email, phone — same validations as main-funnel step 8
- Optional: "Create an account so we can follow up there" Clerk toggle
- **B2B variant:** authenticated B2B users skip contact entry; the lead is auto-attributed to their account

### Sub-step D3 — Preference

- Drop-off at a shop / On-site visit at my location / I'm not sure — talk to me
- ZIP if on-site is preferred (validates against `CoverageArea`; out-of-coverage routes to waitlist + still creates a lead)

### Sub-step D4 — Confirmation

- "Thanks — we got it" header
- Lead ID with copy button (`lead_…`)
- Copy: "A Crown Repair team member will review your photos and follow up within 24 hours with a recommended repair, quote, and next step. Watch your email and texts."
- "While you wait" CTA: link to `/how-it-works`

### Backend behavior

Creates a `DiagnosticLead` row (lightweight entity — when this flow is implemented in Phase 0.5+, add to `04`; fields would include: `id`, `description`, `photoUrls[]`, `deviceType`, `deviceFreeText`, contact fields, preference, `zip`, `status` enum: `new | quoted | converted | declined | abandoned`, `assignedAdminUserId?`, timestamps).

Surfaces in admin at `/admin/diagnostic-leads` as a queue. Ops member reviews the photos, prepares a quote, sends a custom email. If the customer accepts, the lead is converted to a real `Order` via an admin-side action and the lead's `status` becomes `converted`.

### Edge case — customer abandons mid-sub-flow

Lead row is created at D2 submit (so we capture the photos + description even if they don't finish). Status set to `new` with a flag `incomplete = true`. Ops can still reach out (we have email/phone from D2).

---

## Order lifecycle SLAs

Once an order reaches `booked`, the following SLAs apply:

| Transition | Target | Hard deadline | Behavior |
|---|---|---|---|
| `booked → accepted` | 30 minutes | 2 hours (`Order.acceptanceDeadlineAt` — see `04`) | Customer is told at booking: "Most shops accept within 30 minutes." Inngest function watches `acceptanceDeadlineAt`; at deadline, marks the current shop's assignment as declined-by-timeout, attempts to reassign to the next-nearest shop with matching `capabilities`, notifies the customer of the reassignment via email + SMS. If no alternative shop has availability, the customer is offered a full refund and an ops alert is raised. |
| `accepted → in_progress` | At or after `scheduledAt` | — | Shop must upload at least one `OrderIntakePhoto` (`04`) before this transition is permitted. Enforced server-side at the status-update endpoint. |
| `in_progress → ready` | Within `RepairOffering.estDurationMin × 1.5` | — | Customer is told the estimate at booking. If running over by 1.5×, an automatic "running a bit late" SMS goes out via Twilio. |
| `ready → complete` | 7 days from `ready` | — | Reminder SMS at 24h, 72h, 5d. After 7 days, the order enters the abandoned-property procedure (ops alert; certified-mail notification per `09` strategic items). |

### Customer-facing communication at each transition

Every transition fires both email (Resend) and SMS (Twilio, opt-in respected). Each message includes:

- Order ID
- Current status (human-readable)
- What's expected next
- Tracking link (signed URL to `/track/[orderId]`)

Customers can opt out of SMS per category in `/account/settings`. Email transactional notifications cannot be opted out (legal/operational floor).

### Visibility on the tracker

- `/track/[orderId]` shows the timeline live (sourced from `OrderEvent`)
- While status is `booked`, a countdown shows: "Shop will accept in ~X minutes" — pulled from `Order.acceptanceDeadlineAt`
- After acceptance, the countdown is replaced with the estimated completion time

---

## Funnel-wide edge cases

| Scenario | Behavior |
|---|---|
| Network drops mid-funnel | localStorage holds state; retry on reconnect; step indicator shows "Saving..." |
| Customer changes device after slot lock | "Going back will release this slot. Continue?" confirmation modal |
| Slot expires between step 7 and step 11 | "This slot was held for 10 minutes and expired — picking the next available now" with auto-redirect to step 7 |
| Customer abandons | Session retained 7 days; recovery email at 24h if email captured ("Your repair is half-booked — finish in 2 minutes") |
| Duplicate-submit (double-click pay) | `Order.idempotency_key` returns same order; no double charge |
| Customer declines consent (step 9) | Cannot proceed; offered alternative contact paths |
| B2B user without active contract | Funnel forks at step 1 to `/b2b/contact` (sales lead capture) |
| Payment fails repeatedly (3+ declines) | Lock further attempts for 15 min; surface support contact + alternative payment options |
| Shop declines after booking (within Stripe capture window) | Customer notified; system auto-rebooks to next-available shop if customer opts in (default on); full refund if not |
| Customer behind authenticated VPN with bad geo | Address autocomplete works; coverage check uses address geocode not IP geo |
| Customer in private/incognito | localStorage works for session; recovery via emailed `/quote/[id]` link |

## A/B-testable surfaces (flagged for v1.x experimentation, not v0.5)

- Price reveal timing (show on category list vs. only after slot select)
- Slot density display (calendar vs. list vs. carousel)
- Trust signals on funnel (testimonials in sidebar yes/no)
- Account creation prompt timing (step 8 vs. step 12)
- On-site default for B2B vs. asking each time
- Add-on bundling presentation at step 10

## B2B-specific funnel differences (summary)

| Aspect | D2C | B2B (authenticated) |
|---|---|---|
| Step 5 default | Drop-off | On-site |
| Step 8 (contact) | Required | Skipped (uses authenticated account info) |
| Step 9 (consent) | Required per-order | Covered by master DPA at contract level; step skipped, `OrderEvent` logged for audit |
| Step 10 pricing | Standard | Custom pricing tier applied |
| Step 11 (payment) | Stripe Payment Element | Routed directly to monthly invoice (no charge) |
| Bulk submission | N/A | Available at `/b2b/submit/bulk` (CSV) — bypasses the funnel entirely; see `08` |
| Order acknowledgment | Email + SMS | Email only (configurable per business) |

## Open questions blocking this flow

These must be answered in `09` before the funnel can ship:
- Final pricing for warranty upgrades (180 / 365 day)
- Whether full-data-wipe is a paid add-on, included, or not offered
- Same-day priority pricing
- Diagnostic fee amount + credit-toward-repair rule
- Cancellation window / refund policy
- Whether deposits are allowed for diagnostic-only orders
