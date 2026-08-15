# System consumer boundary checkpoint

Generated: 2026-08-14

## Summary

- Status: pass
- Reports: 7
- Passing reports: 7
- Packed files: 1362
- Resolved exports: 16
- Rendered artifacts: 20
- Typed components: 7
- Typed patterns: 8
- Typed templates: 5
- Negative type assertions: 4
- Token markers: 4
- Component alias markers: 6
- React export entries: 155
- Exported React dist runtime files: 155
- Published React src files: 0
- React private import targets to src: 1
- Dist import leaks: 0
- Build check status: 0
- Source truth debt: 0
- Source runtime mirror count: 156
- Consumer boundary checkpoint debt: 0

## Reports

| Report | Status | Debt | File |
| --- | ---: | ---: | --- |
| react-source-of-truth | pass | 0 | docs/audits/system-react-source-of-truth.json |
| react-build-reproducibility | pass | 0 | docs/audits/system-react-build-reproducibility.json |
| react-export-parity | pass | 0 | docs/audits/system-react-export-parity.json |
| react-publication-boundary | pass | 0 | docs/audits/system-react-publication-boundary.json |
| consumer-runtime-smoke | pass | 0 | docs/audits/system-consumer-runtime-smoke.json |
| consumer-css-token-cascade | pass | 0 | docs/audits/system-consumer-css-token-cascade.json |
| consumer-type-smoke | pass | 0 | docs/audits/system-consumer-type-smoke.json |

## Mismatches

- None.

## Policy

- Public boundary: Consumers must import runtime, types, tokens CSS, and component CSS through public package exports.
- Package boundary: Published React dist runtime files must be exported or explicitly internal.
- Build boundary: Generated runtime and declarations must be reproducible from authored TS/TSX source.
- Evidence boundary: This checkpoint aggregates existing audited evidence; it does not replace visual QA or exhaustive interaction QA.

## Residual Risk

- The source runtime mirror still exists as generated compatibility output and is tracked as srcRuntimeMirrorCount.
- This checkpoint is representative for consumer runtime/type behavior, not exhaustive across every prop and interaction.
- This checkpoint does not claim FlowDocs visual parity, shell quality, search keyboard quality, or sidebar/topbar UX closure.
