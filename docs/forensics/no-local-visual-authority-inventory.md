# No Local Visual Authority Inventory

Date: 2026-08-20

## Purpose

This inventory defines the current surface that must be covered by a consolidated "No Local Visual Authority" contract for Flow core. The goal is not to add another parallel audit family. The goal is to make existing contracts detect hardcoded styling, inline styles, dark mode overrides, density/frame drift, and demo-only visual patches across the Flow cascade.

## Scope

In scope:

- `packages/tokens/source`
- `packages/tokens/styles`
- `packages/components/styles`
- `packages/react/src`
- `packages/react/dist`
- `packages/patterns`
- `packages/templates`
- `packages/audit/scripts`
- Local component QA demos in `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa`

Out of scope for this pass:

- FlowDocs application renderers, pages, routes, and visual templates.
- FlowDocs migration debt.

The local component QA demos are still in scope because they are the human review harness for Flow components. They can create layout, theme toggles, and interaction scenarios, but they cannot redefine component geometry, state colors, density, icons, radius, motion, or dark mode behavior locally.

## Current Surface

- Flow core files scanned in `packages` and `scripts`: 1349.
- Local interactive component QA demos found: 13.
- Current Flow3.0 repo state before inventory: clean.

Local demos found:

- `button`
- `checkbox`
- `combobox`
- `dialog`
- `floating-action-button`
- `icon-button`
- `input`
- `menu`
- `quick-action`
- `radio-button`
- `select`
- `switch`
- `tabs`

## Existing Coverage

The project already has useful contracts and gates. They should be consolidated rather than duplicated.

- Token ownership:
  - `audit:raw-token-values`
  - `audit:generated-token-outputs`
  - `audit:p0-token-source-gates`
  - `audit:token-ownership`
  - `audit:token-outputs`
- Foundation and primitive cascade:
  - `audit-foundation-cascade-contracts.js`
  - primitive cascade reports for accessibility, density, disabled, focus, iconography, loading, measurement, message, motion-adjacent primitives, and library sources.
- Component CSS contracts:
  - individual `audit-*-css-contract.js` scripts.
  - examples already catch local dark overrides, local frame multipliers, local radius offsets, and component-owned geometry where a shared role should exist.
- Runtime geometry gates:
  - `audit:control-frame-runtime`
  - `audit:choice-frame-runtime`
  - `audit:icon-button-runtime`
  - `audit:option-listbox-runtime`
- Public package and React gates:
  - `audit:consumer-install`
  - `audit:react-production-readiness`
  - `audit:component-runtime`
  - `test:react:fast`
  - `audit:ds-fast-gate`
- Existing demo boundary evidence:
  - `audit:flowdocs-demo-boundary` currently classifies local QA harnesses, but the name couples this evidence to FlowDocs even when the demos are being used for Flow core QA.

## Findings

### 1. Inline style detection exists but is not yet a single DS-core authority gate

There are 288 raw matches for inline style patterns across `packages` and `scripts`.

Important classification:

- Some React source usage may be legitimate when it writes only governed CSS custom properties, for example dynamic chart series, tree depth, slider percent, and tab indicator measurements.
- Audit scripts intentionally include bad inline style examples to prove consumer style props are rejected.
- A consolidated gate needs to distinguish dynamic CSS-var plumbing from local visual authority.

### 2. Local demos have style blocks by design, but the boundary is too weak

There are 19 matches for inline style or `<style>` usage inside local component QA snapshots.

Important classification:

- `interactive/react-runtime.html` files need harness CSS for page layout, review sections, theme controls, and interaction instructions.
- They must not define or override component classes such as `.button`, `.field`, `.select-control`, `.combobox`, `.menu`, `.checkbox`, `.radio`, `.switch`, `.tabs`, or their descendants unless the override is explicitly marked as test instrumentation and cannot affect visual review.
- Old ZIP/reference HTML can contain inline styles because it is evidence, not Flow implementation. Those files should be excluded from DS implementation gates but not confused with current Flow demos.

### 3. Raw values are currently mixed across source, generated output, and evidence

There are 1137 raw value matches for hex, px, gradients, and `color-mix()` across `packages` and `scripts`.

Important classification:

- Raw reference values are allowed in token source and generated token output.
- Generated CSS output may contain `px`, hex, and `color-mix()` when generated from token source.
- Component CSS should consume foundation, primitive, and component role aliases, not create local foundation decisions.
- Audit scripts may contain raw strings as assertions.
- Local demos may use layout-only raw values, but not to style Flow component internals.

### 4. Dark mode is partly centralized, but component-scoped exceptions still need a single rule

`packages/tokens/styles/token-contexts.css` currently owns shared dark-mode component aliases for action, field, option row, checkbox, radio, switch, badge, card, tag, inline validation, tree view, and station pin.

This is better than per-component dark overrides in component CSS. The missing rule is a global prohibition:

- No `[data-theme="dark"] .component-name` overrides in `packages/components/styles/components.css` unless the selector is part of a declared token-context ownership block.
- No local demo dark mode patches for component internals.
- No component-specific dark color substitutions when a foundation or primitive alias should own the decision.

### 5. The demos are being audited under a FlowDocs-named boundary

The current `flowdocs-demo-boundary` report already sees local component QA harnesses and warns that harness CSS can affect visual reading. That evidence is useful, but the naming and ownership are wrong for the current DS-focused workflow.

The next consolidation should either:

- move the local component QA portion into a Flow-core demo harness boundary, or
- keep the existing script but have DS gates consume only the local component QA subsection with a Flow-core name.

## Boundary Rules To Consolidate

Allowed:

- Token source defining reference and semantic values.
- Generated token outputs created by the build.
- Component CSS aliases that consume shared foundation, primitive, or component role tokens.
- React dynamic style objects only when every key is a CSS custom property and the value is non-authoritative runtime data.
- Demo shell CSS for page layout, grid, theme toggle, and review scaffolding.
- Audit scripts containing raw strings as tests.

Forbidden:

- Public React props exposing `style`, `className`, or `dangerouslySetInnerHTML` as visual escape hatches.
- React inline styles that set visual CSS properties such as `color`, `background`, `border`, `height`, `width`, `padding`, `radius`, `font`, `boxShadow`, or `transform`.
- Component CSS raw hex, local px geometry, local gradients, local dark overrides, local density scales, local icon scales, or local radius decisions where a Flow role should exist.
- Local demos overriding Flow component internals for visual review.
- Generated outputs edited manually.
- Pattern/template/component variants inventing state, density, tone, radius, or motion outside the cascade.

## Next Iteration

Iteration 2 should not create a new audit family. It should define a consolidated contract and allowlist used by the existing gates:

1. Classify allowed raw value zones.
2. Classify allowed dynamic CSS-var style usage in React.
3. Classify allowed demo shell CSS.
4. Make local component QA demos first-class DS QA evidence instead of FlowDocs evidence.
5. Define the exact gate failure categories that block commit:
   - inline visual style
   - local component override in demo
   - component dark override
   - raw geometry outside token/component role ownership
   - generated output edited or used as source truth
   - public visual escape hatch
