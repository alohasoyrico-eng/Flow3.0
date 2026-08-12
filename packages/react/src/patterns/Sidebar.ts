import React, { forwardRef } from "react";
import type { MouseEvent } from "react";
import { Accordion } from "../Accordion.js";
import type { AccordionDensity } from "../Accordion.js";
import { Badge } from "../Badge.js";
import type { BadgeTone, BadgeVariant } from "../Badge.js";
import { Breadcrumbs } from "../Breadcrumbs.js";
import type { BreadcrumbItem } from "../Breadcrumbs.js";
import { Button } from "../Button.js";
import { Drawer } from "../Drawer.js";
import type { DrawerOpenChangeEvent, DrawerSide } from "../Drawer.js";
import { IconButton } from "../IconButton.js";
import type { IconButtonProps } from "../IconButton.js";
import { Surface } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type SidebarState = "expanded" | "collapsed" | "mobile-drawer" | "active" | "loading" | "permission-filtered" | "disabled";
export type SidebarDensity = AccordionDensity;

export interface SidebarRoute {
  key?: string;
  id?: string;
  label: string;
  icon?: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  badgeTone?: BadgeTone;
  badgeVariant?: BadgeVariant;
  badgeLive?: boolean;
}

export interface SidebarGroup {
  key?: string;
  title: string;
  icon?: string;
  badge?: string;
  open?: boolean;
  disabled?: boolean;
  routes?: SidebarRoute[];
}

export interface SidebarDrawer {
  label?: string;
  description?: string;
  closeLabel?: string;
  side?: DrawerSide;
}

export interface SidebarCollapseAction extends Pick<IconButtonProps, "label" | "ariaLabel" | "disabled" | "onClick"> {}

export interface SidebarProps extends FlowDataAttributes {
  label?: string;
  density?: SidebarDensity;
  state?: SidebarState;
  collapsed?: boolean;
  mobileDrawer?: boolean;
  drawerOpen?: boolean;
  loading?: boolean;
  disabled?: boolean;
  permissionFiltered?: boolean;
  groups?: SidebarGroup[];
  breadcrumbs?: BreadcrumbItem[];
  activeKey?: string;
  expandedIds?: string[];
  collapseAction?: SidebarCollapseAction;
  drawer?: SidebarDrawer;
  onExpandedChange?: (expandedIds: string[], event: MouseEvent<HTMLButtonElement>) => void;
  onDrawerOpenChange?: (open: boolean, event?: DrawerOpenChangeEvent) => void;
  onRouteSelect?: (key: string, route: SidebarRoute, event: MouseEvent<HTMLButtonElement>) => void;
  onCollapse?: (collapsed: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

function sanitizeRestProps(rest: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeGroups(groups: SidebarGroup[] | undefined) {
  return (Array.isArray(groups) ? groups : [])
    .filter((group) => group?.title)
    .map((group) => ({
      ...group,
      key: String(group.key ?? group.title),
      routes: (Array.isArray(group.routes) ? group.routes : []).filter((route) => route?.label),
    }));
}

function resolveState({
  disabled,
  loading,
  permissionFiltered,
  mobileDrawer,
  collapsed,
  activeKey,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  permissionFiltered: boolean;
  mobileDrawer: boolean;
  collapsed: boolean;
  activeKey?: string;
  state?: SidebarState;
}): SidebarState {
  if (disabled) return "disabled";
  if (loading || state === "loading") return "loading";
  if (permissionFiltered || state === "permission-filtered") return "permission-filtered";
  if (mobileDrawer || state === "mobile-drawer") return "mobile-drawer";
  if (activeKey || state === "active") return "active";
  if (collapsed || state === "collapsed") return "collapsed";
  return state ?? "expanded";
}

function routeNodes(
  routes: SidebarRoute[],
  {
    density,
    activeKey,
    disabled,
    onRouteSelect,
  }: {
    density?: SidebarDensity;
    activeKey?: string;
    disabled: boolean;
    onRouteSelect?: SidebarProps["onRouteSelect"];
  },
) {
  return routes.map((route) => {
    const key = String(route.key ?? route.id ?? route.label);
    const isActive = activeKey != null ? activeKey === key : route.active;
    return React.createElement(
      "div",
      {
        key,
        "data-sidebar-route": key,
        "data-active": String(Boolean(isActive)),
      },
      React.createElement(Button, {
        icon: route.icon ?? "circle",
        label: route.label,
        density,
        variant: isActive ? "primary" : "ghost",
        fullWidth: true,
        disabled: disabled || route.disabled,
        "aria-current": isActive ? "page" : undefined,
        "aria-pressed": isActive ? "true" : undefined,
        onClick: (event) => onRouteSelect?.(key, route, event),
      }),
      route.badge
        ? React.createElement(Badge, {
          label: route.badge,
          tone: route.badgeTone ?? "info",
          variant: route.badgeVariant ?? "count",
          density,
          state: disabled || route.disabled ? "disabled" : "default",
          live: route.badgeLive,
        })
        : null,
    );
  });
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar({
  label = "App navigation",
  density,
  state,
  collapsed = false,
  mobileDrawer = false,
  drawerOpen = false,
  loading = false,
  disabled = false,
  permissionFiltered = false,
  groups = [],
  breadcrumbs = [],
  activeKey,
  expandedIds,
  collapseAction,
  drawer,
  onExpandedChange,
  onDrawerOpenChange,
  onRouteSelect,
  onCollapse,
  className = "",
  ...rest
}, ref) {
  const normalizedGroups = normalizeGroups(groups);
  const resolvedState = resolveState({ disabled, loading, permissionFiltered, mobileDrawer, collapsed, activeKey, state });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading";
  const routeCount = normalizedGroups.reduce((total, group) => total + group.routes.length, 0);
  const openIds = expandedIds ?? normalizedGroups.filter((group) => group.open || group.routes.some((route) => route.active || String(route.key ?? route.id ?? route.label) === activeKey)).map((group) => group.key);

  return React.createElement(
    "div",
    {
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
    },
    React.createElement(Drawer, {
      label: drawer?.label ?? label,
      description: drawer?.description,
      closeLabel: drawer?.closeLabel ?? "Close navigation",
      open: drawerOpen || mobileDrawer,
      state: drawerOpen || mobileDrawer ? "open" : "closed",
      variant: "side-sheet",
      side: drawer?.side ?? "left",
      density,
      content: [
        { type: "badge", key: "routes", label: `${routeCount} routes`, tone: "info", variant: "count" },
      ],
      onOpenChange: onDrawerOpenChange,
    }),
    breadcrumbs.length
      ? React.createElement(Breadcrumbs, {
        items: breadcrumbs,
        label: `${label} location`,
        density,
        variant: collapsed ? "compact" : "standard",
        state: isDisabled ? "disabled" : "default",
      })
      : null,
    React.createElement(IconButton, {
      icon: collapsed ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left",
      label: collapseAction?.label ?? (collapsed ? "Expand navigation" : "Collapse navigation"),
      ariaLabel: collapseAction?.ariaLabel ?? (collapsed ? "Expand navigation" : "Collapse navigation"),
      density,
      variant: "ghost",
      disabled: isDisabled || collapseAction?.disabled,
      onClick: (event) => {
        collapseAction?.onClick?.(event);
        if (event.defaultPrevented) return;
        onCollapse?.(!collapsed, event);
      },
    }),
    React.createElement(
      Surface,
      {
        surfaceRole: "section",
        density,
        state: isDisabled ? "disabled" : collapsed ? "sunken" : "default",
        "data-flow-slot": "groups",
        "aria-label": `${label} groups`,
      },
      React.createElement(Accordion, {
        items: normalizedGroups.map((group) => ({
          id: group.key,
          title: group.title,
          meta: group.badge,
          icon: group.icon,
          open: openIds.includes(group.key),
          disabled: isDisabled || group.disabled,
          content: React.createElement(
            "div",
            { "data-sidebar-group": group.key },
            routeNodes(group.routes, { density, activeKey, disabled: isDisabled, onRouteSelect }),
          ),
        })),
        multiple: true,
        expandedIds: openIds,
        density,
        onExpandedChange,
      }),
    ),
    permissionFiltered
      ? React.createElement(Badge, {
        label: "Permission filtered",
        tone: "warning",
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        live: true,
      })
      : null,
  );
});

Sidebar.displayName = "Sidebar";
