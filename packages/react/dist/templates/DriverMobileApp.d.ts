import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceTone } from "../Surface.js";
import type { DriverOnboardingMobileProps } from "../patterns/DriverOnboardingMobile.js";
import type { StationDiscoveryProps } from "../patterns/StationDiscovery.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type DriverMobileAppState = "loaded" | "loading" | "empty" | "error" | "permission" | "offline" | "disabled";
export type DriverMobileAppDensity = SurfaceDensity;
export type DriverMobileAppTab = "home" | "card" | "routes" | "support" | (string & {});

export interface DriverMobileAppTabItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface DriverMobileAppCard {
  status?: string;
  available?: string;
  limit?: string;
  detail?: string;
}

export interface DriverMobileAppMovement {
  key?: string;
  label: string;
  amount?: string;
  status?: string;
}

export interface DriverMobileAppProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: DriverMobileAppDensity;
  tone?: SurfaceTone;
  state?: DriverMobileAppState;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  selectedTab?: DriverMobileAppTab;
  defaultSelectedTab?: DriverMobileAppTab;
  onSelectedTabChange?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  driverOnboarding?: DriverOnboardingMobileProps;
  stationDiscovery?: StationDiscoveryProps;
  card?: DriverMobileAppCard;
  movements?: DriverMobileAppMovement[];
  tabs?: DriverMobileAppTabItem[];
  support?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DriverMobileAppComponent extends ForwardRefExoticComponent<DriverMobileAppProps & RefAttributes<HTMLDivElement>> {
  displayName: "DriverMobileApp";
}

export const DriverMobileApp: DriverMobileAppComponent;
