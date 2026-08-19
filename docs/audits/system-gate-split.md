# System Gate Split

Status: **action_required**

Decision: **ds-release-gate-is-authoritative-legacy-mixed-gates-are-non-authoritative**

## Active Gates

| gate | command | owns | mustNotOwn | status |
| --- | --- | --- | --- | --- |
| DS release | npm run validate:flow-core | Flow package release readiness: build, typecheck, React tests, package/runtime consumer gates | FlowDocs layout remediation, docs visual parity, legacy docs shell debt | authoritative |
| Flow core | npm run audit:flow-core-gate | package/spec/token/component/pattern/react contracts | FlowDocs shell, docs visual parity, ZIP narrative, generated evidence snapshots | active |
| FlowDocs consumer | npm run audit:flowdocs-consumer-gate | FlowDocs runtime graph, shell adapter, template boundary, legacy slot quarantine, consumer contract | component API truth, package readiness, token source truth | active |
| Content source | npm run audit:content-source-gate | package content ownership, generated docs content bundle, editorial copy location | visual parity, shell runtime behavior, component interaction truth | active |
| Forensic/parity | npm run audit:forensic-gate | legacy evidence, stale audit classification, cleanup queues, go/no-go checkpoint | release readiness on its own | advisory |

## Historical / Mixed Gates

| command | file | status | replacement |
| --- | --- | --- | --- |
| npm run audit | packages/audit/scripts/audit-complete.mjs | historical-mixed-non-authoritative | Use npm run validate:flow-core for DS release readiness. |
| npm run audit:complete | packages/audit/scripts/audit-complete.mjs | historical-mixed-non-authoritative | Use npm run validate:flow-core for DS release readiness. |
| node packages/audit/scripts/audit-system.js | packages/audit/scripts/audit-system.js | mixed-top-level | Split into Flow core + FlowDocs consumer + content + forensic gates. |
| node packages/audit/scripts/audit-integration.js | packages/audit/scripts/audit-integration.js | mixed-top-level | Keep package checks in Flow core; move template/parity checks out. |
| npm run audit:system | packages/audit/scripts/audit-system-scope.js | mixed-top-level | Use npm run validate:flow-core for release; use FlowDocs commands only for docs consumer debt. |

## Blockers

| id | evidence | action |
| --- | --- | --- |
| cleanup-still-protected | 49 quarantine candidates and 453 runtime-protected files | Cleanup must follow consumer replacement order. |
