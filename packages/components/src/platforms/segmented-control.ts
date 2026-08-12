import { componentContracts } from "../contracts.js";

const segmentedControlContract = componentContracts.segmentedControl;

export const segmentedControlPlatformContract = {
  id: "segmented-control",
  layer: "component",
  source: {
    factory: segmentedControlContract.factory,
    cssClass: "segmented-control",
    contract: "@design-system/components/contracts#segmentedControl",
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
    "measurement",
  ],
  tokens: [
    "comp.segmented-control.*",
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
  props: segmentedControlContract.props.map((prop) => ({ ...prop })),
  variants: [...segmentedControlContract.variants],
  states: [...segmentedControlContract.states],
  accessibility: [...segmentedControlContract.accessibility],
};

export const segmentedControlPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "SegmentedControl",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/segmented-control",
    styleSource: "@design-system/components/styles.css",
  },
};

export function segmentedControlPlatformProps() {
  return segmentedControlPlatformContract.props.map((prop) => prop.name);
}
