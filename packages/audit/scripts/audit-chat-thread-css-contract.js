const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkChatThreadCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".chat-thread.surface");
  const descriptionBlock = blockFor(blocks, selectorKey, ".chat-thread__description");
  const listBlock = blockFor(blocks, selectorKey, ".chat-thread__list");
  const selectedBlock = blockFor(blocks, selectorKey, ".chat-thread__item[data-selected=\"true\"]");

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-chat-thread-gap: var(--component-space-md)",
      "--comp-chat-thread-list-gap: var(--component-space-sm)",
      "--component-surface-display: grid",
      "gap: var(--comp-chat-thread-gap)",
    ],
    message: "ChatThread root must be a Surface-backed layout owner with component-scoped rhythm aliases.",
  });
  requireIncludes({
    block: descriptionBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--component-color-text-muted)", "font-size: var(--component-font-size-small)", "line-height: var(--component-line-height-reading)"],
    message: "ChatThread description must consume shared voice/tone aliases.",
  });
  requireIncludes({
    block: listBlock,
    text,
    packageCssFile,
    snippets: ["display: grid", "gap: var(--comp-chat-thread-list-gap)", "list-style: none"],
    message: "ChatThread message list must consume ChatThread spacing aliases.",
  });
  requireIncludes({
    block: selectedBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--component-focus-ring)", "outline-offset: var(--component-focus-ring-offset)"],
    message: "ChatThread selected item state must reuse the accessibility focus contract.",
  });
}

module.exports = { checkChatThreadCssContract };
