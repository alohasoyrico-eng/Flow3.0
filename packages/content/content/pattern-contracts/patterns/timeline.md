# Timeline

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/timeline/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/timeline.json`

## Purpose

Show ordered operational, audit, route, support, or maintenance events with grouping, filtering, status, owner, and next action.

## Use When

- Users need to understand event sequence and accountability.
- Events require grouping by time, actor, entity, or status.
- The sequence supports investigation, audit, recovery, or support handoff.

## Do Not Use Without Review

- Only one event is needed; use Audit Event.
- Ordering, timezone, grouping, or source is unclear.
- The timeline implies audit/legal evidence without a confirmed source.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines event spacing, group labels, sticky context, and responsive density. |
| Voice | Owns event titles, timestamps, actor copy, status, and recovery labels. |
| Energy | Controls status tone, current event, warning, and selected state. |
| State | Loaded, loading, empty, filtered, current, warning, critical, and verified states are explicit. |
| Depth | Details and filters layer above the timeline without hiding sequence. |
| Accessibility | Event order, timestamps, status, and grouping are readable without visual position only. |

## Formal Purpose

Coordinate chronological events with audit semantics, status, filters, empty recovery, and accessible ordering.

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
- `empty`
- `filtered`
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
- `Typography`

### Components

- `Audit Event`
- `Badge`
- `Button`
- `Chip`
- `Empty State`
- `List`

### Tokens

- `comp.audit-event.*`
- `comp.badge.*`
- `comp.button.*`
- `comp.chip.*`
- `comp.empty-state.*`
- `comp.list.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `events` | `component` | `List`, `Audit Event` |
| `filters` | `component` | `Chip`, `Badge`, `Button` |
| `emptyState` | `component` | `Empty State` |

## Formal Governance

### Entry Conditions

- A user needs to inspect ordered events or activity history.
- Events need status, actor, timestamp, or recovery context.
- The timeline may be empty, filtered, loading, or permission constrained.

### Decision Tree

- Use List for unordered or non-chronological records.
- Use Timeline when event order and audit context are the interaction.
- Use Audit Event directly when showing a single event.

### Failure Modes

- Events are custom cards instead of Audit Event/List.
- Timestamp order is unclear.
- Status relies only on color.
- Empty or permission states are missing.

### Success Metrics

- Users can understand what happened, when, and by whom.
- Assistive technology users receive event order and status.
- Filtering and recovery do not duplicate component visuals.

### Accessibility

- Expose chronological order and timestamps in text.
- Keep event status independent from color alone.
- Provide accessible empty and permission states.

### Tests

- Uses Audit Event and List for event rows.
- Covers default, loading, empty, filtered, error, and permission states.
- Does not recreate event cards or status pills.

### Agent Instructions

- Compose from Audit Event, List, Badge, Chip, Button, and Empty State.
- Keep domain event schemas and retention policy outside the pattern.
- Ask before exposing sensitive audit history.

### Reject If

- Timeline rows are custom cards.
- Event order is ambiguous.
- Status is color-only.
- Filter chips bypass Chip.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| events | AuditEvent[] \| List | yes | Ordered events with title, description, time, and status. |
| groups | DateGroup[] | conditional | Date or phase grouping when sequence needs structure. |
| filters | Chip[] \| Button[] | conditional | Status/entity filters that preserve sequence context. |
| emptyState | EmptyState | yes | Shown when no events match. |
| actions | Button[] | conditional | View detail, retry, contact support, or export. |

## Components Used

- Audit Event
- List
- Chip
- Button
- Empty State
- Badge

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Audit trail | Required | Ordered audit events with actor and status. |
| Route or maintenance | Candidate | Events grouped by route phase or maintenance state. |
| Filtered empty | Required state | Empty State appears when filters remove all events. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Filter update | Event list updates without losing scroll context. |
| Current event | Current marker changes without decorative motion. |
| Detail reveal | Uses Design System overlay behavior when details are needed. |

## Accessibility

- Events are ordered in DOM sequence.
- Timestamps and status are text-backed.
- Filtering preserves focus and announces empty state.
- Current event is not color-only.

## Implementation Checklist

- Declare `events`: Ordered events with title, description, time, and status.
- Declare `emptyState`: Shown when no events match.
- Events render in expected order.
- Filter changes visible event count.
- Empty state appears when no events match.
- Status and timestamp remain visible on narrow viewports.

## Tests And Rejection Rules

Must test:

- Events render in expected order.
- Filter changes visible event count.
- Empty state appears when no events match.
- Status and timestamp remain visible on narrow viewports.

Reject if:

- Only one event is needed.
- Ordering is ambiguous.
- Status is color-only.

## MIEL

Agents can decide:

- Use Timeline when sequence and accountability matter.
- Use Audit Event for each atomic event.
- Use Empty State for filtered results.

Agents must ask:

- Event source, order, timezone, audit status, or legal meaning is unclear.
- The timeline affects compliance, legal, finance, or support evidence.

Agents must reject:

- Only one event is needed.
- Ordering is ambiguous.
- Status is color-only.

Handoff language:

> Confirm event source, order, timezone, grouping, filters, status language, evidence policy, and detail actions.
