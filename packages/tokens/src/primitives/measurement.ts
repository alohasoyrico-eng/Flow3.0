import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type MeasurementPrimitiveTokenName = Extract<FlowTokenName, "sys-measurement-analytics-color" | "sys-measurement-event-color" | "sys-measurement-event-font" | "sys-measurement-guardrail-background" | "sys-measurement-guardrail-color" | "sys-measurement-hypothesis-color" | "sys-measurement-metric-color" | "sys-measurement-metric-font" | "sys-measurement-metric-weight" | "sys-measurement-privacy-color">;

export const measurementPrimitive = {
  name: "Measurement",
  slug: "measurement",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Growth foundation roles into implementation-ready measurement primitives for telemetry, analytics views, success metrics, friction, recovery, quality signals, and ethical guardrails.",
  governingFoundations: [
  "Growth",
  "State",
  "Accessibility",
  "Tone"
],
  coordinatesPrimitives: [
  "Charts",
  "Message",
  "Research"
],
  tokenDependencies: [
  "sys.growth.*",
  "sys.state.*",
  "sys.accessibility.*",
  "sys.tone.*",
  "chart.*",
  "message.*",
  "research.*",
  "measurement.*"
],
  roles: [
  {
    "id": "event",
    "token": "measurement.event.*",
    "use": "Actor, trigger, surface, object, result, and timestamp contract."
  },
  {
    "id": "metric",
    "token": "measurement.metric.*",
    "use": "Success, friction, recovery, quality, and support-avoidance signals."
  },
  {
    "id": "analytics",
    "token": "measurement.analytics.*",
    "use": "Funnels, cohorts, trends, dashboards, and segment views derived from events."
  },
  {
    "id": "hypothesis",
    "token": "measurement.hypothesis.*",
    "use": "Learning claim the metric confirms or rejects."
  },
  {
    "id": "guardrail",
    "token": "measurement.guardrail.*",
    "use": "Ethics and anti-vanity constraints."
  }
],
  states: [
  "planned",
  "instrumented",
  "validated",
  "stale",
  "deprecated",
  "blocked"
],
  rejectIf: [
  "Event name exists without actor, object, trigger, and result.",
  "Click count is treated as success without product outcome.",
  "Analytics dashboard has no decision or action owner.",
  "Measurement encourages dark patterns or manipulative growth."
],
  tokenNames: [
  "sys-measurement-analytics-color",
  "sys-measurement-event-color",
  "sys-measurement-event-font",
  "sys-measurement-guardrail-background",
  "sys-measurement-guardrail-color",
  "sys-measurement-hypothesis-color",
  "sys-measurement-metric-color",
  "sys-measurement-metric-font",
  "sys-measurement-metric-weight",
  "sys-measurement-privacy-color"
] as const satisfies readonly MeasurementPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<MeasurementPrimitiveTokenName>(["sys-measurement-analytics-color","sys-measurement-event-color","sys-measurement-event-font","sys-measurement-guardrail-background","sys-measurement-guardrail-color","sys-measurement-hypothesis-color","sys-measurement-metric-color","sys-measurement-metric-font","sys-measurement-metric-weight","sys-measurement-privacy-color"]),
} as const;
