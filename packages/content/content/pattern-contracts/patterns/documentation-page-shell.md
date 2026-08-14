# Documentation Page Shell

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/documentation-page-shell/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/documentation-page-shell.json`

## Purpose

Compose FlowDocs topbar, sidebar, local nav, background, and content regions through Flow-owned shell boundaries.

## Use When

- A documentation page needs shell navigation, topbar, content rail, background treatment, or grid overlay.
- The page is rendered by FlowDocs but structure must be owned by Flow.
- Responsive shell behavior must remain consistent across documentation templates.

## Do Not Use Without Review

- The page is embedded inside another app shell.
- A product template owns the navigation and chrome.
- The shell would duplicate Topbar or Sidebar internals.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Shell regions need clear landmarks and labels. |
| Depth | Background and shell surfaces define hierarchy without local cards. |
| Frame | Topbar, sidebar, local nav, and content regions keep stable responsive layout. |
| State | Desktop, mobile, sidebar, search, theme, grid, and loading states are declared. |
| Voice | Shell regions, search labels, and navigation labels remain explicit. |
| Energy | Governs accent, status, and interactive emphasis through Flow tokens. |
| Tone | Governs semantic color/copy tone without local palette decisions. |

## Formal Purpose

Coordinate documentation page chrome, responsive content rails, background treatment, grid overlay, and page-level navigation boundaries without FlowDocs owning shell markup.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Web documentation |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Template Dependencies | `Docs Shell Template`, `Docs Home Template`, `Docs Collection Template`, `Reference Detail Template`, `Component Detail Template`, `Pattern Detail Template`, `Template Detail Template` |

## Formal States

- `desktop`
- `mobile`
- `sidebar-open`
- `sidebar-closed`
- `search-open`
- `dark`
- `light`
- `grid-overlay-visible`
- `loading`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
- `Frame`
- `State`
- `Voice`
- `Energy`
- `Tone`

### Primitives

- `Surface`
- `Spacing`
- `Breakpoints`
- `Density`
- `Focus`
- `Color`
- `Typography`

### Tokens

- `sys.accessibility.*`
- `sys.depth.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`
- `sys.energy.*`
- `sys.tone.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `topbar` | `channel` | `Topbar` |
| `sidebar` | `channel` | `Sidebar` |
| `localNav` | `channel` | `On This Page Nav` |
| `content` | `primitive` | `Surface` |

## Formal Governance

### Entry Conditions

- A documentation page needs shell navigation, topbar, content rail, background treatment, or grid overlay.
- The page is rendered by FlowDocs but structure must be owned by Flow.
- Responsive shell behavior must remain consistent across documentation templates.

### Decision Tree

- Use Docs Shell Template for the complete shell.
- Use Documentation Page Shell as the reusable shell pattern inside docs templates.
- Use Topbar, Sidebar, and Search for their dedicated interaction responsibilities.
- Do not create a new foundation or primitive for docs-only background treatment unless existing Frame, Surface, Color, and Breakpoints cannot express it.

### Failure Modes

- FlowDocs owns static shell HTML or local shell CSS after this pattern exists.
- Grid overlay metrics or background treatment are unmanaged local CSS.
- Sidebar close behavior is duplicated outside the hamburger trigger.
- Topbar search width is controlled by docs-specific local overrides.

### Success Metrics

- All documentation templates render inside one governed shell boundary.
- Mobile navigation, search, theme, and active route state behave consistently.
- Page background and grid texture can be changed through Flow tokens and pattern slots.

### Accessibility

- Expose one navigation landmark for primary docs navigation.
- Keep sidebar toggle focusable and reversible with the same control on mobile.
- Preserve skip-link and heading order across templates.
- Do not communicate active state by color alone.

### Tests

- Desktop, mobile, dark, light, sidebar-open, sidebar-closed, and search-open states are covered.
- Topbar and Sidebar do not duplicate drawer ownership.
- No migrated docs page reintroduces local shell wrappers.

### Agent Instructions

- Do not hardcode FlowDocs shell DOM.
- Keep DocsShellTemplate as the template owner and this pattern as the reusable shell behavior.
- Reject docs-only background or grid CSS that bypasses Flow primitives.

### Reject If

- The page shell is implemented with local FlowDocs HTML wrappers.
- The grid texture or red/blue background treatment is an unmanaged CSS effect.
- Navigation counts, active state, or shell labels are static strings disconnected from the content model.
- Topbar, Sidebar, or Search behavior is reimplemented inside a docs template.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| topbar | Topbar | conditional | Global docs actions and search entry. |
| sidebar | Sidebar | conditional | Primary docs navigation. |
| localNav | On This Page Nav | conditional | Local page anchors. |
| content | Surface | yes | Documentation page body. |

## Components Used

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| content | Surface | yes | Documentation page body. |

## Variants

## Motion Contract

## Accessibility

- Expose one navigation landmark for primary docs navigation.
- Keep sidebar toggle focusable and reversible with the same control on mobile.
- Preserve skip-link and heading order across templates.
- Do not communicate active state by color alone.

## Implementation Checklist

- Declare `content`: Documentation page body.
- Desktop, mobile, dark, light, sidebar-open, sidebar-closed, and search-open states are covered.
- Topbar and Sidebar do not duplicate drawer ownership.
- No migrated docs page reintroduces local shell wrappers.

## Tests And Rejection Rules

Must test:

- Desktop, mobile, dark, light, sidebar-open, sidebar-closed, and search-open states are covered.
- Topbar and Sidebar do not duplicate drawer ownership.
- No migrated docs page reintroduces local shell wrappers.

Reject if:

- The page shell is implemented with local FlowDocs HTML wrappers.
- Topbar, Sidebar, or Search behavior is reimplemented inside a docs template.

## MIEL

Agents can decide:

- Use Documentation Page Shell for FlowDocs chrome.

Agents must ask:

- A docs-only background treatment cannot be expressed through existing primitives.

Agents must reject:

- The page shell is implemented with local FlowDocs HTML wrappers.
- Topbar, Sidebar, or Search behavior is reimplemented inside a docs template.
