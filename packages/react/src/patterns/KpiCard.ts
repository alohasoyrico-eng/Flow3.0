import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateAction, EmptyStateProps } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import type { ErrorPanelAction, ErrorPanelProps } from "../ErrorPanel.js";
import { KpiTile } from "../KpiTile.js";
import type { KpiTileMeta, KpiTileProps, KpiTileSelectEvent } from "../KpiTile.js";
import { Skeleton } from "../Skeleton.js";
import type { SkeletonProps } from "../Skeleton.js";
import { Tag } from "../Tag.js";
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

type SafeRootProps = Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined>;

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

export const KpiCard = forwardRef<HTMLDivElement, KpiCardProps>(function KpiCard({
  label,
  value,
  unit = "",
  delta,
  trend = "flat",
  tone = "neutral",
  icon,
  density,
  state = "default",
  disabled = false,
  loading = false,
  status,
  tag,
  action,
  empty,
  error,
  onAction,
  onSelect,
  className = "",
  ...rest
}, ref) {
  const resolvedState = disabled ? "disabled" : loading || state === "loading" ? "loading" : state;
  const hasMetric = value !== undefined && value !== null && value !== "";
  const showLoading = resolvedState === "loading";
  const showError = resolvedState === "error";
  const showPermission = resolvedState === "permission-blocked";
  const showEmpty = resolvedState === "empty" || (!hasMetric && !showLoading && !showError && !showPermission);
  const showMetric = hasMetric && !showLoading && !showError && !showEmpty && !showPermission;
  const hasDrillIn = Boolean(onSelect);

  if (!label) return null;

  return React.createElement(
    "div",
    {
      ref,
      className: ["kpi-card", className].filter(Boolean).join(" "),
      role: "group",
      "aria-label": label,
      "data-flow-pattern": "kpi-card",
      "data-state": resolvedState,
      "data-density": density,
      ...sanitizeRestProps(rest),
    },
    showLoading
      ? React.createElement(Skeleton, {
        label: `${label} loading`,
        variant: "card",
        density,
        lines: 3,
        state: "loading",
        fullWidth: true,
      } as SkeletonProps)
      : null,
    showError
      ? React.createElement(ErrorPanel, {
        label: error?.label ?? `${label} unavailable`,
        description: error?.description,
        action: error?.action,
        tone: error?.tone ?? "error",
        variant: error?.variant ?? "inline",
        state: "error",
        density,
        onAction: error?.onAction,
      } as ErrorPanelProps)
      : null,
    showPermission
      ? React.createElement(EmptyState, {
        title: empty?.title ?? `${label} is permission blocked`,
        description: empty?.description,
        icon: empty?.icon ?? "lock",
        action: empty?.action,
        variant: empty?.variant ?? "permission",
        state: "permission",
        density,
        onAction: empty?.onAction,
      } as EmptyStateProps)
      : null,
    showEmpty
      ? React.createElement(EmptyState, {
        title: empty?.title ?? `${label} is empty`,
        description: empty?.description,
        icon: empty?.icon,
        action: empty?.action,
        variant: empty?.variant ?? "search-empty",
        state: "search-empty",
        density,
        onAction: empty?.onAction,
      } as EmptyStateProps)
      : null,
    showMetric
      ? React.createElement(KpiTile, {
        label,
        value: String(value),
        delta,
        trend,
        tone,
        icon,
        variant: hasDrillIn ? "drill-in" : "standard",
        state: resolvedState === "stale" ? "risk" : resolvedState === "disabled" ? "disabled" : "default",
        density,
        disabled,
        loading,
        onSelect,
        "data-kpi-unit": unit,
      } as KpiTileProps)
      : null,
    status?.label
      ? React.createElement(Badge, {
        label: status.label,
        tone: status.tone ?? tone,
        variant: status.variant ?? "status",
        state: status.state ?? "default",
        density,
        live: status.live,
      } as BadgeProps)
      : null,
    tag?.label
      ? React.createElement(Tag, {
        label: tag.label,
        tone: tag.tone ?? tone,
        variant: tag.variant ?? "metadata",
        state: tag.state ?? "default",
        density,
        icon: tag.icon,
        interactive: tag.interactive,
        disabled: disabled || tag.disabled,
      } as TagProps)
      : null,
    action?.label
      ? React.createElement(Button, {
        ...action,
        label: action.label,
        density: action.density ?? density,
        variant: action.variant ?? "ghost",
        disabled: disabled || action.disabled,
        onClick: (event) => {
          action.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.(action.key ?? action.label ?? "action", event);
        },
      } as ButtonProps)
      : null,
  );
}) as KpiCardComponent;

KpiCard.displayName = "KpiCard";
