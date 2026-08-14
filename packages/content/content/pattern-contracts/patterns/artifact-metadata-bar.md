# Artifact Metadata Bar

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/artifact-metadata-bar/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/artifact-metadata-bar.json`

## Purpose

Expose repeated documentation metadata as compact, accessible Flow-owned items instead of local pill systems.

## Use When

- A documentation template needs status, layer, platform, maturity, ownership, dependency, count, or QA metadata.
- Metadata needs to wrap consistently across cards, heroes, and detail headers.
- Metadata values may include explanations or actions.

## Do Not Use Without Review

- The metadata is the primary page heading.
- The content is structured comparison data.
- The pattern would become a general product status bar without product evidence.

## Foundations

| Foundation | Contract |
| --- | --- |
| Voice | Metadata labels remain explicit and readable. |
| Frame | Items wrap without changing document hierarchy. |
| State | Empty, loading, compact, interactive, overflow, dark, and mobile states are explicit. |
| Tone | Status tone stays delegated to Badge, Tag, or Chip. |
| Accessibility | Explanations and actions must have accessible names. |
| Depth | Governs layering, elevation, and surface hierarchy without local wrappers. |
| Energy | Governs accent, status, and interactive emphasis through Flow tokens. |
| Growth | Governs maturity, coverage, and documentation status signals. |
| Iconography | Governs functional glyph usage without parallel icon styling. |
| Momentum | Governs motion timing and responsive transition behavior. |
| Symbol | Governs symbolic visuals while labels and fallback text remain visible. |

## Formal Purpose

Render compact metadata for Flow artifacts such as layer, platform, maturity, status, counts, dependencies, and ownership without local pill or card-meta wrappers.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Web documentation |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `PMs`, `Agents` |
| Template Dependencies | `Docs Home Template`, `Docs Collection Template`, `Documentation Hero`, `Reference Detail Template`, `Docs Artifact Detail Template`, `Component Detail Template`, `Pattern Detail Template`, `Template Detail Template` |

## Formal States

- `default`
- `compact`
- `overflow`
- `interactive`
- `loading`
- `empty`
- `dark`
- `mobile`

## Formal Dependencies

### Foundations

- `Voice`
- `Frame`
- `State`
- `Tone`
- `Accessibility`
- `Depth`
- `Energy`
- `Growth`
- `Iconography`
- `Momentum`
- `Symbol`

### Primitives

- `Surface`
- `Typography`
- `Spacing`
- `Density`
- `Focus`
- `Color`
- `Disabled`
- `Duration`
- `Iconography`
- `Loading`
- `Measurement`
- `Message`
- `Motion Curves`
- `Radius`

### Components

- `Badge`
- `Tag`
- `Chip`
- `Tooltip`
- `Button`

### Tokens

- `comp.badge.*`
- `comp.tag.*`
- `comp.chip.*`
- `comp.tooltip.*`
- `comp.button.*`
- `sys.voice.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.tone.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.symbol.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `items` | `component` | `Badge`, `Tag`, `Chip` |
| `explanations` | `component` | `Tooltip` |
| `actions` | `component` | `Button` |

## Formal Governance

### Entry Conditions

- A docs template needs to show artifact metadata repeatedly.
- Metadata includes status, layer, platform, maturity, ownership, dependency, count, or QA signals.
- The metadata must be compact but still accessible.

### Decision Tree

- Use Badge or Tag directly for one-off metadata.
- Use Artifact Metadata Bar when multiple metadata values repeat across docs cards, heroes, or detail headers.
- Use Tooltip only when compact labels require explanation.
- Do not create docs-specific pill wrappers.

### Failure Modes

- Metadata chips are custom spans.
- Status or maturity is color-only.
- Overflow wraps unpredictably in mobile cards.
- Metadata is embedded in each docs card implementation.

### Success Metrics

- Metadata rendering is consistent across home, collections, and details.
- Cards and heroes can use the same metadata contract.
- Metadata remains readable and accessible at compact sizes.

### Accessibility

- Expose abbreviated metadata with accessible labels.
- Do not rely on color alone for status.
- Preserve readable order when metadata wraps.

### Tests

- Covers default, compact, overflow, interactive, loading, empty, dark, and mobile states.
- Fails when migrated pages use local card-meta-row or custom pill wrappers.
- Checks accessible names for compact metadata items.

### Agent Instructions

- Use this pattern for repeated artifact metadata.
- Do not promote every docs metadata layout to a Card variant.
- Ask before metadata implies maturity, compliance, or release readiness.

### Reject If

- Metadata is rendered with local pill classes.
- Status, maturity, or readiness is color-only.
- A docs card duplicates metadata layout internally after this pattern exists.
- The pattern becomes a general product status bar without product use evidence.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| items | Badge \| Tag \| Chip | yes | Metadata values with explicit labels. |
| explanation | Tooltip | conditional | Compact metadata explanation. |
| actions | Button[] | conditional | Metadata-related actions. |

## Components Used

- Badge
- Button
- Chip
- Tag
- Tooltip

## Variants

## Motion Contract

## Accessibility

- Expose abbreviated metadata with accessible labels.
- Do not rely on color alone for status.
- Preserve readable order when metadata wraps.

## Implementation Checklist

- Declare `items`: Metadata values with explicit labels.
- Covers default, compact, overflow, interactive, loading, empty, dark, and mobile states.
- Fails when migrated pages use local card-meta-row or custom pill wrappers.
- Checks accessible names for compact metadata items.

## Tests And Rejection Rules

Must test:

- Covers default, compact, overflow, interactive, loading, empty, dark, and mobile states.
- Fails when migrated pages use local card-meta-row or custom pill wrappers.
- Checks accessible names for compact metadata items.

Reject if:

- Metadata is rendered with local pill classes.
- Status, maturity, or readiness is color-only.

## MIEL

Agents can decide:

- Use this pattern for repeated artifact metadata.

Agents must ask:

- Metadata implies maturity, compliance, or release readiness.

Agents must reject:

- Metadata is rendered with local pill classes.
- Status, maturity, or readiness is color-only.
