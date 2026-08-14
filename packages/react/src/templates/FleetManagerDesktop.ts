import React, { forwardRef, useState } from "react";
import { Surface, type SurfaceDensity, type SurfaceState, type SurfaceTone } from "../Surface.js";
import { RolesAndPermissions, type RolesAndPermissionsProps, type RolesAndPermissionsState, type RolesAndPermissionsValues } from "../patterns/RolesAndPermissions.js";
import { Sidebar, type SidebarGroup, type SidebarProps, type SidebarRoute } from "../patterns/Sidebar.js";
import { Topbar, type TopbarProps } from "../patterns/Topbar.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";

export type FleetManagerDesktopState = "loaded" | "loading" | "empty" | "error" | "permission" | "offline" | "disabled";
export type FleetManagerDesktopDensity = SurfaceDensity;
export type FleetManagerDesktopDashboard = "overview" | "fuel" | "maintenance" | "fleet" | "config" | (string & {});

export interface FleetManagerDesktopMetric {
  key?: string;
  label: string;
  value: string | number;
  detail?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

export interface FleetManagerDesktopException {
  key?: string;
  label: string;
  owner?: string;
  severity?: string;
  age?: string;
}

export interface FleetManagerDesktopProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: FleetManagerDesktopDensity;
  tone?: SurfaceTone;
  state?: FleetManagerDesktopState | undefined;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  selectedDashboard?: FleetManagerDesktopDashboard;
  defaultSelectedDashboard?: FleetManagerDesktopDashboard;
  onSelectedDashboardChange?: (key: string, route: SidebarRoute, event: MouseEvent<HTMLButtonElement>) => void;
  drawerOpen?: boolean;
  defaultDrawerOpen?: boolean;
  onDrawerOpenChange?: SidebarProps["onDrawerOpenChange"];
  topbar?: TopbarProps;
  sidebar?: SidebarProps;
  rolesAndPermissions?: RolesAndPermissionsProps;
  metrics?: FleetManagerDesktopMetric[];
  exceptions?: FleetManagerDesktopException[];
  activity?: ReactNode;
  filters?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface FleetManagerDesktopComponent extends ForwardRefExoticComponent<FleetManagerDesktopProps & RefAttributes<HTMLDivElement>> {
  displayName: "FleetManagerDesktop";
}

type SanitizedRestProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
} & {
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SanitizedRestProps {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as SanitizedRestProps;
}

function resolveTemplateState({
  disabled,
  loading,
  error,
  permissionBlocked,
  offline,
  state,
}: {
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  state?: FleetManagerDesktopState | undefined;
}): FleetManagerDesktopState {
  if (disabled || state === "disabled") return "disabled";
  if (offline || state === "offline") return "offline";
  if (error || state === "error") return "error";
  if (permissionBlocked || state === "permission") return "permission";
  if (loading || state === "loading") return "loading";
  return state ?? "loaded";
}

function surfaceStateForTemplate(state: FleetManagerDesktopState): SurfaceState {
  if (state === "disabled") return "disabled";
  if (state === "permission" || state === "error" || state === "offline") return "raised";
  return "default";
}

function rolesStateForTemplate(state: FleetManagerDesktopState): RolesAndPermissionsState {
  if (state === "loading") return "saving";
  if (state === "error" || state === "offline") return "error";
  if (state === "permission" || state === "disabled") return "permission-blocked";
  return "read-only";
}

function defaultRoutes(activeKey: FleetManagerDesktopDashboard): SidebarGroup[] {
  return [
    {
      title: "Fleet operations",
      icon: "dashboard",
      routes: [
        { key: "overview", label: "Overview", icon: "monitoring", active: activeKey === "overview" },
        { key: "fuel", label: "Fuel", icon: "local_gas_station", active: activeKey === "fuel" },
        { key: "maintenance", label: "Maintenance", icon: "build", active: activeKey === "maintenance" },
        { key: "fleet", label: "Fleet", icon: "local_shipping", active: activeKey === "fleet" },
        { key: "config", label: "Config", icon: "settings", active: activeKey === "config" },
      ],
    },
  ];
}

const defaultMetrics: FleetManagerDesktopMetric[] = [
  { key: "fleet-health", label: "Fleet health", value: "93%", detail: "Active vehicles on track", tone: "success" },
  { key: "open-exceptions", label: "Open exceptions", value: "18", detail: "Requires owner assignment", tone: "warning" },
  { key: "monthly-spend", label: "Monthly spend", value: "$1.8M", detail: "Fuel and operations", tone: "default" },
];

const defaultExceptions: FleetManagerDesktopException[] = [
  { key: "fuel-variance", label: "Fuel variance", owner: "Ops lead", severity: "High", age: "2h" },
  { key: "maintenance-overdue", label: "Maintenance overdue", owner: "Fleet lead", severity: "Medium", age: "1d" },
];

const defaultRoles: NonNullable<RolesAndPermissionsProps["roles"]> = [
  { key: "manager", label: "Manager" },
  { key: "finance", label: "Finance" },
  { key: "viewer", label: "Viewer" },
];

const defaultPermissions: NonNullable<RolesAndPermissionsProps["permissions"]> = [
  { key: "dashboard", label: "View dashboard", scope: "Fleet scope" },
  { key: "exceptions", label: "Assign exceptions", scope: "Operations" },
  { key: "finance", label: "View finance", scope: "Finance", tone: "warning" },
];

const defaultPermissionValues: RolesAndPermissionsValues = {
  manager: { dashboard: true, exceptions: true, finance: false },
  finance: { dashboard: true, exceptions: false, finance: true },
  viewer: { dashboard: true, exceptions: false, finance: false },
};

export const FleetManagerDesktop = forwardRef<HTMLDivElement, FleetManagerDesktopProps>(function FleetManagerDesktop({
  label = "Fleet manager desktop",
  description = "Scan operational health, isolate exceptions, and assign follow-up.",
  density = "md",
  tone,
  state,
  disabled = false,
  loading = false,
  error = false,
  permissionBlocked = false,
  offline = false,
  selectedDashboard,
  defaultSelectedDashboard = "overview",
  onSelectedDashboardChange,
  drawerOpen,
  defaultDrawerOpen = false,
  onDrawerOpenChange,
  topbar,
  sidebar,
  rolesAndPermissions,
  metrics = defaultMetrics,
  exceptions = defaultExceptions,
  activity,
  filters,
  className = "",
  ...rest
}, ref) {
  const [internalSelectedDashboard, setInternalSelectedDashboard] = useState<FleetManagerDesktopDashboard>(defaultSelectedDashboard);
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(defaultDrawerOpen);
  const resolvedSelectedDashboard = selectedDashboard ?? internalSelectedDashboard;
  const resolvedDrawerOpen = drawerOpen ?? internalDrawerOpen;
  const resolvedState = resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, state });
  const isBusy = resolvedState === "loading";
  const isDisabled = disabled || resolvedState === "disabled";
  const routes = sidebar?.groups ?? defaultRoutes(resolvedSelectedDashboard);

  const handleRouteSelect = (key: string, route: SidebarRoute, event: MouseEvent<HTMLButtonElement>) => {
    sidebar?.onRouteSelect?.(key, route, event);
    if (event.defaultPrevented) return;
    if (selectedDashboard === undefined) setInternalSelectedDashboard(key);
    onSelectedDashboardChange?.(key, route, event);
  };

  const handleDrawerOpenChange: NonNullable<SidebarProps["onDrawerOpenChange"]> = (open, event) => {
    sidebar?.onDrawerOpenChange?.(open, event);
    if (drawerOpen === undefined) setInternalDrawerOpen(open);
    onDrawerOpenChange?.(open, event);
  };

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "canvas",
      state: surfaceStateForTemplate(resolvedState),
      density,
      elevation: "none",
      tone: tone ?? (resolvedState === "permission" ? "warning" : resolvedState === "error" || resolvedState === "offline" ? "danger" : "default"),
      focusMode: "within",
      role: "region",
      "aria-label": label,
      "aria-description": description,
      "aria-busy": isBusy ? "true" : undefined,
      "data-flow-template": "fleet-manager-desktop",
      "data-template-state": resolvedState,
      "data-density": density,
      "data-selected-dashboard": resolvedSelectedDashboard,
      ...sanitizeRestProps(rest),
    },
    React.createElement(Topbar, {
      ...(topbar ?? {}),
      label: topbar?.label ?? label,
      density: topbar?.density ?? density,
      state: topbar?.state ?? (isBusy ? "loading" : resolvedState === "permission" ? "permission-filtered" : undefined),
      loading: isBusy || topbar?.loading,
      disabled: isDisabled || topbar?.disabled,
      permissionFiltered: resolvedState === "permission" || topbar?.permissionFiltered,
      search: topbar?.search ?? {
        label: "Search fleet",
        placeholder: "Vehicle, driver, exception",
      },
      account: topbar?.account ?? {
        name: "Fleet Admin",
        status: resolvedState === "offline" ? "offline" : "online",
      },
      sidebar: {
        ...(sidebar ?? {}),
        groups: routes,
        drawerOpen: resolvedDrawerOpen,
        onDrawerOpenChange: handleDrawerOpenChange,
      },
      navigationAction: topbar?.navigationAction ?? { label: "Open navigation", icon: "menu" },
      "data-template-slot": "global-shell",
    } as TopbarProps),
    React.createElement(Surface, {
      surfaceRole: "section",
      state: resolvedState === "permission" ? "raised" : "default",
      density,
      elevation: "raised",
      "data-template-slot": "navigation-region",
    },
      React.createElement(Sidebar, {
        ...(sidebar ?? {}),
        label: sidebar?.label ?? "Fleet manager navigation",
        density: sidebar?.density ?? density,
        drawer: sidebar?.drawer === false ? false : {
          ...(sidebar?.drawer ?? {}),
          closeLabel: sidebar?.drawer?.closeLabel ?? "Close navigation panel",
          showCloseButton: sidebar?.drawer?.showCloseButton ?? true,
        },
        groups: routes,
        activeKey: resolvedSelectedDashboard,
        drawerOpen: resolvedDrawerOpen,
        loading: isBusy || sidebar?.loading,
        disabled: isDisabled || sidebar?.disabled,
        permissionFiltered: resolvedState === "permission" || sidebar?.permissionFiltered,
        onRouteSelect: handleRouteSelect,
        onDrawerOpenChange: handleDrawerOpenChange,
      } as SidebarProps),
    ),
    React.createElement(Surface, {
      surfaceRole: "section",
      state: surfaceStateForTemplate(resolvedState),
      density,
      elevation: "none",
      "data-template-slot": "workspace",
    },
      React.createElement(Surface, {
        surfaceRole: "panel",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        tone: resolvedState === "error" || resolvedState === "offline" ? "danger" : "default",
        "data-template-module": "executive-kpi-band",
        "data-module-item-count": String(metrics.length),
      },
        metrics.map((metric) => React.createElement("span", {
          key: metric.key ?? metric.label,
          "data-template-metric": metric.key ?? metric.label,
          "data-template-tone": metric.tone ?? "default",
        }, `${metric.label}: ${metric.value} ${metric.detail ?? ""}`)),
      ),
      React.createElement(Surface, {
        surfaceRole: "panel",
        state: resolvedState === "permission" ? "raised" : surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        tone: resolvedState === "permission" ? "warning" : "default",
        "data-template-module": "exception-inbox",
        "data-module-item-count": String(exceptions.length),
      },
        exceptions.map((exception) => React.createElement("span", {
          key: exception.key ?? exception.label,
          "data-template-exception": exception.key ?? exception.label,
          "data-template-severity": exception.severity ?? "Unscored",
        }, `${exception.label}: ${exception.owner ?? "Unassigned"} ${exception.age ?? ""}`)),
      ),
      React.createElement(RolesAndPermissions, {
        ...(rolesAndPermissions ?? {}),
        label: rolesAndPermissions?.label ?? "Fleet scope permissions",
        description: rolesAndPermissions?.description ?? "Permission scope changes visible dashboard data and actions.",
        density: rolesAndPermissions?.density ?? density,
        state: rolesAndPermissions?.state ?? rolesStateForTemplate(resolvedState),
        disabled: isDisabled || resolvedState === "permission" || rolesAndPermissions?.disabled,
        saving: isBusy || rolesAndPermissions?.saving,
        roles: rolesAndPermissions?.roles ?? defaultRoles,
        permissions: rolesAndPermissions?.permissions ?? defaultPermissions,
        values: rolesAndPermissions?.values ?? defaultPermissionValues,
        "data-template-module": "cost-center-scope-permissions",
      } as RolesAndPermissionsProps),
      activity
        ? React.createElement(Surface, {
          surfaceRole: "panel",
          state: surfaceStateForTemplate(resolvedState),
          density,
          elevation: "none",
          "data-template-module": "fleet-activity-timeline",
        }, activity)
        : null,
      filters
        ? React.createElement(Surface, {
          surfaceRole: "panel",
          state: surfaceStateForTemplate(resolvedState),
          density,
          elevation: "none",
          "data-template-module": "cost-center-filter-set",
        }, filters)
        : null,
    ),
  );
}) as FleetManagerDesktopComponent;

FleetManagerDesktop.displayName = "FleetManagerDesktop";
