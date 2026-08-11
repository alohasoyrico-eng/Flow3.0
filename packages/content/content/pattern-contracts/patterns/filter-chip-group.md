# Filter Chip Group

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/filter-chip-group/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/filter-chip-group.json`

## Purpose

Expose active filters as removable chips with reset, count, overflow, keyboard behavior, and empty recovery.

## Use When

- Users need to review and remove active filters quickly.
- Filters are applied outside the current viewport or from multiple controls.
- A query needs clear count, reset, and empty state feedback.

## Do Not Use Without Review

- There are no active filters to review.
- Removing filters has unclear persistence or side effects.
- The chips become the only way to discover available filters.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines chip wrapping, overflow, reset placement, and compact behavior. |
| Voice | Owns filter labels, count copy, reset label, and empty copy. |
| Energy | Controls selected, removable, disabled, and focus states. |
| State | Empty, active, overflow, dirty, applied, and cleared states are explicit. |
| Accessibility | Requires removable button semantics and count feedback. |

## Formal Purpose

Coordinate active filters as removable chips with count feedback, empty recovery, reset behavior, and accessible state changes.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `empty`
- `active`
- `overflow`
- `removing`
- `resetting`
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
- `Focus`
- `Iconography`
- `Loading`
- `Measurement`
- `Message`
- `Motion Curves`
- `Radius`
- `Spacing`
- `Typography`

### Components

- `Badge`
- `Button`
- `Chip`
- `Empty State`
- `Toast`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.chip.*`
- `comp.empty-state.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `filters` | `component` | `Chip` |
| `summary` | `component` | `Badge` |
| `reset` | `component` | `Button` |
| `emptyState` | `component` | `Empty State` |
| `feedback` | `component` | `Toast` |

## Formal Governance

### Entry Conditions

- Users need to see, remove, or reset active filters outside the filter editor.
- The filtered result set needs count, empty, or recovery feedback.
- Filters can be applied from multiple controls but need one governed summary.

### Decision Tree

- Use Chip alone for a static label or simple token.
- Use Filter Chip Group when chips represent applied query constraints.
- Use Advanced Filters when users need to edit complex rules before applying them.

### Failure Modes

- A chip looks removable but does not update results.
- Reset behavior is hidden or implemented as a custom button.
- Filter state is duplicated between toolbar, table, and chips.
- Empty recovery is shown as ad hoc copy instead of Empty State.

### Success Metrics

- Users can understand the active filter set at a glance.
- Removing or resetting filters updates results predictably.
- Assistive technology users receive clear state changes.

### Accessibility

- Expose each chip remove control with the filter name.
- Announce result count or empty state after filter changes.
- Keep focus predictable after removing the focused chip.

### Tests

- Removes individual chips without custom button visuals.
- Resets all filters through Button.
- Shows Empty State and Toast through Flow components.

### Agent Instructions

- Compose from Chip, Button, Badge, Empty State, and Toast.
- Keep filter editing controls in Advanced Filters, Toolbar, Search, or product forms.
- Do not invent local chip, badge, or reset-button classes.

### Reject If

- Filter summary and filter editor are the same component.
- Chips are decorative and do not reflect real query state.
- A second chip visual style appears outside Chip.
- Raw spacing, radius, color, or motion bypasses tokens.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| chips | Chip[] | yes | Active filter values. |
| count | Badge | conditional | Total active filters. |
| reset | Button | conditional | Clears all filters. |
| emptyState | EmptyState | conditional | Shown when no filters are active. |
| feedback | Toast | conditional | Reports cleared or applied filters. |

## Components Used

- Chip
- Badge
- Button
- Empty State
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Active filters | Current candidate | Removable chips with count and clear action. |
| Empty filters | Required state | Empty state appears after clearing. |
| Overflow filters | Candidate | Excess filters collapse or wrap with clear count. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Remove chip | Chip disappears without moving keyboard focus unpredictably. |
| Clear all | Empty state replaces chips after user action. |

## Accessibility

- Removable chips include filter names.
- Count is text-backed.
- Clear all is keyboard reachable.
- Empty state is announced when all filters are cleared.

## Implementation Checklist

- Declare `chips`: Active filter values.
- Removing one chip updates count.
- Clear all hides chips and shows Empty State.
- Toast reports reset feedback.
- Keyboard users can remove filters.

## Tests And Rejection Rules

Must test:

- Removing one chip updates count.
- Clear all hides chips and shows Empty State.
- Toast reports reset feedback.
- Keyboard users can remove filters.

Reject if:

- Chips are static labels with no removal behavior.
- Count is color-only.
- Clearing filters has no feedback.

## MIEL

Agents can decide:

- Use Filter Chip Group for active filters already applied.
- Use Badge for active count.
- Show Empty State when all filters are removed.

Agents must ask:

- Filter persistence, query side effects, or reset behavior is unclear.

Agents must reject:

- Chips are static labels with no removal behavior.
- Count is color-only.
- Clearing filters has no feedback.

Handoff language:

> Confirm filter source, removal behavior, reset policy, count copy, and empty state.
