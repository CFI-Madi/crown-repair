# Phase 0 Execution Plan

> **Source docs:** [00-readme](./planning/00-readme.md), [06-design-system](./planning/06-design-system.md), [07-tech-stack-recommendation](./planning/07-tech-stack-recommendation.md), [08-build-phases](./planning/08-build-phases.md). This is the operational layer that turns Phase 0 from `08` into a concrete order of operations.

## Scope of this plan

Everything in `08` Phase 0 that does NOT require a custom domain. Output: a deployed Coming Soon page on a Vercel preview URL, plus all the rails (DB, observability, Stripe test-mode, Inngest dev) needed for Phase 0.1 to start immediately.

**Deferred until domain is purchased** (each gets a recommendation below):
- `staging.<domain>` deployment — DEFER (one-line config change later)
- Google Business Profile creation — DEFER (recommendation: wait)
- Twilio A2P 10DLC registration — DEFER (recommendation: wait)
- Photography brief / shoot — out of my scope (you drive this in parallel)
- Brand identity sprint — out of my scope (you drive this in parallel)

## Pre-flight: accounts you'll create

Order matters — don't create them all at once. Create as you reach the relevant checkpoint.

### Already in place ✓
- **GitHub** (Checkpoint A uses)
- **Vercel** (Checkpoint B uses)
- **Neon** (Checkpoint C uses)
- **Cloudflare** (not used until domain purchase — no Phase 0 action)

### Will create during Phase 0
- **Sentry** — Checkpoint D
- **PostHog** — Checkpoint D
- **Inngest** — Checkpoint D
- **Stripe** — Checkpoint D (test-mode platform account only)

### Deferred to Phase 0.5+ (don't create now)
- **Clerk** — Phase 0.5 Track A
- **Resend** — Phase 0.5 Track A
- **Twilio** — Phase 0.5 Track A
- **Google Maps Platform** — Phase 0.5 Track B
- **Vercel Blob** — Phase 0.5 Track D (enabled within existing Vercel project; no separate account)

---

## Checkpoint A — Scaffold + design tokens + fonts

**Goal:** A Next.js project with all the design tokens from `06` wired into Tailwind and CSS, running locally, ready to build pages against.

**Mostly autonomous** — I write the code; you run it locally and confirm visuals.

### Tasks (in order)

| # | Task | Who | Notes |
|---|---|---|---|
| A1 | Create GitHub repo `crown-repair` (private) | YOU or me via `gh` CLI | See question below |
| A2 | `git clone` locally + create `main` branch | me | |
| A3 | Initialize Next.js: `pnpm create next-app crown-repair --typescript --app --tailwind --eslint` (in a temp dir, then merge into repo) | me | |
| A4 | Scaffold the full folder structure per `07` | me | Empty dirs with `.gitkeep` where needed |
| A5 | Install shadcn/ui via `npx shadcn-ui@latest init` | me | Configure for our tokens (cream bg, etc.) |
| A6 | Wire `next/font` for Fraunces (Google Fonts) + body sans | me | See font question below |
| A7 | Write `src/app/globals.css` — every CSS custom property from `06` | me | Foundation + semantic + status colors, all scales |
| A8 | Write `tailwind.config.ts` — extend theme with token aliases | me | `bg-accent`, `text-ink-primary`, `rounded-lg`, etc. |
| A9 | Write `src/app/layout.tsx` — root layout with fonts + global styles | me | |
| A10 | Write a `/design-system` test page rendering Button, Input, Card, Badge, type scale, color swatches | me | Visual proof tokens are wired; not user-facing |
| A11 | Configure `tsconfig.json` (strict mode), ESLint, Prettier | me | |
| A12 | Write `package.json` scripts: `dev`, `build`, `lint`, `type-check`, `format` | me | |
| A13 | `.gitignore` + `.env.local.example` (documenting all env vars Phase 0 needs) | me | |
| A14 | `README.md` — project overview, how to run locally, env var list | me | |
| A15 | Commit + push to `main` | me | Branch protection set in Checkpoint B |

### What you do at the gate
1. `git clone <repo url>` locally
2. `pnpm install`
3. `pnpm dev` → open `http://localhost:3000/design-system`
4. **Verify visually:**
   - Cream background looks warm-cream (not stark white)
   - Fraunces displays at large sizes (look distinctive, not generic)
   - Body sans is NOT Inter
   - Amber accent color matches the swatch in `06`
   - Buttons have amber bg + navy text; focus ring is amber 2px
5. `pnpm lint && pnpm type-check` → both pass
6. Reply "Checkpoint A approved" to proceed

### Artifacts at end of Checkpoint A
- GitHub repo with full scaffold
- Local dev server runs
- Design tokens visible on `/design-system` page
- Lint + type-check pass

---

## Checkpoint B — Coming Soon deployed to Vercel preview URL

**Goal:** A live Vercel preview URL serving the Coming Soon page. You click it, you see it look right.

**Mostly autonomous** — you do one Vercel connection step.

### Tasks (in order)

| # | Task | Who | Notes |
|---|---|---|---|
| B1 | Replace `/design-system` (route stays available for reference) with a Coming Soon page at `/` | me | Spec below |
| B2 | Connect Vercel project to GitHub repo | YOU (via Vercel dashboard, 5-min one-time step) | I'll send you exact steps if needed |
| B3 | Configure Vercel project: production branch = `main`; preview deploys on PRs | me (via Vercel CLI once linked) or YOU | |
| B4 | Set Vercel env vars: `NEXT_PUBLIC_APP_ENV=production` for prod, `NEXT_PUBLIC_APP_ENV=preview` for previews; NO hardcoded domain references | me | `NEXT_PUBLIC_APP_URL` derived from `process.env.VERCEL_URL` at runtime |
| B5 | Push to `main` → Vercel auto-deploys | me | |
| B6 | Run Lighthouse against the preview URL | me | Targets: ≥95 mobile + desktop |
| B7 | Set up branch protection on `main` (require PR + status checks before merge) | YOU (GitHub UI) or me via `gh` CLI | |

### Coming Soon page spec
- Cream bg (`--color-bg`)
- Centered Fraunces wordmark "Crown Repair" at 60-72px navy (`--color-ink-primary`)
- Single-line subhead in body sans: "Premium device repair for Charlotte and the surrounding metro. Launching soon."
- Optional brand-mark or simple geometric mark above wordmark (placeholder shape; not a real logo)
- No email capture for Phase 0 (recommendation — see Q below)
- Tiny footer: "© 2026 Crown Repair · Charlotte, NC"
- Open Graph: title + description + cream/navy social image
- Reduced-motion-safe; no animations

### What you do at the gate
1. Click the Vercel preview URL I send (`crown-repair-<hash>.vercel.app`)
2. **Verify:**
   - Page loads in <2s
   - Wordmark is Fraunces, navy, centered, looks editorial
   - Background is the warm cream tone from `06`
   - Mobile responsive (resize your browser or open on phone)
3. View source → confirm no hardcoded `crownrepair.com` references anywhere
4. Reply "Checkpoint B approved" to proceed

### Artifacts at end of Checkpoint B
- Vercel project linked to GitHub
- Production deployment auto-deploys from `main`
- Preview deployments per PR
- Branch protection on `main`
- Live Coming Soon at `crown-repair-<hash>.vercel.app`
- Lighthouse score recorded (target ≥95)

---

## Checkpoint C — Neon DB + env vars wired (schema NOT migrated)

**Goal:** Neon project with `main` (prod) and `staging` branches; connection strings in Vercel env vars; Prisma installed and can query a placeholder model. The full schema from `04` is NOT migrated yet — that's Phase 0.5.

**Hybrid** — you create the Neon project + connect to Vercel; I write the Prisma setup.

### Tasks (in order)

| # | Task | Who | Notes |
|---|---|---|---|
| C1 | Create Neon project `crown-repair` | YOU (Neon dashboard) | Default branch = `main` |
| C2 | Create a `staging` branch in Neon (Branches → Create from main) | YOU | |
| C3 | Use the **Neon × Vercel integration** to wire connection strings | YOU | Vercel → Integrations → Neon → authorize → map `main` to Production, `staging` to Preview |
| C4 | Verify Vercel env vars exist: `DATABASE_URL` + `DIRECT_DATABASE_URL` per environment | me | Will check via Vercel CLI |
| C5 | Install Prisma: `pnpm add -D prisma && pnpm add @prisma/client` | me | |
| C6 | Initialize Prisma: `npx prisma init` | me | |
| C7 | Write `prisma/schema.prisma` with one placeholder model `HealthCheck { id, message, timestamp }` — NOT the full `04` schema | me | Proves connectivity only |
| C8 | Run `npx prisma migrate dev --name healthcheck` against staging | me | One row migration |
| C9 | Generate Prisma client; create `src/lib/db/index.ts` singleton | me | Standard Next.js pattern |
| C10 | Build `src/app/api/health/route.ts` — queries `HealthCheck`, returns `{ db: "ok", env, branch }` | me | |
| C11 | Test locally + push; verify endpoint on Vercel preview | me | |

### What you do at the gate
1. Visit `<vercel-preview-url>/api/health` → returns `{ db: "ok", env: "preview", branch: "staging" }`
2. Confirm in Neon dashboard: `HealthCheck` table exists on staging branch only, not main (we haven't migrated to main)
3. Reply "Checkpoint C approved" to proceed

### Artifacts at end of Checkpoint C
- Neon project with `main` + `staging` branches
- Vercel env vars (per environment): `DATABASE_URL`, `DIRECT_DATABASE_URL`
- Prisma installed; placeholder schema migrated to staging only
- `/api/health` proves connectivity

---

## Checkpoint D — Observability + Stripe Connect test-mode

**Goal:** Sentry catching errors, PostHog receiving events, Inngest dev env receiving events, Stripe Connect test-mode platform account active. All env vars in Vercel.

**Hybrid** — you create accounts; I wire the SDKs.

### Tasks (in order)

| # | Task | Who | Notes |
|---|---|---|---|
| D1 | Create Sentry account + project (Next.js) | YOU | Free tier; copy DSN |
| D2 | Set `SENTRY_DSN` + `SENTRY_AUTH_TOKEN` in Vercel env vars | YOU or me | |
| D3 | Install Sentry: `npx @sentry/wizard@latest -i nextjs` | me | Configures client + server + edge |
| D4 | Build `/api/test-error` endpoint that throws on purpose | me | For verification |
| D5 | Verify error appears in Sentry dashboard | me | |
| D6 | Create PostHog account + project | YOU | Free tier; US cloud (recommendation — closest to NC) |
| D7 | Set `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` in Vercel env vars | YOU or me | |
| D8 | Install PostHog: `pnpm add posthog-js posthog-node` | me | |
| D9 | Wire `src/lib/analytics/posthog.ts` (client + server) | me | |
| D10 | Fire test event `phase_0_handshake` when Coming Soon page loads | me | |
| D11 | Verify event appears in PostHog | me | |
| D12 | Create Inngest account + app `crown-repair` | YOU | Free tier; copy event key + signing key |
| D13 | Set `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` in Vercel env vars | YOU or me | |
| D14 | Install Inngest: `pnpm add inngest` | me | |
| D15 | Wire `src/lib/inngest/client.ts` + `src/app/api/inngest/route.ts` | me | |
| D16 | Create `hello.world` Inngest function (logs "hi"); send a test event | me | |
| D17 | Verify function execution in Inngest dashboard | me | |
| D18 | Create Stripe account (use real email; legal entity prompt — see Q below) | YOU | Stay in TEST mode |
| D19 | Activate Stripe Connect: Settings → Connect → Get started → Express | YOU | Platform profile: name "Crown Repair", country US, type marketplace |
| D20 | Copy Stripe test keys: publishable, secret, Connect client ID | YOU | |
| D21 | Set `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_CONNECT_CLIENT_ID` in Vercel env vars | YOU or me | |
| D22 | Install Stripe SDK: `pnpm add stripe @stripe/stripe-js` | me | |
| D23 | Create `src/lib/stripe/client.ts` — server-side SDK init only (no integration yet) | me | |
| D24 | Document all env vars in `.env.local.example` | me | |

### What you do at the gate
1. Trigger `<vercel-preview-url>/api/test-error` → check Sentry dashboard shows the captured error
2. Visit Coming Soon page → check PostHog dashboard shows the `phase_0_handshake` event
3. Visit Inngest dashboard → confirm the `hello.world` function ran
4. Visit Stripe dashboard (test mode) → confirm Connect is activated; you can see "Connected accounts (0)" page
5. Reply "Checkpoint D approved — Phase 0 complete"

### Artifacts at end of Checkpoint D
- Sentry catching errors
- PostHog receiving events
- Inngest dev env receiving events
- Stripe Connect test-mode platform account active
- All Phase 0 env vars in Vercel for production + preview environments
- `.env.local.example` documenting everything

---

## Folder structure I'll scaffold (Checkpoint A)

Per [07](./planning/07-tech-stack-recommendation.md), minus the dirs we don't need yet (Phase 0.5+ stuff gets empty placeholders so the structure is ready).

```
crown-repair/
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Phase 0.1+; empty for Phase 0
│   │   ├── (funnel)/              # Phase 0.1+; empty for Phase 0
│   │   ├── account/               # Phase 0.5+; empty for Phase 0
│   │   ├── shop/                  # Phase 0.5+; empty for Phase 0
│   │   ├── b2b/                   # Phase 0.1+; empty for Phase 0
│   │   ├── admin/                 # Phase 0.5+; empty for Phase 0
│   │   ├── api/
│   │   │   ├── health/            # Checkpoint C — DB connectivity check
│   │   │   ├── test-error/        # Checkpoint D — Sentry verification
│   │   │   ├── inngest/           # Checkpoint D
│   │   │   └── webhooks/          # Phase 0.5+; empty for Phase 0
│   │   ├── design-system/         # Checkpoint A — token verification page
│   │   ├── layout.tsx             # root layout with fonts
│   │   ├── page.tsx               # Coming Soon (Checkpoint B)
│   │   └── globals.css            # design tokens from `06`
│   ├── components/
│   │   ├── ui/                    # shadcn primitives (restyled to `06`)
│   │   ├── atoms/                 # (Phase 0.1+; empty for Phase 0)
│   │   ├── molecules/             # (Phase 0.1+; empty)
│   │   ├── organisms/             # (Phase 0.1+; empty)
│   │   └── templates/             # (Phase 0.1+; empty)
│   ├── lib/
│   │   ├── db/                    # Checkpoint C — Prisma client
│   │   ├── auth/                  # (Phase 0.5+; empty)
│   │   ├── stripe/                # Checkpoint D — SDK init only
│   │   ├── inngest/               # Checkpoint D — client + function registry
│   │   ├── email/                 # (Phase 0.5+; empty)
│   │   ├── sms/                   # (Phase 0.5+; empty)
│   │   ├── pricing/               # (Phase 0.5+; empty)
│   │   ├── slots/                 # (Phase 0.5+; empty)
│   │   └── analytics/             # Checkpoint D — PostHog
│   ├── server/
│   │   ├── actions/               # (Phase 0.5+; empty)
│   │   └── api/                   # (Phase 0.5+; empty)
│   └── content/                   # (Phase 0.1+; empty for Phase 0)
├── prisma/
│   ├── schema.prisma              # Checkpoint C — placeholder; full `04` schema in Phase 0.5
│   └── migrations/                # Auto-managed
├── public/                        # placeholder assets only for Phase 0
├── tests/
│   ├── e2e/                       # (Phase 0.1+; empty)
│   └── unit/                      # (Phase 0.1+; empty)
├── docs/
│   ├── planning/                  # Existing locked planning package
│   └── phase-0-execution-plan.md  # This doc
├── .env.local.example
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── postcss.config.js
└── README.md
```

Empty dirs get a `.gitkeep` so git tracks them and the structure is visible from day 1.

---

## Recommendation on deferred items

### Twilio A2P 10DLC — WAIT for domain
- A2P brand review evaluates business legitimacy (website, ToS, privacy policy, brand reputation).
- A `vercel.app` URL signals "not yet launched" to reviewers and risks rejection.
- Time savings by starting now: ~1-3 weeks. Time cost of rejection: re-submit + delay.
- **Recommendation: wait until domain is purchased and the basic marketing site is live (mid-Phase 0.1).** A2P will then have a real domain + terms/privacy pages to evaluate.

### Google Business Profile — WAIT for now
- Each GBP requires a **physical address** (partner shop, with consent, or a central business address).
- Per `09 D5`, the founding partner-shop cohort isn't locked until Phase 0.5. Creating GBPs against not-yet-confirmed addresses risks needing to redo them.
- GBP listings are also public-facing — better to have them polished when prospects look us up after walkthroughs.
- Time savings by starting now: 1-2 weeks (verification per city, parallelizable).
- **Recommendation: wait until Phase 0.1 mid — domain live + founding partner-shop cohort locked.** The verification window then overlaps with city-page content drafting.

### staging.<domain> deployment — already deferred per your prompt
- One-line Vercel config change when domain is purchased.
- Until then, Vercel preview URLs serve the same purpose for our dev loop.

---

## Questions before I start Checkpoint A

These are the only true blockers. Defaults shown — if defaults are fine, you can just say "use the defaults" and I'll proceed.

1. **Package manager** — default: `pnpm` (fast, disk-efficient, well-supported by Vercel). Alternatives: `npm`, `bun`.
2. **Body sans font** — `06` calls for General Sans, but its license needs to be verified (`09` open question). Default: **start with General Sans (it's free for commercial use per their site); if license verification surfaces an issue, swap to IBM Plex Sans (Google Fonts, fully free)** — both are visually distinct from Inter and pair well with Fraunces.
3. **GitHub repo creation** — default: **you create it** (private, named `crown-repair`, you as owner), then send me the URL + add me as collaborator (or share clone access via local credentials). If you'd rather I create it via `gh` CLI, you'd need to give me an auth token.
4. **Vercel ↔ GitHub connection** — default: **you do it via Vercel dashboard** (one-time, 5 min). If you'd rather give me a Vercel CLI token, I'll do it in the CLI.
5. **Coming Soon email capture** — default: **no email capture for Phase 0**. Adds vendor complexity (need Resend + a place to store emails) for limited benefit. Add in Phase 0.1 when Resend is wired anyway.
6. **Stripe legal entity** — default: **proceed with Stripe test-mode without a registered legal entity now**. Stripe test mode accepts a placeholder for platform setup. Real Stripe live mode requires an LLC (`09 G1`) — that's a Phase 0.5 blocker, not Phase 0.
7. **Node version** — default: **Node 22 LTS** (latest LTS, well-supported by all our vendors).

---

## How execution will work

Once you approve this plan + answer the 7 questions:

1. I'll start Checkpoint A immediately.
2. I'll commit and push regularly — you can watch the GitHub repo as I go.
3. When I hit the end of Checkpoint A, I'll send you the gate instructions ("clone, run, check") and **wait for your "approved" before starting Checkpoint B**.
4. Same gate pattern at B, C, D.
5. If I hit a snag mid-checkpoint (an unexpected blocker), I'll stop and ask rather than improvise.

**Important:** I will not create any external accounts on your behalf. Accounts at Sentry, PostHog, Inngest, Stripe all need to be created by you with your email. I'll provide the exact steps when you reach each checkpoint.

---

## Out of scope for Phase 0 (deferred to Phase 0.1 unless noted)

- Any marketing pages beyond Coming Soon
- Any booking funnel scaffolding
- Full Prisma schema from `04` (Phase 0.5)
- Any auth integration (Phase 0.5)
- Any payment integration beyond SDK init (Phase 0.5)
- Photography (you drive in parallel)
- Logo design (you drive in parallel)
- Legal content drafting (`09`)
- Insurance broker engagement (Phase 0.5)
