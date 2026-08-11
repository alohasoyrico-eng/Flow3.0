# Notification Panel

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/notification-panel/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/notification-panel.json`

## Purpose

Collect operational alerts, approvals, sync issues, and risk notices in a prioritized review surface tied to a notification trigger.

## Use When

- Users need to review multiple alerts without leaving the current process.
- Notifications have priority, read/unread state, timestamps, and actions.
- A topbar or shell slot needs a count-backed panel.

## Do Not Use Without Review

- A single transient message would be better as Toast.
- Read/unread, priority, routing, or action ownership is unclear.
- The panel becomes a task inbox without escalation rules.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines panel width, list density, action placement, and responsive drawer fallback. |
| Voice | Owns alert titles, timestamps, action labels, and empty/read state copy. |
| Energy | Controls unread emphasis, priority tone, selected item, and action states. |
| Depth | Panel floats from shell and separates from page content. |
| State | Unread, read, priority, loading, empty, dismissed, and actioned states are explicit. |
| Accessibility | Trigger count, panel label, keyboard list access, Escape close, and live updates are required. |

## Formal Purpose

Coordinate notification lists opened from a shell boundary with unread status, empty recovery, actions, drawer behavior, and transient feedback.

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
- `loading`
- `empty`
- `unread`
- `all-read`
- `error`
- `permission-blocked`

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
- `Drawer`
- `Empty State`
- `Icon Button`
- `List`
- `Toast`

### Patterns

- `Topbar`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.drawer.*`
- `comp.empty-state.*`
- `comp.icon-button.*`
- `comp.list.*`
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
| `surface` | `component` | `Drawer` |
| `items` | `component` | `List`, `Badge`, `Button`, `Icon Button` |
| `feedback` | `component` | `Empty State`, `Toast` |

## Formal Governance

### Entry Conditions

- Users need to inspect notifications or alerts from a shell trigger.
- Unread count, empty state, action, or mark-read behavior is required.
- The shell trigger remains owned by Topbar.

### Decision Tree

- Use Badge/Icon Button for a simple count trigger.
- Use Notification Panel when notifications need list inspection and actions.
- Use Snackbar Provider for transient feedback rather than historical notification lists.

### Failure Modes

- Panel duplicates Topbar trigger implementation.
- Notification rows are custom cards instead of List.
- Unread status is color-only.
- Drawer behavior is hand-rolled.

### Success Metrics

- Users can inspect unread/read notifications and act on them.
- Keyboard and screen reader users can open, navigate, dismiss, and mark items.
- Topbar owns trigger placement while the panel owns list behavior.

### Accessibility

- Announce unread count in text.
- Use Drawer focus behavior when open.
- Do not rely on color-only read/unread state.

### Tests

- Composes Drawer, List, Badge, Button, Icon Button, Empty State, and Toast.
- Covers open, loading, empty, unread, all-read, error, and permission states.
- Keeps Topbar as trigger boundary only.

### Agent Instructions

- Do not implement shell trigger or navigation here.
- Keep notification transport and retention policy outside the pattern.
- Ask before exposing sensitive alerts.

### Reject If

- Drawer is recreated manually.
- Notification rows bypass List.
- Unread state is color-only.
- Topbar code is duplicated.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | IconButton + Badge | yes | Shows count and opens panel after user action. |
| list | List | yes | Prioritized notification rows. |
| actions | Button[] | conditional | Resolve, review, mark all read, or open detail. |
| emptyState | EmptyState | yes | Shown when no notifications need attention. |
| feedback | Toast | conditional | Confirms dismissed or actioned notifications. |
| responsiveMode | floating panel \| drawer fallback | yes | Panel floats on desktop and can become drawer/sheet on small viewports. |

## Components Used

- Icon Button
- Badge
- Button
- Drawer
- List
- Toast
- Empty State

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Unread review | Current desktop | Icon button with count-backed actionable unread list. |
| All clear | Required state | Empty State when no items remain. |
| Mobile drawer | Future mobile fallback | Panel moves to drawer/sheet with close path after mobile work starts. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Panel reveal | Opens after trigger and closes with Escape or outside action. |
| Unread resolution | Resolved rows update without hiding context. |
| Toast feedback | Action feedback is transient and non-blocking. |

## Accessibility

- Notification trigger exposes count text, not color only.
- Panel has an accessible label.
- Unread state is not color-only.
- Keyboard users can review and action items.
- Empty state is announced when the list becomes empty.

## Implementation Checklist

- Declare `trigger`: Shows count and opens panel after user action.
- Declare `list`: Prioritized notification rows.
- Declare `emptyState`: Shown when no notifications need attention.
- Declare `responsiveMode`: Panel floats on desktop and can become drawer/sheet on small viewports.
- Icon Button trigger opens and closes the panel.
- Badge count matches unread items.
- Mark all read updates list and count.
- Empty state appears when no notifications remain.
- Mobile fallback preserves close and focus behavior.

## Tests And Rejection Rules

Must test:

- Icon Button trigger opens and closes the panel.
- Badge count matches unread items.
- Mark all read updates list and count.
- Empty state appears when no notifications remain.
- Mobile fallback preserves close and focus behavior.

Reject if:

- A single message should be Toast.
- Count is color-only.
- Actions do not declare owner or result feedback.

## MIEL

Agents can decide:

- Use Notification Panel when multiple alerts need review.
- Choose popover or drawer from viewport and shell rules.
- Show empty state after all notifications are read.

Agents must ask:

- Notification source, priority, read state, routing, or action ownership is unclear.
- Notifications affect approvals, finance, compliance, security, or legal state.

Agents must reject:

- A single message should be Toast.
- Count is color-only.
- Actions do not declare owner or result feedback.

Handoff language:

> Confirm trigger, count source, priority model, read state, action ownership, routing, and mobile fallback.
