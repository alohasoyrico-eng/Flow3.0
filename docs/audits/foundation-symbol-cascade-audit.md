# Symbol Cascade Audit

Status: **pass**

Symbol must govern visual metaphors, domain symbols, illustration rules, image/animation fallback, and its boundary with functional Iconography without changing Flow tokens for reference look and feel.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 38 | packages/tokens/styles/tokens.css |
| Primitive refs | 13 | animation-assets, charts, color, country-flags, disabled, focus, iconography, illustration-assets, library-sources, maps, message, motion-curves, spacing |
| Component refs | 62 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 49 | account-operations, action-sheet, advanced-filters, agent-conversation, artifact-metadata-bar, authentication-login-biometrics-and-otp, autocomplete, avatar-group, backoffice-approval, bottom-sheet, calendar-view, case-management, chart-legend-item, chart-wrapper, checkbox-group, column-configurator, command-palette, demo-preview-frame... |
| Template refs | 4 | docs-artifact-detail-template, driver-mobile-app, reference-detail-template, routes-and-stations |
| Package CSS direct uses | 493 | packages/components/styles/components.css |
| Docs CSS direct uses | 0 | apps/docs/styles |

## Dependencies

- Iconography -> Symbol: Iconography maps functional glyph family, size, and semantic color roles to Symbol so icons do not create a parallel visual language.
- Symbol -> Energy: Symbol color roles delegate to Energy so symbolic states do not create a separate color system.

## Gaps

- No fail-level Symbol cascade gaps detected.

## CSS Failures

- No raw Symbol styling bypasses found in scanned CSS.

## Fallback Reviews

- No Symbol fallback review blockers found.

## Next Actions

- Fix any fail-level Symbol ownership or raw-reference gap before primitives.
- Use Symbol for metaphor and illustration support; use Iconography for functional controls.
- When ZIP look and feel influences symbols, translate geometry, fallback, and motion through Flow foundations without changing Flow color tokens.

