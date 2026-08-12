import { componentContracts } from "../contracts.js";
const treeViewContract = componentContracts.treeView;
export const treeViewPlatformContract = {
    id: "tree-view",
    layer: "component",
    source: {
        factory: treeViewContract.factory,
        cssClass: "tree-view",
        contract: "@design-system/components/contracts#treeView",
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
        "comp.tree-view.*",
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
    props: treeViewContract.props.map((prop) => ({ ...prop })),
    variants: [...treeViewContract.variants],
    states: [...treeViewContract.states],
    accessibility: [...treeViewContract.accessibility],
};
export const treeViewPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "TreeView",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/tree-view",
        styleSource: "@design-system/components/styles.css",
    },
};
export function treeViewPlatformProps() {
    return treeViewPlatformContract.props.map((prop) => prop.name);
}
