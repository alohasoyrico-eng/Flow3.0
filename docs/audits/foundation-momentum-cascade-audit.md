# Momentum Cascade Audit

Status: **pass**

Momentum must govern timing, easing, transforms, loops, enter/exit, and reduced-motion behavior so movement communicates cause instead of decoration.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 88 | packages/tokens/styles/tokens.css |
| Primitive refs | 15 | animation-assets, charts, color, density, disabled, duration, elevation, field-action, focus, illustration-assets, library-sources, loading, maps, message, motion-curves |
| Component refs | 62 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 72 | account-operations, action-sheet, advanced-filters, agent-conversation, artifact-metadata-bar, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bottom-sheet, bulk-actions, calendar-view, case-management, chart-legend-item, chart-wrapper, checkbox-group, column-configurator... |
| Template refs | 17 | agent-workspace, component-detail-template, configuration-console, docs-artifact-detail-template, docs-collection-template, docs-home-template, docs-shell-template, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, pattern-detail-template, reference-detail-template, routes-and-stations, settings-workspace, template-detail-template |
| Package CSS direct uses | 867 | packages/components/styles/components.css |
| Docs CSS direct uses | 0 | apps/docs/styles |

## Dependencies

- Accessibility -> Momentum: Accessible motion duration delegates to Momentum so reduced-motion and timing rules share one source.

## Animation Coverage

- Keyframes: 28
- Animated files: 1
- Global reduced-motion path: yes
- Reduced-motion gaps: 0

## Gaps

- No fail-level Momentum cascade gaps detected.

## Motion Failures

- No raw motion bypasses found in scanned CSS.

## Motion Trace Reviews

- No untraced motion declarations found in scanned CSS.

## Next Actions

- Fix fail-level raw duration/easing/transform and reduced-motion gaps before touching the next foundation.
- Replace component duration/ease literals with sys-momentum aliases where they are product UI behavior.
- When a component is audited 1:1, verify enter, exit, loop continuity, reduced motion, and user-triggered state timing against this report.

