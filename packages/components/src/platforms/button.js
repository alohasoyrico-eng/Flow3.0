import { componentContracts } from "../contracts.js";
const buttonContract = componentContracts.button;
export const buttonPlatformContract = {
    id: "button",
    layer: "component",
    source: {
        factory: buttonContract.factory,
        cssClass: "button",
        contract: "@design-system/components/contracts#button",
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
        "iconography",
        "loading",
    ],
    tokens: [
        "comp.button.*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.accessibility.*",
        "sys.symbol.*",
        "sys.growth.*",
    ],
    props: buttonContract.props.map((prop) => ({ ...prop })),
    variants: [...buttonContract.variants],
    states: [...buttonContract.states],
    accessibility: [...buttonContract.accessibility],
};
export const buttonPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Button",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/button",
        styleSource: "@design-system/components/styles.css",
    },
};
export function buttonPlatformProps() {
    return buttonPlatformContract.props.map((prop) => prop.name);
}
