# FlowDocs Template Boundary

Status: **action_required**

Decision: **package-templates-exist-but-flowdocs-pages-are-hybrid**

## Summary

- React template sources: **18**
- Template specs: **17**
- Generated FlowDocs React templates: **18**
- FlowDocs JS files scanned: **148**
- Local renderer/template/demo/island files: **53**
- Files with HTML boundary signals: **50**
- Files using React template markers: **19**
- Missing required source templates: **none**
- Missing required generated templates: **none**

## Findings

### HIGH: FlowDocs detail pages are still hybrid templates

docs-layout.js mounts DocsArtifactDetailTemplate through a React island, but bodyHtml/tab bodies are still string HTML produced by local tab renderers.

Files: `../FlowDocs/apps/docs/docs-layout.js`, `../FlowDocs/apps/docs/detail-tabs-core.js`

### HIGH: Home and collection pages still have local page renderers

renderHomeContent/renderStackContent/renderCollectionContent produce page sections and grids in FlowDocs instead of using DocsHomeTemplate/DocsCollectionTemplate as the full page contract.

Files: `../FlowDocs/apps/docs/home-stack-renderers.js`, `../FlowDocs/apps/docs/docs-layout.js`

### MEDIUM: Foundation and primitive reference pages remain local body adapters

reference-layout.js uses Flow islands for some sections/lists/grids, but still owns reference headers, breadcrumbs, peer nav, dividers and body composition.

Files: `../FlowDocs/apps/docs/reference-layout.js`

### MEDIUM: Generated templates exist, but generated runtime copy is not proof of template ownership

FlowDocs has generated React templates, yet local renderers still decide page structure and content slots. The source of truth must remain packages/react plus specs.

Files: `../FlowDocs/apps/docs/generated/react/templates`, `packages/react/src/templates`

## Known Template Boundary

| boundary | file | exportedRenderers | reactTemplateIsland | htmlBoundarySignals |
| --- | --- | --- | --- | --- |
| home | home-stack-renderers.js | renderHomeContent, renderStackContent | yes | 1 |
| collection | docs-layout.js | renderCollectionContent, renderDetailContent, renderReferenceDetailContent, renderShell | yes | 5 |
| detailTabs | detail-tabs-core.js |  | no | 4 |
| reference | reference-layout.js |  | no | 2 |
| shell | docs-layout.js | renderCollectionContent, renderDetailContent, renderReferenceDetailContent, renderShell | yes | 5 |

## Highest HTML Boundary Files

| file | bodyHtml | previewHtml | innerHTML | dangerouslySetInnerHTML | componentDemo | documentationSectionIsland | total |
| --- | --- | --- | --- | --- | --- | --- | --- |
| gold-component-core.js | 1 | 6 | 0 | 0 | 2 | 1 | 10 |
| pattern-react-islands.js | 3 | 3 | 0 | 3 | 0 | 0 | 9 |
| template-react-islands.js | 5 | 0 | 0 | 2 | 0 | 0 | 7 |
| family-component-docs.js | 0 | 0 | 0 | 0 | 6 | 0 | 6 |
| app.js | 3 | 0 | 1 | 0 | 0 | 1 | 5 |
| docs-layout.js | 5 | 0 | 0 | 0 | 0 | 0 | 5 |
| detail-tabs-core.js | 1 | 0 | 0 | 0 | 2 | 1 | 4 |
| primitive-tabs.js | 1 | 0 | 0 | 0 | 2 | 1 | 4 |
| visual-examples.js | 2 | 0 | 0 | 0 | 0 | 2 | 4 |
| component-foundation-trace.js | 1 | 0 | 0 | 0 | 1 | 1 | 3 |
| docs-shell-react.js | 0 | 0 | 3 | 0 | 0 | 0 | 3 |
| documentation-section-island.js | 2 | 0 | 0 | 0 | 0 | 1 | 3 |
| gold-simple-component-docs.js | 0 | 2 | 0 | 0 | 1 | 0 | 3 |
| pattern-miel-tabs.js | 1 | 0 | 0 | 0 | 1 | 1 | 3 |
| pattern-operational-demos.js | 1 | 0 | 0 | 0 | 1 | 1 | 3 |
| template-react-demos.js | 1 | 1 | 0 | 0 | 0 | 1 | 3 |
| button-playground-interactions.js | 0 | 0 | 2 | 0 | 0 | 0 | 2 |
| demo-preview-frame-island.js | 0 | 2 | 0 | 0 | 0 | 0 | 2 |
| foundation-tabs.js | 1 | 0 | 0 | 0 | 0 | 1 | 2 |
| gold-button-docs.js | 0 | 1 | 0 | 0 | 1 | 0 | 2 |

## Local Renderer Files

| file | exportedRenderers | reactTemplateIsland | generatedImports | knownTemplateNames | htmlBoundarySignals |
| --- | --- | --- | --- | --- | --- |
| catalog-renderers.js |  | no | no |  | 1 |
| choice-demo-interactions.js |  | no | no |  | 0 |
| component-demo-interactions.js |  | no | no |  | 1 |
| component-demo.js |  | no | no |  | 1 |
| demo-preview-frame-island.js |  | no | no |  | 2 |
| detail-tabs-core.js |  | no | no | index | 4 |
| detail-tabs.js |  | no | no |  | 0 |
| display-demo-interactions.js |  | no | no |  | 0 |
| docs-layout.js | renderCollectionContent, renderDetailContent, renderReferenceDetailContent, renderShell | yes | no | index | 5 |
| docs-template-islands.js |  | no | yes | DocsCollectionTemplate, DocsHomeTemplate | 1 |
| documentation-section-island.js |  | no | no |  | 3 |
| foundation-tabs.js |  | no | no | index | 2 |
| gold-tabs-docs.js |  | no | no |  | 0 |
| home-stack-renderers.js | renderHomeContent, renderStackContent | yes | no | index | 1 |
| overlay-demo-interactions.js |  | no | no |  | 0 |
| pattern-business-renderers.js |  | no | no |  | 0 |
| pattern-candidate-demos.js |  | no | no |  | 0 |
| pattern-contract-tabs.js |  | no | no | index | 1 |
| pattern-desktop-demos.js |  | no | no |  | 1 |
| pattern-desktop-react-demos.js |  | no | no |  | 0 |
| pattern-journey-demos.js |  | no | no |  | 1 |
| pattern-journey-react-demos.js |  | no | no |  | 0 |
| pattern-miel-tabs.js |  | no | no |  | 3 |
| pattern-mobile-demos.js |  | no | no | index | 2 |
| pattern-mobile-react-demos.js |  | no | no |  | 0 |
| pattern-operational-demos.js |  | no | no |  | 3 |
| pattern-operational-react-demos.js |  | no | no |  | 0 |
| pattern-package-demo.js |  | no | no |  | 1 |
| pattern-react-candidate-file-upload-island.js |  | no | no |  | 0 |
| pattern-react-candidate-filter-chip-group-island.js |  | no | no |  | 0 |
| pattern-react-candidate-islands.js |  | no | no |  | 0 |
| pattern-react-candidate-toolbar-island.js |  | no | no |  | 0 |
| pattern-react-desktop-islands.js |  | no | no |  | 0 |
| pattern-react-islands.js |  | no | no | index | 9 |
| pattern-react-journey-islands.js |  | no | no |  | 0 |
| pattern-react-mobile-islands.js |  | no | no |  | 0 |
| pattern-react-operational-islands.js |  | no | no |  | 0 |
| pattern-react-shell-islands.js |  | no | no |  | 0 |
| pattern-shell-react-demos.js |  | no | no |  | 0 |
| pattern-tabs.js |  | no | no | index | 1 |
| pattern-utility-demos.js |  | no | no |  | 1 |
| primitive-tabs.js |  | no | no | index | 4 |
| progress-indicator-demo-interactions.js |  | no | no |  | 0 |
| react-component-islands.js |  | no | no |  | 0 |
| reference-demo-interactions.js |  | no | no |  | 2 |
| reference-layout.js |  | no | no | index | 2 |
| template-desktop-demos.js |  | no | no |  | 0 |
| template-desktop-interactions.js |  | no | no |  | 2 |
| template-react-demos.js |  | yes | no |  | 3 |
| template-react-islands.js |  | no | yes | AgentWorkspace, ConfigurationConsole, DocsArtifactDetailTemplate, DriverCardWallet, DriverMobileApp, FleetDashboardSuite, FleetManagerDesktop, InternalOperationsConsole, ReferenceDetailTemplate, RoutesAndStations, SettingsWorkspace | 7 |
| template-tabs.js |  | no | no |  | 2 |
| toast-demo-interactions.js |  | no | no |  | 0 |
| tooltip-demo-interactions.js |  | no | no |  | 0 |

## Remediation Gate

- DocsHomeTemplate owns home layout; home-stack-renderers.js can only provide typed content sections, not raw page layout.
- DocsCollectionTemplate owns collection index layout; docs-layout.js cannot render docs-page-intro/group-block/catalog-grid directly.
- DocsArtifactDetailTemplate owns detail structure and tabs; tab changes cannot mutate #tabPanel.innerHTML.
- ReferenceDetailTemplate owns foundation/primitive detail layout; reference-layout.js becomes content adapter or is removed.
- FlowDocs local HTML adapters must be named LegacyHtmlPageSlot/LegacyHtmlTabSlot with expiration gate.
- Consumer QA must cover home, collection, component detail, pattern detail, template detail, foundation detail and primitive detail.
