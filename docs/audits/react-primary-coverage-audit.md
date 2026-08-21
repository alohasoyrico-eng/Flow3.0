# React Primary Coverage Audit

Status: **pass**

Every accepted component must have a real React implementation contract: source, types, built artifacts, ref forwarding, platform contract, normalized density, sanitized rest props, and no docs or DOM factory dependency. The actionable debt metric is primaryImplementationDebt.

## Inventory

- Expected components: 60
- React components: 60
- Primary implementation debt: 0
- Pass: 60
- Fail: 0
- Forward ref: 60/60
- Real types: 60/60
- Platform contract: 60/60
- Normalized density: 60/60
- Sanitized rest props: 60/60
- No docs dependency: 60/60
- No DOM factory dependency: 60/60
- Published imports stay package-safe: 60/60
- CSS contract coverage: 60/60
- Direct CSS contracts: 55
- Family CSS contracts: 5
- Source index exports: 60/60
- Source type index exports: 60/60
- Dist index exports: 60/60
- Dist type index exports: 60/60
- React primary governance issues: 0
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. primaryImplementationDebt must stay at 0; React only counts as the primary implementation when every accepted component keeps source, types, dist, refs, density, rest-prop sanitation, package-safe imports, and CSS contracts intact.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| expectedComponents | 60 | 60 |
| components | 60 | 60 |
| primaryImplementationDebt | 0 | 0 |
| pass | 60 | 60 |
| fail | 0 | 0 |
| missingSources | 0 | 0 |
| extraSources | 0 | 0 |
| forwardRef | 60 | 60 |
| realTypes | 60 | 60 |
| platformContract | 60 | 60 |
| densityResolved | 60 | 60 |
| restSanitized | 60 | 60 |
| noDocsDependency | 60 | 60 |
| noDomFactory | 60 | 60 |
| publishedImports | 60 | 60 |
| cssContractCoverage | 60 | 60 |
| directCssContracts | 55 | 55 |
| familyCssContracts | 5 | 5 |
| sourceIndexExport | 60 | 60 |
| sourceTypesIndexExport | 60 | 60 |
| distIndexExport | 60 | 60 |
| distTypesIndexExport | 60 | 60 |
| reactPrimaryGovernanceIssues | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Components

| Component | Status | CSS contract | Failing checks |
| --- | --- | --- | --- |
| Accordion | pass | direct:accordion | None |
| AnimatedMoment | pass | direct:animated-moment | None |
| AuditEvent | pass | direct:audit-event | None |
| Avatar | pass | direct:avatar | None |
| Badge | pass | direct:badge | None |
| BiometricPrompt | pass | direct:biometric-prompt | None |
| Breadcrumbs | pass | direct:breadcrumbs | None |
| Button | pass | direct:button | None |
| Card | pass | direct:card | None |
| CardExpiryInput | pass | family:field | None |
| CardNumberInput | pass | family:field | None |
| CardSecurityCodeInput | pass | family:field | None |
| CardSummary | pass | direct:card-summary | None |
| ChartPanel | pass | direct:chart-panel | None |
| ChatComposer | pass | direct:chat-composer | None |
| ChatMessage | pass | direct:chat-message | None |
| ChatThread | pass | direct:chat-thread | None |
| Checkbox | pass | direct:checkbox | None |
| Chip | pass | direct:chip | None |
| CodeBlock | pass | direct:code-block | None |
| CodeInput | pass | direct:code-input | None |
| Combobox | pass | direct:combobox | None |
| CountrySelector | pass | direct:country-selector | None |
| DatePicker | pass | direct:date-picker | None |
| DateRangePicker | pass | direct:date-range-picker | None |
| Dialog | pass | direct:dialog | None |
| Drawer | pass | direct:drawer | None |
| EmptyState | pass | direct:empty-state | None |
| ErrorPanel | pass | direct:error-panel | None |
| FloatingActionButton | pass | direct:floating-action-button | None |
| IconButton | pass | direct:icon-button | None |
| InlineValidation | pass | direct:inline-validation | None |
| Input | pass | family:field | None |
| InputAmount | pass | family:field | None |
| KpiTile | pass | direct:kpi-tile | None |
| List | pass | direct:list | None |
| Menu | pass | direct:menu | None |
| MotionBoundary | pass | direct:motion-boundary | None |
| MovementRow | pass | direct:movement-row | None |
| Pagination | pass | direct:pagination | None |
| PhoneInput | pass | direct:phone-input | None |
| Popover | pass | direct:popover | None |
| ProgressIndicator | pass | direct:progress-indicator | None |
| RadioButton | pass | direct:radio-button | None |
| RouteSummary | pass | direct:route-summary | None |
| SegmentedControl | pass | direct:segmented-control | None |
| Select | pass | direct:select | None |
| Skeleton | pass | direct:skeleton | None |
| Slider | pass | direct:slider | None |
| Spinner | pass | direct:spinner | None |
| StationPin | pass | direct:station-pin | None |
| Stepper | pass | direct:stepper | None |
| Switch | pass | direct:switch | None |
| Table | pass | direct:table | None |
| Tabs | pass | direct:tabs | None |
| Tag | pass | direct:tag | None |
| TextArea | pass | direct:text-area | None |
| Toast | pass | direct:toast | None |
| Tooltip | pass | direct:tooltip | None |
| TreeView | pass | direct:tree-view | None |

