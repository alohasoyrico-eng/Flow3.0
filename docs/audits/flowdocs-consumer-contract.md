# FlowDocs Consumer Contract

Status: **pass**

Decision: **flowdocs-consumer-contract-is-currently-satisfied**

## Summary

- Checks: **9**
- Pass: **9**
- Warn: **0**
- Fail: **0**
- Required command: `cd ../FlowDocs && npm run validate:docs`

## Contract Rule

validate:docs passing is required but not sufficient while LegacyHtmlPageSlot/LegacyHtmlTabSlot remain.

## Critical Routes

- `#/home`
- `#/components/button`
- `#/components/input`
- `#/components/select`
- `#/patterns/agent-conversation`
- `#/templates/agent-workspace`
- `#/foundations/energy`
- `#/primitives/color`

## Checks

| status | severity | id | title | evidence | requiredAction |
| --- | --- | --- | --- | --- | --- |
| pass | high | flowdocs-validate-script | FlowDocs has an executable consumer validation script | npm run build:docs && npm run typecheck:docs && npm run audit:docs && npm run audit:docs-runtime |  |
| pass | high | docs-shell-template-import | Docs shell imports generated Flow DocsShellTemplate | importsDocsShellTemplate=true; usesReactCreateRoot=true |  |
| pass | medium | topbar-sidebar-props | Topbar and sidebar are supplied through Flow template props | topbarProps=true; sidebarProps=true |  |
| pass | high | legacy-page-slot-quarantined | React shell page HTML bridge is explicitly quarantined | 3 innerHTML signal(s); legacyHtmlPageSlotNamed=true |  |
| pass | high | no-app-page-staging-innerhtml | App router does not stage pages through detached innerHTML | 0 app.innerHTML writes; stagingPageMarkup=false |  |
| pass | high | legacy-tab-slot-quarantined | Detail tab HTML bridge is explicitly quarantined | 0 tab panel innerHTML write(s); legacyHtmlTabSlotNamed=false |  |
| pass | high | content-bundle-source-match | Docs content bundle matches package source inputs | bundleMatchesSource=true |  |
| pass | high | runtime-graph-complete | Runtime graph has no missing dependencies | missingDependencies=0 |  |
| pass | medium | legacy-cleanup-explicit | Known legacy cleanup queues are explicit | legacyQuarantineCandidates=49; immediateDeleteCandidates=0; protectedStringReferencedCandidates=16 |  |

## Shell Signals

| signal | value |
| --- | --- |
| importsDocsShellTemplate | true |
| usesReactCreateRoot | true |
| ownsTopbarProps | true |
| ownsSidebarProps | true |
| legacyHtmlPageSlotNamed | true |
| docsPageSlotInnerHtmlWrites | 3 |
| documentQuerySelectors | 4 |
| documentListeners | 1 |
| bodyDatasetMutations | 8 |

## App Router Signals

| signal | value |
| --- | --- |
| stagingPageMarkup | false |
| renderTargetInnerHtmlWrites | 0 |
| tabPanelInnerHtmlWrites | 0 |
| legacyHtmlTabSlotNamed | false |
| importsLocalRenderers | docs-layout, home-stack-renderers, reference-layout, detail-tabs, gold-component-docs |
