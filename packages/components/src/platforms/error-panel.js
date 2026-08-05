import { componentContracts } from "../contracts.js";

const errorPanelContract = componentContracts.errorPanel;

export const errorPanelPlatformContract = {
  id: "error-panel",
  layer: "component",
  source: {
    factory: errorPanelContract.factory,
    cssClass: "error-panel",
    contract: "@design-system/components/contracts#errorPanel",
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
    "tone",
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
    "loading",
    "message",
    "measurement",
  ],
  tokens: [
    "comp.error-panel.*",
    "component-error-panel-*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.iconography.*",
    "sys.symbol.*",
    "sys.tone.*",
    "sys.growth.*",
  ],
  props: errorPanelContract.props.map((prop) => ({ ...prop })),
  variants: [...errorPanelContract.variants],
  states: [...errorPanelContract.states],
  accessibility: [...errorPanelContract.accessibility],
};

export const errorPanelPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "ErrorPanel",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/error-panel",
    styleSource: "@design-system/components/styles.css",
  },
};

export function errorPanelPlatformProps() {
  return errorPanelPlatformContract.props.map((prop) => prop.name);
}
