const { fs, path, root, read, add, lineNumber } = require("./audit-context.js");

const docsCandidates = [
  path.join(root, "apps/docs"),
  path.join(root, "../FlowDocs/apps/docs"),
];

const docsDir = docsCandidates.find((candidate) => fs.existsSync(candidate));

const componentDemoModules = [
  "choice-demo-interactions.js",
  "display-demo-interactions.js",
  "overlay-demo-interactions.js",
  "progress-indicator-demo-interactions.js",
  "slider-demo-interactions.js",
  "stateful-component-interactions.js",
  "toast-demo-interactions.js",
  "tooltip-demo-interactions.js",
];

const componentDemoFunctions = {
  "component-demo-interactions.js": [
    "setupTextAreaDemos",
    "setupIconButtonDemos",
    "setupCardDemos",
    "setupSliderDemos",
  ],
};

const forbiddenPatterns = [
  [/\.addEventListener\s*\(/, "must not attach DOM listeners for React-owned component demos"],
  [/\.setAttribute\s*\(/, "must not mutate attributes for React-owned component demos"],
  [/\.removeAttribute\s*\(/, "must not mutate attributes for React-owned component demos"],
  [/\.replaceChildren\s*\(/, "must not rewrite React-owned component content"],
  [/\.textContent\s*=/, "must not rewrite React-owned component text"],
  [/\.hidden\s*=/, "must not hide/show React-owned component nodes"],
  [/\.remove\s*\(/, "must not remove React-owned component nodes"],
  [/\.append\s*\(/, "must not append React-owned component nodes"],
  [/\.tabIndex\s*=/, "must not mutate React-owned focus state"],
  [/\.checked\s*=/, "must not mutate React-owned checked state"],
  [/\.indeterminate\s*=/, "must not mutate React-owned indeterminate state"],
  [/\.dispatchEvent\s*\(/, "must not dispatch synthetic events for React-owned component demos"],
  [/window\.setTimeout\s*\(/, "must not schedule DOM state resets for React-owned component demos"],
  [/requestAnimationFrame\s*\(/, "must not schedule DOM state sync for React-owned component demos"],
  [/\.dataset\.(?!(?:demoReady|statefulReady|progressReady)\b)[A-Za-z0-9_$]+\s*=/, "must not write component state through docs dataset fields"],
];

function checkDocsComponentDemoOwnership() {
  if (!docsDir) {
    add("errors", root, 1, "Docs component demo ownership audit requires apps/docs or sibling FlowDocs/apps/docs.");
    return;
  }

  for (const fileName of componentDemoModules) {
    checkSourceRegion(path.join(docsDir, fileName), null);
  }

  for (const [fileName, functionNames] of Object.entries(componentDemoFunctions)) {
    const file = path.join(docsDir, fileName);
    const source = read(file);
    for (const functionName of functionNames) {
      const block = functionBlock(source, functionName);
      if (!block) {
        add("errors", file, 1, `${functionName} must exist so docs can register React-owned component demos without owning behavior.`);
        continue;
      }
      checkSourceRegion(file, block);
    }
  }
}

function checkSourceRegion(file, region) {
  const source = region?.text ?? read(file);
  const baseOffset = region?.start ?? 0;
  for (const [pattern, message] of forbiddenPatterns) {
    const match = source.match(pattern);
    if (!match) continue;
    add("errors", file, lineNumber(read(file), baseOffset + match.index), `${path.basename(file)} ${message}.`);
  }
}

function functionBlock(source, functionName) {
  const signature = new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*\\{`, "m");
  const match = signature.exec(source);
  if (!match) return null;
  const start = match.index;
  let depth = 0;
  for (let index = match.index + match[0].length - 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return { start, text: source.slice(start, index + 1) };
    }
  }
  return null;
}

module.exports = { checkDocsComponentDemoOwnership };
