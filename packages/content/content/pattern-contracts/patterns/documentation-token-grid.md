# Documentation Token Grid

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/documentation-token-grid/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/documentation-token-grid.json`

## Purpose

Render token references through governed code blocks.

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

Render token references through governed code blocks.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Web documentation |
| Audiences | `Developers`, `Designers`, `Agents` |

## Formal States

- `default`
- `tokens`
- `values`
- `compact`
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
- `Breakpoints`
- `Color`
- `Disabled`
- `Focus`
- `Message`
- `Radius`
- `Typography`

### Components

- `Code Block`

### Tokens

- `comp.code-block.*`
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
| `items` | `component` | `Code Block` |

## Formal Governance

### Entry Conditions

- A documentation page needs to list token names, values, or generated references.
- The content is code-like and should be rendered through Code Block.
- The page must not create local token table wrappers.

### Decision Tree

- Use Documentation Token Grid for token/value reference groups.
- Use Code Block directly for a single snippet.
- Use Table when values need semantic row and column comparison.

### Failure Modes

- Token values render through local pre/code wrappers.
- Copy buttons or snippets bypass Flow Code Block.
- Compact/mobile token states are not declared.

### Success Metrics

- Token references are rendered through Code Block.
- Token grids support compact and mobile states.
- No migrated docs page owns token-grid wrapper CSS.

### Accessibility

- Token names and values remain copyable text.
- Code Block labels identify snippet purpose.
- Compact layout preserves readable token names.
- Symbolic token indicators cannot replace visible labels, code text, or fallback meaning.

### Tests

- Covers default, tokens, values, compact, empty, and mobile states.
- Rejects local code or token grid wrappers.
- Checks Code Block ownership for token references.

### Agent Instructions

- Do not create local token grids in FlowDocs.
- Use Code Block for code-like token content.
- Escalate only when token content needs table semantics.

### Reject If

- Token references are rendered through local pre/code HTML.
- Copy behavior bypasses Flow components.
- A docs page duplicates token grid layout.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| items | Code Block | true | Token reference rows. |

## Components Used

- Code Block

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
