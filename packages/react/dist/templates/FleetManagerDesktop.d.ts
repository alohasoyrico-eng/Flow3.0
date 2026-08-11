import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceTone } from "../Surface.js";
import type { RolesAndPermissionsProps } from "../patterns/RolesAndPermissions.js";
import type { SidebarProps, SidebarRoute } from "../patterns/Sidebar.js";
import type { TopbarProps } from "../patterns/Topbar.js";
import type { FlowDataAttributes } from "../internal/props.js";

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
  state?: FleetManagerDesktopState;
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

export const FleetManagerDesktop: FleetManagerDesktopComponent;
