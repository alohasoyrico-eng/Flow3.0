# Component CSS Contract Coverage

Status: pass

- Components: 56
- Direct contracts: 49
- Family contracts: 7
- Missing contracts: 0
- Direct root gaps: 0
- Family root gaps: 0
- Undeclared family extension roots: 0

## Family Contract Policy

Family CSS contracts are allowed only when multiple accepted components intentionally share the same visual cascade contract; component-specific roots are explicit extension scopes and cannot multiply silently.

| Shared contract | Required React root | Allowed extension roots | Components covered |
| --- | --- | --- | --- |
| choice | choice | checkbox, radio | checkbox, radio-button |
| field | field | card-expiry-input, card-number-input, card-security-code-input | input, card-number-input, card-expiry-input, card-security-code-input |
| select | select-control | combobox, field | combobox |

## Direct Root Gaps

| Component | Contract | Required root | Observed roots |
| --- | --- | --- | --- |
| None | None | None | None |

## Family Root Gaps

| Component | Contract | Required root | Observed roots |
| --- | --- | --- | --- |
| None | None | None | None |

## Undeclared Family Extension Roots

| Component | Contract | Required root | Allowed extensions | Observed roots | Unexpected roots |
| --- | --- | --- | --- | --- | --- |
| None | None | None | None | None | None |

| Component | Coverage | Contract | Required root | Required root observed | Allowed extension roots | Unexpected roots |
| --- | --- | --- | --- | --- | --- | --- |
| button | direct | button | button | true | n/a | None |
| select | direct | select | select-control | true | n/a | None |
| combobox | family | select | select-control | true | combobox, field | None |
| country-selector | direct | country-selector | country-selector | true | n/a | None |
| card | direct | card | card | true | n/a | None |
| input | family | field | field | true | n/a | None |
| checkbox | family | choice | choice | true | checkbox | None |
| switch | direct | switch | switch | true | n/a | None |
| radio-button | family | choice | choice | true | radio | None |
| text-area | direct | text-area | text-area | true | n/a | None |
| icon-button | direct | icon-button | icon-button | true | n/a | None |
| badge | direct | badge | badge | true | n/a | None |
| chip | direct | chip | chip | true | n/a | None |
| tag | direct | tag | tag | true | n/a | None |
| tabs | direct | tabs | tabs | true | n/a | None |
| tooltip | direct | tooltip | tooltip | true | n/a | None |
| toast | direct | toast | toast | true | n/a | None |
| inline-validation | direct | inline-validation | inline-validation | true | n/a | None |
| progress-indicator | direct | progress-indicator | progress | true | n/a | None |
| spinner | direct | spinner | spinner | true | n/a | None |
| skeleton | direct | skeleton | skeleton | true | n/a | None |
| dialog | direct | dialog | dialog | true | n/a | None |
| menu | direct | menu | menu | true | n/a | None |
| drawer | direct | drawer | drawer | true | n/a | None |
| accordion | direct | accordion | accordion | true | n/a | None |
| empty-state | direct | empty-state | empty-state | true | n/a | None |
| table | direct | table | table | true | n/a | None |
| avatar | direct | avatar | avatar | true | n/a | None |
| slider | direct | slider | slider | true | n/a | None |
| stepper | direct | stepper | stepper | true | n/a | None |
| list | direct | list | list | true | n/a | None |
| kpi-tile | direct | kpi-tile | kpi-tile | true | n/a | None |
| chart-panel | direct | chart-panel | chart-panel | true | n/a | None |
| station-pin | direct | station-pin | station-pin | true | n/a | None |
| route-summary | direct | route-summary | route-summary | true | n/a | None |
| code-input | direct | code-input | code-input | true | n/a | None |
| phone-input | direct | phone-input | phone-input | true | n/a | None |
| card-number-input | family | field | field | true | card-number-input | None |
| card-expiry-input | family | field | field | true | card-expiry-input | None |
| card-security-code-input | family | field | field | true | card-security-code-input | None |
| date-picker | direct | date-picker | date-picker | true | n/a | None |
| date-range-picker | direct | date-range-picker | date-range-picker | true | n/a | None |
| segmented-control | direct | segmented-control | segmented-control | true | n/a | None |
| popover | direct | popover | popover | true | n/a | None |
| floating-action-button | direct | floating-action-button | fab | true | n/a | None |
| card-summary | direct | card-summary | card-summary | true | n/a | None |
| movement-row | direct | movement-row | movement-row | true | n/a | None |
| quick-action | direct | quick-action | quick-action | true | n/a | None |
| biometric-prompt | direct | biometric-prompt | biometric-prompt | true | n/a | None |
| breadcrumbs | direct | breadcrumbs | breadcrumbs | true | n/a | None |
| pagination | direct | pagination | pagination | true | n/a | None |
| audit-event | direct | audit-event | audit-event | true | n/a | None |
| error-panel | direct | error-panel | error-panel | true | n/a | None |
| tree-view | direct | tree-view | tree-view | true | n/a | None |
| motion-boundary | direct | motion-boundary | motion-boundary | true | n/a | None |
| animated-moment | direct | animated-moment | animated-moment | true | n/a | None |
