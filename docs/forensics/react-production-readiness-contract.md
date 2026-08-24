# React Production Readiness Contract

Date: 2026-08-15

Scope: direct public React component exports only. Patterns, templates, and FlowDocs are not part of this contract except as future consumers.

Purpose: define what must be true before a React component can be marked production-ready. This is not a visual parity contract.

## Production-Ready Definition

A React component is production-ready only when a consuming product team can use it from the public package surface without private repo knowledge and with predictable API, runtime, accessibility, interaction, styling, and testing evidence.

Production-ready requires all of these gates:

| Gate | Requirement |
| --- | --- |
| Public API | Exported from root package and `packages/react`, with stable import path and documented props. |
| TypeScript | Real `.d.ts` generated from source, no decorative/manual type drift, refs/events typed where applicable. |
| Runtime | Renders in a clean consumer app with package CSS/tokens, no FlowDocs dependency, no external DOM mutation requirement. |
| State model | Required states are explicit and tested: default, disabled, loading, error, selected/open/focus as applicable. |
| Interaction | User-visible behavior is tested with realistic user flows, not only static render output. |
| Accessibility | Accessible name, role, aria, focus, keyboard, and live-region behavior are validated according to family. |
| Theme/density | Light/dark, density, token cascade, and class/data hooks are stable. |
| Ref/root | Ref forwards to the contractual root or documented focusable element when applicable. |
| Consumer safety | External `className`/data hooks are allowed in the intended place; unsafe style/DOM escape props do not leak. |
| Evidence | Component has a readiness row with status, test files, gaps, and owner decision. |

## Status Labels

| Status | Meaning |
| --- | --- |
| `ready` | All required family gates pass with evidence. |
| `partial` | Surface exists and some evidence exists, but at least one family gate is missing or incomplete. |
| `blocked` | Known implementation/API/a11y/runtime issue prevents production use. |
| `unknown` | Not enough evidence has been collected. This status is not allowed after the readiness audit is complete. |

## Evidence Rules

What counts as evidence:

- A test that renders the component through the public package entrypoint.
- A test that interacts with the component using role/name queries where possible.
- Assertions on value/state/event behavior for interactive components.
- Assertions on role/aria/focus/keyboard behavior for accessibility-critical components.
- A clean consumer app smoke that imports the package and CSS/tokens from public paths.
- A generated report that links component, family, tests, and remaining gaps.

What does not count as enough evidence:

- Component name appearing somewhere in a monolithic test.
- Static markup snapshot only for an interactive component.
- A string assertion for `aria-*` without testing the behavior it supports.
- FlowDocs demo rendering.
- Pattern/template usage proving the component indirectly renders.
- Visual parity screenshot alone.
- Passing `audit:complete` without a per-component readiness row.

## Family Contracts

### Actions

Components: `button`, `icon-button`, `floating-action-button`.

Retired/non-component action affordances:

- Copy affordances are owned by `button`/`icon-button` usage, not a standalone component.
- Quick action items are owned by `quick-actions-grid` as a pattern and compose `IconButton`; `quick-action` is not a public component.

Required gates:

- Accessible name exists for icon-only and visual-only cases.
- `disabled` prevents callback invocation.
- `loading` prevents duplicate action and exposes busy state where applicable.
- Click invokes the correct callback with the original event.
- `preventDefault`/consumer event prevention is respected where supported.
- Keyboard activation works for custom non-native action roots.
- Ref lands on contractual root/focusable target.
- External class/data hooks are stable.

Minimum tests:

- Render with label and icon-only variant.
- Click callback.
- Disabled/loading callback prevention.
- Keyboard activation where root is not native button.
- Accessible name assertion.

### Forms

Components: `input`, `text-area`, `input-amount`, `card-number-input`, `card-expiry-input`, `card-security-code-input`, `phone-input`, `code-input`, `select`, `combobox`, `country-selector`, `checkbox`, `radio-button`, `switch`, `slider`, `date-picker`, `date-range-picker`.

Required gates:

- Label is programmatically associated with the control.
- Controlled and uncontrolled modes are documented and tested when both exist.
- `value`/`defaultValue`, `checked`/`defaultChecked`, or equivalent state does not drift.
- Change callbacks include value/meta/event as typed.
- Disabled/readOnly states prevent mutation where applicable.
- Error/validation/helper text is exposed semantically.
- Keyboard behavior matches expected control pattern.
- Focus visible and ref behavior are stable.
- Required/invalid states map to native/aria attributes where applicable.
- Formatting/parsing components preserve canonical values.

Minimum tests:

- Label query using `getByLabelText` or role/name.
- Uncontrolled update.
- Controlled rerender behavior.
- Disabled/readOnly behavior.
- Error/helper semantics.
- Keyboard path for select-like, date-like, code, slider, checkbox/radio/switch controls.

### Overlays And Feedback

Components: `dialog`, `drawer`, `popover`, `menu`, `tooltip`, `toast`.

Required gates:

- Open/closed state renders predictably.
- Controlled and uncontrolled open state are documented and tested where supported.
- Trigger exposes correct `aria-expanded`, `aria-haspopup`, `aria-controls`, or equivalent.
- Escape closes when expected and calls the appropriate callback.
- Outside click closes when expected and does not close when prevented/disabled.
- Focus is placed, trapped, restored, or explicitly documented as not trapped.
- Portal/layer behavior is stable and does not require FlowDocs.
- Dismiss/close buttons have accessible names.
- Toast/live feedback uses correct live region politeness.

Minimum tests:

- Open from trigger.
- Close by action.
- Escape.
- Outside click where applicable.
- Focus behavior.
- Controlled open rerender.
- Role/name query for dialog/menu/tooltip/status.

### Navigation And Disclosure

Components: `tabs`, `segmented-control`, `breadcrumbs`, `pagination`, `accordion`, `stepper`, `tree-view`.

Required gates:

- Selected/current/expanded state is represented semantically.
- Controlled and uncontrolled state are tested where supported.
- Keyboard navigation exists where the pattern expects it.
- Arrow/Home/End behavior is tested for roving/collection controls where applicable.
- Activation callback includes item/key/page and event.
- Disabled items cannot be activated.
- IDs/aria-controls relationships are stable.
- No unstable fallback keys leak into DOM.

Minimum tests:

- Initial selected/current/expanded state.
- User activation callback.
- Controlled rerender.
- Keyboard navigation for tabs/tree/disclosure collections.
- Disabled item behavior.

### Data And Display

Components: `card`, `card-summary`, `table`, `list`, `chart-panel`, `kpi-tile`, `movement-row`, `route-summary`.

Required gates:

- Empty/loading/error states are represented when supported.
- Interactive rows/cards expose roles, names, and keyboard activation.
- Sort/select/pagination callbacks are tested where supported.
- Decorative variants do not expose misleading interactive aria.
- Data keys are stable and invalid rows do not render unsafe output.
- Density/theme hooks remain on contractual root.

Minimum tests:

- Basic render with required data.
- Empty/loading/error state.
- Interactive callback and keyboard path where applicable.
- Selection/sort/page callback where applicable.
- Invalid data/key protection.

### Display And Status

Components: `avatar`, `badge`, `tag`, `chip`, `skeleton`, `spinner`, `progress-indicator`, `empty-state`, `error-panel`, `inline-validation`, `motion-boundary`, `animated-moment`.

Required gates:

- Informative vs decorative mode is explicit.
- Accessible name or `aria-hidden` is correct.
- Live region behavior is correct for dynamic status where applicable.
- Progress values expose valid min/max/now/text semantics.
- Dismiss/remove actions are accessible and tested where present.
- Loading/skeleton states do not create fake labels.
- Token/density/state hooks are stable.

Minimum tests:

- Informative render.
- Decorative render.
- A11y role/name/hidden assertion.
- Live/progress semantics where applicable.
- Action callback where component is removable/dismissible.

### Domain Specialized

Components: `audit-event`, `biometric-prompt`, `chat-composer`, `chat-message`, `chat-thread`, `station-pin`, plus any domain-specific component not covered above.

Required gates:

- Domain actions are explicit and typed.
- Critical accessible labels are tested.
- Loading/error/empty/recovery states are covered.
- Event callbacks include expected domain payload and event.
- Sensitive flows do not rely on visual-only affordances.

Minimum tests:

- Main domain render.
- Primary action callback.
- Failure/recovery or loading state.
- Accessible role/name assertion.

## P0 Readiness Minimum

The first production-readiness execution should cover these P0 components before lower-risk work:

- Forms: `input`, `text-area`, `select`, `combobox`, `country-selector`, `checkbox`, `radio-button`, `switch`, `slider`, `date-picker`, `date-range-picker`, `phone-input`, `code-input`.
- Overlays: `dialog`, `drawer`, `popover`, `menu`.
- Navigation: `tabs`.

P0 is not ready until every component above has:

- family-specific tests,
- a11y/keyboard assertions,
- controlled/uncontrolled decision recorded,
- consumer import evidence,
- readiness row not marked `unknown`.

## Next Required Artifact

The next analysis artifact should be `react-production-readiness-gap-matrix`.

It must map every direct React component to:

- family,
- priority,
- required gates,
- existing evidence,
- missing evidence,
- likely implementation risk,
- status: `ready`, `partial`, `blocked`, or `unknown`.

No implementation changes should start before that matrix exists.
