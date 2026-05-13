# 02 — Information Architecture

## Domain & subdomain strategy

**Recommendation: single domain, path-based areas with role-gated middleware.**

- Customer surfaces: `crownrepair.com/*` (final brand name TBD in `09`)
- Shop dashboard: `crownrepair.com/shop/*` (role-gated via Clerk middleware)
- B2B portal: `crownrepair.com/b2b/*` (mix of public marketing under `/b2b/{vertical}` and authenticated portal under `/b2b/dashboard` etc.)
- Admin: `crownrepair.com/admin/*` (role-gated; behind Clerk super-admin role)

**Why not subdomains?**
- Subdomains add cookie/CORS friction with Clerk and Stripe
- SEO juice flows naturally on a single domain
- Vercel deployment is simpler (one project, one cert, one set of env vars)
- Path-based gating is well-trodden in Next.js App Router middleware

**Where subdomains MIGHT be added later:** a public status page (`status.crownrepair.com`) or developer docs (`docs.crownrepair.com`) — but not for the core product.

## URL conventions

| Rule | Example |
|---|---|
| Lowercase only | `/services/screen-replacement` (not `/Services/Screen-Replacement`) |
| Hyphens, not underscores | `/locations/rock-hill` |
| No trailing slashes | `/about` not `/about/` |
| Deep-link query params for the funnel | `/book?device=iphone-15-pro&repair=screen&zip=28202` |
| IDs are short prefixed nanoids | `/track/ord_8aZk2X9` |
| Plural for collection, singular noun for resource | `/orders`, `/orders/[id]` |
| Action verbs at end of path | `/account/warranty-claims/new` |

All ID prefixes (defined in `04`): `ord_` order, `shp_` shop, `biz_` business, `pmt_` payment, `pyt_` payout, `wty_` warranty, `wcl_` warranty claim, `cns_` consent, `inv_` invoice, `cnt_` contract, `bsm_` bulk submission, `evt_` order event, `fwh_` failed webhook.

## Full sitemap

### Public marketing surface

```
/                                            home
/services                                    overview
/services/screen-replacement                 category page
/services/battery-replacement
/services/charge-port-repair
/services/water-damage
/services/back-glass-replacement
/services/camera-repair
/services/speaker-mic-repair
/services/software-diagnostic
/devices                                     brand grid
/devices/apple                               brand page
/devices/apple/iphone-15-pro                 device-model page
/devices/apple/iphone-15
/devices/apple/iphone-14-pro
… (top 50 models, expandable)
/devices/samsung
/devices/google
/devices/oneplus
/devices/motorola
/locations                                   coverage overview + map
/locations/charlotte                         city page (full SEO content per `10`)
/locations/concord
/locations/gastonia
/locations/rock-hill
/locations/huntersville
/locations/matthews
/locations/kannapolis
/how-it-works
/trust                                       warranty + vetting + ratings story
/warranty                                    public terms + FAQ
/about
/contact                                     form, phone, hours
/support                                     help center, FAQ
/legal/terms
/legal/privacy
/legal/warranty-terms
/legal/refund
/legal/accessibility
/legal/data-handling                         linked from booking step 9
```

### Booking funnel (`/book/*`)

Deep-linkable. Each step is bookmarkable. State stored in localStorage; URL reflects current step.

```
/book                                        entry (redirects to current step or device picker)
/book/device                                 step 1-3 (type → brand → model — combined screen)
/book/repair                                 step 4
/book/service-mode                           step 5
/book/location                               step 6 (ZIP + address)
/book/slot                                   step 7
/book/contact                                step 8
/book/consent                                step 9 — device data wipe consent
/book/quote                                  step 10 — quote summary + add-ons
/book/pay                                    step 11 — Stripe (D2C) or invoice route (B2B)
/book/done                                   step 12 — confirmation
/quote/[id]                                  saved quote (emailed link, signed URL)
```

### Post-purchase (customer-facing)

```
/track/[orderId]                             public tracker (signed URL — no auth required)
/account                                     dashboard (authenticated customer)
/account/orders                              order history
/account/orders/[id]                         order detail with timeline
/account/warranty-claims                     claim history
/account/warranty-claims/new                 new claim form
/account/warranty-claims/[id]                claim detail
/account/profile                             profile + contact
/account/settings                            notifications, addresses, payment methods
```

### B2B (public marketing + authenticated portal)

Public-facing (indexable):

```
/b2b                                         B2B overview hub
/b2b/schools                                 vertical landing
/b2b/property-management
/b2b/hospitality
/b2b/construction-trades
/b2b/real-estate
/b2b/insurance-warranty-partners
/b2b/contact                                 sales lead capture form
```

Authenticated portal (gated by Clerk org membership):

```
/b2b/login                                   Clerk-hosted sign-in
/b2b/dashboard                               KPIs, active orders, monthly spend
/b2b/submit                                  single-device intake (abbreviated funnel)
/b2b/submit/bulk                             CSV upload + validate + preview + submit
/b2b/devices                                 device inventory (optional)
/b2b/orders                                  order list with filters
/b2b/orders/[id]                             order detail
/b2b/invoices                                invoice list
/b2b/invoices/[id]                           invoice detail + PDF download
/b2b/users                                   user/role management
/b2b/settings                                billing contact, addresses, PO setup, contract download
```

### Partner shop (authenticated)

```
/shop/login                                  Clerk-hosted sign-in
/shop/onboarding                             Stripe Connect Express onboarding wizard
/shop/dashboard                              today's queue, KPIs
/shop/jobs                                   full job list (filters: status, date, repair type)
/shop/jobs/[id]                              job detail (status actions, customer contact, notes)
/shop/payouts                                payout history (Stripe Connect dashboard embedded)
/shop/profile                                shop info, photos, capabilities
/shop/availability                           hours, blackout dates, capacity per day
```

### Admin (authenticated, super-admin role)

```
/admin/login                                 Clerk
/admin/dashboard                             ops KPIs (GMV, active orders, disputes count, failed webhooks)
/admin/shops                                 partner shop list
/admin/shops/new                             onboard new shop
/admin/shops/[id]                            shop detail (contract, capacity, performance, override actions)
/admin/orders                                all orders (filters)
/admin/orders/[id]                           order detail with override actions + event log
/admin/businesses                            B2B account list
/admin/businesses/[id]                       B2B detail (contract, pricing tier, users, invoice history)
/admin/contracts                             contract repository (shop + B2B)
/admin/disputes                              dispute queue
/admin/warranty-claims                       claim management
/admin/warranty-claims/[id]
/admin/users                                 user management across roles
/admin/reporting                             GMV, top shops, retention, B2B utilization
/admin/webhooks                              FailedWebhook queue with replay buttons (see `04`)
/admin/settings                              platform-level settings (pricing tiers, holiday calendar, etc.)
```

## Navigation hierarchy

### Top nav (5 variants by user state)

**Public / unauthenticated (marketing pages):** 5 items max — kept tight on purpose.
```
[Logo]   Services ▾   Locations ▾   Business ▾   Resources ▾   [Book a Repair]
```
- "Services" dropdown: top 6 repair categories + "Browse by device →" (links to `/devices`) + "All services →"
- "Locations" dropdown: 7 cities + "Service area map →"
- "Business" dropdown: 6 verticals + "Talk to sales →"
- "Resources" dropdown: How It Works / Trust / Warranty / Support / About + "View all →"
- Primary CTA on the right (amber, distinctive): "Book a Repair"

`/devices` and the device-model pages remain in the sitemap and are SEO-critical (`10`); they're just not surfaced as a top-nav item — they're reached via the Services dropdown, deep links from category pages, and direct search.

**Customer (authenticated, marketing + account pages):**
```
[Logo]   Services ▾   Locations ▾   [Avatar ▾  Orders, Warranty, Settings, Sign out]
```

**Shop (authenticated, `/shop/*`):**
```
[Logo]   Dashboard   Jobs   Payouts   Profile   [Avatar ▾]
```

**B2B (authenticated, `/b2b/dashboard/*`):**
```
[Logo + business name]   Dashboard   Submit ▾   Orders   Invoices   Users   [Avatar ▾]
```

**Admin (authenticated, `/admin/*`):**
```
[Logo "Admin"]   Shops   Businesses   Orders   Disputes   Contracts   Reporting   Webhooks   [Avatar ▾]
```

### Footer (3 columns, on all public + customer-facing pages)

| Column 1 — Services | Column 2 — Company | Column 3 — Trust |
|---|---|---|
| Screen replacement | About | Warranty terms |
| Battery replacement | How it works | Privacy |
| Charge port | Locations | Terms of service |
| Water damage | Business / B2B | Accessibility |
| Other repairs | Contact | Refund policy |
| Device list | Support | Partner shops |

Below the columns: trust strip (BBB badge, "X reviews avg Y stars", "Founded in Charlotte"), social icons, copyright + final brand name.

### Breadcrumbs

On all deep marketing pages (`/services/[category]`, `/devices/[brand]/[model]`, `/locations/[city]`, `/b2b/[vertical]`):

```
Home > Devices > Apple > iPhone 15 Pro
```

Schema markup via `BreadcrumbList` JSON-LD (see `10`).

### Mobile navigation

Hamburger menu reveals the same dropdown structure as desktop, full-screen overlay, accordion sections. Primary "Book a Repair" CTA sticky at bottom of viewport on mobile marketing pages.

## Search-engine surface

| Page type | Index? | Unique title pattern | Schema |
|---|---|---|---|
| `/` | yes | "Premium Phone & Device Repair — Charlotte, NC \| Brand" | Organization, LocalBusiness |
| `/services/[category]` | yes | "[Category] in Charlotte, NC — Backed by Warranty" | Service |
| `/devices/[brand]/[model]` | yes | "[Model] Repair Near You" | Service |
| `/locations/[city]` | yes | "[City] Phone Repair — Same-Day Screens, Batteries & More" | LocalBusiness, FAQPage |
| `/about`, `/how-it-works`, `/trust`, `/warranty` | yes | branded | Organization |
| `/b2b` and vertical landings | yes | vertical × NC | Service |
| `/legal/*` | yes (low priority) | utility | — |
| `/book/*` | NO | — | — |
| `/quote/*` | NO | — | — |
| `/track/*` | NO | — | — |
| `/account/*` | NO (gated) | — | — |
| `/shop/*`, `/admin/*`, `/b2b/dashboard/*` | NO (gated) | — | — |

`robots.txt` blocks: `/admin`, `/shop`, `/b2b/dashboard`, `/b2b/login`, `/track`, `/account`, `/api`, `/book/*` (no point indexing funnel steps).

Sitemap generation: dynamic, generated per surface (marketing, locations, devices, services, B2B verticals), submitted to Google Search Console + Bing (see `10`).

## Role-gated route map

| Route prefix | Required role(s) | Unauthenticated behavior |
|---|---|---|
| `/account/*` | `customer` | Redirect to Clerk sign-in with `redirect_url` preserved |
| `/shop/*` (except `/shop/login`) | `shop_staff`, `shop_owner` | Redirect to `/shop/login` |
| `/b2b/dashboard` and below | `b2b_user` with active business + contract | Redirect to `/b2b/login`; if business inactive → contact-sales |
| `/admin/*` (except `/admin/login`) | `admin` or `super_admin` | Redirect to `/admin/login`; non-admins get 403 |
| `/track/[id]` | none (public, signed-URL access) | If signature invalid or expired → 404 |
| `/api/webhooks/*` | none (signature-verified at handler) | Reject if signature missing/wrong, return 401 |
| `/api/*` (non-webhook) | matches caller's session role | Return 401 |

Middleware (Next.js + Clerk's `authMiddleware`) handles route gating at the edge before route resolution.

## Deep-link strategy for the booking funnel

The funnel supports pre-filling via query params so marketing pages and CTAs can deep-link customers in. The `/book` entry accepts:

```
?device=iphone-15-pro       → preselect Apple → iPhone 15 Pro
?repair=screen              → preselect screen replacement
?zip=28202                  → preselect ZIP, jump past location step
?service=on_site            → preselect on-site mode
?b2b=<businessSlug>         → mark as B2B context, skip auth, route to invoice flow
?ref=<source>               → tracked in analytics as referral source (homepage_cta, services_cta, etc.)
```

This lets `/devices/apple/iphone-15-pro` link directly to `/book?device=iphone-15-pro` with the device pre-selected, and a "Repair Screen for $X" CTA on `/services/screen-replacement` link to `/book?repair=screen`.

**Validation:** invalid param values (unknown device slug, malformed ZIP) are silently ignored; user starts from step 1. Never crash on bad query params.

## URL changes & redirect discipline

Every URL change requires a 301 redirect entered into a single source-of-truth file (`redirects.json` consumed by `next.config.js`). The file is reviewed in every PR that touches routing.

After every release, Search Console is monitored for 4xx surges. A spike in 404s on previously-indexed URLs is a P0 — redirect or restore within 24h.

**Never break a ranked URL silently.** If a city is renamed, a device model deprecated, or a category restructured, the old URL keeps responding (via redirect) for at least 12 months.

## Anchored sections on key pages

These long pages get anchored sections with stable IDs so they can be deep-linked from emails, support replies, and other marketing:

- `/warranty#what-is-covered`, `#duration`, `#how-to-claim`
- `/how-it-works#for-customers`, `#for-businesses`, `#for-partners`
- `/trust#our-warranty`, `#partner-vetting`, `#data-handling`
- `/b2b#pricing`, `#onboarding`, `#case-studies`

## Navigation accessibility floor

- All top-nav dropdowns operable via keyboard (Arrow, Enter, Esc per WAI-ARIA Authoring Practices)
- Skip-to-content link on every page
- Focus visible on every interactive element (amber 2px ring per `06`)
- Breadcrumbs marked up with proper `<nav aria-label="Breadcrumb">` and JSON-LD
- Mobile hamburger has `aria-expanded` and traps focus when open
