# Voice Cascade Audit

Status: **pass**

Voice must govern typographic role, product language, numerals, labels, helper copy, and repair copy across the full cascade.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 160 | packages/tokens/styles/tokens.css |
| Primitive refs | 7 | charts, density, illustration-assets, maps, message, research, typography |
| Component refs | 60 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 59 | account-operations, action-sheet, advanced-filters, agent-conversation, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bulk-actions, calendar-view, case-management, chart-wrapper, column-configurator, command-palette, confirmation-dialog, dense-operational-list, drag-sortable-list... |
| Template refs | 9 | agent-workspace, configuration-console, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, routes-and-stations, settings-workspace |
| Package CSS direct uses | 556 | packages/components/styles/components.css |
| Docs CSS direct uses | 449 | apps/docs/styles |

## Dependencies

- Accessibility -> Voice: Accessible readability delegates line-height to Voice so dense labels, helpers, and recovery copy do not create a parallel type rhythm.
- Tone -> Voice: Tone weight uses Voice weights instead of defining a separate type scale.
- Density -> Voice: Density profiles tune documentation and demo typography through Voice sizes and line-height tokens.
- Growth -> Voice: Growth event notation delegates to Voice mono typography for traceable audit/event strings.

## Gaps

- No fail-level Voice cascade gaps detected.

## Typography Failures

- No raw typography bypasses found in scanned CSS.

## Typography Alias Reviews

- No untraced local typography aliases found in scanned CSS.

## Next Actions

- Fix any fail-level Voice ownership or alias-bridge gap before touching the next foundation.
- Use this report as the Voice row in the all-foundations cascade audit.
- When a component is audited 1:1, verify rendered typography roles against this cascade, not only against local docs copy.

