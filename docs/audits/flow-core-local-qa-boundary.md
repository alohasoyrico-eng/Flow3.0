# FlowDocs Demo Boundary

Generated: 2026-08-20T18:13:32.434Z
Status: pass

## Summary

- flowdocsDemoFiles: 0
- flowdocsDemoRiskFiles: 0
- mixedFlowClaimFiles: 0
- localQaFiles: 13
- localQaComponents: 13
- localQaReactRuntimeFiles: 13
- localQaManualHarnessFiles: 0
- obsoleteLocalQaFiles: 0
- nonCanonicalLocalQaFiles: 0
- nonCanonicalLocalSnapshotFiles: 0
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
| medium | Local QA harnesses include their own layout CSS. | 13 | Keep them local and out of repo; use them for human inspection, not as component source truth. |

## FlowDocs Demo Classifications

| File | Classification | Signals | Risks |
| --- | --- | --- | --- |

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

