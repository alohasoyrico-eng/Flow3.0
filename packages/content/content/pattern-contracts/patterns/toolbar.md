# Toolbar

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/toolbar/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/toolbar.json`

## Purpose

Group page or table actions with search, filters, export, overflow, selection count, and responsive priority.

## Use When

- A dense operational page needs repeated actions near the content they affect.
- Search, filters, export, or overflow actions need shared context.
- Action priority must remain clear across desktop and compact widths.

## Do Not Use Without Review

- Actions belong to different scopes or owners.
- The toolbar duplicates global navigation or topbar actions.
- Overflow hides destructive or required actions without policy.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines toolbar density, alignment, wrapping, and responsive overflow. |
| Voice | Owns action labels, count copy, overflow labels, and empty action copy. |
| Energy | Controls primary, secondary, disabled, selected, and danger action hierarchy. |
| State | Default, filtered, selected, loading, disabled, and overflow states are explicit. |
| Accessibility | Requires labelled controls, keyboard order, and non-color-only status. |

## Formal Purpose

Coordinate local page or table actions with search handoff, topbar boundary, status chips, overflow menus, and feedback.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `default`
- `dense`
- `overflow`
- `filter-active`
- `loading`
- `disabled`
- `permission-blocked`

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
- `Typography`

### Components

- `Badge`
- `Button`
- `Chip`
- `Input`
- `Menu`
- `Toast`

### Patterns

- `Search`
- `Topbar`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.chip.*`
- `comp.input.*`
- `comp.menu.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `primaryActions` | `component` | `Button` |
| `status` | `component` | `Badge`, `Chip` |
| `searchField` | `component` | `Input` |
| `overflow` | `component` | `Menu`, `Toast` |
| `searchBoundary` | `pattern` | `Search` |
| `topbarBoundary` | `pattern` | `Topbar` |

## Formal Governance

### Entry Conditions

- A local work surface needs grouped actions, filters, search handoff, or overflow commands.
- Actions apply to the current page, table, list, or section.
- Global navigation and account actions remain owned by Topbar.

### Decision Tree

- Use Button/Menu directly for one isolated action.
- Use Toolbar when multiple local commands share one row or control surface.
- Use Topbar for global shell navigation and account actions.

### Failure Modes

- Toolbar duplicates Topbar global behavior.
- Search is cloned instead of handed off.
- Overflow uses custom menu markup.
- Filter/status chips bypass Chip.

### Success Metrics

- Users can distinguish local actions from global shell actions.
- Keyboard users can reach actions, search handoff, and overflow.
- Local feedback and disabled states are visible and accessible.

### Accessibility

- Group toolbar controls with an accessible label.
- Expose disabled and permission reasons in text.
- Keep local search handoff distinct from global search.

### Tests

- Composes Badge, Button, Chip, Input, Menu, and Toast.
- Covers overflow, filter-active, loading, disabled, and permission states.
- Does not duplicate Topbar or Search internals.

### Agent Instructions

- Keep Topbar as shell boundary and Search as query boundary.
- Do not invent local button, chip, or menu visuals.
- Ask before adding cross-tenant or destructive bulk actions.

### Reject If

- Global navigation appears in Toolbar.
- Search implementation is cloned.
- Overflow bypasses Menu.
- Controls use raw styling instead of Flow components.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| search | Input | conditional | Scopes content search. |
| actions | Button[] | yes | Visible primary and secondary commands. |
| overflow | Menu | conditional | Less frequent actions. |
| status | Badge \| Chip | conditional | Selection or filter count. |
| feedback | Toast | conditional | Reports action result. |

## Components Used

- Input
- Button
- Menu
- Badge
- Chip
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Table toolbar | Current candidate | Search plus export and overflow actions. |
| Filtered state | Required state | Active filter count remains visible. |
| Compact overflow | Candidate | Secondary commands move to menu. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Action feedback | Commands report state without moving the toolbar. |
| Overflow reveal | Menu opens after user action and closes with selection or Escape. |

## Accessibility

- Toolbar controls have labels.
- Selection or filter count is text-backed.
- Overflow commands remain keyboard reachable.
- Disabled actions explain unavailable state when needed.

## Implementation Checklist

- Declare `actions`: Visible primary and secondary commands.
- Search field keeps focus while filtering.
- Export action shows feedback.
- Overflow menu is present for secondary actions.
- Filter count updates visibly and programmatically.

## Tests And Rejection Rules

Must test:

- Search field keeps focus while filtering.
- Export action shows feedback.
- Overflow menu is present for secondary actions.
- Filter count updates visibly and programmatically.

Reject if:

- Actions belong to different scopes.
- Required actions are hidden in overflow.
- Count state is visual only.

## MIEL

Agents can decide:

- Use Toolbar for page-local or table-local actions.
- Move lower-priority actions to Menu at compact widths.
- Expose active filters or selected count with Badge or Chip.

Agents must ask:

- Action scope, destructive policy, overflow priority, or disabled reason is unclear.

Agents must reject:

- Actions belong to different scopes.
- Required actions are hidden in overflow.
- Count state is visual only.

Handoff language:

> Confirm action scope, priority, overflow behavior, filter/selection count, and feedback.
