# Chart Panel

Generated portable agent contract for Design System.

The JSON content remains the editable source of truth. Regenerate this file with `npm run build:component-contracts` after changing component copy.

Source content:

- `packages/content/content/component-copy/components/chart-panel/all.json`

## Purpose

Use Chart Panel to frame one operational visualization with title, context, summary value, and actions.

## Definition Of Ready

Before building or changing this component, confirm:

- Design System owns naming, tokens, foundations, primitives, and public API.
- The reference ZIP may inform look and feel or motion, but every visual decision must translate back to Design System.
- Documentation, patterns, and templates must consume the package component or the official Package component registry.
- Docs CSS may arrange examples, but must not redefine component anatomy.

Foundations required: `Energy`, `Voice`, `Frame`, `Depth`, `Momentum`, `State`, `Tone`, `Growth`, `Symbol`, `Iconography`, `Accessibility`

Primitive dependencies: `Color`, `Typography`, `Spacing`, `Radius`, `Elevation`, `Iconography`, `Motion Curves`, `Duration`, `Breakpoints`, `Focus`, `Disabled`

Component dependencies: `None declared`

Token dependencies: `comp.chart-panel.*`, `sys.energy.*`, `sys.frame.*`, `sys.voice.*`, `sys.state.*`, `sys.momentum.*`, `sys.accessibility.*`

Gaps or review gates:

- No visible title
- Pixels-only value
- Raw values
- Dashboard logic inside component
- Comparison and Pareto render as generic bars
- Chart Panel renders data without the Charts primitive.
- ECharts option and fallback disagree on values or labels.
- Interactive chart marks cannot be reached by keyboard.
- Demos use placeholder data that reads as decoration.
- Ask before build: The chart changes financial or safety decisions.
- Ask before build: Multiple charts need shared filters or layout rules.
- Ask before build: The data source, unit, or comparison period is unclear.

## Use When

- Use Chart Panel for one trend, comparison, or KPI visualization.
- Choose compact only when the summary value carries the main meaning.
- Use warning or error when the metric needs operational attention.

## Do Not Use Without Review

- Ask before use when the chart changes financial or safety decisions.
- Ask before use when multiple charts need shared filters or layout rules.
- Ask before use when the data source, unit, or comparison period is unclear.
- The chart has no title.
- The chart is decorative only.
- The state is color-only.
- The chart has no readable title.
- The summary value only exists inside pixels.
- The plot is miniaturized until unreadable.
- Raw colors or motion values are used.
- Bars render without value/axis labels when the variant needs them.
- Sparkline, bars, Pareto, bullet, donut, or comparison collapse into the same generic chart.
- Chart Panel renders charts without going through the Charts primitive.
- ECharts option and fallback disagree on values or labels.
- Demos use placeholder values that read as decorative images.
- Interactive chart marks cannot be reached by keyboard.

## Operational Example

Use Chart Panel to frame one operational visualization with title, context, summary value, and actions.

### Why Chart Panel

- Chart Panel frames one visualization before it becomes a dashboard pattern.
- ZIP parity is applied to card geometry, compact hierarchy, chart density, and reveal motion while Flow keeps semantic color.
- Use a pattern when multiple panels need shared filters, layout rules, or navigation.

## Anatomy

| Part | Rule | Tokens |
| --- | --- | --- |
| Container | Frames one Charts primitive instance with stable spacing, border, density, and responsive width. | comp.chart-panel.*, sys.frame.* |
| Header | Names the metric and preserves compact overline hierarchy. | sys.voice.*, sys.energy.* |
| Summary value | Exposes the main reading as text before the visualization. | sys.voice.*, chart.summary |
| Charts primitive | Produces echartsOption, textSummary, legendModel, and tableFallback so rendering can hydrate with Apache ECharts or fall back safely. | chart.*, sys.energy.*, sys.a11y.* |
| Plot fallback | Renders a compact Flow fallback when ECharts is unavailable, without changing the data model. | sys.frame.*, sys.momentum.* |
| Caption | Clarifies period, unit, or comparison only when needed. | sys.voice.*, sys.tone.* |

## Accessibility

State precedence: disabled, error, warning, focus, hover, default

- Provide a readable chart title and accessible image label.
- Expose the key value in text, not only in the visualization.
- Keep warning and error states text-backed.
- Preserve focus visibility when chart actions are present.
- Respect reduced motion for animated chart reveals.

## Foundations

Referenced token families:

- `chart.*.*`
- `chart.summary.*`
- `comp.chart-panel.*`
- `sys.a11y.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.momentum.*`
- `sys.tone.*`
- `sys.voice.*`

Chart Panel API frames the Charts primitive. The primitive owns echartsOption, textSummary, legendModel, and tableFallback; the component owns the card frame, state, density, and accessible fallback.

## Variants

Chart Panel variants describe panel anatomy and compact fallback treatment. Detailed visualization form is requested through `chartType` and rendered by the Charts primitive.

Approved variants from demos: `sparkline`, `bars`, `line`, `area`, `donut`, `comparison`, `compact`

Approved `chartType` values from the ZIP FlowChart primitive: `line`, `area`, `bar`, `stackedBar`, `stacked100`, `donut`, `pie`, `scatter`, `heatmap`, `radar`, `waterfall`, `pareto`, `gauge`, `funnel`, `treemap`, `boxplot`

Demo labels:

- Fuel spend · MXN
- Authorizations by day
- Approval rate
- Fuel vs EV sessions
- Policy compliance
- Spend mix
- Cost drivers
- Target coverage
- Exceptions review
- Open blockers

## States

Chart Panel states communicate availability, attention, focus, hover, and error without changing the metric meaning.

Supported states from docs: `default`, `hover`, `focus`, `warning`, `error`, `disabled`

## Variant X State Behavior

Variant defines the visualization treatment; state defines feedback and availability without rewriting the data story.

State matrix: `default`, `hover`, `focus`, `warning`, `error`, `disabled`

| Row | Demo variant | Demo state |
| --- | --- | --- |
| Sparkline | sparkline |  |
| Bars | bars |  |
| Donut | donut |  |

## Full Width

Chart Panel can fill its parent in analytics layouts, but the plot keeps a useful minimum reading area.

- Dashboard band: layout: button-stack
- Detail drawer: layout: button-stack
- Comparison row: layout: button-stack

## Responsive Layout Patterns

Use one readable chart per row on small viewports and avoid shrinking plots below their useful reading width.

| Example | Layout | Density |
| --- | --- | --- |
| Phone | button-stack | lg |
| Desktop | button-stack | md |

## Viewport Organization

Chart Panel should use available width before adding more columns because dense charts lose meaning quickly.

| Viewport | Rule | Layout | Density |
| --- | --- | --- | --- |
| Phone | Use compact charts with visible value and caption. | single chart | lg |
| Tablet | Use one or two panels only when both remain readable. | wide panel | md |
| Desktop | Let critical charts breathe before arranging dense grids. | analysis band | sm |

## Playground

Use the playground to verify title, summary value, variant, state, and chart readability before composing dashboards.

| Control | Type | Default | Options |
| --- | --- | --- | --- |
| label | text | Fuel spend · MXN |  |
| value | text | $842k |  |
| variant | select | line | sparkline, bars, line, area, donut, comparison, compact |
| chartType | select | line | line, area, bar, stackedBar, stacked100, donut, pie, scatter, heatmap, radar, waterfall, pareto, gauge, funnel, treemap, boxplot |
| state | select | default | default, hover, focus, warning, error, disabled |

## API And Foundations

Chart Panel API frames the Charts primitive. The primitive owns echartsOption, textSummary, legendModel, and tableFallback; the component owns the card frame, state, density, and accessible fallback.

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| label | string | Yes | Panel label. |
| value | string | No | Primary displayed value. |
| caption | string | No | Short supporting caption. |
| values | number[] | No | Local chart values rendered inside the component. |
| labels | string[] | No | Optional labels for chart values, bars, segments, and accessible titles. |
| segments | ChartPanelSegment[] | No | Optional part-to-whole data for donut panels. |
| chartType | ChartPanelChartType | No | ECharts/Charts primitive visualization type. This does not create a Chart Panel variant. |
| matrix | ChartPanelMatrix | No | Heatmap rows, columns, and values. |
| indicators | Array<string \| { name: string; max?: number }> | No | Radar axis names and maximums. |
| target | number | No | Gauge or target-led chart value. |
| min | number | No | Optional numeric domain minimum. |
| max | number | No | Optional numeric domain maximum. |
| totals | number[] | No | Waterfall indexes that represent totals. |
| legend | boolean | No | Requests a compact primitive legend when the chart type supports it. |
| stack | boolean | No | Requests stacked series behavior for compatible charts. |
| horizontal | boolean | No | Requests horizontal orientation for compatible charts. |
| showValues | boolean | No | Requests direct value labels where legible. |
| palette | "auto" \| "duo" \| "categorical" | No | Chooses primitive palette strategy without raw colors. |
| variant | ChartPanelVariant | No | Panel anatomy and fallback treatment: sparkline, bars, line, area, donut, comparison, or compact. |
| state | ChartPanelState | No | Visual state: default, focus, hover, warning, error, or disabled. |
| tone | ChartPanelTone | No | Semantic tone for value and plot emphasis. |
| density | Density | No | Controls spacing and plot height. |
| fullWidth | boolean | No | Lets the panel fill its parent grid column. |
| series | ChartPanelSeries[] | No | Multi-series values passed into the Charts primitive for line and comparison panels. |
| comparisons | ChartPanelSeries[] | No | Paired series passed into the Charts primitive for grouped comparison panels. |
| valueLabels | string[] | No | Optional formatted labels used by fallback marks and tooltips while raw values remain numeric. |

## Implementation Checklist

- Provide `label`: Panel label.
- Chart title and accessible label
- Summary value visibility
- Reduced motion
- Warning and error contrast
- Responsive plot width
- No raw chart colors
- Charts primitive emits echartsOption, textSummary, legendModel, and tableFallback
- ECharts hydration keeps Flow fallback available when the library is missing
- Fallback marks expose hover and focus tooltip data.
- Motion uses Flow duration/easing and does not auto-open any tooltip.

## Tests And Rejection Rules

Must test:

- Chart title and accessible label
- Summary value visibility
- Reduced motion
- Warning and error contrast
- Responsive plot width
- No raw chart colors
- Charts primitive emits echartsOption, textSummary, legendModel, and tableFallback
- ECharts hydration keeps Flow fallback available when the library is missing
- Fallback marks expose hover and focus tooltip data.
- Motion uses Flow duration/easing and does not auto-open any tooltip.

Reject if:

- The chart has no readable title.
- The summary value only exists inside pixels.
- The plot is miniaturized until unreadable.
- Raw colors or motion values are used.
- Bars render without value/axis labels when the variant needs them.
- Sparkline, bars, Pareto, bullet, donut, or comparison collapse into the same generic chart.
- Chart Panel renders charts without going through the Charts primitive.
- ECharts option and fallback disagree on values or labels.
- Demos use placeholder values that read as decorative images.
- Interactive chart marks cannot be reached by keyboard.

## MIEL

MIEL treats Chart Panel as a Flow frame around the Charts primitive. Agents may place it when the metric is known, but humans confirm data meaning, comparison period, and whether Apache ECharts hydration is required.

Agents can decide:

- Use Chart Panel for one trend, comparison, or KPI visualization.
- Choose compact only when the summary value carries the main meaning.
- Use warning or error when the metric needs operational attention.

Agents must ask:

- The chart changes financial or safety decisions.
- Multiple charts need shared filters or layout rules.
- The data source, unit, or comparison period is unclear.

Agents must reject:

- The chart has no title.
- The chart is decorative only.
- The state is color-only.

Handoff language:

> I am using Chart Panel for one operational visualization. Please confirm metric, source, period, accessible summary, and whether this belongs in a dashboard pattern.
