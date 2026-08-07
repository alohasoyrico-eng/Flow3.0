import { componentContracts } from "../contracts.js";

const comboboxContract = componentContracts.combobox;

export const comboboxPlatformContract = {
  id: "combobox",
  layer: "component",
  source: {
    factory: comboboxContract.factory,
    cssClass: "field",
    contract: "@design-system/components/contracts#combobox",
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
    "comp.combobox.*",
    "comp.select.*",
    "comp.input.*",
    "component-field-*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.iconography.*",
    "sys.symbol.*",
    "sys.growth.*",
  ],
  props: comboboxContract.props.map((prop) => ({ ...prop })),
  variants: [...comboboxContract.variants],
  states: [...comboboxContract.states],
  accessibility: [...comboboxContract.accessibility],
};

export const comboboxPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "Combobox",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/combobox",
    styleSource: "@design-system/components/styles.css",
  },
};

export function comboboxPlatformProps() {
  return comboboxPlatformContract.props.map((prop) => prop.name);
}
