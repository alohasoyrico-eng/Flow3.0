# Pattern Readiness Audit

Status: pass

Patterns must have a governed source, portable contract, formal artifact promotion path, and explicit backlog before product teams compose them at scale.

## Inventory

- Meta patterns: 58
- Catalog patterns: 63
- Unique catalog patterns: 63
- Pattern copy sources: 59
- Markdown contracts: 59
- Required pattern contracts: 23
- Required contracts present: 23
- Required copy present: 23
- Formal artifacts: 59
- Formal artifact backlog: 0
- Catalog-only patterns: 4
- Approved catalog-only patterns: 4
- Unapproved catalog-only patterns: 0
- Catalog-only governance issues: 0
- Formal artifacts missing catalog: 0
- Catalog component reference errors: 0
- Catalog/artifact dependency mismatches: 0
- Pattern contract governance issues: 0
- Required pattern contract source issues: 0
- Pattern readiness debt: 0

## Governance Source

- Contract file: packages/content/content/pattern-contract-governance.json
- Readiness baseline metrics: 24
- Contract issues: 0
- Required contract source issues: 0

| Source issue | Expected governed ids | Actual context ids |
| --- | ---: | ---: |
| None | None | None |

## Baseline Budget

Changing these numbers is a pattern governance decision. Promotion backlog is visible here, but only broken required contracts, stale contracts, duplicates, or unreviewed inventory drift add readiness debt.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| metaPatterns | 58 | 58 |
| catalogPatterns | 63 | 63 |
| uniqueCatalogPatterns | 63 | 63 |
| copyPatterns | 59 | 59 |
| markdownContracts | 59 | 59 |
| requiredPatternContracts | 23 | 23 |
| requiredContractsPresent | 23 | 23 |
| requiredCopyPresent | 23 | 23 |
| formalArtifacts | 59 | 59 |
| duplicateCatalogIds | 0 | 0 |
| requiredContractGaps | 0 | 0 |
| requiredCopyGaps | 0 | 0 |
| staleMarkdownContracts | 0 | 0 |
| formalArtifactBacklog | 0 | 0 |
| catalogOnlyPatterns | 4 | 4 |
| approvedCatalogOnlyPatterns | 4 | 4 |
| unapprovedCatalogOnlyPatterns | 0 | 0 |
| catalogOnlyGovernanceIssues | 0 | 0 |
| formalArtifactsMissingCatalog | 0 | 0 |
| catalogComponentReferenceErrors | 0 | 0 |
| catalogArtifactDependencyMismatches | 0 | 0 |
| patternContractGovernanceIssues | 0 | 0 |
| requiredPatternContractSourceIssues | 0 | 0 |
| patternReadinessDebt | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Unexpected Inventory Metrics

| Metric | Actual | Issue |
| --- | ---: | --- |
| None | None | None |

## Formal Artifact Backlog

| Pattern |
| --- |
| None |

## Formal Artifacts

| Pattern |
| --- |
| account-operations |
| action-sheet |
| advanced-filters |
| agent-conversation |
| authentication-login-biometrics-and-otp |
| autocomplete |
| avatar-group |
| avatar-menu |
| backoffice-approval |
| bulk-actions |
| calendar-view |
| case-management |
| chart-wrapper |
| column-configurator |
| command-palette |
| confirmation-dialog |
| dense-operational-list |
| drag-sortable-list |
| drawer-adapter |
| driver-and-vehicle-administration |
| driver-onboarding-mobile |
| email-template-layout |
| expandable-detail-table |
| file-upload |
| filter-chip-group |
| filterable-editable-table |
| fleet-manager-onboarding-desktop |
| form-section |
| fullscreen-sheet |
| gantt-chart |
| help-center |
| kanban-board |
| kpi-card |
| multi-select |
| multi-step-form |
| notification-panel |
| payment-form |
| polar-chart |
| preference-management |
| pricing-operations |
| pull-to-refresh |
| quick-actions-grid |
| roles-and-permissions |
| search |
| section-header |
| select-option-layer |
| settings |
| sidebar |
| snackbar-provider |
| station-discovery |
| status-feedback-view |
| swipe-actions |
| ticket-queue |
| timeline |
| toolbar |
| topbar |
| transfer-list |
| virtual-data-table |
| waterfall-chart |

## Required Pattern Contracts

| Pattern |
| --- |
| action-sheet |
| autocomplete |
| avatar-menu |
| bulk-actions |
| command-palette |
| confirmation-dialog |
| drawer-adapter |
| file-upload |
| filter-chip-group |
| form-section |
| fullscreen-sheet |
| help-center |
| multi-select |
| multi-step-form |
| notification-panel |
| quick-actions-grid |
| search |
| select-option-layer |
| settings |
| sidebar |
| swipe-actions |
| toolbar |
| topbar |

## Catalog Without Copy

| Pattern |
| --- |
| bottom-sheet |
| chart-legend-item |
| checkbox-group |
| radio-group |

## Approved Catalog-Only Patterns

| Pattern | Layer | Replacement | Reason |
| --- | --- | --- | --- |
| bottom-sheet | pattern | bottom-sheet | Bottom Sheet is a 100% mobile overlay pattern with focus, dismissal, drag/state, and responsive orchestration beyond a bounded component. |
| checkbox-group | pattern | checkbox-group | Checkbox remains atomic; group label, select-all, mixed state, shared validation, and analytics are pattern-owned. |
| radio-group | pattern | radio-group | Radio Button remains atomic; exclusive group question, shared name, arrow navigation, validation, and layout are pattern-owned. |
| chart-legend-item | pattern | chart-legend-item | Legend items are chart interaction patterns; they must not be promoted as standalone components. |

## Unapproved Catalog-Only Patterns

| Pattern |
| --- |
| None |

## Catalog-Only Governance Issues

| Pattern | Issue |
| --- | --- |
| None | None |

## Formal Artifacts Missing Catalog

| Pattern |
| --- |
| None |

## Catalog Component Reference Errors

| Pattern | componentsUsed item | Resolved layer | File |
| --- | --- | --- | --- |
| None | None | None | None |

## Catalog/Artifact Dependency Mismatches

| Pattern | Field | File | Catalog | Artifact |
| --- | --- | --- | --- | --- |
| None | None | None | None | None |

## Copy Without Catalog

| Pattern |
| --- |
| None |

