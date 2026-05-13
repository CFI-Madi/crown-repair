'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

/**
 * Initializes posthog-js once at module-load time on the client. Idempotent.
 *
 * Configured to skip automatic pageview capture — we fire pageviews
 * explicitly from `<PostHogTracker />` so the App Router's client-side
 * navigations are tracked correctly.
 */
if (typeof window !== 'undefined') {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (key && host && !posthog.__loaded) {
    posthog.init(key, {
      api_host: host,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      defaults: '2025-05-24',
    });
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
