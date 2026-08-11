# Kpi Card

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/kpi-card/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/kpi-card.json`

## Purpose

Summarize one operational metric with value, delta, threshold tone, owner, and a clear path to investigation.

## Use When

- A dashboard needs a scannable metric that can lead to detail.
- The metric has a known calculation, cadence, and comparison period.
- Multiple KPIs must align in a dense desktop band.

## Do Not Use Without Review

- The number has no owner, source, or refresh cadence.
- The KPI is only decorative and does not inform a decision.
- The metric needs chart exploration instead of a compact summary.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines metric band density, tile min width, comparison placement, and responsive wrapping. |
| Voice | Owns metric label, delta copy, threshold explanation, and empty/loading language. |
| Energy | Controls neutral, success, warning, and danger emphasis without replacing the data. |
| State | Loaded, loading, empty, stale, warning, and selected states are explicit. |
| Depth | KPI groups remain flat in dashboard bands; depth appears only for drill-in overlays. |
| Accessibility | Value, label, delta, and tone are text-backed and readable without color. |

## Formal Purpose

Coordinate a metric summary with trend, status, loading, empty, error, drill-in, and comparison behavior while keeping metric visuals owned by Flow components.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `default`
- `loading`
- `empty`
- `error`
- `stale`
- `permission-blocked`
- `interactive`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
- `Energy`
- `Frame`
- `State`
- `Voice`

### Foundation Dependencies

- `Accessibility`
- `Depth`
- `Energy`
- `Frame`
- `Growth`
- `Iconography`
- `Momentum`
- `State`
- `Symbol`
- `Tone`
- `Voice`

### Primitives

- `Breakpoints`
- `Color`
- `Density`
- `Disabled`
- `Duration`
- `Elevation`
- `Focus`
- `Iconography`
- `Loading`
- `Measurement`
- `Message`
- `Motion Curves`
- `Radius`
- `Spacing`
- `Surface`
- `Typography`

### Components

- `Badge`
- `Button`
- `Empty State`
- `Error Panel`
- `KPI Tile`
- `Skeleton`
- `Tag`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.empty-state.*`
- `comp.error-panel.*`
- `comp.kpi-tile.*`
- `comp.skeleton.*`
- `comp.tag.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `metric` | `component` | `KPI Tile` |
| `status` | `component` | `Badge`, `Tag` |
| `recovery` | `component` | `Button`, `Empty State`, `Error Panel` |
| `loading` | `component` | `Skeleton` |

## Formal Governance

### Entry Conditions

- A surface needs to summarize one metric with context and optional drill-in.
- The metric can be loading, empty, delayed, permission blocked, or errored.
- Trend, status, or comparison needs consistent semantic treatment.

### Decision Tree

- Use KPI Tile for the base metric visual.
- Use KPI Card when metric context, drill-in, status, or recovery states need composition.
- Use Chart Wrapper when time-series, categorical, or multi-metric visualization is primary.

### Failure Modes

- Metric cards define custom card, badge, or trend visuals.
- Trend relies only on red or green.
- Loading, empty, and error states are missing.
- Business dashboard layout leaks into the reusable pattern.

### Success Metrics

- Users can understand the metric, status, and recovery path quickly.
- Assistive technology users receive value, unit, trend, and state context.
- Metric presentation remains reusable across dashboards without template coupling.

### Accessibility

- Expose metric value, unit, trend, and status in text.
- Do not encode trend by color alone.
- Keep drill-in actions keyboard reachable and labeled by metric context.

### Tests

- Uses KPI Tile for the metric visual.
- Covers loading, empty, error, stale, permission, and interactive states.
- Avoids template-specific dashboard layout ownership.

### Agent Instructions

- Compose from KPI Tile, Badge, Tag, Button, Skeleton, Empty State, and Error Panel.
- Keep dashboard grid, business thresholds, and reporting logic in templates or app examples.
- Ask before deriving financial, safety, or compliance status labels.

### Reject If

- A custom metric card recreates Card or KPI Tile visuals.
- Trend is color-only.
- The pattern hardcodes dashboard business layout.
- Raw colors, spacing, radius, elevation, or typography bypass tokens.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| metric | KpiTile | yes | Primary label, value, delta, tone, and optional icon. |
| context | Badge \| Tag | conditional | Cadence, owner, threshold, or stale state metadata. |
| action | Button | conditional | Drill-in or investigation action when the KPI is actionable. |
| state | Skeleton \| EmptyState \| ErrorPanel | yes | Represents loading, empty, or unavailable data. |

## Components Used

- KPI Tile
- Badge
- Tag
- Button
- Skeleton
- Empty State
- Error Panel

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Dashboard band | Required | Several KPIs align in a dense responsive row. |
| Threshold | Required state | Tone indicates risk with text-backed threshold copy. |
| Loading and stale | Required state | Skeleton or stale metadata appears without shifting layout. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Value refresh | Updated values change without decorative count-up motion. |
| Drill-in | Action feedback is immediate and keeps dashboard context. |
| Reduced motion | Any live-update emphasis is removed when reduced motion is requested. |

## Accessibility

- The metric label and value are exposed as text.
- Delta and tone are not color-only.
- Drill-in controls have explicit labels.
- Loading and stale states are announced through text.

## Implementation Checklist

- Declare `metric`: Primary label, value, delta, tone, and optional icon.
- Declare `state`: Represents loading, empty, or unavailable data.
- KPI band wraps without clipping at desktop and tablet widths.
- Risk tone has text-backed threshold copy.
- Loading state preserves tile dimensions.
- Drill-in action is keyboard reachable.

## Tests And Rejection Rules

Must test:

- KPI band wraps without clipping at desktop and tablet widths.
- Risk tone has text-backed threshold copy.
- Loading state preserves tile dimensions.
- Drill-in action is keyboard reachable.

Reject if:

- The metric has no source or owner.
- Tone is color-only.
- The tile cannot explain stale or missing data.

## MIEL

Agents can decide:

- Use KPI Card when the metric is known, owned, and action-oriented.
- Use Design System semantic tone for threshold state.
- Use Skeleton or Empty State when data is not ready.

Agents must ask:

- Metric source, calculation, cadence, threshold, or owner is unclear.
- The KPI affects financial, compliance, or regulated reporting.

Agents must reject:

- The metric has no source or owner.
- Tone is color-only.
- The tile cannot explain stale or missing data.

Handoff language:

> Confirm metric source, owner, cadence, threshold rules, drill-in destination, and loading/stale states.
