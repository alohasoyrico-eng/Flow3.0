import React, { forwardRef } from "react";
import { flowDensityProps, flowRestProps, flowStateProps, normalizeFlowDensity } from "./internal/props.js";
const validSurfaceRoles = new Set(["canvas", "section", "panel", "overlay", "inline"]);
const validStates = new Set(["default", "raised", "sunken", "overlay", "selected", "dragging", "disabled", "focused"]);
const validElevations = new Set(["none", "raised", "floating", "overlay"]);
const validTones = new Set(["default", "muted", "selected", "danger", "warning", "success"]);
const validFocusModes = new Set(["none", "visible", "within"]);
const validBreakpoints = new Set(["base", "sm", "md", "lg"]);
function normalizeSurfaceRole(surfaceRole) {
    return validSurfaceRoles.has(surfaceRole) ? surfaceRole : "section";
}
function normalizeState(state) {
    return validStates.has(state) ? state : "default";
}
function normalizeElevation(elevation) {
    return validElevations.has(elevation) ? elevation : "none";
}
function normalizeTone(tone) {
    return validTones.has(tone) ? tone : "default";
}
function normalizeFocusMode(focusMode) {
    return validFocusModes.has(focusMode) ? focusMode : "none";
}
function normalizeBreakpoint(breakpoint) {
    return validBreakpoints.has(breakpoint) ? breakpoint : "base";
}
export const Surface = forwardRef(function Surface({ children, surfaceRole = "section", state = "default", density, elevation = "none", tone = "default", focusMode = "none", breakpoint = "base", className = "", ...rest }, ref) {
    const resolvedSurfaceRole = normalizeSurfaceRole(surfaceRole);
    const resolvedState = normalizeState(state);
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedElevation = normalizeElevation(elevation);
    const resolvedTone = normalizeTone(tone);
    const resolvedFocusMode = normalizeFocusMode(focusMode);
    const resolvedBreakpoint = normalizeBreakpoint(breakpoint);
    return React.createElement("div", {
        ...flowRestProps(rest),
        ref,
        className: ["surface", className].filter(Boolean).join(" "),
        "data-flow-primitive": "surface",
        "data-surface-role": resolvedSurfaceRole,
        "data-surface-elevation": resolvedElevation,
        "data-surface-tone": resolvedTone,
        "data-surface-focus-mode": resolvedFocusMode,
        "data-surface-breakpoint": resolvedBreakpoint,
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
    }, children);
});
Surface.displayName = "Surface";
