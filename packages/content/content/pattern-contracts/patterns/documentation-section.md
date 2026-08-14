# Documentation Section

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/documentation-section/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/documentation-section.json`

## Purpose

Group documentation content with governed headings, callouts, matrix layouts, and section states.

## Use When

- A docs page needs a reusable section boundary.
- Content needs a heading, matrix, card group, callout, or evidence block.
- The section appears across more than one documentation template.

## Do Not Use Without Review

- The section is only a visual card.
- The content should be owned by Code Block, Demo Preview Frame, Table, or another component.
- A page template needs bespoke layout outside Flow boundaries.

## Foundations

| Foundation | Contract |
| --- | --- |
| Voice | Titles, descriptions, callouts, and empty/error copy stay explicit. |
| Frame | Stack, split, matrix, cards, and callout layouts stay governed. |
| Depth | Surface owns the boundary without nested local panels. |
| State | Callout, dark, dense, empty, error, loading, matrix, and mobile states are explicit. |
| Tone | Callout and status tone are explicit without creating local visual language. |
| Accessibility | Heading order is inherited from the host template. |
| Energy | Governs accent, status, and interactive emphasis through Flow tokens. |

## Formal Purpose

Coordinate documentation sections, section surfaces, local headings, content density, guidelines, callouts, and grouped evidence without FlowDocs owning section wrappers.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Web documentation |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `QA`, `Agents` |
| Template Dependencies | `Docs Home Template`, `Docs Collection Template`, `Reference Detail Template`, `Component Detail Template`, `Pattern Detail Template`, `Template Detail Template` |

## Formal States

- `default`
- `dense`
- `callout`
- `matrix`
- `empty`
- `loading`
- `error`
- `dark`
- `mobile`

## Formal Dependencies

### Foundations

- `Voice`
- `Frame`
- `Depth`
- `State`
- `Tone`
- `Accessibility`
- `Energy`

### Primitives

- `Surface`
- `Typography`
- `Spacing`
- `Breakpoints`
- `Density`
- `Focus`
- `Message`

### Patterns

- `Section Header`

### Tokens

- `sys.voice.*`
- `sys.frame.*`
- `sys.depth.*`
- `sys.state.*`
- `sys.tone.*`
- `sys.accessibility.*`
- `sys.energy.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `header` | `pattern` | `Section Header` |
| `body` | `channel` | `host content` |
| `footer` | `channel` | `host content` |

## Formal Governance

### Entry Conditions

- A docs page needs a reusable section boundary.
- Content needs a heading, matrix, card group, callout, or evidence block.
- The section appears across more than one documentation template.

### Decision Tree

- Use plain content when no reusable boundary is needed.
- Use Documentation Section when heading, surface, grouped content, callout, or matrix structure repeats.
- Use Table for structured matrices and Card for bounded repeated items.
- Use template private slots for docs-only composition that is not public.

### Failure Modes

- docs-section-surface or detail-section-surface remains as local FlowDocs structure.
- Cards are used as generic nested page sections.
- Matrices use local div grids after Table/List can own the role.
- Callouts communicate status by color alone.

### Success Metrics

- Migrated pages share section structure and density.
- Local wrapper count decreases instead of moving names around.
- Section content remains data-driven from FlowDocs adapters.

### Accessibility

- Maintain heading order from the host template.
- Use semantic tables/lists for structured data.
- Expose callout tone and status in text.

### Tests

- Covers default, dense, callout, matrix, empty, loading, dark, and mobile states.
- Fails when migrated pages use docs-section-surface or local matrix wrappers.
- Checks Table/List semantics for structured content.

### Agent Instructions

- Do not create a new primitive for every documentation section layout.
- Use this pattern to replace docs-section-surface and detail-section-surface.
- Reject Card variants that only describe docs section visuals.

### Reject If

- FlowDocs creates local section wrapper classes for a migrated page.
- A section contains another page-level card wrapper.
- Matrix content is rendered through local div grids when Table/List is appropriate.
- A new Card variant is proposed only for documentation section styling.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| header | Section Header | conditional | Section heading and description. |
| body | ReactNode | yes | Section content. |
| footer | ReactNode | conditional | Supplemental section content. |

## Components Used

## Variants

## Motion Contract

## Accessibility

- Maintain heading order from the host template.
- Use semantic tables/lists for structured data.
- Expose callout tone and status in text.

## Implementation Checklist

- Declare `body`: Section content.
- Covers default, dense, callout, matrix, empty, loading, dark, and mobile states.
- Fails when migrated pages use docs-section-surface or local matrix wrappers.
- Checks Table/List semantics for structured content.

## Tests And Rejection Rules

Must test:

- Covers default, dense, callout, matrix, empty, loading, dark, and mobile states.
- Fails when migrated pages use docs-section-surface or local matrix wrappers.
- Checks Table/List semantics for structured content.

Reject if:

- FlowDocs creates local section wrapper classes for a migrated page.
- Matrix content is rendered through local div grids when Table/List is appropriate.

## MIEL

Agents can decide:

- Use Documentation Section to replace repeated docs section wrappers.

Agents must ask:

- A new Card variant is proposed only for documentation section styling.

Agents must reject:

- FlowDocs creates local section wrapper classes for a migrated page.
- Matrix content is rendered through local div grids when Table/List is appropriate.
