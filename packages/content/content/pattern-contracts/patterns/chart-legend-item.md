# Chart Legend Item

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/chart-legend-item/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/chart-legend-item.json`

## Purpose

Coordinate one chart series label with visibility, value, semantic status, keyboard toggle, and chart/table synchronization without owning chart rendering.

## Use When

- A chart exposes multiple series or segments that users can inspect or toggle.
- Legend items need values, status, or disabled/hidden states.
- The same legend state must stay synchronized with chart and table fallbacks.

## Do Not Use Without Review

- Legend interaction changes regulated financial, risk, or compliance interpretation.
- The chart has no accessible table or list fallback.
- Series color meaning is not defined by the chart primitive and Energy foundation.

## Foundations

| Foundation | Contract |
| --- | --- |
| Depth | Keeps legend row elevation and chart/fallback layering aligned with the surrounding chart surface. |
| Energy | Controls semantic status, selected emphasis, disabled treatment, and non-color cues. |
| Frame | Sets compact row alignment, wrapping, and responsive legend placement. |
| Growth | Preserves compact legend density while allowing extra value, status, or tooltip context. |
| Iconography | Coordinates any optional series icon, toggle affordance, or status glyph with Flow icon semantics. |
| Momentum | Keeps toggle, tooltip, and selected-state transitions aligned with reduced-motion behavior. |
| State | Defines visible, hidden, selected, disabled, loading, and error states. |
| Symbol | Connects semantic status and series meaning to non-color indicators. |
| Tone | Keeps legend emphasis, warnings, and neutral metadata aligned with chart tone. |
| Voice | Owns series labels, values, status text, and hidden/disabled copy. |
| Accessibility | Requires keyboard reachable toggles, visible labels, and non-color meaning. |

## Formal Purpose

Coordinate chart series legend labels, values, visibility, selected state, semantic status, and accessible synchronization with Chart Wrapper data fallbacks.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `default`
- `selected`
- `hidden`
- `disabled`
- `loading`
- `error`

## Formal Dependencies

### Foundations

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

- `Charts`
- `Color`
- `Density`
- `Disabled`
- `Duration`
- `Focus`
- `Iconography`
- `Loading`
- `Measurement`
- `Message`
- `Motion Curves`
- `Radius`
- `Spacing`
- `Surface`
- `Typography`

### Components

- `Badge`
- `Button`
- `Checkbox`
- `Chip`
- `Tag`
- `Tooltip`

### Patterns

- `Chart Wrapper`

### Tokens

- `comp.badge.*`
- `comp.button.*`
- `comp.checkbox.*`
- `comp.chip.*`
- `comp.tag.*`
- `comp.tooltip.*`
- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `legendSurface` | `primitive` | `Surface` |
| `toggle` | `component` | `Checkbox`, `Chip`, `Button` |
| `status` | `component` | `Badge`, `Tag`, `Tooltip` |
| `value` | `primitive` | `Typography` |

## Formal Governance

### Entry Conditions

- A chart exposes multiple visible, hidden, selected, or status-bearing series.
- Users need to inspect or toggle series without losing table/list fallback meaning.
- Legend meaning must remain accessible beyond color.

### Decision Tree

- Use static legend items when series are informational only.
- Use Checkbox, Chip, or Button when a series can be toggled or selected.
- Escalate to Chart Wrapper when legend state controls chart, fallback table, and export behavior.

### Failure Modes

- Legend is raw swatches with no text.
- Series toggles are fake buttons outside Flow components.
- Hidden/selected state is color-only.
- Template owns legend synchronization locally.

### Success Metrics

- Users can identify each series by label and value.
- Toggleable legend state is keyboard reachable.
- Chart and fallback table/list remain synchronized.

### Accessibility

- Expose a text label for every series.
- Represent selected, hidden, and disabled states with accessible control state.
- Do not rely on color-only series identification.

### Tests

- Composes Flow controls and metadata components.
- Synchronizes with Chart Wrapper fallback data.
- Covers selected, hidden, disabled, loading, and error states.

### Agent Instructions

- Keep chart rendering in Chart Panel or Chart Wrapper.
- Use Chart Legend Item only for series-level label/status/toggle behavior.
- Ask before changing financial, risk, or regulated series interpretation.

### Reject If

- Legend state is visual-only.
- No accessible chart data fallback exists.
- Template code owns series synchronization directly.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| legendSurface | Surface | yes | Structural boundary for one legend row or item. |
| toggle | Checkbox \| Chip \| Button | conditional | Series visibility or selected-state control. |
| status | Badge \| Tag | conditional | Semantic metadata for status or threshold. |
| value | Typography | conditional | Series value, share, or delta copy. |

## Components Used

- Badge
- Button
- Checkbox
- Chip
- Tag
- Tooltip

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| legendSurface | Surface | yes | Structural boundary for one legend row or item. |
| value | Typography | conditional | Series value, share, or delta copy. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Static | Required | Label, value, and status are displayed without interaction. |
| Toggleable | Required | Users can show or hide a series using a Flow control. |
| Selected | Candidate | Selected series is emphasized and synchronized with chart/table focus. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| State change | Legend toggles update instantly and respect reduced-motion chart updates. |
| Tooltip reveal | Explanatory metadata uses Tooltip/Popover motion, not custom hover shells. |

## Accessibility

- Legend item has an accessible label and optional value.
- Toggleable variants are keyboard reachable.
- Color is never the only series identifier.
- Hidden series state is announced through text or control state.

## Implementation Checklist

- Declare `legendSurface`: Structural boundary for one legend row or item.
- Composes Flow controls instead of raw buttons.
- Selected/hidden/disabled states are visible without color-only meaning.
- ChartWrapper / Chart Wrapper remains the boundary host for chart rendering and fallback data; Chart Legend Item only owns series legend interaction.

## Tests And Rejection Rules

Must test:

- Composes Flow controls instead of raw buttons.
- Selected/hidden/disabled states are visible without color-only meaning.
- ChartWrapper / Chart Wrapper remains the boundary host for chart rendering and fallback data; Chart Legend Item only owns series legend interaction.

Reject if:

- Legend uses raw swatches without text.
- Legend state cannot be represented in accessible fallback data.
- Chart Wrapper behavior is duplicated in a parallel legend implementation.
- A template invents local chart legend behavior.

## MIEL

Agents can decide:

- Use Chart Legend Item inside Chart Wrapper when series visibility or focus is reusable.
- Use Badge/Tag for semantic metadata and Checkbox/Chip/Button for interaction.

Agents must ask:

- Series meaning, value source, threshold policy, or regulated interpretation is unclear.

Agents must reject:

- Legend uses raw swatches without text.
- Legend state cannot be represented in accessible fallback data.
- Chart Wrapper behavior is duplicated in a parallel legend implementation.
- A template invents local chart legend behavior.
