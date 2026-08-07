import { componentContracts } from "../contracts.js";

const dateRangePickerContract = componentContracts.dateRangePicker;

export const dateRangePickerPlatformContract = {
  id: "date-range-picker",
  layer: "component",
  source: {
    factory: dateRangePickerContract.factory,
    cssClass: "field",
    contract: "@design-system/components/contracts#dateRangePicker",
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
    "comp.date-picker.*",
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
  props: dateRangePickerContract.props.map((prop) => ({ ...prop })),
  variants: [...dateRangePickerContract.variants],
  states: [...dateRangePickerContract.states],
  accessibility: [...dateRangePickerContract.accessibility],
};

export const dateRangePickerPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "DateRangePicker",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/date-range-picker",
    styleSource: "@design-system/components/styles.css",
  },
};

export function dateRangePickerPlatformProps() {
  return dateRangePickerPlatformContract.props.map((prop) => prop.name);
}
