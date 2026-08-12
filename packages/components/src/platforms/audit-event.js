import { componentContracts } from "../contracts.js";
const auditEventContract = componentContracts.auditEvent;
export const auditEventPlatformContract = {
    id: "audit-event",
    layer: "component",
    source: {
        factory: auditEventContract.factory,
        cssClass: "audit-event",
        contract: "@design-system/components/contracts#auditEvent",
    },
    foundations: [
        "energy",
        "voice",
        "frame",
        "state",
        "momentum",
        "accessibility",
        "symbol",
        "growth",
        "iconography",
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
        "message",
        "measurement",
    ],
    tokens: [
        "comp.audit-event.*",
        "sys.energy.*",
        "sys.voice.*",
        "sys.frame.*",
        "sys.state.*",
        "sys.momentum.*",
        "sys.accessibility.*",
        "sys.symbol.*",
        "sys.growth.*",
        "sys.iconography.*",
        "sys.depth.*",
    ],
    props: auditEventContract.props.map((prop) => ({ ...prop })),
    variants: [...auditEventContract.variants],
    states: [...auditEventContract.states],
    accessibility: [...auditEventContract.accessibility],
};
export const auditEventPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "AuditEvent",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/audit-event",
        styleSource: "@design-system/components/styles.css",
    },
};
export function auditEventPlatformProps() {
    return auditEventPlatformContract.props.map((prop) => prop.name);
}
