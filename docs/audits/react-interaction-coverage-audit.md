# React Interaction Coverage Audit

Status: **review**

React components that declare callback props must use them in source and must have explicit interaction coverage, not only static render snapshots.

## Inventory

- Components audited: 56
- Components with callbacks: 39
- Pass: 44
- Review: 12
- Fail: 0
- Missing callback test assertions: 15

## Missing Interaction Tests

| Component | Missing callback coverage |
| --- | --- |
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
