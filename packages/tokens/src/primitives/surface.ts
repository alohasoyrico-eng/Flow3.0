import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type SurfacePrimitiveTokenName = Extract<FlowTokenName, "density-surface-padding" | "sys-a11y-contrast-surface" | "sys-accessibility-contrast-surface" | "sys-color-surface" | "sys-color-surface-muted" | "sys-color-surface-raised" | "sys-density-surface-padding" | "sys-disabled-surface-opacity" | "sys-energy-surface-accent" | "sys-energy-surface-primary" | "sys-energy-surface-secondary" | "sys-energy-surface-sunken" | "sys-energy-surface-tertiary" | "sys-frame-doc-surface-max-inline" | "sys-frame-padding-surface" | "sys-frame-radius-surface" | "sys-loading-skeleton-surface" | "sys-map-fallback-surface" | "sys-radius-surface">;

export const surfacePrimitive = {
  name: "Surface",
  slug: "surface",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Frame, Depth, Energy, State, and Accessibility foundation roles into implementation-ready ownership for structural backgrounds, panels, sheets, overlays, sections, and grouped content without misusing Card as layout.",
  governingFoundations: [
  "Frame",
  "Depth",
  "Energy",
  "State",
  "Accessibility"
],
  coordinatesPrimitives: [
  "Color",
  "Spacing",
  "Radius",
  "Elevation",
  "Density",
  "Focus",
  "Breakpoints",
  "Disabled"
],
  tokenDependencies: [
  "sys.energy.surface.*",
  "sys.color.surface*",
  "sys.frame.padding.surface",
  "sys.frame.radius.surface",
  "sys.radius.surface",
  "sys.depth.*",
  "sys.density.surface.*",
  "sys.accessibility.contrast.surface",
  "surface.*"
],
  roles: [
  {
    "id": "canvas",
    "token": "surface.canvas",
    "use": "Base page or app background that receives sections, navigation, and overlays."
  },
  {
    "id": "section",
    "token": "surface.section",
    "use": "Semantic grouping that owns spacing and background without becoming an object card."
  },
  {
    "id": "panel",
    "token": "surface.panel",
    "use": "Bounded work area, settings group, inspector, or temporary content region."
  },
  {
    "id": "overlay",
    "token": "surface.overlay",
    "use": "Temporary focused layer such as dialog body, drawer body, sheet body, or popover body."
  },
  {
    "id": "inline",
    "token": "surface.inline",
    "use": "Local grouped surface inside a field, toolbar, row, or compact control cluster."
  }
],
  states: [
  "default",
  "raised",
  "sunken",
  "overlay",
  "selected",
  "dragging",
  "disabled",
  "focused"
],
  rejectIf: [
  "Card is used as a generic layout container.",
  "Pattern CSS invents background, radius, shadow, padding, or z-index outside Surface tokens.",
  "Nested decorative cards are used to create hierarchy.",
  "A structural surface owns no density, focus, or accessibility boundary."
],
  tokenNames: [
  "density-surface-padding",
  "sys-a11y-contrast-surface",
  "sys-accessibility-contrast-surface",
  "sys-color-surface",
  "sys-color-surface-muted",
  "sys-color-surface-raised",
  "sys-density-surface-padding",
  "sys-disabled-surface-opacity",
  "sys-energy-surface-accent",
  "sys-energy-surface-primary",
  "sys-energy-surface-secondary",
  "sys-energy-surface-sunken",
  "sys-energy-surface-tertiary",
  "sys-frame-doc-surface-max-inline",
  "sys-frame-padding-surface",
  "sys-frame-radius-surface",
  "sys-loading-skeleton-surface",
  "sys-map-fallback-surface",
  "sys-radius-surface"
] as const satisfies readonly SurfacePrimitiveTokenName[],
  token: createPrimitiveTokenResolver<SurfacePrimitiveTokenName>(["density-surface-padding","sys-a11y-contrast-surface","sys-accessibility-contrast-surface","sys-color-surface","sys-color-surface-muted","sys-color-surface-raised","sys-density-surface-padding","sys-disabled-surface-opacity","sys-energy-surface-accent","sys-energy-surface-primary","sys-energy-surface-secondary","sys-energy-surface-sunken","sys-energy-surface-tertiary","sys-frame-doc-surface-max-inline","sys-frame-padding-surface","sys-frame-radius-surface","sys-loading-skeleton-surface","sys-map-fallback-surface","sys-radius-surface"]),
} as const;
