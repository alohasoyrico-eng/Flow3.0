import { componentContracts } from "../contracts.js";
const codeBlockContract = componentContracts.codeBlock;
export const codeBlockPlatformContract = {
    id: "code-block",
    layer: "component",
    source: {
        factory: codeBlockContract.factory,
        cssClass: "code-block",
        contract: "@design-system/components/contracts#codeBlock",
    },
    foundations: [
        "energy",
        "voice",
        "frame",
        "depth",
        "state",
        "momentum",
        "tone",
        "accessibility",
        "symbol",
        "growth",
        "iconography",
    ],
    primitives: [
        "color",
        "typography",
        "spacing",
        "radius",
        "surface",
        "density",
        "focus",
        "disabled",
        "breakpoints",
        "message",
    ],
    tokens: [
        "comp.code-block.*",
        "comp.copy-button.*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.depth.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.tone.*",
        "sys.accessibility.*",
        "sys.symbol.*",
        "sys.growth.*",
        "sys.iconography.*",
    ],
    props: codeBlockContract.props.map((prop) => ({ ...prop })),
    variants: [...codeBlockContract.variants],
    states: [...codeBlockContract.states],
    accessibility: [...codeBlockContract.accessibility],
};
export const codeBlockPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "CodeBlock",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/code-block",
        styleSource: "@design-system/components/styles.css",
    },
};
export function codeBlockPlatformProps() {
    return codeBlockPlatformContract.props.map((prop) => prop.name);
}
