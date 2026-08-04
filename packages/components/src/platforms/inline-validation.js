import { componentContracts } from "../contracts.js";

const inlineValidationContract = componentContracts.inlineValidation;

export const inlineValidationPlatformContract = {
  id: "inline-validation",
  layer: "component",
  source: {
    factory: inlineValidationContract.factory,
    cssClass: "inline-validation",
    contract: "@design-system/components/contracts#inlineValidation",
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
    "message",
  ],
  tokens: [
    "comp.inline-validation.*",
    "comp.input.*",
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
  props: inlineValidationContract.props.map((prop) => ({ ...prop })),
  variants: [...inlineValidationContract.variants],
  states: [...inlineValidationContract.states],
  accessibility: [...inlineValidationContract.accessibility],
};

export const inlineValidationPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "InlineValidation",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/inline-validation",
    styleSource: "@design-system/components/styles.css",
  },
};

export function inlineValidationPlatformProps() {
  return inlineValidationPlatformContract.props.map((prop) => prop.name);
}
