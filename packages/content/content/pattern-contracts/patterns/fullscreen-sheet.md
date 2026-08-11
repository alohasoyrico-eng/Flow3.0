# Fullscreen Sheet

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/fullscreen-sheet/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/fullscreen-sheet.json`

## Purpose

Run a focused mobile task in a near-fullscreen sheet while preserving route context, recovery, validation, and a clear close path.

## Use When

- A mobile system needs more than one short action but should not become a new page.
- Users need to edit or review contextual data without losing their place.
- The task needs step progress, validation, and submit feedback.

## Do Not Use Without Review

- The task is permanent navigation or a full screen destination.
- The sheet hides critical context needed to make the decision.
- Close, back, validation, or focus recovery rules are unclear.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines safe area, sheet edge, internal scrolling, action rail, and responsive density. |
| Voice | Owns title, helper copy, validation, close, back, and submit labels. |
| Energy | Controls action priority, focus, invalid, disabled, and success states. |
| Depth | Separates the sheet from the current route only when it leaves document system. |
| Momentum | Uses sheet reveal, step transition, and reduced-motion fallback. |
| Accessibility | Requires labelled surface, focus containment, Escape/back close, and restored focus. |

## Formal Purpose

Coordinate mobile full-screen task surfaces with step context, form fields, validation, action-sheet handoff, and dismiss recovery.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Touch-first |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `reduced motion` |

## Formal States

- `closed`
- `open`
- `dirty`
- `validating`
- `saving`
- `error`
- `dismiss-confirming`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
- `Energy`
- `Frame`
- `Momentum`
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
- `Card Summary`
- `Inline Validation`
- `Input`
- `Select`
- `Stepper`
- `Toast`

### Patterns

- `Action Sheet`

### Tokens

- `comp.button.*`
- `comp.card-summary.*`
- `comp.inline-validation.*`
- `comp.input.*`
- `comp.select.*`
- `comp.stepper.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `summary` | `component` | `Card Summary`, `Stepper` |
| `fields` | `component` | `Input`, `Select`, `Inline Validation` |
| `actions` | `component` | `Button`, `Toast` |
| `action-sheetBoundary` | `pattern` | `Action Sheet` |

## Formal Governance

### Entry Conditions

- A mobile task needs more space than a compact dialog or action sheet.
- The task can include fields, progress, validation, or unsaved changes.
- Secondary contextual actions may hand off to Action Sheet.

### Decision Tree

- Use Action Sheet for short contextual command lists.
- Use Fullscreen Sheet for focused mobile tasks.
- Use Multi Step Form when step navigation is the core cross-platform workflow.

### Failure Modes

- Fullscreen surface is custom overlay behavior.
- Action Sheet behavior is duplicated.
- Unsaved changes dismiss silently.
- Validation and progress are visual-only.

### Success Metrics

- Users can complete or dismiss the task predictably.
- Focus, escape/back, and reduced-motion behavior are governed.
- Secondary actions remain a boundary to Action Sheet.

### Accessibility

- Trap focus while open.
- Confirm or preserve dirty state on dismiss.
- Provide a non-gesture close path.

### Tests

- Composes Button, Card Summary, Stepper, Input, Select, Inline Validation, and Toast.
- Covers dirty, validating, saving, error, dismiss-confirming, and disabled states.
- Keeps Action Sheet as secondary-action boundary.

### Agent Instructions

- Do not implement raw fullscreen overlay mechanics.
- Keep product task schema outside the pattern.
- Ask before using for financial, identity, or compliance-critical submission.

### Reject If

- Dismiss loses unsaved changes silently.
- Action Sheet is cloned inside.
- Fields bypass Flow inputs.
- Focus behavior is unmanaged.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Button | yes | Opens the mobile task after user intent. |
| sheet | BottomSheet | yes | Owns the mobile container and close recovery. |
| progress | Stepper | conditional | Shows task position for multi-step work. |
| content | Input \| Select \| Custom | yes | Task fields or review content. |
| validation | InlineValidation | conditional | Explains blocked progress. |
| actions | Button[] | yes | Back, continue, submit, and cancel actions. |
| feedback | Toast | conditional | Confirms completion without replacing navigation. |

## Components Used

- Stepper
- Input
- Select
- Button
- Inline Validation
- Card Summary
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Single task | Candidate | One sheet with one submit step. |
| Stepped task | Current candidate | Step progress, back/continue, validation, and submit. |
| Review task | Candidate | Final step summarizes values before submit. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Open | Sheet enters after trigger with Design System reveal timing. |
| Step change | Content changes only after explicit continue/back. |
| Close | Cancel or submit restores focus to the trigger. |

## Accessibility

- The sheet has an accessible title.
- Open state starts closed and only changes after user action.
- Validation appears after attempted progress.
- Back and close paths are keyboard reachable.
- Focus returns to the trigger after close.

## Implementation Checklist

- Declare `trigger`: Opens the mobile task after user intent.
- Declare `sheet`: Owns the mobile container and close recovery.
- Declare `content`: Task fields or review content.
- Declare `actions`: Back, continue, submit, and cancel actions.
- Trigger opens sheet from closed state.
- Continue advances only when required data is present.
- Back returns to the previous step.
- Submit shows feedback and closes the sheet.
- Phone viewport keeps actions visible without overlap.

## Tests And Rejection Rules

Must test:

- Trigger opens sheet from closed state.
- Continue advances only when required data is present.
- Back returns to the previous step.
- Submit shows feedback and closes the sheet.
- Phone viewport keeps actions visible without overlap.

Reject if:

- The sheet replaces primary navigation.
- The task has no close or back path.
- Validation appears before user action.

## MIEL

Agents can decide:

- Use Fullscreen Sheet for contextual mobile tasks that are larger than an Action Sheet.
- Use Stepper when the task has clear ordered steps.
- Use Inline Validation for blocked progress.

Agents must ask:

- Navigation ownership, close recovery, destructive submit, or persistence rules are unclear.

Agents must reject:

- The sheet replaces primary navigation.
- The task has no close or back path.
- Validation appears before user action.

Handoff language:

> Confirm trigger, step model, required fields, close behavior, submit consequence, and feedback.
