# React Production Readiness

Status: **pass**

Production readiness is not inferred from visual parity or TS build success; every public React component needs explicit API, runtime, interaction, accessibility, and family-specific evidence.

## Inventory

- Plan iteration: 1
- Public React components: 63
- Ready components: 63
- Partial components: 0
- Blocked components: 0
- P0 components: 21
- P1 components: 18
- P2 components: 24
- Missing contracts: 0
- Missing direct test evidence: 0
- Structural issues: 0
- React production readiness harness debt: 0

## Test Capability Snapshot

- Testing Library render calls: 228
- fireEvent calls: 507
- getByRole calls: 431
- getByLabelText calls: 19
- keyDown calls: 58
- Escape key checks: 23
- Arrow key checks: 31
- user-event usage: 32
- axe usage: 19

## Harness Issues

- None

## Component Matrix

| Slug | Component | Priority | Family | Status | Contract | Test files | Evidence gaps | Structural issues |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| accordion | Accordion | P2 | navigation-disclosure | ready | yes | 4 | None | None |
| animated-moment | AnimatedMoment | P2 | motion-feedback | ready | yes | 3 | None | None |
| audit-event | AuditEvent | P2 | domain-event | ready | yes | 4 | None | None |
| avatar | Avatar | P2 | display-status | ready | yes | 5 | None | None |
| badge | Badge | P2 | display-status | ready | yes | 6 | None | None |
| biometric-prompt | BiometricPrompt | P2 | domain-auth | ready | yes | 3 | None | None |
| breadcrumbs | Breadcrumbs | P2 | navigation-disclosure | ready | yes | 4 | None | None |
| button | Button | P1 | actions | ready | yes | 23 | None | None |
| card | Card | P2 | surface-display | ready | yes | 13 | None | None |
| card-expiry-input | CardExpiryInput | P0 | forms-payment | ready | yes | 4 | None | None |
| card-number-input | CardNumberInput | P0 | forms-payment | ready | yes | 4 | None | None |
| card-security-code-input | CardSecurityCodeInput | P0 | forms-payment | ready | yes | 4 | None | None |
| card-summary | CardSummary | P2 | domain-payment | ready | yes | 3 | None | None |
| chart-panel | ChartPanel | P2 | data-display | ready | yes | 3 | None | None |
| chat-composer | ChatComposer | P2 | domain-chat | ready | yes | 3 | None | None |
| chat-message | ChatMessage | P2 | domain-chat | ready | yes | 3 | None | None |
| chat-thread | ChatThread | P2 | domain-chat | ready | yes | 3 | None | None |
| checkbox | Checkbox | P0 | forms | ready | yes | 5 | None | None |
| chip | Chip | P2 | display-status | ready | yes | 5 | None | None |
| code-block | CodeBlock | P1 | documentation-code | ready | yes | 1 | None | None |
| code-input | CodeInput | P0 | forms | ready | yes | 4 | None | None |
| combobox | Combobox | P0 | forms | ready | yes | 5 | None | None |
| copy-button | CopyButton | P1 | actions | ready | yes | 2 | None | None |
| country-selector | CountrySelector | P0 | forms | ready | yes | 3 | None | None |
| date-picker | DatePicker | P0 | forms-date | ready | yes | 4 | None | None |
| date-range-picker | DateRangePicker | P0 | forms-date | ready | yes | 5 | None | None |
| dialog | Dialog | P0 | overlays-feedback | ready | yes | 7 | None | None |
| drawer | Drawer | P0 | overlays-feedback | ready | yes | 8 | None | None |
| empty-state | EmptyState | P1 | feedback | ready | yes | 5 | None | None |
| error-panel | ErrorPanel | P1 | feedback | ready | yes | 4 | None | None |
| floating-action-button | FloatingActionButton | P1 | actions | ready | yes | 2 | None | None |
| icon-button | IconButton | P1 | actions | ready | yes | 4 | None | None |
| inline-validation | InlineValidation | P1 | feedback | ready | yes | 3 | None | None |
| input | Input | P0 | forms | ready | yes | 8 | None | None |
| input-amount | InputAmount | P2 | forms-payment | ready | yes | 3 | None | None |
| kpi-tile | KpiTile | P2 | data-display | ready | yes | 4 | None | None |
| list | List | P1 | data-display | ready | yes | 12 | None | None |
| menu | Menu | P0 | overlays-feedback | ready | yes | 5 | None | None |
| motion-boundary | MotionBoundary | P2 | motion-feedback | ready | yes | 3 | None | None |
| movement-row | MovementRow | P2 | domain-fleet | ready | yes | 4 | None | None |
| pagination | Pagination | P1 | navigation-disclosure | ready | yes | 5 | None | None |
| phone-input | PhoneInput | P0 | forms | ready | yes | 4 | None | None |
| popover | Popover | P0 | overlays-feedback | ready | yes | 5 | None | None |
| progress-indicator | ProgressIndicator | P1 | feedback | ready | yes | 2 | None | None |
| quick-action | QuickAction | P1 | actions | ready | yes | 5 | None | None |
| radio-button | RadioButton | P0 | forms | ready | yes | 3 | None | None |
| route-summary | RouteSummary | P2 | domain-fleet | ready | yes | 4 | None | None |
| segmented-control | SegmentedControl | P1 | navigation-disclosure | ready | yes | 3 | None | None |
| select | Select | P0 | forms | ready | yes | 21 | None | None |
| skeleton | Skeleton | P2 | feedback | ready | yes | 3 | None | None |
| slider | Slider | P0 | forms | ready | yes | 3 | None | None |
| spinner | Spinner | P2 | feedback | ready | yes | 6 | None | None |
| station-pin | StationPin | P2 | domain-fleet | ready | yes | 4 | None | None |
| stepper | Stepper | P1 | progress-feedback | ready | yes | 3 | None | None |
| surface | Surface | P2 | surface-display | ready | yes | 7 | None | None |
| switch | Switch | P0 | forms | ready | yes | 7 | None | None |
| table | Table | P1 | data-display | ready | yes | 11 | None | None |
| tabs | Tabs | P0 | navigation-disclosure | ready | yes | 3 | None | None |
| tag | Tag | P2 | display-status | ready | yes | 12 | None | None |
| text-area | TextArea | P0 | forms | ready | yes | 4 | None | None |
| toast | Toast | P1 | feedback | ready | yes | 5 | None | None |
| tooltip | Tooltip | P1 | overlays-feedback | ready | yes | 6 | None | None |
| tree-view | TreeView | P1 | navigation-disclosure | ready | yes | 3 | None | None |

