import React, { forwardRef } from "react";
import { createMapsPrimitive } from "@design-system/components";
import { Button } from "../Button.js";
import { EmptyState } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import { InlineValidation } from "../InlineValidation.js";
import { List } from "../List.js";
import { RouteSummary } from "../RouteSummary.js";
import { Skeleton } from "../Skeleton.js";
import { StationPin } from "../StationPin.js";
import { Surface } from "../Surface.js";
import { Search } from "./Search.js";

const validStates = new Set([
  "nearby",
  "selected",
  "route",
  "denied",
  "offline",
  "error",
  "runtimeUnavailable",
  "providerMissing",
  "loading",
  "empty",
  "disabled",
]);

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeStations(stations) {
  return (Array.isArray(stations) ? stations : [])
    .filter((station) => station?.label)
    .map((station, index) => ({
      id: String(station.id ?? station.key ?? station.value ?? `station-${index + 1}`),
      key: String(station.key ?? station.id ?? station.value ?? `station-${index + 1}`),
      label: station.label,
      value: station.value ?? station.distance ?? "",
      meta: station.meta ?? station.status ?? "",
      route: station.route ?? station.eta ?? "",
      variant: station.variant ?? "fuel",
      state: station.state,
      selected: Boolean(station.selected),
      unavailable: Boolean(station.unavailable),
      coordinates: station.coordinates ?? null,
      icon: station.icon,
    }));
}

function normalizeListItems(listModel) {
  return (Array.isArray(listModel?.items) ? listModel.items : [])
    .filter((item) => item?.label)
    .map((item) => ({
      key: String(item.key ?? item.id ?? item.label),
      label: item.label,
      meta: item.meta,
      value: item.value,
      icon: item.icon ?? "local_gas_station",
      state: item.state,
      disabled: Boolean(item.disabled),
    }));
}

function resolveState({ disabled, loading, error, permissionState, runtimeStatus, stations, selectedStation, route, state }) {
  if (disabled) return "disabled";
  if (loading || state === "loading") return "loading";
  if (error || state === "error") return "error";
  if (state && validStates.has(state)) return state;
  if (permissionState === "denied") return "denied";
  if (runtimeStatus === "runtimeUnavailable") return "runtimeUnavailable";
  if (runtimeStatus === "providerMissing") return "providerMissing";
  if (route) return "route";
  if (selectedStation) return "selected";
  if (!stations.length) return "empty";
  return "nearby";
}

function emptyStateFor(resolvedState, emptyState, maps) {
  if (emptyState?.title) return emptyState;
  if (resolvedState === "denied") {
    return {
      title: "Location is off",
      description: maps.stationListModel.reason ?? "Search manually or choose a station from the list.",
      icon: "location_off",
      action: { key: "search", label: "Search manually" },
      variant: "permission",
      state: "permission",
    };
  }
  if (resolvedState === "providerMissing" || resolvedState === "runtimeUnavailable") {
    return {
      title: "Map is unavailable",
      description: maps.mapLayerModel.summary,
      icon: "map",
      action: { key: "fallback", label: "Use station list" },
      variant: "maintenance",
      state: "default",
    };
  }
  return {
    title: "No stations",
    description: maps.stationListModel.reason ?? "Try a broader search.",
    icon: "local_gas_station",
    action: { key: "refresh", label: "Refresh stations" },
    variant: "search-empty",
    state: "search-empty",
  };
}

export const StationDiscovery = forwardRef(function StationDiscovery({
  label = "Station discovery",
  description = "",
  density,
  state,
  disabled = false,
  loading = false,
  permission = "prompt",
  center = null,
  stations = [],
  selectedStation,
  selectedStationKey,
  route = null,
  fallbackList,
  runtime = null,
  mapStyle = null,
  tileProvider = null,
  query,
  search,
  emptyState,
  error,
  errorPanel,
  action,
  onStationSelect,
  onRouteAction,
  onQueryChange,
  onSubmit,
  onAction,
  className = "",
  ...rest
}, ref) {
  const normalizedStations = normalizeStations(stations);
  const selected = selectedStation
    ? normalizeStations([selectedStation])[0]
    : normalizedStations.find((station) => station.id === selectedStationKey || station.key === selectedStationKey || station.selected) ?? null;
  const mapPrimitive = createMapsPrimitive({
    permission,
    center,
    pins: normalizedStations.map((station) => ({
      ...station,
      selected: selected ? station.id === selected.id || station.key === selected.key : station.selected,
    })),
    selectedStation: selected,
    route,
    fallbackList,
    runtime,
    mapStyle,
    tileProvider,
  });
  const resolvedState = resolveState({
    disabled,
    loading,
    error,
    permissionState: mapPrimitive.permissionState,
    runtimeStatus: mapPrimitive.mapRuntimeModel.status,
    stations: normalizedStations,
    selectedStation: selected,
    route,
    state,
  });
  const isDisabled = resolvedState === "disabled";
  const listItems = normalizeListItems(mapPrimitive.stationListModel);
  const mapSummary = mapPrimitive.mapLayerModel.summary || description;
  const searchResults = search?.results ?? normalizedStations.map((station) => ({
    key: station.key,
    label: station.label,
    meta: station.meta,
    value: station.value,
    icon: station.icon ?? "local_gas_station",
    state: station.unavailable ? "disabled" : station.state,
  }));
  const showRecovery = ["denied", "providerMissing", "runtimeUnavailable", "empty"].includes(resolvedState);
  const recovery = showRecovery ? emptyStateFor(resolvedState, emptyState, mapPrimitive) : null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-pattern": "station-discovery",
      "data-state": resolvedState,
      "data-density": density,
      "data-map-permission": mapPrimitive.permissionState,
      "data-map-runtime": mapPrimitive.mapRuntimeModel.status,
      ...sanitizeRestProps(rest),
    },
    React.createElement(
      Surface,
      {
        surfaceRole: "section",
        state: isDisabled ? "disabled" : selected ? "selected" : resolvedState === "loading" ? "sunken" : "default",
        density,
        "data-flow-slot": "surface",
        "data-station-discovery-surface": "true",
      },
      React.createElement(Search, {
        ...(search ?? {}),
        label: search?.label ?? `${label} search`,
        helper: search?.helper ?? description,
        query: query ?? search?.query,
        results: searchResults,
        selectedKey: selected?.key,
        state: loading ? "loading" : query ? "results" : "idle",
        density,
        disabled: isDisabled || search?.disabled,
        onQueryChange,
        onResultSelect: (key, event) => {
          search?.onResultSelect?.(key, event);
          if (event.defaultPrevented) return;
          const station = normalizedStations.find((item) => item.key === String(key) || item.id === String(key));
          if (station) onStationSelect?.(station.id, station, event);
        },
        onSubmit,
      }),
      resolvedState === "loading"
        ? React.createElement(Skeleton, { label: `${label} loading`, rows: 3, density, "data-station-discovery-loading": "true" })
        : null,
      error || errorPanel?.label
        ? React.createElement(ErrorPanel, {
          label: errorPanel?.label ?? "Station discovery error",
          description: errorPanel?.description ?? String(error?.message ?? error ?? "Try again or use the station list."),
          action: errorPanel?.action,
          density,
          variant: errorPanel?.variant ?? "panel",
          state: errorPanel?.state ?? "error",
          onAction: errorPanel?.onAction,
        })
        : null,
      recovery
        ? React.createElement(EmptyState, {
          ...recovery,
          density,
          onAction: (key, event) => {
            recovery.onAction?.(key, event);
            if (event.defaultPrevented) return;
            onAction?.(key, event);
          },
        })
        : null,
      React.createElement(
        Surface,
        {
          surfaceRole: "panel",
          state: mapPrimitive.mapRuntimeModel.canRender ? "raised" : "sunken",
          density,
          role: "img",
          "aria-label": mapSummary,
          "data-map-primitive": "maps",
          "data-map-layer": "true",
        },
        mapPrimitive.mapLayerModel.pins.map((pin) => React.createElement(StationPin, {
          key: pin.id,
          label: pin.label,
          value: pin.value,
          meta: pin.meta,
          variant: pin.variant,
          selected: pin.selected,
          unavailable: pin.unavailable,
          disabled: isDisabled || pin.state === "disabled",
          density,
          onSelect: (_meta, event) => onStationSelect?.(pin.id, pin, event),
        })),
      ),
      listItems.length
        ? React.createElement(List, {
          label: `${label} fallback list`,
          items: listItems,
          variant: "action",
          state: isDisabled ? "disabled" : "default",
          density,
          selectedKey: selected?.key ?? selected?.id,
          interactive: Boolean(onStationSelect),
          onSelect: (key, event) => {
            const station = normalizedStations.find((item) => item.key === String(key) || item.id === String(key));
            onStationSelect?.(String(key), station ?? { id: String(key), key: String(key) }, event);
          },
        })
        : null,
      mapPrimitive.routeSummary
        ? React.createElement(RouteSummary, {
          label: mapPrimitive.routeSummary.label,
          description: mapPrimitive.routeSummary.description,
          metrics: route?.metrics,
          actions: (route?.actions ?? [{ key: "start", label: "Start route", icon: "navigation" }]).map((routeAction) => ({
            ...routeAction,
            onAction: (key, actionModel, event) => {
              routeAction.onAction?.(key, actionModel, event);
              if (event.defaultPrevented) return;
              onRouteAction?.(key, actionModel, event);
            },
          })),
          density,
          state: resolvedState === "route" ? "selected" : "default",
          selected: resolvedState === "route",
        })
        : null,
      action?.label
        ? React.createElement(Button, {
          ...action,
          label: action.label,
          density: action.density ?? density,
          variant: action.variant ?? "secondary",
          disabled: isDisabled || action.disabled,
          onClick: (event) => {
            action.onClick?.(event);
            if (event.defaultPrevented) return;
            onAction?.(action.key ?? "action", event);
          },
        })
        : null,
      mapSummary
        ? React.createElement(InlineValidation, {
          label: `${label} map summary`,
          message: mapSummary,
          state: mapPrimitive.permissionState === "denied" || !mapPrimitive.mapRuntimeModel.canRender ? "warning" : "info",
          density,
          live: true,
        })
        : null,
    ),
  );
});

StationDiscovery.displayName = "StationDiscovery";
