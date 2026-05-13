import type { Config } from 'tailwindcss';

/**
 * Tailwind theme extension that exposes every design token from
 * docs/planning/06-design-system.md as a utility class.
 *
 * Values live as CSS custom properties in src/app/globals.css; Tailwind
 * references them via `var(--token)`. This way a future rebrand is a single
 * file edit (globals.css) — no component touch required.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    // Tighten container to the marketing/dashboard rules in `06`.
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem', // 24px mobile
        lg: '3rem', // 48px desktop
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        // Foundation
        bg: {
          DEFAULT: 'var(--color-bg)',
          elevated: 'var(--color-bg-elevated)',
          inverse: 'var(--color-bg-inverse)',
          muted: 'var(--color-bg-muted)',
        },
        ink: {
          primary: 'var(--color-ink-primary)',
          secondary: 'var(--color-ink-secondary)',
          muted: 'var(--color-ink-muted)',
          inverse: 'var(--color-ink-inverse)',
          link: 'var(--color-ink-link)',
          'link-hover': 'var(--color-ink-link-hover)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          emphasis: 'var(--color-accent-emphasis)',
          muted: 'var(--color-accent-muted)',
          ink: 'var(--color-accent-ink)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          DEFAULT: 'var(--color-border-default)',
          emphasis: 'var(--color-border-emphasis)',
          focus: 'var(--color-border-focus)',
        },
        // Semantic
        success: {
          DEFAULT: 'var(--color-success)',
          bg: 'var(--color-success-bg)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          bg: 'var(--color-danger-bg)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          bg: 'var(--color-info-bg)',
        },
        // Status (Order/Repair lifecycle)
        status: {
          quote: 'var(--status-quote)',
          booked: 'var(--status-booked)',
          accepted: 'var(--status-accepted)',
          'in-progress': 'var(--status-in-progress)',
          ready: 'var(--status-ready)',
          complete: 'var(--status-complete)',
          cancelled: 'var(--status-cancelled)',
          disputed: 'var(--status-disputed)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      // Type scale per `06`: size / line-height pairs
      fontSize: {
        'display-2xl': ['72px', { lineHeight: '80px', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-xl': ['60px', { lineHeight: '68px', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.015em', fontWeight: '400' }],
        'display-md': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em', fontWeight: '500' }],
        h1: ['30px', { lineHeight: '38px', letterSpacing: '-0.01em', fontWeight: '500' }],
        h2: ['24px', { lineHeight: '32px', fontWeight: '500' }],
        h3: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        h4: ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.02em' }],
        label: ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'button-lg': ['16px', { lineHeight: '20px', fontWeight: '600' }],
        button: ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'button-sm': ['13px', { lineHeight: '16px', fontWeight: '600' }],
        mono: ['14px', { lineHeight: '20px', fontWeight: '400' }],
      },
      // 4px-base spacing scale per `06`
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
        '40': '160px',
        '48': '192px',
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '20px',
        '2xl': '28px',
        full: '9999px',
      },
      boxShadow: {
        none: 'none',
        xs: '0 1px 2px rgba(11, 31, 58, 0.04)',
        sm: '0 2px 4px rgba(11, 31, 58, 0.06)',
        md: '0 4px 12px rgba(11, 31, 58, 0.08)',
        lg: '0 8px 24px rgba(11, 31, 58, 0.10)',
        xl: '0 16px 48px rgba(11, 31, 58, 0.12)',
        lift: '0 12px 32px rgba(11, 31, 58, 0.14)',
      },
      transitionDuration: {
        instant: '60ms',
        fast: '120ms',
        normal: '200ms',
        slow: '320ms',
        deliberate: '500ms',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      maxWidth: {
        marketing: '1200px',
        dashboard: '1440px',
        funnel: '640px',
        legal: '720px',
      },
      outlineOffset: {
        focus: '2px',
      },
      outlineWidth: {
        focus: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
