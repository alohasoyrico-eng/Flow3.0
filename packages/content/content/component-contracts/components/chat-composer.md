# Chat Composer

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/chat-composer/all.json`
- `packages/content/content/component-copy/components/chat-composer/states.json`

## Purpose

Collect a support or assistant message with visible label, controlled value, send action, optional attachment, and recoverable validation.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Message`, `Surface`, `Field Action`, `Typography`, `Spacing`, `Density`, `Focus`, `Loading`, `Disabled`, `Iconography`

Component dependencies: `None declared`

Token dependencies: `comp.chat-composer.*`, `message.*`, `surface.*`, `field-action.*`, `sys.state.*`, `sys.accessibility.*`, `sys.density.*`

Gaps or review gates:

- Composer uses raw textarea shell.
- Send button enables empty submission.
- Field contract is bypassed.
- Sending clears value before callback resolves.
- Ask before build: The flow needs full thread orchestration, escalation, or channel routing.
- Ask before build: The message contains regulated or irreversible content.

## Use When

- Use Chat Composer for one conversational message entry.
- Use when controlled/uncontrolled value, sending state, and send callback must be explicit.
- Use inside a formal conversational pattern or template, not as a standalone chat workflow.

## Do Not Use Without Review

- Ask before use when the flow needs full thread orchestration, escalation, or channel routing.
- Ask before use when the message contains regulated or irreversible content.
- The flow needs full thread orchestration, escalation, or channel routing.
- The message contains regulated or irreversible content.
- A custom textarea, fake send button, or local attachment shell is requested.

## Operational Example

Collect a support or assistant message with visible label, controlled value, send action, optional attachment, and recoverable validation.

### Why chat-composer

- Keeps component behavior package-owned.
- Preserves foundation and primitive cascade.
- Avoids local visual or workflow duplication.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Composer surface | Composes Surface as the form boundary without creating a Card shell. | surface.*, sys.frame.* |
| Message field | Composes Text Area and Field Action for multiline input and helper/error copy. | field-action.*, message.*, sys.accessibility.* |
| Send action | Composes Button and blocks empty or disabled submission. | comp.button.*, sys.state.* |
| Attachment action | Optional Icon Button for governed attachment behavior. | comp.icon-button.*, sys.iconography.* |

## Accessibility

State precedence: disabled > sending > error > focus > filled > default

- Keep visible labels and accessible names aligned.
- Expose machine-readable state through props and data attributes.
- Do not rely on color, symbol, or placeholder text alone.
- Preserve keyboard, focus, disabled, loading, and recovery behavior.

## Foundations

Referenced token families:

- `comp.button.*`
- `comp.icon-button.*`
- `field-action.*.*`
- `message.*.*`
- `surface.*.*`
- `sys.accessibility.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.state.*`

chat-composer API exposes semantic props while Flow foundations own state, density, tone, frame, and accessibility.

## Variants

chat-composer variants stay semantic and do not fork visual contracts.

Approved variants from demos: `basic`, `with-attachment`, `sending`

Demo labels:

- basic
- with-attachment
- sending

## States

Chat Composer states preserve the shared Field, Message, Surface, Button, and State cascade while keeping message entry controlled or uncontrolled.

Supported states from docs: `default`, `focus`, `filled`, `sending`, `disabled`, `error`

## Playground

Use the playground to verify chat-composer state, density, labels, and callback behavior.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text |  |  |
| value | text |  |  |
| defaultValue | text |  |  |
| placeholder | text |  |  |
| sending | boolean |  |  |

## Guidelines

### do

- Use Chat Composer for one conversational message entry.
- Use when controlled/uncontrolled value, sending state, and send callback must be explicit.
- Use inside a formal conversational pattern or template, not as a standalone chat workflow.

### dont

- The flow needs full thread orchestration, escalation, or channel routing.
- The message contains regulated or irreversible content.
- A custom textarea, fake send button, or local attachment shell is requested.

### items

- Confirm the component remains atomic.
- Confirm symbols and tone have visible text fallback.
- Confirm patterns/templates compose this component through Flow APIs.

## API And Foundations

chat-composer API exposes semantic props while Flow foundations own state, density, tone, frame, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible composer label. |
| value | string | No | Controlled message value. |
| defaultValue | string | No | Uncontrolled initial value. |
| helper | string | false |  |
| sending | boolean | No | Locks the composer while submit is in progress. |
| error | string | No | Visible recovery copy. |
| density | "sm" \| "md" \| "lg" | false |  |
| state | "default" \| "focus" \| "filled" \| "sending" \| "disabled" \| "error" | false |  |
| sendLabel | string | false |  |
| attachLabel | string | false |  |
| onValueChange | (value, meta, event) => void | No | Controlled value callback with metadata and event. |
| onSend | (value, event) => void | No | Submit callback. |
| onAttach | (event: MouseEvent<HTMLButtonElement>) => void | false |  |

## Implementation Checklist

- Provide `label`: Visible composer label.
- State precedence
- Density cascade
- Accessible label and recovery association
- Controlled/uncontrolled behavior when applicable
- No local visual shell duplication

## Tests And Rejection Rules

Must test:

- State precedence
- Density cascade
- Accessible label and recovery association
- Controlled/uncontrolled behavior when applicable
- No local visual shell duplication

Reject if:

- The flow needs full thread orchestration, escalation, or channel routing.
- The message contains regulated or irreversible content.
- A custom textarea, fake send button, or local attachment shell is requested.

## MIEL

Agents may compose Chat Composer only as message entry inside a governed conversation owner.

Agents can decide:

- Use Chat Composer for one conversational message entry.
- Use when controlled/uncontrolled value, sending state, and send callback must be explicit.
- Use inside a formal conversational pattern or template, not as a standalone chat workflow.

Agents must ask:

- The flow needs full thread orchestration, escalation, or channel routing.
- The message contains regulated or irreversible content.

Agents must reject:

- The flow needs full thread orchestration, escalation, or channel routing.
- The message contains regulated or irreversible content.
- A custom textarea, fake send button, or local attachment shell is requested.

Handoff language:

> I am using chat-composer through the Flow component contract and need confirmation for product copy, state ownership, and escalation boundaries.
