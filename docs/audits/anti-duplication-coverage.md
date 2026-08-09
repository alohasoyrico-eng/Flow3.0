# Anti-Duplication Coverage

Status: pass

- Component class roots protected: 59
- Accepted components with owner roots: 56/56
- Missing owner roots: 0
- Extension class roots: 3
- Protected high-risk roots: button, card, dialog, drawer, menu, popover
- Duplicate concept rules: 2
- Docs apps scanned: ../FlowDocs/apps/docs

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

## Duplicate Concepts

| Concept | Blocked class names |
| --- | --- |
| search | pattern-topbar-search, topbar-search, top-search, pattern-search-results |
| account menu | pattern-account-menu |
