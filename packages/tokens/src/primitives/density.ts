import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type DensityPrimitiveTokenName = Extract<FlowTokenName, "density-card-padding" | "density-component-gap" | "density-component-gap-lg" | "density-control-height" | "density-control-padding-x" | "density-control-padding-y" | "density-doc-body-line-height" | "density-doc-body-size" | "density-doc-card-body-size" | "density-doc-card-min-block" | "density-doc-card-title-size" | "density-doc-example-min-block" | "density-doc-heading-line-height" | "density-doc-heading-size" | "density-doc-label-size" | "density-doc-subheading-size" | "density-page-gap" | "density-panel-padding" | "density-row-height" | "density-section-gap" | "density-subsection-gap" | "density-surface-padding" | "sys-density-card-padding" | "sys-density-component-gap" | "sys-density-component-gap-lg" | "sys-density-control-height" | "sys-density-control-padding-x" | "sys-density-control-padding-y" | "sys-density-doc-body-line-height" | "sys-density-doc-body-size" | "sys-density-doc-card-body-size" | "sys-density-doc-card-min-block" | "sys-density-doc-card-title-size" | "sys-density-doc-example-min-block" | "sys-density-doc-heading-line-height" | "sys-density-doc-heading-size" | "sys-density-doc-label-size" | "sys-density-doc-subheading-size" | "sys-density-page-gap" | "sys-density-panel-padding" | "sys-density-row-height" | "sys-density-section-gap" | "sys-density-subsection-gap" | "sys-density-surface-padding">;

export const densityPrimitive = {
  name: "Density",
  slug: "density",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Declare surface-level scale and coordinate spacing, typography, iconography, focus, loading, disabled, and breakpoint behavior before components render.",
  governingFoundations: [
  "Frame",
  "Accessibility",
  "Voice"
],
  coordinatesPrimitives: [
  "Spacing",
  "Typography",
  "Iconography",
  "Focus",
  "Loading",
  "Disabled",
  "Breakpoints",
  "Radius"
],
  tokenDependencies: [
  "sys.frame.*",
  "sys.voice.*",
  "sys.accessibility.*",
  "spacing.*",
  "typography.*",
  "icon.*",
  "focus.*",
  "loading.*",
  "disabled.*",
  "breakpoint.*",
  "radius.*",
  "density.sm/md/lg"
],
  roles: [
  {
    "id": "sm",
    "token": "density.sm",
    "use": "Dense operations and data tables with efficient rhythm, readable type, clear grouping, and protected targets."
  },
  {
    "id": "md",
    "token": "density.md",
    "use": "Standard product rhythm."
  },
  {
    "id": "lg",
    "token": "density.lg",
    "use": "Touch-heavy mobile, high-focus review, TV-like dashboards, and distance-friendly reading."
  }
],
  states: [
  "sm",
  "md",
  "lg"
],
  rejectIf: [
  "Component invents local density.",
  "Component exposes public size as an independent scale decision.",
  "Compact mode breaks focus or touch target.",
  "SM density reduces type below readable system roles.",
  "Density changes only spacing but not type, icon, focus, loading, disabled, breakpoint, and control rhythm."
],
  tokenNames: [
  "density-card-padding",
  "density-component-gap",
  "density-component-gap-lg",
  "density-control-height",
  "density-control-padding-x",
  "density-control-padding-y",
  "density-doc-body-line-height",
  "density-doc-body-size",
  "density-doc-card-body-size",
  "density-doc-card-min-block",
  "density-doc-card-title-size",
  "density-doc-example-min-block",
  "density-doc-heading-line-height",
  "density-doc-heading-size",
  "density-doc-label-size",
  "density-doc-subheading-size",
  "density-page-gap",
  "density-panel-padding",
  "density-row-height",
  "density-section-gap",
  "density-subsection-gap",
  "density-surface-padding",
  "sys-density-card-padding",
  "sys-density-component-gap",
  "sys-density-component-gap-lg",
  "sys-density-control-height",
  "sys-density-control-padding-x",
  "sys-density-control-padding-y",
  "sys-density-doc-body-line-height",
  "sys-density-doc-body-size",
  "sys-density-doc-card-body-size",
  "sys-density-doc-card-min-block",
  "sys-density-doc-card-title-size",
  "sys-density-doc-example-min-block",
  "sys-density-doc-heading-line-height",
  "sys-density-doc-heading-size",
  "sys-density-doc-label-size",
  "sys-density-doc-subheading-size",
  "sys-density-page-gap",
  "sys-density-panel-padding",
  "sys-density-row-height",
  "sys-density-section-gap",
  "sys-density-subsection-gap",
  "sys-density-surface-padding"
] as const satisfies readonly DensityPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<DensityPrimitiveTokenName>(["density-card-padding","density-component-gap","density-component-gap-lg","density-control-height","density-control-padding-x","density-control-padding-y","density-doc-body-line-height","density-doc-body-size","density-doc-card-body-size","density-doc-card-min-block","density-doc-card-title-size","density-doc-example-min-block","density-doc-heading-line-height","density-doc-heading-size","density-doc-label-size","density-doc-subheading-size","density-page-gap","density-panel-padding","density-row-height","density-section-gap","density-subsection-gap","density-surface-padding","sys-density-card-padding","sys-density-component-gap","sys-density-component-gap-lg","sys-density-control-height","sys-density-control-padding-x","sys-density-control-padding-y","sys-density-doc-body-line-height","sys-density-doc-body-size","sys-density-doc-card-body-size","sys-density-doc-card-min-block","sys-density-doc-card-title-size","sys-density-doc-example-min-block","sys-density-doc-heading-line-height","sys-density-doc-heading-size","sys-density-doc-label-size","sys-density-doc-subheading-size","sys-density-page-gap","sys-density-panel-padding","sys-density-row-height","sys-density-section-gap","sys-density-subsection-gap","sys-density-surface-padding"]),
} as const;
