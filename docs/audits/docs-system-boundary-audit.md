# Docs System Boundary Audit

Status: pass

FlowDocs must consume Flow through package exports and generated assets; any docs-owned component tokens or missing aliases are tracked debt, not invisible system behavior. The actionable debt metric is docsSystemBoundaryDebt.

## Inventory

- Docs root: ../FlowDocs
- Source files scanned: 209
- Generated files: 356
- Flow dependency present: 1
- Flow boundary aliases: 21
- Missing Flow aliases: 0
- Local Flow import violations: 0
- Docs component token definitions: 0
- Docs component token definition files: 0
- Docs protected Flow class roots: 69
- Docs component class definitions: 0
- Docs component class definition files: 0
- Docs pattern class definitions: 290
- Docs pattern class roots: 113
- Docs unapproved pattern class roots: 0
- Docs pattern class policy issues: 0
- Docs contractual pattern class definitions: 0
- Docs contractual pattern class definition files: 0
- Docs system boundary debt: 0
- Unexpected inventory metrics: 0

## Baseline Budget

| Metric | Expected | Actual |
| --- | ---: | ---: |
| sourceFilesScanned | 209 | 209 |
| generatedFiles | 356 | 356 |
| flowDependencyPresent | 1 | 1 |
| flowBoundaryAliases | 21 | 21 |
| missingFlowAliases | 0 | 0 |
| localFlowImportViolations | 0 | 0 |
| docsComponentTokenDefinitions | 0 | 0 |
| docsComponentTokenDefinitionFiles | 0 | 0 |
| docsProtectedFlowClassRoots | 69 | 69 |
| docsComponentClassDefinitions | 0 | 0 |
| docsComponentClassDefinitionFiles | 0 | 0 |
| docsPatternClassDefinitions | 290 | 290 |
| docsPatternClassRoots | 113 | 113 |
| docsUnapprovedPatternClassRoots | 0 | 0 |
| docsPatternClassPolicyIssues | 0 | 0 |
| docsContractualPatternClassDefinitions | 0 | 0 |
| docsContractualPatternClassDefinitionFiles | 0 | 0 |
| generatedComponentCssPresent | 1 | 1 |
| generatedTokenCssPresent | 1 | 1 |
| docsSystemBoundaryDebt | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Unexpected Inventory Metrics

| Metric | Actual |
| --- | ---: |
| None | None |

## Missing Flow Aliases

| Alias |
| --- |
| None |

## Docs Component Token Definitions

| Location | Token |
| --- | --- |
| None | None |

## Docs Component Class Definitions

| Location | Class Root |
| --- | --- |
| None | None |

## Docs Unapproved Pattern Class Roots

Policy file: packages/content/content/docs-system-boundary.json. Approved prefixes: pattern-. Formal root strategy: pattern-artifact-id.

Docs may use editorial/demo `.pattern-*` roots under the approved namespace. Formal pattern roots generated from Flow artifacts remain blocked so FlowDocs cannot grow a second pattern implementation surface by accident.

| Class Root |
| --- |
| None |

## Docs Contractual Pattern Class Definitions

Docs may own demo/editorial `.pattern-*` wrappers, but must not define a formal Pattern root such as `.pattern-search` or `.pattern-search__item`.

| Location | Class Root | Formal Pattern Root |
| --- | --- | --- |
| None | None | None |

