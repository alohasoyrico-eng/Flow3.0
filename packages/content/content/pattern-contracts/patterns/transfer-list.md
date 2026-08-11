# Transfer List

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/transfer-list/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/transfer-list.json`

## Purpose

Move users, vehicles, roles, permissions, or stations between available and selected sets with search, review, and reversible feedback.

## Use When

- Users need to assign many entities from one set to another.
- Search, selection, review, or permission rules affect transfer.
- The transfer changes membership, access, routes, or assignments.

## Do Not Use Without Review

- A simple Select or Multi Select is enough.
- Source, destination, permission, or audit policy is unclear.
- Transfers are irreversible without confirmation.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines two-pane layout, action column, density, and responsive stacking. |
| Voice | Owns available/selected labels, count, empty, and confirmation copy. |
| Energy | Controls selected, disabled, warning, and transfer action states. |
| State | Selected, moved, empty, filtered, disabled, pending, saved, and error states are explicit. |
| Depth | Confirmation and review layer above panes when needed. |
| Accessibility | Counts, movement direction, and selected state are text-backed. |

## Formal Purpose

Coordinate moving items between source and target sets with selection, search handoff, validation, and transfer feedback.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `idle`
- `selecting`
- `transferring`
- `partial`
- `invalid`
- `empty-source`
- `empty-target`
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
- `Field Action`
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
- `Inline Validation`
- `Input`
- `List`
- `Toast`

### Patterns

- `Multi Select`
- `Search`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.checkbox.*`
- `comp.inline-validation.*`
- `comp.input.*`
- `comp.list.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `source` | `component` | `List`, `Checkbox`, `Badge` |
| `target` | `component` | `List`, `Checkbox`, `Badge` |
| `actions` | `component` | `Button`, `Input`, `Inline Validation`, `Toast` |
| `multi-selectBoundary` | `pattern` | `Multi Select` |
| `searchBoundary` | `pattern` | `Search` |

## Formal Governance

### Entry Conditions

- Users need to move items between available and selected sets.
- Large sets may require search handoff or multi-select semantics.
- Transfer can be invalid, loading, partial, or permission constrained.

### Decision Tree

- Use Multi Select when users only need a selected set.
- Use Transfer List when source and target sets must be compared and moved.
- Use Search when discovery spans a larger remote source.

### Failure Modes

- Source/target rows are custom list items.
- Checkbox and selection semantics are duplicated.
- Search is embedded instead of handed off.
- Transfer action state is unclear.

### Success Metrics

- Users can inspect source and target sets and move items intentionally.
- Keyboard and screen reader users understand selection and transfer state.
- Search/Multi Select remain boundaries, not hidden implementations.

### Accessibility

- Expose source and target list labels.
- Announce selected count and transfer result.
- Keep move actions keyboard reachable.

### Tests

- Composes List, Checkbox, Badge, Button, Input, Inline Validation, and Toast.
- Covers selecting, transferring, partial, invalid, empty, and disabled states.
- Keeps Multi Select and Search as boundaries.

### Agent Instructions

- Do not duplicate Multi Select internals.
- Keep remote discovery in Search.
- Ask before transferring permissions, roles, money, or identity-sensitive records.

### Reject If

- Rows bypass List/Checkbox.
- Search is cloned.
- Move actions are inaccessible.
- Source and target ownership is unclear.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| available | List \| Checkbox[] | yes | Source set. |
| selected | List \| Checkbox[] | yes | Destination set. |
| actions | Button[] | yes | Move, remove, apply, reset. |
| search | Input | conditional | Filters large sets. |
| feedback | Badge \| Toast \| InlineValidation | conditional | Counts, saved state, or blocked transfer. |

## Components Used

- List
- Checkbox
- Button
- Input
- Badge
- Toast
- Inline Validation

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Role assignment | Required | Move users or roles between sets. |
| Filtered transfer | Required state | Search narrows source list. |
| Review before save | Candidate | Confirmation required for risky transfer. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Move item | Item appears in destination after explicit action. |
| Count update | Counts update instantly. |
| Reduced motion | No animated sorting required. |

## Accessibility

- Pane labels are present.
- Counts are text-backed.
- Move actions name direction.
- Keyboard users can select and transfer.

## Implementation Checklist

- Declare `available`: Source set.
- Declare `selected`: Destination set.
- Declare `actions`: Move, remove, apply, reset.
- Move selected item to destination.
- Remove item from destination.
- Search filters available list.
- Counts update after transfer.

## Tests And Rejection Rules

Must test:

- Move selected item to destination.
- Remove item from destination.
- Search filters available list.
- Counts update after transfer.

Reject if:

- A simpler Select/Multi Select is enough.
- Counts are hidden.
- Transfer direction is ambiguous.

## MIEL

Agents can decide:

- Use Transfer List for assigning entities between two sets.
- Use List/Checkbox/Button composition.
- Require review for risky transfers.

Agents must ask:

- Source, destination, permission, audit, or persistence policy is unclear.
- Transfer affects access, finance, compliance, legal, or identity state.

Agents must reject:

- A simpler Select/Multi Select is enough.
- Counts are hidden.
- Transfer direction is ambiguous.

Handoff language:

> Confirm source, destination, allowed moves, search, selection, audit, confirmation, and persistence behavior.
