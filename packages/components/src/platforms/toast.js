import { componentContracts } from "../contracts.js";
const toastContract = componentContracts.toast;
export const toastPlatformContract = {
    id: "toast",
    layer: "component",
    source: {
        factory: toastContract.factory,
        cssClass: "toast",
        contract: "@design-system/components/contracts#toast",
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
        "message",
        "measurement",
    ],
    tokens: [
        "comp.toast.*",
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
    props: toastContract.props.map((prop) => ({ ...prop })),
    variants: [...toastContract.variants],
    states: [...toastContract.states],
    accessibility: [...toastContract.accessibility],
};
export const toastPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Toast",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/toast",
        styleSource: "@design-system/components/styles.css",
    },
};
export function toastPlatformProps() {
    return toastPlatformContract.props.map((prop) => prop.name);
}
