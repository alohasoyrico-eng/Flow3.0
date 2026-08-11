# Chart Wrapper

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/chart-wrapper/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/chart-wrapper.json`

## Purpose

Standardize chart title, summary value, legend, tooltip copy, empty states, export, and accessible data summary around a chart component.

## Use When

- Dashboard charts need consistent heading, metadata, and state handling.
- Users need to compare trends without losing source or filter context.
- A chart requires accessible summary and non-visual fallback.

## Do Not Use Without Review

- The chart type, source, or comparison period is unclear.
- The chart needs exploratory analytics beyond dashboard summary.
- Legend interaction changes regulated or financial interpretation.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines chart container height, header density, legend placement, and responsive stacking. |
| Voice | Owns chart title, summary, caption, tooltip labels, and empty copy. |
| Energy | Controls series emphasis, selected state, and semantic status without overriding Design System color tokens. |
| State | Loaded, loading, empty, filtered-empty, error, and stale states are explicit. |
| Depth | Tooltips and export menus float above the chart without turning the chart into a nested card. |
| Accessibility | Charts expose text summary, table fallback, and keyboard reachable controls. |

## Formal Purpose

Coordinate chart presentation with title, metric context, legend, loading, empty, error, table fallback, and drill-in actions while chart rendering remains component-owned.

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
- `filtered`
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
- `Charts`
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
- `Chart Panel`
- `Empty State`
- `Error Panel`
- `KPI Tile`
- `List`
- `Menu`
- `Skeleton`
- `Table`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.chart-panel.*`
- `comp.empty-state.*`
- `comp.error-panel.*`
- `comp.kpi-tile.*`
- `comp.list.*`
- `comp.menu.*`
- `comp.skeleton.*`
- `comp.table.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `chart` | `component` | `Chart Panel` |
| `summary` | `component` | `KPI Tile`, `Badge`, `Menu`, `Button` |
| `fallback` | `component` | `Table`, `List`, `Skeleton`, `Empty State`, `Error Panel` |

## Formal Governance

### Entry Conditions

- A data visualization needs title, status, fallback, or drill-in behavior.
- The chart can be loading, empty, errored, filtered, or permission constrained.
- Users may need table or list access to the same data.

### Decision Tree

- Use Chart Panel for base chart rendering.
- Use Chart Wrapper when chart context, actions, and fallbacks are part of the reusable composition.
- Use KPI Card when a single metric is the primary content.

### Failure Modes

- Chart chrome is custom card markup.
- Legend or status relies only on color.
- No table/list fallback exists for inspectable data.
- Loading and error states are visual-only.

### Success Metrics

- Users can read chart title, data scope, status, and fallback.
- Assistive technology users can access equivalent tabular/list data.
- Chart composition stays reusable across templates.

### Accessibility

- Expose chart title, scope, and data summary in text.
- Provide table or list fallback for inspectable data.
- Do not use color as the only series or status distinction.

### Tests

- Composes Chart Panel, KPI Tile, Table/List fallback, Button, Menu, Skeleton, Empty State, and Error Panel.
- Covers loading, empty, error, filtered, permission, and interactive states.
- Does not own business chart thresholds or dashboard layout.

### Agent Instructions

- Keep data queries, business thresholds, and chart library internals outside the pattern.
- Use Flow components for chart chrome, actions, and fallbacks.
- Ask before visualizing regulated, financial, safety, or identity-sensitive data.

### Reject If

- A custom chart card replaces Chart Panel.
- Equivalent data fallback is impossible.
- Series/status semantics are color-only.
- Template dashboard layout leaks into the pattern.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| chart | ChartPanel | yes | Primary visual chart with title, value, caption, and data points. |
| summary | KpiTile \| Badge | conditional | Optional metric summary or threshold metadata. |
| controls | Button \| Menu | conditional | Export, compare, or series visibility controls. |
| state | Skeleton \| EmptyState \| ErrorPanel | yes | Represents loading, empty, and error conditions. |
| dataSummary | Table \| List | yes | Accessible non-visual summary of chart values. |

## Components Used

- Chart Panel
- KPI Tile
- Badge
- Button
- Menu
- Skeleton
- Empty State
- Error Panel
- Table
- List

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Trend chart | Required | Header, chart, caption, and summary data align in a dashboard module. |
| Empty after filter | Required state | Empty State explains the filter and recovery. |
| Exportable | Candidate | Export uses Button/Menu and preserves filter context. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Data refresh | Bars or values update without jumpy layout or decorative animation. |
| Tooltip/menu reveal | Uses Design System overlay motion and reduced-motion fallback. |
| State swap | Loading, empty, and chart content preserve module dimensions. |

## Accessibility

- Chart has an accessible title and summary.
- Data is available as text through List or Table.
- Controls are keyboard reachable.
- Color is not the only way to distinguish series or state.

## Implementation Checklist

- Declare `chart`: Primary visual chart with title, value, caption, and data points.
- Declare `state`: Represents loading, empty, and error conditions.
- Declare `dataSummary`: Accessible non-visual summary of chart values.
- Chart header, controls, and plot do not overlap.
- Empty and loading states preserve layout.
- Data summary is present for screen readers.
- Export or menu action uses Design System controls.

## Tests And Rejection Rules

Must test:

- Chart header, controls, and plot do not overlap.
- Empty and loading states preserve layout.
- Data summary is present for screen readers.
- Export or menu action uses Design System controls.

Reject if:

- No accessible summary exists.
- The chart changes Design System colors directly.
- Loading or empty state causes layout shift.

## MIEL

Agents can decide:

- Use Chart Wrapper for dashboard trend or comparison modules.
- Use Chart Panel for compact visual summaries.
- Show Empty State when filters remove all data.

Agents must ask:

- Data source, chart type, comparison period, legend behavior, or export policy is unclear.
- The chart represents financial or compliance reporting.

Agents must reject:

- No accessible summary exists.
- The chart changes Design System colors directly.
- Loading or empty state causes layout shift.

Handoff language:

> Confirm chart source, comparison period, summary metric, export rules, accessible data summary, and empty/error behavior.
