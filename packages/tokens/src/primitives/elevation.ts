import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type ElevationPrimitiveTokenName = Extract<FlowTokenName, "sys-elevation-0" | "sys-elevation-1" | "sys-elevation-2" | "sys-elevation-3" | "sys-elevation-4" | "sys-elevation-card" | "sys-elevation-card-hover" | "sys-elevation-control" | "sys-elevation-floating" | "sys-elevation-modal" | "sys-elevation-popover" | "sys-elevation-sheet" | "sys-elevation-toast">;

export const elevationPrimitive = {
  name: "Elevation",
  slug: "elevation",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Depth foundation roles into implementation-ready elevation, overlay, and stacking primitives.",
  governingFoundations: [
  "Depth",
  "Frame",
  "State",
  "Accessibility"
],
  coordinatesPrimitives: [
  "Focus",
  "Radius",
  "Motion Curves"
],
  tokenDependencies: [
  "ref.depth.*",
  "sys.depth.*",
  "focus.*",
  "radius.*",
  "motionCurve.*",
  "elevation.*"
],
  roles: [
  {
    "id": "level0",
    "token": "elevation.0",
    "use": "Canvas and sunken areas."
  },
  {
    "id": "level1",
    "token": "elevation.1",
    "use": "Cards and low raised surfaces."
  },
  {
    "id": "level2",
    "token": "elevation.2",
    "use": "Floating controls and contextual panels."
  },
  {
    "id": "level3",
    "token": "elevation.3",
    "use": "Overlays, sheets, dialogs."
  },
  {
    "id": "level4",
    "token": "elevation.4",
    "use": "Critical blocking feedback."
  }
],
  states: [
  "rest",
  "hover",
  "floating",
  "overlay",
  "modal"
],
  rejectIf: [
  "Hardcoded z-index or shadow.",
  "Modal lacks focus trap or escape.",
  "Elevation used as decoration only."
],
  tokenNames: [
  "sys-elevation-0",
  "sys-elevation-1",
  "sys-elevation-2",
  "sys-elevation-3",
  "sys-elevation-4",
  "sys-elevation-card",
  "sys-elevation-card-hover",
  "sys-elevation-control",
  "sys-elevation-floating",
  "sys-elevation-modal",
  "sys-elevation-popover",
  "sys-elevation-sheet",
  "sys-elevation-toast"
] as const satisfies readonly ElevationPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<ElevationPrimitiveTokenName>(["sys-elevation-0","sys-elevation-1","sys-elevation-2","sys-elevation-3","sys-elevation-4","sys-elevation-card","sys-elevation-card-hover","sys-elevation-control","sys-elevation-floating","sys-elevation-modal","sys-elevation-popover","sys-elevation-sheet","sys-elevation-toast"]),
} as const;
