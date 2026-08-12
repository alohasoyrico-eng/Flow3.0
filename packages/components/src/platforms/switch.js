import { componentContracts } from "../contracts.js";
const switchContract = componentContracts.switch;
export const switchPlatformContract = {
    id: "switch",
    layer: "component",
    source: {
        factory: switchContract.factory,
        cssClass: "switch",
        contract: "@design-system/components/contracts#switch",
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
        "message",
        "measurement",
    ],
    tokens: [
        "comp.switch.*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.accessibility.*",
        "sys.symbol.*",
        "sys.growth.*",
    ],
    props: switchContract.props.map((prop) => ({ ...prop })),
    variants: [...switchContract.variants],
    states: [...switchContract.states],
    accessibility: [...switchContract.accessibility],
};
export const switchPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Switch",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/switch",
        styleSource: "@design-system/components/styles.css",
    },
};
export function switchPlatformProps() {
    return switchPlatformContract.props.map((prop) => prop.name);
}
