const {
  add,
  fs,
  path,
  read,
  root,
} = require("./audit-context.js");
const { retiredSurfaceFindings } = require("./retired-surface-policy.js");

const retiredSurfaceRoots = [
  "package.json",
  "tsconfig.json",
  "packages/react/src",
  "packages/react/dist",
  "packages/components/src",
  "packages/components/test/smoke.test.mjs",
  "packages/components/styles/components.css",
  "packages/content/content/catalog",
  "packages/content/content/component-copy",
  "packages/content/content/component-contracts",
  "packages/content/content/pattern-contract-governance.json",
  "packages/content/content/pattern-backlog.json",
  "packages/content/content/pattern-copy",
  "packages/content/content/pattern-contracts",
  "packages/content/content/zip-template-parity",
  "packages/specs/specs/unison-system/artifacts",
  "packages/specs/specs/unison-system/meta",
].map((file) => path.join(root, file));

function listFiles(entry) {
  if (!fs.existsSync(entry)) return [];
  const stats = fs.statSync(entry);
  if (stats.isFile()) return [entry];
  if (!stats.isDirectory()) return [];
  return fs.readdirSync(entry, { withFileTypes: true }).flatMap((dirent) => {
    if (dirent.name === "node_modules") return [];
    return listFiles(path.join(entry, dirent.name));
  });
}

function isAuditableFile(file) {
  return /\.(?:css|js|ts|tsx|d\.ts|json|md)$/.test(file)
    || path.basename(file) === "package.json"
    || path.basename(file) === "tsconfig.json";
}

function checkRetiredSurfaceGovernance() {
  for (const file of retiredSurfaceRoots.flatMap(listFiles)) {
    if (!isAuditableFile(file)) continue;
    const source = read(file);
    for (const finding of retiredSurfaceFindings(source)) {
      add("errors", file, 1, finding.message);
    }
  }
}

module.exports = {
  checkRetiredSurfaceGovernance,
  retiredSurfaceRoots,
};
