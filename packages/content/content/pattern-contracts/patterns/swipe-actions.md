# Swipe Actions

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/swipe-actions/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/swipe-actions.json`

## Purpose

Expose secondary row actions on mobile while preserving a visible, accessible alternative for users who cannot or do not swipe.

## Use When

- A list row has a small set of contextual secondary actions.
- The primary row action remains opening or selecting the item.
- Mobile interaction can reveal actions without hiding recovery.

## Do Not Use Without Review

- Actions are primary, destructive, or permissioned without confirmation.
- The row has many actions or requires form input.
- There is no explicit non-gesture alternative.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines row height, action rail width, touch targets, and list density. |
| Voice | Keeps action labels short and consequence-backed. |
| Energy | Controls selected, revealed, danger, disabled, and focus states. |
| Momentum | Uses Design System reveal timing without custom physics in documentation demos. |
| Accessibility | Requires keyboard and button alternatives to any gesture. |

## Formal Purpose

Coordinate touch reveal actions for list rows with equivalent keyboard, pointer, confirmation, and recovery paths.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Touch-first |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `reduced motion` |

## Formal States

- `closed`
- `revealed`
- `threshold`
- `committed`
- `confirming`
- `disabled`
- `reduced-motion`

## Formal Dependencies

### Foundations

- `Accessibility`
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
- `Typography`

### Components

- `Button`
- `Dialog`
- `Movement Row`
- `IconButton`
- `Toast`

### Tokens

- `comp.button.*`
- `comp.dialog.*`
- `comp.movement-row.*`
- `component.pattern-action-item.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `row` | `component` | `Movement Row` |
| `actions` | `component` | `IconButton`, `Button` |
| `recovery` | `component` | `Dialog`, `Toast` |

## Formal Governance

### Entry Conditions

- A touch list needs fast row-level actions.
- Actions need pointer and keyboard equivalents.
- Risky actions may require confirmation or undo recovery.

### Decision Tree

- Use IconButton for visible compact commands.
- Use Swipe Actions when touch reveal is the main row shortcut.
- Use Confirmation Dialog for destructive action confirmation.

### Failure Modes

- Swipe is the only way to access an action.
- Revealed actions recreate Button or IconButton visuals.
- Destructive actions execute without confirmation or undo.
- Motion ignores reduced motion preferences.

### Success Metrics

- Users can discover and execute actions by touch, pointer, and keyboard.
- Motion is consistent and respectful of accessibility preferences.
- Risky actions have confirmation or recovery.

### Accessibility

- Provide non-swipe access to every action.
- Respect reduced motion.
- Do not execute destructive actions without confirmation or undo.

### Tests

- Covers touch, keyboard, pointer, reduced-motion, and disabled states.
- Uses Movement Row, IconButton, Button, Dialog, and Toast.
- Prevents swipe-only access.

### Agent Instructions

- Compose from Movement Row, IconButton, Button, Dialog, and Toast.
- Keep business action policy outside the pattern.
- Ask before using swipe for destructive or regulated actions.

### Reject If

- Swipe is the only action path.
- Revealed controls are custom visuals.
- Reduced motion is ignored.
- Destructive actions lack confirmation or undo.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| row | MovementRow | yes | The object being acted on. |
| reveal | Button | yes | Explicit alternative to the swipe gesture. |
| actions | SwipeAction[] | yes | One to three contextual actions. |
| feedback | Toast | conditional | Reports the selected action. |
| confirmation | Dialog | conditional | Required for high-risk actions. |

## Components Used

- Movement Row
- IconButton
- Button
- Dialog
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Two actions | Current candidate | Reveal quick actions beside a Movement Row. |
| Destructive action | Required state | Danger action must confirm when risk is high. |
| Explicit controls | Required state | Reveal button exists as the accessible alternative. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Reveal | Action rail appears after user trigger with Design System motion tokens. |
| Selection | Action feedback appears after explicit action. |
| Reset | Actions can be hidden again without side effect. |

## Accessibility

- Every gesture has a visible control alternative.
- Quick actions include text labels.
- Focus stays in the row region while actions are revealed.
- Destructive action is not color-only.

## Implementation Checklist

- Declare `row`: The object being acted on.
- Declare `reveal`: Explicit alternative to the swipe gesture.
- Declare `actions`: One to three contextual actions.
- Actions are hidden by default.
- Reveal button exposes actions.
- Hide button resets the row.
- IconButton action shows feedback.
- Keyboard can reach reveal and actions.

## Tests And Rejection Rules

Must test:

- Actions are hidden by default.
- Reveal button exposes actions.
- Hide button resets the row.
- IconButton action shows feedback.
- Keyboard can reach reveal and actions.

Reject if:

- Actions are hidden behind gesture only.
- The pattern becomes a row menu or form.
- Primary navigation is only reachable through swipe.

## MIEL

Agents can decide:

- Use Swipe Actions for secondary row actions on mobile.
- Provide explicit reveal controls in documentation and keyboard flows.
- Limit actions to the row context.

Agents must ask:

- Action priority, destructive confirmation, or non-gesture fallback is unclear.

Agents must reject:

- Actions are hidden behind gesture only.
- The pattern becomes a row menu or form.
- Primary navigation is only reachable through swipe.

Handoff language:

> Confirm row type, action count, explicit fallback, destructive policy, and reset behavior.
