import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type SpacingPrimitiveTokenName = Extract<FlowTokenName, "sys-space-0" | "sys-space-1" | "sys-space-10" | "sys-space-11" | "sys-space-12" | "sys-space-16" | "sys-space-2" | "sys-space-20" | "sys-space-24" | "sys-space-2xl" | "sys-space-2xs" | "sys-space-3" | "sys-space-32" | "sys-space-3xl" | "sys-space-4" | "sys-space-40" | "sys-space-4xl" | "sys-space-5" | "sys-space-5xl" | "sys-space-6" | "sys-space-7" | "sys-space-8" | "sys-space-9" | "sys-space-lg" | "sys-space-md" | "sys-space-micro" | "sys-space-sm" | "sys-space-xl" | "sys-space-xs" | "sys-spacing-component-lg" | "sys-spacing-component-md" | "sys-spacing-component-sm" | "sys-spacing-inline-sm" | "sys-spacing-inline-xs" | "sys-spacing-page" | "sys-spacing-section">;

export const spacingPrimitive = {
  name: "Spacing",
  slug: "spacing",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Frame foundation roles into implementation-ready spacing primitives for page, section, panel, component, inline, grid, and density behavior.",
  governingFoundations: [
  "Frame",
  "Depth",
  "State",
  "Accessibility"
],
  coordinatesPrimitives: [
  "Density",
  "Breakpoints"
],
  tokenDependencies: [
  "ref.frame.space.*",
  "sys.frame.*",
  "sys.depth.*",
  "sys.state.*",
  "sys.accessibility.*",
  "density.*",
  "breakpoint.*",
  "spacing.*",
  "comp.*.frame aliases"
],
  roles: [
  {
    "id": "inline",
    "token": "spacing.inline.*",
    "use": "Icon/label gaps, compact metadata, table cell internals."
  },
  {
    "id": "component",
    "token": "spacing.component.*",
    "use": "Field stacks, button rows, card internals, menu options."
  },
  {
    "id": "section",
    "token": "spacing.section.*",
    "use": "Major document/product sections and dashboard group rhythm."
  },
  {
    "id": "page",
    "token": "spacing.page.*",
    "use": "Page rhythm and template-level breathing room."
  },
  {
    "id": "grid",
    "token": "spacing.grid.*",
    "use": "Dashboard, settings, tablet, and mobile layout gutters/margins."
  },
  {
    "id": "density",
    "token": "spacing.density.*",
    "use": "Compact/default/comfortable remapping by product context."
  }
],
  states: [
  "sm",
  "md",
  "lg",
  "mobile",
  "tablet",
  "laptop",
  "desktop"
],
  rejectIf: [
  "Raw margin, padding, gap, radius, or grid values appear outside tokens.",
  "A page-level wrapper compresses content without purpose.",
  "Spacing is fixed for one viewport only.",
  "Component solves layout locally instead of consuming Frame/Spacing."
],
  tokenNames: [
  "sys-space-0",
  "sys-space-1",
  "sys-space-10",
  "sys-space-11",
  "sys-space-12",
  "sys-space-16",
  "sys-space-2",
  "sys-space-20",
  "sys-space-24",
  "sys-space-2xl",
  "sys-space-2xs",
  "sys-space-3",
  "sys-space-32",
  "sys-space-3xl",
  "sys-space-4",
  "sys-space-40",
  "sys-space-4xl",
  "sys-space-5",
  "sys-space-5xl",
  "sys-space-6",
  "sys-space-7",
  "sys-space-8",
  "sys-space-9",
  "sys-space-lg",
  "sys-space-md",
  "sys-space-micro",
  "sys-space-sm",
  "sys-space-xl",
  "sys-space-xs",
  "sys-spacing-component-lg",
  "sys-spacing-component-md",
  "sys-spacing-component-sm",
  "sys-spacing-inline-sm",
  "sys-spacing-inline-xs",
  "sys-spacing-page",
  "sys-spacing-section"
] as const satisfies readonly SpacingPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<SpacingPrimitiveTokenName>(["sys-space-0","sys-space-1","sys-space-10","sys-space-11","sys-space-12","sys-space-16","sys-space-2","sys-space-20","sys-space-24","sys-space-2xl","sys-space-2xs","sys-space-3","sys-space-32","sys-space-3xl","sys-space-4","sys-space-40","sys-space-4xl","sys-space-5","sys-space-5xl","sys-space-6","sys-space-7","sys-space-8","sys-space-9","sys-space-lg","sys-space-md","sys-space-micro","sys-space-sm","sys-space-xl","sys-space-xs","sys-spacing-component-lg","sys-spacing-component-md","sys-spacing-component-sm","sys-spacing-inline-sm","sys-spacing-inline-xs","sys-spacing-page","sys-spacing-section"]),
} as const;
