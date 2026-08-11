# Pattern Contract Governance Audit

Status: **pass**

Pattern contracts and demos must be governed as portable Flow evidence: markdown carries the formal contract, and demos compose package-backed Flow components instead of local visuals.

## Inventory

| Metric | Value |
| --- | ---: |
| patternContractGovernanceIssues | 0 |
| requiredPatternContracts | 23 |
| requiredPatternContractGaps | 0 |
| requiredMarkdownSections | 19 |
| readinessExpectedInventoryMetrics | 24 |
| requiredDemos | 21 |
| requiredDemoExemptions | 2 |
| demoSharedHelperPolicy | 3 |
| demoLocalControlRulePolicy | 2 |
| demoSpecificRulePolicy | 4 |
| demoLocalControlPatternCoverage | 8 |
| requiredDemoPolicyGaps | 0 |
| unusedRequiredDemoExemptions | 0 |
| requiredDemoComponentAssertions | 105 |
| markdownContractsScanned | 59 |
| contractsMissingRequiredSections | 0 |
| missingRequiredSectionEntries | 0 |
| missingRequiredDemoFunctions | 0 |
| missingRequiredDemoComponentAssertions | 0 |
| patternContractGovernanceDebt | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Unexpected Inventory Metrics

| Metric | Actual |
| --- | ---: |
| None | None |

## Required Pattern Contract Gaps

| Pattern |
| --- |
| None |

## Required Demo Policy Gaps

| Pattern |
| --- |
| None |

## Required Demo Exemptions

| Pattern | Reason |
| --- | --- |
| sidebar | Shell navigation pattern: verify through governed shell/template composition instead of an isolated demo panel. |
| topbar | Shell navigation pattern: verify through governed shell/template composition instead of an isolated demo panel. |

## Unused Demo Exemptions

| Pattern |
| --- |
| None |

## Demo Composition Policy

Shared helpers: searchSlotMarkup, notificationPanelMarkup, avatarMenuMarkup

| Pattern ids | File group | Forbidden local tags | Message |
| --- | --- | --- | --- |
| form-section, toolbar, filter-chip-group, file-upload | candidate | button, input, select, textarea | Pattern demo must not create local controls; compose Design System controls through packageDemo. |
| fullscreen-sheet, swipe-actions, quick-actions-grid, drawer-adapter | mobile | button, input, select, textarea, progress | Mobile pattern demo must not create local controls; compose Design System controls through packageDemo. |

| Pattern | File group | Guard pattern | Message |
| --- | --- | --- | --- |
| select-option-layer | candidate | `<article\s+data-select-layer-option|<strong>Standard policy|<span>Default card controls` | Select Option Layer demo must not create local option cards; compose Design System Card/Badge/Button instead. |
| multi-select | candidate | `<span\s+data-multi-select-count` | Multi Select count must use a Design System status component, not loose text. |
| file-upload | candidate | `<progress\b|type="file"` | File Upload demo must not use local file/progress controls in docs; compose Design System Button and Progress Indicator. |
| swipe-actions | mobile | `touchstart|pointermove|translateX` | Swipe Actions demo must expose explicit controls and avoid custom gesture physics. |

## Contract Section Gaps

| Pattern | File | Missing sections |
| --- | --- | --- |
| None | None | None |

## Demo Composition Gaps

| Pattern | Function | Present | Missing package components |
| --- | --- | --- | --- |
| None | None | None | None |

