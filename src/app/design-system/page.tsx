import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/atoms/badge';
import { ArrowRight, Search, AlertCircle, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Design System',
  description: 'Living reference for Crown Repair design tokens and component variants.',
};

/* ============================================================================
 * PAGE-LOCAL HELPERS
 * Used only on this page. Not exported as reusable components.
 * ========================================================================== */
function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-border-subtle pb-16">
      <header className="mb-8">
        <h2 className="text-h2 font-display text-ink-primary">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-3xl text-body text-ink-secondary">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function ColorSwatch({
  name,
  cssVar,
  value,
  textOn = 'light',
}: {
  name: string;
  cssVar: string;
  value: string;
  textOn?: 'light' | 'dark';
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated">
      <div
        className={`flex h-24 items-end p-4 ${textOn === 'dark' ? 'text-ink-inverse' : 'text-ink-primary'}`}
        style={{ backgroundColor: `var(${cssVar})` }}
      >
        <span className="font-mono text-[11px] opacity-80">{value}</span>
      </div>
      <div className="space-y-1 px-4 py-3">
        <p className="text-body-sm font-medium text-ink-primary">{name}</p>
        <p className="font-mono text-[11px] text-ink-muted">{cssVar}</p>
      </div>
    </div>
  );
}

function TypeRow({
  cls,
  label,
  sample,
}: {
  cls: string;
  label: string;
  sample: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 border-b border-border-subtle py-6 last:border-b-0 md:grid-cols-[200px_1fr]">
      <div className="space-y-1">
        <code className="font-mono text-body-sm text-ink-primary">{cls}</code>
        <p className="text-[11px] text-ink-muted">{label}</p>
      </div>
      <p className={cls + ' text-ink-primary'}>{sample}</p>
    </div>
  );
}

function SpacingRow({ token, px }: { token: string; px: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-border-subtle py-3 last:border-b-0">
      <code className="w-24 font-mono text-body-sm text-ink-primary">
        {token}
      </code>
      <span className="w-16 font-mono text-[11px] text-ink-muted">{px}px</span>
      <div
        className="h-4 rounded-sm bg-accent"
        style={{ width: `${px}px` }}
        aria-hidden="true"
      />
    </div>
  );
}

function RadiusSwatch({ token, value }: { token: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-20 w-20 border-2 border-border-emphasis bg-bg-elevated"
        style={{ borderRadius: value === '9999px' ? '9999px' : value }}
        aria-hidden="true"
      />
      <code className="font-mono text-[11px] text-ink-primary">{token}</code>
      <span className="font-mono text-[11px] text-ink-muted">{value}</span>
    </div>
  );
}

function ShadowSwatch({ token, value }: { token: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="h-20 w-32 rounded-lg bg-bg-elevated"
        style={{ boxShadow: value }}
        aria-hidden="true"
      />
      <code className="font-mono text-[11px] text-ink-primary">{token}</code>
    </div>
  );
}

/* ============================================================================
 * PAGE
 * ========================================================================== */
export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-marketing px-6 py-16 lg:px-12">
      {/* ---- Page header ---- */}
      <header className="mb-12 border-b border-border-subtle pb-12">
        <p className="font-mono text-caption uppercase tracking-widest text-ink-muted">
          Crown Repair · Internal Reference
        </p>
        <h1 className="mt-4 text-display-lg font-display text-ink-primary">
          Design System
        </h1>
        <p className="mt-4 max-w-3xl text-body-lg text-ink-secondary">
          Every token from{' '}
          <a
            href="https://github.com/CFI-Madi/crown-repair/blob/main/docs/planning/06-design-system.md"
            className="text-ink-link underline underline-offset-2 hover:text-ink-link-hover"
          >
            06-design-system.md
          </a>{' '}
          rendered as a visual reference. Use this page to verify the system is
          wired correctly and to compare options when building new components.
          Not user-facing.
        </p>
        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-body-sm">
          <a href="#colors" className="text-ink-link hover:text-ink-link-hover">Colors</a>
          <a href="#typography" className="text-ink-link hover:text-ink-link-hover">Typography</a>
          <a href="#spacing" className="text-ink-link hover:text-ink-link-hover">Spacing</a>
          <a href="#radius" className="text-ink-link hover:text-ink-link-hover">Radius</a>
          <a href="#shadows" className="text-ink-link hover:text-ink-link-hover">Shadows</a>
          <a href="#buttons" className="text-ink-link hover:text-ink-link-hover">Buttons</a>
          <a href="#inputs" className="text-ink-link hover:text-ink-link-hover">Inputs</a>
          <a href="#cards" className="text-ink-link hover:text-ink-link-hover">Cards</a>
          <a href="#badges" className="text-ink-link hover:text-ink-link-hover">Badges</a>
        </nav>
      </header>

      <div className="space-y-16">
        {/* ============================================================
         * COLORS
         * ============================================================ */}
        <Section
          id="colors"
          title="Color tokens"
          description="Three layers: foundation (background, ink, accent, border), semantic (success/warning/danger/info), and status (Order/Repair lifecycle). All values are CSS custom properties in globals.css — a rebrand is a one-file edit."
        >
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">
                Foundation
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <ColorSwatch name="Background" cssVar="--color-bg" value="#F7F2EA" />
                <ColorSwatch name="BG Elevated" cssVar="--color-bg-elevated" value="#FFFCF6" />
                <ColorSwatch name="BG Muted" cssVar="--color-bg-muted" value="#EDE6D9" />
                <ColorSwatch name="BG Inverse" cssVar="--color-bg-inverse" value="#0B1F3A" textOn="dark" />
                <ColorSwatch name="Ink Primary" cssVar="--color-ink-primary" value="#0B1F3A" textOn="dark" />
                <ColorSwatch name="Ink Secondary" cssVar="--color-ink-secondary" value="#2C3E5B" textOn="dark" />
                <ColorSwatch name="Ink Muted" cssVar="--color-ink-muted" value="#5A6478" textOn="dark" />
                <ColorSwatch name="Ink Inverse" cssVar="--color-ink-inverse" value="#F7F2EA" />
                <ColorSwatch name="Accent" cssVar="--color-accent" value="#D89A3C" />
                <ColorSwatch name="Accent Emphasis" cssVar="--color-accent-emphasis" value="#B6802B" />
                <ColorSwatch name="Accent Muted" cssVar="--color-accent-muted" value="#F4DDB0" />
                <ColorSwatch name="Border Subtle" cssVar="--color-border-subtle" value="#E5DED0" />
                <ColorSwatch name="Border Default" cssVar="--color-border-default" value="#C9BEA8" />
                <ColorSwatch name="Border Emphasis" cssVar="--color-border-emphasis" value="#0B1F3A" textOn="dark" />
                <ColorSwatch name="Border Focus" cssVar="--color-border-focus" value="#D89A3C" />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">Semantic</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <ColorSwatch name="Success" cssVar="--color-success" value="#2F6B4A" textOn="dark" />
                <ColorSwatch name="Success BG" cssVar="--color-success-bg" value="#E6F0EA" />
                <ColorSwatch name="Warning" cssVar="--color-warning" value="#B6802B" />
                <ColorSwatch name="Warning BG" cssVar="--color-warning-bg" value="#F8EBCC" />
                <ColorSwatch name="Danger" cssVar="--color-danger" value="#A8362F" textOn="dark" />
                <ColorSwatch name="Danger BG" cssVar="--color-danger-bg" value="#F4DDDA" />
                <ColorSwatch name="Info" cssVar="--color-info" value="#2B5F8E" textOn="dark" />
                <ColorSwatch name="Info BG" cssVar="--color-info-bg" value="#E0EBF4" />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">
                Status (Order/Repair lifecycle)
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
                <ColorSwatch name="Quote" cssVar="--status-quote" value="#5A6478" textOn="dark" />
                <ColorSwatch name="Booked" cssVar="--status-booked" value="#2B5F8E" textOn="dark" />
                <ColorSwatch name="Accepted" cssVar="--status-accepted" value="#2B5F8E" textOn="dark" />
                <ColorSwatch name="In Progress" cssVar="--status-in-progress" value="#D89A3C" />
                <ColorSwatch name="Ready" cssVar="--status-ready" value="#2A8082" textOn="dark" />
                <ColorSwatch name="Complete" cssVar="--status-complete" value="#2F6B4A" textOn="dark" />
                <ColorSwatch name="Cancelled" cssVar="--status-cancelled" value="#8C8474" textOn="dark" />
                <ColorSwatch name="Disputed" cssVar="--status-disputed" value="#A8362F" textOn="dark" />
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================================
         * TYPOGRAPHY
         * ============================================================ */}
        <Section
          id="typography"
          title="Typography"
          description="Display face is Fraunces (serif, variable opsz axis). Body is General Sans (Fontshare CDN; IBM Plex Sans fallback per 09 license-fallback decision). Mono is JetBrains Mono."
        >
          <div className="space-y-2">
            <TypeRow cls="text-display-2xl font-display" label="display-2xl · Fraunces 400" sample="Premium device repair." />
            <TypeRow cls="text-display-xl font-display" label="display-xl · Fraunces 400" sample="Premium device repair." />
            <TypeRow cls="text-display-lg font-display" label="display-lg · Fraunces 400" sample="Premium device repair." />
            <TypeRow cls="text-display-md font-display" label="display-md · Fraunces 500" sample="Backed by a vetted partner network." />
            <TypeRow cls="text-h1 font-display" label="h1 · Fraunces 500" sample="Charlotte's repair people." />
            <TypeRow cls="text-h2 font-display" label="h2 · Fraunces 500" sample="How it works" />
            <TypeRow cls="text-h3 font-sans font-semibold" label="h3 · General Sans 600" sample="Section heading" />
            <TypeRow cls="text-h4 font-sans font-semibold" label="h4 · General Sans 600" sample="Card title" />
            <TypeRow cls="text-body-lg" label="body-lg · General Sans 400" sample="Intro paragraph for hero sub-heads and section openers." />
            <TypeRow cls="text-body" label="body · General Sans 400" sample="Default body text. Used for the long-form copy on city pages, FAQ entries, and trust/warranty explanations." />
            <TypeRow cls="text-body-sm text-ink-muted" label="body-sm · General Sans 400" sample="Helper text, meta information, captions in tables." />
            <TypeRow cls="text-caption uppercase tracking-widest text-ink-muted" label="caption · General Sans 500" sample="Caption · Label · Tag" />
            <TypeRow cls="text-label" label="label · General Sans 500" sample="Form Label" />
            <TypeRow cls="text-button-lg" label="button-lg · General Sans 600" sample="Book a Repair" />
            <TypeRow cls="text-button" label="button · General Sans 600" sample="Select Shop" />
            <TypeRow cls="text-button-sm" label="button-sm · General Sans 600" sample="Cancel" />
            <TypeRow cls="text-mono font-mono" label="mono · JetBrains Mono 400" sample="ord_8aZk2X9Q" />
          </div>
        </Section>

        {/* ============================================================
         * SPACING
         * ============================================================ */}
        <Section
          id="spacing"
          title="Spacing scale"
          description="4px base unit. Used for padding, margin, gap. Marketing pages use generous spacing — section padding often space-24 to space-32 vertically."
        >
          <div className="rounded-lg border border-border-subtle bg-bg-elevated p-6">
            <SpacingRow token="space-1" px={4} />
            <SpacingRow token="space-2" px={8} />
            <SpacingRow token="space-3" px={12} />
            <SpacingRow token="space-4" px={16} />
            <SpacingRow token="space-5" px={20} />
            <SpacingRow token="space-6" px={24} />
            <SpacingRow token="space-8" px={32} />
            <SpacingRow token="space-10" px={40} />
            <SpacingRow token="space-12" px={48} />
            <SpacingRow token="space-16" px={64} />
            <SpacingRow token="space-20" px={80} />
            <SpacingRow token="space-24" px={96} />
            <SpacingRow token="space-32" px={128} />
          </div>
        </Section>

        {/* ============================================================
         * RADIUS
         * ============================================================ */}
        <Section
          id="radius"
          title="Radius scale"
          description="Buttons use radius-md (8px). Cards use radius-lg (12px). Hero imagery uses radius-xl (20px)."
        >
          <div className="flex flex-wrap items-end gap-6 rounded-lg border border-border-subtle bg-bg-elevated p-8">
            <RadiusSwatch token="radius-none" value="0" />
            <RadiusSwatch token="radius-sm" value="4px" />
            <RadiusSwatch token="radius-md" value="8px" />
            <RadiusSwatch token="radius-lg" value="12px" />
            <RadiusSwatch token="radius-xl" value="20px" />
            <RadiusSwatch token="radius-2xl" value="28px" />
            <RadiusSwatch token="radius-full" value="9999px" />
          </div>
        </Section>

        {/* ============================================================
         * SHADOWS
         * ============================================================ */}
        <Section
          id="shadows"
          title="Shadow scale"
          description="Warm-tinted (slight amber undertone — not pure gray). Used sparingly. Default card shadow is shadow-sm. Modal uses shadow-xl. Hover on interactive card uses shadow-lift."
        >
          <div className="flex flex-wrap items-end gap-8 rounded-lg bg-bg p-12">
            <ShadowSwatch token="shadow-xs" value="0 1px 2px rgba(11, 31, 58, 0.04)" />
            <ShadowSwatch token="shadow-sm" value="0 2px 4px rgba(11, 31, 58, 0.06)" />
            <ShadowSwatch token="shadow-md" value="0 4px 12px rgba(11, 31, 58, 0.08)" />
            <ShadowSwatch token="shadow-lg" value="0 8px 24px rgba(11, 31, 58, 0.10)" />
            <ShadowSwatch token="shadow-xl" value="0 16px 48px rgba(11, 31, 58, 0.12)" />
            <ShadowSwatch token="shadow-lift" value="0 12px 32px rgba(11, 31, 58, 0.14)" />
          </div>
        </Section>

        {/* ============================================================
         * BUTTONS
         * ============================================================ */}
        <Section
          id="buttons"
          title="Buttons"
          description="Five variants × four sizes. All variants share the amber focus ring. The active state shifts the button 1px down. The loading state preserves width."
        >
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">Variants (size md)</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">Sizes (primary)</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">With icons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button>
                  Book a Repair
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="secondary">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Find a Shop
                </Button>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">States</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================================
         * INPUTS
         * ============================================================ */}
        <Section
          id="inputs"
          title="Inputs"
          description="Text-input primitive with default, focus, error, and disabled states. Composed with FormField (Phase 0.1) for label + helper + error wiring."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="input-default" className="text-label text-ink-primary">
                Default
              </label>
              <Input id="input-default" placeholder="iPhone 15 Pro" />
            </div>
            <div className="space-y-2">
              <label htmlFor="input-error" className="text-label text-ink-primary">
                Error
              </label>
              <Input id="input-error" defaultValue="invalid@" hasError />
              <p className="flex items-center gap-1.5 text-body-sm text-danger">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Enter a valid email address.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="input-disabled" className="text-label text-ink-primary">
                Disabled
              </label>
              <Input id="input-disabled" placeholder="Not available" disabled />
            </div>
            <div className="space-y-2">
              <label htmlFor="input-prefilled" className="text-label text-ink-primary">
                Pre-filled
              </label>
              <Input id="input-prefilled" defaultValue="28202" />
              <p className="flex items-center gap-1.5 text-body-sm text-success">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ZIP is in our service area.
              </p>
            </div>
          </div>
        </Section>

        {/* ============================================================
         * CARDS
         * ============================================================ */}
        <Section
          id="cards"
          title="Cards"
          description="Four variants: default (subtle border, flat), elevated (with shadow), interactive (hover lift — for selectable cards like shop selection), and outlined (emphasized border — for selected state)."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card variant="default">
              <CardHeader>
                <Badge variant="status-booked" className="self-start">Default</Badge>
                <CardTitle>Default card</CardTitle>
                <CardDescription>
                  Used for content blocks that don&rsquo;t need elevation. Subtle hairline border, no shadow beyond `shadow-sm`.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-ink-secondary">
                  Body content sits below the header at default padding. Footer renders below the content.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <Badge variant="status-in-progress" className="self-start">Elevated</Badge>
                <CardTitle>Elevated card</CardTitle>
                <CardDescription>
                  Same structure as default, but with `shadow-md`. Used to lift a card out of the page background — e.g., featured content on a marketing page.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="interactive" tabIndex={0}>
              <CardHeader>
                <Badge variant="status-ready" className="self-start">Interactive</Badge>
                <CardTitle>Interactive card</CardTitle>
                <CardDescription>
                  Hover lifts the card with `shadow-lift` + a 2px Y translation. Used for selectable cards like shop selection in the booking funnel.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="link">Select →</Button>
              </CardFooter>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <Badge variant="status-complete" className="self-start">Outlined</Badge>
                <CardTitle>Outlined card</CardTitle>
                <CardDescription>
                  2px navy border, no shadow. Used to indicate selected state on a previously interactive card.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Section>

        {/* ============================================================
         * BADGES
         * ============================================================ */}
        <Section
          id="badges"
          title="Badges"
          description="Status badges for the Order/Repair lifecycle (8 variants), tier badges for B2B pricing tiers (2 variants), plus `new` and `b2b` operational badges. All clear AA contrast against the cream page background."
        >
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">Status</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="status-quote">Quote</Badge>
                <Badge variant="status-booked">Booked</Badge>
                <Badge variant="status-accepted">Accepted</Badge>
                <Badge variant="status-in-progress">In Progress</Badge>
                <Badge variant="status-ready">Ready</Badge>
                <Badge variant="status-complete">Complete</Badge>
                <Badge variant="status-cancelled">Cancelled</Badge>
                <Badge variant="status-disputed">Disputed</Badge>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">Tier</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="tier-standard">Standard B2B</Badge>
                <Badge variant="tier-premium">Education Tier</Badge>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">Operational</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="new">New</Badge>
                <Badge variant="b2b">Billed to account</Badge>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-h4 font-sans text-ink-primary">Size variants</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="status-in-progress" size="sm">Small</Badge>
                <Badge variant="status-in-progress" size="md">Medium (default)</Badge>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================================
         * FOOTER
         * ============================================================ */}
        <footer className="border-t border-border-subtle pt-12 text-center">
          <p className="font-mono text-caption text-ink-muted">
            Crown Repair · Phase 0 Design System ·{' '}
            <a
              href="https://github.com/CFI-Madi/crown-repair/blob/main/docs/planning/06-design-system.md"
              className="underline underline-offset-2 hover:text-ink-link-hover"
            >
              source spec
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
