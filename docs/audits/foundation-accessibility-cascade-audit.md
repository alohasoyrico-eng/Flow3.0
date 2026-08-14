# Accessibility Cascade Audit

Status: **pass**

Accessibility must govern name, role, state, keyboard, focus, touch target, contrast, reduced motion, recovery, localization, and non-visual alternatives from foundations through templates.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 15 | packages/tokens/styles/tokens.css |
| Primitive refs | 24 | animation-assets, breakpoints, charts, color, country-flags, density, disabled, duration, elevation, field-action, focus, iconography, illustration-assets, library-sources, loading, maps, measurement, message, motion-curves, radius, research, spacing, surface, typography |
| Component refs | 62 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 72 | account-operations, action-sheet, advanced-filters, agent-conversation, artifact-metadata-bar, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bottom-sheet, bulk-actions, calendar-view, case-management, chart-legend-item, chart-wrapper, checkbox-group, column-configurator... |
| Template refs | 17 | agent-workspace, component-detail-template, configuration-console, docs-artifact-detail-template, docs-collection-template, docs-home-template, docs-shell-template, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, pattern-detail-template, reference-detail-template, routes-and-stations, settings-workspace, template-detail-template |
| Package CSS direct uses | 599 | packages/components/styles/components.css |
| Docs CSS direct uses | 0 | apps/docs/styles |

## Dependencies

- Accessibility -> State: Accessible focus delegates visual focus geometry to State so focus is consistent across components.
- Accessibility -> Momentum: Accessible motion duration delegates to Momentum so reduced-motion and timing rules share one source.
- Accessibility -> Voice: Accessible readability delegates line-height to Voice so dense labels, helpers, and recovery copy do not create a parallel type rhythm.
- Accessibility -> Frame: Accessible target size composes the minimum touch target with Frame control height so density cannot shrink interaction below usable geometry.
- Accessibility -> Energy: Accessible contrast uses Energy text and surface semantics instead of inventing contrast-only colors.
- Accessibility -> Depth: Accessible overlays use Depth elevation to preserve separation and reading order without local shadow recipes.
- Iconography -> Accessibility: Iconography exposes target and focus aliases through Accessibility; naming policy stays in docs/specs, while measurable affordance tokens are package-owned.

## Gaps

- No fail-level Accessibility cascade gaps detected.

## Component Semantics Failures

- No fail-level component Accessibility semantics gaps found.

## Accessibility CSS Failures

- No raw Accessibility CSS bypasses found in scanned CSS.

## Accessibility Trace Reviews

- No Accessibility trace reviews found.

## Next Actions

- Add missing foundation dependency edges before claiming Accessibility cascades through the full system.
- Fix fail-level component semantics and focus contract issues before visual parity claims.
- Replace raw focus, target, and reduced-motion values with Accessibility, dependent foundation, or component aliases.

