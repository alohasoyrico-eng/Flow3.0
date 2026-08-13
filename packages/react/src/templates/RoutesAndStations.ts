import React, { forwardRef, useState } from "react";
import { Surface, type SurfaceDensity, type SurfaceState, type SurfaceTone } from "../Surface.js";
import { StationDiscovery, type StationDiscoveryProps, type StationDiscoveryState, type StationDiscoveryStation } from "../patterns/StationDiscovery.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";

export type RoutesAndStationsState = "loaded" | "loading" | "empty" | "error" | "permission" | "offline" | "disabled";
export type RoutesAndStationsDensity = SurfaceDensity;

export interface RoutesAndStationsProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: RoutesAndStationsDensity;
  tone?: SurfaceTone;
  state?: RoutesAndStationsState | undefined;
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
  state?: RoutesAndStationsState | undefined;
}): RoutesAndStationsState {
  if (disabled || state === "disabled") return "disabled";
  if (offline || state === "offline") return "offline";
  if (error || state === "error") return "error";
  if (permissionBlocked || state === "permission") return "permission";
  if (loading || state === "loading") return "loading";
  if (state === "empty") return "empty";
  return state ?? "loaded";
}

function surfaceStateForTemplate(state: RoutesAndStationsState): SurfaceState {
  if (state === "disabled") return "disabled";
  if (state === "permission" || state === "error" || state === "offline") return "raised";
  if (state === "empty" || state === "loading") return "sunken";
  return "default";
}

function stationStateForTemplate(state: RoutesAndStationsState): StationDiscoveryState {
  if (state === "loading") return "loading";
  if (state === "permission") return "denied";
  if (state === "offline") return "offline";
  if (state === "error") return "error";
  if (state === "empty") return "empty";
  if (state === "disabled") return "disabled";
  return "route";
}

const defaultStations: StationDiscoveryStation[] = [
  { id: "centro", key: "centro", label: "Centro Norte", value: "1.2 km", meta: "Fuel, diesel, open", route: "8 min", selected: true },
  { id: "industrial", key: "industrial", label: "Industrial Sur", value: "2.6 km", meta: "Fuel and service", route: "11 min" },
  { id: "poniente", key: "poniente", label: "Poniente EV", value: "4.1 km", meta: "EV charging", route: "18 min", variant: "ev" },
];

function stationKey(station: StationDiscoveryStation | Record<string, unknown> | null | undefined): string {
  return String(station?.key ?? station?.id ?? station?.label ?? "");
}

function stationByKey(stations: StationDiscoveryStation[], key: string): StationDiscoveryStation | null {
  return stations.find((station) => stationKey(station) === String(key)) ?? stations[0] ?? null;
}

export const RoutesAndStations = forwardRef<HTMLDivElement, RoutesAndStationsProps>(function RoutesAndStations({
  label = "Routes and stations",
  description = "Discover stations, compare services, and start route handoff.",
  density = "md",
  tone,
  state,
  disabled = false,
  loading = false,
  error = false,
  permissionBlocked = false,
  offline = false,
  selectedStationKey,
  defaultSelectedStationKey = "centro",
  onSelectedStationChange,
  stationDiscovery,
  stations = defaultStations,
  route,
  services,
  fallbackList,
  className = "",
  ...rest
}, ref) {
  const [internalSelectedStationKey, setInternalSelectedStationKey] = useState(defaultSelectedStationKey);
  const resolvedState = resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, state });
  const resolvedStations = Array.isArray(stations) && stations.length ? stations : defaultStations;
  const resolvedSelectedStationKey = selectedStationKey ?? internalSelectedStationKey;
  const selectedStation = stationByKey(resolvedStations, resolvedSelectedStationKey);
  const isBusy = resolvedState === "loading";
  const isDisabled = disabled || resolvedState === "disabled";

  const handleStationSelect = (key: string, station: StationDiscoveryStation | Record<string, unknown>, event: MouseEvent<HTMLElement>) => {
    stationDiscovery?.onStationSelect?.(key, station, event);
    if (event.defaultPrevented) return;
    if (selectedStationKey === undefined) setInternalSelectedStationKey(key);
    onSelectedStationChange?.(key, station, event);
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
      "data-flow-template": "routes-and-stations",
      "data-template-state": resolvedState,
      "data-density": density,
      "data-selected-station": resolvedSelectedStationKey,
      ...sanitizeRestProps(rest),
    },
    React.createElement(Surface, {
      surfaceRole: "section",
      state: surfaceStateForTemplate(resolvedState),
      density,
      elevation: "raised",
      "data-template-slot": "discovery-region",
      "data-template-module": "routes-and-nearby-stations-mobile",
    },
      React.createElement(StationDiscovery, {
        ...(stationDiscovery ?? {}),
        label: stationDiscovery?.label ?? label,
        description: stationDiscovery?.description ?? description,
        density: stationDiscovery?.density ?? density,
        state: stationDiscovery?.state ?? stationStateForTemplate(resolvedState),
        disabled: isDisabled || stationDiscovery?.disabled,
        loading: isBusy || stationDiscovery?.loading,
        permission: stationDiscovery?.permission ?? (resolvedState === "permission" ? "denied" : "granted"),
        stations: stationDiscovery?.stations ?? resolvedStations,
        selectedStationKey: stationDiscovery?.selectedStationKey ?? resolvedSelectedStationKey,
        route: stationDiscovery?.route ?? route ?? {
          label: `Route to ${selectedStation?.label ?? "station"}`,
          eta: selectedStation?.route ?? "8 min",
          distance: selectedStation?.value ?? "1.2 km",
          actions: [{ key: "start", label: "Start route", icon: "navigation" }],
        },
        fallbackList: stationDiscovery?.fallbackList ?? fallbackList ?? {
          reason: "Map, GPS, and network fallbacks keep station discovery usable.",
          action: "Use station list",
          items: resolvedStations,
        },
        onStationSelect: handleStationSelect,
        "data-template-module": "map-with-station-pins",
      } as StationDiscoveryProps),
    ),
    React.createElement(Surface, {
      surfaceRole: "section",
      state: surfaceStateForTemplate(resolvedState),
      density,
      elevation: "none",
      "data-template-slot": "decision-region",
    },
      React.createElement(Surface, {
        surfaceRole: "panel",
        state: resolvedState === "permission" ? "raised" : surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        tone: resolvedState === "permission" || resolvedState === "offline" ? "warning" : "default",
        "data-template-module": "fallback-station-list",
        "data-module-item-count": String(resolvedStations.length),
      },
        resolvedStations.map((station) => React.createElement("span", {
          key: stationKey(station),
          "data-template-station": stationKey(station),
          "data-selected": String(stationKey(station) === resolvedSelectedStationKey),
        }, `${station.label}: ${station.value ?? ""} ${station.meta ?? ""}`)),
      ),
      React.createElement(Surface, {
        surfaceRole: "panel",
        state: selectedStation ? "selected" : surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        "data-template-module": "station-services-panel",
        "data-selected-station-detail": stationKey(selectedStation),
      },
        services ?? `${selectedStation?.label ?? "Station"} services: ${selectedStation?.meta ?? "service status unavailable"}`,
      ),
      React.createElement(Surface, {
        surfaceRole: "panel",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "none",
        tone: resolvedState === "error" || resolvedState === "offline" ? "warning" : "default",
        "data-template-module": "route-handoff",
      }, `Route handoff preserves ${selectedStation?.label ?? "station"} context and recovery copy.`),
    ),
  );
}) as RoutesAndStationsComponent;

RoutesAndStations.displayName = "RoutesAndStations";
