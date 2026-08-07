import React, { forwardRef } from "react";
import { kpiTilePlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["standard", "delta", "threshold", "sparkline", "drill-in"]);
const validStates = new Set(["default", "hover", "focus", "selected", "loading", "risk", "disabled"]);
const validTones = new Set(["neutral", "info", "success", "warning", "danger"]);
const validTrends = new Set(["up", "down", "flat"]);

function sparklinePoints(values) {
  const safeValues = (values.length ? values : [24, 32, 28, 44, 38, 52]).map((item) => Number.isFinite(Number(item)) ? Math.max(0, Number(item)) : 0);
  const max = Math.max(...safeValues, 1);
  const width = 112;
  const height = 34;
  return safeValues.map((item, index) => {
    const x = safeValues.length === 1 ? width : (index / (safeValues.length - 1)) * width;
    const y = height - (item / max) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export const KpiTile = forwardRef(function KpiTile({
  label,
  value,
  delta = "",
  trend = "flat",
  tone = "neutral",
  icon = "",
  variant = "standard",
  state = "default",
  density,
  values = [],
  href = "",
  selected = false,
  disabled = false,
  loading = false,
  ariaLabel = "",
  onSelect,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "standard");
  const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
  const resolvedTrend = normalizeFlowValue(trend, validTrends, "flat");
  const resolvedState = loading ? "loading" : disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const interactive = Boolean(href || onSelect || resolvedVariant === "drill-in");
  const Element = href ? "a" : "article";
  const selectMeta = { label, value, delta, tone: resolvedTone, variant: resolvedVariant };
  const accessibleLabel = ariaLabel || (interactive ? `${label ?? "KPI"} ${value ?? "0"}${delta ? `, ${delta}` : ""}` : undefined);

  return React.createElement(
    Element,
    {
      ...flowRestProps(rest),
      ref,
      className: ["kpi-tile", `kpi-tile--${resolvedTone}`, className].filter(Boolean).join(" "),
      href: href || undefined,
      tabIndex: interactive && !href ? (disabled ? -1 : 0) : undefined,
      role: interactive && !href ? "button" : undefined,
      "aria-label": accessibleLabel,
      "aria-pressed": selected ? "true" : undefined,
      "aria-disabled": disabled ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-selected": selected ? "true" : undefined,
      onClick: (event) => {
        if (disabled || loading) {
          event.preventDefault();
          return;
        }
        onSelect?.(selectMeta);
      },
      onKeyDown: (event) => {
        if (!interactive || href || disabled || loading) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(selectMeta);
        }
      },
    },
    React.createElement(
      "header",
      null,
      React.createElement("span", { className: "kpi-tile__label" }, label ?? "KPI"),
      icon ? React.createElement("span", { className: "kpi-tile__icon", "aria-hidden": "true" }, icon) : null,
    ),
    React.createElement("strong", { className: "kpi-tile__value" }, value ?? "0"),
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
    resolvedVariant === "sparkline"
      ? React.createElement(
        "svg",
        { className: "kpi-tile__sparkline", viewBox: "0 0 112 34", "aria-hidden": "true" },
        React.createElement("polyline", { points: sparklinePoints(values) }),
      )
      : null,
    resolvedVariant === "drill-in"
      ? React.createElement("span", { className: "kpi-tile__affordance", "aria-hidden": "true" }, "arrow_forward")
      : null,
  );
});

KpiTile.displayName = "KpiTile";
KpiTile.platformContract = kpiTilePlatformContract;
