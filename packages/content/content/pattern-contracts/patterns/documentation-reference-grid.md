# Documentation Reference Grid

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/documentation-reference-grid/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/documentation-reference-grid.json`

## Purpose

Render reference cards for documentation summaries, rules, and matrices.

## Use When

- Documentation content needs this reusable rendering boundary.
- The layout appears across more than one documentation page.

## Do Not Use Without Review

- The content can be rendered by an existing component or pattern directly.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Frame remains governed by Flow. |
| Voice | Voice remains governed by Flow. |
| Accessibility | Accessibility remains governed by Flow. |
| Depth | Governs layering, elevation, and surface hierarchy without local wrappers. |
| Energy | Governs accent, status, and interactive emphasis through Flow tokens. |
| Growth | Governs maturity, coverage, and documentation status signals. |
| Iconography | Governs functional glyph usage without parallel icon styling. |
| Momentum | Governs motion timing and responsive transition behavior. |
| State | Governs active, loading, empty, disabled, and responsive states. |
| Symbol | Governs symbolic visuals while labels and fallback text remain visible. |
| Tone | Governs semantic color/copy tone without local palette decisions. |

## Formal Purpose

Render reference cards for documentation summaries, rules, and matrices.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Web documentation |
| Audiences | `Developers`, `Designers`, `Agents` |

## Formal States

- `default`
- `summary`
- `rule`
- `matrix`
- `empty`
- `mobile`

## Formal Dependencies

### Foundations

- `Frame`
- `Voice`
- `Accessibility`
- `Depth`
- `Energy`
- `Growth`
- `Iconography`
- `Momentum`
- `State`
- `Symbol`
- `Tone`

### Primitives

- `Surface`
- `Density`
- `Spacing`
- `Color`
- `Disabled`
- `Duration`
- `Elevation`
- `Focus`
- `Iconography`
- `Loading`
- `Measurement`
- `Motion Curves`
- `Radius`
- `Typography`

### Components

- `Card`

### Tokens

- `comp.card.*`
- `sys.frame.*`
- `sys.voice.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `items` | `component` | `Card` |

## Formal Governance

### Entry Conditions

- A documentation page needs a repeated reference-card group.
- The content is summary, rule, matrix, or evidence metadata.
- The grid should be governed by Flow instead of local documentation wrappers.

### Decision Tree

- Use Documentation Reference Grid for repeated card-style documentation references.
- Use Table when the content is tabular and comparison-first.
- Use Documentation Section when the content needs a section boundary but not repeated cards.

### Failure Modes

- Reference cards are implemented as local docs divs.
- The grid creates a docs-only Card variant.
- Empty states or mobile layouts are not declared.

### Success Metrics

- Reference groups use Card consistently.
- Grid state and density remain governed across docs templates.
- Migrations reduce local reference wrappers.

### Accessibility

- Repeated items preserve heading order from the host section.
- Cards expose text labels for status and metadata.
- Empty reference groups communicate state in text.
- Icons, symbols, and badges support the card copy without replacing text labels or fallback meaning.

### Tests

- Covers default, summary, rule, matrix, empty, and mobile states.
- Rejects local reference-card wrappers.
- Checks repeated items render through Flow Card.

### Agent Instructions

- Do not invent a new docs card variant for reference groups.
- Use Card only for repeated items, not page sections.
- Move reusable behavior into this pattern before migrating more pages.

### Reject If

- The reference grid is implemented with local docs HTML.
- The content should be a Table instead of Cards.
- A docs page duplicates this grid structure.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| items | Card | true | Reference items. |

## Components Used

- Card

## Variants

## Motion Contract

## Accessibility

- Expose a readable label.
- Do not rely on color alone.
- Preserve keyboard reachability for interactive children.

## Implementation Checklist

- Covers default and empty states.
- Rejects local documentation wrappers that duplicate this pattern.

## Tests And Rejection Rules

Must test:

- Covers default and empty states.
- Rejects local documentation wrappers that duplicate this pattern.

Reject if:

- The page reimplements this pattern locally.

## MIEL

Agents can decide:

- Use this pattern for repeated documentation rendering.

Agents must ask:

- A new visual variant is requested.

Agents must reject:

- The page reimplements this pattern locally.
