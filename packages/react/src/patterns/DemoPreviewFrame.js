/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { ErrorPanel } from "../ErrorPanel.js";
import { Skeleton } from "../Skeleton.js";
import { Surface } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
const validStates = new Set(["default", "interactive", "static", "viewport-mobile", "viewport-desktop", "loading", "error", "unsupported", "dark", "density-compact"]);
const validKinds = new Set(["demo", "viewport", "playground", "template", "specimen"]);
const validTones = new Set(["default", "muted", "selected", "danger", "warning", "success", "info"]);
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveKind(kind) {
    return kind && validKinds.has(kind) ? kind : "demo";
}
function resolveState(state, kind, controls, source) {
    if (state && validStates.has(state))
        return state;
    if (kind === "viewport")
        return "viewport-desktop";
    if (kind === "playground" || controls || source)
        return "interactive";
    return "default";
}
function resolveTone(tone, state) {
    if (tone === "info")
        return "selected";
    if (tone && validTones.has(tone))
        return tone;
    if (state === "error")
        return "danger";
    if (state === "unsupported")
        return "warning";
    return "muted";
}
function renderFallback(state, fallback, density) {
    if (state === "loading") {
        return React.createElement(Skeleton, {
            label: fallback?.label ?? "Loading demo preview",
            variant: "card",
            density,
            fullWidth: true,
            busy: true,
            state: "loading",
            "data-flow-slot": "demo-preview-frame.fallback",
        });
    }
    if (state !== "error" && state !== "unsupported")
        return null;
    return React.createElement(ErrorPanel, {
        label: fallback?.label ?? (state === "unsupported" ? "Demo not supported" : "Demo failed to load"),
        description: fallback?.description,
        action: fallback?.action,
        tone: fallback?.tone ?? (state === "unsupported" ? "warning" : "error"),
        variant: "panel",
        state: state === "unsupported" ? "warning" : "error",
        density,
        fullWidth: true,
        icon: fallback?.icon,
        "data-flow-slot": "demo-preview-frame.fallback",
    });
}
export const DemoPreviewFrame = forwardRef(function DemoPreviewFrame({ label = "Demo preview", description, kind, state, density, tone, elevation = "none", compact = false, fullWidth = false, preview, controls, source, fallback, children, surface, className = "", ...rest }, ref) {
    const resolvedKind = resolveKind(kind);
    const resolvedState = resolveState(state, resolvedKind, controls, source);
    const resolvedTone = resolveTone(tone, resolvedState);
    const fallbackNode = renderFallback(resolvedState, fallback, density);
    const previewContent = fallbackNode ?? preview ?? children;
    return React.createElement(Surface, {
        ...surface,
        ...sanitizeRestProps(rest),
        ref,
        className: ["demo-preview-frame", className].filter(Boolean).join(" "),
        surfaceRole: "panel",
        density,
        elevation,
        tone: resolvedTone,
        state: resolvedState === "loading" ? "disabled" : "default",
        "aria-label": rest["aria-label"] ?? label,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        "data-flow-pattern": "demo-preview-frame",
        "data-demo-preview-frame-kind": resolvedKind,
        "data-demo-preview-frame-state": resolvedState,
        "data-demo-preview-frame-compact": String(Boolean(compact)),
        "data-demo-preview-frame-full-width": String(Boolean(fullWidth)),
    }, label || description
        ? React.createElement("div", { "data-flow-slot": "demo-preview-frame.header" }, label ? React.createElement("strong", null, label) : null, description ? React.createElement("p", null, description) : null)
        : null, controls
        ? React.createElement("div", { "data-flow-slot": "demo-preview-frame.controls" }, controls)
        : null, React.createElement("div", { "data-flow-slot": "demo-preview-frame.preview" }, previewContent), source
        ? React.createElement("div", { "data-flow-slot": "demo-preview-frame.source" }, source)
        : null);
});
DemoPreviewFrame.displayName = "DemoPreviewFrame";
