import React, { forwardRef } from "react";
import { AnimatedMoment } from "../AnimatedMoment.js";
import { Button } from "../Button.js";
import { Card } from "../Card.js";
import { InlineValidation } from "../InlineValidation.js";
import { List } from "../List.js";
import { ProgressIndicator } from "../ProgressIndicator.js";
import { Surface } from "../Surface.js";
import { Toast } from "../Toast.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ disabled, reducedMotion, refreshing, error, complete, progress, state }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (reducedMotion || state === "reduced-motion")
        return "reduced-motion";
    if (error || state === "error")
        return "error";
    if (refreshing || state === "refreshing")
        return "refreshing";
    if (complete || state === "complete")
        return "complete";
    if (state === "threshold")
        return "threshold";
    if (state === "pulling" || progress > 0)
        return "pulling";
    return state ?? "idle";
}
function progressState(resolvedState) {
    if (resolvedState === "error")
        return "error";
    if (resolvedState === "complete")
        return "complete";
    if (resolvedState === "disabled")
        return "disabled";
    if (resolvedState === "refreshing")
        return "indeterminate";
    return resolvedState === "pulling" || resolvedState === "threshold" ? "active" : "default";
}
function progressTone(resolvedState) {
    if (resolvedState === "error")
        return "danger";
    if (resolvedState === "complete")
        return "success";
    if (resolvedState === "threshold")
        return "warning";
    return "accent";
}
function animatedState(resolvedState) {
    if (resolvedState === "disabled")
        return "disabled";
    if (resolvedState === "reduced-motion")
        return "reduced-motion";
    if (resolvedState === "complete")
        return "complete";
    if (resolvedState === "refreshing" || resolvedState === "pulling" || resolvedState === "threshold")
        return "playing";
    return "idle";
}
function animatedVariant(resolvedState) {
    if (resolvedState === "complete")
        return "success";
    if (resolvedState === "error")
        return "empty";
    return "loading";
}
function normalizeCards(cards) {
    return (Array.isArray(cards) ? cards : []).filter((card) => Boolean(card?.title));
}
function contentSurfaceState(isDisabled, resolvedState) {
    return isDisabled ? "disabled" : resolvedState === "refreshing" ? "focused" : "default";
}
export const PullToRefresh = forwardRef(function PullToRefresh({ label = "Pull to refresh", description, density, state, disabled = false, reducedMotion = false, refreshing = false, complete = false, error = false, progress = 0, list, cards = [], indicator, fallbackAction, validation, feedback, className = "", onRefresh, ...rest }, ref) {
    const resolvedState = resolveState({ disabled, reducedMotion, refreshing, error, complete, progress, state });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "refreshing";
    const normalizedCards = normalizeCards(cards);
    const hasList = Array.isArray(list?.items) && list.items.length > 0;
    const percent = Math.max(0, Math.min(100, Number(progress) || 0));
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": resolvedState === "refreshing" ? "true" : undefined,
        "data-flow-pattern": "pull-to-refresh",
        "data-state": resolvedState,
        "data-density": density,
        "data-progress": String(percent),
        "data-reduced-motion": String(Boolean(reducedMotion)),
        "data-card-count": String(normalizedCards.length),
        ...sanitizeRestProps(rest),
    }, React.createElement(AnimatedMoment, {
        label: indicator?.animatedLabel ?? `${label} status`,
        description: indicator?.description ?? description,
        variant: indicator?.variant ?? animatedVariant(resolvedState),
        state: indicator?.animatedState ?? animatedState(resolvedState),
        density,
        fullWidth: indicator?.fullWidth ?? false,
        icon: indicator?.icon ?? "sync",
        animationSource: reducedMotion ? undefined : indicator?.animationSource,
        animationData: reducedMotion ? undefined : indicator?.animationData,
        reducedMotionFallback: indicator?.reducedMotionFallback ?? "Refresh status is shown with text.",
        stateLabel: indicator?.stateLabel ?? resolvedState,
    }), React.createElement(ProgressIndicator, {
        label: indicator?.progressLabel ?? "Refresh progress",
        ariaValueText: indicator?.ariaValueText ?? `${resolvedState} refresh state`,
        value: percent,
        max: indicator?.max ?? 100,
        indeterminate: indicator?.indeterminate ?? resolvedState === "refreshing",
        showValue: indicator?.showValue ?? resolvedState !== "refreshing",
        tone: indicator?.tone ?? progressTone(resolvedState),
        state: indicator?.progressState ?? progressState(resolvedState),
        density,
        fullWidth: indicator?.fullWidth ?? true,
    }), React.createElement(Button, {
        ...(fallbackAction ?? {}),
        label: fallbackAction?.label ?? "Refresh",
        variant: fallbackAction?.variant ?? "secondary",
        density: fallbackAction?.density ?? density,
        icon: fallbackAction?.icon ?? "refresh",
        disabled: isDisabled || fallbackAction?.disabled,
        loading: resolvedState === "refreshing" || fallbackAction?.loading,
        onClick: (event) => {
            fallbackAction?.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onRefresh?.(event);
        },
    }), React.createElement(Surface, {
        surfaceRole: "section",
        state: contentSurfaceState(isDisabled, resolvedState),
        density,
        "data-flow-slot": "content",
        "data-pull-to-refresh-content": "true",
    }, hasList
        ? React.createElement(List, {
            ...list,
            label: list?.label ?? `${label} content`,
            density: list?.density ?? density,
            state: list?.state ?? (isDisabled ? "disabled" : "default"),
            interactive: list?.interactive ?? false,
        })
        : null, normalizedCards.map((card, index) => React.createElement(Card, {
        ...card,
        key: card.key ?? card.title ?? index,
        density: card.density ?? density,
        state: card.state ?? (isDisabled ? "disabled" : resolvedState === "error" ? "error" : "default"),
        fullWidth: card.fullWidth ?? true,
    }))), validation || resolvedState === "error"
        ? React.createElement(InlineValidation, {
            label: validation?.label ?? label,
            value: validation?.value,
            message: validation?.message ?? "Refresh failed. Try again.",
            state: validation?.state ?? (resolvedState === "error" ? "error" : "info"),
            density,
            fullWidth: true,
            field: validation?.field ?? true,
            live: validation?.live ?? true,
        })
        : null, feedback
        ? React.createElement(Toast, {
            ...feedback,
            density: feedback.density ?? density,
            state: feedback.state ?? "visible",
        })
        : null);
});
PullToRefresh.displayName = "PullToRefresh";
