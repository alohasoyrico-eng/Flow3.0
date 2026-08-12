import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type ColorPrimitiveTokenName = Extract<FlowTokenName, "sys-color-action" | "sys-color-action-hover" | "sys-color-action-text" | "sys-color-border" | "sys-color-border-strong" | "sys-color-danger" | "sys-color-focus" | "sys-color-success" | "sys-color-surface" | "sys-color-surface-muted" | "sys-color-surface-raised" | "sys-color-text" | "sys-color-text-muted" | "sys-color-text-subtle" | "sys-color-warning">;

export const colorPrimitive = {
  name: "Color",
  slug: "color",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Energy foundation roles into implementation-ready semantic color primitives for action, status, feedback, surface, border, chart, and map usage.",
  governingFoundations: [
  "Energy",
  "State",
  "Tone",
  "Accessibility"
],
  coordinatesPrimitives: [
  "Focus",
  "Disabled",
  "Iconography",
  "Charts",
  "Maps"
],
  tokenDependencies: [
  "ref.energy.*",
  "sys.energy.*",
  "sys.state.*",
  "sys.tone.*",
  "sys.accessibility.*",
  "focus.*",
  "disabled.*",
  "icon.*",
  "chart.*",
  "map.*",
  "color.*",
  "comp.*.energy aliases"
],
  roles: [
  {
    "id": "action",
    "token": "color.action",
    "use": "Primary and secondary product actions."
  },
  {
    "id": "status",
    "token": "color.status.*",
    "use": "Success, warning, error, pending, stale, and disabled states."
  },
  {
    "id": "surface",
    "token": "color.surface.*",
    "use": "Page, card, panel, sheet, table, map overlay."
  },
  {
    "id": "border",
    "token": "color.border.*",
    "use": "Controls, separators, selected rows, focus-adjacent structures."
  },
  {
    "id": "text",
    "token": "color.text.*",
    "use": "Primary, secondary, tertiary, inverse, status copy."
  },
  {
    "id": "data",
    "token": "color.data.*",
    "use": "Charts, maps, route lines, threshold bands with accessible alternatives."
  }
],
  states: [
  "default",
  "hover",
  "pressed",
  "focus",
  "selected",
  "loading",
  "disabled",
  "success",
  "warning",
  "error"
],
  rejectIf: [
  "A component uses hex directly.",
  "Color is chosen by taste instead of semantic role.",
  "Status color appears without state or copy.",
  "Charts/maps rely only on color."
],
  tokenNames: [
  "sys-color-action",
  "sys-color-action-hover",
  "sys-color-action-text",
  "sys-color-border",
  "sys-color-border-strong",
  "sys-color-danger",
  "sys-color-focus",
  "sys-color-success",
  "sys-color-surface",
  "sys-color-surface-muted",
  "sys-color-surface-raised",
  "sys-color-text",
  "sys-color-text-muted",
  "sys-color-text-subtle",
  "sys-color-warning"
] as const satisfies readonly ColorPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<ColorPrimitiveTokenName>(["sys-color-action","sys-color-action-hover","sys-color-action-text","sys-color-border","sys-color-border-strong","sys-color-danger","sys-color-focus","sys-color-success","sys-color-surface","sys-color-surface-muted","sys-color-surface-raised","sys-color-text","sys-color-text-muted","sys-color-text-subtle","sys-color-warning"]),
} as const;
