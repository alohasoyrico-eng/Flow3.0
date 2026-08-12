# React Template Visual Governance Audit

Status: pass

React templates must render the full Flow cascade in a real browser with package CSS, Surface primitives, density/state propagation, visible slots/modules, and no viewport overflow before Docs can be trusted as evidence.

## Inventory

- templatesAudited: 9
- visualCases: 27
- passingVisualCases: 27
- screenshotsCaptured: 27
- viewportProfiles: 2
- densityCases: 3
- stateCases: 3
- horizontalOverflowFindings: 0
- blankOrShallowRenderFindings: 0
- zeroSizeFindings: 0
- slotOverlapFindings: 0
- missingSlotOrModuleFindings: 0
- reactTemplateVisualGovernanceDebt: 0

## Visual Cases

| Template | Case | Status | Viewport | State | Density | Surfaces | Density markers | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| settings-workspace | loaded-sm | pass | desktop 1280x900 | loaded | sm | 8 | 33 | captured |
| settings-workspace | loading-md | pass | desktop 1280x900 | loading | md | 8 | 34 | captured |
| settings-workspace | permission-lg | pass | desktop 1280x900 | permission | lg | 8 | 33 | captured |
| internal-operations-console | loaded-sm | pass | desktop 1280x900 | loaded | sm | 15 | 66 | captured |
| internal-operations-console | loading-md | pass | desktop 1280x900 | loading | md | 15 | 66 | captured |
| internal-operations-console | permission-lg | pass | desktop 1280x900 | permission | lg | 15 | 63 | captured |
| agent-workspace | loaded-sm | pass | desktop 1280x900 | loaded | sm | 10 | 26 | captured |
| agent-workspace | loading-md | pass | desktop 1280x900 | loading | md | 8 | 24 | captured |
| agent-workspace | permission-lg | pass | desktop 1280x900 | permission | lg | 8 | 23 | captured |
| configuration-console | loaded-sm | pass | desktop 1280x900 | loaded | sm | 8 | 56 | captured |
| configuration-console | loading-md | pass | desktop 1280x900 | loading | md | 8 | 50 | captured |
| configuration-console | permission-lg | pass | desktop 1280x900 | permission | lg | 8 | 52 | captured |
| fleet-dashboard-suite | loaded-sm | pass | desktop 1280x900 | loaded | sm | 9 | 33 | captured |
| fleet-dashboard-suite | loading-md | pass | desktop 1280x900 | loading | md | 9 | 33 | captured |
| fleet-dashboard-suite | permission-lg | pass | desktop 1280x900 | permission | lg | 9 | 35 | captured |
| fleet-manager-desktop | loaded-sm | pass | desktop 1280x900 | loaded | sm | 7 | 41 | captured |
| fleet-manager-desktop | loading-md | pass | desktop 1280x900 | loading | md | 7 | 41 | captured |
| fleet-manager-desktop | permission-lg | pass | desktop 1280x900 | permission | lg | 7 | 43 | captured |
| driver-card-wallet | loaded-sm | pass | mobile 390x844 | loaded | sm | 7 | 14 | captured |
| driver-card-wallet | loading-md | pass | mobile 390x844 | loading | md | 7 | 17 | captured |
| driver-card-wallet | permission-lg | pass | mobile 390x844 | permission | lg | 7 | 14 | captured |
| driver-mobile-app | loaded-sm | pass | mobile 390x844 | loaded | sm | 9 | 29 | captured |
| driver-mobile-app | loading-md | pass | mobile 390x844 | loading | md | 9 | 32 | captured |
| driver-mobile-app | permission-lg | pass | mobile 390x844 | permission | lg | 9 | 32 | captured |
| routes-and-stations | loaded-sm | pass | mobile 390x844 | loaded | sm | 8 | 20 | captured |
| routes-and-stations | loading-md | pass | mobile 390x844 | loading | md | 8 | 21 | captured |
| routes-and-stations | permission-lg | pass | mobile 390x844 | permission | lg | 8 | 22 | captured |

## Gates

- Browser render: required through Playwright.
- CSS cascade: tokens.css and components.css are loaded directly from Flow package styles.
- Root: every template root must be visible and wide enough for its viewport.
- Surface: every visual case must show a non-shallow Surface cascade.
- Density/state: markers must propagate beyond the root.
- Slots/modules: required template slots and modules must exist and have non-zero layout boxes.
- Viewport: horizontal overflow and slot overlap are fail-level findings.

## Gaps

- None

