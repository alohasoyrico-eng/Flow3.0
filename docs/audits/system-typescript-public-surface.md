# System TypeScript public surface

Generated: 2026-08-12

This is a baseline report for P0.2 TypeScript remediation. It does not migrate files.

## Summary

- Public export targets: 580
- Unique public export targets: 298
- Public JS runtime exports: 280
- Unique public JS runtime export targets: 140
- Public JS runtime exports with TS/TSX source: 238
- Source declarations paired with JS but not TS/TSX: 21
- TypeScript surface debt: 301
- Unique TypeScript surface debt: 161

## File Counts

- By extension: {".js":606,".mjs":20,".ts":155,".d.ts":274,".tsx":61}
- By area: {"script":269,"source":564,"test":8,"generated-dist":275}

## Public JS Runtime Exports

| Package | Target | TS/TSX source |
| --- | --- | --- |
| package.json | packages/components/src/index.js | yes |
| package.json | packages/components/src/contracts.js | yes |
| package.json | packages/components/src/platforms/index.js | yes |
| package.json | packages/react/dist/index.js | yes |
| package.json | packages/react/dist/Accordion.js | yes |
| package.json | packages/react/dist/AnimatedMoment.js | yes |
| package.json | packages/react/dist/AuditEvent.js | yes |
| package.json | packages/react/dist/Avatar.js | yes |
| package.json | packages/react/dist/Badge.js | yes |
| package.json | packages/react/dist/BiometricPrompt.js | yes |
| package.json | packages/react/dist/Breadcrumbs.js | yes |
| package.json | packages/react/dist/Button.js | yes |
| package.json | packages/react/dist/Card.js | yes |
| package.json | packages/react/dist/CardExpiryInput.js | yes |
| package.json | packages/react/dist/CardNumberInput.js | yes |
| package.json | packages/react/dist/CardSecurityCodeInput.js | yes |
| package.json | packages/react/dist/CardSummary.js | yes |
| package.json | packages/react/dist/ChartPanel.js | yes |
| package.json | packages/react/dist/ChatComposer.js | yes |
| package.json | packages/react/dist/ChatMessage.js | yes |
| package.json | packages/react/dist/ChatThread.js | yes |
| package.json | packages/react/dist/Checkbox.js | yes |
| package.json | packages/react/dist/Chip.js | yes |
| package.json | packages/react/dist/CodeInput.js | yes |
| package.json | packages/react/dist/Combobox.js | yes |
| package.json | packages/react/dist/CountrySelector.js | yes |
| package.json | packages/react/dist/DatePicker.js | yes |
| package.json | packages/react/dist/DateRangePicker.js | yes |
| package.json | packages/react/dist/Dialog.js | yes |
| package.json | packages/react/dist/Drawer.js | yes |
| package.json | packages/react/dist/EmptyState.js | yes |
| package.json | packages/react/dist/ErrorPanel.js | yes |
| package.json | packages/react/dist/FloatingActionButton.js | yes |
| package.json | packages/react/dist/IconButton.js | yes |
| package.json | packages/react/dist/InlineValidation.js | yes |
| package.json | packages/react/dist/Input.js | yes |
| package.json | packages/react/dist/InputAmount.js | yes |
| package.json | packages/react/dist/KpiTile.js | yes |
| package.json | packages/react/dist/List.js | yes |
| package.json | packages/react/dist/Menu.js | yes |
| package.json | packages/react/dist/MotionBoundary.js | yes |
| package.json | packages/react/dist/MovementRow.js | yes |
| package.json | packages/react/dist/Pagination.js | yes |
| package.json | packages/react/dist/patterns/index.js | yes |
| package.json | packages/react/dist/patterns/AccountOperations.js | yes |
| package.json | packages/react/dist/patterns/ActionSheet.js | yes |
| package.json | packages/react/dist/patterns/BottomSheet.js | yes |
| package.json | packages/react/dist/patterns/AdvancedFilters.js | yes |
| package.json | packages/react/dist/patterns/AgentConversation.js | yes |
| package.json | packages/react/dist/patterns/AuthenticationLoginBiometricsAndOtp.js | yes |
| package.json | packages/react/dist/patterns/Autocomplete.js | yes |
| package.json | packages/react/dist/patterns/AvatarGroup.js | yes |
| package.json | packages/react/dist/patterns/AvatarMenu.js | yes |
| package.json | packages/react/dist/patterns/BackofficeApproval.js | yes |
| package.json | packages/react/dist/patterns/BulkActions.js | yes |
| package.json | packages/react/dist/patterns/CalendarView.js | yes |
| package.json | packages/react/dist/patterns/CaseManagement.js | yes |
| package.json | packages/react/dist/patterns/ChartWrapper.js | yes |
| package.json | packages/react/dist/patterns/ChartLegendItem.js | yes |
| package.json | packages/react/dist/patterns/CheckboxGroup.js | yes |
| package.json | packages/react/dist/patterns/ColumnConfigurator.js | yes |
| package.json | packages/react/dist/patterns/CommandPalette.js | yes |
| package.json | packages/react/dist/patterns/ConfirmationDialog.js | yes |
| package.json | packages/react/dist/patterns/DenseOperationalList.js | yes |
| package.json | packages/react/dist/patterns/DragSortableList.js | yes |
| package.json | packages/react/dist/patterns/DrawerAdapter.js | yes |
| package.json | packages/react/dist/patterns/DriverAndVehicleAdministration.js | yes |
| package.json | packages/react/dist/patterns/DriverOnboardingMobile.js | yes |
| package.json | packages/react/dist/patterns/EmailTemplateLayout.js | yes |
| package.json | packages/react/dist/patterns/ExpandableDetailTable.js | yes |
| package.json | packages/react/dist/patterns/FileUpload.js | yes |
| package.json | packages/react/dist/patterns/FilterChipGroup.js | yes |
| package.json | packages/react/dist/patterns/FilterableEditableTable.js | yes |
| package.json | packages/react/dist/patterns/FleetManagerOnboardingDesktop.js | yes |
| package.json | packages/react/dist/patterns/FormSection.js | yes |
| package.json | packages/react/dist/patterns/FullscreenSheet.js | yes |
| package.json | packages/react/dist/patterns/GanttChart.js | yes |
| package.json | packages/react/dist/patterns/HelpCenter.js | yes |
| package.json | packages/react/dist/patterns/KanbanBoard.js | yes |
| package.json | packages/react/dist/patterns/KpiCard.js | yes |

## Source Declarations Without TS Source

| Declaration | Paired JS | Paired TS/TSX |
| --- | --- | --- |
| packages/react/src/patterns/RolesAndPermissions.d.ts | yes | no |
| packages/react/src/patterns/SelectOptionLayer.d.ts | yes | no |
| packages/react/src/patterns/Settings.d.ts | yes | no |
| packages/react/src/patterns/StationDiscovery.d.ts | yes | no |
| packages/react/src/patterns/StatusFeedbackView.d.ts | yes | no |
| packages/react/src/patterns/SwipeActions.d.ts | yes | no |
| packages/react/src/patterns/TicketQueue.d.ts | yes | no |
| packages/react/src/patterns/Timeline.d.ts | yes | no |
| packages/react/src/patterns/Toolbar.d.ts | yes | no |
| packages/react/src/patterns/TransferList.d.ts | yes | no |
| packages/react/src/patterns/VirtualDataTable.d.ts | yes | no |
| packages/react/src/patterns/WaterfallChart.d.ts | yes | no |
| packages/react/src/templates/AgentWorkspace.d.ts | yes | no |
| packages/react/src/templates/ConfigurationConsole.d.ts | yes | no |
| packages/react/src/templates/DriverCardWallet.d.ts | yes | no |
| packages/react/src/templates/DriverMobileApp.d.ts | yes | no |
| packages/react/src/templates/FleetDashboardSuite.d.ts | yes | no |
| packages/react/src/templates/FleetManagerDesktop.d.ts | yes | no |
| packages/react/src/templates/InternalOperationsConsole.d.ts | yes | no |
| packages/react/src/templates/RoutesAndStations.d.ts | yes | no |
| packages/react/src/templates/SettingsWorkspace.d.ts | yes | no |

## Interpretation

A public runtime export is not considered TypeScript-real when it points to JS and the maintained source is not TS/TSX. Generated .d.ts files are useful for consumers, but they are not a substitute for typed implementation source.
