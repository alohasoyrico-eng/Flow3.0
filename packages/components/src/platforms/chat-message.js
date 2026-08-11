export const chatMessagePlatformContract = {
  id: "chat-message",
  layer: "component",
  source: {
    factory: "ChatMessage",
    cssClass: "chat-message",
    contract: "@design-system/specs/components#chat-message",
  },
  foundations: ["tone", "voice", "frame", "state", "accessibility"],
  primitives: ["message", "surface", "typography", "spacing", "radius", "density", "focus", "iconography"],
  tokens: ["comp.chat-message.*", "message.*", "surface.*", "sys.voice.*", "sys.tone.*", "sys.state.*", "sys.accessibility.*"],
  props: [
    { name: "author", type: "ChatMessageAuthor", required: false },
    { name: "authorLabel", type: "string", required: false },
    { name: "avatar", type: "AvatarProps", required: false },
    { name: "body", type: "string", required: false },
    { name: "children", type: "ReactNode", required: false },
    { name: "timestamp", type: "ReactNode", required: false },
    { name: "meta", type: "ReactNode", required: false },
    { name: "state", type: "ChatMessageState", required: false },
    { name: "tone", type: "ChatMessageTone", required: false },
    { name: "density", type: "FlowDensity", required: false },
    { name: "action", type: "ChatMessageAction", required: false },
  ],
  variants: ["user", "agent", "system", "assistant"],
  states: ["default", "sending", "sent", "delivered", "failed", "loading"],
  accessibility: ["article semantics", "alert/status live region", "author context", "recovery action"],
};

export const chatMessagePlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "ChatMessage",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/chat-message",
    styleSource: "@design-system/components/styles.css",
  },
};

export function chatMessagePlatformProps() {
  return chatMessagePlatformContract.props.map((prop) => prop.name);
}
