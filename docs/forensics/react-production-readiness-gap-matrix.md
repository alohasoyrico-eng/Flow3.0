# React Production Readiness Gap Matrix

Date: 2026-08-15

Scope: 63 direct public React component exports. Patterns and templates are excluded.

Inputs:

- `docs/forensics/react-production-readiness-inventory.md`
- `docs/forensics/react-production-readiness-contract.md`
- Root package exports
- `packages/react/package.json` exports
- `packages/react/src`
- `packages/react/dist`
- `packages/content/content/component-contracts/components`
- `packages/react/test`

## Executive Finding

No direct React component is production-ready by the contract yet.

This does not mean every component is broken. It means every component is missing at least one required piece of production evidence: family-specific behavior, keyboard/a11y proof, controlled/uncontrolled proof, or a per-component readiness row.

Current classification:

| Status | Count | Meaning |
| --- | ---: | --- |
| `ready` | 0 | No component has complete evidence yet. |
| `partial` | 63 | Surface/build evidence exists, but production evidence is incomplete. |
| `blocked` | 0 | No blocker is proven by this matrix alone. |
| `unknown` | 0 | Every direct component has enough surface evidence to classify as `partial`. |

## Summary

| Metric | Count |
| --- | ---: |
| Direct React components | 63 |
| P0 components | 18 |
| P1 components | 18 |
| P2 components | 27 |
| Components missing component contract | 1 |
| Components with no test evidence mention | 1 |
| Components with thin test evidence | 3 |
| Components needing family-specific proof | 63 |

Critical gaps:

- P0 forms do not yet have explicit, per-component controlled/uncontrolled + keyboard/a11y proof.
- P0 overlays do not yet have explicit, per-component focus + Escape + outside-click proof.
- P0 navigation does not yet have explicit keyboard navigation proof.
- Existing evidence is mostly broad/monolithic; it is useful, but not sufficient for production certification.
- `surface` is exported as React but has no component contract.
- `code-block` has no current test mention.

## Evidence Labels

| Label | Meaning |
| --- | --- |
| `public-export` | Present in both public package export surfaces. |
| `source+dist+types` | `.tsx`, dist `.js`, and dist `.d.ts` exist. |
| `component-contract` | Component contract markdown exists. |
| `contract-render` | Referenced by contract render test. |
| `ref-test` | Referenced by ref forwarding test. |
| `interaction-signal` | Referenced by React interaction test. |
| `static-render-a11y-signal` | Referenced by static render/ARIA assertions. |
| `indirect-pattern-interaction` | Referenced by pattern/template interaction tests. |

## Gap Labels

| Label | Meaning |
| --- | --- |
| `contract` | Missing component contract or requires ownership decision. |
| `test-evidence` | No current React test mention. |
| `thin-test-evidence` | Only one current test mention. |
| `family-specific-keyboard-a11y` | P0 needs explicit family keyboard/a11y proof. |
| `controlled-uncontrolled-proof` | State model must be proven or explicitly declared unsupported. |
| `focus-escape-outside-click` | Overlay must prove focus, Escape, and outside-click behavior where applicable. |
| `keyboard-navigation-proof` | Navigation/disclosure must prove keyboard model. |
| `disabled-loading-callback-proof` | Action must prove disabled/loading callback semantics. |
| `state-data-event-proof` | Data/display behavior must prove state/data/event semantics. |
| `informative-decorative-a11y-proof` | Display/status component must prove informative vs decorative accessibility behavior. |
| `domain-state-event-proof` | Domain component must prove domain states/events. |
| `per-component-readiness-row` | Component needs a durable readiness row in the final report/gate. |

## Matrix

| Component | Priority | Family | Existing evidence | Missing evidence | Status |
| --- | --- | --- | --- | --- | --- |
| `checkbox` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `code-input` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `combobox` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `country-selector` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `date-picker` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `date-range-picker` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `input` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `phone-input` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `radio-button` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `select` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `slider` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `switch` | P0 | forms | public-export, source+dist+types, component-contract, contract-render, ref-test, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `text-area` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | family-specific-keyboard-a11y, controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `tabs` | P0 | navigation-disclosure | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | family-specific-keyboard-a11y, keyboard-navigation-proof, per-component-readiness-row | partial |
| `dialog` | P0 | overlays-feedback | public-export, source+dist+types, component-contract, contract-render, ref-test, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | family-specific-keyboard-a11y, focus-escape-outside-click, per-component-readiness-row | partial |
| `drawer` | P0 | overlays-feedback | public-export, source+dist+types, component-contract, contract-render, ref-test, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | family-specific-keyboard-a11y, focus-escape-outside-click, per-component-readiness-row | partial |
| `menu` | P0 | overlays-feedback | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | family-specific-keyboard-a11y, focus-escape-outside-click, per-component-readiness-row | partial |
| `popover` | P0 | overlays-feedback | public-export, source+dist+types, component-contract, contract-render, interaction-signal, static-render-a11y-signal | family-specific-keyboard-a11y, focus-escape-outside-click, per-component-readiness-row | partial |
| `button` | P1 | actions | public-export, source+dist+types, component-contract, contract-render, ref-test, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | disabled-loading-callback-proof, per-component-readiness-row | partial |
| `floating-action-button` | P1 | actions | public-export, source+dist+types, component-contract, static-render-a11y-signal | thin-test-evidence, disabled-loading-callback-proof, per-component-readiness-row | partial |
| `icon-button` | P1 | actions | public-export, source+dist+types, component-contract, static-render-a11y-signal, indirect-pattern-interaction | disabled-loading-callback-proof, per-component-readiness-row | partial |
| `quick-action` | P1 | actions | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | disabled-loading-callback-proof, per-component-readiness-row | partial |
| `card` | P1 | data-display | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | state-data-event-proof, per-component-readiness-row | partial |
| `card-summary` | P1 | data-display | public-export, source+dist+types, component-contract, static-render-a11y-signal | state-data-event-proof, per-component-readiness-row | partial |
| `list` | P1 | data-display | public-export, source+dist+types, component-contract, ref-test, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | state-data-event-proof, per-component-readiness-row | partial |
| `table` | P1 | data-display | public-export, source+dist+types, component-contract, contract-render, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | state-data-event-proof, per-component-readiness-row | partial |
| `inline-validation` | P1 | display-status | public-export, source+dist+types, component-contract, static-render-a11y-signal | informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `surface` | P1 | display-status | public-export, source+dist+types, contract-render, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | contract, informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `accordion` | P1 | navigation-disclosure | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | keyboard-navigation-proof, per-component-readiness-row | partial |
| `breadcrumbs` | P1 | navigation-disclosure | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | keyboard-navigation-proof, per-component-readiness-row | partial |
| `pagination` | P1 | navigation-disclosure | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | keyboard-navigation-proof, per-component-readiness-row | partial |
| `segmented-control` | P1 | navigation-disclosure | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | keyboard-navigation-proof, per-component-readiness-row | partial |
| `stepper` | P1 | navigation-disclosure | public-export, source+dist+types, component-contract, static-render-a11y-signal | keyboard-navigation-proof, per-component-readiness-row | partial |
| `tree-view` | P1 | navigation-disclosure | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | keyboard-navigation-proof, per-component-readiness-row | partial |
| `toast` | P1 | overlays-feedback | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | focus-escape-outside-click, per-component-readiness-row | partial |
| `tooltip` | P1 | overlays-feedback | public-export, source+dist+types, component-contract, contract-render, interaction-signal, static-render-a11y-signal | focus-escape-outside-click, per-component-readiness-row | partial |
| `copy-button` | P2 | actions | public-export, source+dist+types, component-contract, interaction-signal | thin-test-evidence, disabled-loading-callback-proof, per-component-readiness-row | partial |
| `chart-panel` | P2 | data-display | public-export, source+dist+types, component-contract, static-render-a11y-signal | state-data-event-proof, per-component-readiness-row | partial |
| `kpi-tile` | P2 | data-display | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | state-data-event-proof, per-component-readiness-row | partial |
| `movement-row` | P2 | data-display | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | state-data-event-proof, per-component-readiness-row | partial |
| `route-summary` | P2 | data-display | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | state-data-event-proof, per-component-readiness-row | partial |
| `avatar` | P2 | display-status | public-export, source+dist+types, component-contract, static-render-a11y-signal, indirect-pattern-interaction | informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `badge` | P2 | display-status | public-export, source+dist+types, component-contract, static-render-a11y-signal, indirect-pattern-interaction | informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `chip` | P2 | display-status | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction | informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `code-block` | P2 | display-status | public-export, source+dist+types, component-contract | test-evidence, informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `empty-state` | P2 | display-status | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `error-panel` | P2 | display-status | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `progress-indicator` | P2 | display-status | public-export, source+dist+types, component-contract, static-render-a11y-signal | thin-test-evidence, informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `skeleton` | P2 | display-status | public-export, source+dist+types, component-contract, static-render-a11y-signal | informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `spinner` | P2 | display-status | public-export, source+dist+types, component-contract, static-render-a11y-signal | informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `tag` | P2 | display-status | public-export, source+dist+types, component-contract, contract-render, ref-test, static-render-a11y-signal | informative-decorative-a11y-proof, per-component-readiness-row | partial |
| `animated-moment` | P2 | domain-specialized | public-export, source+dist+types, component-contract, static-render-a11y-signal | domain-state-event-proof, per-component-readiness-row | partial |
| `audit-event` | P2 | domain-specialized | public-export, source+dist+types, component-contract, static-render-a11y-signal, indirect-pattern-interaction | domain-state-event-proof, per-component-readiness-row | partial |
| `biometric-prompt` | P2 | domain-specialized | public-export, source+dist+types, component-contract, static-render-a11y-signal | domain-state-event-proof, per-component-readiness-row | partial |
| `chat-composer` | P2 | domain-specialized | public-export, source+dist+types, component-contract, interaction-signal | domain-state-event-proof, per-component-readiness-row | partial |
| `chat-message` | P2 | domain-specialized | public-export, source+dist+types, component-contract, interaction-signal | domain-state-event-proof, per-component-readiness-row | partial |
| `chat-thread` | P2 | domain-specialized | public-export, source+dist+types, component-contract, interaction-signal | domain-state-event-proof, per-component-readiness-row | partial |
| `motion-boundary` | P2 | domain-specialized | public-export, source+dist+types, component-contract, static-render-a11y-signal | domain-state-event-proof, per-component-readiness-row | partial |
| `station-pin` | P2 | domain-specialized | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | domain-state-event-proof, per-component-readiness-row | partial |
| `card-expiry-input` | P2 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `card-number-input` | P2 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `card-security-code-input` | P2 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal | controlled-uncontrolled-proof, per-component-readiness-row | partial |
| `input-amount` | P2 | forms | public-export, source+dist+types, component-contract, interaction-signal | controlled-uncontrolled-proof, per-component-readiness-row | partial |

## Remediation Implications

Execution should not start by fixing random components. The next implementation plan must address evidence gaps in this order:

1. Build or formalize a production-readiness harness that can record per-component rows.
2. Add P0 family-specific tests for forms, overlays, and tabs/navigation.
3. Decide whether `surface` needs a component contract or should be explicitly governed as a primitive export.
4. Add missing test evidence for `code-block`.
5. Strengthen thin evidence components: `floating-action-button`, `copy-button`, `progress-indicator`.
6. Convert the matrix into an executable gate only after the criteria are agreed.
