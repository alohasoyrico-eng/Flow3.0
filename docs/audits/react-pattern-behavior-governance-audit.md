# React Pattern Behavior Governance Audit

Status: **pass**

React patterns must be primary Flow implementations with typed refs, wired events, density cascade, sanitized extensibility, and structural primitive ownership for Surface-backed slots.

## Inventory

| Metric | Value |
| --- | ---: |
| formalPatternArtifacts | 72 |
| patternArchitecturePolicyIssues | 0 |
| forbiddenTypePropPolicy | 5 |
| controlledPropPairPolicy | 10 |
| displayOnlyPropPolicy | 1 |
| inheritedDomPropPolicy | 45 |
| inheritedDomPropPrefixPolicy | 3 |
| accessibilityDelegatingComponentPolicy | 23 |
| patternContractGovernanceGroupPolicy | 8 |
| literalContractPropPolicy | 3 |
| stateCascadeCarrierPropPolicy | 8 |
| patternRuntimeMarkerPolicy | 3 |
| patternContractRequiredHeadingPolicy | 4 |
| implementedReactPatterns | 72 |
| typedPatternDeclarations | 72 |
| forwardRefPatterns | 72 |
| patternsWithRefAttributes | 72 |
| patternsWithDensityProp | 72 |
| flowChildElements | 558 |
| flowChildDensityCascadeIssues | 0 |
| statefulFlowChildElements | 554 |
| directStateCascadeChildren | 527 |
| boundaryStateCascadeChildren | 27 |
| stateCascadeIssues | 0 |
| validatedFlowLiteralProps | 174 |
| flowLiteralContractIssues | 0 |
| validatedFlowChildProps | 2391 |
| flowChildPropContractIssues | 0 |
| callbackPropsDeclared | 272 |
| callbackPropsTested | 272 |
| missingCallbackTests | 0 |
| declaredProps | 213 |
| unusedDeclaredProps | 0 |
| unusedCallbackProps | 0 |
| formalStates | 542 |
| typedStates | 542 |
| statesMissingFromTypes | 0 |
| statesMissingFromArtifact | 0 |
| patternContractStateIssues | 0 |
| patternContractGovernanceIssues | 0 |
| controlledPropPairs | 10 |
| controlledPairIssues | 0 |
| rawGlobalDomRefs | 0 |
| forbiddenPropsDeclared | 0 |
| unsafeRestSpreads | 0 |
| structuralSurfaceSlotPatterns | 29 |
| structuralSurfaceSlots | 29 |
| missingSurfaceSlotMarkers | 0 |
| missingStructuralSurfaceUsage | 0 |
| patternsWithAccessibilityContracts | 69 |
| patternsWithDirectAccessibilitySignals | 71 |
| patternsWithDelegatedAccessibility | 54 |
| missingAccessibilityImplementation | 0 |
| missingDataFlowPattern | 0 |
| patternsWithBehaviorDebt | 0 |
| reactPatternBehaviorDebt | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Unexpected Inventory Metrics

| Metric | Actual |
| --- | ---: |
| None | None |

## Pattern Contract Matrix

| Pattern | Source | forwardRef | RefAttributes | Density prop | Flow children | Density cascade issues | Stateful children | Direct state cascade | Boundary state cascade | State cascade issues | Literal props checked | Literal contract issues | Callback props | Callback tests | Missing callback tests | Unused declared props | Controlled issues | States formal/typed | Missing typed states | Missing artifact states | Contract state issues | Contract governance issues | A11y contract items | Direct a11y signals | Delegated a11y components | Structural Surface slots | Missing Surface slot markers | Missing Surface usage | Debt |
| --- | --- | --- | --- | --- | ---: | --- | ---: | ---: | ---: | --- | ---: | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- |
| account-operations | yes | yes | yes | yes | 6 | None | 6 | 6 | 0 | None | 1 | None | onAccountBulkAction, onAccountFilterRemove, onAccountFiltersReset, onAccountPageChange, onAccountSearchChange, onAccountSelect, onAccountSortChange, onAccountToolbarOverflowSelect, onAuditClear, onAuditEventSelect, onAuditFilterRemove, onDetailAction, onDetailOpenChange | 13/13 | None | None | None | 7/7 | None | None | None | None | 4 | 4 | None | accountOperationsSurface | None | no | None |
| action-sheet | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 4 | None | onAction, onOpenChange, onSelect | 3/3 | None | None | None | 7/7 | None | None | None | None | 3 | 3 | Button, Dialog, List, Menu, Toast | None | None | no | None |
| advanced-filters | yes | yes | yes | yes | 13 | None | 13 | 12 | 1 | None | 3 | None | None | 0/0 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, Drawer, InlineValidation, Input, Menu, Select, Toast | None | None | no | None |
| agent-conversation | yes | yes | yes | yes | 4 | None | 4 | 3 | 1 | None | 0 | None | onAttach, onComposerChange, onFeedbackAction, onHandoffAction, onMessageAction, onSend | 6/6 | None | None | None | 8/8 | None | None | None | None | 4 | 4 | None | conversationSurface | None | no | None |
| artifact-metadata-bar | yes | yes | yes | yes | 6 | None | 6 | 6 | 0 | None | 0 | None | None | 0/0 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, Tooltip | None | None | no | None |
| authentication-login-biometrics-and-otp | yes | yes | yes | yes | 10 | None | 10 | 10 | 0 | None | 0 | None | onRecover, onSubmit | 2/2 | None | None | None | 8/8 | None | None | None | None | 3 | 4 | Button, ErrorPanel, InlineValidation, Input, Toast | surface | None | no | None |
| autocomplete | yes | yes | yes | yes | 5 | None | 5 | 5 | 0 | None | 5 | None | onAction, onOpenChange, onSuggestionSelect, onValueChange | 4/4 | None | None | None | 8/8 | None | None | None | None | 3 | 2 | EmptyState, InlineValidation, List, Skeleton | None | None | no | None |
| avatar-group | yes | yes | yes | yes | 7 | None | 7 | 7 | 0 | None | 3 | None | onAction, onIdentitySelect, onOverflowOpenChange | 3/3 | None | None | None | 7/7 | None | None | None | None | 3 | 2 | Avatar, Button, InlineValidation, List, Popover, Tooltip | None | None | no | None |
| avatar-menu | yes | yes | yes | yes | 2 | None | 2 | 2 | 0 | None | 1 | None | onOpenChange, onSelect | 2/2 | None | None | None | 6/6 | None | None | None | None | 3 | 4 | Avatar, Menu | None | None | no | None |
| backoffice-approval | yes | yes | yes | yes | 6 | None | 6 | 6 | 0 | None | 1 | None | onApprove, onDetailAction, onDetailOpenChange, onDocumentBulkAction, onDocumentFilterRemove, onDocumentFiltersReset, onDocumentPageChange, onDocumentSearchChange, onDocumentSelect, onDocumentSortChange, onFeedbackAction, onReject | 12/12 | None | None | None | 8/8 | None | None | None | None | 4 | 4 | None | backofficeApprovalSurface | None | no | None |
| bottom-sheet | yes | yes | yes | yes | 6 | None | 6 | 6 | 0 | None | 1 | None | onAction, onOpenChange, onSelect | 3/3 | None | None | None | 8/8 | None | None | None | None | 5 | 3 | Button, IconButton, InlineValidation, List | None | None | no | None |
| bulk-actions | yes | yes | yes | yes | 10 | None | 10 | 7 | 3 | None | 4 | None | None | 0/0 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, Checkbox, Dialog, Menu, Table, Toast | None | None | no | None |
| calendar-view | yes | yes | yes | yes | 11 | None | 11 | 11 | 0 | None | 4 | None | onAction, onDateChange, onEventSelect | 3/3 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, EmptyState, List, Popover, Skeleton, Tooltip | None | None | no | None |
| case-management | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 1 | None | onCaseBulkAction, onCaseFilterRemove, onCaseFiltersReset, onCasePageChange, onCaseSearchChange, onCaseSelect, onCaseSortChange, onCaseToolbarOverflowSelect, onDetailAction, onDetailOpenChange, onFeedbackAction, onFilterApply, onFilterDrawerOpenChange, onFilterReset, onSavedFilterSelect, onTimelineClear, onTimelineEventSelect, onTimelineFilterRemove | 18/18 | None | None | None | 8/8 | None | None | None | None | 6 | 4 | None | caseManagementSurface | None | no | None |
| chart-legend-item | yes | yes | yes | yes | 10 | None | 10 | 7 | 3 | None | 2 | None | onAction, onToggle | 2/2 | None | None | None | 6/6 | None | None | None | None | 3 | 3 | Button, Checkbox, Tooltip | legendSurface | None | no | None |
| chart-wrapper | yes | yes | yes | yes | 11 | None | 11 | 10 | 1 | None | 1 | None | onAction | 1/1 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, EmptyState, ErrorPanel, List, Menu, Skeleton, Table | None | None | no | None |
| checkbox-group | yes | yes | yes | yes | 6 | None | 6 | 6 | 0 | None | 2 | None | onApply, onClear, onValueChange | 3/3 | None | None | None | 7/7 | None | None | None | None | 4 | 3 | Button, Checkbox, InlineValidation | groupSurface | None | no | None |
| column-configurator | yes | yes | yes | yes | 10 | None | 10 | 10 | 0 | None | 4 | None | onAction, onClick, onColumnVisibilityChange, onOpenChange | 4/4 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, Checkbox, Dialog, Drawer, InlineValidation, Menu, Table, Toast | None | None | no | None |
| command-palette | yes | yes | yes | yes | 7 | None | 7 | 7 | 0 | None | 4 | None | onAction, onCommandSelect, onOpenChange, onPrimaryAction, onQueryChange | 5/5 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, Dialog, EmptyState, Input, Menu, Toast | None | None | no | None |
| confirmation-dialog | yes | yes | yes | yes | 5 | None | 5 | 4 | 1 | None | 0 | None | onCancel, onConfirm, onOpenChange, onRecoveryAction | 4/4 | None | None | None | 6/6 | None | None | None | None | 3 | 0 | Button, Dialog, ErrorPanel, InlineValidation, Toast | None | None | no | None |
| demo-preview-frame | yes | yes | yes | yes | 3 | None | 3 | 3 | 0 | None | 3 | None | None | 0/0 | None | None | None | 10/10 | None | None | None | None | 4 | 3 | ErrorPanel, Skeleton | None | None | no | None |
| dense-operational-list | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 1 | None | onBulkAction, onFeedbackAction, onFilterRemove, onFiltersReset, onPageChange, onRowSelect, onSearchChange, onSortChange, onToolbarOverflowSelect | 9/9 | None | None | None | 7/7 | None | None | None | None | 4 | 4 | None | listSurface | None | no | None |
| documentation-hero | yes | yes | yes | yes | 5 | None | 5 | 5 | 0 | None | 0 | None | None | 0/0 | None | None | None | 7/7 | None | None | None | None | 4 | 1 | Button | None | None | no | None |
| documentation-page-shell | yes | yes | yes | yes | 1 | None | 1 | 1 | 0 | None | 0 | None | None | 0/0 | None | None | None | 9/9 | None | None | None | None | 4 | 3 | None | content | None | no | None |
| documentation-primitive-demo | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 10 | None | None | 0/0 | None | None | None | 4/4 | None | None | None | None | 4 | 3 | Button | None | None | no | None |
| documentation-reference-grid | yes | yes | yes | yes | 2 | None | 2 | 2 | 0 | None | 1 | None | None | 0/0 | None | None | None | 6/6 | None | None | None | None | 4 | 2 | None | None | None | no | None |
| documentation-section | yes | yes | yes | yes | 2 | None | 2 | 2 | 0 | None | 0 | None | None | 0/0 | None | None | None | 9/9 | None | None | None | None | 3 | 2 | None | None | None | no | None |
| documentation-token-grid | yes | yes | yes | yes | 2 | None | 2 | 2 | 0 | None | 2 | None | None | 0/0 | None | None | None | 6/6 | None | None | None | None | 4 | 2 | None | None | None | no | None |
| drag-sortable-list | yes | yes | yes | yes | 11 | None | 11 | 11 | 0 | None | 4 | None | onMoveItem, onReset, onSave, onSelect, onUndo | 5/5 | None | None | None | 9/9 | None | None | None | None | 3 | 3 | Button, List, Toast | None | None | no | None |
| drawer-adapter | yes | yes | yes | yes | 12 | None | 12 | 10 | 2 | None | 3 | None | onAction, onOpenChange | 2/2 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, Dialog, Drawer, List, Menu, Toast | content | None | no | None |
| driver-and-vehicle-administration | yes | yes | yes | yes | 15 | None | 15 | 15 | 0 | None | 2 | None | onAction, onDialogAction, onRowSelect | 3/3 | None | None | None | 8/8 | None | None | None | None | 3 | 4 | Avatar, Button, Dialog, EmptyState, IconButton, Pagination, Table, Toast | None | None | no | None |
| driver-onboarding-mobile | yes | yes | yes | yes | 14 | None | 13 | 13 | 0 | None | 0 | None | onSubmit | 1/1 | None | None | None | 8/8 | None | None | None | None | 3 | 4 | Button, InlineValidation, Input, Toast | None | None | no | None |
| email-template-layout | yes | yes | yes | yes | 0 | None | 0 | 0 | 0 | None | 0 | None | None | 0/0 | None | None | None | 5/5 | None | None | None | None | 5 | 11 | None | None | None | no | None |
| expandable-detail-table | yes | yes | yes | yes | 6 | None | 6 | 6 | 0 | None | 1 | None | onDetailAction, onDetailOpenChange, onFeedbackAction, onTableBulkAction, onTablePageChange, onTableRowSelect, onTableSortChange | 7/7 | None | None | None | 7/7 | None | None | None | None | 4 | 4 | None | expandableDetailTableSurface | None | no | None |
| file-upload | yes | yes | yes | yes | 6 | None | 6 | 6 | 0 | None | 0 | None | onChange, onChoose, onRemove, onRetry | 4/4 | None | None | None | 8/8 | None | None | None | None | 3 | 8 | Button, IconButton, InlineValidation, Toast | surface | None | no | None |
| filter-chip-group | yes | yes | yes | yes | 6 | None | 6 | 6 | 0 | None | 6 | None | onAction, onFeedbackAction, onFeedbackDismiss, onRemoveFilter, onReset | 5/5 | None | None | None | 6/6 | None | None | None | None | 3 | 2 | Button, EmptyState, Toast | None | None | no | None |
| filterable-editable-table | yes | yes | yes | yes | 7 | None | 7 | 7 | 0 | None | 1 | None | onEditorAction, onEditorOpenChange, onFeedbackAction, onFilterApply, onFilterDrawerOpenChange, onFilterReset, onSavedFilterSelect, onTableBulkAction, onTablePageChange, onTableRowSelect, onTableSortChange | 11/11 | None | None | None | 9/9 | None | None | None | None | 5 | 4 | None | filterableEditableTableSurface | None | no | None |
| fleet-manager-onboarding-desktop | yes | yes | yes | yes | 14 | None | 13 | 13 | 0 | None | 1 | None | onAction, onTaskChange | 2/2 | None | None | None | 8/8 | None | None | None | None | 3 | 4 | Button, Checkbox, EmptyState, InlineValidation, Input, Select, Table, Toast | None | None | no | None |
| form-section | yes | yes | yes | yes | 12 | None | 12 | 12 | 0 | None | 0 | None | onAction, onCheckedChange, onClick, onFieldValueChange, onOpenChange, onValueChange | 6/6 | None | None | None | 7/7 | None | None | None | None | 3 | 3 | Button, Checkbox, IconButton, InlineValidation, Input, RadioButton, Select, Switch, TextArea, Toast | container | None | no | None |
| fullscreen-sheet | yes | yes | yes | yes | 12 | None | 11 | 11 | 0 | None | 3 | None | onClose | 1/1 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, InlineValidation, Input, Select, Toast | None | None | no | None |
| gantt-chart | yes | yes | yes | yes | 5 | None | 5 | 5 | 0 | None | 1 | None | onAction, onTaskSelect | 2/2 | None | None | None | 6/6 | None | None | None | None | 4 | 4 | None | ganttChartSurface | None | no | None |
| help-center | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 0 | None | onDrawerOpenChange, onQueryChange, onRecoveryAction, onRouteSelect, onTopicSelect | 5/5 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Accordion, Drawer, EmptyState, Input | None | None | no | None |
| kanban-board | yes | yes | yes | yes | 9 | None | 9 | 9 | 0 | None | 5 | None | onCardSelect, onColumnAction, onMoveCard | 3/3 | None | None | None | 7/7 | None | None | None | None | 4 | 3 | Button, EmptyState, ErrorPanel, List | columns | None | no | None |
| kpi-card | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 5 | None | onAction, onSelect | 2/2 | None | None | None | 8/8 | None | None | None | None | 3 | 2 | Button, EmptyState, ErrorPanel, Skeleton | None | None | no | None |
| multi-select | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 6 | None | onClear, onOpenChange, onRemove, onValueChange | 4/4 | None | None | None | 7/7 | None | None | None | None | 3 | 4 | Button, Checkbox, EmptyState, InlineValidation, Select | None | None | no | None |
| multi-step-form | yes | yes | yes | yes | 12 | None | 11 | 11 | 0 | None | 0 | None | None | 0/0 | None | None | None | 8/8 | None | None | None | None | 3 | 4 | Button, InlineValidation, Input, Select, Toast | content | None | no | None |
| notification-panel | yes | yes | yes | yes | 9 | None | 9 | 9 | 0 | None | 6 | None | onAction, onDismiss, onMarkAll, onOpenChange, onSelect | 5/5 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, Drawer, EmptyState, IconButton, List, Toast | None | None | no | None |
| on-this-page-nav | yes | yes | yes | yes | 3 | None | 3 | 3 | 0 | None | 2 | None | onClick | 1/1 | None | None | None | 7/7 | None | None | None | None | 4 | 4 | Button | None | None | no | None |
| payment-form | yes | yes | yes | yes | 12 | None | 12 | 12 | 0 | None | 0 | None | onAmountChange, onCardNumberChange, onExpiryChange, onFeedbackAction, onSecondaryAction, onSecurityCodeChange, onSubmit | 7/7 | None | None | None | 6/6 | None | None | None | None | 4 | 4 | Button, InlineValidation | paymentSurface | None | no | None |
| polar-chart | yes | yes | yes | yes | 5 | None | 5 | 5 | 0 | None | 1 | None | onAction, onSegmentSelect | 2/2 | None | None | None | 6/6 | None | None | None | None | 4 | 4 | None | polarChartSurface | None | no | None |
| preference-management | yes | yes | yes | yes | 5 | None | 5 | 5 | 0 | None | 0 | None | onDangerCancel, onDangerConfirm, onDangerOpenChange, onDangerRecoveryAction, onSectionAction, onSectionFieldValueChange, onSettingsControlChange, onSettingsReset, onSettingsSave | 9/9 | None | None | None | 8/8 | None | None | None | None | 5 | 4 | None | preferenceSurface | None | no | None |
| pricing-operations | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 1 | None | onEditorAction, onEditorOpenChange, onFeedbackAction, onPermissionAction, onPermissionChange, onRuleBulkAction, onRuleFiltersReset, onRulePageChange, onRuleSelect, onRuleSortChange, onRuleSubmitForApproval | 11/11 | None | None | None | 8/8 | None | None | None | None | 4 | 4 | None | pricingOperationsSurface | None | no | None |
| pull-to-refresh | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 0 | None | onRefresh | 1/1 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, InlineValidation, List, Toast | content | None | no | None |
| quick-actions-grid | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 4 | None | onAction | 1/1 | None | None | None | 7/7 | None | None | None | None | 3 | 3 | Dialog, IconButton, Toast, Tooltip | None | None | no | None |
| radio-group | yes | yes | yes | yes | 5 | None | 5 | 5 | 0 | None | 1 | None | onApply, onClear, onValueChange | 3/3 | None | None | None | 7/7 | None | None | None | None | 4 | 4 | Button, InlineValidation, RadioButton | groupSurface | None | no | None |
| roles-and-permissions | yes | yes | yes | yes | 10 | None | 10 | 10 | 0 | None | 4 | None | onAction, onPermissionChange | 2/2 | None | None | None | 8/8 | None | None | None | None | 3 | 4 | Button, Checkbox, Dialog, InlineValidation, Switch, Table, Toast, Tooltip | None | None | no | None |
| search | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 4 | None | onAction, onClear, onQueryChange, onResultSelect, onScopeChange, onSubmit | 6/6 | None | None | None | 8/8 | None | None | None | None | 0 | 3 | Button, EmptyState, InlineValidation, Input, List, Select | None | None | no | None |
| section-header | yes | yes | yes | yes | 10 | None | 10 | 7 | 3 | None | 6 | None | None | 0/0 | None | None | None | 6/6 | None | None | None | None | 3 | 3 | Button, Menu, Skeleton | None | None | no | None |
| select-option-layer | yes | yes | yes | yes | 6 | None | 6 | 5 | 1 | None | 4 | None | onAction, onOpenChange, onValueChange | 3/3 | None | None | None | 8/8 | None | None | None | None | 0 | 2 | Button, EmptyState, InlineValidation, Select | None | None | no | None |
| settings | yes | yes | yes | yes | 10 | None | 10 | 10 | 0 | None | 3 | None | onAction, onControlChange, onOpenChange, onReset, onSave | 5/5 | None | None | None | 8/8 | None | None | None | None | 3 | 4 | Button, Dialog, Input, Select, Switch, Toast | groups | None | no | None |
| sidebar | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 4 | None | onCollapse, onDrawerOpenChange, onExpandedChange, onRouteSelect | 4/4 | None | None | None | 7/7 | None | None | None | None | 3 | 6 | Accordion, Button, Drawer, IconButton | groups | None | no | None |
| snackbar-provider | yes | yes | yes | yes | 4 | None | 4 | 3 | 1 | None | 3 | None | onMessageAction, onMessageDismiss, onQueueAction | 3/3 | None | None | None | 7/7 | None | None | None | None | 3 | 2 | Button, Toast | viewport | None | no | None |
| station-discovery | yes | yes | yes | yes | 11 | None | 11 | 10 | 1 | None | 1 | None | onAction, onQueryChange, onRouteAction, onStationSelect, onSubmit | 5/5 | None | None | None | 11/11 | None | None | None | None | 0 | 5 | Button, EmptyState, ErrorPanel, InlineValidation, List, Skeleton | surface | None | no | None |
| status-feedback-view | yes | yes | yes | yes | 7 | None | 7 | 7 | 0 | None | 0 | None | onAction, onDismiss, onDismissChange, onMessageAction, onMessageDismiss, onOpenChange, onQueueAction, onSelect | 8/8 | None | None | None | 14/14 | None | None | None | None | 4 | 4 | EmptyState, ErrorPanel, InlineValidation, Toast | None | None | no | None |
| swipe-actions | yes | yes | yes | yes | 7 | None | 7 | 7 | 0 | None | 1 | None | onAction, onFallbackClick | 2/2 | None | None | None | 7/7 | None | None | None | None | 3 | 3 | Button, Dialog, IconButton, Toast | None | None | no | None |
| ticket-queue | yes | yes | yes | yes | 7 | None | 7 | 7 | 0 | None | 1 | None | onAlertDismiss, onAlertMarkAll, onAlertOpenChange, onAlertSelect, onDetailAction, onDetailOpenChange, onFeedbackAction, onTicketBulkAction, onTicketFilterRemove, onTicketFiltersReset, onTicketPageChange, onTicketSearchChange, onTicketSelect, onTicketSortChange, onTicketToolbarOverflowSelect | 15/15 | None | None | None | 7/7 | None | None | None | None | 5 | 4 | None | ticketQueueSurface | None | no | None |
| timeline | yes | yes | yes | yes | 8 | None | 8 | 8 | 0 | None | 5 | None | onClear, onEventSelect, onFilterRemove | 3/3 | None | None | None | 6/6 | None | None | None | None | 3 | 3 | Button, EmptyState, List | None | None | no | None |
| toolbar | yes | yes | yes | yes | 9 | None | 9 | 7 | 2 | None | 3 | None | None | 0/0 | None | None | None | 7/7 | None | None | None | None | 3 | 4 | Button, Input, Menu, Toast | None | None | no | None |
| topbar | yes | yes | yes | yes | 17 | None | 17 | 10 | 7 | None | 11 | None | onDrawerOpenChange, onOpenChange, onQueryChange, onResultSelect, onSelect | 5/5 | None | None | None | 8/8 | None | None | None | None | 3 | 8 | Avatar, Drawer, EmptyState, IconButton, Input, List, Menu | None | None | no | None |
| transfer-list | yes | yes | yes | yes | 12 | None | 12 | 12 | 0 | None | 5 | None | onItemCheckedChange, onSourceSelect, onTargetSelect | 3/3 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, Checkbox, InlineValidation, Input, List, Toast | None | None | no | None |
| virtual-data-table | yes | yes | yes | yes | 9 | None | 9 | 9 | 0 | None | 7 | None | onAction, onBulkAction, onPageChange, onRowSelect, onSelectionChange, onSortChange | 6/6 | None | None | None | 8/8 | None | None | None | None | 3 | 3 | Button, Checkbox, EmptyState, ErrorPanel, Pagination, Skeleton, Table | None | None | no | None |
| waterfall-chart | yes | yes | yes | yes | 5 | None | 5 | 5 | 0 | None | 1 | None | onAction, onStepSelect | 2/2 | None | None | None | 6/6 | None | None | None | None | 4 | 4 | None | waterfallChartSurface | None | no | None |

