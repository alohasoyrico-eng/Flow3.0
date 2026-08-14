# Typography Primitive Cascade Audit

Status: **pass**

Typography converts Voice, Tone, Frame, and Accessibility into implementation-ready text roles so components never choose raw font values or bypass Edenred/Ubuntu role ownership.

## Foundation Gate

- voice: pass; gaps 0
- tone: pass; gaps 0
- frame: pass; gaps 0
- accessibility: pass; gaps 0

## Primitive Gate

- breakpoints: pass; gaps 0
- density: pass; gaps 0
- spacing: pass; gaps 0

## Token Aliases

| Alias | Expected | Actual |
| --- | --- | --- |
| --sys-font-body | `var(--sys-voice-family-body)` | `var(--sys-voice-family-body)` |
| --sys-font-title | `var(--sys-voice-family-title)` | `var(--sys-voice-family-title)` |
| --sys-font-icon | `var(--sys-icon-family)` | `var(--sys-icon-family)` |
| --sys-voice-family-body | `var(--ref-voice-family-sans)` | `var(--ref-voice-family-sans)` |
| --sys-voice-family-title | `var(--ref-voice-family-brand)` | `var(--ref-voice-family-brand)` |
| --sys-voice-numeral-lg-size | `var(--ref-voice-size-9)` | `var(--ref-voice-size-9)` |

## Component Bridge

| Alias | Actual |
| --- | --- |
| --component-font-size-micro | `var(--sys-voice-overline-size)` |
| --component-font-size-caption | `var(--sys-voice-caption-size)` |
| --component-font-size-small | `var(--sys-voice-size-4)` |
| --component-font-size-label | `var(--sys-voice-label-md-size)` |
| --component-font-size-body-sm | `var(--sys-voice-paragraph-sm-size)` |
| --component-font-size-body | `var(--sys-voice-paragraph-sm-size)` |
| --component-font-size-body-md | `var(--sys-voice-paragraph-md-size)` |
| --component-font-size-body-lg | `var(--sys-voice-paragraph-lg-size)` |
| --component-font-size-title-xs | `var(--sys-voice-label-sm-size)` |
| --component-font-size-title-sm | `var(--sys-voice-heading-sm-size)` |
| --component-font-size-title-md | `var(--sys-voice-heading-md-size)` |
| --component-font-size-title-lg | `var(--sys-voice-heading-lg-size)` |
| --component-font-size-data-lg | `var(--sys-voice-numeral-lg-size)` |
| --component-font-size-display-sm | `var(--sys-voice-display-sm-size)` |
| --component-font-size-display-md | `var(--sys-voice-display-sm-size)` |
| --component-font-family-mono | `var(--sys-voice-family-mono)` |
| --component-line-height-snug | `var(--sys-voice-line-height-tight)` |
| --component-letter-spacing-expanded | `var(--sys-voice-letter-spacing-expanded)` |
| --component-letter-spacing-normal | `var(--sys-voice-letter-spacing-normal)` |
| --component-letter-spacing-wide | `var(--sys-voice-letter-spacing-wide)` |
| --component-letter-spacing-widest | `var(--sys-voice-letter-spacing-widest)` |

- Undefined component Typography alias uses: 0
- Component ref-voice bypasses: 0
- Raw package Typography declarations: 0
- Component Typography alias uses: 547

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Component refs | 62 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 72 | account-operations, action-sheet, advanced-filters, agent-conversation, artifact-metadata-bar, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bottom-sheet, bulk-actions, calendar-view, case-management, chart-legend-item, chart-wrapper, checkbox-group, column-configurator... |
| Template refs | 17 | agent-workspace, component-detail-template, configuration-console, docs-artifact-detail-template, docs-collection-template, docs-home-template, docs-shell-template, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, pattern-detail-template, reference-detail-template, routes-and-stations, settings-workspace, template-detail-template |

## Docs Signal

- Docs Typography alias uses: 0
- Docs direct ref-voice consumer uses tracked: 0

## Gaps

- No fail-level Typography primitive cascade gaps detected.

## Next Actions

- Fix fail-level Typography alias, foundation gate, undefined alias, or raw component typography gaps before moving to Spacing.
- Keep Edenred Black/Ubuntu ownership in Voice; Typography only maps roles and bridges implementation.
- Use ZIP text details as role/density evidence, never as permission to mutate Flow font foundations.

