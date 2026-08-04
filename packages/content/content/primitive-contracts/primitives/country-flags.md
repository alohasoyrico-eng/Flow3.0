# Country Flags

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/country-flags.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn country-flag-icons MIT assets into implementation-ready country identity, circular flag masks, accessible labels, asset paths, and fallback behavior.

Country Flags sits between foundations and components.
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

Governing foundations: `Iconography`, `Symbol`, `Accessibility`, `Energy`, `Frame`

Foundation inputs: `sys.iconography.*`, `sys.symbol.*`, `sys.accessibility.*`, `sys.energy.*`, `sys.frame.*`

Coordinates primitives: `Library Sources`, `Iconography`, `Radius`, `Spacing`

Token dependencies: `countryFlag.*`, `library.*`, `sys.iconography.*`, `sys.symbol.*`, `sys.accessibility.*`, `sys.energy.*`, `sys.frame.*`, `icon.*`, `radius.*`, `spacing.*`, `country-flag-icons`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| asset | countryFlag.asset | Library-backed flag image for country selectors and phone inputs. |
| mask | countryFlag.mask | Circular visual treatment governed by component radius and frame. |
| identity | countryFlag.identity | Country code, country name, calling code, and selected state. |
| fallback | countryFlag.fallback | Text fallback when an asset cannot load. |

## Product Examples

- Phone Input: Country flag sits before the calling code while the typed phone number keeps its own input space.
- Country Selector: Options pair the flag asset with country name and calling code, with flag meaning repeated in text.

## API

Props: `country`, `label`, `hidden`, `basePath`

Outputs: `countryCode`, `assetPath`, `accessibleName`, `fallbackLabel`

## States

- loaded
- fallback
- decorative
- informative

## Responsibilities

- Render Country Flags through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- countryFlag.*
- library.*
- sys.iconography.*
- sys.symbol.*
- sys.accessibility.*
- sys.energy.*
- sys.frame.*
- icon.*
- radius.*
- spacing.*
- country-flag-icons

## Agent Instructions

- Use country-flag-icons assets; do not draw country flags by hand.
- Flag images are decorative when the country name or code is visible.
- Expose an accessible label only when the flag is the only country identity signal.
- Keep the primitive responsible for asset, mask, fallback, and country code only.
- Do not fetch flag assets from a remote CDN in docs.

## Reject If

- Flag SVGs are manually drawn in component code.
- The only country identity is visual color or shape.
- The primitive depends on remote flag assets in docs.
- There is no fallback when the flag asset fails.
- Country Selector or Phone Input duplicates flag asset logic.

## Prevents

Hardcoded country flags values and one-off implementation behavior.
