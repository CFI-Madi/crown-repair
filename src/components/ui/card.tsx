import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Card — container primitive.
 *
 * Variants per `05-component-inventory.md` Card section:
 *   - default: flat with subtle border
 *   - elevated: with shadow
 *   - interactive: hover lift (used for selectable cards e.g. shop selection)
 *   - outlined: emphasized border (used for selected state)
 *
 * Spec per `06-design-system.md` Card (default) section.
 */
const cardVariants = cva(
  [
    'rounded-lg bg-bg-elevated',
    'transition-all duration-normal ease-out',
  ],
  {
    variants: {
      variant: {
        default: 'border border-border-subtle shadow-sm',
        elevated: 'border border-border-subtle shadow-md',
        interactive: [
          'border border-border-subtle shadow-sm cursor-pointer',
          'hover:shadow-lift hover:-translate-y-0.5',
          'focus-within:ring-2 focus-within:ring-border-focus focus-within:ring-offset-2',
        ],
        outlined: 'border-2 border-border-emphasis shadow-none',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, padding, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
});

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1', className)}
      {...props}
    />
  );
});
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={cn('text-h3 font-sans font-semibold text-ink-primary', className)}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn('text-body-sm text-ink-muted', className)}
      {...props}
    />
  );
});
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn('pt-4', className)} {...props} />;
});
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex items-center pt-6', className)}
      {...props}
    />
  );
});
CardFooter.displayName = 'CardFooter';
