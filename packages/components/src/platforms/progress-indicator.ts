import { componentContracts } from "../contracts.js";

const progressIndicatorContract = componentContracts.progressIndicator;

export const progressIndicatorPlatformContract = {
  id: "progress-indicator",
  layer: "component",
  source: {
    factory: progressIndicatorContract.factory,
    cssClass: "progress",
    contract: "@design-system/components/contracts#progressIndicator",
  },
  foundations: [
    "energy",
    "voice",
    "frame",
    "state",
    "momentum",
    "accessibility",
    "tone",
    "growth",
  ],
  primitives: [
    "color",
    "typography",
    "spacing",
    "radius",
    "disabled",
    "duration",
    "motion-curves",
    "loading",
    "measurement",
  ],
  tokens: [
    "comp.progress.*",
    "component-loading-*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.tone.*",
    "sys.growth.*",
  ],
  props: progressIndicatorContract.props.map((prop) => ({ ...prop })),
  variants: [...progressIndicatorContract.variants],
  states: [...progressIndicatorContract.states],
  accessibility: [...progressIndicatorContract.accessibility],
};

export const progressIndicatorPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "ProgressIndicator",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/progress-indicator",
    styleSource: "@design-system/components/styles.css",
  },
};

export function progressIndicatorPlatformProps() {
  return progressIndicatorPlatformContract.props.map((prop) => prop.name);
}
