# System P0 forensic detail

Generated: 2026-08-11

This is a P0-only forensic detail report. It does not remediate implementation.

## P0 summary

- P0 tickets: 38
- Foundations: 11
- Primitives: 24
- Shell patterns: 3
- P0 docs hand surface files counted with duplicates per entity: 1059

## P0 category matrix

| Ticket | Docs hand files | Risk flags | Surface categories |
| --- | ---: | --- | --- |
| foundation:accessibility | 69 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 7<br>docs-foundation-detail-renderer: 1<br>docs-component-detail-renderer: 57<br>docs-pattern-detail-renderer: 2<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 1 |
| foundation:depth | 29 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 1<br>docs-pattern-detail-renderer: 3<br>docs-primitive-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 19 |
| foundation:energy | 48 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 3<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 40 |
| foundation:frame | 59 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 7<br>docs-foundation-detail-renderer: 3<br>docs-dom-interaction: 2<br>docs-css-visual-surface: 47 |
| foundation:growth | 11 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-foundation-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 5<br>docs-template-detail-renderer: 1 |
| foundation:iconography | 3 | docs-only visual surface risk | docs-misc-surface: 2<br>docs-css-visual-surface: 1 |
| foundation:momentum | 18 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 14 |
| foundation:state | 132 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 13<br>docs-dom-interaction: 11<br>docs-foundation-detail-renderer: 2<br>docs-component-detail-renderer: 60<br>docs-pattern-detail-renderer: 28<br>docs-primitive-detail-renderer: 2<br>docs-css-visual-surface: 13<br>docs-template-detail-renderer: 3 |
| foundation:symbol | 24 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-misc-surface: 6<br>docs-foundation-detail-renderer: 1<br>docs-shell: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 15 |
| foundation:tone | 67 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-misc-surface: 12<br>docs-dom-interaction: 3<br>docs-shell: 1<br>docs-foundation-detail-renderer: 3<br>docs-component-detail-renderer: 15<br>docs-pattern-detail-renderer: 25<br>docs-primitive-detail-renderer: 1<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 4<br>docs-template-detail-renderer: 2 |
| foundation:voice | 40 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-foundation-detail-renderer: 3<br>docs-pattern-detail-renderer: 1<br>docs-primitive-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 31 |
| primitive:animation-assets | 0 | None | None |
| primitive:breakpoints | 2 | parallel DOM behavior risk<br>missing primitive runtime | docs-misc-surface: 1<br>docs-dom-interaction: 1 |
| primitive:charts | 3 | parallel DOM behavior risk | docs-misc-surface: 2<br>docs-dom-interaction: 1 |
| primitive:color | 54 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 6<br>docs-foundation-detail-renderer: 1<br>docs-pattern-detail-renderer: 4<br>docs-primitive-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 41 |
| primitive:country-flags | 0 | None | None |
| primitive:density | 60 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk<br>missing primitive runtime | docs-dom-interaction: 3<br>docs-misc-surface: 4<br>docs-shell: 1<br>docs-foundation-detail-renderer: 3<br>docs-component-detail-renderer: 16<br>docs-home-renderer: 1<br>docs-pattern-detail-renderer: 10<br>docs-primitive-detail-renderer: 2<br>docs-css-visual-surface: 19<br>docs-template-detail-renderer: 1 |
| primitive:disabled | 27 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 6<br>docs-component-detail-renderer: 7<br>docs-dom-interaction: 4<br>docs-pattern-detail-renderer: 3<br>docs-primitive-detail-renderer: 1<br>docs-css-visual-surface: 5<br>docs-template-detail-renderer: 1 |
| primitive:duration | 11 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-foundation-detail-renderer: 1<br>docs-misc-surface: 4<br>docs-pattern-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 4 |
| primitive:elevation | 44 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 6<br>docs-foundation-detail-renderer: 1<br>docs-component-detail-renderer: 1<br>docs-pattern-detail-renderer: 17<br>docs-primitive-detail-renderer: 2<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 14<br>docs-template-detail-renderer: 2 |
| primitive:field-action | 0 | missing primitive runtime | None |
| primitive:focus | 34 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 7<br>docs-dom-interaction: 4<br>docs-component-detail-renderer: 5<br>docs-pattern-detail-renderer: 4<br>docs-primitive-detail-renderer: 1<br>docs-css-visual-surface: 13 |
| primitive:iconography | 3 | docs-only visual surface risk | docs-misc-surface: 2<br>docs-css-visual-surface: 1 |
| primitive:illustration-assets | 0 | None | None |
| primitive:library-sources | 0 | None | None |
| primitive:loading | 31 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 7<br>docs-dom-interaction: 3<br>docs-component-detail-renderer: 7<br>docs-home-renderer: 1<br>docs-pattern-detail-renderer: 8<br>docs-primitive-detail-renderer: 1<br>docs-css-visual-surface: 3<br>docs-template-detail-renderer: 1 |
| primitive:maps | 5 | parallel DOM behavior risk | docs-misc-surface: 4<br>docs-dom-interaction: 1 |
| primitive:measurement | 3 | docs-only visual surface risk<br>missing primitive runtime | docs-css-visual-surface: 2<br>docs-misc-surface: 1 |
| primitive:message | 34 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 9<br>docs-dom-interaction: 4<br>docs-foundation-detail-renderer: 1<br>docs-component-detail-renderer: 1<br>docs-pattern-detail-renderer: 13<br>docs-primitive-detail-renderer: 1<br>docs-css-visual-surface: 4<br>docs-template-detail-renderer: 1 |
| primitive:motion-curves | 2 | parallel DOM behavior risk<br>missing primitive runtime | docs-misc-surface: 1<br>docs-dom-interaction: 1 |
| primitive:radius | 51 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-dom-interaction: 2<br>docs-misc-surface: 5<br>docs-component-detail-renderer: 1<br>docs-primitive-detail-renderer: 1<br>docs-css-visual-surface: 42 |
| primitive:research | 3 | docs-only visual surface risk<br>missing primitive runtime | docs-pattern-detail-renderer: 1<br>docs-css-visual-surface: 2 |
| primitive:spacing | 14 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 2<br>docs-css-visual-surface: 8 |
| primitive:surface | 86 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 9<br>docs-foundation-detail-renderer: 2<br>docs-component-detail-renderer: 11<br>docs-pattern-detail-renderer: 18<br>docs-primitive-detail-renderer: 2<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 41<br>docs-template-detail-renderer: 2 |
| primitive:typography | 7 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-foundation-detail-renderer: 2<br>docs-misc-surface: 2<br>docs-primitive-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 1 |
| pattern:search | 48 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 5<br>docs-dom-interaction: 5<br>docs-component-detail-renderer: 2<br>docs-pattern-detail-renderer: 20<br>docs-css-visual-surface: 16 |
| pattern:sidebar | 17 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-dom-interaction: 2<br>docs-shell: 1<br>docs-misc-surface: 1<br>docs-pattern-detail-renderer: 8<br>docs-css-visual-surface: 5 |
| pattern:topbar | 20 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-shell: 2<br>docs-misc-surface: 1<br>docs-component-detail-renderer: 1<br>docs-pattern-detail-renderer: 6<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 9 |

## Shell pattern detail

| Ticket | Docs hand files | First surface files |
| --- | ---: | --- |
| pattern:search | 48 | ../FlowDocs/apps/docs/app.js (docs-misc-surface)<br>../FlowDocs/apps/docs/component-demo-interactions.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/doc-interactions.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/docs-shell-react.js (docs-misc-surface)<br>../FlowDocs/apps/docs/docs-state.js (docs-misc-surface)<br>../FlowDocs/apps/docs/gold-input-docs.js (docs-component-detail-renderer)<br>../FlowDocs/apps/docs/gold-slider-docs.js (docs-component-detail-renderer)<br>../FlowDocs/apps/docs/pattern-advanced-filter-interactions.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/pattern-build-gates.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-candidate-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-contract-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-design-lead.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-desktop-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-desktop-interactions.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/pattern-desktop-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-focused-design.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-journey-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-miel-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-mobile-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-operational-demos.js (docs-pattern-detail-renderer) |
| pattern:sidebar | 17 | ../FlowDocs/apps/docs/doc-interactions.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/docs-layout.js (docs-shell)<br>../FlowDocs/apps/docs/docs-shell-react.js (docs-misc-surface)<br>../FlowDocs/apps/docs/pattern-build-gates.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-design-lead.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-focused-design.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-journey-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-miel-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-react-shell-islands.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-shell-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/styles/01-shell-02.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/01-shell-react.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/06-responsive-01.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/06-responsive-02.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/08-template-desktop-demos.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/template-desktop-interactions.js (docs-dom-interaction) |
| pattern:topbar | 20 | ../FlowDocs/apps/docs/docs-chrome.js (docs-shell)<br>../FlowDocs/apps/docs/docs-shell-react.js (docs-misc-surface)<br>../FlowDocs/apps/docs/gold-icon-button-docs.js (docs-component-detail-renderer)<br>../FlowDocs/apps/docs/index.html (docs-shell)<br>../FlowDocs/apps/docs/pattern-design-lead.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-focused-design.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-miel-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-react-shell-islands.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-shell-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/shell-controls.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/styles/01-shell-01.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/01-shell-02.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/01-shell-hero.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/01-shell-react.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/03a-reference-core-01.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/06-responsive-01.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/06-responsive-02.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/07-pattern-focused-design.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/08-template-desktop-demos.css (docs-css-visual-surface) |

## Foundations detail

| Ticket | Docs hand files | Risk flags | Surface categories |
| --- | ---: | --- | --- |
| foundation:accessibility | 69 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 7<br>docs-foundation-detail-renderer: 1<br>docs-component-detail-renderer: 57<br>docs-pattern-detail-renderer: 2<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 1 |
| foundation:depth | 29 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 1<br>docs-pattern-detail-renderer: 3<br>docs-primitive-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 19 |
| foundation:energy | 48 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 3<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 40 |
| foundation:frame | 59 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 7<br>docs-foundation-detail-renderer: 3<br>docs-dom-interaction: 2<br>docs-css-visual-surface: 47 |
| foundation:growth | 11 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-foundation-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 5<br>docs-template-detail-renderer: 1 |
| foundation:iconography | 3 | docs-only visual surface risk | docs-misc-surface: 2<br>docs-css-visual-surface: 1 |
| foundation:momentum | 18 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 14 |
| foundation:state | 132 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 13<br>docs-dom-interaction: 11<br>docs-foundation-detail-renderer: 2<br>docs-component-detail-renderer: 60<br>docs-pattern-detail-renderer: 28<br>docs-primitive-detail-renderer: 2<br>docs-css-visual-surface: 13<br>docs-template-detail-renderer: 3 |
| foundation:symbol | 24 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-misc-surface: 6<br>docs-foundation-detail-renderer: 1<br>docs-shell: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 15 |
| foundation:tone | 67 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-misc-surface: 12<br>docs-dom-interaction: 3<br>docs-shell: 1<br>docs-foundation-detail-renderer: 3<br>docs-component-detail-renderer: 15<br>docs-pattern-detail-renderer: 25<br>docs-primitive-detail-renderer: 1<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 4<br>docs-template-detail-renderer: 2 |
| foundation:voice | 40 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-foundation-detail-renderer: 3<br>docs-pattern-detail-renderer: 1<br>docs-primitive-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 31 |

## Primitives detail

| Ticket | Docs hand files | Risk flags | Surface categories |
| --- | ---: | --- | --- |
| primitive:animation-assets | 0 |  |  |
| primitive:breakpoints | 2 | parallel DOM behavior risk<br>missing primitive runtime | docs-misc-surface: 1<br>docs-dom-interaction: 1 |
| primitive:charts | 3 | parallel DOM behavior risk | docs-misc-surface: 2<br>docs-dom-interaction: 1 |
| primitive:color | 54 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 6<br>docs-foundation-detail-renderer: 1<br>docs-pattern-detail-renderer: 4<br>docs-primitive-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 41 |
| primitive:country-flags | 0 |  |  |
| primitive:density | 60 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk<br>missing primitive runtime | docs-dom-interaction: 3<br>docs-misc-surface: 4<br>docs-shell: 1<br>docs-foundation-detail-renderer: 3<br>docs-component-detail-renderer: 16<br>docs-home-renderer: 1<br>docs-pattern-detail-renderer: 10<br>docs-primitive-detail-renderer: 2<br>docs-css-visual-surface: 19<br>docs-template-detail-renderer: 1 |
| primitive:disabled | 27 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 6<br>docs-component-detail-renderer: 7<br>docs-dom-interaction: 4<br>docs-pattern-detail-renderer: 3<br>docs-primitive-detail-renderer: 1<br>docs-css-visual-surface: 5<br>docs-template-detail-renderer: 1 |
| primitive:duration | 11 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-foundation-detail-renderer: 1<br>docs-misc-surface: 4<br>docs-pattern-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 4 |
| primitive:elevation | 44 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 6<br>docs-foundation-detail-renderer: 1<br>docs-component-detail-renderer: 1<br>docs-pattern-detail-renderer: 17<br>docs-primitive-detail-renderer: 2<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 14<br>docs-template-detail-renderer: 2 |
| primitive:field-action | 0 | missing primitive runtime |  |
| primitive:focus | 34 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 7<br>docs-dom-interaction: 4<br>docs-component-detail-renderer: 5<br>docs-pattern-detail-renderer: 4<br>docs-primitive-detail-renderer: 1<br>docs-css-visual-surface: 13 |
| primitive:iconography | 3 | docs-only visual surface risk | docs-misc-surface: 2<br>docs-css-visual-surface: 1 |
| primitive:illustration-assets | 0 |  |  |
| primitive:library-sources | 0 |  |  |
| primitive:loading | 31 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 7<br>docs-dom-interaction: 3<br>docs-component-detail-renderer: 7<br>docs-home-renderer: 1<br>docs-pattern-detail-renderer: 8<br>docs-primitive-detail-renderer: 1<br>docs-css-visual-surface: 3<br>docs-template-detail-renderer: 1 |
| primitive:maps | 5 | parallel DOM behavior risk | docs-misc-surface: 4<br>docs-dom-interaction: 1 |
| primitive:measurement | 3 | docs-only visual surface risk<br>missing primitive runtime | docs-css-visual-surface: 2<br>docs-misc-surface: 1 |
| primitive:message | 34 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 9<br>docs-dom-interaction: 4<br>docs-foundation-detail-renderer: 1<br>docs-component-detail-renderer: 1<br>docs-pattern-detail-renderer: 13<br>docs-primitive-detail-renderer: 1<br>docs-css-visual-surface: 4<br>docs-template-detail-renderer: 1 |
| primitive:motion-curves | 2 | parallel DOM behavior risk<br>missing primitive runtime | docs-misc-surface: 1<br>docs-dom-interaction: 1 |
| primitive:radius | 51 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-dom-interaction: 2<br>docs-misc-surface: 5<br>docs-component-detail-renderer: 1<br>docs-primitive-detail-renderer: 1<br>docs-css-visual-surface: 42 |
| primitive:research | 3 | docs-only visual surface risk<br>missing primitive runtime | docs-pattern-detail-renderer: 1<br>docs-css-visual-surface: 2 |
| primitive:spacing | 14 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 2<br>docs-css-visual-surface: 8 |
| primitive:surface | 86 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 9<br>docs-foundation-detail-renderer: 2<br>docs-component-detail-renderer: 11<br>docs-pattern-detail-renderer: 18<br>docs-primitive-detail-renderer: 2<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 41<br>docs-template-detail-renderer: 2 |
| primitive:typography | 7 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-foundation-detail-renderer: 2<br>docs-misc-surface: 2<br>docs-primitive-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 1 |

## Read the JSON for line evidence

The JSON companion includes line evidence for each listed file. Use it to classify each surface as consume Flow, docs-owned content, merge, or remove.
