# React Interaction Coverage Audit

Status: **review**

React components that declare callback props must use them in source and must have explicit interaction coverage, not only static render snapshots.

## Inventory

- Components audited: 56
- Components with callbacks: 39
- Pass: 36
- Review: 20
- Fail: 0
- Missing callback test assertions: 25

## Missing Interaction Tests

| Component | Missing callback coverage |
| --- | --- |
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
