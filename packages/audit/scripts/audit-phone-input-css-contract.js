const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkPhoneInputCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const phoneInputBlock = blocks.find((block) => block.body.includes("--comp-phone-input-flex-basis:"));
  const phoneInputInputBlock = blockFor(blocks, selectorKey, ".phone-input__input");
  const phoneCompactInputBlock = blockFor(blocks, selectorKey, ".phone-input[data-variant=\"compact\"] .phone-input__input");
  const phoneCompactBlock = blockFor(blocks, selectorKey, ".phone-input[data-variant=\"compact\"] .phone-input__control");

  requireIncludes({
    block: phoneCompactBlock,
    text,
    packageCssFile,
    snippets: ["--comp-field-control-size: var(--comp-phone-input-control-size-compact)"],
    message: "Phone Input compact variant must override the shared Field size alias.",
  });
  requireIncludes({
    block: phoneInputBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-phone-input-flex-basis: var(--component-phone-input-flex-basis)",
      "--comp-phone-input-flex-basis-compact: var(--component-phone-input-flex-basis-compact)",
      "--comp-phone-input-min-inline-size: var(--component-phone-input-min-inline-size)",
      "--comp-phone-input-min-inline-size-compact: var(--component-phone-input-min-inline-size-compact)",
    ],
    message: "Phone Input frame widths must flow through component Frame aliases instead of local control multipliers.",
  });
  requireIncludes({
    block: phoneInputInputBlock,
    text,
    packageCssFile,
    snippets: [
      "flex: 1 1 max(var(--comp-phone-input-flex-basis), var(--comp-phone-input-min-inline-size))",
      "max-inline-size: 100%",
      "min-inline-size: 0",
    ],
    message: "Phone Input field must use width aliases as preferred sizing without forcing mobile template overflow.",
  });
  requireIncludes({
    block: phoneCompactInputBlock,
    text,
    packageCssFile,
    snippets: ["flex-basis: max(var(--comp-phone-input-flex-basis-compact), var(--comp-phone-input-min-inline-size-compact))", "min-inline-size: 0"],
    message: "Phone Input compact field must use compact width aliases as preferred sizing without forcing mobile template overflow.",
  });
  const rawPhoneInputWidth = text.match(/--comp-phone-input-(?:flex-basis|min-inline-size)(?:-compact)?:\s*calc\(var\(--component-control-min-size\) \* [0-9.]+\)/);
  if (rawPhoneInputWidth) {
    add("errors", packageCssFile, lineNumber(text, rawPhoneInputWidth.index), "Phone Input widths must flow through Frame phone input roles instead of local control multipliers.");
  }
}

module.exports = { checkPhoneInputCssContract };
