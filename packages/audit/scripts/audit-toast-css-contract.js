const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkToastCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".toast");
  const smBlock = blockFor(blocks, selectorKey, ".toast[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".toast[data-density=\"lg\"]");
  const actionBlock = blockFor(blocks, selectorKey, ".toast .toast__action");
  const dismissBlock = blockFor(blocks, selectorKey, ".toast__dismiss");
  const focusBlock = blockFor(blocks, selectorKey, ".toast__action:focus-visible");
  const reducedBlock = blockFor(blocks, selectorKey, "@media (prefers-reduced-motion: reduce)\n  .toast");
  const keyframes = text.match(/@keyframes\s+toast-enter\s*{[\s\S]*?\n}/)?.[0] ?? "";
  const localActionSize = /--comp-toast-action-size:\s*calc\(var\(--component-control-min-size\)\s*[+-][^;]+;/.exec(text);
  if (localActionSize) {
    add("errors", packageCssFile, lineNumber(text, localActionSize.index), "Toast action sizing must flow through shared Frame feedback action roles instead of local control-size math.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-toast-inline-size-sm: var(--component-toast-inline-size-sm)",
      "--comp-toast-inline-size-md: var(--component-toast-inline-size-md)",
      "--comp-toast-inline-size-lg: var(--component-toast-inline-size-lg)",
      "--comp-toast-motion-duration: var(--component-duration-state)",
      "--comp-toast-enter-transform:",
      "--comp-toast-rest-transform:",
      "--comp-toast-action-size: var(--component-feedback-action-size)",
      "--comp-toast-dismiss-size:",
      "animation: toast-enter var(--comp-toast-motion-enter-duration) var(--comp-toast-motion-enter-ease) both",
      "transition: var(--comp-toast-transition)",
    ],
    message: "Toast root must expose component-owned density, action, dismiss, and lifecycle motion aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-toast-inline-size: var(--comp-toast-inline-size-sm)",
      "--comp-toast-padding-block: var(--comp-toast-padding-block-sm)",
      "--comp-toast-gap: var(--comp-toast-gap-sm)",
    ],
    message: "Toast sm density must resolve through Toast aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-toast-inline-size: var(--comp-toast-inline-size-lg)",
      "--comp-toast-padding-block: var(--comp-toast-padding-block-lg)",
      "--comp-toast-gap: var(--comp-toast-gap-lg)",
    ],
    message: "Toast lg density must resolve through Toast aliases.",
  });
  requireIncludes({
    block: actionBlock,
    text,
    packageCssFile,
    snippets: ["min-block-size: var(--comp-toast-action-size)", "padding-inline: var(--comp-toast-action-padding-inline)"],
    message: "Toast action sizing must consume Toast aliases instead of Button internals.",
  });
  requireIncludes({
    block: dismissBlock,
    text,
    packageCssFile,
    snippets: ["block-size: var(--comp-toast-dismiss-size)", "font-size: var(--comp-toast-dismiss-icon-size)", "inline-size: var(--comp-toast-dismiss-size)", "opacity: var(--comp-toast-dismiss-opacity)"],
    message: "Toast dismiss sizing must consume Toast aliases instead of Icon Button internals.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--comp-toast-focus-width) solid var(--comp-toast-focus-color)", "outline-offset: var(--comp-toast-focus-offset)"],
    message: "Toast action focus must consume Toast accessibility aliases.",
  });
  if (reducedBlock && !reducedBlock.body.includes("transition: opacity var(--comp-toast-motion-exit-duration) var(--comp-toast-motion-exit-ease)")) {
    add("errors", packageCssFile, lineNumber(text, reducedBlock.index), "Toast reduced motion must consume Toast exit motion aliases.");
  }
  if (!keyframes.includes("transform: var(--comp-toast-enter-transform)") || !keyframes.includes("transform: var(--comp-toast-rest-transform)")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("@keyframes toast-enter")), "Toast enter keyframes must consume Toast transform aliases.");
  }
  for (const stale of ["--button-size-", "--button-padding-", "--icon-button-size-", "--icon-button-icon-size-"]) {
    if (actionBlock?.body.includes(stale) || dismissBlock?.body.includes(stale)) {
      add("errors", packageCssFile, 1, `Toast CSS must not override composed component internals "${stale}".`);
    }
  }
  if (/--comp-toast-inline-size-(?:sm|md|lg):\s*min\(100%,\s*calc\(var\(--sys-frame-content-dialog/.test(text)) {
    add("errors", packageCssFile, 1, "Toast density widths must route through component-owned inline-size aliases.");
  }
}

module.exports = { checkToastCssContract };
