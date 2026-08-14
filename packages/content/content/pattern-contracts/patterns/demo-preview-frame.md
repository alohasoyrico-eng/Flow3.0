# Demo Preview Frame

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/demo-preview-frame/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/demo-preview-frame.json`

## Purpose

Frame documentation examples, playgrounds, source, controls, and fallback states with reusable Flow-owned behavior.

## Use When

- A documentation page needs to show a live component, pattern, template, specimen, or viewport example.
- The example requires controls, source, loading, error, or QA frame boundaries.
- The frame repeats across component, pattern, reference, or template details.

## Do Not Use Without Review

- The content is ordinary prose or reference data.
- The demo needs modal, drawer, or menu behavior owned by another pattern.
- The frame would duplicate Card or Surface behavior.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Preview and controls have labels and predictable focus order. |
| Frame | Demo, controls, source, and fallback slots keep stable layout. |
| Depth | Preview chrome does not create nested card stacks. |
| State | Loading, error, unsupported, dark, compact, and viewport states are explicit. |
| Tone | Error and unsupported tones are delegated to feedback components. |
| Energy | Governs accent, status, and interactive emphasis through Flow tokens. |
| Growth | Governs maturity, coverage, and documentation status signals. |
| Iconography | Governs functional glyph usage without parallel icon styling. |
| Momentum | Governs motion timing and responsive transition behavior. |
| Symbol | Governs symbolic visuals while labels and fallback text remain visible. |
| Voice | Governs editorial hierarchy, labels, descriptions, and helper copy. |

## Formal Purpose

Frame live examples, specimens, viewport demos, playgrounds, and visual QA targets while preserving the boundary between Flow artifacts and FlowDocs content data.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Web documentation |
| Audiences | `Developers`, `Product Designers`, `QA`, `Agents` |
| Template Dependencies | `Reference Detail Template`, `Component Detail Template`, `Pattern Detail Template`, `Template Detail Template` |

## Formal States

- `default`
- `interactive`
- `static`
- `viewport-mobile`
- `viewport-desktop`
- `loading`
- `error`
- `unsupported`
- `dark`
- `density-compact`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Frame`
- `Depth`
- `State`
- `Tone`
- `Energy`
- `Growth`
- `Iconography`
- `Momentum`
- `Symbol`
- `Voice`

### Primitives

- `Surface`
- `Spacing`
- `Breakpoints`
- `Density`
- `Focus`
- `Loading`
- `Disabled`
- `Typography`
- `Color`
- `Duration`
- `Iconography`
- `Measurement`
- `Message`
- `Motion Curves`
- `Radius`

### Components

- `Skeleton`
- `Error Panel`

### Tokens

- `comp.skeleton.*`
- `comp.error-panel.*`
- `sys.accessibility.*`
- `sys.frame.*`
- `sys.depth.*`
- `sys.state.*`
- `sys.tone.*`
- `sys.energy.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.symbol.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `preview` | `channel` | `host content` |
| `controls` | `channel` | `host controls` |
| `source` | `channel` | `host source` |
| `fallback` | `component` | `Skeleton`, `Error Panel` |

## Formal Governance

### Entry Conditions

- A documentation page needs to show a live component, pattern, template, specimen, or viewport example.
- The example requires controls, source, loading, error, or QA frame boundaries.
- The frame repeats across component, pattern, reference, or template details.

### Decision Tree

- Use direct inline content for simple text-only examples.
- Use Demo Preview Frame for live UI examples, viewport previews, playgrounds, or code-linked demos.
- Use Code Block and Copy Button for source snippets.
- Do not create per-artifact demo wrappers inside FlowDocs.

### Failure Modes

- Demo frames are implemented as local docs-demo-layout wrappers.
- Source code uses raw pre/code without Code Block governance.
- Loading or error demos bypass Skeleton or Error Panel.
- Viewport frames are visually fixed and fail mobile layout.

### Success Metrics

- Component, pattern, and template demos share framing behavior.
- Visual QA can target stable frame boundaries.
- Demo controls remain accessible and token-driven.

### Accessibility

- Label interactive demos and controls.
- Keep focus inside demo controls predictable.
- Provide text fallback for unsupported or failed demos.
- Do not trap keyboard focus in preview content unless the demo requires modal behavior.

### Tests

- Covers static, interactive, mobile viewport, desktop viewport, loading, error, dark, and density states.
- Fails when migrated pages use local docs-demo-layout wrappers.
- Checks source slot uses Code Block and Copy Button when source is shown.

### Agent Instructions

- Do not hand-roll demo frame markup in FlowDocs.
- Keep demo artifact behavior separate from frame behavior.
- Reject visual-only frame variants that are not tied to state, viewport, or source behavior.

### Reject If

- A docs page creates a local demo frame wrapper after this pattern is available.
- Demo source is copied with local buttons or raw pre/code.
- The frame owns the component or pattern being demonstrated.
- Viewport examples cannot be tested at mobile and desktop sizes.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| preview | ReactNode | yes | Rendered artifact preview. |
| controls | ReactNode | conditional | Interactive demo controls. |
| source | Code Block | conditional | Governed source snippet. |
| fallback | Error Panel \| Skeleton | conditional | Loading, error, or unsupported state. |

## Components Used

- Error Panel
- Skeleton

## Variants

## Motion Contract

## Accessibility

- Label interactive demos and controls.
- Keep focus inside demo controls predictable.
- Provide text fallback for unsupported or failed demos.
- Do not trap keyboard focus in preview content unless the demo requires modal behavior.

## Implementation Checklist

- Declare `preview`: Rendered artifact preview.
- Covers static, interactive, mobile viewport, desktop viewport, loading, error, dark, and density states.
- Fails when migrated pages use local docs-demo-layout wrappers.
- Checks source slot uses Code Block and Copy Button when source is shown.

## Tests And Rejection Rules

Must test:

- Covers static, interactive, mobile viewport, desktop viewport, loading, error, dark, and density states.
- Fails when migrated pages use local docs-demo-layout wrappers.
- Checks source slot uses Code Block and Copy Button when source is shown.

Reject if:

- A docs page creates a local demo frame wrapper.
- Demo source is copied with local buttons or raw pre/code.

## MIEL

Agents can decide:

- Use Demo Preview Frame for reusable documentation examples.

Agents must ask:

- A visual-only frame variant is requested without state, viewport, or source behavior.

Agents must reject:

- A docs page creates a local demo frame wrapper.
- Demo source is copied with local buttons or raw pre/code.
