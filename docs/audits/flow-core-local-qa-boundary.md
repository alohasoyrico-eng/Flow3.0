# FlowDocs Demo Boundary

Generated: 2026-08-20T10:24:34.148Z
Status: pass

## Summary

- flowdocsDemoFiles: 0
- flowdocsDemoRiskFiles: 0
- mixedFlowClaimFiles: 0
- localQaFiles: 14
- localQaComponents: 13
- localQaComponentIds: button, checkbox, combobox, dialog, floating-action-button, icon-button, input, menu, quick-action, radio-button, select, switch, tabs

## Rules

- Package-owned React tests define component behavior truth.
- Local component QA harnesses are human review tools and must stay outside the repo.
- FlowDocs demos may demonstrate composition but must not own component logic, keyboard semantics, or state truth.
- Any docs demo wrapper that adds state or interaction must be labelled as an adapter, not proof that the component works.
- Pattern/template demos can compose components, but component-level defects must be fixed in package source and package tests first.

## Findings

| Severity | Issue | Count | Action |
| --- | --- | ---: | --- |
| medium | At least one local QA file may not prove React runtime directly. | 13 | For each component QA harness, record whether it imports React runtime, generated docs runtime, or static markup. |
| medium | Local QA harnesses include their own layout CSS. | 13 | Keep them local and out of repo; use them for human inspection, not as component source truth. |

## FlowDocs Demo Classifications

| File | Classification | Signals | Risks |
| --- | --- | --- | --- |

## Local QA Harnesses

| File | Component | Signals | Risks |
| --- | --- | --- | --- |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/button-2026-08-17/interactive/button-flow-current.html | button | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/button-2026-08-17/manifest.json | button | none | Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/checkbox-2026-08-18/interactive/checkbox-flow-current.html | checkbox | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/combobox-2026-08-17/interactive/combobox-flow-current.html | combobox | uses-flow-token-css, uses-flow-component-css, uses-flow-react-runtime, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/dialog-2026-08-19/interactive/dialog-flow-current.html | dialog | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/floating-action-button-2026-08-20/interactive/floating-action-button-flow-current.html | floating-action-button | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/icon-button-2026-08-20/interactive/icon-button-flow-current.html | icon-button | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/input-2026-08-17/interactive/input-flow-current.html | input | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/menu-2026-08-18/interactive/menu-flow-current.html | menu | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/quick-action-2026-08-20/interactive/quick-action-flow-current.html | quick-action | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/radio-button-2026-08-18/interactive/radio-button-flow-current.html | radio-button | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/select-2026-08-17/interactive/select-flow-current.html | select | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/switch-2026-08-18/interactive/switch-flow-current.html | switch | uses-flow-token-css, uses-flow-component-css, has-theme-control, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |
| /Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/tabs-2026-08-18/interactive/tabs-flow-current.html | tabs | uses-flow-token-css, uses-flow-component-css, has-theme-control, keyboard-observation-harness, local-harness-css | Harness CSS can affect visual reading; do not use as component source truth.; Harness may not prove React runtime unless runtime import is explicit. |

## Next Iteration

Iteration 7: Templates Boundary. Classify docs templates and package templates so FlowDocs pages consume Flow templates without recreating layout rules locally.

