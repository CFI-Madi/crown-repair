# Crown Repair

Premium phone and device repair marketplace for the Charlotte metro. Two-sided platform: customers (D2C + B2B) book repairs through us; vetted partner shops fulfill them. We own the brand, warranty, and customer relationship.

## Status

**Phase 0 — Foundations** (Checkpoint A complete).

Full planning package is in [`docs/planning/`](./docs/planning/). Phase 0 execution plan is in [`docs/phase-0-execution-plan.md`](./docs/phase-0-execution-plan.md).

## Tech stack

Locked in [`docs/planning/07-tech-stack-recommendation.md`](./docs/planning/07-tech-stack-recommendation.md):

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 3.4 + custom UI primitives (shadcn pattern)
- **Database**: Postgres on Neon (wired in Checkpoint C)
- **ORM**: Prisma (wired in Checkpoint C)
- **Auth**: Clerk (Phase 0.5)
- **Payments**: Stripe Connect Express (test-mode setup in Checkpoint D)
- **Background jobs**: Inngest
- **Email**: Resend (Phase 0.5)
- **SMS**: Twilio (Phase 0.5)
- **Analytics + flags**: PostHog
- **Error tracking**: Sentry
- **Hosting**: Vercel

## Local development

### Requirements

- Node 22 or 24 (LTS), via `nvm-windows` / `fnm` / direct install
- pnpm 11+ (`npm install -g pnpm` if missing)

### Setup

```bash
# Clone
git clone https://github.com/CFI-Madi/crown-repair.git
cd crown-repair

# Install
pnpm install

# Configure env (Phase 0 has no real services yet — placeholders are fine)
cp .env.local.example .env.local

# Run
pnpm dev
```

Then open:

- [`http://localhost:3000`](http://localhost:3000) — Phase 0 placeholder home
- [`http://localhost:3000/design-system`](http://localhost:3000/design-system) — living design-token reference

### Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the dev server (port 3000) |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build locally |
| `pnpm lint` | ESLint with Next + TypeScript rules |
| `pnpm type-check` | TypeScript strict-mode check |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting without writing |

## Repository structure

Scaffolded per [`docs/planning/07-tech-stack-recommendation.md`](./docs/planning/07-tech-stack-recommendation.md). Directories that are empty in Phase 0 contain `.gitkeep` files so the structure is visible from day one.

```
src/
├── app/                 # Next.js App Router routes
│   ├── (marketing)/     # Phase 0.1+ — public marketing pages
│   ├── (funnel)/        # Phase 0.1+ — booking funnel
│   ├── api/             # API routes + webhook handlers
│   ├── design-system/   # Living token reference (Checkpoint A)
│   ├── layout.tsx       # Root layout, fonts, metadata
│   ├── page.tsx         # Phase 0 placeholder home
│   └── globals.css      # Design tokens (CSS custom properties)
├── components/
│   ├── ui/              # Primitives (Button, Input, Card) — shadcn pattern
│   ├── atoms/           # Custom atoms (Badge)
│   ├── molecules/       # Phase 0.1+
│   ├── organisms/       # Phase 0.1+
│   └── templates/       # Phase 0.1+
├── lib/                 # Domain helpers (db, auth, stripe, inngest, ...)
├── server/              # Server actions + internal API helpers
└── content/             # MDX content (Phase 0.1+)
prisma/                  # Prisma schema + migrations (Checkpoint C+)
public/                  # Static assets
tests/                   # E2E (Playwright) + unit (Vitest) — Phase 0.1+
docs/                    # Planning package + execution plan
```

## Design system

Tokens come from [`docs/planning/06-design-system.md`](./docs/planning/06-design-system.md). They live as CSS custom properties in `src/app/globals.css` and are exposed to components via Tailwind utilities in `tailwind.config.ts`.

A rebrand is a single-file edit (`globals.css`) — components never reference raw color values.

The `/design-system` route renders every token + every component variant for visual verification.

## Environment variables

All env vars are documented in [`.env.local.example`](./.env.local.example). Phase 0 only requires `NEXT_PUBLIC_APP_ENV` to run locally; database and observability env vars come online during Checkpoints C and D.

### Security note

This repository is currently public. Never commit:

- Any `.env*` file (other than `.env.local.example`)
- Any API keys, tokens, or secrets
- Any service-account JSON files

`.gitignore` is configured to block all of these patterns. If you suspect a secret was committed, rotate it immediately and reach out before pushing.

## Domain status

Domain is not yet purchased. The app deploys to a Vercel preview URL (`crown-repair-<hash>.vercel.app`). No code references a custom domain; pointing Vercel at a real domain later is a one-step DNS config change with no code changes required.

## Planning package

| # | Document |
|---|---|
| 00 | [Readme](./docs/planning/00-readme.md) |
| 01 | [Product Scope](./docs/planning/01-product-scope.md) |
| 02 | [Information Architecture](./docs/planning/02-information-architecture.md) |
| 03 | [Booking Flow Spec](./docs/planning/03-booking-flow-spec.md) |
| 04 | [Data Model](./docs/planning/04-data-model.md) |
| 05 | [Component Inventory](./docs/planning/05-component-inventory.md) |
| 06 | [Design System](./docs/planning/06-design-system.md) |
| 07 | [Tech Stack Recommendation](./docs/planning/07-tech-stack-recommendation.md) |
| 08 | [Build Phases](./docs/planning/08-build-phases.md) |
| 09 | [Open Questions](./docs/planning/09-open-questions.md) |
| 10 | [SEO & Local Presence](./docs/planning/10-seo-and-local-presence.md) |

## License

Proprietary. All rights reserved.
