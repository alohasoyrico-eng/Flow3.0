# Package CSS Root Governance Audit

Status: **pass**

Every root class and --comp-* alias in the package stylesheet must map to a known component, observed React root, or explicitly classified shared primitive/bridge; unclassified, unobserved, or unknown aliases indicate accidental visual implementations. The actionable debt metric is packageCssRootDebt.

## Inventory

- Package CSS: packages/components/styles/components.css
- Selectors scanned: 1285
- Component aliases scanned: 3340
- Component alias roots: 68
- Unknown component aliases: 0
- CSS roots: 75
- Component roots: 64
- Component roots observed by React: 64
- Component roots not observed by React: 0
- Classified non-component roots: 11
- Unclassified roots: 0
- Package CSS root debt: 0
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. Published CSS roots and --comp-* aliases should not grow, shrink, or lose classification without review.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| selectors | 1285 | 1285 |
| componentAliases | 3340 | 3340 |
| componentAliasRoots | 68 | 68 |
| unknownComponentAliases | 0 | 0 |
| cssRoots | 75 | 75 |
| componentRoots | 64 | 64 |
| observedComponentRoots | 64 | 64 |
| unobservedComponentRoots | 0 | 0 |
| classifiedNonComponentRoots | 11 | 11 |
| unclassifiedRoots | 0 | 0 |
| packageCssRootGovernanceIssues | 0 | 0 |
| packageCssRootDebt | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Classified Non-Component Roots

| Root | Type | Owner | React support | Note |
| --- | --- | --- | --- | --- |
| animation-asset | primitive-asset | packages/components/src/primitives/animation-assets.js | yes | Reusable animation asset primitive consumed by AnimatedMoment. |
| docs-package-demo | docs-layout-bridge | ../FlowDocs/apps/docs | no | Temporary docs layout hook for package-backed demos; tracked so it cannot multiply silently. |
| documentation-hero | docs-pattern-boundary | packages/react/src/patterns/DocumentationHero.ts | yes | Documentation hero pattern root for FlowDocs home and artifact detail pages. |
| documentation-section | docs-pattern-boundary | packages/react/src/patterns/DocumentationSection.ts | yes | Documentation section pattern root replacing local docs section wrappers. |
| field-action | shared-control-primitive | field | yes | Shared field action affordance consumed by Input, Combobox, and card field inputs. |
| field-control | legacy-field-shell | field | no | Legacy-compatible field shell selector covered by the Field CSS contract. |
| field-input | legacy-field-input | field | no | Legacy-compatible field input selector covered by the Field CSS contract. |
| illustration-asset | primitive-asset | packages/components/src/primitives/illustration-assets.js | yes | Reusable illustration asset primitive. |
| input | shared-control-primitive | field | yes | Shared native input surface consumed by field-family React components. |
| material-symbol | iconography-hook | packages/components/src/primitives/iconography.js | yes | Material Symbols font hook used by icon-bearing components. |
| surface | structural-primitive | packages/react/src/Surface.js | yes | Surface primitive owns structural backgrounds, depth, and density scope before components render. |

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
| chat-composer |
| chat-message |
| chat-thread |
| checkbox |
| chip |
| choice |
| code-block |
| code-input |
| combobox |
| copy-button |
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
| input-amount |
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

