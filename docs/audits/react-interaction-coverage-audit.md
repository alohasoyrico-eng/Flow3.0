# React Interaction Coverage Audit

Status: **review**

React components that declare callback props must use them in source and must have explicit interaction coverage, not only static render snapshots.

## Inventory

- Components audited: 56
- Components with callbacks: 39
- Pass: 26
- Review: 30
- Fail: 0
- Missing callback test assertions: 41

## Missing Interaction Tests

| Component | Missing callback coverage |
| --- | --- |
| Chip | onRemove, onSelectedChange |
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
| Menu | onOpenChange, onSelect |
| MovementRow | onSelect |
| Pagination | onPageChange |
| PhoneInput | onValueChange |
| Popover | onAction, onOpenChange |
| QuickAction | onAction |
| RadioButton | onCheckedChange |
| RouteSummary | onAction, onClick |
| SegmentedControl | onValueChange |
| Select | onValueChange |
| Slider | onValueChange |
| StationPin | onSelect |
| Switch | onCheckedChange |
| Table | onExpandedChange, onRowSelect |
| Tabs | onValueChange |
| TextArea | onChange |
| Toast | onAction, onDismiss |
| Tooltip | onOpenChange |
| TreeView | onExpandedChange |

## Missing Source Usage

- None
