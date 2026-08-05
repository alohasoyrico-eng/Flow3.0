import { componentContracts } from "../contracts.js";

const popoverContract = componentContracts.popover;

export const popoverPlatformContract = {
  id: "popover",
  layer: "component",
  source: {
    factory: popoverContract.factory,
    internalFactory: popoverContract.internalFactory,
    cssClass: "popover",
    contract: "@design-system/components/contracts#popover",
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
    "message",
    "measurement",
    "elevation",
  ],
  tokens: [
    "comp.popover.*",
    "comp.button.*",
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
    "sys.depth.*",
  ],
  props: popoverContract.props.map((prop) => ({ ...prop })),
  variants: [...popoverContract.variants],
  states: [...popoverContract.states],
  accessibility: [...popoverContract.accessibility],
};

export const popoverPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Popover",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/popover",
    styleSource: "@design-system/components/styles.css",
  },
};

export function popoverPlatformProps() {
  return popoverPlatformContract.props.map((prop) => prop.name);
}
