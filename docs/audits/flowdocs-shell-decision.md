# FlowDocs Shell Decision

Generated: 2026-08-18T19:15:28.542Z
Status: action_required

## Decision

- Result: repair-as-explicit-consumer-adapter
- Demolish now: false

## Rationale

- Flow package primitives/patterns/templates already exist for the shell path.
- The broken part is the adapter layer between FlowDocs legacy string renderers and the Flow React shell.
- Replacing everything now would discard useful content/template work and hide the same boundary problem unless the new shell has stricter contracts.
- Repair is trustworthy only if the legacy DOM mutation path becomes explicitly named and then removed behind gates.

## Repair Conditions

- DocsShellTemplate must expose page background/surface policy as props instead of hardcoding visual policy.
- FlowDocs shell adapter must stop mutating the React-owned page slot with innerHTML, or it must be quarantined behind a named LegacyHtmlPageSlot with a removal gate.
- Topbar search, sidebar navigation, theme, language and grid controls must be driven through Flow props/events, not global querySelector/dataset side effects.
- The old renderShell function must either disappear or become a no-op with an audit that proves it cannot own layout/chrome.
- A consumer shell test must verify keyboard search navigation, sidebar route selection, Escape, focus recovery, action alignment, and mobile nav.

## Totals

- innerHtmlWrites: 5
- querySelectors: 17
- addEventListeners: 4
- datasetMutations: 17

## Blocking Risks

| Severity | File | Issue | Evidence | Impact |
| --- | --- | --- | --- | --- |
| high | ../FlowDocs/apps/docs/app.js | FlowDocs still renders pages through a temporary DOM/string pipeline before React receives the page slot. | app.js assigns app.innerHTML, extracts pageMarkup, then renderDocsShell injects it into a React slot. | This prevents treating the shell as a clean React/Flow consumer boundary. |
| high | ../FlowDocs/apps/docs/docs-shell-react.js | DocsPageSlot mutates ref.current.innerHTML inside React. | React owns the shell wrapper but not the child page tree. | Keyboard, focus, event, and hydration behavior can drift from Flow contracts. |
| medium | ../FlowDocs/apps/docs/shell-controls.js | Grid/theme/navigation shell state is coordinated with querySelector, localStorage, and global dataset mutation. | Shell behavior is outside Flow component props/events. | Repair is possible, but only if these controls become Flow shell props/events or an explicit consumer adapter. |
| medium | packages/react/src/templates/DocsShellTemplate.ts | The package template exists and composes Topbar, Sidebar, Search, DocumentationPageShell and Surface, but still imposes page surface/background policy. | DocsShellTemplate can be the repair target, but its props need to own background/surface/page-slot semantics. | Do not demolish immediately; use it as the system boundary to harden. |

## Shell Files

| File | Signals | Risks | Evidence |
| --- | --- | --- | --- |
| ../FlowDocs/apps/docs/app.js | inner-html-write, document-query-control, global-dataset-state, hash-router-state, manual-event-bridge | React does not own the page subtree end-to-end.; Shell behavior depends on DOM selectors outside Flow component APIs.; State is mirrored through global dataset mutation. | innerHTML=1, query=2, listeners=1, dataset=1 |
| ../FlowDocs/apps/docs/docs-shell-react.js | uses-react-shell-template, inner-html-write, document-query-control, global-dataset-state, hash-router-state, manual-event-bridge, flow-generated-runtime-import, manual-grid-overlay | React does not own the page subtree end-to-end.; Shell behavior depends on DOM selectors outside Flow component APIs.; State is mirrored through global dataset mutation.; Grid overlay is still a local docs behavior, not a Flow shell API. | innerHTML=3, query=4, listeners=1, dataset=10 |
| ../FlowDocs/apps/docs/docs-layout.js | uses-react-shell-template, legacy-render-shell | Legacy shell renderer still participates in page composition. | innerHTML=0, query=0, listeners=0, dataset=0 |
| ../FlowDocs/apps/docs/docs-chrome.js | document-query-control | Shell behavior depends on DOM selectors outside Flow component APIs. | innerHTML=0, query=3, listeners=0, dataset=0 |
| ../FlowDocs/apps/docs/shell-controls.js | inner-html-write, document-query-control, global-dataset-state, local-storage-state, hash-router-state, manual-event-bridge, manual-grid-overlay | React does not own the page subtree end-to-end.; Shell behavior depends on DOM selectors outside Flow component APIs.; State is mirrored through global dataset mutation.; Grid overlay is still a local docs behavior, not a Flow shell API. | innerHTML=1, query=8, listeners=2, dataset=6 |
| ../FlowDocs/apps/docs/styles/01-shell-01.css | manual-grid-overlay | Grid overlay is still a local docs behavior, not a Flow shell API. | innerHTML=0, query=0, listeners=0, dataset=0 |
| ../FlowDocs/apps/docs/styles/01-shell-02.css | none | none | innerHTML=0, query=0, listeners=0, dataset=0 |
| ../FlowDocs/apps/docs/styles/01-shell-react.css | none | none | innerHTML=0, query=0, listeners=0, dataset=0 |
| ../FlowDocs/apps/docs/styles/02-doc-layout.css | none | none | innerHTML=0, query=0, listeners=0, dataset=0 |

## Flow Template Files

| File | Signals | Risks |
| --- | --- | --- |
| packages/react/src/templates/DocsShellTemplate.ts | topbar-composed, sidebar-composed, search-composed, documentation-page-shell-composed, children-slot, surface-page-wrapper, hardcoded-light-background-choice | Template wraps page content in a Surface, which may conflict with the transparent editorial layout expectation.; Background policy is hardcoded in the template instead of supplied as a documented shell prop. |
| packages/react/src/patterns/Topbar.ts | topbar-composed, sidebar-composed, search-composed | none |
| packages/react/src/patterns/Sidebar.ts | sidebar-composed, surface-page-wrapper | none |
| packages/react/src/patterns/Search.ts | search-composed, children-slot | none |
| packages/react/src/patterns/DocumentationPageShell.ts | documentation-page-shell-composed, children-slot, surface-page-wrapper | Template wraps page content in a Surface, which may conflict with the transparent editorial layout expectation. |

## Next Iteration

Iteration 6: Demos Boundary. Classify demo/runtime islands so component QA demos and FlowDocs demos do not mask each other's bugs.

