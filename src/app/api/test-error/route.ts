import { NextResponse } from 'next/server';

/**
 * Phase 0 Sentry verification endpoint.
 *
 * Intentionally throws so Sentry's server-side instrumentation captures the
 * error. Hit this once after deploy and confirm the event lands in the
 * Sentry dashboard.
 *
 * Remove or gate behind admin auth in Phase 0.5.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const confirm = url.searchParams.get('confirm');

  if (confirm !== 'phase-0') {
    return NextResponse.json(
      {
        message:
          'Intentional Sentry verification endpoint. Append ?confirm=phase-0 to trigger.',
      },
      { status: 400 },
    );
  }

  throw new Error(
    'Phase 0 Sentry verification: this is an intentional test error from /api/test-error.',
  );
}
