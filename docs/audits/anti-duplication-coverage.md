# Anti-Duplication Coverage

Status: pass

- Component class roots protected: 53
- Protected high-risk roots: button, card, dialog, drawer, menu, popover
- Duplicate concept rules: 2
- Docs apps scanned: ../FlowDocs/apps/docs

## Checks

- docs package component class ownership
- known duplicate concept classes
- primitive interactive DOM factories
- React-only component boundaries
- React component class ownership

## Duplicate Concepts

| Concept | Blocked class names |
| --- | --- |
| search | pattern-topbar-search, topbar-search, top-search, pattern-search-results |
| account menu | pattern-account-menu |
