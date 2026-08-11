# Bottom Sheet

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/bottom-sheet/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/bottom-sheet.json`

## Purpose

Preserve mobile screen context while revealing contextual detail, actions, filters, or confirmation with focus, dismissal, safe-area, and motion rules.

## Use When

- A touch workflow needs temporary contextual content anchored to the bottom edge.
- Users must keep origin context while reviewing details, filters, or short actions.
- The sheet behavior must compose Dialog/Drawer ownership instead of inventing a custom overlay.

## Do Not Use Without Review

- The flow is long, multi-step, or requires a full page.
- The surface needs desktop-first menu behavior.
- Dismissal, focus containment, destructive action, or safe-area behavior is unclear.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Focus containment, labelling, dismissal, inert background, and focus return must be explicit. |
| Depth | The sheet overlays origin context without becoming a floating Card. |
| Energy | Open, closed, dragging, loading, invalid, destructive, and disabled states cascade to child components. |
| Frame | Safe-area, max height, touch targets, scroll boundaries, and responsive width stay token-driven. |
| Growth | Content sizing, preview density, and item measurement inherit from composed components. |
| Iconography | Close and action symbols remain owned by Icon Button and child components. |
| Momentum | Reveal, dismiss, drag, and reduced-motion behavior use motion primitives. |
| State | Open, closed, loading, invalid, destructive, permission-blocked, and disabled states remain explicit. |
| Symbol | Icons can aid scan value but never replace labels. |
| Tone | Danger, blocked, invalid, and neutral tones stay contract-bound. |
| Voice | Title, description, action, cancel, validation, and recovery copy stay visible. |

## Formal Purpose

Preserve mobile screen context while revealing contextual detail, actions, filters, or confirmation with focus, dismissal, safe-area, and motion rules.

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
- `dragging`
- `loading`
- `invalid`
- `destructive`
- `permission-blocked`
- `disabled`

## Formal Dependencies

### Foundations

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
- `Icon Button`
- `Inline Validation`
- `List`

### Patterns

- `Drawer Adapter`

### Tokens

- `comp.button.*`
- `comp.icon-button.*`
- `comp.inline-validation.*`
- `comp.list.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `trigger` | `component` | `Button`, `List`, `Icon Button` |
| `sheetBoundary` | `pattern` | `Drawer Adapter` |
| `header` | `component` | `Icon Button` |
| `sheetBody` | `component` | `List` |
| `actions` | `component` | `Button` |
| `validation` | `component` | `Inline Validation` |

## Formal Governance

### Entry Conditions

- A touch workflow needs temporary contextual content anchored to the bottom edge.
- Users must keep origin context while reviewing details, filters, or short actions.
- The surface can compose Dialog or Drawer ownership instead of inventing an overlay.

### Decision Tree

- Use Menu for compact desktop action lists.
- Use Action Sheet when the body is primarily a short list of contextual actions.
- Use Bottom Sheet when the body needs contextual content, filters, details, or mixed actions in a mobile sheet.
- Use full-screen navigation when the flow is long, multi-step, or page-like.

### Failure Modes

- Overlay bypasses Dialog or Drawer semantics.
- The sheet is wrapped in Card instead of Surface.
- Dismissal depends only on drag gesture.
- Focus containment, focus return, or safe-area behavior is missing.
- A template owns sheet open/close behavior directly.

### Success Metrics

- Users can open, inspect, act, cancel, and dismiss the sheet without losing origin context.
- Focus, escape/back, drag, close, and focus return are predictable.
- Density, safe-area, keyboard, and reduced-motion behavior cascade from Flow primitives.

### Accessibility

- Use Dialog or Drawer semantics through Drawer Adapter for focus containment and focus return.
- Expose an accessible title.
- Keep close or cancel reachable.
- Do not rely on drag gestures as the only dismissal path.
- Respect safe-area and keyboard overlap on mobile.

### Tests

- Composes Drawer Adapter plus Button, Icon Button, List, and Inline Validation.
- Covers closed, open, dragging, loading, invalid, destructive, permission-blocked, and disabled states.
- Focus enters, traps, returns, and closes predictably.
- Safe-area and keyboard overlap do not hide actions.
- Rejects raw overlays, custom focus traps, Card wrappers, and docs-only sheet DOM.

### Agent Instructions

- Do not implement raw overlays or custom focus traps.
- Use Drawer Adapter for the sheet boundary.
- Use Surface semantics from the primitive cascade; do not wrap the sheet in Card.
- Ask before including destructive, regulated, financial, identity, privacy, compliance, or irreversible actions.

### Reject If

- The overlay bypasses Drawer Adapter, Dialog, or Drawer semantics.
- The sheet is wrapped in Card.
- Dismissal depends only on drag gesture.
- Focus containment, focus return, or safe-area behavior is missing.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Button \| List row \| Icon Button | conditional | Object-specific entry point owned by the parent workflow. |
| sheetBoundary | Dialog \| Drawer | required | Focus, modality, labelling, dismissal, overlay, and focus return owner. |
| header | Text \| Icon Button | conditional | Title, description, close action, or drag handle. |
| sheetBody | List \| Form Section \| Pattern | required | Sheet body owned by Flow components or patterns without taking over structural surface ownership. |
| actions | Button[] | conditional | Primary, secondary, cancel, or destructive actions. |
| validation | Inline Validation | conditional | Explains unavailable, invalid, or blocked sheet state. |

## Components Used

- Button
- Icon Button
- List
- Inline Validation

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Context detail | Default | Short object details with optional actions. |
| Filter sheet | Conditional | Filter controls remain owned by form/filter patterns. |
| Action sheet bridge | Conditional | Use Action Sheet when the body is primarily contextual actions. |
| Confirmation | Review | Escalate to Confirmation Dialog for high-risk destructive decisions. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Reveal | Sheet enters from the bottom edge and respects reduced motion. |
| Dismiss | Cancel, close, backdrop, Escape/back, and drag-down policies are explicit. |
| Scroll boundary | Internal scroll remains stable and does not steal page scroll unexpectedly. |

## Accessibility

- Use Dialog or Drawer semantics for focus containment and focus return.
- Expose an accessible title.
- Keep close/cancel reachable.
- Do not rely on drag gestures as the only dismissal path.
- Respect safe-area and keyboard overlap on mobile.

## Implementation Checklist

- Composes Dialog/Drawer boundary plus Button, Icon Button, List, and Inline Validation.
- Covers closed, open, dragging, loading, invalid, destructive, permission-blocked, and disabled states.
- Focus enters, traps, returns, and closes predictably.
- Safe-area and keyboard overlap do not hide actions.
- No raw overlay, custom focus trap, Card wrapper, or local DOM-only sheet behavior is emitted.

## Tests And Rejection Rules

Must test:

- Composes Dialog/Drawer boundary plus Button, Icon Button, List, and Inline Validation.
- Covers closed, open, dragging, loading, invalid, destructive, permission-blocked, and disabled states.
- Focus enters, traps, returns, and closes predictably.
- Safe-area and keyboard overlap do not hide actions.
- No raw overlay, custom focus trap, Card wrapper, or local DOM-only sheet behavior is emitted.

Reject if:

- The overlay bypasses Dialog/Drawer semantics.
- The sheet is wrapped in Card instead of Surface.
- Dismissal depends only on drag gesture.
- Focus containment or focus return is missing.

## MIEL

Agents can decide:

- Use Bottom Sheet for temporary mobile contextual content.
- Use Action Sheet when the sheet is only a short action list.
- Use full screen or route navigation when content is long or multi-step.

Agents must ask:

- Dismissal, destructive policy, safe-area, keyboard behavior, or focus return is unclear.
- The sheet affects access, money, identity, compliance, privacy, or irreversible state.
- The requested content may need a full screen.

Agents must reject:

- The overlay bypasses Dialog/Drawer semantics.
- The sheet is wrapped in Card instead of Surface.
- Dismissal depends only on drag gesture.
- Focus containment or focus return is missing.

Handoff language:

> Confirm trigger, sheet purpose, title, dismissal policy, focus return, safe-area behavior, content owner, action risk, and recovery states.
