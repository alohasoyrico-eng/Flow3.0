# ControlFrame Adoption Inventory

Status: pass

This inventory classifies every gold React component by the frame role it should consume. ControlFrame is not a visual flattening rule; it defines shared rendered control size, typography, padding, radius roles, and border-box behavior where a component is an interactive frame.

## Summary

- Components: 62
- Covered: 23
- Needs review/debt/partial: 0
- Not applicable or separate contract: 39

| Status | Count |
| --- | ---: |
| covered | 19 |
| covered-via-field | 4 |
| not-applicable | 25 |
| separate-contract | 14 |

## Iteration Buckets

| Iteration | Components |
| ---: | ---: |
| 2 | 12 |
| 3 | 14 |
| 4 | 7 |
| 5 | 4 |

## Components

| Component | Role | Status | Iteration | Note |
| --- | --- | --- | ---: | --- |
| accordion | composition | not-applicable | n/a | Content disclosure shell; no primary control frame beyond internal triggers. |
| animated-moment | motion | not-applicable | n/a | Motion primitive/component; not a frame consumer. |
| audit-event | display | not-applicable | n/a | Timeline/display component. |
| avatar | display | not-applicable | n/a | Identity media frame, not an interactive control frame. |
| badge | display | not-applicable | n/a | Inline status display. |
| biometric-prompt | composition | separate-contract | 2 | Prompt actions compose Button; biometric icon uses its own exact density-derived frame. |
| breadcrumbs | navigation-item | covered | 2 | Navigation targets consume ControlFrame size/typography with navigation-specific radius and padding. |
| button | action | covered | 2 | Consumes ControlFrame action size/font/padding/radius. |
| card | surface | not-applicable | n/a | Surface/container; should not become a control frame. |
| card-expiry-input | field | covered-via-field | 3 | Card field geometry derives from Field aliases. |
| card-number-input | field | covered-via-field | 3 | Card field geometry derives from Field aliases. |
| card-security-code-input | field | covered-via-field | 3 | Card field geometry derives from Field aliases. |
| card-summary | display | not-applicable | n/a | Commerce summary display. |
| chart-panel | surface | not-applicable | n/a | Data surface; no control frame. |
| chat-composer | field-composition | covered | 3 | Composes Surface, TextArea, Button, and IconButton; composer layout owns no local control frame. |
| chat-message | display | not-applicable | n/a | Message display. |
| chat-thread | composition | not-applicable | n/a | Thread layout/composition. |
| checkbox | choice | separate-contract | 5 | Uses ChoiceMark/IconDensity, not full ControlFrame. |
| chip | inline-trigger | separate-contract | 2 | Selectable/removable chips use inline trigger sizing, exact border-box frame, and do not consume standard Button ControlFrame. |
| code-block | content | not-applicable | n/a | Code content surface; CopyButton inside should own action frame. |
| code-input | field-slot | separate-contract | 3 | OTP/code slots use specialized exact border-box slot geometry backed by shared code slot frame roles. |
| combobox | field-option-overlay | covered | 3 | Input frame inherits Field ControlFrame; listbox/options consume shared Listbox/OptionRow roles with explicit keyboard/selection guards. |
| copy-button | action-composition | covered | 2 | Composes Button/IconButton; .copy-button is limited to copy feedback and must not own frame geometry. |
| country-selector | field-option-overlay | covered | 3 | Consumes Select/Field trigger roles plus governed option/listbox/search frames with border-box safeguards. |
| date-picker | field-overlay-grid | covered | 3 | Trigger consumes Field ControlFrame sizing; calendar grid uses exact calendar-day frame and date panel roles. |
| date-range-picker | field-overlay-grid | covered | 3 | Inherits DatePicker trigger/day frame and adds exact range preset/date panel roles. |
| dialog | modal-panel | separate-contract | 4 | Modal panel owns dialog-specific frame/motion/z-index aliases with border-box safeguards; footer actions compose Button. |
| drawer | sheet-panel | separate-contract | 4 | Sheet panel owns drawer-specific frame/motion/z-index aliases with border-box safeguards; close/footer actions compose action controls. |
| empty-state | display | not-applicable | n/a | Display/empty content; actions inside should compose Button. |
| error-panel | feedback-surface | not-applicable | n/a | Feedback surface; actions inside should compose Button. |
| floating-action-button | action-exception | separate-contract | 2 | Uses FAB scale, not standard inline ControlFrame; audit requires exact block-size and border-box. |
| icon-button | action-icon | covered | 2 | Consumes ControlFrame action/icon sizing and passes runtime frame audit. |
| inline-validation | feedback | not-applicable | n/a | Validation message, not a control frame. |
| input | field | covered | 3 | Consumes ControlFrame field size/font/padding/radius. |
| input-amount | field | covered-via-field | 3 | Amount input should inherit Field frame contract. |
| kpi-tile | display | not-applicable | n/a | Metric display surface. |
| list | content-list | not-applicable | n/a | List display; option rows are separate role. |
| menu | option-overlay | covered | 4 | Panel consumes Listbox/OverlayPanel roles; items consume OptionRow geometry with explicit border-box safeguards; triggers remain action consumers. |
| motion-boundary | motion | not-applicable | n/a | Motion boundary primitive/component. |
| movement-row | display-row | not-applicable | n/a | Domain row display. |
| pagination | navigation-action | covered | 2 | Consumes ControlFrame action sizing/font/padding/radius and passes runtime frame audit. |
| phone-input | field-composition | covered | 3 | Composes Field, Input, and CountrySelector; compact size overrides Field alias through governed phone input roles. |
| popover | overlay | covered | 4 | Panel consumes OverlayPanel roles with explicit border-box; trigger remains an external action/control consumer. |
| progress-indicator | feedback | not-applicable | n/a | Progress display. |
| quick-action | action-content-frame | separate-contract | 2 | Uses ActionContentFrame roles for circular icon control plus external label; not a standard 36/44/52 inline ControlFrame. |
| radio-button | choice | separate-contract | 5 | Uses ChoiceMark/IconDensity, not full ControlFrame. |
| route-summary | display | not-applicable | n/a | Domain summary display. |
| segmented-control | navigation-action | covered | 2 | Segment items consume ControlFrame action sizing/padding/radius and pass runtime frame audit. |
| select | field-option-overlay | covered | 3 | Trigger consumes field frame; listbox/options consume overlay/option roles. |
| skeleton | feedback-placeholder | not-applicable | n/a | Placeholder display. |
| slider | range-control | separate-contract | 5 | Owns track/thumb geometry; should align icon/choice density principles, not full frame. |
| spinner | feedback | not-applicable | n/a | Loading display. |
| station-pin | display-map | not-applicable | n/a | Map/domain marker. |
| stepper | step-marker | separate-contract | 2 | Non-interactive progress markers use StepMarker sizing with exact border-box marker frame, not Button ControlFrame. |
| switch | choice | separate-contract | 5 | Uses ChoiceMark/SwitchFrame, not full ControlFrame. |
| table | data | not-applicable | n/a | Data grid surface; filters/actions inside use separate controls. |
| tabs | navigation-action | covered | 2 | Tabs tab now consumes ControlFrame action size/font/padding/radius. |
| tag | display | not-applicable | n/a | Inline label/status display unless made removable/selectable. |
| text-area | field-multiline | separate-contract | 3 | Multiline field should share field radius/padding, but not fixed ControlFrame height. |
| toast | feedback-overlay | covered | 4 | Feedback surface owns toast-specific motion/size roles; action and dismiss controls compose Button/IconButton with audit guards against local action clones. |
| tooltip | tooltip-bubble | separate-contract | 4 | Trigger consumes InlineTrigger roles; inverted bubble keeps tooltip semantics while deriving depth/z-index and border-box safeguards from shared overlay roles. |
| tree-view | navigation-list | covered | 4 | Rows compose Button but use a governed TreeView navigation-row contract with density, indentation, icon, motion, and border-box safeguards. |
