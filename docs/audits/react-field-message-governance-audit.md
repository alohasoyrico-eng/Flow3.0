# React Field Message Governance Audit

Status: **pass**

Field feedback must have one semantic contract for message id, aria-describedby, aria-invalid, live-region role, and feedback state. Existing local helpers are migration backlog; new local helpers are blocked.

## Inventory

- Field message sources: 12
- Shared field-message sources: 1
- Legacy local field-message backlog: 11
- Expected legacy local backlog: 11
- Resolved legacy local sources: 0
- Unexpected local field-message sources: 0
- Contract issues: 0
- Field message governance debt: 0

## Field Helper Sources

| Component | Contract | Error-only invalid | Live role | File |
| --- | --- | --- | --- | --- |
| CardExpiryInput | local-field-helper | yes | no | packages/react/src/CardExpiryInput.tsx |
| CardNumberInput | local-field-helper | yes | no | packages/react/src/CardNumberInput.tsx |
| CardSecurityCodeInput | local-field-helper | yes | no | packages/react/src/CardSecurityCodeInput.tsx |
| CodeInput | local-field-helper | yes | yes | packages/react/src/CodeInput.tsx |
| Combobox | local-field-helper | yes | no | packages/react/src/Combobox.tsx |
| DatePicker | local-field-helper | no | no | packages/react/src/DatePicker.tsx |
| DateRangePicker | local-field-helper | no | no | packages/react/src/DateRangePicker.tsx |
| Input | shared-field-message | no | yes | packages/react/src/Input.tsx |
| InputAmount | local-field-helper | yes | no | packages/react/src/InputAmount.tsx |
| PhoneInput | local-field-helper | yes | yes | packages/react/src/PhoneInput.tsx |
| Select | local-field-helper | yes | no | packages/react/src/Select.tsx |
| TextArea | local-field-helper | yes | yes | packages/react/src/TextArea.tsx |

## Issues

| Rule | File | Message |
| --- | --- | --- |
| None | None | None |

