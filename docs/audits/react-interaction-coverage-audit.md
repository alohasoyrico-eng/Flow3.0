# React Interaction Coverage Audit

Status: **review**

React components that declare callback props must use them in source and must have explicit interaction coverage, not only static render snapshots.

## Inventory

- Components audited: 56
- Components with callbacks: 39
- Pass: 55
- Review: 1
- Fail: 0
- Missing callback test assertions: 1

## Missing Interaction Tests

| Component | Missing callback coverage |
| --- | --- |
| TreeView | onExpandedChange |

## Missing Source Usage

- None
