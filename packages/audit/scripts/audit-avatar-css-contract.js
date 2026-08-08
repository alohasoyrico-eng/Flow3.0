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

function checkAvatarCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/Avatar.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".avatar");
  const imgBlock = blockFor(blocks, selectorKey, ".avatar img");
  const statusBlock = blockFor(blocks, selectorKey, ".avatar__status");
  const busyBlock = blockFor(blocks, selectorKey, ".avatar[data-state=\"busy\"] .avatar__status");
  const disabledBlock = blockFor(blocks, selectorKey, ".avatar[data-state=\"disabled\"]");

  if (
    !source.includes("forwardRef") ||
    !source.includes("flowDensityProps(resolvedDensity)") ||
    !source.includes("flowStateProps(resolvedState)") ||
    !source.includes("avatarPlatformContract")
  ) {
    add("errors", sourceFile, 1, "Avatar must expose a real React ref contract, platform contract, density, and state props.");
  }
  if (!source.includes("if (!sourceName) return null;") || !source.includes("aria-label\": sourceName")) {
    add("errors", sourceFile, 1, "Avatar must avoid empty shells and expose an accessible label.");
  }
  if (!source.includes("React.createElement(\"img\", { src, alt: sourceName })") || !source.includes("avatar__initials") || !source.includes("avatar__status")) {
    add("errors", sourceFile, 1, "Avatar must keep image, initials, and status as the single React implementation surface.");
  }
  if (/\.avatar\[data-color-index=/.test(text) || source.includes("\"data-color-index\"")) {
    add("errors", packageCssFile, text.includes(".avatar[data-color-index=") ? lineNumber(text, text.indexOf(".avatar[data-color-index=")) : 1, "Avatar identity color must flow through --comp-avatar-identity-* variables instead of enumerated data-color-index CSS rules.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-avatar-font-weight: var(--sys-voice-weight-bold)",
      "--comp-avatar-letter-spacing: var(--sys-voice-letter-spacing-wide)",
      "--comp-avatar-identity-bg: var(--comp-avatar-identity-action-bg)",
      "--comp-avatar-identity-fg: var(--comp-avatar-identity-default-fg)",
      "--comp-avatar-align: center",
      "--comp-avatar-display: inline-flex",
      "--comp-avatar-radius: var(--component-radius-pill)",
      "--comp-avatar-shadow: var(--component-depth-low-medium)",
      "--comp-avatar-motion-duration: var(--component-duration-state)",
      "--comp-avatar-status-border: var(--comp-avatar-status-border-width) solid var(--comp-avatar-status-border-color)",
      "--comp-avatar-disabled-opacity: var(--component-opacity-disabled)",
      "align-items: var(--comp-avatar-align)",
      "border-radius: var(--comp-avatar-radius)",
      "box-shadow: var(--comp-avatar-shadow)",
      "display: var(--comp-avatar-display)",
      "font-weight: var(--comp-avatar-font-weight)",
      "letter-spacing: var(--comp-avatar-letter-spacing)",
      "transition:",
      "opacity var(--comp-avatar-motion-duration) var(--comp-avatar-motion-ease)",
      "transform var(--comp-avatar-motion-press-duration) var(--comp-avatar-motion-press-ease)",
    ],
    message: "Avatar root must own and consume aliases for voice, frame, depth, density, status, disabled state, and motion.",
  });

  for (const [selector, message] of [
    [".avatar--sm", "Avatar small size must route through the Avatar size alias."],
    [".avatar--lg", "Avatar large size must route through the Avatar size alias."],
    [".avatar--xl", "Avatar xl size must route through the Avatar size alias."],
    [".avatar[data-density=\"sm\"]", "Avatar small density must route through the Avatar size alias."],
    [".avatar[data-density=\"lg\"]", "Avatar large density must route through the Avatar size alias."],
  ]) {
    requireIncludes({
      block: blockFor(blocks, selectorKey, selector),
      text,
      packageCssFile,
      snippets: ["--comp-avatar-size:"],
      message,
    });
  }

  requireIncludes({
    block: imgBlock,
    text,
    packageCssFile,
    snippets: [
      "border-radius: var(--comp-avatar-img-radius)",
      "block-size: var(--comp-avatar-img-size)",
      "inline-size: var(--comp-avatar-img-size)",
      "object-fit: var(--comp-avatar-img-fit)",
    ],
    message: "Avatar image must consume Avatar image aliases instead of direct layout values.",
  });
  requireIncludes({
    block: statusBlock,
    text,
    packageCssFile,
    snippets: [
      "border: var(--comp-avatar-status-border)",
      "border-radius: var(--comp-avatar-status-radius)",
      "inset-block-end: var(--comp-avatar-status-inset-block-end)",
      "inset-inline-end: var(--comp-avatar-status-inset-inline-end)",
      "position: var(--comp-avatar-status-position)",
    ],
    message: "Avatar status marker must consume Avatar status frame aliases.",
  });
  requireIncludes({
    block: busyBlock,
    text,
    packageCssFile,
    snippets: ["animation: var(--comp-avatar-status-animation-name) var(--comp-avatar-status-animation-duration) var(--comp-avatar-status-animation-ease) infinite"],
    message: "Avatar busy status must consume Avatar motion aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-avatar-disabled-bg)",
      "color: var(--comp-avatar-disabled-fg)",
      "opacity: var(--comp-avatar-disabled-opacity)",
    ],
    message: "Avatar disabled state must consume Avatar disabled aliases.",
  });
}

module.exports = { checkAvatarCssContract };
