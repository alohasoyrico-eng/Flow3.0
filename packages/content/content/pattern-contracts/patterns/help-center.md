# Help Center

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/help-center/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/help-center.json`

## Purpose

Help users find support content through search, category navigation, article state, tags, empty states, and recovery without leaving product context.

## Use When

- A product surface needs searchable help, FAQs, onboarding guidance, or support articles.
- Content has categories, tags, keywords, and article detail.
- Search, no-result recovery, and navigation behavior need consistent ownership.

## Do Not Use Without Review

- The content is a single static help block.
- Search has no keywords, tags, empty state, or recovery path.
- Article content, support routing, or localization ownership is unclear.
- The pattern duplicates product navigation instead of supporting help content.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines category/sidebar layout, article width, search placement, and responsive stack. |
| Voice | Owns article titles, category labels, no-result copy, tags, and support escalation language. |
| Energy | Controls selected article, search focus, category state, and result emphasis. |
| State | Searching, results, no results, article selected, loading, and support escalation states are explicit. |
| Growth | Tags and keywords provide compact metadata for discovery. |
| Accessibility | Search label, navigable categories, article headings, focus movement, and no-result announcement are required. |

## Formal Purpose

Coordinate contextual support content with searchable topics, expandable answers, drawer presentation, empty recovery, and sidebar boundary.

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
- `results`
- `empty`
- `topic-selected`
- `error`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Energy`
- `Frame`
- `Growth`
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
- `Research`
- `Spacing`
- `Surface`
- `Typography`

### Components

- `Accordion`
- `Drawer`
- `Empty State`
- `Input`
- `Tag`

### Patterns

- `Search`
- `Sidebar`

### Tokens

- `comp.accordion.*`
- `comp.drawer.*`
- `comp.empty-state.*`
- `comp.input.*`
- `comp.tag.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `surface` | `component` | `Drawer` |
| `topics` | `component` | `Accordion`, `Tag`, `Input` |
| `recovery` | `component` | `Empty State` |
| `searchBoundary` | `pattern` | `Search` |
| `sidebarBoundary` | `pattern` | `Sidebar` |

## Formal Governance

### Entry Conditions

- Users need contextual help, FAQs, topic browsing, or guided recovery.
- Help content can be searched, empty, filtered, or loaded inside a drawer.
- Sidebar may host navigation, but help content owns support interaction.

### Decision Tree

- Use Accordion for static FAQ content.
- Use Help Center when support content needs search, topic grouping, or drawer behavior.
- Use Sidebar for app navigation, not support-answer ownership.

### Failure Modes

- Help search clones Search behavior.
- Drawer is recreated manually.
- Topics are custom pills instead of Tag.
- Support content becomes a product template or knowledge base app.

### Success Metrics

- Users can find support content and recover from empty searches.
- Keyboard and screen reader users can navigate topics and answers.
- Search and Sidebar remain boundaries instead of internal implementations.

### Accessibility

- Expose topic structure and answer expansion state.
- Keep drawer focus behavior intact.
- Do not rely on search-only access to help topics.

### Tests

- Composes Accordion, Drawer, Empty State, Input, and Tag.
- Covers open, loading, results, empty, selected topic, error, and disabled states.
- Keeps Search and Sidebar as composition boundaries.

### Agent Instructions

- Keep support taxonomy/content source outside the pattern.
- Do not duplicate Search or Sidebar internals.
- Ask before surfacing legal, safety, medical, or financial guidance.

### Reject If

- Help search is a second Search implementation.
- Drawer bypasses Drawer.
- Topics bypass Tag/Accordion.
- Sidebar owns support content behavior.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| search | SearchInputSlot | yes | Searches title, body, tags, and keywords. |
| categories | HelpCategory[] | yes | Grouped navigation with article counts or section labels. |
| results | HelpResult[] | conditional | Flat result list when search is active. |
| article | HelpArticle | yes | Selected article content with title, body, tags, and support links. |
| emptyState | EmptyState | yes | No-result recovery with clear next step. |
| supportEscalation | SupportAction[] | optional | Contact/support links when self-service fails. |
| responsiveMode | sidebar \| stacked \| drawer | yes | Desktop can use sidebar; mobile stacks or uses drawer. |

## Components Used

- Input
- Accordion
- Tag
- Empty State
- Drawer

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Category browse | Current candidate | Categories expand while no search is active. |
| Search results | Current candidate | Search switches to flat ranked results. |
| Article detail | Current candidate | Article content, tags, and related support actions. |
| Mobile support | Candidate | Category navigation moves to drawer or stacked index. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Search results | Results update without page jump; reduced motion removes reveal animation. |
| Category disclosure | Uses system disclosure motion and keeps focus stable. |
| Article change | Moves focus to article heading after user selection. |

## Accessibility

- Search has a visible or visually hidden label.
- Category navigation is keyboard accessible.
- Selected article heading receives focus after navigation.
- No results are announced and include recovery.
- Support escalation links are explicit and not hidden behind icon-only controls.

## Implementation Checklist

- Declare `search`: Searches title, body, tags, and keywords.
- Declare `categories`: Grouped navigation with article counts or section labels.
- Declare `article`: Selected article content with title, body, tags, and support links.
- Declare `emptyState`: No-result recovery with clear next step.
- Declare `responsiveMode`: Desktop can use sidebar; mobile stacks or uses drawer.
- Search matches title, tag, and keyword content.
- No-result state gives recovery path.
- Category browsing works without search.
- Article selection updates heading and focus.
- Mobile layout keeps search and article access visible.
- Localization can replace article/category text without layout breakage.

## Tests And Rejection Rules

Must test:

- Search matches title, tag, and keyword content.
- No-result state gives recovery path.
- Category browsing works without search.
- Article selection updates heading and focus.
- Mobile layout keeps search and article access visible.
- Localization can replace article/category text without layout breakage.

Reject if:

- Search has no recovery path.
- Articles are unstructured blobs without headings or tags.
- Help navigation replaces product navigation.

## MIEL

Agents can decide:

- Use Help Center when content categories, articles, tags, and search behavior are defined.
- Choose category browse or search result mode from user intent.
- Expose support escalation when self-service cannot answer.

Agents must ask:

- Content ownership, article source, localization, support routing, or search ranking is unclear.
- The help content includes legal, billing, medical, safety, or compliance instructions.

Agents must reject:

- Search has no recovery path.
- Articles are unstructured blobs without headings or tags.
- Help navigation replaces product navigation.

Handoff language:

> Confirm article source, category model, keyword/tag strategy, no-result recovery, support escalation, localization, and mobile navigation.
