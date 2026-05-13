# Phase 0.1 backlog — items filed during Phase 0

Things discovered or deferred during Phase 0 that should be addressed before the Phase 0.1 prototype goes out to partner walkthroughs. Triage these at Phase 0.1 kickoff.

## Performance + Web Vitals

### B0.1-001 — Self-host the body sans (eliminate Fontshare render-blocking)

**Filed by:** Lighthouse Phase 0 / Checkpoint B audit
**Symptom:** Fontshare CDN render-blocks for 310-1000 ms on mobile. CLS 0.106 on mobile is driven by the swap from the system-fallback to General Sans loading mid-render.

**Options (pick one):**

1. **Self-host General Sans woff2 files via `next/font/local`.** Download the four woff2 files from Fontshare once, place under `public/fonts/`, configure `next/font/local` in `src/app/layout.tsx`. Eliminates the render-blocking external request; lets Vercel preload/inline the font and serve it from edge. Most performant.
2. **Switch to IBM Plex Sans via `next/font/google`.** Already the documented fallback per `09` font-license decision. Loaded as part of Next.js's font pipeline (preconnect + preload + size-adjust metrics). Removes the Fontshare dependency entirely. Slightly different visual character — verify against `06` brand principles before swapping.

**Recommendation:** Option 1. Keeps the typographic intent locked in `06` while solving the perf hit. Option 2 is the bail-out if General Sans's woff2 files can't be acquired cleanly.

**Files affected:** `src/app/layout.tsx`, `public/fonts/` (new), `src/app/globals.css` (font-family chain).

---

### B0.1-002 — Drop legacy JS polyfills (11 KiB win)

**Filed by:** Lighthouse Phase 0 / Checkpoint B audit
**Symptom:** 11 KiB of legacy ES5-targeting polyfills shipping in the production bundle.

**Fix:** Set `target: 'es2020'` (or `es2022`) in `next.config.mjs` and ensure `tsconfig.json` `target` matches. Modern browsers represent ~98% of our market; the polyfill cost is wasted bytes.

**Files affected:** `next.config.mjs`, `tsconfig.json` (already `ES2022`).

**Risk:** None for our market (Charlotte D2C + B2B — modern Chrome / Safari / Edge dominant). Verify by running Lighthouse again post-change.

---

## SEO

### B0.1-003 — Flip robots from `noindex,nofollow` to `index,follow`

**Filed by:** Phase 0 design decision
**Symptom:** Lighthouse SEO score capped at 60 due to intentional `meta robots: noindex, nofollow` (intentional for Coming Soon).

**Fix:** When Phase 0.1 marketing site is content-complete and ready to be discovered, remove the `robots` field from `src/app/layout.tsx`'s metadata block (Next.js default is `index, follow`).

**Timing:** Phase 0.1 mid, after city pages + service pages have real content.

---

### B0.1-004 — Add OG image and `og:url` once brand mark + domain are locked

**Filed by:** Checkpoint B audit
**Symptom:** `og:image`, `twitter:image`, `og:url` all missing in head metadata. Social previews currently render as title + description on plain background.

**Fix:**

1. Add `src/app/opengraph-image.tsx` using Next.js 15's built-in `@vercel/og` integration (no extra deps for a Next.js 15 project). Render the Crown Repair wordmark on cream with amber accent at 1200×630.
2. Add `metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!)` to `src/app/layout.tsx` so Next.js auto-populates `og:url`.

**Blocked on:** final brand mark (Fiverr / agency engagement per `09 A2`) and domain purchase. Until then, the bare-text OG preview is acceptable for partner walkthroughs.

---

## Future filings

When Phase 0.1 starts, append new items below with a fresh ID (`B0.1-NNN`).
