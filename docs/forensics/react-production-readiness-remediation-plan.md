# React Production Readiness Remediation Plan

Date: 2026-08-15

Scope: production readiness for 61 direct public React component exports.

Source artifacts:

- `docs/forensics/react-production-readiness-inventory.md`
- `docs/forensics/react-production-readiness-contract.md`
- `docs/forensics/react-production-readiness-gap-matrix.md`

## Goal

Move direct React components from `partial` to an evidence-backed status:

- `ready`
- `partial`
- `blocked`

The goal is not FlowDocs remediation, patterns, or templates. Those are downstream. Visual parity is evidence only when tied to the canonical React runtime demo for a component.

## Current Baseline

| Status | Count |
| --- | ---: |
| `ready` | 12 |
| `partial` | 49 |
| `blocked` | 0 |
| `unknown` | 0 |
| `retired/composed` | 2 |

Main blockers to certification:

- Remaining partial components need per-component production-readiness rows.
- Remaining partial families need executable user-event/axe evidence.
- Remaining P0 components need explicit keyboard/a11y/runtime proof.
- The first closure batch is no longer blocked by monolithic-only evidence.
- Retired/composed surfaces must stay out of public component exports.

## Execution Principles

1. Do not mark a component `ready` because it renders.
2. Do not use visual parity as production-readiness evidence.
3. Do not use FlowDocs demos as evidence.
4. Do not fix components randomly; every change must close a named gap.
5. One remediation batch must end with a generated matrix update.
6. If a component fails, mark it `blocked` with evidence instead of hiding it under `partial`.

## Iteration Plan

Estimated remaining analysis-to-certification work: 7 iterations.

This estimate covers certification and targeted test/audit remediation. It does not guarantee deep implementation fixes for every blocked component; discovered blockers may add iterations.

### Iteration 1: Production Readiness Harness

Status: complete.

Objective: create the durable readiness report/gate shape.

Deliverables:

- `react-production-readiness-report` generated from public exports.
- Per-component row with family, priority, evidence, gaps, and status.
- Status rules implemented as data, not prose.
- Report starts with current state: likely all `partial`.

Done when:

- Report can be regenerated.
- No component remains outside the matrix.
- Report is not mixed with visual parity.

### Iteration 2: Test Harness Upgrade Decision

Status: complete.

Objective: decide and wire realistic interaction/a11y tooling.

Deliverables:

- Decision on `@testing-library/user-event`.
- Decision on `axe-core` or `jest-axe`.
- If accepted, package/test setup updated.
- If rejected, documented equivalent with reasons.

Done when:

- We know whether production readiness includes automated axe checks.
- The choice is reflected in tests/gates, not only docs.

### Iteration 3: P0 Forms Batch 1

Status: closed for current P0 review. Test/a11y evidence and reviewed package React runtime demos are complete for `input`, `checkbox`, `radio-button`, `switch`, `text-area`, and `slider`. `text-area` was closed with the shell/counter layout contract in `5356e806`; `slider` was closed with hover/pressed momentum in `b1029bf4`.

Components:

- `input`
- `text-area`
- `checkbox`
- `radio-button`
- `switch`
- `slider`

Gaps:

- `family-specific-keyboard-a11y`
- `controlled-uncontrolled-proof`
- readiness rows

Minimum evidence:

- label/role queries,
- controlled/uncontrolled behavior,
- disabled/readOnly behavior where applicable,
- keyboard behavior,
- value/checked callback payload.

### Iteration 4: P0 Forms Batch 2

Status: test/a11y evidence complete for `select`, `combobox`, `country-selector`, `date-picker`, and `date-range-picker`. `select` and `combobox` also have reviewed runtime demos. `country-selector`, `date-picker`, and `date-range-picker` still need runtime demo review before `ready`.

Components:

- `select`
- `combobox`
- `country-selector`
- `date-picker`
- `date-range-picker`

Gaps:

- keyboard navigation,
- open/close behavior,
- selected value behavior,
- controlled/uncontrolled proof,
- a11y relationships.

Minimum evidence:

- open by keyboard/pointer,
- choose option/date,
- Escape/blur behavior where applicable,
- controlled rerender,
- role/name assertions.

### Iteration 5: P0 Forms Batch 3

Status: in progress. `code-input` is closed for current review in `dffa7131` with governed frame geometry, mono/light numerals, visible success momentum, and error shake feedback. `phone-input` is closed for current review in `eee430dc` with governed CountrySelector composition, local Input search, keyboard/value behavior proof, dark-mode and density/frame validation. The active cursor is `input-amount`; card-specific payment inputs follow after amount formatting/parsing has the same runtime demo and contract coverage.

Components:

- `phone-input`
- `code-input`
- plus payment-style P2 forms if the harness is stable:
  - `input-amount`
  - `card-number-input`
  - `card-expiry-input`
  - `card-security-code-input`

Gaps:

- formatting/parsing,
- canonical values,
- invalid/partial input,
- keyboard/paste where applicable.

Minimum evidence:

- canonical callback value,
- visible formatted value,
- invalid input behavior,
- controlled rerender.

### Iteration 6: P0 Overlays

Components:

- `dialog`
- `drawer`
- `popover`
- `menu`

Gaps:

- `focus-escape-outside-click`
- `family-specific-keyboard-a11y`

Minimum evidence:

- open/close,
- Escape,
- outside click where applicable,
- focus behavior or explicit non-trap decision,
- return focus where applicable,
- role/name and aria-expanded/controls/haspopup.

Status: test/a11y evidence complete for `menu`, `dialog`, `drawer`, and `popover`. `menu` has reviewed runtime demo. `dialog`, `drawer`, and `popover` still need runtime demo review before `ready`.

### Iteration 7: P0 Navigation

Components:

- `tabs`

Plus high-risk P1 navigation if harness is ready:

- `accordion`
- `segmented-control`
- `tree-view`
- `pagination`

Gaps:

- keyboard navigation,
- controlled/uncontrolled proof,
- selected/current/expanded semantics.

Minimum evidence:

- arrow/Home/End where applicable,
- activation callback,
- controlled rerender,
- disabled item behavior.

Status: complete for `tabs`; remaining P1 navigation components are still partial.

### Iteration 8: P1 Actions

Components:

- `button`
- `icon-button`
- `floating-action-button`

Gaps:

- disabled/loading callback proof,
- retired/composed governance for duplicate action surfaces.

Minimum evidence:

- click callback,
- disabled/loading prevention,
- icon-only accessible name,
- keyboard activation where applicable,
- clipboard affordance decision for `button`/`icon-button` usage.

Status: complete for `button`, `icon-button`, and `floating-action-button`. `quick-action` is retired/composed, not a public component.

### Iteration 9: P1 Data/Display And Remaining Navigation

Components:

- `card`
- `card-summary`
- `table`
- `list`
- `breadcrumbs`
- `stepper`

Gaps:

- data/state/event proof,
- keyboard navigation proof where applicable.

Minimum evidence:

- interactive callback and keyboard path,
- invalid data/key protection,
- current/selected/expanded state semantics.

Status: complete for `card`. Test/a11y evidence exists for `table` and `list`, but they still need runtime demo review. `card-summary`, `breadcrumbs`, and `stepper` remain partial.

### Iteration 10: Display/Status

Components:

- `avatar`
- `badge`
- `tag`
- `chip`
- `skeleton`
- `spinner`
- `progress-indicator`
- `empty-state`
- `error-panel`
- `inline-validation`
- `motion-boundary`
- `animated-moment`
- `code-block`

Gaps:

- informative/decorative accessibility proof,
- missing test evidence for `code-block`,
- thin evidence for `progress-indicator`.

Minimum evidence:

- informative render,
- decorative render,
- live region/progress semantics where applicable,
- dismiss/remove callbacks where applicable.

### Iteration 11: Domain Specialized

Components:

- `audit-event`
- `biometric-prompt`
- `chat-composer`
- `chat-message`
- `chat-thread`
- `station-pin`
- `chart-panel`
- `kpi-tile`
- `movement-row`
- `route-summary`

Gaps:

- domain-state-event proof,
- loading/error/empty/recovery evidence.

Minimum evidence:

- primary domain action,
- domain payload,
- recovery/loading/error state,
- accessible role/name.

### Iteration 12: Certification Gate And Release Decision

Objective: decide what is ready and what remains blocked/partial.

Deliverables:

- Final readiness report.
- `ready/partial/blocked` counts.
- Component-level blocker list.
- CI/audit command integrated or prepared.
- Commit/push only after validation.

Done when:

- No direct component is `unknown`.
- Every non-ready component has a named missing gate or blocker.
- The final gate can be run without FlowDocs.

## Checkpoints

| Checkpoint | After iteration | Required evidence |
| --- | ---: | --- |
| Harness checkpoint | 2 | readiness report exists and tooling decision is made. |
| P0 forms checkpoint | 5 | all P0 forms have readiness rows and family tests or blockers. |
| P0 interaction checkpoint | 7 | overlays and tabs have keyboard/focus/open-close evidence or blockers. |
| Shared surface checkpoint | 9 | P1 actions/navigation/data have readiness rows. |
| Full surface checkpoint | 11 | all 61 direct public components have readiness rows. |
| Certification checkpoint | 12 | final counts and release decision exist. |

## Expected Outcome

Best case:

- P0 components move from `partial` to `ready`.
- P1/P2 components either move to `ready` or have precise remaining gaps.
- The project gains a real production-readiness gate.

Likely case:

- Some P0 overlays/forms become `blocked` because focus/keyboard/state behavior is not complete.
- That is acceptable if the blocker is explicit and actionable.

Failure case:

- We add more tests without updating the readiness matrix.
- We mark components ready based on render/string assertions only.
- We start visual parity work before P0 runtime/a11y behavior is certified.

## First Execution Step

Do not start with component fixes.

Start with Iteration 1: create the executable or generated readiness report that mirrors this matrix. The report must make it impossible to lose track of a component while remediating tests and implementation.
