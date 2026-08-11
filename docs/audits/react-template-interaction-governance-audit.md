# React template interaction governance audit

Status: pass

## Inventory

- templatesAudited: 9
- sourceFiles: 9
- typeFiles: 9
- interactionTestFiles: 1
- packageTestScriptReferences: 1
- templatesWithPassingInteractionContracts: 9
- uncontrolledSelectionCases: 9
- controlledSelectionCases: 9
- drawerCloseCases: 4
- templatesWithSelectionState: 9
- templatesWithSelectionCallbacks: 9
- templatesWithControlledSelectionGuard: 9
- templatesWithDrawerCallbacks: 4
- templatesWithControlledDrawerGuard: 4
- testSelectorAssertions: 9
- testMutationGuards: 9
- docsRuntimeReferences: 0
- vanillaDomReferences: 0
- interactionContractGaps: 0
- reactTemplateInteractionGovernanceDebt: 0

## Templates

| Template | Selection | Callback | Drawer | Status |
| --- | --- | --- | --- | --- |
| settings-workspace | selectedSection/defaultSelectedSection | onSelectedSectionChange | n/a | pass |
| internal-operations-console | selectedModule/defaultSelectedModule | onSelectedModuleChange | controlled | pass |
| agent-workspace | selectedConversation/defaultSelectedConversation | onSelectedConversationChange | n/a | pass |
| configuration-console | selectedModule/defaultSelectedModule | onSelectedModuleChange | controlled | pass |
| driver-card-wallet | selectedSection/defaultSelectedSection | onSelectedSectionChange | n/a | pass |
| driver-mobile-app | selectedTab/defaultSelectedTab | onSelectedTabChange | n/a | pass |
| fleet-dashboard-suite | selectedDashboard/defaultSelectedDashboard | onSelectedDashboardChange | controlled | pass |
| fleet-manager-desktop | selectedDashboard/defaultSelectedDashboard | onSelectedDashboardChange | controlled | pass |
| routes-and-stations | selectedStationKey/defaultSelectedStationKey | onSelectedStationChange | n/a | pass |

## Issues

- None.

