import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Phase 0 placeholder home page.
 *
 * Replaced in Checkpoint B with the final Coming Soon design. For now this
 * page returns 200 at the root and points reviewers to the design-system
 * reference page.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-marketing flex-col items-center justify-center px-6 py-24 text-center lg:px-12">
      <p className="font-mono text-caption uppercase tracking-widest text-ink-muted">
        Crown Repair · Phase 0
      </p>
      <h1 className="mt-6 text-display-xl font-display text-ink-primary">
        Crown Repair
      </h1>
      <p className="mt-6 max-w-xl text-body-lg text-ink-secondary">
        Scaffold in place. Coming Soon page lands at Checkpoint B.
      </p>
      <div className="mt-10">
        <Link
          href="/design-system"
          className={cn(buttonVariants({ variant: 'primary', size: 'md' }))}
        >
          View the design system →
        </Link>
      </div>
    </main>
  );
}
