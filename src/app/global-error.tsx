'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

/**
 * Root-level error boundary for the App Router.
 *
 * Triggered when an unhandled error escapes any nested error.tsx in the
 * route tree. Reports to Sentry and renders a minimal fallback. Replaces
 * the default Next.js error page only for these fatal cases.
 *
 * Per Sentry's App Router instrumentation guidance — without this file,
 * React render errors at the root layout level don't get captured.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: '4rem 1.5rem',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#F7F2EA',
          color: '#0B1F3A',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.875rem', margin: '0 0 1rem' }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: '1rem', margin: 0, opacity: 0.7 }}>
          We&rsquo;ve been notified. Please try again shortly.
        </p>
      </body>
    </html>
  );
}
