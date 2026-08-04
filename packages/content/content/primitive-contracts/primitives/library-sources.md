# Library Sources

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/library-sources.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Govern the approved third-party and open-source visual/runtime libraries that enter Flow so components, patterns, templates, and docs consume primitive APIs instead of duplicating vendors, drawing assets ad hoc, or fetching uncontrolled sources.

Library Sources sits between foundations and components.
It consumes semantic tokens and exposes a narrow API.
It prevents hardcoded values, detached semantics, and inconsistent implementation.
It must be portable across React, Flutter, documentation, and agent specs.

## Definition Of Ready

Before building or auditing any artifact against this primitive, confirm:

- Design System foundations govern the primitive.
- The primitive exposes a narrow, reusable API and never a one-off component shortcut.
- Components, patterns, templates, and docs consume the primitive contract instead of redefining visual values locally.
- ZIP reference details may influence equivalence only after the primitive maps them back to system foundations.

Layer: `Primitive`

Platform: `System`

Audiences: `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents`

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `states`, `agentInstructions`, `rejectIf`, `evidence`

Governing foundations: `Symbol`, `Iconography`, `Accessibility`, `Momentum`, `Energy`, `Frame`

Foundation inputs: `sys.symbol.*`, `sys.iconography.*`, `sys.accessibility.*`, `sys.momentum.*`, `sys.energy.*`, `sys.frame.*`

Coordinates primitives: `Iconography`, `Country Flags`, `Animation Assets`, `Illustration Assets`, `Charts`, `Maps`

Token dependencies: `library.*`, `sys.symbol.*`, `sys.iconography.*`, `sys.accessibility.*`, `sys.momentum.*`, `sys.energy.*`, `sys.frame.*`, `icon.*`, `countryFlag.*`, `animationAsset.*`, `illustration.*`, `chart.*`, `map.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| source | library.source | Approved package or local vendor source with license and ownership. |
| runtime | library.runtime | Browser/runtime bridge used by docs and package demos without remote CDN dependence. |
| license | library.license | License evidence required before a source can enter Flow. |
| primitive-api | library.primitiveApi | The only API components and patterns may consume for that library family. |
| fallback | library.fallback | Accessible non-library fallback for failed or reduced environments. |

## Product Examples

- Phone Input: Country flags come from country-flag-icons through Country Flags, not inline SVGs.
- Chart Panel: Charts use ECharts through Charts with accessible table fallback and interaction.
- Animated Moment: Motion assets use Lottie through Animation Assets with reduced-motion fallback.
- Maps and Station Pins: Map runtime uses MapLibre through Maps while pins and overlays remain Flow components.

## API

Props: `id`, `library`, `license`, `source`, `runtime`, `primitive`, `vendorFiles`, `fallback`

Outputs: `librarySourceRecord`, `approvedPrimitiveApi`, `vendorEvidence`, `fallbackRequirement`

## States

- approved
- vendored
- runtime-ready
- fallback-ready
- blocked

## Responsibilities

- Render Library Sources through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- library.*
- sys.symbol.*
- sys.iconography.*
- sys.accessibility.*
- sys.momentum.*
- sys.energy.*
- sys.frame.*
- icon.*
- countryFlag.*
- animationAsset.*
- illustration.*
- chart.*
- map.*

## Agent Instructions

- Before introducing a library, add it to Library Sources with license, vendor/runtime, primitive API, and fallback evidence.
- Components, patterns, templates, and docs must consume the owning primitive API instead of importing vendor code directly.
- Do not fetch visual/runtime assets from a remote CDN in docs unless Library Sources explicitly approves that boundary.
- If a library lacks license or fallback evidence, block the consuming component or pattern.

## Reject If

- A component imports or draws an asset that belongs to a library primitive.
- A new vendor enters docs without license evidence.
- Runtime assets load from an uncontrolled remote URL.
- There is no fallback for reduced motion, missing asset, or inaccessible visual-only output.
- Library ownership is documented only in an audit script and not in the primitive spec.

## Prevents

Hardcoded library sources values and one-off implementation behavior.
