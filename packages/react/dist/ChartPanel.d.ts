import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";
import type { chartPanelPlatformContract } from "#flow/platforms";

export type ChartPanelVariant = "sparkline" | "bar" | "bars" | "line" | "area" | "donut" | "pareto" | "bullet" | "comparison" | "compact";
export type ChartPanelState = "default" | "focus" | "hover" | "warning" | "error" | "disabled";
export type ChartPanelTone = "neutral" | "info" | "warning" | "danger";
export type ChartPanelDensity = "sm" | "md" | "lg";

export interface ChartPanelSegment {
  id?: string;
  label: string;
  value: number;
}

export interface ChartPanelSeries {
  id?: string;
  label: string;
  values: number[];
}

export interface ChartPanelProps extends Omit<HTMLAttributes<HTMLElement>, "style"> {
  label: string;
  value?: string;
  caption?: string;
  values?: number[];
  valueLabels?: string[];
  labels?: string[];
  segments?: ChartPanelSegment[];
  series?: ChartPanelSeries[];
  comparisons?: ChartPanelSeries[];
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
