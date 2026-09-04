import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { chartPanelPlatformContract } from "#flow/platforms";

export type ChartPanelVariant = "sparkline" | "bars" | "line" | "area" | "donut" | "comparison" | "compact";
export type ChartPanelChartType = ChartPanelVariant | "bar" | "stackedBar" | "stacked100" | "pie" | "scatter" | "heatmap" | "radar" | "waterfall" | "pareto" | "gauge" | "funnel" | "treemap" | "boxplot";
export type ChartPanelState = "default" | "focus" | "hover" | "warning" | "error" | "disabled";
export type ChartPanelTone = "neutral" | "info" | "warning" | "danger";
export type ChartPanelDensity = "sm" | "md" | "lg";

export interface ChartPanelSegment {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface ChartPanelDataItem {
  label?: string;
  name?: string;
  value?: number | string;
  y?: number | string;
  values?: unknown[];
  color?: string;
  children?: ChartPanelDataItem[];
}

export interface ChartPanelSeries {
  id: string;
  label: string;
  values?: unknown[];
  data?: ChartPanelDataItem[] | undefined;
  color?: string | undefined;
  symbolSize?: number | undefined;
}

export interface ChartPanelMatrix {
  rows: string[];
  cols: string[];
  values: Array<[number, number, number]>;
}

export interface ChartPanelProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: string;
  caption?: string;
  values?: number[];
  valueLabels?: string[];
  labels?: string[];
  segments?: ChartPanelSegment[];
  series?: ChartPanelSeries[];
  comparisons?: ChartPanelSeries[];
  chartType?: ChartPanelChartType;
  matrix?: ChartPanelMatrix;
  indicators?: Array<string | { name: string; max?: number }>;
  target?: number;
  min?: number;
  max?: number;
  totals?: number[];
  legend?: boolean;
  stack?: boolean;
  horizontal?: boolean;
  showValues?: boolean;
  palette?: "auto" | "duo" | "categorical";
  variant?: ChartPanelVariant;
  state?: ChartPanelState;
  tone?: ChartPanelTone;
  density?: ChartPanelDensity;
  fullWidth?: boolean;
}

export interface ChartPanelComponent extends ForwardRefExoticComponent<ChartPanelProps & RefAttributes<HTMLElement>> {
  displayName: "ChartPanel";
  platformContract: typeof chartPanelPlatformContract;
}

export const ChartPanel: ChartPanelComponent;
