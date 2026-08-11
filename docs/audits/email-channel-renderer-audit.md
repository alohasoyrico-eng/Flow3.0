# Email channel renderer audit

Status: pass

Email React authoring must emit static, table-safe HTML output per channel variant without depending on the web runtime cascade.

## Inventory

- renderCases: 6
- passingRenderCases: 6
- renderedDoctypes: 6
- htmlRoots: 6
- headBlocks: 6
- bodyBlocks: 6
- hiddenPreheaders: 6
- presentationTableCases: 6
- container600Cases: 6
- contentCardCases: 6
- footerCases: 6
- conditionalSignalGaps: 0
- forbiddenRenderedSignals: 0
- emailRendererDebt: 0

## Rendered variants

| Variant | Bytes | SHA-256 | Required gaps | Conditional gaps | Forbidden |
| --- | ---: | --- | ---: | ---: | ---: |
| base | 3157 | 5e24c4b9fa42487a | 0 | 0 | 0 |
| transactional | 4610 | e3b5b242d18d73a3 | 0 | 0 | 0 |
| operational-summary | 6427 | 9a2d8511f80ef23b | 0 | 0 | 0 |
| security-alert | 5005 | 77beea4dbb04476f | 0 | 0 | 0 |
| team-invite | 3589 | df5bb0284e428623 | 0 | 0 | 0 |
| welcome | 4265 | 7e4d6c5ca3c515e9 | 0 | 0 | 0 |

## Issues

- None.

