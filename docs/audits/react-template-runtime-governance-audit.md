# React Template Runtime Governance Audit

Status: pass

React templates must prove runtime cascade from Surface roots through governed pattern slots without FlowDocs, DOM vanilla, direct component reimplementation, or escaped style/HTML props.

## Inventory

- templatesAudited: 9
- renderCases: 72
- passingRenderCases: 72
- sourceFiles: 9
- typeFiles: 9
- sourceContractChecks: 128
- typeContractChecks: 114
- surfaceRootTemplates: 9
- templatesWithControlledPrimarySelection: 9
- templatesWithControlledDrawer: 4
- templateSlotAssertions: 24
- templateModuleAssertions: 40
- childPatternAssertions: 24
- uniqueChildPatternAssertions: 15
- childComponentAssertions: 6
- uniqueChildComponentAssertions: 6
- densityCases: 3
- stateCases: 7
- docsRuntimeReferences: 0
- vanillaDomReferences: 0
- forbiddenDirectComponentImports: 0
- forbiddenMarkupFindings: 0
- exportGaps: 0
- typeContractGaps: 0
- reactTemplateRuntimeGovernanceDebt: 0

## Render Cases

| Template | Case | Status | State | Density | Selection | Density markers |
| --- | --- | --- | --- | --- | --- | --- |
| settings-workspace | loaded-sm-controlled | pass | loaded | sm | notifications | 33 |
| settings-workspace | loading-md | pass | loading | md | profile | 34 |
| settings-workspace | empty-md | pass | loaded | md | profile | 33 |
| settings-workspace | permission-lg | pass | permission | lg | profile | 33 |
| settings-workspace | error-sm | pass | error | sm | profile | 33 |
| settings-workspace | offline-md | pass | offline | md | profile | 33 |
| settings-workspace | disabled-lg | pass | disabled | lg | profile | 33 |
| settings-workspace | uncontrolled-default | pass | dirty | md | theme | 33 |
| internal-operations-console | loaded-sm-controlled | pass | loaded | sm | tickets | 70 |
| internal-operations-console | loading-md | pass | loading | md | cases | 66 |
| internal-operations-console | empty-md | pass | empty | md | cases | 66 |
| internal-operations-console | permission-lg | pass | permission | lg | cases | 63 |
| internal-operations-console | error-sm | pass | error | sm | cases | 66 |
| internal-operations-console | offline-md | pass | offline | md | cases | 66 |
| internal-operations-console | disabled-lg | pass | disabled | lg | cases | 61 |
| internal-operations-console | uncontrolled-default | pass | loaded | md | pricing | 70 |
| agent-workspace | loaded-sm-controlled | pass | loaded | sm | route-help | 26 |
| agent-workspace | loading-md | pass | loading | md | handoff | 24 |
| agent-workspace | empty-md | pass | empty | md | handoff | 26 |
| agent-workspace | permission-lg | pass | permission | lg | handoff | 23 |
| agent-workspace | error-sm | pass | error | sm | handoff | 22 |
| agent-workspace | offline-md | pass | offline | md | handoff | 22 |
| agent-workspace | disabled-lg | pass | disabled | lg | handoff | 22 |
| agent-workspace | uncontrolled-default | pass | handoff | md | receipt | 26 |
| configuration-console | loaded-sm-controlled | pass | loaded | sm | drivers | 60 |
| configuration-console | loading-md | pass | loading | md | permissions | 50 |
| configuration-console | empty-md | pass | empty | md | permissions | 56 |
| configuration-console | permission-lg-with-authentication | pass | permission | lg | permissions | 59 |
| configuration-console | error-sm | pass | error | sm | permissions | 48 |
| configuration-console | offline-md | pass | offline | md | permissions | 48 |
| configuration-console | disabled-lg | pass | disabled | lg | permissions | 56 |
| configuration-console | uncontrolled-default | pass | loaded | md | vehicles | 60 |
| driver-card-wallet | loaded-sm-controlled | pass | loaded | sm | movements | 14 |
| driver-card-wallet | loading-md | pass | loading | md | card | 17 |
| driver-card-wallet | empty-md | pass | empty | md | card | 14 |
| driver-card-wallet | permission-lg | pass | permission | lg | card | 14 |
| driver-card-wallet | error-sm | pass | error | sm | card | 14 |
| driver-card-wallet | offline-md | pass | offline | md | card | 14 |
| driver-card-wallet | disabled-lg | pass | disabled | lg | card | 14 |
| driver-card-wallet | uncontrolled-default | pass | loaded | md | help | 14 |
| driver-mobile-app | loaded-sm-controlled | pass | loaded | sm | routes | 29 |
| driver-mobile-app | loading-md | pass | loading | md | home | 32 |
| driver-mobile-app | empty-md | pass | empty | md | home | 29 |
| driver-mobile-app | permission-lg | pass | permission | lg | home | 32 |
| driver-mobile-app | error-sm | pass | error | sm | home | 29 |
| driver-mobile-app | offline-md | pass | offline | md | home | 29 |
| driver-mobile-app | disabled-lg | pass | disabled | lg | home | 29 |
| driver-mobile-app | uncontrolled-default | pass | loaded | md | support | 29 |
| routes-and-stations | loaded-sm-controlled | pass | loaded | sm | industrial | 20 |
| routes-and-stations | loading-md | pass | loading | md | centro | 21 |
| routes-and-stations | empty-md | pass | empty | md | centro | 22 |
| routes-and-stations | permission-lg | pass | permission | lg | centro | 22 |
| routes-and-stations | error-sm | pass | error | sm | centro | 20 |
| routes-and-stations | offline-md | pass | offline | md | centro | 20 |
| routes-and-stations | disabled-lg | pass | disabled | lg | centro | 20 |
| routes-and-stations | uncontrolled-default | pass | loaded | md | poniente | 20 |
| fleet-dashboard-suite | loaded-sm-controlled | pass | loaded | sm | finance | 37 |
| fleet-dashboard-suite | loading-md | pass | loading | md | overview | 33 |
| fleet-dashboard-suite | empty-md | pass | empty | md | overview | 33 |
| fleet-dashboard-suite | permission-lg | pass | permission | lg | overview | 35 |
| fleet-dashboard-suite | error-sm | pass | error | sm | overview | 33 |
| fleet-dashboard-suite | offline-md | pass | offline | md | overview | 33 |
| fleet-dashboard-suite | disabled-lg | pass | disabled | lg | overview | 33 |
| fleet-dashboard-suite | uncontrolled-default | pass | loaded | md | ev | 37 |
| fleet-manager-desktop | loaded-sm-controlled | pass | loaded | sm | fuel | 45 |
| fleet-manager-desktop | loading-md | pass | loading | md | overview | 41 |
| fleet-manager-desktop | empty-md | pass | empty | md | overview | 41 |
| fleet-manager-desktop | permission-lg | pass | permission | lg | overview | 43 |
| fleet-manager-desktop | error-sm | pass | error | sm | overview | 41 |
| fleet-manager-desktop | offline-md | pass | offline | md | overview | 41 |
| fleet-manager-desktop | disabled-lg | pass | disabled | lg | overview | 41 |
| fleet-manager-desktop | uncontrolled-default | pass | loaded | md | fleet | 45 |

## Gates

- Surface root: required on every template root.
- Slots: global-shell, navigation-region, workspace.
- Modules: every promoted template module must render with data-template-module.
- Patterns: child behavior must come from React patterns, not direct component reimplementation.
- Escape props: style, dangerous HTML, contenteditable, Docs markers, and direct DOM APIs are forbidden.

## Gaps

- None

