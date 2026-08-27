const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkFileUploadCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".file-upload");
  const smBlock = blockFor(blocks, selectorKey, ".file-upload[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".file-upload[data-density=\"lg\"]");
  const dropzoneBlock = blockFor(blocks, selectorKey, ".file-upload__dropzone");
  const itemBlock = blockFor(blocks, selectorKey, ".file-upload__item");
  const itemSizeBlock = blockFor(blocks, selectorKey, ".file-upload__item-size");

  const fileUploadBlocks = blocks.filter((block) => selectorKey(block).includes(".file-upload"));
  const unresolvedStrongBorder = fileUploadBlocks.find((block) => block.body.includes("--component-border-width-strong"));
  if (unresolvedStrongBorder) {
    add("errors", packageCssFile, lineNumber(text, unresolvedStrongBorder.index), "FileUpload must use existing Frame border aliases; --component-border-width-strong is not part of the cascade.");
  }
  const nestedSurfaceBlock = fileUploadBlocks.find((block) => block.body.includes("--component-depth-panel") || block.body.includes("--component-depth-raised"));
  if (nestedSurfaceBlock) {
    add("errors", packageCssFile, lineNumber(text, nestedSurfaceBlock.index), "FileUpload dropzone/list must not create nested overlay elevation.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-file-upload-bg: var(--component-energy-surface-sunken)",
      "--comp-file-upload-border: var(--component-color-border)",
      "--comp-file-upload-radius: var(--component-radius-control)",
      "--comp-file-upload-dropzone-min-block: calc(var(--component-frame-size-lg) * 3)",
      "--comp-file-upload-label-size: var(--component-density-label-size-md)",
      "--comp-file-upload-description-size: var(--component-density-helper-size-md)",
      "--comp-file-upload-item-size-size: var(--component-density-counter-size-md)",
      "--comp-file-upload-drag-transform: var(--component-transform-scale-hover)",
      "--comp-file-upload-motion-duration: var(--component-duration-state)",
      "gap: var(--comp-file-upload-gap)",
    ],
    message: "FileUpload root must own ZIP dropzone/list aliases through existing surface, frame, density, and voice tokens.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-file-upload-dropzone-min-block: calc(var(--component-frame-size-md) * 3)",
      "--comp-file-upload-label-size: var(--component-density-label-size-sm)",
      "--comp-file-upload-description-size: var(--component-density-helper-size-sm)",
      "--comp-file-upload-item-size-size: var(--component-density-counter-size-sm)",
    ],
    message: "FileUpload sm density must scale label, helper, counter, and dropzone frame through component aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-file-upload-dropzone-min-block: calc(var(--component-frame-size-lg) * 4)",
      "--comp-file-upload-label-size: var(--component-density-label-size-lg)",
      "--comp-file-upload-description-size: var(--component-density-helper-size-lg)",
      "--comp-file-upload-item-size-size: var(--component-density-counter-size-lg)",
    ],
    message: "FileUpload lg density must scale label, helper, counter, and dropzone frame through component aliases.",
  });
  requireIncludes({
    block: dropzoneBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-file-upload-bg)",
      "border: var(--component-border-width) dashed var(--comp-file-upload-border)",
      "border-radius: var(--comp-file-upload-radius)",
      "min-block-size: var(--comp-file-upload-dropzone-min-block)",
      "padding: var(--comp-file-upload-dropzone-padding-block) var(--comp-file-upload-dropzone-padding-inline)",
      "transform var(--comp-file-upload-motion-duration) var(--component-ease-spring)",
    ],
    message: "FileUpload dropzone must render the ZIP dashed upload affordance with governed frame tokens.",
  });
  requireIncludes({
    block: itemBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-file-upload-item-bg)",
      "border: var(--component-border-width) solid var(--comp-file-upload-item-border)",
      "border-radius: var(--comp-file-upload-item-radius)",
      "min-block-size: var(--comp-file-upload-item-min-block)",
    ],
    message: "FileUpload selected file rows must use governed surface, border, radius, and frame aliases.",
  });
  requireIncludes({
    block: itemSizeBlock,
    text,
    packageCssFile,
    snippets: [
      "font-family: var(--component-font-family-mono)",
      "font-size: var(--comp-file-upload-item-size-size)",
    ],
    message: "FileUpload file metadata must use mono counter voice tokens.",
  });
}

module.exports = { checkFileUploadCssContract };
