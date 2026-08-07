# React Interaction Coverage Audit

Status: **review**

React components that declare callback props must use them in source and must have explicit interaction coverage, not only static render snapshots.

## Inventory

- Components audited: 56
- Components with callbacks: 39
- Pass: 21
- Review: 35
- Fail: 0
- Missing callback test assertions: 44

## Missing Interaction Tests

| Component | Missing callback coverage |
| --- | --- |
| Accordion | onExpandedChange |
| Breadcrumbs | onClick |
| Card | onAction |
| CardExpiryInput | onValueChange |
| CardNumberInput | onValueChange |
| CardSecurityCodeInput | onValueChange |
| Checkbox | onCheckedChange |
| Chip | onSelectedChange |
| CodeInput | onComplete, onValueChange |
| Combobox | onValueChange |
| CountrySelector | onValueChange |
| DatePicker | onOpenChange, onValueChange |
| DateRangePicker | onOpenChange, onValueChange |
| Dialog | onAction, onOpenChange |
| Drawer | onAction, onOpenChange |
| EmptyState | onAction |
| ErrorPanel | onAction |
| Input | onValueChange |
| Menu | onOpenChange |
| Pagination | onPageChange |
| PhoneInput | onValueChange |
| Popover | onAction, onOpenChange |
| QuickAction | onAction |
| RadioButton | onCheckedChange |
| RouteSummary | onAction, onClick |
| SegmentedControl | onValueChange |
| Select | onValueChange |
| Slider | onValueChange |
| Switch | onCheckedChange |
| Table | onExpandedChange, onRowSelect |
| Tabs | onValueChange |
| TextArea | onChange |
| Toast | onAction, onDismiss |
| Tooltip | onOpenChange |
| TreeView | onExpandedChange |

## Missing Source Usage

- None
