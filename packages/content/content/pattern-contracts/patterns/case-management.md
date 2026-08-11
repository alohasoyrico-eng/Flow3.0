# Case Management

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/case-management/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/case-management.json`

## Purpose

Coordinate case filters, case records, selected-case detail, activity timeline, and recovery feedback without creating a parallel cases table, filter shell, detail drawer, or activity feed.

## Use When

- An internal operations workflow needs filtered case triage.
- Case rows need search, filters, selection, sort, pagination, and bulk actions.
- Selected cases need governed detail and chronological activity.

## Do Not Use Without Review

- The flow affects regulated support, safety, compliance, legal, payments, identity, or irreversible status changes.
- The experience is only a static case list.
- A template wants to replace Advanced Filters, Dense Operational List, Drawer Adapter, Timeline, or Status Feedback View behavior.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | The labelled group, filter drawer, table, detail panel, timeline, busy state, and recovery feedback stay announced through formal owners. |
| Depth | Surface owns structural grouping and focus-within behavior without a Card wrapper. |
| Energy | Filters-open, selected, detail-open, activity-filtered, loading, error, and disabled states cascade to child patterns. |
| Frame | Dense case layout and responsive detail behavior remain token-driven. |
| Growth | Case management behavior becomes reusable for internal templates without moving it into templates. |
| Iconography | Icons remain owned by Advanced Filters, Toolbar, Dense Operational List, Drawer Adapter, Timeline, and feedback children. |
| Momentum | Loading, drawer, timeline, and feedback motion remain delegated to child owners. |
| State | Pattern state maps to filters, case list, detail, timeline, and feedback boundaries. |
| Symbol | SLA, selected, timeline, risk, and recovery symbols remain semantic through Badge and child patterns. |
| Tone | Neutral, selected, warning, danger, and disabled tones remain contract-bound. |
| Voice | Case summaries, filters, detail actions, timeline events, and recovery copy stay explicit. |

## Formal Purpose

Coordinate case filters, case records, selected-case detail, activity timeline, and recovery feedback without creating a local cases table, filter shell, detail drawer, or activity feed.

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
- `filters-open`
- `case-selected`
- `detail-open`
- `activity-filtered`
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

- `Advanced Filters`
- `Dense Operational List`
- `Drawer Adapter`
- `Status Feedback View`
- `Timeline`

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
| `caseManagementSurface` | `primitive` | `Surface` |
| `caseSummary` | `component` | `Badge` |
| `caseMetric` | `component` | `Badge` |
| `caseFiltersBoundary` | `pattern` | `Advanced Filters` |
| `caseListBoundary` | `pattern` | `Dense Operational List` |
| `caseDetailBoundary` | `pattern` | `Drawer Adapter` |
| `caseTimelineBoundary` | `pattern` | `Timeline` |
| `caseFeedbackBoundary` | `pattern` | `Status Feedback View` |

## Formal Governance

### Entry Conditions

- An operations surface needs to filter, scan, select, and act on case records.
- Selected cases need governed detail or review actions.
- Case activity needs a timeline without duplicating audit rendering.

### Decision Tree

- Use Dense Operational List when only records and operations are needed.
- Use Timeline when only case activity history is needed.
- Use Case Management when filters, records, detail, activity timeline, and feedback must operate as one case workflow.
- Use a product template when navigation, module switching, or workspace shell is also required.

### Failure Modes

- Case filters bypass Advanced Filters.
- Case records bypass Dense Operational List or Virtual Data Table.
- Selected-case detail uses a local drawer or card stack instead of Drawer Adapter.
- Activity history is cloned as a local list instead of Timeline.
- Recovery feedback bypasses Status Feedback View.

### Success Metrics

- Users can filter, search, select, sort, paginate, inspect detail, review activity, and recover from failure through Flow-owned boundaries.
- Density and state cascade from Surface into every child pattern.
- Internal operations templates can reuse case behavior without redefining filters, tables, drawers, timelines, or feedback.

### Accessibility

- Expose case management as a labelled group with busy state.
- Delegate filter semantics to Advanced Filters.
- Delegate table semantics to Dense Operational List and Virtual Data Table.
- Delegate detail semantics to Drawer Adapter.
- Delegate chronological activity semantics to Timeline.
- Delegate recovery semantics to Status Feedback View.

### Tests

- Composes Surface, Badge, Advanced Filters, Dense Operational List, Drawer Adapter, Timeline, and Status Feedback View.
- Covers default, filters-open, case-selected, detail-open, activity-filtered, loading, error, and disabled states.
- Forwards filter, case list, detail, timeline, and feedback callbacks.
- Rejects raw case tables, custom filters, custom drawers, local activity feeds, local feedback shells, and docs-only demos.

### Agent Instructions

- Do not create a local case filter shell, case table, case drawer, activity feed, or feedback shell.
- Use Surface for structural grouping; do not wrap this pattern in Card.
- Use templates only to place this pattern in a product shell, not to redefine case management behavior.
- Ask before using this pattern for regulated support, safety, compliance, legal, or irreversible operations.

### Reject If

- Filters bypass Advanced Filters.
- Case rows bypass Dense Operational List or Virtual Data Table.
- Detail review bypasses Drawer Adapter.
- Activity history bypasses Timeline.
- Feedback bypasses Status Feedback View.
- Card wraps the case management group.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| caseManagementSurface | Surface | required | Structural case management group. |
| caseSummary | Badge | conditional | Case workflow purpose or status summary. |
| caseMetric | Badge | conditional | Case counts, SLA state, or review status. |
| caseFiltersBoundary | Advanced Filters | conditional | Case filters, saved views, drawer, apply, reset, validation, and filter feedback. |
| caseListBoundary | Dense Operational List | required | Case records, search, filters, toolbar, selection, bulk actions, table states, and feedback. |
| caseDetailBoundary | Drawer Adapter | conditional | Selected-case detail, review actions, responsive drawer behavior, and modal fallback. |
| caseTimelineBoundary | Timeline | conditional | Activity events, timeline filters, event selection, clear, and recovery. |
| caseFeedbackBoundary | Status Feedback View | conditional | Case recovery, blocking error, toast, inline, notification, or snackbar feedback. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| caseManagementSurface | Surface | required | Structural case management group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Filtered cases | Conditional | Advanced Filters owns filter fields, saved views, apply, reset, and validation. |
| Operational case list | Required | Dense Operational List owns case rows, filters, actions, and table behavior. |
| Selected case | State | Selected case key cascades selected state into case rows. |
| Detail review | Conditional | Drawer Adapter owns selected-case detail and review actions. |
| Activity timeline | Conditional | Timeline owns activity filters, events, empty, loading, and recovery. |
| Feedback recovery | Conditional | Status Feedback View owns case status and recovery. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Loading | Surface marks busy while child patterns own loading render. |
| Filters open | Advanced Filters owns drawer/filter interactions. |
| Detail open | Drawer Adapter owns drawer/dialog motion. |
| Activity filtered | Timeline owns filter and clear feedback. |
| Feedback | Status Feedback View owns recovery motion. |

## Accessibility

- Expose the pattern as a labelled group.
- Delegate filter semantics to Advanced Filters.
- Delegate queue row semantics to Dense Operational List and Virtual Data Table.
- Delegate detail panel semantics to Drawer Adapter.
- Delegate chronological activity semantics to Timeline.
- Delegate recovery and feedback semantics to Status Feedback View.

## Implementation Checklist

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through child patterns.
- Callbacks preserve event context across filters, cases, detail, timeline, and feedback.
- No Card wrapper, raw case table, custom filter shell, custom drawer, local activity feed, local feedback shell, or docs-only shell is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through child patterns.
- Callbacks preserve event context across filters, cases, detail, timeline, and feedback.
- No Card wrapper, raw case table, custom filter shell, custom drawer, local activity feed, local feedback shell, or docs-only shell is emitted.

Reject if:

- Filters are rendered outside Advanced Filters.
- Rows are rendered outside Dense Operational List.
- Detail review bypasses Drawer Adapter.
- Activity history bypasses Timeline.
- Feedback bypasses Status Feedback View.
- Card wraps the case management group.

## MIEL

Agents can decide:

- Use Case Management for reusable internal case triage workflows.
- Add Advanced Filters when saved views or richer filter criteria matter.
- Add Timeline when selected-case activity is part of the workflow.

Agents must ask:

- Operations affect regulated support, safety, compliance, legal, payments, identity, or irreversible case status.
- A template wants custom row cards or custom activity feeds.
- Case history needs legal audit, retention, export, or escalation requirements.

Agents must reject:

- Filters are rendered outside Advanced Filters.
- Rows are rendered outside Dense Operational List.
- Detail review bypasses Drawer Adapter.
- Activity history bypasses Timeline.
- Feedback bypasses Status Feedback View.
- Card wraps the case management group.

Handoff language:

> Confirm filter model, case row model, permissions, SLA state, detail actions, activity source, feedback states, and regulated risk before shipping Case Management.
