const fs = require("fs");
const path = require("path");
const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkChatComposerCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/ChatComposer.tsx");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : path.join(sourceRoot, "packages/react/src/ChatComposer.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".chat-composer.surface");
  const fieldBlock = blockFor(blocks, selectorKey, ".chat-composer .chat-composer__field");
  const textAreaBlock = blockFor(blocks, selectorKey, ".chat-composer .text-area__surface");
  const sendingBlock = blockFor(blocks, selectorKey, ".chat-composer[data-state=\"sending\"]");
  const errorBlock = blockFor(blocks, selectorKey, ".chat-composer[data-state=\"error\"]");

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-chat-composer-gap: var(--component-space-sm)",
      "--comp-chat-composer-action-align: var(--component-align-end)",
      "--component-surface-display: grid",
      "align-items: var(--comp-chat-composer-action-align)",
      "gap: var(--comp-chat-composer-gap)",
    ],
    message: "ChatComposer root must be Surface-backed and consume component-scoped layout aliases.",
  });
  requireIncludes({
    block: fieldBlock,
    text,
    packageCssFile,
    snippets: ["min-inline-size: 0"],
    message: "ChatComposer field slot must preserve Field/TextArea shrink behavior.",
  });
  requireIncludes({
    block: textAreaBlock,
    text,
    packageCssFile,
    snippets: ["min-block-size: var(--component-field-control-size-lg)"],
    message: "ChatComposer text area slot must consume the shared field control size.",
  });
  requireIncludes({
    block: sendingBlock,
    text,
    packageCssFile,
    snippets: ["opacity: var(--component-opacity-loading)"],
    message: "ChatComposer sending state must consume shared loading opacity.",
  });
  requireIncludes({
    block: errorBlock,
    text,
    packageCssFile,
    snippets: ["--component-surface-border-color:"],
    message: "ChatComposer error state must cascade into Surface border aliases.",
  });
  for (const snippet of [
    "import { Button } from \"./Button.js\";",
    "import { IconButton } from \"./IconButton.js\";",
    "import { TextArea } from \"./TextArea.js\";",
    "import { Surface } from \"./Surface.js\";",
    "React.createElement(TextArea",
    "React.createElement(Button",
  ]) {
    if (!source.includes(snippet)) {
      add("errors", sourceFile, 1, `ChatComposer must remain a composition of existing Flow primitives/components: missing ${snippet}`);
    }
  }
  if (source.includes("chat-composer__control") || source.includes("chat-composer__input")) {
    add("errors", sourceFile, 1, "ChatComposer must not reintroduce local control/input frames; compose TextArea and action components.");
  }
  if (/--comp-chat-composer-(?:control|input|button|field)-(?:size|padding|radius)/.test(rootBlock?.body ?? "")) {
    add("errors", packageCssFile, lineNumber(text, rootBlock.index), "ChatComposer must not define local control size/padding/radius aliases; compose Field/TextArea/Button/IconButton contracts.");
  }
}

module.exports = { checkChatComposerCssContract };
