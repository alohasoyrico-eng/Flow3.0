import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type MessagePrimitiveTokenName = Extract<FlowTokenName, "sys-message-action-weight" | "sys-message-alert-role" | "sys-message-body-font" | "sys-message-body-weight" | "sys-message-focus-ring" | "sys-message-intent-assistive-color" | "sys-message-intent-danger-color" | "sys-message-intent-neutral-color" | "sys-message-intent-success-color" | "sys-message-intent-warning-color" | "sys-message-live-role" | "sys-message-locale-max-inline-size" | "sys-message-readable-line-height" | "sys-message-recovery-weight" | "sys-message-title-font" | "sys-message-title-weight">;

export const messagePrimitive = {
  name: "Message",
  slug: "message",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn Tone foundation roles into implementation-ready messaging primitives for intent, severity, anatomy, recovery, accessibility, localization, and UI mapping.",
  governingFoundations: [
  "Tone",
  "Voice",
  "State",
  "Accessibility"
],
  coordinatesPrimitives: [
  "Focus",
  "Loading",
  "Disabled",
  "Iconography",
  "Measurement"
],
  tokenDependencies: [
  "sys.tone.*",
  "sys.voice.*",
  "sys.state.*",
  "sys.accessibility.*",
  "focus.*",
  "loading.*",
  "disabled.*",
  "icon.*",
  "measurement.*",
  "message.*"
],
  roles: [
  {
    "id": "intent",
    "token": "message.intent.*",
    "use": "Info, success, warning, danger, neutral, and assistive message purpose."
  },
  {
    "id": "severity",
    "token": "message.severity.*",
    "use": "Low, medium, high, and blocking operational consequence."
  },
  {
    "id": "anatomy",
    "token": "message.anatomy.*",
    "use": "Title, body, consequence, action, recovery, and support path."
  },
  {
    "id": "announcement",
    "token": "message.a11y.*",
    "use": "Live region, alert, focus, and status behavior."
  },
  {
    "id": "localization",
    "token": "message.locale.*",
    "use": "Length, clarity, ambiguity, and translation guardrails."
  }
],
  states: [
  "neutral",
  "assistive",
  "success",
  "warning",
  "danger",
  "blocking",
  "recoverable",
  "localized"
],
  rejectIf: [
  "Copy describes what happened but not what to do next.",
  "Danger message has no consequence or recovery path.",
  "Message uses humor, metaphor, or vague language in operational contexts.",
  "Agent renders feedback without accessible announcement behavior."
],
  tokenNames: [
  "sys-message-action-weight",
  "sys-message-alert-role",
  "sys-message-body-font",
  "sys-message-body-weight",
  "sys-message-focus-ring",
  "sys-message-intent-assistive-color",
  "sys-message-intent-danger-color",
  "sys-message-intent-neutral-color",
  "sys-message-intent-success-color",
  "sys-message-intent-warning-color",
  "sys-message-live-role",
  "sys-message-locale-max-inline-size",
  "sys-message-readable-line-height",
  "sys-message-recovery-weight",
  "sys-message-title-font",
  "sys-message-title-weight"
] as const satisfies readonly MessagePrimitiveTokenName[],
  token: createPrimitiveTokenResolver<MessagePrimitiveTokenName>(["sys-message-action-weight","sys-message-alert-role","sys-message-body-font","sys-message-body-weight","sys-message-focus-ring","sys-message-intent-assistive-color","sys-message-intent-danger-color","sys-message-intent-neutral-color","sys-message-intent-success-color","sys-message-intent-warning-color","sys-message-live-role","sys-message-locale-max-inline-size","sys-message-readable-line-height","sys-message-recovery-weight","sys-message-title-font","sys-message-title-weight"]),
} as const;
