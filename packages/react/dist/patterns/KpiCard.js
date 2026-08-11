import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { EmptyState } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import { KpiTile } from "../KpiTile.js";
import { Skeleton } from "../Skeleton.js";
import { Tag } from "../Tag.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

export const KpiCard = forwardRef(function KpiCard({
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

  if (!label) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "data-flow-pattern": "kpi-card",
      "data-state": resolvedState,
      "data-density": density,
      ...sanitizeRestProps(rest),
    },
    resolvedState === "loading"
      ? React.createElement(Skeleton, {
        label: `${label} loading`,
        variant: "card",
        density,
        lines: 3,
        state: "loading",
        fullWidth: true,
      })
      : null,
    resolvedState === "error"
      ? React.createElement(ErrorPanel, {
        label: error?.label ?? `${label} unavailable`,
        description: error?.description,
        action: error?.action,
        tone: error?.tone ?? "error",
        variant: error?.variant ?? "inline",
        state: "error",
        density,
        onAction: error?.onAction,
      })
      : null,
    !hasMetric && resolvedState !== "loading" && resolvedState !== "error"
      ? React.createElement(EmptyState, {
        title: empty?.title ?? `${label} is empty`,
        description: empty?.description,
        icon: empty?.icon,
        action: empty?.action,
        variant: empty?.variant ?? "search-empty",
        state: "search-empty",
        density,
        onAction: empty?.onAction,
      })
      : null,
    hasMetric && resolvedState !== "loading" && resolvedState !== "error"
      ? React.createElement(KpiTile, {
        label,
        value: String(value),
        delta,
        trend,
        tone,
        icon,
        variant: action?.label ? "drill-in" : "standard",
        state: resolvedState === "stale" ? "risk" : resolvedState === "disabled" ? "disabled" : "default",
        density,
        disabled,
        loading,
        onSelect,
        "data-kpi-unit": unit,
      })
      : null,
    status?.label
      ? React.createElement(Badge, {
        label: status.label,
        tone: status.tone ?? tone,
        variant: status.variant ?? "status",
        state: status.state ?? "default",
        density,
        live: status.live,
      })
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
      })
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
          onAction?.(action.key ?? action.label, event);
        },
      })
      : null,
  );
});

KpiCard.displayName = "KpiCard";
