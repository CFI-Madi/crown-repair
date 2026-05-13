# 05 — Component Inventory

Components grouped by atomic-design level. Each lists variants, states, key props, and the shadcn/ui base (if any) it's built on. All components consume design tokens from `06`.

## Conventions

- All components are React functional components, TypeScript-typed, in `src/components/{atoms|molecules|organisms|templates}/`
- shadcn/ui components are copied into the repo (`src/components/ui/`) and restyled to match our design system — we own them
- Tailwind class composition via `cn()` utility (from shadcn)
- All form components integrate with `react-hook-form` and `zod` schemas
- Accessibility floor: WCAG 2.1 AA; keyboard navigable; visible focus ring (amber 2px per `06`); ARIA labels where needed
- Storybook stories for every component (Phase 0.1+); used as a design-review surface

---

## Atoms

### `Button`

| Variant | Use |
|---|---|
| `primary` | Main CTAs (amber background, navy text) |
| `secondary` | Secondary actions (navy outline, navy text) |
| `ghost` | Tertiary actions (no border, navy text, hover bg) |
| `danger` | Destructive actions (red bg, white text) |
| `link` | Inline text-button (navy underline) |

Sizes: `sm`, `md` (default), `lg`, `xl`
States: `default`, `hover`, `focus`, `active`, `disabled`, `loading` (spinner replaces label)
Icon support: `iconLeft`, `iconRight`, `iconOnly` (square)

Built on shadcn/ui `Button`. Loading state shows a spinner and preserves width (no layout shift).

### `Input`

Types: `text` (default), `email`, `tel`, `number`, `password`, `search`, `url`
Props: `label` (required), `helper`, `error`, `prefix`, `suffix`, `required`, `disabled`
States: `default`, `focus`, `error`, `success`, `disabled`
Built on shadcn/ui `Input`; wrapped with label/helper/error stack.

### `Textarea`
Same prop shape as `Input`. Auto-grow optional.

### `Select`
Single-select dropdown. Built on shadcn/ui `Select` (Radix-based — keyboard-accessible).

### `Combobox`
Searchable single-select. Used for: device model search, ZIP autocomplete, shop search. Built on shadcn/ui `Command`.

### `MultiSelect`
Multi-tag select with chip display. Used for: shop capabilities, B2B user roles (rare).

### `Checkbox`, `Radio`, `Toggle`
Standard. shadcn/ui base. Radio used heavily in step 9 consent.

### `Slider`
Used for: pricing tier % preview in admin, capacity sliders.

### `Badge`

| Variant | Use |
|---|---|
| `status-quote` | "Quote" pending payment |
| `status-booked` | Order booked (slate) |
| `status-accepted` | Shop accepted (info-blue) |
| `status-in-progress` | Repair underway (amber) |
| `status-ready` | Ready for pickup (teal) |
| `status-complete` | Done (success-green) |
| `status-cancelled` | Cancelled (muted gray) |
| `status-disputed` | Disputed (danger-red) |
| `tier-standard` | B2B pricing tier indicator |
| `tier-premium` | … |
| `new` | "New" indicator |
| `b2b` | "Billed to account" pill |

Sizes: `sm`, `md`. Always uses semantic status colors from `06`.

### `Avatar`
User/shop avatar with initials fallback. Sizes: `sm`, `md`, `lg`, `xl`.

### `Tag` / `Chip`
Removable tags (for filters, multi-select display). Lighter weight than Badge.

### `Tooltip`
Hover/focus tooltip. Built on shadcn/ui `Tooltip`. Required for icon-only buttons.

### `Spinner`
Loading indicator. Sizes `sm`, `md`, `lg`. Used sparingly — prefer `Skeleton`.

### `Skeleton`
Shape-mimicking loading placeholder. Default for: shop list loading, slot grid loading, dashboard widget loading.

### `IconSet`
- Base: `lucide-react` (consistent stroke weight)
- Custom set for repair categories (line-art, navy stroke, matching weight to lucide):
  - `icon-screen`, `icon-battery`, `icon-port`, `icon-water`, `icon-back-glass`, `icon-camera`, `icon-speaker`, `icon-mic`, `icon-software`, `icon-diagnostic`
- All icons accept `size`, `strokeWidth`, `className`

### `Link`
Internal: Next.js `Link` wrapper with consistent styling. External: opens new tab with `rel="noopener noreferrer"` + arrow icon.

### `Divider`
Horizontal or vertical. Subtle navy-tint hairline.

---

## Molecules

### `FormField`
Label + Input (or any form atom) + helper text + error message + ARIA wiring. The atomic unit of every form. Used everywhere from contact form to admin CRUD.

### `FieldGroup`
Side-by-side form fields with consistent gap (e.g., First name + Last name, City + State + ZIP).

### `SearchBar`
Input with search icon prefix + clear button. Debounced input for autocomplete contexts.

### `Stepper`
Booking funnel progress indicator. Three viewport variants (full specs in `06`):
- `mobile-compact` (<640px) — "Step 3 of 12: Choose your model" + thin progress bar
- `tablet-portrait` (640-1024px) — 12 condensed dots, labels hidden, current step's label shown above
- `desktop-horizontal` (≥1024px) — 12 steps with labels visible below each dot

States per step: `completed` (check), `current` (filled), `upcoming` (outline). Completed steps are clickable (back-nav); upcoming are not.

### `Card`
Container with consistent padding, radius, border, optional shadow. Variants:
- `default` — flat with subtle border
- `elevated` — with shadow, used for floating elements
- `interactive` — hover lift (used for shop selection, service cards)
- `outlined` — emphasized border (used for selected state)

### `ServiceCard`
Used on `/services` and homepage. Image + title + short description + price-from + CTA.

### `ShopCard`
Used in booking step 7 and `/locations/[city]`. Photo + name + address + distance + hours summary + soonest slot + "Select" CTA.

### `DeviceCard`
Used in booking step 3. Image + name + year + "Select" CTA. Popular models get a "Popular" tag.

### `VerticalCard`
Used on `/b2b` to surface verticals. Icon + title + 1-line description + "Learn more →".

### `DashboardTile`
KPI tile for shop/B2B/admin dashboards. Big number + label + trend indicator (vs. prior period) + optional sparkline.

### `Pagination`
Numbered + prev/next. Used on order lists, admin tables.

### `EmptyState`
Illustrated empty state with title + description + optional CTA. Used everywhere a list might be empty (no orders yet, no shops in area, no warranty claims).

### `Alert`
Inline alert variants: `info`, `success`, `warning`, `danger`. Dismissible optional.

### `Toast`
Transient notification. Bottom-right on desktop, bottom on mobile. Built on shadcn/ui `Toast` (sonner).

### `Dialog` / `Modal`
Modal dialog. Built on shadcn/ui `Dialog` (Radix). Used for: confirmation prompts, edit forms in admin, image lightboxes.

### `Sheet`
Side drawer (right on desktop, bottom on mobile). Used for: filter panels on admin tables, mobile menus, quick-view details.

### `Popover`
Built on shadcn/ui `Popover`. Used for: date pickers, color pickers (admin), small contextual menus.

### `FileUpload`
Drag-drop + click-to-upload. Variants:
- `single` — one file (e.g., contract PDF, shop photo)
- `multiple` — multiple files (e.g., warranty claim photos)
- `csv-validated` — CSV with type-checking preview (used in `CsvBulkSubmitter`)

### `DatePicker`, `TimePicker`, `DateRangePicker`
Built on shadcn/ui `Calendar` (react-day-picker). Used in admin filters, shop availability config.

### `AddressAutocomplete`
Wraps Google Places Autocomplete. Returns structured address. Used in: booking step 6 (on-site), B2B settings, admin shop edit.

### `PhoneInput`
Masked input for 10-digit US phone. Built atop standard input with mask library.

### `PriceDisplay`
Formats integer cents to "$1,234.56" with optional emphasis on dollars vs. cents. Variants: `default`, `large` (for quote summary), `compact` (for cards).

### `CurrencyInput`
Numeric input that displays/edits as currency. Stores integer cents in state.

---

## Organisms

### `TopNav`
5 variants (public, customer, shop, B2B, admin per `02`). Sticky on scroll for marketing pages. Responsive: collapses to hamburger on mobile.

### `Footer`
3-column footer for public + customer pages. Slim variant for funnel pages (no distracting links during conversion).

### `Hero`
Variants:
- `home` — full-bleed image, large display headline, primary + secondary CTAs
- `b2b-vertical` — vertical-specific imagery, headline + sub, dual CTAs (Book + Sales)
- `category` — smaller hero for service/device pages

### `TrustStrip`
Horizontal row of trust signals: BBB badge, "X reviews / Y stars", "Backed by warranty", partner-shop count. Used on home + key marketing pages.

### `Testimonial`
Quote + photo + name + role + (optional) city + (optional) device. Variants: single (large card), 3-column row, marquee (subtle horizontal scroll).

### `HowItWorksSteps`
3-4 step horizontal block (icon + step number + title + description). Used on home, `/how-it-works`, B2B verticals.

### `ServiceGrid`
Grid of `ServiceCard`s. Used on `/services`, B2B vertical pages.

### `DevicePicker`
Three-screen sequential picker (type → brand → model). Used standalone on `/devices` and as steps 1-3 of the booking funnel.

### `RepairCategoryPicker`
Icon-led list of repair categories with descriptions. Used as step 4 and on category landing pages.

### `ShopSelector`
Map (left) + ShopCard list (right) + slot grid (revealed on selection). The most complex organism in the booking funnel.

### `TimeSlotGrid`
7-day × half-day grid (or hourly). Used in shop selector and in `/shop/availability` (admin-side for shops to manage their availability).

### `AddressEntry`
ZIP or full-address entry with coverage validation. Includes map preview.

### `QuoteSummaryCard`
Step 10's main UI: line-item breakdown, subtotal, tax, total, add-on toggles inline.

### `OrderTimeline`
Vertical status timeline showing every `OrderEvent` for an order. Customer-facing variant (friendly labels) and admin variant (full event detail).

### `WarrantyCard`
Shows warranty status (expires in X days, expired, claim in progress). Used on order detail, warranty page.

### `JobsTable`
Shop dashboard table — incoming/in-progress/ready/complete tabs, accept/decline actions inline.

### `OrdersTable`
Admin + B2B order list with filters, sorting, search.

### `PayoutChart`
Shop payout history with line/bar chart (Recharts). Filter by period.

### `InvoiceList`, `InvoiceDetail`
B2B invoice surfaces. PDF download CTA on detail.

### `ContractList`
Admin contract repository. Filters: business, status, expiry.

### `UserManagementTable`
B2B and admin user-management surface. Add/remove/role-change.

### `CsvBulkSubmitter`
B2B `/b2b/submit/bulk`. Multi-stage organism: upload → parse → validate → preview rows (with row-level errors highlighted) → confirm → submit.

### `CoverageMap`
Static map showing service area with city pins. Used on `/locations`, B2B verticals, homepage.

### `WebhookReplayPanel`
Admin-only UI for `FailedWebhook` queue. Lists pending entries with payload preview + "Replay" button.

### `ConsentForm`
Booking step 9. Acknowledgment checkbox + wipe-scope radio group + policy link. Submits to create `DeviceIntakeConsent`.

### `DiagnosticIntakeForm`
Off-funnel form for "Other" device or "Not sure" repair. Free-text description + photo upload.

### `WaitlistForm`
Email-capture form shown when ZIP is out of coverage. Records `WaitlistSignup`.

---

## Templates / Layouts

### `MarketingLayout`
TopNav (public/customer variant) + main + Footer. Used for all `/`, `/services/*`, `/devices/*`, `/locations/*`, `/about`, `/how-it-works`, `/trust`, `/warranty`, `/b2b` (public), `/legal/*`.

### `FunnelLayout`
Minimal chrome: logo top-left, Stepper top, exit-confirmation guard, slim footer. No top-nav distractions. Used for `/book/*`.

### `AuthedAppLayout`
Sidebar (left, collapsible) + main area. Used for `/account/*`, `/b2b/dashboard/*`, `/shop/*`, `/admin/*`. Sidebar contents vary by role.

### `DashboardLayout`
Specialization of AuthedAppLayout with KPI tile grid + content area. Used for `/shop/dashboard`, `/b2b/dashboard`, `/admin/dashboard`.

### `LegalPageLayout`
Narrow content column (max-width 720px), tight typography for legalese, jump-to-section navigation. Used for `/legal/*`.

---

## Page-specific / one-off (not reusable)

### `BookingFunnelStep`
Generic step wrapper used by every `/book/*` step. Receives `currentStep`, `sessionState`, renders Stepper + step-specific content + back/continue buttons.

### `WarrantyClaimWizard`
Multi-step claim submission flow (`/account/warranty-claims/new`).

### `BulkSubmitPreviewTable`
Inside `CsvBulkSubmitter` — preview of parsed CSV rows with inline error states.

### `ShopOnboardingWizard`
`/shop/onboarding` — multi-step form: shop info → photos → capabilities → Stripe Connect onboarding handoff.

### `OrderDetail` (multiple variants)
Customer-facing (`/account/orders/[id]`), shop-facing (`/shop/jobs/[id]`), admin-facing (`/admin/orders/[id]`). Share the `OrderTimeline` organism but expose different actions per role.

---

## Responsive behavior — global rules

- All organisms designed mobile-first; desktop adds horizontal layout
- Touch targets ≥44×44 px (Apple HIG floor)
- Tables on mobile: stack to cards (especially `OrdersTable`, `JobsTable`)
- Forms on mobile: full-width inputs, single column
- Modals on mobile: full-screen Sheet (slides up); on desktop: centered Dialog
- Tooltips on mobile: tap-to-show (no hover); long-press shows tooltip then triggers action

## Dark mode

**Not in MVP.** All components ship light-mode-only. Design tokens (`06`) are structured to enable a dark theme later, but no dark variant of any component is built. Avoid hard-coded dark mode hooks until v1.x.
