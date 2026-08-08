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

function checkStationPinCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/StationPin.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".station-pin");
  const pointerBlock = blockFor(blocks, selectorKey, ".station-pin::after");
  const densitySmBlock = blockFor(blocks, selectorKey, ".station-pin[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".station-pin[data-density=\"lg\"]");
  const clusterBlock = blockFor(blocks, selectorKey, ".station-pin[data-variant=\"cluster\"]");
  const hoverBlock = blockFor(blocks, selectorKey, ".station-pin:hover,.station-pin[data-state=\"hover\"]");
  const focusBlock = blockFor(blocks, selectorKey, ".station-pin:focus-visible,.station-pin[data-state=\"focus\"]");
  const selectedBlock = blockFor(blocks, selectorKey, ".station-pin[data-state=\"selected\"]");
  const unavailableBlock = blockFor(blocks, selectorKey, ".station-pin[data-state=\"unavailable\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".station-pin:disabled");
  const markerBlock = blockFor(blocks, selectorKey, ".station-pin__marker");
  const markerIconBlock = blockFor(blocks, selectorKey, ".station-pin__marker[data-kind=\"icon\"]");

  if (!source.includes("createMapsPrimitive") || !source.includes("data-map-primitive") || !source.includes("React.createElement(\n    \"button\"")) {
    add("errors", sourceFile, 1, "StationPin must use the maps primitive and real button semantics instead of a fake marker control.");
  }
  const localMinBlock = /--comp-station-pin-min-block-size:\s*calc\(var\(--component-control-min-size\)\s*[+-][^;]+;/.exec(text);
  if (localMinBlock) {
    add("errors", packageCssFile, lineNumber(text, localMinBlock.index), "StationPin block sizing must flow through shared Frame map pin roles instead of local control-size math.");
  }
  for (const snippet of [
    "--comp-station-pin-min-block-size: var(--component-map-pin-min-block-size-md)",
    "--comp-station-pin-min-block-size: var(--component-map-pin-min-block-size-sm)",
    "--comp-station-pin-min-block-size: var(--component-map-pin-min-block-size-lg)",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, "StationPin density block aliases must be defined from shared Frame map pin roles.");
      break;
    }
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-station-pin-align: center",
      "--comp-station-pin-border-width: var(--component-border-width)",
      "--comp-station-pin-cursor: pointer",
      "--comp-station-pin-depth: var(--component-depth-pill)",
      "--comp-station-pin-display: inline-flex",
      "--comp-station-pin-font-family: var(--component-font-family-mono)",
      "--comp-station-pin-marker-size:",
      "--comp-station-pin-min-block-size:",
      "--comp-station-pin-pointer-shadow: var(--component-station-pin-pointer-shadow)",
      "--comp-station-pin-pointer-size:",
      "--comp-station-pin-radius: var(--component-radius-pill)",
      "align-items: var(--comp-station-pin-align)",
      "background: var(--comp-station-pin-bg)",
      "border: var(--comp-station-pin-border-width) solid var(--comp-station-pin-border)",
      "border-radius: var(--comp-station-pin-radius)",
      "box-shadow: var(--comp-station-pin-depth)",
      "cursor: var(--comp-station-pin-cursor)",
      "display: var(--comp-station-pin-display)",
      "font-family: var(--comp-station-pin-font-family)",
      "font-size: var(--comp-station-pin-font-size)",
      "min-block-size: var(--comp-station-pin-min-block-size)",
      "padding: var(--comp-station-pin-frame-padding-block) var(--comp-station-pin-frame-padding-inline)",
    ],
    message: "StationPin root must own map marker frame, density, voice, pointer, and state aliases.",
  });
  requireIncludes({
    block: pointerBlock,
    text,
    packageCssFile,
    snippets: [
      "border-inline: var(--comp-station-pin-pointer-size) solid transparent",
      "border-block-start: var(--comp-station-pin-pointer-size) solid var(--comp-station-pin-bg)",
      "filter: var(--comp-station-pin-pointer-shadow)",
      "inset-block-start: var(--comp-station-pin-pointer-inset-block-start)",
      "inset-inline-start: var(--comp-station-pin-pointer-inset-inline-start)",
      "transform: var(--comp-station-pin-pointer-transform)",
    ],
    message: "StationPin pointer must consume pointer aliases instead of hardcoded geometry.",
  });
  if (/--comp-station-pin-pointer-shadow:\s*drop-shadow\([^;]*var\(--sys-frame-border-thin/.test(text)) {
    add("errors", packageCssFile, 1, "StationPin pointer shadow must route through the component pointer shadow alias.");
  }
  for (const [block, message] of [
    [densitySmBlock, "StationPin small density must set marker, pointer, frame, font, and touch target aliases."],
    [densityLgBlock, "StationPin large density must set marker, pointer, frame, and touch target aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-station-pin-marker-size:",
        "--comp-station-pin-marker-glyph-size:",
        "--comp-station-pin-pointer-size:",
        "--comp-station-pin-frame-gap:",
        "--comp-station-pin-frame-padding-block:",
        "--comp-station-pin-frame-padding-inline:",
        "--comp-station-pin-min-block-size:",
      ],
      message,
    });
  }
  requireIncludes({
    block: clusterBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-station-pin-bg: var(--sys-map-pin-cluster-background)",
      "--comp-station-pin-fg: var(--sys-map-pin-cluster-foreground)",
      "--comp-station-pin-border: var(--sys-map-pin-cluster-background)",
      "--comp-station-pin-marker-fg: var(--sys-map-pin-cluster-foreground)",
    ],
    message: "StationPin cluster variant must set map pin aliases.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: [
      "border-color: var(--comp-station-pin-hover-border)",
      "box-shadow: var(--comp-station-pin-hover-depth)",
      "transform: var(--comp-station-pin-hover-transform)",
    ],
    message: "StationPin hover state must consume hover aliases.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-station-pin-focus-width) solid var(--comp-station-pin-focus-color)",
      "outline-offset: var(--comp-station-pin-focus-offset)",
    ],
    message: "StationPin focus state must consume accessibility aliases.",
  });
  requireIncludes({
    block: selectedBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-station-pin-bg: var(--sys-map-pin-selected-background)",
      "--comp-station-pin-fg: var(--sys-map-pin-selected-foreground)",
      "box-shadow: var(--comp-station-pin-selected-depth)",
      "transform: var(--comp-station-pin-selected-transform)",
    ],
    message: "StationPin selected state must consume selected aliases.",
  });
  requireIncludes({
    block: unavailableBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-station-pin-bg: var(--sys-color-surface-raised)",
      "--comp-station-pin-fg: var(--sys-color-text-muted)",
      "--comp-station-pin-marker-fg: var(--sys-color-text-muted)",
    ],
    message: "StationPin unavailable state must set unavailable aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-station-pin-disabled-cursor)", "opacity: var(--comp-station-pin-disabled-opacity)"],
    message: "StationPin disabled state must consume disabled aliases.",
  });
  requireIncludes({
    block: markerBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-station-pin-marker-fg)",
      "flex: 0 0 var(--comp-station-pin-marker-size)",
      "block-size: var(--comp-station-pin-marker-size)",
      "inline-size: var(--comp-station-pin-marker-size)",
      "min-inline-size: var(--comp-station-pin-marker-size)",
    ],
    message: "StationPin marker must consume marker size and foreground aliases.",
  });
  requireIncludes({
    block: markerIconBlock,
    text,
    packageCssFile,
    snippets: ["font-family: var(--sys-font-icon)", "font-size: var(--comp-station-pin-marker-glyph-size)"],
    message: "StationPin icon marker must consume iconography aliases.",
  });
}

module.exports = { checkStationPinCssContract };
