# DS Fast Gate

Status: **pass**

Decision: **Fast DS feedback is green; run validate:flow-core before release.**

This gate is for frequent local/PR feedback. It intentionally excludes consumer install, clean-app smoke, FlowDocs, visual parity, and quarantine tests. It includes the bounded runtime checks that protect shared component geometry.

## Checks

| Check | Status | Command | Owns |
| --- | --- | --- | --- |
| ds-qa-topology | pass | node packages/audit/scripts/report-ds-qa-topology.js | QA lane integrity |
| flow-core-contracts | pass | npm run audit:flow-core-gate | package/spec/token/component/pattern/react contracts |
| control-frame-runtime | pass | npm run audit:control-frame-runtime | rendered field/action/navigation frame density geometry |
| choice-frame-runtime | pass | npm run audit:choice-frame-runtime | rendered choice mark/icon density and light/dark geometry |
| icon-button-runtime | pass | npm run audit:icon-button-runtime | rendered icon action target/icon density geometry |
| option-listbox-runtime | pass | npm run audit:option-listbox-runtime | rendered select/combobox/menu option row geometry and states |
| react-production-readiness | pass | node packages/audit/scripts/report-react-production-readiness.js | React public surface readiness evidence |
| react-interaction-coverage | pass | node packages/audit/scripts/report-react-interaction-coverage.js | callback, keyboard, and state semantics evidence |

## Failures

- None
