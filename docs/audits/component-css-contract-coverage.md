# Component CSS Contract Coverage

Status: pass

- Components: 56
- Direct contracts: 45
- Family contracts: 11
- Missing contracts: 0
- Family root gaps: 0

## Family Contract Policy

Family CSS contracts are allowed only when multiple accepted components intentionally share the same visual cascade contract instead of duplicating token/class rules.

| Shared contract | Required React root | Components covered |
| --- | --- | --- |
| choice | choice | checkbox, radio-button |
| date-picker | date-picker | date-range-picker |
| field | field | input, text-area, phone-input, card-number-input, card-expiry-input, card-security-code-input |
| select | select-control | combobox, country-selector |

## Family Root Gaps

| Component | Contract | Required root | Observed roots |
| --- | --- | --- | --- |
| None | None | None | None |

| Component | Coverage | Contract | Required root | Required root observed |
| --- | --- | --- | --- | --- |
| button | direct | button | n/a | n/a |
| select | direct | select | n/a | n/a |
| combobox | family | select | select-control | true |
| country-selector | family | select | select-control | true |
| card | direct | card | n/a | n/a |
| input | family | field | field | true |
| checkbox | family | choice | choice | true |
| switch | direct | switch | n/a | n/a |
| radio-button | family | choice | choice | true |
| text-area | family | field | field | true |
| icon-button | direct | icon-button | n/a | n/a |
| badge | direct | badge | n/a | n/a |
| chip | direct | chip | n/a | n/a |
| tag | direct | tag | n/a | n/a |
| tabs | direct | tabs | n/a | n/a |
| tooltip | direct | tooltip | n/a | n/a |
| toast | direct | toast | n/a | n/a |
| inline-validation | direct | inline-validation | n/a | n/a |
| progress-indicator | direct | progress-indicator | n/a | n/a |
| spinner | direct | spinner | n/a | n/a |
| skeleton | direct | skeleton | n/a | n/a |
| dialog | direct | dialog | n/a | n/a |
| menu | direct | menu | n/a | n/a |
| drawer | direct | drawer | n/a | n/a |
| accordion | direct | accordion | n/a | n/a |
| empty-state | direct | empty-state | n/a | n/a |
| table | direct | table | n/a | n/a |
| avatar | direct | avatar | n/a | n/a |
| slider | direct | slider | n/a | n/a |
| stepper | direct | stepper | n/a | n/a |
| list | direct | list | n/a | n/a |
| kpi-tile | direct | kpi-tile | n/a | n/a |
| chart-panel | direct | chart-panel | n/a | n/a |
| station-pin | direct | station-pin | n/a | n/a |
| route-summary | direct | route-summary | n/a | n/a |
| code-input | direct | code-input | n/a | n/a |
| phone-input | family | field | field | true |
| card-number-input | family | field | field | true |
| card-expiry-input | family | field | field | true |
| card-security-code-input | family | field | field | true |
| date-picker | direct | date-picker | n/a | n/a |
| date-range-picker | family | date-picker | date-picker | true |
| segmented-control | direct | segmented-control | n/a | n/a |
| popover | direct | popover | n/a | n/a |
| floating-action-button | direct | floating-action-button | n/a | n/a |
| card-summary | direct | card-summary | n/a | n/a |
| movement-row | direct | movement-row | n/a | n/a |
| quick-action | direct | quick-action | n/a | n/a |
| biometric-prompt | direct | biometric-prompt | n/a | n/a |
| breadcrumbs | direct | breadcrumbs | n/a | n/a |
| pagination | direct | pagination | n/a | n/a |
| audit-event | direct | audit-event | n/a | n/a |
| error-panel | direct | error-panel | n/a | n/a |
| tree-view | direct | tree-view | n/a | n/a |
| motion-boundary | direct | motion-boundary | n/a | n/a |
| animated-moment | direct | animated-moment | n/a | n/a |
