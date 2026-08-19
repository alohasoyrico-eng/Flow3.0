# FlowDocs Trustworthy Checkpoint

Status: **blocked**

Decision: **repair-flowdocs-before-calling-it-trustworthy**

Confidence: **high**

## Current Plan Status

- Completed iterations: **17**
- Current checkpoint: **Go/No-Go**
- Result: **No-Go for trustworthy FlowDocs; iterations 11-17 are repaired, LegacyHtmlPageSlot and hybrid template/demo debt remain blocking.**

## Go / No-Go

| area | decision | reason |
| --- | --- | --- |
| FlowDocs as current app | NO-GO | Consumer contract now passes, but LegacyHtmlPageSlot remains active and FlowDocs still has hybrid template/demo debt. |
| Demolish FlowDocs now | NO-GO | Runtime inventory shows 448 reachable files and useful generated/templates/content work. Demolition would hide boundary problems instead of proving replacement. |
| Repair as explicit Flow consumer adapter | GO | DocsShellTemplate and generated Flow templates exist; content bundle matches source; cleanup queues and blockers are explicit. |
| Continue component QA in parallel | CONDITIONAL-GO | Component QA can continue only if FlowDocs debt is not treated as proof of component readiness. |

## Blockers

| priority | blocker | evidence | requiredExit |
| --- | --- | --- | --- |
| P0 | React shell still writes legacy page HTML | 3 innerHTML signals in docs-shell-react.js | Replace with typed React children or explicitly quarantine as LegacyHtmlPageSlot with removal gate. |
| P1 | Top-level gates still mix Flow core and FlowDocs consumer evidence | 4 mixed top-level gates; 7 gate rewrite candidates | Split Flow core, FlowDocs consumer, content, and forensic/parity gates. |
| P1 | FlowDocs templates remain hybrid | 53 local renderer files; 50 HTML boundary files | Home, collection, detail, foundation and primitive pages must be owned by Flow templates or explicit legacy slots. |

## Proven

| claim | evidence |
| --- | --- |
| Content bundle is not stale | bundleMatchesSource=true; 606 source dependencies |
| Runtime graph is complete | 0 missing dependencies |
| FlowDocs imports generated DocsShellTemplate | importsDocsShellTemplate=true; usesReactCreateRoot=true |
| Cleanup is bounded | 0 delete candidates; 49 quarantine candidates |
| Demo boundary is classified | 73 risky docs demo files; 0 mixed Flow claim files |
| Detail tabs no longer mutate #tabPanel from app.js | 0 tab panel innerHTML writes |
| Foundation/primitive detail routes use ReferenceDetailTemplate | reachableFiles=453; generated-used=234 |
| App router no longer stages pages through detached innerHTML | 0 app.innerHTML writes; stagingPageMarkup=false |
| FlowDocs consumer contract currently passes | 9 pass / 0 fail |
| Safe delete queue is closed | 0 immediate delete candidates; 16 string-referenced candidates protected |

## Not Proven

- FlowDocs is not yet a trustworthy consumer of Flow end to end.
- Passing validate:docs and the consumer contract is not sufficient while LegacyHtmlPageSlot remains active.
- FlowDocs visual/runtime behavior must not be used as proof of component production readiness.
- The old mixed audits cannot be treated as authoritative system gates.

## Next Remediation Plan

| iteration | name | outcome |
| --- | --- | --- |
| 11 | Legacy slot quarantine | Rename/mark current page and tab HTML bridges as LegacyHtmlPageSlot and LegacyHtmlTabSlot, with audit-visible expiry. |
| 12 | Gate split | Separate Flow core, FlowDocs consumer, content source, and forensic/parity gates. |
| 13 | Home/collection template replacement | DocsHomeTemplate and DocsCollectionTemplate own layout; local renderers only provide typed content data. |
| 14 | Detail tabs replacement | DocsArtifactDetailTemplate owns tab state/body; remove #tabPanel.innerHTML path. |
| 15 | Reference template replacement | Foundation/primitive pages move to ReferenceDetailTemplate ownership. |
| 16 | Router staging removal | Remove detached app.innerHTML page staging so routes pass page content directly into DocsShellTemplate adapter. |
| 17 | Delete safe orphans | Remove immediate delete candidates after runtime smoke and protect string-referenced non-runtime files. |
| 18 | Consumer QA gate | Run validate:docs plus critical route smoke for home, components, patterns, templates, foundations and primitives. |
