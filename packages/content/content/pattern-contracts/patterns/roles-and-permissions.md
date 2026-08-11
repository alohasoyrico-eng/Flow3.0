# Roles And Permissions

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/roles-and-permissions/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/roles-and-permissions.json`

## Purpose

Let admins grant access safely with dependencies, auditability, templates, review paths, and reversible feedback.

## Use When

- Users assign permissions, roles, or access templates.
- Permission changes need review, audit, or dependency checks.
- A matrix or table must explain who gets access and why.

## Do Not Use Without Review

- Permission source, owner, or dependency model is unclear.
- Changes can affect finance, compliance, identity, or security without approval.
- The surface cannot show audit evidence or recovery.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines matrix density, role grouping, review panel placement, and audit spacing. |
| Voice | Owns role labels, permission copy, dependency warnings, and audit language. |
| Energy | Controls enabled, inherited, warning, and pending states without color-only meaning. |
| State | Enabled, disabled, inherited, pending, blocked, dirty, saved, and audit states are explicit. |
| Depth | Confirmation and policy hints layer above the matrix with Design System overlays. |
| Accessibility | Permission state, role scope, dependency warnings, and audit trail are text-backed. |

## Formal Purpose

Coordinate role and permission review/editing with tables, toggles, confirmation, audit context, validation, and template-owned authorization policy.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Desktop |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Fleet Manager Desktop`, `Configuration Console` |

## Formal States

- `read-only`
- `editing`
- `dirty`
- `confirming`
- `saving`
- `saved`
- `permission-blocked`
- `error`

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
- `Checkbox`
- `Dialog`
- `Inline Validation`
- `Switch`
- `Table`
- `Toast`
- `Tooltip`

### Tokens

- `comp.audit-event.*`
- `comp.badge.*`
- `comp.button.*`
- `comp.checkbox.*`
- `comp.dialog.*`
- `comp.inline-validation.*`
- `comp.switch.*`
- `comp.table.*`
- `comp.toast.*`
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
| `matrix` | `component` | `Table`, `Switch`, `Checkbox`, `Tooltip`, `Badge` |
| `actions` | `component` | `Button`, `Dialog`, `Inline Validation`, `Toast` |
| `audit` | `component` | `Audit Event` |

## Formal Governance

### Entry Conditions

- A product needs reusable role/permission composition.
- Permissions require review, edit, confirmation, audit context, validation, and disabled reasons.
- Templates own authorization model, role taxonomy, and policy.

### Decision Tree

- Use Table/Switch/Checkbox for simple permission display.
- Use this pattern when role editing, audit, confirmation, and validation are coordinated.
- Use templates for tenant-specific authorization policy.

### Failure Modes

- Authorization rules are embedded in the pattern.
- Switch/Checkbox visuals are duplicated.
- Disabled permissions lack reasons.
- Audit or confirmation bypasses Flow components.

### Success Metrics

- Users can review and change permissions with clear consequence.
- Permission state and disabled reasons are accessible.
- Templates can vary policy without changing visual implementation.

### Accessibility

- Expose permission labels and disabled reasons.
- Confirm risky permission changes.
- Provide audit context in text.

### Tests

- Composes all listed role/permission components.
- Covers read-only, editing, dirty, confirming, saving, saved, blocked, and error states.
- Keeps authorization policy in templates/app code.

### Agent Instructions

- Do not encode tenant authorization policy.
- Ask before changing access, admin roles, billing, compliance, or identity permissions.
- Keep templates responsible for role taxonomy.

### Reject If

- Authorization policy is embedded.
- Controls bypass Switch/Checkbox.
- Disabled reasons are missing.
- Audit is custom markup.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| matrix | Table | yes | Role/permission grid using package Table for structure. |
| controls | Checkbox \| Switch | yes | Atomic permission toggles. |
| policy | Badge \| Tooltip \| InlineValidation | conditional | Dependency, inherited, or blocked state. |
| audit | AuditEvent | yes | Evidence of changes and owner. |
| actions | Button[] | yes | Review, save, cancel, or request approval. |

## Components Used

- Table
- Checkbox
- Switch
- Badge
- Tooltip
- Inline Validation
- Audit Event
- Button
- Toast
- Dialog

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Role matrix | Required | Permissions are grouped by role and capability. |
| Pending review | Required state | Sensitive changes require confirmation or approval. |
| Audit trail | Required | Recent access changes stay visible. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Toggle state | Permission state updates immediately but save/review remains explicit. |
| Policy feedback | Warnings appear without layout jump. |
| Save feedback | Toast or audit update confirms the result. |

## Accessibility

- Permission labels identify role and capability.
- Inherited or blocked states are text-backed.
- Audit events are readable in order.
- Save/review actions are keyboard reachable.

## Implementation Checklist

- Declare `matrix`: Role/permission grid using package Table for structure.
- Declare `controls`: Atomic permission toggles.
- Declare `audit`: Evidence of changes and owner.
- Declare `actions`: Review, save, cancel, or request approval.
- Permission toggle marks the matrix dirty.
- Blocked dependency shows validation.
- Save reveals feedback and audit evidence.
- Keyboard users can reach controls and actions.

## Tests And Rejection Rules

Must test:

- Permission toggle marks the matrix dirty.
- Blocked dependency shows validation.
- Save reveals feedback and audit evidence.
- Keyboard users can reach controls and actions.

Reject if:

- Permission changes have no audit path.
- Blocked or inherited states are color-only.
- The pattern hides role/capability scope.

## MIEL

Agents can decide:

- Use Roles and Permissions for access policy processs.
- Use Table plus atomic controls; do not package Permission Matrix as a component.
- Require audit evidence for permission changes.

Agents must ask:

- Role model, dependency policy, approval system, audit requirements, or tenant scope is unclear.
- Changes affect finance, security, compliance, legal, or identity access.

Agents must reject:

- Permission changes have no audit path.
- Blocked or inherited states are color-only.
- The pattern hides role/capability scope.

Handoff language:

> Confirm roles, capabilities, dependencies, approval policy, audit requirements, tenant scope, and recovery behavior.
