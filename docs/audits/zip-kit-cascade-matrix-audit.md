# ZIP kit cascade matrix audit

Status: pass

Every ZIP kit must resolve detected UI references into Flow foundations, primitives, components, patterns, templates, or an explicit separate channel without creating a parallel cascade.

## Inventory

- kits: 16
- zipPaths: 40
- zipComponentReferences: 329
- uniqueZipComponentReferences: 58
- foundationOwnerLinks: 74
- primitiveOwnerLinks: 73
- componentOwnerLinks: 165
- patternOwnerLinks: 56
- templateOwnerLinks: 13
- kitsWithLayerCoverage: 16
- unresolvedZipReferences: 0
- layerCoverageDebt: 0
- signalMappingDebt: 0
- zipKitCascadeDebt: 0

## Kits

| Kit | Class | Foundations | Primitives | Components | Patterns | Templates | ZIP refs | Unresolved | Issues |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| agent-chat | covered-by-template | 4 | 4 | 14 | 2 | 1 | 11 | 0 | 0 |
| auth | covered-by-pattern | 5 | 4 | 7 | 2 | 0 | 6 | 0 | 0 |
| auth-otp | covered-by-pattern | 4 | 3 | 8 | 1 | 0 | 10 | 0 | 0 |
| config | covered-by-template | 5 | 5 | 17 | 5 | 1 | 18 | 0 | 0 |
| dashboards | covered-by-template | 5 | 5 | 15 | 6 | 1 | 25 | 0 | 0 |
| drivers-app | covered-by-template | 4 | 5 | 11 | 3 | 1 | 10 | 0 | 0 |
| fleet-dashboard | covered-by-template | 5 | 5 | 22 | 8 | 2 | 27 | 0 | 0 |
| internal-tools | covered-by-template | 5 | 4 | 14 | 10 | 1 | 18 | 0 | 0 |
| mailings | covered-separate-channel | 11 | 9 | 0 | 1 | 0 | 0 | 0 | 0 |
| ios-frame | blocked-separate-channel | 2 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| onboarding-driver | covered-by-pattern | 4 | 4 | 11 | 3 | 1 | 12 | 0 | 0 |
| onboarding-fm | covered-by-template | 4 | 4 | 10 | 3 | 1 | 12 | 0 | 0 |
| rutas | covered-by-template | 4 | 5 | 7 | 3 | 1 | 7 | 0 | 0 |
| settings | covered-by-template | 4 | 5 | 11 | 4 | 1 | 13 | 0 | 0 |
| wallet | covered-by-template | 4 | 4 | 8 | 3 | 1 | 9 | 0 | 0 |
| wizard | covered-by-pattern | 4 | 4 | 10 | 2 | 1 | 13 | 0 | 0 |

## Issues

- None.

