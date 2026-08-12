import { componentContracts } from "../contracts.js";
const tableContract = componentContracts.table;
export const tablePlatformContract = {
    id: "table",
    layer: "component",
    source: {
        factory: tableContract.factory,
        cssClass: "table",
        contract: "@design-system/components/contracts#table",
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
        "measurement",
        "elevation",
    ],
    tokens: [
        "comp.table.*",
        "comp.badge.*",
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
    props: tableContract.props.map((prop) => ({ ...prop })),
    variants: [...tableContract.variants],
    states: [...tableContract.states],
    accessibility: [...tableContract.accessibility],
};
export const tablePlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Table",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/table",
        styleSource: "@design-system/components/styles.css",
    },
};
export function tablePlatformProps() {
    return tablePlatformContract.props.map((prop) => prop.name);
}
