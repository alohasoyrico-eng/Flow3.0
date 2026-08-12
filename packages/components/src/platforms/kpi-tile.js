import { componentContracts } from "../contracts.js";
const kpiTileContract = componentContracts.kpiTile;
export const kpiTilePlatformContract = {
    id: "kpi-tile",
    layer: "component",
    source: {
        factory: kpiTileContract.factory,
        cssClass: "kpi-tile",
        contract: "@design-system/components/contracts#kpiTile",
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
        "elevation",
        "focus",
        "disabled",
        "duration",
        "motion-curves",
        "iconography",
        "measurement",
    ],
    tokens: [
        "comp.kpi-tile.*",
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
    props: kpiTileContract.props.map((prop) => ({ ...prop })),
    variants: [...kpiTileContract.variants],
    states: [...kpiTileContract.states],
    accessibility: [...kpiTileContract.accessibility],
};
export const kpiTilePlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "KpiTile",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/kpi-tile",
        styleSource: "@design-system/components/styles.css",
    },
};
export function kpiTilePlatformProps() {
    return kpiTilePlatformContract.props.map((prop) => prop.name);
}
