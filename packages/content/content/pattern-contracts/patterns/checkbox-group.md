# Checkbox Group

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/checkbox-group/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/checkbox-group.json`

## Purpose

Coordinate related Checkbox options with group labelling, select-all, mixed state, shared validation, and cross-option selection rules without turning Checkbox into a layout primitive.

## Use When

- Users can choose more than one option from a related set.
- The set needs a visible question, helper copy, validation, select-all, or mixed state.
- Selection rules must cascade across Checkbox, Inline Validation, Button actions, and parent Surface state.

## Do Not Use Without Review

- Only one option can be selected.
- The options are independent toggles rather than one labelled group.
- Permission, pricing, legal, or compliance choices need product review before bulk selection.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Group, label, description, error, mixed state, and keyboard behavior stay explicit. |
| Depth | Surface owns group structure without Card wrapping. |
| Energy | Checked, unchecked, mixed, invalid, disabled, and focus states cascade to child Checkboxes. |
| Frame | Option spacing, columns, stacking, and action placement remain token-driven. |
| Growth | Selection counts and option measurement inherit from child component contracts. |
| Iconography | Checkbox symbols remain owned by Checkbox. |
| Momentum | Select-all and validation updates avoid focus loss and layout jumps. |
| State | Partial, all-selected, none-selected, invalid, dirty, loading, and disabled states are named. |
| Symbol | Checkbox marks can support selection state but text remains required. |
| Tone | Invalid, disabled, loading, and selected tones remain contract-bound. |
| Voice | Question, option labels, helper, validation, count, and recovery copy stay visible. |

## Formal Purpose

Coordinate related Checkbox options with group labelling, select-all, mixed state, shared validation, and cross-option selection rules.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `none-selected`
- `partial`
- `all-selected`
- `invalid`
- `dirty`
- `loading`
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
- `Inline Validation`

### Tokens

- `comp.button.*`
- `comp.checkbox.*`
- `comp.inline-validation.*`
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
| `groupSurface` | `primitive` | `Surface` |
| `question` | `primitive` | `Typography` |
| `options` | `component` | `Checkbox` |
| `selectAll` | `component` | `Checkbox`, `Button` |
| `validation` | `component` | `Inline Validation` |
| `actions` | `component` | `Button` |

## Formal Governance

### Entry Conditions

- Users can choose more than one option from a related set.
- The set needs a visible question, helper copy, validation, select-all, or mixed state.
- The parent workflow needs one selection contract instead of independent Checkbox instances.

### Decision Tree

- Use Checkbox for one independent binary option.
- Use Checkbox Group when related Checkbox options share one question, validation, or select-all behavior.
- Use Multi Select when selected values need chips, popover behavior, search, or explicit apply.

### Failure Modes

- Custom checkbox visuals bypass Checkbox.
- The group is wrapped in Card instead of Surface.
- Mixed, invalid, or selected count state is color-only.
- Selection state is managed by Docs or DOM-only code instead of the React pattern contract.

### Success Metrics

- Users can understand group scope, select multiple options, review mixed state, and recover from validation.
- Density, theme, focus, and state cascade from Surface into Checkbox and Inline Validation.
- Select-all and option callbacks preserve event context.

### Accessibility

- Expose the group with visible and programmatic labelling.
- Associate helper and validation copy with the group.
- Represent mixed state programmatically and textually.
- Keep every Checkbox label visible.

### Tests

- Composes Surface, Checkbox, Inline Validation, and Button.
- Covers none, partial, all, invalid, dirty, loading, and disabled states.
- Select-all updates mixed state and preserves focus.
- Rejects custom checkbox visuals, raw inputs, Card wrappers, and docs-only selection state.

### Agent Instructions

- Do not create custom checkbox visuals.
- Use Surface for group structure; do not wrap the group in Card.
- Use Checkbox for every option and Inline Validation for shared errors.
- Ask before applying bulk selection to permissions, pricing, compliance, identity, or irreversible operations.

### Reject If

- Only one option can be selected.
- Options bypass Checkbox.
- The group is wrapped in Card.
- Validation or mixed state is color-only.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| groupSurface | Surface | required | Structural group owner for density, state, and spacing. |
| question | Typography | required | Visible group question or label owned by the typography primitive cascade. |
| options | Checkbox[] | required | Atomic Checkbox options with labels and optional descriptions. |
| selectAll | Checkbox \| Button | conditional | Bulk selection control with mixed state when partial. |
| validation | Inline Validation | conditional | Shared group validation and recovery copy. |
| actions | Button[] | conditional | Apply, clear, or save actions when selection is explicit. |

## Components Used

- Checkbox
- Inline Validation
- Button

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| groupSurface | Surface | required | Structural group owner for density, state, and spacing. |
| question | Typography | required | Visible group question or label owned by the typography primitive cascade. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Simple group | Default | One labelled set with multiple Checkbox options. |
| Select all | Conditional | A parent control mirrors none, partial, and all selected states. |
| Validated group | State | Shared Inline Validation explains required, minimum, maximum, or unavailable choices. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Selection update | Checkbox and count state update without moving focus. |
| Mixed state | Select-all state changes immediately after option toggles. |
| Validation reveal | Inline Validation appears in place and respects reduced motion. |

## Accessibility

- Expose the group with a visible label and programmatic group semantics.
- Associate helper and validation copy with the group.
- Keep each Checkbox label visible.
- Represent mixed state textually and programmatically.
- Do not communicate validity or selection count by color alone.

## Implementation Checklist

- Composes Surface, Checkbox, Inline Validation, and Button.
- Covers none, partial, all, invalid, dirty, loading, and disabled states.
- Select-all updates mixed state and preserves focus.
- Validation is associated with the group.
- No custom checkbox visuals, raw inputs, Card wrappers, or local DOM-only selection state are emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface, Checkbox, Inline Validation, and Button.
- Covers none, partial, all, invalid, dirty, loading, and disabled states.
- Select-all updates mixed state and preserves focus.
- Validation is associated with the group.
- No custom checkbox visuals, raw inputs, Card wrappers, or local DOM-only selection state are emitted.

Reject if:

- Only one option can be selected.
- Checkbox visuals are custom-built instead of using Checkbox.
- The group is wrapped in Card instead of Surface.
- Validation or mixed state is color-only.

## MIEL

Agents can decide:

- Use Checkbox Group for related multi-selection.
- Use select-all only when the option set has a clear shared scope.
- Use Inline Validation when selection has min, max, required, or unavailable rules.

Agents must ask:

- Selection affects permissions, pricing, compliance, identity, or irreversible operations.
- Max/min rules, persistence, select-all scope, or apply behavior are unclear.
- The requested behavior is actually exclusive selection.

Agents must reject:

- Only one option can be selected.
- Checkbox visuals are custom-built instead of using Checkbox.
- The group is wrapped in Card instead of Surface.
- Validation or mixed state is color-only.

Handoff language:

> Confirm group question, option source, min/max rules, select-all scope, persistence, validation, and whether changes apply immediately or explicitly.
