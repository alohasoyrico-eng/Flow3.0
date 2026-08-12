import { componentContracts } from "../contracts.js";
const selectContract = componentContracts.select;
export const selectPlatformContract = {
    id: "select",
    layer: "component",
    source: {
        factory: selectContract.factory,
        cssClass: "field",
        contract: "@design-system/components/contracts#select",
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
        "comp.select.*",
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
    props: selectContract.props.map((prop) => ({ ...prop })),
    variants: [...selectContract.variants],
    states: [...selectContract.states],
    accessibility: [...selectContract.accessibility],
};
export const selectPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Select",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/select",
        styleSource: "@design-system/components/styles.css",
    },
};
export function selectPlatformProps() {
    return selectPlatformContract.props.map((prop) => prop.name);
}
