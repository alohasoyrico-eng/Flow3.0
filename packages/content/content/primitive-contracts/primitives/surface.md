# Surface

Generated portable primitive contract for Design System.

The JSON spec and primitive copy remain the editable source of truth. Regenerate this file with `npm run build:primitive-contracts` after changing primitive copy or spec.

Source content:

- `packages/specs/specs/unison-system/artifacts/primitives/surface.json`
- `packages/content/content/primitive-copy.json`

## Purpose

Turn Frame, Depth, Energy, State, and Accessibility foundation roles into implementation-ready ownership for structural backgrounds, panels, sheets, overlays, sections, and grouped content without misusing Card as layout.

Surface sits between foundations and components.
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

Governing foundations: `Frame`, `Depth`, `Energy`, `State`, `Accessibility`

Foundation inputs: `sys.frame.*`, `sys.depth.*`, `sys.energy.*`, `sys.state.*`, `sys.accessibility.*`

Coordinates primitives: `Color`, `Spacing`, `Radius`, `Elevation`, `Density`, `Focus`, `Breakpoints`, `Disabled`

Token dependencies: `sys.energy.surface.*`, `sys.color.surface*`, `sys.frame.padding.surface`, `sys.frame.radius.surface`, `sys.radius.surface`, `sys.depth.*`, `sys.density.surface.*`, `sys.accessibility.contrast.surface`, `surface.*`

## Roles

| Role | Token | Use |
| --- | --- | --- |
| canvas | surface.canvas | Base page or app background that receives sections, navigation, and overlays. |
| section | surface.section | Semantic grouping that owns spacing and background without becoming an object card. |
| panel | surface.panel | Bounded work area, settings group, inspector, or temporary content region. |
| overlay | surface.overlay | Temporary focused layer such as dialog body, drawer body, sheet body, or popover body. |
| inline | surface.inline | Local grouped surface inside a field, toolbar, row, or compact control cluster. |

## Product Examples

- Settings group: Surface owns the grouped background, padding, radius, and density while Switch/Input remain components inside it.
- File upload drop zone: Surface owns the bounded drop region and drag state; Card is used only if the region is one scannable content object.
- Bottom sheet: Surface owns overlay body, depth, safe-area padding, focus containment, and responsive density.

## API

Props: `role`, `density`, `elevation`, `tone`, `state`, `focusMode`, `breakpoint`

Outputs: `surfaceRole`, `cssCustomProperties`, `layerPolicy`, `densityScope`, `focusBoundary`

## States

- default
- raised
- sunken
- overlay
- selected
- dragging
- disabled
- focused

## Responsibilities

- Render Surface through semantic foundation roles.
- Expose a small API that maps to foundations and token aliases.
- Work across density, responsive, keyboard, touch, screen reader, contrast, and reduced-motion requirements when relevant.
- Prevent raw visual values or duplicated implementation decisions.

## Token Dependencies

- sys.energy.surface.*
- sys.color.surface*
- sys.frame.padding.surface
- sys.frame.radius.surface
- sys.radius.surface
- sys.depth.*
- sys.density.surface.*
- sys.accessibility.contrast.surface
- surface.*

## Agent Instructions

- Use Surface for structural ownership before choosing Card.
- Do not wrap arbitrary component groups in Card to obtain padding, radius, or background.
- Let density and theme cascade from Surface to child components.
- Escalate to Dialog, Drawer, Popover, Menu, or Tooltip only when the component owns interaction semantics.

## Reject If

- Card is used as a generic layout container.
- Pattern CSS invents background, radius, shadow, padding, or z-index outside Surface tokens.
- Nested decorative cards are used to create hierarchy.
- A structural surface owns no density, focus, or accessibility boundary.
