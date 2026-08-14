# Documentation Hero

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/documentation-hero/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/documentation-hero.json`

## Purpose

Coordinate documentation page hero content, metadata, actions, visual slot, and governed background treatment.

## Use When

- A documentation page needs a first-screen or detail-header introduction.
- The hero includes status, metadata, action, or background treatment.
- The hero must adapt across documentation templates.

## Do Not Use Without Review

- The section is not page-level.
- The page needs an application shell hero owned by a product template.
- The background requires local gradients or textures outside Flow ownership.

## Foundations

| Foundation | Contract |
| --- | --- |
| Voice | Kicker, title, description, metadata, and actions keep editorial hierarchy. |
| Frame | Hero layout adapts across desktop and mobile without local wrappers. |
| Depth | Surface and optional background define page entry depth. |
| Energy | Loading, action, and status states are explicit. |
| Accessibility | One page h1 and named actions are required. |
| Growth | Governs maturity, coverage, and documentation status signals. |
| Iconography | Governs functional glyph usage without parallel icon styling. |
| Momentum | Governs motion timing and responsive transition behavior. |
| State | Governs active, loading, empty, disabled, and responsive states. |
| Symbol | Governs symbolic visuals while labels and fallback text remain visible. |
| Tone | Governs semantic color/copy tone without local palette decisions. |

## Formal Purpose

Coordinate documentation page hero content, metadata, calls to action, and governed background treatment without creating local hero markup per page.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Web documentation |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Agents` |
| Template Dependencies | `Docs Home Template`, `Reference Detail Template`, `Docs Artifact Detail Template`, `Component Detail Template`, `Pattern Detail Template`, `Template Detail Template` |

## Formal States

- `default`
- `with-actions`
- `with-metadata`
- `with-status`
- `dark`
- `mobile`
- `loading`

## Formal Dependencies

### Foundations

- `Voice`
- `Frame`
- `Depth`
- `Energy`
- `Accessibility`
- `Growth`
- `Iconography`
- `Momentum`
- `State`
- `Symbol`
- `Tone`

### Primitives

- `Surface`
- `Typography`
- `Spacing`
- `Breakpoints`
- `Color`
- `Density`
- `Disabled`
- `Duration`
- `Focus`
- `Iconography`
- `Loading`
- `Motion Curves`
- `Radius`

### Components

- `Button`
- `Badge`
- `Tag`

### Patterns

- `Section Header`

### Tokens

- `comp.button.*`
- `comp.badge.*`
- `comp.tag.*`
- `sys.voice.*`
- `sys.frame.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.accessibility.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `title` | `pattern` | `Section Header` |
| `metadata` | `component` | `Badge`, `Tag` |
| `actions` | `component` | `Button` |
| `visual` | `channel` | `host visual` |

## Formal Governance

### Entry Conditions

- A documentation page needs a first-screen or detail-header introduction.
- The hero includes status, metadata, action, or background treatment.
- The hero must adapt across documentation templates.

### Decision Tree

- Use plain heading when the page only needs a title.
- Use Documentation Hero when heading, metadata, action, or visual treatment must be coordinated.
- Use Artifact Metadata Bar for compact metadata rows inside the hero.
- Do not create a new Card variant for hero containers.

### Failure Modes

- Hero background is page-local CSS.
- Metadata is rendered as custom pills instead of Badge/Tag/Artifact Metadata Bar.
- Hero typography bypasses Flow typography primitives.
- Hero actions bypass Button.

### Success Metrics

- Hero hierarchy remains readable and consistent across docs pages.
- Metadata and actions are reusable without local wrappers.
- Background treatment can be governed from Flow contracts.

### Accessibility

- Use one visible h1 per documentation page.
- Keep actions keyboard reachable.
- Do not hide status or metadata behind color-only cues.
- Symbolic visuals are supplemental; title, metadata, and status labels remain visible text with fallback meaning.

### Tests

- Covers title-only, metadata, actions, status, dark, mobile, and loading states.
- Rejects unmanaged gradient/grid CSS in migrated pages.
- Checks heading order and action focus order.

### Agent Instructions

- Do not invent a docs hero component in FlowDocs.
- Treat background treatments as governed slots, not new foundations by default.
- Use existing Card, Badge, Tag, and Button contracts when needed.

### Reject If

- The hero requires a docs-only component to render basic title, copy, metadata, or actions.
- Background treatment is a local CSS implementation detail.
- Metadata chips are custom spans.
- The hero creates a new public variant without satisfying variant criteria.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| title | Section Header | yes | Page title with template-supplied heading level. |
| metadata | Artifact Metadata Bar \| Badge \| Tag | conditional | Layer, maturity, status, and counts. |
| actions | Button[] | conditional | Hero actions. |
| visual | ReactNode | conditional | Governed visual specimen. |

## Components Used

- Badge
- Button
- Tag

## Variants

## Motion Contract

## Accessibility

- Use one visible h1 per documentation page.
- Keep actions keyboard reachable.
- Do not hide status or metadata behind color-only cues.

## Implementation Checklist

- Declare `title`: Page title with template-supplied heading level.
- Covers title-only, metadata, actions, status, dark, mobile, and loading states.
- Rejects unmanaged gradient/grid CSS in migrated pages.
- Checks heading order and action focus order.

## Tests And Rejection Rules

Must test:

- Covers title-only, metadata, actions, status, dark, mobile, and loading states.
- Rejects unmanaged gradient/grid CSS in migrated pages.
- Checks heading order and action focus order.

Reject if:

- Hero background is page-local CSS.
- Metadata chips are custom spans.

## MIEL

Agents can decide:

- Use Documentation Hero for governed docs page intros.

Agents must ask:

- A new public hero variant is requested.

Agents must reject:

- Hero background is page-local CSS.
- Metadata chips are custom spans.
