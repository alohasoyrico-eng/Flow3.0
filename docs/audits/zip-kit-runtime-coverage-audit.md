# ZIP kit runtime coverage audit

Status: pass

ZIP kits may only be considered absorbed when their Flow owners are covered by React runtime, visual, composition, interaction, or explicit separate-channel renderer audits.

## Inventory

- kits: 16
- productTemplateKits: 10
- patternCoveredKits: 4
- separateChannelKits: 1
- blockedSeparateChannelKits: 1
- templateRuntimeCases: 104
- templateVisualCases: 39
- patternRuntimeRows: 56
- patternCompositionRows: 56
- emailRenderCases: 6
- kitsWithRuntimeCoverage: 16
- runtimeCoverageDebt: 0

## Kits

| Kit | Class | Templates | Patterns | Runtime cases | Visual cases | Pattern rows | Issues |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| agent-chat | covered-by-template | 1 | 2 | 8 | 3 | 2/2 | 0 |
| auth | covered-by-pattern | 0 | 2 | 0 | 0 | 2/2 | 0 |
| auth-otp | covered-by-pattern | 0 | 1 | 0 | 0 | 1/1 | 0 |
| config | covered-by-template | 1 | 5 | 8 | 3 | 5/5 | 0 |
| dashboards | covered-by-template | 1 | 6 | 8 | 3 | 6/6 | 0 |
| drivers-app | covered-by-template | 1 | 3 | 8 | 3 | 3/3 | 0 |
| fleet-dashboard | covered-by-template | 2 | 8 | 16 | 6 | 8/8 | 0 |
| internal-tools | covered-by-template | 1 | 10 | 8 | 3 | 10/10 | 0 |
| mailings | covered-separate-channel | 0 | 1 | 0 | 0 | 1/1 | 0 |
| ios-frame | blocked-separate-channel | 0 | 0 | 0 | 0 | 0/0 | 0 |
| onboarding-driver | covered-by-pattern | 1 | 3 | 8 | 3 | 3/3 | 0 |
| onboarding-fm | covered-by-template | 1 | 3 | 8 | 3 | 3/3 | 0 |
| rutas | covered-by-template | 1 | 3 | 8 | 3 | 3/3 | 0 |
| settings | covered-by-template | 1 | 4 | 8 | 3 | 4/4 | 0 |
| wallet | covered-by-template | 1 | 3 | 8 | 3 | 3/3 | 0 |
| wizard | covered-by-pattern | 1 | 2 | 8 | 3 | 2/2 | 0 |

## Issues

- None.

