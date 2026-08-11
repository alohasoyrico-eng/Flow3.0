# Column Configurator

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/column-configurator/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/column-configurator.json`

## Purpose

Let users show, hide, reorder, and persist table columns without breaking scanability, exports, or saved views.

## Use When

- A dense desktop table has optional columns.
- Users need to adapt a table to role, process, or saved view.
- Column changes affect export, persistence, or dashboard modules.

## Do Not Use Without Review

- The table has only a few fixed columns.
- Required columns, export rules, or saved-view ownership are unclear.
- Reordering would hide compliance, financial, or identity context.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines panel width, checklist density, table preview, and responsive overflow. |
| Voice | Owns column labels, required-column copy, reset copy, and saved-view language. |
| Energy | Controls selected columns, required state, focus, and disabled treatment. |
| State | Default, dirty, applied, required, disabled, loading, and error states are explicit. |
| Depth | Column controls can appear in Menu, Dialog, or Drawer without replacing the Table component. |
| Accessibility | Column toggles, required columns, order, count, reset, and apply are keyboard reachable. |

## Formal Purpose

Coordinate table column visibility, order, required columns, reset behavior, validation, and persistence using governed table, checkbox, dialog, drawer, and menu composition.

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
- `dirty`
- `saving`
- `saved`
- `invalid`
- `resetting`
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
- `Dialog`
- `Drawer`
- `Inline Validation`
- `Menu`
- `Table`
- `Toast`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.checkbox.*`
- `comp.dialog.*`
- `comp.drawer.*`
- `comp.inline-validation.*`
- `comp.menu.*`
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
| `surface` | `component` | `Dialog`, `Drawer`, `Menu` |
| `columnList` | `component` | `Checkbox`, `Table`, `Badge` |
| `actions` | `component` | `Button`, `Inline Validation`, `Toast` |

## Formal Governance

### Entry Conditions

- A table has optional columns users can show, hide, or reorder.
- Required columns need disabled or locked reasons.
- Changes may be applied, reset, persisted, or discarded.

### Decision Tree

- Use Table props for a fixed column set.
- Use Column Configurator when column visibility or order is user-configurable.
- Use Settings when configuration spans multiple unrelated product areas.

### Failure Modes

- Column toggles are custom checkboxes.
- Required columns disappear without explanation.
- Dialog and drawer variants diverge.
- Persistence feedback bypasses Toast.

### Success Metrics

- Users can understand visible, hidden, required, and reordered columns.
- Keyboard users can toggle and apply changes.
- Table column configuration stays separate from business data rendering.

### Accessibility

- Expose required and disabled reasons in text.
- Keep focus within Dialog/Drawer when open.
- Preserve keyboard access to toggle, apply, reset, and cancel actions.

### Tests

- Composes Checkbox, Table, Dialog, Drawer, Menu, Button, Badge, Inline Validation, and Toast.
- Covers required, dirty, saving, invalid, reset, and disabled states.
- Does not recreate table or checkbox visuals.

### Agent Instructions

- Keep table data and column business definitions outside the pattern.
- Use the pattern only for visibility/order configuration.
- Ask before persisting user preferences across tenants or roles.

### Reject If

- Column controls bypass Checkbox.
- A custom overlay replaces Dialog or Drawer.
- Required columns can be hidden silently.
- Persistence feedback bypasses Toast.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| table | Table | yes | Preview or target table using package Table. |
| columns | Checkbox[] | yes | Column visibility controls with required column handling. |
| actions | Button[] | yes | Apply, reset, save view, or cancel. |
| feedback | Badge \| Toast \| InlineValidation | conditional | Dirty count, saved state, or invalid configuration feedback. |
| surface | Menu \| Dialog \| Drawer | conditional | Where the configuration controls live. |

## Components Used

- Table
- Checkbox
- Button
- Badge
- Toast
- Inline Validation
- Menu
- Dialog
- Drawer

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Visibility | Required | Users can show/hide optional columns while required columns remain protected. |
| Saved view | Candidate | Applied columns can persist as a named view. |
| Reset | Required state | Default columns can be restored without losing table data. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Column update | Preview updates after user action without changing focus unexpectedly. |
| Dirty state | Count and apply state update instantly. |
| Surface reveal | Menu/Dialog/Drawer uses Design System overlay motion and reduced-motion fallback. |

## Accessibility

- Every column control has a visible or programmatic label.
- Required columns cannot be hidden silently.
- Applied column count is text-backed.
- Keyboard users can apply and reset without losing table context.

## Implementation Checklist

- Declare `table`: Preview or target table using package Table.
- Declare `columns`: Column visibility controls with required column handling.
- Declare `actions`: Apply, reset, save view, or cancel.
- Optional column can be hidden and restored.
- Required column remains available.
- Apply updates table preview and count.
- Reset restores default columns.

## Tests And Rejection Rules

Must test:

- Optional column can be hidden and restored.
- Required column remains available.
- Apply updates table preview and count.
- Reset restores default columns.

Reject if:

- The pattern hides required context.
- The table is not using Design System Table.
- Apply/reset behavior is missing.

## MIEL

Agents can decide:

- Use Column Configurator when a table has optional columns and persistence rules.
- Keep required identity or compliance columns protected.
- Use package Table for the visible table.

Agents must ask:

- Required columns, export behavior, saved-view scope, or persistence policy is unclear.
- Columns expose financial, identity, compliance, or regulated information.

Agents must reject:

- The pattern hides required context.
- The table is not using Design System Table.
- Apply/reset behavior is missing.

Handoff language:

> Confirm required columns, optional columns, default view, persistence, export impact, saved views, and reset behavior.
