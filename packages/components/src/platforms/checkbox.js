import { componentContracts } from "../contracts.js";
const checkboxContract = componentContracts.checkbox;
export const checkboxPlatformContract = {
    id: "checkbox",
    layer: "component",
    source: {
        factory: checkboxContract.factory,
        cssClass: "choice checkbox",
        contract: "@design-system/components/contracts#checkbox",
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
        "comp.checkbox.*",
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
    props: checkboxContract.props.map((prop) => ({ ...prop })),
    variants: [...checkboxContract.variants],
    states: [...checkboxContract.states],
    accessibility: [...checkboxContract.accessibility],
};
export const checkboxPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Checkbox",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/checkbox",
        styleSource: "@design-system/components/styles.css",
    },
};
export function checkboxPlatformProps() {
    return checkboxPlatformContract.props.map((prop) => prop.name);
}
