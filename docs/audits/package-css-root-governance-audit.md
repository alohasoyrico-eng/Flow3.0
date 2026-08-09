# Package CSS Root Governance Audit

Status: **pass**

Every root class and --comp-* alias in the package stylesheet must map to a known component, observed React root, or explicitly classified shared primitive/bridge; unclassified, unobserved, or unknown aliases indicate accidental visual implementations.

## Inventory

- Package CSS: packages/components/styles/components.css
- Selectors scanned: 1169
- Component aliases scanned: 3221
- Component alias roots: 62
- Unknown component aliases: 0
- CSS roots: 66
- Component roots: 58
- Component roots observed by React: 58
- Component roots not observed by React: 0
- Classified non-component roots: 8
- Unclassified roots: 0

## Classified Non-Component Roots

| Root | Type | Owner | React support | Note |
| --- | --- | --- | --- | --- |
| animation-asset | primitive-asset | packages/components/src/primitives/animation-assets.js | yes | Reusable animation asset primitive consumed by AnimatedMoment. |
| docs-package-demo | docs-layout-bridge | ../FlowDocs/apps/docs | no | Temporary docs layout hook for package-backed demos; tracked so it cannot multiply silently. |
| field-action | shared-control-primitive | field | yes | Shared field action affordance consumed by Input, Combobox, and card field inputs. |
| field-control | legacy-field-shell | field | no | Legacy-compatible field shell selector covered by the Field CSS contract. |
| field-input | legacy-field-input | field | no | Legacy-compatible field input selector covered by the Field CSS contract. |
| illustration-asset | primitive-asset | packages/components/src/primitives/illustration-assets.js | yes | Reusable illustration asset primitive. |
| input | shared-control-primitive | field | yes | Shared native input surface consumed by field-family React components. |
| material-symbol | iconography-hook | packages/components/src/primitives/iconography.js | yes | Material Symbols font hook used by icon-bearing components. |

## Component Alias Roots

| Root |
| --- |
| accordion |
| animated-moment |
| animation-asset |
| audit-event |
| avatar |
| badge |
| biometric-prompt |
| breadcrumbs |
| button |
| card |
| card-expiry-input |
| card-number-input |
| card-security-code-input |
| card-summary |
| chart-panel |
| checkbox |
| chip |
| choice |
| code-input |
| combobox |
| country-selector |
| date-picker |
| date-range-picker |
| dialog |
| drawer |
| empty-state |
| error-panel |
| field |
| field-control |
| floating-action-button |
| icon-button |
| illustration-asset |
| inline-validation |
| input |
| kpi-tile |
| list |
| menu |
| motion-boundary |
| movement-row |
| pagination |
| phone-input |
| popover |
| progress-indicator |
| quick-action |
| radio-button |
| route-summary |
| segmented-control |
| select |
| select-control |
| skeleton |
| slider |
| spinner |
| station-pin |
| stepper |
| switch |
| table |
| tabs |
| tag |
| text-area |
| toast |
| tooltip |
| tree-view |

## Unknown Component Aliases

| Alias |
| --- |
| None |

## Unobserved Component Roots

| Root |
| --- |
| None |

## Unclassified Roots

| Root |
| --- |
| None |

