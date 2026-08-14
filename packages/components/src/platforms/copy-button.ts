import { componentContracts } from "../contracts.js";

const copyButtonContract = componentContracts.copyButton;

export const copyButtonPlatformContract = {
  id: "copy-button",
  layer: "component",
  source: {
    factory: copyButtonContract.factory,
    cssClass: "copy-button",
    contract: "@design-system/components/contracts#copyButton",
  },
  foundations: [
    "energy",
    "voice",
    "frame",
    "depth",
    "state",
    "momentum",
    "tone",
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
  ],
  tokens: [
    "comp.copy-button.*",
    "comp.button.*",
    "comp.icon-button.*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.tone.*",
    "sys.accessibility.*",
    "sys.symbol.*",
    "sys.growth.*",
    "sys.iconography.*",
    "sys.depth.*",
  ],
  props: copyButtonContract.props.map((prop) => ({ ...prop })),
  variants: [...copyButtonContract.variants],
  states: [...copyButtonContract.states],
  accessibility: [...copyButtonContract.accessibility],
};

export const copyButtonPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "CopyButton",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/copy-button",
    styleSource: "@design-system/components/styles.css",
  },
};

export function copyButtonPlatformProps() {
  return copyButtonPlatformContract.props.map((prop) => prop.name);
}
