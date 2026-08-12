import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type CountryFlagsPrimitiveTokenName = Extract<FlowTokenName, never>;

export const countryFlagsPrimitive = {
  name: "Country Flags",
  slug: "country-flags",
  layer: "Primitive",
  runtimeKind: "policy-contract",
  p0RuntimeRequired: false,
  policyPrimitive: true,
  purpose: "Turn country-flag-icons MIT assets into implementation-ready country identity, circular flag masks, accessible labels, asset paths, and fallback behavior.",
  governingFoundations: [
  "Iconography",
  "Symbol",
  "Accessibility",
  "Energy",
  "Frame"
],
  coordinatesPrimitives: [
  "Library Sources",
  "Iconography",
  "Radius",
  "Spacing"
],
  tokenDependencies: [
  "countryFlag.*",
  "library.*",
  "sys.iconography.*",
  "sys.symbol.*",
  "sys.accessibility.*",
  "sys.energy.*",
  "sys.frame.*",
  "icon.*",
  "radius.*",
  "spacing.*",
  "country-flag-icons"
],
  roles: [
  {
    "id": "asset",
    "token": "countryFlag.asset",
    "use": "Library-backed flag image for country selectors and phone inputs."
  },
  {
    "id": "mask",
    "token": "countryFlag.mask",
    "use": "Circular visual treatment governed by component radius and frame."
  },
  {
    "id": "identity",
    "token": "countryFlag.identity",
    "use": "Country code, country name, calling code, and selected state."
  },
  {
    "id": "fallback",
    "token": "countryFlag.fallback",
    "use": "Text fallback when an asset cannot load."
  }
],
  states: [
  "loaded",
  "fallback",
  "decorative",
  "informative"
],
  rejectIf: [
  "Flag SVGs are manually drawn in component code.",
  "The only country identity is visual color or shape.",
  "The primitive depends on remote flag assets in docs.",
  "There is no fallback when the flag asset fails.",
  "Country Selector or Phone Input duplicates flag asset logic."
],
  tokenNames: [] as const satisfies readonly CountryFlagsPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<CountryFlagsPrimitiveTokenName>([]),
} as const;
