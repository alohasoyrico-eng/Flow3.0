import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type AnimationAssetsPrimitiveTokenName = Extract<FlowTokenName, never>;

export const animationAssetsPrimitive = {
  name: "Animation Assets",
  slug: "animation-assets",
  layer: "Primitive",
  runtimeKind: "policy-contract",
  p0RuntimeRequired: false,
  policyPrimitive: true,
  purpose: "Turn lottie-web and Lottie-compatible assets into implementation-ready playback, static fallback, reduced-motion policy, lifecycle controls, and accessibility labels.",
  governingFoundations: [
  "Momentum",
  "Accessibility",
  "Symbol",
  "Energy",
  "Frame"
],
  coordinatesPrimitives: [
  "Library Sources",
  "Duration",
  "Motion Curves",
  "Loading"
],
  tokenDependencies: [
  "animationAsset.*",
  "library.*",
  "duration.*",
  "motionCurve.*",
  "loading.*",
  "sys.momentum.*",
  "sys.accessibility.*",
  "sys.symbol.*",
  "sys.energy.*",
  "sys.frame.*",
  "lottie-web"
],
  roles: [
  {
    "id": "runtime",
    "token": "animationAsset.runtime",
    "use": "Library-backed lottie-web renderer and lifecycle bridge."
  },
  {
    "id": "source",
    "token": "animationAsset.source",
    "use": "JSON path or animation data reference owned outside bounded components."
  },
  {
    "id": "fallback",
    "token": "animationAsset.fallback",
    "use": "Static icon and text fallback when runtime, asset, or motion permission is unavailable."
  },
  {
    "id": "lifecycle",
    "token": "animationAsset.lifecycle",
    "use": "Play, pause, complete, disabled, and reduced-motion states."
  }
],
  states: [
  "idle",
  "playing",
  "paused",
  "complete",
  "reduced-motion",
  "disabled",
  "fallback"
],
  rejectIf: [
  "A component or pattern calls loadAnimation directly.",
  "The runtime is loaded from a CDN in docs.",
  "There is no static fallback for reduced motion or missing runtime.",
  "Required meaning exists only in motion.",
  "The primitive owns onboarding, education, campaign, or multi-step sequence rules."
],
  tokenNames: [] as const satisfies readonly AnimationAssetsPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<AnimationAssetsPrimitiveTokenName>([]),
} as const;
