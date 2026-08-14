# Frame Cascade Audit

Status: **pass**

Frame must govern spacing, grid, density, radius, sizing, borders, and responsive rhythm before any component, pattern, or template solves layout locally.

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Token declarations | 261 | packages/tokens/styles/tokens.css |
| Primitive refs | 15 | animation-assets, breakpoints, country-flags, density, elevation, field-action, focus, iconography, illustration-assets, library-sources, maps, radius, spacing, surface, typography |
| Component refs | 62 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 72 | account-operations, action-sheet, advanced-filters, agent-conversation, artifact-metadata-bar, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bottom-sheet, bulk-actions, calendar-view, case-management, chart-legend-item, chart-wrapper, checkbox-group, column-configurator... |
| Template refs | 17 | agent-workspace, component-detail-template, configuration-console, docs-artifact-detail-template, docs-collection-template, docs-home-template, docs-shell-template, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, pattern-detail-template, reference-detail-template, routes-and-stations, settings-workspace, template-detail-template |
| Package CSS direct uses | 1486 | packages/components/styles/components.css |
| Docs CSS direct uses | 0 | apps/docs/styles |

## Dependencies

- State -> Frame: Interaction state uses Frame geometry for focus offset so focus does not invent its own spacing.
- Accessibility -> Frame: Accessible target size composes the minimum touch target with Frame control height so density cannot shrink interaction below usable geometry.
- Depth -> Frame: Depth lift distances use Frame geometry so motion/depth offsets scale with the frame system.
- Frame -> Density: Frame runtime geometry delegates control size, padding, and gaps to the viewport/density context.
- Density -> Frame: Density profiles are composed from Frame spacing and control-height primitives, then feed Frame runtime aliases back into components.

## Gaps

- No fail-level Frame cascade gaps detected.

## Geometry Failures

- No raw geometry bypasses found in scanned CSS.

## Geometry Trace Reviews

- No untraced geometry declarations found in scanned CSS.

## Next Actions

- Fix fail-level raw geometry before touching the next foundation.
- Promote repeated direct ref-frame usage to sys/component/pattern aliases when it is product UI rather than foundation reference.
- When a component is audited 1:1, verify demo container width, padding, radius, and density behavior against this report.

