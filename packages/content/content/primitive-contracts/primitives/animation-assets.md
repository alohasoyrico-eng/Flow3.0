# Animation Assets

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/animation-assets.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn lottie-web and Lottie-compatible assets into implementation-ready playback, static fallback, reduced-motion policy, lifecycle controls, and accessibility labels.

Animation Assets sits between foundations and components.
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

Governing foundations: `Momentum`, `Accessibility`, `Symbol`, `Energy`, `Frame`

Foundation inputs: `sys.momentum.*`, `sys.accessibility.*`, `sys.symbol.*`, `sys.energy.*`, `sys.frame.*`

Coordinates primitives: `Library Sources`, `Duration`, `Motion Curves`, `Loading`

Token dependencies: `animationAsset.*`, `library.*`, `duration.*`, `motionCurve.*`, `loading.*`, `sys.momentum.*`, `sys.accessibility.*`, `sys.symbol.*`, `sys.energy.*`, `sys.frame.*`, `lottie-web`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| runtime | animationAsset.runtime | Library-backed lottie-web renderer and lifecycle bridge. |
| source | animationAsset.source | JSON path or animation data reference owned outside bounded components. |
| fallback | animationAsset.fallback | Static icon and text fallback when runtime, asset, or motion permission is unavailable. |
| lifecycle | animationAsset.lifecycle | Play, pause, complete, disabled, and reduced-motion states. |

## Product Examples

- Animated Moment: One bounded cue consumes Animation Assets for runtime/fallback without owning player logic.
- Onboarding pattern: Multi-step education can orchestrate several animation assets while the primitive owns playback.
- Empty State: A static fallback remains meaningful when reduced motion is active.

## API

Props: `label`, `source`, `animationData`, `renderer`, `state`, `autoplay`, `loop`, `fallbackIcon`, `fallbackText`, `reducedMotion`, `runtime`

Outputs: `animationElement`, `runtimeState`, `fallbackState`, `playerInstance`

## States

- idle
- playing
- paused
- complete
- reduced-motion
- disabled
- fallback

## Responsibilities

- Render Animation Assets through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- animationAsset.*
- library.*
- duration.*
- motionCurve.*
- loading.*
- sys.momentum.*
- sys.accessibility.*
- sys.symbol.*
- sys.energy.*
- sys.frame.*
- lottie-web

## Agent Instructions

- Use lottie-web through Animation Assets; do not call lottie-web directly from components or patterns.
- Always provide a static fallback icon and fallback text.
- Reduced motion must stop runtime playback and keep meaning visible.
- Components may compose Animation Assets but must not own multi-step animation orchestration.
- Do not fetch animation runtime from a remote CDN in docs.

## Reject If

- A component or pattern calls loadAnimation directly.
- The runtime is loaded from a CDN in docs.
- There is no static fallback for reduced motion or missing runtime.
- Required meaning exists only in motion.
- The primitive owns onboarding, education, campaign, or multi-step sequence rules.

## Prevents

Hardcoded animation assets values and one-off implementation behavior.
