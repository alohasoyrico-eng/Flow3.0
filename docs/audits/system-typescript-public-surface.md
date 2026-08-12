# System TypeScript public surface

Generated: 2026-08-12

This is a baseline report for P0.2 TypeScript remediation. It does not migrate files.

## Summary

- Public export targets: 580
- Unique public export targets: 298
- Public JS runtime exports: 280
- Unique public JS runtime export targets: 140
- Public JS runtime exports with TS/TSX source: 14
- Source declarations paired with JS but not TS/TSX: 134
- TypeScript surface debt: 414
- Unique TypeScript surface debt: 274

## File Counts

- By extension: {".js":588,".mjs":20,".ts":103,".d.ts":274}
- By area: {"script":251,"source":451,"test":8,"generated-dist":275}

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
| package.json | packages/react/dist/Avatar.js | no |
| package.json | packages/react/dist/Badge.js | no |
| package.json | packages/react/dist/BiometricPrompt.js | no |
| package.json | packages/react/dist/Breadcrumbs.js | no |
| package.json | packages/react/dist/Button.js | no |
| package.json | packages/react/dist/Card.js | no |
| package.json | packages/react/dist/CardExpiryInput.js | no |
| package.json | packages/react/dist/CardNumberInput.js | no |
| package.json | packages/react/dist/CardSecurityCodeInput.js | no |
| package.json | packages/react/dist/CardSummary.js | no |
| package.json | packages/react/dist/ChartPanel.js | no |
| package.json | packages/react/dist/ChatComposer.js | no |
| package.json | packages/react/dist/ChatMessage.js | no |
| package.json | packages/react/dist/ChatThread.js | no |
| package.json | packages/react/dist/Checkbox.js | no |
| package.json | packages/react/dist/Chip.js | no |
| package.json | packages/react/dist/CodeInput.js | no |
| package.json | packages/react/dist/Combobox.js | no |
| package.json | packages/react/dist/CountrySelector.js | no |
| package.json | packages/react/dist/DatePicker.js | no |
| package.json | packages/react/dist/DateRangePicker.js | no |
| package.json | packages/react/dist/Dialog.js | no |
| package.json | packages/react/dist/Drawer.js | no |
| package.json | packages/react/dist/EmptyState.js | no |
| package.json | packages/react/dist/ErrorPanel.js | no |
| package.json | packages/react/dist/FloatingActionButton.js | no |
| package.json | packages/react/dist/IconButton.js | no |
| package.json | packages/react/dist/InlineValidation.js | no |
| package.json | packages/react/dist/Input.js | no |
| package.json | packages/react/dist/InputAmount.js | no |
| package.json | packages/react/dist/KpiTile.js | no |
| package.json | packages/react/dist/List.js | no |
| package.json | packages/react/dist/Menu.js | no |
| package.json | packages/react/dist/MotionBoundary.js | no |
| package.json | packages/react/dist/MovementRow.js | no |
| package.json | packages/react/dist/Pagination.js | no |
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
| packages/react/src/Avatar.d.ts | yes | no |
| packages/react/src/Badge.d.ts | yes | no |
| packages/react/src/BiometricPrompt.d.ts | yes | no |
| packages/react/src/Breadcrumbs.d.ts | yes | no |
| packages/react/src/Button.d.ts | yes | no |
| packages/react/src/Card.d.ts | yes | no |
| packages/react/src/CardExpiryInput.d.ts | yes | no |
| packages/react/src/CardNumberInput.d.ts | yes | no |
| packages/react/src/CardSecurityCodeInput.d.ts | yes | no |
| packages/react/src/CardSummary.d.ts | yes | no |
| packages/react/src/ChartPanel.d.ts | yes | no |
| packages/react/src/ChatComposer.d.ts | yes | no |
| packages/react/src/ChatMessage.d.ts | yes | no |
| packages/react/src/ChatThread.d.ts | yes | no |
| packages/react/src/Checkbox.d.ts | yes | no |
| packages/react/src/Chip.d.ts | yes | no |
| packages/react/src/CodeInput.d.ts | yes | no |
| packages/react/src/Combobox.d.ts | yes | no |
| packages/react/src/CountrySelector.d.ts | yes | no |
| packages/react/src/DatePicker.d.ts | yes | no |
| packages/react/src/DateRangePicker.d.ts | yes | no |
| packages/react/src/Dialog.d.ts | yes | no |
| packages/react/src/Drawer.d.ts | yes | no |
| packages/react/src/EmptyState.d.ts | yes | no |
| packages/react/src/ErrorPanel.d.ts | yes | no |
| packages/react/src/FloatingActionButton.d.ts | yes | no |
| packages/react/src/IconButton.d.ts | yes | no |
| packages/react/src/InlineValidation.d.ts | yes | no |
| packages/react/src/Input.d.ts | yes | no |
| packages/react/src/InputAmount.d.ts | yes | no |
| packages/react/src/KpiTile.d.ts | yes | no |
| packages/react/src/List.d.ts | yes | no |
| packages/react/src/Menu.d.ts | yes | no |
| packages/react/src/MotionBoundary.d.ts | yes | no |
| packages/react/src/MovementRow.d.ts | yes | no |
| packages/react/src/Pagination.d.ts | yes | no |
| packages/react/src/PhoneInput.d.ts | yes | no |
| packages/react/src/Popover.d.ts | yes | no |
| packages/react/src/ProgressIndicator.d.ts | yes | no |
| packages/react/src/QuickAction.d.ts | yes | no |
| packages/react/src/RadioButton.d.ts | yes | no |
| packages/react/src/RouteSummary.d.ts | yes | no |
| packages/react/src/SegmentedControl.d.ts | yes | no |
| packages/react/src/Select.d.ts | yes | no |
| packages/react/src/Skeleton.d.ts | yes | no |
| packages/react/src/Slider.d.ts | yes | no |
| packages/react/src/Spinner.d.ts | yes | no |
| packages/react/src/StationPin.d.ts | yes | no |
| packages/react/src/Stepper.d.ts | yes | no |
| packages/react/src/Surface.d.ts | yes | no |
| packages/react/src/Switch.d.ts | yes | no |
| packages/react/src/Table.d.ts | yes | no |
| packages/react/src/Tabs.d.ts | yes | no |
| packages/react/src/Tag.d.ts | yes | no |
| packages/react/src/TextArea.d.ts | yes | no |
| packages/react/src/Toast.d.ts | yes | no |
| packages/react/src/Tooltip.d.ts | yes | no |
| packages/react/src/TreeView.d.ts | yes | no |
| packages/react/src/index.d.ts | yes | no |
| packages/react/src/internal/props.d.ts | yes | no |
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

## Interpretation

A public runtime export is not considered TypeScript-real when it points to JS and the maintained source is not TS/TSX. Generated .d.ts files are useful for consumers, but they are not a substitute for typed implementation source.
