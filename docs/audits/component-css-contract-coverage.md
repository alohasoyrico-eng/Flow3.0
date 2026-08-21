# Component CSS Contract Coverage

Status: pass

- Components: 61
- CSS contract debt: 0
- Direct contracts: 56
- Family contracts: 5
- Missing contracts: 0
- Direct root gaps: 0
- Family root gaps: 0
- Undeclared family extension roots: 0
- Inventory baseline mismatches: 0
- Family baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. cssContractDebt must stay at 0; a new family contract or reduced direct coverage must be reviewed instead of silently widening cascade behavior.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| total | 61 | 61 |
| cssContractDebt | 0 | 0 |
| direct | 56 | 56 |
| family | 5 | 5 |
| missing | 0 | 0 |
| directRootGaps | 0 | 0 |
| familyRootGaps | 0 | 0 |
| familyUnexpectedRoots | 0 | 0 |
| componentCssGovernanceIssues | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Family Contract Baseline

| Shared contract | Required React root | Allowed extension roots | Components covered |
| --- | --- | --- | --- |
| field | field | card-expiry-input, card-number-input, card-security-code-input, input-amount | input, input-amount, card-number-input, card-expiry-input, card-security-code-input |

## Family Contract Baseline Mismatches

| Contract | Field | Expected | Actual |
| --- | --- | --- | --- |
| None | None | None | None |

## Family Contract Policy

Family CSS contracts are allowed only when multiple accepted components intentionally share the same visual cascade contract; component-specific roots are explicit extension scopes and cannot multiply silently.

| Shared contract | Required React root | Allowed extension roots | Components covered |
| --- | --- | --- | --- |
| field | field | card-expiry-input, card-number-input, card-security-code-input, input-amount | card-expiry-input, card-number-input, card-security-code-input, input, input-amount |

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
| accordion | direct | accordion | accordion | true | n/a | None |
| animated-moment | direct | animated-moment | animated-moment | true | n/a | None |
| audit-event | direct | audit-event | audit-event | true | n/a | None |
| avatar | direct | avatar | avatar | true | n/a | None |
| badge | direct | badge | badge | true | n/a | None |
| biometric-prompt | direct | biometric-prompt | biometric-prompt | true | n/a | None |
| breadcrumbs | direct | breadcrumbs | breadcrumbs | true | n/a | None |
| button | direct | button | button | true | n/a | None |
| card | direct | card | card | true | n/a | None |
| card-expiry-input | family | field | field | true | card-expiry-input | None |
| card-number-input | family | field | field | true | card-number-input | None |
| card-security-code-input | family | field | field | true | card-security-code-input | None |
| card-summary | direct | card-summary | card-summary | true | n/a | None |
| chart-panel | direct | chart-panel | chart-panel | true | n/a | None |
| chat-composer | direct | chat-composer | chat-composer | true | n/a | None |
| chat-message | direct | chat-message | chat-message | true | n/a | None |
| chat-thread | direct | chat-thread | chat-thread | true | n/a | None |
| checkbox | direct | checkbox | checkbox | true | n/a | None |
| chip | direct | chip | chip | true | n/a | None |
| code-block | direct | code-block | code-block | true | n/a | None |
| code-input | direct | code-input | code-input | true | n/a | None |
| combobox | direct | combobox | combobox | true | n/a | None |
| country-selector | direct | country-selector | country-selector | true | n/a | None |
| date-picker | direct | date-picker | date-picker | true | n/a | None |
| date-range-picker | direct | date-range-picker | date-range-picker | true | n/a | None |
| dialog | direct | dialog | dialog | true | n/a | None |
| drawer | direct | drawer | drawer | true | n/a | None |
| empty-state | direct | empty-state | empty-state | true | n/a | None |
| error-panel | direct | error-panel | error-panel | true | n/a | None |
| floating-action-button | direct | floating-action-button | fab | true | n/a | None |
| icon-button | direct | icon-button | icon-button | true | n/a | None |
| inline-validation | direct | inline-validation | inline-validation | true | n/a | None |
| input | family | field | field | true | n/a | None |
| input-amount | family | field | field | true | input-amount | None |
| kpi-tile | direct | kpi-tile | kpi-tile | true | n/a | None |
| list | direct | list | list | true | n/a | None |
| menu | direct | menu | menu | true | n/a | None |
| motion-boundary | direct | motion-boundary | motion-boundary | true | n/a | None |
| movement-row | direct | movement-row | movement-row | true | n/a | None |
| pagination | direct | pagination | pagination | true | n/a | None |
| phone-input | direct | phone-input | phone-input | true | n/a | None |
| popover | direct | popover | popover | true | n/a | None |
| progress-indicator | direct | progress-indicator | progress | true | n/a | None |
| quick-action | direct | quick-action | quick-action | true | n/a | None |
| radio-button | direct | radio-button | radio | true | n/a | None |
| route-summary | direct | route-summary | route-summary | true | n/a | None |
| segmented-control | direct | segmented-control | segmented-control | true | n/a | None |
| select | direct | select | select-control | true | n/a | None |
| skeleton | direct | skeleton | skeleton | true | n/a | None |
| slider | direct | slider | slider | true | n/a | None |
| spinner | direct | spinner | spinner | true | n/a | None |
| station-pin | direct | station-pin | station-pin | true | n/a | None |
| stepper | direct | stepper | stepper | true | n/a | None |
| switch | direct | switch | switch | true | n/a | None |
| table | direct | table | table | true | n/a | None |
| tabs | direct | tabs | tabs | true | n/a | None |
| tag | direct | tag | tag | true | n/a | None |
| text-area | direct | text-area | text-area | true | n/a | None |
| toast | direct | toast | toast | true | n/a | None |
| tooltip | direct | tooltip | tooltip | true | n/a | None |
| tree-view | direct | tree-view | tree-view | true | n/a | None |
