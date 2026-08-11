# Avatar Group

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/avatar-group/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/avatar-group.json`

## Purpose

Represent people, teams, ownership, overflow, permission-aware disclosure, and presence without packaging grouped identity as a component yet.

## Use When

- A surface needs to show multiple people or teams.
- Overflow count or member disclosure matters.
- Identity affects permissions, ownership, collaboration, or escalation.

## Do Not Use Without Review

- One person is enough; use Avatar.
- Overflow disclosure, privacy, or permission policy is unclear.
- Members are decorative and do not communicate ownership or collaboration.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines stack, overlap, overflow, and disclosure placement. |
| Voice | Owns accessible names, count labels, roles, and privacy copy. |
| Energy | Controls active, online, blocked, selected, and overflow states. |
| State | Loaded, overflow, hidden, permissioned, loading, empty, and selected states are explicit. |
| Depth | Popover/Tooltip discloses members without replacing identity. |
| Accessibility | Each member and overflow count has text-backed meaning. |

## Formal Purpose

Coordinate a compact set of people, teams, or assignees with overflow, status, identity fallback, validation, and reveal behavior.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `default`
- `overflow`
- `interactive`
- `loading`
- `permission-blocked`
- `invalid`
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
- `Typography`

### Components

- `Avatar`
- `Badge`
- `Button`
- `Inline Validation`
- `List`
- `Popover`
- `Tooltip`

### Tokens

- `comp.avatar.*`
- `comp.badge.*`
- `comp.button.*`
- `comp.inline-validation.*`
- `comp.list.*`
- `comp.popover.*`
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
| `avatars` | `component` | `Avatar`, `Badge` |
| `overflow` | `component` | `Button`, `Popover`, `List` |
| `identityHint` | `component` | `Tooltip` |
| `validation` | `component` | `Inline Validation` |

## Formal Governance

### Entry Conditions

- A surface needs to show multiple related identities in limited space.
- Overflow users need a governed reveal behavior.
- Identity fallback, status, or permission messaging must remain consistent.

### Decision Tree

- Use Avatar for one person or organization.
- Use Avatar Group when multiple identities share ownership, attendance, assignment, or visibility.
- Use List when the full identity set is the primary content.

### Failure Modes

- Overflow count is decorative and cannot reveal who is hidden.
- Initials, status, and unavailable identities use custom visuals.
- Tooltips carry essential identity data without a keyboard path.
- Validation or permission errors live outside Inline Validation.

### Success Metrics

- Users can identify visible and overflow participants.
- Focus and screen reader users can access the same identity information.
- Status and validation remain tokenized and component-owned.

### Accessibility

- Provide a collective label that describes the identity set.
- Do not make tooltip-only identity data required.
- Ensure overflow reveal is keyboard reachable and dismissible.

### Tests

- Renders Avatar and Badge without cloned visuals.
- Uses Popover and List for overflow reveal.
- Preserves keyboard access to overflow identities.

### Agent Instructions

- Compose from Avatar, Badge, Button, Popover, List, Tooltip, and Inline Validation.
- Keep assignment workflows, role management, and permission editing in higher patterns or templates.
- Ask before exposing identity data hidden by permissions.

### Reject If

- Overflow users cannot be inspected.
- A custom avatar stack style bypasses Avatar.
- Tooltip is the only access path to required identity data.
- Raw color, radius, spacing, or shadow defines identity state.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| members | Avatar[] | yes | Visible identities. |
| overflow | Badge \| Button | conditional | Count and disclosure trigger. |
| disclosure | Popover \| Tooltip \| List | conditional | Member details and permissions. |
| feedback | InlineValidation | conditional | Privacy or unavailable member state. |

## Components Used

- Avatar
- Badge
- Button
- Popover
- Tooltip
- List
- Inline Validation

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Team stack | Required | Visible members plus overflow count. |
| Permissioned disclosure | Required state | Hidden members explain privacy. |
| Owner group | Candidate | Shows accountable people for a process. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Disclosure | Popover/Tooltip uses Design System overlay motion. |
| Overflow update | Count updates without shifting the row. |
| Reduced motion | Removes decorative member movement. |

## Accessibility

- Members have accessible names.
- Overflow count is text-backed.
- Disclosure is keyboard reachable.
- Privacy state is explained.

## Implementation Checklist

- Declare `members`: Visible identities.
- Overflow count is visible.
- Disclosure opens after user action.
- Member labels are available.
- Privacy state is not color-only.

## Tests And Rejection Rules

Must test:

- Overflow count is visible.
- Disclosure opens after user action.
- Member labels are available.
- Privacy state is not color-only.

Reject if:

- Members are decorative only.
- Overflow has no accessible count.
- Disclosure exposes private data without policy.

## MIEL

Agents can decide:

- Use Avatar Group as a pattern when multiple identities need ownership or disclosure.
- Compose Avatar, Badge, Popover, Tooltip, and List.
- Keep grouped identity out of package components until bounded behavior is approved.

Agents must ask:

- Privacy, permission, member source, or disclosure policy is unclear.
- Identity affects access, employment, support, or regulated processs.

Agents must reject:

- Members are decorative only.
- Overflow has no accessible count.
- Disclosure exposes private data without policy.

Handoff language:

> Confirm member source, privacy, overflow count, disclosure behavior, permission rules, and accessible labels.
