const validPermissionStates = new Set<string>(["granted", "denied", "prompt", "unavailable"]);
const validPinStates = new Set<string>(["default", "hover", "focus", "selected", "unavailable", "disabled"]);
const mapRuntimeName = "maplibre-gl";

type MapRuntime = {
  version?: string;
};

type MapPinInput = {
  id?: string;
  label?: string;
  name?: string;
  value?: string;
  distance?: string;
  meta?: string;
  status?: string;
  route?: string;
  eta?: string;
  variant?: string;
  state?: string;
  selected?: boolean;
  unavailable?: boolean;
  coordinates?: unknown;
};

type MapPinModel = {
  id: string;
  label: string;
  value: string;
  meta: string;
  route: string;
  variant: string;
  state: string;
  selected: boolean;
  unavailable: boolean;
  coordinates: unknown;
  accessibleLabel: string;
};

type MapRouteInput = {
  label?: string;
  eta?: string;
  distance?: string;
};

type MapTileProviderInput = {
  id?: string;
  name?: string;
  label?: string;
  attribution?: string;
};

type MapFallbackListModel = {
  reason: string;
  action: string;
  items: Array<{ id: string; label: string; meta: string; value: string }>;
};

type MapsPrimitiveOptions = {
  permission?: string;
  center?: unknown;
  pins?: MapPinInput[];
  selectedStation?: MapPinInput | null;
  route?: MapRouteInput | null;
  fallbackList?: MapFallbackListModel;
  runtime?: MapRuntime | null;
  mapStyle?: unknown;
  tileProvider?: MapTileProviderInput | null;
};

function normalizePermission(permission = "prompt"): string {
  return validPermissionStates.has(permission) ? permission : "prompt";
}

function resolveMapRuntime(runtime?: MapRuntime | null): MapRuntime | null {
  if (runtime) return runtime;
  if (typeof globalThis === "undefined") return null;
  return (globalThis as typeof globalThis & { maplibregl?: MapRuntime }).maplibregl ?? null;
}

function normalizePin(pin: MapPinInput = {}, index = 0): MapPinModel {
  const rawState = typeof pin.state === "string" ? pin.state : "";
  const state = pin.unavailable ? "unavailable" : pin.selected ? "selected" : validPinStates.has(rawState) ? rawState : "default";
  const label = pin.label ?? pin.name ?? "";
  const value = pin.value ?? pin.distance ?? "";
  const meta = pin.meta ?? pin.status ?? "";
  const route = pin.route ?? pin.eta ?? "";
  return {
    id: pin.id ?? `station-${index + 1}`,
    label,
    value,
    meta,
    route,
    variant: pin.variant ?? "fuel",
    state,
    selected: state === "selected",
    unavailable: state === "unavailable",
    coordinates: pin.coordinates ?? null,
    accessibleLabel: [label, value, meta, route].filter(Boolean).join(" "),
  };
}

function createFallbackList(pins: MapPinModel[] = [], permissionState = "prompt"): MapFallbackListModel {
  if (permissionState === "denied") {
    return {
      reason: "Location permission denied",
      action: "Search manually",
      items: pins.map((pin) => ({ id: pin.id, label: pin.label, meta: pin.meta, value: pin.value })),
    };
  }
  if (!pins.length) {
    return {
      reason: "No stations in view",
      action: "Adjust search",
      items: [],
    };
  }
  return {
    reason: "Map list equivalent",
    action: "Choose station",
    items: pins.map((pin) => ({ id: pin.id, label: pin.label, meta: pin.meta, value: pin.value })),
  };
}

function createRouteSummary(route: MapRouteInput | null = null, selectedStation: MapPinModel | null = null) {
  if (!route && !selectedStation) return null;
  const label = route?.label ?? selectedStation?.label ?? "Route";
  const eta = route?.eta ?? selectedStation?.route ?? "";
  const distance = route?.distance ?? selectedStation?.value ?? "";
  return {
    label,
    description: [eta, distance].filter(Boolean).join(" - "),
    text: [label, eta, distance].filter(Boolean).join(". "),
  };
}

function createMapRuntimeModel({
  runtime,
  mapStyle = null,
  tileProvider = null,
}: Pick<MapsPrimitiveOptions, "runtime" | "mapStyle" | "tileProvider"> = {}) {
  const resolvedRuntime = resolveMapRuntime(runtime);
  const hasProvider = Boolean(mapStyle || tileProvider);
  const status = !resolvedRuntime ? "runtimeUnavailable" : hasProvider ? "ready" : "providerMissing";
  return {
    engine: mapRuntimeName,
    version: resolvedRuntime?.version ?? null,
    status,
    canRender: Boolean(resolvedRuntime && hasProvider),
    requiresFallback: true,
    provider: tileProvider
      ? {
          id: tileProvider.id ?? tileProvider.name ?? "map-provider",
          label: tileProvider.label ?? tileProvider.name ?? "Map provider",
          attribution: tileProvider.attribution ?? "",
        }
      : null,
    style: mapStyle
      ? {
          type: typeof mapStyle === "string" ? "url" : "object",
          value: mapStyle,
        }
      : null,
  };
}

export function createMapsPrimitive({
  permission = "prompt",
  center = null,
  pins = [],
  selectedStation = null,
  route = null,
  fallbackList,
  runtime = null,
  mapStyle = null,
  tileProvider = null,
}: MapsPrimitiveOptions = {}) {
  const permissionState = normalizePermission(permission);
  const stationPins = pins.map(normalizePin);
  const selected = selectedStation
    ? normalizePin(selectedStation, stationPins.length)
    : stationPins.find((pin) => pin.selected) ?? null;
  const routeSummary = createRouteSummary(route, selected);
  const stationListModel = fallbackList ?? createFallbackList(stationPins, permissionState);
  const mapRuntimeModel = createMapRuntimeModel({ runtime, mapStyle, tileProvider });
  const mapLayerModel = {
    permission: permissionState,
    center,
    pins: stationPins,
    selectedStation: selected,
    route,
    runtime: mapRuntimeModel,
    summary: [
      permissionState === "denied" ? "Location permission denied." : "",
      mapRuntimeModel.status === "runtimeUnavailable" ? "Map runtime unavailable." : "",
      mapRuntimeModel.status === "providerMissing" ? "Map provider missing; fallback list required." : "",
      stationPins.length ? `${stationPins.length} stations available.` : stationListModel.reason,
      routeSummary?.text ?? "",
    ]
      .filter(Boolean)
      .join(" "),
  };

  return {
    mapLayerModel,
    stationListModel,
    routeSummary,
    permissionState,
    mapRuntimeModel,
  };
}
