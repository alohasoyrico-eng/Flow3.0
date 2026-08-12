import { componentContracts } from "../contracts.js";
const phoneInputContract = componentContracts.phoneInput;
export const phoneInputPlatformContract = {
    id: "phone-input",
    layer: "component",
    source: {
        factory: phoneInputContract.factory,
        cssClass: "field",
        contract: "@design-system/components/contracts#phoneInput",
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
        "country-flags",
        "message",
        "measurement",
    ],
    tokens: [
        "comp.phone-input.*",
        "comp.input.*",
        "component-field-*",
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
    props: phoneInputContract.props.map((prop) => ({ ...prop })),
    variants: [...phoneInputContract.variants],
    states: [...phoneInputContract.states],
    accessibility: [...phoneInputContract.accessibility],
};
export const phoneInputPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "PhoneInput",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/phone-input",
        styleSource: "@design-system/components/styles.css",
    },
};
export function phoneInputPlatformProps() {
    return phoneInputPlatformContract.props.map((prop) => prop.name);
}
