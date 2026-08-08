# React Class Ownership Audit

Status: **pass**

React components may only author their own visual class roots or explicit family roots; protected roots must be reused through real component composition.

## Inventory

- React components scanned: 56
- Component class roots known: 53
- Protected class roots: button, card, dialog, drawer, menu, popover
- Components with family roots: 13
- Observed root assignments: 65
- Violations: 0

## Components

| Component | Status | Owner root | Allowed roots | Observed roots | Violations |
| --- | --- | --- | --- | --- | ---: |
| Accordion | pass | accordion | accordion | accordion | 0 |
| AnimatedMoment | pass | animated-moment | animated-moment | animated-moment | 0 |
| AuditEvent | pass | audit-event | audit-event | audit-event | 0 |
| Avatar | pass | avatar | avatar | avatar | 0 |
| Badge | pass | badge | badge | badge | 0 |
| BiometricPrompt | pass | biometric-prompt | biometric-prompt | biometric-prompt | 0 |
| Breadcrumbs | pass | breadcrumbs | breadcrumbs | breadcrumbs | 0 |
| Button | pass | button | button | button | 0 |
| Card | pass | card | card | card | 0 |
| CardExpiryInput | pass | card-expiry-input | card-expiry-input, field | field | 0 |
| CardNumberInput | pass | card-number-input | card-number-input, field | field | 0 |
| CardSecurityCodeInput | pass | card-security-code-input | card-security-code-input, field | field | 0 |
| CardSummary | pass | card-summary | card-summary | None | 0 |
| ChartPanel | pass | chart-panel | chart-panel | chart-panel | 0 |
| Checkbox | pass | checkbox | checkbox, choice | checkbox, choice | 0 |
| Chip | pass | chip | chip | chip | 0 |
| CodeInput | pass | code-input | code-input, field | code-input, field | 0 |
| Combobox | pass | combobox | combobox, field, select-control | combobox, field, select-control | 0 |
| CountrySelector | pass | country-selector | country-flag, country-selector, select-control | country-flag, country-selector, select-control | 0 |
| DatePicker | pass | date-picker | date-picker, field | field | 0 |
| DateRangePicker | pass | date-range-picker | date-picker, date-range-picker, field | field | 0 |
| Dialog | pass | dialog | dialog | dialog | 0 |
| Drawer | pass | drawer | drawer | drawer | 0 |
| EmptyState | pass | empty-state | empty-state | empty-state | 0 |
| ErrorPanel | pass | error-panel | error-panel | error-panel | 0 |
| FloatingActionButton | pass | fab | fab | fab | 0 |
| IconButton | pass | icon-button | icon-button | icon-button | 0 |
| InlineValidation | pass | inline-validation | inline-validation | inline-validation | 0 |
| Input | pass | input | field | field | 0 |
| KpiTile | pass | kpi-tile | kpi-tile | kpi-tile | 0 |
| List | pass | list | list | list | 0 |
| Menu | pass | menu | menu | menu | 0 |
| MotionBoundary | pass | motion-boundary | motion-boundary | motion-boundary | 0 |
| MovementRow | pass | movement-row | movement-row | movement-row | 0 |
| Pagination | pass | pagination | pagination | pagination | 0 |
| PhoneInput | pass | phone-input | country-flag, country-selector, field, phone-input, select-control | field, phone-input | 0 |
| Popover | pass | popover | popover | popover | 0 |
| ProgressIndicator | pass | progress | progress | progress | 0 |
| QuickAction | pass | quick-action | quick-action | quick-action | 0 |
| RadioButton | pass | radio | choice, radio | choice, radio | 0 |
| RouteSummary | pass | route-summary | route-summary | route-summary | 0 |
| SegmentedControl | pass | segmented-control | segmented-control | segmented-control | 0 |
| Select | pass | select | field, select-control | field, select-control | 0 |
| Skeleton | pass | skeleton | skeleton | skeleton | 0 |
| Slider | pass | slider | slider | slider | 0 |
| Spinner | pass | spinner | spinner | spinner | 0 |
| StationPin | pass | station-pin | station-pin | station-pin | 0 |
| Stepper | pass | stepper | stepper | stepper | 0 |
| Switch | pass | switch | switch | switch | 0 |
| Table | pass | table | table | table | 0 |
| Tabs | pass | tabs | tabs | tabs | 0 |
| Tag | pass | tag | tag | tag | 0 |
| TextArea | pass | text-area | field, text-area | field, text-area | 0 |
| Toast | pass | toast | toast | toast | 0 |
| Tooltip | pass | tooltip | tooltip | tooltip | 0 |
| TreeView | pass | tree-view | tree-view | tree-view | 0 |

## Violations

| Component | Root | Protected | Location | Source |
| --- | --- | --- | --- | --- |
| None | None | None | None | None |

