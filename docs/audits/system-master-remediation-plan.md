# System Master Remediation Plan

Generated: 2026-08-11

This is the tracking source for the corrected remediation plan. It exists because the original 34-iteration estimate was not representative of the real work required to make Flow a serious consumable system and rebuild FlowDocs on top of it.

## Estimate Delta

| Estimate | Iterations |
| --- | ---: |
| Initial | 34 |
| Corrected | 66 |
| Delta | 32 |
| Increase | 94.1% |

Reason: the original estimate undercounted real TypeScript migration, Style Dictionary multiplatform outputs, token ownership, anti-duplication governance, component/pattern/template 1:1 QA, and FlowDocs reconstruction as a consumer.

## Operating Rules

- Do not advance phases unless the phase gate is explicit and recorded.
- Do not count partial implementation as done unless it satisfies the original Definition of Done.
- Report initial estimate, corrected estimate, and evidence when estimates change.
- FlowDocs cleanup must wait for the underlying Flow contracts it is expected to consume.
- No new docs visual behavior should be used as evidence that Flow itself is ready.

## Current Evidence

| Area | Status | Evidence |
| --- | --- | --- |
| Style Dictionary source gate | PASS | 36 source files, 1131 source tokens, 1131 output tokens, 11 foundations, 19 primitive source files, 1 docs-only source file, 0 decision queue tokens |
| Token output gate | PASS | CSS, JSON, TypeScript, Flutter Dart, Android XML, iOS Swift all match 1131 tokens |
| Raw token value governance | PASS | 0 violations across 564 scanned files |
| Generated token output governance | PASS | 7 generated outputs match manifest; token source hash matches manifest |
| Primitive runtime matrix | PASS for primitive cascade | 24 primitives, 18 typed runtime contracts, 6 typed policy contracts, 0 JS-only without TS boundary |
| Forensic gates | FAIL | TS real and docs ownership still fail |

Failing blockers:

- FlowDocs has zero `.ts/.tsx` source files.
- 7 docs generated candidates do not map to spec.
- 162 entities have hand-authored docs surfaces.

## Out Of Order Work

Primitive TS runtime/policy contracts were generated before fully closing Style Dictionary multiplatform outputs and TS migration phases. This work is useful, but it must not be used to claim later phases are complete.

## Phase Plan

| Phase | Initial | Corrected | Status | Objective |
| --- | --- | --- | --- | --- |
| 0. Baseline forense | 1-2 | 1-3 | partial | Freeze inventory, duplication, docs-only, visual debt, token debt, TS debt, repos, commits, exports. |
| 1. Style Dictionary real | 3-7 | 4-10 | complete | Create agnostic token source and multiplatform outputs with governance. |
| 2. TypeScript real | 8-15 | 11-22 | not_started | Migrate public Flow packages to TS/TSX real. |
| 3. Foundations/Primitives | 16-19 | 23-28 | partial_out_of_order | Make the base cascade exportable and consumable. |
| 4. Components | 20-24 | 29-40 | not_started | Audit and type 60 components. |
| 5. Patterns | 25-29 | 41-52 | not_started | Make 63 patterns real and governed. |
| 6. Templates | 30-31 | 53-58 | not_started | Make 9 templates consume real components/patterns. |
| 7. FlowDocs v2 | 32-34 | 59-66 | blocked | Rebuild docs as a consumer of Flow. |

## Phase 1 Status

**Complete as of iteration 10/66.**

- Source gate PASS.
- Output gate PASS.
- Raw value governance PASS.
- Generated output edit governance PASS.
- Email channel values moved behind generated token values for email-safe inline rendering.

## Checkpoints

| After iteration | Checkpoint |
| ---: | --- |
| 10 | Are tokens and Style Dictionary defensible? |
| 22 | Is TypeScript real closed? |
| 28 | Do foundations/primitives sustain a real cascade? |
| 40 | Are components consumable? |
| 52 | Did patterns stop being simulation? |
| 58 | Do templates prove the cascade? |
| 66 | Is FlowDocs a real consumer of Flow? |

## Next Correct Step

The next correct step is the iteration 10 checkpoint, then **Phase 2: TypeScript real** starting at iteration 11. FlowDocs remains blocked until Flow lower layers are defensible.
