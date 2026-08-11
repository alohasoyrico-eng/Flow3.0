# Action Sheet

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/action-sheet/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/action-sheet.json`

## Purpose

Present contextual mobile actions with hierarchy, destructive treatment, cancel, and recovery without forcing a full page transition.

## Use When

- A mobile task needs a short list of contextual actions.
- Actions need hierarchy, destructive separation, or a cancel path.
- The surface should stay tied to the current object or row.

## Do Not Use Without Review

- The action list is long, searchable, or needs multi-step input.
- Actions are global rather than contextual.
- Destructive or permissioned actions lack confirmation policy.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines sheet edge, safe area, action spacing, and touch density. |
| Voice | Owns action labels, destructive copy, cancel, and object context. |
| Energy | Controls action priority, destructive tone, disabled state, and focus. |
| Depth | Sheet overlays mobile content and keeps origin context visible when possible. |
| Momentum | Uses sheet entrance/exit motion and reduced-motion fallback. |
| Accessibility | Requires labelled sheet, touch targets, Escape/back close, and focus containment. |

## Formal Purpose

Coordinate mobile-first contextual actions through Dialog/Menu/List composition, with cancel, destructive, loading, search handoff, and recovery behavior.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Touch-first |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `reduced motion` |

## Formal States

- `closed`
- `open`
- `loading`
- `disabled`
- `destructive`
- `permission-blocked`
- `error`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
- `Energy`
- `Frame`
- `Momentum`
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

- `Button`
- `Dialog`
- `List`
- `Menu`
- `Toast`

### Patterns

- `Search`

### Tokens

- `comp.button.*`
- `comp.dialog.*`
- `comp.list.*`
- `comp.menu.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `surface` | `component` | `Dialog` |
| `actions` | `component` | `Menu`, `List`, `Button` |
| `feedback` | `component` | `Toast` |
| `searchBoundary` | `pattern` | `Search` |

## Formal Governance

### Entry Conditions

- A touch surface needs contextual actions in a sheet-like presentation.
- Actions may include cancel, destructive, disabled, or loading states.
- Search can provide target discovery but must not own the sheet action list.

### Decision Tree

- Use Menu for compact desktop action lists.
- Use Action Sheet when mobile or touch ergonomics need a larger modal action surface.
- Use Confirmation Dialog when a single risky action requires explicit consequence review.

### Failure Modes

- Sheet surface is a custom overlay outside Dialog.
- Action rows are custom buttons instead of Menu/List/Button.
- Cancel and destructive actions are not semantically distinct.
- Search implementation is embedded inside the sheet.

### Success Metrics

- Users can inspect, cancel, and trigger contextual actions by touch and keyboard.
- Focus trap, escape, and focus return are preserved.
- Risk and recovery states remain component-owned.

### Accessibility

- Use Dialog focus trap and focus return.
- Keep destructive meaning in text and semantics.
- Ensure cancel remains reachable and predictable.

### Tests

- Composes Dialog, Menu/List, Button, and Toast.
- Covers open, loading, disabled, destructive, permission, and error states.
- Keeps Search as handoff boundary only.

### Agent Instructions

- Do not implement a custom sheet overlay.
- Keep action execution policy outside the pattern.
- Ask before including destructive, regulated, or identity-sensitive actions.

### Reject If

- Overlay bypasses Dialog.
- Action rows bypass Menu/List/Button.
- Cancel is missing.
- Search behavior is cloned.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Button \| List row | yes | Object-specific entry point. |
| sheet | BottomSheet | yes | Bounded mobile action surface. |
| actions | Button[] \| Menu | yes | Prioritized contextual actions. |
| cancel | Button | yes | Closes without side effect. |
| confirmation | Dialog \| InlineConfirm | conditional | Required for destructive actions. |
| feedback | Toast | conditional | Reports selected action result. |

## Components Used

- Button
- List
- Menu
- Toast
- Dialog

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Object actions | Current candidate | Short contextual list with primary and secondary actions. |
| Destructive action | Required state | Separated danger action with confirmation policy. |
| Disabled action | Candidate | Explains unavailable action without hiding it. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Sheet reveal | Opens from bottom after user action; reduced motion removes decorative slide. |
| Action feedback | Selected action closes or reports progress according to policy. |
| Cancel close | Cancel/back closes without side effect. |

## Accessibility

- Sheet has an accessible title.
- Actions use full labels and reachable touch targets.
- Cancel is always available.
- Destructive action is text-backed and not color-only.
- Focus and screen reader context remain in the sheet while open.

## Implementation Checklist

- Declare `trigger`: Object-specific entry point.
- Declare `sheet`: Bounded mobile action surface.
- Declare `actions`: Prioritized contextual actions.
- Declare `cancel`: Closes without side effect.
- Trigger opens sheet after user action.
- Cancel closes with no side effect.
- Primary action reports feedback.
- Destructive action is separated and confirmed when required.
- Mobile viewport keeps actions reachable without overlap.

## Tests And Rejection Rules

Must test:

- Trigger opens sheet after user action.
- Cancel closes with no side effect.
- Primary action reports feedback.
- Destructive action is separated and confirmed when required.
- Mobile viewport keeps actions reachable without overlap.

Reject if:

- The sheet contains a long form or searchable list.
- Cancel path is missing.
- Destructive action is visually hidden or color-only.

## MIEL

Agents can decide:

- Use Action Sheet for short contextual mobile action lists.
- Choose action order when product priority is clear.
- Separate destructive actions when risk exists.

Agents must ask:

- Action ownership, destructive policy, disabled reason, or mobile back behavior is unclear.
- Actions affect money, access, compliance, identity, or irreversible state.

Agents must reject:

- The sheet contains a long form or searchable list.
- Cancel path is missing.
- Destructive action is visually hidden or color-only.

Handoff language:

> Confirm trigger object, action priority, destructive policy, cancel/back behavior, and feedback.
