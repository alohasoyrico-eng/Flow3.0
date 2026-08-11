# Ticket Queue

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/ticket-queue/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/ticket-queue.json`

## Purpose

Coordinate ticket alerts, queue records, selected-ticket detail, and recovery feedback without creating a parallel support-table, notification-list, or drawer implementation.

## Use When

- A support or internal operations workflow needs alert intake plus ticket triage.
- Ticket rows need search, filters, selection, sort, pagination, and bulk actions.
- Selected tickets need governed detail and recovery feedback.

## Do Not Use Without Review

- The flow affects regulated support, safety, compliance, payments, identity, or irreversible status changes.
- The experience is only a static notification list.
- A template wants to replace Notification Panel, Dense Operational List, Drawer Adapter, or Status Feedback View behavior.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | The labelled group, notification drawer, table, detail panel, busy state, and recovery feedback stay announced through formal owners. |
| Depth | Surface owns structural grouping and focus-within behavior without a Card wrapper. |
| Energy | Alerts-open, selected, detail-open, loading, error, and disabled states cascade to child patterns. |
| Frame | Dense queue layout and responsive detail behavior remain token-driven. |
| Growth | Ticket queue behavior becomes reusable for internal templates without moving it into templates. |
| Iconography | Icons remain owned by Notification Panel, Toolbar, Dense Operational List, Drawer Adapter, and feedback children. |
| Momentum | Loading, drawer, notification, and feedback motion remain delegated to child owners. |
| State | Pattern state maps to alerts, ticket list, detail, and feedback boundaries. |
| Symbol | SLA, unread, selected, and recovery symbols remain semantic through Badge and child patterns. |
| Tone | Neutral, selected, warning, danger, and disabled tones remain contract-bound. |
| Voice | Queue summaries, alert labels, ticket filters, detail actions, and recovery copy stay explicit. |

## Formal Purpose

Coordinate ticket alerts, queue records, selected-ticket detail, and recovery feedback without creating a local support-table, notification-list, or drawer implementation.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Internal Operations Console` |

## Formal States

- `default`
- `alerts-open`
- `ticket-selected`
- `detail-open`
- `loading`
- `error`
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

### Patterns

- `Dense Operational List`
- `Drawer Adapter`
- `Notification Panel`
- `Status Feedback View`

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
| `ticketQueueSurface` | `primitive` | `Surface` |
| `queueSummary` | `component` | `Badge` |
| `queueMetric` | `component` | `Badge` |
| `queueAlertsBoundary` | `pattern` | `Notification Panel` |
| `ticketListBoundary` | `pattern` | `Dense Operational List` |
| `ticketDetailBoundary` | `pattern` | `Drawer Adapter` |
| `queueFeedbackBoundary` | `pattern` | `Status Feedback View` |

## Formal Governance

### Entry Conditions

- A support or operations surface needs alert intake and queue triage.
- Ticket records require search, filters, selection, sort, pagination, and bulk actions.
- Selected tickets need governed detail or recovery feedback without template-owned behavior.

### Decision Tree

- Use Notification Panel when only notification intake is needed.
- Use Dense Operational List when only queue records are needed.
- Use Ticket Queue when alerts, queue records, selected-ticket detail, and recovery feedback must operate as one flow.
- Use a product template when shell navigation or multi-module workspace layout is also required.

### Failure Modes

- Ticket alerts are rendered as a local list instead of Notification Panel.
- Ticket records bypass Dense Operational List or Virtual Data Table.
- Selected-ticket detail uses a local drawer, modal, or card stack instead of Drawer Adapter.
- Recovery feedback bypasses Status Feedback View.

### Success Metrics

- Users can review alerts, search/filter tickets, select rows, act in bulk, inspect detail, and recover from failure from one predictable Flow contract.
- Density and state cascade from Surface into every child pattern.
- Internal operations templates can reuse ticket behavior without redefining notification, table, drawer, or feedback logic.

### Accessibility

- Expose ticket queue as a labelled group with busy state.
- Delegate alert semantics to Notification Panel.
- Delegate table semantics to Dense Operational List and Virtual Data Table.
- Delegate detail semantics to Drawer Adapter.
- Delegate recovery and feedback semantics to Status Feedback View.

### Tests

- Composes Surface, Badge, Notification Panel, Dense Operational List, Drawer Adapter, and Status Feedback View.
- Covers default, alerts-open, ticket-selected, detail-open, loading, error, and disabled states.
- Forwards alert, ticket list, detail, and feedback callbacks.
- Rejects raw ticket tables, local notification lists, custom drawers, local feedback shells, and docs-only demos.

### Agent Instructions

- Do not create a local notification list, ticket table, ticket drawer, or support feedback shell.
- Use Surface for structural grouping; do not wrap this pattern in Card.
- Use templates only to place this pattern in a product shell, not to redefine ticket queue behavior.
- Ask before using this pattern for regulated support, safety, compliance, or irreversible operations.

### Reject If

- Alerts bypass Notification Panel.
- Ticket rows bypass Dense Operational List or Virtual Data Table.
- Detail review bypasses Drawer Adapter.
- Feedback bypasses Status Feedback View.
- Card wraps the ticket queue group.
- Density or state stops cascading to child patterns.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| ticketQueueSurface | Surface | required | Structural ticket queue group. |
| queueSummary | Badge | conditional | Queue purpose or status summary. |
| queueMetric | Badge | conditional | Ticket counts, SLA state, or triage status. |
| queueAlertsBoundary | Notification Panel | conditional | Alert drawer, unread state, mark-all, dismiss, and selected-alert behavior. |
| ticketListBoundary | Dense Operational List | required | Ticket records, search, filters, toolbar, selection, bulk actions, table states, and feedback. |
| ticketDetailBoundary | Drawer Adapter | conditional | Selected-ticket detail, review actions, responsive drawer behavior, and modal fallback. |
| queueFeedbackBoundary | Status Feedback View | conditional | Queue recovery, blocking error, toast, inline, notification, or snackbar feedback. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| ticketQueueSurface | Surface | required | Structural ticket queue group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Alerts intake | Conditional | Notification Panel owns queue alerts and unread state. |
| Operational ticket list | Required | Dense Operational List owns ticket rows, filters, actions, and table behavior. |
| Selected ticket | State | Selected ticket key cascades selected state into ticket rows. |
| Detail review | Conditional | Drawer Adapter owns selected-ticket detail and review actions. |
| Feedback recovery | Conditional | Status Feedback View owns queue status and recovery. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Loading | Surface marks busy while child patterns own loading render. |
| Alerts open | Notification Panel owns drawer motion. |
| Detail open | Drawer Adapter owns drawer/dialog motion. |
| Feedback | Status Feedback View owns queue recovery motion. |

## Accessibility

- Expose the pattern as a labelled group.
- Delegate alert semantics to Notification Panel.
- Delegate queue row semantics to Dense Operational List and Virtual Data Table.
- Delegate detail panel semantics to Drawer Adapter.
- Delegate recovery and feedback semantics to Status Feedback View.

## Implementation Checklist

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through child patterns.
- Callbacks preserve event context across alerts, tickets, detail, and feedback.
- No Card wrapper, raw ticket table, local notification list, custom drawer, local feedback shell, or docs-only shell is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through child patterns.
- Callbacks preserve event context across alerts, tickets, detail, and feedback.
- No Card wrapper, raw ticket table, local notification list, custom drawer, local feedback shell, or docs-only shell is emitted.

Reject if:

- Alerts are rendered outside Notification Panel.
- Rows are rendered outside Dense Operational List.
- Detail review bypasses Drawer Adapter.
- Feedback bypasses Status Feedback View.
- Card wraps the ticket queue group.

## MIEL

Agents can decide:

- Use Ticket Queue for reusable support or internal ticket triage workflows.
- Add Notification Panel when queue alerts or unread intake matter.
- Add Drawer Adapter only when selected tickets need detail or review actions.

Agents must ask:

- Operations affect regulated support, safety, compliance, payments, identity, or irreversible ticket status.
- A template wants custom row cards or custom notification lists.
- Queue state needs legal audit, retention, or export requirements.

Agents must reject:

- Alerts are rendered outside Notification Panel.
- Rows are rendered outside Dense Operational List.
- Detail review bypasses Drawer Adapter.
- Feedback bypasses Status Feedback View.
- Card wraps the ticket queue group.

Handoff language:

> Confirm alert source, ticket row model, SLA state, permissions, detail actions, feedback states, and regulated risk before shipping Ticket Queue.
