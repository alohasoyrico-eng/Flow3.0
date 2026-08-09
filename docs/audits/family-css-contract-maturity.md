# Family CSS Contract Maturity

Status: **pass**

Family CSS contracts are allowed when a component shares a visual cascade; large component-specific selector or alias surface should be visible as a graduation candidate before it becomes accidental duplication.

## Inventory

- Family components: 5
- Review candidates: 0
- Watchlist: 1
- Shared extension roots excluded from maturity counts: country-flag, field
- Selector threshold: 20
- Alias threshold: 40
- Watchlist starts at: 80% of each threshold

## Review Candidates

| Component | Family contract | Own extension roots | Selectors | Aliases | Reason |
| --- | --- | --- | ---: | ---: | --- |
| None | None | None | 0 | 0 | None |

## Watchlist

| Component | Family contract | Own extension roots | Selectors | Aliases | Reason |
| --- | --- | --- | ---: | ---: | --- |
| combobox | select | combobox | 11 | 35 | component aliases 35 is within 80% of 40 |

## Family Components

| Component | Family contract | Required root | Own extension roots | Shared extension roots | Selectors | Aliases | Recommendation |
| --- | --- | --- | --- | --- | ---: | ---: | --- |
| combobox | select | select-control | combobox | field | 11 | 35 | keep-family |
| input | field | field | None | None | 0 | 0 | keep-family |
| card-number-input | field | field | card-number-input | None | 8 | 14 | keep-family |
| card-expiry-input | field | field | card-expiry-input | None | 9 | 6 | keep-family |
| card-security-code-input | field | field | card-security-code-input | None | 12 | 11 | keep-family |

