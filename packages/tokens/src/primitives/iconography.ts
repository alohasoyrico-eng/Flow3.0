import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type IconographyPrimitiveTokenName = Extract<FlowTokenName, "sys-iconography-color-action" | "sys-iconography-color-danger" | "sys-iconography-color-disabled" | "sys-iconography-color-muted" | "sys-iconography-color-navigation" | "sys-iconography-color-status" | "sys-iconography-color-warning" | "sys-iconography-family" | "sys-iconography-focus-offset" | "sys-iconography-focus-ring" | "sys-iconography-size-display-md" | "sys-iconography-size-display-sm" | "sys-iconography-size-lg" | "sys-iconography-size-lg-plus" | "sys-iconography-size-marker" | "sys-iconography-size-md" | "sys-iconography-size-md-plus" | "sys-iconography-size-sm" | "sys-iconography-size-sm-plus" | "sys-iconography-size-station" | "sys-iconography-touch-target-min" | "sys-iconography-variation-filled" | "sys-iconography-variation-filled-strong" | "sys-iconography-variation-outline-strong">;

export const iconographyPrimitive = {
  name: "Iconography",
  slug: "iconography",
  layer: "Primitive",
  runtimeKind: "policy-contract",
  p0RuntimeRequired: false,
  policyPrimitive: true,
  purpose: "Turn the Iconography foundation and Material Symbols library into implementation-ready icon names, sizes, colors, labels, and fallback behavior.",
  governingFoundations: [
  "Iconography",
  "Symbol",
  "Accessibility",
  "State",
  "Energy"
],
  coordinatesPrimitives: [
  "Library Sources",
  "Density",
  "Focus",
  "Disabled"
],
  tokenDependencies: [
  "ref.symbol.*",
  "sys.iconography.*",
  "sys.symbol.*",
  "sys.accessibility.*",
  "sys.state.*",
  "sys.energy.*",
  "library.*",
  "density.*",
  "focus.*",
  "disabled.*",
  "icon.*",
  "Material Symbols Rounded"
],
  roles: [
  {
    "id": "action",
    "token": "icon.action",
    "use": "Action buttons, quick actions, toolbars."
  },
  {
    "id": "navigation",
    "token": "icon.navigation",
    "use": "Topbar, drawers, breadcrumbs, tabs."
  },
  {
    "id": "status",
    "token": "icon.status",
    "use": "Success, warning, error, pending."
  },
  {
    "id": "object",
    "token": "icon.object",
    "use": "Vehicle, card, route, station, driver."
  },
  {
    "id": "decorative",
    "token": "icon.decorative",
    "use": "Hidden support glyphs with aria-hidden."
  }
],
  states: [
  "default",
  "active",
  "filled",
  "disabled",
  "status",
  "missing"
],
  rejectIf: [
  "Emoji or text label stands in for icon.",
  "Icon-only action lacks label.",
  "Icon color is hardcoded.",
  "Filled icon state is used as decoration without semantic state.",
  "Missing icon renders as giant text."
],
  tokenNames: [
  "sys-iconography-color-action",
  "sys-iconography-color-danger",
  "sys-iconography-color-disabled",
  "sys-iconography-color-muted",
  "sys-iconography-color-navigation",
  "sys-iconography-color-status",
  "sys-iconography-color-warning",
  "sys-iconography-family",
  "sys-iconography-focus-offset",
  "sys-iconography-focus-ring",
  "sys-iconography-size-display-md",
  "sys-iconography-size-display-sm",
  "sys-iconography-size-lg",
  "sys-iconography-size-lg-plus",
  "sys-iconography-size-marker",
  "sys-iconography-size-md",
  "sys-iconography-size-md-plus",
  "sys-iconography-size-sm",
  "sys-iconography-size-sm-plus",
  "sys-iconography-size-station",
  "sys-iconography-touch-target-min",
  "sys-iconography-variation-filled",
  "sys-iconography-variation-filled-strong",
  "sys-iconography-variation-outline-strong"
] as const satisfies readonly IconographyPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<IconographyPrimitiveTokenName>(["sys-iconography-color-action","sys-iconography-color-danger","sys-iconography-color-disabled","sys-iconography-color-muted","sys-iconography-color-navigation","sys-iconography-color-status","sys-iconography-color-warning","sys-iconography-family","sys-iconography-focus-offset","sys-iconography-focus-ring","sys-iconography-size-display-md","sys-iconography-size-display-sm","sys-iconography-size-lg","sys-iconography-size-lg-plus","sys-iconography-size-marker","sys-iconography-size-md","sys-iconography-size-md-plus","sys-iconography-size-sm","sys-iconography-size-sm-plus","sys-iconography-size-station","sys-iconography-touch-target-min","sys-iconography-variation-filled","sys-iconography-variation-filled-strong","sys-iconography-variation-outline-strong"]),
} as const;
