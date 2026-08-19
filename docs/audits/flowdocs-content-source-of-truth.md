# FlowDocs Content Source Of Truth

Generated: 2026-08-18T19:15:28.505Z
Status: action_required

## Summary

- bundleInputs: 12
- bundleSourceDependencies: 606
- packageContentFiles: 627
- packageContentInDocsBundle: 373
- packageContentOutsideDocsBundle: 254
- flowdocsContentLoadFiles: 2
- localFlowDocsJsonFiles: 2
- forbiddenRuntimeSourceRefs: 0
- bundleMatchesSource: true

## Bundle

- File: ../FlowDocs/apps/docs/generated/docs-content.bundle.json
- Exists: true
- Matches source: true
- Expected hash: b2e58adfcbf0dafdc7fbeb5336268ef291b6657f481d480ceec713fb78fba595
- Actual hash: b2e58adfcbf0dafdc7fbeb5336268ef291b6657f481d480ceec713fb78fba595

## Bundle Inputs

| Key | Import | Source file |
| --- | --- | --- |
| catalog | #design-system/content/catalog | packages/content/content/catalog.json |
| systemSpec | #design-system/specs/system | packages/specs/specs/unison.system.json |
| componentDocs | #design-system/content/component-docs | packages/content/content/component-docs.json |
| componentCopy | #design-system/content/component-copy | packages/content/content/component-copy.json |
| patternCopy | #design-system/content/pattern-copy | packages/content/content/pattern-copy.json |
| componentImplementationStatus | #design-system/content/component-implementation-status | packages/content/content/component-implementation-status.json |
| foundationCopy | #design-system/content/foundation-copy | packages/content/content/foundation-copy.json |
| primitiveCopy | #design-system/content/primitive-copy | packages/content/content/primitive-copy.json |
| referenceCopy | #design-system/content/reference-copy | packages/content/content/reference-copy.json |
| templateBlueprintContent | #design-system/content/template-blueprints | packages/content/content/template-blueprints.json |
| homeContent | #design-system/content/home | packages/content/content/home.json |
| uiCopy | #design-system/content/i18n-ui | packages/content/content/i18n/ui.json |

## Findings

| Severity | File | Issue | Action |
| --- | --- | --- | --- |
| medium | ../FlowDocs/apps/docs/component-detail-renderer-governance.json | FlowDocs owns a local JSON file outside the generated content bundle. | Decide whether it is source, generated evidence, or delete-candidate in a later cleanup iteration. |
| medium | ../FlowDocs/apps/docs/vendor/open-doodles/manifest.json | FlowDocs owns a local JSON file outside the generated content bundle. | Decide whether it is source, generated evidence, or delete-candidate in a later cleanup iteration. |

## Package Content Classification

| Classification | Count |
| --- | ---: |
| docs-content-source | 373 |
| forensic-doc | 2 |
| governance-evidence-source | 32 |
| governance-source | 14 |
| outside-docs-content-bundle | 206 |

## Local FlowDocs JSON Review

| File | Signals |
| --- | --- |
| ../FlowDocs/apps/docs/component-detail-renderer-governance.json | none |
| ../FlowDocs/apps/docs/vendor/open-doodles/manifest.json | none |

## Runtime Content Load Files

| File | Classification | Signals |
| --- | --- | --- |
| ../FlowDocs/apps/docs/content-loader.js | generic-content-loader | content-load-or-source-reference |
| ../FlowDocs/apps/docs/content-sources.js | content-runtime-bridge | content-load-or-source-reference, loads-generated-content-bundle |

## Next Iteration

Iteration 5: FlowDocs Shell Decision. Decide whether the current FlowDocs shell is a consumer boundary to repair or a legacy shell to replace.

