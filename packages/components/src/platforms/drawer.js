import { componentContracts } from "../contracts.js";

const drawerContract = componentContracts.drawer;

export const drawerPlatformContract = {
  id: "drawer",
  layer: "component",
  source: {
    factory: drawerContract.factory,
    internalFactory: drawerContract.internalFactory,
    cssClass: "drawer",
    contract: "@design-system/components/contracts#drawer",
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
    "comp.drawer.*",
    "comp.button.*",
    "comp.icon-button.*",
    "comp.input.*",
    "comp.badge.*",
    "comp.progress.*",
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
  props: drawerContract.props.map((prop) => ({ ...prop })),
  variants: [...drawerContract.variants],
  states: [...drawerContract.states],
  accessibility: [...drawerContract.accessibility],
};

export const drawerPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Drawer",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/drawer",
    styleSource: "@design-system/components/styles.css",
  },
};

export function drawerPlatformProps() {
  return drawerPlatformContract.props.map((prop) => prop.name);
}
