import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type FieldActionPrimitiveTokenName = Extract<FlowTokenName, never>;

export const fieldActionPrimitive = {
  name: "Field Action",
  slug: "field-action",
  layer: "Primitive",
  runtimeKind: "runtime-contract",
  p0RuntimeRequired: true,
  policyPrimitive: false,
  purpose: "Turn field-adjacent actions into implementation-ready primitives for clear, reveal, picker, validation, resend, recovery, and inline command behavior without creating fake buttons inside demos or duplicated field controls.",
  governingFoundations: [
  "Accessibility",
  "State",
  "Frame",
  "Tone",
  "Energy"
],
  coordinatesPrimitives: [
  "Focus",
  "Message",
  "Disabled",
  "Loading",
  "Iconography",
  "Spacing",
  "Radius",
  "Measurement"
],
  tokenDependencies: [
  "component-field-*",
  "comp.input.*",
  "comp.icon-button.*",
  "sys.accessibility.*",
  "sys.state.*",
  "sys.frame.*",
  "sys.energy.*",
  "sys.tone.*",
  "focus.*",
  "message.*",
  "loading.*",
  "disabled.*",
  "field-action.*"
],
  roles: [
  {
    "id": "clear",
    "token": "field-action.clear",
    "use": "Remove current local value without submitting or changing focus unexpectedly."
  },
  {
    "id": "reveal",
    "token": "field-action.reveal",
    "use": "Toggle visibility for sensitive or masked field content."
  },
  {
    "id": "picker",
    "token": "field-action.picker",
    "use": "Open a component-owned picker, calendar, country selector, menu, or autocomplete surface."
  },
  {
    "id": "validate",
    "token": "field-action.validate",
    "use": "Trigger local validation, availability checks, or parsing without owning submission."
  },
  {
    "id": "recover",
    "token": "field-action.recover",
    "use": "Resend, retry, reset, or alternate-path actions tied to one field or field group."
  }
],
  states: [
  "default",
  "hover",
  "focus",
  "pressed",
  "loading",
  "success",
  "error",
  "disabled"
],
  rejectIf: [
  "An icon inside a field has no accessible label or state.",
  "A demo invents a fake button instead of consuming Button/Icon Button semantics through Field Action.",
  "Validation, reveal, picker, and recovery actions are styled with local CSS.",
  "The action changes unrelated field or form state without explicit pattern ownership."
],
  tokenNames: [] as const satisfies readonly FieldActionPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<FieldActionPrimitiveTokenName>([]),
} as const;
