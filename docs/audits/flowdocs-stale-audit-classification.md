# FlowDocs Stale Audit Classification

Generated: 2026-08-18T18:59:34.569Z
Status: action_required

## Summary

- mixed-top-level-gate: 4
- rewrite-before-gating: 4
- scope-flowdocs-consumer: 83
- generated-evidence-only: 56
- legacy-forensics-only: 15
- content-governance: 25
- keep-flow-core: 12
- keep-flow-core-candidate: 1

## Blocking Findings

### packages/audit/scripts/audit-system.js

- Issue: Legacy all-in-one gate still mixes Flow core, FlowDocs app files, content ownership, generated reports, and visual/doc parity checks.
- Action: Do not use as the trustworthy system gate until split into core, consumer, content, and forensic gates.

### packages/audit/scripts/audit-integration.js

- Issue: Runs generated evidence checks such as component 1:1 matrix and FlowDocs template composition alongside package contracts.
- Action: Keep package/runtime checks; move template composition and generated quality matrix checks out of the integration gate.

### packages/audit/scripts/audit-system-scope.js

- Issue: Includes FlowDocs demo ownership and generated reporting in the same scope as React/package boundary checks.
- Action: Split FlowDocs consumer ownership from Flow core readiness.

## Source Of Truth Rules

- Flow core gates may read package source, generated runtime from package builds, token outputs, specs, and package tests.
- FlowDocs gates may prove docs consume Flow, but must not define component API, accessibility, state, motion, or token truth.
- docs/audits/*.json reports are evidence snapshots, not source contracts.
- Legacy ZIP/gold/parity narratives are forensic references unless rewritten into source-backed contracts.

## Classified Scripts

| Script | Classification | Smells | Action |
| --- | --- | --- | --- |
| packages/audit/scripts/audit-complete.mjs | mixed-top-level-gate | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Split before trusting as a monolithic gate. |
| packages/audit/scripts/audit-integration.js | mixed-top-level-gate | legacy-narrative-or-zip-signal | Split before trusting as a monolithic gate. |
| packages/audit/scripts/audit-system-scope.js | mixed-top-level-gate | none | Split before trusting as a monolithic gate. |
| packages/audit/scripts/audit-system.js | mixed-top-level-gate | legacy-narrative-or-zip-signal | Split before trusting as a monolithic gate. |
| packages/audit/scripts/audit-component-implementation-status.js | rewrite-before-gating | reads-flowdocs-runtime, legacy-narrative-or-zip-signal, missing-flowdocs-runtime-reference | Fix stale FlowDocs path assumptions before this can gate anything. |
| packages/audit/scripts/audit-context.js | rewrite-before-gating | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal, missing-flowdocs-runtime-reference | Fix stale FlowDocs path assumptions before this can gate anything. |
| packages/audit/scripts/audit-css-ownership.js | rewrite-before-gating | reads-flowdocs-runtime, legacy-narrative-or-zip-signal, missing-flowdocs-runtime-reference | Fix stale FlowDocs path assumptions before this can gate anything. |
| packages/audit/scripts/audit-template-composition.js | rewrite-before-gating | reads-flowdocs-runtime, reads-content-copy, missing-flowdocs-runtime-reference | Fix stale FlowDocs path assumptions before this can gate anything. |
| packages/audit/scripts/anti-duplication-governance-core.js | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-accessibility-contracts.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-adoption-readiness.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-architecture-gate.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-component-catalog-classification.mjs | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-component-demo-interactions.mjs | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-component-demo-registry.mjs | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-component-registry.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-consumer-install.mjs | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-content-ownership.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-css.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-dark-mode-css-contract.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-demo-layout-contracts.js | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-docs-component-demo-ownership.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-docs-runtime.mjs | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-energy-contracts.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-foundation-cascade-contracts.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-frame-contracts.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-gold-components.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-gold-demo-quality.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-layout-contracts.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-pattern-contracts.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-platform.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-react-primary-contract.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-repo-boundary.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-table-contracts.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-voice-contracts.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/class-root-governance.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/react-primitive-contract-audit.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-component-visual-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-docs-component-demo-ownership.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-docs-system-boundary.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-consumer-contract.js | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-content-source-of-truth.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-demo-boundary.js | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-legacy-slot-quarantine.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-p0-shell-cleanup-evidence.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-runtime-inventory.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-safe-cleanup-plan.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-shell-decision.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-stale-audit-classification.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-template-boundary.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-flowdocs-trustworthy-checkpoint.js | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-accessibility-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-depth-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-energy-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-frame-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-growth-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-iconography-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-momentum-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-state-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-symbol-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-tone-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-foundation-voice-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-pattern-1to1-architecture.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-pattern-contract-governance.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-pattern-react-migration-plan.js | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-animation-assets-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-cascade-activation-plan.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-color-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-country-flags-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-density-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-iconography-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-illustration-assets-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-library-sources-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-maps-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-measurement-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-primitive-message-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-react-template-runtime-governance.mjs | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-shell-pattern-contract-governance.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-consumer-boundary-checkpoint.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-consumer-css-token-cascade.js | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-consumer-runtime-smoke.js | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-forensic-gates.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-gate-boundary-classification.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-gate-split.js | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-p0-forensic-detail.js | scope-flowdocs-consumer | reads-flowdocs-runtime, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-p0-owner-decision-matrix.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-content-copy | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-p0-remediation-sequence.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-phase5-public-runtime-readiness.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-phase6-flowdocs-consumer-checkpoint.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-phase6-template-qa-checkpoint.js | scope-flowdocs-consumer | reads-flowdocs-runtime, reads-generated-audit-evidence | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/report-system-remediation-matrix.js | scope-flowdocs-consumer | reads-flowdocs-runtime | Move to an explicit FlowDocs consumer gate; do not run as Flow core proof. |
| packages/audit/scripts/audit-batch-zip-parity.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/audit-component-1to1-quality-matrix.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/audit-component-behavior-contracts.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/audit-component-contract-alignment.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/audit-component-motion-role-coverage.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/audit-motion-contracts.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/audit-state-contracts.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-email-channel-governance.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-breakpoints-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-cascade-governance.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-charts-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-disabled-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-duration-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-elevation-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-field-action-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-focus-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-loading-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-motion-curves-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-radius-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-research-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-spacing-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-primitive-typography-cascade.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-react-production-readiness.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-audit-contract-governance.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-component-runtime-audit.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-generated-token-output-governance.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-p0-primitive-runtime-matrix.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-p0-token-foundation-classification.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-p0-token-source-gates.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-pattern-artifact-tests.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-pattern-runtime-audit.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase1-style-dictionary-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase3-foundations-primitives-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase4-component-cascade-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase4-component-qa-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase4-core-controls-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase4-domain-complex-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase4-overlays-navigation-data-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase5-data-domain-mobile-patterns-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase5-interaction-patterns-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase5-pattern-1to1-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase5-pattern-governance-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase5-shell-patterns-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-phase6-template-audit-fixes-checkpoint.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-public-runtime-boundary.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-raw-token-value-decision-matrix.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-raw-token-value-governance.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-template-artifact-tests.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-template-runtime-audit.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-test-ownership.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-token-output-gates.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-token-ownership-matrix.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-system-typescript-project-setup.js | generated-evidence-only | reads-generated-audit-evidence | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-zip-kit-cascade-matrix.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-zip-kit-runtime-coverage.js | generated-evidence-only | reads-generated-audit-evidence, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/report-zip-owner-export-matrix.js | generated-evidence-only | reads-generated-audit-evidence, reads-content-copy, legacy-narrative-or-zip-signal | Use as checkpoint/report evidence, not as source-of-truth gate. |
| packages/audit/scripts/audit-gold-copy.js | legacy-forensics-only | reads-content-copy, legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/audit-gold-docs.js | legacy-forensics-only | reads-content-copy, legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/audit-gold-page-parity.js | legacy-forensics-only | reads-content-copy, legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/audit-taxonomy-boundaries.js | legacy-forensics-only | reads-content-copy, legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-foundation-quality.js | legacy-forensics-only | reads-content-copy, legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-pattern-foundation-primitive-1to1.js | legacy-forensics-only | reads-content-copy, legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-system-component-artifact-tests.js | legacy-forensics-only | legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-system-react-export-parity.js | legacy-forensics-only | legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-system-react-root-index-typescript-surface.js | legacy-forensics-only | legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-system-react-section-indexes-typescript-surface.js | legacy-forensics-only | legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-template-cascade-governance.js | legacy-forensics-only | reads-content-copy, legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-zip-flow-gap-audit.js | legacy-forensics-only | reads-content-copy, legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-zip-foundation-primitive-validation.js | legacy-forensics-only | legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-zip-system-intake.js | legacy-forensics-only | legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/report-zip-template-parity.js | legacy-forensics-only | reads-content-copy, legacy-narrative-or-zip-signal | Keep only as forensic reference unless rewritten against source contracts. |
| packages/audit/scripts/anti-duplication-concepts.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/audit-component-api-prop-alignment.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/audit-component-contracts.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/audit-component-remediation-coverage.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/audit-docs-content.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/audit-foundation-contracts.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/audit-manual-accessibility.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/audit-package-api.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/audit-primitive-contracts.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/audit-routes.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/component-css-governance-policy.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/pattern-architecture-policy.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/pattern-contract-governance.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/react-primary-governance-policy.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-anti-duplication-coverage.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-email-channel-renderer.mjs | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-foundation-primitive-export-contract.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-pattern-react-migration-audit.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-pattern-readiness.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-primitive-surface-cascade.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-react-composition-governance.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-react-pattern-behavior-governance.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-react-pattern-composition-governance.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-system-debt-ledger.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/report-taxonomy-boundaries.js | content-governance | reads-content-copy | Keep outside Flow runtime gates; content truth should be its own boundary. |
| packages/audit/scripts/audit-anti-duplication.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/audit-breakpoint-contracts.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/audit-component-modules.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/audit-density-contracts.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/audit-package-css-contracts.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/audit-package-css-namespace.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/audit-platform-adapters.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/audit-react-contract-triangle.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/audit-react-copy-contract.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/audit-spec.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/report-react-accessibility-governance.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/report-react-interaction-coverage.js | keep-flow-core | none | Eligible for Flow core/system gate. |
| packages/audit/scripts/audit-result.js | keep-flow-core-candidate | none | May remain in a Flow core/system gate if its inputs are source contracts or package runtime. |

## Missing FlowDocs Runtime References

| Script | Missing ref | Expected |
| --- | --- | --- |
| packages/audit/scripts/audit-component-implementation-status.js | ../FlowDocs/apps/docs/gold-final-keep-component-demos.js | ../FlowDocs/apps/docs/gold-final-keep-component-demos.js |
| packages/audit/scripts/audit-context.js | ../FlowDocs/apps/docs/navigation.js | ../FlowDocs/apps/docs/navigation.js |
| packages/audit/scripts/audit-css-ownership.js | ../FlowDocs/apps/docs/gold-final-keep-component-demos.js | ../FlowDocs/apps/docs/gold-final-keep-component-demos.js |
| packages/audit/scripts/audit-css-ownership.js | ../FlowDocs/apps/docs/styles/05q-final-keep-components-docs.css | ../FlowDocs/apps/docs/styles/05q-final-keep-components-docs.css |
| packages/audit/scripts/audit-template-composition.js | ../FlowDocs/apps/docs/pattern-shell-renderers.js | ../FlowDocs/apps/docs/pattern-shell-renderers.js |

## Next Iteration

Iteration 4: Fuente De Verdad De Contenido. Decide which FlowDocs content files are source, generated bundle, orphan, or legacy before deleting/migrating files.

