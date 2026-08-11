# Driver Onboarding Mobile

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/driver-onboarding-mobile/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/driver-onboarding-mobile.json`

## Purpose

Guide a driver through mobile identity, verification, consent, and first-use readiness with compact steps, recovery, and feedback.

## Use When

- A driver must complete several mobile setup steps before operating.
- Verification, consent, or device readiness can fail and recover.
- The system must work as a short mobile journey rather than a desktop form.

## Do Not Use Without Review

- The task is one standalone form section.
- Legal consent, identity evidence, or support escalation is undefined.
- The system requires product-specific routing that belongs in a template.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Uses a single-column mobile layout with stable action area. |
| State | Each step owns pending, complete, validation, and recovery states. |
| Voice | Short labels and helper copy avoid dense desktop instructions. |
| Momentum | Stepper and Animated Moment communicate progress without autoplay decisions. |
| Accessibility | Keyboard, screen reader, and reduced-motion flows remain complete. |
| Depth | Escalation uses sheet/dialog only when the user requests help. |

## Formal Purpose

Coordinate mobile driver onboarding through progress, identity capture, OTP/biometric steps, validation, animated feedback, and form-section boundary while templates own policy and sequence.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Mobile |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `reduced motion` |
| Template Dependencies | `Driver Mobile App` |

## Formal States

- `not-started`
- `in-progress`
- `verifying`
- `biometric`
- `invalid`
- `blocked`
- `complete`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
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

- `Animation Assets`
- `Breakpoints`
- `Color`
- `Country Flags`
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

- `Animated Moment`
- `Biometric Prompt`
- `Button`
- `Card`
- `Card Summary`
- `Code Input`
- `Inline Validation`
- `Input`
- `Phone Input`
- `Stepper`
- `Toast`

### Patterns

- `Form Section`

### Tokens

- `comp.animated-moment.*`
- `comp.biometric-prompt.*`
- `comp.button.*`
- `comp.card.*`
- `comp.card-summary.*`
- `comp.code-input.*`
- `comp.inline-validation.*`
- `comp.input.*`
- `comp.phone-input.*`
- `comp.stepper.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `progress` | `component` | `Stepper`, `Card Summary`, `Animated Moment` |
| `stepCard` | `component` | `Card` |
| `fields` | `component` | `Input`, `Phone Input`, `Code Input`, `Inline Validation` |
| `actions` | `component` | `Button`, `Biometric Prompt`, `Toast` |
| `formBoundary` | `pattern` | `Form Section` |

## Formal Governance

### Entry Conditions

- A mobile app needs a reusable onboarding flow for driver setup.
- The flow needs identity capture, verification, validation, progress, and recovery.
- Templates own business sequence, eligibility, and regulatory copy.

### Decision Tree

- Use Multi Step Form for generic progress forms.
- Use this pattern for mobile driver onboarding composition.
- Use templates for product-specific onboarding journeys.

### Failure Modes

- The pattern hardcodes template flow order or eligibility policy.
- Animated feedback has no reduced-motion handling.
- OTP/biometric alternatives are missing.
- Form Section is duplicated.

### Success Metrics

- Drivers can complete setup on mobile with clear progress and recovery.
- Verification and validation are accessible.
- Templates can alter policy without changing Flow composition.

### Accessibility

- Provide non-biometric alternatives.
- Respect reduced motion.
- Tie validation to field and step context.

### Tests

- Composes all listed onboarding components.
- Covers progress, verification, biometric, invalid, blocked, complete, and disabled states.
- Keeps Form Section and templates as boundaries.

### Agent Instructions

- Do not embed eligibility or compliance policy.
- Do not require biometric-only paths.
- Ask before changing identity, verification, or regulated onboarding requirements.

### Reject If

- Template sequence is hardcoded.
- Reduced motion is ignored.
- Biometric has no alternative.
- Fields bypass Flow components.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| progress | Stepper | yes | Current setup step. |
| identity | Phone Input \| Code Input | yes | Verification inputs. |
| trust | Biometric Prompt | conditional | Device trust or quick login setup. |
| readiness | Animated Moment \| Card Summary | conditional | Explains setup completion or next action. |
| validation | Inline Validation | yes | Step-level recovery. |
| actions | Button[] | yes | Continue, back, skip allowed, finish. |

## Components Used

- Stepper
- Phone Input
- Input
- Code Input
- Biometric Prompt
- Animated Moment
- Card
- Card Summary
- Button
- Inline Validation
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Identity first | Required | Phone/OTP before device setup. |
| Biometric opt-in | Required | Optional device trust with fallback. |
| First-use ready | Required state | Summary and next action. |
| Support escalation | Review | Only when recovery owner is defined. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Step transition | Uses Design System motion after Continue or Back. |
| Readiness cue | Animated Moment is idle until the user reaches final step. |
| Validation reveal | Appears inline near the current step. |
| Reduced motion | Removes decorative progress animation. |

## Accessibility

- Stepper exposes current step.
- Back and Continue are reachable in the mobile action area.
- Validation appears after user action.
- Biometric setup has OTP or support fallback.

## Implementation Checklist

- Declare `progress`: Current setup step.
- Declare `identity`: Verification inputs.
- Declare `validation`: Step-level recovery.
- Declare `actions`: Continue, back, skip allowed, finish.
- Continue advances steps after user action.
- Back restores the prior step.
- Finish shows feedback only after user action.
- Mobile viewport has no horizontal overflow.

## Tests And Rejection Rules

Must test:

- Continue advances steps after user action.
- Back restores the prior step.
- Finish shows feedback only after user action.
- Mobile viewport has no horizontal overflow.

Reject if:

- The system auto-advances without user action.
- Desktop table/form layout is forced into mobile.
- A template-level route or dashboard is hidden inside the pattern.

## MIEL

Agents can decide:

- Use this pattern for mobile driver setup with verification and readiness.
- Use Design System inputs, security, progress, and feedback components.
- Keep each step short and recoverable.

Agents must ask:

- Legal consent, support escalation, identity evidence, offline mode, or role assignment is unclear.

Agents must reject:

- The system auto-advances without user action.
- Desktop table/form layout is forced into mobile.
- A template-level route or dashboard is hidden inside the pattern.

Handoff language:

> Confirm required steps, optional skips, verification policy, consent copy, support route, and final handoff destination.
