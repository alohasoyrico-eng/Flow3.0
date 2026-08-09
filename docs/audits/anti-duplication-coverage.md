# Anti-Duplication Coverage

Status: pass

Flow must have one visual owner per component concept; owner roots, protected roots, duplicate concept rules, and docs scans cannot drift silently. The actionable debt metric is antiDuplicationDebt.

- Component class roots protected: 59
- Accepted components with owner roots: 56/56
- Missing owner roots: 0
- Extension class roots: 3
- Protected high-risk roots: button, card, dialog, drawer, menu, popover
- Blocked concept rules: 2
- Live duplicate concept violations: 0
- Docs apps scanned: ../FlowDocs/apps/docs
- Anti-duplication debt: 0
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. Owner roots, extension roots, protected concepts, and docs apps scanned should not shrink silently.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| checks | 6 | 6 |
| componentClassRoots | 59 | 59 |
| acceptedComponents | 56 | 56 |
| ownerRoots | 56 | 56 |
| missingOwnerRoots | 0 | 0 |
| extensionRoots | 3 | 3 |
| protectedComponentRoots | 6 | 6 |
| blockedConceptRules | 2 | 2 |
| liveDuplicateConceptViolations | 0 | 0 |
| docsApps | 1 | 1 |
| antiDuplicationDebt | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | --- | --- |
| None | None | None |

## Checks

- docs package component class ownership
- component class root registry alignment
- known duplicate concept classes
- primitive interactive DOM factories
- React-only component boundaries
- React component class ownership

## Root Registry Alignment

| Component | React component | Missing owner root |
| --- | --- | --- |
| None | None | None |

## Extension Roots

| Root |
| --- |
| choice |
| country-flag |
| select-control |

## Blocked Concept Rules

| Concept | Blocked class names |
| --- | --- |
| search | pattern-topbar-search, topbar-search, top-search, pattern-search-results |
| account menu | pattern-account-menu |

## Live Duplicate Concept Violations

| Concept | Class | Source |
| --- | --- | --- |
| None | None | None |
