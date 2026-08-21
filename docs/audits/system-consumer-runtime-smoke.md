# System consumer runtime smoke

Generated: 2026-08-14

## Summary

- Status: pass
- Packed files: 1365
- Resolved exports: 15
- Rendered artifacts: 19
- Consumer runtime smoke debt: 0

## Rendered Artifacts

| Artifact | Markup length |
| --- | ---: |
| Button | 168 |
| Card | 305 |
| Input | 326 |
| Select | 1181 |
| Table | 278 |
| CodeBlock | 537 |
| Search | 1303 |
| Sidebar | 1922 |
| Topbar | 1547 |
| DocumentationHero | 1182 |
| DocumentationSection | 859 |
| DemoPreviewFrame | 778 |
| ArtifactMetadataBar | 842 |
| OnThisPageNav | 497 |
| DocsShellTemplate | 5565 |
| DocsHomeTemplate | 4515 |
| ComponentDetailTemplate | 4294 |
| PatternDetailTemplate | 5998 |
| FleetDashboardSuite | 13660 |

## Policy

- Package boundary: Runtime smoke must import through public @alohasoyrico-eng/flow exports only.
- Render boundary: Representative components, documentation patterns, and templates must render outside FlowDocs.
- Docs leak boundary: Rendered markup must not leak apps/docs, docs-demo, gold-* or sourcemap markers.
