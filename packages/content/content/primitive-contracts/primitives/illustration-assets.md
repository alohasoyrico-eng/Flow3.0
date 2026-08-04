# Illustration Assets

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/illustration-assets.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn approved free illustration sources into Flow-owned image assets for purpose, format, theme, accessibility labels, density, responsive framing, and fallback behavior.

Illustration Assets sits between foundations and components.
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

Required sections: `purpose`, `foundationInputs`, `roles`, `productExamples`, `api`, `tokens`, `states`, `agentInstructions`, `rejectIf`

Governing foundations: `Symbol`, `Accessibility`, `Energy`, `Frame`, `Voice`

Foundation inputs: `sys.symbol.*`, `sys.accessibility.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`

Coordinates primitives: `Library Sources`, `Animation Assets`, `Iconography`, `Density`, `Breakpoints`

Token dependencies: `illustration.*`, `library.*`, `sys.symbol.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.accessibility.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| source | illustration.source.* | Approved source, license, attribution, and redistribution boundaries. |
| format | illustration.format.* | PNG, SVG, GIF, or static fallback selection by product context. |
| purpose | illustration.purpose.* | Decorative, informative, onboarding, empty, hero, or guidance role. |
| theme | illustration.theme.* | Light, dark, high-contrast, and quiet-mode asset switching. |
| fallback | illustration.fallback.* | Fallback copy or symbol when an image cannot load. |

## Product Examples

- Home hero: Hero art switches between light and dark assets while copy remains accessible.
- Onboarding: An Open Doodles illustration may support a step when it is not the only source of meaning.
- Empty state: Illustration is optional; title, description, and action carry the recovery path.

## API

Props: `id`, `src`, `darkSrc`, `alt`, `purpose`, `source`, `format`, `density`, `fallbackText`

Outputs: `assetNode`, `assetModel`, `sourceModel`, `accessibilityModel`

## States

- ready
- decorative
- informative
- missing
- unsupportedFormat
- unapprovedSource

## Responsibilities

- Render Illustration Assets through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- illustration.*
- library.*
- sys.symbol.*
- sys.energy.*
- sys.frame.*
- sys.voice.*
- sys.accessibility.*

## Agent Instructions

- Use Open Doodles only through Illustration Assets.
- Decorative illustrations must use empty alt text.
- Informative illustrations must have meaningful alt text and visible copy nearby.
- Do not use illustration to replace icons, labels, or instructions.
- Do not introduce paid, restricted, or attribution-unclear illustration sources without adding them to the source registry.

## Reject If

- The illustration source is not approved.
- The license is missing.
- An informative illustration has empty alt text.
- A decorative illustration is announced to assistive technology.
- Light and dark assets are hardcoded outside the primitive.

## Prevents

Hardcoded illustration assets values and one-off implementation behavior.
