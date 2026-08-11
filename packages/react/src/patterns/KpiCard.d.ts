import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { EmptyStateAction, EmptyStateProps } from "../EmptyState.js";
import type { ErrorPanelAction, ErrorPanelProps } from "../ErrorPanel.js";
import type { KpiTileProps, KpiTileSelectEvent, KpiTileMeta } from "../KpiTile.js";
import type { TagProps } from "../Tag.js";

export type KpiCardState =
  | "default"
  | "loading"
  | "empty"
  | "error"
  | "stale"
  | "permission-blocked"
  | "interactive"
  | "disabled";

export type KpiCardDensity = "sm" | "md" | "lg";

export interface KpiCardStatus extends Pick<BadgeProps, "label" | "tone" | "variant" | "state" | "live"> {}

export interface KpiCardTag extends Pick<TagProps, "label" | "tone" | "variant" | "state" | "icon" | "interactive" | "disabled"> {}

export interface KpiCardAction extends Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "icon" | "trailingIcon" | "type" | "onClick"> {
  key?: string;
}

export interface KpiCardEmptyState extends Pick<EmptyStateProps, "title" | "description" | "icon" | "variant"> {
  action?: EmptyStateAction;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface KpiCardErrorState extends Pick<ErrorPanelProps, "label" | "description" | "tone" | "variant"> {
  action?: ErrorPanelAction;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface KpiCardProps {
  label: string;
  value?: string | number;
  unit?: string;
  delta?: string;
  trend?: KpiTileProps["trend"];
  tone?: KpiTileProps["tone"];
  icon?: string;
  density?: KpiCardDensity;
  state?: KpiCardState;
  disabled?: boolean;
  loading?: boolean;
  status?: KpiCardStatus;
  tag?: KpiCardTag;
  action?: KpiCardAction;
  empty?: KpiCardEmptyState;
  error?: KpiCardErrorState;
  className?: string;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onSelect?: (metric: KpiTileMeta, event: KpiTileSelectEvent) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface KpiCardComponent extends ForwardRefExoticComponent<KpiCardProps & RefAttributes<HTMLDivElement>> {
  displayName: "KpiCard";
}

export const KpiCard: KpiCardComponent;
