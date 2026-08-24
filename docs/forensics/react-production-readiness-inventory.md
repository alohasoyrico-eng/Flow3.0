# React Production Readiness Inventory

Date: 2026-08-15

Scope: direct public React component exports only. Patterns and templates are intentionally out of scope for this inventory.

## Executive Finding

Flow React has a coherent public component surface, but it is not yet production-certified by evidence.

The current evidence supports these narrower claims:

- Public direct component exports exist in both package surfaces.
- Type and runtime build artifacts exist for every direct component export.
- Component contracts exist for every direct component except `surface`, which behaves as a React primitive rather than a component contract artifact.
- Existing tests cover broad render, ref, callback, and interaction signals, but they are not yet a production-readiness suite per component.

The current evidence does not yet support these stronger claims:

- Every component has validated keyboard behavior.
- Every accessibility-critical component has axe/user-event style coverage.
- Every component has family-specific functional tests.
- Every component has consumer-app runtime evidence beyond smoke/import gates.
- Every component can be marked production-ready.

## Surface Counts

| Metric | Count | Notes |
| --- | ---: | --- |
| Direct React component exports | 63 | Excludes `./react/patterns/*` and `./react/templates/*`. |
| Root package `./react/*` exports | 63 | No missing direct component exports found. |
| `packages/react` direct exports | 63 | No missing direct component exports found. |
| Component contracts | 62 | `surface` has no component contract. |
| Components with `.tsx` source | 63 | No missing direct component source found. |
| Components with dist `.js` and `.d.ts` | 63 | No missing direct component build artifact found. |
| Components with no test mention | 1 | `code-block`. |

## Family And Priority Summary

| Family | Count | Production risk |
| --- | ---: | --- |
| Forms | 17 | Highest: value/state, validation, keyboard, labels, controlled/uncontrolled. |
| Overlays/feedback | 6 | Highest: focus management, Escape, click outside, portal/layer, roles. |
| Navigation/disclosure | 7 | High: keyboard, selection, aria state, controlled/uncontrolled. |
| Actions | 5 | Medium/high: events, disabled/loading, accessible names. |
| Data/display | 8 | Medium: roles, empty/loading/error, sorting/selection, density. |
| Domain specialized | 8 | Medium: behavior varies by artifact. |
| Display/status | 12 | Lower functional risk, still needs a11y/tokens/states. |

| Priority | Count | Meaning |
| --- | ---: | --- |
| P0 | 18 | Blocks production confidence if not functionally verified. |
| P1 | 18 | Important shared system surface. |
| P2 | 27 | Lower interaction complexity or domain/display-specific. |

## P0 Components

| Component | Family | Existing test signal |
| --- | --- | --- |
| `checkbox` | forms | render + interaction + pattern interaction references |
| `code-input` | forms | render + interaction references |
| `combobox` | forms | render + interaction + pattern interaction references |
| `country-selector` | forms | render + interaction references |
| `date-picker` | forms | render + interaction references |
| `date-range-picker` | forms | render + interaction + pattern interaction references |
| `dialog` | overlays/feedback | render + contract render + interaction + ref references |
| `drawer` | overlays/feedback | render + contract render + interaction + ref + template interaction references |
| `input` | forms | render + interaction + pattern interaction references |
| `menu` | overlays/feedback | render + interaction + pattern interaction references |
| `phone-input` | forms | render + interaction references |
| `popover` | overlays/feedback | render + contract render + interaction references |
| `radio-button` | forms | render + interaction references |
| `select` | forms | render + interaction + pattern/template interaction references |
| `slider` | forms | render + interaction references |
| `switch` | forms | render + contract render + interaction + ref references |
| `tabs` | navigation/disclosure | render + interaction references |
| `text-area` | forms | render + interaction references |

Important: test signal means the component name appears in existing tests. It is not proof of complete production coverage.

## Weak Or Missing Test Signal

| Component | Priority | Family | Signal |
| --- | --- | --- | --- |
| `code-block` | P2 | display/status | No test mention found. |
| `floating-action-button` | P1 | actions | Only `button-render.test.mjs` mention found. |
| `progress-indicator` | P2 | display/status | Only `button-render.test.mjs` mention found. |

## Coverage Reality

Existing React tests:

- `button-render.test.mjs`
- `contract-render.test.mjs`
- `pattern-render.test.mjs`
- `pattern-interaction.test.mjs`
- `template-interaction.test.mjs`
- `interaction.test.mjs`
- `ref.test.mjs`

Observed strengths:

- Contract render test loops through component contracts.
- Ref test loops through component contracts and validates forwarded refs against platform roots.
- Interaction test has real Testing Library interaction coverage for many components.
- Render tests include many role/ARIA string assertions.

Observed gaps:

- Tests are mostly monolithic, not one clear readiness file per component or family.
- No `axe-core` or `jest-axe` dependency was found.
- Existing accessibility governance is signal/static-policy based, not a browser/user-event accessibility gate.
- Existing interaction governance checks callbacks and references; it does not prove keyboard completeness for every P0 component.
- `fireEvent` is used, but there is no clear `@testing-library/user-event` dependency for realistic keyboard/pointer flows.
- Production readiness status is not recorded per component as `ready`, `partial`, or `blocked`.

## Initial Readiness Classification

No component should be marked `ready` from this inventory alone.

Initial states:

- `partial`: all 63 direct component exports, because surface/source/dist evidence exists.
- `blocked`: none proven yet by this inventory.
- `unknown`: production readiness per component remains unknown until family-specific checks are applied.

This is intentionally conservative: API existence and broad tests are not equivalent to production certification.

## Next Required Analysis

Checkpoint B must define family-specific readiness contracts before remediation:

- Forms: label association, value/defaultValue, controlled/uncontrolled, disabled/readOnly, validation, error/help text, focus, keyboard, input events.
- Overlays: open/defaultOpen, Escape, outside click, focus trap or documented non-trap behavior, return focus, aria modal/expanded/controls, portal/layer behavior.
- Navigation/disclosure: arrow keys where applicable, selected/current state, aria roles, controlled/uncontrolled, activation events.
- Actions: accessible name, disabled/loading, event prevention, icon-only behavior, ref.
- Data/display: role semantics, empty/loading/error states, selection/sort/pagination events where applicable.
- Display/status: live regions, decorative vs informative modes, accessible names, token/density/theme behavior.

Only after that contract exists should execution start.
