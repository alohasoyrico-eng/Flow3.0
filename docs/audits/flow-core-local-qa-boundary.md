# FlowDocs Demo Boundary

Generated: 2026-09-01T02:49:17.569Z
Status: pass

## Summary

- flowdocsDemoFiles: 0
- flowdocsDemoRiskFiles: 0
- mixedFlowClaimFiles: 0
- localQaFiles: 38
- localQaComponents: 38
- localQaReactRuntimeFiles: 38
- localQaManualHarnessFiles: 0
- obsoleteLocalQaFiles: 0
- nonCanonicalLocalQaFiles: 0
- nonCanonicalLocalSnapshotFiles: 0
- localQaGeneratorOpenStateful: 1
- localQaComponentIds: accordion, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-wrapper, checkbox, chip, code-input, combobox, country-selector, date-picker, date-range-picker, dialog, drawer, icon-button, input, input-amount, kpi-card, kpi-tile, menu, movement-row, pagination, phone-input, popover, progress, radio-button, route-summary, select, slider, stepper, switch, table, tabs, text-area

## Rules

- Package-owned React tests define component behavior truth.
- Local component QA harnesses are human review tools and must stay outside the repo.
- Local React runtime harnesses must declare data-flow-react-runtime="true" and be served over HTTP, because browser ESM imports are blocked from file://.
- FlowDocs demos may demonstrate composition but must not own component logic, keyboard semantics, or state truth.
- Any docs demo wrapper that adds state or interaction must be labelled as an adapter, not proof that the component works.
- Pattern/template demos can compose components, but component-level defects must be fixed in package source and package tests first.

## Findings

| Severity | Issue | Count | Action |
| --- | --- | ---: | --- |
| medium | Local QA harnesses include their own layout CSS. | 38 | Keep them local and out of repo; use them for human inspection, not as component source truth. |

## FlowDocs Demo Classifications

| File | Classification | Signals | Risks |
| --- | --- | --- | --- |

## Local QA Harnesses

| File | Component | Signals | Risks |
| --- | --- | --- | --- |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/accordion-2026-08-25/interactive/react-runtime.html | accordion | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/breadcrumbs-2026-08-29/interactive/react-runtime.html | breadcrumbs | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/button-2026-08-17/interactive/react-runtime.html | button | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/card-2026-08-20/interactive/react-runtime.html | card | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/card-expiry-input-2026-08-25/interactive/react-runtime.html | card-expiry-input | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/card-number-input-2026-08-25/interactive/react-runtime.html | card-number-input | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/card-security-code-input-2026-08-25/interactive/react-runtime.html | card-security-code-input | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/card-summary-2026-08-24/interactive/react-runtime.html | card-summary | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/chart-wrapper-2026-08-24/interactive/react-runtime.html | chart-wrapper | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/checkbox-2026-08-18/interactive/react-runtime.html | checkbox | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/chip-2026-08-31/interactive/react-runtime.html | chip | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/code-input-2026-08-24/interactive/react-runtime.html | code-input | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/combobox-2026-08-17/interactive/react-runtime.html | combobox | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/country-selector-2026-08-24/interactive/react-runtime.html | country-selector | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/date-picker-2026-08-24/interactive/react-runtime.html | date-picker | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/date-range-picker-2026-08-24/interactive/react-runtime.html | date-range-picker | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/dialog-2026-08-19/interactive/react-runtime.html | dialog | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/drawer-2026-08-25/interactive/react-runtime.html | drawer | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/icon-button-2026-08-20/interactive/react-runtime.html | icon-button | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/input-2026-08-17/interactive/react-runtime.html | input | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/input-amount-2026-08-25/interactive/react-runtime.html | input-amount | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/kpi-card-2026-08-24/interactive/react-runtime.html | kpi-card | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/kpi-tile-2026-08-25/interactive/react-runtime.html | kpi-tile | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/menu-2026-08-18/interactive/react-runtime.html | menu | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/movement-row-2026-08-25/interactive/react-runtime.html | movement-row | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/pagination-2026-08-29/interactive/react-runtime.html | pagination | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/phone-input-2026-08-24/interactive/react-runtime.html | phone-input | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/popover-2026-08-25/interactive/react-runtime.html | popover | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/progress-2026-08-25/interactive/react-runtime.html | progress | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/radio-button-2026-08-18/interactive/react-runtime.html | radio-button | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/route-summary-2026-08-24/interactive/react-runtime.html | route-summary | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/select-2026-08-17/interactive/react-runtime.html | select | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/slider-2026-08-24/interactive/react-runtime.html | slider | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/stepper-2026-08-25/interactive/react-runtime.html | stepper | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/switch-2026-08-18/interactive/react-runtime.html | switch | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/table-2026-08-27/interactive/react-runtime.html | table | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/tabs-2026-08-18/interactive/react-runtime.html | tabs | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/text-area-2026-08-24/interactive/react-runtime.html | text-area | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |

## Next Iteration

Iteration 7: Templates Boundary. Classify docs templates and package templates so FlowDocs pages consume Flow templates without recreating layout rules locally.

