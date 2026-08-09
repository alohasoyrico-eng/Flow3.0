# Taxonomy Boundaries Audit

Status: pass

Component, primitive, pattern, and template boundaries must stay explicit so orchestration and business surfaces do not re-enter Flow as fake components.

## Inventory

- Taxonomy file: packages/content/content/taxonomy-boundaries.json
- Rules: 5
- Decisions: 11
- Pattern decisions: 10
- Template decisions: 0
- Non-component decisions: 1
- Duplicate ids: 0
- Audit errors: 0
- Inventory baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. Additions or removals must be reviewed as taxonomy changes, not component implementation churn.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| rules | 5 | 5 |
| decisions | 11 | 11 |
| patternDecisions | 10 | 10 |
| templateDecisions | 0 | 0 |
| nonComponentDecisions | 1 | 1 |
| duplicateIds | 0 | 0 |
| auditErrors | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Decisions

| Id | Layer | Replacement | Reason |
| --- | --- | --- | --- |
| alert-strip | non-component | notification-panel | Persistent alert aggregation is feedback orchestration; Toast, Error Panel, Badge, Button, and Notification Panel own the reusable parts. |
| bottom-sheet | pattern | bottom-sheet | Bottom Sheet is a 100% mobile overlay pattern with focus, dismissal, drag/state, and responsive orchestration beyond a bounded component. |
| checkbox-group | pattern | checkbox-group | Checkbox remains atomic; group label, select-all, mixed state, shared validation, and analytics are pattern-owned. |
| radio-group | pattern | radio-group | Radio Button remains atomic; exclusive group question, shared name, arrow navigation, validation, and layout are pattern-owned. |
| avatar-group | pattern | avatar-group | Avatar remains atomic; overflow, stacking, disclosure, permissions, and member detail are pattern-owned. |
| data-table | pattern | virtual-data-table | Table remains the component; sorting, filtering, pagination, column config, remote loading, and bulk actions belong to data-table patterns. |
| dashboard-filter-bar | pattern | advanced-filters | Filter bars coordinate query state, dependencies, saved views, refresh, and dashboard feedback. |
| driver-management-table | pattern | driver-and-vehicle-administration | Driver table behavior includes invite, suspend, edit, audit, permissions, and remote data operations. |
| vehicle-management-table | pattern | driver-and-vehicle-administration | Vehicle table behavior includes assignment, maintenance metadata, document state, grouping, and lifecycle. |
| sort-control | pattern | toolbar | Sorting usually belongs to table/list state, persistence, refresh, and result feedback. |
| chart-legend-item | pattern | chart-legend-item | Legend items are chart interaction patterns; they must not be promoted as standalone components. |

## Errors

| Location | Message |
| --- | --- |
| None | None |

