import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type DisabledPrimitiveTokenName = Extract<FlowTokenName, "sys-disabled-border-color" | "sys-disabled-cursor" | "sys-disabled-icon-color" | "sys-disabled-opacity" | "sys-disabled-pointer-events" | "sys-disabled-readable-opacity" | "sys-disabled-surface-opacity" | "sys-disabled-text-color">;

export const disabledPrimitive = {
  name: "Disabled",
  slug: "disabled",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn State, Tone, and Accessibility disabled rules into unavailable, permission-blocked, offline-blocked, data-blocked, risk-blocked, and future-available semantics.",
  governingFoundations: [
  "State",
  "Tone",
  "Accessibility",
  "Energy"
],
  coordinatesPrimitives: [
  "Focus",
  "Loading",
  "Iconography"
],
  tokenDependencies: [
  "sys.state.disabled.*",
  "sys.tone.*",
  "focus.*",
  "loading.*",
  "icon.*",
  "disabled.*"
],
  roles: [
  {
    "id": "unavailable",
    "token": "disabled.unavailable",
    "use": "Temporarily not actionable."
  },
  {
    "id": "permission",
    "token": "disabled.permission",
    "use": "Role or scope blocks action."
  },
  {
    "id": "offline",
    "token": "disabled.offline",
    "use": "Network/data dependency unavailable."
  },
  {
    "id": "risk",
    "token": "disabled.risk",
    "use": "High-risk action needs review or prerequisite."
  },
  {
    "id": "future",
    "token": "disabled.future",
    "use": "Not yet available but intentionally visible."
  }
],
  states: [
  "disabled",
  "permissionBlocked",
  "offlineBlocked",
  "riskBlocked",
  "futureAvailable"
],
  rejectIf: [
  "Disabled has no reason.",
  "Blocked action lacks fallback.",
  "Disabled state hides critical dependency.",
  "Opacity is the only cue."
],
  tokenNames: [
  "sys-disabled-border-color",
  "sys-disabled-cursor",
  "sys-disabled-icon-color",
  "sys-disabled-opacity",
  "sys-disabled-pointer-events",
  "sys-disabled-readable-opacity",
  "sys-disabled-surface-opacity",
  "sys-disabled-text-color"
] as const satisfies readonly DisabledPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<DisabledPrimitiveTokenName>(["sys-disabled-border-color","sys-disabled-cursor","sys-disabled-icon-color","sys-disabled-opacity","sys-disabled-pointer-events","sys-disabled-readable-opacity","sys-disabled-surface-opacity","sys-disabled-text-color"]),
} as const;
