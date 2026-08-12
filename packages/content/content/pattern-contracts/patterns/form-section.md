# Form Section

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/form-section/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/form-section.json`

## Purpose

Structure related form fields into a titled, validated, saveable group without turning every field group into a full process.

## Use When

- A form needs a clear section boundary with helper copy.
- Fields share validation, disabled state, or save behavior.
- Users need to understand which data belongs together before submitting.

## Do Not Use Without Review

- The section is only decorative spacing.
- The grouped fields do not share purpose or validation.
- The section hides a multi-step process or complex permissions.
- There is no evidence that users understand the grouped fields as one decision.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines section spacing, field rhythm, action placement, and responsive stacking. |
| Voice | Owns section title, helper copy, validation text, and save labels. |
| Energy | Controls focus, dirty, invalid, disabled, and action states. |
| State | Default, dirty, valid, invalid, disabled, saving, and saved states are explicit. |
| Accessibility | Requires labelled fields, associated validation, keyboard submission, and status feedback. |

## Formal Purpose

Coordinate a labeled group of related fields with validation, optional search handoff, save/cancel actions, and recovery feedback.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Settings Workspace` |

## Formal States

- `idle`
- `dirty`
- `validating`
- `invalid`
- `saving`
- `saved`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Energy`
- `Frame`
- `State`
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
- `Checkbox`
- `Icon Button`
- `Inline Validation`
- `Input`
- `Radio Button`
- `Select`
- `Switch`
- `Text Area`
- `Toast`

### Patterns

- `Search`

### Tokens

- `comp.button.*`
- `comp.checkbox.*`
- `comp.icon-button.*`
- `comp.inline-validation.*`
- `comp.input.*`
- `comp.radio-button.*`
- `comp.select.*`
- `comp.switch.*`
- `comp.text-area.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `container` | `primitive` | `Surface` |
| `fields` | `component` | `Checkbox`, `Icon Button`, `Input`, `Radio Button`, `Select`, `Switch`, `Text Area`, `Inline Validation` |
| `actions` | `component` | `Button`, `Toast` |

## Formal Governance

### Entry Conditions

- Fields belong to one conceptual group.
- The group can validate, save, reset, or request supporting lookup.
- The section is reusable across forms without business-specific layout ownership.

### Decision Tree

- Use Input/Text Area directly for isolated fields.
- Use Form Section for grouped field behavior.
- Use Multi Step Form when section order, progress, and navigation become part of the flow.

### Failure Modes

- The section recreates Surface or field visuals.
- Validation is detached from Inline Validation.
- Search is embedded as a second implementation.
- Save/cancel actions bypass Button.

### Success Metrics

- Users understand group purpose, required fields, errors, and recovery.
- Keyboard users can move through fields and actions predictably.
- Search remains a handoff boundary when needed.

### Accessibility

- Group fields with visible heading/description.
- Tie errors to fields.
- Keep save/cancel controls keyboard reachable.

### Tests

- Composes Surface, Input, Select, Checkbox, Radio Button, Switch, Icon Button, Text Area, Inline Validation, Button, and Toast.
- Covers dirty, validating, invalid, saving, saved, and disabled states.
- Keeps Search as optional boundary only.

### Agent Instructions

- Do not hardcode product-specific forms.
- Use Flow field components only.
- Ask before grouping sensitive identity, payment, or compliance fields.

### Reject If

- Fields are custom inputs.
- Validation bypasses Inline Validation.
- Actions bypass Button.
- Search implementation is cloned.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| container | Surface | yes | Structural owner for the section background, density, and validation state. |
| header | Text | yes | Names the section and explains purpose without using Card as a wrapper. |
| fields | Input \| Select \| Checkbox \| RadioButton \| Switch \| TextArea[] | yes | Related form controls. |
| validation | InlineValidation | conditional | Explains blocked or invalid state. |
| actions | Button[] | conditional | Save, reset, or secondary actions. |
| feedback | Toast | conditional | Confirms save or draft state. |

## Components Used

- Input
- Select
- Checkbox
- Radio Button
- Switch
- Icon Button
- Text Area
- Inline Validation
- Button
- Toast

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| container | Surface | yes | Structural owner for the section background, density, and validation state. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Editable section | Current candidate | Grouped fields with explicit save behavior. |
| Invalid section | Required state | Inline validation appears after user action. |
| Saved section | Candidate | Toast or status confirms persistence. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Validation reveal | Validation appears inline without shifting focus away from the field. |
| Save feedback | Save confirmation is transient and non-blocking. |

## Accessibility

- Every field has a label.
- Validation text is not color-only.
- Save action is reachable by keyboard.
- Saved state is announced as feedback.
- Disabled fields explain why when needed.

## Implementation Checklist

- Declare `container`: Structural owner for the section background, density, and validation state.
- Declare `header`: Names the section and explains purpose without using Card as a wrapper.
- Declare `fields`: Related form controls.
- Empty required field shows Inline Validation after save.
- Editing field marks the section dirty.
- Save reports success when required fields are present.
- Responsive viewport stacks fields without overlap.
- Research confidence and evidence are documented when the grouping affects completion or risk.

## Tests And Rejection Rules

Must test:

- Empty required field shows Inline Validation after save.
- Editing field marks the section dirty.
- Save reports success when required fields are present.
- Responsive viewport stacks fields without overlap.
- Research confidence and evidence are documented when the grouping affects completion or risk.

Reject if:

- The grouping is decorative only.
- Fields are unrelated.
- Validation has no text recovery.

## MIEL

Agents can decide:

- Use Form Section for related fields with shared purpose.
- Use Inline Validation for section-level blocking errors.
- Use Toast for save confirmation.

Agents must ask:

- Required fields, persistence, ownership, validation timing, evidence, or confidence is unclear.

Agents must reject:

- The grouping is decorative only.
- Fields are unrelated.
- Validation has no text recovery.

Handoff language:

> Confirm section purpose, required fields, validation timing, save behavior, success feedback, evidence, and confidence.
