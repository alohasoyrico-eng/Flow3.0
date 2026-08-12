import { componentContracts } from "../contracts.js";
const chartPanelContract = componentContracts.chartPanel;
export const chartPanelPlatformContract = {
    id: "chart-panel",
    layer: "component",
    source: {
        factory: chartPanelContract.factory,
        cssClass: "chart-panel",
        contract: "@design-system/components/contracts#chartPanel",
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
        "depth",
    ],
    primitives: [
        "color",
        "typography",
        "spacing",
        "radius",
        "elevation",
        "focus",
        "disabled",
        "duration",
        "motion-curves",
        "charts",
        "message",
        "measurement",
    ],
    tokens: [
        "comp.chart-panel.*",
        "primitive.charts.*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.accessibility.*",
        "sys.tone.*",
        "sys.growth.*",
        "sys.depth.*",
    ],
    props: chartPanelContract.props.map((prop) => ({ ...prop })),
    variants: [...chartPanelContract.variants],
    states: [...chartPanelContract.states],
    accessibility: [...chartPanelContract.accessibility],
};
export const chartPanelPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "ChartPanel",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/chart-panel",
        styleSource: "@design-system/components/styles.css",
    },
};
export function chartPanelPlatformProps() {
    return chartPanelPlatformContract.props.map((prop) => prop.name);
}
