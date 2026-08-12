import { componentContracts } from "../contracts.js";
const dialogContract = componentContracts.dialog;
export const dialogPlatformContract = {
    id: "dialog",
    layer: "component",
    source: {
        factory: dialogContract.factory,
        cssClass: "dialog",
        contract: "@design-system/components/contracts#dialog",
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
        "message",
        "measurement",
        "elevation",
    ],
    tokens: [
        "comp.dialog.*",
        "comp.button.*",
        "comp.icon-button.*",
        "comp.input.*",
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
    props: dialogContract.props.map((prop) => ({ ...prop })),
    variants: [...dialogContract.variants],
    states: [...dialogContract.states],
    accessibility: [...dialogContract.accessibility],
};
export const dialogPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Dialog",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/dialog",
        styleSource: "@design-system/components/styles.css",
    },
};
export function dialogPlatformProps() {
    return dialogPlatformContract.props.map((prop) => prop.name);
}
