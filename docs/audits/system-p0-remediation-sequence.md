# System P0 remediation sequence

Generated: 2026-08-11

This sequence is the remediation order implied by the forensic evidence. It is not an implementation patch.

## Why this order

FlowDocs cleanup depends on shell patterns, shell patterns depend on components/primitives, and primitives depend on token/foundation source. P0.1-P0.3 are measured by source gates and primitive runtime gates; FlowDocs remains blocked until shell patterns and docs ownership are resolved.

## Phases

| Phase | Name | Status | Tickets | Blockers | Exit criteria | Hotspot files |
| --- | --- | --- | ---: | --- | --- | --- |
| P0.1 | Style Dictionary foundation source | complete | 11 | None | token source is canonical JSON<br>foundation contracts have typed source<br>CSS variables are generated output, not source<br>docs visual tokens can map to generated outputs | ../FlowDocs/apps/docs/styles/03c-motion-reference-01.css (19)<br>../FlowDocs/apps/docs/styles/03a-reference-core-01.css (17)<br>../FlowDocs/apps/docs/styles/03b-foundation-reference-02.css (17)<br>../FlowDocs/apps/docs/styles/06-responsive-01.css (17)<br>../FlowDocs/apps/docs/styles/07-pattern-topbar.css (17)<br>../FlowDocs/apps/docs/styles/06-responsive-02.css (15)<br>../FlowDocs/apps/docs/styles/07-pattern-foundations.css (15)<br>../FlowDocs/apps/docs/styles/07-pattern-focused-demos.css (14)<br>../FlowDocs/apps/docs/styles/01-shell-01.css (13)<br>../FlowDocs/apps/docs/styles/01-shell-02.css (13)<br>../FlowDocs/apps/docs/styles/04m-tabs-docs.css (13)<br>../FlowDocs/apps/docs/styles/03c-motion-reference-02.css (12)<br>../FlowDocs/apps/docs/styles/04a-button-docs-01.css (12)<br>../FlowDocs/apps/docs/styles/04b-component-standard-layout.css (12)<br>../FlowDocs/apps/docs/styles/04i-simple-component-layout.css (12)<br>../FlowDocs/apps/docs/styles/05d-bottom-sheet-docs.css (12)<br>../FlowDocs/apps/docs/styles/07-pattern-docs.css (12)<br>../FlowDocs/apps/docs/styles/07-pattern-settings-help.css (12)<br>../FlowDocs/apps/docs/styles/07-pattern-topbar-sections.css (12)<br>../FlowDocs/apps/docs/styles/03a-reference-core-02.css (11) |
| P0.2 | Typed primitive runtime for missing primitives | complete | 17 | None | missing primitives have TS runtime or explicit non-runtime decision<br>surface/color/density/radius/elevation/focus/spacing/typography are available to higher layers<br>runtime without spec is classified | ../FlowDocs/apps/docs/primitive-reference.js (13)<br>../FlowDocs/apps/docs/primitive-tabs.js (5) |
| P0.3 | Convert existing primitive runtimes to TS contracts | complete | 7 | None | existing JS primitive runtimes are TS-authored or explicitly docs/asset-owned<br>asset primitives have export/ownership policy<br>generated types are derived from implementation | None |
| P0.4 | Shell pattern contracts | complete | 3 | None | topbar/sidebar/search contracts are TS-authored<br>docs shell behavior can consume Flow shell contracts<br>hamburger/search/dark-mode responsibilities are assigned to Flow or docs shell explicitly | ../FlowDocs/apps/docs/reference-demo-interactions.js (22)<br>../FlowDocs/apps/docs/component-demo-interactions.js (7)<br>../FlowDocs/apps/docs/template-desktop-interactions.js (5)<br>../FlowDocs/apps/docs/doc-interactions.js (4)<br>../FlowDocs/apps/docs/pattern-desktop-interactions.js (4)<br>../FlowDocs/apps/docs/shell-controls.js (4)<br>../FlowDocs/apps/docs/button-playground-interactions.js (3)<br>../FlowDocs/apps/docs/docs-chrome.js (3)<br>../FlowDocs/apps/docs/docs-layout.js (3)<br>../FlowDocs/apps/docs/index.html (3)<br>../FlowDocs/apps/docs/navigation.js (3)<br>../FlowDocs/apps/docs/pattern-advanced-filter-interactions.js (3)<br>../FlowDocs/apps/docs/pattern-roles-permissions-interactions.js (2)<br>../FlowDocs/apps/docs/pattern-column-configurator-interactions.js (1)<br>../FlowDocs/apps/docs/pattern-journey-interactions.js (1)<br>../FlowDocs/apps/docs/pattern-mobile-interactions.js (1)<br>../FlowDocs/apps/docs/progress-indicator-demo-interactions.js (1)<br>../FlowDocs/apps/docs/stateful-component-interactions.js (1) |
| P0.5 | FlowDocs P0 duplicate cleanup | ready | 38 | None | P0 docs surfaces are consume Flow, docs-owned content, merged, or removed<br>no P0 file is hand-implementing missing lower-layer behavior<br>forensic gates show reduced docs-hand-authored P0 count | ../FlowDocs/apps/docs/pattern-tabs.js (25)<br>../FlowDocs/apps/docs/template-domain-demos.js (20)<br>../FlowDocs/apps/docs/styles/03c-motion-reference-01.css (19)<br>../FlowDocs/apps/docs/styles/03a-reference-core-01.css (17)<br>../FlowDocs/apps/docs/styles/03b-foundation-reference-02.css (17)<br>../FlowDocs/apps/docs/styles/06-responsive-01.css (17)<br>../FlowDocs/apps/docs/styles/07-pattern-topbar.css (17)<br>../FlowDocs/apps/docs/template-desktop-demos.js (17)<br>../FlowDocs/apps/docs/pattern-shell-renderers.js (15)<br>../FlowDocs/apps/docs/styles/06-responsive-02.css (15)<br>../FlowDocs/apps/docs/styles/07-pattern-foundations.css (15)<br>../FlowDocs/apps/docs/styles/07-pattern-focused-demos.css (14)<br>../FlowDocs/apps/docs/pattern-focused-design.js (13)<br>../FlowDocs/apps/docs/styles/01-shell-01.css (13)<br>../FlowDocs/apps/docs/styles/01-shell-02.css (13)<br>../FlowDocs/apps/docs/styles/05d-bottom-sheet-docs.css (12)<br>../FlowDocs/apps/docs/styles/07-pattern-docs.css (12)<br>../FlowDocs/apps/docs/styles/07-pattern-settings-help.css (12)<br>../FlowDocs/apps/docs/styles/07-pattern-topbar-sections.css (12)<br>../FlowDocs/apps/docs/styles/03a-reference-core-02.css (11) |

## Iteration plan

| Iteration | Phase | Scope | Done when |
| ---: | --- | --- | --- |
| 1 | P0.1 | Install/configure Style Dictionary and define canonical token source shape. | dependency/config exists<br>source direction is JSON to outputs<br>old CSS-derived contract is marked transitional<br>forensic gate style-dictionary-real passes |
| 2 | P0.1 | Map foundation outputs and migrate token hotspot classes to generated token references. | foundation source covers color/radius/spacing/elevation/density/focus basics<br>foundation gate can distinguish source vs docs content |
| 3 | P0.2 | Create typed primitive runtime for surface, color, density, radius, elevation, focus. | P0 visual primitives have TS exports<br>components/patterns can import primitive contracts |
| 4 | P0.2-P0.3 | Create or type remaining P0 primitives and classify asset primitives. | all P0 primitives have runtime or explicit non-runtime owner decision<br>country-options is resolved |
| 5 | P0.4 | Audit and type topbar/sidebar/search Flow contracts against docs shell requirements. | shell pattern behavior is owned by Flow or explicitly docs-shell<br>parallel DOM handlers are listed for removal/replacement |
| 6 | P0.5 | Clean FlowDocs P0 shell and renderer duplicates only where lower-layer contracts now exist. | P0 owner decisions are applied<br>audit:p0-owner-decisions shows reduced hotspots<br>FlowDocs shell does not invent primitives/pattern behavior |

## Non-negotiable gates before FlowDocs changes

- Style Dictionary dependency and config exist.
- Canonical token source is JSON, not CSS-derived.
- Foundation outputs generate CSS variables and typed JS/TS exports.
- Primitive runtime exists in TypeScript for P0 primitives, especially `surface`, `color`, `density`, `radius`, `elevation`, `focus`, `spacing`, `typography`.
- `topbar`, `sidebar`, and `search` have stable Flow React contracts before docs shell consumes them.
