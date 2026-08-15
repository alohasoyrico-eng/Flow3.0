# React Test Harness Decision

Date: 2026-08-15

Scope: Iteration 2 of React production-readiness remediation.

## Decision

Use `@testing-library/user-event` and `axe-core` for component production-readiness certification.

This is an explicit tooling decision:

- `user-event` is required for realistic keyboard and pointer paths.
- `axe-core` is required for automated structural accessibility checks.
- `fireEvent` remains allowed for low-level event edge cases and prevented-event assertions.
- `axe` color contrast checks are disabled in JSDOM because they depend on canvas support and are not reliable in this Node runner.

## Why This Is Needed

The existing React tests prove useful behavior, but they are mostly monolithic and rely on `fireEvent`.

That is not enough to certify:

- keyboard navigation flows,
- focus/open-close behavior,
- accessible names and roles,
- controlled and uncontrolled interaction paths,
- a11y regressions that are not visible in render output.

## Implemented Evidence

Added:

- `@testing-library/user-event`
- `axe-core`
- `packages/react/test/production-harness.test.mjs`

The harness test proves:

- React Testing Library can render Flow React components in JSDOM.
- `user-event` can click and keyboard-activate a component.
- `axe-core` can run against the rendered component tree.
- The harness is part of `npm run test:react`.

## Boundary

This iteration does not mark any component production-ready.

The harness only proves the test environment can support the next certification batches. Component readiness changes must happen in later iterations with per-component evidence.

## Next Use

Iteration 3 must use this harness for P0 forms batch 1:

- `input`
- `text-area`
- `checkbox`
- `radio-button`
- `switch`
- `slider`

Each component must either move toward `ready` with family-specific evidence or remain `partial`/`blocked` with an explicit blocker.
