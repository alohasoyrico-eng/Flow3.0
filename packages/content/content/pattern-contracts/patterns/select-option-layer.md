# Select Option Layer

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/select-option-layer/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/select-option-layer.json`

## Purpose

Coordinate grouped options, unavailable choices, stale data, permission reasons, keyboard movement, and responsive popover-to-sheet behavior for Select-based choice flows.

## Use When

- A Select needs grouped, disabled, permissioned, or explanatory options.
- Changing a choice affects policy, billing, routing, or visibility.
- The option layer needs a responsive fallback beyond a native dropdown.

## Do Not Use Without Review

- A simple Select with a short static list is sufficient.
- Unavailable option reasons are unknown.
- The option layer duplicates a full form or process.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines layer width, option grouping, row density, and mobile sheet fallback. |
| Voice | Owns option labels, group labels, disabled reasons, and helper copy. |
| Energy | Controls selected, highlighted, disabled, and warning states. |
| Depth | Option layer separates from page content without losing field context. |
| Momentum | Keeps highlighted, selected, and disabled option movement predictable across filtering and reduced motion. |
| State | Closed, open, selected, disabled, loading, stale, and invalid states are explicit. |
| Accessibility | Requires labelled field, keyboard option movement, and disabled reason text. |

## Formal Purpose

Coordinate grouped options, empty states, unavailable options, stale data, permission reasons, keyboard movement, and responsive popover-to-sheet behavior for Select-based choice flows.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `closed`
- `open`
- `loading`
- `empty`
- `error`
- `permission-blocked`
- `stale`
- `disabled`

## Formal Dependencies

### Foundations

- `Energy`
- `Voice`
- `Frame`
- `Depth`
- `Momentum`
- `State`
- `Accessibility`

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

- `Color`
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

- `Select`
- `Badge`
- `Button`
- `Card`
- `Inline Validation`
- `Empty State`

### Tokens

- `comp.select.*`
- `comp.badge.*`
- `comp.button.*`
- `comp.card.*`
- `comp.inline-validation.*`
- `comp.empty-state.*`
- `sys.energy.*`
- `sys.voice.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.depth.*`
- `sys.momentum.*`
- `sys.accessibility.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `field` | `component` | `Select`, `Card`, `Badge` |
| `choices` | `component` | `Select` |
| `optionActions` | `component` | `Button` |
| `validation` | `component` | `Inline Validation` |
| `fallback` | `component` | `Empty State` |

## Formal Governance

### Entry Conditions

- Options are grouped, remote, stale, unavailable, searchable, permissioned, or too long for a simple base Select demo.
- Mobile requires a sheet or full-screen selector instead of a small popover.
- Unavailable options need visible reasons instead of disappearing.

### Decision Tree

- Use base Select for short, stable option lists.
- Use Select Option Layer when grouping, freshness, disabled reasons, or mobile sheet behavior becomes part of the decision.
- Escalate to Multi Select or Search when users must choose many values or query remote results.

### Failure Modes

- Options appear without stable labels or values.
- Unavailable options disappear without explanation.
- Loading, empty, stale, error, or permission states are visual only.
- Focus does not return to the trigger after selection or dismissal.

### Success Metrics

- Selection completes without support contact.
- Users understand unavailable options and recovery paths.
- Keyboard and screen reader users can identify active, selected, grouped, and disabled options.

### Agent Instructions

- Keep Select as the base component and move grouped option sequencing into this pattern.
- Document option source, stale/loading/error states, disabled reasons, focus return, and mobile sheet behavior.
- Ask before adding search, multi-select, product process, or measurement behavior beyond option selection.

### Reject If

- Grouped option behavior is hidden inside the base Select component.
- Unavailable options lack a visible reason.
- Mobile keeps a cramped desktop popover for long or grouped options.
- Raw colors, spacing, radius, shadows, or motion bypass Design System tokens.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| field | Select | yes | Selected value and trigger. |
| groups | Card[] | conditional | Groups related choices. |
| option | Option + Badge | yes | Label, value, metadata, selected, disabled, and reason. |
| validation | InlineValidation | conditional | Explains required or stale state. |
| fallback | BottomSheet \| Popover | conditional | Responsive layer when native select is insufficient. |

## Components Used

- Select
- Card
- Badge
- Inline Validation
- Button
- Empty State

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Grouped options | Current candidate | Choice set with helper copy and selected state. |
| Permissioned option | Required state | Disabled option explains why it is unavailable. |
| Mobile sheet | Candidate | Complex choices move to sheet when viewport is constrained. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Open layer | Layer opens from the field after user action. |
| Option update | Selection updates field and helper state without layout jump. |
| Fallback sheet | Mobile fallback uses system sheet motion and reduced-motion behavior. |

## Accessibility

- Select has a programmatic label.
- Disabled options include text reason.
- Selected value is announced.
- Keyboard users can move through options.
- Mobile fallback has a close path.

## Implementation Checklist

- Declare `field`: Selected value and trigger.
- Declare `option`: Label, value, metadata, selected, disabled, and reason.
- Changing value updates selected state.
- Disabled option reason is visible.
- Invalid state shows Inline Validation.
- Mobile fallback keeps field context.
- Escape or cancel closes without changing value.

## Tests And Rejection Rules

Must test:

- Changing value updates selected state.
- Disabled option reason is visible.
- Invalid state shows Inline Validation.
- Mobile fallback keeps field context.
- Escape or cancel closes without changing value.

Reject if:

- The option list is a disguised form.
- Disabled reasons are missing.
- Selection consequence is unclear.

## MIEL

Agents can decide:

- Use Select Option Layer when a choice needs disabled reasons or grouped context.
- Use Bottom Sheet fallback for complex mobile option sets.

Agents must ask:

- Permission rules, stale option policy, or consequences of changing value are unclear.

Agents must reject:

- The option list is a disguised form.
- Disabled reasons are missing.
- Selection consequence is unclear.

Handoff language:

> Confirm option source, grouping, disabled reasons, mobile fallback, and selection consequence.
