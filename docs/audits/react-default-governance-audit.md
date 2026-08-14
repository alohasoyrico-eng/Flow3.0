# React Default Governance Audit

Status: **pass**

Platform defaults such as density, size, and theme must come from the Flow cascade; component-level semantic default decisions may exist only when visible and contract-backed. The actionable debt metric is defaultDebt.

## Inventory

- React components scanned: 62
- Default debt: 0
- Prohibited platform defaults: 0
- Visible semantic default decisions: 119
- Contract-backed semantic default decisions: 119
- Unbacked semantic default decisions: 0
- Semantic default decision contract gaps: 0
- Inventory baseline mismatches: 0
- Rule baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. defaultDebt must stay at 0; semantic decision counts may change only when the new defaults are intentionally reviewed and contract-backed.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| components | 62 | 62 |
| defaultDebt | 0 | 0 |
| prohibitedDefaults | 0 | 0 |
| semanticDefaultDecisions | 119 | 119 |
| contractBackedSemanticDefaultDecisions | 119 | 119 |
| unbackedSemanticDefaultDecisions | 0 | 0 |
| semanticDefaultDecisionContractGaps | 0 | 0 |
| reactGovernancePolicyIssues | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Rule Baseline Budget

| Rule | Expected | Actual |
| --- | ---: | ---: |
| state-default | 47 | 47 |
| variant-default | 42 | 42 |
| tone-default | 15 | 15 |
| intent-default | 2 | 2 |
| status-default | 1 | 1 |
| placement-default | 2 | 2 |
| side-default | 1 | 1 |
| align-default | 2 | 2 |
| orientation-default | 1 | 1 |
| trend-default | 2 | 2 |
| composition-default | 1 | 1 |
| avatar-status-default | 1 | 1 |
| category-default | 1 | 1 |
| sort-direction-default | 1 | 1 |

## Rule Baseline Mismatches

| Rule | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Semantic Default Decision Summary

| Rule | Count | Contract-backed | Unbacked | Meaning |
| --- | ---: | ---: | ---: | --- |
| state-default | 47 | 47 | 0 | Component behavior default; allowed when normalized through component state. |
| variant-default | 42 | 42 | 0 | Component composition default; allowed when constrained by the component contract. |
| tone-default | 15 | 15 | 0 | Component tone fallback; allowed when constrained by the component contract. |
| intent-default | 2 | 2 | 0 | Action intent fallback; allowed when constrained by the component contract. |
| status-default | 1 | 1 | 0 | Component status fallback; allowed when constrained by the component contract. |
| placement-default | 2 | 2 | 0 | Overlay placement fallback; allowed when constrained by the component contract. |
| side-default | 1 | 1 | 0 | Surface side fallback; allowed when constrained by the component contract. |
| align-default | 2 | 2 | 0 | Alignment fallback; allowed when constrained by the component contract. |
| orientation-default | 1 | 1 | 0 | Layout orientation fallback; allowed when constrained by the component contract. |
| trend-default | 2 | 2 | 0 | Trend fallback; allowed when constrained by the component contract. |
| composition-default | 1 | 1 | 0 | Composition fallback; allowed when constrained by the component contract. |
| avatar-status-default | 1 | 1 | 0 | Avatar status fallback; allowed when constrained by the component contract. |
| category-default | 1 | 1 | 0 | Category fallback; allowed when constrained by the component contract. |
| sort-direction-default | 1 | 1 | 0 | Sort direction fallback; allowed when constrained by the component contract. |

## Prohibited Defaults

| Component | Rule | Location | Source |
| --- | --- | --- | --- |
| None | None | None | None |

## Semantic Default Decision Contract Gaps

| Component | Prop | Default value | React type values | System contract values | Location |
| --- | --- | --- | --- | --- | --- |
| None | None | None | None | None | None |

## Semantic Default Decision Contract Evidence

| Component | Rule | Prop | Default value | React type | System contract | Contract-backed | Location |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AnimatedMoment | variant-default | variant | success | pass | pass | Yes | packages/react/src/AnimatedMoment.tsx:58 |
| AnimatedMoment | state-default | state | playing | pass | pass | Yes | packages/react/src/AnimatedMoment.tsx:59 |
| AuditEvent | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/AuditEvent.tsx:52 |
| AuditEvent | state-default | state | default | pass | pass | Yes | packages/react/src/AuditEvent.tsx:53 |
| Avatar | status-default | status | none | pass | pass | Yes | packages/react/src/Avatar.tsx:65 |
| Avatar | state-default | state | default | pass | pass | Yes | packages/react/src/Avatar.tsx:66 |
| Badge | state-default | state | default | pass | pass | Yes | packages/react/src/Badge.tsx:41 |
| Badge | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/Badge.tsx:48 |
| Badge | variant-default | variant | status | pass | pass | Yes | packages/react/src/Badge.tsx:49 |
| Badge | state-default | state | default | pass | pass | Yes | packages/react/src/Badge.tsx:50 |
| BiometricPrompt | variant-default | variant | fingerprint | pass | pass | Yes | packages/react/src/BiometricPrompt.tsx:54 |
| BiometricPrompt | state-default | state | default | pass | pass | Yes | packages/react/src/BiometricPrompt.tsx:55 |
| Breadcrumbs | variant-default | variant | standard | pass | pass | Yes | packages/react/src/Breadcrumbs.tsx:82 |
| Breadcrumbs | state-default | state | default | pass | pass | Yes | packages/react/src/Breadcrumbs.tsx:83 |
| Button | variant-default | variant | primary | pass | pass | Yes | packages/react/src/Button.tsx:37 |
| Button | intent-default | intent | default | pass | pass | Yes | packages/react/src/Button.tsx:37 |
| Button | variant-default | variant | primary | pass | pass | Yes | packages/react/src/Button.tsx:53 |
| Button | intent-default | intent | default | pass | pass | Yes | packages/react/src/Button.tsx:54 |
| Button | state-default | state | default | pass | pass | Yes | packages/react/src/Button.tsx:56 |
| Card | trend-default | trend | neutral | pass | pass | Yes | packages/react/src/Card.tsx:127 |
| Card | variant-default | variant | default | pass | pass | Yes | packages/react/src/Card.tsx:131 |
| Card | composition-default | composition | standard | pass | pass | Yes | packages/react/src/Card.tsx:132 |
| Card | state-default | state | default | pass | pass | Yes | packages/react/src/Card.tsx:133 |
| CardSummary | variant-default | variant | physical | pass | pass | Yes | packages/react/src/CardSummary.tsx:57 |
| CardSummary | state-default | state | default | pass | pass | Yes | packages/react/src/CardSummary.tsx:58 |
| ChartPanel | variant-default | variant | sparkline | pass | pass | Yes | packages/react/src/ChartPanel.tsx:274 |
| ChartPanel | state-default | state | default | pass | pass | Yes | packages/react/src/ChartPanel.tsx:275 |
| ChartPanel | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/ChartPanel.tsx:276 |
| ChatMessage | state-default | state | default | pass | pass | Yes | packages/react/src/ChatMessage.tsx:89 |
| ChatMessage | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/ChatMessage.tsx:90 |
| ChatThread | state-default | state | default | pass | pass | Yes | packages/react/src/ChatThread.tsx:98 |
| Checkbox | variant-default | variant | default | pass | pass | Yes | packages/react/src/Checkbox.tsx:53 |
| Checkbox | state-default | state | unchecked | pass | pass | Yes | packages/react/src/Checkbox.tsx:54 |
| Chip | state-default | state | default | pass | pass | Yes | packages/react/src/Chip.tsx:46 |
| Chip | variant-default | variant | filter | pass | pass | Yes | packages/react/src/Chip.tsx:55 |
| Chip | tone-default | tone | default | pass | pass | Yes | packages/react/src/Chip.tsx:56 |
| Chip | state-default | state | default | pass | pass | Yes | packages/react/src/Chip.tsx:57 |
| CodeBlock | variant-default | variant | block | pass | pass | Yes | packages/react/src/CodeBlock.tsx:94 |
| CodeBlock | state-default | state | default | pass | pass | Yes | packages/react/src/CodeBlock.tsx:95 |
| CodeInput | variant-default | variant | sms | pass | pass | Yes | packages/react/src/CodeInput.tsx:77 |
| CopyButton | variant-default | variant | text | pass | pass | Yes | packages/react/src/CopyButton.tsx:66 |
| CopyButton | state-default | state | default | pass | pass | Yes | packages/react/src/CopyButton.tsx:67 |
| Dialog | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/Dialog.tsx:112 |
| Dialog | variant-default | variant | confirmation | pass | pass | Yes | packages/react/src/Dialog.tsx:113 |
| Dialog | state-default | state | closed | pass | pass | Yes | packages/react/src/Dialog.tsx:114 |
| Drawer | variant-default | variant | side-sheet | pass | pass | Yes | packages/react/src/Drawer.tsx:163 |
| Drawer | state-default | state | closed | pass | pass | Yes | packages/react/src/Drawer.tsx:164 |
| Drawer | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/Drawer.tsx:165 |
| Drawer | side-default | side | right | pass | pass | Yes | packages/react/src/Drawer.tsx:167 |
| EmptyState | variant-default | variant | first-use | pass | pass | Yes | packages/react/src/EmptyState.tsx:67 |
| EmptyState | state-default | state | default | pass | pass | Yes | packages/react/src/EmptyState.tsx:68 |
| ErrorPanel | tone-default | tone | error | pass | pass | Yes | packages/react/src/ErrorPanel.tsx:77 |
| ErrorPanel | variant-default | variant | panel | pass | pass | Yes | packages/react/src/ErrorPanel.tsx:78 |
| ErrorPanel | state-default | state | error | pass | pass | Yes | packages/react/src/ErrorPanel.tsx:79 |
| FloatingActionButton | variant-default | variant | primary | pass | pass | Yes | packages/react/src/FloatingActionButton.tsx:38 |
| FloatingActionButton | state-default | state | default | pass | pass | Yes | packages/react/src/FloatingActionButton.tsx:39 |
| IconButton | variant-default | variant | ghost | pass | pass | Yes | packages/react/src/IconButton.tsx:32 |
| IconButton | variant-default | variant | ghost | pass | pass | Yes | packages/react/src/IconButton.tsx:40 |
| InlineValidation | state-default | state | default | pass | pass | Yes | packages/react/src/InlineValidation.tsx:48 |
| Input | variant-default | variant | text | pass | pass | Yes | packages/react/src/Input.tsx:126 |
| Input | align-default | align | start | pass | pass | Yes | packages/react/src/Input.tsx:134 |
| KpiTile | trend-default | trend | flat | pass | pass | Yes | packages/react/src/KpiTile.tsx:67 |
| KpiTile | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/KpiTile.tsx:68 |
| KpiTile | variant-default | variant | standard | pass | pass | Yes | packages/react/src/KpiTile.tsx:70 |
| KpiTile | state-default | state | default | pass | pass | Yes | packages/react/src/KpiTile.tsx:71 |
| List | variant-default | variant | standard | pass | pass | Yes | packages/react/src/List.tsx:55 |
| List | state-default | state | default | pass | pass | Yes | packages/react/src/List.tsx:56 |
| Menu | variant-default | variant | actions | pass | pass | Yes | packages/react/src/Menu.tsx:80 |
| Menu | avatar-status-default | avatarStatus | none | pass | pass | Yes | packages/react/src/Menu.tsx:82 |
| Menu | state-default | state | default | pass | pass | Yes | packages/react/src/Menu.tsx:84 |
| Menu | align-default | align | start | pass | pass | Yes | packages/react/src/Menu.tsx:85 |
| MotionBoundary | variant-default | variant | fade | pass | pass | Yes | packages/react/src/MotionBoundary.tsx:44 |
| MotionBoundary | state-default | state | active | pass | pass | Yes | packages/react/src/MotionBoundary.tsx:45 |
| MovementRow | category-default | category | transfer | pass | pass | Yes | packages/react/src/MovementRow.tsx:65 |
| MovementRow | variant-default | variant | standard | pass | pass | Yes | packages/react/src/MovementRow.tsx:66 |
| MovementRow | state-default | state | default | pass | pass | Yes | packages/react/src/MovementRow.tsx:67 |
| Pagination | variant-default | variant | numbered | pass | pass | Yes | packages/react/src/Pagination.tsx:90 |
| Pagination | state-default | state | default | pass | pass | Yes | packages/react/src/Pagination.tsx:91 |
| PhoneInput | variant-default | variant | country-code | pass | pass | Yes | packages/react/src/PhoneInput.tsx:108 |
| Popover | variant-default | variant | information | pass | pass | Yes | packages/react/src/Popover.tsx:81 |
| Popover | state-default | state | default | pass | pass | Yes | packages/react/src/Popover.tsx:82 |
| Popover | placement-default | placement | bottom | pass | pass | Yes | packages/react/src/Popover.tsx:83 |
| ProgressIndicator | state-default | state | active | pass | pass | Yes | packages/react/src/ProgressIndicator.tsx:41 |
| ProgressIndicator | tone-default | tone | accent | pass | pass | Yes | packages/react/src/ProgressIndicator.tsx:57 |
| ProgressIndicator | state-default | state | active | pass | pass | Yes | packages/react/src/ProgressIndicator.tsx:58 |
| QuickAction | state-default | state | default | pass | pass | Yes | packages/react/src/QuickAction.tsx:50 |
| QuickAction | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/QuickAction.tsx:53 |
| RadioButton | variant-default | variant | default | pass | pass | Yes | packages/react/src/RadioButton.tsx:50 |
| RadioButton | state-default | state | unselected | pass | pass | Yes | packages/react/src/RadioButton.tsx:51 |
| RouteSummary | variant-default | variant | standard | pass | pass | Yes | packages/react/src/RouteSummary.tsx:116 |
| RouteSummary | state-default | state | default | pass | pass | Yes | packages/react/src/RouteSummary.tsx:117 |
| RouteSummary | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/RouteSummary.tsx:119 |
| SegmentedControl | variant-default | variant | outlined | pass | pass | Yes | packages/react/src/SegmentedControl.tsx:73 |
| Select | variant-default | variant | default | pass | pass | Yes | packages/react/src/Select.tsx:87 |
| Select | state-default | state | default | pass | pass | Yes | packages/react/src/Select.tsx:88 |
| Skeleton | variant-default | variant | text | pass | pass | Yes | packages/react/src/Skeleton.tsx:113 |
| Slider | variant-default | variant | continuous | pass | pass | Yes | packages/react/src/Slider.tsx:76 |
| Slider | state-default | state | default | pass | pass | Yes | packages/react/src/Slider.tsx:77 |
| Spinner | tone-default | tone | accent | pass | pass | Yes | packages/react/src/Spinner.tsx:38 |
| Spinner | state-default | state | loading | pass | pass | Yes | packages/react/src/Spinner.tsx:39 |
| StationPin | variant-default | variant | fuel | pass | pass | Yes | packages/react/src/StationPin.tsx:49 |
| StationPin | state-default | state | default | pass | pass | Yes | packages/react/src/StationPin.tsx:50 |
| Stepper | orientation-default | orientation | horizontal | pass | pass | Yes | packages/react/src/Stepper.tsx:54 |
| Switch | state-default | state | off | pass | pass | Yes | packages/react/src/Switch.tsx:45 |
| Table | variant-default | variant | standard | pass | pass | Yes | packages/react/src/Table.tsx:140 |
| Table | state-default | state | default | pass | pass | Yes | packages/react/src/Table.tsx:141 |
| Table | sort-direction-default | sortDir | ascending | pass | pass | Yes | packages/react/src/Table.tsx:145 |
| Tabs | variant-default | variant | default | pass | pass | Yes | packages/react/src/Tabs.tsx:79 |
| Tag | state-default | state | default | pass | pass | Yes | packages/react/src/Tag.tsx:42 |
| Tag | variant-default | variant | metadata | pass | pass | Yes | packages/react/src/Tag.tsx:49 |
| Tag | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/Tag.tsx:50 |
| Tag | state-default | state | default | pass | pass | Yes | packages/react/src/Tag.tsx:51 |
| Toast | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/Toast.tsx:58 |
| Toast | variant-default | variant | status | pass | pass | Yes | packages/react/src/Toast.tsx:59 |
| Toast | state-default | state | visible | pass | pass | Yes | packages/react/src/Toast.tsx:60 |
| Tooltip | placement-default | placement | top | pass | pass | Yes | packages/react/src/Tooltip.tsx:45 |
| Tooltip | variant-default | variant | default | pass | pass | Yes | packages/react/src/Tooltip.tsx:46 |
| Tooltip | state-default | state | default | pass | pass | Yes | packages/react/src/Tooltip.tsx:48 |
| TreeView | state-default | state | expanded | pass | pass | Yes | packages/react/src/TreeView.tsx:93 |

## Visible Semantic Default Decisions

| Component | Rule | Prop | Default value | Location | Source |
| --- | --- | --- | --- | --- | --- |
| AnimatedMoment | variant-default | variant | success | packages/react/src/AnimatedMoment.tsx:58 | `variant = "success",` |
| AnimatedMoment | state-default | state | playing | packages/react/src/AnimatedMoment.tsx:59 | `state = "playing",` |
| AuditEvent | tone-default | tone | neutral | packages/react/src/AuditEvent.tsx:52 | `tone = "neutral",` |
| AuditEvent | state-default | state | default | packages/react/src/AuditEvent.tsx:53 | `state = "default",` |
| Avatar | status-default | status | none | packages/react/src/Avatar.tsx:65 | `status = "none",` |
| Avatar | state-default | state | default | packages/react/src/Avatar.tsx:66 | `state = "default",` |
| Badge | state-default | state | default | packages/react/src/Badge.tsx:41 | `function normalizeState({ hidden = false, state = "default" }: { hidden?: boolean; state?: BadgeState } = {}): BadgeState {` |
| Badge | tone-default | tone | neutral | packages/react/src/Badge.tsx:48 | `tone = "neutral",` |
| Badge | variant-default | variant | status | packages/react/src/Badge.tsx:49 | `variant = "status",` |
| Badge | state-default | state | default | packages/react/src/Badge.tsx:50 | `state = "default",` |
| BiometricPrompt | variant-default | variant | fingerprint | packages/react/src/BiometricPrompt.tsx:54 | `variant = "fingerprint",` |
| BiometricPrompt | state-default | state | default | packages/react/src/BiometricPrompt.tsx:55 | `state = "default",` |
| Breadcrumbs | variant-default | variant | standard | packages/react/src/Breadcrumbs.tsx:82 | `variant = "standard",` |
| Breadcrumbs | state-default | state | default | packages/react/src/Breadcrumbs.tsx:83 | `state = "default",` |
| Button | variant-default | variant | primary | packages/react/src/Button.tsx:37 | `function buttonClassName({ variant = "primary", intent = "default", className = "" }: {` |
| Button | intent-default | intent | default | packages/react/src/Button.tsx:37 | `function buttonClassName({ variant = "primary", intent = "default", className = "" }: {` |
| Button | variant-default | variant | primary | packages/react/src/Button.tsx:53 | `variant = "primary",` |
| Button | intent-default | intent | default | packages/react/src/Button.tsx:54 | `intent = "default",` |
| Button | state-default | state | default | packages/react/src/Button.tsx:56 | `state = "default",` |
| Card | trend-default | trend | neutral | packages/react/src/Card.tsx:127 | `trend = "neutral",` |
| Card | variant-default | variant | default | packages/react/src/Card.tsx:131 | `variant = "default",` |
| Card | composition-default | composition | standard | packages/react/src/Card.tsx:132 | `composition = "standard",` |
| Card | state-default | state | default | packages/react/src/Card.tsx:133 | `state = "default",` |
| CardSummary | variant-default | variant | physical | packages/react/src/CardSummary.tsx:57 | `variant = "physical",` |
| CardSummary | state-default | state | default | packages/react/src/CardSummary.tsx:58 | `state = "default",` |
| ChartPanel | variant-default | variant | sparkline | packages/react/src/ChartPanel.tsx:274 | `variant = "sparkline",` |
| ChartPanel | state-default | state | default | packages/react/src/ChartPanel.tsx:275 | `state = "default",` |
| ChartPanel | tone-default | tone | neutral | packages/react/src/ChartPanel.tsx:276 | `tone = "neutral",` |
| ChatMessage | state-default | state | default | packages/react/src/ChatMessage.tsx:89 | `state = "default",` |
| ChatMessage | tone-default | tone | neutral | packages/react/src/ChatMessage.tsx:90 | `tone = "neutral",` |
| ChatThread | state-default | state | default | packages/react/src/ChatThread.tsx:98 | `state = "default",` |
| Checkbox | variant-default | variant | default | packages/react/src/Checkbox.tsx:53 | `variant = "default",` |
| Checkbox | state-default | state | unchecked | packages/react/src/Checkbox.tsx:54 | `state = "unchecked",` |
| Chip | state-default | state | default | packages/react/src/Chip.tsx:46 | `function normalizeState({ disabled = false, selected = false, state = "default" }: { disabled?: boolean; selected?: boolean; state?: ChipState } = {}): ChipState {` |
| Chip | variant-default | variant | filter | packages/react/src/Chip.tsx:55 | `variant = "filter",` |
| Chip | tone-default | tone | default | packages/react/src/Chip.tsx:56 | `tone = "default",` |
| Chip | state-default | state | default | packages/react/src/Chip.tsx:57 | `state = "default",` |
| CodeBlock | variant-default | variant | block | packages/react/src/CodeBlock.tsx:94 | `variant = "block",` |
| CodeBlock | state-default | state | default | packages/react/src/CodeBlock.tsx:95 | `state = "default",` |
| CodeInput | variant-default | variant | sms | packages/react/src/CodeInput.tsx:77 | `variant = "sms",` |
| CopyButton | variant-default | variant | text | packages/react/src/CopyButton.tsx:66 | `variant = "text",` |
| CopyButton | state-default | state | default | packages/react/src/CopyButton.tsx:67 | `state = "default",` |
| Dialog | tone-default | tone | neutral | packages/react/src/Dialog.tsx:112 | `tone = "neutral",` |
| Dialog | variant-default | variant | confirmation | packages/react/src/Dialog.tsx:113 | `variant = "confirmation",` |
| Dialog | state-default | state | closed | packages/react/src/Dialog.tsx:114 | `state = "closed",` |
| Drawer | variant-default | variant | side-sheet | packages/react/src/Drawer.tsx:163 | `variant = "side-sheet",` |
| Drawer | state-default | state | closed | packages/react/src/Drawer.tsx:164 | `state = "closed",` |
| Drawer | tone-default | tone | neutral | packages/react/src/Drawer.tsx:165 | `tone = "neutral",` |
| Drawer | side-default | side | right | packages/react/src/Drawer.tsx:167 | `side = "right",` |
| EmptyState | variant-default | variant | first-use | packages/react/src/EmptyState.tsx:67 | `variant = "first-use",` |
| EmptyState | state-default | state | default | packages/react/src/EmptyState.tsx:68 | `state = "default",` |
| ErrorPanel | tone-default | tone | error | packages/react/src/ErrorPanel.tsx:77 | `tone = "error",` |
| ErrorPanel | variant-default | variant | panel | packages/react/src/ErrorPanel.tsx:78 | `variant = "panel",` |
| ErrorPanel | state-default | state | error | packages/react/src/ErrorPanel.tsx:79 | `state = "error",` |
| FloatingActionButton | variant-default | variant | primary | packages/react/src/FloatingActionButton.tsx:38 | `variant = "primary",` |
| FloatingActionButton | state-default | state | default | packages/react/src/FloatingActionButton.tsx:39 | `state = "default",` |
| IconButton | variant-default | variant | ghost | packages/react/src/IconButton.tsx:32 | `function iconButtonClassName({ variant = "ghost", className = "" }: { variant?: IconButtonVariant; className?: string } = {}) {` |
| IconButton | variant-default | variant | ghost | packages/react/src/IconButton.tsx:40 | `variant = "ghost",` |
| InlineValidation | state-default | state | default | packages/react/src/InlineValidation.tsx:48 | `state = "default",` |
| Input | variant-default | variant | text | packages/react/src/Input.tsx:126 | `variant = "text",` |
| Input | align-default | align | start | packages/react/src/Input.tsx:134 | `align = "start",` |
| KpiTile | trend-default | trend | flat | packages/react/src/KpiTile.tsx:67 | `trend = "flat",` |
| KpiTile | tone-default | tone | neutral | packages/react/src/KpiTile.tsx:68 | `tone = "neutral",` |
| KpiTile | variant-default | variant | standard | packages/react/src/KpiTile.tsx:70 | `variant = "standard",` |
| KpiTile | state-default | state | default | packages/react/src/KpiTile.tsx:71 | `state = "default",` |
| List | variant-default | variant | standard | packages/react/src/List.tsx:55 | `variant = "standard",` |
| List | state-default | state | default | packages/react/src/List.tsx:56 | `state = "default",` |
| Menu | variant-default | variant | actions | packages/react/src/Menu.tsx:80 | `variant = "actions",` |
| Menu | avatar-status-default | avatarStatus | none | packages/react/src/Menu.tsx:82 | `avatarStatus = "none",` |
| Menu | state-default | state | default | packages/react/src/Menu.tsx:84 | `state = "default",` |
| Menu | align-default | align | start | packages/react/src/Menu.tsx:85 | `align = "start",` |
| MotionBoundary | variant-default | variant | fade | packages/react/src/MotionBoundary.tsx:44 | `variant = "fade",` |
| MotionBoundary | state-default | state | active | packages/react/src/MotionBoundary.tsx:45 | `state = "active",` |
| MovementRow | category-default | category | transfer | packages/react/src/MovementRow.tsx:65 | `category = "transfer",` |
| MovementRow | variant-default | variant | standard | packages/react/src/MovementRow.tsx:66 | `variant = "standard",` |
| MovementRow | state-default | state | default | packages/react/src/MovementRow.tsx:67 | `state = "default",` |
| Pagination | variant-default | variant | numbered | packages/react/src/Pagination.tsx:90 | `variant = "numbered",` |
| Pagination | state-default | state | default | packages/react/src/Pagination.tsx:91 | `state = "default",` |
| PhoneInput | variant-default | variant | country-code | packages/react/src/PhoneInput.tsx:108 | `variant = "country-code",` |
| Popover | variant-default | variant | information | packages/react/src/Popover.tsx:81 | `variant = "information",` |
| Popover | state-default | state | default | packages/react/src/Popover.tsx:82 | `state = "default",` |
| Popover | placement-default | placement | bottom | packages/react/src/Popover.tsx:83 | `placement = "bottom",` |
| ProgressIndicator | state-default | state | active | packages/react/src/ProgressIndicator.tsx:41 | `function progressMeta({ value = 0, max = 100, state = "active", indeterminate = false }: { value?: number; max?: number; state?: ProgressIndicatorState; indeterminate?: boolean } = {}) {` |
| ProgressIndicator | tone-default | tone | accent | packages/react/src/ProgressIndicator.tsx:57 | `tone = "accent",` |
| ProgressIndicator | state-default | state | active | packages/react/src/ProgressIndicator.tsx:58 | `state = "active",` |
| QuickAction | state-default | state | default | packages/react/src/QuickAction.tsx:50 | `state = "default",` |
| QuickAction | tone-default | tone | neutral | packages/react/src/QuickAction.tsx:53 | `tone = "neutral",` |
| RadioButton | variant-default | variant | default | packages/react/src/RadioButton.tsx:50 | `variant = "default",` |
| RadioButton | state-default | state | unselected | packages/react/src/RadioButton.tsx:51 | `state = "unselected",` |
| RouteSummary | variant-default | variant | standard | packages/react/src/RouteSummary.tsx:116 | `variant = "standard",` |
| RouteSummary | state-default | state | default | packages/react/src/RouteSummary.tsx:117 | `state = "default",` |
| RouteSummary | tone-default | tone | neutral | packages/react/src/RouteSummary.tsx:119 | `tone = "neutral",` |
| SegmentedControl | variant-default | variant | outlined | packages/react/src/SegmentedControl.tsx:73 | `variant = "outlined",` |
| Select | variant-default | variant | default | packages/react/src/Select.tsx:87 | `variant = "default",` |
| Select | state-default | state | default | packages/react/src/Select.tsx:88 | `state = "default",` |
| Skeleton | variant-default | variant | text | packages/react/src/Skeleton.tsx:113 | `variant = "text",` |
| Slider | variant-default | variant | continuous | packages/react/src/Slider.tsx:76 | `variant = "continuous",` |
| Slider | state-default | state | default | packages/react/src/Slider.tsx:77 | `state = "default",` |
| Spinner | tone-default | tone | accent | packages/react/src/Spinner.tsx:38 | `tone = "accent",` |
| Spinner | state-default | state | loading | packages/react/src/Spinner.tsx:39 | `state = "loading",` |
| StationPin | variant-default | variant | fuel | packages/react/src/StationPin.tsx:49 | `variant = "fuel",` |
| StationPin | state-default | state | default | packages/react/src/StationPin.tsx:50 | `state = "default",` |
| Stepper | orientation-default | orientation | horizontal | packages/react/src/Stepper.tsx:54 | `orientation = "horizontal",` |
| Switch | state-default | state | off | packages/react/src/Switch.tsx:45 | `state = "off",` |
| Table | variant-default | variant | standard | packages/react/src/Table.tsx:140 | `variant = "standard",` |
| Table | state-default | state | default | packages/react/src/Table.tsx:141 | `state = "default",` |
| Table | sort-direction-default | sortDir | ascending | packages/react/src/Table.tsx:145 | `sortDir = "ascending",` |
| Tabs | variant-default | variant | default | packages/react/src/Tabs.tsx:79 | `variant = "default",` |
| Tag | state-default | state | default | packages/react/src/Tag.tsx:42 | `function normalizeState({ disabled = false, state = "default" }: { disabled?: boolean; state?: TagState } = {}): TagState {` |
| Tag | variant-default | variant | metadata | packages/react/src/Tag.tsx:49 | `variant = "metadata",` |
| Tag | tone-default | tone | neutral | packages/react/src/Tag.tsx:50 | `tone = "neutral",` |
| Tag | state-default | state | default | packages/react/src/Tag.tsx:51 | `state = "default",` |
| Toast | tone-default | tone | neutral | packages/react/src/Toast.tsx:58 | `tone = "neutral",` |
| Toast | variant-default | variant | status | packages/react/src/Toast.tsx:59 | `variant = "status",` |
| Toast | state-default | state | visible | packages/react/src/Toast.tsx:60 | `state = "visible",` |
| Tooltip | placement-default | placement | top | packages/react/src/Tooltip.tsx:45 | `placement = "top",` |
| Tooltip | variant-default | variant | default | packages/react/src/Tooltip.tsx:46 | `variant = "default",` |
| Tooltip | state-default | state | default | packages/react/src/Tooltip.tsx:48 | `state = "default",` |
| TreeView | state-default | state | expanded | packages/react/src/TreeView.tsx:93 | `state = "expanded",` |

