const {
  add,
  path,
  read,
  readJson,
  root,
  lineNumber,
} = require("./audit-context.js");

const packageCssFile = path.join(root, "packages/components/styles/components.css");
const motionRoleContractFile = path.join(root, "packages/audit/contracts/component-motion-role-contract.json");

const roleTokens = {
  state: ["--component-ease-state", "--component-duration-state"],
  press: ["--component-ease-press", "--component-duration-press"],
  enter: ["--component-ease-enter", "--component-duration-enter"],
  exit: ["--component-ease-exit", "--component-duration-exit"],
  move: ["--component-ease-move"],
  loading: ["--component-ease-loading-rhythm", "--component-loading-easing-rhythm", "--component-duration-loading", "--component-duration-shimmer", "--component-duration-pulse", "--component-loading-cycle-duration", "--component-loading-progress-duration", "--component-loading-pulse-duration"],
  continuous: ["--component-ease-linear", "--component-loading-easing-linear", "--component-duration-loading-spin", "--component-loading-spin-duration"],
};

const forbiddenDirectCurves = [
  "--component-ease-standard",
  "--component-ease-emphasis",
  "--component-ease-progress",
  "--component-duration-fast",
];

function selectorBelongsToComponent(selector, selectors) {
  return selectors.some((scope) => selector.includes(scope));
}

function cssBlocks(text) {
  const blocks = [];
  const pattern = /(?<selector>[^{}]+)\{(?<body>[^{}]*)\}/g;
  for (const match of text.matchAll(pattern)) {
    blocks.push({
      selector: match.groups.selector.trim(),
      body: match.groups.body,
      index: match.index,
    });
  }
  return blocks;
}

function declarations(text) {
  const output = new Map();
  const pattern = /(?<name>--[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/g;
  for (const match of text.matchAll(pattern)) {
    output.set(match.groups.name, match.groups.value.trim());
  }
  return output;
}

function isMotionBody(body) {
  return /\b(?:transition|animation)\s*:/.test(body);
}

function hasRole(blocks, role, declaredTokens) {
  const tokens = roleTokens[role] ?? [];
  return blocks.some((block) => {
    if (tokens.some((token) => block.body.includes(token))) return true;
    const usedTokens = [...block.body.matchAll(/var\((--[a-z0-9-]+)/g)].map((match) => match[1]);
    return usedTokens.some((usedToken) => {
      const value = declaredTokens.get(usedToken) ?? "";
      return tokens.some((token) => value.includes(token));
    });
  });
}

function checkPriorityComponentMotionRoles() {
  const contract = readJson(motionRoleContractFile);
  if (!contract?.components?.length) {
    add("errors", motionRoleContractFile, 1, "Component motion role contract must list the 1:1 reviewed component priority set.");
    return;
  }
  const css = read(packageCssFile);
  const blocks = cssBlocks(css);
  const declaredTokens = declarations(css);

  for (const component of contract.components) {
    const scopedBlocks = blocks.filter((block) => selectorBelongsToComponent(block.selector, component.selectors));
    const motionBlocks = scopedBlocks.filter((block) => isMotionBody(block.body));

    if (motionBlocks.length === 0 && component.requiredRoles.length > 0) {
      add("errors", packageCssFile, 1, `Motion role coverage for ${component.id} expected package motion blocks for: ${component.covers.join(", ")}.`);
      continue;
    }

    for (const role of component.requiredRoles) {
      if (!hasRole(scopedBlocks, role, declaredTokens)) {
        add("errors", packageCssFile, 1, `Motion role coverage for ${component.id} must include ${role} role tokens for: ${component.covers.join(", ")}.`);
      }
    }

    for (const block of motionBlocks) {
      for (const token of forbiddenDirectCurves) {
        if (!block.body.includes(token)) continue;
        add("errors", packageCssFile, lineNumber(css, block.index), `Motion role coverage for ${component.id} must use semantic motion roles instead of ${token}.`);
      }
    }
  }
}

module.exports = { checkPriorityComponentMotionRoles };
