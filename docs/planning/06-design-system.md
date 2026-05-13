# 06 — Design System

## Brand principles

Crown Repair's visual language should read as:

- **Premium** — confident type, generous whitespace, restrained color
- **Trustworthy** — editorial photography (not stock-feeling), explicit warranty signals, clear typography hierarchy
- **Local** — warm tones, Charlotte-specific imagery, real partner shop photos (not generic store stock)
- **Editorial** — magazine-grade type pairing, opinionated layouts, considered rhythm
- **Quietly confident** — never shouts. No "GET 50% OFF NOW!" energy.

**Explicit anti-patterns we will not adopt:**

- Coupon-orange-on-blue (uBreakiFix's tired palette)
- Purple gradients (it's been done; reads as 2018 SaaS)
- Pure-gray "neutral" UI (lifeless; we use warm-tinted neutrals)
- Stock-photo techs with thumbs up
- Fluorescent-lit shop interior photography
- "GET DEAL NOW" CTA voice
- Heavy drop shadows, glassmorphism, gradients-as-decoration
- Auto-playing video heroes
- Generic startup font stack (Inter, no thanks)

---

## Color tokens

Stored as CSS custom properties in `:root`, consumed by Tailwind via theme extension. Token names are semantic, not visual — so a future rebrand changes values without touching component code.

### Foundation

```
--color-bg                    #F7F2EA   /* cream / warm white — page background */
--color-bg-elevated           #FFFCF6   /* slightly lighter for cards/modals */
--color-bg-inverse            #0B1F3A   /* navy — used for hero overlays, footer */
--color-bg-muted              #EDE6D9   /* muted sand — section dividers */

--color-ink-primary           #0B1F3A   /* deep navy — body text on cream */
--color-ink-secondary         #2C3E5B   /* lighter navy — supporting text */
--color-ink-muted             #5A6478   /* warm gray — captions, meta */
--color-ink-inverse           #F7F2EA   /* cream on dark backgrounds */
--color-ink-link              #0B1F3A   /* navy underline */
--color-ink-link-hover        #1A3454

--color-accent                #D89A3C   /* warm amber — primary CTA, focus ring */
--color-accent-emphasis       #B6802B   /* deeper amber on hover */
--color-accent-muted          #F4DDB0   /* light amber tint — selected states */
--color-accent-ink            #0B1F3A   /* text color on amber bg (navy, NOT white — better contrast on this amber) */

--color-border-subtle         #E5DED0   /* hairline borders, dividers */
--color-border-default        #C9BEA8
--color-border-emphasis       #0B1F3A   /* navy emphasis (selected card, focus container) */
--color-border-focus          #D89A3C   /* amber 2px focus ring */
```

### Semantic / status

```
--color-success               #2F6B4A   /* forest green */
--color-success-bg            #E6F0EA
--color-warning               #B6802B   /* deeper amber — distinct from accent */
--color-warning-bg            #F8EBCC
--color-danger                #A8362F   /* warm red, not screaming */
--color-danger-bg             #F4DDDA
--color-info                  #2B5F8E   /* teal-blue */
--color-info-bg               #E0EBF4
```

### Status colors (for Order/Repair lifecycle badges)

```
--status-quote                #5A6478   /* muted gray */
--status-booked               #2B5F8E   /* slate-blue */
--status-accepted             #2B5F8E
--status-in-progress          #D89A3C   /* amber */
--status-ready                #2A8082   /* teal */
--status-complete             #2F6B4A   /* success green */
--status-cancelled            #8C8474   /* muted warm gray */
--status-disputed             #A8362F   /* danger red */
```

### Scales (for occasional fine-grained needs)

For `--color-navy`, `--color-amber`, `--color-neutral`: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900. Computed from the foundation values via oklch interpolation. Used sparingly — most UI sticks to the semantic tokens above.

### Accessibility verification

Every token-pair used in UI must clear WCAG 2.1 AA contrast:
- Body text (`--color-ink-primary` on `--color-bg`): contrast ≥4.5:1 ✓ (this amber-on-cream pair has been chosen to clear this floor)
- Large text on amber CTA: navy ink on amber clears 4.5:1 — verified before lock-in
- Focus ring (`--color-border-focus` on `--color-bg`): visually distinct ≥3:1

Validation: every PR with color changes runs an automated contrast-checker.

---

## Typography

### Faces

**Display: Fraunces** (Google Fonts / variable, open-source)
- Weights 300–700, opsz (optical-size) axis enabled
- Used for: H1, H2, H3, hero headlines, editorial moments (testimonial quotes, large pull quotes)
- Distinctive serif with high contrast; sets us apart from uBreakiFix's sans-only voice

**Body: General Sans** (Indian Type Foundry, free for commercial use — license check in `09`)
- Weights 400 (regular), 500 (medium), 600 (semibold)
- Used for: H4-H6, body text, buttons, form labels, navigation
- Explicitly NOT Inter — Inter is the default-system AI-startup look; we differentiate
- Fallback stack: `'General Sans', 'IBM Plex Sans', system-ui, sans-serif`

**Mono: JetBrains Mono** (free, open-source)
- Used for: order IDs, technical fields in admin (event payloads, JSON previews), code samples in docs

### Type scale

```
display-2xl     72 / 80   — Fraunces 400, tight tracking, used 1×/page max
display-xl      60 / 68   — Fraunces 400, hero headlines
display-lg      48 / 56   — Fraunces 400, section headers
display-md      36 / 44   — Fraunces 500, prominent block titles
h1              30 / 38   — Fraunces 500, page titles
h2              24 / 32   — Fraunces 500, section titles
h3              20 / 28   — General Sans 600, sub-section titles
h4              18 / 26   — General Sans 600, card titles
body-lg         18 / 28   — General Sans 400, intro paragraphs, hero subheads
body            16 / 24   — General Sans 400, default body
body-sm         14 / 20   — General Sans 400, helper text, meta
caption         12 / 16   — General Sans 500, labels, tags
label           14 / 20   — General Sans 500, form labels, breadcrumbs
button-lg       16 / 20   — General Sans 600
button          14 / 20   — General Sans 600
button-sm       13 / 16   — General Sans 600
mono            14 / 20   — JetBrains Mono 400, for IDs and code
```

### Type rules

- Line-height in Fraunces display sizes uses opsz axis to keep optical balance
- Never use Fraunces below 18px (loses character; switch to General Sans)
- Never bold Fraunces (use weight 500-700 via the axis, not synthetic bold)
- Limit any page to two Fraunces sizes — pick one display + one heading, stick with them
- Tracking: tight on display (-1% to -2%), neutral on body, slightly loose on small caps / captions (+2%)
- Numeric tables use tabular-nums (CSS `font-variant-numeric: tabular-nums`)

---

## Spacing scale

4px base unit. Used for padding, margin, gap.

```
space-0     0
space-1     4
space-2     8
space-3     12
space-4     16
space-5     20
space-6     24
space-8     32
space-10    40
space-12    48
space-16    64
space-20    80
space-24    96
space-32    128
space-40    160
space-48    192
```

Components use multiples of 4. Marketing pages use generous spacing — section padding often `space-24` to `space-32` vertically. Density-heavy admin pages use `space-2` / `space-3` more.

---

## Radius scale

```
radius-none     0
radius-sm       4    — small inline elements (tags, chips)
radius-md       8    — buttons, inputs (default)
radius-lg       12   — cards (default)
radius-xl       20   — larger cards, modal corners
radius-2xl      28   — featured marketing cards
radius-full     9999 — pills, avatars
```

Buttons use `radius-md`. Cards use `radius-lg`. Hero imagery uses `radius-xl`.

---

## Shadow scale

Warm-tinted (slight amber undertone — not pure gray). Used sparingly; flat-with-borders is the default.

```
shadow-none      none
shadow-xs        0 1px 2px rgba(11, 31, 58, 0.04)
shadow-sm        0 2px 4px rgba(11, 31, 58, 0.06)
shadow-md        0 4px 12px rgba(11, 31, 58, 0.08)
shadow-lg        0 8px 24px rgba(11, 31, 58, 0.10)
shadow-xl        0 16px 48px rgba(11, 31, 58, 0.12)
shadow-lift      0 12px 32px rgba(11, 31, 58, 0.14)   /* card hover */
```

Default card shadow: `shadow-sm`. Modal: `shadow-xl`. Floating action: `shadow-lg`. Hover on interactive card: `shadow-lift`.

---

## Border tokens

```
border-hairline   1px solid var(--color-border-subtle)
border-default    1px solid var(--color-border-default)
border-emphasis   2px solid var(--color-border-emphasis)
border-focus      2px solid var(--color-border-focus)
```

Focus ring: `outline: var(--color-border-focus) 2px solid; outline-offset: 2px;` Always visible, always amber, always 2px.

---

## Motion

Durations and easings:

```
duration-instant   60ms     — micro-interactions (tag flip, checkbox toggle)
duration-fast      120ms    — hover state changes, focus transitions
duration-normal    200ms    — page transitions, modal open
duration-slow      320ms    — content reveal, illustration animations
duration-deliberate 500ms   — page-level hero animations (used rarely)

easing-out         cubic-bezier(0.16, 1, 0.3, 1)   — default for entering content
easing-in          cubic-bezier(0.4, 0, 1, 1)      — default for exiting content
easing-inout       cubic-bezier(0.4, 0, 0.2, 1)    — symmetric in-out
easing-spring      cubic-bezier(0.34, 1.56, 0.64, 1)   — subtle bounce for confirmations
```

**Reduced motion:** every animation respects `@media (prefers-reduced-motion: reduce)` and disables transforms/transitions accordingly.

---

## Layout grid

- **Marketing pages**: 12-column grid, max-width 1200px, container padding 24px mobile / 48px desktop, gutter 32px
- **Dashboards** (`/shop/*`, `/b2b/dashboard/*`, `/admin/*`): max-width 1440px, sidebar 240px, main flex
- **Booking funnel** (`/book/*`): single column, max-width 640px (mobile-first design — desktop is just a centered version)
- **Legal pages**: single column, max-width 720px, generous line-height for readability

Breakpoints (mobile-first):

```
sm    640px    — large phone landscape
md    768px    — tablet portrait
lg    1024px   — tablet landscape / small desktop
xl    1280px   — desktop
2xl   1536px   — large desktop
```

---

## Iconography

- **Base set**: `lucide-react` (consistent 2px stroke, geometric)
- **Custom repair-category icons**: line-art, navy stroke, 2px weight, matching lucide visual rhythm
  - screen, battery, port, water, back-glass, camera, speaker, mic, software, diagnostic
- **Trust badges**: BBB, warranty seal, etc. — rendered as small SVG components, not raster

Icon sizes: 16, 20, 24, 32, 48px. Default 20px inline, 24px for buttons, 32-48 for feature cards.

---

## Imagery direction

**What we use:**
- Editorial product photography (single device on warm surface, soft natural light)
- Real partner shop interiors (when permission granted) — warm, lived-in, professional
- Hands-at-work photography (technician hands holding tools — NOT stock thumbs-up faces)
- Charlotte cityscape moments for location pages (skyline, neighborhoods, real places)
- Subtle illustrated icon set for repair categories

**What we don't use:**
- Stock photo techs with toothy grins
- Fluorescent-lit big-box-store interiors
- Phone-floating-on-purple-gradient marketing shots
- Generic blue-tinted "tech" stock imagery
- Anything that screams "BUY NOW"

**Photography brief deliverables** (Phase 0, see `08`):
- 1 hero photo per coverage city
- 5-8 hands-at-work shots
- 1 portrait per founding partner shop owner (if permission granted)
- 10 product photos (top devices on warm surface)
- 3-5 customer testimonial portraits (sourced from real customers post-launch)

---

## Component-level specs

These pair with `05`. Key components only — full spec lives in Storybook (Phase 0.1).

### Button (primary)

```
background: var(--color-accent)
color: var(--color-accent-ink)    /* navy on amber */
padding: 12px 24px (md) / 14px 28px (lg)
border-radius: var(--radius-md)
font: button (16/20 General Sans 600)
shadow: none default; shadow-sm on hover

hover:    background: var(--color-accent-emphasis)
focus:    outline: 2px solid var(--color-border-focus); outline-offset: 2px
active:   transform: translateY(1px)
disabled: opacity 0.5; pointer-events: none
loading:  spinner inline; label hidden but width preserved
```

### Button (secondary)

```
background: transparent
color: var(--color-ink-primary)
border: 2px solid var(--color-ink-primary)
padding: 10px 22px (md)   /* 2px less to compensate for border */
… (other states mirror primary)
```

### Input (text)

```
background: var(--color-bg-elevated)
border: 1px solid var(--color-border-default)
border-radius: var(--radius-md)
padding: 10px 14px
font: body (16/24)
color: var(--color-ink-primary)
placeholder: var(--color-ink-muted)

focus: border-color: var(--color-border-focus); outline: 2px solid var(--color-border-focus); outline-offset: 0
error: border-color: var(--color-danger); helper text in danger
disabled: opacity 0.5; background: var(--color-bg-muted)
```

### Card (default)

```
background: var(--color-bg-elevated)
border: 1px solid var(--color-border-subtle)
border-radius: var(--radius-lg)
padding: 24px
shadow: var(--shadow-sm) default
hover (interactive variant): shadow: var(--shadow-lift); transform: translateY(-2px); transition: 200ms easing-out
```

### Badge (status)

```
display: inline-flex
align-items: center
padding: 4px 10px
border-radius: var(--radius-full)
font: caption (12/16 General Sans 500)
background: status color at 12% alpha
color: status color (full strength)
```

### Stepper (booking funnel)

Three variants by viewport breakpoint:

**Mobile** (`<640px`): compact pill — "Step 3 of 12: Choose your model" + a thin horizontal progress bar underneath. 40px height. Step number prominent; label truncates with ellipsis if too long for a single line.

**Tablet portrait** (`640-1024px`): condensed dots — 12 dots at 16px each (smaller than desktop), labels hidden, current step's label shown as a single line above the dot row. 48px height. Step numbers visible inside each dot.

**Desktop** (`≥1024px`): full horizontal — 12 dots at 24px, labels visible below each dot. 56px height. Connector lines between dots.

```
common state styles (all variants):
completed dot:  var(--color-success) with white check
current dot:    var(--color-accent) with white number (or pill text on mobile)
upcoming dot:   var(--color-border-default) with var(--color-ink-muted) number
connector:      2px line in var(--color-border-subtle); completed segments in var(--color-success)
```

**Why a tablet variant:** 12 × 24px dots + labels won't fit cleanly at 768px viewport without label collision or shrinking the dots into illegibility. The condensed-dot layout preserves the "where am I in the flow" affordance without falling back to the mobile "Step X of 12" pill, which feels under-confident on iPad-class devices.

---

## Accessibility floor (system-wide)

- **WCAG 2.1 AA** as the floor; aim for AAA on hero content
- **Contrast verified** on every token-pair via automated check in CI
- **Keyboard navigation** complete on every interactive element; visible focus ring always
- **Screen-reader semantics**: proper headings hierarchy, ARIA labels on icon-only buttons, `aria-live` for dynamic content (booking step changes, toast notifications)
- **Touch targets** ≥44×44 px on mobile
- **Motion respect**: reduced-motion media query honored everywhere
- **Color is never the only indicator**: status badges have both color and label/icon

## How tokens flow into code

- Tokens defined as CSS custom properties in `globals.css`
- Tailwind `tailwind.config.ts` extends theme to alias tokens: `bg-accent`, `text-ink-primary`, etc.
- Components use Tailwind classes via shadcn pattern: `cn("bg-accent text-accent-ink", className)`
- shadcn/ui components are restyled by editing the generated component files directly (we own them)
- Storybook visualizes every token + every component variant

## What's deferred

- **Dark mode** — token structure supports it; no dark variants built in MVP
- **Animation library** — Framer Motion installed but used sparingly; complex animation reserved for v1.x
- **Custom illustration set** — beyond repair-category icons, illustrations are commissioned later if budget allows
- **Theming for B2B white-label** — never planned for MVP; would be v2+
