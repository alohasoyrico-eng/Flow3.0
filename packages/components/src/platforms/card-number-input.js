import { componentContracts } from "../contracts.js";
const cardNumberInputContract = componentContracts.cardNumberInput;
export const cardNumberInputPlatformContract = {
    id: "card-number-input",
    layer: "component",
    source: {
        factory: cardNumberInputContract.factory,
        cssClass: "field",
        contract: "@design-system/components/contracts#cardNumberInput",
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
        "comp.card-number-input.*",
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
    props: cardNumberInputContract.props.map((prop) => ({ ...prop })),
    variants: [...cardNumberInputContract.variants],
    states: [...cardNumberInputContract.states],
    accessibility: [...cardNumberInputContract.accessibility],
};
export const cardNumberInputPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "CardNumberInput",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/card-number-input",
        styleSource: "@design-system/components/styles.css",
    },
};
export function cardNumberInputPlatformProps() {
    return cardNumberInputPlatformContract.props.map((prop) => prop.name);
}
