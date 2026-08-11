# Drawer Adapter

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/drawer-adapter/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/drawer-adapter.json`

## Purpose

Adapt desktop side panels, navigation, or inspectors into mobile drawers with focus recovery, close paths, and content parity.

## Use When

- Desktop content lives beside the route but mobile needs it in an overlay drawer.
- The same content must remain discoverable across viewport changes.
- Users need a bounded panel for navigation, details, or tools.

## Do Not Use Without Review

- The drawer becomes unrelated page content.
- The adapted content requires a full page or multi-step form.
- Close, focus, or layer ownership conflicts with Topbar or Sidebar.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines drawer edge, width, safe margins, internal scroll, and action placement. |
| Depth | Owns overlay and elevation when content leaves document system. |
| Momentum | Uses Design System drawer reveal and reduced-motion fallback. |
| State | Controls closed, open, focus, selected, and dismissed states. |
| Accessibility | Requires labelled drawer, close button, focus containment, Escape/back close, and restored focus. |

## Formal Purpose

Coordinate responsive drawer behavior between shell, navigation, and task flows while preserving Drawer ownership and avoiding duplicate overlay implementations.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `closed`
- `open`
- `modal`
- `non-modal`
- `responsive`
- `loading`
- `error`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
- `Frame`
- `Momentum`
- `State`

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
- `Card`
- `Dialog`
- `Drawer`
- `List`
- `Menu`
- `Toast`

### Patterns

- `Multi Step Form`
- `Sidebar`
- `Topbar`

### Tokens

- `comp.button.*`
- `comp.card.*`
- `comp.dialog.*`
- `comp.drawer.*`
- `comp.list.*`
- `comp.menu.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `surface` | `component` | `Drawer`, `Dialog` |
| `content` | `primitive` | `Surface` |
| `actions` | `component` | `Button`, `Toast` |
| `body` | `component` | `List`, `Card` |
| `overflowNavigation` | `component` | `Menu` |
| `multi-step-formBoundary` | `pattern` | `Multi Step Form` |
| `sidebarBoundary` | `pattern` | `Sidebar` |
| `topbarBoundary` | `pattern` | `Topbar` |

## Formal Governance

### Entry Conditions

- A drawer must adapt between navigation, modal task, and responsive shell contexts.
- Topbar or Sidebar may trigger the drawer, but Drawer owns surface behavior.
- Task flows may embed Multi Step Form without owning drawer mechanics.

### Decision Tree

- Use Drawer directly for one surface.
- Use Drawer Adapter when a shell or task flow needs governed responsive drawer behavior.
- Use Dialog for modal confirmation rather than navigation/task drawer adaptation.

### Failure Modes

- Topbar or Sidebar clones drawer overlay mechanics.
- Multi Step Form owns shell drawer behavior.
- Focus trap, escape, or focus return diverges by context.
- Responsive behavior bypasses Breakpoints tokens.

### Success Metrics

- Shell and task drawers behave consistently across viewports.
- Focus, escape, reduced motion, and dismissal remain governed.
- Topbar, Sidebar, and Multi Step Form stay composition boundaries.

### Accessibility

- Preserve Drawer focus behavior for each mode.
- Provide consistent escape/dismissal behavior.
- Avoid responsive changes that hide active focus.

### Tests

- Composes Drawer, Dialog, List, Card, Menu, Button, and Toast.
- Covers modal, non-modal, responsive, loading, error, and disabled states.
- Keeps Topbar, Sidebar, and Multi Step Form as boundaries.

### Agent Instructions

- Do not implement custom overlay mechanics.
- Keep shell routing and task state outside this adapter.
- Ask before adapting drawers that contain destructive or regulated flows.

### Reject If

- Drawer overlay is duplicated.
- Responsive behavior uses raw breakpoints.
- Topbar/Sidebar own drawer internals.
- Focus behavior differs by host without contract.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Button | yes | Opens the adapted drawer after user action. |
| drawer | Drawer | yes | Owns overlay, edge, and close recovery. |
| content | Surface | yes | Structural owner for adapted drawer content, density, and state cascade. |
| body | Menu \| List \| Card | yes | Adapted navigation or inspector content inside the Surface boundary. |
| decision | Dialog | conditional | Escalates risky choices from inside the drawer. |
| feedback | Toast | conditional | Reports drawer selection or save state. |

## Components Used

- Drawer
- Menu
- List
- Card
- Button
- Dialog
- Toast

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| content | Surface | yes | Structural owner for adapted drawer content, density, and state cascade. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Navigation drawer | Current candidate | Adapts side navigation into mobile drawer. |
| Inspector drawer | Candidate | Adapts contextual detail or tools. |
| Decision drawer | Candidate | Menu action escalates to Dialog when needed. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Open | Drawer enters from the owning edge after user action. |
| Close | Dismissal restores focus to the opener. |
| Escalate | Dialog appears above drawer only for required decisions. |

## Accessibility

- Drawer starts closed.
- Close is always visible and keyboard reachable.
- Focus returns to the trigger after close.
- Dialog escalation does not hide cancellation.

## Implementation Checklist

- Declare `trigger`: Opens the adapted drawer after user action.
- Declare `drawer`: Owns overlay, edge, and close recovery.
- Declare `content`: Structural owner for adapted drawer content, density, and state cascade.
- Declare `body`: Adapted navigation or inspector content inside the Surface boundary.
- Trigger opens drawer from closed state.
- Close button and Escape/back behavior are defined.
- Menu selection reports feedback.
- Risky selection opens Dialog.
- Drawer layer appears above route content.

## Tests And Rejection Rules

Must test:

- Trigger opens drawer from closed state.
- Close button and Escape/back behavior are defined.
- Menu selection reports feedback.
- Risky selection opens Dialog.
- Drawer layer appears above route content.

Reject if:

- The drawer replaces a full route.
- The adapted content has no close path.
- The drawer opens by default without user intent.

## MIEL

Agents can decide:

- Use Drawer Adapter when desktop side content needs a mobile overlay.
- Use Menu for compact adapted choices.
- Escalate risky drawer actions to Dialog.

Agents must ask:

- The drawer owner, content parity, close path, or layer relationship is unclear.

Agents must reject:

- The drawer replaces a full route.
- The adapted content has no close path.
- The drawer opens by default without user intent.

Handoff language:

> Confirm source panel, mobile owner, trigger, close behavior, content parity, and escalation rules.
