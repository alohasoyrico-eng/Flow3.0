# ZIP template parity audit

Status: pass

ZIP ui_kits are product-level references. Each kit must be classified before migration so Flow React templates compose existing foundations, primitives, components, and patterns instead of copying standalone HTML/CSS shells.

## Inventory

- zipKits: 16
- zipScreens: 34
- flowTemplates: 9
- coveredByTemplate: 10
- coveredByPattern: 4
- coveredSeparateChannel: 1
- blockedSeparateChannel: 1
- templateCandidates: 0
- unclassifiedKits: 0
- undeclaredZipFiles: 0
- parityGovernanceDebt: 0

## Kits

| Kit | Classification | Status | Templates | Patterns | Components | Risks | Issues |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| agent-chat | covered-by-template | covered-by-agent-workspace | 1 | 2 | 14 | 5 | 0 |
| auth | covered-by-pattern | absorbed-by-flow | 0 | 2 | 7 | 3 | 0 |
| auth-otp | covered-by-pattern | absorbed-by-flow | 0 | 1 | 8 | 3 | 0 |
| config | covered-by-template | implemented | 1 | 5 | 17 | 3 | 0 |
| dashboards | covered-by-template | implemented | 1 | 6 | 15 | 4 | 0 |
| drivers-app | covered-by-template | implemented | 1 | 3 | 11 | 4 | 0 |
| fleet-dashboard | covered-by-template | implemented | 2 | 8 | 22 | 3 | 0 |
| internal-tools | covered-by-template | covered-by-internal-operations-console | 1 | 10 | 14 | 4 | 0 |
| mailings | covered-separate-channel | covered-by-email-template-layout | 0 | 1 | 0 | 3 | 0 |
| ios-frame | blocked-separate-channel | support-only-platform-frame | 0 | 0 | 0 | 3 | 0 |
| onboarding-driver | covered-by-pattern | absorbed-by-flow | 1 | 3 | 11 | 2 | 0 |
| onboarding-fm | covered-by-template | implemented | 1 | 3 | 10 | 2 | 0 |
| rutas | covered-by-template | implemented | 1 | 3 | 7 | 3 | 0 |
| settings | covered-by-template | covered-by-settings-workspace | 1 | 4 | 11 | 3 | 0 |
| wallet | covered-by-template | implemented | 1 | 3 | 8 | 3 | 0 |
| wizard | covered-by-pattern | absorbed-by-flow | 1 | 2 | 10 | 3 | 0 |

## Template Candidates


## Issues

- None.

