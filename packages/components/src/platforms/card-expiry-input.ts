import { componentContracts } from "../contracts.js";

const cardExpiryInputContract = componentContracts.cardExpiryInput;

export const cardExpiryInputPlatformContract = {
  id: "card-expiry-input",
  layer: "component",
  source: {
    factory: cardExpiryInputContract.factory,
    cssClass: "field",
    contract: "@design-system/components/contracts#cardExpiryInput",
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
    "loading",
    "message",
    "measurement",
  ],
  tokens: [
    "comp.card-expiry-input.*",
    "comp.input.*",
    "component-field-*",
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
  props: cardExpiryInputContract.props.map((prop) => ({ ...prop })),
  variants: [...cardExpiryInputContract.variants],
  states: [...cardExpiryInputContract.states],
  accessibility: [...cardExpiryInputContract.accessibility],
};

export const cardExpiryInputPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "CardExpiryInput",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/card-expiry-input",
    styleSource: "@design-system/components/styles.css",
  },
};

export function cardExpiryInputPlatformProps() {
  return cardExpiryInputPlatformContract.props.map((prop) => prop.name);
}
