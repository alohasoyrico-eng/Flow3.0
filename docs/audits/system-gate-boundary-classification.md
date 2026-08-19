# System Gate Boundary Classification

Status: pass

## Rules

- The authoritative Flow package release command is npm run validate:flow-core; npm run validate:system is a compatibility alias to that command.
- Generated reports are never canonical source; they are reproducible evidence only.
- Flow core gates must not require FlowDocs renderers unless the gate is explicitly a consumer gate.
- FlowDocs gates may validate consumption of Flow packages but must not define component API, state, token, or accessibility truth.
- Legacy forensic files can inform decisions but must not block current gates unless promoted to an active contract.
- A combined audit may exist only as an aggregator that reports layer status separately.
- Legacy mixed gates may remain for historical coverage but must be marked non-authoritative for Flow core release readiness.

## Layers

### flow-core

- Owner: Flow package source
- Purpose: Validate tokens, specs, package CSS, React source, public exports, runtime install, accessibility, interaction, and component contracts.
- Source of truth: packages/tokens/src/**, packages/tokens/tokens.json, packages/specs/specs/**, packages/components/src/**, packages/components/styles/components.css, packages/react/src/**, packages/react/dist/**, packages/react/test/**
- Allowed generated evidence: docs/audits/react-production-readiness.json, docs/audits/react-interaction-coverage-audit.json
- Scripts: audit-ds-release-gate.js, audit-ds-fast-gate.js, report-ds-qa-performance.js, report-ds-qa-topology.js, audit-consumer-install.mjs, audit-component-css-contracts.js, audit-package-css-contracts.js, audit-density-contracts.js, audit-energy-contracts.js, audit-voice-contracts.js, audit-state-contracts.js, audit-motion-contracts.js, audit-accessibility-contracts.js, audit-react-primary-contract.js, report-react-production-readiness.js, report-react-interaction-coverage.js

### flowdocs-consumer

- Owner: FlowDocs app
- Purpose: Validate FlowDocs as a consumer of Flow, not as package source or generated proof.
- Source of truth: ../FlowDocs/apps/docs/**, packages/content/content/**, packages/react/dist/templates/**
- Allowed generated evidence: ../FlowDocs/apps/docs/generated/docs-content.bundle.json
- Scripts: audit-docs-runtime.mjs, audit-docs-component-demo-ownership.js, audit-docs-content.js, audit-template-composition.js, report-system-phase6-flowdocs-consumer-checkpoint.js

### generated-reports

- Owner: Audit runner
- Purpose: Store reproducible outputs. These files may be checked for freshness but must not be treated as canonical source.
- Source of truth: None
- Allowed generated evidence: docs/audits/component-1to1-quality-matrix.json, docs/audits/react-production-readiness.json, docs/audits/react-interaction-coverage-audit.json, docs/audits/system-debt-ledger.json
- Scripts: report-system-debt-ledger.js, report-system-audit-contract-governance.js, report-system-phase4-component-cascade-checkpoint.js

### legacy-forensics

- Owner: Historical evidence
- Purpose: Preserve prior forensic observations for context only. These files must not gate current readiness without an explicit migration decision.
- Source of truth: None
- Allowed generated evidence: docs/forensics/**
- Scripts: report-system-p0-forensic-detail.js, report-system-p0-owner-decision-matrix.js, report-system-remediation-matrix.js


## Issues

- [info] generated-reports: packages/audit/scripts/audit-integration.js - audit-integration uses component-1to1 generated report validation inside the mixed gate.
- [info] flowdocs-consumer: packages/audit/scripts/audit-integration.js - audit-integration mixes FlowDocs template composition with Flow core validation.
- [info] flowdocs-consumer: packages/audit/scripts/audit-system-scope.js - audit-system-scope includes FlowDocs demo ownership in the system/core scope.
- [info] generated-reports: docs/audits/component-1to1-quality-matrix.json - Generated report exists and must be treated as evidence, not source of truth.
- [info] generated-reports: docs/audits/react-production-readiness.json - Generated report exists and must be treated as evidence, not source of truth.
- [info] generated-reports: docs/audits/react-interaction-coverage-audit.json - Generated report exists and must be treated as evidence, not source of truth.

## Next Iteration

- flowdocs-runtime-inventory: Map FlowDocs files as used, generated, stale, orphan, or unknown.
