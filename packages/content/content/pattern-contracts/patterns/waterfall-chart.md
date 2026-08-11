# Waterfall Chart

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/waterfall-chart/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/waterfall-chart.json`

## Purpose

Coordinate step-based contribution charts with deltas, cumulative totals, selected-step review, and accessible data fallback without creating a second chart or table implementation.

## Use When

- A workflow needs to explain positive, negative, neutral, and total contribution steps.
- A template needs contribution analysis without owning chart internals.
- The same chart data must be inspectable through a table/list fallback.

## Do Not Use Without Review

- The analysis represents regulated, financial, legal, safety, or irreversible decisions.
- The design requires custom chart rendering that Chart Wrapper cannot represent.
- Increase, decrease, total, or selected-step semantics are color-only.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | The labelled group and Chart Wrapper fallback keep step data inspectable without relying on visual bars alone. |
| Depth | Surface owns structural grouping while Chart Wrapper owns chart chrome and overlays. |
| Energy | Selected, loading, empty, error, and disabled states cascade into Chart Wrapper and Badge metrics. |
| Frame | Density, chart bounds, table fallback, and step list remain token-driven. |
| Growth | Contribution behavior becomes reusable for templates without moving chart or table logic into templates. |
| Iconography | Step and status symbols remain owned by Badge, Chart Wrapper, and child components. |
| Momentum | Loading and chart state transitions remain delegated to Chart Wrapper. |
| State | Pattern state maps to Chart Wrapper, Chart Panel, Table, List, and Badge boundaries. |
| Symbol | Increase, decrease, neutral, total, and selected semantics remain explicit through labels and fallback rows. |
| Tone | Neutral, selected, warning, danger, and disabled tones remain contract-bound. |
| Voice | Chart label, descriptions, step copy, and fallback rows stay explicit. |

## Formal Purpose

Coordinate step-based contribution charts with deltas, cumulative totals, selected-step review, and accessible data fallback without creating a second chart or table implementation.

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
| `waterfallChartSurface` | `primitive` | `Surface` |
| `waterfallSummary` | `component` | `Badge` |
| `waterfallMetric` | `component` | `Badge` |
| `chartWrapperBoundary` | `pattern` | `Chart Wrapper` |
| `waterfallDataSummary` | `pattern` | `Chart Wrapper` |
| `waterfallFeedback` | `component` | `Badge` |

## Formal Governance

### Entry Conditions

- A comparison needs positive, negative, neutral, and total contribution steps.
- The visualization must preserve Chart Wrapper state handling and accessible fallback.
- Templates need contribution analysis without owning chart or table internals.

### Decision Tree

- Use Chart Wrapper for generic dashboard chart modules.
- Use Gantt Chart when duration and milestones are the primary object.
- Use Waterfall Chart when delta and cumulative contribution steps must be explained as one workflow.

### Failure Modes

- Waterfall bars are implemented with local SVG, canvas, or positioned divs.
- The pattern creates its own table instead of delegating fallback rows to Chart Wrapper and Table.
- Increase/decrease/total semantics rely only on color.
- Templates own contribution selection or chart state.

### Success Metrics

- Users can inspect each step, direction, value, cumulative total, and selected step context.
- Assistive technology users receive equivalent step rows through Flow-owned components.
- Density and state cascade from Surface into Chart Wrapper, Chart Panel, and Table.

### Accessibility

- Expose the contribution chart as a labelled group with busy state.
- Delegate visual chart semantics to Chart Wrapper and Chart Panel.
- Provide equivalent step rows through Chart Wrapper fallback slots.
- Do not rely on color alone for increase, decrease, neutral, total, or selected-step state.

### Tests

- Composes Surface, Badge, and Chart Wrapper.
- Covers default, selected, loading, empty, error, and disabled states.
- Forwards step selection and primary action callbacks.
- Rejects local chart rendering, raw tables, card wrappers, docs-only demos, and injected markup.

### Agent Instructions

- Do not render waterfall bars with local SVG, canvas, or positioned divs inside the pattern.
- Use Chart Wrapper for chart state, Chart Panel ownership, fallback Table/List, and actions.
- Use Surface for structural grouping; do not wrap the contribution chart in Card.
- Ask before using this pattern for regulated, financial, legal, safety, or irreversible analysis.

### Reject If

- The chart bypasses Chart Wrapper.
- The fallback data bypasses Chart Wrapper/Table/List.
- A Card wraps the contribution chart group.
- A template owns step selection or cumulative state directly.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| waterfallChartSurface | Surface | required | Structural contribution chart group. |
| waterfallSummary | Badge | conditional | Contribution scope or state summary. |
| waterfallMetric | Badge | conditional | Increase, decrease, total, variance, or risk metrics. |
| chartWrapperBoundary | Chart Wrapper | required | Chart state, Chart Panel ownership, status, actions, loading, empty, error, and table fallback. |
| waterfallDataSummary | Chart Wrapper | required | Inspectable contribution rows delegated through Chart Wrapper table fallback. |
| waterfallFeedback | Badge | conditional | Contribution feedback summary or recovery status. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| waterfallChartSurface | Surface | required | Structural contribution chart group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Contribution analysis | Required | Steps provide label, value, direction, cumulative value, and note. |
| Totals | Conditional | Total steps reset or expose cumulative summary. |
| Selected step | State | Selected step cascades selected/focus state into Chart Wrapper and Table. |
| Variance review | Conditional | Metrics and feedback summarize risk without replacing chart semantics. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Loading | Surface marks busy while Chart Wrapper owns loading rendering. |
| Selected step | Chart Wrapper and Table own focus/selected state without local positioned bars. |
| Fallback swap | Chart Wrapper preserves dimensions through chart, table, list, empty, and error states. |

## Accessibility

- Expose the contribution chart as a labelled group.
- Provide step data through Chart Wrapper table fallback.
- Represent increase, decrease, neutral, and total with labels, not only color.
- Do not use color as the only way to communicate contribution direction or selected-step state.

## Implementation Checklist

- Composes Surface plus Chart Wrapper boundary.
- Density and state cascade through Chart Wrapper and fallback rows.
- Forwards step selection and primary action callbacks.
- Step selection and primary actions preserve event context.
- No local SVG/canvas/positioned chart, raw table, Card wrapper, or injected markup is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus Chart Wrapper boundary.
- Density and state cascade through Chart Wrapper and fallback rows.
- Forwards step selection and primary action callbacks.
- Step selection and primary actions preserve event context.
- No local SVG/canvas/positioned chart, raw table, Card wrapper, or injected markup is emitted.

Reject if:

- A local chart renderer replaces Chart Wrapper.
- No accessible table/list fallback exists.
- A Card wraps the contribution chart group.

## MIEL

Agents can decide:

- Use Waterfall Chart for contribution and variance workflows.
- Use Chart Wrapper for the visualization and fallback boundary.
- Use Gantt Chart instead when duration and milestones are the primary object.

Agents must ask:

- Before exposing regulated, financial, legal, safety, or irreversible analysis.
- Before bypassing Chart Wrapper for custom visualization.
- Before presenting direction or total semantics without textual explanation.

Agents must reject:

- A local chart renderer replaces Chart Wrapper.
- No accessible table/list fallback exists.
- A Card wraps the contribution chart group.

Handoff language:

> Confirm data source, step semantics, increase/decrease/total rules, selected-step behavior, accessible fallback, and empty/error behavior.
