# System forensic gates

Generated: 2026-08-11

This report defines the audit gates that must pass before remediation can be called complete. It does not change implementation.

## Gates

| Gate | Status | Blockers |
| --- | --- | --- |
| style-dictionary-real | pass | None |
| typescript-source-real | fail | FlowDocs has zero .ts/.tsx source files |
| primitive-cascade-runtime | pass | None |
| docs-ownership | fail | 7 docs generated candidates do not map to spec<br>162 entities have hand-authored docs surfaces |

## Layer matrix summary

| Layer | Total | With Flow runtime | With docs generated runtime | With hand docs surfaces | With TS source |
| --- | ---: | ---: | ---: | ---: | ---: |
| foundation | 11 | 0 | 0 | 11 | 0 |
| primitive | 24 | 24 | 1 | 19 | 24 |
| component | 60 | 60 | 60 | 60 | 0 |
| pattern | 63 | 63 | 63 | 63 | 0 |
| template | 9 | 9 | 9 | 9 | 0 |

## Highest duplicate risk

| Layer | Entity | Duplicate surfaces | Hand docs files | Surfaces |
| --- | --- | ---: | ---: | --- |
| component | card | 5 | 90 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | button | 5 | 84 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | list | 5 | 83 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | select | 5 | 82 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | input | 5 | 71 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | table | 5 | 71 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| pattern | search | 5 | 61 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | tabs | 5 | 45 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | menu | 5 | 39 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | badge | 5 | 38 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | switch | 5 | 37 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | tag | 5 | 36 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | toast | 5 | 32 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | drawer | 5 | 31 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | dialog | 5 | 28 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| pattern | topbar | 5 | 28 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| pattern | settings | 5 | 27 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| pattern | sidebar | 5 | 27 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | icon-button | 5 | 25 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | avatar | 5 | 24 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | chip | 5 | 22 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | audit-event | 5 | 21 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | checkbox | 5 | 21 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | breadcrumbs | 5 | 19 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | tooltip | 5 | 19 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | quick-action | 5 | 18 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | empty-state | 5 | 16 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| pattern | toolbar | 5 | 15 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | card-summary | 5 | 14 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |
| component | inline-validation | 5 | 14 | flow-react-js, flow-dts, docs-generated-js, docs-generated-dts, docs-hand-authored-surface |

## Docs-only candidates

| Layer | Entity | Reason |
| --- | --- | --- |
| stack | motion | docs catalog collection is outside the system taxonomy and needs an owner decision |
| stack | dotanimated | docs catalog collection is outside the system taxonomy and needs an owner decision |
| stack | gsap | docs catalog collection is outside the system taxonomy and needs an owner decision |
| stack | material-symbols | docs catalog collection is outside the system taxonomy and needs an owner decision |
| stack | apache-echarts | docs catalog collection is outside the system taxonomy and needs an owner decision |
| stack | maplibre-gl-or-mapbox | docs catalog collection is outside the system taxonomy and needs an owner decision |
| stack | edenred-ubuntu | docs catalog collection is outside the system taxonomy and needs an owner decision |

## Required next action

The next iteration must expand this gate model into remediation tickets per entity, starting with foundations and primitives. Code changes remain blocked until each entity has an owner decision.
