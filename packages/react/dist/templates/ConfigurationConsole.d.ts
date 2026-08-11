import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceTone } from "../Surface.js";
import type { AuthenticationLoginBiometricsAndOtpProps } from "../patterns/AuthenticationLoginBiometricsAndOtp.js";
import type { DriverAndVehicleAdministrationProps } from "../patterns/DriverAndVehicleAdministration.js";
import type { RolesAndPermissionsProps } from "../patterns/RolesAndPermissions.js";
import type { SidebarProps, SidebarRoute } from "../patterns/Sidebar.js";
import type { TopbarProps } from "../patterns/Topbar.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type ConfigurationConsoleState = "loaded" | "loading" | "empty" | "error" | "permission" | "offline" | "disabled";
export type ConfigurationConsoleDensity = SurfaceDensity;
export type ConfigurationConsoleModule = "permissions" | "drivers" | "vehicles" | "audit" | (string & {});

export interface ConfigurationConsoleProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: ConfigurationConsoleDensity;
  tone?: SurfaceTone;
  state?: ConfigurationConsoleState;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  selectedModule?: ConfigurationConsoleModule;
  defaultSelectedModule?: ConfigurationConsoleModule;
  onSelectedModuleChange?: (key: string, route: SidebarRoute, event: MouseEvent<HTMLButtonElement>) => void;
  drawerOpen?: boolean;
  defaultDrawerOpen?: boolean;
  onDrawerOpenChange?: SidebarProps["onDrawerOpenChange"];
  topbar?: TopbarProps;
  sidebar?: SidebarProps;
  rolesAndPermissions?: RolesAndPermissionsProps;
  driverAdministration?: DriverAndVehicleAdministrationProps;
  vehicleAdministration?: DriverAndVehicleAdministrationProps;
  authentication?: AuthenticationLoginBiometricsAndOtpProps;
  auditTrail?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface ConfigurationConsoleComponent extends ForwardRefExoticComponent<ConfigurationConsoleProps & RefAttributes<HTMLDivElement>> {
  displayName: "ConfigurationConsole";
}

export const ConfigurationConsole: ConfigurationConsoleComponent;
