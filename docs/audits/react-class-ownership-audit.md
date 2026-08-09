# React Class Ownership Audit

Status: **pass**

React components may only author their own visual class roots or explicit family roots; protected roots must be reused through real component composition.

## Inventory

- React components scanned: 56
- Component class roots known: 59
- Protected class roots: button, card, dialog, drawer, menu, popover
- Support class roots: animation-asset, field-action, illustration-asset, input, material-symbol
- Package CSS roots visible to React governance: 66
- Components with family roots: 13
- Observed root assignments: 72
- Observed support root assignments: 20
- Violations: 0

## Components

| Component | Status | Owner root | Allowed roots | Observed component roots | Observed support roots | Violations |
| --- | --- | --- | --- | --- | --- | ---: |
| Accordion | pass | accordion | accordion | accordion | None | 0 |
| AnimatedMoment | pass | animated-moment | animated-moment | animated-moment | animation-asset, material-symbol | 0 |
| AuditEvent | pass | audit-event | audit-event | audit-event | material-symbol | 0 |
| Avatar | pass | avatar | avatar | avatar | None | 0 |
| Badge | pass | badge | badge | badge | None | 0 |
| BiometricPrompt | pass | biometric-prompt | biometric-prompt | biometric-prompt | material-symbol | 0 |
| Breadcrumbs | pass | breadcrumbs | breadcrumbs | breadcrumbs | None | 0 |
| Button | pass | button | button | button | None | 0 |
| Card | pass | card | card | card | None | 0 |
| CardExpiryInput | pass | card-expiry-input | card-expiry-input, field | card-expiry-input, field | input | 0 |
| CardNumberInput | pass | card-number-input | card-number-input, field | card-number-input, field | input | 0 |
| CardSecurityCodeInput | pass | card-security-code-input | card-security-code-input, field | card-security-code-input, field | field-action, input | 0 |
| CardSummary | pass | card-summary | card-summary | card-summary | material-symbol | 0 |
| ChartPanel | pass | chart-panel | chart-panel | chart-panel | None | 0 |
| Checkbox | pass | checkbox | checkbox, choice | checkbox, choice | material-symbol | 0 |
| Chip | pass | chip | chip | chip | None | 0 |
| CodeInput | pass | code-input | code-input, field | code-input, field | None | 0 |
| Combobox | pass | combobox | combobox, field, select-control | combobox, field, select-control | field-action, input | 0 |
| CountrySelector | pass | country-selector | country-flag, country-selector, select-control | country-flag, country-selector, select-control | None | 0 |
| DatePicker | pass | date-picker | date-picker, field | date-picker, field | None | 0 |
| DateRangePicker | pass | date-range-picker | date-picker, date-range-picker, field | date-picker, date-range-picker, field | None | 0 |
| Dialog | pass | dialog | dialog | dialog | None | 0 |
| Drawer | pass | drawer | drawer | drawer | None | 0 |
| EmptyState | pass | empty-state | empty-state | empty-state | None | 0 |
| ErrorPanel | pass | error-panel | error-panel | error-panel | None | 0 |
| FloatingActionButton | pass | fab | fab | fab | None | 0 |
| IconButton | pass | icon-button | icon-button | icon-button | None | 0 |
| InlineValidation | pass | inline-validation | inline-validation | inline-validation | None | 0 |
| Input | pass | field | field | field | field-action, input | 0 |
| KpiTile | pass | kpi-tile | kpi-tile | kpi-tile | None | 0 |
| List | pass | list | list | list | material-symbol | 0 |
| Menu | pass | menu | menu | menu | None | 0 |
| MotionBoundary | pass | motion-boundary | motion-boundary | motion-boundary | material-symbol | 0 |
| MovementRow | pass | movement-row | movement-row | movement-row | material-symbol | 0 |
| Pagination | pass | pagination | pagination | pagination | None | 0 |
| PhoneInput | pass | phone-input | country-flag, country-selector, field, phone-input, select-control | field, phone-input | input | 0 |
| Popover | pass | popover | popover | popover | None | 0 |
| ProgressIndicator | pass | progress | progress | progress | None | 0 |
| QuickAction | pass | quick-action | quick-action | quick-action | None | 0 |
| RadioButton | pass | radio | choice, radio | choice, radio | None | 0 |
| RouteSummary | pass | route-summary | route-summary | route-summary | material-symbol | 0 |
| SegmentedControl | pass | segmented-control | segmented-control | segmented-control | None | 0 |
| Select | pass | select | field, select-control | field, select-control | None | 0 |
| Skeleton | pass | skeleton | skeleton | skeleton | None | 0 |
| Slider | pass | slider | slider | slider | None | 0 |
| Spinner | pass | spinner | spinner | spinner | None | 0 |
| StationPin | pass | station-pin | station-pin | station-pin | material-symbol | 0 |
| Stepper | pass | stepper | stepper | stepper | None | 0 |
| Switch | pass | switch | switch | switch | None | 0 |
| Table | pass | table | table | table | None | 0 |
| Tabs | pass | tabs | tabs | tabs | None | 0 |
| Tag | pass | tag | tag | tag | None | 0 |
| TextArea | pass | text-area | field, text-area | field, text-area | None | 0 |
| Toast | pass | toast | toast | toast | None | 0 |
| Tooltip | pass | tooltip | tooltip | tooltip | None | 0 |
| TreeView | pass | tree-view | tree-view | tree-view | None | 0 |

## Violations

| Component | Root | Protected | Unknown | Location | Source |
| --- | --- | --- | --- | --- | --- |
| None | None | None | None | None | None |

