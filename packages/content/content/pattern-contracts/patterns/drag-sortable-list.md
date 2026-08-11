# Drag Sortable List

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/drag-sortable-list/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/drag-sortable-list.json`

## Purpose

Reorder dashboard modules, route stops, rules, or settings with keyboard alternatives, undo, persistence, and reduced-motion behavior.

## Use When

- Order changes process meaning or presentation.
- Users need drag plus keyboard reorder controls.
- Reordering persists, audits, or affects routes, dashboards, or rules.

## Do Not Use Without Review

- Order is decorative.
- Persistence, constraints, or undo behavior is unclear.
- Drag is the only way to reorder.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines list density, handles, drop targets, and responsive controls. |
| Voice | Owns reorder labels, position copy, undo, and save feedback. |
| Energy | Controls grabbed, target, selected, disabled, and saved states. |
| State | Idle, grabbed, moved, dirty, saved, blocked, disabled, and error states are explicit. |
| Momentum | Movement is meaningful, bounded, and respects reduced motion. |
| Accessibility | Keyboard reorder and position announcements are required. |

## Formal Purpose

Coordinate reorderable lists with drag, keyboard movement, motion boundaries, disabled items, persistence feedback, and settings-bound configuration.

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
- `keyboard-moving`
- `dirty`
- `saving`
- `saved`
- `error`
- `disabled`
- `reduced-motion`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Energy`
- `Frame`
- `Momentum`
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
- `List`
- `Motion Boundary`
- `Toast`

### Patterns

- `Settings`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.list.*`
- `comp.motion-boundary.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `items` | `component` | `List`, `Badge` |
| `motion` | `component` | `Motion Boundary` |
| `actions` | `component` | `Button`, `Toast` |
| `settingsBoundary` | `pattern` | `Settings` |

## Formal Governance

### Entry Conditions

- Users need to reorder a finite list and persist the order.
- The list needs drag and keyboard equivalent movement.
- Some items may be locked, disabled, or moved through a settings surface.

### Decision Tree

- Use List for static ordering.
- Use Drag Sortable List when item order is user-controlled.
- Use Settings only to host preference-level ordering, not to own reorder mechanics.

### Failure Modes

- Drag is the only reorder path.
- Motion ignores reduced-motion preferences.
- Disabled or locked items can move without reason.
- Persistence feedback bypasses Toast.

### Success Metrics

- Users can reorder by pointer and keyboard.
- Locked and disabled items have visible reasons.
- Order persistence and failure states are clear.

### Accessibility

- Provide keyboard controls for moving items.
- Announce position changes.
- Respect reduced motion and expose locked reasons.

### Tests

- Composes List, Motion Boundary, Badge, Button, and Toast.
- Covers pointer drag, keyboard movement, saving, error, disabled, and reduced-motion states.
- Does not let Settings own reorder mechanics.

### Agent Instructions

- Keep persistence policy and product-specific item schema outside the pattern.
- Treat Settings as a host boundary, not an implementation dependency.
- Ask before reordering safety, finance, or compliance priority lists.

### Reject If

- Drag has no keyboard equivalent.
- Motion bypasses Motion Boundary.
- Locked item reasons are missing.
- Settings duplicates the reorder implementation.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| items | List | yes | Ordered items. |
| handles | Button[] | yes | Move up/down or drag handles. |
| boundary | MotionBoundary | conditional | Reduced-motion and local motion control. |
| feedback | Toast \| Badge | conditional | Saved, dirty, or undo state. |

## Components Used

- List
- Button
- Motion Boundary
- Toast
- Badge

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Dashboard modules | Required | Reorder dashboard cards with save/undo. |
| Route stops | Candidate | Order affects navigation and requires review. |
| Keyboard reorder | Required state | Move up/down controls work without drag. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Reorder | Motion follows system timing and is disabled by reduced motion. |
| Dirty state | Saved/dirty status updates instantly. |
| Undo | Undo restores previous order. |

## Accessibility

- Move controls are keyboard reachable.
- Position changes are announced.
- Drag is not the only input method.
- Disabled constraints are explained.

## Implementation Checklist

- Declare `items`: Ordered items.
- Declare `handles`: Move up/down or drag handles.
- Move item up/down.
- Saved order feedback appears.
- Undo restores order.
- Reduced motion removes decorative movement.

## Tests And Rejection Rules

Must test:

- Move item up/down.
- Saved order feedback appears.
- Undo restores order.
- Reduced motion removes decorative movement.

Reject if:

- Drag is the only interaction.
- Order is decorative.
- No save or undo policy exists.

## MIEL

Agents can decide:

- Use Drag Sortable List when order has product meaning.
- Provide keyboard controls.
- Use Motion Boundary for local motion behavior.

Agents must ask:

- Persistence, constraints, audit, undo, or order meaning is unclear.
- Reordering affects routes, finance, compliance, or safety.

Agents must reject:

- Drag is the only interaction.
- Order is decorative.
- No save or undo policy exists.

Handoff language:

> Confirm order meaning, constraints, persistence, keyboard controls, undo, audit, and reduced-motion behavior.
