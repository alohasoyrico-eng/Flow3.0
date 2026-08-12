import { componentContracts } from "../contracts.js";
const datePickerContract = componentContracts.datePicker;
export const datePickerPlatformContract = {
    id: "date-picker",
    layer: "component",
    source: {
        factory: datePickerContract.factory,
        cssClass: "field",
        contract: "@design-system/components/contracts#datePicker",
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
        "message",
        "measurement",
    ],
    tokens: [
        "comp.date-picker.*",
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
    props: datePickerContract.props.map((prop) => ({ ...prop })),
    variants: [...datePickerContract.variants],
    states: [...datePickerContract.states],
    accessibility: [...datePickerContract.accessibility],
};
export const datePickerPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "DatePicker",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/date-picker",
        styleSource: "@design-system/components/styles.css",
    },
};
export function datePickerPlatformProps() {
    return datePickerPlatformContract.props.map((prop) => prop.name);
}
