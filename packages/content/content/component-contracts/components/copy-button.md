# Copy Button

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/copy-button/operational-example.json`
- `packages/content/content/component-copy/components/copy-button/anatomy.json`
- `packages/content/content/component-copy/components/copy-button/states.json`
- `packages/content/content/component-copy/components/copy-button/api-foundations.json`
- `packages/content/content/component-copy/components/copy-button/miel.json`

## Purpose

Copy one explicit value with a named target, keyboard-accessible activation, and visible success or recovery feedback.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Energy`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Iconography`, `Duration`, `Motion Curves`, `Density`, `Focus`, `Disabled`, `Message`

Component dependencies: `Button`, `Icon Button`, `Inline Validation`, `Tooltip`

Token dependencies: `comp.copy-button.*`, `comp.button.*`, `comp.icon-button.*`, `sys.voice.*`, `sys.state.*`, `sys.message.*`, `sys.accessibility.*`

Gaps or review gates:

- The action copies an unclear or changing value.
- The control has no accessible name.
- Clipboard errors are not exposed.
- The copy action is implemented with local HTML instead of Button or Icon Button semantics.
- State feedback changes layout size unpredictably.
- Ask before build: The copied value is dynamic, private, destructive, or unclear.
- Ask before build: The failure state has no recovery action.
- Ask before build: The copy target competes with another primary action.

## Use When

- Use Copy Button when a single known value should be copied.
- Use icon variant only with a clear accessible name.
- Use inline variant inside metadata rows or code block headers.

## Do Not Use Without Review

- Ask before use when the copied value is dynamic, private, destructive, or unclear.
- Ask before use when the failure state has no recovery action.
- Ask before use when the copy target competes with another primary action.
- The control is a local span, div, or fake button.
- The label does not identify the copied target when several copy controls are visible.
- Clipboard failure is silent.

## Operational Example

Copy one explicit value with a named target, keyboard-accessible activation, and visible success or recovery feedback.

### Why Copy Button

- Clipboard state is shared across docs snippets, metadata, and examples.
- Copy feedback must not be rebuilt as local docs behavior.
- Errors need a recovery message instead of silent failure.

Scenario type: `clipboard-action`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| button root | Uses native Button or Icon Button semantics. | comp.copy-button.*, comp.button.*, comp.icon-button.* |
| label or icon | Names the copied target through visible text or an accessible name. | sys.voice.*, sys.iconography.* |
| feedback | Exposes copied and error states with recovery language. | sys.state.*, sys.tone.* |

## Accessibility

- Use an accessible name that identifies the exact value or snippet being copied.
- Support keyboard activation through the underlying Button or Icon Button control.
- Announce copied, loading, disabled, and error states without relying on icon or color alone.
- Do not use a generic Copy label when multiple copy targets are visible in the same context.
- Keep focus on the copy control after activation so repeated copy or recovery remains predictable.

## Foundations

Referenced token families:

- `comp.button.*`
- `comp.copy-button.*`
- `comp.icon-button.*`
- `sys.iconography.*`
- `sys.state.*`
- `sys.tone.*`
- `sys.voice.*`

Copy Button exposes one explicit value, accessible naming, feedback timing, state, density, and clipboard callbacks through package props.

## States

Copy Button states make clipboard availability, activation, feedback, and failure explicit while delegating control styling to Button or Icon Button semantics.

Supported states from docs: `default`, `hover`, `focus`, `pressed`, `copied`, `error`, `disabled`, `loading`

## API And Foundations

Copy Button exposes one explicit value, accessible naming, feedback timing, state, density, and clipboard callbacks through package props.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| value | string | yes | Exact value written to the clipboard. |
| label | string | conditional | Visible text for text and inline variants. |
| ariaLabel | string | conditional | Required when the visible label is absent or ambiguous. |

## Implementation Checklist

- Provide `value`: Exact value written to the clipboard.

## MIEL

Copy Button owns clipboard affordance, naming, and feedback across Flow.

Agents can decide:

- Use Copy Button when a single known value should be copied.
- Use icon variant only with a clear accessible name.
- Use inline variant inside metadata rows or code block headers.

Agents must ask:

- The copied value is dynamic, private, destructive, or unclear.
- The failure state has no recovery action.
- The copy target competes with another primary action.

Agents must reject:

- The control is a local span, div, or fake button.
- The label does not identify the copied target when several copy controls are visible.
- Clipboard failure is silent.

Handoff language:

> Name the copy target and preserve error recovery before adding a copy action.
