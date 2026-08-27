# Cascade Override Governance

Status: **fail**

Cascade overrides must be owned by the layer that defines the contract: tokens/theme in Style Dictionary token contexts, foundations/primitives in token or primitive sources, component-local aliases in component CSS, and docs/templates only through public Flow APIs.

## Inventory

- Files scanned: 1743
- Findings: 1261
- Override debt: 5
- Errors: 0
- Warnings: 5
- Unassigned debt: 2
- Ownership map: packages/audit/contracts/foundation-primitive-ownership.json

## Debt By Domain Kind

| Kind | Findings |
| --- | ---: |
| foundation | 3 |
| unknown | 2 |

## Debt By Layer

| Layer | Findings |
| --- | ---: |
| flowdocs | 5 |

## Debt By Domain

| Domain | Findings |
| --- | ---: |
| motion | 2 |
| unknown | 2 |
| frame-control-geometry | 1 |

## Debt By Owner

| Owner | Findings |
| --- | ---: |
| momentum/motion primitive | 2 |
| unassigned | 2 |
| control-frame primitive | 1 |

## Remediation Queue

| Order | Kind | Domain | Owner | Layer | Type | Findings | First location |
| ---: | --- | --- | --- | --- | --- | ---: | --- |
| 1 | foundation | motion | momentum/motion primitive | flowdocs | style-mutation | 2 | ../FlowDocs/apps/docs/reference-demo-interactions.js:40 |
| 2 | unknown | unknown | unassigned | flowdocs | style-mutation | 2 | ../FlowDocs/apps/docs/shell-controls.js:47 |
| 3 | foundation | frame-control-geometry | control-frame primitive | flowdocs | style-mutation | 1 | ../FlowDocs/apps/docs/shell-controls.js:49 |

## Debt Findings

| Severity | Kind | Domain | Layer | Location | Type | Property/Variable | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| warning | foundation | motion | flowdocs | ../FlowDocs/apps/docs/reference-demo-interactions.js:40 | style-mutation | animation | Style mutation writes visual policy outside CSS/tokens and bypasses the Flow cascade. |
| warning | foundation | motion | flowdocs | ../FlowDocs/apps/docs/reference-demo-interactions.js:42 | style-mutation | animation | Style mutation writes visual policy outside CSS/tokens and bypasses the Flow cascade. |
| warning | unknown | unknown | flowdocs | ../FlowDocs/apps/docs/shell-controls.js:47 | style-mutation | position | Style mutation writes visual policy outside CSS/tokens and bypasses the Flow cascade. |
| warning | unknown | unknown | flowdocs | ../FlowDocs/apps/docs/shell-controls.js:48 | style-mutation | visibility | Style mutation writes visual policy outside CSS/tokens and bypasses the Flow cascade. |
| warning | foundation | frame-control-geometry | flowdocs | ../FlowDocs/apps/docs/shell-controls.js:49 | style-mutation | inlineSize | Style mutation writes visual policy outside CSS/tokens and bypasses the Flow cascade. |
