/**
 * PostHog server-side client.
 *
 * Phase 0 wiring stub. Server-side PostHog usage starts in Phase 0.5 once
 * we have transactional events to capture (booking submitted, payment
 * succeeded, etc.). For now this exports a lazily-constructed client so
 * the import surface is in place.
 *
 * Client-side initialization lives in `src/components/atoms/posthog-provider.tsx`.
 */

import { PostHog } from 'posthog-node';

let serverPostHog: PostHog | null = null;

export function getServerPostHog(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key || !host) return null;

  if (!serverPostHog) {
    serverPostHog = new PostHog(key, {
      host,
      flushAt: 1, // flush after every event in a serverless environment
      flushInterval: 0,
    });
  }

  return serverPostHog;
}
