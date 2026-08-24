# Card Reference Visual Inventory

Scope: visual reference inventory for Card and card-like surfaces. This is analysis only; no implementation changes.

Reference root: `/Users/r1c0/Desktop/Design system multiplataforma desde cero/`

## Foundation Signals From Reference

| Foundation | Reference value | Card impact |
| --- | --- | --- |
| Radius | `--radius-lg: 20px` | Base Card, StatTile, CardMedia, PaymentCard all use a 20px card radius. Inputs/selects use 16px, so Card radius must not collapse into field radius. |
| Inner radius | smaller than outer radius | Media image, nested table, and internal panels need smaller radius than the card frame. |
| Padding | `--pad-card: 24px`; dashboard KPI uses 20px; mini metrics use 14px; compact card demo uses 10px | Card needs governed density/composition spacing, not arbitrary per-demo padding. |
| Shadow rest | `--shadow-rest` | Default Card and StatTile use a subtle rest shadow. |
| Shadow hover | `--shadow-float` | Interactive Card and CardMedia visibly lift and float on hover. |
| Motion | `--lift-hover: translateY(-3px)` and spring easing | Interactive cards need the same touch/hover language as other action surfaces, with reduced-motion support. |
| Typography | `--type-title-sm: 600 16px/1.4`; `--type-overline: 600 11px/1.3`; `--type-data-lg: 600 26px/1.15 mono` | Card titles, labels, numerals, and data values must not drift independently. |
| Icon scale | 18px in StatTile, 20px compact card, 24px interactive vehicle card, proportional in PaymentCard | Icon size must follow the artifact anatomy/density, not one global Card icon size. |

## Visual Patterns Observed

### Base Card

- Surface: `var(--surface-card)`.
- Border: `1px solid var(--border-subtle)`.
- Radius: `var(--radius-lg)` / 20px.
- Padding: default `var(--pad-card)` / 24px.
- Shadow: `var(--shadow-rest)`.
- Typography is supplied by children in the reference, which means Card is visually a container first.

### Interactive Card

- Root becomes a native `button` in the reference when interactive.
- Full-width button reset: block, 100% width, text-align left, body font.
- Hover: `shadow-float` plus `lift-hover`.
- Focus: focus ring plus rest/float shadow.
- Selected: stronger focus border; must not be color-only per contract.

### Media Card

- Same outer Card frame: 20px radius, rest/float elevation, overflow hidden.
- Image frame: 200px fixed height in reference demo, cover fit, center crop.
- Content padding: 24px.
- Title: 16px / 700.
- Description: 13px, muted/secondary, line-height 1.5, 8px gap below title.
- Ownership question: generic enough to be Card composition, but only if Card can represent media anatomy without demo-only HTML.

### Compact Card

- Used for dense list rows.
- Padding in reference demo: 10px.
- Anatomy: icon 20px, label 13.5px / 600, optional Badge, 8-10px internal gaps.
- This is a density/composition question, not a new component by itself.

### KPI / Stat Tile

- Repeated in all dashboard pages as the primary metric tile.
- Surface: same Card surface/radius/rest shadow.
- Padding: 18px in `StatTile`; fleet dashboard uses 20px for row KPIs and 14px for mini metrics.
- Overline: 11px / 600 uppercase with overline tracking.
- Value: mono 24-26px / 600.
- Delta: 12px / 600, trend icon 14px.
- Icon: 18px, colored by tone.
- Conceptual owner should be the `KpiCard` pattern, not `Card composition="stats"`; `KpiTile` may implement the metric visual and Card stats remains compatibility only.

### Chart Card / Chart Panel

- Dashboard pages consistently use Card as a chart panel shell: title/caption first, chart body below, sometimes header actions.
- Fleet dashboard uses a header row with title and `Menu`/`IconButton` action.
- Chart bodies vary: Bars, Donut, FlowChart, ScatterPlot, SmallMultiples, Treemap, ParetoChart, BulletChart.
- Conceptual owner should be the `Chart Wrapper` pattern; `ChartPanel` may implement the chart visual if it can provide the full panel anatomy: title, caption, action slot, loading, empty, dark mode, density, and governed spacing.
- Card should not own chart-specific layout.

### Table Shell Card

- Reference uses `Card padding={0}` with a Table inside.
- Table overrides in the reference remove table border/shadow when nested in Card.
- Owner is a composition recipe: Card shell + Table visual contract.
- This is not a Card variant.

### Empty And Skeleton Cards

- Empty state card: `Card padding={0}` wrapping `EmptyState`.
- Skeleton card: Card wrapping title skeleton and card skeleton content.
- Owner is composition recipe, while `EmptyState` and `Skeleton` own their internal visuals.

### Header Actions Card

- Repeated dashboard requirement: title/caption/content plus right-side Menu/IconButton.
- This should be a Card composition only when actions operate on one object; dashboard/chart/metric headers belong to their pattern owners.
- It must use Flow actions, not local controls.

### Payment Card

- Domain card, not base Card.
- Ratio: width / height = 1.586.
- Radius: 20px.
- Variants: `ink`, `accent`, `sand`.
- Padding: proportional to width.
- Visual details: logo, contactless symbol, chip placeholder, last4, holder, expires, frozen overlay.
- Conceptual owner should be a payment/fleet card pattern; `CardSummary` may implement the visual only if it matches this contract.

## Gaps Exposed By The Reference

- Current Flow `Card` is not a generic visual container; it is a fixed anatomy with required `title`.
- Current Flow `Card` has legacy `composition="stats"`, but dashboards indicate KPI/stat should be owned by the `KpiCard` pattern with `KpiTile` as implementation surface.
- Current Flow Card hover shadow should use the hover/float elevation, not rest elevation.
- The reference uses children/slots heavily; without a governed slot model, demos will keep inventing local anatomy.
- Card visual parity depends on foundations and primitives: radius, spacing, type roles, elevation, icon scale, state/motion, and nested-surface rules.

## Iteration 2 Exit Notes

- Visual parity for Card cannot be evaluated by one generic card demo.
- The Card review must include base, interactive, selected, elevated, minimal, ghost, media, compact, table shell, empty/skeleton shell, KPI ownership, chart ownership, and payment/domain ownership.
- Iteration 3 must compare these visual requirements against Flow tokens/primitives before any implementation work.
