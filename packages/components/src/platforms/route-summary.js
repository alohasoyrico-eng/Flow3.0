import { componentContracts } from "../contracts.js";

const routeSummaryContract = componentContracts.routeSummary;

export const routeSummaryPlatformContract = {
  id: "route-summary",
  layer: "component",
  source: {
    factory: routeSummaryContract.factory,
    cssClass: "route-summary",
    contract: "@design-system/components/contracts#routeSummary",
  },
  foundations: [
    "energy",
    "voice",
    "frame",
    "state",
    "momentum",
    "accessibility",
    "symbol",
    "growth",
    "iconography",
    "depth",
  ],
  primitives: [
    "color",
    "typography",
    "spacing",
    "radius",
    "elevation",
    "focus",
    "disabled",
    "duration",
    "motion-curves",
    "iconography",
    "measurement",
    "maps",
  ],
  tokens: [
    "comp.route-summary.*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.symbol.*",
    "sys.growth.*",
    "sys.iconography.*",
    "sys.depth.*",
  ],
  props: routeSummaryContract.props.map((prop) => ({ ...prop })),
  variants: [...routeSummaryContract.variants],
  states: [...routeSummaryContract.states],
  accessibility: [...routeSummaryContract.accessibility],
};

export const routeSummaryPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "RouteSummary",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/route-summary",
    styleSource: "@design-system/components/styles.css",
  },
};

export function routeSummaryPlatformProps() {
  return routeSummaryPlatformContract.props.map((prop) => prop.name);
}
