const { add, lineNumber } = require("./audit-context.js");
const fs = require("fs");
const path = require("path");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkCountrySelectorCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/CountrySelector.tsx");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : path.join(sourceRoot, "packages/react/src/CountrySelector.js");
  const demoFile = path.join(sourceRoot, "packages/audit/scripts/build-local-react-qa-demo.mjs");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const demo = fs.existsSync(demoFile) ? fs.readFileSync(demoFile, "utf8") : "";
  const countryDemo = demo.match(/"country-selector":\s*\{[\s\S]*?\n  "phone-input":/)?.[0] ?? "";
  const countrySelectorBlock = blockFor(blocks, selectorKey, ".country-selector");
  const triggerBlock = blockFor(blocks, selectorKey, ".country-selector__trigger");
  const inlineTriggerBlock = blockFor(blocks, selectorKey, ".select-control--inline .select-control__trigger,.country-selector.select-control--inline .country-selector__trigger,.phone-input__country-trigger");
  const countryInlineTriggerBlock = blockFor(blocks, selectorKey, ".country-selector.select-control--inline .country-selector__trigger,.phone-input__country-trigger");
  const countryInlineListboxBlock = blockFor(blocks, selectorKey, ".country-selector.select-control--inline .country-selector__overlay");
  const countrySemanticListboxBlock = blockFor(blocks, selectorKey, ".country-selector__overlay .country-selector__listbox");
  const countryInlineOptionBlock = blockFor(blocks, selectorKey, ".country-selector.select-control--inline .country-selector__option,.phone-input__country-option");
  const optionBodyBlock = blockFor(blocks, selectorKey, ".country-selector__option-body");
  const searchFieldBlock = blockFor(blocks, selectorKey, ".country-selector__search-field");
  const optionBlock = blockFor(blocks, selectorKey, ".select-control__option,.country-selector__option,.phone-input__country-option");

  requireIncludes({
    block: countrySelectorBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-country-selector-inline-listbox-max-inline-size: var(--component-country-selector-inline-listbox-max-inline-size)",
      "--comp-country-selector-inline-listbox-inline-size: var(--component-country-selector-inline-listbox-inline-size)",
      "--comp-country-selector-inline-trigger-padding-start: var(--component-space-xs)",
      "--comp-country-selector-inline-trigger-padding-end: var(--component-space-xs)",
      "--comp-country-selector-search-radius: calc(var(--component-control-frame-radius-field) - var(--component-frame-space-micro))",
    ],
    message: "Country Selector listbox frame and search radius must consume Frame/component aliases instead of local values.",
  });

  const rawCountryInline = text.match(/--comp-country-selector-inline-listbox-(?:max-inline-size|inline-size):\s*(?:calc\(var\(--component-control-min-size\) \* [0-9.]+\)|min\([^;]*100vw)/);
  if (rawCountryInline) {
    add("errors", packageCssFile, lineNumber(text, rawCountryInline.index), "Country Selector inline listbox sizes must flow through Frame listbox roles instead of local control multipliers or viewport clamps.");
  }
  for (const [block, message] of [
    [triggerBlock, "Country Selector trigger must include border in exact Field/Select frame."],
    [inlineTriggerBlock, "Country Selector inline trigger must include border in exact Field/Select frame."],
    [optionBlock, "Country Selector options must include border in exact option-row frame."],
  ]) {
    requireIncludes({ block, text, packageCssFile, snippets: ["box-sizing: border-box"], message });
  }
  if (text.includes(".country-selector__search-input")) {
    add("errors", packageCssFile, 1, "Country Selector search must compose the Flow Input search variant instead of owning a hardcoded search input selector.");
  }
  if (!source.includes("import { Input } from \"./Input.js\"") || !source.includes("variant: \"search\"") || !source.includes("labelHidden: true")) {
    add("errors", sourceFile, 1, "Country Selector searchable mode must compose Input variant=\"search\" with hidden visual label instead of rendering a native input directly.");
  }
  if (countryDemo.includes('label: "Open country"') || countryDemo.includes('state: "open"')) {
    add("errors", demoFile, 1, "Country Selector runtime demo must not mount an initially open overlay during 1:1 review.");
  }
  if (!source.includes("const triggerRef = useRef") || !source.includes("triggerRef.current?.focus()")) {
    add("errors", sourceFile, 1, "Country Selector must return focus to its combobox trigger after Escape or selection from the searchable overlay.");
  }
  if (!source.includes("const searchRef = useRef") || !source.includes('event.key === "Tab" && open && !isSearchTarget && searchable') || !source.includes("searchRef.current?.focus()")) {
    add("errors", sourceFile, 1, "Country Selector must let Tab move from the open trigger into the composed search input before Tab closes the overlay from search.");
  }
  requireIncludes({
    block: searchFieldBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-field-control-size: var(--comp-country-selector-search-min-block)",
      "--comp-input-surface-bg: var(--comp-country-selector-search-bg)",
      "--comp-input-surface-border: var(--comp-country-selector-search-border)",
      "--comp-input-padding-x: var(--comp-country-selector-option-padding-x)",
    ],
    message: "Country Selector search slot must adapt the composed Input through component aliases.",
  });
  requireIncludes({
    block: countryInlineTriggerBlock,
    text,
    packageCssFile,
    snippets: ["padding: 0 var(--comp-country-selector-inline-trigger-padding-end) 0 var(--comp-country-selector-inline-trigger-padding-start)"],
    message: "Country Selector inline trigger must use symmetric component padding aliases.",
  });
  requireIncludes({
    block: countryInlineListboxBlock,
    text,
    packageCssFile,
    snippets: [
      "inline-size: var(--comp-country-selector-inline-listbox-inline-size)",
      "max-inline-size: var(--comp-country-selector-inline-listbox-max-inline-size)",
      "min-inline-size: max-content",
    ],
    message: "Country Selector inline listbox must shrink to content while keeping the Frame max-inline role.",
  });
  requireIncludes({
    block: countrySemanticListboxBlock,
    text,
    packageCssFile,
    snippets: ["display: grid", "inline-size: 100%", "min-inline-size: 0"],
    message: "Country Selector semantic listbox must stay inside the overlay surface instead of owning surface geometry.",
  });
  requireIncludes({
    block: countryInlineOptionBlock,
    text,
    packageCssFile,
    snippets: ["grid-template-columns: auto max-content auto", "justify-content: start"],
    message: "Country Selector inline options must keep labels aligned to start instead of centering in an oversized surface.",
  });
  requireIncludes({
    block: optionBodyBlock,
    text,
    packageCssFile,
    snippets: ["justify-self: start", "text-align: start"],
    message: "Country Selector option body must align labels to the start across inline consumers.",
  });
}

module.exports = { checkCountrySelectorCssContract };
