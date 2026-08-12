import { componentContracts } from "../contracts.js";
const codeInputContract = componentContracts.codeInput;
export const codeInputPlatformContract = {
    id: "code-input",
    layer: "component",
    source: {
        factory: codeInputContract.factory,
        cssClass: "field",
        contract: "@design-system/components/contracts#codeInput",
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
        "loading",
        "message",
        "measurement",
    ],
    tokens: [
        "code-input-*",
        "component-field-*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.accessibility.*",
        "sys.symbol.*",
        "sys.growth.*",
    ],
    props: codeInputContract.props.map((prop) => ({ ...prop })),
    variants: [...codeInputContract.variants],
    states: [...codeInputContract.states],
    accessibility: [...codeInputContract.accessibility],
};
export const codeInputPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "CodeInput",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/code-input",
        styleSource: "@design-system/components/styles.css",
    },
};
export function codeInputPlatformProps() {
    return codeInputPlatformContract.props.map((prop) => prop.name);
}
