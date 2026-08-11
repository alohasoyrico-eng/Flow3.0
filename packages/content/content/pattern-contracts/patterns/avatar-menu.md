# Avatar Menu

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/avatar-menu/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/avatar-menu.json`

## Purpose

Expose account, settings, and session actions from an avatar trigger while preserving one shared menu interaction model.

## Use When

- A shell or product surface needs account-level actions.
- The trigger identity matters more than an icon-only overflow action.
- Actions are compact, secondary, and tied to user/session context.

## Do Not Use Without Review

- The menu contains forms, long explanations, or multi-step settings.
- The avatar is used only as decoration and does not open account actions.
- The action set includes destructive or compliance actions without confirmation rules.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines trigger size, panel width, section separation, and edge alignment. |
| Voice | Owns short account labels, session action labels, and destructive copy. |
| Energy | Preserves neutral shell behavior; danger is only used for risky session actions when needed. |
| Depth | Menu panel floats above shell content without becoming a card. |
| Momentum | Trigger and panel reveal use the same menu rhythm as other contextual actions. |
| Accessibility | Avatar trigger announces the account menu, expanded state, menu role, and focus return. |

## Formal Purpose

Coordinate identity-triggered account actions through Avatar and Menu while keeping account settings and profile management as separate host flows.

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
- `loading`
- `permission-blocked`
- `disabled`
- `signing-out`

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
- `Disabled`
- `Duration`
- `Elevation`
- `Focus`
- `Iconography`
- `Measurement`
- `Message`
- `Motion Curves`
- `Radius`
- `Spacing`
- `Typography`

### Components

- `Avatar`
- `Menu`

### Patterns

- `Settings`

### Tokens

- `comp.avatar.*`
- `comp.menu.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `trigger` | `component` | `Avatar` |
| `actions` | `component` | `Menu` |

## Formal Governance

### Entry Conditions

- A signed-in identity needs a compact trigger for account, profile, status, or sign-out actions.
- The menu must expose identity context without owning settings screens.
- Actions are short menu commands, not a full admin surface.

### Decision Tree

- Use Avatar alone for identity display.
- Use Avatar Menu when the avatar opens account actions.
- Use Settings when users edit preferences or account configuration.

### Failure Modes

- Avatar becomes a custom menu button.
- Menu items navigate to settings while also owning settings UI.
- Sign-out or destructive actions lack confirmation policy.
- Identity data is exposed without permission review.

### Success Metrics

- Users can identify the account and open actions predictably.
- Keyboard and screen reader users can operate the menu.
- Settings remains a boundary, not duplicated markup.

### Accessibility

- Expose the avatar trigger as an account menu control.
- Preserve Menu keyboard behavior.
- Do not expose hidden identity data in visual-only content.

### Tests

- Composes Avatar and Menu only.
- Keeps Settings as route/host boundary.
- Covers open, disabled, loading, permission, and sign-out states.

### Agent Instructions

- Do not create custom dropdown markup.
- Keep preference editing in Settings.
- Ask before exposing identity, tenant, role, or sign-out behavior.

### Reject If

- Avatar trigger bypasses Avatar.
- Dropdown bypasses Menu.
- Settings UI is duplicated inside the menu.
- Keyboard navigation differs from Menu.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| trigger | Menu variant: avatar-trigger | yes | Uses the shared Menu trigger that composes Avatar internally. |
| avatar | Avatar | yes | Shows account identity and optional status inside the trigger. |
| items | MenuItem[] | yes | Profile, settings, help, and session actions. |
| sections | separator | conditional | Separates account actions from session/destructive actions. |

## Components Used

- Menu
- Avatar

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Account | Current | Avatar trigger with profile, settings, and sign out. |
| Workspace | Supported | Avatar trigger with workspace and help actions. |
| Session risk | Supported | Session action uses danger tone when it ends access. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Open | Panel opens after user interaction and inherits Menu reveal motion. |
| Close | Escape, outside click, or item selection closes and returns focus. |
| Selection | Selected actions close the panel and hand off feedback to the caller. |

## Accessibility

- Trigger uses aria-haspopup menu and aria-expanded.
- Panel uses role menu and items use role menuitem.
- Escape closes and returns focus to the avatar trigger.
- The avatar has an accessible name through the trigger label.
- Danger actions are not communicated through color alone.

## Implementation Checklist

- Declare `trigger`: Uses the shared Menu trigger that composes Avatar internally.
- Declare `avatar`: Shows account identity and optional status inside the trigger.
- Declare `items`: Profile, settings, help, and session actions.
- Avatar trigger opens and closes the shared Menu panel.
- Keyboard users can open with Enter or ArrowDown.
- Escape closes and restores focus.
- Account and session sections are separated.
- No shell or template creates a parallel account menu implementation.

## Tests And Rejection Rules

Must test:

- Avatar trigger opens and closes the shared Menu panel.
- Keyboard users can open with Enter or ArrowDown.
- Escape closes and restores focus.
- Account and session sections are separated.
- No shell or template creates a parallel account menu implementation.

Reject if:

- The trigger is a raw button or details element outside Menu.
- Avatar and menu are implemented separately for the same trigger.
- Session actions lack close behavior or focus recovery.

## MIEL

Agents can decide:

- Use Avatar Menu for compact account/session actions.
- Use separators when account and session actions have different risk.
- Use the shared Menu avatar-trigger variant instead of local details markup.

Agents must ask:

- Actions change permissions, billing, legal state, or identity.
- The menu needs forms, long settings, or onboarding content.
- The avatar identity source is unknown.

Agents must reject:

- The trigger is a raw button or details element outside Menu.
- Avatar and menu are implemented separately for the same trigger.
- Session actions lack close behavior or focus recovery.

Handoff language:

> Confirm identity source, action order, session risk, and whether any item should escalate to Dialog or Drawer.
