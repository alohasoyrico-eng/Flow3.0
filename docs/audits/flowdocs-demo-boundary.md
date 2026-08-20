# FlowDocs Demo Boundary

Generated: 2026-08-20T15:54:17.061Z
Status: action_required

## Summary

- flowdocsDemoFiles: 109
- flowdocsDemoRiskFiles: 73
- mixedFlowClaimFiles: 0
- localQaFiles: 13
- localQaComponents: 13
- localQaReactRuntimeFiles: 13
- localQaManualHarnessFiles: 0
- obsoleteLocalQaFiles: 0
- nonCanonicalLocalQaFiles: 0
- localQaComponentIds: button, checkbox, combobox, dialog, floating-action-button, icon-button, input, menu, quick-action, radio-button, select, switch, tabs

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
| high | FlowDocs owns stateful island wrappers for components such as input, checkbox, combobox, select and country selector. | 1 | These wrappers are acceptable only as docs harness adapters; package behavior must be tested in package-owned tests and local QA harnesses. |
| medium | Local QA harnesses include their own layout CSS. | 13 | Keep them local and out of repo; use them for human inspection, not as component source truth. |

## FlowDocs Demo Classifications

| File | Classification | Signals | Risks |
| --- | --- | --- | --- |
| ../FlowDocs/apps/docs/button-playground-interactions.js | docs-manual-interaction-layer | mutates-html, selector-driven, manual-events, local-demo-helper | Demo behavior may live in FlowDocs instead of the package component.; Demo can change rendered behavior outside React/package contracts.; Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/choice-demo-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/component-demo-interactions.js | docs-manual-interaction-layer | mutates-html, selector-driven, manual-events, local-demo-helper | Demo behavior may live in FlowDocs instead of the package component.; Demo can change rendered behavior outside React/package contracts.; Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/component-demo.js | docs-package-demo-bridge | uses-package-demo-props, creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/demo-preview-frame-island.js | docs-react-pattern-island | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/display-demo-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/doc-interactions.js | docs-manual-interaction-layer | selector-driven, manual-events | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/docs-template-islands.js | docs-runtime-support | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/documentation-section-island.js | docs-react-pattern-island | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/gold-accordion-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-animated-moment-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-audit-event-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-avatar-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-badge-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-biometric-prompt-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-breadcrumbs-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-button-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-card-docs.js | docs-component-detail-renderer | none | none |
| ../FlowDocs/apps/docs/gold-card-expiry-input-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-card-number-input-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-card-security-code-input-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-card-summary-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-chart-panel-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-checkbox-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-chip-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-code-input-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-combobox-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-component-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-country-selector-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-date-picker-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-date-range-picker-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-dialog-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-drawer-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-empty-state-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-error-panel-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-floating-action-button-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-icon-button-docs.js | docs-component-detail-renderer | none | none |
| ../FlowDocs/apps/docs/gold-inline-validation-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-input-docs.js | docs-component-detail-renderer | none | none |
| ../FlowDocs/apps/docs/gold-kpi-tile-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-list-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-menu-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-motion-boundary-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-movement-row-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-pagination-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-phone-input-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-popover-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-progress-indicator-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-quick-action-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-radio-button-docs.js | docs-component-detail-renderer | none | none |
| ../FlowDocs/apps/docs/gold-route-summary-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-segmented-control-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-select-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-simple-component-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-skeleton-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-slider-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-spinner-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-station-pin-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-stepper-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-switch-docs.js | docs-component-detail-renderer | none | none |
| ../FlowDocs/apps/docs/gold-table-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-tabs-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-tag-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-text-area-docs.js | docs-component-detail-renderer | none | none |
| ../FlowDocs/apps/docs/gold-toast-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-tooltip-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/gold-tree-view-docs.js | docs-component-detail-renderer | local-demo-helper | Demo may be authored through docs-local helpers instead of package demo props. |
| ../FlowDocs/apps/docs/overlay-demo-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/pattern-advanced-filter-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/pattern-candidate-demos.js | docs-pattern-demo-renderer | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/pattern-candidate-interactions.js | docs-manual-interaction-layer | none | none |
| ../FlowDocs/apps/docs/pattern-column-configurator-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/pattern-desktop-demos.js | docs-pattern-demo-renderer | none | none |
| ../FlowDocs/apps/docs/pattern-desktop-interactions.js | docs-manual-interaction-layer | selector-driven, manual-events | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/pattern-desktop-react-demos.js | docs-pattern-demo-renderer | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/pattern-journey-demos.js | docs-pattern-demo-renderer | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/pattern-journey-interactions.js | docs-manual-interaction-layer | selector-driven, manual-events | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/pattern-journey-react-demos.js | docs-pattern-demo-renderer | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/pattern-mobile-demos.js | docs-pattern-demo-renderer | none | none |
| ../FlowDocs/apps/docs/pattern-mobile-interactions.js | docs-manual-interaction-layer | selector-driven, manual-events | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/pattern-mobile-react-demos.js | docs-pattern-demo-renderer | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/pattern-operational-demos.js | docs-pattern-demo-renderer | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/pattern-operational-react-demos.js | docs-pattern-demo-renderer | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/pattern-package-demo.js | docs-pattern-demo-renderer | none | none |
| ../FlowDocs/apps/docs/pattern-react-candidate-file-upload-island.js | docs-react-pattern-island | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/pattern-react-candidate-filter-chip-group-island.js | docs-react-pattern-island | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/pattern-react-candidate-islands.js | docs-pattern-demo-renderer | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/pattern-react-candidate-toolbar-island.js | docs-react-pattern-island | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/pattern-react-desktop-islands.js | docs-pattern-demo-renderer | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/pattern-react-islands.js | docs-pattern-demo-renderer | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/pattern-react-journey-islands.js | docs-pattern-demo-renderer | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/pattern-react-mobile-islands.js | docs-pattern-demo-renderer | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/pattern-react-operational-islands.js | docs-pattern-demo-renderer | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/pattern-react-shell-islands.js | docs-pattern-demo-renderer | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/pattern-roles-permissions-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/pattern-shell-react-demos.js | docs-pattern-demo-renderer | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/pattern-utility-demos.js | docs-pattern-demo-renderer | creates-react-island, declares-flow-source | none |
| ../FlowDocs/apps/docs/pattern-utility-interactions.js | docs-manual-interaction-layer | selector-driven, manual-events | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/progress-indicator-demo-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/react-component-islands.js | docs-react-island-hydrator | uses-docs-generated-react, creates-react-island, hydrates-react, selector-driven, manual-events | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/reference-demo-interactions.js | docs-manual-interaction-layer | mutates-html, selector-driven, manual-events | Demo behavior may live in FlowDocs instead of the package component.; Demo can change rendered behavior outside React/package contracts. |
| ../FlowDocs/apps/docs/select-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/stateful-component-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/template-desktop-demos.js | docs-template-demo-renderer | none | none |
| ../FlowDocs/apps/docs/template-desktop-interactions.js | docs-manual-interaction-layer | mutates-html, selector-driven, manual-events | Demo behavior may live in FlowDocs instead of the package component.; Demo can change rendered behavior outside React/package contracts. |
| ../FlowDocs/apps/docs/template-react-demos.js | docs-template-demo-renderer | creates-react-island | none |
| ../FlowDocs/apps/docs/template-react-islands.js | docs-template-demo-renderer | uses-docs-generated-react, hydrates-react | none |
| ../FlowDocs/apps/docs/toast-demo-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |
| ../FlowDocs/apps/docs/tooltip-demo-interactions.js | docs-manual-interaction-layer | selector-driven | Demo behavior may live in FlowDocs instead of the package component. |

## Local QA Harnesses

| File | Component | Signals | Risks |
| --- | --- | --- | --- |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/button-2026-08-17/interactive/react-runtime.html | button | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/checkbox-2026-08-18/interactive/react-runtime.html | checkbox | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/combobox-2026-08-17/interactive/react-runtime.html | combobox | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/dialog-2026-08-19/interactive/react-runtime.html | dialog | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/floating-action-button-2026-08-20/interactive/react-runtime.html | floating-action-button | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/icon-button-2026-08-20/interactive/react-runtime.html | icon-button | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/input-2026-08-17/interactive/react-runtime.html | input | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/menu-2026-08-18/interactive/react-runtime.html | menu | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/quick-action-2026-08-20/interactive/react-runtime.html | quick-action | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/radio-button-2026-08-18/interactive/react-runtime.html | radio-button | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/select-2026-08-17/interactive/react-runtime.html | select | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/switch-2026-08-18/interactive/react-runtime.html | switch | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/tabs-2026-08-18/interactive/react-runtime.html | tabs | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |

## Next Iteration

Iteration 7: Templates Boundary. Classify docs templates and package templates so FlowDocs pages consume Flow templates without recreating layout rules locally.

