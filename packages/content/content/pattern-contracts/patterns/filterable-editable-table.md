# Filterable Editable Table

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/filterable-editable-table/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/filterable-editable-table.json`

## Purpose

Coordinate advanced filters, virtualized table rows, selected-row editing, and recovery feedback without creating a parallel filter shell, table, or inline editor.

## Use When

- A dataset needs advanced filtering and stable table semantics.
- Selected rows need governed edit review or save actions.
- A template needs editable table behavior without owning table internals.

## Do Not Use Without Review

- The workflow edits regulated, financial, legal, safety, or irreversible data.
- Rows need custom card layouts instead of table semantics.
- Editing must happen through specialized domain forms that deserve their own pattern.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | The labelled group, filters, virtual table, editor drawer, and feedback remain announced through formal owners. |
| Depth | Surface owns structural grouping and focus-within behavior without a Card wrapper. |
| Energy | Filters-open, filtered, selected, editing, loading, empty, error, and disabled states cascade into child boundaries. |
| Frame | Table density, filter layout, and edit drawer placement remain token-driven. |
| Growth | Editable table behavior becomes reusable for templates without moving behavior into templates. |
| Iconography | Filter, table, editor, and feedback symbols remain owned by their child patterns. |
| Momentum | Loading, drawer, feedback, and table transition behavior remain delegated to child owners. |
| State | Pattern state maps to filters, table, editor, and feedback boundaries. |
| Symbol | Selected, filtered, editing, and recovery symbols remain semantic through Badge and child patterns; text remains required as the visible fallback for meaning. |
| Tone | Neutral, selected, warning, danger, and disabled tones remain contract-bound. |
| Voice | Metrics, filters, table labels, editor actions, and recovery copy stay explicit. |

## Formal Purpose

Coordinate advanced filters, virtualized table rows, selected-row editing, and recovery feedback without creating a parallel filter shell, table, or inline editor.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `tablets + laptops`, `desktops + TV` |

## Formal States

- `default`
- `filters-open`
- `filtered`
- `selected`
- `editing`
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

- `Advanced Filters`
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
| `filterableEditableTableSurface` | `primitive` | `Surface` |
| `tableSummary` | `component` | `Badge` |
| `tableMetric` | `component` | `Badge` |
| `filtersBoundary` | `pattern` | `Advanced Filters` |
| `tableBoundary` | `pattern` | `Virtual Data Table` |
| `editorBoundary` | `pattern` | `Drawer Adapter` |
| `feedbackBoundary` | `pattern` | `Status Feedback View` |

## Formal Governance

### Entry Conditions

- A dataset needs advanced filters and virtual table semantics.
- Selected rows need governed edit actions without inline custom controls.
- A template needs one reusable editable table workflow rather than composing a local table stack.

### Decision Tree

- Use Virtual Data Table when rows only need scan, select, sort, and page behavior.
- Use Advanced Filters when a screen only needs filter construction.
- Use Filterable Editable Table when filtering, row selection, edit review, and feedback need to operate as one workflow.

### Failure Modes

- Filters bypass Advanced Filters.
- Rows bypass Virtual Data Table or Table semantics.
- Editing is implemented as raw inputs inside table cells.
- Edit review uses a local drawer, modal, or card stack.
- Recovery feedback bypasses Status Feedback View.

### Success Metrics

- Users can filter, sort, select, page, edit, and recover without leaving Flow-owned boundaries.
- Density and state cascade from Surface into filters, table, editor, and feedback.
- Templates can reuse editable table behavior without redefining table or editor internals.

### Accessibility

- Expose the editable table workflow as a labelled group with busy state.
- Delegate filter controls and validation to Advanced Filters.
- Delegate table semantics, selection, sort, pagination, loading, empty, and error states to Virtual Data Table.
- Delegate edit review semantics to Drawer Adapter.
- Delegate recovery feedback semantics to Status Feedback View.

### Tests

- Composes Surface, Badge, Advanced Filters, Virtual Data Table, Drawer Adapter, and Status Feedback View.
- Covers default, filters-open, filtered, selected, editing, loading, empty, error, and disabled states.
- Forwards filter, table, editor, and feedback callbacks.
- Rejects raw editable rows, custom filter shells, local drawers, card wrappers, docs-only demos, and injected markup.

### Agent Instructions

- Do not create a local table implementation.
- Do not place raw editable controls inside rows.
- Use Drawer Adapter for edit review and action confirmation.
- Use Surface for structural grouping; do not wrap this pattern in Card.
- Ask before using this pattern for regulated, financial, legal, safety, or irreversible operations.

### Reject If

- Filters bypass Advanced Filters.
- Rows bypass Virtual Data Table.
- Edit actions bypass Drawer Adapter.
- Feedback bypasses Status Feedback View.
- Card wraps the editable table group.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| filterableEditableTableSurface | Surface | required | Structural editable table group. |
| tableSummary | Badge | conditional | Editable table purpose or state summary. |
| tableMetric | Badge | conditional | Filtered, selected, pending, or edited row metrics. |
| filtersBoundary | Advanced Filters | conditional | Advanced filtering, saved views, drawer, apply, reset, validation, and feedback. |
| tableBoundary | Virtual Data Table | required | Rows, selection, sort, pagination, virtualization, loading, empty, and error states. |
| editorBoundary | Drawer Adapter | conditional | Selected-row edit review, save/cancel actions, and responsive drawer behavior. |
| feedbackBoundary | Status Feedback View | conditional | Editable table recovery, toast, inline, notification, or snackbar feedback. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| filterableEditableTableSurface | Surface | required | Structural editable table group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Filtered rows | Conditional | Advanced Filters owns filter fields, saved views, apply, reset, and validation. |
| Virtualized editable table | Required | Virtual Data Table owns table semantics, rows, selection, sort, and pagination. |
| Selected row | State | Selected row key cascades selected state into the table. |
| Editing row | Conditional | Drawer Adapter owns edit review and actions instead of raw inline cell controls. |
| Feedback recovery | Conditional | Status Feedback View owns save/error recovery. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Loading | Surface marks busy while Virtual Data Table owns loading render. |
| Filters open | Advanced Filters owns filter drawer interactions. |
| Editing open | Drawer Adapter owns drawer/dialog motion. |
| Feedback | Status Feedback View owns recovery motion. |

## Accessibility

- Expose the pattern as a labelled group.
- Delegate filter semantics to Advanced Filters.
- Delegate table semantics to Virtual Data Table and Table.
- Delegate edit panel semantics to Drawer Adapter.
- Delegate recovery and feedback semantics to Status Feedback View.

## Implementation Checklist

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through filters, table, editor, and feedback.
- Callbacks preserve event context across filters, table rows, editor actions, and feedback.
- No Card wrapper, raw editable table, custom filter shell, custom drawer, local feedback shell, inline edit DOM, or docs-only shell is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through filters, table, editor, and feedback.
- Callbacks preserve event context across filters, table rows, editor actions, and feedback.
- No Card wrapper, raw editable table, custom filter shell, custom drawer, local feedback shell, inline edit DOM, or docs-only shell is emitted.

Reject if:

## MIEL

Agents can decide:

- Use Filterable Editable Table for reusable editable datasets.
- Add Advanced Filters when richer filter criteria or saved views matter.
- Open Drawer Adapter for selected-row edit review.

Agents must ask:

- Before editing regulated, financial, legal, safety, or irreversible data.
- Before replacing the editor drawer with inline custom controls.
- Before bypassing Virtual Data Table semantics.
