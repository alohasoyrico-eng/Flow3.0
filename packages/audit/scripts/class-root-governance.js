const fs = require("fs");
const path = require("path");

function classRootTokensFromClassExpression(value) {
  return new Set([...classTokensFromClassExpression(value)].map((token) => token.split(/__|--/)[0]));
}

function classTokensFromClassExpression(value) {
  const literals = [...String(value).matchAll(/["'`]([^"'`]+)["'`]/g)].map((match) => match[1]);
  const source = literals.length ? literals.join(" ") : String(value);
  return new Set(source
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => /^[a-z][a-z0-9-]*(?:__[a-z0-9-]+|--[a-z0-9-]+)?$/.test(token)));
}

function packageCssClassRoots(root) {
  const cssFile = path.join(root, "packages/components/styles/components.css");
  if (!fs.existsSync(cssFile)) return new Set();
  const source = fs.readFileSync(cssFile, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const roots = new Set();
  let selectorStart = 0;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") {
      const selector = source.slice(selectorStart, index).trim();
      if (selector && !selector.startsWith("@")) {
        for (const match of selector.matchAll(/\.([a-z][a-z0-9-]*(?:__[a-z0-9-]+|--[a-z0-9-]+)?)/g)) {
          roots.add(match[1].split(/__|--/)[0]);
        }
      }
      continue;
    }
    if (char === "}") selectorStart = index + 1;
  }
  return roots;
}

module.exports = {
  classRootTokensFromClassExpression,
  classTokensFromClassExpression,
  packageCssClassRoots,
};
