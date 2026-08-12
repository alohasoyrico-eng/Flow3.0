import { componentContracts } from "../contracts.js";

const countrySelectorContract = componentContracts.countrySelector;

export const countrySelectorPlatformContract = {
  id: "country-selector",
  layer: "component",
  source: {
    factory: countrySelectorContract.factory,
    cssClass: "country-selector",
    contract: "@design-system/components/contracts#countrySelector",
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
    "country-flags",
    "iconography",
  ],
  tokens: [
    "comp.country-selector.*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.symbol.*",
    "sys.growth.*",
  ],
  props: countrySelectorContract.props.map((prop) => ({ ...prop })),
  variants: [...countrySelectorContract.variants],
  states: [...countrySelectorContract.states],
  accessibility: [...countrySelectorContract.accessibility],
};

export const countrySelectorPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "CountrySelector",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/country-selector",
    styleSource: "@design-system/components/styles.css",
  },
};

export function countrySelectorPlatformProps() {
  return countrySelectorPlatformContract.props.map((prop) => prop.name);
}
