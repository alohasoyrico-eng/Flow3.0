export const chatThreadPlatformContract = {
    id: "chat-thread",
    layer: "component",
    source: {
        factory: "ChatThread",
        cssClass: "chat-thread",
        contract: "@design-system/specs/components#chat-thread",
    },
    foundations: ["accessibility", "frame", "state", "voice"],
    primitives: ["message", "surface", "density", "typography", "spacing", "focus"],
    tokens: ["comp.chat-thread.*", "message.*", "surface.*", "sys.state.*", "sys.accessibility.*"],
    props: [
        { name: "label", type: "string", required: false },
        { name: "description", type: "ReactNode", required: false },
        { name: "messages", type: "ChatThreadMessage[]", required: false },
        { name: "empty", type: "ChatThreadEmptyState", required: false },
        { name: "error", type: "ChatThreadEmptyState", required: false },
        { name: "state", type: "ChatThreadState", required: false },
        { name: "density", type: "FlowDensity", required: false },
        { name: "selectedMessageKey", type: "string", required: false },
        { name: "onMessageAction", type: "function", required: false },
    ],
    variants: ["message-list", "empty", "error", "handoff", "offline"],
    states: ["default", "loading", "empty", "error", "handoff", "offline"],
    accessibility: ["role log", "aria-live polite", "aria-busy loading", "selected item focus outline"],
};
export const chatThreadPlatformAdapters = {
    react: {
        package: "@design-system/react",
        componentName: "ChatThread",
        renderMode: "component",
        implementationRole: "primary-product-component",
        sourceOfTruth: true,
        importPath: "@design-system/react/chat-thread",
        styleSource: "@design-system/components/styles.css",
    },
};
export function chatThreadPlatformProps() {
    return chatThreadPlatformContract.props.map((prop) => prop.name);
}
