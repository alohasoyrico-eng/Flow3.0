import { componentContracts } from "../contracts.js";

const badgeContract = componentContracts.badge;

export const badgePlatformContract = {
  id: "badge",
  layer: "component",
  source: {
    factory: badgeContract.factory,
    internalFactory: badgeContract.internalFactory,
    cssClass: "badge",
    contract: "@design-system/components/contracts#badge",
  },
  foundations: [
    "energy",
    "voice",
    "frame",
    "state",
    "momentum",
    "accessibility",
    "iconography",
    "symbol",
    "growth",
  ],
  primitives: [
    "color",
    "typography",
    "spacing",
    "radius",
    "focus",
    "disabled",
    "duration",
    "motion-curves",
    "iconography",
  ],
  tokens: [
    "comp.badge.*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.iconography.*",
    "sys.symbol.*",
    "sys.growth.*",
  ],
  props: badgeContract.props.map((prop) => ({ ...prop })),
  variants: [...badgeContract.variants],
  states: [...badgeContract.states],
  accessibility: [...badgeContract.accessibility],
};

export const badgePlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Badge",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/badge",
    styleSource: "@design-system/components/styles.css",
  },
};

export function badgePlatformProps() {
  return badgePlatformContract.props.map((prop) => prop.name);
}
