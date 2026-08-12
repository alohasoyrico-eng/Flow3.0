import type { FlowTokenName } from "../generated/tokens";
import { createPrimitiveTokenResolver } from "./runtime";

export type LibrarySourcesPrimitiveTokenName = Extract<FlowTokenName, never>;

export const librarySourcesPrimitive = {
  name: "Library Sources",
  slug: "library-sources",
  layer: "Primitive",
  runtimeKind: "policy-contract",
  p0RuntimeRequired: false,
  policyPrimitive: true,
  purpose: "Govern the approved third-party and open-source visual/runtime libraries that enter Flow so components, patterns, templates, and docs consume primitive APIs instead of duplicating vendors, drawing assets ad hoc, or fetching uncontrolled sources.",
  governingFoundations: [
  "Symbol",
  "Iconography",
  "Accessibility",
  "Momentum",
  "Energy",
  "Frame"
],
  coordinatesPrimitives: [
  "Iconography",
  "Country Flags",
  "Animation Assets",
  "Illustration Assets",
  "Charts",
  "Maps"
],
  tokenDependencies: [
  "library.*",
  "sys.symbol.*",
  "sys.iconography.*",
  "sys.accessibility.*",
  "sys.momentum.*",
  "sys.energy.*",
  "sys.frame.*",
  "icon.*",
  "countryFlag.*",
  "animationAsset.*",
  "illustration.*",
  "chart.*",
  "map.*"
],
  roles: [
  {
    "id": "source",
    "token": "library.source",
    "use": "Approved package or local vendor source with license and ownership."
  },
  {
    "id": "runtime",
    "token": "library.runtime",
    "use": "Browser/runtime bridge used by docs and package demos without remote CDN dependence."
  },
  {
    "id": "license",
    "token": "library.license",
    "use": "License evidence required before a source can enter Flow."
  },
  {
    "id": "primitive-api",
    "token": "library.primitiveApi",
    "use": "The only API components and patterns may consume for that library family."
  },
  {
    "id": "fallback",
    "token": "library.fallback",
    "use": "Accessible non-library fallback for failed or reduced environments."
  }
],
  states: [
  "approved",
  "vendored",
  "runtime-ready",
  "fallback-ready",
  "blocked"
],
  rejectIf: [
  "A component imports or draws an asset that belongs to a library primitive.",
  "A new vendor enters docs without license evidence.",
  "Runtime assets load from an uncontrolled remote URL.",
  "There is no fallback for reduced motion, missing asset, or inaccessible visual-only output.",
  "Library ownership is documented only in an audit script and not in the primitive spec."
],
  tokenNames: [] as const satisfies readonly LibrarySourcesPrimitiveTokenName[],
  token: createPrimitiveTokenResolver<LibrarySourcesPrimitiveTokenName>([]),
} as const;
