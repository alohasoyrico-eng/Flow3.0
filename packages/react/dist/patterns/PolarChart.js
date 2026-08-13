import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Surface } from "../Surface.js";
import { ChartWrapper } from "./ChartWrapper.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
}
function resolveState({ disabled, loading, error, selectedSegmentKey, segments, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (error || state === "error")
        return "error";
    if (loading || state === "loading")
        return "loading";
    if (selectedSegmentKey || state === "selected")
        return "selected";
    if (!segments.length || state === "empty")
        return "empty";
    return state ?? "default";
}
function surfaceStateFor(resolvedState) {
    if (resolvedState === "disabled")
        return "disabled";
    if (resolvedState === "error")
        return "focused";
    if (resolvedState === "loading")
        return "sunken";
    if (resolvedState === "selected")
        return "selected";
    return "default";
}
function chartWrapperStateFor(resolvedState) {
    return resolvedState === "selected" ? "interactive" : resolvedState;
}
function badgeTone(metric, resolvedState) {
    if (metric?.tone)
        return metric.tone;
    if (resolvedState === "error")
        return "danger";
    if (resolvedState === "selected")
        return "info";
    return "neutral";
}
function segmentRows(segments) {
    return segments.map((segment) => ({
        id: segment.key,
        segment: segment.label,
        value: segment.formattedValue ?? String(segment.value ?? 0),
        share: segment.share ?? "Not provided",
        status: segment.status ?? "default",
    }));
}
export const PolarChart = forwardRef(function PolarChart({ label = "Polar chart", description, density = "sm", state, disabled = false, loading = false, error, selectedSegmentKey, segments = [], metrics = [], chart = {}, table, list, feedback, primaryAction, overflow, className = "", onSegmentSelect, onAction, ...rest }, ref) {
    const normalizedSegments = normalizeArray(segments).filter((segment) => Boolean(segment?.key && segment?.label));
    const normalizedMetrics = normalizeArray(metrics).filter((metric) => Boolean(metric?.label));
    const rows = table?.rows ?? segmentRows(normalizedSegments);
    const resolvedState = resolveState({ disabled, loading, error, selectedSegmentKey, segments: normalizedSegments, state });
    const isDisabled = disabled || resolvedState === "disabled";
    const isLoading = loading || resolvedState === "loading";
    return React.createElement(Surface, {
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
        "data-flow-pattern": "polar-chart",
        "data-flow-slot": "polarChartSurface",
        "data-polar-chart-state": resolvedState,
        "data-density": density,
        "data-segment-count": String(normalizedSegments.length),
        ...sanitizeRestProps(rest),
    }, description
        ? React.createElement(Badge, {
            label: description,
            tone: badgeTone(undefined, resolvedState),
            variant: "status",
            density,
            state: isDisabled ? "disabled" : "default",
            "data-flow-slot": "polarSummary",
        })
        : null, normalizedMetrics.map((metric) => React.createElement(Badge, {
        ...metric,
        key: metric.key ?? metric.label,
        label: metric.label,
        tone: badgeTone(metric, resolvedState),
        variant: metric.variant ?? "status",
        density: metric.density ?? density,
        state: isDisabled ? "disabled" : metric.state ?? "default",
        live: metric.live ?? true,
        "data-flow-slot": "polarMetric",
    })), React.createElement(ChartWrapper, {
        label,
        description,
        density,
        state: chartWrapperStateFor(resolvedState),
        disabled: isDisabled,
        loading: isLoading,
        empty: resolvedState === "empty",
        error,
        chart: {
            ...chart,
            label: chart.label ?? label,
            caption: chart.caption ?? description,
            variant: chart.variant ?? "donut",
            segments: chart.segments ?? normalizedSegments.map((segment) => ({
                id: segment.key,
                label: segment.label,
                value: Number(segment.value ?? 0),
            })),
            values: chart.values ?? normalizedSegments.map((segment) => Number(segment.value ?? 0)),
            labels: chart.labels ?? normalizedSegments.map((segment) => segment.label),
            state: chart.state ?? (selectedSegmentKey ? "focus" : undefined),
            "data-chart-kind": "polar",
        },
        summary: chart.summary,
        status: chart.status ?? {
            label: `${normalizedSegments.length} segments`,
            tone: normalizedSegments.length ? "info" : "neutral",
        },
        primaryAction,
        overflow,
        table: {
            columns: [
                { key: "segment", label: "Segment" },
                { key: "value", label: "Value", align: "right" },
                { key: "share", label: "Share", align: "right" },
                { key: "status", label: "Status" },
                ...(table?.columns ?? []).filter((column) => !["segment", "value", "share", "status"].includes(column.key)),
            ],
            ...table,
            label: table?.label ?? `${label} segment summary`,
            rows,
            rowKey: table?.rowKey ?? "id",
            selectedKey: table?.selectedKey ?? selectedSegmentKey,
            density: table?.density ?? density,
            state: table?.state ?? (selectedSegmentKey ? "selected" : "default"),
            onRowSelect: (key, event) => {
                table?.onRowSelect?.(key, event);
                if (event.defaultPrevented)
                    return;
                onSegmentSelect?.(key, event);
            },
            "data-flow-slot": "polarDataSummary",
        },
        list,
        emptyState: feedback?.emptyState,
        errorPanel: feedback?.errorPanel,
        skeleton: feedback?.skeleton,
        onAction,
        "data-flow-pattern-boundary": "chart-wrapper",
        "data-flow-slot": "chartWrapperBoundary",
    }), feedback?.status
        ? React.createElement(Badge, {
            ...feedback.status,
            label: feedback.status.label,
            density: feedback.status.density ?? density,
            tone: feedback.status.tone ?? badgeTone(feedback.status, resolvedState),
            variant: feedback.status.variant ?? "status",
            state: isDisabled ? "disabled" : feedback.status.state ?? "default",
            live: feedback.status.live ?? true,
            "data-flow-slot": "polarFeedback",
        })
        : null);
});
PolarChart.displayName = "PolarChart";
