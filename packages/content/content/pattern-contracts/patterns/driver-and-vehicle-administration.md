# Driver And Vehicle Administration

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/driver-and-vehicle-administration/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/driver-and-vehicle-administration.json`

## Purpose

Support alta, baja, editing, assignment, suspension, recovery, and audit for drivers and vehicles through composed management surfaces.

## Use When

- Operators manage drivers, vehicles, cards, documents, or assignments.
- Rows require status, identity, quick actions, pagination, and audit recovery.
- Lifecycle actions need confirmation, permissions, and feedback.

## Do Not Use Without Review

- The process is only a static list.
- Lifecycle consequences, permissions, or audit policy are unclear.
- Driver and vehicle processs are mixed without clear ownership.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines split management layout, table density, summary panels, and action placement. |
| Voice | Owns lifecycle labels, confirmation copy, status, empty states, and audit language. |
| Energy | Controls active, suspended, review, maintenance, and selected states semantically. |
| State | Loaded, loading, empty, selected, dirty, suspended, pending, error, and audit states are explicit. |
| Depth | Edit, assignment, and confirmation surfaces use Design System overlays without becoming table components. |
| Accessibility | Identity, status, actions, pagination, and audit feedback are keyboard reachable and text-backed. |

## Formal Purpose

Coordinate reusable administration of drivers and vehicles through table review, quick actions, audit context, pagination, empty states, and toolbar boundary while templates own domain policy.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Desktop |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Configuration Console` |

## Formal States

- `loading`
- `empty`
- `ready`
- `selected`
- `action-running`
- `permission-blocked`
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

- `Audit Event`
- `Avatar`
- `Badge`
- `Button`
- `Card Summary`
- `Dialog`
- `Empty State`
- `Pagination`
- `Quick Action`
- `Table`
- `Toast`

### Patterns

- `Toolbar`

### Tokens

- `comp.audit-event.*`
- `comp.avatar.*`
- `comp.badge.*`
- `comp.button.*`
- `comp.card-summary.*`
- `comp.dialog.*`
- `comp.empty-state.*`
- `comp.pagination.*`
- `comp.quick-action.*`
- `comp.table.*`
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
| `summary` | `component` | `Card Summary`, `Badge` |
| `records` | `component` | `Table`, `Avatar`, `Pagination`, `Empty State` |
| `actions` | `component` | `Quick Action`, `Dialog`, `Button`, `Toast`, `Audit Event` |
| `toolbarBoundary` | `pattern` | `Toolbar` |

## Formal Governance

### Entry Conditions

- A product needs a reusable driver/vehicle admin composition.
- Records need table scanning, quick actions, pagination, audit context, or empty recovery.
- Templates own domain-specific columns, permissions, and business workflows.

### Decision Tree

- Use Table for generic records.
- Use this pattern for reusable driver/vehicle administration composition.
- Use templates for complete configuration screens and business policy.

### Failure Modes

- The pattern hardcodes domain authorization or template layout.
- Toolbar internals are duplicated.
- Quick actions bypass Quick Action/Dialog.
- Audit context is custom markup.

### Success Metrics

- Users can review, act on, and recover admin records.
- Permission and audit state remain accessible.
- Templates can vary business rules without visual duplication.

### Accessibility

- Expose row identity and action consequence.
- Tie permission reasons to disabled actions.
- Provide audit context in text.

### Tests

- Composes all listed admin components.
- Covers loading, empty, ready, selected, running, permission, and error states.
- Keeps Toolbar and templates as boundaries.

### Agent Instructions

- Do not encode domain authorization or route policy here.
- Do not clone Toolbar.
- Ask before modifying driver, vehicle, compliance, or safety records.

### Reject If

- Template business workflow is embedded.
- Actions bypass Quick Action/Dialog.
- Audit context is custom visuals.
- Permissions are hidden.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| driverTable | Table | yes | Driver rows composed from Design System table behavior. |
| vehicleTable | Table | yes | Vehicle rows composed from Design System table behavior. |
| identity | Avatar \| Badge | conditional | Driver identity and status metadata. |
| summary | CardSummary \| AuditEvent | conditional | Selected vehicle/card or recent lifecycle event. |
| actions | QuickAction \| Button[] | yes | Invite, edit, assign, suspend, recover, or export. |
| pagination | Pagination | conditional | Paged datasets and remote result sets. |

## Components Used

- Table
- Avatar
- Badge
- Quick Action
- Button
- Pagination
- Empty State
- Card Summary
- Audit Event
- Toast
- Dialog

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Driver management | Required | Driver identity, status, assignment, and lifecycle actions. |
| Vehicle management | Required | Vehicle status, card summary, maintenance state, and assignment action. |
| Recovery | Required state | Suspended or failed entities show recovery and audit trail. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Selection | Selected row updates detail context without page jump. |
| Lifecycle feedback | Confirmation and toast feedback preserve table context. |
| Pagination | Page changes preserve toolbar and status orientation. |

## Accessibility

- Tables have labels and row context.
- Lifecycle actions have explicit labels.
- Status is not color-only.
- Pagination and audit feedback are keyboard reachable.

## Implementation Checklist

- Declare `driverTable`: Driver rows composed from Design System table behavior.
- Declare `vehicleTable`: Vehicle rows composed from Design System table behavior.
- Declare `actions`: Invite, edit, assign, suspend, recover, or export.
- Driver and vehicle tabs or sections remain distinct.
- Lifecycle action requires confirmation when destructive.
- Pagination remains reachable.
- Empty and audit states are visible.

## Tests And Rejection Rules

Must test:

- Driver and vehicle tabs or sections remain distinct.
- Lifecycle action requires confirmation when destructive.
- Pagination remains reachable.
- Empty and audit states are visible.

Reject if:

- Lifecycle actions have no confirmation or audit path.
- Driver/vehicle ownership is ambiguous.
- The table is a fake component instead of Design System composition.

## MIEL

Agents can decide:

- Use this pattern for driver and vehicle lifecycle processs.
- Compose package Table and bounded Package components instead of management-table components.
- Use Audit Event for lifecycle evidence.

Agents must ask:

- Lifecycle policy, permissions, data ownership, audit requirements, or recovery rules are unclear.
- Actions affect identity, employment, finance, cards, compliance, or legal state.

Agents must reject:

- Lifecycle actions have no confirmation or audit path.
- Driver/vehicle ownership is ambiguous.
- The table is a fake component instead of Design System composition.

Handoff language:

> Confirm driver and vehicle lifecycle actions, permissions, row data, assignment rules, audit policy, recovery, and pagination.
