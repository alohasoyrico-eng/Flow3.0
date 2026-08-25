const fs = require("fs");
const path = require("path");
const { add, lineNumber, root } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkCodeInputCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const baseBlock = blockFor(blocks, selectorKey, ".code-input");
  const slotsBlock = blockFor(blocks, selectorKey, ".code-input .code-input__slots");
  const slotBlock = blockFor(blocks, selectorKey, ".code-input .code-input__slot");
  const controlBlock = blockFor(blocks, selectorKey, ".code-input .code-input__control");
  const smBlock = blockFor(blocks, selectorKey, ".code-input[data-density=\"sm\"]");
  const compactBlock = blockFor(blocks, selectorKey, ".code-input[data-variant=\"compact\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".code-input[data-density=\"lg\"]");
  const digitBlock = blockFor(blocks, selectorKey, ".code-input__digit");
  const successBlock = blockFor(blocks, selectorKey, ".code-input[data-state=\"success\"] .code-input__slot[data-filled=\"true\"]");
  const errorControlBlock = blockFor(blocks, selectorKey, ".code-input[data-state=\"error\"] .code-input__control");
  const frameTokensFile = path.join(root, "packages/tokens/source/foundations/frame.tokens.json");
  const frameTokens = JSON.parse(fs.readFileSync(frameTokensFile, "utf8"));
  const codeSlotBlockScale = [
    ["sys-frame-content-code-slot-block-sm", "{sys-space-11}"],
    ["sys-frame-content-code-slot-block-md", "{sys-space-12}"],
    ["sys-frame-content-code-slot-block-lg", "calc(var(--sys-space-11) + var(--sys-space-md))"],
  ];
  for (const [token, expected] of codeSlotBlockScale) {
    if (frameTokens[token]?.$value !== expected) {
      add("errors", frameTokensFile, 1, "Code Input block slot frame tokens must stay on the 44/48/56 multiple-of-4 scale and must not mix border width into size.");
    }
  }
  const codeSlotInlineScale = [
    ["sys-frame-content-code-slot-inline-sm", "{sys-space-11}"],
    ["sys-frame-content-code-slot-inline-md", "{sys-space-12}"],
    ["sys-frame-content-code-slot-inline-lg", "calc(var(--sys-space-11) + var(--sys-space-md))"],
  ];
  for (const [token, expected] of codeSlotInlineScale) {
    if (frameTokens[token]?.$value !== expected) {
      add("errors", frameTokensFile, 1, "Code Input inline slot frame tokens must mirror block tokens so OTP slots stay square across density.");
    }
  }

  if (text.includes("--code-input-slot-")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--code-input-slot-")), "Code Input must not use short --code-input-slot-* aliases; use --comp-code-input-current-slot-* resolved aliases.");
  }
  const rawSlotSize = /--comp-code-input-slot-(?:block|inline)-size-(?:sm|md|lg):\s*(?:calc\(var\(--component-control-min-size\)[^;]+|var\(--component-control-min-size\));/.exec(text);
  if (rawSlotSize) {
    add("errors", packageCssFile, lineNumber(text, rawSlotSize.index), "Code Input slot geometry must flow through shared Frame code slot roles instead of local control-size calculations.");
  }
  for (const snippet of [
    "--comp-code-input-slot-block-size-sm: var(--component-code-slot-block-size-sm)",
    "--comp-code-input-slot-block-size-md: var(--component-code-slot-block-size-md)",
    "--comp-code-input-slot-block-size-lg: var(--component-code-slot-block-size-lg)",
    "--comp-code-input-slot-inline-size-sm: var(--component-code-slot-inline-size-sm)",
    "--comp-code-input-slot-inline-size-md: var(--component-code-slot-inline-size-md)",
    "--comp-code-input-slot-inline-size-lg: var(--component-code-slot-inline-size-lg)",
    "--comp-code-input-slot-font-size-sm: var(--component-font-size-title-md)",
    "--comp-code-input-slot-font-size-md: var(--component-font-size-data-lg)",
      "--comp-code-input-slot-font-size-lg: var(--component-font-size-display-sm)",
      "--comp-code-input-radius: var(--component-control-frame-radius-field)",
      "--comp-code-input-active-shadow: var(--component-depth-focus-ring-soft)",
      "--comp-code-input-active-transform: var(--component-transform-lift-sm)",
      "--comp-code-input-font-weight: var(--component-font-weight-light)",
      "--comp-code-input-caret-motion-duration: var(--component-duration-loop)",
      "--comp-code-input-caret-motion-ease: var(--component-ease-state)",
      "--comp-code-input-success-bg: color-mix(in srgb, var(--component-color-success) 18%, var(--component-color-surface))",
      "--comp-code-input-success-flash-bg: color-mix(in srgb, var(--component-color-success) 28%, var(--component-color-surface))",
      "--comp-code-input-success-border: color-mix(in srgb, var(--component-color-success) 64%, var(--component-color-border))",
      "--comp-code-input-success-shadow: 0 0 0 var(--component-border-width-indicator) color-mix(in srgb, var(--component-color-success) 24%, transparent)",
      "--comp-code-input-success-motion-duration: var(--component-duration-slow)",
      "--comp-code-input-success-motion-ease: var(--component-ease-enter)",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, "Code Input slot geometry must expose component aliases backed by shared Frame code slot roles.");
    }
  }

  requireIncludes({
    block: baseBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-code-input-radius: var(--component-control-frame-radius-field)",
      "--comp-code-input-current-slot-block-size: var(--comp-code-input-slot-block-size-md)",
      "--comp-code-input-current-slot-font-size: var(--comp-code-input-slot-font-size-md)",
      "--comp-code-input-current-slot-gap: var(--comp-code-input-slot-gap-md)",
      "--comp-code-input-current-slot-inline-size: var(--comp-code-input-slot-inline-size-md)",
      "grid-template-columns: minmax(0, 1fr)",
    ],
    message: "Code Input base must expose component-scoped current aliases and a shrinkable grid track for mobile template containers.",
  });
  requireIncludes({
    block: controlBlock,
    text,
    packageCssFile,
    snippets: ["grid-template-columns: minmax(0, 1fr)", "inline-size: fit-content", "max-inline-size: 100%"],
    message: "Code Input control must use intrinsic OTP slot geometry while staying inside mobile template containers.",
  });
  requireIncludes({
    block: slotsBlock,
    text,
    packageCssFile,
    snippets: ["gap: var(--comp-code-input-current-slot-gap)", "inline-size: auto", "max-inline-size: 100%"],
    message: "Code Input slots container must consume the component-scoped current gap alias without stretching OTP slots.",
  });
  requireIncludes({
    block: slotBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--comp-code-input-current-slot-font-size)",
      "font-weight: var(--comp-code-input-font-weight)",
      "font-synthesis-weight: none",
      "font-variant-numeric: tabular-nums",
      "block-size: var(--comp-code-input-current-slot-block-size)",
      "box-sizing: border-box",
      "transform var(--comp-code-input-motion-duration) var(--comp-code-input-motion-ease)",
      "flex: 0 1 var(--comp-code-input-current-slot-inline-size)",
      "inline-size: var(--comp-code-input-current-slot-inline-size)",
      "min-block-size: var(--comp-code-input-current-slot-block-size)",
      "min-inline-size: 0",
    ],
    message: "Code Input slot geometry and voice must consume component-scoped current slot aliases without forcing mobile template overflow.",
  });

  const densityContracts = [
    [
      smBlock,
      ["--component-control-frame-radius-field: var(--component-control-frame-radius-field-sm)", "--comp-code-input-current-slot-gap: var(--comp-code-input-slot-gap-sm)"],
      "Code Input sm density must set current radius and gap on the root so the slots can inherit field geometry.",
    ],
    [
      compactBlock,
      ["--component-control-frame-radius-field: var(--component-control-frame-radius-field-sm)", "--comp-code-input-current-slot-gap: var(--comp-code-input-slot-gap-sm)"],
      "Code Input compact variant must set current radius and gap on the root so the slots can inherit field geometry.",
    ],
    [
      lgBlock,
      ["--component-control-frame-radius-field: var(--component-control-frame-radius-field-lg)", "--comp-code-input-current-slot-gap: var(--comp-code-input-slot-gap-md)"],
      "Code Input lg density must set current radius and gap on the root so the slots can inherit field geometry.",
    ],
  ];
  for (const [block, snippets, message] of densityContracts) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
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
  const activeSlotBlock = blockFor(blocks, selectorKey, ".code-input__slot[data-active=\"true\"]");
  const caretBlock = blockFor(blocks, selectorKey, ".code-input__caret");
  requireIncludes({
    block: activeSlotBlock,
    text,
    packageCssFile,
    snippets: ["box-shadow: var(--comp-code-input-active-shadow)", "transform: var(--comp-code-input-active-transform)"],
    message: "Code Input active slot must express focus momentum through component aliases.",
  });
  requireIncludes({
    block: caretBlock,
    text,
    packageCssFile,
    snippets: ["animation: code-caret-pulse var(--comp-code-input-caret-motion-duration) var(--comp-code-input-caret-motion-ease) infinite"],
    message: "Code Input caret must expose tokenized pulse motion.",
  });
  if (!text.includes("@keyframes code-caret-pulse")) {
    add("errors", packageCssFile, 1, "Code Input must define a caret pulse keyframe for the active empty slot.");
  }
  requireIncludes({
    block: successBlock,
    text,
    packageCssFile,
    snippets: [
      "animation: code-success-fill var(--comp-code-input-success-motion-duration) var(--comp-code-input-success-motion-ease) both",
      "background: var(--comp-code-input-success-bg)",
      "border-color: var(--comp-code-input-success-border)",
      "box-shadow: var(--comp-code-input-success-shadow)",
    ],
    message: "Code Input success feedback must use tokenized semantic momentum instead of reusing only the local complete state.",
  });
  requireIncludes({
    block: errorControlBlock,
    text,
    packageCssFile,
    snippets: ["animation: code-invalid var(--comp-code-input-motion-invalid-duration) var(--comp-code-input-motion-ease)"],
    message: "Code Input error feedback must keep the tokenized invalid shake on the control wrapper.",
  });
  if (!text.includes("--comp-code-input-motion-invalid-duration: var(--component-duration-slow)")) {
    add("errors", packageCssFile, 1, "Code Input invalid shake must use slow semantic feedback timing so the error gesture is perceptible.");
  }
  if (!text.includes("@keyframes code-success-fill")) {
    add("errors", packageCssFile, 1, "Code Input must define a success fill keyframe for validated completion feedback.");
  }
  if (!text.includes("background: var(--comp-code-input-success-flash-bg)")) {
    add("errors", packageCssFile, 1, "Code Input success momentum must include a visible semantic flash before settling.");
  }
  if (!text.includes("@keyframes code-invalid") || !text.includes("var(--comp-code-input-invalid-shift)")) {
    add("errors", packageCssFile, 1, "Code Input invalid shake must be tokenized through --comp-code-input-invalid-shift.");
  }
}

module.exports = { checkCodeInputCssContract };
