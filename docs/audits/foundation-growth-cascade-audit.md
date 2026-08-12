# Growth Cascade Audit

Status: **pass**

Growth governs maturity, adoption, telemetry, deprecation, and learning signals. It must make artifact evolution explicit without turning maturity into decorative UI or vanity analytics.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 9 | packages/tokens/styles/tokens.css |
| Primitive refs | 24 | animation-assets, breakpoints, charts, color, country-flags, density, disabled, duration, elevation, field-action, focus, iconography, illustration-assets, library-sources, loading, maps, measurement, message, motion-curves, radius, research, spacing, surface, typography |
| Component refs | 60 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern contract refs | 63 | account-operations, action-sheet, advanced-filters, agent-conversation, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bottom-sheet, bulk-actions, calendar-view, case-management, chart-legend-item, chart-wrapper, checkbox-group, column-configurator, command-palette... |
| Pattern copy refs | 30 | account-operations, advanced-filters, agent-conversation, backoffice-approval, bottom-sheet, case-management, chart-legend-item, chart-wrapper, checkbox-group, command-palette, dense-operational-list, email-template-layout, expandable-detail-table, filterable-editable-table, gantt-chart, help-center, kanban-board, multi-step-form... |
| Template refs | 9 | agent-workspace, configuration-console, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, routes-and-stations, settings-workspace |
| Package CSS direct uses | 75 | packages/components/styles/components.css |
| Docs CSS direct uses | 0 | apps/docs/styles |

## Dependencies

- Growth -> Energy: Growth stage colors delegate to Energy so maturity states do not introduce a separate status palette.
- Growth -> Voice: Growth event notation delegates to Voice mono typography for traceable audit/event strings.

## Gaps

- No fail-level Growth cascade gaps detected.

## Growth CSS Failures

- No raw Growth CSS bypasses found in scanned CSS.

## Telemetry And Deprecation Reviews

- No telemetry or deprecation reviews found.

## Next Actions

- Complete Growth -> Energy dependency evidence for every stage color, including measured and deprecated.
- Route Growth-related visual stage treatments through Growth, Voice, Energy, or component aliases.
- Require growth stage plus analytics/telemetry metadata together for critical shared actions.
- Review deprecation references so each one includes replacement path and cutoff or migration rule.

