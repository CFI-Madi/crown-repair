import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Button — primary interactive element.
 *
 * Specs sourced from `06-design-system.md` Button (primary) + (secondary)
 * sections and `05-component-inventory.md` Button variants list.
 *
 * Variants: primary, secondary, ghost, danger, link
 * Sizes: sm, md (default), lg, xl
 * States: default, hover, focus, active, disabled, loading
 */
export const buttonVariants = cva(
  [
    // Base styles shared by every variant
    'inline-flex items-center justify-center gap-2',
    'rounded-md font-sans font-semibold',
    'transition-all duration-fast ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:opacity-50 disabled:pointer-events-none',
    'active:translate-y-px',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-accent-ink',
          'hover:bg-accent-emphasis hover:shadow-sm',
        ],
        secondary: [
          'bg-transparent text-ink-primary border-2 border-ink-primary',
          'hover:bg-ink-primary hover:text-ink-inverse',
        ],
        ghost: [
          'bg-transparent text-ink-primary',
          'hover:bg-bg-muted',
        ],
        danger: [
          'bg-danger text-ink-inverse',
          'hover:opacity-90 hover:shadow-sm',
        ],
        link: [
          'bg-transparent text-ink-link underline-offset-4 hover:underline',
          'h-auto !p-0',
        ],
      },
      size: {
        sm: 'text-button-sm h-8 px-3',
        md: 'text-button h-10 px-6',
        lg: 'text-button-lg h-12 px-7',
        xl: 'text-button-lg h-14 px-8',
      },
    },
    compoundVariants: [
      // Secondary variant has a 2px border; compensate padding so visual width matches primary
      {
        variant: 'secondary',
        size: 'md',
        class: 'px-[22px]',
      },
      {
        variant: 'secondary',
        size: 'lg',
        class: 'px-[26px]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** When true, replaces the label with a spinner but preserves width. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant, size, loading = false, disabled, children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
