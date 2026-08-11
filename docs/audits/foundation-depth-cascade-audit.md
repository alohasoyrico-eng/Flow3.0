# Depth Cascade Audit

Status: **pass**

Depth must govern surface hierarchy, elevation, overlay, blur, and stacking so UI layers communicate priority instead of decorative shadow.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 39 | packages/tokens/styles/tokens.css |
| Primitive refs | 13 | color, duration, elevation, field-action, focus, iconography, library-sources, maps, message, motion-curves, radius, spacing, surface |
| Component refs | 60 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 59 | account-operations, action-sheet, advanced-filters, agent-conversation, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bulk-actions, calendar-view, case-management, chart-wrapper, column-configurator, command-palette, confirmation-dialog, dense-operational-list, drag-sortable-list... |
| Template refs | 9 | agent-workspace, configuration-console, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, routes-and-stations, settings-workspace |
| Package CSS direct uses | 1350 | packages/components/styles/components.css |
| Docs CSS direct uses | 70 | apps/docs/styles |

## Dependencies

- Accessibility -> Depth: Accessible overlays use Depth elevation to preserve separation and reading order without local shadow recipes.
- Depth -> Energy: Overlay depth uses Energy neutral contrast instead of a separate overlay palette.
- Depth -> Frame: Depth lift distances use Frame geometry so motion/depth offsets scale with the frame system.

## Gaps

- No fail-level Depth cascade gaps detected.

## Depth Failures

- No raw Depth bypasses found in scanned CSS.

## Depth Trace Reviews

- No Depth trace reviews found.

## Next Actions

- Fix fail-level raw z-index, shadow, blur, and overlay values before changing layered component visuals.
- Replace product UI depth literals with sys-depth or component depth aliases.
- When a component is audited 1:1, verify layer role, escape/focus ownership, backdrop need, and stacking order from this report before visual parity.

