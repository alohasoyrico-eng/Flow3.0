# Phase 5 Data/Domain/Mobile Patterns Checkpoint

Status: **pass**

Data/domain/mobile patterns close only when data visualization, operational domain orchestration, mobile task, channel, and template-facing patterns have formal artifacts, Markdown contracts, TS/JS/d.ts runtime surfaces, governed component/pattern/template dependencies, state/type parity, slot/token governance, no docs/runtime duplication, and zero debt.

## Inventory

- Data/domain/mobile patterns: 31/31
- Families: 3
- Required reports: 5/5
- Runtime/contract files: 155/155
- States: 238
- Component dependencies: 145
- Pattern dependencies: 56
- Primitive dependencies: 501
- Foundation dependencies: 341
- Callbacks tested: 170/170
- Slots: 170
- Slot uses: 247
- Token dependencies: 424
- Data/domain/mobile pattern debt: 0

## Families

| Family | Patterns |
| --- | ---: |
| dataAndVisualization | 11 |
| domainOperations | 12 |
| mobileChannelAndTask | 8 |

## Patterns

| Pattern | Family | Status | States | Components | Pattern deps | Callbacks | Slots | Debt |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| calendar-view | dataAndVisualization | pass | 8 | 9 | 0 | 3/3 | 3 | 0 |
| chart-legend-item | dataAndVisualization | pass | 6 | 6 | 1 | 2/2 | 4 | 0 |
| chart-wrapper | dataAndVisualization | pass | 8 | 10 | 0 | 1/1 | 3 | 0 |
| expandable-detail-table | dataAndVisualization | pass | 7 | 1 | 3 | 7/7 | 6 | 0 |
| filterable-editable-table | dataAndVisualization | pass | 9 | 1 | 4 | 11/11 | 7 | 0 |
| gantt-chart | dataAndVisualization | pass | 6 | 1 | 1 | 2/2 | 6 | 0 |
| kanban-board | dataAndVisualization | pass | 7 | 5 | 1 | 3/3 | 5 | 0 |
| kpi-card | dataAndVisualization | pass | 8 | 7 | 0 | 2/2 | 4 | 0 |
| polar-chart | dataAndVisualization | pass | 6 | 1 | 1 | 2/2 | 6 | 0 |
| virtual-data-table | dataAndVisualization | pass | 8 | 8 | 2 | 6/6 | 3 | 0 |
| waterfall-chart | dataAndVisualization | pass | 6 | 1 | 1 | 2/2 | 6 | 0 |
| account-operations | domainOperations | pass | 7 | 1 | 3 | 13/13 | 6 | 0 |
| agent-conversation | domainOperations | pass | 8 | 2 | 1 | 6/6 | 4 | 0 |
| backoffice-approval | domainOperations | pass | 8 | 1 | 3 | 12/12 | 6 | 0 |
| case-management | domainOperations | pass | 8 | 1 | 5 | 18/18 | 8 | 0 |
| dense-operational-list | domainOperations | pass | 7 | 1 | 6 | 9/9 | 8 | 0 |
| driver-and-vehicle-administration | domainOperations | pass | 8 | 11 | 1 | 3/3 | 4 | 0 |
| fleet-manager-onboarding-desktop | domainOperations | pass | 8 | 11 | 1 | 2/2 | 4 | 0 |
| preference-management | domainOperations | pass | 8 | 1 | 3 | 9/9 | 5 | 0 |
| pricing-operations | domainOperations | pass | 8 | 1 | 5 | 11/11 | 8 | 0 |
| roles-and-permissions | domainOperations | pass | 8 | 10 | 0 | 2/2 | 3 | 0 |
| status-feedback-view | domainOperations | pass | 14 | 4 | 2 | 8/8 | 6 | 0 |
| ticket-queue | domainOperations | pass | 7 | 1 | 4 | 15/15 | 7 | 0 |
| authentication-login-biometrics-and-otp | mobileChannelAndTask | pass | 8 | 8 | 0 | 2/2 | 4 | 0 |
| driver-onboarding-mobile | mobileChannelAndTask | pass | 8 | 11 | 1 | 1/1 | 5 | 0 |
| email-template-layout | mobileChannelAndTask | pass | 5 | 0 | 0 | 0/0 | 11 | 0 |
| help-center | mobileChannelAndTask | pass | 8 | 5 | 2 | 5/5 | 5 | 0 |
| payment-form | mobileChannelAndTask | pass | 6 | 6 | 1 | 7/7 | 6 | 0 |
| pull-to-refresh | mobileChannelAndTask | pass | 8 | 7 | 0 | 1/1 | 4 | 0 |
| section-header | mobileChannelAndTask | pass | 6 | 5 | 3 | 0/0 | 5 | 0 |
| station-discovery | mobileChannelAndTask | pass | 11 | 8 | 1 | 5/5 | 8 | 0 |

## Reports

| Report | Status | Debt |
| --- | --- | ---: |
| pattern-behavior | pass | 0 |
| pattern-composition | pass | 0 |
| pattern-migration | pass | 0 |
| foundation-primitive-1to1 | pass | 0 |
| template-cascade-governance | pass | 0 |

## Issues

- None

