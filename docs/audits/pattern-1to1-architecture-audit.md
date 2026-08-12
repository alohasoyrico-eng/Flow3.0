# Pattern 1:1 Architecture Audit

Status: **pass**

Every pattern needs an explicit 1:1 architecture map across foundations, primitives, components, pattern crossings, template references, and docs evidence before React migration starts.

## Inventory

- Patterns audited: 63
- Pattern architecture policy issues: 0
- Foundation primitive hint policy entries: 11
- Complexity weight policy entries: 8
- Formal artifacts: 63
- Markdown contracts: 63
- Catalog entries: 63
- Patterns with declared primitives: 63
- Patterns with only inferred primitives: 0
- Patterns with unknown component refs: 0
- Patterns with component artifact gaps: 0
- Pattern contract scope issues: 0
- Pattern contract artifact coverage issues: 0
- Patterns with pattern crossings: 45
- Patterns referenced by templates: 16
- Template pattern dependencies: 50
- Template pattern dependency gaps: 0
- Template module dependency mismatches: 0
- Missing formal template pattern dependencies: 0
- Template module dependencies: 29
- Unknown template module dependencies: 0
- Docs app available: 1
- Patterns referenced by docs: 45
- Docs evidence files: 41
- Unknown docs evidence files: 0
- Formal artifact backlog: 0
- Primitive declaration backlog: 0
- Pattern architecture backlog: 0
- Pattern architecture debt: 0
- Pattern architecture blocking debt: 0

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Unexpected Inventory Metrics

| Metric | Actual |
| --- | ---: |
| None | None |

## Migration Waves

### wave-0-formalized

- action-sheet
- advanced-filters
- agent-conversation
- authentication-login-biometrics-and-otp
- autocomplete
- avatar-group
- avatar-menu
- calendar-view
- chart-legend-item
- chart-wrapper
- checkbox-group
- column-configurator
- confirmation-dialog
- drag-sortable-list
- driver-and-vehicle-administration
- driver-onboarding-mobile
- email-template-layout
- file-upload
- filter-chip-group
- fleet-manager-onboarding-desktop
- form-section
- fullscreen-sheet
- kpi-card
- multi-select
- multi-step-form
- notification-panel
- payment-form
- pull-to-refresh
- quick-actions-grid
- radio-group
- roles-and-permissions
- select-option-layer
- settings
- sidebar
- snackbar-provider
- station-discovery
- swipe-actions
- timeline

### wave-1-low-risk-composition

- None

### wave-2-composed-workflows

- bottom-sheet
- bulk-actions
- command-palette
- drawer-adapter
- expandable-detail-table
- filterable-editable-table
- gantt-chart
- help-center
- kanban-board
- polar-chart
- search
- section-header
- toolbar
- transfer-list
- virtual-data-table
- waterfall-chart

### wave-3-cross-pattern-orchestration

- account-operations
- backoffice-approval
- case-management
- dense-operational-list
- preference-management
- pricing-operations
- status-feedback-view
- ticket-queue

### wave-4-template-adjacent

- topbar

## Docs Evidence

| Category | Files |
| --- | ---: |
| candidate-demo-evidence | 2 |
| component-docs-evidence | 8 |
| contract-docs-evidence | 6 |
| docs-shell-evidence | 8 |
| pattern-demo-evidence | 9 |
| pattern-renderer-evidence | 2 |
| react-island-runtime-evidence | 1 |
| slot-adapter-evidence | 3 |
| template-docs-evidence | 2 |

| Unknown file | Category |
| --- | --- |
| None | None |

## Template Pattern Dependency Gaps

| Source | Template | Declared dependency | Dependency id | Classification |
| --- | --- | --- | --- | --- |
| None | None | None | None | None |

## Template Module Dependency Gaps

| Source | Template | Declared module | Module id |
| --- | --- | --- | --- |
| None | None | None | None |

## 1:1 Matrix

| Pattern | Wave | Score | Flow components | Component artifact gaps | Unknown refs | Foundations | Declared primitives | Inferred primitives | Pattern crossings | Template refs | Contract scope issues | Contract artifact coverage issues | Blockers |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| account-operations | wave-3-cross-pattern-orchestration | 36 | badge, drawer, list | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | bulk-actions, dense-operational-list, drawer-adapter, search, timeline, toolbar, virtual-data-table | 2 | None | None | high pattern-crossing count<br>referenced by templates; migration needs template-boundary review |
| action-sheet | wave-0-formalized | 18 | button, dialog, list, menu, toast | None | None | Accessibility, Depth, Energy, Frame, Momentum, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | search | 0 | None | None | None |
| advanced-filters | wave-0-formalized | 21 | badge, button, chip, date-range-picker, drawer, inline-validation, input, menu, select, toast | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | toolbar | 0 | None | None | None |
| agent-conversation | wave-0-formalized | 15 | chat-composer, chat-thread | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Density, Disabled, Field Action, Focus, Iconography, Loading, Message, Spacing, Surface, Typography | status-feedback-view | 2 | None | None | referenced by templates; migration needs template-boundary review |
| authentication-login-biometrics-and-otp | wave-0-formalized | 27 | biometric-prompt, button, code-input, error-panel, inline-validation, input, phone-input, toast | None | None | Accessibility, Energy, Frame, Momentum, State, Voice | Breakpoints, Color, Country Flags, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | None | 2 | None | None | referenced by templates; migration needs template-boundary review |
| autocomplete | wave-0-formalized | 13 | combobox, empty-state, inline-validation, list, skeleton | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| avatar-group | wave-0-formalized | 12 | avatar, badge, button, inline-validation, list, popover, tooltip | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| avatar-menu | wave-0-formalized | 12 | avatar, menu | None | None | Accessibility, Depth, Energy, Frame, Momentum, Voice | Breakpoints, Color, Disabled, Duration, Elevation, Focus, Iconography, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | settings | 0 | None | None | None |
| backoffice-approval | wave-3-cross-pattern-orchestration | 24 | badge, drawer, list | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | dense-operational-list, drawer-adapter, status-feedback-view | 2 | None | None | high pattern-crossing count<br>referenced by templates; migration needs template-boundary review |
| bottom-sheet | wave-2-composed-workflows | 22 | button, dialog, drawer, icon-button, inline-validation, list | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | action-sheet, confirmation-dialog, drawer-adapter, form-section | 0 | None | None | high pattern-crossing count |
| bulk-actions | wave-2-composed-workflows | 27 | badge, button, checkbox, dialog, menu, progress-indicator, table, toast | None | None | Accessibility, Depth, Energy, Frame, Momentum, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | bottom-sheet, toolbar | 0 | None | None | None |
| calendar-view | wave-0-formalized | 17 | badge, button, card, date-range-picker, empty-state, list, popover, skeleton, tooltip | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| case-management | wave-3-cross-pattern-orchestration | 44 | badge, drawer, list | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | advanced-filters, bulk-actions, dense-operational-list, drawer-adapter, search, status-feedback-view, timeline, toolbar, virtual-data-table | 2 | None | None | high pattern-crossing count<br>referenced by templates; migration needs template-boundary review |
| chart-legend-item | wave-0-formalized | 14 | badge, button, checkbox, chip, tag, tooltip | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Charts, Color, Density, Disabled, Duration, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | chart-wrapper | 0 | None | None | None |
| chart-wrapper | wave-0-formalized | 18 | badge, button, chart-panel, empty-state, error-panel, kpi-tile, list, menu, skeleton, table | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Charts, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| checkbox-group | wave-0-formalized | 9 | button, checkbox, inline-validation | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | multi-select | 0 | None | None | None |
| column-configurator | wave-0-formalized | 17 | badge, button, checkbox, dialog, drawer, inline-validation, menu, table, toast | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| command-palette | wave-2-composed-workflows | 23 | button, dialog, empty-state, input, menu, toast | None | None | Accessibility, Depth, Energy, Frame, Momentum, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | search, topbar | 0 | None | None | None |
| confirmation-dialog | wave-0-formalized | 15 | button, dialog, error-panel, inline-validation, toast | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| dense-operational-list | wave-3-cross-pattern-orchestration | 34 | badge, chip, table | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | bulk-actions, filter-chip-group, search, status-feedback-view, toolbar, virtual-data-table | 2 | None | None | high pattern-crossing count<br>referenced by templates; migration needs template-boundary review |
| drag-sortable-list | wave-0-formalized | 14 | badge, button, list, motion-boundary, toast | None | None | Accessibility, Energy, Frame, Momentum, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | settings | 0 | None | None | None |
| drawer-adapter | wave-2-composed-workflows | 26 | button, card, dialog, drawer, list, menu, toast | None | None | Accessibility, Depth, Frame, Momentum, State | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | multi-step-form, sidebar, topbar | 0 | None | None | high pattern-crossing count |
| driver-and-vehicle-administration | wave-0-formalized | 31 | audit-event, avatar, badge, button, card-summary, dialog, empty-state, pagination, quick-action, table, toast | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | toolbar | 2 | None | None | referenced by templates; migration needs template-boundary review |
| driver-onboarding-mobile | wave-0-formalized | 32 | animated-moment, biometric-prompt, button, card, card-summary, code-input, inline-validation, input, phone-input, stepper, toast | None | None | Accessibility, Depth, Frame, Momentum, State, Voice | Animation Assets, Breakpoints, Color, Country Flags, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Animation Assets, Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | form-section | 2 | None | None | referenced by templates; migration needs template-boundary review |
| email-template-layout | wave-0-formalized | 6 | table | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Duration, Iconography, Message, Radius, Spacing, Typography | Breakpoints, Color, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| expandable-detail-table | wave-2-composed-workflows | 16 | badge, drawer, table | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | drawer-adapter, status-feedback-view, virtual-data-table | 0 | None | None | high pattern-crossing count |
| file-upload | wave-0-formalized | 15 | button, empty-state, inline-validation, progress-indicator, tag, toast | None | None | Accessibility, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| filter-chip-group | wave-0-formalized | 11 | badge, button, chip, empty-state, toast | None | None | Accessibility, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| filterable-editable-table | wave-2-composed-workflows | 20 | badge, drawer, table | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | advanced-filters, drawer-adapter, status-feedback-view, virtual-data-table | 0 | None | None | high pattern-crossing count |
| fleet-manager-onboarding-desktop | wave-0-formalized | 24 | badge, button, checkbox, empty-state, inline-validation, input, kpi-tile, select, stepper, table, toast | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | settings | 0 | None | None | None |
| form-section | wave-0-formalized | 22 | button, checkbox, icon-button, inline-validation, input, radio-button, select, switch, text-area, toast | None | None | Accessibility, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | search | 0 | None | None | None |
| fullscreen-sheet | wave-0-formalized | 21 | button, card-summary, inline-validation, input, select, stepper, toast | None | None | Accessibility, Depth, Energy, Frame, Momentum, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | action-sheet | 0 | None | None | None |
| gantt-chart | wave-2-composed-workflows | 10 | badge | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Charts, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Color, Density, Disabled, Focus, Iconography, Radius, Spacing, Typography | chart-wrapper, timeline | 0 | None | None | None |
| help-center | wave-2-composed-workflows | 22 | accordion, drawer, empty-state, input, tag | None | None | Accessibility, Energy, Frame, Growth, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Research, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | search, sidebar | 0 | None | None | None |
| kanban-board | wave-2-composed-workflows | 19 | badge, button, empty-state, error-panel, list, table | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | drag-sortable-list, virtual-data-table | 0 | None | None | None |
| kpi-card | wave-0-formalized | 13 | badge, button, empty-state, error-panel, kpi-tile, skeleton, tag | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| multi-select | wave-0-formalized | 16 | badge, button, checkbox, chip, empty-state, inline-validation, select | None | None | Accessibility, Energy, Frame, Momentum, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | search | 0 | None | None | None |
| multi-step-form | wave-0-formalized | 22 | button, card, inline-validation, input, select, stepper, toast | None | None | Accessibility, Energy, Frame, Momentum, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | form-section | 0 | None | None | None |
| notification-panel | wave-0-formalized | 20 | badge, button, drawer, empty-state, icon-button, list, toast | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | topbar | 0 | None | None | None |
| payment-form | wave-0-formalized | 15 | button, card, card-expiry-input, card-number-input, card-security-code-input, code-input, inline-validation, input, input-amount | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | status-feedback-view | 0 | None | None | None |
| polar-chart | wave-2-composed-workflows | 10 | badge | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Charts, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Color, Density, Disabled, Focus, Iconography, Radius, Spacing, Typography | chart-wrapper, waterfall-chart | 0 | None | None | None |
| preference-management | wave-3-cross-pattern-orchestration | 23 | badge, dialog | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | confirmation-dialog, form-section, settings | 2 | None | None | high pattern-crossing count<br>referenced by templates; migration needs template-boundary review |
| pricing-operations | wave-3-cross-pattern-orchestration | 32 | badge, drawer, table | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | advanced-filters, drawer-adapter, roles-and-permissions, status-feedback-view, virtual-data-table | 2 | None | None | high pattern-crossing count<br>referenced by templates; migration needs template-boundary review |
| pull-to-refresh | wave-0-formalized | 16 | animated-moment, button, card, inline-validation, list, progress-indicator, toast | None | None | Accessibility, Energy, Frame, Momentum, State, Voice | Animation Assets, Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Animation Assets, Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| quick-actions-grid | wave-0-formalized | 14 | badge, dialog, quick-action, toast, tooltip | None | None | Accessibility, Energy, Frame, Iconography, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | search | 0 | None | None | None |
| radio-group | wave-0-formalized | 5 | button, inline-validation, radio-button | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| roles-and-permissions | wave-0-formalized | 35 | audit-event, badge, button, checkbox, dialog, inline-validation, switch, table, toast, tooltip | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | None | 4 | None | None | referenced by templates; migration needs template-boundary review |
| search | wave-2-composed-workflows | 22 | button, card, empty-state, inline-validation, input, list, select, toast | None | None | Accessibility, Depth, Energy, Frame, Momentum, State, Voice | Color, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | settings, toolbar | 0 | None | None | None |
| section-header | wave-2-composed-workflows | 20 | badge, button, menu, skeleton, tag | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | form-section, settings, toolbar | 0 | None | None | high pattern-crossing count |
| select-option-layer | wave-0-formalized | 17 | badge, button, card, empty-state, inline-validation, popover, select | None | None | Accessibility, Depth, Energy, Frame, Momentum, State, Voice | Color, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | bottom-sheet | 0 | None | None | None |
| settings | wave-0-formalized | 20 | button, card, dialog, input, select, switch, toast | None | None | Accessibility, Energy, Frame, State, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| sidebar | wave-0-formalized | 50 | accordion, badge, breadcrumbs, button, drawer, icon-button | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Research, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | topbar | 8 | None | None | referenced by templates; migration needs template-boundary review |
| snackbar-provider | wave-0-formalized | 10 | badge, button, toast | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| station-discovery | wave-0-formalized | 39 | button, empty-state, error-panel, inline-validation, list, route-summary, skeleton, station-pin | None | None | Accessibility, Depth, Energy, Frame, Momentum, State, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Maps, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | search | 4 | None | None | referenced by templates; migration needs template-boundary review |
| status-feedback-view | wave-3-cross-pattern-orchestration | 24 | empty-state, error-panel, inline-validation, toast | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | notification-panel, snackbar-provider | 2 | None | None | referenced by templates; migration needs template-boundary review |
| swipe-actions | wave-0-formalized | 13 | button, dialog, movement-row, quick-action, toast | None | None | Accessibility, Energy, Frame, Momentum, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| ticket-queue | wave-3-cross-pattern-orchestration | 40 | badge, drawer, list | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Motion Curves, Radius, Spacing, Typography | bulk-actions, dense-operational-list, drawer-adapter, notification-panel, search, status-feedback-view, toolbar, virtual-data-table | 2 | None | None | high pattern-crossing count<br>referenced by templates; migration needs template-boundary review |
| timeline | wave-0-formalized | 13 | audit-event, badge, button, chip, empty-state, list | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Motion Curves, Radius, Spacing, Typography | None | 0 | None | None | None |
| toolbar | wave-2-composed-workflows | 18 | badge, button, chip, input, menu, toast | None | None | Accessibility, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | search, topbar | 0 | None | None | None |
| topbar | wave-4-template-adjacent | 75 | avatar, badge, drawer, icon-button, input, menu | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Research, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | autocomplete, avatar-menu, command-palette, notification-panel, search, settings, sidebar | 10 | None | None | high pattern-crossing count<br>referenced by templates; migration needs template-boundary review |
| transfer-list | wave-2-composed-workflows | 21 | badge, button, checkbox, inline-validation, input, list, toast | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Field Action, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | multi-select, search | 0 | None | None | None |
| virtual-data-table | wave-2-composed-workflows | 21 | badge, button, checkbox, empty-state, error-panel, pagination, skeleton, table | None | None | Accessibility, Depth, Energy, Frame, State, Voice | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Typography | Breakpoints, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Message, Motion Curves, Radius, Spacing, Typography | search, toolbar | 0 | None | None | None |
| waterfall-chart | wave-2-composed-workflows | 10 | badge | None | None | Accessibility, Depth, Energy, Frame, Growth, Iconography, Momentum, State, Symbol, Tone, Voice | Breakpoints, Charts, Color, Density, Disabled, Duration, Elevation, Focus, Iconography, Loading, Measurement, Message, Motion Curves, Radius, Spacing, Surface, Typography | Color, Density, Disabled, Focus, Iconography, Radius, Spacing, Typography | chart-wrapper, gantt-chart | 0 | None | None | None |

