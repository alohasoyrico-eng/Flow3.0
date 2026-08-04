const validPermissionStates = new Set(["granted", "denied", "prompt", "unavailable"]);
const validPinStates = new Set(["default", "hover", "focus", "selected", "unavailable", "disabled"]);
const mapRuntimeName = "maplibre-gl";

function normalizePermission(permission = "prompt") {
  return validPermissionStates.has(permission) ? permission : "prompt";
}

function resolveMapRuntime(runtime) {
  if (runtime) return runtime;
  if (typeof globalThis === "undefined") return null;
  return globalThis.maplibregl ?? null;
}

function normalizePin(pin = {}, index = 0) {
  const state = pin.unavailable ? "unavailable" : pin.selected ? "selected" : validPinStates.has(pin.state) ? pin.state : "default";
  const label = pin.label ?? pin.name ?? `Station ${index + 1}`;
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

function createFallbackList(pins = [], permissionState = "prompt") {
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

function createRouteSummary(route = null, selectedStation = null) {
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

function createMapRuntimeModel({ runtime, mapStyle = null, tileProvider = null } = {}) {
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
} = {}) {
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
