import { componentContracts } from "../contracts.js";

const motionBoundaryContract = componentContracts.motionBoundary;

export const motionBoundaryPlatformContract = {
  id: "motion-boundary",
  layer: "component",
  source: {
    factory: motionBoundaryContract.factory,
    internalFactory: motionBoundaryContract.internalFactory,
    cssClass: "motion-boundary",
    contract: "@design-system/components/contracts#motionBoundary",
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
    "message",
    "measurement",
  ],
  tokens: [
    "comp.motion-boundary.*",
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
  props: motionBoundaryContract.props.map((prop) => ({ ...prop })),
  variants: [...motionBoundaryContract.variants],
  states: [...motionBoundaryContract.states],
  accessibility: [...motionBoundaryContract.accessibility],
};

export const motionBoundaryPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "MotionBoundary",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/motion-boundary",
    styleSource: "@design-system/components/styles.css",
  },
};

export function motionBoundaryPlatformProps() {
  return motionBoundaryPlatformContract.props.map((prop) => prop.name);
}
