# 10 — SEO & Local Presence

Local SEO is the load-bearing growth channel for D2C. Paid acquisition only scales after organic conversion is proven. This doc is launch-week-critical, not deferred — it ships with Phase 0.1.

## Strategy overview

- **D2C demand is local-intent search.** "iphone screen repair near me", "battery replacement charlotte", "tablet repair gastonia". We win when we rank in the top 3 organic + Map Pack for those queries across our 7 coverage cities.
- **Each coverage city — Charlotte, Concord, Gastonia, Rock Hill, Huntersville, Matthews, Kannapolis — is a distinct SEO surface.** Unique URL, unique copy, unique GBP, unique structured data. No copy-paste.
- **We compete locally against uBreakiFix, CPR, and independents.** Differentiators we can actually rank on: content quality, schema completeness, review velocity, trust signals (warranty, vetted partners).
- **Paid (Google Local Services Ads, paid search) waits.** Phase 1.x territory. Don't burn ad budget before organic baseline is proven.
- **B2B is sales-led**, not search-led — though the B2B vertical pages should still rank for "[vertical] device repair Charlotte" style queries.

---

## City page content requirements

For each of 7 coverage cities, `/locations/[city]` must include:

### Unique long-form content (600-1200 words)

- Written specifically for that city — references real local landmarks, neighborhoods (NoDa, South End, Uptown for Charlotte; Glen Forney for Gastonia, etc.), school district, downtown business district
- NOT spun, NOT templated with name-swap. A thoughtful reader should be able to tell a Charlotte page from a Concord page.
- Opening paragraph mentions: "we serve [city] and surrounding areas including [list of major neighborhoods]"
- Mid-content: city's repair pain points — for Charlotte, mention the size of the metro and density; for Kannapolis, mention the manufacturing/trades workforce; for Rock Hill, mention Winthrop University students.

### Partner shops in that city

H3-anchored block per shop:
- Shop name
- Photo
- Full address
- Phone number
- Hours
- Distance from major city points

### Top repair categories with city-specific microcopy

H2 + 1-2 sentence introduction tying repair to city demographics:
- "Screen replacement in [city]" — "X-thousand screens crack across [county] each year..."
- Battery, charge port, water damage, back glass, etc.

Each category links to `/services/[category]` + a city-specific deep-link booking CTA.

### City-specific FAQs (3-5 entries)

Examples for Charlotte:
- "Do you offer same-day repair in Uptown?"
- "Can you come to my office in SouthPark?"
- "How long does an on-site iPhone screen repair take?"
- "Do you work with CMS-area schools?"

Marked up as `FAQPage` schema (see below).

### Real customer testimonials from that city when available

- Real quotes only. Never fabricate.
- Include reviewer first name + neighborhood + repair type.

### Driving directions block

From 2-3 major neighborhoods to the nearest partner shop. Helpful for users and a signal of locality to Google.

### Open Graph image

City-specific (skyline, recognizable neighborhood landmark, or shop interior) — never the same OG image across cities.

### Canonical URL discipline

Canonical tag on each city page points to itself. No duplicate-content traps with `/services/[category]` pages — service-category pages link TO city pages, not duplicate their content.

---

## Schema markup (JSON-LD) per page type

### City pages (`/locations/[city]`)

```jsonld
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "<url>#business",
      "name": "Crown Repair – [City]",
      "image": "<OG image url>",
      "url": "<url>",
      "telephone": "<city phone>",
      "address": { "@type": "PostalAddress", "streetAddress": "...", "addressLocality": "[City]", "addressRegion": "NC", "postalCode": "..." },
      "geo": { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... },
      "openingHoursSpecification": [ ... per partner shop hours ... ],
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... },
        "geoRadius": "<miles>"
      },
      "priceRange": "$$",
      "sameAs": ["<GBP url>", ... social ...]
    },
    { "@type": "BreadcrumbList", "itemListElement": [ ... ] },
    { "@type": "FAQPage", "mainEntity": [ ... questions ... ] }
  ]
}
```

### Service category pages (`/services/[category]`)

```jsonld
{
  "@type": "Service",
  "serviceType": "[Category] for phones and devices",
  "provider": { "@type": "LocalBusiness", "@id": "https://crownrepair.com#org" },
  "areaServed": [ ... list of 7 cities as Place objects ... ],
  "offers": [
    { "@type": "Offer", "priceCurrency": "USD", "priceRange": "$X-$Y", "itemOffered": ... }
  ]
}
```

### Device model pages (`/devices/[brand]/[model]`)

```jsonld
{
  "@type": "Service",
  "serviceType": "[Brand] [Model] repair",
  "provider": { "@type": "LocalBusiness", "@id": "https://crownrepair.com#org" },
  "areaServed": [ ... ]
}
```

### Site root (`/`)

```jsonld
{
  "@type": "Organization",
  "@id": "https://crownrepair.com#org",
  "name": "Crown Repair",
  "url": "https://crownrepair.com",
  "logo": "...",
  "sameAs": [
    "https://www.google.com/maps/.../gbp-charlotte",
    "https://www.google.com/maps/.../gbp-concord",
    "...",
    "https://www.linkedin.com/company/...",
    "https://www.instagram.com/..."
  ]
}
```

### Review schema (`AggregateRating`)

ONLY emit `AggregateRating` on city pages AFTER we have genuine reviews on the corresponding GBP. Never fabricate. Never embed fake star ratings.

When reviews accumulate, surface them as:

```jsonld
{
  "@type": "LocalBusiness",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "47"
  }
}
```

### Validation

Every public page tested through [Google Rich Results Test](https://search.google.com/test/rich-results) before Phase 0.1 launch. Schema errors block release.

---

## Service-category × city cross pages

Rank for "iphone screen repair charlotte", "tablet battery replacement gastonia", etc.

**Implementation:**
- Internal linking from `/services/[category]` to `/locations/[city]` and vice versa
- Cross-pages built only where we'll write real content for them (e.g., a high-volume combo like "iphone screen repair charlotte")
- No mass-generated thin pages — Google penalizes those

**Initial cross-page candidates** (write real content for these in Phase 0.1):
- `/services/screen-replacement?city=charlotte` (rendered as canonical `/services/screen-replacement` with city-specific content block conditionally rendered for Charlotte traffic)
- OR explicit pages like `/repair/[device]/[city]` — less elegant URL structure, easier indexing — decision TBD with founder

---

## Device model pages (`/devices/[brand]/[model]`)

Rank for "iphone 15 pro screen repair near me" style queries. Each page:

- Hero: device photo, model name, year, "Get your [Model] repaired in [user's city — geolocated]"
- Common repairs list (each linking to booking funnel pre-filled)
- Pricing if locked (e.g., "iPhone 15 Pro screen replacement starts at $XXX")
- Specs / what we replace (OEM, third-party-grade, etc.)
- Warranty signal
- CTA to booking funnel pre-filled with `?device=iphone-15-pro`

---

## Google Business Profile per coverage city

### One GBP per coverage city

Google strongly prefers physical addresses. We have two options per city:

1. **Use a partner shop's address** (with explicit partner consent, formalized in the partner agreement). This gives us a physical-address GBP that ranks better.
2. **Service-area business listing** at our central business address — Google supports this but it ranks slightly lower.

**Recommendation:** Option 1 for cities with a founding partner; Option 2 as fallback for any city without a partner at launch.

### Verification timeline

- 5-14 days typical
- Service-area businesses sometimes need physical postcard verification (adds 5-10 days)
- **Start ALL 7 in Phase 0** so they're verified by Phase 0.1 launch

### GBP optimization checklist (per city)

- Primary category: "Mobile phone repair shop"
- Secondary categories: "Electronics repair shop", "Computer repair service"
- Full services list (one entry per repair × device-class)
- Business description: 750 chars, city-specific, includes 2-3 target keywords naturally
- Hours: matches partner shop hours (or service-area hours for SAB)
- Attributes: "Identifies as veteran-owned" / "women-owned" / etc. if applicable
- Photos:
  - Cover photo (storefront for physical, branded image for SAB)
  - At least 10 photos: storefront, interior, technicians at work (no faces unless consent), repair-in-progress shots
  - Update with fresh photos monthly
- Q&A section: seed with 5-10 common questions, answer them ourselves (Google explicitly allows this)
- Posts: weekly during Phase 0.1; monthly thereafter (offers, announcements)

### Review acquisition flow

Automated post-completion review request via Inngest function:
1. Order marked `complete`
2. Inngest waits 24 hours (let the customer feel the result)
3. Sends Resend email + Twilio SMS with one-tap deep link to the GBP review form
4. Includes order ID, repair summary, and "Tap to review" CTA

**Wording discipline:**
- "Would you take 30 seconds to share your experience?" — never "leave us a 5-star review"
- Never solicit specific star ratings
- Never offer compensation for reviews (FTC violation)

**Response discipline:**
- All negative reviews responded to within 24 hours, publicly, professionally
- Document resolution in `OrderEvent` (admin_action type)
- Internal target: maintain ≥4.7-star average across all GBPs

---

## Title/meta strategy

Templates (conservative, brand suffix consistent):

| Page | Title template |
|---|---|
| Home | `Premium Phone & Device Repair — Charlotte, NC \| Crown Repair` |
| City | `[City] Phone Repair — Same-Day Screens, Batteries & More \| Crown Repair` |
| Category | `[Category] in NC — Backed by Warranty \| Crown Repair` |
| Category × City (when implemented) | `[Category] in [City], NC — Backed by Warranty \| Crown Repair` |
| Device model | `[Brand] [Model] Repair Near You \| Crown Repair` |
| B2B vertical | `[Vertical] Device Repair Services — Charlotte Metro \| Crown Repair` |

**Rules:**
- 50-60 character target; under 70 hard limit
- Brand always at the end after `|`
- No clickbait, no all-caps shouting, no emojis
- Each city page has a meaningfully distinct title — no two cities share text

**Meta descriptions:**
- 140-160 chars
- Include 1-2 keywords naturally
- Always end with a clear next action ("Book online" / "Get a quote in 60 seconds")

---

## Technical SEO floor

### Sitemaps

Dynamic, generated per surface:
- `/sitemap-marketing.xml` (home, services, devices, locations, about, how-it-works, trust, warranty)
- `/sitemap-locations.xml` (city pages)
- `/sitemap-devices.xml` (every device model page)
- `/sitemap-services.xml` (service category pages)
- `/sitemap-b2b.xml` (B2B verticals)
- `/sitemap.xml` index referencing the above

Submitted to Google Search Console + Bing Webmaster Tools.

### `robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /shop/
Disallow: /b2b/dashboard
Disallow: /b2b/login
Disallow: /track/
Disallow: /account/
Disallow: /api/
Disallow: /book/
Disallow: /quote/
Sitemap: https://crownrepair.com/sitemap.xml
```

### Canonical tags

Every public page has a canonical tag pointing to itself. Cross-page duplicates (e.g., a city page reachable via two URLs) standardize on one canonical.

### 301 redirects

Tracked in `redirects.json` consumed by `next.config.js`. Every URL change requires a redirect. Search Console monitored after every release for 4xx spikes — a spike on previously-indexed URLs is a P0.

### Core Web Vitals targets

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | <2.5s |
| INP (Interaction to Next Paint) | <200ms |
| CLS (Cumulative Layout Shift) | <0.1 |

Measured via:
- Vercel Analytics (real-user)
- Lighthouse CI in PR pipeline (regression detection)
- PostHog (real-user, page-level)

CLS specifically: every image has explicit width/height; every dynamically-injected component reserves layout space.

### Image discipline

- `next/image` everywhere — never raw `<img>`
- AVIF + WebP served by Vercel
- Lazy-load below the fold
- Alt text on every meaningful image; decorative images get `alt=""`
- LCP image is preloaded explicitly via `<link rel="preload">`

### Hreflang

Not needed at MVP (English-only). Add when Spanish ships (v1.x); Spanish-Charlotte is a meaningful market.

### Mobile-friendliness

- Verified by Google's Mobile-Friendly Test
- Viewport meta tag correct
- Tap targets ≥44px (matches `06`)
- Text legibility without zooming

### Structured navigation

- `<nav aria-label="Main">` on top nav, `<nav aria-label="Breadcrumb">` on breadcrumbs
- Proper heading hierarchy (one H1 per page, H2 for sections, no skipped levels)

---

## Local link-building strategy

Quality > quantity. Pursue these in Phase 0.1 — Phase 1.0:

### Directory listings

- Chamber of Commerce in each coverage city (Charlotte, Concord, Gastonia, Rock Hill, etc.)
- BBB profile + accreditation (Charlotte metro is BBB-heavy; high-signal trust badge — see `09` G4)
- Yelp, Apple Maps, Bing Places (set up but don't depend on)

### Local press / news

Outreach targets at launch:
- Axios Charlotte
- Queen City Nerve
- Charlotte Business Journal
- Charlotte Observer Tech section
- Local radio business segments (WFAE)

Pitch angle: "Local marketplace launches with vetted partner network and platform-backed warranty" — newsworthy because of the trust model.

### Partnership links

- School district vendor pages (once any district signs)
- Hotel partner pages
- Property management firm vendor lists
- Insurance broker referral pages

### Modest local sponsorships

Budget $500-2000/yr: sponsor neighborhood events, school fundraisers, small business networking events. Each sponsorship = a link.

### What to avoid

- Paid link schemes / link farms (Google penalty)
- Reciprocal link exchanges with unrelated sites
- Mass directory submission tools
- Comment spam on local blogs

---

## Review velocity strategy

### Acquisition

- Automated post-completion review request (Resend + Twilio) with one-tap deep link to GBP review form
- 24h delay after completion (customer experience landed first)
- Target conversion: 1 review per 3 completed repairs (~33%)
- Per-shop tracking — if a shop's review conversion drops, investigate experience

### Response

- All reviews acknowledged within 48 hours
- Negative reviews responded to within 24 hours, publicly, professionally
- Pattern: acknowledge the issue → state what happened → state resolution → invite offline followup
- Never argue publicly with a reviewer

### Display on site

- Aggregate display on home + city pages: "4.8 stars across 247 reviews"
- Individual reviews surface in `TrustStrip` and on city pages (with reviewer first name + city)
- Pulled via GBP API; cached daily

### What's prohibited

- Soliciting specific star ratings
- Filtering negative feedback
- Offering compensation for reviews
- Reviewing your own business / asking employees to do so

---

## Analytics & measurement

### Funnel measurement (PostHog)

Track from organic landing → booking complete:

```
[organic landing on /locations/charlotte]
   → [click "Book a Repair"]
   → [enter booking funnel]
   → [step-by-step events from `03`]
   → [booking_completed]
```

Segmented by:
- City (which city page they landed on)
- Repair category
- Service mode
- Device type

### GBP insights

Monthly export per city GBP:
- Phone calls
- Direction requests
- Website clicks
- Photo views

Roll up into a quarterly local-presence report.

### Search Console

- Verified per surface
- Track ranking for target queries weekly (use a tracker — Ahrefs / Semrush / SE Ranking; budget ~$100/mo)
- Top 20 target queries tracked: "[city] phone repair", "[city] iphone repair", "iphone screen repair near me", etc.

### Content refresh

- Quarterly review of top-3-ranked city pages
- Update outdated stats, refresh photos, add new partner shops, update FAQs
- Stale content drops in rank fast

---

## Launch-week deliverables (gates Phase 0.1 → public launch)

This is the final checklist before flipping marketing visibility on:

- [ ] All 7 city pages written and live with full schema markup
- [ ] All 7 GBPs verified and populated with photos, services, Q&A
- [ ] All sitemaps generated and submitted to Search Console + Bing
- [ ] Sitemap coverage report clean (no errors)
- [ ] Schema validated via Google Rich Results Test for one URL per page-type (home, city, service, device, B2B vertical)
- [ ] Initial review seeds on top-3 GBPs (Charlotte, Concord, Rock Hill) — sourced from partner shops' existing happy customers with consent; never fabricated
- [ ] Core Web Vitals on the live site meeting target thresholds across all city pages
- [ ] `robots.txt` final; `Disallow` for gated routes confirmed
- [ ] Canonical tags audited site-wide
- [ ] BBB profile created (accreditation in progress)
- [ ] Local press outreach kicked off (3-5 contacted)
- [ ] PostHog funnel dashboard live

---

## Ongoing SEO ops (Phase 0.5+)

- Weekly: monitor Search Console for crawl errors, manual penalties, indexing drops
- Weekly: spot-check GBP for unanswered Q&A or reviews
- Monthly: rank tracker review; content adjustments to under-performing pages
- Quarterly: full content audit; refresh top-ranked pages
- Annually: site-wide schema refresh; canonical audit; sitemap structure review
