import React, { forwardRef } from "react";
import { chartPanelPlatformContract } from "@design-system/components/platforms";
import { createChartsPrimitive } from "@design-system/components";
import { flowVariantProps, flowToneProps, flowStateProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["sparkline", "bars", "line", "area", "donut", "pareto", "bullet", "comparison", "compact"]);
const validStates = new Set(["default", "focus", "hover", "warning", "error", "disabled"]);
const validTones = new Set(["neutral", "info", "warning", "danger"]);

function normalizeVariant(variant) {
  return variant === "bar" ? "bars" : normalizeFlowValue(variant, validVariants, "sparkline");
}

function normalizeValues(values = []) {
  return (Array.isArray(values) ? values : []).map((value) => Number(value)).map((value) => (Number.isFinite(value) ? Math.max(0, value) : 0));
}

function pointsFor(values = []) {
  const safeValues = normalizeValues(values);
  if (!safeValues.length) return "";
  const max = Math.max(...safeValues, 1);
  const width = 160;
  const height = 72;
  return safeValues.map((value, index) => {
    const x = safeValues.length === 1 ? width : (index / (safeValues.length - 1)) * width;
    const y = height - (value / max) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function renderLinePlot(values, variant, series = []) {
  const resolvedSeries = Array.isArray(series) && series.length ? series.slice(0, 3) : values.length ? [{ values }] : [];
  return React.createElement(
    "svg",
    { className: "chart-panel__svg", viewBox: "0 0 160 72", role: "img", "aria-hidden": "true" },
    variant === "area" ? React.createElement("polygon", { className: "chart-panel__area", points: `0,72 ${pointsFor(values)} 160,72` }) : null,
    resolvedSeries.map((item, index) => React.createElement("polyline", {
      key: item.id ?? item.label ?? index,
      className: "chart-panel__line",
      points: pointsFor(item.values ?? values),
    })),
    normalizeValues(values).map((value, index) => React.createElement("circle", {
      key: `dot-${index}`,
      className: "chart-panel__hit-dot",
      cx: normalizeValues(values).length === 1 ? 160 : (index / (normalizeValues(values).length - 1)) * 160,
      cy: 72 - (value / Math.max(...normalizeValues(values), 1)) * 64 - 4,
      r: "5",
      "data-value": String(value),
    })),
  );
}

function renderBars(values, labels) {
  const safeValues = normalizeValues(values);
  const max = Math.max(...safeValues, 1);
  return safeValues.map((value, index) => {
    const pointLabel = labels[index];
    const text = pointLabel ? `${pointLabel}: ${value}` : undefined;
    const percent = Math.max(8, Math.round((value / max) * 100));
    return React.createElement(
      "span",
      {
        key: index,
        className: "chart-panel__bar-group",
        role: pointLabel ? "listitem" : undefined,
        tabIndex: pointLabel ? 0 : undefined,
        "data-tooltip": text,
      },
      React.createElement(
        "svg",
        { className: "chart-panel__bar-svg", viewBox: "0 0 12 100", preserveAspectRatio: "none", "aria-hidden": "true" },
        React.createElement("rect", { className: "chart-panel__bar", x: "0", y: String(100 - percent), width: "12", height: String(percent), "data-max": value === max ? "true" : undefined }),
      ),
      pointLabel ? React.createElement("small", null, pointLabel) : null,
    );
  });
}

function renderDonut(values) {
  const total = normalizeValues(values).reduce((sum, value) => sum + value, 0);
  return React.createElement(
    "span",
    { className: "chart-panel__donut", role: "img", "aria-hidden": "true" },
    React.createElement("span", { className: "chart-panel__donut-center" }, String(total)),
  );
}

function renderBullet(values, labels) {
  const safeValues = normalizeValues(values);
  const max = Math.max(...safeValues, 1);
  return safeValues.map((value, index) => {
    const pointLabel = labels[index];
    return React.createElement(
      "span",
      { key: index, className: "chart-panel__bullet", role: pointLabel ? "listitem" : undefined, tabIndex: pointLabel ? 0 : undefined, "data-tooltip": pointLabel ? `${pointLabel}: ${value}` : undefined },
      pointLabel ? React.createElement("b", null, pointLabel) : null,
      React.createElement("progress", { className: "chart-panel__bullet-meter", max, value, tabIndex: -1, "aria-hidden": "true" }),
      React.createElement("em", null, String(value)),
    );
  });
}

function renderComparison(comparisons, values, labels) {
  const source = Array.isArray(comparisons) && comparisons.length ? comparisons.slice(0, 3) : values.length ? [{ values }] : [];
  const max = Math.max(...source.flatMap((item) => normalizeValues(item.values)), 1);
  return labels.map((label, index) => React.createElement(
    "span",
    { key: label, className: "chart-panel__comparison-group", role: "listitem", tabIndex: 0, "data-tooltip": label },
    React.createElement(
      "svg",
      { className: "chart-panel__comparison-bars", viewBox: "0 0 24 100", preserveAspectRatio: "none", "aria-hidden": "true" },
      source.map((item, seriesIndex) => {
        const value = normalizeValues(item.values)[index] ?? 0;
        const percent = Math.round((value / max) * 100);
        return React.createElement("rect", {
          key: item.id ?? item.label,
          className: "chart-panel__comparison-bar",
          x: String(seriesIndex * 10),
          y: String(100 - percent),
          width: "8",
          height: String(percent),
          "data-series": String(seriesIndex + 1),
        });
      }),
    ),
  ));
}

function renderPareto(values, labels) {
  const sorted = normalizeValues(values).map((value, index) => ({ value, label: labels[index] })).filter((item) => item.label).sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map((item) => item.value), 1);
  return React.createElement(
    "svg",
    { className: "chart-panel__svg chart-panel__pareto-svg", viewBox: "0 0 160 72", role: "img", "aria-hidden": "true" },
    sorted.map((item, index) => React.createElement("rect", {
      key: item.label,
      className: "chart-panel__pareto-bar",
      x: 8 + index * 46,
      y: 72 - (item.value / max) * 60,
      width: 26,
      height: (item.value / max) * 60,
    })),
    React.createElement("polyline", { className: "chart-panel__pareto-line", points: pointsFor(sorted.map((item) => item.value)) }),
  );
}

function renderPlot(type, values, labels, series, comparisons) {
  if (type === "bars") return renderBars(values, labels);
  if (type === "donut") return renderDonut(values);
  if (type === "bullet") return renderBullet(values, labels);
  if (type === "comparison") return renderComparison(comparisons, values, labels);
  if (type === "pareto") return renderPareto(values, labels);
  return renderLinePlot(values, type, series);
}

export const ChartPanel = forwardRef(function ChartPanel({
  label,
  value = "",
  caption = "",
  values = [],
  valueLabels = [],
  labels = [],
  segments = [],
  series = [],
  comparisons = [],
  variant = "sparkline",
  state = "default",
  tone = "neutral",
  density,
  fullWidth = false,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeVariant(variant);
  const resolvedState = normalizeFlowValue(state, validStates, "default");
  const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedValues = normalizeValues(values);
  const resolvedLabels = labels.length ? labels : valueLabels.length ? valueLabels : [];
  const chartPrimitive = createChartsPrimitive({
    type: resolvedVariant,
    label: label ?? "",
    value,
    caption,
    values: resolvedValues,
    labels: resolvedLabels,
    segments,
    series,
    comparisons,
  });
  const optionModel = {
    engine: "apache-echarts",
    type: chartPrimitive.type,
    echartsOption: chartPrimitive.echartsOption,
    tableFallback: chartPrimitive.tableFallback,
  };

  return React.createElement(
    "article",
    {
      ...flowRestProps(rest),
      ref,
      className: ["chart-panel", className].filter(Boolean).join(" "),
      "data-chart-primitive": "charts",
      "data-chart-engine": "echarts-option",
      ...flowVariantProps(chartPrimitive.type),
      ...flowStateProps(resolvedState),
      ...flowToneProps(resolvedTone),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
    },
    React.createElement(
      "header",
      { className: "chart-panel__header" },
      React.createElement(
        "div",
        null,
        label ? React.createElement("strong", null, label) : null,
        caption ? React.createElement("p", null, caption) : null,
      ),
      value ? React.createElement("output", null, value) : null,
    ),
    React.createElement(
      "figure",
      { role: "group", "aria-label": chartPrimitive.textSummary },
      React.createElement("div", { className: "chart-panel__plot", role: "list" }, renderPlot(chartPrimitive.type, resolvedValues, resolvedLabels, series, comparisons)),
      React.createElement("span", { className: "chart-panel__tooltip", role: "status", "aria-live": "polite", "data-visible": "false" }),
      React.createElement("div", { className: "chart-panel__echarts", "aria-hidden": "true" }),
      React.createElement("script", { type: "application/json", className: "chart-panel__option" }, JSON.stringify(optionModel)),
    ),
  );
});

ChartPanel.displayName = "ChartPanel";
ChartPanel.platformContract = chartPanelPlatformContract;
