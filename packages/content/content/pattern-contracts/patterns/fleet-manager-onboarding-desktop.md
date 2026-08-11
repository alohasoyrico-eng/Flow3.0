# Fleet Manager Onboarding Desktop

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/fleet-manager-onboarding-desktop/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/fleet-manager-onboarding-desktop.json`

## Purpose

Coordinate desktop setup for a fleet manager: workspace profile, fleet import, permissions, review, and first dashboard readiness.

## Use When

- A manager must configure several operational prerequisites before using a workspace.
- Setup includes imported data, roles, policy review, and recovery states.
- The system is reusable across desktop onboarding surfaces, not a final product template.

## Do Not Use Without Review

- A single settings form is enough.
- Role policy, import validation, or ownership rules are unclear.
- The request describes a full dashboard screen or product IA template.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Desktop layout separates setup controls, preview, and review without nested cards. |
| State | Draft, importing, validating, reviewing, complete, empty, and error are explicit. |
| Voice | Setup copy names operational consequences plainly. |
| Depth | Permission details can open in overlays without losing setup state. |
| Accessibility | Tables, checkboxes, and stepper state are keyboard readable. |
| Energy | Design System semantic tones communicate progress, warning, and success. |

## Formal Purpose

Coordinate a reusable fleet-manager onboarding composition with setup tasks, progress, validation, settings handoff, and desktop data review without owning a product template.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Desktop |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `tablets + laptops`, `desktops + TV` |

## Formal States

- `not-started`
- `in-progress`
- `blocked`
- `validating`
- `complete`
- `empty`
- `permission-blocked`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
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

- `Badge`
- `Button`
- `Checkbox`
- `Empty State`
- `Inline Validation`
- `Input`
- `KPI Tile`
- `Select`
- `Stepper`
- `Table`
- `Toast`

### Patterns

- `Settings`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.checkbox.*`
- `comp.empty-state.*`
- `comp.inline-validation.*`
- `comp.input.*`
- `comp.kpi-tile.*`
- `comp.select.*`
- `comp.stepper.*`
- `comp.table.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `progress` | `component` | `Stepper`, `Badge`, `KPI Tile` |
| `tasks` | `component` | `Checkbox`, `Button`, `Inline Validation`, `Toast` |
| `review` | `component` | `Input`, `Select`, `Table`, `Empty State` |
| `settingsBoundary` | `pattern` | `Settings` |

## Formal Governance

### Entry Conditions

- A desktop onboarding flow needs reusable setup progress, task completion, validation, and data review.
- Settings owns preference/configuration handoff.
- The product template owns business copy, routing, permissions, and domain-specific task order.

### Decision Tree

- Use Multi Step Form for generic ordered forms.
- Use Fleet Manager Onboarding Desktop for reusable fleet setup composition.
- Use templates for complete product screens and business-specific onboarding journeys.

### Failure Modes

- The pattern hardcodes product template layout or copy.
- Settings is duplicated instead of handed off.
- Setup tasks are custom checklist visuals.
- Validation and progress are disconnected.

### Success Metrics

- Users understand onboarding progress, setup status, and recovery.
- Desktop review surfaces stay component-owned.
- Templates can compose the pattern without losing business ownership.

### Accessibility

- Expose progress and blocked reasons in text.
- Tie validation to fields/tasks.
- Do not rely on dashboard layout to communicate completion.

### Tests

- Composes Badge, Button, Checkbox, Empty State, Inline Validation, Input, KPI Tile, Select, Stepper, Table, and Toast.
- Covers progress, blocked, validating, complete, empty, permission, and disabled states.
- Keeps Settings and templates as boundaries.

### Agent Instructions

- Keep business-specific onboarding sequence in templates.
- Use Settings only as a handoff boundary.
- Ask before onboarding workflows touch billing, compliance, identity, or fleet safety policy.

### Reject If

- Business template layout is embedded.
- Settings is cloned.
- Task progress is custom markup.
- Validation bypasses Flow components.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| progress | Stepper | yes | Setup stage and completion. |
| profile | Input \| Select | yes | Workspace and fleet basics. |
| dataPreview | Table \| Empty State | yes | Imported or sample fleet records. |
| metrics | KPI Tile[] | conditional | Setup readiness summary. |
| permissions | Checkbox \| Badge | conditional | Invite and role configuration. |
| feedback | Toast \| Inline Validation | yes | Save, import, and review feedback. |

## Components Used

- Stepper
- Input
- Select
- Table
- KPI Tile
- Checkbox
- Badge
- Button
- Inline Validation
- Toast
- Empty State

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Workspace setup | Required | Profile and operating region. |
| Fleet import | Required | Data preview and validation. |
| Role invitation | Required | Permissions and collaborator setup. |
| Ready dashboard | Candidate | Completion summary before template handoff. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Stage change | Stepper and panel update after user action. |
| Import feedback | Toast confirms non-blocking save/import events. |
| Validation reveal | Inline Validation appears only after failed action. |
| Reduced motion | Panel changes stay immediate and readable. |

## Accessibility

- Stepper current stage is visible.
- Table preview is labeled and has readable columns.
- Permission choices use real checkbox controls.
- Save/import feedback does not steal focus.

## Implementation Checklist

- Declare `progress`: Setup stage and completion.
- Declare `profile`: Workspace and fleet basics.
- Declare `dataPreview`: Imported or sample fleet records.
- Declare `feedback`: Save, import, and review feedback.
- Continue advances setup after user action.
- Import preview remains responsive.
- Permission checkbox state is real.
- Desktop and narrow layouts avoid overflow.

## Tests And Rejection Rules

Must test:

- Continue advances setup after user action.
- Import preview remains responsive.
- Permission checkbox state is real.
- Desktop and narrow layouts avoid overflow.

Reject if:

- It becomes a full dashboard template.
- Tables, buttons, or fields are custom hardcoded substitutes.
- Permissions are shown without real controls.

## MIEL

Agents can decide:

- Use this pattern for reusable desktop onboarding setup before templates.
- Compose Design System fields, select, table, KPI, checkbox, badge, button, and toast.
- Keep import and permission rules explicit.

Agents must ask:

- Role model, import source, data validation, region policy, or completion criteria is unclear.

Agents must reject:

- It becomes a full dashboard template.
- Tables, buttons, or fields are custom hardcoded substitutes.
- Permissions are shown without real controls.

Handoff language:

> Confirm workspace fields, import source, role policy, validation rules, owner, completion criteria, and template handoff.
