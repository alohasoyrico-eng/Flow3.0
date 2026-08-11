# Pricing Operations

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/pricing-operations/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/pricing-operations.json`

## Purpose

Coordinate pricing rule queues, editable rule review, approval submission, permission boundaries, and operational feedback without becoming an internal-tools template.

## Use When

- A workflow manages pricing, commission, surge, or rate rules.
- Rules require editable review and explicit submission to approval.
- Permission boundaries and feedback must remain reusable outside a single internal-tools template.

## Do Not Use Without Review

- Pricing changes affect regulated, financial, legal, safety, or irreversible decisions.
- The workflow only needs a generic editable table.
- Access control is enforced only by a route shell.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | A labelled Surface and delegated table/drawer/feedback boundaries keep pricing changes inspectable and operable. |
| Depth | Surface owns grouping while Virtual Data Table owns row/editing depth. |
| Energy | Pending, selected, editing, submitting, error, and disabled states cascade into badges and pattern boundaries. |
| Frame | Rule tables, editor width, density, and feedback remain token-driven. |
| Growth | Pricing operations can move into future internal-tools templates without cloning table or drawer behavior. |
| Iconography | Icons remain owned by child components and patterns. |
| Momentum | Submitting and loading behavior remain delegated to Flow state contracts. |
| State | Pricing state maps explicitly to rule queue, permission matrix, editor, and feedback boundaries. |
| Symbol | Pricing symbols may support scan value, but text remains required for rule status, scope, value, and approval state. |
| Tone | Pending, approval, success, warning, danger, and disabled tones remain contract-bound. |
| Voice | Approval labels, rule copy, permission copy, and recovery messages stay explicit. |

## Formal Purpose

Coordinate pricing rule queues, editable rule review, approval submission, permission boundaries, and operational feedback without becoming an internal-tools template.

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
- `pending-approval`
- `rule-selected`
- `editing`
- `submitting`
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

- `Virtual Data Table`
- `Roles and Permissions`
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
| `pricingOperationsSurface` | `primitive` | `Surface` |
| `pricingSummary` | `component` | `Badge` |
| `pricingMetric` | `component` | `Badge` |
| `pricingPermissionBoundary` | `pattern` | `Roles and Permissions` |
| `pricingRulesBoundary` | `pattern` | `Virtual Data Table` |
| `pricingFeedbackBoundary` | `pattern` | `Status Feedback View` |

## Formal Governance

### Entry Conditions

- A workflow manages pricing, commission, surge, or rate rules.
- Rules require editable review and explicit submission to approval.
- Permission boundaries and feedback must remain reusable outside a single internal-tools template.

### Decision Tree

- Use Virtual Data Table for generic row editing without pricing approval semantics.
- Use Roles and Permissions when the only task is access matrix editing.
- Use Pricing Operations when pricing rule queue, approval submission, permission policy, and feedback operate together.

### Failure Modes

- A template owns pricing rule editing directly.
- Rule submission uses custom table rows, local drawers, fake controls, or local toasts.
- Permission state is only implied by route or shell role.
- Pricing status relies on color alone.

### Success Metrics

- Operators can inspect pricing rule status, select/edit a rule, and submit it for approval.
- Permission context is explicit and reusable.
- Density, state, disabled, loading, and feedback cascade through Surface into Flow pattern boundaries.

### Accessibility

- Expose pricing operations as a labelled group with busy state.
- Delegate tabular editing, drawer controls, and feedback semantics to Flow patterns.
- Represent pricing status and permission state with text, not only tone.
- Do not hide approval submission behind route-only permissions.

### Tests

- Composes Surface, Badge, Virtual Data Table, Roles and Permissions, and Status Feedback View.
- Covers default, pending-approval, rule-selected, editing, submitting, loading, error, and disabled states.
- Forwards rule selection, sort, pagination, bulk approval, editor, permission, and feedback callbacks.
- Rejects local pricing tables, custom drawers, card wrappers, route guards, docs-only demos, and injected markup.

### Agent Instructions

- Use this pattern for pricing rule operations only when pricing rule semantics and approval submission are present.
- Do not implement local pricing tables, local drawers, local toasts, or route-shell guards inside templates.
- Use Surface for structural grouping; do not wrap the pricing queue in Card.
- Ask before applying pricing changes to regulated, financial, legal, safety, or irreversible decisions.

### Reject If

- The rule queue bypasses Virtual Data Table.
- The editor bypasses Drawer Adapter through the table boundary.
- Permission state exists only in a template shell.
- A Card wraps the pricing operations group.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| pricingOperationsSurface | Surface | required | Structural pricing operations group. |
| pricingSummary | Badge | conditional | Pricing workflow summary. |
| pricingMetric | Badge | conditional | Pending approval, draft, or active-rule metrics. |
| pricingPermissionBoundary | Roles and Permissions | conditional | Access and approval policy boundary. |
| pricingRulesBoundary | Virtual Data Table | required | Rule queue, filters, editable drawer, approval action, table, and feedback boundary. |
| pricingFeedbackBoundary | Status Feedback View | conditional | Submission or recovery feedback. |

## Components Used

- Badge

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| pricingOperationsSurface | Surface | required | Structural pricing operations group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Rule queue | Required | Pricing rules provide ID, name, scope, type, value, status, and owner. |
| Pending approval | State | Pending rules and submit actions move the workflow into approval context. |
| Permission policy | Conditional | Roles and Permissions represents pricing/admin access without relying only on a shell guard. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Submitting | Surface marks busy while child patterns own loading and feedback rendering. |
| Editing | Virtual Data Table owns drawer open/closed transitions. |
| Feedback | Status Feedback View owns toast/error/empty semantics. |

## Accessibility

- Expose pricing operations as a labelled group.
- Use Flow table, drawer, permission, and feedback semantics.
- Represent pricing status and approval state with text.
- Do not rely on color-only status.

## Implementation Checklist

- Composes Surface plus pricing rule, permission, and feedback boundaries.
- Density and state cascade through delegated pattern boundaries.
- Forwards rule selection, sort, pagination, approval, editor, permission, and feedback callbacks.
- No local table, local drawer, local toast, route guard, Card wrapper, or injected markup is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus pricing rule, permission, and feedback boundaries.
- Density and state cascade through delegated pattern boundaries.
- Forwards rule selection, sort, pagination, approval, editor, permission, and feedback callbacks.
- No local table, local drawer, local toast, route guard, Card wrapper, or injected markup is emitted.

Reject if:

- A local pricing table replaces Virtual Data Table.
- Approval actions are local fake buttons.
- Permission state is represented only by route/shell code.

## MIEL

Agents can decide:

- Use Pricing Operations for rule queue plus approval submission workflows.
- Use Virtual Data Table for the editable queue boundary.
- Use Roles and Permissions when access policy must be visible.

Agents must ask:

- Before applying regulated, financial, legal, safety, or irreversible pricing changes.
- Before bypassing Flow table, drawer, or feedback boundaries.
- Before hiding permission policy inside a template shell.

Agents must reject:

- A local pricing table replaces Virtual Data Table.
- Approval actions are local fake buttons.
- Permission state is represented only by route/shell code.

Handoff language:

> Confirm rule schema, approval states, permission model, editable fields, feedback semantics, and audit requirements.
