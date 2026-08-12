import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type IllustrationAssetsPrimitiveTokenName = Extract<FlowTokenName, never>;

export const illustrationAssetsPrimitive = {
  name: "Illustration Assets",
  slug: "illustration-assets",
  layer: "Primitive",
  runtimeKind: "policy-contract",
  p0RuntimeRequired: false,
  policyPrimitive: true,
  purpose: "Turn approved free illustration sources into Flow-owned image assets for purpose, format, theme, accessibility labels, density, responsive framing, and fallback behavior.",
  governingFoundations: [
  "Symbol",
  "Accessibility",
  "Energy",
  "Frame",
  "Voice"
],
  coordinatesPrimitives: [
  "Library Sources",
  "Animation Assets",
  "Iconography",
  "Density",
  "Breakpoints"
],
  tokenDependencies: [
  "illustration.*",
  "library.*",
  "sys.symbol.*",
  "sys.energy.*",
  "sys.frame.*",
  "sys.voice.*",
  "sys.accessibility.*"
],
  roles: [
  {
    "id": "source",
    "token": "illustration.source.*",
    "use": "Approved source, license, attribution, and redistribution boundaries."
  },
  {
    "id": "format",
    "token": "illustration.format.*",
    "use": "PNG, SVG, GIF, or static fallback selection by product context."
  },
  {
    "id": "purpose",
    "token": "illustration.purpose.*",
    "use": "Decorative, informative, onboarding, empty, hero, or guidance role."
  },
  {
    "id": "theme",
    "token": "illustration.theme.*",
    "use": "Light, dark, high-contrast, and quiet-mode asset switching."
  },
  {
    "id": "fallback",
    "token": "illustration.fallback.*",
    "use": "Fallback copy or symbol when an image cannot load."
  }
],
  states: [
  "ready",
  "decorative",
  "informative",
  "missing",
  "unsupportedFormat",
  "unapprovedSource"
],
  rejectIf: [
  "The illustration source is not approved.",
  "The license is missing.",
  "An informative illustration has empty alt text.",
  "A decorative illustration is announced to assistive technology.",
  "Light and dark assets are hardcoded outside the primitive."
],
  tokenNames: [] as const satisfies readonly IllustrationAssetsPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<IllustrationAssetsPrimitiveTokenName>([]),
} as const;
