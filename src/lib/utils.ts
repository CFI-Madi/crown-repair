import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind-aware class joiner. The standard shadcn/ui pattern.
 *
 * Use this anywhere you compose Tailwind classes — it dedupes conflicting
 * utilities so that callers can override component defaults safely.
 *
 * @example
 *   cn('px-4 py-2', condition && 'bg-accent', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
