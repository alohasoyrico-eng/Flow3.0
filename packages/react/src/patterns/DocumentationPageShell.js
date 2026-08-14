/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Surface } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
const validStates = new Set([
    "desktop",
    "mobile",
    "sidebar-open",
    "sidebar-closed",
    "search-open",
    "dark",
    "light",
    "grid-overlay-visible",
    "loading",
]);
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ state, sidebarOpen, searchOpen, loading, }) {
    if (loading || state === "loading")
        return "loading";
    if (searchOpen)
        return "search-open";
    if (sidebarOpen === true)
        return "sidebar-open";
    if (sidebarOpen === false)
        return "sidebar-closed";
    return state && validStates.has(state) ? state : "desktop";
}
export const DocumentationPageShell = forwardRef(function DocumentationPageShell({ topbar, sidebar, localNav, children, density, state, background = "none", sidebarOpen, searchOpen = false, loading = false, surface, className = "", ...rest }, ref) {
    const resolvedState = resolveState({
        ...(state !== undefined ? { state } : {}),
        ...(sidebarOpen !== undefined ? { sidebarOpen } : {}),
        searchOpen,
        loading,
    });
    const resolvedBackground = background === "gradient-grid" ? "gradient-grid" : "none";
    return React.createElement(Surface, {
        ...surface,
        ...sanitizeRestProps(rest),
        ref,
        className: ["documentation-page-shell", className].filter(Boolean).join(" "),
        surfaceRole: "canvas",
        state: resolvedState === "loading" ? "disabled" : "default",
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        "data-flow-pattern": "documentation-page-shell",
        "data-documentation-page-shell-state": resolvedState,
        "data-documentation-page-shell-background": resolvedBackground,
        "data-sidebar-open": sidebarOpen === undefined ? undefined : String(sidebarOpen),
        "data-search-open": String(searchOpen),
        ...(density !== undefined ? { density } : {}),
    }, topbar ? React.createElement("div", { "data-flow-slot": "documentation-page-shell.topbar" }, topbar) : null, React.createElement("div", { "data-flow-slot": "documentation-page-shell.body" }, sidebar ? React.createElement("div", { "data-flow-slot": "documentation-page-shell.sidebar", role: "complementary" }, sidebar) : null, React.createElement("main", { "data-flow-slot": "content" }, children), localNav ? React.createElement("div", { "data-flow-slot": "documentation-page-shell.local-nav", role: "complementary" }, localNav) : null));
});
DocumentationPageShell.displayName = "DocumentationPageShell";
