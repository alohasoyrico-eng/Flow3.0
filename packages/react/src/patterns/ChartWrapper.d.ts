import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { ChartPanelDensity, ChartPanelProps } from "../ChartPanel.js";
import type { EmptyStateProps } from "../EmptyState.js";
import type { ErrorPanelProps } from "../ErrorPanel.js";
import type { KpiTileProps } from "../KpiTile.js";
import type { ListProps } from "../List.js";
import type { MenuProps } from "../Menu.js";
import type { SkeletonProps } from "../Skeleton.js";
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

export const ChartWrapper: ChartWrapperComponent;
