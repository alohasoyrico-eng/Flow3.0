# Foundation Primitive Export Contract Audit

Status: pass

Foundations, primitives, patterns, and templates must be exportable as platform-agnostic JSON contracts, not only as CSS variables, internal files, or documentation views. The actionable debt metric is foundationPrimitiveExportDebt.

## Inventory

- Foundations: 11
- Primitives: 24
- Patterns: 72
- Templates: 17
- Tokens: 1139
- Token types: 15
- Token scopes: 3
- Tokens with scope: 1139
- Tokens with CSS variable: 1139
- Tokens with CSS reference: 625
- Unknown token types: 0
- Invalid token transform fields: 0
- Invalid token type values: 0
- Missing foundation artifacts: 0
- Missing primitive artifacts: 0
- Missing pattern artifacts: 0
- Missing template artifacts: 0
- Missing foundation subpath exports: 0
- Missing primitive subpath exports: 0
- Missing pattern subpath exports: 0
- Missing template subpath exports: 0
- Invalid foundation subpath exports: 0
- Invalid primitive subpath exports: 0
- Invalid pattern subpath exports: 0
- Invalid template subpath exports: 0
- Artifact shape errors: 0
- Missing package exports: 0
- Requirement failures: 0
- Export governance issues: 0
- Baseline mismatches: 0
- Unexpected inventory metrics: 0
- Foundation primitive export debt: 0

## Baseline Budget

| Metric | Expected | Actual |
| --- | ---: | ---: |
| foundations | 11 | 11 |
| primitives | 24 | 24 |
| patterns | 72 | 72 |
| templates | 17 | 17 |
| tokenCount | 1139 | 1139 |
| tokenTypes | 15 | 15 |
| tokenScopes | 3 | 3 |
| tokensWithScope | 1139 | 1139 |
| tokensWithCssVariable | 1139 | 1139 |
| tokensWithCssReference | 625 | 625 |
| unknownTokenTypes | 0 | 0 |
| invalidTokenTransformFields | 0 | 0 |
| invalidTokenTypeValues | 0 | 0 |
| missingFoundationArtifacts | 0 | 0 |
| missingPrimitiveArtifacts | 0 | 0 |
| missingPatternArtifacts | 0 | 0 |
| missingTemplateArtifacts | 0 | 0 |
| missingFoundationSubpathExports | 0 | 0 |
| missingPrimitiveSubpathExports | 0 | 0 |
| missingPatternSubpathExports | 0 | 0 |
| missingTemplateSubpathExports | 0 | 0 |
| invalidFoundationSubpathExports | 0 | 0 |
| invalidPrimitiveSubpathExports | 0 | 0 |
| invalidPatternSubpathExports | 0 | 0 |
| invalidTemplateSubpathExports | 0 | 0 |
| artifactShapeErrors | 0 | 0 |
| missingPackageExports | 0 | 0 |
| requirementFailures | 0 | 0 |
| exportGovernanceIssues | 0 | 0 |
| baselineMismatches | 0 | 0 |
| unexpectedInventoryMetrics | 0 | 0 |
| foundationPrimitiveExportDebt | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Unexpected Inventory Metrics

| Metric | Actual |
| --- | ---: |
| None | None |

## Requirements

| Requirement | Status |
| --- | --- |
| tokenFormat | pass |
| styleDictionaryCompatible | pass |
| tokenJsonExists | pass |
| tokenCssExists | pass |
| packageIncludesSpecs | pass |
| packageIncludesTokens | pass |
| publicExportsPresent | pass |

## Token Transform Contract

Every token must remain JSON-transformable: stable `type`, explicit `scope`, and a CSS variable name matching the token id. Unknown token types and obvious type/value mismatches are actionable debt.

- Format: flow-token-contract@2
- Compatible with: style-dictionary
- Types: border, color, content, cubicBezier, dimension, duration, fontFamily, fontVariationSettings, fontWeight, number, opacity, shadow, textTransform, transform, zIndex
- Scopes: density, ref, sys
- Invalid transform fields: 0
- Invalid type values: 0

## Package Exports

Governance file: packages/content/content/foundation-primitive-export-governance.json. Issues: 0.

| Export | Status |
| --- | --- |
| ./tokens.json | present |
| ./tokens/styles.css | present |
| ./specs/system | present |
| ./specs/foundations/* | present |
| ./specs/primitives/* | present |
| ./specs/patterns/* | present |
| ./specs/templates/* | present |
| ./content/foundation-copy | present |
| ./content/primitive-copy | present |

## Artifact Subpath Exports

| Subpath | Target | Status |
| --- | --- | --- |
| ./specs/foundations/energy | ./packages/specs/specs/unison-system/artifacts/foundations/energy.json | pass |
| ./specs/foundations/voice | ./packages/specs/specs/unison-system/artifacts/foundations/voice.json | pass |
| ./specs/foundations/frame | ./packages/specs/specs/unison-system/artifacts/foundations/frame.json | pass |
| ./specs/foundations/depth | ./packages/specs/specs/unison-system/artifacts/foundations/depth.json | pass |
| ./specs/foundations/momentum | ./packages/specs/specs/unison-system/artifacts/foundations/momentum.json | pass |
| ./specs/foundations/state | ./packages/specs/specs/unison-system/artifacts/foundations/state.json | pass |
| ./specs/foundations/tone | ./packages/specs/specs/unison-system/artifacts/foundations/tone.json | pass |
| ./specs/foundations/growth | ./packages/specs/specs/unison-system/artifacts/foundations/growth.json | pass |
| ./specs/foundations/symbol | ./packages/specs/specs/unison-system/artifacts/foundations/symbol.json | pass |
| ./specs/foundations/iconography | ./packages/specs/specs/unison-system/artifacts/foundations/iconography.json | pass |
| ./specs/foundations/accessibility | ./packages/specs/specs/unison-system/artifacts/foundations/accessibility.json | pass |
| ./specs/primitives/color | ./packages/specs/specs/unison-system/artifacts/primitives/color.json | pass |
| ./specs/primitives/typography | ./packages/specs/specs/unison-system/artifacts/primitives/typography.json | pass |
| ./specs/primitives/spacing | ./packages/specs/specs/unison-system/artifacts/primitives/spacing.json | pass |
| ./specs/primitives/radius | ./packages/specs/specs/unison-system/artifacts/primitives/radius.json | pass |
| ./specs/primitives/elevation | ./packages/specs/specs/unison-system/artifacts/primitives/elevation.json | pass |
| ./specs/primitives/iconography | ./packages/specs/specs/unison-system/artifacts/primitives/iconography.json | pass |
| ./specs/primitives/library-sources | ./packages/specs/specs/unison-system/artifacts/primitives/library-sources.json | pass |
| ./specs/primitives/country-flags | ./packages/specs/specs/unison-system/artifacts/primitives/country-flags.json | pass |
| ./specs/primitives/animation-assets | ./packages/specs/specs/unison-system/artifacts/primitives/animation-assets.json | pass |
| ./specs/primitives/illustration-assets | ./packages/specs/specs/unison-system/artifacts/primitives/illustration-assets.json | pass |
| ./specs/primitives/motion-curves | ./packages/specs/specs/unison-system/artifacts/primitives/motion-curves.json | pass |
| ./specs/primitives/duration | ./packages/specs/specs/unison-system/artifacts/primitives/duration.json | pass |
| ./specs/primitives/breakpoints | ./packages/specs/specs/unison-system/artifacts/primitives/breakpoints.json | pass |
| ./specs/primitives/density | ./packages/specs/specs/unison-system/artifacts/primitives/density.json | pass |
| ./specs/primitives/focus | ./packages/specs/specs/unison-system/artifacts/primitives/focus.json | pass |
| ./specs/primitives/loading | ./packages/specs/specs/unison-system/artifacts/primitives/loading.json | pass |
| ./specs/primitives/disabled | ./packages/specs/specs/unison-system/artifacts/primitives/disabled.json | pass |
| ./specs/primitives/charts | ./packages/specs/specs/unison-system/artifacts/primitives/charts.json | pass |
| ./specs/primitives/maps | ./packages/specs/specs/unison-system/artifacts/primitives/maps.json | pass |
| ./specs/primitives/message | ./packages/specs/specs/unison-system/artifacts/primitives/message.json | pass |
| ./specs/primitives/measurement | ./packages/specs/specs/unison-system/artifacts/primitives/measurement.json | pass |
| ./specs/primitives/research | ./packages/specs/specs/unison-system/artifacts/primitives/research.json | pass |
| ./specs/primitives/surface | ./packages/specs/specs/unison-system/artifacts/primitives/surface.json | pass |
| ./specs/primitives/field-action | ./packages/specs/specs/unison-system/artifacts/primitives/field-action.json | pass |
| ./specs/patterns/account-operations | ./packages/specs/specs/unison-system/artifacts/patterns/account-operations.json | pass |
| ./specs/patterns/action-sheet | ./packages/specs/specs/unison-system/artifacts/patterns/action-sheet.json | pass |
| ./specs/patterns/advanced-filters | ./packages/specs/specs/unison-system/artifacts/patterns/advanced-filters.json | pass |
| ./specs/patterns/agent-conversation | ./packages/specs/specs/unison-system/artifacts/patterns/agent-conversation.json | pass |
| ./specs/patterns/artifact-metadata-bar | ./packages/specs/specs/unison-system/artifacts/patterns/artifact-metadata-bar.json | pass |
| ./specs/patterns/authentication-login-biometrics-and-otp | ./packages/specs/specs/unison-system/artifacts/patterns/authentication-login-biometrics-and-otp.json | pass |
| ./specs/patterns/autocomplete | ./packages/specs/specs/unison-system/artifacts/patterns/autocomplete.json | pass |
| ./specs/patterns/avatar-group | ./packages/specs/specs/unison-system/artifacts/patterns/avatar-group.json | pass |
| ./specs/patterns/avatar-menu | ./packages/specs/specs/unison-system/artifacts/patterns/avatar-menu.json | pass |
| ./specs/patterns/backoffice-approval | ./packages/specs/specs/unison-system/artifacts/patterns/backoffice-approval.json | pass |
| ./specs/patterns/bottom-sheet | ./packages/specs/specs/unison-system/artifacts/patterns/bottom-sheet.json | pass |
| ./specs/patterns/bulk-actions | ./packages/specs/specs/unison-system/artifacts/patterns/bulk-actions.json | pass |
| ./specs/patterns/calendar-view | ./packages/specs/specs/unison-system/artifacts/patterns/calendar-view.json | pass |
| ./specs/patterns/case-management | ./packages/specs/specs/unison-system/artifacts/patterns/case-management.json | pass |
| ./specs/patterns/chart-legend-item | ./packages/specs/specs/unison-system/artifacts/patterns/chart-legend-item.json | pass |
| ./specs/patterns/chart-wrapper | ./packages/specs/specs/unison-system/artifacts/patterns/chart-wrapper.json | pass |
| ./specs/patterns/checkbox-group | ./packages/specs/specs/unison-system/artifacts/patterns/checkbox-group.json | pass |
| ./specs/patterns/column-configurator | ./packages/specs/specs/unison-system/artifacts/patterns/column-configurator.json | pass |
| ./specs/patterns/command-palette | ./packages/specs/specs/unison-system/artifacts/patterns/command-palette.json | pass |
| ./specs/patterns/confirmation-dialog | ./packages/specs/specs/unison-system/artifacts/patterns/confirmation-dialog.json | pass |
| ./specs/patterns/demo-preview-frame | ./packages/specs/specs/unison-system/artifacts/patterns/demo-preview-frame.json | pass |
| ./specs/patterns/dense-operational-list | ./packages/specs/specs/unison-system/artifacts/patterns/dense-operational-list.json | pass |
| ./specs/patterns/documentation-hero | ./packages/specs/specs/unison-system/artifacts/patterns/documentation-hero.json | pass |
| ./specs/patterns/documentation-page-shell | ./packages/specs/specs/unison-system/artifacts/patterns/documentation-page-shell.json | pass |
| ./specs/patterns/documentation-primitive-demo | ./packages/specs/specs/unison-system/artifacts/patterns/documentation-primitive-demo.json | pass |
| ./specs/patterns/documentation-reference-grid | ./packages/specs/specs/unison-system/artifacts/patterns/documentation-reference-grid.json | pass |
| ./specs/patterns/documentation-section | ./packages/specs/specs/unison-system/artifacts/patterns/documentation-section.json | pass |
| ./specs/patterns/documentation-token-grid | ./packages/specs/specs/unison-system/artifacts/patterns/documentation-token-grid.json | pass |
| ./specs/patterns/drag-sortable-list | ./packages/specs/specs/unison-system/artifacts/patterns/drag-sortable-list.json | pass |
| ./specs/patterns/drawer-adapter | ./packages/specs/specs/unison-system/artifacts/patterns/drawer-adapter.json | pass |
| ./specs/patterns/driver-and-vehicle-administration | ./packages/specs/specs/unison-system/artifacts/patterns/driver-and-vehicle-administration.json | pass |
| ./specs/patterns/driver-onboarding-mobile | ./packages/specs/specs/unison-system/artifacts/patterns/driver-onboarding-mobile.json | pass |
| ./specs/patterns/email-template-layout | ./packages/specs/specs/unison-system/artifacts/patterns/email-template-layout.json | pass |
| ./specs/patterns/expandable-detail-table | ./packages/specs/specs/unison-system/artifacts/patterns/expandable-detail-table.json | pass |
| ./specs/patterns/file-upload | ./packages/specs/specs/unison-system/artifacts/patterns/file-upload.json | pass |
| ./specs/patterns/filter-chip-group | ./packages/specs/specs/unison-system/artifacts/patterns/filter-chip-group.json | pass |
| ./specs/patterns/filterable-editable-table | ./packages/specs/specs/unison-system/artifacts/patterns/filterable-editable-table.json | pass |
| ./specs/patterns/fleet-manager-onboarding-desktop | ./packages/specs/specs/unison-system/artifacts/patterns/fleet-manager-onboarding-desktop.json | pass |
| ./specs/patterns/form-section | ./packages/specs/specs/unison-system/artifacts/patterns/form-section.json | pass |
| ./specs/patterns/fullscreen-sheet | ./packages/specs/specs/unison-system/artifacts/patterns/fullscreen-sheet.json | pass |
| ./specs/patterns/gantt-chart | ./packages/specs/specs/unison-system/artifacts/patterns/gantt-chart.json | pass |
| ./specs/patterns/help-center | ./packages/specs/specs/unison-system/artifacts/patterns/help-center.json | pass |
| ./specs/patterns/kanban-board | ./packages/specs/specs/unison-system/artifacts/patterns/kanban-board.json | pass |
| ./specs/patterns/kpi-card | ./packages/specs/specs/unison-system/artifacts/patterns/kpi-card.json | pass |
| ./specs/patterns/multi-select | ./packages/specs/specs/unison-system/artifacts/patterns/multi-select.json | pass |
| ./specs/patterns/multi-step-form | ./packages/specs/specs/unison-system/artifacts/patterns/multi-step-form.json | pass |
| ./specs/patterns/notification-panel | ./packages/specs/specs/unison-system/artifacts/patterns/notification-panel.json | pass |
| ./specs/patterns/on-this-page-nav | ./packages/specs/specs/unison-system/artifacts/patterns/on-this-page-nav.json | pass |
| ./specs/patterns/payment-form | ./packages/specs/specs/unison-system/artifacts/patterns/payment-form.json | pass |
| ./specs/patterns/polar-chart | ./packages/specs/specs/unison-system/artifacts/patterns/polar-chart.json | pass |
| ./specs/patterns/preference-management | ./packages/specs/specs/unison-system/artifacts/patterns/preference-management.json | pass |
| ./specs/patterns/pricing-operations | ./packages/specs/specs/unison-system/artifacts/patterns/pricing-operations.json | pass |
| ./specs/patterns/pull-to-refresh | ./packages/specs/specs/unison-system/artifacts/patterns/pull-to-refresh.json | pass |
| ./specs/patterns/quick-actions-grid | ./packages/specs/specs/unison-system/artifacts/patterns/quick-actions-grid.json | pass |
| ./specs/patterns/radio-group | ./packages/specs/specs/unison-system/artifacts/patterns/radio-group.json | pass |
| ./specs/patterns/roles-and-permissions | ./packages/specs/specs/unison-system/artifacts/patterns/roles-and-permissions.json | pass |
| ./specs/patterns/search | ./packages/specs/specs/unison-system/artifacts/patterns/search.json | pass |
| ./specs/patterns/section-header | ./packages/specs/specs/unison-system/artifacts/patterns/section-header.json | pass |
| ./specs/patterns/select-option-layer | ./packages/specs/specs/unison-system/artifacts/patterns/select-option-layer.json | pass |
| ./specs/patterns/settings | ./packages/specs/specs/unison-system/artifacts/patterns/settings.json | pass |
| ./specs/patterns/sidebar | ./packages/specs/specs/unison-system/artifacts/patterns/sidebar.json | pass |
| ./specs/patterns/snackbar-provider | ./packages/specs/specs/unison-system/artifacts/patterns/snackbar-provider.json | pass |
| ./specs/patterns/station-discovery | ./packages/specs/specs/unison-system/artifacts/patterns/station-discovery.json | pass |
| ./specs/patterns/status-feedback-view | ./packages/specs/specs/unison-system/artifacts/patterns/status-feedback-view.json | pass |
| ./specs/patterns/swipe-actions | ./packages/specs/specs/unison-system/artifacts/patterns/swipe-actions.json | pass |
| ./specs/patterns/ticket-queue | ./packages/specs/specs/unison-system/artifacts/patterns/ticket-queue.json | pass |
| ./specs/patterns/timeline | ./packages/specs/specs/unison-system/artifacts/patterns/timeline.json | pass |
| ./specs/patterns/toolbar | ./packages/specs/specs/unison-system/artifacts/patterns/toolbar.json | pass |
| ./specs/patterns/topbar | ./packages/specs/specs/unison-system/artifacts/patterns/topbar.json | pass |
| ./specs/patterns/transfer-list | ./packages/specs/specs/unison-system/artifacts/patterns/transfer-list.json | pass |
| ./specs/patterns/virtual-data-table | ./packages/specs/specs/unison-system/artifacts/patterns/virtual-data-table.json | pass |
| ./specs/patterns/waterfall-chart | ./packages/specs/specs/unison-system/artifacts/patterns/waterfall-chart.json | pass |
| ./specs/templates/agent-workspace | ./packages/specs/specs/unison-system/artifacts/templates/agent-workspace.json | pass |
| ./specs/templates/component-detail-template | ./packages/specs/specs/unison-system/artifacts/templates/component-detail-template.json | pass |
| ./specs/templates/configuration-console | ./packages/specs/specs/unison-system/artifacts/templates/configuration-console.json | pass |
| ./specs/templates/docs-artifact-detail-template | ./packages/specs/specs/unison-system/artifacts/templates/docs-artifact-detail-template.json | pass |
| ./specs/templates/docs-collection-template | ./packages/specs/specs/unison-system/artifacts/templates/docs-collection-template.json | pass |
| ./specs/templates/docs-home-template | ./packages/specs/specs/unison-system/artifacts/templates/docs-home-template.json | pass |
| ./specs/templates/docs-shell-template | ./packages/specs/specs/unison-system/artifacts/templates/docs-shell-template.json | pass |
| ./specs/templates/driver-card-wallet | ./packages/specs/specs/unison-system/artifacts/templates/driver-card-wallet.json | pass |
| ./specs/templates/driver-mobile-app | ./packages/specs/specs/unison-system/artifacts/templates/driver-mobile-app.json | pass |
| ./specs/templates/fleet-dashboard-suite | ./packages/specs/specs/unison-system/artifacts/templates/fleet-dashboard-suite.json | pass |
| ./specs/templates/fleet-manager-desktop | ./packages/specs/specs/unison-system/artifacts/templates/fleet-manager-desktop.json | pass |
| ./specs/templates/internal-operations-console | ./packages/specs/specs/unison-system/artifacts/templates/internal-operations-console.json | pass |
| ./specs/templates/pattern-detail-template | ./packages/specs/specs/unison-system/artifacts/templates/pattern-detail-template.json | pass |
| ./specs/templates/reference-detail-template | ./packages/specs/specs/unison-system/artifacts/templates/reference-detail-template.json | pass |
| ./specs/templates/routes-and-stations | ./packages/specs/specs/unison-system/artifacts/templates/routes-and-stations.json | pass |
| ./specs/templates/settings-workspace | ./packages/specs/specs/unison-system/artifacts/templates/settings-workspace.json | pass |
| ./specs/templates/template-detail-template | ./packages/specs/specs/unison-system/artifacts/templates/template-detail-template.json | pass |

## Artifacts

| Id | Name | Exists | Shape Errors |
| --- | --- | --- | --- |
| energy | Energy | yes | None |
| voice | Voice | yes | None |
| frame | Frame | yes | None |
| depth | Depth | yes | None |
| momentum | Momentum | yes | None |
| state | State | yes | None |
| tone | Tone | yes | None |
| growth | Growth | yes | None |
| symbol | Symbol | yes | None |
| iconography | Iconography | yes | None |
| accessibility | Accessibility | yes | None |
| color | Color | yes | None |
| typography | Typography | yes | None |
| spacing | Spacing | yes | None |
| radius | Radius | yes | None |
| elevation | Elevation | yes | None |
| iconography | Iconography | yes | None |
| library-sources | Library Sources | yes | None |
| country-flags | Country Flags | yes | None |
| animation-assets | Animation Assets | yes | None |
| illustration-assets | Illustration Assets | yes | None |
| motion-curves | Motion Curves | yes | None |
| duration | Duration | yes | None |
| breakpoints | Breakpoints | yes | None |
| density | Density | yes | None |
| focus | Focus | yes | None |
| loading | Loading | yes | None |
| disabled | Disabled | yes | None |
| charts | Charts | yes | None |
| maps | Maps | yes | None |
| message | Message | yes | None |
| measurement | Measurement | yes | None |
| research | Research | yes | None |
| surface | Surface | yes | None |
| field-action | Field Action | yes | None |
| account-operations | account-operations | yes | None |
| action-sheet | action-sheet | yes | None |
| advanced-filters | advanced-filters | yes | None |
| agent-conversation | agent-conversation | yes | None |
| artifact-metadata-bar | artifact-metadata-bar | yes | None |
| authentication-login-biometrics-and-otp | authentication-login-biometrics-and-otp | yes | None |
| autocomplete | autocomplete | yes | None |
| avatar-group | avatar-group | yes | None |
| avatar-menu | avatar-menu | yes | None |
| backoffice-approval | backoffice-approval | yes | None |
| bottom-sheet | bottom-sheet | yes | None |
| bulk-actions | bulk-actions | yes | None |
| calendar-view | calendar-view | yes | None |
| case-management | case-management | yes | None |
| chart-legend-item | chart-legend-item | yes | None |
| chart-wrapper | chart-wrapper | yes | None |
| checkbox-group | checkbox-group | yes | None |
| column-configurator | column-configurator | yes | None |
| command-palette | command-palette | yes | None |
| confirmation-dialog | confirmation-dialog | yes | None |
| demo-preview-frame | demo-preview-frame | yes | None |
| dense-operational-list | dense-operational-list | yes | None |
| documentation-hero | documentation-hero | yes | None |
| documentation-page-shell | documentation-page-shell | yes | None |
| documentation-primitive-demo | documentation-primitive-demo | yes | None |
| documentation-reference-grid | documentation-reference-grid | yes | None |
| documentation-section | documentation-section | yes | None |
| documentation-token-grid | documentation-token-grid | yes | None |
| drag-sortable-list | drag-sortable-list | yes | None |
| drawer-adapter | drawer-adapter | yes | None |
| driver-and-vehicle-administration | driver-and-vehicle-administration | yes | None |
| driver-onboarding-mobile | driver-onboarding-mobile | yes | None |
| email-template-layout | email-template-layout | yes | None |
| expandable-detail-table | expandable-detail-table | yes | None |
| file-upload | file-upload | yes | None |
| filter-chip-group | filter-chip-group | yes | None |
| filterable-editable-table | filterable-editable-table | yes | None |
| fleet-manager-onboarding-desktop | fleet-manager-onboarding-desktop | yes | None |
| form-section | form-section | yes | None |
| fullscreen-sheet | fullscreen-sheet | yes | None |
| gantt-chart | gantt-chart | yes | None |
| help-center | help-center | yes | None |
| kanban-board | kanban-board | yes | None |
| kpi-card | kpi-card | yes | None |
| multi-select | multi-select | yes | None |
| multi-step-form | multi-step-form | yes | None |
| notification-panel | notification-panel | yes | None |
| on-this-page-nav | on-this-page-nav | yes | None |
| payment-form | payment-form | yes | None |
| polar-chart | polar-chart | yes | None |
| preference-management | preference-management | yes | None |
| pricing-operations | pricing-operations | yes | None |
| pull-to-refresh | pull-to-refresh | yes | None |
| quick-actions-grid | quick-actions-grid | yes | None |
| radio-group | radio-group | yes | None |
| roles-and-permissions | roles-and-permissions | yes | None |
| search | search | yes | None |
| section-header | section-header | yes | None |
| select-option-layer | select-option-layer | yes | None |
| settings | settings | yes | None |
| sidebar | sidebar | yes | None |
| snackbar-provider | snackbar-provider | yes | None |
| station-discovery | station-discovery | yes | None |
| status-feedback-view | status-feedback-view | yes | None |
| swipe-actions | swipe-actions | yes | None |
| ticket-queue | ticket-queue | yes | None |
| timeline | timeline | yes | None |
| toolbar | toolbar | yes | None |
| topbar | topbar | yes | None |
| transfer-list | transfer-list | yes | None |
| virtual-data-table | virtual-data-table | yes | None |
| waterfall-chart | waterfall-chart | yes | None |
| agent-workspace | agent-workspace | yes | None |
| component-detail-template | component-detail-template | yes | None |
| configuration-console | configuration-console | yes | None |
| docs-artifact-detail-template | docs-artifact-detail-template | yes | None |
| docs-collection-template | docs-collection-template | yes | None |
| docs-home-template | docs-home-template | yes | None |
| docs-shell-template | docs-shell-template | yes | None |
| driver-card-wallet | driver-card-wallet | yes | None |
| driver-mobile-app | driver-mobile-app | yes | None |
| fleet-dashboard-suite | fleet-dashboard-suite | yes | None |
| fleet-manager-desktop | fleet-manager-desktop | yes | None |
| internal-operations-console | internal-operations-console | yes | None |
| pattern-detail-template | pattern-detail-template | yes | None |
| reference-detail-template | reference-detail-template | yes | None |
| routes-and-stations | routes-and-stations | yes | None |
| settings-workspace | settings-workspace | yes | None |
| template-detail-template | template-detail-template | yes | None |

