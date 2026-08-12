import { componentContracts } from "../contracts.js";
const iconButtonContract = componentContracts.iconButton;
export const iconButtonPlatformContract = {
    id: "icon-button",
    layer: "component",
    source: {
        factory: iconButtonContract.factory,
        cssClass: "icon-button",
        contract: "@design-system/components/contracts#iconButton",
    },
    foundations: ["energy", "voice", "frame", "state", "momentum", "accessibility", "symbol", "growth"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography"],
    tokens: [
        "comp.icon-button.*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.accessibility.*",
        "sys.symbol.*",
        "sys.growth.*",
    ],
    props: iconButtonContract.props,
    variants: iconButtonContract.variants,
    states: iconButtonContract.states,
    accessibility: iconButtonContract.accessibility,
};
export const iconButtonPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "IconButton",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/icon-button",
        styleSource: "@design-system/components/styles.css",
    },
};
export function iconButtonPlatformProps() {
    return iconButtonPlatformContract.props.map((prop) => prop.name);
}
