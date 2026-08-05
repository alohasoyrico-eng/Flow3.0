import { componentContracts } from "../contracts.js";

const tabsContract = componentContracts.tabs;

export const tabsPlatformContract = {
  id: "tabs",
  layer: "component",
  source: {
    factory: tabsContract.factory,
    cssClass: "tabs",
    contract: "@design-system/components/contracts#tabs",
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
    "comp.tabs.*",
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
  props: tabsContract.props.map((prop) => ({ ...prop })),
  variants: [...tabsContract.variants],
  states: [...tabsContract.states],
  accessibility: [...tabsContract.accessibility],
};

export const tabsPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Tabs",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/tabs",
    styleSource: "@design-system/components/styles.css",
  },
};

export function tabsPlatformProps() {
  return tabsPlatformContract.props.map((prop) => prop.name);
}
