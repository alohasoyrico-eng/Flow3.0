# Manual Accessibility QA

This checklist is the release gate for interactive Flow components that cannot be trusted through static CSS or visual audits alone. Automated audits verify the React source contract; a human QA pass must still confirm keyboard, screen reader, focus, Escape behavior, light/dark, density, and reduced motion before a release.

## Required Components

| Component | Manual QA scope |
| --- | --- |
| dialog | Confirm role dialog, aria-modal, accessible title, initial focus, focus restoration, Escape, overlay dismissal, keyboard access to actions, light/dark, density, and reduced motion. |
| drawer | Confirm role dialog, aria-modal, accessible title, initial focus, focus restoration, Escape, scroll containment, light/dark, density, and reduced motion. |
| menu | Confirm trigger state, menu/menuitem roles, roving focus, Arrow keys, Home/End, Escape, focus restoration, disabled items, light/dark, density, and reduced motion. |
| popover | Confirm trigger state, panel role/name, Escape, focus restoration, outside/click dismissal, mobile escalation decision, light/dark, density, and reduced motion. |
| tooltip | Confirm visible trigger, aria-describedby, hover, focus, blur, Escape, short copy, light/dark, density, and reduced motion. |
| select | Confirm combobox trigger, listbox/options, selected state, active option, Escape, selection commit, screen reader value, light/dark, density, and reduced motion. |
| combobox | Confirm editable value, aria-autocomplete, active descendant, filtering announcement, keyboard selection, clear action, empty result, light/dark, density, and reduced motion. |
| country-selector | Confirm country name, calling code, flag decorative behavior, search field, active option, keyboard selection, Escape, screen reader value, light/dark, density, and reduced motion. |
| date-picker | Confirm trigger state, calendar dialog, grid semantics, day names, today/current date, month navigation, Escape/focus return, light/dark, density, and reduced motion. |
| date-range-picker | Confirm trigger state, range start/end, calendar dialog, grid semantics, preset buttons, month navigation, Escape/focus return, light/dark, density, and reduced motion. |

## Release Rule

Manual QA evidence must identify the component, viewport, density, color mode, keyboard path, screen reader pass/fail, and any known exception. A component can keep shipping only when the package-owned React implementation and this manual checklist agree.
