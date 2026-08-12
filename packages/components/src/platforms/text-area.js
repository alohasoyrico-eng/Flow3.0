import { componentContracts } from "../contracts.js";
const textAreaContract = componentContracts.textArea;
export const textAreaPlatformContract = {
    id: "text-area",
    layer: "component",
    source: {
        factory: textAreaContract.factory,
        cssClass: "field",
        contract: "@design-system/components/contracts#textArea",
    },
    foundations: ["energy", "voice", "frame", "state", "momentum", "accessibility", "symbol", "growth"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"],
    tokens: ["comp.text-area.*", "component-field-*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.symbol.*", "sys.growth.*"],
    props: textAreaContract.props.map((prop) => ({ ...prop })),
    variants: [...textAreaContract.variants],
    states: [...textAreaContract.states],
    accessibility: [...textAreaContract.accessibility],
};
export const textAreaPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "TextArea",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/text-area",
        styleSource: "@design-system/components/styles.css",
    },
};
export function textAreaPlatformProps() {
    return textAreaPlatformContract.props.map((prop) => prop.name);
}
