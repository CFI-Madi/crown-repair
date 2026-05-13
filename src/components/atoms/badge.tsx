import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge — status / tier indicator.
 *
 * All 12 variants from `05-component-inventory.md` Badge section. Status
 * colors come from `06-design-system.md` Status colors. Style per
 * `06-design-system.md` Badge (status) section:
 *   "background: status color at 12% alpha; color: status color (full)".
 *
 * For the 12% alpha background, we use Tailwind's `[var]/12` syntax against
 * the status CSS variables.
 */
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'rounded-full px-[10px] py-1',
    'font-sans text-caption',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        // Status (Order/Repair lifecycle)
        'status-quote': 'bg-[color:var(--status-quote)]/[0.12] text-[color:var(--status-quote)]',
        'status-booked': 'bg-[color:var(--status-booked)]/[0.12] text-[color:var(--status-booked)]',
        'status-accepted': 'bg-[color:var(--status-accepted)]/[0.12] text-[color:var(--status-accepted)]',
        'status-in-progress': 'bg-[color:var(--status-in-progress)]/[0.12] text-[color:var(--status-in-progress)]',
        'status-ready': 'bg-[color:var(--status-ready)]/[0.12] text-[color:var(--status-ready)]',
        'status-complete': 'bg-[color:var(--status-complete)]/[0.12] text-[color:var(--status-complete)]',
        'status-cancelled': 'bg-[color:var(--status-cancelled)]/[0.12] text-[color:var(--status-cancelled)]',
        'status-disputed': 'bg-[color:var(--status-disputed)]/[0.12] text-[color:var(--status-disputed)]',
        // Tier (B2B pricing tiers per `09 B4`)
        'tier-standard': 'bg-info-bg text-info',
        'tier-premium': 'bg-accent-muted text-accent-emphasis',
        // Operational
        new: 'bg-success-bg text-success',
        b2b: 'border border-ink-primary bg-bg-elevated text-ink-primary',
      },
      size: {
        sm: 'text-[11px] leading-tight px-2 py-0.5',
        md: 'text-caption',
      },
    },
    defaultVariants: {
      variant: 'status-booked',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

Badge.displayName = 'Badge';
