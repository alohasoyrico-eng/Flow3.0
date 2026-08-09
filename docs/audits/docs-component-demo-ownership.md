# Docs Component Demo Ownership

Status: pass

FlowDocs may register and frame React-owned component demos, but it must not own component behavior through direct DOM mutation. The actionable debt metric is docsDemoOwnershipDebt.

## Inventory

- Docs app scanned: ../FlowDocs/apps/docs
- Full modules: 8
- Function regions: 4
- Regions scanned: 12
- Forbidden patterns: 15
- Violations: 0
- Docs demo ownership debt: 0
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. FlowDocs should not silently stop scanning demo ownership regions or allow React-owned demos to mutate component DOM.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| fullModules | 8 | 8 |
| functionRegions | 4 | 4 |
| regions | 12 | 12 |
| forbiddenPatterns | 15 | 15 |
| violations | 0 | 0 |
| docsDemoOwnershipDebt | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Regions

| File | Region | Mode |
| --- | --- | --- |
| ../FlowDocs/apps/docs/choice-demo-interactions.js | full-module | module |
| ../FlowDocs/apps/docs/display-demo-interactions.js | full-module | module |
| ../FlowDocs/apps/docs/overlay-demo-interactions.js | full-module | module |
| ../FlowDocs/apps/docs/progress-indicator-demo-interactions.js | full-module | module |
| ../FlowDocs/apps/docs/slider-demo-interactions.js | full-module | module |
| ../FlowDocs/apps/docs/stateful-component-interactions.js | full-module | module |
| ../FlowDocs/apps/docs/toast-demo-interactions.js | full-module | module |
| ../FlowDocs/apps/docs/tooltip-demo-interactions.js | full-module | module |
| ../FlowDocs/apps/docs/component-demo-interactions.js | setupTextAreaDemos | function |
| ../FlowDocs/apps/docs/component-demo-interactions.js | setupIconButtonDemos | function |
| ../FlowDocs/apps/docs/component-demo-interactions.js | setupCardDemos | function |
| ../FlowDocs/apps/docs/component-demo-interactions.js | setupSliderDemos | function |

## Violations

| Location | Message |
| --- | --- |
| None | None |

