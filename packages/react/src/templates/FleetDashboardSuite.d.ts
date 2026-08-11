import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceTone } from "../Surface.js";
import type { SidebarProps, SidebarRoute } from "../patterns/Sidebar.js";
import type { TopbarProps } from "../patterns/Topbar.js";
import type { FlowDataAttributes } from "../internal/props.js";

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
  state?: FleetDashboardSuiteState;
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

export const FleetDashboardSuite: FleetDashboardSuiteComponent;
