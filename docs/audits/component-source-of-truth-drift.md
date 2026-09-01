# Component Source Of Truth Drift

Generated: 2026-09-01T02:07:31.327Z
Status: pass
Scope: all-components

## Summary

- Components checked: 59
- Aligned: 59
- Drift: 0
- Findings: 0
- High findings: 0
- Medium findings: 0

## Ownership

- editableApiTruth: packages/specs/specs/unison-system/artifacts/components/*.json
- editableCopyTruth: packages/content/content/component-copy/components/*/*.json
- runtimeContractTruth: packages/components/src/contracts.ts, compiled to packages/components/src/contracts.js
- reactTruth: packages/react/src/*.tsx and packages/react/src/*.d.ts, compiled to packages/react/dist
- generatedContractTruth: packages/content/content/component-contracts/components/*.md is generated and must not define new API truth
- generatorTruth: npm run build:component-contracts -- --component=<id> is the scoped generator path; missing components must fail instead of silently writing drift
- localDemoTruth: packages/audit/scripts/build-local-react-qa-demo.mjs must consume React runtime and may not introduce undocumented variants or props

## Findings

- None.
