const { fs, path, root, read } = require("./audit-context.js");

const reactSrcDir = path.join(root, "packages/react/src");
const reactInteractionTestFile = path.join(root, "packages/react/test/interaction.test.mjs");

function checkControlledReactCoverage({ add, componentFiles, contractsSource }) {
  checkControlledOpenCoverage({ add, componentFiles, contractsSource });
  checkControlledPropCoverage({ add, componentFiles, marker: "isValueControlled", prop: "value" });
  checkControlledPropCoverage({ add, componentFiles, marker: "isCheckedControlled", prop: "checked" });
  checkControlledPropCoverage({ add, componentFiles, marker: "isSelectedKeyControlled", prop: "selectedKey" });
  checkControlledPropCoverage({ add, componentFiles, marker: "isSortControlled", prop: "sortKey" });
  checkControlledPropCoverage({ add, componentFiles, marker: "isExpandedKeyControlled", prop: "expandedKey" });
  checkControlledPropCoverage({ add, componentFiles, marker: "isExpandedIdsControlled", prop: "expandedIds" });
  checkControlledPropCoverage({ add, componentFiles, marker: "isPageControlled", prop: "page" });
}

function checkControlledOpenCoverage({ add, componentFiles, contractsSource }) {
  const interactionSource = fs.existsSync(reactInteractionTestFile) ? read(reactInteractionTestFile) : "";
  const componentNames = new Set(componentFiles.map((file) => path.basename(file, ".js")));
  for (const match of contractsSource.matchAll(/^\s+([a-z][A-Za-z0-9]*):\s*\{([\s\S]*?)(?=^\s+[a-z][A-Za-z0-9]*:\s*\{|\n\};)/gm)) {
    const [, contractKey, body] = match;
    if (!body.includes('{ name: "open"') || !body.includes('{ name: "onOpenChange"')) continue;
    const componentName = pascal(contractKey);
    if (!componentNames.has(componentName)) continue;
    const componentRender = new RegExp(`render\\(React\\.createElement\\(${componentName}\\b`);
    const controlledRerender = new RegExp(`rerender${componentName}[\\s\\S]{0,900}\\bopen:\\s*true[\\s\\S]{0,900}rerender${componentName}[\\s\\S]{0,900}\\bopen:\\s*false`);
    if (!componentRender.test(interactionSource) || !controlledRerender.test(interactionSource)) {
      add("errors", reactInteractionTestFile, 1, `${componentName} exposes open/onOpenChange and must test controlled open rerender from true back to false.`);
    }
  }
}

function checkControlledPropCoverage({ add, componentFiles, marker, prop }) {
  const interactionSource = fs.existsSync(reactInteractionTestFile) ? read(reactInteractionTestFile) : "";
  for (const file of componentFiles) {
    const componentName = path.basename(file, ".js");
    const sourceFile = path.join(reactSrcDir, file);
    const source = read(sourceFile);
    if (!source.includes(marker)) continue;

    const controlledRerender = new RegExp(`rerender\\w*\\(React\\.createElement\\(${componentName}\\b[\\s\\S]{0,900}\\b${prop}:\\s*`);
    if (!controlledRerender.test(interactionSource)) {
      add("errors", reactInteractionTestFile, 1, `${componentName} declares ${marker} and must test external ${prop} rerender coverage.`);
    }
  }
}

function pascal(value) {
  const words = String(value).match(/[A-Z]?[a-z0-9]+|[A-Z]+(?![a-z])/g) ?? [String(value)];
  return words.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join("");
}

module.exports = { checkControlledReactCoverage };
