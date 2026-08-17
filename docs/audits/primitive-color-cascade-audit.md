# Color Primitive Cascade Audit

Status: **pass**

Color converts Energy, State, Tone, and Accessibility into implementation-ready semantic aliases so components do not choose raw colors or mutate Flow color foundations for reference parity.

## Foundation Gate

- energy: pass
- state: pass
- tone: pass
- accessibility: pass
- Energy raw color failures: 0
- Energy color trace reviews: 0

## Primitive Gate

- charts: pass; gaps 0
- disabled: pass; gaps 0
- focus: pass; gaps 0
- iconography: pass; gaps 0
- maps: pass; gaps 0

## Token Aliases

| Alias | Expected | Actual |
| --- | --- | --- |
| --sys-color-surface | `var(--sys-energy-surface-primary)` | `var(--sys-energy-surface-primary)` |
| --sys-color-surface-raised | `var(--sys-energy-surface-secondary)` | `var(--sys-energy-surface-secondary)` |
| --sys-color-surface-muted | `var(--sys-energy-surface-sunken)` | `var(--sys-energy-surface-sunken)` |
| --sys-color-text | `var(--sys-energy-text-primary)` | `var(--sys-energy-text-primary)` |
| --sys-color-text-muted | `var(--sys-energy-text-secondary)` | `var(--sys-energy-text-secondary)` |
| --sys-color-text-subtle | `var(--sys-energy-text-tertiary)` | `var(--sys-energy-text-tertiary)` |
| --sys-color-border | `var(--sys-energy-border-default)` | `var(--sys-energy-border-default)` |
| --sys-color-border-strong | `var(--sys-energy-border-strong)` | `var(--sys-energy-border-strong)` |
| --sys-color-action | `var(--sys-energy-action-primary)` | `var(--sys-energy-action-primary)` |
| --sys-color-action-hover | `var(--sys-energy-action-hover)` | `var(--sys-energy-action-hover)` |
| --sys-color-action-text | `var(--sys-energy-text-on-action)` | `var(--sys-energy-text-on-action)` |
| --sys-color-focus | `var(--sys-energy-action-primary)` | `var(--sys-energy-action-primary)` |
| --sys-color-success | `var(--sys-energy-status-success)` | `var(--sys-energy-status-success)` |
| --sys-color-warning | `var(--sys-energy-status-warning)` | `var(--sys-energy-status-warning)` |
| --sys-color-danger | `var(--sys-energy-status-error)` | `var(--sys-energy-status-error)` |

## Coverage

| Layer | Count | Evidence |
| --- | ---: | --- |
| Component refs | 62 | accordion, animated-moment, audit-event, avatar, badge, biometric-prompt, breadcrumbs, button, card, card-expiry-input, card-number-input, card-security-code-input, card-summary, chart-panel, chat-composer, chat-message, chat-thread, checkbox... |
| Pattern refs | 72 | account-operations, action-sheet, advanced-filters, agent-conversation, artifact-metadata-bar, authentication-login-biometrics-and-otp, autocomplete, avatar-group, avatar-menu, backoffice-approval, bottom-sheet, bulk-actions, calendar-view, case-management, chart-legend-item, chart-wrapper, checkbox-group, column-configurator... |
| Template refs | 11 | agent-workspace, configuration-console, docs-shell-template, driver-card-wallet, driver-mobile-app, fleet-dashboard-suite, fleet-manager-desktop, internal-operations-console, reference-detail-template, routes-and-stations, settings-workspace |
| Component CSS alias uses | 2172 | packages/components/styles/components.css |
| Docs CSS alias uses | 0 | apps/docs/styles |

## Gaps

- No fail-level Color primitive cascade gaps detected.

## Direct Ref Energy Uses

- No direct ref-energy consumer use outside token/foundation reference layer.

## Next Actions

- Fix fail-level Color alias, foundation gate, or direct ref-energy consumer gaps before moving to Typography.
- Keep ZIP color influence as semantic mapping evidence; do not change Flow Energy tokens for visual mimicry.
- When auditing each component 1:1, verify rendered color through Color/Energy aliases and non-color state evidence.

