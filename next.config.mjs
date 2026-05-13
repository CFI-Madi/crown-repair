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

export default nextConfig;
