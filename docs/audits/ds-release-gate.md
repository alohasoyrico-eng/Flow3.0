# DS Release Gate

Status: **pass**

Decision: **Flow core is releasable by package/runtime gates; FlowDocs remains separately audited.**

This gate is authoritative for Flow Design System core release readiness. It must not certify FlowDocs layout, visual parity, legacy HTML slots, or documentation shell remediation.

## Checks

| Check | Status | Command | Owns |
| --- | --- | --- | --- |
| ds-qa-topology | pass | node packages/audit/scripts/report-ds-qa-topology.js | fast/release/deep/quarantine QA lanes and release test boundary |
| flow-core-contracts | pass | npm run audit:flow-core-gate | architecture, package API, CSS namespace/contracts, tokens, specs, React primary contracts, accessibility policy |
| react-production-readiness | pass | node packages/audit/scripts/report-react-production-readiness.js | public React component inventory, contracts, exports, test evidence, readiness status |
| react-interaction-coverage | pass | node packages/audit/scripts/report-react-interaction-coverage.js | callbacks, event parameters, required keyboard behavior, required state semantics |
| component-artifact-tests | pass | node packages/audit/scripts/report-system-component-artifact-tests.js | per-component artifact test coverage |
| component-runtime | pass | node packages/audit/scripts/report-system-component-runtime-audit.js | component runtime evidence independent from FlowDocs pages |
| public-runtime-boundary | pass | node packages/audit/scripts/report-system-public-runtime-boundary.js | public runtime artifact boundary |
| consumer-runtime-smoke | pass | node packages/audit/scripts/report-system-consumer-runtime-smoke.js | clean consumer app React render smoke |
| consumer-css-token-cascade | pass | node packages/audit/scripts/report-system-consumer-css-token-cascade.js | clean consumer CSS and token cascade |
| consumer-type-smoke | pass | node packages/audit/scripts/report-system-consumer-type-smoke.js | clean consumer TypeScript/import smoke |
| consumer-install | pass | node packages/audit/scripts/audit-consumer-install.mjs | installable package boundary in an isolated consumer |

## FlowDocs Boundary

- FlowDocs consumer checks live in `npm run audit:flowdocs-consumer-gate`.
- FlowDocs visual/layout/template debt is not allowed to block this DS release gate unless package imports, generated package APIs, examples, or consumer installation are false.
- Forbidden FlowDocs targets in this gate: ../FlowDocs, FlowDocs/apps/docs, apps/docs/index.html, audit:flowdocs, validate:docs

_No forbidden FlowDocs targets are part of this gate._

## Test Boundary

- React package test command excludes unstable legacy monolith: yes
- Legacy interaction quarantine command exists: yes
- Legacy command: `node test/interaction.test.mjs`

## Failures

- None
