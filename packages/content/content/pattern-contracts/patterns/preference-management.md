# Preference Management

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/preference-management/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/preference-management.json`

## Purpose

Coordinate preference groups, editable sections, and danger-zone confirmation as one reusable settings flow without creating a settings workspace template.

## Use When

- A template needs reusable preference behavior.
- Settings, editable form sections, and destructive confirmation must share density and state.
- The product needs preference groups and danger-zone actions but not full settings navigation.

## Do Not Use Without Review

- The experience is a single standalone field.
- The flow includes destructive identity, billing, security, tenant, legal, or compliance operations.
- A template is trying to redefine Settings, Form Section, or Confirmation Dialog behavior.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Group, field, validation, disabled, busy, permission, and confirmation semantics stay with formal owners. |
| Depth | Surface owns structural grouping without Card wrapping. |
| Energy | Dirty, saving, invalid, permission-blocked, and danger-confirming states cascade to child patterns. |
| Frame | Responsive grouping and section rhythm remain token-driven. |
| Growth | Settings Workspace templates can extend the flow without moving behavior into templates. |
| Iconography | Status and destructive icons remain owned by Badge, Button, and Confirmation Dialog descendants. |
| Momentum | Saving, confirming, and recovery motion remain delegated to child owners and motion primitives. |
| State | Pattern state maps to Settings, Form Section, and Confirmation Dialog state. |
| Symbol | Danger and permission states remain semantic, not decorative. |
| Tone | Preference, warning, danger, success, and blocked tones stay in Flow contracts. |
| Voice | Labels, descriptions, validation, confirmation, recovery, and action copy remain explicit. |

## Formal Purpose

Coordinate preference groups, editable form sections, save/reset behavior, permission boundaries, and destructive danger-zone confirmation without becoming a settings workspace template.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Service Designers`, `Agents` |
| Density Context | `mobile`, `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Settings Workspace` |

## Formal States

- `idle`
- `dirty`
- `saving`
- `saved`
- `invalid`
- `danger-confirming`
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
- `Elevation`
- `Field Action`
- `Focus`
- `Iconography`
- `Loading`
- `Measurement`
- `Motion Curves`
- `Radius`
- `Spacing`
- `Surface`
- `Typography`

### Components

- `Badge`

### Patterns

- `Settings`
- `Form Section`
- `Confirmation Dialog`

### Tokens

- `comp.badge.*`
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
| `preferenceSurface` | `primitive` | `Surface` |
| `preferenceSummary` | `component` | `Badge` |
| `settingsBoundary` | `pattern` | `Settings` |
| `preferenceBlocks` | `pattern` | `Form Section` |
| `dangerConfirmation` | `pattern` | `Confirmation Dialog` |

## Formal Governance

### Entry Conditions

- A product surface needs grouped user or workspace preferences.
- Settings, editable sections, and destructive confirmation need one coordinated state contract.
- A template must not clone preference groups, form fields, or danger-zone dialogs.

### Decision Tree

- Use Settings when grouped preferences share one save/reset boundary.
- Use Form Section when a local editable preference block needs validation or field-level callbacks.
- Use Confirmation Dialog when a danger-zone action requires explicit confirmation.
- Use Preference Management when Settings, Form Section, and danger-zone confirmation must cascade together.
- Use a Settings Workspace template only when navigation, multiple pages, audit logs, or admin modules are part of the experience.

### Failure Modes

- Templates render local preference groups instead of Settings or Form Section.
- Danger-zone actions use a custom modal, overlay, or raw button cluster instead of Confirmation Dialog.
- Card wraps the preference group, breaking Surface ownership.
- Permission-blocked, dirty, invalid, saving, or destructive states do not cascade to child pattern owners.
- Docs define settings behavior that belongs in Flow.

### Success Metrics

- Users can review preference status, edit grouped controls, save or reset, and confirm destructive actions through one predictable flow.
- Density and state cascade from Surface to Settings, Form Section, and Confirmation Dialog.
- Settings Workspace templates can reuse the pattern without redefining preference or danger-zone behavior.

### Accessibility

- Expose the preference flow as a labelled group with busy state.
- Delegate grouped controls to Settings.
- Delegate field semantics and validation to Form Section.
- Delegate destructive confirmation semantics to Confirmation Dialog.
- Keep permission-blocked and disabled states announced through child owners.

### Tests

- Composes Surface, Badge, Settings, Form Section, and Confirmation Dialog.
- Covers idle, dirty, saving, saved, invalid, danger-confirming, permission-blocked, and disabled states.
- Forwards settings control/save/reset, section field/action, and danger confirmation callbacks.
- Rejects local preference groups, fake form fields, Card wrappers, raw dialogs, custom overlays, and Docs-owned settings behavior.

### Agent Instructions

- Do not create custom preference group visuals.
- Use Surface for structural grouping; do not wrap preference groups in Card.
- Use Settings for grouped preferences and Form Section for editable preference blocks.
- Use Confirmation Dialog for danger-zone confirmation.
- Ask before exposing destructive account, tenant, billing, identity, security, or compliance actions.

### Reject If

- Preference controls bypass Settings or Form Section.
- Danger-zone actions bypass Confirmation Dialog.
- Card wraps the preference-management group.
- Density or state stops cascading to Settings, Form Section, or Confirmation Dialog.
- The pattern becomes a multi-page settings template.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| preferenceSurface | Surface | required | Structural preference group. |
| preferenceSummary | Badge | conditional | Status summary without summary-card invention. |
| settingsBoundary | Settings | conditional | Grouped preference controls, save/reset, and validation. |
| preferenceBlocks | Form Section | conditional | Editable preference blocks and field-level behavior. |
| dangerConfirmation | Confirmation Dialog | conditional | Destructive confirmation, cancel, recovery, and danger tone. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| preferenceSurface | Surface | required | Structural preference group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Settings only | Conditional | Uses Settings for grouped preferences. |
| Editable sections | Conditional | Adds Form Section for local editable preference blocks. |
| Danger zone | Conditional | Adds Confirmation Dialog for destructive actions. |
| Permission blocked | State | Disables child owners while preserving status and copy. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Saving | Surface marks busy while Settings or Form Section own action loading. |
| Danger confirming | Surface marks selected while Confirmation Dialog owns destructive dialog behavior. |
| Permission blocked | Surface and child owners use disabled state. |

## Accessibility

- Expose the whole flow as a labelled group.
- Delegate grouped controls to Settings.
- Delegate field semantics to Form Section.
- Delegate destructive confirmation semantics to Confirmation Dialog.

## Implementation Checklist

- Composes Surface, Badge, Settings, Form Section, and Confirmation Dialog.
- Density and state cascade through child owners.
- Callbacks preserve event context.
- No Card wrapper, raw dialog, fake form field, local preference group, or Docs-owned settings behavior is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface, Badge, Settings, Form Section, and Confirmation Dialog.
- Density and state cascade through child owners.
- Callbacks preserve event context.
- No Card wrapper, raw dialog, fake form field, local preference group, or Docs-owned settings behavior is emitted.

Reject if:

- Preference controls bypass Settings or Form Section.
- Danger-zone confirmation bypasses Confirmation Dialog.
- Card wraps the preference group.
- Density or state stops cascading to the child pattern owners.

## MIEL

Agents can decide:

- Use Preference Management for reusable settings flows.
- Omit Settings, sections, or danger zone when the flow does not need that slot.
- Keep multi-page settings navigation outside this pattern.

Agents must ask:

- The action is destructive for identity, security, billing, tenant, legal, compliance, or regulated data.
- A template wants custom settings controls instead of Settings or Form Section.
- The flow needs full settings navigation, audit history, or admin modules.

Agents must reject:

- Preference controls bypass Settings or Form Section.
- Danger-zone confirmation bypasses Confirmation Dialog.
- Card wraps the preference group.
- Density or state stops cascading to the child pattern owners.

Handoff language:

> Confirm preference scope, persistence policy, permission boundaries, destructive action risk, recovery copy, save/reset behavior, and whether the flow should graduate into a Settings Workspace template.
