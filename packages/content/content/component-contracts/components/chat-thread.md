# Chat Thread

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/chat-thread/all.json`
- `packages/content/content/component-copy/components/chat-thread/states.json`

## Purpose

Render a governed conversation log from Chat Message records with empty, loading, offline, error, selected-message, and handoff states.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Message`, `Surface`, `Typography`, `Spacing`, `Density`, `Focus`, `Loading`

Component dependencies: `None declared`

Token dependencies: `comp.chat-thread.*`, `message.*`, `surface.*`, `sys.state.*`, `sys.accessibility.*`, `sys.density.*`

Gaps or review gates:

- Thread renders raw message markup.
- Thread owns composer behavior.
- Thread uses Card as a grouping shell.
- Unavailable state lacks recovery copy.
- Ask before build: The thread also owns composer, channel routing, or support escalation.
- Ask before build: The log must support regulated audit retention.

## Use When

- Use Chat Thread for a governed conversational log.
- Use when messages, availability state, selected message, and message actions must be explicit.
- Use below a formal conversational pattern/template that owns composer and routing.

## Do Not Use Without Review

- Ask before use when the thread also owns composer, channel routing, or support escalation.
- Ask before use when the log must support regulated audit retention.
- The thread also owns composer, channel routing, or support escalation.
- The log must support regulated audit retention.
- A template tries to render raw message markup directly.

## Operational Example

Render a governed conversation log from Chat Message records with empty, loading, offline, error, selected-message, and handoff states.

### Why chat-thread

- Keeps component behavior package-owned.
- Preserves foundation and primitive cascade.
- Avoids local visual or workflow duplication.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Thread surface | Composes Surface as the labelled log boundary. | surface.*, sys.accessibility.* |
| Message list | Renders ordered Chat Message records without raw message shells. | comp.chat-thread.*, message.* |
| Unavailable state | Composes Empty State for empty, loading, offline, error, or handoff recovery. | comp.empty-state.*, sys.state.* |
| Selection marker | Uses Focus and State for selected message review. | focus.*, sys.state.* |

## Accessibility

State precedence: error > offline > loading > handoff > empty > default

- Keep visible labels and accessible names aligned.
- Expose machine-readable state through props and data attributes.
- Do not rely on color, symbol, or placeholder text alone.
- Preserve keyboard, focus, disabled, loading, and recovery behavior.

## Foundations

Referenced token families:

- `comp.chat-thread.*`
- `comp.empty-state.*`
- `focus.*.*`
- `message.*.*`
- `surface.*.*`
- `sys.accessibility.*`
- `sys.state.*`

chat-thread API exposes semantic props while Flow foundations own state, density, tone, frame, and accessibility.

## Variants

chat-thread variants stay semantic and do not fork visual contracts.

Approved variants from demos: `message-list`, `empty`, `error`, `handoff`, `offline`

Demo labels:

- Message-list
- Empty
- Error
- Handoff
- Offline

## States

Chat Thread states keep the log, empty, loading, offline, error, and handoff boundaries owned by Flow components and primitives.

Supported states from docs: `default`, `loading`, `empty`, `error`, `handoff`, `offline`

## Playground

Use the playground to verify chat-thread state, density, labels, and callback behavior.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text |  |  |
| messages | text |  |  |
| state | text |  |  |
| selectedMessageKey | text |  |  |
| onMessageAction | text |  |  |

## Guidelines

### do

- Use Chat Thread for a governed conversational log.
- Use when messages, availability state, selected message, and message actions must be explicit.
- Use below a formal conversational pattern/template that owns composer and routing.

### dont

- The thread also owns composer, channel routing, or support escalation.
- The log must support regulated audit retention.
- A template tries to render raw message markup directly.

### items

- Confirm the component remains atomic.
- Confirm symbols and tone have visible text fallback.
- Confirm patterns/templates compose this component through Flow APIs.

## API And Foundations

chat-thread API exposes semantic props while Flow foundations own state, density, tone, frame, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | No | Accessible thread label. |
| description | string | false |  |
| messages | ChatThreadMessage[] | No | Governed message records. |
| empty | ChatThreadEmptyState | false |  |
| error | ChatThreadEmptyState | false |  |
| state | default \| loading \| empty \| error \| handoff \| offline | No | Thread availability state. |
| density | "sm" \| "md" \| "lg" | false |  |
| selectedMessageKey | string | No | Selected message key. |
| onMessageAction | (key, event) => void | No | Recovery action callback. |

## Implementation Checklist

- Set `label` as a documented control.
- Set `messages` as a documented control.
- Set `state` as a documented control.
- Set `selectedMessageKey` as a documented control.
- Set `onMessageAction` as a documented control.
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

- The thread also owns composer, channel routing, or support escalation.
- The log must support regulated audit retention.
- A template tries to render raw message markup directly.

## MIEL

Agents may compose Chat Thread for the log only; composer/routing belongs to a higher conversation owner.

Agents can decide:

- Use Chat Thread for a governed conversational log.
- Use when messages, availability state, selected message, and message actions must be explicit.
- Use below a formal conversational pattern/template that owns composer and routing.

Agents must ask:

- The thread also owns composer, channel routing, or support escalation.
- The log must support regulated audit retention.

Agents must reject:

- The thread also owns composer, channel routing, or support escalation.
- The log must support regulated audit retention.
- A template tries to render raw message markup directly.

Handoff language:

> I am using chat-thread through the Flow component contract and need confirmation for product copy, state ownership, and escalation boundaries.
