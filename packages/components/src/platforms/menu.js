import { componentContracts } from "../contracts.js";

const menuContract = componentContracts.menu;

export const menuPlatformContract = {
  id: "menu",
  layer: "component",
  source: {
    factory: menuContract.factory,
    cssClass: "menu",
    contract: "@design-system/components/contracts#menu",
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
    "iconography",
    "measurement",
    "elevation",
  ],
  tokens: [
    "comp.menu.*",
    "comp.button.*",
    "comp.icon-button.*",
    "comp.avatar.*",
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
  props: menuContract.props.map((prop) => ({ ...prop })),
  variants: [...menuContract.variants],
  states: [...menuContract.states],
  accessibility: [...menuContract.accessibility],
};

export const menuPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Menu",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/menu",
    styleSource: "@design-system/components/styles.css",
  },
};

export function menuPlatformProps() {
  return menuPlatformContract.props.map((prop) => prop.name);
}
