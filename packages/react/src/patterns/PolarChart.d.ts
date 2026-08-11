import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ChartWrapperProps } from "./ChartWrapper.js";

export type PolarChartState =
  | "default"
  | "selected"
  | "loading"
  | "empty"
  | "error"
  | "disabled";
export type PolarChartDensity = BadgeDensity;

export interface PolarChartSegment {
  key: string;
  label: string;
  value: number;
  formattedValue?: string;
  share?: string;
  status?: string;
}

export type PolarChartMetric = Partial<BadgeProps> & {
  key?: string;
  label: string;
};

export interface PolarChartFeedback {
  status?: Partial<BadgeProps> & { key?: string; label: string };
  emptyState?: ChartWrapperProps["emptyState"];
  errorPanel?: ChartWrapperProps["errorPanel"];
  skeleton?: ChartWrapperProps["skeleton"];
}

export interface PolarChartProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: PolarChartDensity;
  state?: PolarChartState;
  disabled?: boolean;
  loading?: boolean;
  error?: ChartWrapperProps["error"];
  selectedSegmentKey?: string;
  segments?: PolarChartSegment[];
  metrics?: PolarChartMetric[];
  chart?: NonNullable<ChartWrapperProps["chart"]> & {
    summary?: ChartWrapperProps["summary"];
    status?: ChartWrapperProps["status"];
  };
  table?: ChartWrapperProps["table"];
  list?: ChartWrapperProps["list"];
  feedback?: PolarChartFeedback;
  primaryAction?: ChartWrapperProps["primaryAction"];
  overflow?: ChartWrapperProps["overflow"];
  className?: string;
  onSegmentSelect?: NonNullable<ChartWrapperProps["table"]>["onRowSelect"];
  onAction?: ChartWrapperProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface PolarChartComponent extends ForwardRefExoticComponent<PolarChartProps & RefAttributes<HTMLDivElement>> {
  displayName: "PolarChart";
}

export const PolarChart: PolarChartComponent;
