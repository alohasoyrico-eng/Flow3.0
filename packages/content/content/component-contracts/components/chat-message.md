# Chat Message

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/chat-message/all.json`
- `packages/content/content/component-copy/components/chat-message/states.json`

## Purpose

Render one governed conversational message with author context, delivery state, optional avatar, timestamp, and recovery action.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Message`, `Surface`, `Typography`, `Spacing`, `Radius`, `Density`, `Focus`, `Iconography`

Component dependencies: `None declared`

Token dependencies: `comp.chat-message.*`, `message.*`, `surface.*`, `sys.voice.*`, `sys.tone.*`, `sys.state.*`, `sys.accessibility.*`, `sys.density.*`

Gaps or review gates:

- Message bubble is authored with Card.
- Message lacks author context.
- Failed state has no accessible announcement.
- Raw DOM chat bubble appears in pattern or template.
- Ask before build: The message becomes a thread, inbox, or support workflow.
- Ask before build: The body includes regulated or irreversible instructions.

## Use When

- Use Chat Message for one rendered message in a formal conversation.
- Use when author, delivery state, and recovery action must remain explicit.
- Use inside Chat Thread or a governed conversational pattern.

## Do Not Use Without Review

- Ask before use when the message becomes a thread, inbox, or support workflow.
- Ask before use when the body includes regulated or irreversible instructions.
- The message becomes a thread, inbox, or support workflow.
- The body includes regulated or irreversible instructions.
- A raw chat bubble, Card shell, or authorless message is requested.

## Operational Example

Render one governed conversational message with author context, delivery state, optional avatar, timestamp, and recovery action.

### Why chat-message

- Keeps component behavior package-owned.
- Preserves foundation and primitive cascade.
- Avoids local visual or workflow duplication.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Message container | Owns author alignment, density, live-region role, and state attributes. | comp.chat-message.*, message.*, sys.state.* |
| Avatar slot | Optional Avatar for non-user identity; never required for meaning. | comp.avatar.*, sys.symbol.* |
| Bubble surface | Uses Surface for shape and tone without Card behavior. | surface.*, sys.depth.* |
| Message copy | Uses Message, Voice, and Tone for body, metadata, and recovery. | message.*, sys.voice.*, sys.tone.* |
| Recovery action | Optional Button for retry or related action. | comp.button.*, sys.accessibility.* |

## Accessibility

State precedence: failed > loading > sending > delivered > sent > default

- Keep visible labels and accessible names aligned.
- Expose machine-readable state through props and data attributes.
- Do not rely on color, symbol, or placeholder text alone.
- Preserve keyboard, focus, disabled, loading, and recovery behavior.

## Foundations

Referenced token families:

- `comp.avatar.*`
- `comp.button.*`
- `comp.chat-message.*`
- `message.*.*`
- `surface.*.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

chat-message API exposes semantic props while Flow foundations own state, density, tone, frame, and accessibility.

## Variants

chat-message variants stay semantic and do not fork visual contracts.

Approved variants from demos: `user`, `agent`, `system`, `assistant`

Demo labels:

- user
- agent
- system
- assistant

## States

Chat Message states expose delivery, recovery, and loading meaning through Message, Surface, Tone, Voice, and State instead of raw chat bubble styling.

Supported states from docs: `default`, `sending`, `sent`, `delivered`, `failed`, `loading`

## Playground

Use the playground to verify chat-message state, density, labels, and callback behavior.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| author | text |  |  |
| body | text |  |  |
| state | text |  |  |
| tone | text |  |  |
| timestamp | text |  |  |

## Guidelines

### do

- Use Chat Message for one rendered message in a formal conversation.
- Use when author, delivery state, and recovery action must remain explicit.
- Use inside Chat Thread or a governed conversational pattern.

### dont

- The message becomes a thread, inbox, or support workflow.
- The body includes regulated or irreversible instructions.
- A raw chat bubble, Card shell, or authorless message is requested.

### items

- Confirm the component remains atomic.
- Confirm symbols and tone have visible text fallback.
- Confirm patterns/templates compose this component through Flow APIs.

## API And Foundations

chat-message API exposes semantic props while Flow foundations own state, density, tone, frame, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| author | user \| agent \| system \| assistant | No | Author role. |
| body | string | No | Visible message body. |
| state | default \| sending \| sent \| delivered \| failed \| loading | No | Delivery or loading state. |
| tone | neutral \| info \| success \| warning \| danger | No | Semantic tone. |
| timestamp | string | No | Visible time metadata. |
| action | ChatMessageAction | No | Optional recovery action. |

## Implementation Checklist

- Set `author` as a documented control.
- Set `body` as a documented control.
- Set `state` as a documented control.
- Set `tone` as a documented control.
- Set `timestamp` as a documented control.
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

- The message becomes a thread, inbox, or support workflow.
- The body includes regulated or irreversible instructions.
- A raw chat bubble, Card shell, or authorless message is requested.

## MIEL

Agents may use Chat Message as an atom of a governed conversation; they must not create local chat bubbles.

Agents can decide:

- Use Chat Message for one rendered message in a formal conversation.
- Use when author, delivery state, and recovery action must remain explicit.
- Use inside Chat Thread or a governed conversational pattern.

Agents must ask:

- The message becomes a thread, inbox, or support workflow.
- The body includes regulated or irreversible instructions.

Agents must reject:

- The message becomes a thread, inbox, or support workflow.
- The body includes regulated or irreversible instructions.
- A raw chat bubble, Card shell, or authorless message is requested.

Handoff language:

> I am using chat-message through the Flow component contract and need confirmation for product copy, state ownership, and escalation boundaries.
