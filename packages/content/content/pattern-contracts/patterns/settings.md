# Settings

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/settings/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/settings.json`

## Purpose

Organize preferences, account controls, notification rules, integrations, and dangerous actions into predictable groups with clear save behavior.

## Use When

- Users configure durable product, account, workspace, notification, or security preferences.
- Controls need grouping, descriptions, immediate vs saved behavior, and confirmation.
- Dangerous or irreversible actions need visual separation and recovery policy.

## Do Not Use Without Review

- The UI is a one-off form rather than durable settings.
- Immediate and saved changes are mixed without feedback.
- Danger zone actions are placed with normal preferences.
- Controls are unlabeled or depend on icon/color only.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines group spacing, row density, control alignment, and responsive stacking. |
| Voice | Owns setting labels, descriptions, confirmation copy, Toast messages, and danger copy. |
| Energy | Controls group surface, focus, danger zone, disabled, and changed states. |
| State | Immediate, dirty, saving, saved, error, disabled, and destructive states are explicit. |
| Tone | Danger tone is reserved for irreversible or high-risk actions. |
| Accessibility | Every row associates label/description with its control and preserves keyboard focus. |

## Formal Purpose

Coordinate editable preferences with grouped controls, save/reset behavior, validation, unsaved state, and confirmation boundaries without becoming a product-specific admin screen.

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
- `saving`
- `saved`
- `invalid`
- `resetting`
- `permission-blocked`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Energy`
- `Frame`
- `State`
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
- `Card`
- `Dialog`
- `Input`
- `Select`
- `Switch`
- `Toast`

### Tokens

- `comp.button.*`
- `comp.card.*`
- `comp.dialog.*`
- `comp.input.*`
- `comp.select.*`
- `comp.switch.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.tone.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `groups` | `primitive` | `Surface` |
| `summaryCard` | `component` | `Card` |
| `actions` | `component` | `Button`, `Toast` |
| `confirmation` | `component` | `Dialog` |
| `controls` | `component` | `Input`, `Select`, `Switch` |

## Formal Governance

### Entry Conditions

- Users need to review and edit preferences or configuration.
- Settings can be dirty, saved, reset, disabled, or permission constrained.
- Some changes may need confirmation before applying.

### Decision Tree

- Use a form section for one localized group of fields.
- Use Settings when grouped preferences share save/reset and unsaved-state behavior.
- Use a template when settings are domain-specific business administration.

### Failure Modes

- Settings becomes a full business admin template.
- Save/reset controls are custom buttons.
- Dirty or permission state is invisible.
- Destructive changes bypass Dialog confirmation.

### Success Metrics

- Users can identify groups, modify settings, save, reset, and recover.
- Assistive technology users receive dirty, saving, saved, and validation states.
- Preference composition stays reusable outside one product screen.

### Accessibility

- Group related settings with visible labels.
- Expose dirty, saving, saved, invalid, and permission states in text.
- Use Dialog for confirmation and preserve focus return.

### Tests

- Composes Button, Card, Dialog, Input, Select, Switch, and Toast.
- Covers dirty, saving, saved, invalid, reset, permission, and disabled states.
- Does not include domain-specific admin layout.

### Agent Instructions

- Keep product policy, role rules, and backend persistence outside this pattern.
- Compose settings groups from Flow inputs and actions.
- Ask before changing security, billing, compliance, or identity settings.

### Reject If

- The pattern owns business-specific admin workflows.
- Controls bypass Flow form components.
- Unsaved state is not visible.
- Confirmation bypasses Dialog.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| groups | Surface | yes | Structural owner for titled settings groups, density, and local state. |
| rows | SettingsRow[] | yes | Label, description, control, state, and feedback. |
| controls | Input \| Select \| Switch | yes | Design System controls for each settings row. |
| saveModel | immediate \| explicit-save \| mixed | yes | Declares whether changes save instantly or require submit. |
| feedback | Toast \| InlineValidation \| ErrorPanel | yes | Confirms saved changes, failures, and undo when available. |
| dangerZone | DangerAction[] | conditional | Separated destructive actions with confirmation and recovery policy. |
| responsiveMode | stacked \| two-column | yes | Mobile stacks rows; desktop can use grouped panels. |

## Components Used

- Switch
- Select
- Input
- Button
- Toast
- Dialog
- Card

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| groups | Surface | yes | Structural owner for titled settings groups, density, and local state. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Immediate settings | Current candidate | Switch/select changes save immediately and report Toast feedback. |
| Explicit save | Candidate | Dirty state is tracked and saved with a primary action. |
| Danger zone | Required state | Destructive actions are separated and confirmed. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Save feedback | Toast or inline state appears after change; reduced motion avoids decorative entrance. |
| Dirty state | Changed rows update immediately without layout shift. |
| Danger confirmation | Dialog/sheet opens after user action with focus management. |

## Accessibility

- Each setting has a visible label and associated description.
- Controls expose checked/selected/disabled state.
- Immediate changes announce success or failure.
- Danger actions require confirmation and named consequence.
- Keyboard navigation follows row order and does not trap focus.

## Implementation Checklist

- Declare `groups`: Structural owner for titled settings groups, density, and local state.
- Declare `rows`: Label, description, control, state, and feedback.
- Declare `controls`: Design System controls for each settings row.
- Declare `saveModel`: Declares whether changes save instantly or require submit.
- Declare `feedback`: Confirms saved changes, failures, and undo when available.
- Declare `responsiveMode`: Mobile stacks rows; desktop can use grouped panels.
- Immediate setting saves and shows feedback.
- Explicit-save setting tracks dirty state and blocks duplicate submit.
- Danger action is separated and requires confirmation.
- Mobile rows stack without losing labels/descriptions.
- Screen reader labels include setting name and state.
- Disabled settings explain why they cannot change.

## Tests And Rejection Rules

Must test:

- Immediate setting saves and shows feedback.
- Explicit-save setting tracks dirty state and blocks duplicate submit.
- Danger action is separated and requires confirmation.
- Mobile rows stack without losing labels/descriptions.
- Screen reader labels include setting name and state.
- Disabled settings explain why they cannot change.

Reject if:

- A setting has no visible label.
- Immediate and explicit save behavior are mixed without state.
- Danger action appears as a normal row.

## MIEL

Agents can decide:

- Group settings when labels, descriptions, and save behavior are explicit.
- Use immediate save for simple reversible toggles with clear feedback.
- Separate danger actions when destructive risk is present.

Agents must ask:

- Save behavior, permission policy, danger consequence, account/session impact, or recovery is unclear.
- Settings affect billing, security, identity, access, compliance, or integrations.

Agents must reject:

- A setting has no visible label.
- Immediate and explicit save behavior are mixed without state.
- Danger action appears as a normal row.

Handoff language:

> Confirm setting groups, row labels, save model, permissions, feedback, danger actions, and responsive organization.
