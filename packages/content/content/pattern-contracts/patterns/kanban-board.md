# Kanban Board

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/kanban-board/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/kanban-board.json`

## Purpose

Coordinate work items across process-state columns with visible counts, limits, selection, optional reorder behavior, and Surface-owned column structure.

## Use When

- Work progresses through explicit process states.
- Users need to compare columns, counts, status, and limits at once.
- Cards may be selected or reordered while preserving column context.

## Do Not Use Without Review

- A single status group can be represented by List.
- Field comparison is primary and Virtual Data Table would be clearer.
- Reorder affects safety, finance, compliance, or audit policy.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Board, columns, counts, and card actions remain labelled and keyboard reachable. |
| Depth | Column structure uses Surface elevation and state, not Card wrappers. |
| Energy | Selection, limits, disabled, loading, saving, and error states stay visible. |
| Frame | Column density, counts, and responsive grouping follow system spacing and breakpoints. |
| Growth | Counts and limits communicate progress without local visual math. |
| Iconography | Card icons and reorder affordances use Flow icon semantics. |
| Momentum | Optional movement delegates to Drag Sortable List and its motion boundary. |
| State | Idle, dragging, saving, loading, error, empty, and disabled states are explicit. |
| Symbol | Status symbols and item affordances remain recognizable across channels. |
| Tone | Over-limit, selected, error, and neutral tones inherit the system tone contract. |
| Voice | Column labels, status copy, locked reasons, and actions are textual, not color-only. |

## Formal Purpose

Coordinate work items across columns with explicit limits, card selection, optional reorder behavior, status feedback, and Surface-owned column structure.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `idle`
- `dragging`
- `saving`
- `loading`
- `error`
- `empty`
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
- `Button`
- `Empty State`
- `Error Panel`
- `List`

### Patterns

- `Drag Sortable List`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.empty-state.*`
- `comp.error-panel.*`
- `comp.list.*`
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
| `columns` | `primitive` | `Surface` |
| `cards` | `component` | `List`, `Badge` |
| `reorderBoundary` | `pattern` | `Drag Sortable List` |
| `feedback` | `component` | `Empty State`, `Error Panel` |
| `actions` | `component` | `Button` |

## Formal Governance

### Entry Conditions

- Users need to compare work items by process state.
- Columns carry visible item counts or limits.
- Cards can be selected and may be reordered with a keyboard equivalent.

### Decision Tree

- Use List for one status group.
- Use Virtual Data Table when column comparison by fields is primary.
- Use Kanban Board when process state columns are the primary navigation model.
- Use Drag Sortable List only when card order is user-controlled.

### Failure Modes

- Columns are cards instead of Surface panels.
- Drag behavior has no keyboard path.
- Column limits are color-only.
- Cards hide status text or locked reasons.

### Success Metrics

- Users can scan columns and item counts quickly.
- Selected, disabled, locked, and over-limit states are visible.
- Reorder callbacks preserve column context.

### Accessibility

- Expose the board as a labelled group.
- Keep each column labelled through List or Drag Sortable List.
- Preserve keyboard movement through Drag Sortable List when sortable.
- Keep counts, limits, and statuses textual.

### Tests

- Composes Surface, List, Badge, Button, Empty State, Error Panel, and Drag Sortable List.
- Covers idle, sortable, over-limit, empty, error, disabled, and loading states.
- onCardSelect, onMoveCard, and onColumnAction include board context.

### Agent Instructions

- Use Kanban Board only for process-state boards.
- Do not use Card as a column wrapper.
- Ask before enabling reorder for safety, finance, or compliance workflows.

### Reject If

- Columns are authored as Card groups.
- Sortable cards lack keyboard movement.
- Column limits are color-only.
- Board owns a table, approval flow, or template shell.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| columns | Surface | yes | Structural column panels owned by the Surface primitive. |
| cards | List \| Badge | yes | Cards are list records with optional status badges. |
| reorderBoundary | Drag Sortable List | conditional | Sortable columns delegate order behavior and keyboard movement. |
| feedback | Empty State \| Error Panel | conditional | Empty and error states use formal Flow feedback components. |
| actions | Button | conditional | Board-level commands use explicit Button composition. |

## Components Used

- Badge
- Button
- Empty State
- Error Panel
- List

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| columns | Surface | yes | Structural column panels owned by the Surface primitive. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Static board | Required | Columns render as Surface + List without reorder controls. |
| Sortable board | Required | Columns render Drag Sortable List with keyboard movement. |
| Limited columns | Required state | Column limits show textual count and warning tone. |
| Empty board | Required state | No columns or forced empty state routes through Empty State. |
| Error board | Required state | Unavailable boards route through Error Panel. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Reorder | Movement is delegated to Drag Sortable List and respects reduced motion. |
| Saving | Busy state sets aria-busy and disables unsafe commands. |
| Selection | Selected cards and columns use state tokens rather than local shells. |

## Accessibility

- The board has an accessible group label.
- Each column keeps a visible and accessible label.
- Counts and limits are textual.
- Sortable cards keep keyboard move controls through Drag Sortable List.
- Locked and disabled cards expose text reasons when provided.

## Implementation Checklist

- Declare `columns`: Structural column panels owned by the Surface primitive.
- Declare `cards`: Cards are list records with optional status badges.
- Render Surface columns with data-flow-slot evidence.
- Render cards through List or Drag Sortable List.
- onCardSelect, onMoveCard, and onColumnAction include column or action context.
- Reject Card, board-column, kanban-card, and local visual shell classes.

## Tests And Rejection Rules

Must test:

- Render Surface columns with data-flow-slot evidence.
- Render cards through List or Drag Sortable List.
- onCardSelect, onMoveCard, and onColumnAction include column or action context.
- Reject Card, board-column, kanban-card, and local visual shell classes.

Reject if:

- Columns are authored as Card groups.
- Cards are local visual shells instead of List records.
- Sortable behavior lacks keyboard movement.
- Counts, limits, or locked reasons are color-only.

## MIEL

Agents can decide:

- Use Kanban Board when process-state columns are the primary navigation model.
- Use Surface for each structural column.
- Use Drag Sortable List only when order is user-controlled.

Agents must ask:

- Reordering affects safety, finance, compliance, audit, or external workflow state.
- The board needs cross-column drag and drop beyond the current column-local contract.
- Cards need rich media or object detail that might belong in a template.

Agents must reject:

- Columns are authored as Card groups.
- Cards are local visual shells instead of List records.
- Sortable behavior lacks keyboard movement.
- Counts, limits, or locked reasons are color-only.

Handoff language:

> Confirm process states, card schema, limits, reorder policy, persistence, locked reasons, and whether cross-column movement is in scope.
