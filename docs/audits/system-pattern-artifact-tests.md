# System Pattern Artifact Tests

Status: **pass**

Every public React pattern artifact must be tested one by one from the built package boundary, with behavior, callbacks, slots, and declared dependency governance joined into the same matrix.

## Inventory

- Plan iteration: 16
- Pattern artifacts: 72
- Runtime pattern exports: 72
- Tested patterns: 72
- Passing patterns: 72
- Failing patterns: 0
- Rendered patterns: 72
- Callback props declared/tested: 271/271
- Slot count/use count: 336/513
- Declared/runtime pattern dependencies: 87/77
- Behavior debt: 0
- Composition debt: 0
- Pattern artifact test debt: 0

## Pattern Matrix

| Pattern id | React pattern | Status | Render | Callbacks | Slot uses | Deps declared/runtime | Issues |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |
| account-operations | AccountOperations | pass | pass | 13/13 | 6 | 3/3 | None |
| action-sheet | ActionSheet | pass | pass | 3/3 | 6 | 1/1 | None |
| advanced-filters | AdvancedFilters | pass | pass | 0/0 | 11 | 1/1 | None |
| agent-conversation | AgentConversation | pass | pass | 6/6 | 4 | 1/1 | None |
| artifact-metadata-bar | ArtifactMetadataBar | pass | pass | 0/0 | 5 | 0/0 | None |
| authentication-login-biometrics-and-otp | AuthenticationLoginBiometricsAndOtp | pass | pass | 2/2 | 9 | 0/0 | None |
| autocomplete | Autocomplete | pass | pass | 4/4 | 5 | 0/0 | None |
| avatar-group | AvatarGroup | pass | pass | 3/3 | 7 | 0/0 | None |
| avatar-menu | AvatarMenu | pass | pass | 2/2 | 2 | 1/0 | None |
| backoffice-approval | BackofficeApproval | pass | pass | 12/12 | 6 | 3/3 | None |
| bottom-sheet | BottomSheet | pass | pass | 3/3 | 8 | 1/1 | None |
| bulk-actions | BulkActions | pass | pass | 0/0 | 9 | 1/1 | None |
| calendar-view | CalendarView | pass | pass | 3/3 | 9 | 0/0 | None |
| case-management | CaseManagement | pass | pass | 18/18 | 8 | 5/5 | None |
| chart-legend-item | ChartLegendItem | pass | pass | 2/2 | 8 | 1/0 | None |
| chart-wrapper | ChartWrapper | pass | pass | 1/1 | 10 | 0/0 | None |
| checkbox-group | CheckboxGroup | pass | pass | 3/3 | 7 | 0/0 | None |
| column-configurator | ColumnConfigurator | pass | pass | 4/4 | 9 | 0/0 | None |
| command-palette | CommandPalette | pass | pass | 5/5 | 6 | 2/0 | None |
| confirmation-dialog | ConfirmationDialog | pass | pass | 4/4 | 5 | 0/0 | None |
| demo-preview-frame | DemoPreviewFrame | pass | pass | 0/0 | 5 | 0/0 | None |
| dense-operational-list | DenseOperationalList | pass | pass | 9/9 | 8 | 6/6 | None |
| documentation-hero | DocumentationHero | pass | pass | 0/0 | 5 | 1/1 | None |
| documentation-page-shell | DocumentationPageShell | pass | pass | 0/0 | 4 | 0/0 | None |
| documentation-primitive-demo | DocumentationPrimitiveDemo | pass | pass | 0/0 | 3 | 0/0 | None |
| documentation-reference-grid | DocumentationReferenceGrid | pass | pass | 0/0 | 1 | 0/0 | None |
| documentation-section | DocumentationSection | pass | pass | 0/0 | 3 | 1/1 | None |
| documentation-token-grid | DocumentationTokenGrid | pass | pass | 0/0 | 1 | 0/0 | None |
| drag-sortable-list | DragSortableList | pass | pass | 5/5 | 6 | 1/1 | None |
| drawer-adapter | DrawerAdapter | pass | pass | 2/2 | 11 | 3/3 | None |
| driver-and-vehicle-administration | DriverAndVehicleAdministration | pass | pass | 3/3 | 12 | 1/1 | None |
| driver-onboarding-mobile | DriverOnboardingMobile | pass | pass | 1/1 | 12 | 1/1 | None |
| email-template-layout | EmailTemplateLayout | pass | pass | 0/0 | 12 | 0/0 | None |
| expandable-detail-table | ExpandableDetailTable | pass | pass | 7/7 | 6 | 3/3 | None |
| file-upload | FileUpload | pass | pass | 3/3 | 7 | 0/0 | None |
| filter-chip-group | FilterChipGroup | pass | pass | 5/5 | 5 | 0/0 | None |
| filterable-editable-table | FilterableEditableTable | pass | pass | 11/11 | 7 | 4/4 | None |
| fleet-manager-onboarding-desktop | FleetManagerOnboardingDesktop | pass | pass | 2/2 | 12 | 1/1 | None |
| form-section | FormSection | pass | pass | 6/6 | 11 | 1/0 | None |
| fullscreen-sheet | FullscreenSheet | pass | pass | 1/1 | 8 | 1/1 | None |
| gantt-chart | GanttChart | pass | pass | 2/2 | 6 | 1/1 | None |
| help-center | HelpCenter | pass | pass | 5/5 | 7 | 2/2 | None |
| kanban-board | KanbanBoard | pass | pass | 3/3 | 7 | 1/1 | None |
| kpi-card | KpiCard | pass | pass | 2/2 | 7 | 0/0 | None |
| multi-select | MultiSelect | pass | pass | 4/4 | 7 | 1/0 | None |
| multi-step-form | MultiStepForm | pass | pass | 0/0 | 9 | 1/1 | None |
| notification-panel | NotificationPanel | pass | pass | 5/5 | 7 | 1/0 | None |
| on-this-page-nav | OnThisPageNav | pass | pass | 1/1 | 3 | 0/0 | None |
| payment-form | PaymentForm | pass | pass | 7/7 | 8 | 1/1 | None |
| polar-chart | PolarChart | pass | pass | 2/2 | 6 | 1/1 | None |
| preference-management | PreferenceManagement | pass | pass | 9/9 | 5 | 3/3 | None |
| pricing-operations | PricingOperations | pass | pass | 11/11 | 8 | 5/5 | None |
| pull-to-refresh | PullToRefresh | pass | pass | 1/1 | 8 | 0/0 | None |
| quick-actions-grid | QuickActionsGrid | pass | pass | 1/1 | 6 | 1/1 | None |
| radio-group | RadioGroup | pass | pass | 3/3 | 5 | 0/0 | None |
| roles-and-permissions | RolesAndPermissions | pass | pass | 2/2 | 10 | 0/0 | None |
| search | Search | pass | pass | 6/6 | 6 | 0/0 | None |
| section-header | SectionHeader | pass | pass | 0/0 | 8 | 3/3 | None |
| select-option-layer | SelectOptionLayer | pass | pass | 3/3 | 7 | 0/0 | None |
| settings | Settings | pass | pass | 5/5 | 8 | 0/0 | None |
| sidebar | Sidebar | pass | pass | 4/4 | 7 | 1/0 | None |
| snackbar-provider | SnackbarProvider | pass | pass | 3/3 | 4 | 0/0 | None |
| station-discovery | StationDiscovery | pass | pass | 5/5 | 11 | 1/1 | None |
| status-feedback-view | StatusFeedbackView | pass | pass | 8/8 | 6 | 2/2 | None |
| swipe-actions | SwipeActions | pass | pass | 2/2 | 5 | 0/0 | None |
| ticket-queue | TicketQueue | pass | pass | 15/15 | 7 | 4/4 | None |
| timeline | Timeline | pass | pass | 3/3 | 6 | 0/0 | None |
| toolbar | Toolbar | pass | pass | 0/0 | 8 | 2/2 | None |
| topbar | Topbar | pass | pass | 5/5 | 16 | 7/7 | None |
| transfer-list | TransferList | pass | pass | 3/3 | 12 | 2/2 | None |
| virtual-data-table | VirtualDataTable | pass | pass | 6/6 | 8 | 2/0 | None |
| waterfall-chart | WaterfallChart | pass | pass | 2/2 | 6 | 1/1 | None |

