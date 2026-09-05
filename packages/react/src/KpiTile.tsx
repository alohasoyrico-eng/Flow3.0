import React, { forwardRef } from "react";
import { kpiTilePlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

import type { ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type KpiTileVariant = "standard" | "compact" | "delta" | "threshold" | "sparkline" | "drill-in";
export type KpiTileState = "default" | "hover" | "focus" | "pressed" | "selected" | "loading" | "risk" | "disabled";
export type KpiTileDensity = FlowDensity;
export type KpiTileTone = "neutral" | "info" | "success" | "warning" | "danger";
export type KpiTileTrend = "up" | "down" | "flat";

export interface KpiTileMeta {
  label: string;
  value: string;
  delta?: string;
  tone: KpiTileTone;
  variant: KpiTileVariant;
}
export type KpiTileSelectEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export interface KpiTileProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "onSelect" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value: string;
  delta?: string;
  trend?: KpiTileTrend;
  tone?: KpiTileTone;
  icon?: string;
  variant?: KpiTileVariant;
  state?: KpiTileState;
  density?: KpiTileDensity;
  values?: number[];
  href?: string;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onSelect?: (metric: KpiTileMeta, event: KpiTileSelectEvent) => void;
}

export interface KpiTileComponent extends ForwardRefExoticComponent<KpiTileProps & RefAttributes<HTMLElement>> {
  displayName: "KpiTile";
  platformContract: typeof kpiTilePlatformContract;
}

const validVariants = new Set<KpiTileVariant>(["standard", "compact", "delta", "threshold", "sparkline", "drill-in"]);
const validStates = new Set<KpiTileState>(["default", "hover", "focus", "pressed", "selected", "loading", "risk", "disabled"]);
const validTones = new Set<KpiTileTone>(["neutral", "info", "success", "warning", "danger"]);
const validTrends = new Set<KpiTileTrend>(["up", "down", "flat"]);

function sparklinePoints(values: number[]): string {
  const safeValues = values.map((item) => Number.isFinite(Number(item)) ? Math.max(0, Number(item)) : 0);
  const max = Math.max(...safeValues, 1);
  const width = 112;
  const height = 34;
  return safeValues.map((item, index) => {
    const x = safeValues.length === 1 ? width : (index / (safeValues.length - 1)) * width;
    const y = height - (item / max) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export const KpiTile = forwardRef<HTMLElement, KpiTileProps>(function KpiTile({
  label,
  value,
  delta = "",
  trend = "flat",
  tone = "neutral",
  icon = "",
  variant = "standard",
  state = "default",
  density,
  values,
  href = "",
  selected = false,
  disabled = false,
  loading = false,
  onSelect,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "standard");
  const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
  const resolvedTrend = normalizeFlowValue(trend, validTrends, "flat");
  const resolvedState = loading ? "loading" : disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const visibleLabel = typeof label === "string" ? label.trim() : "";
  const hasValue = value !== undefined && value !== null && value !== "";
  const sparklineValues = Array.isArray(values) ? values : [];
  const requestedInteraction = Boolean(href || onSelect || rest.onClick || resolvedVariant === "drill-in");
  const canActivateTile = Boolean(href || onSelect || rest.onClick);
  const selectMeta: KpiTileMeta = { label: visibleLabel, value, delta, tone: resolvedTone, variant: resolvedVariant };
  const accessibleLabel = requestedInteraction && visibleLabel ? `${visibleLabel} ${value}${delta ? `, ${delta}` : ""}`.trim() : undefined;
  const interactive = requestedInteraction && canActivateTile && Boolean(visibleLabel);
  const Element = href && interactive ? "a" : "article";

  if (!visibleLabel || !hasValue) return null;

  return React.createElement(
    Element,
    {
      ...flowRestProps(rest),
      ref,
      className: ["kpi-tile", `kpi-tile--${resolvedTone}`, className].filter(Boolean).join(" "),
      href: href && interactive ? href : undefined,
      tabIndex: interactive && !href ? (disabled ? -1 : 0) : undefined,
      role: interactive && !href ? "button" : undefined,
      "aria-label": accessibleLabel,
      "aria-pressed": selected ? "true" : undefined,
      "aria-disabled": disabled ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-selected": selected ? "true" : undefined,
      onClick: (event: MouseEvent<HTMLElement>) => {
        if (disabled || loading) {
          event.preventDefault();
          return;
        }
        rest.onClick?.(event);
        if (event.defaultPrevented) return;
        if (interactive) onSelect?.(selectMeta, event);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        rest.onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (!interactive || href || disabled || loading) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(selectMeta, event);
        }
      },
    },
    React.createElement(
      "header",
      null,
      icon ? React.createElement("span", { className: "kpi-tile__icon", "aria-hidden": "true" }, icon) : null,
      React.createElement("span", { className: "kpi-tile__label" }, visibleLabel),
    ),
    React.createElement("strong", { className: "kpi-tile__value" }, value),
    loading
      ? React.createElement("span", { className: "kpi-tile__loading", "aria-hidden": "true" })
      : delta
        ? React.createElement(
          "p",
          { className: "kpi-tile__delta", "data-trend": resolvedTrend },
          React.createElement("span", { className: "kpi-tile__trend-icon", "aria-hidden": "true" }, resolvedTrend === "up" ? "trending_up" : resolvedTrend === "down" ? "trending_down" : "trending_flat"),
          delta,
        )
        : null,
    resolvedVariant === "sparkline" && sparklineValues.length
      ? React.createElement(
        "svg",
        { className: "kpi-tile__sparkline", viewBox: "0 0 112 34", "aria-hidden": "true" },
        React.createElement("polyline", { points: sparklinePoints(sparklineValues) }),
      )
      : null,
    resolvedVariant === "drill-in" && interactive
      ? React.createElement("span", { className: "kpi-tile__affordance", "aria-hidden": "true" }, "arrow_forward")
      : null,
  );
}) as KpiTileComponent;

KpiTile.displayName = "KpiTile";
KpiTile.platformContract = kpiTilePlatformContract;
