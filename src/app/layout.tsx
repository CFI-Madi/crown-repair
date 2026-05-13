import type { Metadata } from 'next';
import { Fraunces, JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

/**
 * Display face — Fraunces is loaded via next/font/google for variable-axis
 * optical sizing and zero-CLS web-font delivery.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
  variable: '--font-fraunces',
  display: 'swap',
});

/**
 * Mono face — JetBrains Mono for IDs, code, technical data.
 */
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

/**
 * Body sans — General Sans (Fontshare).
 *
 * Loaded via Fontshare CDN <link> below because there's no first-party npm
 * package for Fontshare fonts. The IBM Plex Sans fallback (per `09` license
 * fallback decision) is declared in the --font-sans chain in globals.css and
 * kicks in if Fontshare is unreachable.
 *
 * If Fontshare turns out to be unreliable, swap to next/font/google with
 * IBM_Plex_Sans here and remove the <link>.
 */

export const metadata: Metadata = {
  title: {
    default: 'Crown Repair',
    template: '%s · Crown Repair',
  },
  description:
    'Premium phone and device repair for the Charlotte metro. Backed by warranty.',
  applicationName: 'Crown Repair',
  authors: [{ name: 'Crown Repair' }],
  creator: 'Crown Repair',
  // No canonical URL set yet — added in Checkpoint B (or once domain is locked).
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(fraunces.variable, jetBrainsMono.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* General Sans via Fontshare CDN. Swap to next/font/google with
            IBM_Plex_Sans if Fontshare reliability becomes an issue. */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f%5B%5D=general-sans@400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-bg font-sans text-ink-primary antialiased">
        {children}
      </body>
    </html>
  );
}
