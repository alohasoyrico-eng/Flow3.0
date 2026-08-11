# Gantt Chart

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/gantt-chart/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/gantt-chart.json`

## Purpose

Coordinate task schedules, milestones, dependencies, selected-task review, and accessible data fallback without creating a second chart, table, or timeline implementation.

## Use When

- A workflow needs task duration, milestones, and dependency context.
- A planning template needs schedule state without owning chart internals.
- The same chart data must be inspectable through a table/list fallback.

## Do Not Use Without Review

- The schedule represents regulated, financial, legal, safety, or irreversible planning.
- The design requires custom chart rendering that Chart Wrapper cannot represent.
- Dependency semantics or milestone status are color-only.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | The labelled schedule group and Chart Wrapper fallback keep task data inspectable without relying on visual bars alone. |
| Depth | Surface owns structural grouping while Chart Wrapper owns chart chrome and overlays. |
| Energy | Selected, loading, empty, error, and disabled states cascade into Chart Wrapper and Badge metrics. |
| Frame | Density, chart bounds, table fallback, and milestone list remain token-driven. |
| Growth | Schedule behavior becomes reusable for templates without moving chart or table logic into templates. |
| Iconography | Milestone and status symbols remain owned by Badge, Chart Wrapper, and child components. |
| Momentum | Loading and chart state transitions remain delegated to Chart Wrapper. |
| State | Pattern state maps to Chart Wrapper, Chart Panel, Table, List, and Badge boundaries. |
| Symbol | Task, milestone, and dependency semantics remain explicit through labels and fallback rows. |
| Tone | Neutral, selected, danger, and disabled tones remain contract-bound. |
| Voice | Schedule label, descriptions, milestone copy, and fallback rows stay explicit. |

## Formal Purpose

Coordinate task schedules, milestones, dependencies, selected-task review, and accessible data fallback without creating a second chart, table, or timeline implementation.

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
| `ganttChartSurface` | `primitive` | `Surface` |
| `ganttSummary` | `component` | `Badge` |
| `ganttMetric` | `component` | `Badge` |
| `chartWrapperBoundary` | `pattern` | `Chart Wrapper` |
| `ganttDataSummary` | `pattern` | `Chart Wrapper` |
| `ganttFeedback` | `component` | `Badge` |

## Formal Governance

### Entry Conditions

- A schedule needs task duration, milestone, dependency, or selected-task context.
- The visualization must preserve Chart Wrapper state handling and accessible fallback.
- Templates need planning/schedule behavior without owning chart or table internals.

### Decision Tree

- Use Chart Wrapper for generic dashboard chart modules.
- Use Timeline when chronological events are the primary object.
- Use Gantt Chart when task duration, milestones, dependencies, and fallback rows operate as one schedule workflow.

### Failure Modes

- Gantt bars are implemented with local SVG, canvas, or positioned divs.
- The pattern creates its own table instead of delegating fallback rows to Chart Wrapper and Table.
- Milestone or dependency semantics rely only on color.
- Templates own schedule selection or chart state.

### Success Metrics

- Users can inspect task duration, milestones, dependencies, and selected task context.
- Assistive technology users receive an equivalent table/list summary through Flow-owned components.
- Density and state cascade from Surface into Chart Wrapper, Chart Panel, Table, and List.

### Accessibility

- Expose the schedule as a labelled group with busy state.
- Delegate visual chart semantics to Chart Wrapper and Chart Panel.
- Provide equivalent task rows and milestone list through Chart Wrapper fallback slots.
- Do not rely on color alone for dependency, milestone, or selected-task state.

### Tests

- Composes Surface, Badge, and Chart Wrapper.
- Covers default, selected, loading, empty, error, and disabled states.
- Forwards task selection and primary action callbacks.
- Rejects local chart rendering, raw tables, card wrappers, docs-only demos, and injected markup.

### Agent Instructions

- Do not render Gantt bars with local SVG, canvas, or positioned divs inside the pattern.
- Use Chart Wrapper for chart state, Chart Panel ownership, fallback Table/List, and actions.
- Use Surface for structural grouping; do not wrap the schedule in Card.
- Ask before using this pattern for regulated, financial, legal, safety, or irreversible planning.

### Reject If

- The chart bypasses Chart Wrapper.
- The fallback data bypasses Chart Wrapper/Table/List.
- A Card wraps the schedule group.
- A template owns task selection, milestone, or dependency state directly.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| ganttChartSurface | Surface | required | Structural schedule group. |
| ganttSummary | Badge | conditional | Schedule scope or state summary. |
| ganttMetric | Badge | conditional | Task, milestone, risk, or dependency metrics. |
| chartWrapperBoundary | Chart Wrapper | required | Chart state, Chart Panel ownership, status, actions, loading, empty, error, table fallback, and milestone list. |
| ganttDataSummary | Chart Wrapper | required | Inspectable task rows delegated through Chart Wrapper table fallback. |
| ganttFeedback | Badge | conditional | Schedule feedback summary or recovery status. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| ganttChartSurface | Surface | required | Structural schedule group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Task schedule | Required | Tasks provide label, owner, start, end, progress, and status. |
| Milestones | Conditional | Milestones are exposed as list fallback through Chart Wrapper. |
| Dependencies | Conditional | Dependency count and relationship semantics remain textual, not color-only. |
| Selected task | State | Selected task cascades selected/focus state into Chart Wrapper and Table. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Loading | Surface marks busy while Chart Wrapper owns loading rendering. |
| Selected task | Chart Wrapper and Table own focus/selected state without local positioned bars. |
| Fallback swap | Chart Wrapper preserves dimensions through chart, table, list, empty, and error states. |

## Accessibility

- Expose the schedule as a labelled group.
- Provide task data through Chart Wrapper table fallback.
- Provide milestones through Chart Wrapper list fallback.
- Do not use color as the only way to communicate task status, milestones, or dependencies.

## Implementation Checklist

- Composes Surface plus Chart Wrapper boundary.
- Density and state cascade through Chart Wrapper and fallback rows.
- Forwards task selection and primary action callbacks.
- Task selection and primary actions preserve event context.
- No local SVG/canvas/positioned chart, raw table, Card wrapper, or injected markup is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus Chart Wrapper boundary.
- Density and state cascade through Chart Wrapper and fallback rows.
- Forwards task selection and primary action callbacks.
- Task selection and primary actions preserve event context.
- No local SVG/canvas/positioned chart, raw table, Card wrapper, or injected markup is emitted.

Reject if:

- A local chart renderer replaces Chart Wrapper.
- No accessible table/list fallback exists.
- A Card wraps the schedule group.

## MIEL

Agents can decide:

- Use Gantt Chart for task-duration schedule workflows.
- Use Chart Wrapper for the visualization and fallback boundary.
- Use Timeline instead when events, not task duration, are the primary object.

Agents must ask:

- Before exposing regulated, financial, legal, safety, or irreversible planning.
- Before bypassing Chart Wrapper for custom visualization.
- Before presenting dependencies without textual explanation.

Agents must reject:

- A local chart renderer replaces Chart Wrapper.
- No accessible table/list fallback exists.
- A Card wraps the schedule group.

Handoff language:

> Confirm task source, date range, milestone semantics, dependency semantics, selected-task behavior, accessible fallback, and empty/error behavior.
