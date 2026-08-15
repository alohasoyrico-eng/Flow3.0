# System P0 forensic detail

Generated: 2026-08-11

This is a P0-only forensic detail report. It does not remediate implementation.

## P0 summary

- P0 tickets: 38
- Foundations: 11
- Primitives: 24
- Shell patterns: 3
- P0 docs hand surface files counted with duplicates per entity: 1027

## P0 category matrix

| Ticket | Docs hand files | Risk flags | Surface categories |
| --- | ---: | --- | --- |
| foundation:accessibility | 69 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 7<br>docs-foundation-detail-renderer: 1<br>docs-component-detail-renderer: 57<br>docs-pattern-detail-renderer: 2<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 1 |
| foundation:depth | 28 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 1<br>docs-pattern-detail-renderer: 3<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 19 |
| foundation:energy | 49 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 3<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 41 |
| foundation:frame | 78 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 9<br>docs-foundation-detail-renderer: 3<br>docs-component-detail-renderer: 12<br>docs-pattern-detail-renderer: 2<br>docs-dom-interaction: 2<br>docs-css-visual-surface: 49<br>docs-template-detail-renderer: 1 |
| foundation:growth | 11 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-foundation-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 5<br>docs-template-detail-renderer: 1 |
| foundation:iconography | 3 | docs-only visual surface risk | docs-misc-surface: 2<br>docs-css-visual-surface: 1 |
| foundation:momentum | 18 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 14 |
| foundation:state | 135 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 15<br>docs-dom-interaction: 11<br>docs-foundation-detail-renderer: 2<br>docs-component-detail-renderer: 60<br>docs-pattern-detail-renderer: 28<br>docs-primitive-detail-renderer: 2<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 13<br>docs-template-detail-renderer: 3 |
| foundation:symbol | 24 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-misc-surface: 6<br>docs-foundation-detail-renderer: 1<br>docs-shell: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 15 |
| foundation:tone | 58 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-misc-surface: 11<br>docs-dom-interaction: 3<br>docs-shell: 1<br>docs-foundation-detail-renderer: 2<br>docs-component-detail-renderer: 14<br>docs-pattern-detail-renderer: 20<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 4<br>docs-template-detail-renderer: 2 |
| foundation:voice | 39 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-foundation-detail-renderer: 3<br>docs-pattern-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 31 |
| primitive:animation-assets | 0 | None | None |
| primitive:breakpoints | 2 | parallel DOM behavior risk<br>missing primitive runtime | docs-misc-surface: 1<br>docs-dom-interaction: 1 |
| primitive:charts | 3 | parallel DOM behavior risk | docs-misc-surface: 2<br>docs-dom-interaction: 1 |
| primitive:color | 53 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 6<br>docs-foundation-detail-renderer: 1<br>docs-pattern-detail-renderer: 4<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 41 |
| primitive:country-flags | 0 | None | None |
| primitive:density | 67 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk<br>missing primitive runtime | docs-misc-surface: 9<br>docs-dom-interaction: 3<br>docs-shell: 1<br>docs-foundation-detail-renderer: 3<br>docs-component-detail-renderer: 16<br>docs-home-renderer: 1<br>docs-pattern-detail-renderer: 11<br>docs-primitive-detail-renderer: 2<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 19<br>docs-template-detail-renderer: 1 |
| primitive:disabled | 26 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 6<br>docs-component-detail-renderer: 7<br>docs-dom-interaction: 4<br>docs-pattern-detail-renderer: 3<br>docs-css-visual-surface: 5<br>docs-template-detail-renderer: 1 |
| primitive:duration | 11 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-foundation-detail-renderer: 1<br>docs-misc-surface: 4<br>docs-pattern-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 4 |
| primitive:elevation | 18 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 3<br>docs-css-visual-surface: 15 |
| primitive:field-action | 0 | missing primitive runtime | None |
| primitive:focus | 34 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 8<br>docs-dom-interaction: 4<br>docs-component-detail-renderer: 4<br>docs-pattern-detail-renderer: 4<br>docs-css-visual-surface: 14 |
| primitive:iconography | 3 | docs-only visual surface risk | docs-misc-surface: 2<br>docs-css-visual-surface: 1 |
| primitive:illustration-assets | 0 | None | None |
| primitive:library-sources | 0 | None | None |
| primitive:loading | 30 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 7<br>docs-dom-interaction: 3<br>docs-component-detail-renderer: 7<br>docs-home-renderer: 1<br>docs-pattern-detail-renderer: 8<br>docs-css-visual-surface: 3<br>docs-template-detail-renderer: 1 |
| primitive:maps | 5 | parallel DOM behavior risk | docs-misc-surface: 4<br>docs-dom-interaction: 1 |
| primitive:measurement | 3 | docs-only visual surface risk<br>missing primitive runtime | docs-css-visual-surface: 2<br>docs-misc-surface: 1 |
| primitive:message | 33 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 9<br>docs-dom-interaction: 4<br>docs-foundation-detail-renderer: 1<br>docs-component-detail-renderer: 1<br>docs-pattern-detail-renderer: 13<br>docs-css-visual-surface: 4<br>docs-template-detail-renderer: 1 |
| primitive:motion-curves | 2 | parallel DOM behavior risk<br>missing primitive runtime | docs-misc-surface: 1<br>docs-dom-interaction: 1 |
| primitive:radius | 50 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-dom-interaction: 2<br>docs-misc-surface: 5<br>docs-component-detail-renderer: 1<br>docs-css-visual-surface: 42 |
| primitive:research | 4 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 1<br>docs-pattern-detail-renderer: 1<br>docs-css-visual-surface: 2 |
| primitive:spacing | 14 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 2<br>docs-css-visual-surface: 8 |
| primitive:surface | 67 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 9<br>docs-foundation-detail-renderer: 2<br>docs-component-detail-renderer: 3<br>docs-pattern-detail-renderer: 7<br>docs-primitive-detail-renderer: 2<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 41<br>docs-template-detail-renderer: 2 |
| primitive:typography | 6 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-foundation-detail-renderer: 2<br>docs-misc-surface: 2<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 1 |
| pattern:search | 49 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 5<br>docs-dom-interaction: 5<br>docs-component-detail-renderer: 3<br>docs-pattern-detail-renderer: 20<br>docs-css-visual-surface: 16 |
| pattern:sidebar | 16 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-dom-interaction: 2<br>docs-misc-surface: 1<br>docs-pattern-detail-renderer: 8<br>docs-css-visual-surface: 5 |
| pattern:topbar | 19 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-shell: 1<br>docs-misc-surface: 1<br>docs-component-detail-renderer: 1<br>docs-pattern-detail-renderer: 6<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 9 |

## Shell pattern detail

| Ticket | Docs hand files | First surface files |
| --- | ---: | --- |
| pattern:search | 49 | ../FlowDocs/apps/docs/app.js (docs-misc-surface)<br>../FlowDocs/apps/docs/component-demo-interactions.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/doc-interactions.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/docs-shell-react.js (docs-misc-surface)<br>../FlowDocs/apps/docs/docs-state.js (docs-misc-surface)<br>../FlowDocs/apps/docs/gold-combobox-docs.js (docs-component-detail-renderer)<br>../FlowDocs/apps/docs/gold-input-docs.js (docs-component-detail-renderer)<br>../FlowDocs/apps/docs/gold-slider-docs.js (docs-component-detail-renderer)<br>../FlowDocs/apps/docs/pattern-advanced-filter-interactions.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/pattern-build-gates.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-candidate-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-contract-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-design-lead.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-desktop-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-desktop-interactions.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/pattern-desktop-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-focused-design.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-journey-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-miel-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-mobile-react-demos.js (docs-pattern-detail-renderer) |
| pattern:sidebar | 16 | ../FlowDocs/apps/docs/doc-interactions.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/docs-shell-react.js (docs-misc-surface)<br>../FlowDocs/apps/docs/pattern-build-gates.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-design-lead.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-focused-design.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-journey-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-miel-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-react-shell-islands.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-shell-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/styles/01-shell-02.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/01-shell-react.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/06-responsive-01.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/06-responsive-02.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/08-template-desktop-demos.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/template-desktop-interactions.js (docs-dom-interaction) |
| pattern:topbar | 19 | ../FlowDocs/apps/docs/docs-chrome.js (docs-shell)<br>../FlowDocs/apps/docs/docs-shell-react.js (docs-misc-surface)<br>../FlowDocs/apps/docs/gold-icon-button-docs.js (docs-component-detail-renderer)<br>../FlowDocs/apps/docs/pattern-design-lead.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-focused-design.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-miel-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-react-shell-islands.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-shell-react-demos.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/pattern-tabs.js (docs-pattern-detail-renderer)<br>../FlowDocs/apps/docs/shell-controls.js (docs-dom-interaction)<br>../FlowDocs/apps/docs/styles/01-shell-01.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/01-shell-02.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/01-shell-intro.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/01-shell-react.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/03a-reference-core-01.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/06-responsive-01.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/06-responsive-02.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/07-pattern-focused-design.css (docs-css-visual-surface)<br>../FlowDocs/apps/docs/styles/08-template-desktop-demos.css (docs-css-visual-surface) |

## Foundations detail

| Ticket | Docs hand files | Risk flags | Surface categories |
| --- | ---: | --- | --- |
| foundation:accessibility | 69 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 7<br>docs-foundation-detail-renderer: 1<br>docs-component-detail-renderer: 57<br>docs-pattern-detail-renderer: 2<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 1 |
| foundation:depth | 28 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 1<br>docs-pattern-detail-renderer: 3<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 19 |
| foundation:energy | 49 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 3<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 41 |
| foundation:frame | 78 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 9<br>docs-foundation-detail-renderer: 3<br>docs-component-detail-renderer: 12<br>docs-pattern-detail-renderer: 2<br>docs-dom-interaction: 2<br>docs-css-visual-surface: 49<br>docs-template-detail-renderer: 1 |
| foundation:growth | 11 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-foundation-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 5<br>docs-template-detail-renderer: 1 |
| foundation:iconography | 3 | docs-only visual surface risk | docs-misc-surface: 2<br>docs-css-visual-surface: 1 |
| foundation:momentum | 18 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 14 |
| foundation:state | 135 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 15<br>docs-dom-interaction: 11<br>docs-foundation-detail-renderer: 2<br>docs-component-detail-renderer: 60<br>docs-pattern-detail-renderer: 28<br>docs-primitive-detail-renderer: 2<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 13<br>docs-template-detail-renderer: 3 |
| foundation:symbol | 24 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-misc-surface: 6<br>docs-foundation-detail-renderer: 1<br>docs-shell: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 15 |
| foundation:tone | 58 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk | docs-misc-surface: 11<br>docs-dom-interaction: 3<br>docs-shell: 1<br>docs-foundation-detail-renderer: 2<br>docs-component-detail-renderer: 14<br>docs-pattern-detail-renderer: 20<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 4<br>docs-template-detail-renderer: 2 |
| foundation:voice | 39 | parallel DOM behavior risk<br>docs-only visual surface risk | docs-misc-surface: 3<br>docs-foundation-detail-renderer: 3<br>docs-pattern-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 31 |

## Primitives detail

| Ticket | Docs hand files | Risk flags | Surface categories |
| --- | ---: | --- | --- |
| primitive:animation-assets | 0 |  |  |
| primitive:breakpoints | 2 | parallel DOM behavior risk<br>missing primitive runtime | docs-misc-surface: 1<br>docs-dom-interaction: 1 |
| primitive:charts | 3 | parallel DOM behavior risk | docs-misc-surface: 2<br>docs-dom-interaction: 1 |
| primitive:color | 53 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 6<br>docs-foundation-detail-renderer: 1<br>docs-pattern-detail-renderer: 4<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 41 |
| primitive:country-flags | 0 |  |  |
| primitive:density | 67 | parallel DOM behavior risk<br>docs-only visual surface risk<br>docs shell dependency risk<br>missing primitive runtime | docs-misc-surface: 9<br>docs-dom-interaction: 3<br>docs-shell: 1<br>docs-foundation-detail-renderer: 3<br>docs-component-detail-renderer: 16<br>docs-home-renderer: 1<br>docs-pattern-detail-renderer: 11<br>docs-primitive-detail-renderer: 2<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 19<br>docs-template-detail-renderer: 1 |
| primitive:disabled | 26 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 6<br>docs-component-detail-renderer: 7<br>docs-dom-interaction: 4<br>docs-pattern-detail-renderer: 3<br>docs-css-visual-surface: 5<br>docs-template-detail-renderer: 1 |
| primitive:duration | 11 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-foundation-detail-renderer: 1<br>docs-misc-surface: 4<br>docs-pattern-detail-renderer: 1<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 4 |
| primitive:elevation | 18 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 3<br>docs-css-visual-surface: 15 |
| primitive:field-action | 0 | missing primitive runtime |  |
| primitive:focus | 34 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 8<br>docs-dom-interaction: 4<br>docs-component-detail-renderer: 4<br>docs-pattern-detail-renderer: 4<br>docs-css-visual-surface: 14 |
| primitive:iconography | 3 | docs-only visual surface risk | docs-misc-surface: 2<br>docs-css-visual-surface: 1 |
| primitive:illustration-assets | 0 |  |  |
| primitive:library-sources | 0 |  |  |
| primitive:loading | 30 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 7<br>docs-dom-interaction: 3<br>docs-component-detail-renderer: 7<br>docs-home-renderer: 1<br>docs-pattern-detail-renderer: 8<br>docs-css-visual-surface: 3<br>docs-template-detail-renderer: 1 |
| primitive:maps | 5 | parallel DOM behavior risk | docs-misc-surface: 4<br>docs-dom-interaction: 1 |
| primitive:measurement | 3 | docs-only visual surface risk<br>missing primitive runtime | docs-css-visual-surface: 2<br>docs-misc-surface: 1 |
| primitive:message | 33 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 9<br>docs-dom-interaction: 4<br>docs-foundation-detail-renderer: 1<br>docs-component-detail-renderer: 1<br>docs-pattern-detail-renderer: 13<br>docs-css-visual-surface: 4<br>docs-template-detail-renderer: 1 |
| primitive:motion-curves | 2 | parallel DOM behavior risk<br>missing primitive runtime | docs-misc-surface: 1<br>docs-dom-interaction: 1 |
| primitive:radius | 50 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-dom-interaction: 2<br>docs-misc-surface: 5<br>docs-component-detail-renderer: 1<br>docs-css-visual-surface: 42 |
| primitive:research | 4 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 1<br>docs-pattern-detail-renderer: 1<br>docs-css-visual-surface: 2 |
| primitive:spacing | 14 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 4<br>docs-foundation-detail-renderer: 2<br>docs-css-visual-surface: 8 |
| primitive:surface | 67 | docs-only visual surface risk<br>missing primitive runtime | docs-misc-surface: 9<br>docs-foundation-detail-renderer: 2<br>docs-component-detail-renderer: 3<br>docs-pattern-detail-renderer: 7<br>docs-primitive-detail-renderer: 2<br>docs-reference-renderer: 1<br>docs-css-visual-surface: 41<br>docs-template-detail-renderer: 2 |
| primitive:typography | 6 | parallel DOM behavior risk<br>docs-only visual surface risk<br>missing primitive runtime | docs-foundation-detail-renderer: 2<br>docs-misc-surface: 2<br>docs-dom-interaction: 1<br>docs-css-visual-surface: 1 |

## Read the JSON for line evidence

The JSON companion includes line evidence for each listed file. Use it to classify each surface as consume Flow, docs-owned content, merge, or remove.
