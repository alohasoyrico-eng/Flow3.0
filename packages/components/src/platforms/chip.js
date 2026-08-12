import { componentContracts } from "../contracts.js";
const chipContract = componentContracts.chip;
export const chipPlatformContract = {
    id: "chip",
    layer: "component",
    source: {
        factory: chipContract.factory,
        cssClass: "chip",
        contract: "@design-system/components/contracts#chip",
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
    ],
    tokens: [
        "comp.chip.*",
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
    props: chipContract.props.map((prop) => ({ ...prop })),
    variants: [...chipContract.variants],
    states: [...chipContract.states],
    accessibility: [...chipContract.accessibility],
};
export const chipPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Chip",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/chip",
        styleSource: "@design-system/components/styles.css",
    },
};
export function chipPlatformProps() {
    return chipPlatformContract.props.map((prop) => prop.name);
}
