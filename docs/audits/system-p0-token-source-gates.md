# P0.1 Token Source Gates

Status: **pass**

These gates validate that Style Dictionary now has a governed foundation source shape instead of one flat CSS-derived source.

## Totals

- Source files: 36
- Source tokens: 1149
- Output tokens: 1149
- Foundation source files: 11
- Decision queue files: 5
- Decision queue tokens: 0
- Primitive source files: 19
- Docs-only source files: 1

## Gates

| Gate | Status | Evidence |
| --- | --- | --- |
| `style-dictionary-output-count-matches-source` | pass | `{"sourceTokenCount":1149,"outputTokenCount":1149}` |
| `legacy-flat-source-removed` | pass | `{"file":"packages/tokens/source/flow.tokens.json","present":false}` |
| `foundation-files-complete` | pass | `{"missingFoundationFiles":[],"emptyFoundationFiles":[]}` |
| `no-duplicate-token-names` | pass | `{"duplicates":[]}` |
| `foundation-namespaces-contained` | pass | `{"misplacedFoundationTokens":[]}` |
| `decision-queues-empty` | pass | `{"decisionQueueFiles":["packages/tokens/source/decision-queues/aliases-to-foundations.tokens.json","packages/tokens/source/decision-queues/docs-only-candidates.tokens.json","packages/tokens/source/decision-queues/primitive-semantic-candidates.tokens.json","packages/tokens/source/decision-queues/unclassified.tokens.json","packages/tokens/source/decision-queues/unresolved.tokens.json"],"decisionQueueTokenCount":0}` |
| `primitive-source-files-present` | pass | `{"primitiveSourceFiles":["packages/tokens/source/primitives/breakpoints.tokens.json","packages/tokens/source/primitives/charts.tokens.json","packages/tokens/source/primitives/color.tokens.json","packages/tokens/source/primitives/density.tokens.json","packages/tokens/source/primitives/disabled.tokens.json","packages/tokens/source/primitives/duration.tokens.json","packages/tokens/source/primitives/elevation.tokens.json","packages/tokens/source/primitives/email-channel.tokens.json","packages/tokens/source/primitives/focus.tokens.json","packages/tokens/source/primitives/iconography.tokens.json","packages/tokens/source/primitives/loading.tokens.json","packages/tokens/source/primitives/maps.tokens.json","packages/tokens/source/primitives/measurement.tokens.json","packages/tokens/source/primitives/message.tokens.json","packages/tokens/source/primitives/motion-curves.tokens.json","packages/tokens/source/primitives/radius.tokens.json","packages/tokens/source/primitives/research.tokens.json","packages/tokens/source/primitives/spacing.tokens.json","packages/tokens/source/primitives/typography.tokens.json"]}` |
| `source-manifest-current` | pass | `{"manifestCounts":{"sourcePath":"packages/tokens/source/**/*.tokens.json","foundations":{"Energy":116,"Voice":160,"Frame":262,"Depth":37,"Momentum":88,"State":31,"Tone":13,"Growth":9,"Symbol":38,"Iconography":24,"Accessibility":26},"primitives":325,"docs":20,"decisionQueues":{"aliasesToFoundations":0,"docsOnlyCandidates":0,"primitiveSemanticCandidates":0,"unclassified":0,"unresolved":0},"total":1149},"actualCounts":{"sourcePath":"packages/tokens/source/**/*.tokens.json","foundations":{"Energy":116,"Voice":160,"Frame":262,"Depth":37,"Momentum":88,"State":31,"Tone":13,"Growth":9,"Symbol":38,"Iconography":24,"Accessibility":26},"primitives":325,"docs":20,"decisionQueues":{"aliasesToFoundations":0,"docsOnlyCandidates":0,"primitiveSemanticCandidates":0,"unclassified":0,"unresolved":0},"total":1149}}` |

