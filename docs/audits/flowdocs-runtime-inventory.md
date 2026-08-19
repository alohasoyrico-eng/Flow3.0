# FlowDocs Runtime Inventory

Entry: index.html

Total files: 898
Reachable files: 453
Unreferenced files: 445

## Summary

- asset-unreferenced: 3
- asset-used: 1
- entry: 1
- generated-unreferenced: 7
- generated-used: 234
- nonruntime-doc: 1
- runtime-used: 209
- source-orphan: 4
- type-artifact: 158
- vendor-dynamic-asset: 265
- vendor-license: 5
- vendor-unreferenced: 2
- vendor-used: 8

## Source Orphans

- component-detail-renderer-governance.json
- pattern-business-renderers.js
- pattern-design-lead.js
- select-interactions.js

## Missing Dependencies

- None

## Next Actions

- Review source-orphan files before deletion; some may be intentionally loaded by route/content indirection not visible to static import tracing.
- Treat generated-unreferenced files as rebuild or clean-output candidates, never canonical source.
- Treat vendor-unreferenced files as dependency cleanup candidates after visual/runtime smoke.
