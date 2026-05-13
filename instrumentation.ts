import * as Sentry from '@sentry/nextjs';

/**
 * Next.js server-side instrumentation hook.
 *
 * Runs at server start (Node and Edge runtimes). Initializes Sentry for
 * server-side error capture, including API routes, Server Actions, and
 * server-component render errors.
 *
 * The corresponding client-side init lives in `instrumentation-client.ts`.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
      tracesSampleRate: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 0.1 : 1.0,
      debug: false,
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
      tracesSampleRate: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 0.1 : 1.0,
      debug: false,
    });
  }
}

// Capture errors thrown from React Server Components and route handlers.
export const onRequestError = Sentry.captureRequestError;
