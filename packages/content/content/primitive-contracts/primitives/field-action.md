# Field Action

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/field-action.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn field-adjacent actions into implementation-ready primitives for clear, reveal, picker, validation, resend, recovery, and inline command behavior without creating fake buttons inside demos or duplicated field controls.

Field Action sits between foundations and components.
It consumes semantic tokens and exposes a narrow API.
It prevents hardcoded values, detached semantics, and inconsistent implementation.
It must be portable across React, Flutter, documentation, and agent specs.

## Definition Of Ready

Before building or auditing any artifact against this primitive, confirm:

- Design System foundations govern the primitive.
- The primitive exposes a narrow, reusable API and never a one-off component shortcut.
- Components, patterns, templates, and docs consume the primitive contract instead of redefining visual values locally.
- ZIP reference details may influence equivalence only after the primitive maps them back to system foundations.

Layer: `Primitive`

Platform: `System`

Audiences: `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents`

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `tokens`, `states`, `agentInstructions`, `rejectIf`

Governing foundations: `Accessibility`, `State`, `Frame`, `Tone`, `Energy`

Foundation inputs: `sys.accessibility.*`, `sys.state.*`, `sys.frame.*`, `sys.tone.*`, `sys.energy.*`

Coordinates primitives: `Focus`, `Message`, `Disabled`, `Loading`, `Iconography`, `Spacing`, `Radius`, `Measurement`

Token dependencies: `component-field-*`, `comp.input.*`, `comp.icon-button.*`, `sys.accessibility.*`, `sys.state.*`, `sys.frame.*`, `sys.energy.*`, `sys.tone.*`, `focus.*`, `message.*`, `loading.*`, `disabled.*`, `field-action.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| clear | field-action.clear | Remove current local value without submitting or changing focus unexpectedly. |
| reveal | field-action.reveal | Toggle visibility for sensitive or masked field content. |
| picker | field-action.picker | Open a component-owned picker, calendar, country selector, menu, or autocomplete surface. |
| validate | field-action.validate | Trigger local validation, availability checks, or parsing without owning submission. |
| recover | field-action.recover | Resend, retry, reset, or alternate-path actions tied to one field or field group. |

## Product Examples

- Password or security code field: Reveal is an accessible field action with aria-pressed and state precedence, not a decorative icon.
- Date range field: Picker action opens the calendar surface while the Date Range Picker component owns selection semantics.
- OTP code: Recover action resends a code, announces loading/result, and keeps validation separate from form submission.

## API

Props: `action`, `label`, `targetFieldId`, `state`, `pressed`, `disabled`, `loading`, `describedBy`

Outputs: `buttonProps`, `ariaState`, `focusPolicy`, `messagePolicy`, `eventContract`

## States

- default
- hover
- focus
- pressed
- loading
- success
- error
- disabled

## Responsibilities

- Render Field Action through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- component-field-*
- comp.input.*
- comp.icon-button.*
- sys.accessibility.*
- sys.state.*
- sys.frame.*
- sys.energy.*
- sys.tone.*
- focus.*
- message.*
- loading.*
- disabled.*
- field-action.*

## Agent Instructions

- Model a field action before choosing Icon Button, Button, or raw icon markup.
- Keep field action semantics local to one field or field group.
- Use Message for validation and recovery feedback.
- Do not let a field action own form submission, navigation, or a full pattern workflow.

## Reject If

- An icon inside a field has no accessible label or state.
- A demo invents a fake button instead of consuming Button/Icon Button semantics through Field Action.
- Validation, reveal, picker, and recovery actions are styled with local CSS.
- The action changes unrelated field or form state without explicit pattern ownership.
