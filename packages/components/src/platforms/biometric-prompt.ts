import { componentContracts } from "../contracts.js";

const biometricPromptContract = componentContracts.biometricPrompt;

export const biometricPromptPlatformContract = {
  id: "biometric-prompt",
  layer: "component",
  source: {
    factory: biometricPromptContract.factory,
    cssClass: "biometric-prompt",
    contract: "@design-system/components/contracts#biometricPrompt",
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
    "comp.biometric-prompt.*",
    "comp.button.*",
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
  props: biometricPromptContract.props.map((prop) => ({ ...prop })),
  variants: [...biometricPromptContract.variants],
  states: [...biometricPromptContract.states],
  accessibility: [...biometricPromptContract.accessibility],
};

export const biometricPromptPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "BiometricPrompt",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/biometric-prompt",
    styleSource: "@design-system/components/styles.css",
  },
};

export function biometricPromptPlatformProps() {
  return biometricPromptPlatformContract.props.map((prop) => prop.name);
}
