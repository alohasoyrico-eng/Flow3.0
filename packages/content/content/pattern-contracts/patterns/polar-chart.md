# Polar Chart

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/polar-chart/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/polar-chart.json`

## Purpose

Coordinate circular segment comparison with selected-segment review and accessible data fallback without creating a second chart or table implementation.

## Use When

- A workflow needs segment value, share, status, and selected-segment context.
- A template needs circular comparison without owning chart internals.
- The same chart data must be inspectable through a table/list fallback.

## Do Not Use Without Review

- The comparison represents regulated, financial, legal, safety, or irreversible decisions.
- The design requires custom chart rendering that Chart Wrapper cannot represent.
- Segment status or selected state is color-only.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | The labelled group and Chart Wrapper fallback keep segment data inspectable without relying on circular visuals alone. |
| Depth | Surface owns structural grouping while Chart Wrapper owns chart chrome and overlays. |
| Energy | Selected, loading, empty, error, and disabled states cascade into Chart Wrapper and Badge metrics. |
| Frame | Density, chart bounds, table fallback, and segment list remain token-driven. |
| Growth | Segment comparison behavior becomes reusable for templates without moving chart or table logic into templates. |
| Iconography | Segment and status symbols remain owned by Badge, Chart Wrapper, and child components. |
| Momentum | Loading and chart state transitions remain delegated to Chart Wrapper. |
| State | Pattern state maps to Chart Wrapper, Chart Panel, Table, List, and Badge boundaries. |
| Symbol | Segment, share, status, and selected semantics remain explicit through labels and fallback rows. |
| Tone | Neutral, selected, warning, danger, and disabled tones remain contract-bound. |
| Voice | Chart label, descriptions, segment copy, and fallback rows stay explicit. |

## Formal Purpose

Coordinate circular segment comparison with selected-segment review and accessible data fallback without creating a second chart or table implementation.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `tablets + laptops`, `desktops + TV` |

## Formal States

- `default`
- `selected`
- `loading`
- `empty`
- `error`
- `disabled`

## Formal Dependencies

### Foundations

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

### Patterns

- `Chart Wrapper`

### Tokens

- `comp.badge.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `polarChartSurface` | `primitive` | `Surface` |
| `polarSummary` | `component` | `Badge` |
| `polarMetric` | `component` | `Badge` |
| `chartWrapperBoundary` | `pattern` | `Chart Wrapper` |
| `polarDataSummary` | `pattern` | `Chart Wrapper` |
| `polarFeedback` | `component` | `Badge` |

## Formal Governance

### Entry Conditions

- A comparison needs segment, share, status, or selected-segment context.
- The visualization must preserve Chart Wrapper state handling and accessible fallback.
- Templates need circular comparison behavior without owning chart or table internals.

### Decision Tree

- Use Chart Wrapper for generic dashboard chart modules.
- Use Waterfall Chart when delta and cumulative contribution steps are primary.
- Use Polar Chart when circular segment comparison and selected-segment review operate as one workflow.

### Failure Modes

- Polar/radar/donut visuals are implemented with local SVG, canvas, or positioned divs.
- The pattern creates its own table instead of delegating fallback rows to Chart Wrapper and Table.
- Segment status relies only on color.
- Templates own segment selection or chart state.

### Success Metrics

- Users can inspect segment label, value, share, status, and selected segment context.
- Assistive technology users receive equivalent segment rows through Flow-owned components.
- Density and state cascade from Surface into Chart Wrapper, Chart Panel, and Table.

### Accessibility

- Expose the segment comparison as a labelled group with busy state.
- Delegate visual chart semantics to Chart Wrapper and Chart Panel.
- Provide equivalent segment rows through Chart Wrapper fallback slots.
- Do not rely on color alone for segment status or selected-segment state.

### Tests

- Composes Surface, Badge, and Chart Wrapper.
- Covers default, selected, loading, empty, error, and disabled states.
- Forwards segment selection and primary action callbacks.
- Rejects local chart rendering, raw tables, card wrappers, docs-only demos, and injected markup.

### Agent Instructions

- Do not render polar, radar, or donut visuals with local SVG, canvas, or positioned divs inside the pattern.
- Use Chart Wrapper for chart state, Chart Panel ownership, fallback Table/List, and actions.
- Use Surface for structural grouping; do not wrap the segment comparison in Card.
- Ask before using this pattern for regulated, financial, legal, safety, or irreversible analysis.

### Reject If

- The chart bypasses Chart Wrapper.
- The fallback data bypasses Chart Wrapper/Table/List.
- A Card wraps the segment comparison group.
- A template owns segment selection or share state directly.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| polarChartSurface | Surface | required | Structural segment comparison group. |
| polarSummary | Badge | conditional | Comparison scope or state summary. |
| polarMetric | Badge | conditional | Segment, share, variance, or risk metrics. |
| chartWrapperBoundary | Chart Wrapper | required | Chart state, Chart Panel ownership, status, actions, loading, empty, error, and table fallback. |
| polarDataSummary | Chart Wrapper | required | Inspectable segment rows delegated through Chart Wrapper table fallback. |
| polarFeedback | Badge | conditional | Segment feedback summary or recovery status. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| polarChartSurface | Surface | required | Structural segment comparison group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Segment comparison | Required | Segments provide label, value, share, and status. |
| Selected segment | State | Selected segment cascades selected/focus state into Chart Wrapper and Table. |
| Risk/status review | Conditional | Metrics and feedback summarize state without replacing chart semantics. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Loading | Surface marks busy while Chart Wrapper owns loading rendering. |
| Selected segment | Chart Wrapper and Table own focus/selected state without local radial rendering. |
| Fallback swap | Chart Wrapper preserves dimensions through chart, table, list, empty, and error states. |

## Accessibility

- Expose the segment comparison as a labelled group.
- Provide segment data through Chart Wrapper table fallback.
- Represent segment status and selected state with labels, not only color.
- Do not use color as the only way to communicate segment state.

## Implementation Checklist

- Composes Surface plus Chart Wrapper boundary.
- Density and state cascade through Chart Wrapper and fallback rows.
- Forwards segment selection and primary action callbacks.
- Segment selection and primary actions preserve event context.
- No local SVG/canvas/positioned chart, raw table, Card wrapper, or injected markup is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus Chart Wrapper boundary.
- Density and state cascade through Chart Wrapper and fallback rows.
- Forwards segment selection and primary action callbacks.
- Segment selection and primary actions preserve event context.
- No local SVG/canvas/positioned chart, raw table, Card wrapper, or injected markup is emitted.

Reject if:

- A local chart renderer replaces Chart Wrapper.
- No accessible table/list fallback exists.
- A Card wraps the segment comparison group.

## MIEL

Agents can decide:

- Use Polar Chart for circular segment comparison workflows.
- Use Chart Wrapper for the visualization and fallback boundary.
- Use Waterfall Chart instead when deltas and cumulative totals are the primary object.

Agents must ask:

- Before exposing regulated, financial, legal, safety, or irreversible analysis.
- Before bypassing Chart Wrapper for custom visualization.
- Before presenting segment state without textual explanation.

Agents must reject:

- A local chart renderer replaces Chart Wrapper.
- No accessible table/list fallback exists.
- A Card wraps the segment comparison group.

Handoff language:

> Confirm data source, segment semantics, share/status rules, selected-segment behavior, accessible fallback, and empty/error behavior.
