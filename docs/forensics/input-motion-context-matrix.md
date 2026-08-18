# Input Motion Context Matrix

Date: 2026-08-17
Last updated: 2026-08-17

Scope: Input-family motion decisions for Flow React component QA.

This document does not certify final visual parity. It defines the motion contract for `Input`, `Input Amount`, card inputs, `Phone Input`, `Code Input`, and related field feedback, and records the implementation/audit decisions that now gate the package CSS.

## Why This Exists

The Input QA found that treating motion as a generic component rule is wrong.

Inputs are interactive, but their interaction semantics are not the same as a command button. A button can use activation motion: lift, press, release, and bounce. An input needs editing and feedback motion: focus, typing, validation, loading, helper message, placeholder, affordance, and recovery.

The system must therefore audit motion by context and state, not by asking whether all components should or should not "bounce".

## Source Evidence

| Source | Evidence | Decision impact |
| --- | --- | --- |
| ZIP `packages/components/css/forms/Input.css` | The legacy input wrapper transitions `border-color` and `box-shadow` with `sys-motion-dur-fast` and `sys-motion-ease-out`; no `transform`, `scale`, or input keyframes. | Base text input should not inherit Button-like scale/bounce by default. |
| ZIP `packages/components/css/forms/OTPInput.css` | OTP slots have state transitions and stronger focus/slot behavior. | Code/OTP inputs may use more expressive current-slot and error feedback than base Input. |
| ZIP `packages/components/css/controls/Button.css` | Button uses transform/press/scale motion. | Button motion is valid, but should not become the default field motion. |
| Flow3 `packages/components/styles/components.css` | `.field__control` transitions `background-color`, `border-color`, and `outline-color` using component duration/ease aliases sourced from Momentum. | Flow3 is tokenized, but Input motion needs a field-specific contract and parity review. |
| Flow3 `input.json` component spec | Momentum is for focus, loading, reduced motion, and "feedback without delaying typing". | Input motion must stay responsive and must not interfere with typing. |
| Flow3 `code-input.json` component spec | Momentum explicitly covers focus and error motion with reduced motion. | Code Input needs stronger motion states than base Input. |
| Flow3 `phone-input.json` and `input-amount.json` specs | Both inherit shared field rhythm and focus transitions. | Specialized field components should derive from Input unless their context requires extra feedback. |

## Motion Principles

1. Motion must communicate state, not decorate the field.
2. Input motion must not shift surrounding layout.
3. Typing must never wait on animation.
4. Validation motion must be text-backed and accessibility-backed.
5. Disabled and readonly states must not look interactive.
6. Reduced motion must preserve meaning through color, text, icon, and focus state.
7. Motion differences must be owned by context, not by one-off docs demos or local CSS.

## Context Matrix

| Context | Components | Primary states | Motion intent | Allowed motion | Rejected motion | ZIP parity note | Audit status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Base text field | `input`, `text-area` | default, hover, focus, filled, disabled | Show edit readiness and active focus without implying command activation. | Border/focus-ring/box-shadow transition; optional helper fade if message changes. | Whole-control scale, bounce, lift, layout shift, delayed caret/typing. | ZIP base Input uses border + shadow transition only. | Implemented + audited |
| Validation field | `input`, `text-area`, `inline-validation` | error, warning, success, validating | Make recovery state noticeable and tied to the field. | Helper/error fade or short slide; status icon enter; contained error nudge when severe; loading indicator spin/progress. | Color-only validation; repeated shaking while typing; clearing value; motion without `aria-invalid`/describedby/live support. | ZIP has field error copy and border state; stronger validation motion must be justified by Flow state contract. | Implemented + audited for helper/status; nudge remains CodeInput-only |
| Search field | `input`, `combobox`, search patterns | focus, typing, results-open, empty, loading, cleared | Connect query entry with result state. | Focus ring, clear-action press, result layer enter, loading cue. | Button-like field bounce on every keystroke; results motion detached from query state. | ZIP uses input base plus pattern-level behavior. | Covered by base field + combobox overlay motion; pattern visual QA pending |
| Financial amount field | `input-amount`, `card-number-input`, `card-expiry-input`, `card-security-code-input` | filled, formatting, validating, error, disabled | Preserve trust, correction, and sensitive value readability. | Subtle focus/validation transitions; formatter should feel immediate; reveal action press only on field action. | Large bounce, value jitter, masking animation that hides correction, decorative card-like elevation. | ZIP reuses Field/Input discipline for money/card capture. | Implemented through shared field/message motion |
| Phone field | `phone-input`, `country-selector` composition | focus, country-open, valid, warning, error, otp-handoff | Keep country + number as one localized field while making handoff state clear. | Shared field focus; selector chevron/open transition; status icon enter; helper transition. | Flag-only motion, field scale, country selector behaving like unrelated button group. | ZIP uses FlowField + FlowInput style in auth/settings contexts. | Implemented through shared field/message motion + existing selector open motion |
| Code/OTP field | `code-input` | focus, digit-entry, complete, warning, error, disabled | Make active slot and recovery state clear while preserving one logical input. | Current-slot cue; digit pop; complete cue; contained error nudge; timer/resend helper transition. | Six independent input animations; slot motion that breaks screen-reader model; persistent bounce. | ZIP OTP is the strongest evidence for expressive input-family motion. | Implemented + audited |
| Dense filter/table field | `input`, `select`, `combobox` in data patterns | default, focus, filled, disabled, loading | Support repeated scanning and keyboard workflows. | Minimal border/focus transitions; no size change; result/open layer motion only when present. | Bounce, lift, animated labels that reduce row height predictability. | ZIP table/filter surfaces use calm transition behavior. | Implemented through no-control-transform gate |
| Mobile field | input-family components in mobile templates/patterns | focus, typing, error, helper, keyboard open | Keep large targets and focus clear without causing viewport jumps. | Focus ring, helper transition, OTP slot cue, action press. | Whole-field growth that changes scroll position; motion hidden behind keyboard; aggressive bounce. | ZIP mobile OTP/auth supports expressive but contained field motion. | Implemented through no-layout-shift + reduced-motion gate; visual QA pending |
| Readonly/disabled field | all input-family components | readonly, disabled, policy-locked | Communicate non-editability without suggesting affordance. | Opacity/surface transition only when entering state; stable text. | Hover/press/scale, animated affordance, blue/action disabled state. | ZIP disabled fields rely on opacity/state, not activation motion. | Implemented + audited |

## State Requirements

| State | Required motion behavior | Accessibility requirement |
| --- | --- | --- |
| hover | Optional surface/border transition only. | Must not be the only way to know the field is usable. |
| focus | Visible focus transition, preferably ring/shadow/border; no layout shift. | Native focus, visible label, correct `aria-describedby`. |
| typing | No animation that delays text entry. | Native input behavior preserved. |
| filled | Stable value display; optional subtle state transition. | Value remains readable and selectable. |
| loading/validating | Loading cue may animate; value and label remain visible. | Busy state or helper text explains progress when applicable. |
| error | Field state and message enter clearly; severe nudge allowed only if reduced-motion alternative exists. | `aria-invalid` and error message association. |
| warning | Warning appears as text-backed state, not color-only. | Message associated with the field. |
| success/valid | Confirmation can use subtle icon/border transition. | Must not auto-clear value or imply final submission. |
| disabled | No activation motion. | Native `disabled` or equivalent semantic state. |
| readonly | No activation motion; distinguish from disabled if focusable/readable. | Native `readOnly` or clear semantic representation. |

## Derived Audit Requirements

The future audit should be component-aware. A single global "motion yes/no" rule would be wrong.

Required checks:

- Base `Input` and `TextArea` must not apply `transform`, `scale`, `translate`, or keyframe bounce to the whole field control.
- `Button`, `IconButton`, `QuickAction`, and interactive cards may use activation transforms, but those transforms must not leak into `.field__control`.
- Input-family transitions must use token aliases from Momentum/Duration/Motion Curves, never raw durations/easing.
- Validation states must have an associated message path, not only border/color/motion.
- `CodeInput` may use slot-level motion, but it must preserve one logical input/accessibility contract.
- Financial/card fields must inherit shared field motion unless a component-specific contract declares and tests a stricter state.
- Dense/table fields must be layout-stable: no transform that changes perceived row rhythm.
- Disabled/readonly states must block hover/press/activation motion.
- Reduced-motion mode must remove non-essential transform/keyframe motion while preserving focus and validation meaning.

## Current Decision

Do not add Button-style grow/bounce to base `Input`.

The formal Input-family motion audit now enforces:

1. Base field focus and helper motion.
2. Validation motion through `InlineValidation`.
3. Search/combobox open-result motion.
4. Financial/card field correction and validating states.
5. Phone/country selector focus/open/status motion.
6. Code/OTP slot/current/error motion.
7. Dense and mobile constraints.
8. Disabled/readonly no-activation guarantee.

## Open Questions

- Should Flow3 switch base field focus from `outline-color` transition to a `box-shadow` token to better match the ZIP?
- Should `Input` support a `validating` state separately from `loading`?
- Should `success` and `warning` become first-class states for base `Input`, or should they only appear through `InlineValidation`?
- Should search remain an `Input` variant or graduate into a pattern when results/empty/loading behavior is present?
- Should `CodeInput` own an explicit `error-nudge` motion token distinct from generic field validation?

## Next Action

Run component QA for `Input` and the input-family demos in light/dark/reduced-motion modes, then decide whether `validating` and `success` need first-class base `Input` states beyond the existing shared field message contract.
