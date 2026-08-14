# React Primary Coverage Audit

Status: **pass**

Every accepted component must have a real React implementation contract: source, types, built artifacts, ref forwarding, platform contract, normalized density, sanitized rest props, and no docs or DOM factory dependency. The actionable debt metric is primaryImplementationDebt.

## Inventory

- Expected components: 62
- React components: 62
- Primary implementation debt: 0
- Pass: 62
- Fail: 0
- Forward ref: 62/62
- Real types: 62/62
- Platform contract: 62/62
- Normalized density: 62/62
- Sanitized rest props: 62/62
- No docs dependency: 62/62
- No DOM factory dependency: 62/62
- Published imports stay package-safe: 62/62
- CSS contract coverage: 62/62
- Direct CSS contracts: 57
- Family CSS contracts: 5
- Source index exports: 62/62
- Source type index exports: 62/62
- Dist index exports: 62/62
- Dist type index exports: 62/62
- React primary governance issues: 0
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. primaryImplementationDebt must stay at 0; React only counts as the primary implementation when every accepted component keeps source, types, dist, refs, density, rest-prop sanitation, package-safe imports, and CSS contracts intact.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| expectedComponents | 62 | 62 |
| components | 62 | 62 |
| primaryImplementationDebt | 0 | 0 |
| pass | 62 | 62 |
| fail | 0 | 0 |
| missingSources | 0 | 0 |
| extraSources | 0 | 0 |
| forwardRef | 62 | 62 |
| realTypes | 62 | 62 |
| platformContract | 62 | 62 |
| densityResolved | 62 | 62 |
| restSanitized | 62 | 62 |
| noDocsDependency | 62 | 62 |
| noDomFactory | 62 | 62 |
| publishedImports | 62 | 62 |
| cssContractCoverage | 62 | 62 |
| directCssContracts | 57 | 57 |
| familyCssContracts | 5 | 5 |
| sourceIndexExport | 62 | 62 |
| sourceTypesIndexExport | 62 | 62 |
| distIndexExport | 62 | 62 |
| distTypesIndexExport | 62 | 62 |
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
| CopyButton | pass | direct:copy-button | None |
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

