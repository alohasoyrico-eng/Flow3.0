# React Production Readiness

Status: **pass**

Production readiness is not inferred from visual parity or TS build success; every public React component needs explicit API, runtime, interaction, accessibility, and family-specific evidence.

## Inventory

- Plan iteration: 1
- Public React components: 63
- Ready components: 6
- Partial components: 57
- Blocked components: 0
- P0 components: 21
- P1 components: 18
- P2 components: 24
- Missing contracts: 1
- Missing direct test evidence: 1
- Structural issues: 0
- React production readiness harness debt: 0

## Test Capability Snapshot

- Testing Library render calls: 167
- fireEvent calls: 452
- getByRole calls: 264
- getByLabelText calls: 12
- keyDown calls: 19
- Escape key checks: 8
- Arrow key checks: 12
- user-event usage: 4
- axe usage: 3

## Harness Issues

- None

## Component Matrix

| Slug | Component | Priority | Family | Status | Contract | Test files | Evidence gaps | Structural issues |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| accordion | Accordion | P2 | navigation-disclosure | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: keyboard navigation; missing production evidence: state | None |
| animated-moment | AnimatedMoment | P2 | motion-feedback | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: motion preference | None |
| audit-event | AuditEvent | P2 | domain-event | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state | None |
| avatar | Avatar | P2 | display-status | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: theme/density | None |
| badge | Badge | P2 | display-status | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: theme/density | None |
| biometric-prompt | BiometricPrompt | P2 | domain-auth | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| breadcrumbs | Breadcrumbs | P2 | navigation-disclosure | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: keyboard navigation; missing production evidence: state | None |
| button | Button | P1 | actions | partial | yes | 9 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: callback; missing production evidence: disabled/prevented | None |
| card | Card | P2 | surface-display | partial | yes | 6 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: composition; missing production evidence: theme/density | None |
| card-expiry-input | CardExpiryInput | P0 | forms-payment | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: formatting/masking | None |
| card-number-input | CardNumberInput | P0 | forms-payment | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: formatting/masking | None |
| card-security-code-input | CardSecurityCodeInput | P0 | forms-payment | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: formatting/masking | None |
| card-summary | CardSummary | P2 | domain-payment | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state | None |
| chart-panel | ChartPanel | P2 | data-display | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: keyboard when interactive | None |
| chat-composer | ChatComposer | P2 | domain-chat | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| chat-message | ChatMessage | P2 | domain-chat | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| chat-thread | ChatThread | P2 | domain-chat | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| checkbox | Checkbox | P0 | forms | ready | yes | 5 | None | None |
| chip | Chip | P2 | display-status | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: theme/density | None |
| code-block | CodeBlock | P1 | documentation-code | partial | yes | 0 | missing direct test evidence; family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: copy interaction | None |
| code-input | CodeInput | P0 | forms | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: keyboard/input events; missing production evidence: disabled/invalid | None |
| combobox | Combobox | P0 | forms | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: keyboard/input events; missing production evidence: disabled/invalid | None |
| copy-button | CopyButton | P1 | actions | partial | yes | 1 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: callback; missing production evidence: disabled/prevented | None |
| country-selector | CountrySelector | P0 | forms | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: keyboard/input events; missing production evidence: disabled/invalid | None |
| date-picker | DatePicker | P0 | forms-date | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: keyboard/input events; missing production evidence: date constraints | None |
| date-range-picker | DateRangePicker | P0 | forms-date | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: keyboard/input events; missing production evidence: date constraints | None |
| dialog | Dialog | P0 | overlays-feedback | partial | yes | 6 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: focus management; missing production evidence: Escape/outside close; missing production evidence: controlled/uncontrolled | None |
| drawer | Drawer | P0 | overlays-feedback | partial | yes | 7 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: focus management; missing production evidence: Escape/outside close; missing production evidence: controlled/uncontrolled | None |
| empty-state | EmptyState | P1 | feedback | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| error-panel | ErrorPanel | P1 | feedback | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| floating-action-button | FloatingActionButton | P1 | actions | partial | yes | 1 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: callback; missing production evidence: disabled/prevented | None |
| icon-button | IconButton | P1 | actions | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: callback; missing production evidence: disabled/prevented | None |
| inline-validation | InlineValidation | P1 | feedback | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| input | Input | P0 | forms | ready | yes | 5 | None | None |
| input-amount | InputAmount | P2 | forms-payment | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: formatting/masking | None |
| kpi-tile | KpiTile | P2 | data-display | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: keyboard when interactive | None |
| list | List | P1 | data-display | partial | yes | 5 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: keyboard when interactive | None |
| menu | Menu | P0 | overlays-feedback | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: focus management; missing production evidence: Escape/outside close; missing production evidence: controlled/uncontrolled | None |
| motion-boundary | MotionBoundary | P2 | motion-feedback | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: motion preference | None |
| movement-row | MovementRow | P2 | domain-fleet | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| pagination | Pagination | P1 | navigation-disclosure | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: keyboard navigation; missing production evidence: state | None |
| phone-input | PhoneInput | P0 | forms | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: keyboard/input events; missing production evidence: disabled/invalid | None |
| popover | Popover | P0 | overlays-feedback | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: focus management; missing production evidence: Escape/outside close; missing production evidence: controlled/uncontrolled | None |
| progress-indicator | ProgressIndicator | P1 | feedback | partial | yes | 1 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| quick-action | QuickAction | P1 | actions | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: callback; missing production evidence: disabled/prevented | None |
| radio-button | RadioButton | P0 | forms | ready | yes | 3 | None | None |
| route-summary | RouteSummary | P2 | domain-fleet | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| segmented-control | SegmentedControl | P1 | navigation-disclosure | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: keyboard navigation; missing production evidence: state | None |
| select | Select | P0 | forms | partial | yes | 5 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: controlled/uncontrolled; missing production evidence: keyboard/input events; missing production evidence: disabled/invalid | None |
| skeleton | Skeleton | P2 | feedback | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| slider | Slider | P0 | forms | ready | yes | 3 | None | None |
| spinner | Spinner | P2 | feedback | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| station-pin | StationPin | P2 | domain-fleet | partial | yes | 3 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: callback | None |
| stepper | Stepper | P1 | navigation-disclosure | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: keyboard navigation; missing production evidence: state | None |
| surface | Surface | P2 | surface-display | partial | no | 5 | missing component contract; family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: composition; missing production evidence: theme/density | None |
| switch | Switch | P0 | forms | ready | yes | 7 | None | None |
| table | Table | P1 | data-display | partial | yes | 5 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: keyboard when interactive | None |
| tabs | Tabs | P0 | navigation-disclosure | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: keyboard navigation; missing production evidence: state | None |
| tag | Tag | P2 | display-status | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: theme/density | None |
| text-area | TextArea | P0 | forms | ready | yes | 4 | None | None |
| toast | Toast | P1 | feedback | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: state; missing production evidence: dismiss/action when interactive | None |
| tooltip | Tooltip | P1 | overlays-feedback | partial | yes | 4 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: focus management; missing production evidence: Escape/outside close; missing production evidence: controlled/uncontrolled | None |
| tree-view | TreeView | P1 | navigation-disclosure | partial | yes | 2 | family-specific production checks not yet certified; missing production evidence: render; missing production evidence: props; missing production evidence: a11y; missing production evidence: keyboard navigation; missing production evidence: state | None |

