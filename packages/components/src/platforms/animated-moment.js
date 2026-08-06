import { componentContracts } from "../contracts.js";

const animatedMomentContract = componentContracts.animatedMoment;

export const animatedMomentPlatformContract = {
  id: "animated-moment",
  layer: "component",
  source: {
    factory: animatedMomentContract.factory,
    internalFactory: animatedMomentContract.internalFactory,
    cssClass: "animated-moment",
    contract: "@design-system/components/contracts#animatedMoment",
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
    "animation-assets",
    "message",
    "measurement",
  ],
  tokens: [
    "comp.animated-moment.*",
    "primitive.animation-assets.*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.symbol.*",
    "sys.growth.*",
    "sys.iconography.*",
  ],
  props: animatedMomentContract.props.map((prop) => ({ ...prop })),
  variants: [...animatedMomentContract.variants],
  states: [...animatedMomentContract.states],
  accessibility: [...animatedMomentContract.accessibility],
};

export const animatedMomentPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "AnimatedMoment",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/animated-moment",
    styleSource: "@design-system/components/styles.css",
  },
};

export function animatedMomentPlatformProps() {
  return animatedMomentPlatformContract.props.map((prop) => prop.name);
}
