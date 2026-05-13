# Phase 0.5 backlog — items filed during Phase 0

Things that need to be addressed before or during Phase 0.5 (the working
transactional MVP) but aren't blocking Phase 0 completion or Phase 0.1
prototype work. Triage at Phase 0.5 kickoff.

## Infrastructure / deploy

### B0.5-001 — Wire Neon env vars to Vercel Preview environment

**Filed by:** Phase 0 / Checkpoint D handoff
**Symptom:** The Neon × Vercel integration wired `DATABASE_URL` and
`DATABASE_URL_UNPOOLED` to Production and Development environments only.
Preview was not auto-populated.

**Impact:** PR preview builds will fail database connectivity (Prisma can't
connect; `/api/health` returns 503) until this is fixed. Phase 0.1 work is
mostly client-only and unaffected, but the first Phase 0.5 PR that touches
booking funnel, auth, or any DB-backed route will surface this.

**Fix:** In Vercel project → Settings → Environment Variables, add:

- `DATABASE_URL` — set to Neon `staging` branch pooled URL, scoped to
  **Preview** environment
- `DATABASE_URL_UNPOOLED` — set to Neon `staging` branch direct URL,
  scoped to **Preview** environment

Each PR preview will then use the staging branch for its DB connection.
For per-PR isolation later, switch to Neon's ephemeral-branch-per-PR mode
via the integration's branching settings — but that's a v1.0 nice-to-have,
not a Phase 0.5 requirement.

**Owner:** Founder
**Timing:** Before opening the first Phase 0.5 PR that needs DB access.

---

### B0.5-002 — Remove the `?confirm=phase-0` test endpoints

**Filed by:** Phase 0 / Checkpoint D wiring
**Symptom:** `/api/test-error?confirm=phase-0` is publicly hittable. It's
intentionally guarded by the `confirm` query param (so accidental visits
don't fill the Sentry dashboard with noise) but it's still a publicly
reachable error-throwing endpoint.

**Fix:** When Phase 0.5 starts and admin auth is wired, gate this route
behind admin role or remove entirely. Same applies to any other Phase 0
verification endpoints.

---

### B0.5-003 — Replicate non-integration Vercel env vars from `.env.local`

**Filed by:** Checkpoint D handoff
**Symptom:** Only Inngest's integration auto-populated Vercel env vars.
PostHog, Sentry, Stripe values currently live only in local `.env.local`.

**Fix:** Once SDK wiring is verified locally, copy these env vars to
Vercel project settings, scoped to Production and Preview:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_CONNECT_CLIENT_ID`

**Owner:** Founder
**Timing:** After Checkpoint D verification passes; before relying on these
services to work on the deployed site.

---

## Future filings

When Phase 0.5 starts, append new items below with a fresh ID (`B0.5-NNN`).
