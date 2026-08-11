# Confirmation Dialog

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/confirmation-dialog/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/confirmation-dialog.json`

## Purpose

Interrupt a user only when an action has meaningful consequence and needs explicit review, cancellation, or confirmation.

## Use When

- An action is destructive, financial, permission-sensitive, irreversible, or audit-relevant.
- Users need to understand affected entities and consequence before proceeding.
- The product needs an explicit cancel path and result feedback.

## Do Not Use Without Review

- The action is simple, reversible, and already clear.
- The dialog repeats the button label without naming consequence.
- The system needs a full review step instead of a modal interruption.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines dialog width, footer action order, and responsive fit. |
| Voice | Names affected entity, consequence, primary action, cancel, and recovery. |
| Energy | Controls destructive tone, focus, primary action, and disabled/loading states. |
| Depth | Dialog overlays the task and blocks only the relevant action. |
| State | Closed, open, confirming, loading, success, error, and cancelled states are explicit. |
| Accessibility | Requires role dialog, labelled title, focus management, Escape, and focus restoration. |

## Formal Purpose

Coordinate confirmation of risky, destructive, or irreversible actions through Dialog, semantic actions, recovery messaging, and focus-safe dismissal.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Settings Workspace` |

## Formal States

- `closed`
- `open`
- `confirming`
- `loading`
- `error`
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
- `Surface`
- `Typography`

### Components

- `Button`
- `Dialog`
- `Error Panel`
- `Inline Validation`
- `Toast`

### Tokens

- `comp.button.*`
- `comp.dialog.*`
- `comp.error-panel.*`
- `comp.inline-validation.*`
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
| `surface` | `component` | `Dialog` |
| `actions` | `component` | `Button` |
| `recovery` | `component` | `Error Panel`, `Inline Validation`, `Toast` |

## Formal Governance

### Entry Conditions

- An action can delete, disable, submit, revoke, overwrite, or otherwise change important state.
- The user must understand consequence and choose confirm or cancel.
- The action may fail and needs inline or transient recovery.

### Decision Tree

- Use Dialog for neutral modal content.
- Use Confirmation Dialog when the modal requires explicit consequence review.
- Use Inline Validation when the user can resolve the problem in the current form without modal interruption.

### Failure Modes

- A custom overlay recreates Dialog.
- Confirm and cancel actions are visually inconsistent with Button contracts.
- Escape, focus trap, or focus return is missing.
- Destructive meaning relies only on color.

### Success Metrics

- Users understand the consequence before confirming.
- Keyboard and screen reader users can cancel, confirm, and recover.
- Destructive and loading states remain component-owned.

### Accessibility

- Use Dialog focus trap and focus return.
- Keep destructive consequence in text, not color alone.
- Disable duplicate submission while confirming.

### Tests

- Composes Dialog and Button without custom overlay/action visuals.
- Covers escape, cancel, confirm, loading, and error recovery.
- Preserves focus trap and focus return.

### Agent Instructions

- Compose from Dialog, Button, Error Panel, Inline Validation, and Toast.
- Keep business copy and consequence details configurable.
- Ask before confirming destructive, financial, compliance, or identity-sensitive actions.

### Reject If

- Overlay behavior is implemented outside Dialog.
- Actions bypass Button.
- Focus can escape the modal while open.
- Destructive state is color-only.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Button | yes | User action that opens confirmation. |
| dialog | Dialog | yes | Title, consequence copy, and actions. |
| primaryAction | Button | yes | Confirms the named consequence. |
| cancelAction | Button | yes | Returns without side effect. |
| feedback | Toast \| ErrorPanel \| InlineValidation | yes | Reports result or blocker. |

## Components Used

- Dialog
- Button
- Inline Validation
- Toast
- Error Panel

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Destructive confirm | Current candidate | Danger tone with named affected entity. |
| Permission confirm | Candidate | Explains access/security impact before action. |
| Blocked confirm | Required state | Validation/error explains why action cannot proceed. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Open dialog | Opens after user action and respects reduced motion. |
| Confirm progress | Primary action can enter loading before result feedback. |
| Close and restore | Cancel/Escape returns focus to trigger. |

## Accessibility

- Dialog has a title and consequence copy.
- Focus moves into the dialog after open.
- Escape and cancel avoid side effects.
- Primary action text names the consequence.
- Result is announced after confirmation.

## Implementation Checklist

- Declare `trigger`: User action that opens confirmation.
- Declare `dialog`: Title, consequence copy, and actions.
- Declare `primaryAction`: Confirms the named consequence.
- Declare `cancelAction`: Returns without side effect.
- Declare `feedback`: Reports result or blocker.
- Trigger opens dialog only after user action.
- Cancel closes without side effect.
- Confirm reports success or error.
- Destructive tone is not color-only.
- Focus enters and returns predictably.

## Tests And Rejection Rules

Must test:

- Trigger opens dialog only after user action.
- Cancel closes without side effect.
- Confirm reports success or error.
- Destructive tone is not color-only.
- Focus enters and returns predictably.

Reject if:

- It confirms a trivial reversible action.
- Primary action is vague.
- Cancel path or result feedback is missing.

## MIEL

Agents can decide:

- Use Confirmation Dialog for clear destructive or consequential actions.
- Write confirmation copy that names the entity and consequence.
- Use danger tone only when risk is meaningful.

Agents must ask:

- Consequence, affected entity, recovery, audit, or ownership is unclear.
- The action affects money, access, compliance, identity, or irreversible state.

Agents must reject:

- It confirms a trivial reversible action.
- Primary action is vague.
- Cancel path or result feedback is missing.

Handoff language:

> Confirm consequence, affected entity, action owner, recovery, audit, and result feedback.
