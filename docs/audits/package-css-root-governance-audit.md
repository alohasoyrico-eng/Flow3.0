# Package CSS Root Governance Audit

Status: **pass**

Every root class in the package stylesheet must be a known component root or an explicitly classified shared primitive/bridge; unclassified roots indicate accidental visual implementations.

## Inventory

- Package CSS: packages/components/styles/components.css
- Selectors scanned: 1169
- CSS roots: 66
- Component roots: 58
- Classified non-component roots: 8
- Unclassified roots: 0

## Classified Non-Component Roots

| Root | Type | Owner | Note |
| --- | --- | --- | --- |
| animation-asset | primitive-asset | packages/components/src/primitives/animation-assets.js | Reusable animation asset primitive consumed by AnimatedMoment. |
| docs-package-demo | docs-layout-bridge | ../FlowDocs/apps/docs | Temporary docs layout hook for package-backed demos; tracked so it cannot multiply silently. |
| field-action | shared-control-primitive | field | Shared field action affordance consumed by Input, Combobox, and card field inputs. |
| field-control | legacy-field-shell | field | Legacy-compatible field shell selector covered by the Field CSS contract. |
| field-input | legacy-field-input | field | Legacy-compatible field input selector covered by the Field CSS contract. |
| illustration-asset | primitive-asset | packages/components/src/primitives/illustration-assets.js | Reusable illustration asset primitive. |
| input | shared-control-primitive | field | Shared native input surface consumed by field-family React components. |
| material-symbol | iconography-hook | packages/components/src/primitives/iconography.js | Material Symbols font hook used by icon-bearing components. |

## Unclassified Roots

| Root |
| --- |
| None |

