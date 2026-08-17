# Tone Cascade Audit

Status: **pass**

Tone governs language temperature and semantic emphasis. It must delegate type weight to Voice and semantic color to Energy, then cascade into feedback, validation, status, and recovery without local copy or visual tone systems.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 13 | packages/tokens/styles/tokens.css |
| Primitive refs | 16 | color, disabled, duration, elevation, field-action, iconography, illustration-assets, loading, maps, measurement, message, motion-curves, radius, research, surface, typography |
| Component refs | 62 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 72 | account-operations, action-sheet, advanced-filters, agent-conversation, artifact-metadata-bar, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bottom-sheet, bulk-actions, calendar-view, case-management, chart-legend-item, chart-wrapper, checkbox-group, column-configurator... |
| Template refs | 17 | agent-workspace, component-detail-template, configuration-console, docs-artifact-detail-template, docs-collection-template, docs-home-template, docs-shell-template, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, pattern-detail-template, reference-detail-template, routes-and-stations, settings-workspace, template-detail-template |
| Package CSS direct uses | 179 | packages/components/styles/components.css |
| Docs CSS direct uses | 0 | apps/docs/styles |

## Dependencies

- Tone -> Voice: Tone weight uses Voice weights instead of defining a separate type scale.
- Tone -> Energy: Tone color maps semantic language to Energy color decisions.

## Gaps

- No fail-level Tone cascade gaps detected.

## Tone CSS Failures

- No raw Tone CSS bypasses found in scanned CSS.

## Tone Trace Reviews

- No Tone trace reviews found.

## Next Actions

- Replace raw tone-related colors and type weights with Tone, Voice, Energy, or component aliases.
- Review feedback/status copy so errors include recovery, urgent copy is reserved for risk, and confirmations name the resulting state.
- When a component is audited 1:1, verify visible tone, copy tone, semantic status, and dependency trace from this report.

