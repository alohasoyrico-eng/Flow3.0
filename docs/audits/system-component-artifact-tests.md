# System Component Artifact Tests

Status: **pass**

Every public React component artifact must be tested one by one from the built package boundary before pattern work continues.

## Inventory

- Plan iteration: 15
- Catalog components: 62
- Contract components: 62
- Tested components: 62
- Passing components: 62
- Failing components: 0
- Component artifact test debt: 0
- Density checks: 62
- State checks: 56
- Theme checks: 0

## Baseline Mismatches

- None

## Component Matrix

| Contract id | React component | Status | Required props | Passed checks | Issues |
| --- | --- | --- | --- | ---: | --- |
| button | Button | pass | None | 3 | None |
| copyButton | CopyButton | pass | value | 3 | None |
| codeBlock | CodeBlock | pass | code | 3 | None |
| iconButton | IconButton | pass | ariaLabel, icon | 2 | None |
| input | Input | pass | label | 3 | None |
| inputAmount | InputAmount | pass | label | 3 | None |
| cardNumberInput | CardNumberInput | pass | label | 3 | None |
| cardExpiryInput | CardExpiryInput | pass | label | 3 | None |
| cardSecurityCodeInput | CardSecurityCodeInput | pass | label | 3 | None |
| select | Select | pass | label, options | 3 | None |
| combobox | Combobox | pass | label, options | 3 | None |
| card | Card | pass | title | 3 | None |
| checkbox | Checkbox | pass | label | 3 | None |
| switch | Switch | pass | label | 3 | None |
| radioButton | RadioButton | pass | label, name | 3 | None |
| textArea | TextArea | pass | label | 3 | None |
| badge | Badge | pass | label | 3 | None |
| chip | Chip | pass | label | 3 | None |
| tag | Tag | pass | label | 3 | None |
| tabs | Tabs | pass | items | 2 | None |
| tooltip | Tooltip | pass | triggerLabel, content | 3 | None |
| toast | Toast | pass | label | 3 | None |
| progressIndicator | ProgressIndicator | pass | label | 3 | None |
| spinner | Spinner | pass | None | 3 | None |
| accordion | Accordion | pass | items | 2 | None |
| slider | Slider | pass | label | 3 | None |
| avatar | Avatar | pass | name | 3 | None |
| skeleton | Skeleton | pass | label | 3 | None |
| dialog | Dialog | pass | label | 3 | None |
| menu | Menu | pass | triggerLabel, items | 3 | None |
| drawer | Drawer | pass | label | 3 | None |
| table | Table | pass | label, columns, rows | 3 | None |
| biometricPrompt | BiometricPrompt | pass | label | 3 | None |
| treeView | TreeView | pass | nodes | 3 | None |
| motionBoundary | MotionBoundary | pass | label | 3 | None |
| animatedMoment | AnimatedMoment | pass | label | 3 | None |
| emptyState | EmptyState | pass | title | 3 | None |
| list | List | pass | items | 3 | None |
| kpiTile | KpiTile | pass | value | 3 | None |
| floatingActionButton | FloatingActionButton | pass | label | 3 | None |
| breadcrumbs | Breadcrumbs | pass | items | 3 | None |
| pagination | Pagination | pass | pageCount, label, previousLabel, nextLabel, getPageLabel | 3 | None |
| auditEvent | AuditEvent | pass | label | 3 | None |
| errorPanel | ErrorPanel | pass | label | 3 | None |
| inlineValidation | InlineValidation | pass | label | 3 | None |
| stepper | Stepper | pass | steps, label | 2 | None |
| chartPanel | ChartPanel | pass | label | 3 | None |
| stationPin | StationPin | pass | label | 3 | None |
| routeSummary | RouteSummary | pass | label | 3 | None |
| codeInput | CodeInput | pass | label | 3 | None |
| phoneInput | PhoneInput | pass | label | 3 | None |
| countrySelector | CountrySelector | pass | label | 2 | None |
| datePicker | DatePicker | pass | label | 3 | None |
| dateRangePicker | DateRangePicker | pass | label | 3 | None |
| segmentedControl | SegmentedControl | pass | label, items | 2 | None |
| popover | Popover | pass | triggerLabel, title | 3 | None |
| cardSummary | CardSummary | pass | label | 3 | None |
| movementRow | MovementRow | pass | label | 3 | None |
| chatMessage | ChatMessage | pass | None | 3 | None |
| chatThread | ChatThread | pass | None | 3 | None |
| chatComposer | ChatComposer | pass | None | 3 | None |
| quickAction | QuickAction | pass | label | 3 | None |

