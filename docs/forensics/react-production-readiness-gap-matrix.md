# React Production Readiness Gap Matrix

Date: 2026-08-15

Scope: 61 direct public React component exports. Patterns and templates are excluded. Retired/composed surfaces are tracked as governance decisions, not component readiness rows.

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

The first closure batch has production evidence and is no longer tracked as ambiguous `partial` debt.

This does not mean every component is broken. It means every component is missing at least one required piece of production evidence: family-specific behavior, keyboard/a11y proof, controlled/uncontrolled proof, or a per-component readiness row.

Current classification:

| Status | Count | Meaning |
| --- | ---: | --- |
| `ready` | 12 | Closure-batch components have contract, source/build, user-event/axe evidence, runtime demos, and systemic gates. |
| `partial` | 49 | Surface/build evidence exists, but production evidence is incomplete. |
| `blocked` | 0 | No blocker is proven by this matrix alone. |
| `unknown` | 0 | Every direct component has enough surface evidence to classify as `ready` or `partial`. |
| `retired/composed` | 2 | `copy-button` and `quick-action` are not public component exports. |

## Summary

| Metric | Count |
| --- | ---: |
| Direct React components | 61 |
| P0 components | 18 |
| P1 components | 17 |
| P2 components | 26 |
| Components missing component contract | 1 |
| Components with no test evidence mention | 1 |
| Components with thin test evidence | 2 |
| Components not ready yet | 49 |

Critical gaps:

- Remaining P0 forms outside the closure batch need explicit controlled/uncontrolled + keyboard/a11y proof.
- Remaining P0 overlays outside the closure batch need explicit focus + Escape + outside-click proof.
- Remaining navigation outside `tabs` needs keyboard navigation proof.
- Existing evidence is now mixed: closure-batch evidence is executable and family-specific; the remaining surface still needs the same treatment.
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
| `production-user-event-axe` | Covered by family-specific user-event tests with axe smoke coverage. |
| `runtime-demo-reviewed` | Covered by the canonical local React runtime demo reviewed during component QA. |
| `systemic-gates` | Covered by current flow core gates for retired surfaces, cascade overrides, namespace, frame/density/state/motion/accessibility policy, and package contracts. |

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

## Closure Batch Status

These components were already reviewed in the 1:1 component pass and are now classified without the ambiguous `partial` label.

| Component | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `button` | ready | component-contract, contract-render, ref-test, interaction-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Action states, loading/disabled prevention, keyboard activation, intents, sizing, and copy affordance ownership are covered. |
| `input` | ready | component-contract, interaction-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Controlled/uncontrolled behavior, validation states, loading vs disabled, helper/error/live semantics, density/frame, and dark/a11y checks are covered. |
| `select` | ready | component-contract, interaction-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Open/close, Escape, ArrowDown/ArrowUp, Enter selection, disabled option behavior, no false initial selection, listbox geometry, and controlled rerender are covered. |
| `combobox` | ready | component-contract, interaction-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Search input, clear affordance gating, ArrowDown/Enter, Escape revert, no false initial selection, selected check semantics, and controlled rerender are covered. |
| `checkbox` | ready | component-contract, interaction-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Checked/mixed states, disabled prevention, Space activation, icon scale, label alignment, and dark border visibility are covered. |
| `radio-button` | ready | component-contract, interaction-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Checked state, disabled prevention, Space activation, Material Symbols indicator policy, motion, and dark border visibility are covered. |
| `switch` | ready | component-contract, contract-render, ref-test, interaction-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Checked/controlled behavior, disabled prevention, geometry, thumb scale, and a11y role/name are covered. |
| `tabs` | ready | component-contract, interaction-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Disabled tab behavior, click activation, Arrow/Home/End navigation, controlled rerender, and a11y role/name are covered. |
| `menu` | ready | component-contract, interaction-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Open/close, Escape, outside click, Arrow/Home navigation, Enter selection, focus return, geometry, and trigger sizing are covered. |
| `icon-button` | ready | component-contract, interaction-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Variants/intents aligned with action contract, icon-only accessible name, loading/disabled prevention, selected state, and keyboard activation are covered. |
| `floating-action-button` | ready | component-contract, production-user-event-axe, runtime-demo-reviewed, systemic-gates | Primary/extended behavior, loading prevention, danger intent, unsupported variant fallback, geometry, and keyboard activation are covered. |
| `card` | ready | component-contract, interaction-signal, runtime-demo-reviewed, systemic-gates | Visual parity batch, card/surface/pattern ownership, semantic boundary, density/radius/spacing, and duplication governance are covered. |

Retired/composed decisions:

| Surface | Status | Owner |
| --- | --- | --- |
| `copy-button` | retired/composed | `button` / `icon-button` usage owns copy affordances. |
| `quick-action` | retired/composed | Action patterns compose `IconButton`; no standalone public component export. |

## Matrix

| Component | Priority | Family | Existing evidence | Missing evidence | Status |
| --- | --- | --- | --- | --- | --- |
| `checkbox` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `code-input` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe | runtime-demo-reviewed | partial |
| `combobox` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `country-selector` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe | runtime-demo-reviewed | partial |
| `date-picker` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe | runtime-demo-reviewed | partial |
| `date-range-picker` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe | runtime-demo-reviewed | partial |
| `input` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `phone-input` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe | runtime-demo-reviewed | partial |
| `radio-button` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `select` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `slider` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe | runtime-demo-reviewed | partial |
| `switch` | P0 | forms | public-export, source+dist+types, component-contract, contract-render, ref-test, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `text-area` | P0 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe | runtime-demo-reviewed | partial |
| `tabs` | P0 | navigation-disclosure | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `dialog` | P0 | overlays-feedback | public-export, source+dist+types, component-contract, contract-render, ref-test, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe | runtime-demo-reviewed | partial |
| `drawer` | P0 | overlays-feedback | public-export, source+dist+types, component-contract, contract-render, ref-test, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe | runtime-demo-reviewed | partial |
| `menu` | P0 | overlays-feedback | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `popover` | P0 | overlays-feedback | public-export, source+dist+types, component-contract, contract-render, interaction-signal, static-render-a11y-signal, production-user-event-axe | runtime-demo-reviewed | partial |
| `button` | P1 | actions | public-export, source+dist+types, component-contract, contract-render, ref-test, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `floating-action-button` | P1 | actions | public-export, source+dist+types, component-contract, static-render-a11y-signal, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `icon-button` | P1 | actions | public-export, source+dist+types, component-contract, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe, runtime-demo-reviewed, systemic-gates | none | ready |
| `card` | P1 | data-display | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, runtime-demo-reviewed, systemic-gates | none | ready |
| `card-summary` | P1 | data-display | public-export, source+dist+types, component-contract, static-render-a11y-signal | state-data-event-proof, per-component-readiness-row | partial |
| `list` | P1 | data-display | public-export, source+dist+types, component-contract, ref-test, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe | runtime-demo-reviewed | partial |
| `table` | P1 | data-display | public-export, source+dist+types, component-contract, contract-render, interaction-signal, static-render-a11y-signal, indirect-pattern-interaction, production-user-event-axe | runtime-demo-reviewed | partial |
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
| `card-expiry-input` | P2 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe | runtime-demo-reviewed | partial |
| `card-number-input` | P2 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe | runtime-demo-reviewed | partial |
| `card-security-code-input` | P2 | forms | public-export, source+dist+types, component-contract, interaction-signal, static-render-a11y-signal, production-user-event-axe | runtime-demo-reviewed | partial |
| `input-amount` | P2 | forms | public-export, source+dist+types, component-contract, interaction-signal | controlled-uncontrolled-proof, per-component-readiness-row | partial |

## Remediation Implications

Execution should not start by fixing random components. The next implementation plan must address evidence gaps in this order:

1. Keep the production-readiness harness as the single evidence path; do not create parallel docs-only audits.
2. Continue family-specific tests for remaining forms, overlays, and navigation.
3. Decide whether `surface` needs a component contract or should be explicitly governed as a primitive export.
4. Add missing test evidence for `code-block`.
5. Strengthen thin evidence component: `progress-indicator`.
6. Convert the matrix into an executable gate only after the criteria are agreed.
