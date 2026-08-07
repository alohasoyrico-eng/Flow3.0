import { componentContracts } from "../contracts.js";

const cardSecurityCodeInputContract = componentContracts.cardSecurityCodeInput;

export const cardSecurityCodeInputPlatformContract = {
  id: "card-security-code-input",
  layer: "component",
  source: {
    factory: cardSecurityCodeInputContract.factory,
    cssClass: "field",
    contract: "@design-system/components/contracts#cardSecurityCodeInput",
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
    "comp.card-security-code-input.*",
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
  props: cardSecurityCodeInputContract.props.map((prop) => ({ ...prop })),
  variants: [...cardSecurityCodeInputContract.variants],
  states: [...cardSecurityCodeInputContract.states],
  accessibility: [...cardSecurityCodeInputContract.accessibility],
};

export const cardSecurityCodeInputPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "CardSecurityCodeInput",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/card-security-code-input",
    styleSource: "@design-system/components/styles.css",
  },
};

export function cardSecurityCodeInputPlatformProps() {
  return cardSecurityCodeInputPlatformContract.props.map((prop) => prop.name);
}
