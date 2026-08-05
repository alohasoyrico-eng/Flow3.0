import { componentContracts } from "../contracts.js";

const floatingActionButtonContract = componentContracts.floatingActionButton;

export const floatingActionButtonPlatformContract = {
  id: "floating-action-button",
  layer: "component",
  source: {
    factory: floatingActionButtonContract.factory,
    cssClass: "fab",
    contract: "@design-system/components/contracts#floatingActionButton",
  },
  foundations: [
    "energy",
    "voice",
    "frame",
    "depth",
    "state",
    "momentum",
    "accessibility",
    "symbol",
    "growth",
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
    "comp.floating-action-button.*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.depth.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.symbol.*",
    "sys.growth.*",
  ],
  props: floatingActionButtonContract.props.map((prop) => ({ ...prop })),
  variants: [...floatingActionButtonContract.variants],
  states: [...floatingActionButtonContract.states],
  accessibility: [...floatingActionButtonContract.accessibility],
};

export const floatingActionButtonPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "FloatingActionButton",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/floating-action-button",
    styleSource: "@design-system/components/styles.css",
  },
};

export function floatingActionButtonPlatformProps() {
  return floatingActionButtonPlatformContract.props.map((prop) => prop.name);
}
