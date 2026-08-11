# Account Operations

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/account-operations/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/account-operations.json`

## Purpose

Coordinate account records, operational actions, detail review, and audit history without creating a parallel internal-tools table, drawer, or timeline implementation.

## Use When

- An internal operations workflow needs searchable account records plus selected-account actions.
- Account detail must open in a governed drawer or responsive modal boundary.
- Audit history must stay visible through a reusable Timeline contract.

## Do Not Use Without Review

- The flow changes regulated identity, money movement, compliance, safety, or destructive account state.
- A product template needs only static account copy.
- The workspace wants to replace Dense Operational List, Drawer Adapter, or Timeline behavior.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | The labelled group, table, detail panel, audit timeline, busy state, and action events stay announced through formal owners. |
| Depth | Surface owns structural grouping and focus-within behavior without a Card wrapper. |
| Energy | Selected, detail-open, audit-filtered, loading, error, and disabled states cascade to child patterns. |
| Frame | Dense operational spacing and responsive detail behavior remain token-driven. |
| Growth | Account operations become reusable for internal templates without moving account behavior into templates. |
| Iconography | Icons remain owned by Toolbar, Dense Operational List, Drawer Adapter, and Timeline children. |
| Momentum | Loading, drawer, and feedback motion remain delegated to child owners. |
| State | Pattern state maps to accounts, detail, and audit boundaries. |
| Symbol | Risk, status, and audit symbols remain semantic through Badge and child patterns. |
| Tone | Neutral, selected, warning, danger, and disabled tones remain contract-bound. |
| Voice | Account labels, summaries, filters, details, audit events, and recovery copy stay explicit. |

## Formal Purpose

Coordinate account records, operational actions, detail review, and audit history without creating a local internal-tools table, drawer, or timeline implementation.

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
- `account-selected`
- `detail-open`
- `audit-filtered`
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
| `accountOperationsSurface` | `primitive` | `Surface` |
| `operationsSummary` | `component` | `Badge` |
| `operationsMetric` | `component` | `Badge` |
| `accountListBoundary` | `pattern` | `Dense Operational List` |
| `accountDetailBoundary` | `pattern` | `Drawer Adapter` |
| `accountAuditBoundary` | `pattern` | `Timeline` |

## Formal Governance

### Entry Conditions

- An internal operations surface needs to scan account records and act on selected accounts.
- Account details must open through an existing drawer/dialog boundary.
- Account changes need an audit timeline without duplicating timeline rendering.

### Decision Tree

- Use Dense Operational List when only records, search, filters, and bulk actions are needed.
- Use Account Operations when account records, detail review, and audit history must work as one coordinated flow.
- Use an internal operations template when navigation, shell, module switching, or multi-panel workspace layout is also required.

### Failure Modes

- The account table is rendered outside Dense Operational List or Virtual Data Table.
- Detail review uses a local drawer, modal, card stack, or overlay instead of Drawer Adapter.
- Audit history is cloned as a local list instead of Timeline.
- The internal-tools template owns account behavior rather than composing this pattern.

### Success Metrics

- Users can search, filter, select, act, open detail, and inspect audit history through Flow-owned child boundaries.
- Density and state cascade from Surface into every child pattern.
- Internal operations templates can reuse account behavior without redefining tables, drawers, or timelines.

### Accessibility

- Expose account operations as a labelled group with busy state.
- Delegate table semantics to Dense Operational List and Virtual Data Table.
- Delegate detail panel semantics to Drawer Adapter and drawer/dialog components.
- Delegate chronological audit semantics to Timeline.

### Tests

- Composes Surface, Badge, Dense Operational List, Drawer Adapter, and Timeline.
- Covers default, account-selected, detail-open, audit-filtered, loading, error, and disabled states.
- Forwards account search, filters, sort, row selection, pagination, bulk action, toolbar overflow, detail, and audit callbacks.
- Rejects raw tables, local account cards, custom drawers, custom timelines, and docs-only shells.

### Agent Instructions

- Do not create a local account table, detail overlay, or audit list.
- Do not wrap the account operations group in Card; use Surface for structural grouping.
- Use templates only to place this pattern in a product shell, not to redefine its behavior.
- Ask before using this pattern for regulated identity, financial, safety, or compliance operations.

### Reject If

- Account rows bypass Dense Operational List or Virtual Data Table.
- Detail review bypasses Drawer Adapter.
- Audit history bypasses Timeline.
- Card wraps the account operations group.
- Density or state stops cascading to child patterns.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| accountOperationsSurface | Surface | required | Structural account operations group. |
| operationsSummary | Badge | conditional | Description or account operation status. |
| operationsMetric | Badge | conditional | Account counts, risk labels, or review status. |
| accountListBoundary | Dense Operational List | required | Account records, search, filters, toolbar, selection, bulk actions, table states, and feedback. |
| accountDetailBoundary | Drawer Adapter | conditional | Selected-account detail, review actions, responsive drawer behavior, and modal fallback. |
| accountAuditBoundary | Timeline | conditional | Audit events, audit filters, event selection, and recovery. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| accountOperationsSurface | Surface | required | Structural account operations group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Records only | Required boundary | Dense Operational List owns the account records workspace. |
| Selected account | State | Selected account key cascades selected state into account rows. |
| Detail review | Conditional | Drawer Adapter owns selected-account details and actions. |
| Audit history | Conditional | Timeline owns audit filters, events, empty, loading, and recovery states. |
| Operational metrics | Conditional | Badge owns compact account counts or risk summaries. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Loading | Surface marks busy while Dense Operational List and Timeline own loading render. |
| Detail open | Drawer Adapter owns drawer/dialog motion. |
| Audit filtered | Timeline and Badge own audit-filtered feedback. |

## Accessibility

- Expose the pattern as a labelled group.
- Delegate record semantics to Dense Operational List and Virtual Data Table.
- Delegate panel semantics to Drawer Adapter.
- Delegate chronology and audit status semantics to Timeline.

## Implementation Checklist

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through child patterns.
- Callbacks preserve event context across accounts, detail, and audit.
- No Card wrapper, raw account table, custom drawer, local timeline, or docs-only shell is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus the required child pattern boundaries.
- Density and state cascade through child patterns.
- Callbacks preserve event context across accounts, detail, and audit.
- No Card wrapper, raw account table, custom drawer, local timeline, or docs-only shell is emitted.

Reject if:

- Rows are rendered outside Dense Operational List.
- Detail review bypasses Drawer Adapter.
- Audit history bypasses Timeline.
- Card wraps the account operations group.
- The internal-tools template reimplements account behavior.

## MIEL

Agents can decide:

- Use Account Operations for reusable internal account workflows.
- Add Drawer Adapter only when selected accounts need details or review actions.
- Add Timeline only when account history or audit trail is part of the workflow.

Agents must ask:

- Operations affect regulated identity, billing, compliance, safety, or irreversible account status.
- A template wants custom row cards or custom overlays.
- Audit history needs legal retention or export requirements.

Agents must reject:

- Rows are rendered outside Dense Operational List.
- Detail review bypasses Drawer Adapter.
- Audit history bypasses Timeline.
- Card wraps the account operations group.
- The internal-tools template reimplements account behavior.

Handoff language:

> Confirm row model, account permissions, detail actions, audit event source, filter model, selected-account behavior, and regulated risk before shipping Account Operations.
