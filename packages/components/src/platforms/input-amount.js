import { componentContracts } from "../contracts.js";
const inputAmountContract = componentContracts.inputAmount;
export const inputAmountPlatformContract = {
    id: "input-amount",
    layer: "component",
    source: {
        factory: inputAmountContract.factory,
        cssClass: "field",
        contract: "@design-system/components/contracts#inputAmount",
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
        "loading",
        "message",
        "measurement",
    ],
    tokens: [
        "comp.input-amount.*",
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
    props: inputAmountContract.props.map((prop) => ({ ...prop })),
    variants: [...inputAmountContract.variants],
    states: [...inputAmountContract.states],
    accessibility: [...inputAmountContract.accessibility],
};
export const inputAmountPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "InputAmount",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/input-amount",
        styleSource: "@design-system/components/styles.css",
    },
};
export function inputAmountPlatformProps() {
    return inputAmountPlatformContract.props.map((prop) => prop.name);
}
