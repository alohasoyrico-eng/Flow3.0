# Snackbar Provider

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/snackbar-provider/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/snackbar-provider.json`

## Purpose

Coordinate transient feedback queues, placement, timing, undo, retry, and live-region behavior for non-blocking product events.

## Use When

- Multiple actions or system events can emit toasts/snackbars.
- Feedback needs queueing, placement, deduplication, undo, or retry policy.
- The app shell needs one consistent feedback region.

## Do Not Use Without Review

- A single local Toast is enough.
- The message asks for a required decision.
- Duration, queue behavior, severity, or undo policy is unclear.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines feedback region placement, safe area, stack spacing, and viewport behavior. |
| Voice | Owns concise event copy, undo/retry labels, and severity language. |
| Energy | Controls tone, priority, dismiss, action, and stacked emphasis. |
| State | Queued, visible, actioned, dismissed, retrying, failed, and empty states are explicit. |
| Depth | Feedback floats above content without blocking required actions. |
| Accessibility | Live region role, announcement priority, keyboard actions, and focus behavior are required. |

## Formal Purpose

Coordinate transient system feedback across queues, priority, dismissal, status semantics, and recovery actions without each surface inventing its own notification stack.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `idle`
- `queued`
- `visible`
- `dismissed`
- `actionable`
- `paused`
- `error`

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

- `Badge`
- `Button`
- `Toast`

### Tokens

- `comp.toast.*`
- `comp.button.*`
- `comp.badge.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `viewport` | `primitive` | `Surface` |
| `action` | `component` | `Button` |
| `feedback` | `component` | `Toast` |
| `status` | `component` | `Badge` |

## Formal Governance

### Entry Conditions

- A product flow needs transient success, warning, error, or informational feedback.
- Multiple events can happen close together and need deterministic queue behavior.
- A toast may include a short recovery action such as undo, retry, or view details.

### Decision Tree

- Use Toast directly for one isolated message in a controlled component demo.
- Use Snackbar Provider when a screen, shell, or workflow needs a governed notification queue.
- Use Dialog or Inline Validation when the user must resolve the issue before continuing.

### Failure Modes

- Every feature mounts its own notification container.
- Messages overlap or disappear before assistive technology can announce them.
- Action buttons inside feedback recreate Button styles.
- Critical errors are sent only as transient feedback.

### Success Metrics

- Feedback appears in one predictable region.
- Users can understand message severity and optional recovery.
- Keyboard and screen reader users receive the update without focus being stolen.

### Accessibility

- Use live-region semantics appropriate to severity.
- Do not move focus to transient feedback unless the action explicitly requires it.
- Pause dismissal while the user hovers, focuses, or interacts with the action.

### Tests

- Queues multiple messages deterministically.
- Uses Toast, Button, and Badge contracts instead of custom visuals.
- Preserves live-region announcements and focus behavior.

### Agent Instructions

- Compose the provider from Toast, Button, and optional Badge only.
- Keep long-form recovery, blocking decisions, and destructive confirmations outside this pattern.
- Ask before creating a second feedback stack in a shell or template.

### Reject If

- A feature defines a separate snackbar container.
- Toast visuals are recreated with raw classes.
- Severity relies only on color.
- Dismissal timing bypasses accessibility behavior.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| viewport | Surface | yes | Shared feedback viewport owned by the shell or route. |
| items | Toast[] | yes | Visible queued feedback items. |
| actions | Button[] | conditional | Undo, retry, view, or dismiss actions. |
| policy | QueuePolicy | yes | Duration, dedupe, max visible count, and priority rules. |

## Components Used

- Toast
- Button
- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| viewport | Surface | yes | Shared feedback viewport owned by the shell or route. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Status queue | Required | Multiple non-blocking confirmations share one region. |
| Undo | Required state | Undo action is available only when product behavior exists. |
| Retry | Candidate | Recoverable system event exposes retry without blocking the page. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Queue entry | Items appear in the region with reduced-motion fallback. |
| Dismiss | Dismiss removes one item without moving focus unexpectedly. |
| Stack update | Stacking preserves safe-area and primary action access. |

## Accessibility

- Feedback uses the right live-region priority.
- Actions are keyboard reachable.
- Dismiss and undo behavior are real.
- The region does not cover required navigation or primary actions.

## Implementation Checklist

- Declare `viewport`: Shared feedback viewport owned by the shell or route.
- Declare `items`: Visible queued feedback items.
- Declare `policy`: Duration, dedupe, max visible count, and priority rules.
- Queue shows newest feedback in region.
- Dismiss removes one item.
- Undo/retry action produces a visible result.
- Stack does not cover primary actions.

## Tests And Rejection Rules

Must test:

- Queue shows newest feedback in region.
- Dismiss removes one item.
- Undo/retry action produces a visible result.
- Stack does not cover primary actions.

Reject if:

- The feedback asks for a blocking decision.
- Actions are fake.
- Queue and live-region behavior are undefined.

## MIEL

Agents can decide:

- Use Snackbar Provider when a route or shell owns multiple transient feedback events.
- Use Toast as the visible item.
- Limit actions to real undo, retry, or view behavior.

Agents must ask:

- Duration, max stack, undo policy, retry behavior, or severity priority is unclear.
- Feedback affects finance, compliance, legal, security, or identity state.

Agents must reject:

- The feedback asks for a blocking decision.
- Actions are fake.
- Queue and live-region behavior are undefined.

Handoff language:

> Confirm placement, queue limits, duration, live-region role, severity priority, undo/retry behavior, and dismiss policy.
