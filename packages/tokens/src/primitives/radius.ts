import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type RadiusPrimitiveTokenName = Extract<FlowTokenName, "sys-radius-0" | "sys-radius-container" | "sys-radius-control" | "sys-radius-full" | "sys-radius-lg" | "sys-radius-md" | "sys-radius-pill" | "sys-radius-sm" | "sys-radius-surface" | "sys-radius-xl" | "sys-radius-xs">;

export const radiusPrimitive = {
  name: "Radius",
  slug: "radius",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Frame shape roles into implementation-ready primitives for controls, cards, sheets, pills, map pins, table rows, and permission panels.",
  governingFoundations: [
  "Frame",
  "Depth",
  "State"
],
  coordinatesPrimitives: [
  "Focus",
  "Density",
  "Spacing"
],
  tokenDependencies: [
  "ref.frame.radius.*",
  "sys.frame.radius.*",
  "focus.*",
  "density.*",
  "spacing.*",
  "radius.*"
],
  roles: [
  {
    "id": "control",
    "token": "radius.control",
    "use": "Buttons, fields, selects, chips, compact actions."
  },
  {
    "id": "container",
    "token": "radius.container",
    "use": "Cards, panels, popovers, dashboard modules."
  },
  {
    "id": "surface",
    "token": "radius.surface",
    "use": "Sheets, dialogs, large product surfaces."
  },
  {
    "id": "pill",
    "token": "radius.full",
    "use": "Badges, filter chips, status tags."
  }
],
  states: [
  "default",
  "focus",
  "selected",
  "disabled"
],
  rejectIf: [
  "Raw border-radius appears outside tokens.",
  "Shape suggests interactivity when the element is static.",
  "Pill shape is used for large content panels."
],
  tokenNames: [
  "sys-radius-0",
  "sys-radius-container",
  "sys-radius-control",
  "sys-radius-full",
  "sys-radius-lg",
  "sys-radius-md",
  "sys-radius-pill",
  "sys-radius-sm",
  "sys-radius-surface",
  "sys-radius-xl",
  "sys-radius-xs"
] as const satisfies readonly RadiusPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<RadiusPrimitiveTokenName>(["sys-radius-0","sys-radius-container","sys-radius-control","sys-radius-full","sys-radius-lg","sys-radius-md","sys-radius-pill","sys-radius-sm","sys-radius-surface","sys-radius-xl","sys-radius-xs"]),
} as const;
