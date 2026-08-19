# DS Fast Gate

Status: **pass**

Decision: **Fast DS feedback is green; run validate:flow-core before release.**

This gate is for frequent local/PR feedback. It intentionally excludes consumer install, clean-app smoke, deep runtime reports, FlowDocs, visual parity, and quarantine tests.

## Checks

| Check | Status | Command | Owns | Duration ms |
| --- | --- | --- | --- | ---: |
| ds-qa-topology | pass | node packages/audit/scripts/report-ds-qa-topology.js | QA lane integrity | 34 |
| flow-core-contracts | pass | npm run audit:flow-core-gate | package/spec/token/component/pattern/react contracts | 1219 |
| react-production-readiness | pass | node packages/audit/scripts/report-react-production-readiness.js | React public surface readiness evidence | 143 |
| react-interaction-coverage | pass | node packages/audit/scripts/report-react-interaction-coverage.js | callback, keyboard, and state semantics evidence | 75 |

## Failures

- None
