# Energy Cascade Audit

Status: **pass**

Energy must govern semantic color for actions, status, risk, text, surfaces, borders, charts, and maps without changing Flow tokens to copy reference visuals.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 108 | packages/tokens/styles/tokens.css |
| Primitive refs | 11 | animation-assets, charts, color, country-flags, disabled, field-action, iconography, illustration-assets, library-sources, maps, surface |
| Component refs | 60 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 63 | account-operations, action-sheet, advanced-filters, agent-conversation, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bottom-sheet, bulk-actions, calendar-view, case-management, chart-legend-item, chart-wrapper, checkbox-group, column-configurator, command-palette... |
| Template refs | 6 | configuration-console, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, routes-and-stations |
| Package CSS direct uses | 853 | packages/components/styles/components.css |
| Docs CSS direct uses | 0 | apps/docs/styles |

## Semantic Locks

- Primary action -> blue-500: pass
- Warning filled -> yellow-400: pass
- Warning foreground -> yellow-900: pass

## Contrast

| Pair | Ratio | Minimum | Status |
| --- | ---: | ---: | --- |
| Action filled text | 5.37 | 4.5 | pass |
| Success filled text | 5.34 | 4.5 | pass |
| Warning filled text | 10.69 | 4.5 | pass |
| Warning foreground on primary surface | 9.07 | 4.5 | pass |
| Error filled text | 5.62 | 4.5 | pass |
| Primary text on primary surface | 14.63 | 4.5 | pass |

## Dependencies

- State -> Energy: Interaction state uses Energy action semantics for focus, hover, pressed, and selected surfaces.
- Accessibility -> Energy: Accessible contrast uses Energy text and surface semantics instead of inventing contrast-only colors.
- Tone -> Energy: Tone color maps semantic language to Energy color decisions.
- Depth -> Energy: Overlay depth uses Energy neutral contrast instead of a separate overlay palette.
- Growth -> Energy: Growth stage colors delegate to Energy so maturity states do not introduce a separate status palette.
- Iconography -> Energy: Iconography uses Energy for disabled glyph availability without changing Symbol color roles.
- Symbol -> Energy: Symbol color roles delegate to Energy so symbolic states do not create a separate color system.

## Gaps

- No fail-level Energy cascade gaps detected.

## Raw Color Failures

- No raw color bypasses found in scanned CSS.

## Color Trace Reviews

- No untraced color declarations found in scanned CSS.

## Next Actions

- Fix fail-level raw color or direct ref-energy semantic bypasses before touching the next foundation.
- Keep ZIP look and feel as semantic mapping evidence, not as permission to change Energy tokens.
- When a component is audited 1:1, verify action/status/surface roles against this report and rendered contrast.

