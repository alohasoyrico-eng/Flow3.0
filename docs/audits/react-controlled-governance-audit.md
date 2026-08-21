# React Controlled Governance Audit

Status: **pass**

Controlled React props must be explicit in source and covered by external rerender tests so product code can own state without hidden uncontrolled drift. The actionable debt metric is controlledDebt.

## Inventory

- React components scanned: 61
- Controlled debt: 0
- Controlled components: 31
- Open-controlled components: 10
- Open source covered: 10/10
- Open test covered: 10/10
- Controlled prop edges: 30
- Total controlled edges: 40
- Tested controlled prop edges: 30
- Total tested controlled edges: 40
- Failures: 0
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. controlledDebt must stay at 0; controlled APIs should only grow with explicit source support and rerender tests, and they should not shrink silently.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| components | 61 | 61 |
| controlledDebt | 0 | 0 |
| controlledComponents | 31 | 31 |
| openControlledComponents | 10 | 10 |
| openSourceCovered | 10 | 10 |
| openTestCovered | 10 | 10 |
| controlledPropEdges | 30 | 30 |
| totalControlledEdges | 40 | 40 |
| testCoveredEdges | 30 | 30 |
| totalTestCoveredEdges | 40 | 40 |
| failures | 0 | 0 |
| reactGovernancePolicyIssues | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Components

| Component | Status | Open contract | Open source | Open test | Controlled props | Failures |
| --- | --- | --- | --- | --- | --- | --- |
| Accordion | pass | no | no | no | expandedIds:tested | None |
| CardExpiryInput | pass | no | no | no | value:tested | None |
| CardNumberInput | pass | no | no | no | value:tested | None |
| CardSecurityCodeInput | pass | no | no | no | value:tested | None |
| ChatComposer | pass | no | no | no | value:tested | None |
| Checkbox | pass | no | no | no | checked:tested | None |
| CodeInput | pass | no | no | no | value:tested | None |
| Combobox | pass | yes | yes | yes | value:tested | None |
| CountrySelector | pass | yes | yes | yes | value:tested | None |
| DatePicker | pass | yes | yes | yes | value:tested | None |
| DateRangePicker | pass | yes | yes | yes | value:tested | None |
| Dialog | pass | yes | yes | yes | None | None |
| Drawer | pass | yes | yes | yes | None | None |
| Input | pass | no | no | no | value:tested | None |
| InputAmount | pass | no | no | no | value:tested | None |
| List | pass | no | no | no | selectedKey:tested | None |
| Menu | pass | yes | yes | yes | None | None |
| Pagination | pass | no | no | no | page:tested | None |
| PhoneInput | pass | no | no | no | value:tested | None |
| Popover | pass | yes | yes | yes | None | None |
| RadioButton | pass | no | no | no | checked:tested | None |
| SegmentedControl | pass | no | no | no | selectedKey:tested | None |
| Select | pass | yes | yes | yes | value:tested | None |
| Slider | pass | no | no | no | value:tested | None |
| Switch | pass | no | no | no | checked:tested | None |
| Table | pass | no | no | no | selectedKey:tested, sortKey:tested, sortDir:tested, expandedKey:tested | None |
| Tabs | pass | no | no | no | selectedKey:tested | None |
| TextArea | pass | no | no | no | value:tested | None |
| Toast | pass | no | no | no | dismissed:tested | None |
| Tooltip | pass | yes | yes | yes | None | None |
| TreeView | pass | no | no | no | selectedKey:tested, expandedKeys:tested | None |

