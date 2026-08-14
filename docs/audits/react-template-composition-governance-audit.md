# React template composition governance audit

Status: pass

React templates must derive runtime composition from formal template artifacts: pattern imports, module markers, Surface primitive ownership, and approved direct component exceptions must stay explicit.

## Inventory

- templatesAudited: 17
- templatesWithPassingComposition: 17
- formalPatternDependencies: 60
- runtimePatternImports: 60
- missingDeclaredPatternImports: 0
- undeclaredPatternImports: 0
- formalModuleMarkers: 37
- approvedSupportModuleMarkers: 6
- runtimeModuleMarkers: 43
- missingFormalModuleMarkers: 0
- undeclaredRuntimeModuleMarkers: 0
- directComponentImports: 8
- unapprovedDirectComponentImports: 0
- surfacePrimitiveImports: 17
- compositionContractGaps: 0
- reactTemplateCompositionGovernanceDebt: 0

## Templates

| Template | Patterns | Modules | Support modules | Direct components | Issues |
| --- | ---: | ---: | ---: | ---: | ---: |
| agent-workspace | 3/3 | 5/5 | 0 | 2/4 | 0 |
| component-detail-template | 5/5 | 0/0 | 0 | 0/0 | 0 |
| configuration-console | 5/5 | 5/4 | 1 | 0/0 | 0 |
| docs-artifact-detail-template | 2/2 | 0/0 | 0 | 2/2 | 0 |
| docs-collection-template | 5/5 | 0/0 | 0 | 0/0 | 0 |
| docs-home-template | 4/4 | 0/0 | 0 | 0/0 | 0 |
| docs-shell-template | 5/5 | 0/0 | 0 | 0/0 | 0 |
| driver-card-wallet | 0/0 | 5/4 | 1 | 3/3 | 0 |
| driver-mobile-app | 2/2 | 6/4 | 2 | 0/0 | 0 |
| fleet-dashboard-suite | 2/2 | 4/4 | 0 | 0/0 | 0 |
| fleet-manager-desktop | 3/3 | 5/4 | 1 | 0/0 | 0 |
| internal-operations-console | 8/8 | 6/6 | 0 | 0/0 | 0 |
| pattern-detail-template | 5/5 | 0/0 | 0 | 0/0 | 0 |
| reference-detail-template | 5/5 | 0/0 | 0 | 0/0 | 0 |
| routes-and-stations | 1/1 | 5/4 | 1 | 0/0 | 0 |
| settings-workspace | 1/1 | 2/2 | 0 | 1/1 | 0 |
| template-detail-template | 4/4 | 0/0 | 0 | 0/0 | 0 |

## Issues

- None.

