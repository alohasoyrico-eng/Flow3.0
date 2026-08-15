# React Production Readiness

Status: **pass**

Production readiness is not inferred from visual parity or TS build success; every public React component needs explicit API, runtime, interaction, accessibility, and family-specific evidence.

## Inventory

- Plan iteration: 1
- Public React components: 63
- Ready components: 0
- Partial components: 63
- Blocked components: 0
- P0 components: 21
- P1 components: 18
- P2 components: 24
- Missing contracts: 1
- Missing direct test evidence: 1
- Structural issues: 0
- React production readiness harness debt: 0

## Test Capability Snapshot

- Testing Library render calls: 161
- fireEvent calls: 446
- getByRole calls: 258
- getByLabelText calls: 12
- keyDown calls: 19
- Escape key checks: 8
- Arrow key checks: 12
- user-event usage: 2
- axe usage: 2

## Harness Issues

- None

## Component Matrix

| Slug | Component | Priority | Family | Status | Contract | Test files | Evidence gaps | Structural issues |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| accordion | Accordion | P2 | navigation-disclosure | partial | yes | 3 | family-specific production checks not yet certified | None |
| animated-moment | AnimatedMoment | P2 | motion-feedback | partial | yes | 2 | family-specific production checks not yet certified | None |
| audit-event | AuditEvent | P2 | domain-event | partial | yes | 3 | family-specific production checks not yet certified | None |
| avatar | Avatar | P2 | display-status | partial | yes | 3 | family-specific production checks not yet certified | None |
| badge | Badge | P2 | display-status | partial | yes | 3 | family-specific production checks not yet certified | None |
| biometric-prompt | BiometricPrompt | P2 | domain-auth | partial | yes | 2 | family-specific production checks not yet certified | None |
| breadcrumbs | Breadcrumbs | P2 | navigation-disclosure | partial | yes | 3 | family-specific production checks not yet certified | None |
| button | Button | P1 | actions | partial | yes | 8 | family-specific production checks not yet certified | None |
| card | Card | P2 | surface-display | partial | yes | 5 | family-specific production checks not yet certified | None |
| card-expiry-input | CardExpiryInput | P0 | forms-payment | partial | yes | 3 | family-specific production checks not yet certified | None |
| card-number-input | CardNumberInput | P0 | forms-payment | partial | yes | 3 | family-specific production checks not yet certified | None |
| card-security-code-input | CardSecurityCodeInput | P0 | forms-payment | partial | yes | 3 | family-specific production checks not yet certified | None |
| card-summary | CardSummary | P2 | domain-payment | partial | yes | 2 | family-specific production checks not yet certified | None |
| chart-panel | ChartPanel | P2 | data-display | partial | yes | 2 | family-specific production checks not yet certified | None |
| chat-composer | ChatComposer | P2 | domain-chat | partial | yes | 2 | family-specific production checks not yet certified | None |
| chat-message | ChatMessage | P2 | domain-chat | partial | yes | 2 | family-specific production checks not yet certified | None |
| chat-thread | ChatThread | P2 | domain-chat | partial | yes | 2 | family-specific production checks not yet certified | None |
| checkbox | Checkbox | P0 | forms | partial | yes | 4 | family-specific production checks not yet certified | None |
| chip | Chip | P2 | display-status | partial | yes | 4 | family-specific production checks not yet certified | None |
| code-block | CodeBlock | P1 | documentation-code | partial | yes | 0 | missing direct test evidence; family-specific production checks not yet certified | None |
| code-input | CodeInput | P0 | forms | partial | yes | 3 | family-specific production checks not yet certified | None |
| combobox | Combobox | P0 | forms | partial | yes | 4 | family-specific production checks not yet certified | None |
| copy-button | CopyButton | P1 | actions | partial | yes | 1 | family-specific production checks not yet certified | None |
| country-selector | CountrySelector | P0 | forms | partial | yes | 2 | family-specific production checks not yet certified | None |
| date-picker | DatePicker | P0 | forms-date | partial | yes | 3 | family-specific production checks not yet certified | None |
| date-range-picker | DateRangePicker | P0 | forms-date | partial | yes | 4 | family-specific production checks not yet certified | None |
| dialog | Dialog | P0 | overlays-feedback | partial | yes | 6 | family-specific production checks not yet certified | None |
| drawer | Drawer | P0 | overlays-feedback | partial | yes | 7 | family-specific production checks not yet certified | None |
| empty-state | EmptyState | P1 | feedback | partial | yes | 3 | family-specific production checks not yet certified | None |
| error-panel | ErrorPanel | P1 | feedback | partial | yes | 3 | family-specific production checks not yet certified | None |
| floating-action-button | FloatingActionButton | P1 | actions | partial | yes | 1 | family-specific production checks not yet certified | None |
| icon-button | IconButton | P1 | actions | partial | yes | 3 | family-specific production checks not yet certified | None |
| inline-validation | InlineValidation | P1 | feedback | partial | yes | 2 | family-specific production checks not yet certified | None |
| input | Input | P0 | forms | partial | yes | 4 | family-specific production checks not yet certified | None |
| input-amount | InputAmount | P2 | forms-payment | partial | yes | 2 | family-specific production checks not yet certified | None |
| kpi-tile | KpiTile | P2 | data-display | partial | yes | 3 | family-specific production checks not yet certified | None |
| list | List | P1 | data-display | partial | yes | 5 | family-specific production checks not yet certified | None |
| menu | Menu | P0 | overlays-feedback | partial | yes | 4 | family-specific production checks not yet certified | None |
| motion-boundary | MotionBoundary | P2 | motion-feedback | partial | yes | 2 | family-specific production checks not yet certified | None |
| movement-row | MovementRow | P2 | domain-fleet | partial | yes | 3 | family-specific production checks not yet certified | None |
| pagination | Pagination | P1 | navigation-disclosure | partial | yes | 4 | family-specific production checks not yet certified | None |
| phone-input | PhoneInput | P0 | forms | partial | yes | 3 | family-specific production checks not yet certified | None |
| popover | Popover | P0 | overlays-feedback | partial | yes | 4 | family-specific production checks not yet certified | None |
| progress-indicator | ProgressIndicator | P1 | feedback | partial | yes | 1 | family-specific production checks not yet certified | None |
| quick-action | QuickAction | P1 | actions | partial | yes | 4 | family-specific production checks not yet certified | None |
| radio-button | RadioButton | P0 | forms | partial | yes | 2 | family-specific production checks not yet certified | None |
| route-summary | RouteSummary | P2 | domain-fleet | partial | yes | 3 | family-specific production checks not yet certified | None |
| segmented-control | SegmentedControl | P1 | navigation-disclosure | partial | yes | 2 | family-specific production checks not yet certified | None |
| select | Select | P0 | forms | partial | yes | 5 | family-specific production checks not yet certified | None |
| skeleton | Skeleton | P2 | feedback | partial | yes | 2 | family-specific production checks not yet certified | None |
| slider | Slider | P0 | forms | partial | yes | 2 | family-specific production checks not yet certified | None |
| spinner | Spinner | P2 | feedback | partial | yes | 2 | family-specific production checks not yet certified | None |
| station-pin | StationPin | P2 | domain-fleet | partial | yes | 3 | family-specific production checks not yet certified | None |
| stepper | Stepper | P1 | navigation-disclosure | partial | yes | 2 | family-specific production checks not yet certified | None |
| surface | Surface | P2 | surface-display | partial | no | 5 | missing component contract; family-specific production checks not yet certified | None |
| switch | Switch | P0 | forms | partial | yes | 6 | family-specific production checks not yet certified | None |
| table | Table | P1 | data-display | partial | yes | 5 | family-specific production checks not yet certified | None |
| tabs | Tabs | P0 | navigation-disclosure | partial | yes | 2 | family-specific production checks not yet certified | None |
| tag | Tag | P2 | display-status | partial | yes | 4 | family-specific production checks not yet certified | None |
| text-area | TextArea | P0 | forms | partial | yes | 3 | family-specific production checks not yet certified | None |
| toast | Toast | P1 | feedback | partial | yes | 4 | family-specific production checks not yet certified | None |
| tooltip | Tooltip | P1 | overlays-feedback | partial | yes | 4 | family-specific production checks not yet certified | None |
| tree-view | TreeView | P1 | navigation-disclosure | partial | yes | 2 | family-specific production checks not yet certified | None |

