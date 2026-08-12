import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type ResearchPrimitiveTokenName = Extract<FlowTokenName, "sys-research-confidence-high-color" | "sys-research-confidence-low-color" | "sys-research-confidence-medium-color" | "sys-research-context-color" | "sys-research-decision-link-color" | "sys-research-evidence-color" | "sys-research-hypothesis-color" | "sys-research-question-font" | "sys-research-question-weight" | "sys-research-readable-line-height" | "sys-research-risk-color">;

export const researchPrimitive = {
  name: "Research",
  slug: "research",
  layer: "Primitive",
  runtimeKind: "policy-contract",
  p0RuntimeRequired: false,
  policyPrimitive: true,
  purpose: "Turn research practice into implementation-ready primitives for questions, hypotheses, audience context, evidence, confidence, risk, decision links, and learning signals.",
  governingFoundations: [
  "Growth",
  "Tone",
  "Accessibility",
  "Voice"
],
  coordinatesPrimitives: [
  "Measurement",
  "Message",
  "Charts"
],
  tokenDependencies: [
  "sys.growth.*",
  "sys.tone.*",
  "sys.accessibility.*",
  "sys.voice.*",
  "measurement.*",
  "message.*",
  "chart.*",
  "research.*"
],
  roles: [
  {
    "id": "question",
    "token": "research.question",
    "use": "What the team needs to learn before or after shipping."
  },
  {
    "id": "hypothesis",
    "token": "research.hypothesis",
    "use": "Expected behavior or outcome to validate."
  },
  {
    "id": "context",
    "token": "research.context.*",
    "use": "Audience, device, environment, task pressure, and operational risk."
  },
  {
    "id": "evidence",
    "token": "research.evidence.*",
    "use": "Interview, usability test, telemetry, support, shadowing, survey, or field data."
  },
  {
    "id": "confidence",
    "token": "research.confidence.*",
    "use": "Low, medium, high confidence with stated risk."
  }
],
  states: [
  "assumption",
  "questioned",
  "tested",
  "validated",
  "invalidated",
  "needs-follow-up"
],
  rejectIf: [
  "Decision claims research support without evidence type.",
  "Finding is not linked to a product decision.",
  "Confidence is missing for high-risk flows.",
  "Research output cannot be read by designers, PMs, developers, and agents."
],
  tokenNames: [
  "sys-research-confidence-high-color",
  "sys-research-confidence-low-color",
  "sys-research-confidence-medium-color",
  "sys-research-context-color",
  "sys-research-decision-link-color",
  "sys-research-evidence-color",
  "sys-research-hypothesis-color",
  "sys-research-question-font",
  "sys-research-question-weight",
  "sys-research-readable-line-height",
  "sys-research-risk-color"
] as const satisfies readonly ResearchPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<ResearchPrimitiveTokenName>(["sys-research-confidence-high-color","sys-research-confidence-low-color","sys-research-confidence-medium-color","sys-research-context-color","sys-research-decision-link-color","sys-research-evidence-color","sys-research-hypothesis-color","sys-research-question-font","sys-research-question-weight","sys-research-readable-line-height","sys-research-risk-color"]),
} as const;
