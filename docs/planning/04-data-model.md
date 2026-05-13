# 04 — Data Model

## Conventions

- Postgres on Neon; Prisma as ORM (`07`)
- All IDs are short prefixed nanoids: `ord_8aZk2X9`. ID prefixes are stable and listed in `02`.
- All monetary amounts in **integer cents** (column type `Int` or `BigInt` for very large totals). Never `Float`, never `Decimal` for money in this codebase.
- All timestamps stored UTC, type `DateTime` (Postgres `timestamptz`).
- Soft-delete is **not** used by default; entities use `status` enums. Exception: `User` supports hard delete on request per GDPR-style data deletion policy.
- All entities have `created_at`, `updated_at` (`@updatedAt` in Prisma).
- Indexes specified inline where they're load-bearing for known query paths.

## Entity list

### `User`

```
id              String   @id @default(...)     // usr_…
clerkId         String   @unique               // mirrors Clerk's user id
email           String   @unique
phone           String?
name            String
role            UserRole                       // enum: customer | shop_staff | shop_owner | b2b_user | admin | super_admin
status          UserStatus                     // active | suspended | deleted_pending
created_at      DateTime @default(now())
updated_at      DateTime @updatedAt
deleted_at      DateTime?                      // set when GDPR-style deletion is requested; row hard-removed after 30 days

// relations
businesses      BusinessUser[]
shops           ShopUser[]
orders          Order[]                        // customer-side
consents        DeviceIntakeConsent[]
```

PII fields: `email`, `phone`, `name`. Encrypted at rest by Neon. Logs scrub `email` + `phone`.

---

### `Business`

```
id              String   @id                   // biz_…
name            String
slug            String   @unique
type            BusinessType                   // school | property_mgmt | hospitality | construction | real_estate | insurance | other
billingEmail    String
billingAddress  Json                           // structured: { line1, line2, city, state, zip }
netTermsDays    Int      @default(30)
pricingTierId   String?
contractId      String?                        // current active contract
status          BusinessStatus                 // prospect | onboarding | active | paused | terminated
notes           String?                        // sales notes
created_at      DateTime
updated_at      DateTime

// relations
users           BusinessUser[]
orders          Order[]
invoices        Invoice[]
contracts       Contract[]
pricingTier     PricingTier?
bulkSubmissions BulkSubmission[]
```

Index: `status`, `slug`.

---

### `BusinessUser` (junction)

```
businessId      String
userId          String
role            BusinessUserRole               // owner | admin | submitter | viewer
created_at      DateTime

@@id([businessId, userId])
@@index([userId])
```

---

### `Shop`

```
id                  String   @id               // shp_…
name                String
slug                String   @unique
address             Json                       // { line1, line2, city, state, zip }
geoLat              Decimal                    // for distance queries
geoLng              Decimal
phone               String
email               String
hours               Json                       // structured weekly hours + exceptions
stripeAccountId     String?  @unique           // Stripe Connect account id, e.g., acct_…
stripeOnboardingDone Boolean @default(false)
capabilities        String[]                   // device-type and repair-category slugs the shop handles
maxDailyCapacity    Int      @default(20)
onSiteRadiusMiles   Int?                       // null if shop doesn't offer on-site
status              ShopStatus                 // prospective | onboarding | active | paused | terminated
notes               String?                    // ops notes
created_at          DateTime
updated_at          DateTime

// relations
users               ShopUser[]
orders              Order[]
payouts             Payout[]
```

Indexes: `status`, `(geoLat, geoLng)`, `slug`.

---

### `ShopUser` (junction)

```
shopId          String
userId          String
role            ShopUserRole                   // owner | tech | manager
created_at      DateTime

@@id([shopId, userId])
@@index([userId])
```

---

### `DeviceBrand`

```
id              String   @id                   // brand_…
name            String                         // "Apple", "Samsung", "Google"
slug            String   @unique               // "apple", "samsung"
logoUrl         String
sortOrder       Int
created_at      DateTime
updated_at      DateTime

models          DeviceModel[]
```

---

### `DeviceModel`

```
id              String   @id                   // dvm_…
brandId         String
name            String                         // "iPhone 15 Pro"
slug            String                         // "iphone-15-pro"
year            Int
imageUrl        String
sortOrder       Int
popularFlag     Boolean  @default(false)       // highlighted in the picker
deviceType      DeviceType                     // phone | tablet | laptop | smartwatch | gaming
created_at      DateTime
updated_at      DateTime

brand           DeviceBrand   @relation(...)
offerings       RepairOffering[]

@@unique([brandId, slug])
@@index([deviceType, popularFlag])
```

---

### `RepairCategory`

```
id              String   @id                   // rcat_…
slug            String   @unique               // "screen", "battery", etc.
name            String
icon            String                         // lucide-react icon name
description     String
onSiteEligibleDefault Boolean                   // category-level default; can be overridden per offering
sortOrder       Int

offerings       RepairOffering[]
```

---

### `RepairOffering`

```
id                  String   @id               // off_…
deviceModelId       String
repairCategoryId    String
basePriceCents      Int                        // standard D2C price; B2B applies tier multiplier
estDurationMin      Int                        // estimate for slot blocking
warrantyDays        Int      @default(90)
onSiteEligible      Boolean                    // overrides category default
partsSku            String?                    // for shop ops; not customer-visible
status              OfferingStatus             // active | draft | retired
created_at          DateTime
updated_at          DateTime

deviceModel         DeviceModel
repairCategory      RepairCategory
orderLineItems      OrderLineItem[]

@@unique([deviceModelId, repairCategoryId])
@@index([status])
```

---

### `Order`

```
id                  String   @id               // ord_…
publicRef           String   @unique           // human-friendly: 8-char alphanumeric for customer service
customerId          String?                    // null for guest checkout until claimed
businessId          String?                    // set for B2B orders
shopId              String
deviceModelId       String
serviceMode         ServiceMode                // drop_off | on_site
status              OrderStatus                // quote | booked | accepted | in_progress | ready | complete | cancelled | disputed
scheduledAt         DateTime?                  // slot start time
acceptanceDeadlineAt DateTime?                 // populated when status → booked; default booked_at + 2h; Inngest watches this and escalates to next-nearest shop if not accepted by deadline (see `03` Order lifecycle SLAs)
address             Json?                      // for on-site orders
totalCents          Int
platformFeeCents    Int                        // what we keep
shopPayoutCents     Int                        // what shop gets
paymentId           String?                    // null for B2B until invoiced
idempotencyKey      String   @unique           // client-generated UUID v4; prevents duplicate orders on retry
notes               String?                    // customer-provided notes at booking
completedAt         DateTime?
created_at          DateTime
updated_at          DateTime

customer            User?
business            Business?
shop                Shop
deviceModel         DeviceModel
lineItems           OrderLineItem[]
intakePhotos        OrderIntakePhoto[]
events              OrderEvent[]
payment             Payment?
warranty            Warranty?
consent             DeviceIntakeConsent?

@@index([shopId, status])
@@index([customerId, created_at])
@@index([businessId, created_at])
@@index([status, scheduledAt])
```

---

### `OrderLineItem`

```
id                  String   @id               // oli_…
orderId             String
repairOfferingId    String?                    // null for ad-hoc/diagnostic items
description         String
priceCents          Int
quantity            Int      @default(1)
addOnType           AddOnType?                 // warranty_upgrade | same_day_priority | full_data_wipe | diagnostic_fee | null

order               Order
repairOffering      RepairOffering?
```

---

### `OrderIntakePhoto`

```
id              String   @id                   // oip_…
orderId         String
photoUrl        String                         // Vercel Blob URL
takenAt         DateTime
takenByUserId   String                         // the shop_staff user who captured the photo
notes           String?                        // condition notes (e.g., "small dent on top-left corner")
created_at      DateTime

order           Order
takenBy         User      @relation(fields: [takenByUserId], references: [id])

@@index([orderId, takenAt])
```

Captured by partner shop at intake before transitioning `Order.status` from `accepted → in_progress`. **Required for dispute defense.** The `in_progress` transition is server-side-gated on the existence of at least one `OrderIntakePhoto` for the order — the shop dashboard's status button is disabled until upload is complete (see `08` Track D). Photos are immutable once captured; never edited or deleted (only soft-archived via admin override for legal-compliance scenarios).

---

### `OrderEvent` (append-only audit log)

```
id              String   @id                   // evt_…
orderId         String
type            OrderEventType                 // status_change | note | customer_msg | shop_msg | admin_action | system
payload         Json                           // event-specific data
actorUserId     String?                        // null for system events
created_at      DateTime

order           Order
```

**This is the source of truth for order history.** The current `Order.status` is denormalized for query speed, but the canonical audit trail is the events. Never update an event in-place — always append.

Index: `(orderId, created_at)`.

---

### `Payment`

```
id                          String   @id       // pmt_…
orderId                     String   @unique
idempotencyKey              String   @unique   // passed to Stripe API + used by webhook handler to dedupe
stripePaymentIntentId       String?  @unique
status                      PaymentStatus      // pending | succeeded | failed | refunded | partial_refund
amountCents                 Int
capturedAt                  DateTime?
refundedCents               Int      @default(0)
created_at                  DateTime
updated_at                  DateTime

order                       Order
```

Replaying the same Stripe webhook event always produces the same Payment row state — never duplicate updates.

---

### `Payout`

```
id                  String   @id               // pyt_…
shopId              String
stripeTransferId    String?  @unique           // Stripe Connect transfer
amountCents         Int
periodStart         DateTime
periodEnd           DateTime
status              PayoutStatus               // pending | paid | failed
orderIds            String[]                   // orders included in this payout batch
created_at          DateTime

shop                Shop
```

Indexes: `(shopId, periodStart)`.

---

### `Warranty`

```
id              String   @id                   // wty_…
orderId         String   @unique
expiresAt       DateTime
termsVersion    Int                            // bumped when warranty terms change; immutable per warranty
created_at      DateTime

order           Order
claims          WarrantyClaim[]
```

---

### `WarrantyClaim`

```
id                  String   @id               // wcl_…
warrantyId          String
status              ClaimStatus                // submitted | reviewing | approved | denied | resolved
description         String                     // customer's description of the issue
resolutionNotes     String?                    // internal notes
resolvedAt          DateTime?
created_at          DateTime
updated_at          DateTime

warranty            Warranty
```

---

### `DeviceIntakeConsent` ← load-bearing for liability

```
id                      String   @id           // cns_…
orderId                 String?  @unique       // linked after Order creation; null briefly during the create transaction
customerId              String?                // null for guest; populated when claimed
backupAcknowledgedAt    DateTime
wipeScope               WipeScope              // customer_responsible | partner_attempt_basic | partner_full_wipe
consentAt               DateTime
ipAddress               String                 // request IP at consent capture
userAgent               String                 // request UA at consent capture
policyVersion           Int                    // increments when the data-handling policy text changes
created_at              DateTime

order                   Order?
customer                User?
```

**Immutability:** rows in this table are NEVER updated or deleted. If consent needs to be re-captured (e.g., user changes funnel direction), a new row is created with a fresh `consentAt`.

For B2B orders covered by a master DPA: this row is not created; instead an `OrderEvent` of type `admin_action` is logged with payload `{ reason: "consent_covered_by_contract", contractId, policyVersion }`.

---

### `Contract`

```
id              String   @id                   // cnt_…
businessId      String
termsPdfUrl     String                         // signed PDF
signedAt        DateTime
expiresAt       DateTime?
pricingTierId   String?
status          ContractStatus                 // draft | active | expired | terminated
notes           String?
created_at      DateTime
updated_at      DateTime

business        Business
pricingTier     PricingTier?
```

---

### `PricingTier`

```
id                  String   @id               // ptr_…
name                String                     // "Standard B2B", "Education Tier", "Hospitality Tier"
multiplierBps       Int                        // basis points; 10000 = 1.0×, 9000 = 0.9× (10% off)
fixedDiscountCents  Int?                       // optional flat discount on top of multiplier
appliesTo           AppliesTo                  // all | b2b_only
description         String
status              TierStatus                 // active | retired
created_at          DateTime
updated_at          DateTime

businesses          Business[]
contracts           Contract[]
```

Multiplier stored as basis points (10000 = 1.0×) to avoid float math.

---

### `Invoice`

```
id              String   @id                   // inv_…
businessId      String
periodStart     DateTime
periodEnd       DateTime
orderIds        String[]                       // orders rolled into this invoice
subtotalCents   Int
taxCents        Int
totalCents      Int
status          InvoiceStatus                  // draft | sent | paid | overdue | void
pdfUrl          String?                        // generated PDF URL (Vercel Blob)
sentAt          DateTime?
paidAt          DateTime?
dueAt           DateTime?                      // sentAt + business.netTermsDays
created_at      DateTime
updated_at      DateTime

business        Business
```

Indexes: `(businessId, periodStart)`, `(status, dueAt)`.

---

### `BulkSubmission`

```
id              String   @id                   // bsm_…
businessId      String
csvUrl          String                         // uploaded CSV in Vercel Blob
parsedCount     Int                            // total rows attempted
errorCount      Int
status          BulkStatus                     // uploaded | processing | completed | failed
createdOrderIds String[]                       // orders created from this submission
errors          Json                           // per-row error array: [{ row, field, message }, ...]
created_at      DateTime
updated_at      DateTime

business        Business
```

---

### `CoverageArea`

```
id              String   @id                   // cov_…
name            String                         // "Charlotte", "Concord", etc.
slug            String   @unique               // matches /locations/[slug]
zipCodes        String[]                       // list of 5-digit ZIPs we cover for this area
shopIds         String[]                       // shops serving this area
serviceModes    ServiceMode[]                  // [drop_off] or [drop_off, on_site]
geoBoundary     Json?                          // optional GeoJSON polygon for precise on-site geo gating
created_at      DateTime
updated_at      DateTime
```

---

### `FailedWebhook` (dead-letter queue)

```
id              String   @id                   // fwh_…
source          WebhookSource                  // stripe | twilio | resend | inngest
eventId         String                         // upstream event id (Stripe evt_…, etc.)
eventType       String                         // stripe event type, etc.
payload         Json                           // full payload received
lastError       String                         // last error message
retryCount      Int
status          FailedWebhookStatus            // pending | replayed | abandoned
created_at      DateTime
lastAttemptedAt DateTime
```

Populated by Inngest after retries exhaust. Admin UI lists pending rows for manual replay (see `08` webhook reliability section).

---

### `WaitlistSignup`

```
id              String   @id                   // wls_…
email           String
zip             String
deviceType      DeviceType?
repairType      String?
source          String?                        // analytics ref
created_at      DateTime

@@index([zip, created_at])
```

Populated when a customer enters a ZIP outside our coverage at step 6.

---

### `ShopMetrics` (denormalized; recomputed nightly)

```
shopId                  String   @id @unique
completionRate          Decimal                // 0.0-1.0; accepted orders that reached complete (vs. cancelled or disputed-against-shop)
reworkRate              Decimal                // 0.0-1.0; completed orders that produced a warranty claim within terms
avgCustomerRating       Decimal?               // 1.0-5.0; null until at least 3 reviews are on record
onTimeAcceptanceRate    Decimal                // 0.0-1.0; orders accepted within the 30-minute target
avgCompletionTimeMin    Int                    // average minutes from `accepted` → `complete`
lastCalculatedAt        DateTime

shop                    Shop      @relation(fields: [shopId], references: [id])
```

Updated nightly by an Inngest scheduled function from `Order` + `OrderEvent`. Never updated transactionally; always batch-recomputed (so it's safe to replay).

Consumed by:
- Admin reporting (`/admin/reporting`, `/admin/shops/[id]`)
- Customer-facing sort ordering on city pages (`/locations/[city]` shop list) and booking step 7 — when distances are roughly equal, higher-rated shops surface first

Staleness behavior: if `lastCalculatedAt` is older than 48 hours, treat the row as unranked and fall back to distance-only sort.

---

## Entity relationship diagram

```
User ─┬─ BusinessUser ─── Business ─┬─ Contract ─── PricingTier
      │                              ├─ Invoice
      ├─ ShopUser ─── Shop ─┬─ Order ─┬─ OrderLineItem ─── RepairOffering ─── DeviceModel ─── DeviceBrand
      │                     │         │                                     └─ RepairCategory
      │                     ├─ Payout │
      │                     │         ├─ OrderEvent
      │                     │         ├─ Payment
      │                     │         ├─ Warranty ─── WarrantyClaim
      │                     │         └─ DeviceIntakeConsent
      │                     │
      └─ (customer) ────────┘

CoverageArea ─── (shopIds[]) ─── Shop
BulkSubmission ─── (createdOrderIds[]) ─── Order
FailedWebhook (standalone, references upstream IDs only)
WaitlistSignup (standalone)
```

## Indexing strategy

Beyond the inline indexes above, plan to add:

- `Order.status` filtered partial index on `(status='booked')` and `(status='in_progress')` for fast shop-dashboard queries
- `OrderEvent.created_at` for time-bounded queries in admin
- `Invoice.dueAt` partial index on `(status='sent')` for overdue detection nightly job
- `Payment.stripePaymentIntentId` unique (already declared) — webhook dedup hot path

Run `EXPLAIN ANALYZE` on these queries during Phase 0.5 load testing; add indexes based on actual plan.

## Money handling rules

- Every money column is `Int` (or `BigInt` for `Invoice.totalCents` if a single B2B invoice ever exceeds $21M — defensive)
- Currency is USD-only for MVP; no multi-currency support until international expansion
- Tax computed via Stripe Tax at order creation; stored on `OrderLineItem` if line-level, otherwise on `Order.totalCents` aggregate. Decide tax-line granularity per `09`.
- Refunds: full or partial. Stored on `Payment.refundedCents`; never negative line items
- Platform fee = `totalCents - shopPayoutCents` at order creation time; locked in at booking, not retroactively recalculated when pricing tiers change

## Idempotency strategy

Every state-changing operation carries an explicit idempotency key. The pattern:

1. **Booking submit:** Client generates `Order.idempotencyKey` (UUID v4) at start of payment step. Server's `POST /api/orders` upserts on this key.
2. **Stripe API calls:** Server passes `Payment.idempotencyKey` (same UUID) to Stripe; Stripe dedupes its own retry behavior on this key.
3. **Webhook handlers (via Inngest):** Each handler is a pure function of `(eventId, payload)`. Replaying the same Stripe `evt_…` produces the same Order/Payment state.
4. **Inngest functions:** Use the event ID as the function-run idempotency key so a duplicate enqueue is a no-op.

Replaying any event twice — from Stripe's retries, from manual DLQ replay, from operator error — is always safe.

## Append-only audit via `OrderEvent`

The `Order.status` column exists for query speed. The truth is `OrderEvent`. Every transition:

- `customer_books`            → status change `null → quote → booked` (on payment success)
- `shop_accepts`              → `booked → accepted`
- `shop_in_progress`          → `accepted → in_progress`
- `shop_ready`                → `in_progress → ready`
- `customer_picks_up`         → `ready → complete`
- `shop_declines`             → `booked → cancelled` (auto-rebook if customer opted in)
- `customer_cancels`          → `booked → cancelled` (refund)
- `admin_dispute_opens`       → `* → disputed`
- `admin_dispute_resolves`    → `disputed → <prior status>`

Reconciliation job nightly verifies `Order.status` matches the latest `OrderEvent.payload.newStatus`.

## Privacy & PII handling

**PII fields:**
- `User.email`, `User.phone`, `User.name`
- `Order.address` (for on-site)
- `DeviceIntakeConsent.ipAddress`, `userAgent`

**Encryption at rest:** Neon's default (Postgres TDE-equivalent at the storage layer).
**Encryption in transit:** TLS 1.3 enforced; no plain HTTP anywhere.
**Logging discipline:** all server logs scrub `email`, `phone`, `address`. Sentry breadcrumbs scrubbed by middleware.
**Deletion-on-request:** `User.deleted_at` set; row scheduled for hard removal after 30 days; orders + payments retained (financial record), email/phone/name redacted to `[deleted]`; consents retained with PII redacted.

## What's NOT in this model (deferred)

- `Referral` (loyalty program — v1.x)
- `Subscription` (subscription warranty — v1.x)
- `Inventory` / `Part` (parts management — partner shop concern, not platform)
- `Conversation` / `Message` (in-app chat — v1.x; for now, OrderEvent type `customer_msg` / `shop_msg` captures the rare async note)
- `Notification` (we send via Resend/Twilio at the moment they're triggered; no notification entity yet — add if we need preferences beyond opt-in/opt-out)
