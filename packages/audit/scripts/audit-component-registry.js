const {
  add,
  path,
  read,
  requiredComponentContracts,
  root,
} = require("./audit-context.js");

const registryFile = path.join(root, "packages/components/src/registry.js");
const indexFile = path.join(root, "packages/components/src/index.js");
const removedDocsAdapterFiles = [
  "apps/docs/component-demo-adapter.js",
  "apps/docs/component-core-demo-adapter.js",
  "apps/docs/component-surface-demo-adapter.js",
  "apps/docs/component-table-demo-adapter.js",
].map((file) => path.join(root, file));
const docsRendererFile = path.join(root, "apps/docs/component-demo.js");

const forbiddenPackageRegistryApi = [
  "componentRegistry",
  "renderComponentDemo",
  "renderComponent(",
  "listComponents",
  "hasComponent",
];

function checkComponentRegistry() {
  const registrySource = read(registryFile);
  const indexSource = read(indexFile);
  const docsRendererSource = read(docsRendererFile);

  if (!registrySource.includes("export function componentDemoProps")) {
    add("errors", registryFile, 1, "Package component registry must only own componentDemoProps normalization for React demos.");
  }

  for (const forbidden of forbiddenPackageRegistryApi) {
    if (registrySource.includes(forbidden)) {
      add("errors", registryFile, 1, `Package component registry must not expose transitional DOM demo API: ${forbidden}.`);
    }
  }

  if (!indexSource.includes("componentDemoProps")) {
    add("errors", indexFile, 1, "Design System package index must export componentDemoProps.");
  }

  for (const forbidden of forbiddenPackageRegistryApi) {
    if (indexSource.includes(forbidden)) {
      add("errors", indexFile, 1, `Design System package index must not export transitional DOM demo API: ${forbidden}.`);
    }
  }

  if (!docsRendererSource.includes("componentDemoProps")) {
    add("errors", docsRendererFile, 1, "Docs component demo renderer must consume componentDemoProps from the Design System package.");
  }

  if (!docsRendererSource.includes("docs-demo-error")) {
    add("errors", docsRendererFile, 1, "Docs component demo renderer must show a visible error when a React demo is missing.");
  }

  for (const forbidden of ["renderComponentDemo", "renderComponent(", "componentRegistry"]) {
    if (docsRendererSource.includes(forbidden)) {
      add("errors", docsRendererFile, 1, `Docs component demo renderer must not use transitional DOM demo API: ${forbidden}.`);
    }
  }

  if (/import\s+\{[^}]*create[A-Z]/.test(docsRendererSource) || /\bcreate[A-Z][A-Za-z0-9_]*\(/.test(docsRendererSource.replace(/\bdocument\.create[A-Z][A-Za-z0-9_]*\(/g, ""))) {
    add("errors", docsRendererFile, 1, "Docs component demo renderer must not import or call create* factories directly.");
  }

  const docsRendererAuditSource = docsRendererSource.replace(/reactIsland\("([^"]+)"/g, 'data-react-component="$1"');
  for (const component of requiredComponentContracts) {
    if (!docsRendererAuditSource.includes(`data-react-component="${component}"`)) {
      add("errors", docsRendererFile, 1, `Docs demo renderer must mount ${component} through a React island.`);
    }
    if (!docsRendererSource.includes(`if (component === "${component}")`)) {
      add("errors", docsRendererFile, 1, `Docs demo renderer must short-circuit ${component} before the missing-demo error.`);
    }
  }

  for (const file of removedDocsAdapterFiles) {
    if (require("fs").existsSync(file)) {
      add("errors", file, 1, "Docs component adapters are no longer allowed; consume apps/docs/component-demo.js and React islands.");
    }
  }
}

module.exports = { checkComponentRegistry };
