import { componentContracts } from "../contracts.js";
const tooltipContract = componentContracts.tooltip;
export const tooltipPlatformContract = {
    id: "tooltip",
    layer: "component",
    source: {
        factory: tooltipContract.factory,
        cssClass: "tooltip",
        contract: "@design-system/components/contracts#tooltip",
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
        "comp.tooltip.*",
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
    props: tooltipContract.props.map((prop) => ({ ...prop })),
    variants: [...tooltipContract.variants],
    states: [...tooltipContract.states],
    accessibility: [...tooltipContract.accessibility],
};
export const tooltipPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Tooltip",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/tooltip",
        styleSource: "@design-system/components/styles.css",
    },
};
export function tooltipPlatformProps() {
    return tooltipPlatformContract.props.map((prop) => prop.name);
}
