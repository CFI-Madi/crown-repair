import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Note: NEXT_PUBLIC_APP_URL is intentionally NOT hardcoded.
  // It's derived from process.env.VERCEL_URL at runtime so the app works
  // on any Vercel preview URL without a domain. Once a domain is purchased,
  // set NEXT_PUBLIC_APP_URL in Vercel project env vars to the canonical URL.
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
  },
  images: {
    remotePatterns: [
      // No external image sources configured yet for Phase 0.
      // Add Vercel Blob, partner shop photo hosts, etc. as needed.
    ],
  },
  typescript: {
    // Type errors fail builds. Surfaces problems before Vercel deploys.
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

// Wrap with Sentry's Next.js config helper.
//
// Source-map upload is disabled outside Vercel — so local `pnpm build` runs
// don't upload maps to the Sentry project (and don't error when SENTRY_AUTH_TOKEN
// is absent in the shell environment). On Vercel, when SENTRY_AUTH_TOKEN /
// SENTRY_ORG / SENTRY_PROJECT are present, source maps upload automatically.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.VERCEL,
  sourcemaps: {
    disable: !process.env.VERCEL,
  },
  // Strip source-map references from production bundles so they're not
  // publicly accessible. Maps still upload to Sentry's private storage.
  hideSourceMaps: true,
  // Remove the Sentry debug logger from the production bundle.
  disableLogger: true,
});
