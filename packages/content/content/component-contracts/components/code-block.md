# Code Block

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/code-block/operational-example.json`
- `packages/content/content/component-copy/components/code-block/anatomy.json`
- `packages/content/content/component-copy/components/code-block/states.json`
- `packages/content/content/component-copy/components/code-block/api-foundations.json`
- `packages/content/content/component-copy/components/code-block/miel.json`

## Purpose

Render documentation source snippets with readable context, governed overflow, optional copy action, and recovery guidance when source validation fails.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Surface`, `Density`, `Focus`, `Disabled`, `Breakpoints`, `Message`

Component dependencies: `Button`, `Badge`, `Tag`, `Inline Validation`

Token dependencies: `comp.code-block.*`, `comp.button.*`, `sys.frame.*`, `sys.surface.*`, `sys.typography.*`, `sys.state.*`, `sys.accessibility.*`

Gaps or review gates:

- The use is an email OTP/security code block.
- Raw pre/code is styled locally after Code Block is available.
- Long content breaks mobile layout.
- Copy feedback is visual-only.
- The snippet lacks context when copied text could be ambiguous.
- Ask before build: The snippet includes secrets, credentials, or private data.
- Ask before build: The source is not validated or has no recovery path.
- Ask before build: The use is an email OTP/security code instead of documentation source.

## Use When

- Use Code Block for commands, API snippets, token paths, and generated source examples.
- Choose wrapping for short examples and scrollable behavior for long source.
- Use Button composition when the snippet is copyable; keep clipboard behavior inside Code Block.

## Do Not Use Without Review

- Ask before use when the snippet includes secrets, credentials, or private data.
- Ask before use when the source is not validated or has no recovery path.
- Ask before use when the use is an email OTP/security code instead of documentation source.
- A docs page styles raw pre/code locally after Code Block exists.
- The snippet has no label or accessible context when multiple snippets are present.
- Copy feedback is visual-only.

## Operational Example

Render documentation source snippets with readable context, governed overflow, optional copy action, and recovery guidance when source validation fails.

### Why Code Block

- The snippet needs source semantics rather than a decorative card.
- Overflow and wrapping must be owned by Flow, not page CSS.
- Copy behavior is owned by Code Block so clipboard feedback remains tied to the snippet source.

Scenario type: `documentation-source`

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| container | Owns snippet surface, border, radius, density, and overflow. | comp.code-block.*, sys.energy.*, sys.frame.* |
| header | Optional metadata row for label, filename, language, helper, and copy action. | sys.voice.*, sys.frame.* |
| code content | Selectable monospace source text with governed wrapping or scroll. | sys.voice.*, sys.accessibility.* |
| copy action | Uses Button for the visible affordance while Code Block owns clipboard behavior. | comp.code-block.*, comp.button.*, sys.state.* |

## Accessibility

- Expose the language, filename, or source label before the snippet when it helps users identify what they are reading.
- Keep code text selectable and readable by assistive technology; do not replace source text with an image.
- When copy is available, pair it with a specific accessible name such as Copy install command.
- Announce copied and error feedback with a recovery action without moving keyboard focus away from the snippet controls.
- Preserve keyboard access to copy controls and keep scrollable code reachable without trapping focus.

## Foundations

Referenced token families:

- `comp.code-block.*`
- `comp.button.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

Code Block exposes snippet content, context labels, density, wrapping, disabled state, and optional Copy Button composition through package props.

## States

Code Block states describe snippet presentation, copy affordance, feedback, and blocked/error conditions without local source wrappers owning behavior.

Supported states from docs: `default`, `wrapped`, `scrollable`, `with-header`, `with-copy`, `copied`, `error`, `disabled`

## API And Foundations

Code Block exposes snippet content, context labels, density, wrapping, disabled state, and optional Copy Button composition through package props.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| code | string | yes | Source text rendered inside the governed code region. |
| label | string | no | Human-readable context for the snippet. |
| copyAction | CodeBlockAction | no | Configures the composed Copy Button when the snippet is copyable. |

## Implementation Checklist

- Provide `code`: Source text rendered inside the governed code region.

## MIEL

Code Block is the governed source presentation component for documentation and generated output.

Agents can decide:

- Use Code Block for commands, API snippets, token paths, and generated source examples.
- Choose wrapping for short examples and scrollable behavior for long source.
- Use Copy Button composition when the snippet is copyable.

Agents must ask:

- The snippet includes secrets, credentials, or private data.
- The source is not validated or has no recovery path.
- The use is an email OTP/security code instead of documentation source.

Agents must reject:

- A docs page styles raw pre/code locally after Code Block exists.
- The snippet has no label or accessible context when multiple snippets are present.
- Copy feedback is visual-only.

Handoff language:

> Use Code Block for source examples and escalate unclear source ownership before rendering.
