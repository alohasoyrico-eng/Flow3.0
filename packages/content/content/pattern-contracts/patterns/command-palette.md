# Command Palette

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/command-palette/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/command-palette.json`

## Purpose

Give expert users fast keyboard access to navigation, actions, recent entities, and support tasks without replacing visible navigation.

## Use When

- Users need cross-product command access from a stable shortcut or topbar action.
- Results combine routes, actions, entities, or help topics with clear grouping.
- Commands need permission checks, keyboard navigation, and no-result recovery.

## Do Not Use Without Review

- The surface is only a search field without executable actions.
- Command execution, permissions, or destructive confirmation is unclear.
- The palette hides primary navigation or becomes the only way to complete a task.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines overlay width, result density, grouped layout, and viewport fallback. |
| Voice | Owns command labels, scope labels, empty state, shortcut hints, and result descriptions. |
| Energy | Controls focus, selected result, keyboard target, and action priority. |
| Depth | Palette appears as a bounded overlay above shell content. |
| Momentum | Overlay and result updates use system motion and reduced-motion fallback. |
| State | Closed, open, typing, selected, loading, no results, disabled, and executing states are explicit. |
| Accessibility | Requires dialog semantics, labelled search, active descendant or roving focus, Escape close, and focus restoration. |

## Formal Purpose

Coordinate keyboard-first command discovery and execution with dialog behavior, query input, grouped commands, empty recovery, topbar boundary, and feedback.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Docs Shell Template` |

## Formal States

- `closed`
- `open`
- `querying`
- `results`
- `empty`
- `loading`
- `disabled-command`
- `executing`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
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
- `Dialog`
- `Empty State`
- `Input`
- `Menu`
- `Toast`

### Patterns

- `Search`
- `Topbar`

### Tokens

- `comp.button.*`
- `comp.dialog.*`
- `comp.empty-state.*`
- `comp.input.*`
- `comp.menu.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `surface` | `component` | `Dialog` |
| `query` | `component` | `Input` |
| `commands` | `component` | `Menu`, `Button`, `Empty State`, `Toast` |

## Formal Governance

### Entry Conditions

- Users need fast command discovery or keyboard execution.
- Commands can be grouped, disabled, loading, empty, or permission constrained.
- Topbar may host the trigger, but not the command implementation.

### Decision Tree

- Use Search for entity lookup.
- Use Command Palette when query results execute commands or navigation.
- Use Menu for short contextual action lists.

### Failure Modes

- Palette is implemented as custom overlay outside Dialog.
- Entity search and command execution are mixed without clear boundary.
- Disabled commands lack reasons.
- Keyboard behavior differs from Dialog/Menu expectations.

### Success Metrics

- Users can open, search, navigate, and execute commands quickly.
- Keyboard and screen reader users receive command grouping and result state.
- Topbar owns trigger placement only.

### Accessibility

- Use Dialog focus trap and return.
- Expose command names and disabled reasons.
- Do not treat command execution as entity search.

### Tests

- Composes Dialog, Input, Menu, Button, Empty State, and Toast.
- Covers open, querying, results, empty, loading, disabled, and executing states.
- Keeps Search and Topbar as boundaries.

### Agent Instructions

- Do not implement raw modal or menu behavior.
- Keep command registry and authorization outside the pattern.
- Ask before executing destructive or regulated commands.

### Reject If

- Overlay bypasses Dialog.
- Commands are custom rows outside Menu/Button.
- Search is cloned.
- Disabled reasons are missing.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Button \| IconButton \| KeyboardShortcut | yes | Opens the command palette after user action. |
| search | Input | yes | Filters commands and routes. |
| groups | CommandGroup[] | yes | Grouped routes, actions, entities, or help results. |
| result | CommandResult | yes | Label, description, type, disabled state, and command owner. |
| emptyState | EmptyState | yes | Recovery when no command matches. |
| feedback | Toast \| InlineValidation | conditional | Reports executed command or blocked action. |

## Components Used

- Dialog
- Input
- Menu
- Button
- Empty State
- Toast

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Navigation commands | Current candidate | Routes and recents grouped with keyboard access. |
| Action commands | Candidate | Permissioned commands with confirmation when risk exists. |
| No results | Required state | Empty state gives recovery and support path. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Open and close | Dialog opens after user action; reduced motion removes decorative movement. |
| Result filtering | Results update without layout jump or focus loss. |
| Command feedback | Execution reports success, blocked, or confirmation-required state. |

## Accessibility

- Palette opens only after trigger or shortcut.
- Search has a programmatic label.
- Keyboard users can move through results and close with Escape.
- Disabled or permissioned commands are announced before execution.
- No-result state is announced and includes recovery.

## Implementation Checklist

- Declare `trigger`: Opens the command palette after user action.
- Declare `search`: Filters commands and routes.
- Declare `groups`: Grouped routes, actions, entities, or help results.
- Declare `result`: Label, description, type, disabled state, and command owner.
- Declare `emptyState`: Recovery when no command matches.
- Trigger opens the palette and focuses search.
- Typing filters results and exposes no-result recovery.
- Escape closes the palette and restores focus.
- Permissioned command does not execute silently.
- Mobile fallback avoids covering critical context without a close path.

## Tests And Rejection Rules

Must test:

- Trigger opens the palette and focuses search.
- Typing filters results and exposes no-result recovery.
- Escape closes the palette and restores focus.
- Permissioned command does not execute silently.
- Mobile fallback avoids covering critical context without a close path.

Reject if:

- It is only a visual search box.
- Commands execute without permission or confirmation policy.
- Keyboard navigation is not defined.

## MIEL

Agents can decide:

- Use Command Palette when routes/actions and permission rules are defined.
- Group results by route, entity, action, or help topic.
- Show no-result recovery when search has no match.

Agents must ask:

- Command execution, permissions, analytics, destructive confirmation, or shortcut ownership is unclear.
- Commands affect money, access, compliance, or irreversible state.

Agents must reject:

- It is only a visual search box.
- Commands execute without permission or confirmation policy.
- Keyboard navigation is not defined.

Handoff language:

> Confirm trigger, shortcut, result groups, command execution policy, permission checks, empty state, and feedback.
