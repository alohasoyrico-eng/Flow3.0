import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type DurationPrimitiveTokenName = Extract<FlowTokenName, "sys-duration-base" | "sys-duration-cycle" | "sys-duration-enter" | "sys-duration-fast" | "sys-duration-instant" | "sys-duration-loading-cycle" | "sys-duration-loading-spin" | "sys-duration-medium" | "sys-duration-overlay" | "sys-duration-press" | "sys-duration-progress" | "sys-duration-pulse" | "sys-duration-reveal" | "sys-duration-sheet" | "sys-duration-slow" | "sys-duration-snappy" | "sys-duration-touch">;

export const durationPrimitive = {
  name: "Duration",
  slug: "duration",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Momentum timing roles into implementation-ready durations for instant, touch, base, slow, loading, and reduced-motion feedback.",
  governingFoundations: [
  "Momentum",
  "State",
  "Accessibility"
],
  coordinatesPrimitives: [
  "Motion Curves",
  "Loading"
],
  tokenDependencies: [
  "ref.momentum.duration.*",
  "sys.momentum.duration.*",
  "motionCurve.*",
  "loading.*",
  "duration.*"
],
  roles: [
  {
    "id": "instant",
    "token": "duration.instant",
    "use": "Critical state and reduced motion."
  },
  {
    "id": "touch",
    "token": "duration.touch",
    "use": "Hover, press, focus, toggle, and direct manipulation feedback."
  },
  {
    "id": "base",
    "token": "duration.base",
    "use": "Expansion, reveal, tabs, filters, and local panel changes."
  },
  {
    "id": "fast",
    "token": "duration.fast",
    "use": "Alias for touch during migration; do not choose it as a separate timing style."
  },
  {
    "id": "slow",
    "token": "duration.slow",
    "use": "Sheets, drawers, route transitions."
  },
  {
    "id": "cycle",
    "token": "duration.cycle",
    "use": "Continuous loading cycles."
  }
],
  states: [
  "instant",
  "touch",
  "base",
  "fast",
  "slow",
  "cycle",
  "reduced"
],
  rejectIf: [
  "Hardcoded ms values.",
  "Long animation blocks task completion.",
  "Reduced motion still animates translation/scale."
],
  tokenNames: [
  "sys-duration-base",
  "sys-duration-cycle",
  "sys-duration-enter",
  "sys-duration-fast",
  "sys-duration-instant",
  "sys-duration-loading-cycle",
  "sys-duration-loading-spin",
  "sys-duration-medium",
  "sys-duration-overlay",
  "sys-duration-press",
  "sys-duration-progress",
  "sys-duration-pulse",
  "sys-duration-reveal",
  "sys-duration-sheet",
  "sys-duration-slow",
  "sys-duration-snappy",
  "sys-duration-touch"
] as const satisfies readonly DurationPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<DurationPrimitiveTokenName>(["sys-duration-base","sys-duration-cycle","sys-duration-enter","sys-duration-fast","sys-duration-instant","sys-duration-loading-cycle","sys-duration-loading-spin","sys-duration-medium","sys-duration-overlay","sys-duration-press","sys-duration-progress","sys-duration-pulse","sys-duration-reveal","sys-duration-sheet","sys-duration-slow","sys-duration-snappy","sys-duration-touch"]),
} as const;
