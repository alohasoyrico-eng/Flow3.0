# Virtual Data Table

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/virtual-data-table/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/virtual-data-table.json`

## Purpose

Handle large operational datasets with sorting, selection, loading, summaries, keyboard access, and table-adjacent controls without turning domain tables into components.

## Use When

- A desktop process needs dense rows, sorting, selection, or remote data.
- The table is part of a dashboard, administration, audit, or reporting surface.
- Users need to scan and act on many records without losing context.

## Do Not Use Without Review

- The dataset is small enough for List or Card.
- Column ownership, sorting, pagination, or loading behavior is unclear.
- The table owns domain lifecycle decisions that belong to another pattern.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines column density, sticky areas, row height, toolbar placement, and horizontal overflow rules. |
| Voice | Owns column labels, empty copy, selected count, sort labels, and action copy. |
| Energy | Controls selected, hover, risk, and active-sort states with semantic tokens. |
| State | Loaded, loading, empty, filtered-empty, selected, sorted, error, and permission states are explicit. |
| Depth | Bulk bars, menus, and inspectors layer above the table through Design System overlays. |
| Accessibility | Table labels, sort state, row selection, keyboard order, and summaries are required. |

## Formal Purpose

Coordinate large tabular datasets with virtualization boundaries, selection, pagination, search/toolbar handoff, loading, empty, and error recovery.

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
- `selected`
- `paginated`
- `virtualized`
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
- `Typography`

### Components

- `Badge`
- `Button`
- `Checkbox`
- `Empty State`
- `Error Panel`
- `Pagination`
- `Skeleton`
- `Table`

### Patterns

- `Search`
- `Toolbar`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.checkbox.*`
- `comp.empty-state.*`
- `comp.error-panel.*`
- `comp.pagination.*`
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
| `table` | `component` | `Table`, `Checkbox` |
| `status` | `component` | `Skeleton`, `Empty State`, `Error Panel`, `Badge` |
| `navigation` | `component` | `Pagination`, `Button` |

## Formal Governance

### Entry Conditions

- A table needs to render many rows efficiently.
- Users need selection, paging, empty/error/loading states, or local actions.
- Search and Toolbar host query/actions without owning table rendering.

### Decision Tree

- Use Table for ordinary tabular data.
- Use Virtual Data Table when large row counts need virtualization or controlled paging.
- Use Transfer List when users move items between sets.

### Failure Modes

- Rows are custom cards instead of Table rows.
- Virtualization breaks keyboard or screen reader context.
- Search/Toolbar internals are cloned.
- Empty/error states bypass Flow components.

### Success Metrics

- Users can scan, select, page, and recover from data states.
- Assistive tech receives stable row/column context.
- Performance concerns do not create a second table implementation.

### Accessibility

- Preserve table semantics under virtualization.
- Expose selected count and pagination state.
- Keep empty/error/loading states announced in text.

### Tests

- Composes Table, Checkbox, Pagination, Skeleton, Empty State, Error Panel, Badge, and Button.
- Covers virtualized, paginated, selected, loading, empty, error, and disabled states.
- Keeps Search and Toolbar as boundaries.

### Agent Instructions

- Do not create custom row/card visuals.
- Keep data fetching and row model outside the pattern.
- Ask before virtualizing regulated, financial, or safety-critical data.

### Reject If

- Table semantics are lost.
- Search/Toolbar are cloned.
- Empty/error states bypass components.
- Selection state is inaccessible.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| table | Table | yes | Package table renders columns, rows, sort affordances, and selection context. |
| toolbar | Toolbar | conditional | Search, filters, export, and view actions. |
| selection | Checkbox \| Badge | conditional | Selected row count and batch state. |
| state | Skeleton \| EmptyState \| ErrorPanel | yes | Loading, empty, permission, and error states. |
| pagination | Pagination | conditional | Page navigation when virtualization or server paging is needed. |

## Components Used

- Table
- Button
- Checkbox
- Badge
- Skeleton
- Empty State
- Error Panel
- Pagination

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Operational table | Required | Sortable dense table with clear row metadata. |
| Selectable table | Required state | Selection count and bulk action slot are explicit. |
| Remote loading | Required state | Skeleton and error state preserve table dimensions. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Sort update | Sort changes update rows without moving keyboard focus unexpectedly. |
| Selection feedback | Selected count updates instantly and is text-backed. |
| Loading swap | Skeleton keeps table footprint stable. |

## Accessibility

- Table has an accessible label.
- Sortable columns expose state.
- Selection state is keyboard reachable and text-backed.
- Empty, permission, and error states are announced.

## Implementation Checklist

- Declare `table`: Package table renders columns, rows, sort affordances, and selection context.
- Declare `state`: Loading, empty, permission, and error states.
- Sortable columns update sort state.
- Rows remain readable at desktop and tablet widths.
- Selection count matches selected rows.
- Loading and empty states preserve layout.

## Tests And Rejection Rules

Must test:

- Sortable columns update sort state.
- Rows remain readable at desktop and tablet widths.
- Selection count matches selected rows.
- Loading and empty states preserve layout.

Reject if:

- The table is a fake layout instead of Design System Table.
- Sorting, empty, or loading state is missing.
- Domain lifecycle logic is hidden inside the table component.

## MIEL

Agents can decide:

- Use Virtual Data Table for large desktop operational datasets.
- Use Table as the rendering component and keep process in the pattern.
- Escalate domain lifecycle actions to administration patterns.

Agents must ask:

- Column ownership, sort model, server paging, permissions, or export rules are unclear.
- The table contains financial, identity, audit, or compliance data.

Agents must reject:

- The table is a fake layout instead of Design System Table.
- Sorting, empty, or loading state is missing.
- Domain lifecycle logic is hidden inside the table component.

Handoff language:

> Confirm columns, row key, sorting, paging or virtualization, selection model, permissions, export policy, and state handling.
