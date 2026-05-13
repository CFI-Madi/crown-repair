'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

/**
 * Fires PostHog events on every App Router path change.
 *
 * Captures:
 *   - `$pageview` — standard PostHog pageview event for funnel analytics
 *   - `phase_0_handshake` — Phase 0 verification event so we can confirm
 *     wiring end-to-end in the PostHog dashboard
 *
 * Renders nothing. Lives in the root layout body so it tracks every page.
 *
 * `usePathname` does NOT force dynamic rendering, so static pages remain
 * static. We intentionally don't read `useSearchParams` here — that would
 * require a Suspense boundary and could push otherwise-static pages into
 * dynamic-rendering territory.
 */
export function PostHogTracker() {
  const pathname = usePathname();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog || !pathname) return;

    posthog.capture('$pageview', {
      $current_url:
        typeof window !== 'undefined' ? window.location.href : pathname,
    });

    posthog.capture('phase_0_handshake', {
      env: process.env.NEXT_PUBLIC_APP_ENV,
      path: pathname,
    });
  }, [pathname, posthog]);

  return null;
}
