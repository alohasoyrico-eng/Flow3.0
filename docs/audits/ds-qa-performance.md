# DS QA Performance

Status: **pass**

Decision: **QA lanes are within the current execution budgets.**

This report measures QA execution budgets. It is intentionally separate from `validate:flow-core` so release does not rerun itself just to measure itself.

## Budgets

| Check | Lane | Status | Duration ms | Budget ms | Over budget ms | Command |
| --- | --- | --- | ---: | ---: | ---: | --- |
| test-react-fast | fast | pass | 4452 | 8000 | 0 | npm run test:react:fast |
| audit-ds-fast-gate | fast | pass | 1482 | 5000 | 0 | npm run audit:ds-fast-gate |
| validate-flow-core-fast | fast | pass | 8056 | 15000 | 0 | npm run validate:flow-core:fast |
| test-react-release | release | pass | 18820 | 35000 | 0 | npm run test:react:release |
| audit-ds-release-gate | release | pass | 14957 | 25000 | 0 | npm run audit:ds-release-gate |

## Failures

- None
