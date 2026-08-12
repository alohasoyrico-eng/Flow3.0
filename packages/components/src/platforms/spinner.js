import { componentContracts } from "../contracts.js";
const spinnerContract = componentContracts.spinner;
export const spinnerPlatformContract = {
    id: "spinner",
    layer: "component",
    source: {
        factory: spinnerContract.factory,
        cssClass: "spinner",
        contract: "@design-system/components/contracts#spinner",
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
        "disabled",
        "duration",
        "motion-curves",
        "loading",
        "measurement",
    ],
    tokens: [
        "comp.spinner.*",
        "component-loading-*",
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
    props: spinnerContract.props.map((prop) => ({ ...prop })),
    variants: [...spinnerContract.variants],
    states: [...spinnerContract.states],
    accessibility: [...spinnerContract.accessibility],
};
export const spinnerPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "Spinner",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/spinner",
        styleSource: "@design-system/components/styles.css",
    },
};
export function spinnerPlatformProps() {
    return spinnerPlatformContract.props.map((prop) => prop.name);
}
