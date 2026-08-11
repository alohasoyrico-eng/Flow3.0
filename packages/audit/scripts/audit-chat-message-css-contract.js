const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkChatMessageCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".chat-message");
  const bubbleBlock = blockFor(blocks, selectorKey, ".chat-message__bubble.surface");
  const userBubbleBlock = blockFor(blocks, selectorKey, ".chat-message[data-author=\"user\"] .chat-message__bubble.surface");
  const dangerBlock = blockFor(blocks, selectorKey, ".chat-message[data-tone=\"danger\"] .chat-message__bubble.surface,.chat-message[data-state=\"failed\"] .chat-message__bubble.surface");
  const bodyBlock = blockFor(blocks, selectorKey, ".chat-message__body");
  const typingBlock = blockFor(blocks, selectorKey, ".chat-message__typing");

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-chat-message-gap: var(--component-space-sm)",
      "--comp-chat-message-max-inline-size: min(42rem, 88%)",
      "--comp-chat-message-bubble-radius: var(--component-radius-surface)",
      "--comp-chat-message-body-size: var(--component-font-size-small)",
      "color: var(--comp-chat-message-fg)",
      "gap: var(--comp-chat-message-gap)",
    ],
    message: "ChatMessage root must own component-scoped aliases for frame, tone, voice, and density cascade.",
  });
  requireIncludes({
    block: bubbleBlock,
    text,
    packageCssFile,
    snippets: [
      "--component-surface-bg: var(--component-color-surface-raised)",
      "--component-surface-padding: var(--component-space-sm) var(--component-space-md)",
      "--component-surface-radius: var(--component-radius-surface)",
      "max-inline-size: var(--comp-chat-message-max-inline-size)",
    ],
    message: "ChatMessage bubble must cascade through Surface aliases instead of owning a card-like bubble shell.",
  });
  requireIncludes({
    block: userBubbleBlock,
    text,
    packageCssFile,
    snippets: ["--component-surface-bg: color-mix(in srgb, var(--component-color-action) 10%, var(--component-color-surface))"],
    message: "ChatMessage user author state must resolve through shared Surface and Energy aliases.",
  });
  requireIncludes({
    block: dangerBlock,
    text,
    packageCssFile,
    snippets: ["--component-surface-bg: color-mix(in srgb, var(--component-color-danger) 8%, var(--component-color-surface))", "--component-surface-border-color:"],
    message: "ChatMessage failed/danger tone must cascade into Surface state aliases.",
  });
  requireIncludes({
    block: bodyBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-chat-message-body-size)", "line-height: var(--comp-chat-message-body-line-height)", "overflow-wrap: anywhere"],
    message: "ChatMessage body must consume voice/frame aliases and protect wrapping.",
  });
  requireIncludes({
    block: typingBlock,
    text,
    packageCssFile,
    snippets: ["--comp-chat-message-typing-size:", "--comp-chat-message-typing-gap:", "gap: var(--comp-chat-message-typing-gap)"],
    message: "ChatMessage loading indicator must use chat-message scoped aliases.",
  });
}

module.exports = { checkChatMessageCssContract };
