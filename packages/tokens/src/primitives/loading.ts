import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type LoadingPrimitiveTokenName = Extract<FlowTokenName, "sys-loading-busy-cursor" | "sys-loading-cycle-duration" | "sys-loading-easing-linear" | "sys-loading-easing-rhythm" | "sys-loading-progress-duration" | "sys-loading-progress-fill" | "sys-loading-progress-track" | "sys-loading-pulse-duration" | "sys-loading-skeleton-highlight" | "sys-loading-skeleton-surface" | "sys-loading-spin-duration" | "sys-loading-spinner-tone" | "sys-loading-spinner-track" | "sys-loading-stale-opacity">;

export const loadingPrimitive = {
  name: "Loading",
  slug: "loading",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn State and Momentum loading roles into implementation-ready skeleton, stale, sync, progress, busy, and optimistic patterns.",
  governingFoundations: [
  "State",
  "Momentum",
  "Tone",
  "Accessibility"
],
  coordinatesPrimitives: [
  "Duration",
  "Motion Curves",
  "Disabled",
  "Focus"
],
  tokenDependencies: [
  "sys.state.loading.*",
  "sys.momentum.*",
  "duration.*",
  "motionCurve.*",
  "disabled.*",
  "focus.*",
  "loading.*"
],
  roles: [
  {
    "id": "skeleton",
    "token": "loading.skeleton",
    "use": "Unknown content shape during fetch."
  },
  {
    "id": "stale",
    "token": "loading.stale",
    "use": "Showing old data while refreshing."
  },
  {
    "id": "sync",
    "token": "loading.sync",
    "use": "Background updates and pending changes."
  },
  {
    "id": "progress",
    "token": "loading.progress",
    "use": "Known-duration import/upload/setup."
  },
  {
    "id": "busy",
    "token": "aria-busy",
    "use": "Assistive announcement of pending state."
  }
],
  states: [
  "loading",
  "stale",
  "syncing",
  "optimistic",
  "error"
],
  rejectIf: [
  "Spinner with no label.",
  "Loading allows duplicate action.",
  "Stale data looks fresh.",
  "Animation carries required information."
],
  tokenNames: [
  "sys-loading-busy-cursor",
  "sys-loading-cycle-duration",
  "sys-loading-easing-linear",
  "sys-loading-easing-rhythm",
  "sys-loading-progress-duration",
  "sys-loading-progress-fill",
  "sys-loading-progress-track",
  "sys-loading-pulse-duration",
  "sys-loading-skeleton-highlight",
  "sys-loading-skeleton-surface",
  "sys-loading-spin-duration",
  "sys-loading-spinner-tone",
  "sys-loading-spinner-track",
  "sys-loading-stale-opacity"
] as const satisfies readonly LoadingPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<LoadingPrimitiveTokenName>(["sys-loading-busy-cursor","sys-loading-cycle-duration","sys-loading-easing-linear","sys-loading-easing-rhythm","sys-loading-progress-duration","sys-loading-progress-fill","sys-loading-progress-track","sys-loading-pulse-duration","sys-loading-skeleton-highlight","sys-loading-skeleton-surface","sys-loading-spin-duration","sys-loading-spinner-tone","sys-loading-spinner-track","sys-loading-stale-opacity"]),
} as const;
