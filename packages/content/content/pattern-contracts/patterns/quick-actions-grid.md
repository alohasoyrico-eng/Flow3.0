# Quick Actions Grid

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/quick-actions-grid/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/quick-actions-grid.json`

## Purpose

Group frequent mobile actions into a scannable grid with labels, permission states, confirmation, and feedback.

## Use When

- A mobile dashboard or object detail needs frequent shortcuts.
- Actions are independent and can be understood by label plus icon.
- Permission or risk states must remain visible.

## Do Not Use Without Review

- The grid duplicates primary navigation.
- Actions need long explanation, search, or form input.
- Disabled or destructive actions lack recovery copy.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines grid columns, tap target size, gap, and responsive wrapping. |
| Voice | Keeps action labels direct and explains unavailable actions. |
| Energy | Controls priority, disabled, danger, focus, and selected states. |
| Iconography | Uses icons only as reinforcement; text remains required. |
| Accessibility | Requires labels, focus order, and non-color-only status. |

## Formal Purpose

Coordinate a compact set of high-frequency actions with status, tooltip explanation, optional confirmation, and search-adjacent discovery boundaries.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `default`
- `loading`
- `disabled`
- `permission-blocked`
- `confirming`
- `completed`
- `error`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Energy`
- `Frame`
- `Iconography`
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
- `Dialog`
- `IconButton`
- `Toast`
- `Tooltip`

### Patterns

- `Search`

### Tokens

- `comp.badge.*`
- `comp.dialog.*`
- `component.pattern-action-item.*`
- `comp.toast.*`
- `comp.tooltip.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.iconography.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `actions` | `component` | `IconButton`, `Badge`, `Tooltip` |
| `confirmation` | `component` | `Dialog` |
| `feedback` | `component` | `Toast` |
| `searchBoundary` | `pattern` | `Search` |

## Formal Governance

### Entry Conditions

- A surface needs a small set of repeatable actions.
- Actions need compact labels, icons, status, or short explanation.
- Search may reveal action targets but must not own the action grid.

### Decision Tree

- Use IconButton for a single compact command.
- Use QuickActionsGrid when multiple quick commands need layout, grouping, or status.
- Use Command Palette when actions are discovered through a global command query.

### Failure Modes

- Actions are hand-built buttons instead of IconButton.
- Tooltip is the only source of required meaning.
- Search owns action execution.
- Risky actions bypass Dialog or Toast recovery.

### Success Metrics

- Users can scan and trigger common actions quickly.
- Every icon action has a durable accessible name.
- Risk, status, and recovery stay component-owned.

### Accessibility

- Do not rely on icon-only meaning.
- Keep tooltip supplemental, not required.
- Expose disabled and permission reasons in text.

### Tests

- Composes IconButton, Badge, Tooltip, Dialog, and Toast.
- Covers disabled, permission, confirming, completed, and error states.
- Keeps Search as discovery boundary only.

### Agent Instructions

- Do not recreate Button or IconButton visuals.
- Keep product-specific action policies outside the pattern.
- Ask before exposing destructive or regulated actions.

### Reject If

- Actions are custom buttons.
- Icon meaning is tooltip-only.
- Search implementation is embedded.
- Raw tokens bypass Flow components.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| actions | QuickActionsGridAction[] | yes | Frequent independent actions. |
| hint | Tooltip | conditional | Short explanation for blocked or ambiguous actions. |
| confirmation | Dialog | conditional | Required for risky actions. |
| status | Badge | conditional | Small state count or availability marker. |
| feedback | Toast | conditional | Reports selected action result. |

## Components Used

- IconButton
- Tooltip
- Dialog
- Toast
- Badge

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Object shortcuts | Current candidate | Common actions for a vehicle or card. |
| Permissioned action | Required state | Disabled or blocked action explains why. |
| Danger action | Candidate | Risky shortcut opens confirmation before side effect. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Activation | Feedback appears after explicit action. |
| Confirmation | Risky action opens Dialog with Design System overlay motion. |
| Hint | Tooltip appears only on user request or focus. |

## Accessibility

- Each quick action has a text label.
- Disabled actions expose the reason.
- Grid order matches visual reading order.
- Confirmation is required for risky side effects.

## Implementation Checklist

- Declare `actions`: Frequent independent actions.
- Actions render through IconButton components.
- Blocked action exposes Tooltip copy.
- Risky action opens Dialog after click.
- Confirmed action shows Toast.
- Small viewport keeps targets reachable.

## Tests And Rejection Rules

Must test:

- Actions render through IconButton components.
- Blocked action exposes Tooltip copy.
- Risky action opens Dialog after click.
- Confirmed action shows Toast.
- Small viewport keeps targets reachable.

Reject if:

- The grid becomes navigation.
- Actions are icon-only.
- Disabled state has no explanation.

## MIEL

Agents can decide:

- Use Quick Actions Grid for frequent independent shortcuts.
- Use Tooltip for short blocked-state hints.
- Use Dialog for risky action confirmation.

Agents must ask:

- Action priority, permissions, destructive policy, or grid density is unclear.

Agents must reject:

- The grid becomes navigation.
- Actions are icon-only.
- Disabled state has no explanation.

Handoff language:

> Confirm action list, priority, permission states, destructive rules, grid density, and feedback.
