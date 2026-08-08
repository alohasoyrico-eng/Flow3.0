# Family CSS Contract Maturity

Status: **pass**

Family CSS contracts are allowed when a component shares a visual cascade; large component-specific selector or alias surface should be visible as a graduation candidate before it becomes accidental duplication.

## Inventory

- Family components: 9
- Review candidates: 4
- Shared extension roots excluded from maturity counts: country-flag, field
- Selector threshold: 20
- Alias threshold: 40

## Review Candidates

| Component | Family contract | Own extension roots | Selectors | Aliases | Reason |
| --- | --- | --- | ---: | ---: | --- |
| checkbox | choice | checkbox | 17 | 79 | component aliases 79 >= 40 |
| radio-button | choice | radio | 14 | 78 | component aliases 78 >= 40 |
| text-area | field | text-area | 15 | 60 | component aliases 60 >= 40 |
| date-range-picker | date-picker | date-range-picker | 10 | 62 | component aliases 62 >= 40 |

## Family Components

| Component | Family contract | Required root | Own extension roots | Shared extension roots | Selectors | Aliases | Recommendation |
| --- | --- | --- | --- | --- | ---: | ---: | --- |
| combobox | select | select-control | combobox | field | 11 | 35 | keep-family |
| input | field | field | None | None | 0 | 0 | keep-family |
| checkbox | choice | choice | checkbox | None | 17 | 79 | review-for-direct-contract |
| radio-button | choice | choice | radio | None | 14 | 78 | review-for-direct-contract |
| text-area | field | field | text-area | None | 15 | 60 | review-for-direct-contract |
| card-number-input | field | field | card-number-input | None | 8 | 14 | keep-family |
| card-expiry-input | field | field | card-expiry-input | None | 9 | 6 | keep-family |
| card-security-code-input | field | field | card-security-code-input | None | 12 | 11 | keep-family |
| date-range-picker | date-picker | date-picker | date-range-picker | field | 10 | 62 | review-for-direct-contract |

