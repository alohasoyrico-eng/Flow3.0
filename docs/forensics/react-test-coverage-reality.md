# React Test Coverage Reality

Date: 2026-08-15

Scope: existing `packages/react/test/*.mjs` coverage for direct React components.

Related artifacts:

- `docs/forensics/react-production-readiness-inventory.md`
- `docs/forensics/react-production-readiness-contract.md`
- `docs/forensics/react-production-readiness-gap-matrix.md`
- `docs/forensics/react-production-readiness-remediation-plan.md`

## Executive Finding

React has meaningful test coverage, but the coverage is not yet shaped as a production-readiness system.

The strongest current test file is `interaction.test.mjs`: it uses Testing Library, role/label queries, controlled rerenders, keyboard events, focus events, and callback assertions across many components.

The weakest part is not absence of all tests. The weakness is that production readiness is not tracked per component/family, and there is no automated accessibility engine or realistic user-event layer.

## Test File Inventory

| Test file | Lines | Primary style | Production-readiness value | Limit |
| --- | ---: | --- | --- | --- |
| `button-render.test.mjs` | 2957 | static render string assertions | broad static markup, role/aria/class/data evidence | not real interaction |
| `contract-render.test.mjs` | 127 | contract loop + static render | verifies all component contracts render and block unsafe prop leakage | not family behavior |
| `interaction.test.mjs` | 2765 | Testing Library + `fireEvent` | strongest component interaction evidence | monolithic, no user-event/axe |
| `pattern-interaction.test.mjs` | 1903 | Testing Library + `fireEvent` | indirect evidence through patterns | not direct component certification |
| `pattern-render.test.mjs` | 3587 | static render string assertions | pattern composition evidence | out of direct component scope |
| `ref.test.mjs` | 144 | contract loop + refs | verifies ref forwarding against platform roots | not behavior/a11y |
| `template-interaction.test.mjs` | 299 | Testing Library + `fireEvent` | template interaction evidence | out of direct component scope |

Total React test lines scanned: 11782.

## Signal Counts

| Test file | Static render | TL render | fireEvent | getByRole | getByLabelText | keyDown | Escape | Arrow | focus calls | user-event | axe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `button-render.test.mjs` | 259 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `contract-render.test.mjs` | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `interaction.test.mjs` | 0 | 78 | 173 | 70 | 14 | 19 | 12 | 18 | 7 | 0 | 0 |
| `pattern-interaction.test.mjs` | 0 | 78 | 271 | 238 | 10 | 0 | 0 | 0 | 1 | 0 | 0 |
| `pattern-render.test.mjs` | 214 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `ref.test.mjs` | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `template-interaction.test.mjs` | 0 | 4 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## What Is Real Coverage

The following should be credited:

- `interaction.test.mjs` includes real Testing Library render paths.
- It includes role and label queries for many direct components.
- It includes controlled rerender tests for several stateful components.
- It includes keyboard assertions for several high-risk components.
- It includes focus/Escape behavior for at least some overlays/tooltips/selects.
- `ref.test.mjs` provides broad ref forwarding evidence.
- `contract-render.test.mjs` provides broad unsafe prop leakage evidence.

## What Is Not Yet Production-Ready Coverage

The following should not be overstated:

- `button-render.test.mjs` is large, but it is static markup coverage.
- Static `aria-*` assertions do not prove screen-reader interaction or keyboard behavior.
- `pattern-interaction.test.mjs` is useful, but it is indirect component evidence.
- There is no `@testing-library/user-event` usage.
- There is no `axe-core`/`jest-axe` usage.
- There is no per-component readiness report generated from test outcomes.
- There is no family-specific pass/fail gate for forms, overlays, navigation, actions, display/status, data/display, and domain components.

## Coverage Risk

| Risk | Severity | Explanation |
| --- | --- | --- |
| Monolithic tests hide per-component gaps | High | A component can appear in `interaction.test.mjs` without satisfying its full family contract. |
| No automated axe layer | High | Static ARIA checks can miss structural accessibility failures. |
| No user-event layer | Medium/high | `fireEvent` can skip realistic browser/user behavior. |
| Indirect pattern evidence counted as component evidence | Medium | Pattern use proves composition, not component production readiness. |
| Static render evidence overcounted | Medium | Markup assertions are useful but insufficient for interactive components. |
| No readiness status output | High | There is no durable `ready/partial/blocked` result per component. |

## Component Certification Consequence

Existing tests justify `partial`, not `ready`.

The right next implementation is not to rewrite everything. The right next implementation is to add a production-readiness harness that:

- reads the direct public component surface,
- reads family contracts,
- records evidence per component,
- marks status using explicit rules,
- fails when P0 components lack required family evidence,
- reports blockers instead of hiding them.

## Tooling Decision Needed

Before implementing production-readiness tests, decide:

1. Add `@testing-library/user-event`: recommended for realistic keyboard/pointer flows.
2. Add `axe-core` or `jest-axe`: recommended for automated accessibility checks.
3. Keep `fireEvent` only for low-level event edge cases.
4. Keep static render tests, but downgrade them to structural evidence, not production readiness.

Recommended decision:

- Add `@testing-library/user-event`.
- Add `axe-core` or `jest-axe`.
- Create per-family test files instead of continuing to expand the monolith.

## Next Step

Proceed to implementation only with Iteration 1 of the remediation plan:

`Production Readiness Harness`

That implementation should create the generated report first, before adding new behavioral tests. Otherwise the project will keep accumulating tests without a reliable answer to which components are actually production-ready.
