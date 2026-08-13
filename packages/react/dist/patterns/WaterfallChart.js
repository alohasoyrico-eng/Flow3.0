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
function resolveState({ disabled, loading, error, selectedStepKey, steps, state }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (error || state === "error")
        return "error";
    if (loading || state === "loading")
        return "loading";
    if (selectedStepKey || state === "selected")
        return "selected";
    if (!steps.length || state === "empty")
        return "empty";
    return state ?? "default";
}
function surfaceStateFor(resolvedState) {
    if (resolvedState === "disabled")
        return "disabled";
    if (resolvedState === "error")
        return "critical";
    if (resolvedState === "loading")
        return "sunken";
    if (resolvedState === "selected")
        return "selected";
    return "default";
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
function stepDirection(step) {
    if (step?.kind === "total")
        return "total";
    const value = Number(step?.value ?? 0);
    if (value > 0)
        return "increase";
    if (value < 0)
        return "decrease";
    return "neutral";
}
function waterfallRows(steps) {
    let runningTotal = 0;
    return steps.map((step) => {
        const value = Number(step.value ?? 0);
        if (step.kind === "total")
            runningTotal = value;
        else
            runningTotal += value;
        return {
            id: step.key,
            step: step.label,
            direction: step.direction ?? stepDirection(step),
            value: step.formattedValue ?? String(value),
            cumulative: step.formattedCumulative ?? String(runningTotal),
            note: step.note ?? "Not provided",
        };
    });
}
export const WaterfallChart = forwardRef(function WaterfallChart({ label = "Waterfall chart", description, density = "sm", state, disabled = false, loading = false, error, selectedStepKey, steps = [], metrics = [], chart = {}, table, list, feedback, primaryAction, overflow, className = "", onStepSelect, onAction, ...rest }, ref) {
    const normalizedSteps = normalizeArray(steps).filter((step) => Boolean(step?.key && step.label));
    const normalizedMetrics = normalizeArray(metrics).filter((metric) => Boolean(metric?.label));
    const rows = table?.rows ?? waterfallRows(normalizedSteps);
    const increaseCount = normalizedSteps.filter((step) => stepDirection(step) === "increase").length;
    const decreaseCount = normalizedSteps.filter((step) => stepDirection(step) === "decrease").length;
    const totalCount = normalizedSteps.filter((step) => stepDirection(step) === "total").length;
    const resolvedState = resolveState({ disabled, loading, error, selectedStepKey, steps: normalizedSteps, state });
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
        "data-flow-pattern": "waterfall-chart",
        "data-flow-slot": "waterfallChartSurface",
        "data-waterfall-chart-state": resolvedState,
        "data-density": density,
        "data-step-count": String(normalizedSteps.length),
        "data-increase-count": String(increaseCount),
        "data-decrease-count": String(decreaseCount),
        "data-total-count": String(totalCount),
        ...sanitizeRestProps(rest),
    }, description
        ? React.createElement(Badge, {
            label: description,
            tone: badgeTone(undefined, resolvedState),
            variant: "status",
            density,
            state: isDisabled ? "disabled" : "default",
            "data-flow-slot": "waterfallSummary",
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
        "data-flow-slot": "waterfallMetric",
    })), React.createElement(ChartWrapper, {
        label,
        description,
        density,
        state: resolvedState === "selected" ? "interactive" : resolvedState,
        disabled: isDisabled,
        loading: isLoading,
        empty: resolvedState === "empty",
        error,
        chart: {
            ...chart,
            label: chart.label ?? label,
            caption: chart.caption ?? description,
            variant: chart.variant ?? "comparison",
            values: chart.values ?? normalizedSteps.map((step) => Number(step.value ?? 0)),
            labels: chart.labels ?? normalizedSteps.map((step) => step.label),
            valueLabels: chart.valueLabels ?? normalizedSteps.map((step) => step.formattedValue ?? String(step.value ?? 0)),
            state: chart.state ?? (selectedStepKey ? "focus" : undefined),
            "data-chart-kind": "waterfall",
        },
        summary: chart.summary,
        status: chart.status ?? {
            label: `${increaseCount} increases · ${decreaseCount} decreases · ${totalCount} totals`,
            tone: decreaseCount ? "warning" : "info",
        },
        primaryAction,
        overflow,
        table: {
            columns: [
                { key: "step", label: "Step" },
                { key: "direction", label: "Direction" },
                { key: "value", label: "Value", align: "right" },
                { key: "cumulative", label: "Cumulative", align: "right" },
                { key: "note", label: "Note" },
                ...(table?.columns ?? []).filter((column) => !["step", "direction", "value", "cumulative", "note"].includes(column.key)),
            ],
            ...table,
            label: table?.label ?? `${label} step summary`,
            rows,
            rowKey: table?.rowKey ?? "id",
            selectedKey: table?.selectedKey ?? selectedStepKey,
            density: table?.density ?? density,
            state: table?.state ?? (selectedStepKey ? "selected" : "default"),
            onRowSelect: (key, event) => {
                table?.onRowSelect?.(key, event);
                if (event.defaultPrevented)
                    return;
                onStepSelect?.(key, event);
            },
            "data-flow-slot": "waterfallDataSummary",
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
            "data-flow-slot": "waterfallFeedback",
        })
        : null);
});
WaterfallChart.displayName = "WaterfallChart";
