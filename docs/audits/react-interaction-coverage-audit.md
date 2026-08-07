# React Interaction Coverage Audit

Status: **review**

React components that declare callback props must use them in source and must have explicit interaction coverage, not only static render snapshots.

## Inventory

- Components audited: 56
- Components with callbacks: 39
- Pass: 53
- Review: 3
- Fail: 0
- Missing callback test assertions: 4

## Missing Interaction Tests

| Component | Missing callback coverage |
| --- | --- |
| Toast | onAction, onDismiss |
| Tooltip | onOpenChange |
| TreeView | onExpandedChange |

## Missing Source Usage

- None
