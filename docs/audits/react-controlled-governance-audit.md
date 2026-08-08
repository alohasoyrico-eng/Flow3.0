# React Controlled Governance Audit

Status: **pass**

Controlled React props must be explicit in source and covered by external rerender tests so product code can own state without hidden uncontrolled drift.

## Inventory

- React components scanned: 56
- Controlled components: 28
- Open-controlled components: 10
- Controlled prop edges: 25
- Tested controlled prop edges: 25
- Failures: 0

## Components

| Component | Status | Open contract | Open source | Open test | Controlled props | Failures |
| --- | --- | --- | --- | --- | --- | --- |
| Accordion | pass | no | no | no | expandedIds:tested | None |
| CardExpiryInput | pass | no | no | no | value:tested | None |
| CardNumberInput | pass | no | no | no | value:tested | None |
| CardSecurityCodeInput | pass | no | no | no | value:tested | None |
| Checkbox | pass | no | no | no | checked:tested | None |
| CodeInput | pass | no | no | no | value:tested | None |
| Combobox | pass | yes | yes | yes | value:tested | None |
| CountrySelector | pass | yes | yes | yes | value:tested | None |
| DatePicker | pass | yes | yes | yes | value:tested | None |
| DateRangePicker | pass | yes | yes | yes | value:tested | None |
| Dialog | pass | yes | yes | yes | None | None |
| Drawer | pass | yes | yes | yes | None | None |
| Input | pass | no | no | no | value:tested | None |
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
| Table | pass | no | no | no | selectedKey:tested, sortKey:tested, expandedKey:tested | None |
| Tabs | pass | no | no | no | selectedKey:tested | None |
| TextArea | pass | no | no | no | value:tested | None |
| Tooltip | pass | yes | yes | yes | None | None |
| TreeView | pass | no | no | no | selectedKey:tested | None |

