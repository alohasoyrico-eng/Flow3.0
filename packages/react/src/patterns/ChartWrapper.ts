import React, {
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { ChartPanel } from "../ChartPanel.js";
import type { ChartPanelDensity, ChartPanelProps, ChartPanelState, ChartPanelTone } from "../ChartPanel.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateProps } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import type { ErrorPanelProps } from "../ErrorPanel.js";
import { KpiTile } from "../KpiTile.js";
import type { KpiTileProps } from "../KpiTile.js";
import { List } from "../List.js";
import type { ListProps } from "../List.js";
import { Menu } from "../Menu.js";
import type { MenuProps } from "../Menu.js";
import { Skeleton } from "../Skeleton.js";
import type { SkeletonProps } from "../Skeleton.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import { Table } from "../Table.js";
import type { TableProps } from "../Table.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type ChartWrapperState = "default" | "loading" | "empty" | "error" | "filtered" | "permission-blocked" | "interactive" | "disabled";
export type ChartWrapperDensity = ChartPanelDensity;

export interface ChartWrapperAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  key?: string;
  label: string;
}

export interface ChartWrapperError {
  label?: string;
  description?: string;
  action?: ErrorPanelProps["action"];
  onAction?: ErrorPanelProps["onAction"];
}

export interface ChartWrapperProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: ChartWrapperDensity;
  state?: ChartWrapperState;
  disabled?: boolean;
  loading?: boolean;
  empty?: boolean;
  error?: ChartWrapperError;
  filtered?: boolean;
  permissionBlocked?: boolean;
  interactive?: boolean;
  chart?: Partial<ChartPanelProps>;
  summary?: Partial<KpiTileProps> & { value: string };
  status?: Partial<BadgeProps> & { label: string };
  primaryAction?: ChartWrapperAction;
  overflow?: Partial<MenuProps>;
  table?: Partial<TableProps>;
  list?: Partial<ListProps>;
  emptyState?: Partial<EmptyStateProps>;
  errorPanel?: Partial<ErrorPanelProps>;
  skeleton?: Partial<SkeletonProps>;
  className?: string;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface ChartWrapperComponent extends ForwardRefExoticComponent<ChartWrapperProps & RefAttributes<HTMLDivElement>> {
  displayName: "ChartWrapper";
}

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function resolveState({
  disabled,
  loading,
  empty,
  error,
  permissionBlocked,
  filtered,
  interactive,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  empty: boolean;
  error: boolean;
  permissionBlocked: boolean;
  filtered: boolean;
  interactive: boolean;
  state: ChartWrapperState | undefined;
}): ChartWrapperState {
  if (disabled || state === "disabled") return "disabled";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (empty || state === "empty") return "empty";
  if (filtered || state === "filtered") return "filtered";
  if (interactive || state === "interactive") return "interactive";
  return state ?? "default";
}

function chartState(resolvedState: ChartWrapperState): ChartPanelState {
  if (resolvedState === "error") return "error";
  if (resolvedState === "disabled" || resolvedState === "permission-blocked") return "disabled";
  if (resolvedState === "filtered") return "warning";
  return "default";
}

function chartTone(resolvedState: ChartWrapperState): ChartPanelTone {
  if (resolvedState === "error") return "danger";
  if (resolvedState === "filtered") return "warning";
  return "neutral";
}

function hasRows(table: Partial<TableProps> | undefined): table is Partial<TableProps> & Pick<TableProps, "columns" | "rows"> {
  return Array.isArray(table?.columns) && table.columns.length > 0 && Array.isArray(table?.rows) && table.rows.length > 0;
}

function hasList(list: Partial<ListProps> | undefined): list is Partial<ListProps> & Pick<ListProps, "items"> {
  return Array.isArray(list?.items) && list.items.length > 0;
}

export const ChartWrapper = forwardRef<HTMLDivElement, ChartWrapperProps>(function ChartWrapper({
  label = "Chart",
  description,
  density,
  state,
  disabled = false,
  loading = false,
  empty = false,
  error,
  filtered = false,
  permissionBlocked = false,
  interactive = false,
  chart,
  summary,
  status,
  primaryAction,
  overflow,
  table,
  list,
  emptyState,
  errorPanel,
  skeleton,
  className = "",
  onAction,
  ...rest
}, ref) {
  const resolvedState = resolveState({ disabled, loading, empty, error: Boolean(error), permissionBlocked, filtered, interactive, state });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "permission-blocked";
  const showLoading = resolvedState === "loading";
  const showEmpty = resolvedState === "empty" || resolvedState === "permission-blocked";
  const showError = resolvedState === "error";
  const chartProps = chart ?? {};

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": showLoading ? "true" : undefined,
      "data-flow-pattern": "chart-wrapper",
      "data-state": resolvedState,
      "data-density": density,
      "data-has-table-summary": String(hasRows(table)),
      "data-has-list-summary": String(hasList(list)),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Surface, {
      surfaceRole: "section",
      state: isDisabled ? "disabled" : showError ? "sunken" : "default",
      density,
      "data-chart-wrapper-surface": "true",
    } as SurfaceProps,
      summary
        ? React.createElement(KpiTile, {
          ...summary,
          label: summary.label ?? label,
          value: summary.value,
          density: summary.density ?? density,
          state: summary.state ?? (isDisabled ? "disabled" : showLoading ? "loading" : "default"),
          disabled: isDisabled || summary.disabled,
        } as KpiTileProps)
        : null,
      status
        ? React.createElement(Badge, {
          ...status,
          label: status.label,
          density: status.density ?? density,
          tone: status.tone ?? (filtered ? "warning" : "info"),
          variant: status.variant ?? "status",
          live: status.live ?? true,
        } as BadgeProps)
        : null,
      primaryAction
        ? React.createElement(Button, {
          ...primaryAction,
          label: primaryAction.label,
          density: primaryAction.density ?? density,
          variant: primaryAction.variant ?? "secondary",
          disabled: isDisabled || primaryAction.disabled,
          onClick: (event: MouseEvent<HTMLButtonElement>) => {
            primaryAction.onClick?.(event);
            if (event.defaultPrevented) return;
            onAction?.(primaryAction.key ?? primaryAction.label, event);
          },
        } as ButtonProps)
        : null,
      overflow
        ? React.createElement(Menu, {
          ...overflow,
          triggerLabel: overflow.triggerLabel ?? "Chart actions",
          items: overflow.items ?? [],
          density: overflow.density ?? density,
          state: isDisabled ? "disabled" : overflow.state,
          disabled: isDisabled || overflow.disabled,
        } as MenuProps)
        : null,
      showLoading
        ? React.createElement(Skeleton, {
          label: skeleton?.label ?? `${label} loading`,
          variant: skeleton?.variant ?? "chart",
          density,
          state: "loading",
          rows: skeleton?.rows,
          columns: skeleton?.columns,
          fullWidth: skeleton?.fullWidth ?? true,
        } as SkeletonProps)
        : null,
      showEmpty
        ? React.createElement(EmptyState, {
          title: emptyState?.title ?? (permissionBlocked ? `${label} unavailable` : `${label} has no data`),
          description: emptyState?.description ?? description,
          icon: emptyState?.icon,
          action: emptyState?.action,
          variant: emptyState?.variant ?? (permissionBlocked ? "permission" : "search-empty"),
          state: emptyState?.state ?? (permissionBlocked ? "permission" : "search-empty"),
          density,
          fullWidth: true,
          onAction: emptyState?.onAction,
        } as EmptyStateProps)
        : null,
      showError
        ? React.createElement(ErrorPanel, {
          label: errorPanel?.label ?? error?.label ?? `${label} unavailable`,
          description: errorPanel?.description ?? error?.description ?? description,
          action: errorPanel?.action ?? error?.action,
          tone: errorPanel?.tone ?? "error",
          variant: errorPanel?.variant ?? "panel",
          state: errorPanel?.state ?? "error",
          density,
          fullWidth: true,
          onAction: errorPanel?.onAction ?? error?.onAction,
        } as ErrorPanelProps)
        : null,
      !showLoading && !showEmpty && !showError
        ? React.createElement(ChartPanel, {
          ...chartProps,
          label: chartProps.label ?? label,
          caption: chartProps.caption ?? description,
          density: chartProps.density ?? density,
          state: chartProps.state ?? chartState(resolvedState),
          tone: chartProps.tone ?? chartTone(resolvedState),
          fullWidth: chartProps.fullWidth ?? true,
        } as ChartPanelProps)
        : null,
      hasRows(table)
        ? React.createElement(Table, {
          ...table,
          label: table.label ?? `${label} data summary`,
          density: table.density ?? density,
          state: table.state ?? (isDisabled ? "disabled" : "default"),
        } as TableProps)
        : null,
      hasList(list)
        ? React.createElement(List, {
          ...list,
          label: list.label ?? `${label} list summary`,
          density: list.density ?? density,
          state: list.state ?? (isDisabled ? "disabled" : "default"),
          interactive: list.interactive ?? false,
        } as ListProps)
        : null,
    ),
  );
}) as ChartWrapperComponent;

ChartWrapper.displayName = "ChartWrapper";
