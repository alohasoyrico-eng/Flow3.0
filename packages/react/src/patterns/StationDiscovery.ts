import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { createMapsPrimitive } from "@design-system/components";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateProps } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import type { ErrorPanelProps } from "../ErrorPanel.js";
import { InlineValidation } from "../InlineValidation.js";
import { List } from "../List.js";
import type { ListItem, ListState } from "../List.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { RouteSummary } from "../RouteSummary.js";
import type { RouteMetric, RouteSummaryAction } from "../RouteSummary.js";
import { Search } from "./Search.js";
import type { SearchProps, SearchResult } from "./Search.js";
import { Skeleton } from "../Skeleton.js";
import { StationPin } from "../StationPin.js";
import type { StationPinState, StationPinVariant } from "../StationPin.js";
import { Surface } from "../Surface.js";

export type StationDiscoveryState =
  | "nearby"
  | "selected"
  | "route"
  | "denied"
  | "offline"
  | "error"
  | "runtimeUnavailable"
  | "providerMissing"
  | "loading"
  | "empty"
  | "disabled";

export type StationDiscoveryDensity = "sm" | "md" | "lg";
export type StationDiscoveryPermission = "granted" | "denied" | "prompt" | "unavailable";

export interface StationDiscoveryStation {
  id?: string;
  key?: string;
  label: string;
  value?: string;
  distance?: string;
  meta?: string;
  status?: string;
  route?: string;
  eta?: string;
  variant?: "fuel" | "ev" | "service" | "cluster";
  state?: "default" | "hover" | "focus" | "selected" | "unavailable" | "disabled";
  selected?: boolean;
  unavailable?: boolean;
  coordinates?: unknown;
  icon?: string;
}

export interface StationDiscoveryRoute {
  label?: string;
  eta?: string;
  distance?: string;
  metrics?: RouteMetric[];
  actions?: RouteSummaryAction[];
}

export interface StationDiscoveryFallbackList {
  reason?: string;
  action?: string;
  items?: Array<{
    id?: string;
    key?: string;
    label: string;
    meta?: string;
    value?: string;
    icon?: string;
    state?: string;
    disabled?: boolean;
  }>;
}

export interface StationDiscoveryProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: StationDiscoveryDensity;
  state?: StationDiscoveryState;
  disabled?: boolean;
  loading?: boolean;
  permission?: StationDiscoveryPermission;
  center?: unknown;
  stations?: StationDiscoveryStation[];
  selectedStation?: StationDiscoveryStation;
  selectedStationKey?: string;
  route?: StationDiscoveryRoute | null;
  fallbackList?: StationDiscoveryFallbackList;
  runtime?: unknown;
  mapStyle?: unknown;
  tileProvider?: { id?: string; name?: string; label?: string; attribution?: string };
  query?: string;
  search?: Partial<SearchProps> & { results?: SearchResult[] };
  emptyState?: Partial<EmptyStateProps>;
  error?: Error | string;
  errorPanel?: Partial<ErrorPanelProps>;
  action?: ButtonProps & { key?: string };
  className?: string;
  onStationSelect?: (key: string, station: StationDiscoveryStation | Record<string, unknown>, event: MouseEvent<HTMLElement>) => void;
  onRouteAction?: (key: string, action: RouteSummaryAction, event: MouseEvent<HTMLButtonElement>) => void;
  onQueryChange?: SearchProps["onQueryChange"];
  onSubmit?: (value: string, event: MouseEvent<HTMLButtonElement>) => void;
  onAction?: (key: string, event: MouseEvent<HTMLElement>) => void;
}

export interface StationDiscoveryComponent extends ForwardRefExoticComponent<StationDiscoveryProps & RefAttributes<HTMLDivElement>> {
  displayName: "StationDiscovery";
}

type StationDiscoveryRestProps = Record<string, unknown>;
type MapsPrimitiveOptions = NonNullable<Parameters<typeof createMapsPrimitive>[0]>;
type MapsFallbackList = NonNullable<MapsPrimitiveOptions["fallbackList"]>;
type MapsPinInput = NonNullable<MapsPrimitiveOptions["pins"]>[number];
type MapsPinModel = ReturnType<typeof createMapsPrimitive>["mapLayerModel"]["pins"][number];
type NormalizedStation = {
  id: string;
  key: string;
  label: string;
  value: string;
  meta: string;
  route: string;
  variant: StationPinVariant;
  state?: StationPinState | undefined;
  selected: boolean;
  unavailable: boolean;
  coordinates: unknown;
  icon?: string | undefined;
};

interface StationDiscoveryStateInput {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  error?: Error | string | undefined;
  permissionState?: string | undefined;
  runtimeStatus?: string | undefined;
  stations: NormalizedStation[];
  selectedStation?: NormalizedStation | null | undefined;
  route?: StationDiscoveryRoute | null | undefined;
  state?: StationDiscoveryState | undefined;
}

const validStates = new Set<StationDiscoveryState>([
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

const validStationStates = new Set<StationPinState>(["default", "hover", "focus", "selected", "unavailable", "disabled"]);
const validStationVariants = new Set<StationPinVariant>(["fuel", "ev", "service", "cluster"]);
const validListStates = new Set<ListState>(["default", "hover", "selected", "loading", "error", "disabled"]);

function sanitizeRestProps(rest: StationDiscoveryRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function toStationVariant(variant: string | null | undefined): StationPinVariant {
  return validStationVariants.has(variant as StationPinVariant) ? variant as StationPinVariant : "fuel";
}

function toStationState(state: string | null | undefined): StationPinState | undefined {
  return validStationStates.has(state as StationPinState) ? state as StationPinState : undefined;
}

function toListState(state: string | null | undefined): ListState | undefined {
  return validListStates.has(state as ListState) ? state as ListState : undefined;
}

function normalizeStations(stations: StationDiscoveryStation[] | null | undefined): NormalizedStation[] {
  return (Array.isArray(stations) ? stations : [])
    .filter((station): station is StationDiscoveryStation => Boolean(station?.label))
    .map((station, index) => {
      const normalized: NormalizedStation = {
        id: String(station.id ?? station.key ?? station.value ?? `station-${index + 1}`),
        key: String(station.key ?? station.id ?? station.value ?? `station-${index + 1}`),
        label: station.label,
        value: station.value ?? station.distance ?? "",
        meta: station.meta ?? station.status ?? "",
        route: station.route ?? station.eta ?? "",
        variant: station.variant ?? "fuel",
        selected: Boolean(station.selected),
        unavailable: Boolean(station.unavailable),
        coordinates: station.coordinates ?? null,
      };
      if (station.state) normalized.state = station.state;
      if (station.icon) normalized.icon = station.icon;
      return normalized;
    });
}

function normalizeFallbackList(fallbackList: StationDiscoveryFallbackList | null | undefined): MapsFallbackList | undefined {
  if (!fallbackList) return undefined;
  return {
    reason: fallbackList.reason ?? "",
    action: fallbackList.action ?? "",
    items: (Array.isArray(fallbackList.items) ? fallbackList.items : [])
      .filter((item) => Boolean(item?.label))
      .map((item) => ({
        id: String(item.id ?? item.key ?? item.label),
        label: item.label,
        meta: item.meta ?? "",
        value: item.value ?? "",
      })),
  };
}

function normalizeListItems(listModel: { items?: StationDiscoveryFallbackList["items"] } | null | undefined): ListItem[] {
  return (Array.isArray(listModel?.items) ? listModel.items : [])
    .filter((item) => Boolean(item?.label))
    .map((item) => {
      const normalized: ListItem = {
        key: String(item.key ?? item.id ?? item.label),
        label: item.label,
        icon: item.icon ?? "local_gas_station",
        disabled: Boolean(item.disabled),
      };
      const state = toListState(item.state);
      if (item.meta) normalized.meta = item.meta;
      if (item.value) normalized.value = item.value;
      if (state) normalized.state = state;
      return normalized;
    });
}

function toMapPinInput(station: NormalizedStation, selected: NormalizedStation | null): MapsPinInput {
  const pin: MapsPinInput = {
    id: station.id,
    label: station.label,
    value: station.value,
    meta: station.meta,
    route: station.route,
    variant: station.variant,
    selected: selected ? station.id === selected.id || station.key === selected.key : station.selected,
    unavailable: station.unavailable,
    coordinates: station.coordinates,
  };
  if (station.state) pin.state = station.state;
  return pin;
}

function toSearchResult(station: NormalizedStation): SearchResult {
  const result: SearchResult = {
    key: station.key,
    label: station.label,
    meta: station.meta,
    value: station.value,
    icon: station.icon ?? "local_gas_station",
  };
  const state = toListState(station.unavailable ? "disabled" : station.state);
  if (state) result.state = state;
  return result;
}

function resolveState({
  disabled,
  loading,
  error,
  permissionState,
  runtimeStatus,
  stations,
  selectedStation,
  route,
  state,
}: StationDiscoveryStateInput): StationDiscoveryState {
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

function emptyStateFor(
  resolvedState: StationDiscoveryState,
  emptyState: Partial<EmptyStateProps> | undefined,
  maps: ReturnType<typeof createMapsPrimitive>,
): Partial<EmptyStateProps> & Pick<EmptyStateProps, "title"> {
  if (emptyState?.title) return emptyState as Partial<EmptyStateProps> & Pick<EmptyStateProps, "title">;
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

export const StationDiscovery = forwardRef<HTMLDivElement, StationDiscoveryProps>(function StationDiscovery({
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
    ? normalizeStations([selectedStation])[0] ?? null
    : normalizedStations.find((station) => station.id === selectedStationKey || station.key === selectedStationKey || station.selected) ?? null;
  const mapOptions: MapsPrimitiveOptions = {
    permission,
    center,
    pins: normalizedStations.map((station) => toMapPinInput(station, selected)),
    selectedStation: selected ? toMapPinInput(selected, selected) : null,
    route,
    runtime: runtime && typeof runtime === "object" ? runtime as NonNullable<MapsPrimitiveOptions["runtime"]> : null,
    mapStyle,
    tileProvider,
  };
  const normalizedFallbackList = normalizeFallbackList(fallbackList);
  if (normalizedFallbackList) mapOptions.fallbackList = normalizedFallbackList;
  const mapPrimitive = createMapsPrimitive(mapOptions);
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
  const searchResults: SearchResult[] = search?.results ?? normalizedStations.map(toSearchResult);
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
      } as ComponentProps<typeof Surface>,
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
        onQueryChange: (value, meta, event) => {
          onQueryChange?.(value, meta, event);
        },
        onResultSelect: (key, event) => {
          search?.onResultSelect?.(key, event);
          if (event.defaultPrevented) return;
          const station = normalizedStations.find((item) => item.key === String(key) || item.id === String(key));
          if (station) onStationSelect?.(station.id, station, event);
        },
        onSubmit,
      } as ComponentProps<typeof Search>),
      resolvedState === "loading"
        ? React.createElement(Skeleton, {
          label: `${label} loading`,
          rows: 3,
          density,
          "data-station-discovery-loading": "true",
        } as ComponentProps<typeof Skeleton>)
        : null,
      error || errorPanel?.label
        ? React.createElement(ErrorPanel, {
          label: errorPanel?.label ?? "Station discovery error",
          description: errorPanel?.description ?? String(error instanceof Error ? error.message : error ?? "Try again or use the station list."),
          action: errorPanel?.action,
          density,
          variant: errorPanel?.variant ?? "panel",
          state: errorPanel?.state ?? "error",
          onAction: errorPanel?.onAction,
        } as ComponentProps<typeof ErrorPanel>)
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
        } as ComponentProps<typeof EmptyState>)
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
        } as ComponentProps<typeof Surface>,
        mapPrimitive.mapLayerModel.pins.map((pin: MapsPinModel) => React.createElement(StationPin, {
          key: pin.id,
          label: pin.label,
          value: pin.value,
          meta: pin.meta,
          variant: toStationVariant(pin.variant),
          selected: pin.selected,
          unavailable: pin.unavailable,
          disabled: isDisabled || pin.state === "disabled",
          density,
          onSelect: (_meta, event) => onStationSelect?.(pin.id, pin, event),
        } as ComponentProps<typeof StationPin>)),
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
        } as ComponentProps<typeof List>)
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
        } as ComponentProps<typeof RouteSummary>)
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
        } as ComponentProps<typeof Button>)
        : null,
      mapSummary
        ? React.createElement(InlineValidation, {
          label: `${label} map summary`,
          message: mapSummary,
          state: mapPrimitive.permissionState === "denied" || !mapPrimitive.mapRuntimeModel.canRender ? "warning" : "info",
          density,
          live: true,
        } as ComponentProps<typeof InlineValidation>)
        : null,
    ),
  );
}) as StationDiscoveryComponent;

StationDiscovery.displayName = "StationDiscovery";
