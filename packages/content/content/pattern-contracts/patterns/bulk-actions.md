# Bulk Actions

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/bulk-actions/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/bulk-actions.json`

## Purpose

Coordinate selection across many records and expose a temporary action surface with count, policy, confirmation, progress, undo, and recovery.

## Use When

- Users need to apply one action to multiple rows, cards, drivers, vehicles, movements, or permissions.
- Selection state must persist while filtering, sorting, paging, or scrolling.
- Actions can be destructive, asynchronous, permissioned, export-oriented, or reversible.

## Do Not Use Without Review

- Only one item can be acted on at a time.
- The action consequence, permission rule, confirmation, undo, or audit event is unknown.
- The pattern hides selected count, affected records, or destructive risk.
- Selection state is stored only in the visual table row and cannot survive filtering or pagination.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines table/card selection rhythm, toolbar placement, sticky behavior, and responsive overflow. |
| Voice | Names selected count, action consequence, destructive risk, progress, success, and undo copy. |
| Energy | Controls selected rows, toolbar surface, focus, action priority, and destructive confirmation. |
| Depth | Separates the bulk toolbar or sheet from the content without hiding selected context. |
| Momentum | Reveals the action toolbar after user selection and respects reduced motion. |
| State | Selected, indeterminate, disabled, loading, confirming, success, error, and undo states are explicit. |
| Accessibility | Requires keyboard selection, select-all state, announced toolbar, Escape close, focus restoration, and non-color-only selected state. |

## Formal Purpose

Coordinate actions over multiple selected records with toolbar handoff, selection count, confirmation, progress, permissions, and recovery.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `none-selected`
- `selected`
- `partially-eligible`
- `confirming`
- `running`
- `partial-failure`
- `complete`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
- `Energy`
- `Frame`
- `Momentum`
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
- `Checkbox`
- `Dialog`
- `Menu`
- `Progress Indicator`
- `Table`
- `Toast`

### Patterns

- `Toolbar`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.checkbox.*`
- `comp.dialog.*`
- `comp.menu.*`
- `comp.progress-indicator.*`
- `comp.table.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `selection` | `component` | `Table`, `Checkbox`, `Badge` |
| `actions` | `component` | `Button`, `Menu`, `Dialog` |
| `feedback` | `component` | `Progress Indicator`, `Toast` |
| `toolbarBoundary` | `pattern` | `Toolbar` |

## Formal Governance

### Entry Conditions

- Users can select multiple records and apply one command.
- Selection count, eligibility, progress, confirmation, or recovery is needed.
- Toolbar hosts entry points but does not own bulk action policy.

### Decision Tree

- Use Toolbar for local action placement.
- Use Bulk Actions when selected records change action eligibility or workflow.
- Use Confirmation Dialog for one risky action consequence review.

### Failure Modes

- Selection count is visual-only.
- Bulk commands bypass Button/Menu/Dialog.
- Ineligible rows lack reasons.
- Progress or partial failure is not recoverable.

### Success Metrics

- Users understand selected count, eligible records, and action consequence.
- Keyboard users can select, review, confirm, and recover.
- Bulk action policy stays outside Table and Toolbar internals.

### Accessibility

- Expose selected count and eligibility reasons.
- Use Dialog for risky confirmation.
- Announce progress, partial failure, and completion.

### Tests

- Composes Badge, Button, Checkbox, Dialog, Menu, Progress Indicator, Table, and Toast.
- Covers selected, partially eligible, confirming, running, partial failure, complete, and disabled states.
- Keeps Toolbar as host boundary.

### Agent Instructions

- Keep action authorization and business operation policy outside the pattern.
- Do not clone Toolbar or Table selection internals.
- Ask before bulk-changing permissions, financial records, identity, or compliance data.

### Reject If

- Selection count is inaccessible.
- Bulk commands bypass Button/Menu/Dialog.
- Progress is visual-only.
- Toolbar owns operation policy.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| selectionModel | SelectionState | yes | Stable selected keys independent from visible row order. |
| selectionControls | Checkbox \| Toggle | yes | Row and select-all controls with indeterminate state. |
| toolbar | BulkActionToolbar | yes | Temporary action surface with selected count and commands. |
| actions | BulkAction[] | yes | Each action declares risk, permission, async behavior, and confirmation need. |
| confirmation | Dialog \| InlineConfirm | conditional | Required for destructive, financial, permission, or irreversible actions. |
| feedback | Toast \| Progress \| AuditEvent | yes | Communicates progress, success, failure, undo, and audit result. |
| responsiveMode | toolbar \| bottom-sheet \| overflow-menu | yes | Desktop may use toolbar; mobile moves actions to sheet/menu. |

## Components Used

- Table
- Checkbox
- Button
- Menu
- Dialog
- Toast
- Badge
- Progress Indicator

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Table selection | Current candidate | Rows plus select-all header and contextual toolbar. |
| Card selection | Candidate | Cards use explicit selection controls and a bottom action bar. |
| Destructive action | Required state | Requires confirmation, progress, and recovery/undo. |
| Export action | Candidate | Can skip confirmation when data scope is visible and permissioned. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Toolbar reveal | Appears after the first user selection; reduced motion uses instant state change. |
| Selection feedback | Selected items update immediately; no delayed animation can hide state. |
| Progress feedback | Async actions expose loading/progress before success or failure. |

## Accessibility

- Select-all exposes checked, unchecked, and indeterminate state.
- Selected count is announced when the toolbar appears.
- Keyboard users can select rows and reach bulk actions without losing context.
- Escape clears or closes the toolbar only when that behavior is explicitly documented.
- Destructive actions require confirmation and clear entity naming.

## Implementation Checklist

- Declare `selectionModel`: Stable selected keys independent from visible row order.
- Declare `selectionControls`: Row and select-all controls with indeterminate state.
- Declare `toolbar`: Temporary action surface with selected count and commands.
- Declare `actions`: Each action declares risk, permission, async behavior, and confirmation need.
- Declare `feedback`: Communicates progress, success, failure, undo, and audit result.
- Declare `responsiveMode`: Desktop may use toolbar; mobile moves actions to sheet/menu.
- Select/deselect single row.
- Select all visible records and expose indeterminate state.
- Selection survives filtering/sorting/pagination when product rules require it.
- Destructive action requires confirmation and announces result.
- Async progress, success, error, and undo are visible and accessible.
- Mobile action surface does not cover selected context without a close path.

## Tests And Rejection Rules

Must test:

- Select/deselect single row.
- Select all visible records and expose indeterminate state.
- Selection survives filtering/sorting/pagination when product rules require it.
- Destructive action requires confirmation and announces result.
- Async progress, success, error, and undo are visible and accessible.
- Mobile action surface does not cover selected context without a close path.

Reject if:

- Selected count or selected entities are hidden.
- Destructive action runs without confirmation or recovery.
- Selection is visual-only and not machine-readable.

## MIEL

Agents can decide:

- Use Bulk Actions when selected records and allowed actions are explicit.
- Choose toolbar, sheet, or overflow mode from viewport and density rules.
- Require confirmation for destructive or permission-sensitive actions.

Agents must ask:

- Action consequence, selected scope, audit event, permission rule, or undo behavior is unclear.
- Selection should persist across filters, pages, or backend result sets.
- The action can affect money, access, compliance, legal records, or irreversible state.

Agents must reject:

- Selected count or selected entities are hidden.
- Destructive action runs without confirmation or recovery.
- Selection is visual-only and not machine-readable.

Handoff language:

> Confirm selection scope, permitted actions, destructive policy, progress feedback, undo, audit, and responsive action surface.
