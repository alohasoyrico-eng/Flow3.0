# Advanced Filters

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/advanced-filters/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/advanced-filters.json`

## Purpose

Compose dashboard, audit, and table filters with saved views, active chips, reset behavior, validation, and responsive overflow.

## Use When

- Users need more than one filter dimension for dashboards or data tables.
- Active filters need to remain visible and removable.
- Filters affect charts, tables, exports, or saved views.

## Do Not Use Without Review

- A single field or Select is enough.
- Filter source, default values, or reset behavior is unclear.
- Filters change regulated reports without review or audit.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines filter bar density, chip wrapping, drawer fallback, and panel spacing. |
| Voice | Owns filter labels, empty copy, reset copy, saved-view names, and validation. |
| Energy | Controls active filter emphasis, disabled state, and validation tone. |
| State | Default, dirty, applied, loading, disabled, empty, invalid, and saved states are explicit. |
| Depth | Overflow panels and mobile drawers use Design System overlay depth. |
| Accessibility | Filter labels, active count, removal, reset, and validation are keyboard accessible. |

## Formal Purpose

Coordinate complex filtering through editable controls, applied chips, validation, drawer/menu surfaces, and toolbar handoff.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `closed`
- `open`
- `editing`
- `dirty`
- `applying`
- `applied`
- `invalid`
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
- `Chip`
- `Date Range Picker`
- `Drawer`
- `Inline Validation`
- `Input`
- `Menu`
- `Select`
- `Toast`

### Patterns

- `Toolbar`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.chip.*`
- `comp.date-range-picker.*`
- `comp.drawer.*`
- `comp.inline-validation.*`
- `comp.input.*`
- `comp.menu.*`
- `comp.select.*`
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
| `surface` | `component` | `Drawer`, `Menu` |
| `fields` | `component` | `Input`, `Select`, `Date Range Picker`, `Inline Validation` |
| `summary` | `component` | `Chip`, `Badge`, `Button`, `Toast` |
| `toolbarBoundary` | `pattern` | `Toolbar` |

## Formal Governance

### Entry Conditions

- Users need to combine multiple filter fields or rules.
- Filters require apply/reset, validation, saved state, or applied summary.
- Toolbar hosts the entry point but does not own rule editing.

### Decision Tree

- Use Filter Chip Group for viewing/removing already applied filters.
- Use Toolbar for local action placement.
- Use Advanced Filters when users edit complex rules before applying them.

### Failure Modes

- Toolbar owns filter editing internals.
- Filter chips or inputs are custom visuals.
- Apply/reset state is unclear.
- Validation is separated from Inline Validation.

### Success Metrics

- Users can edit, apply, reset, and understand filter rules.
- Applied state is visible and removable.
- Keyboard and screen reader users can navigate fields and apply actions.

### Accessibility

- Group related filter controls with labels.
- Expose applied count and validation in text.
- Keep apply/reset actions keyboard reachable.

### Tests

- Composes Drawer/Menu, Input, Select, Date Range Picker, Chip, Badge, Button, Inline Validation, and Toast.
- Covers dirty, applying, applied, invalid, and disabled states.
- Keeps Toolbar as trigger/host boundary.

### Agent Instructions

- Do not clone Toolbar or Filter Chip Group internals.
- Keep backend query syntax outside the pattern.
- Ask before filtering regulated or permission-sensitive records.

### Reject If

- Filter editing lives inside Toolbar.
- Inputs/chips bypass Flow components.
- Applied state is invisible.
- Validation bypasses Inline Validation.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| controls | Select \| DateRangePicker \| Input | yes | Filter inputs for entity, status, date, or keyword. |
| activeFilters | Chip[] \| Badge | yes | Visible active filters with count and removal. |
| actions | Button[] | yes | Apply, reset, save view, or export actions. |
| overflow | Menu \| Drawer | conditional | Controls that do not fit in the primary bar. |
| feedback | InlineValidation \| Toast | conditional | Invalid range, saved view, or applied state feedback. |

## Components Used

- Select
- Date Range Picker
- Input
- Chip
- Badge
- Button
- Menu
- Drawer
- Inline Validation
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Dashboard filter bar | Required | Dense controls plus active filter chips. |
| Saved view | Candidate | Save/apply named filter sets after explicit action. |
| Mobile drawer | Required state | Overflow filters move to Drawer on constrained viewports. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Apply filters | Results update after explicit action or declared immediate behavior. |
| Chip removal | Removal updates count without shifting the whole toolbar. |
| Overflow reveal | Menu/Drawer uses Design System overlay motion and reduced-motion fallback. |

## Accessibility

- Every filter has a programmatic label.
- Active filter count is text-backed.
- Remove/reset controls are keyboard reachable.
- Invalid filter combinations are explained in text.

## Implementation Checklist

- Declare `controls`: Filter inputs for entity, status, date, or keyword.
- Declare `activeFilters`: Visible active filters with count and removal.
- Declare `actions`: Apply, reset, save view, or export actions.
- Apply updates active chips and count.
- Reset clears controls and chips.
- Invalid range shows Inline Validation.
- Small viewport keeps filters reachable through overflow or drawer.

## Tests And Rejection Rules

Must test:

- Apply updates active chips and count.
- Reset clears controls and chips.
- Invalid range shows Inline Validation.
- Small viewport keeps filters reachable through overflow or drawer.

Reject if:

- Active filters are invisible.
- Reset behavior is missing.
- Controls are hardcoded instead of Design System inputs.

## MIEL

Agents can decide:

- Use Advanced Filters when multiple dimensions affect dashboard or table data.
- Use active chips to show applied state.
- Move overflow into Menu or Drawer based on viewport.

Agents must ask:

- Default filters, saved-view ownership, analytics, export behavior, or audit policy is unclear.
- Filters affect financial, compliance, or regulated reporting.

Agents must reject:

- Active filters are invisible.
- Reset behavior is missing.
- Controls are hardcoded instead of Design System inputs.

Handoff language:

> Confirm filter dimensions, defaults, apply mode, saved views, reset rules, export impact, and responsive overflow.
