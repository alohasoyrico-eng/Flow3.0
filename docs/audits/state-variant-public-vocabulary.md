# State Variant Public Vocabulary Inventory

Status: **inventory**

Inventory the public state/variant vocabulary exposed by component contracts before enforcing taxonomy changes in the existing Flow gates.

## Summary
- Components: 59
- Components with public vocabulary: 59
- Source: packages/components/src/contracts.js
- Taxonomy: packages/audit/contracts/state-variant-taxonomy-contract.json

## Public Prop Counts
- variant: 39
- state: 54
- tone: 14
- intent: 2
- density: 59
- size: 0
- selected: 6
- disabled: 33
- loading: 12

## Review Flags
- None

## Remediation Queue
- None

## Components
| Component | Family | Variants | Intents | States | Public vocabulary | Review flags |
| --- | --- | --- | --- | --- | --- | --- |
| accordion | navigation | single, multiple | default | default, closed, open, focus, disabled | variant, density | - |
| animated-moment | motion-feedback | success, empty, loading, celebration | feedback | idle, playing, paused, complete, reduced-motion, disabled | variant, state, density | - |
| audit-event | domain-event | standard | neutral, info, success, warning, danger, action | default, hover, focus, verified, warning, critical, disabled | state, tone, density | - |
| avatar | display-status | initials, image, status | default | default, online, busy, offline, disabled, unknown | state, density | - |
| badge | display-status | count, dot, status, icon | info, success, warning, danger, neutral, accent | default, hover, focus, overflow, hidden, disabled | variant, state, tone, density | - |
| biometric-prompt | domain-auth | fingerprint, face, passcode, fallback | authentication | default, idle, focus, authenticating, scanning, success, warning, error, disabled | variant, state, density | - |
| breadcrumbs | navigation | standard, compact, overflow, mobile | navigation | default, hover, focus, collapsed, current, disabled | variant, state, density, disabled | - |
| button | actions | primary, secondary, tertiary, outlined, ghost | default, danger, warning | default, hover, focus, pressed, disabled, loading | variant, state, intent, density, disabled, loading | - |
| card | surface-display | default, minimal, elevated, ghost | default | default, hover, focus, selected, loading, error, disabled, muted, interactive | variant, state, density, selected, disabled, loading | - |
| card-expiry-input | fields-payment | default | default | default, filled, valid, loading, error, disabled | state, density, disabled, loading | - |
| card-number-input | fields-payment | default | default | default, filled, valid, loading, error, disabled | state, density, disabled, loading | - |
| card-security-code-input | fields-payment | default | default | default, filled, valid, loading, error, disabled | state, density, disabled, loading | - |
| card-summary | domain-payment | physical, virtual, compact, limit | summary | default, hover, focus, active, warning, frozen, disabled | variant, state, density, disabled | - |
| chart-panel | data-display | sparkline, bars, line, area, donut, pareto, bullet, comparison, compact | info | default, focus, hover, warning, error, disabled | variant, state, tone, density | - |
| chat-composer | domain-chat | basic, with-attachment, sending | message-entry | default, focus, filled, sending, disabled, error | state, density | - |
| chat-message | domain-chat | user, agent, system, assistant | message | default, sending, sent, delivered, failed, loading | state, tone, density | - |
| chat-thread | domain-chat | message-list, empty, error, handoff, offline | conversation | default, loading, empty, error, handoff, offline | state, density | - |
| checkbox | choices | default, descriptive, select-all, compact | default | unchecked, checked, indeterminate, focus, error, disabled | variant, state, density, disabled | - |
| chip | display-status | filter, input | default, danger, warning | default, hover, pressed, selected, focus, disabled | variant, state, tone, density, selected, disabled | - |
| code-block | documentation-code | block, inline-group, specimen | reference | default, wrapped, scrollable, with-header, with-copy, copied, error, disabled | variant, state, density, disabled | - |
| code-input | fields | sms, otp, approval, masked, compact | security | default, hover, focus, complete, success, warning, error, disabled | variant, state, density, disabled | - |
| combobox | fields | default | default | default, open, focus, filled, empty, loading, error, disabled | state, density, disabled, loading | - |
| country-selector | fields | default, inline | selection | default, open, focus, error, disabled | density, disabled | - |
| date-picker | fields-date | calendar | input | default, hover, focus, selected, warning, error, disabled | state, density, disabled | - |
| date-range-picker | fields-date | calendar-range | input | default, hover, focus, selected, warning, error, disabled | state, density, disabled | - |
| dialog | overlays | confirmation, destructive, form, review, success | neutral, info, success, danger | open, focus, closing, default, closed | variant, state, tone, density | - |
| drawer | overlays | side-sheet, filter, detail, edit, review | neutral, info, danger | closed, default, open, focus, closing | variant, state, tone, density | - |
| empty-state | feedback | first-use, search-empty, permission, error, maintenance | neutral | default, action, search-empty, permission, loading, error | variant, state, density | - |
| error-panel | feedback | inline, panel, blocking, empty-recovery | warning, error, critical | default, warning, error, critical, loading, disabled | variant, state, tone, density | - |
| icon-button | actions | primary, secondary, tertiary, outlined, ghost | default, danger, warning | default, hover, pressed, selected, badged, focus, disabled, loading | variant, state, intent, density, selected, disabled, loading | - |
| inline-validation | feedback | info, success, warning, error | info, success, warning, error | default, info, success, warning, error, disabled | state, density | - |
| input | fields | text, email, password, number, currency, unit, search | default | default, focus, filled, info, success, warning, loading, error, disabled | variant, state, density, disabled, loading | - |
| input-amount | fields-payment | default | default | default, filled, loading, error, disabled | state, density, disabled, loading | - |
| kpi-tile | data-display | standard, compact, delta, threshold, sparkline, drill-in | neutral, info, success, warning, danger | default, hover, focus, selected, loading, risk, disabled | variant, state, tone, density, selected, disabled, loading | - |
| list | data-display | standard, compact, action, status, media | default | default, hover, selected, loading, error, disabled | variant, state, density | - |
| menu | overlays | actions, grouped, selection, danger, icon-trigger, avatar-trigger | neutral, danger | default, closed, open, focus, disabled | variant, state, density, disabled | - |
| motion-boundary | motion-feedback | fade, slide, collapse, route | motion | idle, entering, active, exiting, reduced-motion, disabled | variant, state, density | - |
| movement-row | domain-fleet | standard, refund, declined, compact | row-action | default, hover, focus, pending, error, disabled | variant, state, density, disabled | - |
| pagination | navigation | numbered, jump | navigation | default, hover, focus, selected, disabled | variant, state, density, disabled | - |
| phone-input | fields | country-code, compact, otp-handoff, readonly | input | default, hover, focus, valid, warning, error, disabled | variant, state, density, disabled | - |
| popover | overlays | information, action, form, metric | contextual | default, closed, open, hover, focus, warning, disabled | variant, state, density, disabled | - |
| progress-indicator | feedback | linear, indeterminate | accent, success, warning, danger, ink | default, active, indeterminate, paused, complete, error, disabled | state, tone, density | - |
| radio-button | choices | default, descriptive, compact, critical | default | unselected, selected, focus, error, disabled | variant, state, density, disabled | - |
| route-summary | domain-fleet | standard, compact, compare, policy | info, warning | default, hover, focus, selected, warning, disabled | variant, state, tone, density, selected, disabled | - |
| segmented-control | navigation | outlined, toolbar, compact, icon-only | selection | default, hover, focus, selected, warning, disabled | variant, density | - |
| select | fields | default, inline | default | default, open, focus, filled, empty, loading, error, disabled | variant, state, density, disabled, loading | - |
| skeleton | feedback | text, title, circle, card, pill, row, media, chart, table | default | default, loading, stale, paused, loaded, disabled | variant, state, density | - |
| slider | fields | continuous, stepped, bounded, threshold, paired-value | default | default, hover, focus, pressed, dragging, disabled, error, complete | variant, state, density, disabled | - |
| spinner | feedback | circular | accent, ink, success, warning, danger | default, loading, decorative, subtle, disabled | state, tone, density | - |
| station-pin | domain-fleet | fuel, ev, service, cluster | map | default, hover, focus, selected, unavailable, disabled | variant, state, density, selected, disabled | - |
| stepper | progress-feedback | horizontal, vertical | default | pending, active, complete | density | - |
| switch | choices | default | default | off, on, focus, pressed, error, disabled | state, density, disabled | - |
| table | data-display | standard, dense, sortable, selectable, expandable | data | default, hover, focus, selected, sorted, expanded | variant, state, density | - |
| tabs | navigation | default, underline | default | default, hover, selected, focus, overflow, disabled | variant, density | - |
| tag | display-status | metadata, status, platform, link | neutral, info, success, warning, danger | default, hover, pressed, focus, disabled | variant, state, tone, density, disabled | - |
| text-area | fields | default | default | default, focus, filled, success, warning, loading, error, disabled | state, density, disabled, loading | - |
| toast | feedback | status, progress, warning, recovery, undo | neutral, info, success, warning, danger | default, visible, action, stacked, exiting | variant, state, tone, density | - |
| tooltip | overlays | default, icon-help, metric, disabled-help | neutral, info | default, hover, focus, open, disabled, dismissed | variant, state, density, disabled | - |
| tree-view | navigation | standard | navigation, selection | default, hover, focus, expanded, selected, disabled | state, density | - |
