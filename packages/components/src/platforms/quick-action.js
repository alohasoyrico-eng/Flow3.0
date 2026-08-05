import { componentContracts } from "../contracts.js";

const quickActionContract = componentContracts.quickAction;

export const quickActionPlatformContract = {
  id: "quick-action",
  layer: "component",
  source: {
    factory: quickActionContract.factory,
    internalFactory: quickActionContract.internalFactory,
    cssClass: "quick-action",
    contract: "@design-system/components/contracts#quickAction",
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
    "loading",
  ],
  tokens: [
    "comp.quick-action.*",
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
  props: quickActionContract.props.map((prop) => ({ ...prop })),
  variants: [...quickActionContract.variants],
  states: [...quickActionContract.states],
  accessibility: [...quickActionContract.accessibility],
};

export const quickActionPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "QuickAction",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/quick-action",
    styleSource: "@design-system/components/styles.css",
  },
};

export function quickActionPlatformProps() {
  return quickActionPlatformContract.props.map((prop) => prop.name);
}
