export const chatComposerPlatformContract = {
  id: "chat-composer",
  layer: "component",
  source: {
    factory: "ChatComposer",
    cssClass: "chat-composer",
    contract: "@design-system/specs/components#chat-composer",
  },
  foundations: ["accessibility", "frame", "state", "voice"],
  primitives: ["message", "surface", "field-action", "typography", "spacing", "density", "focus"],
  tokens: ["comp.chat-composer.*", "message.*", "surface.*", "field-action.*", "sys.state.*", "sys.accessibility.*"],
  props: [
    { name: "label", type: "string", required: false },
    { name: "placeholder", type: "string", required: false },
    { name: "value", type: "string", required: false },
    { name: "defaultValue", type: "string", required: false },
    { name: "sendLabel", type: "string", required: false },
    { name: "disabled", type: "boolean", required: false },
    { name: "sending", type: "boolean", required: false },
    { name: "density", type: "FlowDensity", required: false },
    { name: "state", type: "ChatComposerState", required: false },
    { name: "onValueChange", type: "function", required: false },
    { name: "onSend", type: "function", required: false },
  ],
  variants: ["default", "attached-action"],
  states: ["default", "focus", "filled", "sending", "disabled", "error"],
  accessibility: ["form role", "labelled textarea", "disabled state", "send action"],
};

export const chatComposerPlatformAdapters = {
  react: {
    package: "@design-system/react",
    componentName: "ChatComposer",
    renderMode: "component",
    implementationRole: "primary-product-component",
    sourceOfTruth: true,
    importPath: "@design-system/react/chat-composer",
    styleSource: "@design-system/components/styles.css",
  },
};

export function chatComposerPlatformProps() {
  return chatComposerPlatformContract.props.map((prop) => prop.name);
}
