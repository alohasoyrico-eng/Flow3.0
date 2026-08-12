import { componentContracts } from "../contracts.js";

const inputContract = componentContracts.input;

export const inputPlatformContract = {
  id: "input",
  layer: "component",
  source: {
    factory: inputContract.factory,
    cssClass: "field",
    contract: "@design-system/components/contracts#input",
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
  props: inputContract.props.map((prop) => ({ ...prop })),
  variants: [...inputContract.variants],
  states: [...inputContract.states],
  accessibility: [...inputContract.accessibility],
};

export const inputPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Input",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/input",
    styleSource: "@design-system/components/styles.css",
  },
};

export function inputPlatformProps() {
  return inputPlatformContract.props.map((prop) => prop.name);
}
