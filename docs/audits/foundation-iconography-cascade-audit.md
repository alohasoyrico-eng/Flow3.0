# Iconography Cascade Audit

Status: **pass**

Iconography must govern functional glyph family, sizing, semantic color, optical alignment, touch/focus affordance, accessible names, and fallback behavior without creating a parallel symbol language.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 24 | packages/tokens/styles/tokens.css |
| Primitive refs | 11 | animation-assets, color, country-flags, density, disabled, field-action, iconography, illustration-assets, library-sources, maps, message |
| Component refs | 60 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 59 | account-operations, action-sheet, advanced-filters, agent-conversation, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bulk-actions, calendar-view, case-management, chart-wrapper, column-configurator, command-palette, confirmation-dialog, dense-operational-list, drag-sortable-list... |
| Template refs | 9 | agent-workspace, configuration-console, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, routes-and-stations, settings-workspace |
| Package CSS direct uses | 408 | packages/components/styles/components.css |
| Docs CSS direct uses | 0 | apps/docs/styles |

## Dependencies

- Iconography -> Symbol: Iconography maps functional glyph family, size, and semantic color roles to Symbol so icons do not create a parallel visual language.
- Iconography -> Accessibility: Iconography exposes target and focus aliases through Accessibility; naming policy stays in docs/specs, while measurable affordance tokens are package-owned.
- Iconography -> Energy: Iconography uses Energy for disabled glyph availability without changing Symbol color roles.

## Gaps

- No fail-level Iconography cascade gaps detected.

## Iconography CSS Failures

- No raw Iconography CSS bypasses found in scanned CSS.

## Iconography Trace Reviews

- No Iconography trace reviews found.

## Next Actions

- Replace raw icon family, size, font variation, and color values with Iconography, Symbol, Accessibility, Energy, or component aliases.
- Review JS icon literals and route reusable glyphs through the icon helper or registry.
- When a component is audited 1:1, verify icon role, accessible naming, target/focus, density scaling, and non-icon-only meaning from this report.

