import Stripe from 'stripe';

/**
 * Stripe server-side client.
 *
 * Phase 0 stub: the SDK is initialized so imports across the codebase
 * resolve cleanly, but no Stripe integration logic exists yet. The full
 * Connect Express onboarding + Payment Element wiring lands in Phase 0.5
 * Track C (see docs/planning/08-build-phases.md).
 *
 * Returns `null` if STRIPE_SECRET_KEY isn't set — calling code should
 * guard rather than assume the client exists. This keeps local dev
 * working before secrets are wired and keeps the build from crashing on
 * Vercel deploys where env vars haven't been copied over yet.
 */

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      typescript: true,
      appInfo: {
        name: 'Crown Repair',
        version: '0.0.1',
      },
    });
  }

  return stripeClient;
}
