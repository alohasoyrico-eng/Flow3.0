import { componentContracts } from "../contracts.js";

const tagContract = componentContracts.tag;

export const tagPlatformContract = {
  id: "tag",
  layer: "component",
  source: {
    factory: tagContract.factory,
    internalFactory: tagContract.internalFactory,
    cssClass: "tag",
    contract: "@design-system/components/contracts#tag",
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
    "comp.tag.*",
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
  props: tagContract.props.map((prop) => ({ ...prop })),
  variants: [...tagContract.variants],
  states: [...tagContract.states],
  accessibility: [...tagContract.accessibility],
};

export const tagPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Tag",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/tag",
    styleSource: "@design-system/components/styles.css",
  },
};

export function tagPlatformProps() {
  return tagPlatformContract.props.map((prop) => prop.name);
}
