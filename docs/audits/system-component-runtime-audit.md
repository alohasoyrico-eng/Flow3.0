# System Component Runtime Audit

Status: **pass**

Every public component must pass runtime rendering, CSS contract, visual cascade, style governance, and primary React coverage as one auditable boundary.

## Inventory

- Plan iteration: 19
- Components: 62
- Runtime audited components: 62
- Passing runtime components: 62
- Failing runtime components: 0
- Source reports: 5
- Passing source reports: 5
- Source report issues: 0
- Component runtime debt: 0

## Source Reports

- artifactTests: docs/audits/system-component-artifact-tests.json
- cssContract: docs/audits/component-css-contract-coverage.json
- visualCascade: docs/audits/component-visual-cascade-audit.json
- styleGovernance: docs/audits/react-style-governance-audit.json
- primaryCoverage: docs/audits/react-primary-coverage-audit.json

## Component Runtime Matrix

| Component ID | React component | Artifact tests | CSS contract | Visual cascade | Style governance | Primary coverage | Status | Issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| button | Button | pass | direct | pass | pass | pass | pass | None |
| copy-button | CopyButton | pass | direct | pass | pass | pass | pass | None |
| code-block | CodeBlock | pass | direct | pass | pass | pass | pass | None |
| icon-button | IconButton | pass | direct | pass | pass | pass | pass | None |
| input | Input | pass | family | pass | pass | pass | pass | None |
| input-amount | InputAmount | pass | family | pass | pass | pass | pass | None |
| card-number-input | CardNumberInput | pass | family | pass | pass | pass | pass | None |
| card-expiry-input | CardExpiryInput | pass | family | pass | pass | pass | pass | None |
| card-security-code-input | CardSecurityCodeInput | pass | family | pass | pass | pass | pass | None |
| select | Select | pass | direct | pass | pass | pass | pass | None |
| combobox | Combobox | pass | direct | pass | pass | pass | pass | None |
| card | Card | pass | direct | pass | pass | pass | pass | None |
| checkbox | Checkbox | pass | direct | pass | pass | pass | pass | None |
| switch | Switch | pass | direct | pass | pass | pass | pass | None |
| radio-button | RadioButton | pass | direct | pass | pass | pass | pass | None |
| text-area | TextArea | pass | direct | pass | pass | pass | pass | None |
| badge | Badge | pass | direct | pass | pass | pass | pass | None |
| chip | Chip | pass | direct | pass | pass | pass | pass | None |
| tag | Tag | pass | direct | pass | pass | pass | pass | None |
| tabs | Tabs | pass | direct | pass | pass | pass | pass | None |
| tooltip | Tooltip | pass | direct | pass | pass | pass | pass | None |
| toast | Toast | pass | direct | pass | pass | pass | pass | None |
| progress-indicator | ProgressIndicator | pass | direct | pass | pass | pass | pass | None |
| spinner | Spinner | pass | direct | pass | pass | pass | pass | None |
| accordion | Accordion | pass | direct | pass | pass | pass | pass | None |
| slider | Slider | pass | direct | pass | pass | pass | pass | None |
| avatar | Avatar | pass | direct | pass | pass | pass | pass | None |
| skeleton | Skeleton | pass | direct | pass | pass | pass | pass | None |
| dialog | Dialog | pass | direct | pass | pass | pass | pass | None |
| menu | Menu | pass | direct | pass | pass | pass | pass | None |
| drawer | Drawer | pass | direct | pass | pass | pass | pass | None |
| table | Table | pass | direct | pass | pass | pass | pass | None |
| biometric-prompt | BiometricPrompt | pass | direct | pass | pass | pass | pass | None |
| tree-view | TreeView | pass | direct | pass | pass | pass | pass | None |
| motion-boundary | MotionBoundary | pass | direct | pass | pass | pass | pass | None |
| animated-moment | AnimatedMoment | pass | direct | pass | pass | pass | pass | None |
| empty-state | EmptyState | pass | direct | pass | pass | pass | pass | None |
| list | List | pass | direct | pass | pass | pass | pass | None |
| kpi-tile | KpiTile | pass | direct | pass | pass | pass | pass | None |
| floating-action-button | FloatingActionButton | pass | direct | pass | pass | pass | pass | None |
| breadcrumbs | Breadcrumbs | pass | direct | pass | pass | pass | pass | None |
| pagination | Pagination | pass | direct | pass | pass | pass | pass | None |
| audit-event | AuditEvent | pass | direct | pass | pass | pass | pass | None |
| error-panel | ErrorPanel | pass | direct | pass | pass | pass | pass | None |
| inline-validation | InlineValidation | pass | direct | pass | pass | pass | pass | None |
| stepper | Stepper | pass | direct | pass | pass | pass | pass | None |
| chart-panel | ChartPanel | pass | direct | pass | pass | pass | pass | None |
| station-pin | StationPin | pass | direct | pass | pass | pass | pass | None |
| route-summary | RouteSummary | pass | direct | pass | pass | pass | pass | None |
| code-input | CodeInput | pass | direct | pass | pass | pass | pass | None |
| phone-input | PhoneInput | pass | direct | pass | pass | pass | pass | None |
| country-selector | CountrySelector | pass | direct | pass | pass | pass | pass | None |
| date-picker | DatePicker | pass | direct | pass | pass | pass | pass | None |
| date-range-picker | DateRangePicker | pass | direct | pass | pass | pass | pass | None |
| segmented-control | SegmentedControl | pass | direct | pass | pass | pass | pass | None |
| popover | Popover | pass | direct | pass | pass | pass | pass | None |
| card-summary | CardSummary | pass | direct | pass | pass | pass | pass | None |
| movement-row | MovementRow | pass | direct | pass | pass | pass | pass | None |
| chat-message | ChatMessage | pass | direct | pass | pass | pass | pass | None |
| chat-thread | ChatThread | pass | direct | pass | pass | pass | pass | None |
| chat-composer | ChatComposer | pass | direct | pass | pass | pass | pass | None |
| quick-action | QuickAction | pass | direct | pass | pass | pass | pass | None |

