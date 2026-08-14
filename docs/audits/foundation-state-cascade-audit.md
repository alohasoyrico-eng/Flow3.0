# State Cascade Audit

Status: **pass**

State must resolve interaction condition, precedence, disabled/loading/error behavior, and accessible state semantics before any component, pattern, or template applies visual treatment.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 31 | packages/tokens/styles/tokens.css |
| Primitive refs | 24 | animation-assets, breakpoints, charts, color, country-flags, density, disabled, duration, elevation, field-action, focus, iconography, illustration-assets, library-sources, loading, maps, measurement, message, motion-curves, radius, research, spacing, surface, typography |
| Component refs | 62 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 72 | account-operations, action-sheet, advanced-filters, agent-conversation, artifact-metadata-bar, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bottom-sheet, bulk-actions, calendar-view, case-management, chart-legend-item, chart-wrapper, checkbox-group, column-configurator... |
| Template refs | 17 | agent-workspace, component-detail-template, configuration-console, docs-artifact-detail-template, docs-collection-template, docs-home-template, docs-shell-template, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, pattern-detail-template, reference-detail-template, routes-and-stations, settings-workspace, template-detail-template |
| Package CSS direct uses | 1046 | packages/components/styles/components.css |
| Docs CSS direct uses | 0 | apps/docs/styles |

## Dependencies

- State -> Energy: Interaction state uses Energy action semantics for focus, hover, pressed, and selected surfaces.
- State -> Frame: Interaction state uses Frame geometry for focus offset so focus does not invent its own spacing.
- Accessibility -> State: Accessible focus delegates visual focus geometry to State so focus is consistent across components.

## Gaps

- No fail-level State cascade gaps detected.

## Component State Contract Failures

- No fail-level component state precedence gaps found.

## State CSS Failures

- No raw state CSS bypasses found in scanned CSS.

## State Trace Reviews

- No State trace reviews found.

## Next Actions

- Fix fail-level state precedence issues before changing component visuals.
- Replace raw state styling with sys-state, dependent foundation, or component aliases where product UI state is being represented.
- When a component is audited 1:1, verify disabled, loading, error, focus, selected, hover, and pressed precedence from this report before visual parity.

