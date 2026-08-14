# Documentation Primitive Demo

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/documentation-primitive-demo/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/documentation-primitive-demo.json`

## Purpose

Render primitive-specific documentation demos through Flow components while preserving local demo data as content.

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
| State | State remains governed by Flow. |
| Depth | Governs layering, elevation, and surface hierarchy without local wrappers. |
| Energy | Governs accent, status, and interactive emphasis through Flow tokens. |
| Growth | Governs maturity, coverage, and documentation status signals. |
| Iconography | Governs functional glyph usage without parallel icon styling. |
| Momentum | Governs motion timing and responsive transition behavior. |
| Symbol | Governs symbolic visuals while labels and fallback text remain visible. |
| Tone | Governs semantic color/copy tone without local palette decisions. |

## Formal Purpose

Render primitive-specific documentation demos through Flow components while preserving local demo data as content.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Web documentation |
| Audiences | `Developers`, `Designers`, `Agents` |

## Formal States

- `default`
- `interactive`
- `empty`
- `mobile`

## Formal Dependencies

### Foundations

- `Frame`
- `Voice`
- `Accessibility`
- `State`
- `Depth`
- `Energy`
- `Growth`
- `Iconography`
- `Momentum`
- `Symbol`
- `Tone`

### Primitives

- `Surface`
- `Density`
- `Spacing`
- `Breakpoints`
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
- `Typography`

### Components

- `Button`
- `Card`
- `Code Block`

### Tokens

- `comp.button.*`
- `comp.card.*`
- `comp.code-block.*`
- `sys.frame.*`
- `sys.voice.*`
- `sys.accessibility.*`
- `sys.state.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.symbol.*`
- `sys.tone.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `demo` | `component` | `Card`, `Button`, `Code Block` |

## Formal Governance

### Entry Conditions

- A documentation primitive page needs an interactive or static demo.
- The demo can be expressed with existing Flow components and primitive data.
- The page template must not own bespoke primitive demo wrappers.

### Decision Tree

- Use Documentation Primitive Demo for primitive examples that need Flow-owned controls, cards, or code.
- Use Documentation Token Grid when the content is a token reference table.
- Use Documentation Reference Grid when the content is a reference-card group.

### Failure Modes

- Primitive demos render custom controls instead of Button, Card, or Code Block.
- Demo styling depends on local class wrappers instead of data-flow/data-doc markers.
- A docs page creates a one-off primitive demo component.

### Success Metrics

- Primitive demos render through Flow components.
- Demo type, density, and state are visible in runtime markers.
- No migrated primitive detail page owns local demo structure.

### Accessibility

- Interactive choices use Button and remain keyboard reachable.
- Demo code uses Code Block semantics.
- Decorative primitive samples do not replace text labels.
- Symbol or illustration samples require visible labels or fallback text before they can carry meaning.

### Tests

- Covers default, interactive, empty, and mobile states.
- Rejects local visual classes for primitive demo wrappers.
- Checks that demo controls use Flow Button.

### Agent Instructions

- Do not add docs-only demo controls.
- Keep primitive-specific visuals as data-driven content.
- Escalate only when an existing Flow component cannot represent the demo.

### Reject If

- A primitive page creates local HTML wrappers for demo controls.
- A new primitive is proposed only to style a documentation demo.
- Code samples bypass Code Block.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| demo | Card \| Button \| Code Block | true | Primitive demo UI. |

## Components Used

- Button
- Card
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
