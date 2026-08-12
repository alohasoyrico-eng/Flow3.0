import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type BreakpointsPrimitiveTokenName = Extract<FlowTokenName, "sys-breakpoint-desktop" | "sys-breakpoint-laptop" | "sys-breakpoint-mobile" | "sys-breakpoint-tablet" | "sys-breakpoint-wide">;

export const breakpointsPrimitive = {
  name: "Breakpoints",
  slug: "breakpoints",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Frame responsive roles into implementation-ready content-driven breakpoints for mobile, tablet, laptop, and desktop.",
  governingFoundations: [
  "Frame",
  "Accessibility"
],
  coordinatesPrimitives: [
  "Density",
  "Spacing"
],
  tokenDependencies: [
  "ref.frame.breakpoint.*",
  "sys.frame.grid.*",
  "breakpoint.*"
],
  roles: [
  {
    "id": "mobile",
    "token": "breakpoint.mobile",
    "use": "Driver app, sheets, stacked actions."
  },
  {
    "id": "tablet",
    "token": "breakpoint.tablet",
    "use": "Inspector layouts and split review."
  },
  {
    "id": "laptop",
    "token": "breakpoint.laptop",
    "use": "Fleet manager default workstation."
  },
  {
    "id": "desktop",
    "token": "breakpoint.desktop",
    "use": "Wide dashboards and dense tables."
  }
],
  states: [
  "mobile",
  "tablet",
  "laptop",
  "desktop"
],
  rejectIf: [
  "Unintended horizontal scroll.",
  "Hamburger appears on wide layouts unnecessarily.",
  "Same template reused across incompatible contexts."
],
  tokenNames: [
  "sys-breakpoint-desktop",
  "sys-breakpoint-laptop",
  "sys-breakpoint-mobile",
  "sys-breakpoint-tablet",
  "sys-breakpoint-wide"
] as const satisfies readonly BreakpointsPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<BreakpointsPrimitiveTokenName>(["sys-breakpoint-desktop","sys-breakpoint-laptop","sys-breakpoint-mobile","sys-breakpoint-tablet","sys-breakpoint-wide"]),
} as const;
