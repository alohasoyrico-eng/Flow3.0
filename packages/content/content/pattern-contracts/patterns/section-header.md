# Section Header

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/section-header/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/section-header.json`

## Purpose

Introduce dense product sections with title, supporting context, status, actions, overflow, and responsive priority rules.

## Use When

- A dashboard, table, form, or settings area needs a consistent section entry point.
- Actions, status, and description need clear priority.
- The section header coordinates local navigation or process state.

## Do Not Use Without Review

- A simple heading is enough.
- Actions are unrelated to the section.
- The header becomes a toolbar, alert, or navigation pattern.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines heading/action layout, wrap behavior, density, and spacing from content. |
| Voice | Owns title, description, status copy, and action labels. |
| Energy | Controls status, focus, action priority, and disabled treatment. |
| State | Default, loading, dirty, disabled, error, empty, and action-overflow states are explicit. |
| Depth | Overflow menus layer above the section without turning the header into a card. |
| Accessibility | Heading level, action grouping, status text, and overflow names are required. |

## Formal Purpose

Coordinate a local section title, status, actions, loading state, and host boundaries to Form Section, Settings, and Toolbar without becoming a page template.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Component Detail Template`, `Docs Collection Template`, `Docs Home Template`, `Pattern Detail Template`, `Reference Detail Template`, `Template Detail Template` |

## Formal States

- `default`
- `loading`
- `actionable`
- `disabled`
- `permission-blocked`
- `dirty`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
- `Energy`
- `Frame`
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
- `Focus`
- `Iconography`
- `Loading`
- `Measurement`
- `Message`
- `Motion Curves`
- `Radius`
- `Spacing`
- `Typography`

### Components

- `Badge`
- `Button`
- `Menu`
- `Skeleton`
- `Tag`

### Patterns

- `Form Section`
- `Settings`
- `Toolbar`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.menu.*`
- `comp.skeleton.*`
- `comp.tag.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `status` | `component` | `Badge`, `Tag`, `Skeleton` |
| `actions` | `component` | `Button`, `Menu` |
| `formBoundary` | `pattern` | `Form Section` |
| `settingsBoundary` | `pattern` | `Settings` |
| `toolbarBoundary` | `pattern` | `Toolbar` |

## Formal Governance

### Entry Conditions

- A section needs a title, description, status, and local actions.
- The header belongs to a reusable section, not a full business page.
- Actions may hand off to Toolbar, Settings, or Form Section.

### Decision Tree

- Use text heading alone for static content.
- Use Section Header when local status/actions/loading are part of a reusable section.
- Use Toolbar for dense action rows and Topbar for global shell actions.

### Failure Modes

- Header owns full page layout.
- Actions bypass Button/Menu.
- Status badges are custom tags.
- Skeleton/loading is visual-only.

### Success Metrics

- Users understand the section, state, and available local actions.
- Keyboard users can reach menus/actions predictably.
- Section ownership does not leak into templates.

### Accessibility

- Use proper heading level supplied by the host.
- Expose status in text.
- Keep action menus keyboard reachable.

### Tests

- Composes Badge, Button, Menu, Skeleton, and Tag.
- Covers loading, actionable, disabled, permission, and dirty states.
- Keeps Form Section, Settings, and Toolbar as composition boundaries.

### Agent Instructions

- Do not hardcode page layout or business copy.
- Do not clone Toolbar actions.
- Ask before representing compliance or permission status.

### Reject If

- Header includes full template structure.
- Actions bypass Button/Menu.
- Status is color-only.
- Loading bypasses Skeleton.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| title | Heading | yes | Section title with correct heading level. |
| description | Text | conditional | Short supporting context. |
| status | Badge \| Tag | conditional | State or metadata attached to the section. |
| actions | Button[] | conditional | Primary and secondary section actions. |
| overflow | Menu | conditional | Lower-priority actions on constrained viewports. |

## Components Used

- Badge
- Tag
- Button
- Menu
- Skeleton

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Dashboard section | Required | Title, status, and action align above a data module. |
| Form section | Candidate | Dirty or saved status appears near the title. |
| Responsive overflow | Required state | Secondary actions move to overflow when space is constrained. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Status update | Status text changes without shifting layout. |
| Overflow reveal | Menu uses Design System overlay motion and reduced-motion fallback. |
| Loading | Skeleton preserves header height. |

## Accessibility

- Heading level fits page structure.
- Status is text-backed.
- Actions have clear labels.
- Overflow menu is keyboard reachable.

## Implementation Checklist

- Declare `title`: Section title with correct heading level.
- Header wraps without overlapping actions.
- Status remains visible.
- Primary action is keyboard reachable.
- Overflow works on narrow viewports.

## Tests And Rejection Rules

Must test:

- Header wraps without overlapping actions.
- Status remains visible.
- Primary action is keyboard reachable.
- Overflow works on narrow viewports.

Reject if:

- A plain heading is enough.
- Actions are unrelated to the section.
- The header replaces Toolbar, Alert, or Navigation behavior.

## MIEL

Agents can decide:

- Use Section Header when a section needs title plus local status/actions.
- Keep actions scoped to the section.
- Use Button and Menu instead of custom action surfaces.

Agents must ask:

- Heading hierarchy, action ownership, status source, or overflow priority is unclear.
- Section actions affect financial, compliance, legal, or identity state.

Agents must reject:

- A plain heading is enough.
- Actions are unrelated to the section.
- The header replaces Toolbar, Alert, or Navigation behavior.

Handoff language:

> Confirm heading level, section scope, status source, action priority, overflow behavior, and responsive layout.
