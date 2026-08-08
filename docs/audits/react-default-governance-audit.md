# React Default Governance Audit

Status: **pass**

Platform defaults such as density, size, and theme must come from the Flow cascade; component-level semantic defaults may exist only as visible contract decisions.

## Inventory

- React components scanned: 56
- Prohibited platform defaults: 0
- Visible semantic defaults: 99
- Semantic default contract gaps: 0

## Semantic Default Summary

| Rule | Count | Meaning |
| --- | ---: | --- |
| state-default | 43 | Component behavior default; allowed when normalized through component state. |
| variant-default | 40 | Component composition default; allowed when constrained by the component contract. |
| tone-default | 14 | Component tone fallback; allowed when constrained by the component contract. |
| intent-default | 2 | Action intent fallback; allowed when constrained by the component contract. |

## Prohibited Defaults

| Component | Rule | Location | Source |
| --- | --- | --- | --- |
| None | None | None | None |

## Semantic Default Contract Gaps

| Component | Prop | Default value | Allowed values | Location |
| --- | --- | --- | --- | --- |
| None | None | None | None | None |

## Visible Semantic Defaults

| Component | Rule | Prop | Default value | Location | Source |
| --- | --- | --- | --- | --- | --- |
| AnimatedMoment | variant-default | variant | success | packages/react/src/AnimatedMoment.js:21 | `variant = "success",` |
| AnimatedMoment | state-default | state | playing | packages/react/src/AnimatedMoment.js:22 | `state = "playing",` |
| AuditEvent | tone-default | tone | neutral | packages/react/src/AuditEvent.js:25 | `tone = "neutral",` |
| AuditEvent | state-default | state | default | packages/react/src/AuditEvent.js:26 | `state = "default",` |
| Avatar | state-default | state | default | packages/react/src/Avatar.js:42 | `state = "default",` |
| Badge | state-default | state | default | packages/react/src/Badge.js:17 | `function normalizeState({ hidden = false, state = "default" } = {}) {` |
| Badge | tone-default | tone | neutral | packages/react/src/Badge.js:24 | `tone = "neutral",` |
| Badge | variant-default | variant | status | packages/react/src/Badge.js:25 | `variant = "status",` |
| Badge | state-default | state | default | packages/react/src/Badge.js:26 | `state = "default",` |
| BiometricPrompt | variant-default | variant | fingerprint | packages/react/src/BiometricPrompt.js:30 | `variant = "fingerprint",` |
| BiometricPrompt | state-default | state | default | packages/react/src/BiometricPrompt.js:31 | `state = "default",` |
| Breadcrumbs | variant-default | variant | standard | packages/react/src/Breadcrumbs.js:45 | `variant = "standard",` |
| Breadcrumbs | state-default | state | default | packages/react/src/Breadcrumbs.js:46 | `state = "default",` |
| Button | variant-default | variant | primary | packages/react/src/Button.js:8 | `function buttonClassName({ variant = "primary", intent = "default", className = "" } = {}) {` |
| Button | intent-default | intent | default | packages/react/src/Button.js:8 | `function buttonClassName({ variant = "primary", intent = "default", className = "" } = {}) {` |
| Button | variant-default | variant | primary | packages/react/src/Button.js:20 | `variant = "primary",` |
| Button | intent-default | intent | default | packages/react/src/Button.js:21 | `intent = "default",` |
| Button | state-default | state | default | packages/react/src/Button.js:23 | `state = "default",` |
| Card | variant-default | variant | default | packages/react/src/Card.js:63 | `variant = "default",` |
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
| KpiTile | tone-default | tone | neutral | packages/react/src/KpiTile.js:27 | `tone = "neutral",` |
| KpiTile | variant-default | variant | standard | packages/react/src/KpiTile.js:29 | `variant = "standard",` |
| KpiTile | state-default | state | default | packages/react/src/KpiTile.js:30 | `state = "default",` |
| List | variant-default | variant | standard | packages/react/src/List.js:13 | `variant = "standard",` |
| List | state-default | state | default | packages/react/src/List.js:14 | `state = "default",` |
| Menu | variant-default | variant | actions | packages/react/src/Menu.js:29 | `variant = "actions",` |
| Menu | state-default | state | default | packages/react/src/Menu.js:33 | `state = "default",` |
| MotionBoundary | variant-default | variant | fade | packages/react/src/MotionBoundary.js:17 | `variant = "fade",` |
| MotionBoundary | state-default | state | active | packages/react/src/MotionBoundary.js:18 | `state = "active",` |
| MovementRow | variant-default | variant | standard | packages/react/src/MovementRow.js:23 | `variant = "standard",` |
| MovementRow | state-default | state | default | packages/react/src/MovementRow.js:24 | `state = "default",` |
| Pagination | variant-default | variant | numbered | packages/react/src/Pagination.js:53 | `variant = "numbered",` |
| Pagination | state-default | state | default | packages/react/src/Pagination.js:54 | `state = "default",` |
| PhoneInput | variant-default | variant | country-code | packages/react/src/PhoneInput.js:56 | `variant = "country-code",` |
| Popover | variant-default | variant | information | packages/react/src/Popover.js:21 | `variant = "information",` |
| Popover | state-default | state | default | packages/react/src/Popover.js:22 | `state = "default",` |
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
| Switch | state-default | state | off | packages/react/src/Switch.js:17 | `state = "off",` |
| Table | variant-default | variant | standard | packages/react/src/Table.js:36 | `variant = "standard",` |
| Table | state-default | state | default | packages/react/src/Table.js:37 | `state = "default",` |
| Tabs | variant-default | variant | default | packages/react/src/Tabs.js:36 | `variant = "default",` |
| Tag | state-default | state | default | packages/react/src/Tag.js:18 | `function normalizeState({ disabled = false, state = "default" } = {}) {` |
| Tag | variant-default | variant | metadata | packages/react/src/Tag.js:25 | `variant = "metadata",` |
| Tag | tone-default | tone | neutral | packages/react/src/Tag.js:26 | `tone = "neutral",` |
| Tag | state-default | state | default | packages/react/src/Tag.js:27 | `state = "default",` |
| Toast | tone-default | tone | neutral | packages/react/src/Toast.js:22 | `tone = "neutral",` |
| Toast | variant-default | variant | status | packages/react/src/Toast.js:23 | `variant = "status",` |
| Toast | state-default | state | visible | packages/react/src/Toast.js:24 | `state = "visible",` |
| Tooltip | variant-default | variant | default | packages/react/src/Tooltip.js:19 | `variant = "default",` |
| Tooltip | state-default | state | default | packages/react/src/Tooltip.js:21 | `state = "default",` |
| TreeView | state-default | state | expanded | packages/react/src/TreeView.js:41 | `state = "expanded",` |

