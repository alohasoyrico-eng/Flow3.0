# Input Amount

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/input-amount/all.json`
- `packages/content/content/component-copy/components/input-amount/states.json`

## Purpose

Capture one monetary amount with visible currency context, native input semantics, helper or recovery copy, and the shared Flow field cascade.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Focus`, `Disabled`, `Duration`, `Motion Curves`, `Iconography`, `Loading`, `Message`, `Measurement`, `Density`

Component dependencies: `None declared`

Token dependencies: `comp.input-amount.*`, `comp.input.*`, `component-field-*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`, `sys.density.*`

Gaps or review gates:

- No visible label
- No currency context
- Raw field wrapper
- Custom payment shell
- Ask before build: The flow collects full payment credentials or multiple financial fields.
- Ask before build: The amount changes regulated, irreversible, or safety-critical outcomes.

## Use When

- Use Input Amount for one monetary entry.
- Use inside Form Section, Payment Form, wallet, or operational templates.
- Use when currency context and validation must remain visible.

## Do Not Use Without Review

- Ask before use when the flow collects full payment credentials or multiple financial fields.
- Ask before use when the amount changes regulated, irreversible, or safety-critical outcomes.
- The flow collects full payment credentials or multiple financial fields.
- The amount changes regulated, irreversible, or safety-critical outcomes.
- A custom field shell or Card wrapper is requested.

## Operational Example

Capture one monetary amount with visible currency context, native input semantics, helper or recovery copy, and the shared Flow field cascade.

### Why input-amount

- Keeps component behavior package-owned.
- Preserves foundation and primitive cascade.
- Avoids local visual or workflow duplication.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Field root | Uses the shared field CSS contract and input-amount extension root. | component-field-*, comp.input-amount.* |
| Label | Names the monetary value. | sys.voice.*, sys.accessibility.* |
| Currency context | Shows currency without replacing the label. | sys.symbol.*, sys.voice.* |
| Native input | Keeps decimal input semantics and paste behavior. | sys.frame.*, sys.state.* |
| Helper or error | Explains limits, format, or recovery. | sys.tone.*, sys.voice.* |

## Accessibility

State precedence: disabled > loading > error > filled > default

- Keep visible labels and accessible names aligned.
- Expose machine-readable state through props and data attributes.
- Do not rely on color, symbol, or placeholder text alone.
- Preserve keyboard, focus, disabled, loading, and recovery behavior.

## Foundations

Referenced token families:

- `comp.input-amount.*`
- `sys.accessibility.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

input-amount API exposes semantic props while Flow foundations own state, density, tone, frame, and accessibility.

## Variants

input-amount variants stay semantic and do not fork visual contracts.

Approved variants from demos: `default`

Demo labels:

- default

## States

Input Amount states remain inside the shared field cascade: currency context is visible, recovery copy is textual, and Surface ownership stays outside the field.

Supported states from docs: `default`, `filled`, `loading`, `error`, `disabled`

## Playground

Use the playground to verify input-amount state, density, labels, and callback behavior.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text |  |  |
| value | text |  |  |
| defaultValue | text |  |  |
| currency | text |  |  |
| locale | text |  |  |

## Guidelines

### do

- Use Input Amount for one monetary entry.
- Use inside Form Section, Payment Form, wallet, or operational templates.
- Use when currency context and validation must remain visible.

### dont

- The flow collects full payment credentials or multiple financial fields.
- The amount changes regulated, irreversible, or safety-critical outcomes.
- A custom field shell or Card wrapper is requested.

### items

- Confirm the component remains atomic.
- Confirm symbols and tone have visible text fallback.
- Confirm patterns/templates compose this component through Flow APIs.

## API And Foundations

input-amount API exposes semantic props while Flow foundations own state, density, tone, frame, and accessibility.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Visible amount label. |
| value | string | No | Controlled amount value. |
| currency | string | No | Visible currency code. |
| locale | string \| string[] | No | Consumer-supplied formatting locale. |
| placeholder | string | No | Consumer-supplied format mask. |
| error | string | No | Visible recovery copy. |
| onValueChange | (value, meta, event) => void | No | Value callback with amount metadata. |
| disabled | boolean | false | disabled prop. |
| name | string | false | name prop. |
| required | boolean | false | required prop. |
| density | "sm" \| "md" \| "lg" | false | density prop. |
| helper | string | false | helper prop. |
| helperText | string | false | helperText prop. |
| loading | boolean | false | loading prop. |
| prefix | string | false | prefix prop. |
| state | "default" \| "filled" \| "loading" \| "error" \| "disabled" | false | state prop. |
| suffix | string | false | suffix prop. |
| validationMessage | string | false | validationMessage prop. |

## Implementation Checklist

- Provide `label`: Visible amount label.
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

- The flow collects full payment credentials or multiple financial fields.
- The amount changes regulated, irreversible, or safety-critical outcomes.
- A custom field shell or Card wrapper is requested.

## MIEL

Agents may use Input Amount for one monetary entry and must escalate grouped payment behavior to a pattern.

Agents can decide:

- Use Input Amount for one monetary entry.
- Use inside Form Section, Payment Form, wallet, or operational templates.
- Use when currency context and validation must remain visible.

Agents must ask:

- The flow collects full payment credentials or multiple financial fields.
- The amount changes regulated, irreversible, or safety-critical outcomes.

Agents must reject:

- The flow collects full payment credentials or multiple financial fields.
- The amount changes regulated, irreversible, or safety-critical outcomes.
- A custom field shell or Card wrapper is requested.

Handoff language:

> I am using input-amount through the Flow component contract and need confirmation for product copy, state ownership, and escalation boundaries.
