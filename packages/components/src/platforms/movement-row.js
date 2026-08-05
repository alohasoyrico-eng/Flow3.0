import { componentContracts } from "../contracts.js";

const movementRowContract = componentContracts.movementRow;

export const movementRowPlatformContract = {
  id: "movement-row",
  layer: "component",
  source: {
    factory: movementRowContract.factory,
    internalFactory: movementRowContract.internalFactory,
    cssClass: "movement-row",
    contract: "@design-system/components/contracts#movementRow",
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
    "measurement",
  ],
  tokens: [
    "comp.movement-row.*",
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
  props: movementRowContract.props.map((prop) => ({ ...prop })),
  variants: [...movementRowContract.variants],
  states: [...movementRowContract.states],
  accessibility: [...movementRowContract.accessibility],
};

export const movementRowPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "MovementRow",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/movement-row",
    styleSource: "@design-system/components/styles.css",
  },
};

export function movementRowPlatformProps() {
  return movementRowPlatformContract.props.map((prop) => prop.name);
}
