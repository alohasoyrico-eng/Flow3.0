# React Field Message Governance Audit

Status: **pass**

Field feedback must have one semantic contract for message id, aria-describedby, aria-invalid, live-region role, and feedback state. Existing local helpers are migration backlog; new local helpers are blocked.

## Inventory

- Field message sources: 12
- Shared field-message sources: 12
- Legacy local field-message backlog: 0
- Expected legacy local backlog: 11
- Resolved legacy local sources: 11
- Unexpected local field-message sources: 0
- Contract issues: 0
- Field message governance debt: 0

## Field Helper Sources

| Component | Contract | Error-only invalid | Live role | File |
| --- | --- | --- | --- | --- |
| CardExpiryInput | shared-field-message | yes | yes | packages/react/src/CardExpiryInput.tsx |
| CardNumberInput | shared-field-message | yes | yes | packages/react/src/CardNumberInput.tsx |
| CardSecurityCodeInput | shared-field-message | yes | yes | packages/react/src/CardSecurityCodeInput.tsx |
| CodeInput | shared-field-message | yes | yes | packages/react/src/CodeInput.tsx |
| Combobox | shared-field-message | yes | yes | packages/react/src/Combobox.tsx |
| DatePicker | shared-field-message | yes | yes | packages/react/src/DatePicker.tsx |
| DateRangePicker | shared-field-message | yes | yes | packages/react/src/DateRangePicker.tsx |
| Input | shared-field-message | yes | yes | packages/react/src/Input.tsx |
| InputAmount | shared-field-message | yes | yes | packages/react/src/InputAmount.tsx |
| PhoneInput | shared-field-message | yes | yes | packages/react/src/PhoneInput.tsx |
| Select | shared-field-message | yes | yes | packages/react/src/Select.tsx |
| TextArea | shared-field-message | yes | yes | packages/react/src/TextArea.tsx |

## Issues

| Rule | File | Message |
| --- | --- | --- |
| None | None | None |

