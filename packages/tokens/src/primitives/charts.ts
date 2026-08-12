import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type ChartsPrimitiveTokenName = Extract<FlowTokenName, "sys-chart-axis-color" | "sys-chart-empty-color" | "sys-chart-focus-ring" | "sys-chart-grid-color" | "sys-chart-legend-text-color" | "sys-chart-motion-duration-enter" | "sys-chart-motion-duration-update" | "sys-chart-motion-easing-enter" | "sys-chart-motion-easing-update" | "sys-chart-series-primary" | "sys-chart-series-quaternary" | "sys-chart-series-secondary" | "sys-chart-series-tertiary" | "sys-chart-summary-font" | "sys-chart-summary-line-height" | "sys-chart-threshold-danger" | "sys-chart-threshold-warning" | "sys-chart-tooltip-background" | "sys-chart-tooltip-foreground">;

export const chartsPrimitive = {
  name: "Charts",
  slug: "charts",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Energy, Accessibility, Momentum, and data roles into implementation-ready ECharts primitives for series, thresholds, legends, summaries, tooltips, empty states, and drilldown.",
  governingFoundations: [
  "Energy",
  "Accessibility",
  "Momentum",
  "Voice",
  "State"
],
  coordinatesPrimitives: [
  "Library Sources",
  "Measurement",
  "Message"
],
  tokenDependencies: [
  "chart.*",
  "library.*",
  "sys.energy.*",
  "sys.momentum.*",
  "sys.voice.*",
  "sys.accessibility.*"
],
  roles: [
  {
    "id": "series",
    "token": "chart.series.*",
    "use": "Data series color/shape/label mapping."
  },
  {
    "id": "threshold",
    "token": "chart.threshold.*",
    "use": "Risk bands and operational limits."
  },
  {
    "id": "legend",
    "token": "chart.legend.*",
    "use": "Toggleable, keyboard-reachable series control."
  },
  {
    "id": "summary",
    "token": "chart.summary",
    "use": "Text explanation of chart meaning."
  },
  {
    "id": "empty",
    "token": "chart.empty",
    "use": "No data with reason and next action."
  }
],
  states: [
  "loading",
  "empty",
  "error",
  "stale",
  "interactive",
  "selected"
],
  rejectIf: [
  "Chart lacks text summary.",
  "Color is sole encoding.",
  "Empty state lacks reason/next action.",
  "Tooltip is pointer-only."
],
  tokenNames: [
  "sys-chart-axis-color",
  "sys-chart-empty-color",
  "sys-chart-focus-ring",
  "sys-chart-grid-color",
  "sys-chart-legend-text-color",
  "sys-chart-motion-duration-enter",
  "sys-chart-motion-duration-update",
  "sys-chart-motion-easing-enter",
  "sys-chart-motion-easing-update",
  "sys-chart-series-primary",
  "sys-chart-series-quaternary",
  "sys-chart-series-secondary",
  "sys-chart-series-tertiary",
  "sys-chart-summary-font",
  "sys-chart-summary-line-height",
  "sys-chart-threshold-danger",
  "sys-chart-threshold-warning",
  "sys-chart-tooltip-background",
  "sys-chart-tooltip-foreground"
] as const satisfies readonly ChartsPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<ChartsPrimitiveTokenName>(["sys-chart-axis-color","sys-chart-empty-color","sys-chart-focus-ring","sys-chart-grid-color","sys-chart-legend-text-color","sys-chart-motion-duration-enter","sys-chart-motion-duration-update","sys-chart-motion-easing-enter","sys-chart-motion-easing-update","sys-chart-series-primary","sys-chart-series-quaternary","sys-chart-series-secondary","sys-chart-series-tertiary","sys-chart-summary-font","sys-chart-summary-line-height","sys-chart-threshold-danger","sys-chart-threshold-warning","sys-chart-tooltip-background","sys-chart-tooltip-foreground"]),
} as const;
