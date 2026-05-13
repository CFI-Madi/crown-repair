import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input — text input primitive.
 *
 * Specs sourced from `06-design-system.md` Input (text) section.
 * States: default, focus, error, success, disabled.
 * Variants flow through className for now; FormField composition handles
 * label/helper/error wiring (`05` Molecules).
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Set true to surface error styling (red border, danger ring). */
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, hasError, type = 'text', ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border bg-bg-elevated px-[14px] py-[10px]',
          'text-body text-ink-primary placeholder:text-ink-muted',
          'transition-colors duration-fast ease-out',
          'focus-visible:outline-none focus-visible:border-border-focus focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-0',
          'disabled:opacity-50 disabled:bg-bg-muted disabled:pointer-events-none',
          hasError
            ? 'border-danger focus-visible:ring-danger focus-visible:border-danger'
            : 'border-border',
          className,
        )}
        aria-invalid={hasError || undefined}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
