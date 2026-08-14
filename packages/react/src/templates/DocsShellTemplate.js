/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Surface } from "../Surface.js";
import { CommandPalette } from "../patterns/CommandPalette.js";
import { DocumentationPageShell } from "../patterns/DocumentationPageShell.js";
import { Search } from "../patterns/Search.js";
import { Sidebar } from "../patterns/Sidebar.js";
import { Topbar } from "../patterns/Topbar.js";
import { flowDefinedProps, flowRestProps } from "../internal/props.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ loading, mobile, sidebarOpen, theme, state, }) {
    if (loading || state === "loading")
        return "loading";
    if (state === "search-open")
        return "search-open";
    if (state === "sidebar-open" || sidebarOpen)
        return "sidebar-open";
    if (state === "sidebar-closed" || sidebarOpen === false)
        return "sidebar-closed";
    if (state === "dark" || theme === "dark")
        return "dark";
    if (state === "light" || theme === "light")
        return "light";
    if (mobile || state === "mobile")
        return "mobile";
    return state ?? "desktop";
}
export const DocsShellTemplate = forwardRef(function DocsShellTemplate({ label = "Flow documentation", density = "md", state, theme = "system", mobile = false, loading = false, sidebarOpen = false, sidebar, topbar, search, commandPalette, brand, pageLabel, pageDescription, children, skipLinkLabel = "Skip to content", skipLinkHref = "#docs-shell-content", className = "", contentClassName = "", ...rest }, ref) {
    const resolvedState = resolveState(flowDefinedProps({ loading, mobile, sidebarOpen, theme, state }));
    const sidebarProps = flowDefinedProps({
        ...sidebar,
        density: sidebar?.density ?? density,
        drawerOpen: sidebar?.drawerOpen ?? sidebarOpen,
        mobileDrawer: sidebar?.mobileDrawer ?? mobile,
        drawer: sidebar?.drawer ?? { id: "docs-shell-navigation", label: `${label} navigation`, showCloseButton: false },
        "data-flow-slot": "primary-navigation",
    });
    const topbarProps = flowDefinedProps({
        ...topbar,
        label: topbar?.label ?? label,
        density: topbar?.density ?? density,
        mobile: topbar?.mobile ?? mobile,
        loading: topbar?.loading ?? loading,
        sidebar: topbar?.sidebar,
        navigationAction: topbar?.navigationAction ?? {
            icon: "menu",
            label: sidebarOpen ? "Close navigation" : "Open navigation",
            ariaLabel: sidebarOpen ? "Close navigation" : "Open navigation",
            "aria-controls": "docs-shell-navigation",
            "aria-expanded": sidebarOpen,
        },
        "data-flow-slot": "topbar",
    });
    return React.createElement("div", {
        ref,
        className: ["docs-shell-template", className].filter(Boolean).join(" "),
        role: "group",
        "aria-label": rest["aria-label"] ?? label,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        "data-flow-template": "docs-shell-template",
        "data-state": resolvedState,
        "data-density": density,
        "data-theme": theme,
        "data-mobile": String(Boolean(mobile)),
        "data-sidebar-open": String(Boolean(sidebarOpen)),
        ...sanitizeRestProps(rest),
    }, React.createElement("a", { href: skipLinkHref, "data-flow-slot": "skip-link" }, skipLinkLabel), React.createElement("header", { "data-flow-slot": "shell-header" }, brand ? React.createElement("div", { "data-flow-slot": "brand" }, brand) : null, React.createElement(Topbar, topbarProps)), React.createElement(DocumentationPageShell, {
        topbar: null,
        density,
        state: resolvedState,
        background: theme === "dark" ? "none" : "gradient-grid",
        sidebarOpen,
        searchOpen: Boolean(search?.query),
        loading,
        className: contentClassName,
        "data-flow-slot": "shell-body",
    }, React.createElement(Sidebar, sidebarProps), search ? React.createElement(Search, { ...search, density: search.density ?? density, "data-flow-slot": "shell-search" }) : null, commandPalette ? React.createElement(CommandPalette, { ...commandPalette, density: commandPalette.density ?? density, "data-flow-slot": "shell-command-palette" }) : null, React.createElement(Surface, flowDefinedProps({
        id: "docs-shell-content",
        surfaceRole: "canvas",
        density,
        tone: theme === "dark" ? "muted" : "default",
        state: resolvedState === "loading" ? "sunken" : "default",
        "aria-label": pageLabel,
        "aria-describedby": pageDescription ? "docs-shell-page-description" : undefined,
        "data-flow-slot": "page",
    }), pageDescription
        ? React.createElement("p", { id: "docs-shell-page-description", "data-flow-slot": "page-description" }, pageDescription)
        : null, children)));
});
DocsShellTemplate.displayName = "DocsShellTemplate";
