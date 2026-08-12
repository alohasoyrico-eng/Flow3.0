import { componentContracts } from "../contracts.js";
const listContract = componentContracts.list;
export const listPlatformContract = {
    id: "list",
    layer: "component",
    source: {
        factory: listContract.factory,
        cssClass: "list",
        contract: "@design-system/components/contracts#list",
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
        "depth",
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
        "comp.list.*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.accessibility.*",
        "sys.iconography.*",
        "sys.symbol.*",
        "sys.growth.*",
        "sys.depth.*",
    ],
    props: listContract.props.map((prop) => ({ ...prop })),
    variants: [...listContract.variants],
    states: [...listContract.states],
    accessibility: [...listContract.accessibility],
};
export const listPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "List",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/list",
        styleSource: "@design-system/components/styles.css",
    },
};
export function listPlatformProps() {
    return listPlatformContract.props.map((prop) => prop.name);
}
