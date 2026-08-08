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

function checkAuditEventCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/AuditEvent.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".audit-event");
  const densitySmBlock = blockFor(blocks, selectorKey, ".audit-event[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".audit-event[data-density=\"lg\"]");
  const hoverBlock = blockFor(blocks, selectorKey, ".audit-event[data-state=\"hover\"],.audit-event:hover");
  const focusBlock = blockFor(blocks, selectorKey, ".audit-event[data-state=\"focus\"],.audit-event:focus-visible");
  const disabledBlock = blockFor(blocks, selectorKey, ".audit-event[data-state=\"disabled\"]");
  const iconBlock = blockFor(blocks, selectorKey, ".audit-event__icon");
  const contentBlock = blockFor(blocks, selectorKey, ".audit-event__content");
  const metaBlock = blockFor(blocks, selectorKey, ".audit-event__meta");
  const titleBlock = blockFor(blocks, selectorKey, ".audit-event strong");
  const mutedBlock = blockFor(blocks, selectorKey, ".audit-event p,.audit-event small,.audit-event__time");
  const descriptionBlock = blockFor(blocks, selectorKey, ".audit-event p");
  const metaTextBlock = blockFor(blocks, selectorKey, ".audit-event small,.audit-event__time");
  const timeBlock = blockFor(blocks, selectorKey, ".audit-event__time");
  const statusBlock = blockFor(blocks, selectorKey, ".audit-event em");

  if (!source.includes("forwardRef") || !source.includes("flowToneProps(statusTone)") || !source.includes("flowDensityProps(resolvedDensity)")) {
    add("errors", sourceFile, 1, "AuditEvent must expose real React ref, tone/state, and density props.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-audit-event-bg: var(--component-color-surface)",
      "--comp-audit-event-border-width: var(--component-border-width)",
      "--comp-audit-event-display: var(--component-display-grid)",
      "--comp-audit-event-grid: auto minmax(0, 1fr)",
      "--comp-audit-event-radius: var(--component-radius-md)",
      "--comp-audit-event-width:",
      "align-items: var(--comp-audit-event-align)",
      "background: var(--comp-audit-event-bg)",
      "border: var(--comp-audit-event-border-width) solid var(--comp-audit-event-border)",
      "border-radius: var(--comp-audit-event-radius)",
      "box-shadow: var(--comp-audit-event-depth)",
      "color: var(--comp-audit-event-fg)",
      "display: var(--comp-audit-event-display)",
      "grid-template-columns: var(--comp-audit-event-grid)",
      "inline-size: var(--comp-audit-event-width)",
      "padding: var(--comp-audit-event-padding-block) var(--comp-audit-event-padding-inline)",
    ],
    message: "AuditEvent root must own frame, density, voice, meta, status, and state aliases.",
  });
  for (const [block, message] of [
    [densitySmBlock, "AuditEvent small density must set spacing, marker, icon, and title aliases."],
    [densityLgBlock, "AuditEvent large density must set spacing, marker, icon, and title aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-audit-event-padding-block:",
        "--comp-audit-event-padding-inline:",
        "--comp-audit-event-gap:",
        "--comp-audit-event-marker-size:",
        "--comp-audit-event-icon-size:",
        "--comp-audit-event-title-size:",
      ],
      message,
    });
  }
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-audit-event-hover-bg)",
      "border-color: var(--comp-audit-event-hover-border)",
      "transform: var(--comp-audit-event-hover-transform)",
    ],
    message: "AuditEvent hover state must consume hover aliases.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-audit-event-focus-width) solid var(--comp-audit-event-focus-color)",
      "outline-offset: var(--comp-audit-event-focus-offset)",
    ],
    message: "AuditEvent focus state must consume accessibility aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: [
      "border-color: var(--comp-audit-event-disabled-border)",
      "color: var(--comp-audit-event-disabled-fg)",
      "opacity: var(--comp-audit-event-disabled-opacity)",
    ],
    message: "AuditEvent disabled state must consume disabled aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-audit-event-marker-align)",
      "background: var(--comp-audit-event-tone-soft)",
      "border: var(--comp-audit-event-border-width) solid var(--comp-audit-event-marker-border)",
      "color: var(--comp-audit-event-foreground)",
      "display: var(--comp-audit-event-marker-display)",
      "font-size: var(--comp-audit-event-icon-size)",
      "block-size: var(--comp-audit-event-marker-size)",
      "inline-size: var(--comp-audit-event-marker-size)",
    ],
    message: "AuditEvent icon must consume marker aliases.",
  });
  requireIncludes({
    block: contentBlock,
    text,
    packageCssFile,
    snippets: ["display: var(--comp-audit-event-content-display)", "gap: var(--comp-audit-event-content-gap)"],
    message: "AuditEvent content must consume content layout aliases.",
  });
  requireIncludes({
    block: metaBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-audit-event-meta-align)",
      "display: var(--comp-audit-event-meta-display)",
      "flex-wrap: var(--comp-audit-event-meta-wrap)",
      "gap: var(--comp-audit-event-meta-gap-block) var(--comp-audit-event-meta-gap-inline)",
    ],
    message: "AuditEvent meta row must consume meta aliases.",
  });
  requireIncludes({
    block: titleBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-audit-event-fg)",
      "font-family: var(--comp-audit-event-title-family)",
      "font-size: var(--comp-audit-event-title-size)",
      "font-weight: var(--comp-audit-event-title-weight)",
      "line-height: var(--comp-audit-event-title-line-height)",
    ],
    message: "AuditEvent title must consume voice aliases.",
  });
  requireIncludes({
    block: mutedBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-audit-event-muted)", "margin: 0"],
    message: "AuditEvent secondary copy must consume muted alias.",
  });
  requireIncludes({
    block: descriptionBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--comp-audit-event-description-size)",
      "font-weight: var(--comp-audit-event-description-weight)",
      "line-height: var(--comp-audit-event-description-line-height)",
    ],
    message: "AuditEvent description must consume description voice aliases.",
  });
  requireIncludes({
    block: metaTextBlock,
    text,
    packageCssFile,
    snippets: [
      "font-family: var(--comp-audit-event-meta-family)",
      "font-size: var(--comp-audit-event-meta-size)",
      "font-weight: var(--comp-audit-event-meta-weight)",
      "line-height: var(--comp-audit-event-meta-line-height)",
    ],
    message: "AuditEvent meta text must consume meta voice aliases.",
  });
  requireIncludes({
    block: timeBlock,
    text,
    packageCssFile,
    snippets: ["white-space: var(--comp-audit-event-time-white-space)"],
    message: "AuditEvent time must consume wrapping alias.",
  });
  requireIncludes({
    block: statusBlock,
    text,
    packageCssFile,
    snippets: [
      "align-self: var(--comp-audit-event-status-align)",
      "background: var(--comp-audit-event-tone-soft)",
      "border: var(--comp-audit-event-border-width) solid var(--comp-audit-event-status-border)",
      "color: var(--comp-audit-event-foreground)",
      "font-size: var(--comp-audit-event-status-size)",
      "font-style: var(--comp-audit-event-status-style)",
      "font-weight: var(--comp-audit-event-status-weight)",
      "padding: var(--comp-audit-event-status-padding-block) var(--comp-audit-event-status-padding-inline)",
      "white-space: var(--comp-audit-event-time-white-space)",
    ],
    message: "AuditEvent status pill must consume status aliases.",
  });
}

module.exports = { checkAuditEventCssContract };
