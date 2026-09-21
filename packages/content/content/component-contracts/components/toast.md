# Toast

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/toast/operational-example.json`
- `packages/content/content/component-copy/components/toast/anatomy.json`
- `packages/content/content/component-copy/components/toast/accessibility.json`
- `packages/content/content/component-copy/components/toast/variants.json`
- `packages/content/content/component-copy/components/toast/states.json`
- `packages/content/content/component-copy/components/toast/variant-state-behavior.json`
- `packages/content/content/component-copy/components/toast/full-width.json`
- `packages/content/content/component-copy/components/toast/responsive-layout-patterns.json`
- `packages/content/content/component-copy/components/toast/viewport-organization.json`
- `packages/content/content/component-copy/components/toast/playground.json`
- `packages/content/content/component-copy/components/toast/guidelines.json`
- `packages/content/content/component-copy/components/toast/api-foundations.json`
- `packages/content/content/component-copy/components/toast/tests-rejection-rules.json`
- `packages/content/content/component-copy/components/toast/miel.json`

## Purpose

Use Toast for short, non-blocking feedback after a user or system event: saved changes, sync status, export progress, undo, offline recovery, or a recoverable error.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`, `Density`

Component dependencies: `None declared`

Token dependencies: `comp.toast.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.depth.*`, `sys.momentum.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- Blocking decision
- Field validation replacement
- More than one action
- Fake controls
- Raw visual values
- Ask before build: The user must make a decision before continuing.
- Ask before build: The message needs to persist, explain policy, or guide field-level recovery.
- Ask before build: Multiple toasts could stack, queue, or conflict with navigation and primary actions.

## Use When

- Use Toast for saved, synced, exported, offline, undo, or recoverable error events.
- Choose status role for neutral, info, and success; alert role only for urgent warning or danger.
- Include at most one short action when it directly undoes or retries the event.

## Do Not Use Without Review

- Ask before use when the user must make a decision before continuing.
- Ask before use when the message needs to persist, explain policy, or guide field-level recovery.
- Ask before use when multiple toasts could stack, queue, or conflict with navigation and primary actions.
- Toast replaces Dialog, Alert Strip, Inline Validation, or Empty State.
- Toast contains long instructions or more than one action.
- Dismiss, action, timer, or live-region behavior is not defined.
- Toast asks for a required decision.
- Toast replaces inline validation or field-level recovery.
- Toast contains more than one action.
- Dismiss or action controls do not work.
- Toast uses raw color, shadow, spacing, or duration values.

## Operational Example

Use Toast for short, non-blocking feedback after a user or system event: saved changes, sync status, export progress, undo, offline recovery, or a recoverable error.

### Why Toast

- Toast confirms or explains a recent event without blocking the task.
- The ZIP reference confirms an inverse surface, compact rounded frame, severity icon, optional single action, and dismiss control; Flow governs color, typography, density, elevation, and live-region semantics.
- The base message should work as one concise line; supporting description is optional and only explains consequence or recovery.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Owns live region, surface, severity tone, elevation, spacing, and placement. | comp.toast.*, sys.energy.*, sys.depth.*, sys.frame.* |
| Icon | Communicates severity or event type without replacing text. | sys.symbol.*, sys.iconography.*, sys.tone.* |
| Message | Names the event in one concise sentence. | sys.voice.*, sys.tone.* |
| Description | Adds optional recovery or consequence copy. | sys.voice.* |
| Action and dismiss | Use Flow Button for the optional action and Flow Icon Button for dismiss; expose them only when behavior exists. | sys.accessibility.*, sys.state.*, sys.momentum.* |

## Accessibility

State precedence: exiting, action, visible, stacked, default

- Use role status for neutral, info, and success feedback.
- Use role alert only for urgent warning or danger messages that need immediate attention.
- Do not move focus to a toast unless the user triggered an explicit action inside it.
- Keep dismiss and action controls keyboard reachable when present.
- Do not use Toast for blocking decisions; use Dialog for required confirmation.

## Foundations

Referenced token families:

- `comp.toast.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

Toast API exposes message, description, tone, variant, lifecycle state, optional action, dismiss behavior, and live-region priority while Design System foundations own severity language, elevation, motion, timing, and accessibility. Width is intrinsic, bounded by the host and the shared Toast maximum. There are no narrow/wide variants: concise content yields a compact toast; longer copy or one action grows it within that bound. Density changes control, spacing and type scale, not placement or width mode. Action and dismiss stay beside the message; use a short action label. Longer workflows belong in persistent feedback or Dialog.

## Variants

Toast variants describe the feedback job: status confirmation, progress update, recovery path, warning, and undo.

Approved variants from demos: `status`, `progress`, `warning`, `recovery`, `undo`

Demo labels:

- Unidad asignada a Ana Sosa.
- Report is processing.
- Connection is unstable.
- Vehicle sync failed.
- Driver removed.

## States

Toast states are event driven: default is not mounted, visible announces the event, action exposes a short recovery, stacked groups multiple messages, and exiting removes the toast with motion.

Supported states from docs: `visible`, `action`, `stacked`, `exiting`, `default`

## Variant X State Behavior

Variant defines the feedback job; state defines lifecycle and available controls. Toast does not block the process or replace inline validation.

State matrix: `visible`, `action`, `stacked`, `exiting`, `default`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Status | status |  |
| Recovery | recovery |  |
| Undo | undo |  |

## Full Width

Toast uses a full-width feedback region while each toast keeps a readable max width. The region controls edge alignment; the toast itself does not become a page-width banner.

- End-aligned region: layout: full-width region
- Start-aligned region: layout: full-width region
- Centered safe region: layout: full-width region

## Responsive Layout Patterns

Responsive Toast keeps placement predictable: bottom on phones, corner on desktop, and never covering persistent navigation, primary actions, or required form feedback.

| Example | Layout | Density |
| --- | --- | --- |
| Phone bottom feedback | simple-demo-row | lg |
| Desktop corner stack | simple-demo-row | sm |

## Viewport Organization

Place Toast where it can be noticed without stealing the task. If feedback must stay near a field or row, use inline validation or an alert strip instead.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use bottom placement above nav and keep one toast visible at a time. | bottom safe-area | lg |
| Tablet | Use corner placement only when it does not cover sheets or primary actions. | corner stack | md |
| Desktop | Use top-right or bottom-right stack for non-blocking dashboard feedback. | desktop stack | sm |

## Playground

Use the playground to verify severity, message length, optional description, action, dismiss behavior, and live-region role before using Toast in a system.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Card limit updated. |  |
| description | text | Changes are live for assigned drivers. |  |
| tone | select | success | neutral, info, success, warning, danger |
| variant | select | status | status, progress, warning, recovery, undo |
| state | select | visible | default, visible, action, stacked, exiting |
| dismissible | checkbox | true |  |

## API And Foundations

Toast API exposes message, description, tone, variant, lifecycle state, optional action, dismiss behavior, and live-region priority while Design System foundations own severity language, elevation, motion, timing, and accessibility. Width is intrinsic, bounded by the host and the shared Toast maximum. There are no narrow/wide variants: concise content yields a compact toast; longer copy or one action grows it within that bound. Density changes control, spacing and type scale, not placement or width mode. Action and dismiss stay beside the message; use a short action label. Longer workflows belong in persistent feedback or Dialog.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Toast title. |
| description | string | No | Toast body copy. |
| tone | ToastTone | No | Semantic announcement tone. |
| variant | ToastVariant | No | Feedback job: status, progress, warning, recovery, or undo. |
| state | ToastState | No | Lifecycle state: default, visible, action, stacked, or exiting. |
| density | Density | No | Shared sm/md/lg scale for controls, spacing, icons and typography; not a narrow/wide or desktop/mobile selector. |
| icon | string | No | Optional Material Symbol override; defaults from tone. |
| actionLabel | string | No | One short verb beside the message (for example Deshacer or Reintentar), rendered only with onAction; never a separate footer. |
| dismissible | boolean | No | Shows dismiss control. |
| onDismissChange | (dismissed: boolean, event?: MouseEvent<HTMLButtonElement>) => void | No | Called after manual dismiss or duration expiry. |
| duration | number | No | Optional auto-dismiss duration in milliseconds; pauses on hover or focus inside. |
| dismissed | boolean | No | Controlled hidden state for parent-owned lifecycle. |
| dismissLabel | string | No | Accessible label for the dismiss control. |
| onAction | () => void | No | Called when the toast action is selected. |
| onDismiss | () => void | No | Called when the toast is dismissed. |

## Implementation Checklist

- Provide `label`: Toast title.
- Status and alert roles match severity
- Dismiss button removes the toast
- Optional action is keyboard reachable
- Exiting motion respects reduced motion
- Stacking does not cover primary actions
- Copy remains short and non-blocking
- Density changes control, padding, icon and text scale without selecting a width mode
- Duration pauses on hover and focus
- Auto-dismiss does not steal focus
- Dismiss remains square and contrast-readable on inverse surface during hover, press and focus in light/dark
- Action stays beside message at constrained host widths; content does not overflow
- Short messages shrink to content and longer messages respect host and Toast maximum width

## Tests And Rejection Rules

Must test:

- Status and alert roles match severity
- Dismiss button removes the toast
- Optional action is keyboard reachable
- Exiting motion respects reduced motion
- Stacking does not cover primary actions
- Copy remains short and non-blocking
- Density changes control, padding, icon and text scale without selecting a width mode
- Duration pauses on hover and focus
- Auto-dismiss does not steal focus
- Dismiss remains square and contrast-readable on inverse surface during hover, press and focus in light/dark
- Action stays beside message at constrained host widths; content does not overflow
- Short messages shrink to content and longer messages respect host and Toast maximum width

Reject if:

- Toast asks for a required decision.
- Toast replaces inline validation or field-level recovery.
- Toast contains more than one action.
- Dismiss or action controls do not work.
- Toast uses raw color, shadow, spacing, or duration values.

## MIEL

MIEL treats Toast as event feedback, not a task surface: agents can use it for short non-blocking confirmation or recovery while humans confirm severity, persistence, queue rules, and whether feedback belongs inline instead.

Agents can decide:

- Use Toast for saved, synced, exported, offline, undo, or recoverable error events.
- Choose status role for neutral, info, and success; alert role only for urgent warning or danger.
- Include at most one short action when it directly undoes or retries the event.

Agents must ask:

- The user must make a decision before continuing.
- The message needs to persist, explain policy, or guide field-level recovery.
- Multiple toasts could stack, queue, or conflict with navigation and primary actions.

Agents must reject:

- Toast replaces Dialog, Alert Strip, Inline Validation, or Empty State.
- Toast contains long instructions or more than one action.
- Dismiss, action, timer, or live-region behavior is not defined.

Handoff language:

> I am using Toast for non-blocking event feedback. I need confirmation on severity, role, duration, placement, queue behavior, and whether the message should be inline instead.
