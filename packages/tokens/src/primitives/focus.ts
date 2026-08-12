import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type FocusPrimitiveTokenName = Extract<FlowTokenName, "sys-focus-restore-ring" | "sys-focus-ring" | "sys-focus-ring-offset" | "sys-focus-roving-ring" | "sys-focus-skip-target-offset" | "sys-focus-trap-z-index" | "sys-focus-visible-offset" | "sys-focus-visible-ring">;

export const focusPrimitive = {
  name: "Focus",
  slug: "focus",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Accessibility and State focus rules into implementation-ready focus rings, order, restore, trap, skip, and roving behavior.",
  governingFoundations: [
  "Accessibility",
  "State",
  "Frame"
],
  coordinatesPrimitives: [
  "Disabled",
  "Radius",
  "Spacing",
  "Motion Curves"
],
  tokenDependencies: [
  "sys.accessibility.focus.*",
  "sys.state.focus.*",
  "disabled.*",
  "radius.*",
  "spacing.*",
  "motionCurve.*",
  "focus.*"
],
  roles: [
  {
    "id": "visible",
    "token": "focus.visible",
    "use": "Keyboard-visible focus ring."
  },
  {
    "id": "restore",
    "token": "focus.restore",
    "use": "Return focus after dialogs, sheets, menus."
  },
  {
    "id": "trap",
    "token": "focus.trap",
    "use": "Modal and blocking surfaces."
  },
  {
    "id": "roving",
    "token": "focus.roving",
    "use": "Menus, tabs, grids, table-like controls."
  },
  {
    "id": "skip",
    "token": "focus.skip",
    "use": "Skip navigation and map/list fallback."
  }
],
  states: [
  "visible",
  "focused",
  "trapped",
  "restored",
  "skipped"
],
  rejectIf: [
  "Focus invisible.",
  "Focus trapped without escape.",
  "Dialog closes without restoring focus.",
  "Map has no keyboard fallback."
],
  tokenNames: [
  "sys-focus-restore-ring",
  "sys-focus-ring",
  "sys-focus-ring-offset",
  "sys-focus-roving-ring",
  "sys-focus-skip-target-offset",
  "sys-focus-trap-z-index",
  "sys-focus-visible-offset",
  "sys-focus-visible-ring"
] as const satisfies readonly FocusPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<FocusPrimitiveTokenName>(["sys-focus-restore-ring","sys-focus-ring","sys-focus-ring-offset","sys-focus-roving-ring","sys-focus-skip-target-offset","sys-focus-trap-z-index","sys-focus-visible-offset","sys-focus-visible-ring"]),
} as const;
