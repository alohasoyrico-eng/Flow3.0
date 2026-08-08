const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkCodeInputCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const baseBlock = blockFor(blocks, selectorKey, ".code-input");
  const slotsBlock = blockFor(blocks, selectorKey, ".code-input .code-input__slots,.segmented-control");
  const slotBlock = blockFor(blocks, selectorKey, ".code-input .code-input__slot");
  const smBlock = blockFor(blocks, selectorKey, ".code-input[data-density=\"sm\"]");
  const compactBlock = blockFor(blocks, selectorKey, ".code-input[data-variant=\"compact\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".code-input[data-density=\"lg\"]");
  const digitBlock = blockFor(blocks, selectorKey, ".code-input__digit");

  requireIncludes({
    block: baseBlock,
    text,
    packageCssFile,
    snippets: [
      "--code-input-slot-block-size: var(--comp-code-input-slot-block-size-md)",
      "--code-input-slot-font-size: var(--comp-code-input-slot-font-size-md)",
      "--code-input-slot-gap: var(--comp-code-input-slot-gap-md)",
      "--code-input-slot-inline-size: var(--comp-code-input-slot-inline-size-md)",
    ],
    message: "Code Input base must expose local aliases for slot size, font, gap, and inline size.",
  });
  requireIncludes({
    block: slotsBlock,
    text,
    packageCssFile,
    snippets: ["gap: var(--code-input-slot-gap, var(--comp-code-input-slot-gap-md))"],
    message: "Code Input slots container must consume the local gap alias.",
  });
  requireIncludes({
    block: slotBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--code-input-slot-font-size, var(--comp-code-input-slot-font-size-md))",
      "block-size: var(--code-input-slot-block-size)",
      "inline-size: var(--code-input-slot-inline-size)",
    ],
    message: "Code Input slot geometry and voice must consume local slot aliases.",
  });

  const densityContracts = [
    [smBlock, "--code-input-slot-gap: var(--comp-code-input-slot-gap-sm)", "Code Input sm density must set gap on the root so the slots container can inherit it."],
    [compactBlock, "--code-input-slot-gap: var(--comp-code-input-slot-gap-sm)", "Code Input compact variant must set gap on the root so the slots container can inherit it."],
    [lgBlock, "--code-input-slot-gap: var(--comp-code-input-slot-gap-md)", "Code Input lg density must set gap on the root so the slots container can inherit it."],
  ];
  for (const [block, snippet, message] of densityContracts) {
    requireIncludes({ block, text, packageCssFile, snippets: [snippet], message });
  }
  for (const staleSelector of [
    '.code-input[data-density="sm"] .code-input__slot',
    '.code-input[data-variant="compact"] .code-input__slot',
    '.code-input[data-density="lg"] .code-input__slot',
  ]) {
    if (blockFor(blocks, selectorKey, staleSelector)) {
      add("errors", packageCssFile, 1, "Code Input density aliases must live on the root, not on individual slots.");
    }
  }
  requireIncludes({
    block: digitBlock,
    text,
    packageCssFile,
    snippets: ["animation: code-digit-enter var(--comp-code-input-motion-enter-duration) var(--comp-code-input-motion-enter) both"],
    message: "Code Input digit enter motion must consume the component motion-enter alias.",
  });
}

module.exports = { checkCodeInputCssContract };
