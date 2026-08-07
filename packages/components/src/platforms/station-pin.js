import { componentContracts } from "../contracts.js";

const stationPinContract = componentContracts.stationPin;

export const stationPinPlatformContract = {
  id: "station-pin",
  layer: "component",
  source: {
    factory: stationPinContract.factory,
    cssClass: "station-pin",
    contract: "@design-system/components/contracts#stationPin",
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
    "maps",
  ],
  tokens: [
    "comp.station-pin.*",
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
  props: stationPinContract.props.map((prop) => ({ ...prop })),
  variants: [...stationPinContract.variants],
  states: [...stationPinContract.states],
  accessibility: [...stationPinContract.accessibility],
};

export const stationPinPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "StationPin",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/station-pin",
    styleSource: "@design-system/components/styles.css",
  },
};

export function stationPinPlatformProps() {
  return stationPinPlatformContract.props.map((prop) => prop.name);
}
