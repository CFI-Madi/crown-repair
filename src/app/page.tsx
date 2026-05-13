import type { Metadata } from 'next';

/**
 * Coming Soon — public-facing landing page for Phase 0.
 *
 * Pure server-rendered, no client JS, no animations beyond what reduced-motion
 * users would explicitly opt into. Built for the constraint that this is the
 * FIRST impression for partner-shop walkthroughs and early B2B conversations,
 * so it has to feel premium without leaning on photography we don't have yet.
 *
 * Design direction per `docs/planning/06-design-system.md`: cream/navy/amber,
 * Fraunces display, General Sans body, generous whitespace, no shouting.
 */

export const metadata: Metadata = {
  title: 'Crown Repair · Premium Device Repair · Charlotte Metro',
  description:
    'Crown Repair is a premium phone and device repair platform for the Charlotte metro. Vetted partner shops, transparent pricing, platform-wide warranty. Launching this year.',
  openGraph: {
    title: 'Crown Repair · Premium Device Repair · Charlotte Metro',
    description:
      'Vetted partner shops, transparent pricing, platform-wide warranty. Launching this year in Charlotte and the surrounding metro.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Crown Repair',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crown Repair · Premium Device Repair · Charlotte Metro',
    description:
      'Vetted partner shops, transparent pricing, platform-wide warranty. Launching this year.',
  },
};

const COVERAGE_CITIES = [
  'Charlotte',
  'Concord',
  'Gastonia',
  'Rock Hill',
  'Huntersville',
  'Matthews',
  'Kannapolis',
] as const;

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-bg">
      {/* --- Top label -------------------------------------------------- */}
      <header className="px-6 pt-12 lg:px-12 lg:pt-16">
        <p className="text-center font-mono text-caption uppercase tracking-[0.25em] text-ink-muted">
          Est. 2026 · Charlotte Metro
        </p>
      </header>

      {/* --- Hero content (vertically centered) ------------------------- */}
      <section className="flex flex-1 items-center justify-center px-6 py-16 lg:px-12">
        <div className="mx-auto w-full max-w-2xl text-center">
          <h1 className="font-display text-display-xl text-ink-primary md:text-display-2xl">
            Crown Repair
          </h1>

          <div
            aria-hidden="true"
            className="mx-auto mt-10 h-px w-16 bg-accent"
          />

          <p className="mx-auto mt-10 max-w-xl text-body-lg text-ink-secondary md:text-display-md md:font-display md:font-normal md:leading-tight md:tracking-tight">
            Premium device repair, backed by a vetted partner network and a
            platform-wide warranty.
          </p>

          <p className="mx-auto mt-8 max-w-md text-body-sm text-ink-muted">
            Launching this year. Serving the Charlotte metro and surrounding
            cities.
          </p>

          <ul className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-body-sm text-ink-muted">
            {COVERAGE_CITIES.map((city, idx) => (
              <li key={city} className="flex items-center gap-3">
                <span>{city}</span>
                {idx < COVERAGE_CITIES.length - 1 ? (
                  <span aria-hidden="true" className="text-ink-muted/40">
                    ·
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Footer ----------------------------------------------------- */}
      <footer className="border-t border-border-subtle px-6 py-8 lg:px-12">
        <div className="mx-auto flex max-w-marketing flex-col items-center justify-between gap-3 text-center font-mono text-caption uppercase tracking-widest text-ink-muted sm:flex-row sm:text-left">
          <p>© 2026 Crown Repair · Charlotte, NC</p>
          <p className="sm:text-right">All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
