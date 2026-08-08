# Component CSS Contract Coverage

Status: pass

- Components: 56
- Direct contracts: 45
- Family contracts: 11
- Missing contracts: 0
- Direct root gaps: 0
- Family root gaps: 0

## Family Contract Policy

Family CSS contracts are allowed only when multiple accepted components intentionally share the same visual cascade contract instead of duplicating token/class rules.

| Shared contract | Required React root | Components covered |
| --- | --- | --- |
| choice | choice | checkbox, radio-button |
| date-picker | date-picker | date-range-picker |
| field | field | input, text-area, phone-input, card-number-input, card-expiry-input, card-security-code-input |
| select | select-control | combobox, country-selector |

## Direct Root Gaps

| Component | Contract | Required root | Observed roots |
| --- | --- | --- | --- |
| None | None | None | None |

## Family Root Gaps

| Component | Contract | Required root | Observed roots |
| --- | --- | --- | --- |
| None | None | None | None |

| Component | Coverage | Contract | Required root | Required root observed |
| --- | --- | --- | --- | --- |
| button | direct | button | button | true |
| select | direct | select | select-control | true |
| combobox | family | select | select-control | true |
| country-selector | family | select | select-control | true |
| card | direct | card | card | true |
| input | family | field | field | true |
| checkbox | family | choice | choice | true |
| switch | direct | switch | switch | true |
| radio-button | family | choice | choice | true |
| text-area | family | field | field | true |
| icon-button | direct | icon-button | icon-button | true |
| badge | direct | badge | badge | true |
| chip | direct | chip | chip | true |
| tag | direct | tag | tag | true |
| tabs | direct | tabs | tabs | true |
| tooltip | direct | tooltip | tooltip | true |
| toast | direct | toast | toast | true |
| inline-validation | direct | inline-validation | inline-validation | true |
| progress-indicator | direct | progress-indicator | progress | true |
| spinner | direct | spinner | spinner | true |
| skeleton | direct | skeleton | skeleton | true |
| dialog | direct | dialog | dialog | true |
| menu | direct | menu | menu | true |
| drawer | direct | drawer | drawer | true |
| accordion | direct | accordion | accordion | true |
| empty-state | direct | empty-state | empty-state | true |
| table | direct | table | table | true |
| avatar | direct | avatar | avatar | true |
| slider | direct | slider | slider | true |
| stepper | direct | stepper | stepper | true |
| list | direct | list | list | true |
| kpi-tile | direct | kpi-tile | kpi-tile | true |
| chart-panel | direct | chart-panel | chart-panel | true |
| station-pin | direct | station-pin | station-pin | true |
| route-summary | direct | route-summary | route-summary | true |
| code-input | direct | code-input | code-input | true |
| phone-input | family | field | field | true |
| card-number-input | family | field | field | true |
| card-expiry-input | family | field | field | true |
| card-security-code-input | family | field | field | true |
| date-picker | direct | date-picker | date-picker | true |
| date-range-picker | family | date-picker | date-picker | true |
| segmented-control | direct | segmented-control | segmented-control | true |
| popover | direct | popover | popover | true |
| floating-action-button | direct | floating-action-button | fab | true |
| card-summary | direct | card-summary | card-summary | true |
| movement-row | direct | movement-row | movement-row | true |
| quick-action | direct | quick-action | quick-action | true |
| biometric-prompt | direct | biometric-prompt | biometric-prompt | true |
| breadcrumbs | direct | breadcrumbs | breadcrumbs | true |
| pagination | direct | pagination | pagination | true |
| audit-event | direct | audit-event | audit-event | true |
| error-panel | direct | error-panel | error-panel | true |
| tree-view | direct | tree-view | tree-view | true |
| motion-boundary | direct | motion-boundary | motion-boundary | true |
| animated-moment | direct | animated-moment | animated-moment | true |
