# DS QA Topology

Status: **pass**

Decision: **Flow React QA is split into fast, release, deep, and quarantine lanes; release lanes must stay deterministic and executable.**

## Levels

| Level | Root command | Package command | Intent |
| --- | --- | --- | --- |
| fast | npm run test:react:fast | npm run test:fast --workspace @design-system/react | frequent P0 feedback; full fast validation is npm run validate:flow-core:fast |
| release | npm run test:react:release | npm run test:release --workspace @design-system/react | deterministic release evidence |
| deep | npm run test:react:deep | npm run test:deep --workspace @design-system/react | stable extended evidence |
| quarantine | npm run test:react:quarantine | npm run test:quarantine --workspace @design-system/react | known unstable legacy evidence |

## Rules

- Fast tests cover critical P0 runtime evidence and must stay cheap enough for frequent local runs.
- Release tests cover the full granular React suite and must exclude unstable legacy monoliths.
- React test files above 1200 lines are hard-fail monolith debt and must be split into smaller governed suites.
- Deep tests may grow beyond release only when they remain deterministic.
- Quarantine tests are explicit debt and cannot be part of validate:flow-core.
- validate:flow-core is the DS release gate and must run test:react:release.
- Performance measurement is explicit via audit:ds-qa-performance and must not be nested inside release gates.

## Monolith Candidates

| File | Lines | Lanes | Status |
| --- | ---: | --- | --- |
| None | 0 | None | pass |

## Issues

- None
