import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ChartWrapperProps } from "./ChartWrapper.js";

export type GanttChartState =
  | "default"
  | "selected"
  | "loading"
  | "empty"
  | "error"
  | "disabled";
export type GanttChartDensity = BadgeDensity;

export interface GanttChartTask {
  key: string;
  label: string;
  owner?: string;
  start?: string;
  end?: string;
  progress?: number;
  status?: string;
}

export interface GanttChartMilestone {
  key: string;
  label: string;
  date?: string;
  description?: string;
}

export interface GanttChartDependency {
  from: string;
  to: string;
  type?: "finish-start" | "start-start" | "finish-finish" | "start-finish";
}

export type GanttChartMetric = Partial<BadgeProps> & {
  key?: string;
  label: string;
};

export interface GanttChartFeedback {
  status?: Partial<BadgeProps> & { key?: string; label: string };
  emptyState?: ChartWrapperProps["emptyState"];
  errorPanel?: ChartWrapperProps["errorPanel"];
  skeleton?: ChartWrapperProps["skeleton"];
}

export interface GanttChartProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: GanttChartDensity;
  state?: GanttChartState;
  disabled?: boolean;
  loading?: boolean;
  error?: ChartWrapperProps["error"];
  selectedTaskKey?: string;
  tasks?: GanttChartTask[];
  milestones?: GanttChartMilestone[];
  dependencies?: GanttChartDependency[];
  metrics?: GanttChartMetric[];
  chart?: NonNullable<ChartWrapperProps["chart"]> & {
    summary?: ChartWrapperProps["summary"];
    status?: ChartWrapperProps["status"];
  };
  table?: ChartWrapperProps["table"];
  list?: ChartWrapperProps["list"];
  feedback?: GanttChartFeedback;
  primaryAction?: ChartWrapperProps["primaryAction"];
  overflow?: ChartWrapperProps["overflow"];
  className?: string;
  onTaskSelect?: NonNullable<ChartWrapperProps["table"]>["onRowSelect"];
  onAction?: ChartWrapperProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface GanttChartComponent extends ForwardRefExoticComponent<GanttChartProps & RefAttributes<HTMLDivElement>> {
  displayName: "GanttChart";
}

export const GanttChart: GanttChartComponent;
