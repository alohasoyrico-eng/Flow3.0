import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeDensity, BadgeProps, BadgeTone } from "../Badge.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import type { TableColumn, TableRow } from "../Table.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { ChartWrapper } from "./ChartWrapper.js";
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

type SafeRootProps = FlowDataAttributes & Record<`aria-${string}`, string | number | boolean | undefined>;

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeArray<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function durationDays(task: Partial<GanttChartTask> | undefined): number {
  const start = Date.parse(task?.start ?? "");
  const end = Date.parse(task?.end ?? "");
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(1, Math.ceil((end - start) / 86400000));
}

function resolveState({
  disabled,
  loading,
  error,
  selectedTaskKey,
  tasks,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  error?: ChartWrapperProps["error"] | undefined;
  selectedTaskKey?: string | undefined;
  tasks: GanttChartTask[];
  state?: GanttChartState | undefined;
}): GanttChartState {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (selectedTaskKey || state === "selected") return "selected";
  if (!tasks.length || state === "empty") return "empty";
  return state ?? "default";
}

function surfaceStateFor(resolvedState: GanttChartState): NonNullable<SurfaceProps["state"]> {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "error") return "critical" as NonNullable<SurfaceProps["state"]>;
  if (resolvedState === "loading") return "sunken";
  if (resolvedState === "selected") return "selected";
  return "default";
}

function badgeTone(metric: Partial<BadgeProps> | undefined, resolvedState: GanttChartState): BadgeTone {
  if (metric?.tone) return metric.tone;
  if (resolvedState === "error") return "danger";
  if (resolvedState === "selected") return "info";
  return "neutral";
}

function taskRows(tasks: GanttChartTask[]): TableRow[] {
  return tasks.map((task) => ({
    id: task.key,
    task: task.label,
    owner: task.owner ?? "Unassigned",
    start: task.start ?? "Not set",
    end: task.end ?? "Not set",
    progress: typeof task.progress === "number" ? `${task.progress}%` : "Not set",
    status: task.status ?? "default",
  }));
}

export const GanttChart = forwardRef<HTMLDivElement, GanttChartProps>(function GanttChart({
  label = "Gantt chart",
  description,
  density = "sm",
  state,
  disabled = false,
  loading = false,
  error,
  selectedTaskKey,
  tasks = [],
  milestones = [],
  dependencies = [],
  metrics = [],
  chart = {},
  table,
  list,
  feedback,
  primaryAction,
  overflow,
  className = "",
  onTaskSelect,
  onAction,
  ...rest
}, ref) {
  const normalizedTasks = normalizeArray(tasks).filter((task) => task?.key && task?.label);
  const normalizedMilestones = normalizeArray(milestones).filter((milestone) => milestone?.key && milestone?.label);
  const normalizedDependencies = normalizeArray(dependencies).filter((dependency) => dependency?.from && dependency?.to);
  const normalizedMetrics = normalizeArray(metrics).filter((metric) => metric?.label);
  const resolvedState = resolveState({ disabled, loading, error, selectedTaskKey, tasks: normalizedTasks, state });
  const isDisabled = disabled || resolvedState === "disabled";
  const isLoading = loading || resolvedState === "loading";
  const rows = table?.rows ?? taskRows(normalizedTasks);

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "section",
      state: surfaceStateFor(resolvedState),
      density,
      elevation: "none",
      focusMode: "within",
      role: "group",
      "aria-label": label,
      "aria-description": description,
      "aria-busy": isLoading ? "true" : undefined,
      "data-flow-pattern": "gantt-chart",
      "data-flow-slot": "ganttChartSurface",
      "data-gantt-chart-state": resolvedState,
      "data-density": density,
      "data-task-count": String(normalizedTasks.length),
      "data-milestone-count": String(normalizedMilestones.length),
      "data-dependency-count": String(normalizedDependencies.length),
      ...sanitizeRestProps(rest),
    },
    description
      ? React.createElement(Badge, {
        label: description,
        tone: badgeTone(undefined, resolvedState),
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        "data-flow-slot": "ganttSummary",
      } as BadgeProps)
      : null,
    normalizedMetrics.map((metric) => React.createElement(Badge, {
      ...metric,
      key: metric.key ?? metric.label,
      label: metric.label,
      tone: badgeTone(metric, resolvedState),
      variant: metric.variant ?? "status",
      density: metric.density ?? density,
      state: isDisabled ? "disabled" : metric.state ?? "default",
      live: metric.live ?? true,
      "data-flow-slot": "ganttMetric",
    } as BadgeProps)),
    React.createElement(ChartWrapper, {
      label,
      description,
      density,
      state: (resolvedState === "selected" ? "interactive" : resolvedState) as ChartWrapperProps["state"],
      disabled: isDisabled,
      loading: isLoading,
      empty: resolvedState === "empty",
      error,
      chart: {
        ...chart,
        label: chart.label ?? label,
        caption: chart.caption ?? description,
        variant: chart.variant ?? "comparison",
        values: chart.values ?? normalizedTasks.map(durationDays),
        labels: chart.labels ?? normalizedTasks.map((task) => task.label),
        valueLabels: chart.valueLabels ?? normalizedTasks.map((task) => task.end ?? task.start ?? task.label),
        state: chart.state ?? (selectedTaskKey ? "focus" : undefined),
        "data-chart-kind": "gantt",
      },
      summary: chart.summary,
      status: chart.status ?? {
        label: `${normalizedMilestones.length} milestones · ${normalizedDependencies.length} dependencies`,
        tone: normalizedDependencies.length ? "info" : "neutral",
      },
      primaryAction,
      overflow,
      table: {
        columns: [
          { key: "task", label: "Task" },
          { key: "owner", label: "Owner" },
          { key: "start", label: "Start" },
          { key: "end", label: "End" },
          { key: "progress", label: "Progress", align: "right" },
          ...(table?.columns ?? []).filter((column: TableColumn) => !["task", "owner", "start", "end", "progress"].includes(column.key)),
        ],
        ...table,
        label: table?.label ?? `${label} task schedule`,
        rows,
        rowKey: table?.rowKey ?? "id",
        selectedKey: table?.selectedKey ?? selectedTaskKey,
        density: table?.density ?? density,
        state: table?.state ?? (selectedTaskKey ? "selected" : "default"),
        onRowSelect: (key, event) => {
          table?.onRowSelect?.(key, event);
          if (event.defaultPrevented) return;
          onTaskSelect?.(key, event);
        },
        "data-flow-slot": "ganttDataSummary",
      },
      list: list ?? (normalizedMilestones.length
        ? {
          label: `${label} milestones`,
          items: normalizedMilestones.map((milestone) => ({
            key: milestone.key,
            label: milestone.label,
            meta: milestone.date,
            description: milestone.description,
          })),
        }
        : undefined),
      emptyState: feedback?.emptyState,
      errorPanel: feedback?.errorPanel,
      skeleton: feedback?.skeleton,
      onAction,
      "data-flow-pattern-boundary": "chart-wrapper",
      "data-flow-slot": "chartWrapperBoundary",
    } as ChartWrapperProps),
    feedback?.status
      ? React.createElement(Badge, {
        ...feedback.status,
        label: feedback.status.label,
        density: feedback.status.density ?? density,
        tone: feedback.status.tone ?? badgeTone(feedback.status, resolvedState),
        variant: feedback.status.variant ?? "status",
        state: isDisabled ? "disabled" : feedback.status.state ?? "default",
        live: feedback.status.live ?? true,
        "data-flow-slot": "ganttFeedback",
      } as BadgeProps)
      : null,
  );
}) as GanttChartComponent;

GanttChart.displayName = "GanttChart";
