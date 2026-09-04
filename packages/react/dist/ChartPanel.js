import React, { forwardRef, useEffect, useRef, useState } from "react";
import { chartPanelPlatformContract } from "#flow/platforms";
import { createChartsPrimitive } from "#flow/components";
import { flowVariantProps, flowToneProps, flowStateProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["sparkline", "bars", "line", "area", "donut", "comparison", "compact"]);
const validChartTypes = new Set(["sparkline", "compact", "line", "area", "bars", "bar", "stackedBar", "stacked100", "donut", "pie", "comparison", "scatter", "heatmap", "radar", "waterfall", "pareto", "gauge", "funnel", "treemap", "boxplot"]);
const validStates = new Set(["default", "focus", "hover", "warning", "error", "disabled"]);
const validTones = new Set(["neutral", "info", "warning", "danger"]);
function normalizeVariant(variant) {
    return variant && validVariants.has(variant) ? variant : "sparkline";
}
function normalizeChartType(chartType, fallback) {
    return chartType && validChartTypes.has(chartType) ? chartType : fallback;
}
function normalizeValues(values = []) {
    return (Array.isArray(values) ? values : []).map((value) => Number(value)).map((value) => (Number.isFinite(value) ? Math.max(0, value) : 0));
}
function normalizePoints(values = [], labels = []) {
    const safeValues = normalizeValues(values);
    const seenLabels = new Set();
    const points = [];
    safeValues.forEach((value, index) => {
        const label = labels[index];
        if (!label || seenLabels.has(label))
            return;
        seenLabels.add(label);
        points.push({ key: String(label), label, value, index });
    });
    return points;
}
function hasStableSeriesId(item) {
    return item?.id !== undefined && item?.id !== null && item?.id !== "";
}
function hasStableSegmentId(item) {
    return item?.id !== undefined && item?.id !== null && item?.id !== "";
}
function normalizeSeries(series = []) {
    return (Array.isArray(series) ? series : [])
        .filter((item) => hasStableSeriesId(item) && (Array.isArray(item.values) || Array.isArray(item.data)))
        .map((item) => ({
        ...item,
        id: String(item.id),
        values: Array.isArray(item.values) ? item.values : [],
        data: Array.isArray(item.data) ? item.data : undefined,
    }));
}
function normalizeSegments(segments = []) {
    return (Array.isArray(segments) ? segments : [])
        .filter((item) => hasStableSegmentId(item) && item?.label && Number.isFinite(Number(item.value)))
        .map((item) => ({ ...item, id: String(item.id), value: Math.max(0, Number(item.value)) }));
}
function pointsFor(values = []) {
    const safeValues = normalizeValues(values);
    if (!safeValues.length)
        return "";
    const max = Math.max(...safeValues, 1);
    const width = 160;
    const height = 72;
    return safeValues.map((value, index) => {
        const x = safeValues.length === 1 ? width : (index / (safeValues.length - 1)) * width;
        const y = height - (value / max) * (height - 8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
}
function chartSeriesColor(index, role = "series") {
    if (role === "comparison" && index === 0)
        return "var(--comp-chart-panel-comparison-reference-fill)";
    return `var(--comp-chart-panel-series-${(index % 5) + 1})`;
}
function chartStaggerDelay(index, compact = false) {
    if (index <= 0)
        return "var(--component-duration-instant)";
    return `calc(var(--sys-momentum-stagger-chart${compact ? "-compact" : ""}) * ${index})`;
}
function renderLinePlot(values, labels, variant, series = []) {
    const resolvedSeries = series.length ? series : values.length ? [{ id: "primary", values }] : [];
    const labeledPoints = normalizePoints(values, labels);
    return React.createElement("svg", { className: "chart-panel__svg", viewBox: "0 0 160 72", role: "img", "aria-hidden": "true" }, variant === "area" ? React.createElement("polygon", { className: "chart-panel__area", points: `0,72 ${pointsFor(values)} 160,72` }) : null, resolvedSeries.map((item, index) => React.createElement("polyline", {
        key: item.id,
        className: "chart-panel__line",
        points: pointsFor(normalizeValues(item.values)),
        style: { "--comp-chart-panel-current-series": chartSeriesColor(index) },
        "data-series": String(index + 1),
    })), labeledPoints.map((point, index) => React.createElement("circle", {
        key: point.key,
        className: "chart-panel__hit-dot",
        cx: normalizeValues(values).length === 1 ? 160 : (point.index / (normalizeValues(values).length - 1)) * 160,
        cy: 72 - (point.value / Math.max(...normalizeValues(values), 1)) * 64 - 4,
        r: "5",
        "data-value": String(point.value),
    })));
}
function renderBars(values, labels) {
    const points = normalizePoints(values, labels);
    const max = Math.max(...points.map((point) => point.value), 1);
    return points.map((point, index) => {
        const value = point.value;
        const pointLabel = point.label;
        const text = pointLabel ? `${pointLabel}: ${value}` : undefined;
        const percent = Math.max(8, Math.round((value / max) * 100));
        return React.createElement("span", {
            key: point.key,
            className: "chart-panel__bar-group",
            role: pointLabel ? "listitem" : undefined,
            tabIndex: pointLabel ? 0 : undefined,
            "data-tooltip": text,
        }, React.createElement("svg", { className: "chart-panel__bar-svg", viewBox: "0 0 12 100", preserveAspectRatio: "none", "aria-hidden": "true", style: { "--comp-chart-panel-stagger-delay": chartStaggerDelay(index) } }, React.createElement("rect", { className: "chart-panel__bar", x: "0", y: String(100 - percent), width: "12", height: String(percent), "data-max": value === max ? "true" : undefined })), pointLabel ? React.createElement("small", null, pointLabel) : null);
    });
}
function renderDonut(values) {
    const total = normalizeValues(values).reduce((sum, value) => sum + value, 0);
    return React.createElement("span", { className: "chart-panel__donut", role: "img", "aria-hidden": "true" }, React.createElement("span", { className: "chart-panel__donut-center" }, String(total)));
}
function renderComparison(comparisons, values, labels) {
    const source = comparisons.length ? comparisons : values.length ? [{ id: "primary", values }] : [];
    const points = normalizePoints(values, labels);
    const max = Math.max(...source.flatMap((item) => normalizeValues(item.values)), 1);
    return points.map((point) => React.createElement("span", { key: point.key, className: "chart-panel__comparison-group", role: "listitem", tabIndex: 0, "data-tooltip": point.label }, React.createElement("svg", { className: "chart-panel__comparison-bars", viewBox: "0 0 24 100", preserveAspectRatio: "none", "aria-hidden": "true" }, source.map((item, seriesIndex) => {
        const value = normalizeValues(item.values)[point.index] ?? 0;
        const percent = Math.round((value / max) * 100);
        return React.createElement("rect", {
            key: item.id,
            className: "chart-panel__comparison-bar",
            x: String(seriesIndex * 10),
            y: String(100 - percent),
            width: "8",
            height: String(percent),
            style: {
                "--comp-chart-panel-current-series": chartSeriesColor(seriesIndex, "comparison"),
                "--comp-chart-panel-stagger-delay": chartStaggerDelay(seriesIndex, true),
            },
            "data-series": String(seriesIndex + 1),
        });
    }))));
}
function renderPlot(type, values, labels, series, comparisons, segments) {
    if (type === "bars")
        return renderBars(values, labels);
    if (type === "donut")
        return renderDonut(segments.length ? segments.map((segment) => segment.value) : values);
    if (type === "comparison")
        return renderComparison(comparisons, values, labels);
    return renderLinePlot(values, labels, type, series);
}
function resolveCssValue(value, element) {
    if (!value.includes("var("))
        return value;
    const computed = window.getComputedStyle(element);
    let resolved = value;
    for (let index = 0; index < 4 && resolved.includes("var("); index += 1) {
        resolved = resolved.replace(/var\((--[^,\s)]+)(?:,\s*([^)]+))?\)/g, (_match, name, fallback = "") => {
            return computed.getPropertyValue(name).trim() || String(fallback).trim();
        });
    }
    return resolved || value;
}
function resolveChartOptionVars(value, element) {
    if (typeof value === "string")
        return resolveCssValue(value, element);
    if (!value || typeof value !== "object")
        return value;
    if (Array.isArray(value))
        return value.map((item) => resolveChartOptionVars(item, element));
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveChartOptionVars(item, element)]));
}
function escapeTooltipText(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
function tooltipMarkerClass(param, index) {
    const dataClass = param.data?.tooltipMarkerClass;
    if (dataClass && /^chart-panel__echarts-tooltip-swatch--/.test(dataClass))
        return dataClass;
    return `chart-panel__echarts-tooltip-swatch--series-${(index % 6) + 1}`;
}
function tooltipDisplayValue(param) {
    const value = param.data?.value ?? param.value;
    if (Array.isArray(value) && value.length >= 3)
        return String(value[value.length - 1]);
    if (Array.isArray(value))
        return value.map((item) => String(item)).join(", ");
    return String(value ?? "");
}
function tooltipPublicName(value) {
    if (!value || /^series/i.test(value))
        return "";
    return value;
}
function tooltipIconName(param) {
    const icon = param.data?.tooltipIcon;
    if (icon && /^[a-z0-9_]+$/.test(icon))
        return icon;
    return "bar_chart";
}
function tooltipTitleName(items) {
    const first = items[0];
    if (items.length > 1)
        return tooltipPublicName(first?.data?.name) || tooltipPublicName(first?.name) || tooltipPublicName(first?.seriesName);
    return tooltipPublicName(first?.seriesName) || tooltipPublicName(first?.data?.name) || tooltipPublicName(first?.name);
}
function tooltipRowLabel(param, itemCount) {
    const seriesName = tooltipPublicName(param.seriesName);
    if (itemCount > 1 && seriesName)
        return seriesName;
    return tooltipPublicName(param.data?.name) || tooltipPublicName(param.name) || seriesName || "";
}
function formatChartTooltip(params) {
    const items = Array.isArray(params) ? params : [params];
    const title = tooltipTitleName(items);
    const rows = items.map((item, index) => {
        const markerClass = tooltipMarkerClass(item, index);
        const label = tooltipRowLabel(item, items.length);
        const value = tooltipDisplayValue(item);
        const icon = tooltipIconName(item);
        return `<span class="chart-panel__echarts-tooltip-row"><span class="chart-panel__echarts-tooltip-swatch ${markerClass}"></span><span class="chart-panel__echarts-tooltip-icon" aria-hidden="true">${escapeTooltipText(icon)}</span><span class="chart-panel__echarts-tooltip-label">${escapeTooltipText(label)}</span><strong class="chart-panel__echarts-tooltip-value">${escapeTooltipText(value)}</strong></span>`;
    }).join("");
    return `<div class="chart-panel__echarts-tooltip"><strong class="chart-panel__echarts-tooltip-title">${escapeTooltipText(title)}</strong>${rows}</div>`;
}
function installChartTooltipFormatter(option) {
    const tooltip = option.tooltip;
    if (!tooltip || typeof tooltip !== "object")
        return option;
    option.tooltip = {
        ...tooltip,
        formatter: formatChartTooltip,
    };
    return option;
}
function ChartPanelRenderer({ optionJson, label, onEngineChange, }) {
    const hostRef = useRef(null);
    useEffect(() => {
        if (typeof window === "undefined" || !hostRef.current) {
            onEngineChange("echarts-option");
            return undefined;
        }
        let disposed = false;
        let chart;
        let resizeObserver;
        let themeObserver;
        const frameIds = new Set();
        const timeoutIds = new Set();
        const requestChartResize = () => {
            if (disposed || !chart)
                return;
            const frameId = window.requestAnimationFrame(() => {
                frameIds.delete(frameId);
                if (!disposed)
                    chart?.resize();
            });
            frameIds.add(frameId);
        };
        const scheduleStableResize = () => {
            requestChartResize();
            for (const delay of [80, 180, 360]) {
                const timeoutId = window.setTimeout(() => {
                    timeoutIds.delete(timeoutId);
                    requestChartResize();
                }, delay);
                timeoutIds.add(timeoutId);
            }
        };
        const applyOption = () => {
            if (!hostRef.current || !chart)
                return;
            const option = resolveChartOptionVars(JSON.parse(optionJson), hostRef.current);
            chart.setOption(installChartTooltipFormatter(option), true);
            scheduleStableResize();
        };
        import("echarts")
            .then((module) => {
            if (disposed || !hostRef.current)
                return;
            const echarts = module;
            chart = echarts.init(hostRef.current, null, { renderer: "svg" });
            applyOption();
            resizeObserver = typeof ResizeObserver === "undefined"
                ? undefined
                : new ResizeObserver(scheduleStableResize);
            resizeObserver?.observe(hostRef.current);
            window.addEventListener("load", scheduleStableResize);
            window.addEventListener("resize", scheduleStableResize);
            if (typeof MutationObserver !== "undefined") {
                themeObserver = new MutationObserver(applyOption);
                themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-mode"] });
                let ancestor = hostRef.current.parentElement;
                while (ancestor && ancestor !== document.documentElement) {
                    themeObserver.observe(ancestor, { attributes: true, attributeFilter: ["data-theme", "data-mode"] });
                    ancestor = ancestor.parentElement;
                }
            }
            onEngineChange("echarts-runtime");
        })
            .catch(() => {
            if (!disposed)
                onEngineChange("fallback");
        });
        return () => {
            disposed = true;
            themeObserver?.disconnect();
            resizeObserver?.disconnect();
            window.removeEventListener("load", scheduleStableResize);
            window.removeEventListener("resize", scheduleStableResize);
            frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
            timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
            chart?.dispose();
        };
    }, [label, onEngineChange, optionJson]);
    return React.createElement("div", {
        ref: hostRef,
        className: "chart-panel__echarts",
        "aria-hidden": "true",
        "data-chart-renderer": "echarts",
    });
}
export const ChartPanel = forwardRef(function ChartPanel({ label, value = "", caption = "", values, valueLabels, labels, segments, series, comparisons, chartType, matrix, indicators, target, min, max, totals, legend, stack, horizontal, showValues, palette, variant = "sparkline", state = "default", tone = "neutral", density, fullWidth = false, className = "", ...rest }, ref) {
    const resolvedVariant = normalizeVariant(variant);
    const resolvedChartType = normalizeChartType(chartType, resolvedVariant);
    const resolvedState = normalizeFlowValue(state, validStates, "default");
    const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedValues = normalizeValues(values);
    const safeLabels = Array.isArray(labels) ? labels : [];
    const safeValueLabels = Array.isArray(valueLabels) ? valueLabels : [];
    const resolvedLabels = safeLabels.length ? safeLabels : safeValueLabels.length ? safeValueLabels : [];
    const resolvedSeries = normalizeSeries(series);
    const resolvedComparisons = normalizeSeries(comparisons);
    const resolvedSegments = normalizeSegments(segments);
    const hasChartData = Boolean(resolvedValues.length || resolvedSeries.length || resolvedComparisons.length || resolvedSegments.length || matrix?.values?.length || target !== undefined);
    const [chartEngine, setChartEngine] = useState("echarts-option");
    if (!label || !hasChartData)
        return null;
    const chartPrimitive = createChartsPrimitive({
        type: resolvedChartType,
        label,
        value,
        caption,
        ...(resolvedValues.length ? { values: resolvedValues } : {}),
        ...(resolvedLabels.length ? { labels: resolvedLabels } : {}),
        ...(resolvedSegments.length ? { segments: resolvedSegments } : {}),
        ...(resolvedSeries.length ? { series: resolvedSeries } : {}),
        ...(resolvedComparisons.length ? { comparisons: resolvedComparisons } : {}),
        ...(matrix?.values?.length ? { matrix } : {}),
        ...(Array.isArray(indicators) && indicators.length ? { indicators } : {}),
        ...(target !== undefined ? { target } : {}),
        ...(min !== undefined ? { min } : {}),
        ...(max !== undefined ? { max } : {}),
        ...(Array.isArray(totals) && totals.length ? { totals } : {}),
        ...(legend !== undefined ? { legend } : {}),
        ...(stack !== undefined ? { stack } : {}),
        ...(horizontal !== undefined ? { horizontal } : {}),
        ...(showValues !== undefined ? { showValues } : {}),
        ...(palette !== undefined ? { palette } : {}),
    });
    const optionModel = {
        engine: "apache-echarts",
        type: chartPrimitive.type,
        echartsOption: chartPrimitive.echartsOption,
        tableFallback: chartPrimitive.tableFallback,
    };
    const optionJson = JSON.stringify(optionModel);
    return React.createElement("article", {
        ...flowRestProps(rest),
        ref,
        className: ["chart-panel", className].filter(Boolean).join(" "),
        "data-chart-primitive": "charts",
        "data-chart-engine": chartEngine,
        "data-chart-renderer": chartEngine === "echarts-runtime" ? "echarts" : chartEngine === "fallback" ? "fallback-svg" : "pending",
        "data-chart-type": chartPrimitive.type,
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowToneProps(resolvedTone),
        ...flowDensityProps(resolvedDensity),
        "data-full-width": String(Boolean(fullWidth)),
    }, React.createElement("header", { className: "chart-panel__header" }, React.createElement("div", null, label ? React.createElement("strong", null, label) : null, caption ? React.createElement("p", null, caption) : null), value ? React.createElement("output", null, value) : null), React.createElement("figure", { role: "group", "aria-label": chartPrimitive.textSummary }, React.createElement("div", { className: "chart-panel__plot", role: "list", "data-fallback-plot": "true" }, renderPlot(resolvedVariant, resolvedValues, resolvedLabels, resolvedSeries, resolvedComparisons, resolvedSegments)), React.createElement("span", { className: "chart-panel__tooltip", role: "status", "aria-live": "polite", "data-visible": "false" }), React.createElement(ChartPanelRenderer, { optionJson: JSON.stringify(chartPrimitive.echartsOption), label, onEngineChange: setChartEngine }), React.createElement("script", { type: "application/json", className: "chart-panel__option" }, optionJson)));
});
ChartPanel.displayName = "ChartPanel";
ChartPanel.platformContract = chartPanelPlatformContract;
