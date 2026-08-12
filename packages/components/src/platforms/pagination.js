import { componentContracts } from "../contracts.js";
const paginationContract = componentContracts.pagination;
export const paginationPlatformContract = {
    id: "pagination",
    layer: "component",
    source: {
        factory: paginationContract.factory,
        cssClass: "pagination",
        contract: "@design-system/components/contracts#pagination",
    },
    foundations: [
        "energy",
        "voice",
        "frame",
        "depth",
        "momentum",
        "state",
        "tone",
        "growth",
        "symbol",
        "iconography",
        "accessibility",
    ],
    primitives: [
        "color",
        "typography",
        "spacing",
        "radius",
        "elevation",
        "focus",
        "disabled",
        "duration",
        "motion-curves",
        "iconography",
        "measurement",
    ],
    tokens: [
        "comp.pagination.*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.depth.*",
        "sys.momentum.*",
        "sys.state.*",
        "sys.tone.*",
        "sys.growth.*",
        "sys.symbol.*",
        "sys.iconography.*",
        "sys.accessibility.*",
    ],
    props: paginationContract.props.map((prop) => ({ ...prop })),
    variants: [...paginationContract.variants],
    states: [...paginationContract.states],
    accessibility: [...paginationContract.accessibility],
};
export const paginationPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Pagination",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/pagination",
        styleSource: "@design-system/components/styles.css",
    },
};
export function paginationPlatformProps() {
    return paginationPlatformContract.props.map((prop) => prop.name);
}
