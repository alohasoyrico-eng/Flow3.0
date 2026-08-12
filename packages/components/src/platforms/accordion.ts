import { componentContracts } from "../contracts.js";

const accordionContract = componentContracts.accordion;

export const accordionPlatformContract = {
  id: "accordion",
  layer: "component",
  source: {
    factory: accordionContract.factory,
    cssClass: "accordion",
    contract: "@design-system/components/contracts#accordion",
  },
  foundations: [
    "energy",
    "voice",
    "frame",
    "depth",
    "momentum",
    "state",
    "tone",
    "growth",
    "symbol",
    "iconography",
    "accessibility",
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
  ],
  tokens: [
    "comp.accordion.*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.depth.*",
    "sys.momentum.*",
    "sys.state.*",
    "sys.tone.*",
    "sys.growth.*",
    "sys.symbol.*",
    "sys.iconography.*",
    "sys.accessibility.*",
  ],
  props: accordionContract.props.map((prop) => ({ ...prop })),
  variants: [...accordionContract.variants],
  states: [...accordionContract.states],
  accessibility: [...accordionContract.accessibility],
};

export const accordionPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Accordion",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/accordion",
    styleSource: "@design-system/components/styles.css",
  },
};

export function accordionPlatformProps() {
  return accordionPlatformContract.props.map((prop) => prop.name);
}
