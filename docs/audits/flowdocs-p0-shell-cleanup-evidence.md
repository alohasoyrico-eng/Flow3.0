# FlowDocs P0 shell cleanup evidence

Generated: 2026-08-13

Status: pass

FlowDocs: ../FlowDocs @ fe5a6f4

| Status | Check | File | Description |
| --- | --- | --- | --- |
| pass | generated-sidebar-no-default-close | ../FlowDocs/apps/docs/generated/react/patterns/Sidebar.js:1 | FlowDocs generated Sidebar bridge consumes the governed Flow default: no parallel drawer close button. |
| pass | generated-sidebar-no-stale-default-close | ../FlowDocs/apps/docs/generated/react/patterns/Sidebar.js:1 | FlowDocs generated Sidebar bridge must not preserve the stale close-button default. |
| pass | generated-topbar-no-default-close | ../FlowDocs/apps/docs/generated/react/patterns/Topbar.js:1 | FlowDocs generated Topbar bridge consumes the governed Flow default: no parallel drawer close button. |
| pass | generated-topbar-no-stale-default-close | ../FlowDocs/apps/docs/generated/react/patterns/Topbar.js:1 | FlowDocs generated Topbar bridge must not preserve the stale close-button default. |
| pass | docs-shell-cachebust-template | ../FlowDocs/apps/docs/docs-shell-react.js:1 | FlowDocs shell imports the regenerated Docs Shell Template with a fresh cache key. |
| pass | docs-shell-mobile-action-attributes | ../FlowDocs/apps/docs/docs-shell-react.js:1 | FlowDocs shell exposes governed action attributes for responsive CSS decisions. |
| pass | docs-shell-template-imports-sidebar | ../FlowDocs/apps/docs/generated/react/templates/DocsShellTemplate.js:1 | Generated Docs Shell Template owns the Sidebar bridge import instead of docs-shell-react duplicating it. |
| pass | docs-shell-template-imports-topbar | ../FlowDocs/apps/docs/generated/react/templates/DocsShellTemplate.js:1 | Generated Docs Shell Template owns the Topbar bridge import instead of docs-shell-react duplicating it. |
| pass | docs-shell-mobile-sidebar-state | ../FlowDocs/apps/docs/styles/01-shell-react.css:1 | FlowDocs mobile sidebar visibility is controlled by the same hamburger state. |
| pass | docs-shell-mobile-no-sidebar-column | ../FlowDocs/apps/docs/styles/01-shell-react.css:1 | FlowDocs mobile layout removes the persistent sidebar column. |
| pass | docs-shell-mobile-search-space | ../FlowDocs/apps/docs/styles/01-shell-react.css:1 | FlowDocs mobile shell hides secondary actions so search can use available width. |
| pass | docs-bridge-prunes-source-ts | ../FlowDocs/scripts/build-docs-assets.mjs:1 | FlowDocs bridge avoids copying raw TS component sources as a second source of truth. |
| pass | docs-audit-blocks-stale-sidebar-close-default | ../FlowDocs/audit/audit-docs-shell-boundary.js:1 | FlowDocs audit fails if stale Sidebar close-button defaults return. |
| pass | docs-audit-blocks-stale-topbar-close-default | ../FlowDocs/audit/audit-docs-shell-boundary.js:1 | FlowDocs audit fails if stale Topbar close-button defaults return. |
