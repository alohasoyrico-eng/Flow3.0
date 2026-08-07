const {
  fs,
  path,
  root,
  add,
  read,
} = require("./audit-context.js");

function checkComponentModules() {
  const indexFile = path.join(root, "packages/components/src/index.js");
  const index = read(indexFile);

  if (/^export function create/m.test(index)) {
    add("errors", indexFile, 1, "Public component index must stay declarative; React owns product component implementations.");
  }

  if (index.includes("./components/")) {
    add("errors", indexFile, 1, "Public component index must not re-export packages/components/src/components; use contracts, platforms, primitives, or React.");
  }

  const legacyComponentsDir = path.join(root, "packages/components/src/components");
  if (!fs.existsSync(legacyComponentsDir)) return;

  for (const file of walkFiles(legacyComponentsDir, (candidate) => /\.js$/.test(candidate))) {
    add(
      "errors",
      file,
      1,
      "packages/components/src/components is a retired DOM implementation boundary; product components must live in packages/react and metadata in packages/components/src/platforms."
    );
  }
}

function walkFiles(dir, matcher, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, matcher, output);
      continue;
    }
    if (matcher(fullPath)) output.push(fullPath);
  }
  return output;
}

module.exports = { checkComponentModules };
