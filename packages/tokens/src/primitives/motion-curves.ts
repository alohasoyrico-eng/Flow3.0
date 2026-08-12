import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type MotionCurvesPrimitiveTokenName = Extract<FlowTokenName, "sys-motion-curve-enter" | "sys-motion-curve-exit" | "sys-motion-curve-linear" | "sys-motion-curve-move" | "sys-motion-curve-standard" | "sys-motion-curve-touch">;

export const motionCurvesPrimitive = {
  name: "Motion Curves",
  slug: "motion-curves",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Momentum easing roles into implementation-ready curves for touch feedback, enter and exit lifecycle motion, move/morph transitions, and linear loading.",
  governingFoundations: [
  "Momentum",
  "State",
  "Accessibility"
],
  coordinatesPrimitives: [
  "Duration",
  "Loading"
],
  tokenDependencies: [
  "ref.momentum.easing.*",
  "sys.momentum.easing.*",
  "duration.*",
  "loading.*",
  "motion.curve.*"
],
  roles: [
  {
    "id": "touch",
    "token": "motion.curve.touch",
    "use": "Controls people touch: hover, press, focus, toggle, and quick feedback."
  },
  {
    "id": "enter",
    "token": "motion.curve.enter",
    "use": "Sheets, drawers, menus entering."
  },
  {
    "id": "exit",
    "token": "motion.curve.exit",
    "use": "Sheets, drawers, menus, dialogs, and temporary surfaces leaving."
  },
  {
    "id": "move",
    "token": "motion.curve.move",
    "use": "Movement, morphing, and layout continuity."
  },
  {
    "id": "standard",
    "token": "motion.curve.standard",
    "use": "Alias for touch during migration; do not choose it as a separate style."
  },
  {
    "id": "linear",
    "token": "motion.curve.linear",
    "use": "Continuous loading or progress movement."
  }
],
  states: [
  "touch",
  "enter",
  "exit",
  "move",
  "standard",
  "continuous",
  "reduced"
],
  rejectIf: [
  "Custom easing outside tokens.",
  "Curve used decoratively.",
  "Reduced-motion equivalent missing."
],
  tokenNames: [
  "sys-motion-curve-enter",
  "sys-motion-curve-exit",
  "sys-motion-curve-linear",
  "sys-motion-curve-move",
  "sys-motion-curve-standard",
  "sys-motion-curve-touch"
] as const satisfies readonly MotionCurvesPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<MotionCurvesPrimitiveTokenName>(["sys-motion-curve-enter","sys-motion-curve-exit","sys-motion-curve-linear","sys-motion-curve-move","sys-motion-curve-standard","sys-motion-curve-touch"]),
} as const;
