# System TypeScript public surface

Generated: 2026-08-12

This is a baseline report for P0.2 TypeScript remediation. It does not migrate files.

## Summary

- Public export targets: 580
- Unique public export targets: 298
- Public JS runtime exports: 280
- Unique public JS runtime export targets: 140
- Public JS runtime exports with TS/TSX source: 86
- Source declarations paired with JS but not TS/TSX: 97
- TypeScript surface debt: 377
- Unique TypeScript surface debt: 237

## File Counts

- By extension: {".js":598,".mjs":20,".ts":104,".d.ts":274,".tsx":36}
- By area: {"script":261,"source":488,"test":8,"generated-dist":275}

## Public JS Runtime Exports

| Package | Target | TS/TSX source |
| --- | --- | --- |
| package.json | packages/components/src/index.js | yes |
| package.json | packages/components/src/contracts.js | yes |
| package.json | packages/components/src/platforms/index.js | yes |
| package.json | packages/react/dist/index.js | no |
| package.json | packages/react/dist/Accordion.js | no |
| package.json | packages/react/dist/AnimatedMoment.js | no |
| package.json | packages/react/dist/AuditEvent.js | no |
| package.json | packages/react/dist/Avatar.js | yes |
| package.json | packages/react/dist/Badge.js | yes |
| package.json | packages/react/dist/BiometricPrompt.js | no |
| package.json | packages/react/dist/Breadcrumbs.js | yes |
| package.json | packages/react/dist/Button.js | yes |
| package.json | packages/react/dist/Card.js | yes |
| package.json | packages/react/dist/CardExpiryInput.js | yes |
| package.json | packages/react/dist/CardNumberInput.js | yes |
| package.json | packages/react/dist/CardSecurityCodeInput.js | yes |
| package.json | packages/react/dist/CardSummary.js | no |
| package.json | packages/react/dist/ChartPanel.js | no |
| package.json | packages/react/dist/ChatComposer.js | yes |
| package.json | packages/react/dist/ChatMessage.js | yes |
| package.json | packages/react/dist/ChatThread.js | yes |
| package.json | packages/react/dist/Checkbox.js | yes |
| package.json | packages/react/dist/Chip.js | yes |
| package.json | packages/react/dist/CodeInput.js | no |
| package.json | packages/react/dist/Combobox.js | yes |
| package.json | packages/react/dist/CountrySelector.js | no |
| package.json | packages/react/dist/DatePicker.js | yes |
| package.json | packages/react/dist/DateRangePicker.js | yes |
| package.json | packages/react/dist/Dialog.js | yes |
| package.json | packages/react/dist/Drawer.js | yes |
| package.json | packages/react/dist/EmptyState.js | no |
| package.json | packages/react/dist/ErrorPanel.js | no |
| package.json | packages/react/dist/FloatingActionButton.js | no |
| package.json | packages/react/dist/IconButton.js | yes |
| package.json | packages/react/dist/InlineValidation.js | no |
| package.json | packages/react/dist/Input.js | yes |
| package.json | packages/react/dist/InputAmount.js | no |
| package.json | packages/react/dist/KpiTile.js | no |
| package.json | packages/react/dist/List.js | no |
| package.json | packages/react/dist/Menu.js | yes |
| package.json | packages/react/dist/MotionBoundary.js | no |
| package.json | packages/react/dist/MovementRow.js | no |
| package.json | packages/react/dist/Pagination.js | yes |
| package.json | packages/react/dist/patterns/index.js | no |
| package.json | packages/react/dist/patterns/AccountOperations.js | no |
| package.json | packages/react/dist/patterns/ActionSheet.js | no |
| package.json | packages/react/dist/patterns/BottomSheet.js | no |
| package.json | packages/react/dist/patterns/AdvancedFilters.js | no |
| package.json | packages/react/dist/patterns/AgentConversation.js | no |
| package.json | packages/react/dist/patterns/AuthenticationLoginBiometricsAndOtp.js | no |
| package.json | packages/react/dist/patterns/Autocomplete.js | no |
| package.json | packages/react/dist/patterns/AvatarGroup.js | no |
| package.json | packages/react/dist/patterns/AvatarMenu.js | no |
| package.json | packages/react/dist/patterns/BackofficeApproval.js | no |
| package.json | packages/react/dist/patterns/BulkActions.js | no |
| package.json | packages/react/dist/patterns/CalendarView.js | no |
| package.json | packages/react/dist/patterns/CaseManagement.js | no |
| package.json | packages/react/dist/patterns/ChartWrapper.js | no |
| package.json | packages/react/dist/patterns/ChartLegendItem.js | no |
| package.json | packages/react/dist/patterns/CheckboxGroup.js | no |
| package.json | packages/react/dist/patterns/ColumnConfigurator.js | no |
| package.json | packages/react/dist/patterns/CommandPalette.js | no |
| package.json | packages/react/dist/patterns/ConfirmationDialog.js | no |
| package.json | packages/react/dist/patterns/DenseOperationalList.js | no |
| package.json | packages/react/dist/patterns/DragSortableList.js | no |
| package.json | packages/react/dist/patterns/DrawerAdapter.js | no |
| package.json | packages/react/dist/patterns/DriverAndVehicleAdministration.js | no |
| package.json | packages/react/dist/patterns/DriverOnboardingMobile.js | no |
| package.json | packages/react/dist/patterns/EmailTemplateLayout.js | no |
| package.json | packages/react/dist/patterns/ExpandableDetailTable.js | no |
| package.json | packages/react/dist/patterns/FileUpload.js | no |
| package.json | packages/react/dist/patterns/FilterChipGroup.js | no |
| package.json | packages/react/dist/patterns/FilterableEditableTable.js | no |
| package.json | packages/react/dist/patterns/FleetManagerOnboardingDesktop.js | no |
| package.json | packages/react/dist/patterns/FormSection.js | no |
| package.json | packages/react/dist/patterns/FullscreenSheet.js | no |
| package.json | packages/react/dist/patterns/GanttChart.js | no |
| package.json | packages/react/dist/patterns/HelpCenter.js | no |
| package.json | packages/react/dist/patterns/KanbanBoard.js | no |
| package.json | packages/react/dist/patterns/KpiCard.js | no |

## Source Declarations Without TS Source

| Declaration | Paired JS | Paired TS/TSX |
| --- | --- | --- |
| packages/react/src/Accordion.d.ts | yes | no |
| packages/react/src/AnimatedMoment.d.ts | yes | no |
| packages/react/src/AuditEvent.d.ts | yes | no |
| packages/react/src/BiometricPrompt.d.ts | yes | no |
| packages/react/src/CardSummary.d.ts | yes | no |
| packages/react/src/ChartPanel.d.ts | yes | no |
| packages/react/src/CodeInput.d.ts | yes | no |
| packages/react/src/CountrySelector.d.ts | yes | no |
| packages/react/src/EmptyState.d.ts | yes | no |
| packages/react/src/ErrorPanel.d.ts | yes | no |
| packages/react/src/FloatingActionButton.d.ts | yes | no |
| packages/react/src/InlineValidation.d.ts | yes | no |
| packages/react/src/InputAmount.d.ts | yes | no |
| packages/react/src/KpiTile.d.ts | yes | no |
| packages/react/src/List.d.ts | yes | no |
| packages/react/src/MotionBoundary.d.ts | yes | no |
| packages/react/src/MovementRow.d.ts | yes | no |
| packages/react/src/PhoneInput.d.ts | yes | no |
| packages/react/src/QuickAction.d.ts | yes | no |
| packages/react/src/RouteSummary.d.ts | yes | no |
| packages/react/src/StationPin.d.ts | yes | no |
| packages/react/src/Stepper.d.ts | yes | no |
| packages/react/src/Toast.d.ts | yes | no |
| packages/react/src/Tooltip.d.ts | yes | no |
| packages/react/src/TreeView.d.ts | yes | no |
| packages/react/src/index.d.ts | yes | no |
| packages/react/src/patterns/AccountOperations.d.ts | yes | no |
| packages/react/src/patterns/ActionSheet.d.ts | yes | no |
| packages/react/src/patterns/AdvancedFilters.d.ts | yes | no |
| packages/react/src/patterns/AgentConversation.d.ts | yes | no |
| packages/react/src/patterns/AuthenticationLoginBiometricsAndOtp.d.ts | yes | no |
| packages/react/src/patterns/Autocomplete.d.ts | yes | no |
| packages/react/src/patterns/AvatarGroup.d.ts | yes | no |
| packages/react/src/patterns/AvatarMenu.d.ts | yes | no |
| packages/react/src/patterns/BackofficeApproval.d.ts | yes | no |
| packages/react/src/patterns/BottomSheet.d.ts | yes | no |
| packages/react/src/patterns/BulkActions.d.ts | yes | no |
| packages/react/src/patterns/CalendarView.d.ts | yes | no |
| packages/react/src/patterns/CaseManagement.d.ts | yes | no |
| packages/react/src/patterns/ChartLegendItem.d.ts | yes | no |
| packages/react/src/patterns/ChartWrapper.d.ts | yes | no |
| packages/react/src/patterns/CheckboxGroup.d.ts | yes | no |
| packages/react/src/patterns/ColumnConfigurator.d.ts | yes | no |
| packages/react/src/patterns/CommandPalette.d.ts | yes | no |
| packages/react/src/patterns/ConfirmationDialog.d.ts | yes | no |
| packages/react/src/patterns/DenseOperationalList.d.ts | yes | no |
| packages/react/src/patterns/DragSortableList.d.ts | yes | no |
| packages/react/src/patterns/DrawerAdapter.d.ts | yes | no |
| packages/react/src/patterns/DriverAndVehicleAdministration.d.ts | yes | no |
| packages/react/src/patterns/DriverOnboardingMobile.d.ts | yes | no |
| packages/react/src/patterns/EmailTemplateLayout.d.ts | yes | no |
| packages/react/src/patterns/ExpandableDetailTable.d.ts | yes | no |
| packages/react/src/patterns/FileUpload.d.ts | yes | no |
| packages/react/src/patterns/FilterChipGroup.d.ts | yes | no |
| packages/react/src/patterns/FilterableEditableTable.d.ts | yes | no |
| packages/react/src/patterns/FleetManagerOnboardingDesktop.d.ts | yes | no |
| packages/react/src/patterns/FormSection.d.ts | yes | no |
| packages/react/src/patterns/FullscreenSheet.d.ts | yes | no |
| packages/react/src/patterns/GanttChart.d.ts | yes | no |
| packages/react/src/patterns/HelpCenter.d.ts | yes | no |
| packages/react/src/patterns/KanbanBoard.d.ts | yes | no |
| packages/react/src/patterns/KpiCard.d.ts | yes | no |
| packages/react/src/patterns/MultiSelect.d.ts | yes | no |
| packages/react/src/patterns/MultiStepForm.d.ts | yes | no |
| packages/react/src/patterns/NotificationPanel.d.ts | yes | no |
| packages/react/src/patterns/PaymentForm.d.ts | yes | no |
| packages/react/src/patterns/PolarChart.d.ts | yes | no |
| packages/react/src/patterns/PreferenceManagement.d.ts | yes | no |
| packages/react/src/patterns/PricingOperations.d.ts | yes | no |
| packages/react/src/patterns/PullToRefresh.d.ts | yes | no |
| packages/react/src/patterns/QuickActionsGrid.d.ts | yes | no |
| packages/react/src/patterns/RadioGroup.d.ts | yes | no |
| packages/react/src/patterns/RolesAndPermissions.d.ts | yes | no |
| packages/react/src/patterns/SectionHeader.d.ts | yes | no |
| packages/react/src/patterns/SelectOptionLayer.d.ts | yes | no |
| packages/react/src/patterns/Settings.d.ts | yes | no |
| packages/react/src/patterns/SnackbarProvider.d.ts | yes | no |
| packages/react/src/patterns/StationDiscovery.d.ts | yes | no |
| packages/react/src/patterns/StatusFeedbackView.d.ts | yes | no |
| packages/react/src/patterns/SwipeActions.d.ts | yes | no |

## Interpretation

A public runtime export is not considered TypeScript-real when it points to JS and the maintained source is not TS/TSX. Generated .d.ts files are useful for consumers, but they are not a substitute for typed implementation source.
