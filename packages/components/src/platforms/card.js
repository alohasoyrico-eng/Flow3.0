import { componentContracts } from "../contracts.js";

const cardContract = componentContracts.card;

export const cardPlatformContract = {
  id: "card",
  layer: "component",
  source: {
    factory: cardContract.factory,
    cssClass: "card",
    contract: "@design-system/components/contracts#card",
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
    "depth",
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
    "loading",
    "measurement",
    "elevation",
  ],
  tokens: [
    "comp.card.*",
    "comp.button.*",
    "comp.icon-button.*",
    "comp.spinner.*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.iconography.*",
    "sys.symbol.*",
    "sys.growth.*",
    "sys.depth.*",
  ],
  props: cardContract.props.map((prop) => ({ ...prop })),
  variants: [...cardContract.variants],
  states: [...cardContract.states],
  accessibility: [...cardContract.accessibility],
};

export const cardPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Card",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/card",
    styleSource: "@design-system/components/styles.css",
  },
};

export function cardPlatformProps() {
  return cardPlatformContract.props.map((prop) => prop.name);
}
