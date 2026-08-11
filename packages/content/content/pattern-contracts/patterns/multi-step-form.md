# Multi Step Form

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/multi-step-form/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/multi-step-form.json`

## Purpose

Guide users through a multi-step task with step ownership, validation timing, persistence, review, submission, and recovery.

## Use When

- A task has three or more meaningful groups or dependent decisions.
- Users must complete steps in a sequence and review before final submission.
- The product needs abandonment, save-and-resume, analytics, or step-level validation.

## Do Not Use Without Review

- The task fits in one clear form section.
- There are more than five steps without a strong product reason.
- Validation, persistence, review, back behavior, or submission ownership is unclear.
- The pattern uses Stepper as decoration while hiding actual form state.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines step layout, form width, footer actions, and responsive stacking. |
| Voice | Owns step titles, helper text, validation copy, summary labels, and final confirmation copy. |
| Energy | Controls current step, completed step, error step, primary action, and summary emphasis. |
| Momentum | Step changes use system motion and reduced-motion alternatives. |
| State | Current, completed, invalid, blocked, saving, submitting, success, and abandoned states are explicit. |
| Accessibility | Uses aria-current=step, role alert for errors, focus management, and keyboard-safe navigation. |

## Formal Purpose

Coordinate sequenced form progress with validation, navigation, save/submit, recovery, and Form Section boundaries.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `not-started`
- `active`
- `dirty`
- `validating`
- `invalid`
- `saving`
- `complete`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Energy`
- `Frame`
- `Momentum`
- `State`
- `Voice`

### Foundation Dependencies

- `Accessibility`
- `Depth`
- `Energy`
- `Frame`
- `Growth`
- `Iconography`
- `Momentum`
- `State`
- `Symbol`
- `Tone`
- `Voice`

### Primitives

- `Breakpoints`
- `Color`
- `Density`
- `Disabled`
- `Duration`
- `Elevation`
- `Field Action`
- `Focus`
- `Iconography`
- `Loading`
- `Measurement`
- `Message`
- `Motion Curves`
- `Radius`
- `Spacing`
- `Surface`
- `Typography`

### Components

- `Button`
- `Card`
- `Inline Validation`
- `Input`
- `Select`
- `Stepper`
- `Toast`

### Patterns

- `Form Section`

### Tokens

- `comp.button.*`
- `comp.card.*`
- `comp.inline-validation.*`
- `comp.input.*`
- `comp.select.*`
- `comp.stepper.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `progress` | `component` | `Stepper` |
| `content` | `primitive` | `Surface` |
| `stepSummary` | `component` | `Card` |
| `actions` | `component` | `Button`, `Toast` |
| `fields` | `component` | `Input`, `Select`, `Inline Validation` |
| `formBoundary` | `pattern` | `Form Section` |

## Formal Governance

### Entry Conditions

- A form needs ordered steps, progress, validation, and navigation.
- Users may save, resume, submit, or recover from errors.
- Field grouping belongs to Form Section.

### Decision Tree

- Use Form Section for one grouped set of fields.
- Use Multi Step Form when step order and progress are core behavior.
- Use template flows for domain-specific onboarding copy and business logic.

### Failure Modes

- Steps are visual-only.
- Fields bypass Flow inputs.
- Form Section behavior is duplicated.
- Progress and validation state are disconnected.

### Success Metrics

- Users know current step, completion, errors, and next action.
- Keyboard users can navigate steps and fields predictably.
- Step structure is reusable without business flow ownership.

### Accessibility

- Expose current step and progress in text.
- Tie errors to fields and steps.
- Prevent focus loss on step changes.

### Tests

- Composes Stepper, Card, Input, Select, Inline Validation, Button, and Toast.
- Covers active, dirty, validating, invalid, saving, complete, and disabled states.
- Keeps Form Section as field-group boundary.

### Agent Instructions

- Keep domain workflow and copy outside the pattern.
- Use Form Section for reusable field groups.
- Ask before submitting identity, payment, or compliance data.

### Reject If

- Step progress is decorative only.
- Form Section is cloned.
- Fields bypass Flow components.
- Errors are not step-associated.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| steps | StepDefinition[] | yes | Ordered steps with id, title, required fields, and validation owner. |
| progress | Stepper \| ProgressIndicator | yes | Visible progress and current step. |
| content | Surface \| FormSection | yes | Current step content inside a Surface boundary using Design System fields and validation. |
| actions | Back \| Continue \| Save \| Submit | yes | Action set changes by step state. |
| review | SummaryStep | conditional | Required before final submission when data has operational consequence. |
| persistence | DraftState | conditional | Required when abandonment/resume is allowed. |
| feedback | InlineValidation \| Toast \| ErrorPanel | yes | Step errors, save result, submit result, and recovery. |

## Components Used

- Stepper
- Button
- Input
- Select
- Inline Validation
- Card
- Toast

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| content | Surface | yes | Current step content inside a Surface boundary using Design System fields and validation. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Linear wizard | Current candidate | Back/continue with step validation and final review. |
| Save and resume | Candidate | Draft state survives exit and returns to pending step. |
| Mobile compact | Candidate | Stepper compresses while keeping current step and actions visible. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Step transition | Moves content after validation; reduced motion swaps instantly. |
| Error reveal | Error summary and field messages appear without disorienting the user. |
| Submit progress | Submission enters loading state and prevents duplicate submit. |

## Accessibility

- Current step is programmatically exposed.
- Validation errors move focus to the first actionable error or summary.
- Back does not lose entered data.
- Final submit is distinct from continue.
- A review step names the entities and consequences being submitted.

## Implementation Checklist

- Declare `steps`: Ordered steps with id, title, required fields, and validation owner.
- Declare `progress`: Visible progress and current step.
- Declare `content`: Current step content inside a Surface boundary using Design System fields and validation.
- Declare `actions`: Action set changes by step state.
- Declare `feedback`: Step errors, save result, submit result, and recovery.
- Continue validates only the current step.
- Back preserves data.
- Review step displays all submitted values and consequences.
- Submit prevents duplicate activation and reports success/error.
- Mobile layout keeps current step, primary action, and errors visible.
- Abandonment/resume behavior is explicit when required.

## Tests And Rejection Rules

Must test:

- Continue validates only the current step.
- Back preserves data.
- Review step displays all submitted values and consequences.
- Submit prevents duplicate activation and reports success/error.
- Mobile layout keeps current step, primary action, and errors visible.
- Abandonment/resume behavior is explicit when required.

Reject if:

- Stepper is only decorative.
- Back loses data.
- Submission happens before user review when consequences are meaningful.

## MIEL

Agents can decide:

- Use Multi Step Form when steps and validation owners are explicit.
- Choose linear or save-and-resume behavior when product policy is known.
- Require a review step for consequential submission.

Agents must ask:

- Step order, validation timing, persistence, review, analytics, or submit ownership is unclear.
- The system affects money, compliance, access, identity, or operational records.

Agents must reject:

- Stepper is only decorative.
- Back loses data.
- Submission happens before user review when consequences are meaningful.

Handoff language:

> Confirm step list, validation timing, persistence, review content, submit behavior, analytics, and recovery.
