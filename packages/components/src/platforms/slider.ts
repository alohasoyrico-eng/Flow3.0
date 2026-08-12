import { componentContracts } from "../contracts.js";

const sliderContract = componentContracts.slider;

export const sliderPlatformContract = {
  id: "slider",
  layer: "component",
  source: {
    factory: sliderContract.factory,
    cssClass: "slider",
    contract: "@design-system/components/contracts#slider",
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
    "measurement",
  ],
  tokens: [
    "comp.slider.*",
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
  props: sliderContract.props.map((prop) => ({ ...prop })),
  variants: [...sliderContract.variants],
  states: [...sliderContract.states],
  accessibility: [...sliderContract.accessibility],
};

export const sliderPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Slider",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/slider",
    styleSource: "@design-system/components/styles.css",
  },
};

export function sliderPlatformProps() {
  return sliderPlatformContract.props.map((prop) => prop.name);
}
