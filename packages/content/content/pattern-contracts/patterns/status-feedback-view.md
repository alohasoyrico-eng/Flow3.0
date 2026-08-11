# Status Feedback View

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/status-feedback-view/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/status-feedback-view.json`

## Purpose

Route product feedback states to the correct Flow feedback component or pattern without introducing a parallel status shell.

## Use When

- A flow needs one feedback contract across empty, error, inline, toast, notification, or queue states.
- The caller needs to swap feedback delivery while preserving accessibility and state semantics.
- Templates need feedback behavior without owning local feedback styles.

## Do Not Use Without Review

- The feedback is purely decorative.
- The state mixes blocking and transient feedback in one slot.
- The product needs a new feedback owner rather than routing to existing Flow owners.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Feedback regions, alerts, live updates, and field descriptions keep their formal owner semantics. |
| Depth | Notification queues and transient feedback inherit structural depth through their owning patterns. |
| Energy | Info, success, warning, danger, and disabled feedback use component tone contracts. |
| Frame | Spacing and responsive behavior are inherited from the child owner, not a local shell. |
| Growth | Feedback state, recovery, and measurement remain observable through the owning components and patterns. |
| Iconography | Feedback icons come from Empty State, Error Panel, Toast, and related owners. |
| Momentum | Transient feedback delegates motion and queue behavior to Toast or Snackbar Provider. |
| State | Empty, error, critical, warning, success, visible, loading, permission, maintenance, and disabled states are explicit. |
| Symbol | Status symbols remain recognizable through the owning component, while text remains required as fallback for feedback meaning and recovery. |
| Tone | Semantic tone maps to the component or pattern responsible for the feedback scope. |
| Voice | Feedback copy stays textual, concise, and recoverable. |

## Formal Purpose

Route product feedback states to the correct Flow feedback component or pattern without introducing a parallel status shell.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Agent Workspace` |

## Formal States

- `default`
- `empty`
- `error`
- `critical`
- `warning`
- `success`
- `info`
- `visible`
- `closed`
- `open`
- `loading`
- `permission`
- `maintenance`
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

- `Empty State`
- `Error Panel`
- `Inline Validation`
- `Toast`

### Patterns

- `Notification Panel`
- `Snackbar Provider`

### Tokens

- `comp.empty-state.*`
- `comp.error-panel.*`
- `comp.inline-validation.*`
- `comp.toast.*`
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
| `emptyView` | `component` | `Empty State` |
| `errorView` | `component` | `Error Panel` |
| `inlineFeedback` | `component` | `Inline Validation` |
| `transientFeedback` | `component` | `Toast` |
| `notificationHistory` | `pattern` | `Notification Panel` |
| `queuedFeedback` | `pattern` | `Snackbar Provider` |

## Formal Governance

### Entry Conditions

- A product flow needs one feedback contract across empty, error, inline, toast, notification, or queue states.
- The caller needs to preserve feedback semantics while swapping delivery surfaces.
- The state must remain textual and accessible.

### Decision Tree

- Use Empty State for empty, loading, permission, or maintenance views.
- Use Error Panel for blocking or recoverable error states.
- Use Inline Validation for field-scoped feedback.
- Use Toast for transient feedback.
- Use Notification Panel for notification history.
- Use Snackbar Provider for queued transient messages.

### Failure Modes

- A local feedback shell duplicates Empty State, Error Panel, Toast, Notification Panel, or Snackbar Provider.
- Warnings or limits are color-only.
- A page-level template owns component feedback logic.
- Notifications render as raw lists outside Notification Panel.

### Success Metrics

- Feedback state maps to one formal Flow owner.
- Callbacks preserve action, dismiss, queue, and selection context.
- Density and state cascade through every child component.

### Accessibility

- Expose a labelled region or group.
- Preserve live-region behavior only for transient feedback.
- Delegate field accessibility to Inline Validation.
- Keep error and warning semantics in Error Panel or Toast.

### Tests

- Composes Empty State, Error Panel, Inline Validation, Toast, Notification Panel, and Snackbar Provider.
- Covers empty, error, inline, toast, notification, snackbar, loading, permission, and maintenance kinds.
- Callbacks preserve action, dismiss, queue, select, and notification context.
- Reject local status-view or feedback-shell classes.

### Agent Instructions

- Do not create StatusView, FeedbackShell, feedback-banner, or status-shell components.
- Route feedback by scope: field, view, transient, notification history, or queue.
- Ask when a product flow mixes blocking and transient feedback in the same slot.

### Reject If

- A local shell replaces a Flow feedback owner.
- Feedback is color-only.
- Notifications are raw list markup.
- A template defines feedback behavior that belongs in this pattern.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| emptyView | Empty State | conditional | Empty, loading, permission, and maintenance feedback. |
| errorView | Error Panel | conditional | Recoverable, warning, error, and critical feedback. |
| inlineFeedback | Inline Validation | conditional | Field-scoped feedback. |
| transientFeedback | Toast | conditional | Temporary status, recovery, warning, and action feedback. |
| notificationHistory | Notification Panel | conditional | Notification center and unread history. |
| queuedFeedback | Snackbar Provider | conditional | Queued transient feedback messages. |

## Components Used

- Empty State
- Error Panel
- Inline Validation
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Empty view | Required | Renders Empty State. |
| Error view | Required | Renders Error Panel. |
| Inline feedback | Required | Renders Inline Validation. |
| Toast feedback | Required | Renders Toast. |
| Notification history | Required boundary | Delegates to Notification Panel. |
| Queued feedback | Required boundary | Delegates to Snackbar Provider. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Transient | Toast and Snackbar Provider own visible, exiting, and queued motion. |
| Loading | Empty State owns loading affordance through Spinner. |
| Blocking | Error Panel remains stable and avoids decorative movement. |

## Accessibility

- Expose a labelled region or group.
- Use live regions only for transient or status updates.
- Delegate field semantics to Inline Validation.
- Delegate notification history semantics to Notification Panel.

## Implementation Checklist

- Each kind routes to its formal Flow owner.
- Density and state cascade to child components.
- Actions, dismissals, queue actions, and selection callbacks fire with context.
- No status-view, feedback-shell, feedback-banner, or local status class is emitted.

## Tests And Rejection Rules

Must test:

- Each kind routes to its formal Flow owner.
- Density and state cascade to child components.
- Actions, dismissals, queue actions, and selection callbacks fire with context.
- No status-view, feedback-shell, feedback-banner, or local status class is emitted.

Reject if:

- A local shell replaces Empty State, Error Panel, Inline Validation, Toast, Notification Panel, or Snackbar Provider.
- Feedback is color-only.
- Notifications render as raw list markup.
- A template owns feedback behavior that belongs in this pattern.

## MIEL

Agents can decide:

- Route feedback by scope: field, view, transient, notification history, or queue.
- Use existing Flow feedback components and patterns.
- Keep templates from defining feedback behavior directly.

Agents must ask:

- Blocking and transient feedback compete in the same slot.
- Feedback has compliance, safety, finance, or destructive-action consequences.
- A product asks for a new feedback visual owner.

Agents must reject:

- A local shell replaces Empty State, Error Panel, Inline Validation, Toast, Notification Panel, or Snackbar Provider.
- Feedback is color-only.
- Notifications render as raw list markup.
- A template owns feedback behavior that belongs in this pattern.

Handoff language:

> Confirm feedback scope, state priority, tone, live-region behavior, recovery action, dismiss policy, and whether notification history or transient queue behavior is required.
