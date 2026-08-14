import React, { forwardRef, useState } from "react";
import { Surface, type SurfaceDensity, type SurfaceState, type SurfaceTone } from "../Surface.js";
import { Sidebar, type SidebarGroup, type SidebarProps, type SidebarRoute } from "../patterns/Sidebar.js";
import { Topbar, type TopbarProps } from "../patterns/Topbar.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";

export type FleetDashboardSuiteState = "loaded" | "loading" | "empty" | "error" | "permission" | "offline" | "disabled";
export type FleetDashboardSuiteDensity = SurfaceDensity;
export type FleetDashboardSuiteDashboard = "overview" | "fuel" | "maintenance" | "ev" | "toll" | "fleet" | "finance" | (string & {});

export interface FleetDashboardSuiteFilter {
  key?: string;
  label: string;
  value: string;
}

export interface FleetDashboardSuiteKpi {
  key?: string;
  label: string;
  value: string | number;
  threshold?: string;
  trend?: string;
  definition?: string;
}

export interface FleetDashboardSuiteDrillDownRow {
  key?: string;
  domain: string;
  owner: string;
  threshold: string;
  evidence: string;
}

export interface FleetDashboardSuiteProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: FleetDashboardSuiteDensity;
  tone?: SurfaceTone;
  state?: FleetDashboardSuiteState | undefined;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  selectedDashboard?: FleetDashboardSuiteDashboard;
  defaultSelectedDashboard?: FleetDashboardSuiteDashboard;
  onSelectedDashboardChange?: (key: string, route: SidebarRoute, event: MouseEvent<HTMLButtonElement>) => void;
  drawerOpen?: boolean;
  defaultDrawerOpen?: boolean;
  onDrawerOpenChange?: SidebarProps["onDrawerOpenChange"];
  topbar?: TopbarProps;
  sidebar?: SidebarProps;
  filters?: FleetDashboardSuiteFilter[];
  kpis?: FleetDashboardSuiteKpi[];
  drillDownRows?: FleetDashboardSuiteDrillDownRow[];
  chartSummary?: ReactNode;
  financeVisible?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface FleetDashboardSuiteComponent extends ForwardRefExoticComponent<FleetDashboardSuiteProps & RefAttributes<HTMLDivElement>> {
  displayName: "FleetDashboardSuite";
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
  state?: FleetDashboardSuiteState | undefined;
}): FleetDashboardSuiteState {
  if (disabled || state === "disabled") return "disabled";
  if (offline || state === "offline") return "offline";
  if (error || state === "error") return "error";
  if (permissionBlocked || state === "permission") return "permission";
  if (loading || state === "loading") return "loading";
  return state ?? "loaded";
}

function surfaceStateForTemplate(state: FleetDashboardSuiteState): SurfaceState {
  if (state === "disabled") return "disabled";
  if (state === "permission" || state === "error" || state === "offline") return "raised";
  return "default";
}

function defaultRoutes(activeKey: FleetDashboardSuiteDashboard): SidebarGroup[] {
  return [
    {
      title: "Dashboard suite",
      icon: "dashboard",
      routes: [
        { key: "overview", label: "Overview", icon: "monitoring", active: activeKey === "overview" },
        { key: "fuel", label: "Fuel", icon: "local_gas_station", active: activeKey === "fuel" },
        { key: "maintenance", label: "Maintenance", icon: "build", active: activeKey === "maintenance" },
        { key: "ev", label: "Electromobility", icon: "electric_car", active: activeKey === "ev" },
        { key: "toll", label: "Toll", icon: "toll", active: activeKey === "toll" },
        { key: "fleet", label: "Fleet", icon: "local_shipping", active: activeKey === "fleet" },
        { key: "finance", label: "Finance", icon: "payments", active: activeKey === "finance" },
      ],
    },
  ];
}

const defaultFilters: FleetDashboardSuiteFilter[] = [
  { key: "period", label: "Period", value: "Last 30 days" },
  { key: "segment", label: "Segment", value: "All fleet" },
  { key: "region", label: "Region", value: "North" },
];

const defaultKpis: FleetDashboardSuiteKpi[] = [
  { key: "uptime", label: "Fleet uptime", value: "96.4%", threshold: ">= 95%", trend: "+1.8%", definition: "Vehicles available against plan" },
  { key: "cost", label: "Cost per km", value: "$8.42", threshold: "<= $8.70", trend: "-3.1%", definition: "Blended operational spend" },
  { key: "exceptions", label: "Open exceptions", value: "24", threshold: "<= 30", trend: "-6", definition: "Items needing owner action" },
];

const defaultRows: FleetDashboardSuiteDrillDownRow[] = [
  { key: "fuel-variance", domain: "Fuel", owner: "Ops lead", threshold: "High variance", evidence: "3 routes over baseline" },
  { key: "maintenance-risk", domain: "Maintenance", owner: "Fleet lead", threshold: "Service due", evidence: "12 vehicles due this week" },
  { key: "finance-review", domain: "Finance", owner: "Controller", threshold: "Export gated", evidence: "Finance visibility required" },
];

export const FleetDashboardSuite = forwardRef<HTMLDivElement, FleetDashboardSuiteProps>(function FleetDashboardSuite({
  label = "Fleet dashboard suite",
  description = "Move across operational dashboards while preserving filters, thresholds, and drill-down evidence.",
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
  filters = defaultFilters,
  kpis = defaultKpis,
  drillDownRows = defaultRows,
  chartSummary,
  financeVisible = true,
  className = "",
  ...rest
}, ref) {
  const [internalSelectedDashboard, setInternalSelectedDashboard] = useState<FleetDashboardSuiteDashboard>(defaultSelectedDashboard);
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(defaultDrawerOpen);
  const resolvedSelectedDashboard = selectedDashboard ?? internalSelectedDashboard;
  const resolvedDrawerOpen = drawerOpen ?? internalDrawerOpen;
  const resolvedState = resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, state });
  const isBusy = resolvedState === "loading";
  const isDisabled = disabled || resolvedState === "disabled";
  const isPermissionFiltered = resolvedState === "permission" || !financeVisible;
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
      "data-flow-template": "fleet-dashboard-suite",
      "data-template-state": resolvedState,
      "data-density": density,
      "data-selected-dashboard": resolvedSelectedDashboard,
      "data-finance-visible": financeVisible ? "true" : "false",
      ...sanitizeRestProps(rest),
    },
    React.createElement(Topbar, {
      ...(topbar ?? {}),
      label: topbar?.label ?? label,
      density: topbar?.density ?? density,
      state: topbar?.state ?? (isBusy ? "loading" : isPermissionFiltered ? "permission-filtered" : undefined),
      loading: isBusy || topbar?.loading,
      disabled: isDisabled || topbar?.disabled,
      permissionFiltered: isPermissionFiltered || topbar?.permissionFiltered,
      search: topbar?.search ?? {
        label: "Search dashboards",
        placeholder: "Dashboard, owner, threshold",
      },
      account: topbar?.account ?? {
        name: "Fleet Ops",
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
        label: sidebar?.label ?? "Dashboard suite navigation",
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
        permissionFiltered: isPermissionFiltered || sidebar?.permissionFiltered,
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
        "data-template-module": "dashboard-switcher",
        "data-dashboard-count": "7",
      },
        routes.flatMap((group) => group.routes ?? []).map((route) => React.createElement("span", {
          key: route.key ?? route.label,
          "data-dashboard-option": route.key ?? route.label,
          "aria-current": route.active ? "page" : undefined,
        }, route.label)),
      ),
      React.createElement(Surface, {
        surfaceRole: "panel",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        "data-template-module": "shared-filter-bar",
        "data-filter-count": String(filters.length),
      },
        filters.map((filter) => React.createElement("span", {
          key: filter.key ?? filter.label,
          "data-shared-filter": filter.key ?? filter.label,
        }, `${filter.label}: ${filter.value}`)),
      ),
      React.createElement(Surface, {
        surfaceRole: "panel",
        state: resolvedState === "permission" ? "raised" : surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        tone: resolvedState === "permission" ? "warning" : "default",
        "data-template-module": "domain-kpi-stack",
        "data-chart-primitive": "charts",
        "data-kpi-count": String(kpis.length),
      },
        kpis.map((kpi) => React.createElement("span", {
          key: kpi.key ?? kpi.label,
          "data-kpi-definition": kpi.key ?? kpi.label,
          "data-kpi-threshold": kpi.threshold ?? "unset",
          "data-kpi-trend": kpi.trend ?? "flat",
        }, `${kpi.label}: ${kpi.value} ${kpi.definition ?? ""}`)),
        chartSummary ? React.createElement("span", { "data-chart-summary": "true" }, chartSummary) : null,
      ),
      React.createElement(Surface, {
        surfaceRole: "panel",
        state: resolvedState === "error" || resolvedState === "offline" ? "raised" : surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        tone: resolvedState === "error" || resolvedState === "offline" ? "danger" : "default",
        "data-template-module": "drill-down-table",
        "data-row-count": String(drillDownRows.length),
        "data-permission-filtered": isPermissionFiltered ? "true" : "false",
      },
        resolvedState === "error" ? React.createElement("span", { "data-state": "error", "data-template-recovery": "drill-down-error" }, "Drill-down evidence unavailable") : null,
        drillDownRows.map((row) => React.createElement("span", {
          key: row.key ?? row.domain,
          "data-drill-down-row": row.key ?? row.domain,
          "data-domain": row.domain,
        }, `${row.domain}: ${row.owner} ${row.threshold} ${row.evidence}`)),
      ),
    ),
  );
}) as FleetDashboardSuiteComponent;

FleetDashboardSuite.displayName = "FleetDashboardSuite";
