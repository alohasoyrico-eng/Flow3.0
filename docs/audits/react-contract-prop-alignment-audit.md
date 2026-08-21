# React Contract Prop Alignment Audit

Status: **pass**

The public React prop surface must stay aligned with componentContracts so product teams can trust generated docs, types, and platform metadata as one contract. The actionable debt metric is propAlignmentDebt.

## Inventory

- React components scanned: 61
- Prop alignment debt: 0
- Pass: 61
- Fail: 0
- Contract props: 740
- Public React props: 620
- Semantic inherited props: 1
- Contract props satisfied by React DOM inheritance: 28
- Extra React props: 0
- Missing React props: 0
- Required mismatches: 0
- Type value mismatches: 0
- Public props expected in source: 621
- Unreferenced public props: 0
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. propAlignmentDebt must stay at 0; public React props, system contract props, inherited props, and implementation references must move together.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| components | 61 | 61 |
| propAlignmentDebt | 0 | 0 |
| pass | 61 | 61 |
| fail | 0 | 0 |
| contractProps | 740 | 740 |
| publicReactProps | 620 | 620 |
| semanticInheritedProps | 1 | 1 |
| inheritedContractProps | 28 | 28 |
| extraReactProps | 0 | 0 |
| missingReactProps | 0 | 0 |
| requiredMismatches | 0 | 0 |
| typeValueMismatches | 0 | 0 |
| publicPropsExpectedInSource | 621 | 621 |
| unreferencedPublicProps | 0 | 0 |
| reactGovernancePolicyIssues | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Components

| Component | Status | Contract props | React props | Source props | Extra React props | Missing React props | Required mismatches | Type value mismatches | Unreferenced public props |
| --- | --- | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| Accordion | pass | 6 | 6 | 6 | None | None | None | None | None |
| AnimatedMoment | pass | 11 | 11 | 11 | None | None | None | None | None |
| AuditEvent | pass | 9 | 9 | 9 | None | None | None | None | None |
| Avatar | pass | 5 | 4 | 4 | None | None | None | None | None |
| Badge | pass | 9 | 9 | 9 | None | None | None | None | None |
| BiometricPrompt | pass | 11 | 11 | 11 | None | None | None | None | None |
| Breadcrumbs | pass | 10 | 9 | 9 | None | None | None | None | None |
| Button | pass | 11 | 9 | 9 | None | None | None | None | None |
| Card | pass | 21 | 18 | 18 | None | None | None | None | None |
| CardExpiryInput | pass | 14 | 9 | 9 | None | None | None | None | None |
| CardNumberInput | pass | 13 | 8 | 8 | None | None | None | None | None |
| CardSecurityCodeInput | pass | 18 | 13 | 13 | None | None | None | None | None |
| CardSummary | pass | 12 | 11 | 11 | None | None | None | None | None |
| ChartPanel | pass | 14 | 13 | 13 | None | None | None | None | None |
| ChatComposer | pass | 13 | 11 | 11 | None | None | None | None | None |
| ChatMessage | pass | 10 | 10 | 10 | None | None | None | None | None |
| ChatThread | pass | 9 | 9 | 9 | None | None | None | None | None |
| Checkbox | pass | 13 | 8 | 8 | None | None | None | None | None |
| Chip | pass | 13 | 12 | 12 | None | None | None | None | None |
| CodeBlock | pass | 12 | 11 | 11 | None | None | None | None | None |
| CodeInput | pass | 12 | 10 | 10 | None | None | None | None | None |
| Combobox | pass | 18 | 14 | 14 | None | None | None | None | None |
| CountrySelector | pass | 14 | 12 | 12 | None | None | None | None | None |
| DatePicker | pass | 19 | 14 | 14 | None | None | None | None | None |
| DateRangePicker | pass | 21 | 18 | 18 | None | None | None | None | None |
| Dialog | pass | 15 | 14 | 14 | None | None | None | None | None |
| Drawer | pass | 17 | 16 | 16 | None | None | None | None | None |
| EmptyState | pass | 9 | 8 | 8 | None | None | None | None | None |
| ErrorPanel | pass | 11 | 10 | 10 | None | None | None | None | None |
| FloatingActionButton | pass | 10 | 8 | 8 | None | None | None | None | None |
| IconButton | pass | 9 | 5 | 5 | None | None | None | None | None |
| InlineValidation | pass | 9 | 7 | 7 | None | None | None | None | None |
| Input | pass | 29 | 22 | 22 | None | None | None | None | None |
| InputAmount | pass | 18 | 13 | 13 | None | None | None | None | None |
| KpiTile | pass | 15 | 12 | 12 | None | None | None | None | None |
| List | pass | 8 | 8 | 8 | None | None | None | None | None |
| Menu | pass | 13 | 12 | 12 | None | None | None | None | None |
| MotionBoundary | pass | 8 | 8 | 8 | None | None | None | None | None |
| MovementRow | pass | 11 | 10 | 10 | None | None | None | None | None |
| Pagination | pass | 12 | 11 | 11 | None | None | None | None | None |
| PhoneInput | pass | 13 | 11 | 11 | None | None | None | None | None |
| Popover | pass | 15 | 12 | 12 | None | None | None | None | None |
| ProgressIndicator | pass | 10 | 8 | 8 | None | None | None | None | None |
| QuickAction | pass | 11 | 9 | 9 | None | None | None | None | None |
| RadioButton | pass | 12 | 7 | 7 | None | None | None | None | None |
| RouteSummary | pass | 12 | 11 | 11 | None | None | None | None | None |
| SegmentedControl | pass | 6 | 6 | 6 | None | None | None | None | None |
| Select | pass | 15 | 12 | 12 | None | None | None | None | None |
| Skeleton | pass | 11 | 10 | 10 | None | None | None | None | None |
| Slider | pass | 14 | 9 | 9 | None | None | None | None | None |
| Spinner | pass | 5 | 5 | 5 | None | None | None | None | None |
| StationPin | pass | 12 | 10 | 11 | None | None | None | None | None |
| Stepper | pass | 5 | 5 | 5 | None | None | None | None | None |
| Switch | pass | 10 | 6 | 6 | None | None | None | None | None |
| Table | pass | 16 | 15 | 15 | None | None | None | None | None |
| Tabs | pass | 6 | 6 | 6 | None | None | None | None | None |
| Tag | pass | 8 | 7 | 7 | None | None | None | None | None |
| TextArea | pass | 15 | 8 | 8 | None | None | None | None | None |
| Toast | pass | 14 | 14 | 14 | None | None | None | None | None |
| Tooltip | pass | 10 | 8 | 8 | None | None | None | None | None |
| TreeView | pass | 8 | 8 | 8 | None | None | None | None | None |

## Type Value Mismatches

| Component | Prop | Contract values | React values |
| --- | --- | --- | --- |
| None | None | None | None |

## Failures

| Component | Failure |
| --- | --- |
| None | None |

