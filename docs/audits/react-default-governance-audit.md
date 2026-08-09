# React Default Governance Audit

Status: **pass**

Platform defaults such as density, size, and theme must come from the Flow cascade; component-level semantic defaults may exist only as visible contract decisions.

## Inventory

- React components scanned: 56
- Prohibited platform defaults: 0
- Visible semantic defaults: 112
- Contract-backed semantic defaults: 112
- Unbacked semantic defaults: 0
- Semantic default contract gaps: 0
- Inventory baseline mismatches: 0
- Rule baseline mismatches: 0

## Baseline Budget

Changing these numbers is a contract decision. Update the baseline only when the new defaults are intentionally reviewed and contract-backed.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| components | 56 | 56 |
| prohibitedDefaults | 0 | 0 |
| semanticDefaults | 112 | 112 |
| contractBackedSemanticDefaults | 112 | 112 |
| unbackedSemanticDefaults | 0 | 0 |
| semanticDefaultContractGaps | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Rule Baseline Budget

| Rule | Expected | Actual |
| --- | ---: | ---: |
| state-default | 43 | 43 |
| variant-default | 40 | 40 |
| tone-default | 14 | 14 |
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

## Semantic Default Summary

| Rule | Count | Contract-backed | Unbacked | Meaning |
| --- | ---: | ---: | ---: | --- |
| state-default | 43 | 43 | 0 | Component behavior default; allowed when normalized through component state. |
| variant-default | 40 | 40 | 0 | Component composition default; allowed when constrained by the component contract. |
| tone-default | 14 | 14 | 0 | Component tone fallback; allowed when constrained by the component contract. |
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

## Semantic Default Contract Gaps

| Component | Prop | Default value | React type values | System contract values | Location |
| --- | --- | --- | --- | --- | --- |
| None | None | None | None | None | None |

## Semantic Default Contract Evidence

| Component | Rule | Prop | Default value | React type | System contract | Contract-backed | Location |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AnimatedMoment | variant-default | variant | success | pass | pass | Yes | packages/react/src/AnimatedMoment.js:21 |
| AnimatedMoment | state-default | state | playing | pass | pass | Yes | packages/react/src/AnimatedMoment.js:22 |
| AuditEvent | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/AuditEvent.js:25 |
| AuditEvent | state-default | state | default | pass | pass | Yes | packages/react/src/AuditEvent.js:26 |
| Avatar | status-default | status | none | pass | pass | Yes | packages/react/src/Avatar.js:41 |
| Avatar | state-default | state | default | pass | pass | Yes | packages/react/src/Avatar.js:42 |
| Badge | state-default | state | default | pass | pass | Yes | packages/react/src/Badge.js:17 |
| Badge | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/Badge.js:24 |
| Badge | variant-default | variant | status | pass | pass | Yes | packages/react/src/Badge.js:25 |
| Badge | state-default | state | default | pass | pass | Yes | packages/react/src/Badge.js:26 |
| BiometricPrompt | variant-default | variant | fingerprint | pass | pass | Yes | packages/react/src/BiometricPrompt.js:26 |
| BiometricPrompt | state-default | state | default | pass | pass | Yes | packages/react/src/BiometricPrompt.js:27 |
| Breadcrumbs | variant-default | variant | standard | pass | pass | Yes | packages/react/src/Breadcrumbs.js:45 |
| Breadcrumbs | state-default | state | default | pass | pass | Yes | packages/react/src/Breadcrumbs.js:46 |
| Button | variant-default | variant | primary | pass | pass | Yes | packages/react/src/Button.js:8 |
| Button | intent-default | intent | default | pass | pass | Yes | packages/react/src/Button.js:8 |
| Button | variant-default | variant | primary | pass | pass | Yes | packages/react/src/Button.js:20 |
| Button | intent-default | intent | default | pass | pass | Yes | packages/react/src/Button.js:21 |
| Button | state-default | state | default | pass | pass | Yes | packages/react/src/Button.js:23 |
| Card | trend-default | trend | neutral | pass | pass | Yes | packages/react/src/Card.js:59 |
| Card | variant-default | variant | default | pass | pass | Yes | packages/react/src/Card.js:63 |
| Card | composition-default | composition | standard | pass | pass | Yes | packages/react/src/Card.js:64 |
| Card | state-default | state | default | pass | pass | Yes | packages/react/src/Card.js:65 |
| CardSummary | variant-default | variant | physical | pass | pass | Yes | packages/react/src/CardSummary.js:23 |
| CardSummary | state-default | state | default | pass | pass | Yes | packages/react/src/CardSummary.js:24 |
| ChartPanel | variant-default | variant | sparkline | pass | pass | Yes | packages/react/src/ChartPanel.js:220 |
| ChartPanel | state-default | state | default | pass | pass | Yes | packages/react/src/ChartPanel.js:221 |
| ChartPanel | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/ChartPanel.js:222 |
| Checkbox | variant-default | variant | default | pass | pass | Yes | packages/react/src/Checkbox.js:20 |
| Checkbox | state-default | state | unchecked | pass | pass | Yes | packages/react/src/Checkbox.js:21 |
| Chip | state-default | state | default | pass | pass | Yes | packages/react/src/Chip.js:18 |
| Chip | variant-default | variant | filter | pass | pass | Yes | packages/react/src/Chip.js:27 |
| Chip | tone-default | tone | default | pass | pass | Yes | packages/react/src/Chip.js:28 |
| Chip | state-default | state | default | pass | pass | Yes | packages/react/src/Chip.js:29 |
| CodeInput | variant-default | variant | sms | pass | pass | Yes | packages/react/src/CodeInput.js:31 |
| Dialog | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/Dialog.js:34 |
| Dialog | variant-default | variant | confirmation | pass | pass | Yes | packages/react/src/Dialog.js:35 |
| Dialog | state-default | state | closed | pass | pass | Yes | packages/react/src/Dialog.js:36 |
| Drawer | variant-default | variant | side-sheet | pass | pass | Yes | packages/react/src/Drawer.js:76 |
| Drawer | state-default | state | closed | pass | pass | Yes | packages/react/src/Drawer.js:77 |
| Drawer | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/Drawer.js:78 |
| Drawer | side-default | side | right | pass | pass | Yes | packages/react/src/Drawer.js:80 |
| EmptyState | variant-default | variant | first-use | pass | pass | Yes | packages/react/src/EmptyState.js:23 |
| EmptyState | state-default | state | default | pass | pass | Yes | packages/react/src/EmptyState.js:24 |
| ErrorPanel | tone-default | tone | error | pass | pass | Yes | packages/react/src/ErrorPanel.js:30 |
| ErrorPanel | variant-default | variant | panel | pass | pass | Yes | packages/react/src/ErrorPanel.js:31 |
| ErrorPanel | state-default | state | error | pass | pass | Yes | packages/react/src/ErrorPanel.js:32 |
| FloatingActionButton | variant-default | variant | primary | pass | pass | Yes | packages/react/src/FloatingActionButton.js:13 |
| FloatingActionButton | state-default | state | default | pass | pass | Yes | packages/react/src/FloatingActionButton.js:14 |
| IconButton | variant-default | variant | ghost | pass | pass | Yes | packages/react/src/IconButton.js:7 |
| IconButton | variant-default | variant | ghost | pass | pass | Yes | packages/react/src/IconButton.js:15 |
| InlineValidation | state-default | state | default | pass | pass | Yes | packages/react/src/InlineValidation.js:20 |
| Input | variant-default | variant | text | pass | pass | Yes | packages/react/src/Input.js:76 |
| Input | align-default | align | start | pass | pass | Yes | packages/react/src/Input.js:84 |
| KpiTile | trend-default | trend | flat | pass | pass | Yes | packages/react/src/KpiTile.js:26 |
| KpiTile | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/KpiTile.js:27 |
| KpiTile | variant-default | variant | standard | pass | pass | Yes | packages/react/src/KpiTile.js:29 |
| KpiTile | state-default | state | default | pass | pass | Yes | packages/react/src/KpiTile.js:30 |
| List | variant-default | variant | standard | pass | pass | Yes | packages/react/src/List.js:13 |
| List | state-default | state | default | pass | pass | Yes | packages/react/src/List.js:14 |
| Menu | variant-default | variant | actions | pass | pass | Yes | packages/react/src/Menu.js:29 |
| Menu | avatar-status-default | avatarStatus | none | pass | pass | Yes | packages/react/src/Menu.js:31 |
| Menu | state-default | state | default | pass | pass | Yes | packages/react/src/Menu.js:33 |
| Menu | align-default | align | start | pass | pass | Yes | packages/react/src/Menu.js:34 |
| MotionBoundary | variant-default | variant | fade | pass | pass | Yes | packages/react/src/MotionBoundary.js:17 |
| MotionBoundary | state-default | state | active | pass | pass | Yes | packages/react/src/MotionBoundary.js:18 |
| MovementRow | category-default | category | transfer | pass | pass | Yes | packages/react/src/MovementRow.js:22 |
| MovementRow | variant-default | variant | standard | pass | pass | Yes | packages/react/src/MovementRow.js:23 |
| MovementRow | state-default | state | default | pass | pass | Yes | packages/react/src/MovementRow.js:24 |
| Pagination | variant-default | variant | numbered | pass | pass | Yes | packages/react/src/Pagination.js:53 |
| Pagination | state-default | state | default | pass | pass | Yes | packages/react/src/Pagination.js:54 |
| PhoneInput | variant-default | variant | country-code | pass | pass | Yes | packages/react/src/PhoneInput.js:56 |
| Popover | variant-default | variant | information | pass | pass | Yes | packages/react/src/Popover.js:21 |
| Popover | state-default | state | default | pass | pass | Yes | packages/react/src/Popover.js:22 |
| Popover | placement-default | placement | bottom | pass | pass | Yes | packages/react/src/Popover.js:23 |
| ProgressIndicator | state-default | state | active | pass | pass | Yes | packages/react/src/ProgressIndicator.js:18 |
| ProgressIndicator | tone-default | tone | accent | pass | pass | Yes | packages/react/src/ProgressIndicator.js:34 |
| ProgressIndicator | state-default | state | active | pass | pass | Yes | packages/react/src/ProgressIndicator.js:35 |
| QuickAction | state-default | state | default | pass | pass | Yes | packages/react/src/QuickAction.js:16 |
| QuickAction | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/QuickAction.js:19 |
| RadioButton | variant-default | variant | default | pass | pass | Yes | packages/react/src/RadioButton.js:19 |
| RadioButton | state-default | state | unselected | pass | pass | Yes | packages/react/src/RadioButton.js:20 |
| RouteSummary | variant-default | variant | standard | pass | pass | Yes | packages/react/src/RouteSummary.js:57 |
| RouteSummary | state-default | state | default | pass | pass | Yes | packages/react/src/RouteSummary.js:58 |
| RouteSummary | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/RouteSummary.js:60 |
| SegmentedControl | variant-default | variant | outlined | pass | pass | Yes | packages/react/src/SegmentedControl.js:42 |
| Select | variant-default | variant | default | pass | pass | Yes | packages/react/src/Select.js:26 |
| Select | state-default | state | default | pass | pass | Yes | packages/react/src/Select.js:27 |
| Skeleton | variant-default | variant | text | pass | pass | Yes | packages/react/src/Skeleton.js:79 |
| Slider | variant-default | variant | continuous | pass | pass | Yes | packages/react/src/Slider.js:38 |
| Slider | state-default | state | default | pass | pass | Yes | packages/react/src/Slider.js:39 |
| Spinner | tone-default | tone | accent | pass | pass | Yes | packages/react/src/Spinner.js:20 |
| Spinner | state-default | state | loading | pass | pass | Yes | packages/react/src/Spinner.js:21 |
| StationPin | variant-default | variant | fuel | pass | pass | Yes | packages/react/src/StationPin.js:15 |
| StationPin | state-default | state | default | pass | pass | Yes | packages/react/src/StationPin.js:16 |
| Stepper | orientation-default | orientation | horizontal | pass | pass | Yes | packages/react/src/Stepper.js:25 |
| Switch | state-default | state | off | pass | pass | Yes | packages/react/src/Switch.js:17 |
| Table | variant-default | variant | standard | pass | pass | Yes | packages/react/src/Table.js:36 |
| Table | state-default | state | default | pass | pass | Yes | packages/react/src/Table.js:37 |
| Table | sort-direction-default | sortDir | ascending | pass | pass | Yes | packages/react/src/Table.js:41 |
| Tabs | variant-default | variant | default | pass | pass | Yes | packages/react/src/Tabs.js:36 |
| Tag | state-default | state | default | pass | pass | Yes | packages/react/src/Tag.js:18 |
| Tag | variant-default | variant | metadata | pass | pass | Yes | packages/react/src/Tag.js:25 |
| Tag | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/Tag.js:26 |
| Tag | state-default | state | default | pass | pass | Yes | packages/react/src/Tag.js:27 |
| Toast | tone-default | tone | neutral | pass | pass | Yes | packages/react/src/Toast.js:22 |
| Toast | variant-default | variant | status | pass | pass | Yes | packages/react/src/Toast.js:23 |
| Toast | state-default | state | visible | pass | pass | Yes | packages/react/src/Toast.js:24 |
| Tooltip | placement-default | placement | top | pass | pass | Yes | packages/react/src/Tooltip.js:18 |
| Tooltip | variant-default | variant | default | pass | pass | Yes | packages/react/src/Tooltip.js:19 |
| Tooltip | state-default | state | default | pass | pass | Yes | packages/react/src/Tooltip.js:21 |
| TreeView | state-default | state | expanded | pass | pass | Yes | packages/react/src/TreeView.js:41 |

## Visible Semantic Defaults

| Component | Rule | Prop | Default value | Location | Source |
| --- | --- | --- | --- | --- | --- |
| AnimatedMoment | variant-default | variant | success | packages/react/src/AnimatedMoment.js:21 | `variant = "success",` |
| AnimatedMoment | state-default | state | playing | packages/react/src/AnimatedMoment.js:22 | `state = "playing",` |
| AuditEvent | tone-default | tone | neutral | packages/react/src/AuditEvent.js:25 | `tone = "neutral",` |
| AuditEvent | state-default | state | default | packages/react/src/AuditEvent.js:26 | `state = "default",` |
| Avatar | status-default | status | none | packages/react/src/Avatar.js:41 | `status = "none",` |
| Avatar | state-default | state | default | packages/react/src/Avatar.js:42 | `state = "default",` |
| Badge | state-default | state | default | packages/react/src/Badge.js:17 | `function normalizeState({ hidden = false, state = "default" } = {}) {` |
| Badge | tone-default | tone | neutral | packages/react/src/Badge.js:24 | `tone = "neutral",` |
| Badge | variant-default | variant | status | packages/react/src/Badge.js:25 | `variant = "status",` |
| Badge | state-default | state | default | packages/react/src/Badge.js:26 | `state = "default",` |
| BiometricPrompt | variant-default | variant | fingerprint | packages/react/src/BiometricPrompt.js:26 | `variant = "fingerprint",` |
| BiometricPrompt | state-default | state | default | packages/react/src/BiometricPrompt.js:27 | `state = "default",` |
| Breadcrumbs | variant-default | variant | standard | packages/react/src/Breadcrumbs.js:45 | `variant = "standard",` |
| Breadcrumbs | state-default | state | default | packages/react/src/Breadcrumbs.js:46 | `state = "default",` |
| Button | variant-default | variant | primary | packages/react/src/Button.js:8 | `function buttonClassName({ variant = "primary", intent = "default", className = "" } = {}) {` |
| Button | intent-default | intent | default | packages/react/src/Button.js:8 | `function buttonClassName({ variant = "primary", intent = "default", className = "" } = {}) {` |
| Button | variant-default | variant | primary | packages/react/src/Button.js:20 | `variant = "primary",` |
| Button | intent-default | intent | default | packages/react/src/Button.js:21 | `intent = "default",` |
| Button | state-default | state | default | packages/react/src/Button.js:23 | `state = "default",` |
| Card | trend-default | trend | neutral | packages/react/src/Card.js:59 | `trend = "neutral",` |
| Card | variant-default | variant | default | packages/react/src/Card.js:63 | `variant = "default",` |
| Card | composition-default | composition | standard | packages/react/src/Card.js:64 | `composition = "standard",` |
| Card | state-default | state | default | packages/react/src/Card.js:65 | `state = "default",` |
| CardSummary | variant-default | variant | physical | packages/react/src/CardSummary.js:23 | `variant = "physical",` |
| CardSummary | state-default | state | default | packages/react/src/CardSummary.js:24 | `state = "default",` |
| ChartPanel | variant-default | variant | sparkline | packages/react/src/ChartPanel.js:220 | `variant = "sparkline",` |
| ChartPanel | state-default | state | default | packages/react/src/ChartPanel.js:221 | `state = "default",` |
| ChartPanel | tone-default | tone | neutral | packages/react/src/ChartPanel.js:222 | `tone = "neutral",` |
| Checkbox | variant-default | variant | default | packages/react/src/Checkbox.js:20 | `variant = "default",` |
| Checkbox | state-default | state | unchecked | packages/react/src/Checkbox.js:21 | `state = "unchecked",` |
| Chip | state-default | state | default | packages/react/src/Chip.js:18 | `function normalizeState({ disabled = false, selected = false, state = "default" } = {}) {` |
| Chip | variant-default | variant | filter | packages/react/src/Chip.js:27 | `variant = "filter",` |
| Chip | tone-default | tone | default | packages/react/src/Chip.js:28 | `tone = "default",` |
| Chip | state-default | state | default | packages/react/src/Chip.js:29 | `state = "default",` |
| CodeInput | variant-default | variant | sms | packages/react/src/CodeInput.js:31 | `variant = "sms",` |
| Dialog | tone-default | tone | neutral | packages/react/src/Dialog.js:34 | `tone = "neutral",` |
| Dialog | variant-default | variant | confirmation | packages/react/src/Dialog.js:35 | `variant = "confirmation",` |
| Dialog | state-default | state | closed | packages/react/src/Dialog.js:36 | `state = "closed",` |
| Drawer | variant-default | variant | side-sheet | packages/react/src/Drawer.js:76 | `variant = "side-sheet",` |
| Drawer | state-default | state | closed | packages/react/src/Drawer.js:77 | `state = "closed",` |
| Drawer | tone-default | tone | neutral | packages/react/src/Drawer.js:78 | `tone = "neutral",` |
| Drawer | side-default | side | right | packages/react/src/Drawer.js:80 | `side = "right",` |
| EmptyState | variant-default | variant | first-use | packages/react/src/EmptyState.js:23 | `variant = "first-use",` |
| EmptyState | state-default | state | default | packages/react/src/EmptyState.js:24 | `state = "default",` |
| ErrorPanel | tone-default | tone | error | packages/react/src/ErrorPanel.js:30 | `tone = "error",` |
| ErrorPanel | variant-default | variant | panel | packages/react/src/ErrorPanel.js:31 | `variant = "panel",` |
| ErrorPanel | state-default | state | error | packages/react/src/ErrorPanel.js:32 | `state = "error",` |
| FloatingActionButton | variant-default | variant | primary | packages/react/src/FloatingActionButton.js:13 | `variant = "primary",` |
| FloatingActionButton | state-default | state | default | packages/react/src/FloatingActionButton.js:14 | `state = "default",` |
| IconButton | variant-default | variant | ghost | packages/react/src/IconButton.js:7 | `function iconButtonClassName({ variant = "ghost", className = "" } = {}) {` |
| IconButton | variant-default | variant | ghost | packages/react/src/IconButton.js:15 | `variant = "ghost",` |
| InlineValidation | state-default | state | default | packages/react/src/InlineValidation.js:20 | `state = "default",` |
| Input | variant-default | variant | text | packages/react/src/Input.js:76 | `variant = "text",` |
| Input | align-default | align | start | packages/react/src/Input.js:84 | `align = "start",` |
| KpiTile | trend-default | trend | flat | packages/react/src/KpiTile.js:26 | `trend = "flat",` |
| KpiTile | tone-default | tone | neutral | packages/react/src/KpiTile.js:27 | `tone = "neutral",` |
| KpiTile | variant-default | variant | standard | packages/react/src/KpiTile.js:29 | `variant = "standard",` |
| KpiTile | state-default | state | default | packages/react/src/KpiTile.js:30 | `state = "default",` |
| List | variant-default | variant | standard | packages/react/src/List.js:13 | `variant = "standard",` |
| List | state-default | state | default | packages/react/src/List.js:14 | `state = "default",` |
| Menu | variant-default | variant | actions | packages/react/src/Menu.js:29 | `variant = "actions",` |
| Menu | avatar-status-default | avatarStatus | none | packages/react/src/Menu.js:31 | `avatarStatus = "none",` |
| Menu | state-default | state | default | packages/react/src/Menu.js:33 | `state = "default",` |
| Menu | align-default | align | start | packages/react/src/Menu.js:34 | `align = "start",` |
| MotionBoundary | variant-default | variant | fade | packages/react/src/MotionBoundary.js:17 | `variant = "fade",` |
| MotionBoundary | state-default | state | active | packages/react/src/MotionBoundary.js:18 | `state = "active",` |
| MovementRow | category-default | category | transfer | packages/react/src/MovementRow.js:22 | `category = "transfer",` |
| MovementRow | variant-default | variant | standard | packages/react/src/MovementRow.js:23 | `variant = "standard",` |
| MovementRow | state-default | state | default | packages/react/src/MovementRow.js:24 | `state = "default",` |
| Pagination | variant-default | variant | numbered | packages/react/src/Pagination.js:53 | `variant = "numbered",` |
| Pagination | state-default | state | default | packages/react/src/Pagination.js:54 | `state = "default",` |
| PhoneInput | variant-default | variant | country-code | packages/react/src/PhoneInput.js:56 | `variant = "country-code",` |
| Popover | variant-default | variant | information | packages/react/src/Popover.js:21 | `variant = "information",` |
| Popover | state-default | state | default | packages/react/src/Popover.js:22 | `state = "default",` |
| Popover | placement-default | placement | bottom | packages/react/src/Popover.js:23 | `placement = "bottom",` |
| ProgressIndicator | state-default | state | active | packages/react/src/ProgressIndicator.js:18 | `function progressMeta({ value = 0, max = 100, state = "active", indeterminate = false } = {}) {` |
| ProgressIndicator | tone-default | tone | accent | packages/react/src/ProgressIndicator.js:34 | `tone = "accent",` |
| ProgressIndicator | state-default | state | active | packages/react/src/ProgressIndicator.js:35 | `state = "active",` |
| QuickAction | state-default | state | default | packages/react/src/QuickAction.js:16 | `state = "default",` |
| QuickAction | tone-default | tone | neutral | packages/react/src/QuickAction.js:19 | `tone = "neutral",` |
| RadioButton | variant-default | variant | default | packages/react/src/RadioButton.js:19 | `variant = "default",` |
| RadioButton | state-default | state | unselected | packages/react/src/RadioButton.js:20 | `state = "unselected",` |
| RouteSummary | variant-default | variant | standard | packages/react/src/RouteSummary.js:57 | `variant = "standard",` |
| RouteSummary | state-default | state | default | packages/react/src/RouteSummary.js:58 | `state = "default",` |
| RouteSummary | tone-default | tone | neutral | packages/react/src/RouteSummary.js:60 | `tone = "neutral",` |
| SegmentedControl | variant-default | variant | outlined | packages/react/src/SegmentedControl.js:42 | `variant = "outlined",` |
| Select | variant-default | variant | default | packages/react/src/Select.js:26 | `variant = "default",` |
| Select | state-default | state | default | packages/react/src/Select.js:27 | `state = "default",` |
| Skeleton | variant-default | variant | text | packages/react/src/Skeleton.js:79 | `variant = "text",` |
| Slider | variant-default | variant | continuous | packages/react/src/Slider.js:38 | `variant = "continuous",` |
| Slider | state-default | state | default | packages/react/src/Slider.js:39 | `state = "default",` |
| Spinner | tone-default | tone | accent | packages/react/src/Spinner.js:20 | `tone = "accent",` |
| Spinner | state-default | state | loading | packages/react/src/Spinner.js:21 | `state = "loading",` |
| StationPin | variant-default | variant | fuel | packages/react/src/StationPin.js:15 | `variant = "fuel",` |
| StationPin | state-default | state | default | packages/react/src/StationPin.js:16 | `state = "default",` |
| Stepper | orientation-default | orientation | horizontal | packages/react/src/Stepper.js:25 | `orientation = "horizontal",` |
| Switch | state-default | state | off | packages/react/src/Switch.js:17 | `state = "off",` |
| Table | variant-default | variant | standard | packages/react/src/Table.js:36 | `variant = "standard",` |
| Table | state-default | state | default | packages/react/src/Table.js:37 | `state = "default",` |
| Table | sort-direction-default | sortDir | ascending | packages/react/src/Table.js:41 | `sortDir = "ascending",` |
| Tabs | variant-default | variant | default | packages/react/src/Tabs.js:36 | `variant = "default",` |
| Tag | state-default | state | default | packages/react/src/Tag.js:18 | `function normalizeState({ disabled = false, state = "default" } = {}) {` |
| Tag | variant-default | variant | metadata | packages/react/src/Tag.js:25 | `variant = "metadata",` |
| Tag | tone-default | tone | neutral | packages/react/src/Tag.js:26 | `tone = "neutral",` |
| Tag | state-default | state | default | packages/react/src/Tag.js:27 | `state = "default",` |
| Toast | tone-default | tone | neutral | packages/react/src/Toast.js:22 | `tone = "neutral",` |
| Toast | variant-default | variant | status | packages/react/src/Toast.js:23 | `variant = "status",` |
| Toast | state-default | state | visible | packages/react/src/Toast.js:24 | `state = "visible",` |
| Tooltip | placement-default | placement | top | packages/react/src/Tooltip.js:18 | `placement = "top",` |
| Tooltip | variant-default | variant | default | packages/react/src/Tooltip.js:19 | `variant = "default",` |
| Tooltip | state-default | state | default | packages/react/src/Tooltip.js:21 | `state = "default",` |
| TreeView | state-default | state | expanded | packages/react/src/TreeView.js:41 | `state = "expanded",` |

