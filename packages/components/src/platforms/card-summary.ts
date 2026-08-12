import { componentContracts } from "../contracts.js";

const cardSummaryContract = componentContracts.cardSummary;

export const cardSummaryPlatformContract = {
  id: "card-summary",
  layer: "component",
  source: {
    factory: cardSummaryContract.factory,
    cssClass: "card-summary",
    contract: "@design-system/components/contracts#cardSummary",
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
  ],
  tokens: [
    "comp.card-summary.*",
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
  props: cardSummaryContract.props.map((prop) => ({ ...prop })),
  variants: [...cardSummaryContract.variants],
  states: [...cardSummaryContract.states],
  accessibility: [...cardSummaryContract.accessibility],
};

export const cardSummaryPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "CardSummary",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/card-summary",
    styleSource: "@design-system/components/styles.css",
  },
};

export function cardSummaryPlatformProps() {
  return cardSummaryPlatformContract.props.map((prop) => prop.name);
}
