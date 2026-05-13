import { inngest } from './client';

/**
 * Phase 0 Inngest verification function.
 *
 * Listens for `phase_0/hello.world` events and logs a confirmation. Trigger
 * one from the Inngest dashboard or from a server action to confirm the
 * SDK + integration are wired correctly. Remove when Phase 0.5 functions
 * land (booking webhook handlers, payout reconciliation, etc.).
 */
export const helloWorld = inngest.createFunction(
  {
    id: 'phase-0-hello-world',
    name: 'Phase 0 — Hello World',
    triggers: [{ event: 'phase_0/hello.world' }],
  },
  async ({ event }) => {
    return {
      message: 'Phase 0 Inngest verification — hello, world!',
      receivedEventId: event.id ?? null,
      receivedAt: new Date().toISOString(),
      env: process.env.NEXT_PUBLIC_APP_ENV ?? 'unknown',
    };
  },
);

/**
 * Registry of all Inngest functions. Exported so the serve route can
 * register them in a single import.
 */
export const functions = [helloWorld];
