import { componentContracts } from "../contracts.js";
const skeletonContract = componentContracts.skeleton;
export const skeletonPlatformContract = {
    id: "skeleton",
    layer: "component",
    source: {
        factory: skeletonContract.factory,
        cssClass: "skeleton",
        contract: "@design-system/components/contracts#skeleton",
    },
    foundations: [
        "energy",
        "voice",
        "frame",
        "state",
        "momentum",
        "accessibility",
        "tone",
        "growth",
    ],
    primitives: [
        "color",
        "spacing",
        "radius",
        "disabled",
        "duration",
        "motion-curves",
        "loading",
        "measurement",
    ],
    tokens: [
        "comp.skeleton.*",
        "component-loading-*",
        "component-skeleton-*",
        "sys.loading.*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.accessibility.*",
        "sys.tone.*",
        "sys.growth.*",
    ],
    props: skeletonContract.props.map((prop) => ({ ...prop })),
    variants: [...skeletonContract.variants],
    states: [...skeletonContract.states],
    accessibility: [...skeletonContract.accessibility],
};
export const skeletonPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Skeleton",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/skeleton",
        styleSource: "@design-system/components/styles.css",
    },
};
export function skeletonPlatformProps() {
    return skeletonPlatformContract.props.map((prop) => prop.name);
}
