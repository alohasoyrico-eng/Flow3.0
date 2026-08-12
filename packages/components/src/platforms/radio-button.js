import { componentContracts } from "../contracts.js";
const radioButtonContract = componentContracts.radioButton;
export const radioButtonPlatformContract = {
    id: "radio-button",
    layer: "component",
    source: {
        factory: radioButtonContract.factory,
        cssClass: "choice radio",
        contract: "@design-system/components/contracts#radioButton",
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
        "message",
        "measurement",
    ],
    tokens: [
        "comp.radio-button.*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.accessibility.*",
        "sys.symbol.*",
        "sys.growth.*",
    ],
    props: radioButtonContract.props.map((prop) => ({ ...prop })),
    variants: [...radioButtonContract.variants],
    states: [...radioButtonContract.states],
    accessibility: [...radioButtonContract.accessibility],
};
export const radioButtonPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "RadioButton",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/radio-button",
        styleSource: "@design-system/components/styles.css",
    },
};
export function radioButtonPlatformProps() {
    return radioButtonPlatformContract.props.map((prop) => prop.name);
}
