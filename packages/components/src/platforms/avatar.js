import { componentContracts } from "../contracts.js";
const avatarContract = componentContracts.avatar;
export const avatarPlatformContract = {
    id: "avatar",
    layer: "component",
    source: {
        factory: avatarContract.factory,
        cssClass: "avatar",
        contract: "@design-system/components/contracts#avatar",
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
        "comp.avatar.*",
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
    props: avatarContract.props.map((prop) => ({ ...prop })),
    variants: [...avatarContract.variants],
    states: [...avatarContract.states],
    accessibility: [...avatarContract.accessibility],
};
export const avatarPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Avatar",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/avatar",
        styleSource: "@design-system/components/styles.css",
    },
};
export function avatarPlatformProps() {
    return avatarPlatformContract.props.map((prop) => prop.name);
}
