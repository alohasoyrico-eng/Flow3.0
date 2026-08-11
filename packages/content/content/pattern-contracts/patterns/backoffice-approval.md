# Backoffice Approval

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/backoffice-approval/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/backoffice-approval.json`

## Purpose

Coordinate operational document approval queues, document detail review, approve/reject decisions, and feedback without becoming an internal-tools template.

## Use When

- A workflow manages submitted documents, KYC evidence, licenses, insurance, or fleet onboarding files.
- Operators need queue selection, detail review, approve/reject decisions, and completion feedback.
- The approval behavior must be reusable across internal operations templates.

## Do Not Use Without Review

- The approval affects regulated, identity, payment, health, legal, safety, or irreversible decisions.
- The workflow only needs a generic queue without document decision behavior.
- Document access is represented only by shell role or route guard.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | A labelled Surface and delegated queue/drawer/feedback boundaries keep document decisions operable. |
| Depth | Surface owns grouping while Dense Operational List and Drawer Adapter own queue/detail depth. |
| Energy | Pending, selected, detail-open, deciding, error, and disabled states cascade into badges and pattern boundaries. |
| Frame | Queue rows, drawer detail, density, and feedback remain token-driven. |
| Growth | Approval behavior can move into future internal-tools templates without cloning table or drawer behavior. |
| Iconography | Document and status icons remain owned by child components and patterns. |
| Momentum | Deciding/loading behavior remains delegated to Flow state contracts. |
| State | Approval state maps explicitly to queue, drawer, decision, and feedback boundaries. |
| Symbol | Document symbols may support recognition, but text remains required for status, file, account, submitted time, and decision meaning. |
| Tone | Pending, approved, rejected, warning, danger, and disabled tones remain contract-bound. |
| Voice | Decision labels, document copy, and recovery messages stay explicit. |

## Formal Purpose

Coordinate operational document approval queues, document detail review, approve/reject decisions, and feedback without becoming an internal-tools template.

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
- `pending-review`
- `document-selected`
- `detail-open`
- `deciding`
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
| `backofficeApprovalSurface` | `primitive` | `Surface` |
| `approvalSummary` | `component` | `Badge` |
| `approvalMetric` | `component` | `Badge` |
| `approvalQueueBoundary` | `pattern` | `Dense Operational List` |
| `approvalDetailBoundary` | `pattern` | `Drawer Adapter` |
| `approvalFeedbackBoundary` | `pattern` | `Status Feedback View` |

## Formal Governance

### Entry Conditions

- A workflow manages submitted documents, KYC evidence, licenses, insurance, or fleet onboarding files.
- Operators need a queue, selected document detail, approve/reject decisions, and completion feedback.
- The approval behavior must be reusable across internal operations templates.

### Decision Tree

- Use Dense Operational List for generic dense queues without document decisions.
- Use Driver and Vehicle Administration for driver/unit administration without document approval detail.
- Use Backoffice Approval when submitted documents require approve/reject decisions and feedback.

### Failure Modes

- A template owns document approval state directly.
- Document preview is implemented as a local Card wrapper.
- Approval actions are local fake buttons outside Drawer Adapter or Dense Operational List.
- Decision status relies on color alone.

### Success Metrics

- Operators can select a submitted document, review detail, approve or reject it, and receive feedback.
- Queue, drawer, and feedback semantics stay owned by Flow patterns.
- Density, disabled, loading, deciding, and decision state cascade through Surface into child boundaries.

### Accessibility

- Expose approval operations as a labelled group with busy state.
- Delegate queue, drawer, and feedback semantics to Flow patterns.
- Represent pending, approved, rejected, and deciding states with text.
- Keep approve/reject decisions explicit and keyboard-operable.

### Tests

- Composes Surface, Badge, Dense Operational List, Drawer Adapter, and Status Feedback View.
- Covers default, pending-review, document-selected, detail-open, deciding, loading, error, and disabled states.
- Forwards document queue, detail, approve, reject, and feedback callbacks.
- Rejects local document cards, custom drawers, fake approvals, route guards, docs-only demos, and injected markup.

### Agent Instructions

- Use this pattern when document approvals require queue, detail review, decision actions, and feedback.
- Do not implement document preview as a local Card wrapper.
- Use Surface for structural grouping and Drawer Adapter for detail review.
- Ask before handling regulated, identity, payment, health, legal, safety, or irreversible document approvals.

### Reject If

- The document queue bypasses Dense Operational List.
- The detail review bypasses Drawer Adapter.
- Approve/reject actions are local fake buttons.
- A Card wraps the approval group or document detail structure.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| backofficeApprovalSurface | Surface | required | Structural approval operations group. |
| approvalSummary | Badge | conditional | Approval workflow summary. |
| approvalMetric | Badge | conditional | Pending, approved, rejected, or SLA metrics. |
| approvalQueueBoundary | Dense Operational List | required | Document queue, filters, table, pagination, bulk decisions, and selection. |
| approvalDetailBoundary | Drawer Adapter | conditional | Selected document detail and decision actions. |
| approvalFeedbackBoundary | Status Feedback View | conditional | Decision or recovery feedback. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| backofficeApprovalSurface | Surface | required | Structural approval operations group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Document queue | Required | Documents provide ID, account, document type, submitted time, status, and file. |
| Detail decision | Conditional | Drawer Adapter owns approve/reject actions for selected documents. |
| Decision feedback | Conditional | Status Feedback View owns success/error/recovery messaging. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Deciding | Surface marks busy while child patterns own loading and feedback rendering. |
| Detail review | Drawer Adapter owns open/closed transitions. |
| Feedback | Status Feedback View owns toast/error/empty semantics. |

## Accessibility

- Expose approval operations as a labelled group.
- Use Flow queue, drawer, and feedback semantics.
- Represent document status and decision state with text.
- Keep approve/reject decisions explicit.

## Implementation Checklist

- Composes Surface plus approval queue, detail, and feedback boundaries.
- Density and state cascade through delegated pattern boundaries.
- Forwards document selection, sort, pagination, bulk approval/rejection, detail, and feedback callbacks.
- No local document card, custom drawer, local toast, route guard, Card wrapper, or injected markup is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus approval queue, detail, and feedback boundaries.
- Density and state cascade through delegated pattern boundaries.
- Forwards document selection, sort, pagination, bulk approval/rejection, detail, and feedback callbacks.
- No local document card, custom drawer, local toast, route guard, Card wrapper, or injected markup is emitted.

Reject if:

- A local document card replaces Flow detail boundaries.
- Approval actions are local fake buttons.
- Document status is color-only.

## MIEL

Agents can decide:

- Use Backoffice Approval for document approval queues.
- Use Dense Operational List for the queue boundary.
- Use Drawer Adapter for selected document review.

Agents must ask:

- Before approving regulated, identity, payment, health, legal, safety, or irreversible documents.
- Before bypassing Flow queue, drawer, or feedback boundaries.
- Before hiding document access inside a template shell.

Agents must reject:

- A local document card replaces Flow detail boundaries.
- Approval actions are local fake buttons.
- Document status is color-only.

Handoff language:

> Confirm document schema, decision states, approve/reject rules, detail content, feedback semantics, and audit requirements.
