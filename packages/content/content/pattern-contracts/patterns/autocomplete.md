# Autocomplete

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/autocomplete/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/autocomplete.json`

## Purpose

Suggest valid entities while preserving typing control, loading feedback, keyboard selection, and no-result recovery.

## Use When

- Users must enter or choose a valid entity from remote or large data.
- Suggestions reduce errors without blocking free typing too early.
- Loading, no-result, and selected states need to be explicit.

## Do Not Use Without Review

- The option set is short and stable enough for Select.
- Suggestion source, validation timing, or selection persistence is unclear.
- Users can accidentally submit stale or unauthorized suggestions.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines suggestion layer width, row density, and mobile fallback. |
| Voice | Owns hint, suggestion labels, loading copy, and no-result recovery. |
| Energy | Controls focus, highlighted suggestion, and selected value. |
| Depth | Suggestion layer appears above nearby content without obscuring form context. |
| State | Idle, typing, loading, suggestions, selected, no results, and error states are explicit. |
| Accessibility | Requires labelled input, keyboard navigation, active option announcement, and Escape close. |

## Formal Purpose

Coordinate typed suggestions, loading, empty recovery, validation, and committed selection for one field without turning the field into global search.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `idle`
- `typing`
- `suggesting`
- `loading`
- `empty`
- `invalid`
- `selected`
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

- `Combobox`
- `Empty State`
- `Inline Validation`
- `List`
- `Skeleton`

### Tokens

- `comp.combobox.*`
- `comp.empty-state.*`
- `comp.inline-validation.*`
- `comp.list.*`
- `comp.skeleton.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `field` | `component` | `Combobox` |
| `suggestions` | `component` | `List`, `Skeleton`, `Empty State` |
| `validation` | `component` | `Inline Validation` |

## Formal Governance

### Entry Conditions

- A field can suggest known values while the user types.
- Selection commits a value into a field, form, or filter.
- The suggestion source can be loading, empty, invalid, or disabled.

### Decision Tree

- Use Combobox alone for a simple suggestion list.
- Use Autocomplete when suggestion state, validation, loading, and empty recovery are part of the field behavior.
- Use Search when query results are primary content rather than field completion.
- Use Command Palette when suggestions execute commands or navigation.

### Failure Modes

- Suggestions are rendered as custom option markup instead of List or Combobox-owned rows.
- Free text, selected value, and submitted value diverge without validation.
- Loading and empty states are visual only.
- Autocomplete owns remote ranking or cross-route command behavior.

### Success Metrics

- Users understand whether text is tentative or committed.
- Keyboard users can move through suggestions and commit intentionally.
- Empty, loading, and invalid states are communicated consistently.

### Accessibility

- Preserve combobox roles and active descendant behavior.
- Announce suggestion count, loading, empty, and invalid states.
- Keep committed selection distinct from typed text.

### Tests

- Uses Combobox as the primary field implementation.
- Handles loading, empty, invalid, selected, and disabled states.
- Does not import Search or Command Palette behavior.

### Agent Instructions

- Compose from Combobox, List, Empty State, Inline Validation, and Skeleton.
- Keep global search, command execution, and analytics ranking outside Autocomplete.
- Ask before permitting free text that is not in the suggestion source.

### Reject If

- Suggestion list is hand-rolled outside Combobox/List.
- The pattern acts as page search or command execution.
- Selected value semantics are unclear.
- Raw colors, spacing, radius, elevation, or motion bypass tokens.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| control | Combobox | yes | Typed query, filtered suggestions, selected value, and combobox/listbox semantics. |
| loading | Skeleton \| ProgressIndicator | conditional | Shown while suggestions load. |
| suggestions | Combobox listbox | yes | Selectable results with metadata inside the Combobox option layer. |
| emptyState | EmptyState | yes | Recovery for no matching suggestions. |
| validation | InlineValidation | conditional | Shown when selected value is required or stale. |

## Components Used

- Combobox
- List
- Skeleton
- Empty State
- Inline Validation

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Entity suggestions | Current candidate | Typed query filters suggested entities. |
| Loading | Required state | Skeleton or progress appears while remote results load. |
| No results | Required state | Empty state explains recovery. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Suggestion reveal | Layer appears after typing and closes with selection or Escape. |
| Loading swap | Skeleton resolves into suggestions without moving focus. |
| Selection | Selected suggestion updates input and validation state. |

## Accessibility

- Combobox has visible label, aria-autocomplete=list, aria-expanded, aria-controls, and active option semantics.
- Keyboard users can reach and select suggestions.
- Loading and no-result states are announced.
- Escape closes suggestions without clearing input.
- Selected value remains distinguishable from typed text.

## Implementation Checklist

- Declare `control`: Typed query, filtered suggestions, selected value, and combobox/listbox semantics.
- Declare `suggestions`: Selectable results with metadata inside the Combobox option layer.
- Declare `emptyState`: Recovery for no matching suggestions.
- Typing in Combobox opens and filters suggestions.
- Loading state appears before suggestions when configured.
- Selecting a Combobox option writes the selected value.
- No-result query shows Empty State.
- Escape closes suggestions and preserves typed input.

## Tests And Rejection Rules

Must test:

- Typing in Combobox opens and filters suggestions.
- Loading state appears before suggestions when configured.
- Selecting a Combobox option writes the selected value.
- No-result query shows Empty State.
- Escape closes suggestions and preserves typed input.

Reject if:

- A normal Select is enough.
- Suggestions are not keyboard accessible.
- Loading or no-result states are missing.

## MIEL

Agents can decide:

- Use Autocomplete for large or remote entity sets.
- Use Skeleton for async suggestion loading.
- Show Empty State when no suggestions match.

Agents must ask:

- Validation source, stale suggestion policy, permissions, or free-text fallback is unclear.

Agents must reject:

- A normal Select is enough.
- Suggestions are not keyboard accessible.
- Loading or no-result states are missing.

Handoff language:

> Confirm data source, selection policy, async behavior, free-text rules, and validation.
