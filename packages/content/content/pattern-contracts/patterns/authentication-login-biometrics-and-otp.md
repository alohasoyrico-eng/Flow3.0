# Authentication Login Biometrics And Otp

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/authentication-login-biometrics-and-otp/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/authentication-login-biometrics-and-otp.json`

## Purpose

Coordinate phone login, OTP verification, biometric step-up, fallback, validation, and feedback as one recoverable authentication system.

## Use When

- A product needs more than one authentication method.
- OTP and biometric recovery must share state and copy.
- Risk, retry, lockout, or fallback behavior must be visible before build.

## Do Not Use Without Review

- A single local Biometric Prompt or Code Input is enough.
- Security policy, retry limits, or recovery ownership is unclear.
- Authentication affects regulated, financial, or account access decisions.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Focus order, labels, status announcements, and retry recovery are required. |
| State | Idle, sending, code sent, verifying, biometric, fallback, locked, success, and error are explicit. |
| Voice | Copy explains the next action without exposing security internals. |
| Momentum | Step changes use Design System motion and respect reduced motion. |
| Frame | Phone and OTP fields stay readable on compact mobile viewports. |
| Energy | Validation and success states use semantic Design System tones only. |

## Formal Purpose

Coordinate authentication entry, phone or credential capture, OTP verification, biometric prompt handoff, validation, error recovery, and secure feedback while templates own policy, routing, copy, and identity provider configuration.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Configuration Console` |

## Formal States

- `idle`
- `submitting`
- `otp-sent`
- `otp-invalid`
- `biometric-prompt`
- `locked`
- `rate-limited`
- `recovered`

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

- `Biometric Prompt`
- `Button`
- `Code Input`
- `Error Panel`
- `Inline Validation`
- `Input`
- `Phone Input`
- `Toast`

### Tokens

- `comp.biometric-prompt.*`
- `comp.button.*`
- `comp.code-input.*`
- `comp.error-panel.*`
- `comp.inline-validation.*`
- `comp.input.*`
- `comp.phone-input.*`
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
| `surface` | `primitive` | `Surface` |
| `identity` | `component` | `Input`, `Phone Input`, `Inline Validation` |
| `verification` | `component` | `Code Input`, `Biometric Prompt`, `Button` |
| `recovery` | `component` | `Error Panel`, `Toast` |

## Formal Governance

### Entry Conditions

- A product needs a reusable authentication step or recovery flow.
- OTP, biometric, credential, or phone capture states must remain consistent.
- The template owns authentication policy, provider wiring, rate limits, and security copy.

### Decision Tree

- Use Phone Input or Code Input directly for simple forms.
- Use this pattern when login, OTP, biometric prompt, and recovery are coordinated.
- Use templates for complete auth screens, provider policy, and regulated security flows.

### Failure Modes

- The pattern hardcodes provider policy or template routing.
- OTP and biometric flows are separate custom implementations.
- Errors expose sensitive auth state.
- Rate limit or resend behavior is visual-only.

### Success Metrics

- Users can authenticate, recover, and understand blocked states securely.
- Keyboard and screen reader users can complete OTP and biometric alternatives.
- Templates can vary policy without changing component composition.

### Accessibility

- Expose OTP length and error state in text.
- Provide non-biometric alternatives.
- Avoid leaking sensitive security details through announcements.

### Tests

- Composes all auth field/recovery components.
- Covers submitting, OTP, biometric, locked, rate-limited, and recovered states.
- Keeps provider policy and template routing outside the pattern.

### Agent Instructions

- Do not implement identity-provider logic here.
- Keep security policy and copy in templates or app code.
- Ask before changing authentication, recovery, MFA, biometric, or rate-limit behavior.

### Reject If

- Provider policy is embedded.
- Biometric has no alternative.
- Sensitive failure reason is exposed.
- Fields bypass Flow components.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| surface | Surface | yes | Structural owner for auth grouping, density cascade, and blocked/recovered state. |
| identity | Phone Input | yes | Primary identifier and recovery contact. |
| otp | Code Input | conditional | Shown after the user requests a code. |
| biometric | Biometric Prompt | conditional | Step-up or returning-user authentication. |
| validation | Inline Validation \| Error Panel | yes | Recoverable field and policy errors. |
| feedback | Toast | conditional | Non-blocking success or retry feedback. |
| actions | Button[] | yes | Send, verify, fallback, and recovery actions. |

## Components Used

- Phone Input
- Input
- Code Input
- Biometric Prompt
- Button
- Inline Validation
- Error Panel
- Toast

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| surface | Surface | yes | Structural owner for auth grouping, density cascade, and blocked/recovered state. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Phone + OTP | Required | Baseline login and recovery. |
| Biometric step-up | Required | Returning user or sensitive action. |
| Fallback recovery | Required state | OTP or support path after biometric failure. |
| Locked/retry | Security review | Retry count and lockout copy require policy. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Code reveal | OTP section enters only after Send OTP. |
| Biometric prompt | Uses component motion; no autoplay success. |
| Error recovery | Validation appears near the failing action. |
| Reduced motion | Keeps state changes immediate and text-backed. |

## Accessibility

- Phone and OTP fields have visible labels.
- Biometric action has a text fallback.
- Errors use inline validation or error panel, not color-only state.
- Focus moves only after a user-triggered transition.

## Implementation Checklist

- Declare `surface`: Structural owner for auth grouping, density cascade, and blocked/recovered state.
- Declare `identity`: Primary identifier and recovery contact.
- Declare `validation`: Recoverable field and policy errors.
- Declare `actions`: Send, verify, fallback, and recovery actions.
- Send OTP reveals code input after user action.
- Verify shows feedback only after user action.
- Fallback path remains keyboard reachable.
- Narrow viewport keeps fields, prompt, and actions readable.

## Tests And Rejection Rules

Must test:

- Send OTP reveals code input after user action.
- Verify shows feedback only after user action.
- Fallback path remains keyboard reachable.
- Narrow viewport keeps fields, prompt, and actions readable.

Reject if:

- A demo auto-verifies before user action.
- Biometric replaces OTP fallback.
- Security copy exposes implementation details or uses raw tokens.

## MIEL

Agents can decide:

- Use this pattern when phone, OTP, and biometric states must coordinate.
- Use Design System security/input/feedback components rather than custom controls.
- Keep retry feedback local unless policy requires a blocking dialog.

Agents must ask:

- Retry limit, lockout, device trust, risk score, recovery owner, or audit trail is unclear.
- Auth affects financial, identity, compliance, or account recovery behavior.

Agents must reject:

- A demo auto-verifies before user action.
- Biometric replaces OTP fallback.
- Security copy exposes implementation details or uses raw tokens.

Handoff language:

> Confirm identity method, OTP expiry, retry limits, biometric fallback, lockout, audit needs, and support recovery before implementation.
