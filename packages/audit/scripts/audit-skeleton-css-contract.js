const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkSkeletonCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".skeleton");
  const boneBlock = blockFor(blocks, selectorKey, ".skeleton__bone");
  const titleBlock = blockFor(blocks, selectorKey, ".skeleton--title");
  const titleBoneBlock = blockFor(blocks, selectorKey, ".skeleton--title .skeleton__bone");
  const circleBlock = blockFor(blocks, selectorKey, ".skeleton--circle");
  const pillBlock = blockFor(blocks, selectorKey, ".skeleton--pill");
  const rowBlock = blockFor(blocks, selectorKey, ".skeleton--row");
  const tableBlock = blockFor(blocks, selectorKey, ".skeleton--table");
  const tableRowBlock = blockFor(blocks, selectorKey, ".skeleton--table .skeleton__row");
  const tableBoneBlock = blockFor(blocks, selectorKey, ".skeleton--table .skeleton__bone");
  const pausedBlock = blockFor(blocks, selectorKey, ".skeleton[data-state=\"paused\"] .skeleton__bone");
  const loadedBlock = blockFor(blocks, selectorKey, ".skeleton[data-state=\"loaded\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".skeleton[data-state=\"disabled\"]");
  const secondLineBlock = blocks.find((block) => selectorKey(block).includes(".skeleton--text .skeleton__bone:nth-child(2)"));
  const lastLineBlock = blocks.find((block) => selectorKey(block).includes(".skeleton--text .skeleton__bone:last-child"));
  const shortCellBlock = blockFor(blocks, selectorKey, ".skeleton--table .skeleton__row:nth-child(even) .skeleton__cell:last-child");
  const mediumCellBlock = blockFor(blocks, selectorKey, ".skeleton--table .skeleton__row:nth-child(odd) .skeleton__cell:nth-child(2)");

  if (text.includes("--skeleton-")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--skeleton-")), "Skeleton must not use short --skeleton-* aliases; use component-scoped --comp-skeleton-current-* aliases.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-skeleton-current-width: var(--comp-skeleton-width)",
      "--comp-skeleton-current-columns: 4",
      "--comp-skeleton-bg: var(--component-loading-skeleton-surface)",
      "--comp-skeleton-highlight: var(--component-loading-skeleton-highlight)",
      "--comp-skeleton-shimmer-duration: var(--component-duration-shimmer)",
      "--comp-skeleton-disabled-opacity: var(--sys-disabled-opacity)",
      "gap: var(--comp-skeleton-gap)",
      "color: var(--comp-skeleton-fg)",
      "transition: opacity var(--comp-skeleton-state-duration) var(--comp-skeleton-state-ease)",
    ],
    message: "Skeleton root must bridge public sizing API through component-scoped loading, state, and rhythm aliases.",
  });
  requireIncludes({
    block: boneBlock,
    text,
    packageCssFile,
    snippets: [
      "background-image: var(--comp-skeleton-gradient)",
      "background-size: var(--comp-skeleton-background-size)",
      "border-radius: var(--comp-skeleton-radius)",
      "block-size: var(--comp-skeleton-bone-block-size)",
      "animation: skeleton-shimmer var(--comp-skeleton-shimmer-duration) var(--comp-skeleton-shimmer-easing) infinite",
    ],
    message: "Skeleton bone must consume Skeleton surface, frame, and loading motion aliases.",
  });
  requireIncludes({
    block: titleBlock,
    text,
    packageCssFile,
    snippets: ["--comp-skeleton-current-width: var(--comp-skeleton-title-width)", "--comp-skeleton-current-height: var(--comp-skeleton-title-block-size)"],
    message: "Skeleton title width must resolve through a Skeleton alias.",
  });
  requireIncludes({
    block: titleBoneBlock,
    text,
    packageCssFile,
    snippets: ["block-size: var(--comp-skeleton-current-height)", "border-radius: var(--comp-skeleton-title-radius)"],
    message: "Skeleton title bone must consume Skeleton title aliases.",
  });
  requireIncludes({
    block: circleBlock,
    text,
    packageCssFile,
    snippets: ["--comp-skeleton-current-width: var(--comp-skeleton-circle-width)"],
    message: "Skeleton circle width must resolve through a Skeleton alias.",
  });
  requireIncludes({
    block: pillBlock,
    text,
    packageCssFile,
    snippets: ["--comp-skeleton-current-width: var(--comp-skeleton-pill-width)"],
    message: "Skeleton pill width must resolve through a Skeleton alias.",
  });
  requireIncludes({
    block: rowBlock,
    text,
    packageCssFile,
    snippets: ["grid-template-columns: var(--comp-skeleton-row-template)", "min-block-size: var(--comp-skeleton-row-min-block)"],
    message: "Skeleton row layout must consume Skeleton row aliases.",
  });
  requireIncludes({
    block: tableBlock,
    text,
    packageCssFile,
    snippets: ["--comp-skeleton-current-width: var(--comp-skeleton-table-width)", "gap: var(--comp-skeleton-table-gap)"],
    message: "Skeleton table layout must consume Skeleton table aliases.",
  });
  requireIncludes({
    block: tableRowBlock,
    text,
    packageCssFile,
    snippets: ["grid-template-columns: repeat(var(--comp-skeleton-current-columns), minmax(0, 1fr))", "gap: var(--comp-skeleton-table-row-gap)", "min-block-size: var(--comp-skeleton-table-row-min-block)"],
    message: "Skeleton table row must consume Skeleton table row aliases.",
  });
  requireIncludes({
    block: tableBoneBlock,
    text,
    packageCssFile,
    snippets: ["--comp-skeleton-current-height: var(--comp-skeleton-table-cell-block-size)", "block-size: var(--comp-skeleton-current-height)"],
    message: "Skeleton table cell must consume Skeleton table cell alias.",
  });
  requireIncludes({
    block: pausedBlock,
    text,
    packageCssFile,
    snippets: ["--comp-skeleton-bg: var(--comp-skeleton-paused-bg)", "animation-play-state: paused"],
    message: "Skeleton paused state must consume Skeleton paused aliases.",
  });
  requireIncludes({
    block: loadedBlock,
    text,
    packageCssFile,
    snippets: ["opacity: var(--comp-skeleton-loaded-opacity)"],
    message: "Skeleton loaded state must consume Skeleton loaded opacity alias.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-skeleton-disabled-fg)", "opacity: var(--comp-skeleton-disabled-opacity)"],
    message: "Skeleton disabled state must consume Skeleton disabled aliases.",
  });
  requireIncludes({
    block: secondLineBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-skeleton-line-compact-inline)"],
    message: "Skeleton compact line width must consume Skeleton line alias.",
  });
  requireIncludes({
    block: lastLineBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-skeleton-line-short-inline)"],
    message: "Skeleton short line width must consume Skeleton line alias.",
  });
  requireIncludes({
    block: shortCellBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-skeleton-cell-short-inline)"],
    message: "Skeleton short table cell width must consume Skeleton cell alias.",
  });
  requireIncludes({
    block: mediumCellBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-skeleton-cell-medium-inline)"],
    message: "Skeleton medium table cell width must consume Skeleton cell alias.",
  });
}

module.exports = { checkSkeletonCssContract };
