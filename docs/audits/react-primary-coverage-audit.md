# React Primary Coverage Audit

Status: **pass**

Every accepted component must have a real React implementation contract: source, types, built artifacts, ref forwarding, platform contract, normalized density, sanitized rest props, and no docs or DOM factory dependency. The actionable debt metric is primaryImplementationDebt.

## Inventory

- Expected components: 56
- React components: 56
- Primary implementation debt: 0
- Pass: 56
- Fail: 0
- Forward ref: 56/56
- Real types: 56/56
- Platform contract: 56/56
- Normalized density: 56/56
- Sanitized rest props: 56/56
- No docs dependency: 56/56
- No DOM factory dependency: 56/56
- Published imports stay package-safe: 56/56
- CSS contract coverage: 56/56
- Direct CSS contracts: 52
- Family CSS contracts: 4
- Source index exports: 56/56
- Source type index exports: 56/56
- Dist index exports: 56/56
- Dist type index exports: 56/56
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. primaryImplementationDebt must stay at 0; React only counts as the primary implementation when every accepted component keeps source, types, dist, refs, density, rest-prop sanitation, package-safe imports, and CSS contracts intact.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| expectedComponents | 56 | 56 |
| components | 56 | 56 |
| primaryImplementationDebt | 0 | 0 |
| pass | 56 | 56 |
| fail | 0 | 0 |
| missingSources | 0 | 0 |
| extraSources | 0 | 0 |
| forwardRef | 56 | 56 |
| realTypes | 56 | 56 |
| platformContract | 56 | 56 |
| densityResolved | 56 | 56 |
| restSanitized | 56 | 56 |
| noDocsDependency | 56 | 56 |
| noDomFactory | 56 | 56 |
| publishedImports | 56 | 56 |
| cssContractCoverage | 56 | 56 |
| directCssContracts | 52 | 52 |
| familyCssContracts | 4 | 4 |
| sourceIndexExport | 56 | 56 |
| sourceTypesIndexExport | 56 | 56 |
| distIndexExport | 56 | 56 |
| distTypesIndexExport | 56 | 56 |

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
| Checkbox | pass | direct:checkbox | None |
| Chip | pass | direct:chip | None |
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
| KpiTile | pass | direct:kpi-tile | None |
| List | pass | direct:list | None |
| Menu | pass | direct:menu | None |
| MotionBoundary | pass | direct:motion-boundary | None |
| MovementRow | pass | direct:movement-row | None |
| Pagination | pass | direct:pagination | None |
| PhoneInput | pass | direct:phone-input | None |
| Popover | pass | direct:popover | None |
| ProgressIndicator | pass | direct:progress-indicator | None |
| QuickAction | pass | direct:quick-action | None |
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

