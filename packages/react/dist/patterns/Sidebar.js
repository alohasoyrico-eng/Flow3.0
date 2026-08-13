import React, { forwardRef } from "react";
import { Accordion } from "../Accordion.js";
import { Badge } from "../Badge.js";
import { Breadcrumbs } from "../Breadcrumbs.js";
import { Button } from "../Button.js";
import { Drawer } from "../Drawer.js";
import { IconButton } from "../IconButton.js";
import { Surface } from "../Surface.js";
import { flowDefinedProps } from "../internal/props.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest ?? {}).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeGroups(groups) {
    return (Array.isArray(groups) ? groups : [])
        .filter((group) => group?.title)
        .map((group) => ({
        ...group,
        key: String(group.key ?? group.title),
        routes: (Array.isArray(group.routes) ? group.routes : []).filter((route) => route?.label),
    }));
}
function resolveState({ disabled, loading, permissionFiltered, mobileDrawer, collapsed, activeKey, state, }) {
    if (disabled)
        return "disabled";
    if (loading || state === "loading")
        return "loading";
    if (permissionFiltered || state === "permission-filtered")
        return "permission-filtered";
    if (mobileDrawer || state === "mobile-drawer")
        return "mobile-drawer";
    if (activeKey || state === "active")
        return "active";
    if (collapsed || state === "collapsed")
        return "collapsed";
    return state ?? "expanded";
}
function routeNodes(routes, { density, activeKey, disabled, onRouteSelect, }) {
    return routes.map((route) => {
        const key = String(route.key ?? route.id ?? route.label);
        const isActive = activeKey != null ? activeKey === key : route.active;
        return React.createElement("div", {
            key,
            "data-sidebar-route": key,
            "data-active": String(Boolean(isActive)),
        }, React.createElement(Button, flowDefinedProps({
            icon: route.icon ?? "circle",
            label: route.label,
            density,
            variant: isActive ? "primary" : "ghost",
            fullWidth: true,
            disabled: disabled || route.disabled,
            "aria-current": isActive ? "page" : undefined,
            "aria-pressed": isActive ? "true" : undefined,
            onClick: (event) => onRouteSelect?.(key, route, event),
            "data-flow-slot": "route-action",
        })), route.badge
            ? React.createElement(Badge, flowDefinedProps({
                label: route.badge,
                tone: route.badgeTone ?? "info",
                variant: route.badgeVariant ?? "count",
                density,
                state: disabled || route.disabled ? "disabled" : "default",
                live: route.badgeLive,
                "data-flow-slot": "route-badge",
            }))
            : null);
    });
}
export const Sidebar = forwardRef(function Sidebar({ label = "App navigation", density, state, collapsed = false, mobileDrawer = false, drawerOpen = false, loading = false, disabled = false, permissionFiltered = false, groups = [], breadcrumbs = [], activeKey, expandedIds, collapseAction, drawer, onExpandedChange, onDrawerOpenChange, onRouteSelect, onCollapse, className = "", ...rest }, ref) {
    const normalizedGroups = normalizeGroups(groups);
    const resolvedState = resolveState(flowDefinedProps({ disabled, loading, permissionFiltered, mobileDrawer, collapsed, activeKey, state }));
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading";
    const routeCount = normalizedGroups.reduce((total, group) => total + group.routes.length, 0);
    const openIds = expandedIds ?? normalizedGroups.filter((group) => group.open || group.routes.some((route) => route.active || String(route.key ?? route.id ?? route.label) === activeKey)).map((group) => group.key);
    const shouldRenderDrawer = drawer !== false && (Boolean(drawer) || drawerOpen || mobileDrawer);
    return React.createElement("div", {
        ref,
        className: className || undefined,
        role: "navigation",
        "aria-label": label,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        "data-flow-pattern": "sidebar",
        "data-state": resolvedState,
        "data-density": density,
        "data-group-count": String(normalizedGroups.length),
        "data-route-count": String(routeCount),
        "data-collapsed": String(Boolean(collapsed)),
        ...sanitizeRestProps(rest),
    }, shouldRenderDrawer ? React.createElement(Drawer, flowDefinedProps({
        label: drawer?.label ?? label,
        description: drawer?.description,
        id: drawer?.id,
        closeLabel: drawer?.closeLabel ?? "Close navigation",
        showCloseButton: drawer?.showCloseButton ?? false,
        open: drawerOpen || mobileDrawer,
        state: drawerOpen || mobileDrawer ? "open" : "closed",
        variant: "side-sheet",
        side: drawer?.side ?? "left",
        density,
        content: [
            { type: "badge", key: "routes", label: `${routeCount} routes`, tone: "info", variant: "count" },
        ],
        onOpenChange: onDrawerOpenChange,
        "data-flow-slot": "navigation-drawer",
    })) : null, breadcrumbs.length
        ? React.createElement(Breadcrumbs, flowDefinedProps({
            items: breadcrumbs,
            label: `${label} location`,
            density,
            variant: collapsed ? "compact" : "standard",
            state: isDisabled ? "disabled" : "default",
            "data-flow-slot": "breadcrumbs",
        }))
        : null, React.createElement(IconButton, flowDefinedProps({
        ...sanitizeRestProps(collapseAction ?? {}),
        icon: collapsed ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left",
        label: collapseAction?.label ?? (collapsed ? "Expand navigation" : "Collapse navigation"),
        ariaLabel: collapseAction?.ariaLabel ?? (collapsed ? "Expand navigation" : "Collapse navigation"),
        density,
        variant: "ghost",
        disabled: isDisabled || collapseAction?.disabled,
        onClick: (event) => {
            collapseAction?.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onCollapse?.(!collapsed, event);
        },
        "data-flow-slot": "collapse-action",
    })), React.createElement(Surface, flowDefinedProps({
        surfaceRole: "section",
        density,
        state: isDisabled ? "disabled" : collapsed ? "sunken" : "default",
        "data-flow-slot": "groups",
        "aria-label": `${label} groups`,
    }), React.createElement(Accordion, flowDefinedProps({
        items: normalizedGroups.map((group) => ({
            id: group.key,
            title: group.title,
            open: openIds.includes(group.key),
            content: React.createElement("div", { "data-sidebar-group": group.key }, routeNodes(group.routes, flowDefinedProps({ density, activeKey, disabled: isDisabled, onRouteSelect }))),
            ...flowDefinedProps({
                meta: group.badge,
                icon: group.icon,
                disabled: isDisabled || group.disabled,
            }),
        })),
        multiple: true,
        expandedIds: openIds,
        density,
        onExpandedChange,
        "data-flow-slot": "group-accordion",
    }))), permissionFiltered
        ? React.createElement(Badge, flowDefinedProps({
            label: "Permission filtered",
            tone: "warning",
            variant: "status",
            density,
            state: isDisabled ? "disabled" : "default",
            live: true,
            "data-flow-slot": "permission-status",
        }))
        : null);
});
Sidebar.displayName = "Sidebar";
