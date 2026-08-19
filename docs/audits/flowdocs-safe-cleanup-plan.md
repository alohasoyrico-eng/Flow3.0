# FlowDocs Safe Cleanup Plan

Status: **action_required**

Decision: **cleanup-is-possible-but-most-debt-is-runtime-protected**

## Summary

- Immediate delete candidates: **0**
- String-referenced candidates protected: **16**
- Runtime files protected for now: **453**
- Legacy quarantine candidates: **49**
- Gate rewrite candidates: **7**
- Protected runtime debt areas: **4**

## Interpretation

Most FlowDocs debt is not safe to delete yet because it is still reachable runtime. The safe move is to quarantine reachable HTML renderers as explicit legacy slots, repair stale/mixed gates, and delete only unreferenced files after a smoke run.

## Cleanup Order

1. Repair gates that reference stale or mixed ownership so cleanup results are trustworthy.
2. Remove only unreferenced assets/generated artifacts/source orphans after one runtime smoke.
3. Mark reachable HTML renderers as legacy adapters instead of deleting them.
4. Replace home/collection/detail/reference templates with Flow consumer contracts.
5. Only then remove legacy slots and local renderers.

## Immediate Delete Candidates

_No rows._

## String-Referenced Candidates Protected

| file | reason | action |
| --- | --- | --- |
| ../FlowDocs/apps/docs/assets/hero-visual-dark.png | asset-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/assets/hero-visual-light.png | asset-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/assets/logo-dark.svg | asset-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/component-detail-renderer-governance.json | source-orphan | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/generated/react/index.js | generated-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/generated/react/patterns/index.js | generated-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/generated/react/templates/ComponentDetailTemplate.js | generated-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/generated/react/templates/PatternDetailTemplate.js | generated-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/generated/react/templates/TemplateDetailTemplate.js | generated-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/generated/react/templates/index.js | generated-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/generated/vendor/echarts.esm.min.js | generated-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/pattern-business-renderers.js | source-orphan | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/pattern-design-lead.js | source-orphan | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/select-interactions.js | source-orphan | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/vendor/echarts.esm.min.js | vendor-unreferenced | keep; referenced by runtime/build/audit string outside import graph |
| ../FlowDocs/apps/docs/vendor/open-doodles/manifest.json | vendor-unreferenced | keep; referenced by runtime/build/audit string outside import graph |

## Legacy Quarantine Candidates

| file | signals | owner | action |
| --- | --- | --- | --- |
| ../FlowDocs/apps/docs/gold-component-core.js | 10 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/pattern-react-islands.js | 9 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/template-react-islands.js | 7 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/family-component-docs.js | 6 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/app.js | 5 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/docs-layout.js | 5 | page-renderer | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/detail-tabs-core.js | 4 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/primitive-tabs.js | 4 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/visual-examples.js | 4 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/component-foundation-trace.js | 3 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/docs-shell-react.js | 3 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/documentation-section-island.js | 3 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/gold-simple-component-docs.js | 3 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/pattern-miel-tabs.js | 3 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/pattern-operational-demos.js | 3 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/template-react-demos.js | 3 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/button-playground-interactions.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/demo-preview-frame-island.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/foundation-tabs.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/gold-button-docs.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/gold-card-docs.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/gold-checkbox-docs.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/gold-icon-button-docs.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/gold-input-docs.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/gold-radio-button-docs.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/gold-select-docs.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/gold-switch-docs.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/gold-text-area-docs.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/pattern-build-gates.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |
| ../FlowDocs/apps/docs/pattern-mobile-demos.js | 2 | html-adapter | rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement |

## Gate Rewrite Candidates

| severity | file | issue | action |
| --- | --- | --- | --- |
| high | packages/audit/scripts/audit-integration.js | Runs generated evidence checks such as component 1:1 matrix and FlowDocs template composition alongside package contracts. | Keep package/runtime checks; move template composition and generated quality matrix checks out of the integration gate. |
| high | packages/audit/scripts/audit-system-scope.js | Includes FlowDocs demo ownership and generated reporting in the same scope as React/package boundary checks. | Split FlowDocs consumer ownership from Flow core readiness. |
| high | packages/audit/scripts/audit-system.js | Legacy all-in-one gate still mixes Flow core, FlowDocs app files, content ownership, generated reports, and visual/doc parity checks. | Do not use as the trustworthy system gate until split into core, consumer, content, and forensic gates. |
| medium | packages/audit/scripts/audit-component-implementation-status.js | reads-flowdocs-runtime, legacy-narrative-or-zip-signal, missing-flowdocs-runtime-reference | Fix stale FlowDocs path assumptions before this can gate anything. |
| medium | packages/audit/scripts/audit-context.js | reads-flowdocs-runtime, reads-content-copy, legacy-narrative-or-zip-signal, missing-flowdocs-runtime-reference | Fix stale FlowDocs path assumptions before this can gate anything. |
| medium | packages/audit/scripts/audit-css-ownership.js | reads-flowdocs-runtime, legacy-narrative-or-zip-signal, missing-flowdocs-runtime-reference | Fix stale FlowDocs path assumptions before this can gate anything. |
| medium | packages/audit/scripts/audit-template-composition.js | reads-flowdocs-runtime, reads-content-copy, missing-flowdocs-runtime-reference | Fix stale FlowDocs path assumptions before this can gate anything. |

## Protected Runtime Debt

| area | evidence | action |
| --- | --- | --- |
| Shell mutation | 5 innerHTML writes, 17 querySelector calls, 17 dataset mutations | do not delete; replace through DocsShell consumer adapter |
| Template hybrid layer | 53 local renderer files and 50 HTML-boundary files | quarantine as legacy slots; replace page by page with template contracts |
| Demo boundary | 73 FlowDocs demo risk files | keep as docs harness only; package behavior must be proven in package tests/local QA |
| Content source | 254 package content files outside docs bundle; 2 local FlowDocs JSON files | do not call bundle stale; classify non-docs bundle content before deletion |
