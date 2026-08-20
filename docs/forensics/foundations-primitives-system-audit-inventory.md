# Foundations/Primitives System Audit Inventory

Status: **iteration 2 complete**

This inventory starts the foundations/primitives remediation block after P0 component readiness work. It does not create a new audit lane. It consolidates the existing token, primitive, runtime, and gate evidence so the next iterations can fix systemic contracts instead of patching one component at a time.

## Objective

Answer whether Flow's foundations and primitives are strong enough to prevent repeated component bugs across density, frame, radius, icon scale, motion, dark mode, contrast, disabled state, focus, and overlay/listbox geometry.

Current answer: **structural gates pass, but runtime coverage is uneven by contract family**.

The DS has real foundation/primitive ownership and active gates. The remaining risk is not "missing Style Dictionary" or "missing primitive reports"; it is whether each foundation/primitive contract is enforced in the same way users found bugs: rendered geometry, keyboard behavior, contrast, theme state, density scale, and composed component usage.

## Source Of Truth

| Layer | Evidence | Status |
| --- | --- | --- |
| Token source | `packages/tokens/source/**/*.tokens.json` | pass |
| Foundations | 11 foundation token groups | pass |
| Primitives | 24 primitive contracts/reports | pass |
| Generated outputs | CSS, JSON, TS, Flutter, Android, iOS, manifests | pass |
| Flow core gate | `npm run audit:flow-core-gate` | pass |
| Fast DS gate | `npm run validate:flow-core:fast` | pass |
| Runtime frame audits | control frame, choice frame, option/listbox, icon-button runtime scripts | present |
| React P0 component evidence | `p0-forms-basic`, `p0-forms-advanced`, `p0-overlays-navigation` | recently strengthened |

## Current Inventory

| Metric | Value | Evidence |
| --- | ---: | --- |
| Foundations | 11 | `docs/audits/system-phase3-foundations-primitives-checkpoint.md` |
| Primitives | 24 | `docs/audits/system-phase3-foundations-primitives-checkpoint.md` |
| Active primitive cascade reports | 24 | `docs/audits/primitive-cascade-governance-audit.md` |
| Primitive backlog | 0 | `docs/audits/primitive-cascade-governance-audit.md` |
| Primitive runtime contracts | 18 | `docs/audits/system-p0-primitive-runtime-matrix.md` |
| Primitive policy contracts | 6 | `docs/audits/system-p0-primitive-runtime-matrix.md` |
| JS-only primitive runtime debt | 0 | `docs/audits/system-p0-primitive-runtime-matrix.md` |
| Export debt | 0 | `docs/audits/foundation-primitive-export-contract-audit.md` |
| Generated token outputs matching manifest | 9/9 | `docs/audits/system-phase3-foundations-primitives-checkpoint.md` |
| Raw token value violations | 0 | `docs/audits/system-phase3-foundations-primitives-checkpoint.md` |
| Source-boundary violations | 0 | `docs/audits/system-phase3-foundations-primitives-checkpoint.md` |
| ControlFrame covered components | 23 | `docs/audits/control-frame-adoption-inventory.md` |
| ControlFrame unresolved debt | 0 | `docs/audits/control-frame-adoption-inventory.md` |
| Runtime frame checks in fast gate | 4 | `packages/audit/scripts/audit-ds-fast-gate.js` |

## Foundation Contract Map

| Foundation | Owns | Recent Bug Connection | Current Evidence |
| --- | --- | --- | --- |
| Frame | control height, padding, spacing, grid, border sizing | md larger than lg, field/action frame mismatch, overlay/listbox geometry | `foundation-frame-cascade-audit`, `audit-control-frame-density-runtime` |
| Iconography | icon size, semantic icon color, glyph family, touch/focus affordance | checkbox/radio icon scale, Material Symbol vs SVG, disabled icon contrast | `foundation-iconography-cascade-audit`, `primitive-iconography-cascade-audit` |
| Momentum | duration, easing, press, enter/exit, reduced motion | button/input motion expectations, motion role confusion | `foundation-momentum-cascade-audit`, `audit-motion-contracts`, `audit-component-motion-role-coverage` |
| Accessibility | contrast, touch target, focus, reduced motion, readable type | dark-mode legibility, keyboard interaction, disabled affordance | `foundation-accessibility-cascade-audit`, `audit-accessibility-contracts`, axe in P0 tests |
| Energy | color semantics, action/warning/danger/success surfaces | danger/warning hover using blue, dark contrast failures | `foundation-energy-cascade-audit`, `primitive-color-cascade-audit`, `audit-dark-mode-css-contract` |
| Depth | overlay elevation, z-index, surface lift | popover/menu/listbox depth and double-surface confusion | `foundation-depth-cascade-audit`, `primitive-elevation-cascade-audit` |
| State | focus, disabled, selected, active, loading state semantics | active vs selected confusion, disabled not visually clear | `foundation-state-cascade-audit`, component P0 tests |
| Voice | type scale and readable line height | dark-mode typography contrast/readability | `foundation-voice-cascade-audit`, density/typography primitive reports |
| Symbol | symbol language and material glyph dependency | wrong glyph source or missing icon font | `foundation-symbol-cascade-audit`, iconography reports |
| Tone | semantic tone weights and repair/status language | warning/danger/success consistency | `foundation-tone-cascade-audit`, color/disabled primitives |
| Growth | maturity/stability classification | no direct recent bug; governance metadata | `foundation-growth-cascade-audit` |

## Primitive Contract Map

| Primitive | Role In This Remediation | Current Evidence | Risk |
| --- | --- | --- | --- |
| Density | sm/md/lg cascade and inherited scale | pass | Must become runtime-enforced for every density-aware frame family. |
| Radius | control/surface/container/pill shape roles | pass | Needs family-specific acceptance: button radius is not input/select radius. |
| Iconography | 16/20/24 scale, semantic colors, glyph family | pass | Needs runtime cross-component icon-size checks. |
| Motion Curves + Duration | press/state/enter/exit/loading roles | pass | Needs role coverage tied to component families, not only token presence. |
| Color | semantic action/danger/warning/success/text/surface aliases | pass | Needs dark-mode contrast and tone-state coverage by family. |
| Focus | visible ring, offset, roving/trap/restore | pass | Needs runtime checks for keyboard flows and not just CSS selectors. |
| Disabled | readable disabled styles and unavailable behavior | pass | Needs both semantic disabled and visual distinguishability. |
| Elevation | overlay/listbox/popover/dialog/surface depth | pass | Needs cross-family overlay geometry consistency. |
| Surface | structural background/density/state cascade | pass | Needs owner decision for docs/templates later, not this P0 DS block. |
| Field Action | inline field action buttons and affordance sizing | pass | Needs relation to input/select/combobox/payment field actions. |

## Existing Gates To Consolidate

Do not create a separate gate unless an existing one cannot express the rule.

| Existing gate/script | Keep | Needed adjustment |
| --- | --- | --- |
| `audit:ds-fast-gate` | yes | Continue as fast PR feedback. |
| `audit:flow-core-gate` | yes | Keep as core contract source. |
| `audit:control-frame-runtime` | yes | Use as runtime proof for field/action geometry. |
| `audit:choice-frame-runtime` | yes | Use for checkbox/radio/switch mark and icon scale. |
| `audit:option-listbox-runtime` | yes | Use for select/combobox/country-selector/menu option rows. |
| `audit:icon-button-runtime` | yes | Keep icon/action geometry proof. |
| `audit:dark-mode-css-contract` | yes | Fold failures into core family evidence where possible. |
| `audit:accessibility-contracts` | yes | Extend only if family rules cannot be expressed by P0 tests. |
| `audit:motion-contracts` | yes | Pair with motion-role coverage instead of adding another motion audit. |

## Initial Risk Register

| Risk | Why It Matters | Existing Evidence | Next Iteration |
| --- | --- | --- | --- |
| Runtime geometry coverage is narrower than token reports | Token pass did not stop md/lg and padding bugs from appearing in demos | control/choice/listbox/icon-button runtime scripts are now in `audit:ds-fast-gate` | Iteration 2 complete |
| Radius roles are not yet documented as family acceptance criteria | Button and input/select should not have identical shape | radius primitive pass | Iteration 3 |
| Icon scale is still prone to component-local drift | Checkbox/radio exposed mark/icon scaling debt | choice runtime script, iconography reports | Iteration 4 |
| Motion roles are semantically under-specified for fields vs actions | Input motion discussion exposed unclear acceptance | momentum/motion reports, input motion matrix | Iteration 5 |
| Dark mode and contrast need runtime-style assurance | User observed legibility failures after light/dark demos | dark mode CSS audit, axe excludes color contrast in jsdom | Iteration 6 |
| Primitive ownership is structurally pass but product-runtime proof varies | Some primitives are policy contracts, not runtime contracts | primitive runtime matrix | Iteration 7 |
| Gates are numerous and can drift | Audit sprawl caused trust problems | ds-fast/flow-core gates exist | Iteration 8 |

## Definition Of Done For This Block

- Existing gates remain the source of truth.
- No new audit lane is introduced unless folded into `audit:flow-core-gate` or `audit:ds-fast-gate`.
- Runtime checks cover the same bug classes found manually: density order, exact frame size, icon scale, option row geometry, disabled affordance, dark contrast, motion role, focus/keyboard.
- P0 components already worked must keep passing after foundation/primitive contract changes.
- `npm run validate:flow-core:fast` passes before every commit.

## Next Iteration

Iteration 3: **Radius + surface contract**.

Tasks:

- Confirm family-specific radius roles for actions, fields, choices, listbox rows, overlays, and surfaces.
- Keep button/icon-button pill radius separate from input/select/combobox field radius.
- Verify whether surface/container radius rules are already represented in existing primitive and component CSS contracts.
- Fold any missing radius/surface proof into existing gates only.

## Iteration 2 Result

Density and frame runtime checks now run through `audit:ds-fast-gate`, which is already part of `npm run validate:flow-core:fast`.

Checks folded into the fast gate:

- `audit:control-frame-runtime`: verifies rendered `36/44/52` control frame heights, `border-box`, and action-vs-field radius separation.
- `audit:choice-frame-runtime`: verifies checkbox/radio/switch/slider geometry, mark/icon scaling, alignment, motion-bearing transitions, and light/dark choice legibility.
- `audit:icon-button-runtime`: verifies icon action `36/44/52` frame and `16/20/24` icon scale.
- `audit:option-listbox-runtime`: verifies select/combobox/menu option row geometry, active/selected/disabled states, and light/dark listbox color consistency.

Observed runtime status before wiring:

| Runtime check | Status | Main contract |
| --- | --- | --- |
| `audit:control-frame-runtime` | pass | control frame `36/44/52`, `border-box`, role radius separation |
| `audit:choice-frame-runtime` | pass | choice marks/icons and switch/slider density geometry |
| `audit:icon-button-runtime` | pass | icon action frame and icon scale |
| `audit:option-listbox-runtime` | pass | option/listbox rows, state color, disabled visibility |
| `report:control-frame-inventory` | pass | 62 components classified, 23 control-frame covered, 0 unresolved debt |
