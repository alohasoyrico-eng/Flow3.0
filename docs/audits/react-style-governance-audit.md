# React Style Governance Audit

Status: **pass**

React visual styling must flow through classes and tokens; inline style is reserved for approved dynamic CSS custom properties and DOM style/class/data mutation is blocked. The actionable debt metric is styleEscapeDebt.

## Inventory

- React components scanned: 60
- Style escape debt: 0
- Components with approved inline vars: 6
- Components with runtime CSS vars: 1
- Approved inline vars observed: 12
- Style props observed: 10
- style.setProperty calls: 2
- Violations: 0
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. styleEscapeDebt must stay at 0; new inline style or runtime CSS-var usage must be reviewed before it becomes part of the public React implementation.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| components | 60 | 60 |
| styleEscapeDebt | 0 | 0 |
| componentsWithApprovedInlineVars | 6 | 6 |
| componentsWithRuntimeVars | 1 | 1 |
| approvedInlineVars | 12 | 12 |
| styleProps | 10 | 10 |
| setPropertyCalls | 2 | 2 |
| violations | 0 | 0 |
| reactGovernancePolicyIssues | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Components

| Component | Status | Allowed inline vars | Observed approved vars | Runtime CSS vars | Style props | Violations |
| --- | --- | --- | --- | --- | ---: | ---: |
| Avatar | pass | --comp-avatar-identity-bg, --comp-avatar-identity-fg | --comp-avatar-identity-bg, --comp-avatar-identity-fg | None | 1 | 0 |
| ChartPanel | pass | --comp-chart-panel-current-series, --comp-chart-panel-stagger-delay | --comp-chart-panel-current-series, --comp-chart-panel-stagger-delay | None | 4 | 0 |
| Skeleton | pass | --comp-skeleton-current-width, --comp-skeleton-current-height, --comp-skeleton-current-columns, --comp-skeleton-bone-current-inline-size, --comp-skeleton-bone-current-block-size, --comp-skeleton-bone-current-radius | --comp-skeleton-bone-current-block-size, --comp-skeleton-bone-current-inline-size, --comp-skeleton-bone-current-radius, --comp-skeleton-current-columns, --comp-skeleton-current-height, --comp-skeleton-current-width | None | 3 | 0 |
| Slider | pass | --comp-slider-percent | --comp-slider-percent | None | 1 | 0 |
| Tabs | pass | --comp-tabs-indicator-left, --comp-tabs-indicator-width | None | --comp-tabs-indicator-left, --comp-tabs-indicator-width | 0 | 0 |
| TreeView | pass | --comp-tree-view-level | --comp-tree-view-level | None | 1 | 0 |

## Violations

| Component | Rule | Location | Source |
| --- | --- | --- | --- |
| None | None | None | None |

