# React Accessibility Governance Audit

Status: **pass**

React components with accessibility-critical interaction must keep explicit role, ARIA, keyboard, and focus contracts visible in source and gated in validation.

## Inventory

- React components scanned: 56
- Accessibility-critical components: 10
- Critical passing: 10
- Role declarations: 68
- ARIA declarations: 310
- Keyboard handlers: 40
- Focus calls: 15
- Failures: 0
- Critical interaction failures: 0
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. Role, ARIA, keyboard, and focus signals should not shrink silently in accessibility-critical React components.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| components | 56 | 56 |
| criticalComponents | 10 | 10 |
| criticalPassing | 10 | 10 |
| totalRoles | 68 | 68 |
| totalAria | 310 | 310 |
| keyboardHandlers | 40 | 40 |
| focusCalls | 15 | 15 |
| failures | 0 | 0 |
| interactionFailures | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Critical Components

| Component | Status | Present requirements | Missing | Interaction gate |
| --- | --- | --- | --- | --- |
| Combobox | pass | role combobox, autocomplete, expanded state, listbox, option, active descendant, keyboard, escape | None | pass |
| CountrySelector | pass | role combobox, expanded state, listbox, option, active descendant, keyboard, escape | None | pass |
| DatePicker | pass | dialog trigger, expanded state, role dialog, grid, gridcell, keyboard, escape, focus restoration | None | pass |
| DateRangePicker | pass | dialog trigger, expanded state, role dialog, grid, gridcell, keyboard, escape, focus restoration | None | pass |
| Dialog | pass | role dialog, modal, labelledby, escape, focus restoration | None | pass |
| Drawer | pass | role dialog, modal, labelledby, escape, focus restoration | None | pass |
| Menu | pass | menu trigger, expanded state, role menu, role menuitem, keyboard, escape, focus management | None | pass |
| Popover | pass | dialog trigger, expanded state, role dialog, labelledby, keyboard, escape, focus restoration | None | pass |
| Select | pass | role combobox, expanded state, listbox, option, active descendant, keyboard, escape | None | pass |
| Tooltip | pass | describedby, role tooltip, keyboard, escape, focus trigger | None | pass |

## Signal Inventory

| Component | Roles | ARIA | Keyboard | tabIndex | Focus calls | useId |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Accordion | 1 | 5 | 0 | 0 | 0 | yes |
| AnimatedMoment | 2 | 8 | 0 | 0 | 0 | no |
| AuditEvent | 0 | 2 | 0 | 0 | 0 | no |
| Avatar | 0 | 3 | 0 | 0 | 0 | no |
| Badge | 1 | 6 | 0 | 0 | 0 | no |
| BiometricPrompt | 2 | 2 | 0 | 0 | 0 | no |
| Breadcrumbs | 0 | 5 | 0 | 0 | 0 | no |
| Button | 0 | 3 | 0 | 0 | 0 | no |
| Card | 1 | 8 | 3 | 2 | 0 | no |
| CardExpiryInput | 1 | 4 | 0 | 0 | 0 | yes |
| CardNumberInput | 1 | 5 | 0 | 0 | 0 | yes |
| CardSecurityCodeInput | 1 | 7 | 0 | 0 | 0 | yes |
| CardSummary | 0 | 4 | 0 | 2 | 0 | no |
| ChartPanel | 9 | 9 | 0 | 4 | 0 | no |
| Checkbox | 0 | 3 | 0 | 0 | 0 | no |
| Chip | 0 | 6 | 0 | 0 | 0 | no |
| CodeInput | 1 | 4 | 0 | 0 | 0 | yes |
| Combobox | 4 | 15 | 2 | 1 | 0 | yes |
| CountrySelector | 4 | 14 | 3 | 2 | 0 | yes |
| DatePicker | 5 | 20 | 4 | 1 | 1 | yes |
| DateRangePicker | 5 | 21 | 4 | 2 | 1 | yes |
| Dialog | 1 | 6 | 2 | 0 | 2 | yes |
| Drawer | 1 | 5 | 2 | 0 | 2 | yes |
| EmptyState | 0 | 2 | 0 | 0 | 0 | yes |
| ErrorPanel | 1 | 1 | 0 | 0 | 0 | no |
| FloatingActionButton | 0 | 3 | 0 | 0 | 0 | no |
| IconButton | 0 | 4 | 0 | 0 | 0 | no |
| InlineValidation | 1 | 4 | 0 | 0 | 0 | yes |
| Input | 1 | 11 | 0 | 0 | 0 | yes |
| KpiTile | 1 | 8 | 2 | 1 | 0 | no |
| List | 1 | 5 | 0 | 0 | 0 | no |
| Menu | 3 | 7 | 2 | 1 | 5 | yes |
| MotionBoundary | 1 | 5 | 0 | 0 | 0 | yes |
| MovementRow | 0 | 2 | 0 | 0 | 0 | no |
| Pagination | 0 | 6 | 0 | 0 | 0 | no |
| PhoneInput | 1 | 3 | 0 | 0 | 0 | yes |
| Popover | 1 | 4 | 2 | 0 | 1 | yes |
| ProgressIndicator | 1 | 7 | 0 | 1 | 0 | yes |
| QuickAction | 0 | 3 | 0 | 0 | 0 | no |
| RadioButton | 0 | 2 | 0 | 0 | 0 | no |
| RouteSummary | 0 | 3 | 0 | 2 | 0 | no |
| SegmentedControl | 2 | 6 | 3 | 1 | 1 | yes |
| Select | 4 | 13 | 3 | 1 | 0 | yes |
| Skeleton | 1 | 5 | 0 | 0 | 0 | no |
| Slider | 0 | 6 | 0 | 0 | 0 | no |
| Spinner | 1 | 3 | 0 | 0 | 0 | no |
| StationPin | 0 | 3 | 0 | 0 | 0 | no |
| Stepper | 0 | 4 | 0 | 0 | 0 | no |
| Switch | 1 | 3 | 0 | 0 | 0 | no |
| Table | 0 | 5 | 1 | 1 | 0 | no |
| Tabs | 2 | 3 | 3 | 1 | 1 | no |
| Tag | 0 | 2 | 0 | 0 | 0 | no |
| TextArea | 1 | 3 | 0 | 0 | 0 | yes |
| Toast | 0 | 2 | 0 | 0 | 0 | no |
| Tooltip | 1 | 3 | 1 | 0 | 0 | yes |
| TreeView | 3 | 4 | 3 | 1 | 1 | no |

