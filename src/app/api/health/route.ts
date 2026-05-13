import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * DB connectivity health check.
 *
 * Returns 200 with `{ db: "ok", ... }` when the database is reachable AND
 * the placeholder `HealthCheck` table exists (i.e. migrations have run).
 *
 * Returns 503 with `{ db: "error", message: ... }` when the database is
 * unreachable, DATABASE_URL is unset, or the table doesn't exist.
 *
 * The route is force-dynamic — never prerendered, never cached. Every hit
 * exercises the live connection. Intentional: this is a diagnostic endpoint,
 * not a hot path.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET() {
  const env = process.env.NEXT_PUBLIC_APP_ENV ?? 'unknown';
  const databaseConfigured = Boolean(process.env.DATABASE_URL);

  if (!databaseConfigured) {
    return NextResponse.json(
      {
        db: 'error',
        env,
        message: 'DATABASE_URL is not set in this environment.',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }

  try {
    const start = Date.now();
    const rowCount = await prisma.healthCheck.count();
    const latencyMs = Date.now() - start;

    return NextResponse.json({
      db: 'ok',
      env,
      latencyMs,
      healthCheckRows: rowCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        db: 'error',
        env,
        message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
