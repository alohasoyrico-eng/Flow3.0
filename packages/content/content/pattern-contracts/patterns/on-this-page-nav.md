# On This Page Nav

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/on-this-page-nav/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/on-this-page-nav.json`

## Purpose

Expose local anchors for long documentation pages without taking over primary navigation.

## Use When

- A long documentation detail page needs local section navigation.
- A page mixes tabs, anchors, or section groups.
- Local navigation must not become primary app navigation.

## Do Not Use Without Review

- The links navigate between primary sections of the product shell.
- A sidebar or topbar already owns the navigation scope.
- Items are not anchorable or focusable.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Local nav has a label and active state. |
| Frame | Sticky, collapsed, overflow, dark, and mobile layouts are explicit. |
| Depth | Surface owns the local nav boundary. |
| State | Active, collapsed, sticky, overflow, dark, and mobile states are declared. |
| Voice | Item labels and badges stay human-readable. |
| Energy | Governs accent, status, and interactive emphasis through Flow tokens. |
| Growth | Governs maturity, coverage, and documentation status signals. |
| Iconography | Governs functional glyph usage without parallel icon styling. |
| Momentum | Governs motion timing and responsive transition behavior. |
| Symbol | Governs symbolic visuals while labels and fallback text remain visible. |
| Tone | Governs semantic color/copy tone without local palette decisions. |

## Formal Purpose

Coordinate local page navigation across documentation sections, tabs, anchors, active section state, and responsive collapse without duplicating Sidebar or Tabs behavior.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Web documentation |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Template Dependencies | `Reference Detail Template`, `Component Detail Template`, `Pattern Detail Template` |

## Formal States

- `default`
- `sticky`
- `collapsed`
- `active-section`
- `overflow`
- `mobile`
- `dark`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Frame`
- `Depth`
- `State`
- `Voice`
- `Energy`
- `Growth`
- `Iconography`
- `Momentum`
- `Symbol`
- `Tone`

### Primitives

- `Surface`
- `Typography`
- `Spacing`
- `Breakpoints`
- `Density`
- `Focus`
- `Color`
- `Disabled`
- `Duration`
- `Iconography`
- `Loading`
- `Motion Curves`
- `Radius`

### Components

- `Badge`
- `Button`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `sys.accessibility.*`
- `sys.frame.*`
- `sys.depth.*`
- `sys.state.*`
- `sys.voice.*`
- `sys.energy.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.symbol.*`
- `sys.tone.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `items` | `component` | `Button` |
| `badge` | `component` | `Badge` |
| `body` | `channel` | `host content` |

## Formal Governance

### Entry Conditions

- A long documentation detail page needs local section navigation.
- A page mixes tabs, anchors, or section groups.
- Local navigation must not become primary app navigation.

### Decision Tree

- Use Tabs for short mutually exclusive panels.
- Use On This Page Nav for long pages with anchorable sections.
- Use Sidebar for app-level navigation only.
- Use Documentation Page Shell to position the local navigation rail.

### Failure Modes

- Local nav duplicates Sidebar responsibilities.
- Tabs and anchor nav are both active for the same content without a clear hierarchy.
- Active section is color-only.
- Mobile local navigation has no collapse or focus recovery.

### Success Metrics

- Users can scan long docs pages and jump to sections.
- Active section state remains clear in desktop and mobile.
- Local navigation never changes app route ownership.

### Accessibility

- Use nav landmarks only when the host page can distinguish local nav from primary nav.
- Keep anchor targets focusable or announceable.
- Preserve keyboard traversal and visible focus.
- Optional icons never replace anchor text; labels remain visible with fallback meaning.

### Tests

- Covers default, sticky, collapsed, active-section, overflow, mobile, and dark states.
- Verifies Sidebar and On This Page Nav landmarks are distinct.
- Checks active section is not color-only.

### Agent Instructions

- Do not use Sidebar for local page anchors.
- Do not create custom tablists inside FlowDocs.
- Ask before mixing tabs and anchor navigation on the same content group.

### Reject If

- The local nav changes app route groups.
- A docs page implements custom tablist or anchor wrappers.
- Active section state depends only on color.
- Mobile local nav cannot be opened, closed, and refocused predictably.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| items | Button[] | yes | Local page anchors. |
| badge | Badge | conditional | Section count or state. |
| body | ReactNode | conditional | Supplemental local nav content. |

## Components Used

- Badge
- Button

## Variants

## Motion Contract

## Accessibility

- Use nav landmarks only when the host page can distinguish local nav from primary nav.
- Keep anchor targets focusable or announceable.
- Preserve keyboard traversal and visible focus.

## Implementation Checklist

- Declare `items`: Local page anchors.
- Covers default, sticky, collapsed, active-section, overflow, mobile, and dark states.
- Verifies Sidebar and On This Page Nav landmarks are distinct.
- Checks active section is not color-only.

## Tests And Rejection Rules

Must test:

- Covers default, sticky, collapsed, active-section, overflow, mobile, and dark states.
- Verifies Sidebar and On This Page Nav landmarks are distinct.
- Checks active section is not color-only.

Reject if:

- The local nav changes app route groups.
- Active section state depends only on color.

## MIEL

Agents can decide:

- Use On This Page Nav for local documentation anchors.

Agents must ask:

- Tabs and anchor navigation are mixed on the same content group.

Agents must reject:

- The local nav changes app route groups.
- Active section state depends only on color.
