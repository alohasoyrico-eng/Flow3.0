# React Production Readiness

Status: **pass**

Production readiness is not inferred from visual parity or TS build success; every public React component needs explicit API, runtime, interaction, accessibility, and family-specific evidence.

## Inventory

- Plan iteration: 1
- Public React components: 63
- Ready components: 29
- Partial components: 34
- Blocked components: 0
- P0 components: 21
- P1 components: 18
- P2 components: 24
- Missing contracts: 1
- Missing direct test evidence: 1
- Structural issues: 0
- React production readiness harness debt: 0

## Test Capability Snapshot

- Testing Library render calls: 190
- fireEvent calls: 477
- getByRole calls: 319
- getByLabelText calls: 13
- keyDown calls: 34
- Escape key checks: 18
- Arrow key checks: 17
- user-event usage: 12
- axe usage: 7

## Harness Issues

- None

## Component Matrix

| Slug | Component | Priority | Family | Status | Contract | Test files | Evidence gaps | Structural issues |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| accordion | Accordion | P2 | navigation-disclosure | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: keyboard navigation; missing production evidence: state | None |
| animated-moment | AnimatedMoment | P2 | motion-feedback | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: motion preference | None |
| audit-event | AuditEvent | P2 | domain-event | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state | None |
| avatar | Avatar | P2 | display-status | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: theme/density | None |
| badge | Badge | P2 | display-status | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: theme/density | None |
| biometric-prompt | BiometricPrompt | P2 | domain-auth | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| breadcrumbs | Breadcrumbs | P2 | navigation-disclosure | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: keyboard navigation; missing production evidence: state | None |
| button | Button | P1 | actions | ready | yes | 13 | None | None |
| card | Card | P2 | surface-display | partial | yes | 8 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: composition; missing production evidence: theme/density | None |
| card-expiry-input | CardExpiryInput | P0 | forms-payment | ready | yes | 4 | None | None |
| card-number-input | CardNumberInput | P0 | forms-payment | ready | yes | 4 | None | None |
| card-security-code-input | CardSecurityCodeInput | P0 | forms-payment | ready | yes | 4 | None | None |
| card-summary | CardSummary | P2 | domain-payment | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state | None |
| chart-panel | ChartPanel | P2 | data-display | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: keyboard when interactive | None |
| chat-composer | ChatComposer | P2 | domain-chat | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| chat-message | ChatMessage | P2 | domain-chat | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| chat-thread | ChatThread | P2 | domain-chat | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| checkbox | Checkbox | P0 | forms | ready | yes | 5 | None | None |
| chip | Chip | P2 | display-status | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: theme/density | None |
| code-block | CodeBlock | P1 | documentation-code | partial | yes | 0 | missing direct test evidence; family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: copy interaction | None |
| code-input | CodeInput | P0 | forms | ready | yes | 4 | None | None |
| combobox | Combobox | P0 | forms | ready | yes | 5 | None | None |
| copy-button | CopyButton | P1 | actions | ready | yes | 2 | None | None |
| country-selector | CountrySelector | P0 | forms | ready | yes | 3 | None | None |
| date-picker | DatePicker | P0 | forms-date | ready | yes | 4 | None | None |
| date-range-picker | DateRangePicker | P0 | forms-date | ready | yes | 5 | None | None |
| dialog | Dialog | P0 | overlays-feedback | ready | yes | 7 | None | None |
| drawer | Drawer | P0 | overlays-feedback | ready | yes | 8 | None | None |
| empty-state | EmptyState | P1 | feedback | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| error-panel | ErrorPanel | P1 | feedback | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| floating-action-button | FloatingActionButton | P1 | actions | ready | yes | 2 | None | None |
| icon-button | IconButton | P1 | actions | ready | yes | 4 | None | None |
| inline-validation | InlineValidation | P1 | feedback | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| input | Input | P0 | forms | ready | yes | 6 | None | None |
| input-amount | InputAmount | P2 | forms-payment | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: formatting/masking | None |
| kpi-tile | KpiTile | P2 | data-display | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: keyboard when interactive | None |
| list | List | P1 | data-display | partial | yes | 6 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: keyboard when interactive | None |
| menu | Menu | P0 | overlays-feedback | ready | yes | 5 | None | None |
| motion-boundary | MotionBoundary | P2 | motion-feedback | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: motion preference | None |
| movement-row | MovementRow | P2 | domain-fleet | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| pagination | Pagination | P1 | navigation-disclosure | ready | yes | 5 | None | None |
| phone-input | PhoneInput | P0 | forms | ready | yes | 4 | None | None |
| popover | Popover | P0 | overlays-feedback | ready | yes | 5 | None | None |
| progress-indicator | ProgressIndicator | P1 | feedback | partial | yes | 1 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| quick-action | QuickAction | P1 | actions | ready | yes | 5 | None | None |
| radio-button | RadioButton | P0 | forms | ready | yes | 3 | None | None |
| route-summary | RouteSummary | P2 | domain-fleet | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| segmented-control | SegmentedControl | P1 | navigation-disclosure | ready | yes | 3 | None | None |
| select | Select | P0 | forms | ready | yes | 9 | None | None |
| skeleton | Skeleton | P2 | feedback | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| slider | Slider | P0 | forms | ready | yes | 3 | None | None |
| spinner | Spinner | P2 | feedback | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| station-pin | StationPin | P2 | domain-fleet | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| stepper | Stepper | P1 | navigation-disclosure | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: keyboard navigation; missing production evidence: state | None |
| surface | Surface | P2 | surface-display | partial | no | 5 | missing component contract; family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: composition; missing production evidence: theme/density | None |
| switch | Switch | P0 | forms | ready | yes | 7 | None | None |
| table | Table | P1 | data-display | partial | yes | 5 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: keyboard when interactive | None |
| tabs | Tabs | P0 | navigation-disclosure | ready | yes | 3 | None | None |
| tag | Tag | P2 | display-status | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: theme/density | None |
| text-area | TextArea | P0 | forms | ready | yes | 4 | None | None |
| toast | Toast | P1 | feedback | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| tooltip | Tooltip | P1 | overlays-feedback | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: focus management; missing production evidence: Escape/outside close; missing production evidence: controlled/uncontrolled | None |
| tree-view | TreeView | P1 | navigation-disclosure | ready | yes | 3 | None | None |

