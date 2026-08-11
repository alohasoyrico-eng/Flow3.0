# Calendar View

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/calendar-view/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/calendar-view.json`

## Purpose

Represent scheduled maintenance, renewals, billing, route windows, and operational events with accessible date navigation and recovery states.

## Use When

- Users need to scan events by day, week, or month.
- Events have status, owner, route, renewal, or maintenance context.
- Date navigation affects dashboards, planning, or operational commitments.

## Do Not Use Without Review

- A single date selection is enough.
- Timezone, event source, recurrence, or ownership is unclear.
- Calendar data affects financial, compliance, or legal deadlines without review.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines calendar grid/list density, header controls, and responsive fallback. |
| Voice | Owns date labels, event titles, empty days, and timezone copy. |
| Energy | Controls today, selected, warning, disabled, and event status. |
| State | Today, selected, loaded, loading, empty, filtered, warning, and error states are explicit. |
| Depth | Event detail uses Popover/Drawer without hiding calendar context. |
| Accessibility | Date navigation, event labels, and selected state are text-backed. |

## Formal Purpose

Coordinate date-based records across visible range, selected day, event density, loading, empty, and drill-in behavior without creating a bespoke calendar surface.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `default`
- `range-changing`
- `selected`
- `dense`
- `loading`
- `empty`
- `error`
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
- `Card`
- `Date Range Picker`
- `Empty State`
- `List`
- `Popover`
- `Skeleton`
- `Tooltip`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.card.*`
- `comp.date-range-picker.*`
- `comp.empty-state.*`
- `comp.list.*`
- `comp.popover.*`
- `comp.skeleton.*`
- `comp.tooltip.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `rangeControls` | `component` | `Date Range Picker`, `Button` |
| `events` | `component` | `Card`, `List`, `Badge`, `Tooltip`, `Popover` |
| `status` | `component` | `Skeleton`, `Empty State` |

## Formal Governance

### Entry Conditions

- Records are organized by date or visible time range.
- Users need to move between ranges and inspect a date or event.
- The calendar can be empty, loading, dense, or filtered.

### Decision Tree

- Use Date Range Picker for selecting the visible range or date anchor.
- Use Calendar View when date-based records are primary content.
- Use List or Table when chronological records do not need a grid calendar model.

### Failure Modes

- Calendar cells become custom cards outside Card/List.
- Dense events rely only on color or tiny indicators.
- Keyboard users cannot move range, date, and event focus.
- Empty and loading states are missing.

### Success Metrics

- Users understand visible range, selected date, and event count.
- Keyboard and screen reader users can navigate dates and inspect events.
- Dense, empty, and loading states remain component-owned.

### Accessibility

- Expose visible range and selected date in text.
- Do not use color-only event categories.
- Keep keyboard navigation predictable across dates and event details.

### Tests

- Composes Date Range Picker, Card, List, Popover, Tooltip, Badge, Skeleton, and Empty State.
- Covers range, selected, dense, loading, empty, error, and disabled states.
- Does not define custom calendar/event visuals outside Flow components.

### Agent Instructions

- Compose from Flow components; keep scheduling rules and event schemas outside the pattern.
- Use this pattern for date-based content, not simple date input.
- Ask before exposing regulated route, driver, health, or payroll event details.

### Reject If

- The calendar grid recreates component visuals with raw classes.
- Dense state is color-only.
- Date navigation is pointer-only.
- Business scheduling logic lives in the pattern.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| dateControl | DateRangePicker | yes | Selected date or period anchor. |
| events | List \| Card[] | yes | Events for the selected period. |
| detail | Popover \| Tooltip | conditional | Event detail and status. |
| state | EmptyState \| Skeleton | yes | No events or loading states. |
| actions | Button[] | conditional | Create, export, or review schedule. |

## Components Used

- Date Range Picker
- List
- Card
- Popover
- Tooltip
- Empty State
- Skeleton
- Button
- Badge

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Maintenance calendar | Required | Events shown by selected period. |
| Renewal deadlines | Candidate | Warning states for upcoming deadlines. |
| Empty period | Required state | Empty State explains no scheduled events. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Period change | Updates events without page jump. |
| Detail reveal | Popover/Tooltip uses Design System overlay motion. |
| Reduced motion | Removes decorative calendar movement. |

## Accessibility

- Date control has label.
- Events are available as text list.
- Selected/today state is not color-only.
- Event detail is keyboard reachable.

## Implementation Checklist

- Declare `dateControl`: Selected date or period anchor.
- Declare `events`: Events for the selected period.
- Declare `state`: No events or loading states.
- Date change updates events.
- Empty period shows Empty State.
- Event detail opens after user action.
- Narrow viewport keeps date and events readable.

## Tests And Rejection Rules

Must test:

- Date change updates events.
- Empty period shows Empty State.
- Event detail opens after user action.
- Narrow viewport keeps date and events readable.

Reject if:

- Single Date Picker is enough.
- Events are color-only.
- Timezone or ownership is ambiguous.

## MIEL

Agents can decide:

- Use Calendar View for scheduled operational events.
- Use Date Range Picker for visible range/date anchor and List/Card for events.
- Use Empty State for no scheduled items.

Agents must ask:

- Timezone, recurrence, event source, owner, or deadline policy is unclear.
- Calendar affects billing, compliance, legal, maintenance, or route commitments.

Agents must reject:

- Single Date Picker is enough.
- Events are color-only.
- Timezone or ownership is ambiguous.

Handoff language:

> Confirm date range, timezone, event source, ownership, recurrence, status, detail action, and empty/error behavior.
