# Expandable Detail Table

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/expandable-detail-table/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/expandable-detail-table.json`

## Purpose

Coordinate virtualized table rows with selected-row detail review without creating expandable row markup, local drawers, or custom table cards.

## Use When

- A table row needs governed detail review.
- The table must keep Virtual Data Table semantics.
- A template needs row-detail behavior without owning drawer internals.

## Do Not Use Without Review

- The workflow exposes regulated, financial, legal, safety, or irreversible data.
- Rows need a tree structure rather than selected detail review.
- The detail flow deserves a specialized domain pattern.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | The labelled group, virtual table, detail drawer, and feedback remain announced through formal owners. |
| Depth | Surface owns structural grouping and focus-within behavior without a Card wrapper. |
| Energy | Expanded, detail-open, loading, empty, error, and disabled states cascade into child boundaries. |
| Frame | Table density and responsive detail placement remain token-driven. |
| Growth | Row-detail behavior becomes reusable for templates without moving behavior into templates. |
| Iconography | Table, detail, and feedback symbols remain owned by child patterns. |
| Momentum | Loading, drawer, and feedback motion remain delegated to child owners. |
| State | Pattern state maps to table, detail, and feedback boundaries. |
| Symbol | Expanded, selected, and recovery symbols remain semantic through Badge and child patterns. |
| Tone | Neutral, selected, danger, and disabled tones remain contract-bound. |
| Voice | Summaries, table labels, detail actions, and recovery copy stay explicit. |

## Formal Purpose

Coordinate virtualized table rows with selected-row detail review without creating expandable row markup, local drawers, or custom table cards.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `tablets + laptops`, `desktops + TV` |

## Formal States

- `default`
- `expanded`
- `detail-open`
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

- `Drawer Adapter`
- `Status Feedback View`
- `Virtual Data Table`

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
| `expandableDetailTableSurface` | `primitive` | `Surface` |
| `detailTableSummary` | `component` | `Badge` |
| `detailTableMetric` | `component` | `Badge` |
| `tableBoundary` | `pattern` | `Virtual Data Table` |
| `detailBoundary` | `pattern` | `Drawer Adapter` |
| `feedbackBoundary` | `pattern` | `Status Feedback View` |

## Formal Governance

### Entry Conditions

- A table row needs governed detail review.
- The table must preserve Virtual Data Table semantics.
- The detail surface should behave responsively without local drawer code.

### Decision Tree

- Use Virtual Data Table when rows only need selection, sort, or pagination.
- Use Drawer Adapter when a standalone detail panel is needed.
- Use Expandable Detail Table when selected rows and governed detail must operate as one workflow.

### Failure Modes

- Expandable rows are implemented with custom div/card markup.
- Rows bypass Virtual Data Table or Table semantics.
- Detail bypasses Drawer Adapter.
- Recovery feedback bypasses Status Feedback View.

### Success Metrics

- Users can select, sort, page, inspect detail, and recover through Flow-owned boundaries.
- Density and state cascade from Surface into table, detail, and feedback.
- Templates can reuse row-detail behavior without redefining table or drawer internals.

### Accessibility

- Expose the table-detail workflow as a labelled group with busy state.
- Delegate table semantics, selection, sort, pagination, loading, empty, and error states to Virtual Data Table.
- Delegate detail semantics to Drawer Adapter.
- Delegate recovery feedback semantics to Status Feedback View.

### Tests

- Composes Surface, Badge, Virtual Data Table, Drawer Adapter, and Status Feedback View.
- Covers default, expanded, detail-open, loading, empty, error, and disabled states.
- Forwards table, detail, and feedback callbacks.
- Rejects raw expandable rows, local drawers, card wrappers, docs-only demos, and injected markup.

### Agent Instructions

- Do not create local expandable row markup.
- Do not wrap detail groups in Card.
- Use Surface for structural grouping and Drawer Adapter for detail review.
- Ask before using this pattern for regulated, financial, legal, safety, or irreversible operations.

### Reject If

- Rows bypass Virtual Data Table.
- Detail bypasses Drawer Adapter.
- Feedback bypasses Status Feedback View.
- Card wraps the table-detail group.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| expandableDetailTableSurface | Surface | required | Structural table-detail group. |
| detailTableSummary | Badge | conditional | Table-detail purpose or state summary. |
| detailTableMetric | Badge | conditional | Selected, expanded, or detail metrics. |
| tableBoundary | Virtual Data Table | required | Rows, selection, sort, pagination, virtualization, loading, empty, and error states. |
| detailBoundary | Drawer Adapter | conditional | Selected-row detail review, responsive drawer behavior, and actions. |
| feedbackBoundary | Status Feedback View | conditional | Table-detail recovery, toast, inline, notification, or snackbar feedback. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| expandableDetailTableSurface | Surface | required | Structural table-detail group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Virtual table | Required | Virtual Data Table owns table semantics, rows, selection, sort, and pagination. |
| Expanded row | State | Expanded row key cascades selected state into the table. |
| Detail review | Conditional | Drawer Adapter owns detail review and actions. |
| Feedback recovery | Conditional | Status Feedback View owns error and action recovery. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Loading | Surface marks busy while Virtual Data Table owns loading render. |
| Detail open | Drawer Adapter owns drawer/dialog motion. |
| Feedback | Status Feedback View owns recovery motion. |

## Accessibility

- Expose the pattern as a labelled group.
- Delegate table semantics to Virtual Data Table and Table.
- Delegate detail panel semantics to Drawer Adapter.
- Delegate recovery and feedback semantics to Status Feedback View.

## Implementation Checklist

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through table, detail, and feedback.
- Callbacks preserve event context across table rows, detail actions, and feedback.
- No Card wrapper, raw expandable row, custom drawer, local feedback shell, or docs-only shell is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through table, detail, and feedback.
- Callbacks preserve event context across table rows, detail actions, and feedback.
- No Card wrapper, raw expandable row, custom drawer, local feedback shell, or docs-only shell is emitted.

Reject if:

## MIEL

Agents can decide:

- Use Expandable Detail Table for reusable row-detail workflows.
- Open Drawer Adapter for selected-row detail review.
- Use Status Feedback View for row-detail recovery.

Agents must ask:

- Before exposing regulated, financial, legal, safety, or irreversible data.
- Before replacing the detail drawer with custom row markup.
- Before bypassing Virtual Data Table semantics.
