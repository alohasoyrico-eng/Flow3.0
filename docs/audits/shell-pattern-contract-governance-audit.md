# Shell Pattern Contract Governance Audit

Status: **pass**

FlowDocs shell dependencies must rely on governed Flow patterns. Topbar, Sidebar, Search, Toolbar, and Command Palette must expose typed contracts, controlled shell state, delegated pattern boundaries, and no parallel shell behavior by default.

## Inventory

| Metric | Value |
| --- | ---: |
| shellPatterns | 5 |
| checks | 25 |
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
| Toolbar | packages/react/src/patterns/Toolbar.ts | typed-source | pass | Toolbar is authored in TS as the public local action shell contract. |
| Toolbar | packages/react/src/patterns/Toolbar.ts | toolbar-role | pass | Toolbar carries the semantic toolbar role and Flow pattern marker. |
| Toolbar | packages/react/src/patterns/Toolbar.ts | composes-flow-controls | pass | Toolbar composes Flow controls for actions, filters, status, overflow, and feedback. |
| Toolbar | packages/react/src/patterns/Toolbar.ts | delegates-search-boundary | pass | Toolbar delegates complex query behavior to Search instead of cloning the pattern. |
| Toolbar | packages/react/src/patterns/Toolbar.ts | delegates-topbar-boundary | pass | Toolbar keeps global shell actions in Topbar instead of owning them locally. |
| Command Palette | packages/react/src/patterns/CommandPalette.ts | typed-source | pass | Command Palette is authored in TS as the public command shell contract. |
| Command Palette | packages/react/src/patterns/CommandPalette.ts | pattern-marker | pass | Command Palette carries a Flow pattern marker and explicit state model. |
| Command Palette | packages/react/src/patterns/CommandPalette.ts | composes-dialog-input-menu | pass | Command Palette composes Flow Dialog, Input, and Menu instead of raw overlay rows. |
| Command Palette | packages/react/src/patterns/CommandPalette.ts | empty-and-feedback | pass | Command Palette owns empty recovery and feedback through Flow components. |
| Command Palette | packages/react/src/patterns/CommandPalette.ts | controlled-open-query-execution | pass | Command Palette exposes controlled open, query, command select, and primary action callbacks. |
