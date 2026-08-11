import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ChartWrapperProps } from "./ChartWrapper.js";

export type WaterfallChartState =
  | "default"
  | "selected"
  | "loading"
  | "empty"
  | "error"
  | "disabled";
export type WaterfallChartDensity = BadgeDensity;
export type WaterfallChartStepKind = "delta" | "total";
export type WaterfallChartStepDirection = "increase" | "decrease" | "neutral" | "total";

export interface WaterfallChartStep {
  key: string;
  label: string;
  value: number;
  formattedValue?: string;
  formattedCumulative?: string;
  kind?: WaterfallChartStepKind;
  direction?: WaterfallChartStepDirection;
  note?: string;
}

export type WaterfallChartMetric = Partial<BadgeProps> & {
  key?: string;
  label: string;
};

export interface WaterfallChartFeedback {
  status?: Partial<BadgeProps> & { key?: string; label: string };
  emptyState?: ChartWrapperProps["emptyState"];
  errorPanel?: ChartWrapperProps["errorPanel"];
  skeleton?: ChartWrapperProps["skeleton"];
}

export interface WaterfallChartProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: WaterfallChartDensity;
  state?: WaterfallChartState;
  disabled?: boolean;
  loading?: boolean;
  error?: ChartWrapperProps["error"];
  selectedStepKey?: string;
  steps?: WaterfallChartStep[];
  metrics?: WaterfallChartMetric[];
  chart?: NonNullable<ChartWrapperProps["chart"]> & {
    summary?: ChartWrapperProps["summary"];
    status?: ChartWrapperProps["status"];
  };
  table?: ChartWrapperProps["table"];
  list?: ChartWrapperProps["list"];
  feedback?: WaterfallChartFeedback;
  primaryAction?: ChartWrapperProps["primaryAction"];
  overflow?: ChartWrapperProps["overflow"];
  className?: string;
  onStepSelect?: NonNullable<ChartWrapperProps["table"]>["onRowSelect"];
  onAction?: ChartWrapperProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface WaterfallChartComponent extends ForwardRefExoticComponent<WaterfallChartProps & RefAttributes<HTMLDivElement>> {
  displayName: "WaterfallChart";
}

export const WaterfallChart: WaterfallChartComponent;
