# Dense Operational List

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/dense-operational-list/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/dense-operational-list.json`

## Purpose

Coordinate dense operational records with search, filters, toolbar actions, bulk actions, virtual table behavior, and feedback without creating a parallel table or card-list implementation.

## Use When

- A template needs a reusable operational records workspace.
- Search, filter chips, local actions, selection, and pagination must act as one flow.
- Virtual Data Table is necessary but not sufficient because the workflow also owns operational controls.

## Do Not Use Without Review

- The experience is a lightweight static list.
- The flow includes regulated identity, finance, safety, or compliance changes.
- A product template is trying to redefine Search, Toolbar, Filter Chip Group, Bulk Actions, or Virtual Data Table behavior.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | The group, search, filter counts, selection count, table semantics, and feedback stay announced through formal owners. |
| Depth | Surface owns structure and focus-within grouping without Card wrapping. |
| Energy | Filtered, selected, loading, error, disabled, and recovery states cascade to child patterns. |
| Frame | Dense spacing and responsive operational layout stay token-driven. |
| Growth | Operational state remains observable for templates without moving behavior into the template layer. |
| Iconography | Icons remain owned by Toolbar, Search, and child components. |
| Momentum | Loading and busy states use existing child pattern motion. |
| State | Pattern state maps to every dependent child pattern. |
| Symbol | Status and action symbols remain semantic through child owners. |
| Tone | Error, warning, selected, filtered, and neutral tones stay in Flow contracts. |
| Voice | Result counts, filter labels, empty states, and feedback remain explicit and recoverable. |

## Formal Purpose

Coordinate dense operational records with search, active filters, local toolbar actions, bulk actions, virtualized table behavior, and feedback without creating a parallel table or card-list implementation.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Internal Operations Console` |

## Formal States

- `default`
- `filtered`
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

- `Bulk Actions`
- `Filter Chip Group`
- `Search`
- `Status Feedback View`
- `Toolbar`
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
| `listSurface` | `primitive` | `Surface` |
| `searchBoundary` | `pattern` | `Search` |
| `summary` | `component` | `Badge` |
| `filterSummary` | `pattern` | `Filter Chip Group` |
| `toolbarBoundary` | `pattern` | `Toolbar` |
| `bulkActionsBoundary` | `pattern` | `Bulk Actions` |
| `tableBoundary` | `pattern` | `Virtual Data Table` |
| `statusFeedback` | `pattern` | `Status Feedback View` |

## Formal Governance

### Entry Conditions

- A product surface must scan many operational records.
- Search, filters, toolbar actions, selection, and paging must behave as one coordinated workflow.
- The table remains owned by Virtual Data Table and Table, not by the product template.

### Decision Tree

- Use Virtual Data Table when only tabular rendering is needed.
- Use Dense Operational List when search, filters, toolbar, bulk actions, and table state need one contract.
- Use a product template when navigation, module switching, or page layout owns the broader workflow.

### Failure Modes

- Records are rendered as cards or raw rows instead of Virtual Data Table.
- Topbar, Search, Toolbar, or Filter Chip Group behavior is cloned inside a template.
- Selection and bulk action state diverge.
- Feedback bypasses Status Feedback View.

### Success Metrics

- Users can search, filter, scan, select, act, paginate, and recover from errors from one predictable flow.
- Density and state cascade from the pattern surface to every child pattern.
- Templates can reuse the list without redefining operational table behavior.

### Accessibility

- Expose the list as a labelled group with busy state.
- Delegate search semantics to Search and table semantics to Virtual Data Table.
- Expose selected and filter counts through live child components.
- Keep recovery feedback in Status Feedback View.

### Tests

- Composes Surface, Badge, Search, Filter Chip Group, Toolbar, Bulk Actions, Virtual Data Table, and Status Feedback View.
- Covers default, filtered, selected, loading, empty, error, and disabled states.
- Forwards query, filter, sort, row selection, page, bulk action, toolbar overflow, and feedback callbacks.
- Rejects raw tables, card rows, local filter chips, local buttons, and local status shells.

### Agent Instructions

- Do not create custom row/card visuals.
- Do not move table, filter, search, toolbar, or bulk behavior into templates.
- Use Surface for structural grouping; do not wrap this pattern in Card to create visual separation.
- Ask before using this pattern for regulated financial, identity, or safety-critical operations.

### Reject If

- Rows bypass Virtual Data Table.
- Search, filters, toolbar, or bulk actions are cloned.
- Card wraps the operational list group.
- Feedback bypasses Status Feedback View.
- Density or state stops cascading to child patterns.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| listSurface | Surface | required | Structural operational list group. |
| searchBoundary | Search | conditional | Query entry and result count. |
| summary | Badge | conditional | Description or status summary. |
| filterSummary | Filter Chip Group | required | Active filters, reset, and count. |
| toolbarBoundary | Toolbar | conditional | Local actions and overflow. |
| bulkActionsBoundary | Bulk Actions | conditional | Selected-record operations. |
| tableBoundary | Virtual Data Table | required | Rows, selection, sort, pagination, and table states. |
| statusFeedback | Status Feedback View | conditional | Recovery or operation feedback. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| listSurface | Surface | required | Structural operational list group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Searchable | Conditional | Includes Search when query entry is part of the operational flow. |
| Filtered | Required boundary | Filter Chip Group owns active filters even when empty. |
| Actionable | Conditional | Toolbar owns dense local actions and overflow. |
| Selectable | Conditional | Bulk Actions owns selected-count and operation state. |
| Virtualized | Default | Virtual Data Table owns large row rendering and pagination. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Loading | Surface marks busy while Virtual Data Table and child patterns own loading render. |
| Filtered or selected | Surface marks selected structure while chips and table own semantic details. |
| Feedback | Status Feedback View owns operation feedback motion. |

## Accessibility

- Expose the whole list as a labelled group.
- Delegate search semantics to Search.
- Delegate row and column semantics to Virtual Data Table.
- Keep selected and filter counts visible and announced.
- Keep recovery feedback in Status Feedback View.

## Implementation Checklist

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through child patterns.
- Callbacks preserve event context.
- No Card wrapper, raw table shell, local filter chip, local toolbar, or local status shell is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through child patterns.
- Callbacks preserve event context.
- No Card wrapper, raw table shell, local filter chip, local toolbar, or local status shell is emitted.

Reject if:

- Rows are rendered outside Virtual Data Table.
- Card wraps the operational list group.
- Search, Toolbar, Filter Chip Group, or Bulk Actions are copied locally.
- Feedback bypasses Status Feedback View.

## MIEL

Agents can decide:

- Use Dense Operational List for reusable operational record flows.
- Add Bulk Actions only when selected rows can trigger operations.
- Keep product-specific row data and permissions outside the pattern.

Agents must ask:

- Operations affect money, identity, compliance, safety, or destructive records.
- A template wants custom row cards instead of table semantics.
- The flow needs inline editing or expandable detail behavior.

Agents must reject:

- Rows are rendered outside Virtual Data Table.
- Card wraps the operational list group.
- Search, Toolbar, Filter Chip Group, or Bulk Actions are copied locally.
- Feedback bypasses Status Feedback View.

Handoff language:

> Confirm row model, filter source, selection rules, local actions, bulk operation policy, pagination, feedback type, and regulatory risk before shipping Dense Operational List.
