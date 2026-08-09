# React Interaction Coverage Audit

Status: **pass**

React components that declare callback props must use them in source and must have explicit interaction coverage, not only static render snapshots.

## Inventory

- Components audited: 56
- Components with callbacks: 40
- Pass: 56
- Review: 0
- Fail: 0
- Missing callback test assertions: 0
- Missing callback event params: 0
- Manual accessibility critical pass: 10/10
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. Callback coverage and critical interaction coverage should only change with explicit product/API review.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| components | 56 | 56 |
| withCallbacks | 40 | 40 |
| pass | 56 | 56 |
| review | 0 | 0 |
| fail | 0 | 0 |
| missingTestCallbacks | 0 | 0 |
| missingEventParams | 0 | 0 |
| manualAccessibilityCritical | 10 | 10 |
| manualAccessibilityCriticalPass | 10 | 10 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Manual Accessibility Critical Components

| Component | Status | Callbacks | Interaction test presence |
| --- | --- | --- | --- |
| Dialog | pass | onAction, onClick, onOpenChange | yes |
| Drawer | pass | onAction, onClick, onOpenChange | yes |
| Menu | pass | onOpenChange, onSelect | yes |
| Popover | pass | onAction, onClick, onOpenChange | yes |
| Tooltip | pass | onOpenChange | yes |
| Select | pass | onOpenChange, onValueChange | yes |
| Combobox | pass | onOpenChange, onValueChange | yes |
| CountrySelector | pass | onOpenChange, onValueChange | yes |
| DatePicker | pass | onOpenChange, onValueChange | yes |
| DateRangePicker | pass | onOpenChange, onValueChange | yes |

## Missing Interaction Tests

- None

## Missing Source Usage

- None

## Missing Callback Event Params

- None
