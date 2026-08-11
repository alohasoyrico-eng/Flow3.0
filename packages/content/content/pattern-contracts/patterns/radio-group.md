# Radio Group

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/radio-group/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/radio-group.json`

## Purpose

Coordinate one exclusive decision with a visible question, Radio Button options, shared name, keyboard movement, validation, and option-set layout rules.

## Use When

- Users must choose exactly one option from a small related set.
- The decision needs a visible question, helper, default, validation, or recovery copy.
- Exclusive choice must cascade through Radio Button, Inline Validation, Button actions, and parent Surface state.

## Do Not Use Without Review

- Users may select more than one option.
- The choices are navigation tabs, segmented commands, or menu actions.
- A default could create financial, legal, privacy, safety, or compliance risk.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Group, question, shared name, roving movement, required state, and validation are explicit. |
| Depth | Surface owns group structure without Card wrapping. |
| Energy | Selected, unselected, invalid, disabled, and focus states cascade to child Radio Buttons. |
| Frame | Option spacing, stacked/inline layout, and action placement remain token-driven. |
| Growth | Option measurement and explicit apply behavior inherit from child component contracts. |
| Iconography | Radio symbols remain owned by Radio Button. |
| Momentum | Keyboard movement and selection updates preserve focus and avoid layout shifts. |
| State | Unselected, selected, invalid, dirty, loading, permission-blocked, and disabled states are named. |
| Symbol | Radio marks can support selected state but text remains required. |
| Tone | Invalid, disabled, blocked, and selected tones remain contract-bound. |
| Voice | Question, option labels, helper, validation, and recovery copy stay visible. |

## Formal Purpose

Coordinate one exclusive decision with a visible question, Radio Button options, shared name, keyboard movement, validation, and option-set layout rules.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `unselected`
- `selected`
- `invalid`
- `dirty`
- `loading`
- `permission-blocked`
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
- `Inline Validation`
- `Radio Button`

### Tokens

- `comp.button.*`
- `comp.inline-validation.*`
- `comp.radio-button.*`
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
| `options` | `component` | `Radio Button` |
| `validation` | `component` | `Inline Validation` |
| `actions` | `component` | `Button` |

## Formal Governance

### Entry Conditions

- Users must choose exactly one option from a small related set.
- The set needs a visible question, helper, default, validation, or recovery copy.
- The parent workflow needs one exclusive-choice contract instead of independent Radio Button instances.

### Decision Tree

- Use Radio Button for one atomic option inside a Radio Group.
- Use Radio Group when options represent one exclusive decision.
- Use Segmented Control when options are compact view/mode commands rather than form decisions.
- Use Checkbox Group when more than one option can be selected.

### Failure Modes

- Custom radio visuals bypass Radio Button.
- The group is wrapped in Card instead of Surface.
- A risky default is selected without product policy.
- Selection state is managed by Docs or DOM-only code instead of the React pattern contract.

### Success Metrics

- Users understand the question, available options, current selection, and validation state.
- Density, theme, focus, and state cascade from Surface into Radio Button and Inline Validation.
- Keyboard movement preserves exclusive selection semantics.

### Accessibility

- Expose the set with visible and programmatic radio-group labelling.
- Every Radio Button shares one group name.
- Associate helper and validation copy with the group.
- Avoid risky defaults unless product policy confirms them.

### Tests

- Composes Surface, Radio Button, Inline Validation, and Button.
- Covers unselected, selected, invalid, dirty, loading, permission-blocked, and disabled states.
- Keyboard movement preserves exclusive selection semantics.
- Rejects custom radio visuals, raw inputs, Card wrappers, segmented-control substitution, and docs-only selection state.

### Agent Instructions

- Do not create custom radio visuals.
- Use Surface for group structure; do not wrap the group in Card.
- Use Radio Button for every option and Inline Validation for shared errors.
- Ask before setting a default that affects money, access, compliance, safety, identity, privacy, or irreversible state.

### Reject If

- More than one option can be selected.
- Options bypass Radio Button.
- The group is wrapped in Card.
- Selected or invalid state is color-only.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| groupSurface | Surface | required | Structural group owner for density, state, and spacing. |
| question | Typography | required | Visible exclusive-choice question owned by the typography primitive cascade. |
| options | Radio Button[] | required | Atomic Radio Button options sharing one name. |
| validation | Inline Validation | conditional | Required, unavailable, or risk recovery copy. |
| actions | Button[] | conditional | Apply, clear, or save actions when selection is explicit. |

## Components Used

- Radio Button
- Inline Validation
- Button

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| groupSurface | Surface | required | Structural group owner for density, state, and spacing. |
| question | Typography | required | Visible exclusive-choice question owned by the typography primitive cascade. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Simple group | Default | One labelled set with exclusive Radio Button options. |
| Required decision | State | Inline Validation appears until one option is selected. |
| Explicit apply | Conditional | Selection is reviewed before Button commits the decision. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Keyboard movement | Arrow movement updates focus/selection according to platform expectations. |
| Validation reveal | Inline Validation appears in place and respects reduced motion. |
| Explicit apply | Button feedback does not steal focus from the selected option. |

## Accessibility

- Expose the set with a visible label and programmatic radio-group semantics.
- Every Radio Button shares one group name.
- Associate helper and validation copy with the group.
- Do not rely on color alone for selected or invalid state.
- Avoid risky defaults unless product policy confirms them.

## Implementation Checklist

- Composes Surface, Radio Button, Inline Validation, and Button.
- Covers unselected, selected, invalid, dirty, loading, permission-blocked, and disabled states.
- Keyboard movement preserves exclusive selection semantics.
- Validation is associated with the group.
- No custom radio visuals, raw inputs, Card wrappers, or local DOM-only selection state are emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface, Radio Button, Inline Validation, and Button.
- Covers unselected, selected, invalid, dirty, loading, permission-blocked, and disabled states.
- Keyboard movement preserves exclusive selection semantics.
- Validation is associated with the group.
- No custom radio visuals, raw inputs, Card wrappers, or local DOM-only selection state are emitted.

Reject if:

- More than one option can be selected.
- Radio visuals are custom-built instead of using Radio Button.
- The group is wrapped in Card instead of Surface.
- Selected or invalid state is color-only.

## MIEL

Agents can decide:

- Use Radio Group for one exclusive decision.
- Use Inline Validation when the decision is required or unavailable.
- Use explicit apply when selection has side effects.

Agents must ask:

- The default selection can affect money, access, compliance, safety, identity, privacy, or irreversible state.
- The user might need multiple selections.
- Persistence, validation, or apply behavior is unclear.

Agents must reject:

- More than one option can be selected.
- Radio visuals are custom-built instead of using Radio Button.
- The group is wrapped in Card instead of Surface.
- Selected or invalid state is color-only.

Handoff language:

> Confirm question, option source, default policy, required state, validation, persistence, and whether changes apply immediately or explicitly.
