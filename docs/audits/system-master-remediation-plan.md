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
| Raw token value governance | PASS | 0 violations across 584 scanned files |
| Generated token output governance | PASS | 9 generated outputs match manifest; token source hash matches manifest |
| Primitive runtime matrix | PASS for primitive cascade | 24 primitives, 18 typed runtime contracts, 6 typed policy contracts, 0 JS-only without TS boundary |
| TypeScript real | PASS | TS project setup, public token surface, component contracts, registries, React surfaces, root index, and section indexes pass in audit:complete |
| Phase 3 foundations/primitives checkpoint | PASS | 11/11 foundation cascades, 24/24 primitive cascades, 24 active primitive gates, 0 backlog, 0 source-boundary violations |
| Phase 4 core controls/forms checkpoint | PASS | 21/21 core control components, 8/8 gate reports, 168/168 component gate edges, 0 debt |
| Forensic gates | FAIL | Docs ownership still fails; FlowDocs v2 remains blocked until higher Flow layers close |

Failing blockers:

- 7 docs generated candidates do not map to spec.
- 162 entities have hand-authored docs surfaces.

## Out Of Order Work

Primitive TS runtime/policy contracts were originally generated out of order, but the later TypeScript and Phase 3 gates now pass together in `audit:complete`.

## Phase Plan

| Phase | Initial | Corrected | Status | Objective |
| --- | --- | --- | --- | --- |
| 0. Baseline forense | 1-2 | 1-3 | partial | Freeze inventory, duplication, docs-only, visual debt, token debt, TS debt, repos, commits, exports. |
| 1. Style Dictionary real | 3-7 | 4-10 | complete | Create agnostic token source and multiplatform outputs with governance. |
| 2. TypeScript real | 8-15 | 11-22 | complete | Migrate public Flow packages to TS/TSX real. |
| 3. Foundations/Primitives | 16-19 | 23-28 | complete | Make the base cascade exportable and consumable. |
| 4. Components | 20-24 | 29-40 | in_progress | Audit and type 60 components. |
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

## Phase 2 Status

**Complete by audit evidence.**

- TypeScript project setup PASS.
- Token TypeScript surface PASS.
- Component contract/platform/registry TypeScript surfaces PASS.
- React public source/declaration parity PASS across root and section indexes.
- TS governance blocks public surface drift through `audit:complete`.

## Phase 3 Status

**Complete by audit evidence.**

- Foundation cascade reports PASS: 11/11.
- Primitive cascade reports PASS: 24/24.
- Active primitive gates: 24; backlog: 0.
- Primitive runtime contracts: 18; policy contracts: 6.
- JS-only primitive runtime debt: 0.
- Missing P0 primitive runtime debt: 0.
- Source boundary violations for doc-panel/local typography/fake surface/gradients outside governed source: 0.

## Phase 4 Status

**Started by audit evidence.**

- Component cascade checkpoint PASS.
- Current 60-component gates passing: 11/11.
- React primary components: 60; pass: 60.
- Legacy component 1:1 matrix remains historical at 56 components.
- Legacy matrix gaps explicitly listed: chat-composer, chat-message, chat-thread, input-amount.
- Those 4 gaps are covered by current 60-component gates.
- Component cascade audit debt: 0.
- Core controls/forms checkpoint PASS.
- Core controls/forms components PASS: 21/21.
- Core controls/forms gate reports PASS: 8/8.
- Core controls/forms component gate edges PASS: 168/168.
- Core controls/forms debt: 0.

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

The next correct step is **Phase 4 Components fixes batch 2: overlays/navigation/data**. FlowDocs remains blocked until components, patterns, and templates close on top of the governed lower layers.
