# Pull To Refresh

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/pull-to-refresh/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/pull-to-refresh.json`

## Purpose

Refresh mobile lists, cards, stations, and dashboards with explicit stale data, progress, error recovery, and reduced-motion behavior.

## Use When

- A mobile surface can refresh remote data in place.
- Users need stale-data recovery without leaving context.
- The refresh affects cards, movements, stations, routes, or notifications.

## Do Not Use Without Review

- Refresh source, cache policy, or error recovery is unclear.
- The gesture hides a required explicit refresh action.
- The refreshed data affects financial, compliance, or legal state.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines pull region, indicator placement, safe area, and scroll containment. |
| Voice | Owns stale, refreshing, updated, and failed copy. |
| Energy | Controls progress, success, warning, and disabled state. |
| State | Idle, pulling, refreshing, stale, updated, failed, offline, and disabled states are explicit. |
| Momentum | Gesture feedback respects reduced motion and never becomes decorative. |
| Accessibility | Refresh action has an explicit button alternative and live status. |

## Formal Purpose

Coordinate touch refresh gestures with explicit button fallback, refresh state, progress feedback, list continuity, and error recovery.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Touch-first |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `reduced motion` |

## Formal States

- `idle`
- `pulling`
- `threshold`
- `refreshing`
- `complete`
- `error`
- `disabled`
- `reduced-motion`

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

- `Animation Assets`
- `Breakpoints`
- `Color`
- `Density`
- `Disabled`
- `Duration`
- `Elevation`
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
- `Button`
- `Card`
- `Inline Validation`
- `List`
- `Progress Indicator`
- `Toast`

### Tokens

- `comp.animated-moment.*`
- `comp.button.*`
- `comp.card.*`
- `comp.inline-validation.*`
- `comp.list.*`
- `comp.progress-indicator.*`
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
| `content` | `primitive` | `Surface` |
| `indicator` | `component` | `Animated Moment`, `Progress Indicator` |
| `fallback` | `component` | `Button`, `Inline Validation`, `Toast` |
| `feed` | `component` | `List`, `Card` |

## Formal Governance

### Entry Conditions

- A touch surface displays refreshable content.
- Users need a fast manual refresh without losing list position.
- Refresh can be loading, stale, unavailable, or failed.

### Decision Tree

- Use Button alone when refresh is a standard toolbar command.
- Use Pull to Refresh when touch gesture refresh is primary.
- Use Toast or Inline Validation for post-refresh feedback and recovery.

### Failure Modes

- Refresh is gesture-only with no explicit control.
- Progress is decorative or unannounced.
- Refreshing jumps scroll position unexpectedly.
- Motion ignores reduced motion preferences.

### Success Metrics

- Users can refresh by gesture and by explicit control.
- Refresh progress and errors are understandable.
- Content continuity and accessibility preferences are preserved.

### Accessibility

- Provide a non-gesture refresh action.
- Announce refresh start, completion, and failure.
- Respect reduced motion.

### Tests

- Covers gesture and explicit Button fallback.
- Uses Animated Moment and Progress Indicator for refresh feedback.
- Preserves reduced-motion and error recovery behavior.

### Agent Instructions

- Compose from Animated Moment, Progress Indicator, Button, List, Card, Inline Validation, and Toast.
- Keep fetch policy, cache invalidation, and pagination outside the pattern.
- Ask before auto-refreshing regulated, financial, or safety-critical content.

### Reject If

- Refresh is gesture-only.
- Progress lacks text or live feedback.
- Motion ignores accessibility preferences.
- The pattern owns app data-fetching policy.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| content | Surface | yes | Structural owner for refreshable content and refresh state. |
| feed | List \| Card[] | yes | Refreshable rows or cards inside the Surface boundary. |
| indicator | ProgressIndicator \| AnimatedMoment | yes | Visible refresh progress. |
| fallbackAction | Button | yes | Explicit refresh action for keyboard and assistive tech. |
| feedback | Toast \| InlineValidation | conditional | Updated, failed, or offline feedback. |

## Components Used

- List
- Card
- Progress Indicator
- Button
- Toast
- Inline Validation
- Animated Moment

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| content | Surface | yes | Structural owner for refreshable content and refresh state. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Movement refresh | Required | Updates a list while preserving scroll context. |
| Offline recovery | Required state | Shows stale data and retry. |
| Reduced motion | Required state | Uses static progress and text status. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Pull affordance | Indicator follows gesture within bounds. |
| Refresh | Progress appears after user action. |
| Reduced motion | Removes elastic or decorative animation. |

## Accessibility

- A visible refresh button exists.
- Status updates are text-backed.
- Focus is not moved after refresh.
- Offline and error states include recovery.

## Implementation Checklist

- Declare `content`: Structural owner for refreshable content and refresh state.
- Declare `feed`: Refreshable rows or cards inside the Surface boundary.
- Declare `indicator`: Visible refresh progress.
- Declare `fallbackAction`: Explicit refresh action for keyboard and assistive tech.
- Explicit refresh updates status.
- Failure shows recovery.
- Reduced-motion state avoids decorative movement.
- Content remains readable during refresh.

## Tests And Rejection Rules

Must test:

- Explicit refresh updates status.
- Failure shows recovery.
- Reduced-motion state avoids decorative movement.
- Content remains readable during refresh.

Reject if:

- No explicit non-gesture fallback exists.
- Refresh state is visual-only.
- Failure has no recovery.

## MIEL

Agents can decide:

- Use Pull to Refresh for mobile in-place refresh.
- Provide a Button fallback.
- Show stale/offline status when data is not current.

Agents must ask:

- Cache policy, source, cadence, or error recovery is unclear.
- Refresh affects regulated, financial, or audit data.

Agents must reject:

- No explicit non-gesture fallback exists.
- Refresh state is visual-only.
- Failure has no recovery.

Handoff language:

> Confirm refresh source, cache policy, stale copy, explicit fallback, failure recovery, and reduced-motion behavior.
