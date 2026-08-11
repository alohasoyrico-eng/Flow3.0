# Payment Form

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/payment-form/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/payment-form.json`

## Purpose

Coordinate card-number, expiry, security-code, amount, validation, feedback, and payment actions without creating a parallel Field or Card shell.

## Use When

- A flow must collect or review payment-card details.
- Card number, expiry, security code, and optional amount need one submit contract.
- Payment feedback must remain owned by Flow feedback components and patterns.

## Do Not Use Without Review

- The flow stores regulated payment credentials.
- Payment is only a summary card with no credential capture.
- A template already owns the broader card workspace and only needs display modules.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Field labels, input modes, reveal controls, grouped validation, and actions keep formal semantics. |
| Depth | Surface owns structural grouping without turning the payment group into a Card. |
| Energy | Validity, disabled, error, and warning states inherit component tone contracts. |
| Frame | Field spacing, density, and responsive grouping cascade from Surface and field components. |
| Growth | Payment state and field metadata remain observable without moving behavior into a template. |
| Iconography | Card and security icons remain owned by their inputs. |
| Momentum | Loading and focus motion stay tokenized through field and action components. |
| State | Default, review, success, loading, error, and disabled states cascade to every child. |
| Symbol | Payment symbols support recognition without replacing labels; text remains required for field, validation, and action meaning. |
| Tone | Payment feedback maps to validation, error, success, warning, and recovery semantics. |
| Voice | Field helper, validation, and feedback copy remains visible and recoverable. |

## Formal Purpose

Coordinate card-number, expiry, security-code, amount, validation, feedback, and payment actions without creating a parallel Field or Card shell.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `default`
- `review`
- `success`
- `loading`
- `error`
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
- `Field Action`
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
- `Card Number Input`
- `Card Expiry Input`
- `Card Security Code Input`
- `Inline Validation`
- `Input Amount`

### Patterns

- `Status Feedback View`

### Tokens

- `comp.button.*`
- `comp.card-number-input.*`
- `comp.card-expiry-input.*`
- `comp.card-security-code-input.*`
- `comp.inline-validation.*`
- `comp.input-amount.*`
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
| `paymentSurface` | `primitive` | `Surface` |
| `cardFields` | `component` | `Card Number Input`, `Card Expiry Input`, `Card Security Code Input` |
| `amountFields` | `component` | `Input Amount` |
| `validation` | `component` | `Inline Validation` |
| `statusFeedback` | `pattern` | `Status Feedback View` |
| `actions` | `component` | `Button` |

## Formal Governance

### Entry Conditions

- A flow must collect or review payment-card details.
- Card number, expiry, security code, and optional amount must share one validation and submit contract.
- Payment feedback must route to a formal Flow feedback owner.

### Decision Tree

- Use card input components for card number, expiry, and security code.
- Use Input Amount only when the payment task includes an amount or limit.
- Use Inline Validation for grouped recoverable guidance.
- Use Status Feedback View for blocking, transient, or post-submit payment feedback.
- Use a template when payment is only one module inside a larger card workspace.

### Failure Modes

- A local Field wrapper reimplements card input behavior.
- The payment group is wrapped in Card instead of Surface.
- Security-code reveal behavior is recreated outside Card Security Code Input.
- Payment errors are color-only or bypass Status Feedback View.

### Success Metrics

- Every field preserves its component-owned label, helper, validation, density, and state behavior.
- Callbacks return field-specific metadata for card number, expiry, security code, and amount.
- Submit and secondary actions stay explicit Button commands.
- Payment feedback cascades through Status Feedback View.

### Accessibility

- Expose the payment form as a labelled group.
- Delegate field labels, autocomplete, input modes, describedby, invalid state, and reveal controls to field components.
- Keep grouped validation visible and optionally live.
- Keep submit and secondary actions as Button controls.

### Tests

- Composes Surface, card inputs, Input Amount, Inline Validation, Button, and Status Feedback View.
- Covers default, review, success, loading, error, and disabled states.
- Field callbacks preserve metadata and event context.
- Reject Card wrappers, raw inputs, raw buttons, or local field shells.

### Agent Instructions

- Do not create PaymentField, CardInputGroup, or Card-wrapped payment shells.
- Keep Field behavior in the existing card and amount components.
- Use Surface for structure and Status Feedback View for payment status.
- Ask before collecting regulated or stored payment credentials.

### Reject If

- Payment fields are raw inputs.
- Card wraps the field group.
- Field behavior is reimplemented in the pattern.
- Security-code reveal is rebuilt locally.
- Submit feedback bypasses Status Feedback View.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| paymentSurface | Surface | required | Structural payment grouping. |
| cardFields | Card Number Input, Card Expiry Input, Card Security Code Input | required | Card credential fields. |
| amountFields | Input Amount | conditional | Amount, limit, or authorization value. |
| validation | Inline Validation | conditional | Grouped recoverable guidance. |
| statusFeedback | Status Feedback View | conditional | Blocking, transient, or submit-result feedback. |
| actions | Button | required | Submit and secondary payment commands. |

## Components Used

- Button
- Card Number Input
- Card Expiry Input
- Card Security Code Input
- Inline Validation
- Input Amount

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| paymentSurface | Surface | required | Structural payment grouping. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Card details | Required | Card number, expiry, and security code. |
| Amount capture | Conditional | Adds Input Amount when payment value is needed. |
| Validation | Conditional | Adds Inline Validation for group guidance. |
| Feedback | Conditional | Delegates status to Status Feedback View. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Loading | Field and Button loading states own motion. |
| Review | Surface raises the group while fields stay editable unless disabled. |
| Feedback | Status Feedback View owns transient or blocking feedback motion. |

## Accessibility

- Expose the payment form as a labelled group.
- Delegate field accessibility to the field components.
- Keep grouped validation visible and optionally live.
- Keep submit and secondary commands as Button controls.

## Implementation Checklist

- Composes Surface, field components, validation, feedback, and Buttons.
- Density and state cascade through every child.
- Field callbacks preserve metadata and event context.
- No Card wrapper, raw input, raw button, or local Field shell is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface, field components, validation, feedback, and Buttons.
- Density and state cascade through every child.
- Field callbacks preserve metadata and event context.
- No Card wrapper, raw input, raw button, or local Field shell is emitted.

Reject if:

- Payment fields are raw inputs.
- Card wraps the field group.
- Field behavior is reimplemented in the pattern.
- Submit feedback bypasses Status Feedback View.

## MIEL

Agents can decide:

- Use Payment Form for card credential capture or review.
- Add Input Amount only when the task needs amount or limit entry.
- Route submit feedback through Status Feedback View.

Agents must ask:

- Credentials are stored, tokenized, or regulated.
- The flow mixes wallet display, disputes, and payment capture in one screen.
- A product asks for a new payment field not covered by Flow.

Agents must reject:

- Payment fields are raw inputs.
- Card wraps the field group.
- Field behavior is reimplemented in the pattern.
- Submit feedback bypasses Status Feedback View.

Handoff language:

> Confirm credential scope, amount requirements, validation timing, feedback type, submit action, and compliance review before shipping Payment Form.
