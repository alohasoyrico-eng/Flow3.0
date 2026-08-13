# Shell Pattern Contract Governance Audit

Status: **pass**

FlowDocs shell dependencies must rely on governed Flow patterns. Topbar, Sidebar, and Search must expose typed contracts, controlled shell state, and no parallel mobile drawer close control by default.

## Inventory

| Metric | Value |
| --- | ---: |
| shellPatterns | 3 |
| checks | 15 |
| shellPatternContractDebt | 0 |

## Checks

| Pattern | File | Check | Status | Description |
| --- | --- | --- | --- | --- |
| Topbar | packages/react/src/patterns/Topbar.ts | typed-source | pass | Topbar is authored in TS as the public shell contract. |
| Topbar | packages/react/src/patterns/Topbar.ts | navigation-action | pass | Topbar exposes a single navigation action slot for small viewports. |
| Topbar | packages/react/src/patterns/Topbar.ts | controlled-navigation-drawer | pass | Topbar navigation drawer is controlled by the shell state contract. |
| Topbar | packages/react/src/patterns/Topbar.ts | navigation-action-toggle | pass | Topbar navigation action toggles drawer state unless the consumer prevents default. |
| Topbar | packages/react/src/patterns/Topbar.ts | no-default-drawer-close | pass | Topbar navigation drawer does not render a parallel close button by default. |
| Topbar | packages/react/src/patterns/Topbar.ts | delegates-sidebar | pass | Topbar delegates navigation content to Sidebar instead of duplicating the shell list. |
| Sidebar | packages/react/src/patterns/Sidebar.ts | typed-source | pass | Sidebar is authored in TS as the public shell navigation contract. |
| Sidebar | packages/react/src/patterns/Sidebar.ts | controlled-navigation-drawer | pass | Sidebar drawer state is controlled through drawerOpen/onDrawerOpenChange. |
| Sidebar | packages/react/src/patterns/Sidebar.ts | no-default-drawer-close | pass | Sidebar drawer does not render a parallel close button by default. |
| Sidebar | packages/react/src/patterns/Sidebar.ts | route-actions-use-flow-button | pass | Sidebar routes compose Flow Button instead of local anchor/button markup. |
| Sidebar | packages/react/src/patterns/Sidebar.ts | groups-use-surface-accordion | pass | Sidebar groups compose Surface and Accordion for structure. |
| Search | packages/react/src/patterns/Search.ts | typed-source | pass | Search is authored in TS as the public shell search contract. |
| Search | packages/react/src/patterns/Search.ts | search-role | pass | Search carries the semantic search role and Flow pattern marker. |
| Search | packages/react/src/patterns/Search.ts | composes-flow-input | pass | Search composes Flow Input for query entry. |
| Search | packages/react/src/patterns/Search.ts | no-dom-parallel-runtime | pass | Search does not own global DOM behavior directly. |
