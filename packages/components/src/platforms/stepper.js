import { componentContracts } from "../contracts.js";

const stepperContract = componentContracts.stepper;

export const stepperPlatformContract = {
  id: "stepper",
  layer: "component",
  source: {
    factory: stepperContract.factory,
    cssClass: "stepper",
    contract: "@design-system/components/contracts#stepper",
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
    "measurement",
  ],
  tokens: [
    "comp.stepper.*",
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
  props: stepperContract.props.map((prop) => ({ ...prop })),
  variants: [...stepperContract.variants],
  states: [...stepperContract.states],
  accessibility: [...stepperContract.accessibility],
};

export const stepperPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Stepper",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/stepper",
    styleSource: "@design-system/components/styles.css",
  },
};

export function stepperPlatformProps() {
  return stepperPlatformContract.props.map((prop) => prop.name);
}
