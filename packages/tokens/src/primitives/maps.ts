import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type MapsPrimitiveTokenName = Extract<FlowTokenName, "sys-map-depth-pin" | "sys-map-depth-selected" | "sys-map-fallback-surface" | "sys-map-fallback-text-color" | "sys-map-focus-ring" | "sys-map-permission-denied-color" | "sys-map-permission-granted-color" | "sys-map-permission-prompt-color" | "sys-map-pin-action-color" | "sys-map-pin-background" | "sys-map-pin-border" | "sys-map-pin-cluster-background" | "sys-map-pin-cluster-foreground" | "sys-map-pin-foreground" | "sys-map-pin-selected-background" | "sys-map-pin-selected-foreground" | "sys-map-route-line-color" | "sys-map-route-line-muted-color">;

export const mapsPrimitive = {
  name: "Maps",
  slug: "maps",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn map product rules into implementation-ready primitives for geolocation, permission, station pins, clusters, route lines, selected states, fallback lists, and errors.",
  governingFoundations: [
  "Energy",
  "Accessibility",
  "Frame",
  "Voice",
  "Momentum",
  "Depth",
  "State"
],
  coordinatesPrimitives: [
  "Library Sources",
  "Measurement",
  "Message",
  "Iconography",
  "Breakpoints",
  "Loading"
],
  tokenDependencies: [
  "map.*",
  "library.*",
  "sys.energy.*",
  "sys.frame.*",
  "sys.voice.*",
  "sys.momentum.*",
  "sys.depth.*",
  "sys.accessibility.*"
],
  roles: [
  {
    "id": "permission",
    "token": "map.permission.*",
    "use": "Granted, denied, prompt, unavailable states."
  },
  {
    "id": "stationPin",
    "token": "map.pin.station",
    "use": "Station marker with status and selection."
  },
  {
    "id": "routeLine",
    "token": "map.route.line",
    "use": "Route preview and alternatives."
  },
  {
    "id": "cluster",
    "token": "map.cluster",
    "use": "Dense station groups."
  },
  {
    "id": "fallbackList",
    "token": "map.fallback.list",
    "use": "Non-map access to same station/route information."
  },
  {
    "id": "runtime",
    "token": "map.runtime.*",
    "use": "Open map engine, provider readiness, and non-map fallback state."
  }
],
  states: [
  "nearby",
  "selected",
  "route",
  "denied",
  "offline",
  "error",
  "runtimeUnavailable",
  "providerMissing"
],
  rejectIf: [
  "Map has no fallback list.",
  "Permission denied blocks task completion.",
  "Pin meaning exists only visually.",
  "Route summary lacks text equivalent.",
  "A component imports or initializes the map runtime directly."
],
  tokenNames: [
  "sys-map-depth-pin",
  "sys-map-depth-selected",
  "sys-map-fallback-surface",
  "sys-map-fallback-text-color",
  "sys-map-focus-ring",
  "sys-map-permission-denied-color",
  "sys-map-permission-granted-color",
  "sys-map-permission-prompt-color",
  "sys-map-pin-action-color",
  "sys-map-pin-background",
  "sys-map-pin-border",
  "sys-map-pin-cluster-background",
  "sys-map-pin-cluster-foreground",
  "sys-map-pin-foreground",
  "sys-map-pin-selected-background",
  "sys-map-pin-selected-foreground",
  "sys-map-route-line-color",
  "sys-map-route-line-muted-color"
] as const satisfies readonly MapsPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<MapsPrimitiveTokenName>(["sys-map-depth-pin","sys-map-depth-selected","sys-map-fallback-surface","sys-map-fallback-text-color","sys-map-focus-ring","sys-map-permission-denied-color","sys-map-permission-granted-color","sys-map-permission-prompt-color","sys-map-pin-action-color","sys-map-pin-background","sys-map-pin-border","sys-map-pin-cluster-background","sys-map-pin-cluster-foreground","sys-map-pin-foreground","sys-map-pin-selected-background","sys-map-pin-selected-foreground","sys-map-route-line-color","sys-map-route-line-muted-color"]),
} as const;
