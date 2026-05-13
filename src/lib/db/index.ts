import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton — standard Next.js pattern.
 *
 * In dev, Next.js's fast-refresh would otherwise instantiate a new client
 * on every hot reload, eventually exhausting the connection pool. Caching
 * the instance on `globalThis` survives reloads.
 *
 * In production (and on Vercel serverless functions), a fresh client is
 * created per cold-start, which is the expected behavior — Neon's
 * connection-pooled URL handles concurrency.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NEXT_PUBLIC_APP_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
