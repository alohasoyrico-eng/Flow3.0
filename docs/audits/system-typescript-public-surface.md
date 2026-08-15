# System TypeScript public surface

Generated: 2026-08-12

This is a baseline report for P0.2 TypeScript remediation. It does not migrate files.

## Summary

- Public export targets: 658
- Unique public export targets: 337
- Public JS runtime exports: 318
- Unique public JS runtime export targets: 159
- Public JS runtime exports with TS/TSX source: 318
- Public JS runtime exports without TS/TSX source: 0
- Source declarations paired with JS but not TS/TSX: 0
- TypeScript surface debt: 0
- Unique TypeScript surface debt: 0

## File Counts

- By extension: {".js":684,".mjs":23,".ts":195,".d.ts":312,".tsx":63}
- By area: {"script":307,"source":646,"test":11,"generated-dist":313}

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

## Public JS Runtime Exports Without TS Source

| Package | Target |
| --- | --- |
| None | None |

## Source Declarations Without TS Source

| Declaration | Paired JS | Paired TS/TSX |
| --- | --- | --- |
| None | None | None |

## Interpretation

A public runtime export is not considered TypeScript-real when it points to JS and the maintained source is not TS/TSX. Generated .d.ts files are useful for consumers, but they are not a substitute for typed implementation source.
