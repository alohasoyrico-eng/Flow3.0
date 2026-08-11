# Anti-Duplication Coverage

Status: pass

Flow must have one visual owner per component concept; owner roots, protected roots, duplicate concept rules, and docs scans cannot drift silently. The actionable debt metric is antiDuplicationDebt.

- Component class roots protected: 63
- Accepted components with owner roots: 60/60
- Missing owner roots: 0
- Extension class roots: 3
- Protected high-risk roots: button, card, dialog, drawer, field, menu, popover
- Class root policy fingerprint: 7d73a06efac4a2a51693940a8fa6d583c5418effd7d720e2171f04f80877f0da
- Blocked concept rules: 21
- Blocked concept class names: 167
- Blocked concept contract fingerprint: aa1701261a53bba8bba3d0a85a89bc43d529b2550bc6ff5bbd20150c0f529a5e
- Live duplicate concept violations: 0
- Docs apps scanned: ../FlowDocs/apps/docs
- Docs component author file exemptions: 0
- Docs exact package class token allowlists: 1
- Docs package class token allowlist fingerprint: 26d33bf564e7d232eed995190fa5717691f2bdafc42f9c91be9bc75a92da2ff0
- Anti-duplication debt: 0
- Inventory baseline mismatches: 0
- Unexpected inventory metrics: 0

## Baseline Budget

Changing these numbers is a contract decision. Owner roots, extension roots, protected concepts, and docs apps scanned should not shrink silently.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| checks | 18 | 18 |
| componentClassRoots | 63 | 63 |
| acceptedComponents | 60 | 60 |
| ownerRoots | 60 | 60 |
| missingOwnerRoots | 0 | 0 |
| extensionRoots | 3 | 3 |
| protectedComponentRoots | 7 | 7 |
| classRootPolicyFingerprint | 7d73a06efac4a2a51693940a8fa6d583c5418effd7d720e2171f04f80877f0da | 7d73a06efac4a2a51693940a8fa6d583c5418effd7d720e2171f04f80877f0da |
| blockedConceptRules | 21 | 21 |
| blockedConceptClassNames | 167 | 167 |
| blockedConceptContractFingerprint | aa1701261a53bba8bba3d0a85a89bc43d529b2550bc6ff5bbd20150c0f529a5e | aa1701261a53bba8bba3d0a85a89bc43d529b2550bc6ff5bbd20150c0f529a5e |
| liveDuplicateConceptViolations | 0 | 0 |
| docsApps | 1 | 1 |
| docsAllowedComponentAuthors | 0 | 0 |
| docsAllowedPackageClassTokenFiles | 1 | 1 |
| docsAllowedPackageClassTokenFingerprint | 26d33bf564e7d232eed995190fa5717691f2bdafc42f9c91be9bc75a92da2ff0 | 26d33bf564e7d232eed995190fa5717691f2bdafc42f9c91be9bc75a92da2ff0 |
| antiDuplicationPolicyIssues | 0 | 0 |
| antiDuplicationDebt | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | --- | --- |
| None | None | None |

## Unexpected Inventory Metrics

| Metric | Actual |
| --- | ---: |
| None | None |

## Checks

- docs package component class ownership
- component class root registry alignment
- known duplicate concept classes
- primitive interactive DOM factories
- React-only component boundaries
- React component class ownership
- Field contract ownership
- Status feedback contract ownership
- Conversational UI contract ownership
- Chart visualization contract ownership
- Payment wallet contract ownership
- Data composite contract ownership
- Map runtime contract ownership
- Selection and date contract ownership
- Navigation and onboarding contract ownership
- Feedback and auth contract ownership
- Media and divider contract ownership
- Email messaging contract ownership

## Root Registry Alignment

| Component | React component | Missing owner root |
| --- | --- | --- |
| None | None | None |

## Extension Roots

| Root |
| --- |
| choice |
| country-flag |
| select-control |

## Blocked Concept Rules

| Concept | Blocked class names |
| --- | --- |
| search | pattern-topbar-search, topbar-search, top-search, pattern-search-results |
| account menu | pattern-account-menu |
| overlay | custom-overlay, pattern-overlay, demo-overlay, local-overlay |
| surface grouping | pattern-card-group, pattern-card-wrapper, card-group-wrapper, card-layout-wrapper |
| bottom sheet | bottom-sheet, pattern-bottom-sheet, mobile-bottom-sheet, custom-bottom-sheet |
| permissions matrix | permissions-matrix, roles-table, pattern-permissions-table, role-permission-grid |
| alert strip | alert-strip, pattern-alert-strip, status-alert-strip, inline-alert-strip |
| topbar navigation | custom-topbar, topbar-clone, pattern-local-topbar, docs-topbar-implementation |
| table toolbar | table-toolbar, data-table-toolbar, virtual-table-toolbar, pattern-table-actions |
| field shell | field-wrapper, field-shell, custom-field, pattern-field, form-field-wrapper |
| status feedback shell | status-view, feedback-shell, status-shell, feedback-banner, notice-banner, status-message-wrapper |
| conversational UI shell | agent-chat, assistant-chat, conversation-thread, prompt-composer, chat-shell, chat-message-clone, chat-thread-clone, chat-composer-clone |
| standalone chart visualization | donut-chart, heatmap-chart, treemap-chart, scatter-plot, line-chart, pareto-chart, bullet-chart, gantt-chart, waterfall-chart, chart-shell |
| payment wallet shell | payment-card, wallet-card, card-wallet-shell, card-wallet, wallet-input, otp-input, passcode-keypad, amount-input-clone, wallet-amount-shell, input-date, input-email, input-password, input-phone |
| data composite shell | bulk-actions-table, filterable-editable-table, kanban-board, table-timeline, table-tree, transaction-row, data-composite, editable-table, filterable-table, board-column, table-tree-row, transaction-list-row |
| map runtime shell | map-canvas, map-shell, route-map, station-map, fleet-map, map-runtime, map-provider, map-marker-layer, route-line-layer, station-pin-layer, map-fallback-panel |
| selection date shell | select-combo, select-country, select-multiple, country-picker, country-select, multi-select-shell, custom-listbox, local-listbox, calendar-popover, calendar-picker, date-range-shell, date-filter-shell, custom-calendar, range-calendar, combo-range-shell, date-selector-shell |
| navigation onboarding shell | navigation-shell, mobile-nav, bottom-nav, tab-bar, nav-rail, top-bar, sidebar-clone, onboarding-carousel, wizard-carousel, stepper-flow, welcome-carousel, safe-area-tabbar, mobile-tabbar |
| feedback auth shell | notification-center, toast-stack, circular-progress, progress-ring, loading-screen, auth-sheet, permission-sheet, status-screen, success-screen, offline-screen, service-status-screen, feedback-modal |
| media divider shell | card-media, media-card, image-card, media-shell, hero-card, cover-card, illustration-card, standalone-divider, content-divider, timeline-divider, vertical-divider, horizontal-divider, divider-label, separator-shell |
| email messaging shell | email-layout, mailing-shell, transactional-email, receipt-email, weekly-summary-email, team-invite-email, security-alert-email, welcome-email, email-card, email-footer, email-preheader, esp-template, mailer-template, email-template |

## Live Duplicate Concept Violations

| Concept | Class | Source |
| --- | --- | --- |
| None | None | None |
