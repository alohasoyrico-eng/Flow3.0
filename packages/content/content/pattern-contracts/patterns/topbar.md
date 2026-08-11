# Topbar

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/topbar/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/topbar.json`

## Purpose

Keep product or documentation identity, navigation entry, search, utility actions, notification status, and account access stable while the page content changes.

## Use When

- A shell needs persistent access to brand, search, navigation entry, and global utilities.
- Navigation, search, notifications, and account actions must stay available across detail pages.
- The layout can declare slot priority for full, compact, and mobile viewports.

## Do Not Use Without Review

- Search results, history, recents, permissions, or command execution are required; escalate to Global Search or Command Palette.
- Notification content, read/unread state, or routing is required; escalate to Notification Center.
- Account actions affect permissions, session, billing, or workspace switching policy.
- A new logo hierarchy, co-branding model, or unaudited brand slot is requested.
- Mobile hides search, navigation, account, or critical utilities.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines height, slot priority, responsive wrap, safe target size, and search/navigation allocation. |
| Voice | Owns brand labels, placeholder copy, accessible names, account labels, and search result labels. |
| Energy | Controls surface, active collection, search focus, notification count, hover, and focus states. |
| Depth | Separates sticky shell, search results, and account menu without turning the topbar into a card. |
| Momentum | Controls search focus reveal, menu panel entry, action feedback, and reduced-motion fallback. |
| State | Selected navigation, unread notification, open account menu, search focus, pressed, disabled, and hover states are explicit. |
| Tone | Topbar remains neutral; notification tone changes only when count or status requires it. |
| Growth | Collection counts and unread counts are metadata, not primary navigation labels. |
| Symbol | Action symbols support labels and slots; they never replace accessible names. |
| Iconography | Utility icons use system sizing and optical alignment; brand slot can swap logo safely. |
| Accessibility | Landmarks, role search, aria-current, aria-haspopup, aria-expanded, focus ring, Escape, and reduced motion are required. |

## Formal Purpose

Coordinate global shell actions, search/command/account/notification triggers, responsive drawer entry, and sidebar boundary while templates own product route inventory and shell placement.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Fleet Manager Desktop`, `Fleet Dashboard Suite`, `Configuration Console`, `Agent Workspace`, `Internal Operations Console` |

## Formal States

- `default`
- `dense`
- `mobile`
- `search-active`
- `notifications-unread`
- `account-open`
- `loading`
- `permission-filtered`

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
- `Field Action`
- `Focus`
- `Iconography`
- `Loading`
- `Measurement`
- `Message`
- `Motion Curves`
- `Radius`
- `Research`
- `Spacing`
- `Typography`

### Components

- `Avatar`
- `Badge`
- `Drawer`
- `Icon Button`
- `Input`
- `Menu`

### Patterns

- `Autocomplete`
- `Avatar Menu`
- `Command Palette`
- `Notification Panel`
- `Search`
- `Settings`
- `Sidebar`

### Tokens

- `comp.avatar.*`
- `comp.badge.*`
- `comp.drawer.*`
- `comp.icon-button.*`
- `comp.input.*`
- `comp.menu.*`
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
| `globalTriggers` | `component` | `Icon Button`, `Badge`, `Input` |
| `account` | `component` | `Avatar`, `Menu` |
| `responsiveNavigation` | `component` | `Drawer`, `Icon Button` |
| `autocompleteBoundary` | `pattern` | `Autocomplete` |
| `avatar-menuBoundary` | `pattern` | `Avatar Menu` |
| `command-paletteBoundary` | `pattern` | `Command Palette` |
| `notificationBoundary` | `pattern` | `Notification Panel` |
| `searchBoundary` | `pattern` | `Search` |
| `settingsBoundary` | `pattern` | `Settings` |
| `sidebarBoundary` | `pattern` | `Sidebar` |

## Formal Governance

### Entry Conditions

- A shell needs global actions, account access, search/command triggers, notification entry, or responsive navigation trigger.
- Template owns shell placement, route set, and product-specific actions.
- Topbar coordinates boundaries without owning their internal behavior.

### Decision Tree

- Use Toolbar for local page actions.
- Use Topbar for global shell actions and triggers.
- Use Sidebar for navigation region behavior and route grouping.

### Failure Modes

- Topbar implements Search, Command Palette, Avatar Menu, Notification Panel, Settings, or Sidebar internals.
- Template route inventory is hardcoded.
- Responsive drawer trigger conflicts with Sidebar.
- Global and local actions are mixed.

### Success Metrics

- Users can distinguish global shell actions from local page actions.
- Triggers route to owned patterns without duplicated visuals.
- Templates can alter shell composition without changing Flow behavior.

### Accessibility

- Expose shell region and trigger labels.
- Preserve focus when opening delegated patterns.
- Do not hide global actions behind unlabeled icons.

### Tests

- Composes Avatar, Badge, Drawer, Icon Button, Input, and Menu.
- Covers dense, mobile, active search, unread notifications, account, loading, and permission-filtered states.
- Keeps delegated patterns and templates as boundaries.

### Agent Instructions

- Do not implement delegated pattern internals.
- Do not hardcode product routes or tenant policy.
- Ask before adding global actions that affect billing, security, identity, or regulated data.

### Reject If

- Search/command/account/notification/sidebar internals are cloned.
- Template shell policy is embedded.
- Global icons are unlabeled.
- Toolbar local actions are mixed into Topbar.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| leading | TopbarLeadingSlot | yes | Menu trigger, product switcher, or sidebar drawer entry. |
| brand | BrandSlot | yes | Logo, wordmark, mark, co-brand, or partner mark with accessible home label. |
| sections | TopbarSection[] | conditional | Parent/child navigation before search for product shells. |
| search | SearchSlot | conditional | Consumes Search and Autocomplete behavior through the shared search slot. |
| actions | TopbarAction[] | optional | Icon Button/Menu actions such as language, contrast, grid, help, or notifications. |
| notifications | NotificationPanelSlot | optional | Consumes Notification Panel for count, list, empty state, and feedback behavior. |
| account | AvatarMenuSlot | optional | Consumes Avatar Menu for profile, settings, workspace, and sign out. |
| responsiveMode | full \| compact \| mobile | yes | Defines which slots stay visible, compress, or move to sidebar/drawer. |

## Components Used

- Icon Button
- Input
- Badge
- Avatar
- Menu
- Drawer

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Docs shell | Current | Brand, search, language, grid, contrast, and sidebar drawer entry. |
| Compact menu | Current | The menu button appears for the responsive sidebar drawer. |
| Sections + account | Current | Parent/child sections before search plus Notification Panel and Avatar Menu slots. |
| Brand slot | Candidate | Logo swaps and co-branding need product rules before becoming a documented variant. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Search focus | Uses system transition for focus treatment and result reveal; reduced motion removes decorative movement. |
| Account menu | Opens only after user interaction, with focus-visible state and Escape behavior. |
| Drawer trigger | Controls the Sidebar drawer on small viewports and updates expanded state. |

## Accessibility

- Use a header landmark with an accessible label.
- Keep search inside role=search and preserve a visible or visually hidden label.
- Every icon-only action has an accessible name.
- Account trigger exposes menu intent and opens only after interaction.
- Notification count is text-backed through Badge, not color-only.
- Compact/mobile mode preserves navigation, search, and account access.

## Implementation Checklist

- Declare `leading`: Menu trigger, product switcher, or sidebar drawer entry.
- Declare `brand`: Logo, wordmark, mark, co-brand, or partner mark with accessible home label.
- Declare `responsiveMode`: Defines which slots stay visible, compress, or move to sidebar/drawer.
- Full, compact, and mobile viewport slot priority.
- Keyboard focus order across menu, brand, sections, search, actions, and account.
- Notification Panel and Avatar Menu open after interaction and can close without trapping focus.
- Notification Badge remains readable in light and dark modes.
- No hardcoded colors, spacing, type, or custom button shapes outside Design System tokens/components.

## Tests And Rejection Rules

Must test:

- Full, compact, and mobile viewport slot priority.
- Keyboard focus order across menu, brand, sections, search, actions, and account.
- Notification Panel and Avatar Menu open after interaction and can close without trapping focus.
- Notification Badge remains readable in light and dark modes.
- No hardcoded colors, spacing, type, or custom button shapes outside Design System tokens/components.

Reject if:

- Search, notifications, or account menu are visual-only.
- Mobile hides critical access.
- The pattern creates custom controls instead of consuming Package components or shell classes.

## MIEL

Agents can decide:

- Slot order when product rules are already declared.
- Whether notifications or account slots are visible when their data is explicit.
- Responsive mode among full, compact, and mobile.

Agents must ask:

- Logo, co-brand, search behavior, notification policy, account actions, or workspace policy changes.
- A slot needs behavior that belongs to Global Search, Command Palette, Notification Center, or a session pattern.

Agents must reject:

- Search, notifications, or account menu are visual-only.
- Mobile hides critical access.
- The pattern creates custom controls instead of consuming Package components or shell classes.

Handoff language:

> Confirm slot priority, brand rules, search boundary, notification policy, account actions, and mobile fallback.
