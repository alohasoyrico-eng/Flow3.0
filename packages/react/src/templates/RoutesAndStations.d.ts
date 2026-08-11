import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceTone } from "../Surface.js";
import type { StationDiscoveryProps, StationDiscoveryStation } from "../patterns/StationDiscovery.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type RoutesAndStationsState = "loaded" | "loading" | "empty" | "error" | "permission" | "offline" | "disabled";
export type RoutesAndStationsDensity = SurfaceDensity;

export interface RoutesAndStationsProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: RoutesAndStationsDensity;
  tone?: SurfaceTone;
  state?: RoutesAndStationsState;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  selectedStationKey?: string;
  defaultSelectedStationKey?: string;
  onSelectedStationChange?: (key: string, station: StationDiscoveryStation | Record<string, unknown>, event: MouseEvent<HTMLElement>) => void;
  stationDiscovery?: StationDiscoveryProps;
  stations?: StationDiscoveryStation[];
  route?: StationDiscoveryProps["route"];
  services?: ReactNode;
  fallbackList?: StationDiscoveryProps["fallbackList"];
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface RoutesAndStationsComponent extends ForwardRefExoticComponent<RoutesAndStationsProps & RefAttributes<HTMLDivElement>> {
  displayName: "RoutesAndStations";
}

export const RoutesAndStations: RoutesAndStationsComponent;
