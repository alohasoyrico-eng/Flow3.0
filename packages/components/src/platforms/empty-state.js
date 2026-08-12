import { componentContracts } from "../contracts.js";
const emptyStateContract = componentContracts.emptyState;
export const emptyStatePlatformContract = {
    id: "empty-state",
    layer: "component",
    source: {
        factory: emptyStateContract.factory,
        cssClass: "empty-state",
        contract: "@design-system/components/contracts#emptyState",
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
        "tone",
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
        "comp.empty-state.*",
        "component-empty-state-*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.accessibility.*",
        "sys.iconography.*",
        "sys.symbol.*",
        "sys.tone.*",
        "sys.growth.*",
    ],
    props: emptyStateContract.props.map((prop) => ({ ...prop })),
    variants: [...emptyStateContract.variants],
    states: [...emptyStateContract.states],
    accessibility: [...emptyStateContract.accessibility],
};
export const emptyStatePlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "EmptyState",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/empty-state",
        styleSource: "@design-system/components/styles.css",
    },
};
export function emptyStatePlatformProps() {
    return emptyStatePlatformContract.props.map((prop) => prop.name);
}
