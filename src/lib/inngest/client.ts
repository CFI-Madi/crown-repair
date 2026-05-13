import { Inngest } from 'inngest';

/**
 * Inngest client.
 *
 * Used both to send events and to declare functions that handle them.
 * The Inngest × Vercel integration auto-syncs INNGEST_EVENT_KEY and
 * INNGEST_SIGNING_KEY for Production and Preview environments — the SDK
 * picks them up automatically from process.env.
 */
export const inngest = new Inngest({
  id: process.env.INNGEST_APP_ID ?? 'crown-repair',
});
