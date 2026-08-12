import { componentContracts } from "../contracts.js";
const breadcrumbsContract = componentContracts.breadcrumbs;
export const breadcrumbsPlatformContract = {
    id: "breadcrumbs",
    layer: "component",
    source: {
        factory: breadcrumbsContract.factory,
        cssClass: "breadcrumbs",
        contract: "@design-system/components/contracts#breadcrumbs",
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
        "comp.breadcrumbs.*",
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
    props: breadcrumbsContract.props.map((prop) => ({ ...prop })),
    variants: [...breadcrumbsContract.variants],
    states: [...breadcrumbsContract.states],
    accessibility: [...breadcrumbsContract.accessibility],
};
export const breadcrumbsPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Breadcrumbs",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/breadcrumbs",
        styleSource: "@design-system/components/styles.css",
    },
};
export function breadcrumbsPlatformProps() {
    return breadcrumbsPlatformContract.props.map((prop) => prop.name);
}
