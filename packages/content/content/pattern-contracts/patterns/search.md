# Search

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/search/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/search.json`

## Purpose

Let users find drivers, vehicles, cards, stations, movements, and settings with scoped results, empty recovery, and clear submission behavior.

## Use When

- A task needs direct lookup across a known entity set.
- Results need scope, recent context, or no-result recovery.
- Search should stay visible as part of a page, toolbar, or shell surface.

## Do Not Use Without Review

- The field is only decorative and does not return useful results.
- The result source, scope, or privacy policy is unclear.
- A small fixed choice set would be better as Select.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines field width, result density, empty state placement, and responsive stacking. |
| Voice | Owns label, placeholder, result labels, recovery copy, and scope language. |
| Energy | Controls focus, selected result, action priority, and status tone. |
| Depth | Separates result panels and suggestions from page content without creating custom overlay depth. |
| State | Idle, typing, results, no results, loading, disabled, and error states are explicit. |
| Momentum | Result updates avoid jumpy layout and respect reduced motion. |
| Accessibility | Requires programmatic label, keyboard access, result count feedback, and no color-only state. |

## Formal Purpose

Coordinate entity lookup across a known result source with scope, result count feedback, recovery, and intentional selection behavior.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Docs Collection Template`, `Docs Shell Template` |

## Formal States

- `idle`
- `typing`
- `results`
- `empty`
- `invalid`
- `loading`
- `disabled`
- `selected`

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

- `Input`
- `Select`
- `List`
- `Empty State`
- `Inline Validation`
- `Button`

### Tokens

- `comp.input.*`
- `comp.select.*`
- `comp.list.*`
- `comp.empty-state.*`
- `comp.inline-validation.*`
- `comp.button.*`
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
| `input` | `component` | `Input` |
| `scope` | `component` | `Select` |
| `results` | `component` | `List`, `Button` |
| `emptyState` | `component` | `Empty State` |
| `feedback` | `component` | `Inline Validation` |

## Formal Governance

### Entry Conditions

- Users need direct lookup across drivers, vehicles, cards, stations, movements, settings, or another known entity set.
- Results need scope, count feedback, empty recovery, or explicit selection behavior.
- Search remains visible in a page, toolbar, shell, or work surface.

### Decision Tree

- Use Input alone when the value is submitted with a larger form and does not return visible results.
- Use Search when query, scope, result count, empty recovery, or result selection is part of the interaction.
- Use Autocomplete when suggestions appear while typing and selection completes the field.
- Use Command Palette when the query executes commands or cross-route actions.

### Failure Modes

- The field looks searchable but does not filter, route, or return results.
- Scope changes erase the query without confirmation.
- No-result recovery is missing or only communicated by color.
- Result count is not announced or visible.
- Search owns predictive suggestions that belong to Autocomplete.

### Success Metrics

- Users can find known entities without changing context.
- Users understand scope, result count, and no-result recovery.
- Keyboard and screen reader users can move from query to results and select intentionally.

### Agent Instructions

- Compose Search from package Input, optional Select scope, List or Button results, Empty State, and Inline Validation.
- Keep Autocomplete suggestions, command execution, analytics ownership, and remote ranking out of Search unless a higher pattern owns them.
- Ask before search crosses tenants, permissions, regulated data, financial data, or identity-sensitive records.

### Reject If

- The search field is decorative.
- Results are hardcoded visual cards instead of package components.
- No-result, invalid, loading, or selected states are missing.
- Raw colors, spacing, radius, shadows, or motion bypass Design System tokens.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| input | Input | yes | Typed search term with label and placeholder. |
| scope | Select \| SegmentedControl | conditional | Narrows result domain when more than one source exists. |
| results | List \| Card[] | yes | Result set with label, metadata, and action. |
| emptyState | EmptyState | yes | Recovery when no result matches. |
| feedback | InlineValidation \| Toast | conditional | Reports invalid query or selected result. |

## Components Used

- Input
- Select
- List
- Empty State
- Inline Validation
- Button

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Scoped search | Current candidate | Search with entity scope and filtered results. |
| No results | Required state | Empty state gives recovery and broader scope option. |
| Invalid query | Candidate | Inline validation explains minimum query or unsupported input. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Result update | Filtering updates rows without changing focus. |
| Empty transition | Empty state replaces results without decorative motion. |
| Selection feedback | Selected result reports state without interrupting navigation. |

## Accessibility

- Search input has a visible or programmatic label.
- Result count changes are available to assistive tech.
- Keyboard users can move from input to results.
- Empty and invalid states are text-backed.
- Scope changes do not clear typed input without confirmation.

## Implementation Checklist

- Declare `input`: Typed search term with label and placeholder.
- Declare `results`: Result set with label, metadata, and action.
- Declare `emptyState`: Recovery when no result matches.
- Typing filters results.
- No-result query shows Empty State.
- Scope changes preserve query and result count.
- Invalid short query shows Inline Validation.
- Selecting a result gives feedback or routes intentionally.

## Tests And Rejection Rules

Must test:

- Typing filters results.
- No-result query shows Empty State.
- Scope changes preserve query and result count.
- Invalid short query shows Inline Validation.
- Selecting a result gives feedback or routes intentionally.

Reject if:

- The field does not search anything.
- No-result recovery is missing.
- Result scope is ambiguous.

## MIEL

Agents can decide:

- Use Search when users need entity lookup.
- Choose scope labels from existing product vocabulary.
- Show Empty State when no result matches.

Agents must ask:

- Result source, privacy, analytics, permissions, or cross-tenant visibility is unclear.
- Search affects regulated, financial, or identity data.

Agents must reject:

- The field does not search anything.
- No-result recovery is missing.
- Result scope is ambiguous.

Handoff language:

> Confirm searchable entities, result source, privacy boundaries, scope labels, empty state, and selection behavior.
