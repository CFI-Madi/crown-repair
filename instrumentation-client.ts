import * as Sentry from '@sentry/nextjs';

/**
 * Next.js client-side instrumentation hook (Next 15+).
 *
 * Initializes Sentry in the browser. Requires `NEXT_PUBLIC_SENTRY_DSN` to
 * be set — without it, Sentry silently no-ops (errors aren't captured
 * client-side until the env var is wired).
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
    tracesSampleRate: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0, // no session replay yet — Phase 0.5+
    replaysOnErrorSampleRate: 0,
    debug: false,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
