# System remediation matrix

Generated: 2026-08-11

This matrix turns the forensic gates into owner-decision tickets. It is not a remediation patch.

## Summary

- Total tickets: 167
- P0 tickets: 38
- P1 tickets: 9
- P2 tickets: 120
- Undecided owner decisions: 167

## By layer

| Layer | Total | P0 | P1 | P2 | Blocked | Needs owner decision | Docs hand surface files |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| foundation | 11 | 11 | 0 | 0 | 11 | 0 | 500 |
| primitive | 24 | 24 | 0 | 0 | 0 | 19 | 474 |
| component | 60 | 0 | 0 | 60 | 0 | 60 | 1184 |
| pattern | 63 | 3 | 0 | 60 | 0 | 63 | 344 |
| template | 9 | 0 | 9 | 0 | 0 | 9 | 26 |

## P0 queue

| Ticket | Status | Docs hand files | Dependencies | Required work |
| --- | --- | ---: | --- | --- |
| foundation:accessibility | blocked | 69 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| foundation:depth | blocked | 29 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| foundation:energy | blocked | 48 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| foundation:frame | blocked | 59 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| foundation:growth | blocked | 11 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| foundation:iconography | blocked | 3 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| foundation:momentum | blocked | 18 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| foundation:state | blocked | 132 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| foundation:symbol | blocked | 24 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| foundation:tone | blocked | 67 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| foundation:voice | blocked | 40 | style-dictionary-real, typescript-source-real | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| primitive:animation-assets | ready_for_verification | 0 | style-dictionary-real, typescript-source-real, foundation-contracts | map foundation/token dependency before component consumption |
| primitive:breakpoints | needs_owner_decision | 2 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:charts | needs_owner_decision | 3 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:color | needs_owner_decision | 54 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:country-flags | ready_for_verification | 0 | style-dictionary-real, typescript-source-real, foundation-contracts | map foundation/token dependency before component consumption |
| primitive:density | needs_owner_decision | 60 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:disabled | needs_owner_decision | 27 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:duration | needs_owner_decision | 11 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:elevation | needs_owner_decision | 44 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:field-action | ready_for_verification | 0 | style-dictionary-real, typescript-source-real, foundation-contracts | map foundation/token dependency before component consumption |
| primitive:focus | needs_owner_decision | 34 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:iconography | needs_owner_decision | 3 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:illustration-assets | ready_for_verification | 0 | style-dictionary-real, typescript-source-real, foundation-contracts | map foundation/token dependency before component consumption |
| primitive:library-sources | ready_for_verification | 0 | style-dictionary-real, typescript-source-real, foundation-contracts | map foundation/token dependency before component consumption |
| primitive:loading | needs_owner_decision | 31 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:maps | needs_owner_decision | 5 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:measurement | needs_owner_decision | 3 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:message | needs_owner_decision | 34 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:motion-curves | needs_owner_decision | 2 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:radius | needs_owner_decision | 51 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:research | needs_owner_decision | 3 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:spacing | needs_owner_decision | 14 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:surface | needs_owner_decision | 86 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| primitive:typography | needs_owner_decision | 7 | style-dictionary-real, typescript-source-real, foundation-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| pattern:search | needs_owner_decision | 48 | style-dictionary-real, typescript-source-real, primitive-cascade-runtime, component-runtime-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>prove composition uses Flow primitives/components without parallel DOM behavior |
| pattern:sidebar | needs_owner_decision | 17 | style-dictionary-real, typescript-source-real, primitive-cascade-runtime, component-runtime-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>prove composition uses Flow primitives/components without parallel DOM behavior |
| pattern:topbar | needs_owner_decision | 20 | style-dictionary-real, typescript-source-real, primitive-cascade-runtime, component-runtime-contracts | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>prove composition uses Flow primitives/components without parallel DOM behavior |

## Foundations 1:1

| Foundation | Status | Docs hand files | Required work |
| --- | --- | ---: | --- |
| accessibility | blocked | 69 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| depth | blocked | 29 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| energy | blocked | 48 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| frame | blocked | 59 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| growth | blocked | 11 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| iconography | blocked | 3 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| momentum | blocked | 18 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| state | blocked | 132 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| symbol | blocked | 24 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| tone | blocked | 67 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |
| voice | blocked | 40 | define canonical token/foundation source; no ad hoc docs-only visual behavior<br>classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete |

## Primitives 1:1

| Primitive | Status | Flow runtime | Docs hand files | Required work |
| --- | --- | --- | ---: | --- |
| animation-assets | ready_for_verification | yes | 0 | map foundation/token dependency before component consumption |
| breakpoints | needs_owner_decision | no | 2 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| charts | needs_owner_decision | yes | 3 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| color | needs_owner_decision | no | 54 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| country-flags | ready_for_verification | yes | 0 | map foundation/token dependency before component consumption |
| density | needs_owner_decision | no | 60 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| disabled | needs_owner_decision | no | 27 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| duration | needs_owner_decision | no | 11 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| elevation | needs_owner_decision | no | 44 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| field-action | ready_for_verification | no | 0 | map foundation/token dependency before component consumption |
| focus | needs_owner_decision | no | 34 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| iconography | needs_owner_decision | yes | 3 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| illustration-assets | ready_for_verification | yes | 0 | map foundation/token dependency before component consumption |
| library-sources | ready_for_verification | yes | 0 | map foundation/token dependency before component consumption |
| loading | needs_owner_decision | no | 31 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| maps | needs_owner_decision | yes | 5 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| measurement | needs_owner_decision | no | 3 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| message | needs_owner_decision | no | 34 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| motion-curves | needs_owner_decision | no | 2 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| radius | needs_owner_decision | no | 51 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| research | needs_owner_decision | no | 3 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| spacing | needs_owner_decision | no | 14 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| surface | needs_owner_decision | no | 86 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |
| typography | needs_owner_decision | no | 7 | classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete<br>map foundation/token dependency before component consumption |

## How to use this matrix

1. Do not start remediation for an entity until `ownerDecision` is set.
2. Start with P0 foundations/primitives and shell patterns because every higher layer depends on them.
3. Use the JSON file for the full file-level evidence; Markdown intentionally summarizes the highest-signal queues.
