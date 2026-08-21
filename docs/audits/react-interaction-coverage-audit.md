# React Interaction Coverage Audit

Status: **pass**

React components that declare callback props must use them in source and must have explicit interaction coverage, not only static render snapshots. The actionable debt metric is interactionDebt.

## Inventory

- Components audited: 60
- Interaction debt: 0
- Components with callbacks: 44
- Pass: 60
- Review: 0
- Fail: 0
- Missing callback test assertions: 0
- Missing callback event params: 0
- Manual accessibility critical pass: 10/10
- Required keyboard contracts pass: 10/10
- Required state semantics contracts pass: 4/4
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. interactionDebt must stay at 0; callback coverage and critical interaction coverage should only change with explicit product/API review.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| components | 60 | 60 |
| interactionDebt | 0 | 0 |
| withCallbacks | 44 | 44 |
| pass | 60 | 60 |
| review | 0 | 0 |
| fail | 0 | 0 |
| missingTestCallbacks | 0 | 0 |
| missingEventParams | 0 | 0 |
| manualAccessibilityCritical | 10 | 10 |
| manualAccessibilityCriticalPass | 10 | 10 |
| reactGovernancePolicyIssues | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Manual Accessibility Critical Components

| Component | Status | Callbacks | Interaction test presence |
| --- | --- | --- | --- |
| Combobox | pass | onOpenChange, onValueChange | yes |
| CountrySelector | pass | onOpenChange, onValueChange | yes |
| DatePicker | pass | onOpenChange, onValueChange | yes |
| DateRangePicker | pass | onOpenChange, onValueChange | yes |
| Dialog | pass | onAction, onClick, onOpenChange | yes |
| Drawer | pass | onAction, onClick, onOpenChange | yes |
| Menu | pass | onOpenChange, onSelect | yes |
| Popover | pass | onAction, onClick, onOpenChange | yes |
| Select | pass | onOpenChange, onValueChange | yes |
| Tooltip | pass | onOpenChange | yes |

## Missing Interaction Tests

- None

## Missing Source Usage

- None

## Missing Callback Event Params

- None

## Required Keyboard Contracts

| Component | Status | Keys | Assertions | Missing keys | Missing assertions |
| --- | --- | --- | --- | --- | --- |
| Combobox | pass | ArrowDown, ArrowUp, Enter, Escape | aria-activedescendant, aria-expanded, data-selected, disabled | None | None |
| Select | pass | ArrowDown, ArrowUp, Enter, Escape | aria-activedescendant, aria-expanded, data-active, disabled | None | None |
| CountrySelector | pass | ArrowDown, ArrowUp, Enter, Escape | aria-activedescendant, aria-expanded, data-selected, disabled | None | None |
| Menu | pass | ArrowDown, ArrowUp, Home, End, Enter, Escape | aria-expanded, activeElement, focus | None | None |
| Dialog | pass | Escape | aria-modal, aria-expanded, activeElement | None | None |
| Drawer | pass | Escape | aria-modal, aria-expanded, activeElement | None | None |
| Popover | pass | Escape, Tab | aria-expanded, focus | None | None |
| Tooltip | pass | Escape | aria-describedby | None | None |
| Tabs | pass | ArrowRight, ArrowLeft, Home, End | aria-selected, disabled | None | None |
| TreeView | pass | ArrowDown, ArrowUp, Enter | aria-selected, data-selected | None | None |

## Required State Semantics Contracts

| Component | Status | Assertions | Missing assertions |
| --- | --- | --- | --- |
| Button | pass | data-state, aria-busy, button--danger, button--warning | None |
| Input | pass | data-state, aria-busy, field__icon--loading, success, warning | None |
| Select | pass | data-active, data-selected, aria-activedescendant, aria-expanded | None |
| Combobox | pass | data-active, data-selected, aria-activedescendant, aria-expanded | None |
