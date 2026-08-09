#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const auditRequire = createRequire(import.meta.url);
const { goldComponents } = auditRequire("./audit-context.js");
const {
  allowedClassRootsForReactComponent,
  ownerClassRootForReactComponent,
} = auditRequire("./audit-anti-duplication.js");
const { componentCssContractCoverage } = auditRequire("./audit-component-css-contracts.js");
const { packageCssRootInventory } = auditRequire("./class-root-governance.js");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "consumer-install-"));
const cacheDir = path.join(tempRoot, "npm-cache");
let packedTarball = "";
const forbiddenInheritedDomProps = [
  "contentEditable",
  "dangerouslySetInnerHTML",
  "style",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
];

try {
  const { tarball, pack } = packFlow();
  packedTarball = tarball;
  auditPackedTarball(pack);
  const consumerDir = path.join(tempRoot, "consumer");
  fs.mkdirSync(consumerDir, { recursive: true });
  writeConsumerPackage(consumerDir, tarball);
  run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], consumerDir, {
    npm_config_cache: cacheDir,
  });
  writeConsumerScreen(consumerDir);
  run("node", ["screen.mjs"], consumerDir);
  writeConsumerCssEntrypoint(consumerDir);
  run("node", ["css-entrypoint.mjs"], consumerDir);
  writeConsumerRefRuntime(consumerDir);
  run("node", ["ref-runtime.mjs"], consumerDir);
  writeConsumerInteractionRuntime(consumerDir);
  run("node", ["interaction-runtime.mjs"], consumerDir);
  writeConsumerTypes(consumerDir);
  run(path.join(root, "node_modules/.bin/tsc"), ["--project", "tsconfig.json"], consumerDir);
  auditInstalledPackage(consumerDir);
  console.log(JSON.stringify({
    status: "pass",
    check: "consumer install",
    package: "@alohasoyrico-eng/flow",
    consumerDir,
  }, null, 2));
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
  if (packedTarball) fs.rmSync(packedTarball, { force: true });
}

function packFlow() {
  const result = run("npm", ["pack", "--json", "--ignore-scripts"], root, {
    npm_config_cache: cacheDir,
  });
  const pack = JSON.parse(result.stdout)[0];
  const tarball = path.join(root, pack.filename);
  if (!fs.existsSync(tarball)) {
    throw new Error(`npm pack did not create ${pack.filename}.`);
  }
  return { tarball, pack };
}

function auditPackedTarball(pack) {
  const rootPackage = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const paths = new Set((pack.files ?? []).map((file) => file.path));
  if (pack.name !== rootPackage.name) {
    throw new Error(`Packed package name mismatch: expected ${rootPackage.name}, received ${pack.name}`);
  }
  if (pack.version !== rootPackage.version) {
    throw new Error(`Packed package version mismatch: expected ${rootPackage.version}, received ${pack.version}`);
  }
  const publicFileAllowlist = rootPackage.files ?? [];
  const publicPackageReadmeAllowlist = new Set(
    publicFileAllowlist
      .filter((entry) => entry.startsWith("packages/"))
      .map((entry) => entry.split("/").slice(0, 2).join("/"))
      .map((entry) => `${entry}/README.md`),
  );
  const undeclaredFiles = [...paths].filter(
    (file) =>
      file !== "package.json" &&
      !publicPackageReadmeAllowlist.has(file) &&
      !publicFileAllowlist.some((entry) => file === entry || file.startsWith(`${entry}/`)),
  );
  if (undeclaredFiles.length) {
    throw new Error(
      `Packed package includes files outside package.json files allowlist: ${undeclaredFiles.slice(0, 30).join(", ")}`,
    );
  }
  const requiredPaths = new Set([
    "package.json",
    "README.md",
    "RELEASE.md",
    "START.md",
    "CHANGELOG.md",
    "packages/tokens/tokens.json",
    "packages/tokens/styles/tokens.css",
    "packages/components/styles/components.css",
    "packages/components/src/contracts.js",
    "packages/components/src/platforms/index.js",
    "packages/react/dist/index.js",
    "packages/react/dist/index.d.ts",
  ]);
  for (const componentId of goldComponents) {
    const componentName = pascalCase(componentId);
    requiredPaths.add(`packages/react/dist/${componentName}.js`);
    requiredPaths.add(`packages/react/dist/${componentName}.d.ts`);
  }
  for (const target of Object.values(rootPackage.exports ?? {}).flatMap(exportTargets)) {
    if (!target.startsWith("./")) continue;
    const fileTarget = target.replace(/^\.\//, "");
    if (!fileTarget.includes("*")) {
      requiredPaths.add(fileTarget);
      continue;
    }
    const [prefix, suffix = ""] = fileTarget.split("*");
    const matches = [...paths].filter((file) => file.startsWith(prefix) && file.endsWith(suffix));
    if (!matches.length) requiredPaths.add(fileTarget);
    for (const match of matches) requiredPaths.add(match);
  }

  const missing = [...requiredPaths].filter((file) => !paths.has(file));
  if (missing.length) {
    throw new Error(`Packed package is missing required public artifacts: ${missing.slice(0, 30).join(", ")}`);
  }
  const filesByPath = new Map((pack.files ?? []).map((file) => [file.path, file]));
  const undersizedDocs = ["README.md", "RELEASE.md", "START.md", "CHANGELOG.md"].filter(
    (file) => (filesByPath.get(file)?.size ?? 0) < 1000,
  );
  if (undersizedDocs.length) {
    throw new Error(`Packed package includes public docs that look incomplete: ${undersizedDocs.join(", ")}`);
  }

  const forbiddenPrefixes = [
    "apps/",
    "docs/",
    "node_modules/",
    "packages/audit/",
    "packages/react/src/",
    "repo-split-output/",
  ];
  const forbidden = [...paths].filter((file) => forbiddenPrefixes.some((prefix) => file.startsWith(prefix)));
  if (forbidden.length) {
    throw new Error(`Packed package includes internal artifacts: ${forbidden.slice(0, 30).join(", ")}`);
  }

  const reactSourceFiles = [...paths].filter((file) => file.startsWith("packages/react/") && !file.startsWith("packages/react/dist/"));
  if (reactSourceFiles.length) {
    throw new Error(`Packed React package must only include dist artifacts: ${reactSourceFiles.slice(0, 30).join(", ")}`);
  }
}

function writeConsumerPackage(consumerDir, tarball) {
  const packageJson = {
    type: "module",
    private: true,
    dependencies: {
      "@alohasoyrico-eng/flow": `file:${tarball}`,
      "@types/react": `file:${path.join(root, "node_modules/@types/react")}`,
      "@types/react-dom": `file:${path.join(root, "node_modules/@types/react-dom")}`,
      react: `file:${path.join(root, "node_modules/react")}`,
      "react-dom": `file:${path.join(root, "node_modules/react-dom")}`,
    },
  };
  fs.writeFileSync(path.join(consumerDir, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
}

function writeConsumerScreen(consumerDir) {
  const reactSubpathAssertions = goldComponents.map((componentId) => ({
    componentId,
    packagePath: `@alohasoyrico-eng/flow/react/${componentId}`,
    exportName: pascalCase(componentId),
  }));
  const platformContractAssertions = goldComponents.map((componentId) => ({
    componentId,
    exportName: `${camelCase(componentId)}PlatformContract`,
  }));
  const forbiddenComponentFactories = goldComponents.flatMap((componentId) => {
    const componentName = pascalCase(componentId);
    return [`create${componentName}`, `hydrate${componentName}`];
  });
  const source = `
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, Card, Input, Table } from "@alohasoyrico-eng/flow/react";
import { Dialog } from "@alohasoyrico-eng/flow/react/dialog";
import { componentContracts } from "@alohasoyrico-eng/flow/components/contracts";

const require = createRequire(import.meta.url);
for (const exportedPath of [
  "@alohasoyrico-eng/flow/tokens.json",
  "@alohasoyrico-eng/flow/tokens/styles.css",
  "@alohasoyrico-eng/flow/components/styles.css",
  "@alohasoyrico-eng/flow/components",
  "@alohasoyrico-eng/flow/components/platforms",
]) {
  assert.ok(require.resolve(exportedPath), \`Expected package export to resolve: \${exportedPath}\`);
}
const tokenContract = require("@alohasoyrico-eng/flow/tokens.json");
assert.equal(tokenContract.format, "flow-token-contract@1");
assert.ok(tokenContract.compatibleWith.includes("style-dictionary"));
assert.ok(Object.keys(tokenContract.tokens).length >= 1000);

const tokenCss = fs.readFileSync(require.resolve("@alohasoyrico-eng/flow/tokens/styles.css"), "utf8");
const componentCss = fs.readFileSync(require.resolve("@alohasoyrico-eng/flow/components/styles.css"), "utf8");
assert.match(tokenCss, /--sys-color-surface:/);
assert.match(tokenCss, /--sys-density-control-height:/);
for (const expectedContract of [
  "--comp-button-bg-primary:",
  "--comp-card-bg:",
  "--comp-field-control-size:",
  "--comp-table-bg:",
  ".button[data-density=\\"sm\\"]",
  ".card[data-density=\\"lg\\"]",
  ".field[data-density=\\"sm\\"]",
  ".dialog[data-density=\\"lg\\"]",
  ".table[data-density=\\"sm\\"]",
]) {
  assert.ok(componentCss.includes(expectedContract), \`Expected installed component CSS contract: \${expectedContract}\`);
}

const reactBarrel = await import("@alohasoyrico-eng/flow/react");
const componentsSurface = await import("@alohasoyrico-eng/flow/components");
const platformSurface = await import("@alohasoyrico-eng/flow/components/platforms");
const reactSubpathAssertions = ${JSON.stringify(reactSubpathAssertions, null, 2)};
assert.equal(typeof componentsSurface.createChartsPrimitive, "function");
assert.equal(typeof componentsSurface.createMapsPrimitive, "function");
assert.equal(typeof componentsSurface.componentDemoProps, "function");
for (const exportName of ${JSON.stringify(forbiddenComponentFactories, null, 2)}) {
  assert.equal(componentsSurface[exportName], undefined, \`Installed components surface must not expose product component factory \${exportName}\`);
}
for (const { componentId, exportName } of ${JSON.stringify(platformContractAssertions, null, 2)}) {
  assert.ok(platformSurface[exportName], \`Expected installed platform surface to export \${exportName} for \${componentId}\`);
}
for (const { componentId, packagePath, exportName } of reactSubpathAssertions) {
  const module = await import(packagePath);
  const platformContractName = \`\${contractKeyForComponent(componentId)}PlatformContract\`;
  assert.ok(module[exportName], \`Expected \${packagePath} to export \${exportName}\`);
  assert.ok(
    typeof module[exportName] === "function" || typeof module[exportName] === "object",
    \`Expected \${packagePath} export \${exportName} to be a React component-like value\`,
  );
  assert.equal(module[exportName].displayName, exportName, \`Expected installed \${componentId} displayName to be \${exportName}\`);
  assert.equal(module[exportName].platformContract, platformSurface[platformContractName], \`Expected installed \${componentId} to expose \${platformContractName}\`);
  assert.equal(module[exportName], reactBarrel[exportName], \`Expected \${componentId} subpath export to match React barrel export\`);
}

function contractKeyForComponent(componentId) {
  return componentId.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function fixtureForContract(componentId, contract) {
  const props = {};
  for (const prop of contract.props ?? []) {
    if (!prop.required) continue;
    props[prop.name] = valueForRequiredProp(prop.name);
  }
  if (componentId === "button") props.label = "Reference";
  if (componentId === "chart-panel") {
    props.values = [1, 2, 3];
    props.labels = ["One", "Two", "Three"];
  }
  if (componentId === "icon-button") props.ariaLabel = "Reference action";
  if (["dialog", "drawer", "popover", "tooltip"].includes(componentId)) props.open = true;
  return props;
}

function valueForRequiredProp(name) {
  switch (name) {
    case "ariaLabel":
      return "Reference action";
    case "columns":
      return [{ key: "name", label: "Name" }];
    case "fallback":
      return "Use your passcode";
    case "getPageLabel":
      return (page) => \`Reference page \${page}\`;
    case "icon":
      return "check";
    case "items":
      return [
        { id: "one", key: "one", label: "One", title: "One", content: "One content", value: "one" },
        { id: "two", key: "two", label: "Two", title: "Two", content: "Two content", value: "two" },
      ];
    case "label":
      return "Reference";
    case "name":
      return "reference";
    case "nodes":
      return [{ key: "root", label: "Root", children: [{ key: "child", label: "Child" }] }];
    case "options":
      return [{ label: "One", value: "one", meta: "Option" }];
    case "page":
      return 1;
    case "pageCount":
      return 3;
    case "previousLabel":
      return "Previous reference page";
    case "nextLabel":
      return "Next reference page";
    case "rowKey":
      return "id";
    case "rows":
      return [{ id: "row-1", name: "Row one" }];
    case "steps":
      return [{ id: "one", label: "One" }, { id: "two", label: "Two" }];
    case "title":
      return "Reference";
    case "triggerLabel":
      return "Open reference";
    case "value":
      return "Reference";
    default:
      return "Reference";
  }
}

const installedRenderFailures = [];
for (const { componentId, exportName } of reactSubpathAssertions) {
  const Component = reactBarrel[exportName];
  const contract = componentContracts[contractKeyForComponent(componentId)];
  try {
    assert.ok(contract, \`Expected installed contract for \${componentId}\`);
    const installedMarkup = renderToStaticMarkup(React.createElement(Component, {
      ...fixtureForContract(componentId, contract),
      className: "flow-consumer-hook",
      density: "lg",
      "data-installed-render": componentId,
      contentEditable: true,
      dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
      style: { color: "rgb(255, 0, 0)", marginTop: 77 },
      suppressContentEditableWarning: true,
      suppressHydrationWarning: true,
    }));
    assert.ok(installedMarkup.length > 0, \`\${componentId} rendered empty installed markup\`);
    assert.equal(installedMarkup.match(/flow-consumer-hook/g)?.length ?? 0, 1, \`\${componentId} must expose className once on the root integration surface\`);
    const rootTag = installedMarkup.match(/^<[^>]+>/)?.[0] ?? "";
    assert.match(rootTag, /data-density="lg"/, \`\${componentId} must expose density on the root integration surface\`);
    assert.match(rootTag, new RegExp(\`data-installed-render="\${componentId}"\`), \`\${componentId} must expose consumer data attributes on the root integration surface\`);
    assert.doesNotMatch(installedMarkup, /rgb\\(255,\\s*0,\\s*0\\)|margin-top:\\s*77px/i, \`\${componentId} leaked external style prop\`);
    assert.doesNotMatch(installedMarkup, /Injected markup|contenteditable=/i, \`\${componentId} leaked external DOM escape props\`);
    assert.doesNotMatch(installedMarkup, /apps\\/docs|docs-demo|gold-/i, \`\${componentId} leaked docs-only markup\`);
  } catch (error) {
    installedRenderFailures.push(\`\${componentId}: \${error.message}\`);
  }
}
assert.deepEqual(installedRenderFailures, []);

const screen = React.createElement("main", { className: "product-screen", "data-density": "md", "data-theme": "light" },
  React.createElement(Card, {
    title: "Fleet health",
    value: "96",
    unit: "",
    detail: "Vehicles available",
    status: "On track",
    composition: "stats",
    actions: [{ label: "Review", variant: "secondary" }],
  }),
  React.createElement(Input, {
    label: "Search vehicle",
    value: "MX-4821",
    helper: "Consumer controlled input",
  }),
  React.createElement(Table, {
    label: "Vehicles",
    columns: [
      { key: "unit", label: "Unit", sortable: true },
      { key: "status", label: "Status" },
    ],
    rows: [
      { id: "mx-4821", unit: "MX-4821", status: { label: "Active", tone: "success" } },
      { id: "mx-8840", unit: "MX-8840", status: { label: "Review", tone: "warning" } },
    ],
    variant: "sortable",
  }),
  React.createElement(Dialog, {
    label: "Confirm route",
    description: "This dialog renders outside FlowDocs.",
    open: true,
    actions: [
      { key: "cancel", label: "Cancel", variant: "secondary" },
      { key: "confirm", label: "Confirm", variant: "primary" },
    ],
  }),
  React.createElement(Button, { label: "Continue", variant: "primary" }),
);

const markup = renderToStaticMarkup(screen);
assert.match(markup, /product-screen/);
assert.match(markup, /class="card/);
assert.match(markup, /class="input/);
assert.match(markup, /class="table/);
assert.match(markup, /class="dialog/);
assert.match(markup, /class="button button--primary"/);
assert.doesNotMatch(markup, /apps\\/docs|docs-demo|gold-/);
console.log(markup.length);
`;
  fs.writeFileSync(path.join(consumerDir, "screen.mjs"), source.trimStart());
}

function writeConsumerCssEntrypoint(consumerDir) {
  const source = `
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const cssExports = [
  {
    specifier: "@alohasoyrico-eng/flow/tokens/styles.css",
    marker: "--sys-color-surface:",
  },
  {
    specifier: "@alohasoyrico-eng/flow/components/styles.css",
    marker: "--comp-button-bg-primary:",
  },
];
const resolved = cssExports.map((item) => ({ ...item, file: require.resolve(item.specifier) }));
for (const item of resolved) {
  assert.match(
    item.file,
    /node_modules\\/@alohasoyrico-eng\\/flow\\//,
    \`Expected \${item.specifier} to resolve from the installed Flow package.\`,
  );
  const css = fs.readFileSync(item.file, "utf8");
  assert.ok(css.includes(item.marker), \`Expected \${item.specifier} to include \${item.marker}\`);
  assert.doesNotMatch(css, /apps\\/docs|docs-demo|sourceMappingURL|@design-system\\/components/);
  for (const importMatch of css.matchAll(/@import\\s+"([^"]+)"/g)) {
    const importPath = importMatch[1].replace(/\\?.*$/, "");
    const resolvedImport = importPath.startsWith(".")
      ? new URL(importPath, \`file://\${item.file}\`).pathname
      : require.resolve(importPath);
    assert.match(
      resolvedImport,
      /node_modules\\/@alohasoyrico-eng\\/flow\\//,
      \`Expected CSS import \${importMatch[1]} from \${item.specifier} to resolve inside Flow.\`,
    );
  }
}

const entrypoint = [
  '@import "@alohasoyrico-eng/flow/tokens/styles.css";',
  '@import "@alohasoyrico-eng/flow/components/styles.css";',
  ".product-screen {",
  "  color: var(--sys-color-text);",
  "  background: var(--sys-color-surface);",
  "}",
].join("\\n");
fs.writeFileSync("consumer-flow.css", \`\${entrypoint}\\n\`);
const importedSpecifiers = [...entrypoint.matchAll(/@import\\s+"([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(importedSpecifiers, cssExports.map((item) => item.specifier));

const combinedCss = importedSpecifiers
  .map((specifier) => fs.readFileSync(require.resolve(specifier), "utf8"))
  .join("\\n");
assert.ok(
  combinedCss.indexOf("--sys-color-surface:") < combinedCss.indexOf("--comp-button-bg-primary:"),
  "Expected product CSS entrypoints to load tokens before component aliases.",
);
for (const expectedCascadeHook of [
  '.button[data-density="sm"]',
  '.card[data-density="lg"]',
  '.field[data-density="sm"]',
  '.table[data-density="sm"]',
]) {
  assert.ok(combinedCss.includes(expectedCascadeHook), \`Expected consumer CSS entrypoint to preserve \${expectedCascadeHook}\`);
}
`;
  fs.writeFileSync(path.join(consumerDir, "css-entrypoint.mjs"), source.trimStart());
}

function writeConsumerRefRuntime(consumerDir) {
  const reactSubpathAssertions = goldComponents.map((componentId) => ({
    componentId,
    exportName: pascalCase(componentId),
  }));
  const jsdomUrl = pathToFileURL(auditRequire.resolve("jsdom")).href;
  const source = `
import assert from "node:assert/strict";
import jsdomModule from ${JSON.stringify(jsdomUrl)};
import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { componentContracts } from "@alohasoyrico-eng/flow/components/contracts";

const { JSDOM } = jsdomModule;
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const reactBarrel = await import("@alohasoyrico-eng/flow/react");
const platformSurface = await import("@alohasoyrico-eng/flow/components/platforms");
const reactSubpathAssertions = ${JSON.stringify(reactSubpathAssertions, null, 2)};

function contractKeyForComponent(componentId) {
  return componentId.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function fixtureForContract(componentId, contract) {
  const props = {};
  for (const prop of contract.props ?? []) {
    if (!prop.required) continue;
    props[prop.name] = valueForRequiredProp(prop.name);
  }
  if (componentId === "button") props.label = "Reference";
  if (componentId === "chart-panel") {
    props.values = [1, 2, 3];
    props.labels = ["One", "Two", "Three"];
  }
  if (componentId === "icon-button") props.ariaLabel = "Reference action";
  if (["dialog", "drawer"].includes(componentId)) props.open = true;
  return props;
}

function valueForRequiredProp(name) {
  switch (name) {
    case "ariaLabel":
      return "Reference action";
    case "columns":
      return [{ key: "name", label: "Name" }];
    case "fallback":
      return "Use your passcode";
    case "getPageLabel":
      return (page) => \`Reference page \${page}\`;
    case "icon":
      return "check";
    case "items":
      return [
        { id: "one", key: "one", label: "One", title: "One", content: "One content", value: "one" },
        { id: "two", key: "two", label: "Two", title: "Two", content: "Two content", value: "two" },
      ];
    case "label":
      return "Reference";
    case "name":
      return "reference";
    case "nodes":
      return [{ key: "root", label: "Root", children: [{ key: "child", label: "Child" }] }];
    case "options":
      return [{ label: "One", value: "one", meta: "Option" }];
    case "page":
      return 1;
    case "pageCount":
      return 3;
    case "previousLabel":
      return "Previous reference page";
    case "nextLabel":
      return "Next reference page";
    case "rowKey":
      return "id";
    case "rows":
      return [{ id: "row-1", name: "Row one" }];
    case "steps":
      return [{ id: "one", label: "One" }, { id: "two", label: "Two" }];
    case "title":
      return "Reference";
    case "triggerLabel":
      return "Open reference";
    case "value":
      return "Reference";
    default:
      return "Reference";
  }
}

function hasClasses(element, classNames) {
  return classNames.every((className) => element.classList.contains(className));
}

function contractualRefTarget(element, rootClass) {
  const rootClasses = String(rootClass ?? "").split(/\\s+/).filter(Boolean);
  for (let node = element; node; node = node.parentElement) {
    if (hasClasses(node, rootClasses)) return node;
  }
  return null;
}

const failures = [];
for (const { componentId, exportName } of reactSubpathAssertions) {
  const Component = reactBarrel[exportName];
  const contractKey = contractKeyForComponent(componentId);
  const contract = componentContracts[contractKey];
  const platformContract = platformSurface[\`\${contractKey}PlatformContract\`];
  const rootClass = platformContract?.source?.cssClass;
  const ref = React.createRef();
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    assert.ok(contract, \`Expected installed contract for \${componentId}\`);
    assert.ok(rootClass, \`Expected installed platform root cssClass for \${componentId}\`);
    flushSync(() => {
      root.render(React.createElement(Component, {
        ...fixtureForContract(componentId, contract),
        ref,
      }));
    });
    assert.ok(ref.current instanceof HTMLElement, \`\${componentId} did not forward ref to an HTMLElement\`);
    assert.ok(
      contractualRefTarget(ref.current, rootClass),
      \`\${componentId} forwarded ref outside contractual root .\${rootClass}: \${ref.current?.className || ref.current?.tagName}\`,
    );
  } catch (error) {
    failures.push(\`\${componentId}: \${error.message}\`);
  } finally {
    root.unmount();
    container.remove();
  }
}
assert.deepEqual(failures, []);
`;
  fs.writeFileSync(path.join(consumerDir, "ref-runtime.mjs"), source.trimStart());
}

function writeConsumerInteractionRuntime(consumerDir) {
  const jsdomUrl = pathToFileURL(auditRequire.resolve("jsdom")).href;
  const source = `
import assert from "node:assert/strict";
import jsdomModule from ${JSON.stringify(jsdomUrl)};
import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { Accordion, Button, Card, Checkbox, Input, Select, Switch } from "@alohasoyrico-eng/flow/react";

const { JSDOM } = jsdomModule;
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.HTMLInputElement = dom.window.HTMLInputElement;
globalThis.Node = dom.window.Node;
globalThis.Event = dom.window.Event;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.MouseEvent = dom.window.MouseEvent;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

function mount(element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  flushSync(() => root.render(element));
  return {
    container,
    rerender(nextElement) {
      flushSync(() => root.render(nextElement));
    },
    unmount() {
      root.unmount();
      container.remove();
    },
  };
}

function click(element) {
  flushSync(() => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
}

function keyDown(element, key) {
  flushSync(() => {
    element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  });
}

const accordionChanges = [];
const accordionHarness = mount(React.createElement(Accordion, {
  items: [
    { id: "overview", title: "Overview", content: "Route overview" },
    { id: "pricing", title: "Pricing", content: "Route pricing" },
  ],
  onExpandedChange: (expandedIds, event) => accordionChanges.push({ expandedIds, eventType: event.type }),
}));
const accordionTriggers = accordionHarness.container.querySelectorAll("[data-accordion-trigger]");
assert.equal(accordionTriggers[0].getAttribute("aria-expanded"), "false");
click(accordionTriggers[0]);
assert.equal(accordionTriggers[0].getAttribute("aria-expanded"), "true");
assert.deepEqual(accordionChanges.at(-1), { expandedIds: ["overview"], eventType: "click" });
click(accordionTriggers[1]);
assert.equal(accordionTriggers[0].getAttribute("aria-expanded"), "false");
assert.equal(accordionTriggers[1].getAttribute("aria-expanded"), "true");
assert.deepEqual(accordionChanges.at(-1), { expandedIds: ["pricing"], eventType: "click" });
accordionHarness.unmount();

const buttonClicks = [];
const buttonHarness = mount(React.createElement(Button, {
  label: "Continue",
  onClick: (event) => buttonClicks.push(event.type),
}));
click(buttonHarness.container.querySelector("button"));
assert.deepEqual(buttonClicks, ["click"]);
buttonHarness.unmount();

const cardActions = [];
const cardHarness = mount(React.createElement(Card, {
  title: "Wallet balance",
  value: "$8,412.50",
  interactive: true,
  actionKey: "wallet-balance",
  onAction: (key, action, event) => cardActions.push({ key, action, eventType: event.type, eventKey: event.key }),
}));
const cardControl = cardHarness.container.querySelector(".card");
click(cardControl);
keyDown(cardControl, "Enter");
assert.deepEqual(cardActions, [
  { key: "wallet-balance", action: undefined, eventType: "click", eventKey: undefined },
  { key: "wallet-balance", action: undefined, eventType: "keydown", eventKey: "Enter" },
]);
cardHarness.unmount();

const checkboxChanges = [];
const checkboxHarness = mount(React.createElement(Checkbox, {
  label: "Accept terms",
  value: "terms",
  onCheckedChange: (checked, meta, event) => checkboxChanges.push({ checked, meta, eventType: event.type }),
}));
const checkboxInput = checkboxHarness.container.querySelector("input[type='checkbox']");
click(checkboxInput);
assert.deepEqual(checkboxChanges.at(-1), {
  checked: true,
  meta: { indeterminate: false, value: "terms" },
  eventType: "change",
});
assert.equal(checkboxInput.checked, true);
checkboxHarness.unmount();

const controlledCheckboxChanges = [];
let controlledCheckboxChecked = false;
const controlledCheckboxHarness = mount(React.createElement(Checkbox, {
  label: "Controlled terms",
  value: "terms",
  checked: controlledCheckboxChecked,
  onCheckedChange: (checked) => controlledCheckboxChanges.push(checked),
}));
const controlledCheckboxInput = controlledCheckboxHarness.container.querySelector("input[type='checkbox']");
click(controlledCheckboxInput);
assert.deepEqual(controlledCheckboxChanges, [true]);
assert.equal(controlledCheckboxInput.checked, false);
controlledCheckboxChecked = true;
controlledCheckboxHarness.rerender(React.createElement(Checkbox, {
  label: "Controlled terms",
  value: "terms",
  checked: controlledCheckboxChecked,
  onCheckedChange: (checked) => controlledCheckboxChanges.push(checked),
}));
assert.equal(controlledCheckboxHarness.container.querySelector("input[type='checkbox']").checked, true);
controlledCheckboxHarness.unmount();

const inputChanges = [];
const inputHarness = mount(React.createElement(Input, {
  label: "Password",
  type: "password",
  value: "secret",
  revealable: true,
  revealLabel: "Show password",
  hideLabel: "Hide password",
  onRevealChange: (revealed, event) => inputChanges.push({ revealed, eventType: event.type }),
}));
const inputControl = inputHarness.container.querySelector("input");
assert.equal(inputControl.type, "password");
click(inputHarness.container.querySelector(".field-action"));
assert.deepEqual(inputChanges.at(-1), { revealed: true, eventType: "click" });
assert.equal(inputControl.type, "text");
inputHarness.unmount();

const selectOpenChanges = [];
const selectValueChanges = [];
let selectedValue = "one";
let selectOpen = false;
const selectHarness = mount(React.createElement(Select, {
  label: "Status",
  value: selectedValue,
  open: selectOpen,
  options: [
    { label: "One", value: "one", meta: "Current" },
    { label: "Two", value: "two", meta: "Next" },
  ],
  onOpenChange: (open, event) => selectOpenChanges.push({ open, eventType: event?.type }),
  onValueChange: (value, meta, event) => selectValueChanges.push({ value, meta, eventType: event.type }),
}));
const selectTrigger = selectHarness.container.querySelector("[data-select-trigger]");
click(selectTrigger);
assert.deepEqual(selectOpenChanges.at(-1), { open: true, eventType: "click" });
assert.equal(selectTrigger.getAttribute("aria-expanded"), "false");
selectOpen = true;
selectHarness.rerender(React.createElement(Select, {
  label: "Status",
  value: selectedValue,
  open: selectOpen,
  options: [
    { label: "One", value: "one", meta: "Current" },
    { label: "Two", value: "two", meta: "Next" },
  ],
  onOpenChange: (open, event) => selectOpenChanges.push({ open, eventType: event?.type }),
  onValueChange: (value, meta, event) => selectValueChanges.push({ value, meta, eventType: event.type }),
}));
assert.equal(selectHarness.container.querySelector("[data-select-trigger]").getAttribute("aria-expanded"), "true");
click(selectHarness.container.querySelector("[data-value='two']"));
assert.deepEqual(selectValueChanges.at(-1), { value: "two", meta: { label: "Two", meta: "Next" }, eventType: "click" });
selectHarness.unmount();

const switchChanges = [];
const switchHarness = mount(React.createElement(Switch, {
  label: "Active route",
  name: "active-route",
  onCheckedChange: (checked, meta, event) => switchChanges.push({ checked, meta, eventType: event.type }),
}));
const switchInput = switchHarness.container.querySelector("input[role='switch']");
click(switchInput);
assert.deepEqual(switchChanges.at(-1), {
  checked: true,
  meta: { name: "active-route" },
  eventType: "change",
});
assert.equal(switchInput.checked, true);
switchHarness.unmount();

const controlledSwitchChanges = [];
let controlledSwitchChecked = false;
const controlledSwitchHarness = mount(React.createElement(Switch, {
  label: "Controlled route",
  checked: controlledSwitchChecked,
  onCheckedChange: (checked) => controlledSwitchChanges.push(checked),
}));
const controlledSwitchInput = controlledSwitchHarness.container.querySelector("input[role='switch']");
click(controlledSwitchInput);
assert.deepEqual(controlledSwitchChanges, [true]);
assert.equal(controlledSwitchInput.checked, false);
controlledSwitchChecked = true;
controlledSwitchHarness.rerender(React.createElement(Switch, {
  label: "Controlled route",
  checked: controlledSwitchChecked,
  onCheckedChange: (checked) => controlledSwitchChanges.push(checked),
}));
assert.equal(controlledSwitchHarness.container.querySelector("input[role='switch']").checked, true);
controlledSwitchHarness.unmount();
`;
  fs.writeFileSync(path.join(consumerDir, "interaction-runtime.mjs"), source.trimStart());
}

function writeConsumerTypes(consumerDir) {
  const reactRootTypeImports = goldComponents.map((componentId) => {
    const componentName = pascalCase(componentId);
    return `${componentName}Props as ${componentName}RootProps, ${componentName}Component as ${componentName}RootComponent`;
  }).join(", ");
  const reactSubpathTypeImports = goldComponents.map((componentId) => {
    const componentName = pascalCase(componentId);
    return `import { ${componentName} as ${componentName}Subpath } from "@alohasoyrico-eng/flow/react/${componentId}";\nimport type { ${componentName}Props as ${componentName}SubpathProps } from "@alohasoyrico-eng/flow/react/${componentId}";`;
  }).join("\n");
  const reactSubpathTypeAssertions = goldComponents.map((componentId) => {
    const componentName = pascalCase(componentId);
    const variableName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}SubpathProps`;
    const rootVariableName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}RootProps`;
    const rootComponentName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}RootComponent`;
    return `const ${variableName}: Partial<${componentName}SubpathProps> = {};\nconst ${rootVariableName}: Partial<${componentName}RootProps> = ${variableName};\nconst ${rootComponentName}: ${componentName}RootComponent = ${componentName}Subpath;\nvoid ${componentName}Subpath;\nvoid ${variableName};\nvoid ${rootVariableName};\nvoid ${rootComponentName};`;
  }).join("\n");
  const reactSubpathIntegrationTypeAssertions = goldComponents.map((componentId) => {
    const componentName = pascalCase(componentId);
    const variableName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}IntegrationProps`;
    const badStyleName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}BadStyle`;
    const badHtmlName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}BadHtml`;
    return `const ${variableName}: Partial<React.ComponentProps<typeof ${componentName}Subpath>> = { ref: React.createRef<never>(), "data-product-hook": "${componentId}" };\n// @ts-expect-error Flow owns visual styling; consumers cannot bypass tokens with inline style.\nconst ${badStyleName}: Partial<React.ComponentProps<typeof ${componentName}Subpath>> = { style: { color: "red" } };\n// @ts-expect-error Flow owns rendered structure; consumers cannot inject HTML.\nconst ${badHtmlName}: Partial<React.ComponentProps<typeof ${componentName}Subpath>> = { dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };\nvoid ${variableName};\nvoid ${badStyleName};\nvoid ${badHtmlName};`;
  }).join("\n");
  const tsconfig = {
    compilerOptions: {
      module: "NodeNext",
      moduleResolution: "NodeNext",
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: "ES2022",
    },
    include: ["screen-types.ts"],
  };
  fs.writeFileSync(path.join(consumerDir, "tsconfig.json"), `${JSON.stringify(tsconfig, null, 2)}\n`);
  const source = `
import React from "react";
import type { ButtonProps, CardProps, DialogProps, InputProps, TableProps } from "@alohasoyrico-eng/flow/react";
import type { ${reactRootTypeImports} } from "@alohasoyrico-eng/flow/react";
import { Button, Card, Input, Table } from "@alohasoyrico-eng/flow/react";
import { Dialog } from "@alohasoyrico-eng/flow/react/dialog";
${reactSubpathTypeImports}

const buttonRef = React.createRef<HTMLButtonElement>();
const button = React.createElement(Button, { ref: buttonRef, label: "Continue", variant: "primary", onClick: (event) => event.currentTarget.focus() });

const cardProps: CardProps = { title: "Fleet health", value: "96", actions: [{ label: "Review", variant: "secondary" }] };
const inputProps: InputProps = { label: "Search", value: "MX-4821", onValueChange: (value) => value.toUpperCase() };
const tableProps: TableProps = { label: "Vehicles", columns: [{ key: "unit", label: "Unit" }], rows: [{ id: "1", unit: "MX-4821" }] };
const dialogProps: DialogProps = { label: "Confirm route", open: true, onOpenChange: (open) => Boolean(open) };

React.createElement(Card, cardProps);
React.createElement(Input, inputProps);
React.createElement(Table, tableProps);
React.createElement(Dialog, dialogProps);
${reactSubpathTypeAssertions}
${reactSubpathIntegrationTypeAssertions}

// @ts-expect-error Flow owns visual styling; consumers cannot bypass tokens with inline style.
const badButtonStyle: ButtonProps = { label: "Bad", style: { color: "red" } };
// @ts-expect-error Flow owns rendered structure; consumers cannot inject HTML.
const badButtonHtml: ButtonProps = { label: "Bad", dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };

void button;
void badButtonStyle;
void badButtonHtml;
`;
  fs.writeFileSync(path.join(consumerDir, "screen-types.ts"), source.trimStart());
}

function auditInstalledPackage(consumerDir) {
  const packageRoot = path.join(consumerDir, "node_modules/@alohasoyrico-eng/flow");
  const realPackageRoot = fs.realpathSync(packageRoot);
  const consumerRequire = createRequire(path.join(consumerDir, "package.json"));
  const installedPackage = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  const installedTokenContract = JSON.parse(fs.readFileSync(path.join(packageRoot, "packages/tokens/tokens.json"), "utf8"));
  if (!Array.isArray(installedPackage.sideEffects) || !installedPackage.sideEffects.includes("**/*.css")) {
    throw new Error("Installed package must preserve CSS sideEffects for consumer bundlers.");
  }
  assertInstalledExportInventory(installedPackage);
  for (const [exportPath, expectedTarget] of Object.entries({
    "./tokens/styles.css": "./packages/tokens/styles/tokens.css",
    "./components/styles.css": "./packages/components/styles/components.css",
  })) {
    if (installedPackage.exports?.[exportPath] !== expectedTarget) {
      throw new Error(`Installed package must publish ${exportPath} as ${expectedTarget}.`);
    }
    const packageSpecifier = `@alohasoyrico-eng/flow/${exportPath.slice(2)}`;
    const resolved = consumerRequire.resolve(packageSpecifier);
    if (!fs.realpathSync(resolved).startsWith(realPackageRoot)) {
      throw new Error(`Installed CSS export ${packageSpecifier} must resolve inside the Flow package.`);
    }
    if (fs.readFileSync(resolved, "utf8").trim().length < 1000) {
      throw new Error(`Installed CSS export ${packageSpecifier} is unexpectedly small.`);
    }
  }
  if (installedTokenContract.format !== "flow-token-contract@1" || !installedTokenContract.compatibleWith?.includes("style-dictionary")) {
    throw new Error("Installed package must include the platform-neutral token JSON contract.");
  }
  if (Object.keys(installedTokenContract.tokens ?? {}).length < 1000) {
    throw new Error("Installed token JSON contract must include the full token inventory.");
  }
  assertInstalledContentContracts({ consumerRequire, packageRoot, realPackageRoot });
  const installedCssInventory = packageCssRootInventory(packageRoot);
  const installedCssRoots = installedCssInventory.roots;
  if (installedCssRoots.size !== 66) {
    throw new Error(`Installed component CSS must preserve the governed root baseline: expected 66 roots, got ${installedCssRoots.size}.`);
  }
  if (installedCssInventory.selectors < 1100) {
    throw new Error(`Installed component CSS selector inventory is unexpectedly small: expected at least 1100 selectors, got ${installedCssInventory.selectors}.`);
  }
  const cssCoverage = componentCssContractCoverage();
  if (cssCoverage.direct !== 52 || cssCoverage.family !== 4 || cssCoverage.missing.length) {
    throw new Error(`Installed package must preserve the resolved CSS contract baseline: expected 52 direct, 4 family, 0 missing; got ${cssCoverage.direct} direct, ${cssCoverage.family} family, ${cssCoverage.missing.length} missing.`);
  }
  assertReactGovernanceBaselines();
  const missingInstalledCssCoverage = goldComponents
    .map((componentId) => {
      const reactComponentName = pascalCase(componentId);
      const ownerRoot = ownerClassRootForReactComponent(reactComponentName);
      const allowedRoots = [...allowedClassRootsForReactComponent(reactComponentName)].sort();
      const installedRoots = allowedRoots.filter((rootToken) => installedCssRoots.has(rootToken));
      return {
        componentId,
        ownerRoot,
        allowedRoots,
        installedRoots,
        coverage: installedRoots.includes(ownerRoot) ? "direct" : installedRoots.length ? "family" : "missing",
      };
    })
    .filter((item) => item.coverage === "missing");
  if (missingInstalledCssCoverage.length) {
    throw new Error(`Installed component CSS is missing accepted React visual coverage: ${missingInstalledCssCoverage.map((item) => `${item.componentId}->${item.allowedRoots.join("|")}`).join(", ")}`);
  }
  const installedComponentCss = fs.readFileSync(consumerRequire.resolve("@alohasoyrico-eng/flow/components/styles.css"), "utf8");
  const missingInstalledCssContracts = cssCoverage.components
    .filter((item) => item.coverage !== "missing")
    .flatMap((item) => {
      const selectorRoots = [item.requiredRoot, ...(item.allowedExtensionRoots ?? [])];
      const aliasPrefixes = [item.contract, ...(item.allowedExtensionRoots ?? [])];
      return [
        ...selectorRoots
          .filter((rootToken) => !cssSelectorRootObserved(installedComponentCss, rootToken))
          .map((rootToken) => `${item.componentId ?? item.component}: selector .${rootToken}`),
        ...aliasPrefixes
          .filter((prefix) => !installedComponentCss.includes(`--comp-${prefix}-`))
          .map((prefix) => `${item.componentId ?? item.component}: alias --comp-${prefix}-*`),
      ];
    });
  if (missingInstalledCssContracts.length) {
    throw new Error(`Installed component CSS is missing cascade contract selectors or aliases: ${missingInstalledCssContracts.slice(0, 30).join(", ")}`);
  }
  for (const [key, value] of Object.entries(installedPackage.exports ?? {})) {
    if (!key.startsWith("./react")) continue;
    const packagePath = key === "./react" ? "@alohasoyrico-eng/flow/react" : `@alohasoyrico-eng/flow/${key.slice(2)}`;
    consumerRequire.resolve(packagePath);
    if (!value?.types || !value?.default) throw new Error(`React export ${key} must publish types and default targets.`);
  }
  for (const componentId of goldComponents) {
    consumerRequire.resolve(`@alohasoyrico-eng/flow/react/${componentId}`);
  }
  for (const forbiddenSpecifier of [
    "@alohasoyrico-eng/flow/packages/react/dist/Button.js",
    "@alohasoyrico-eng/flow/packages/components/src/contracts.js",
    "@alohasoyrico-eng/flow/packages/tokens/tokens.json",
    "@alohasoyrico-eng/flow/packages/content/content/catalog.json",
  ]) {
    assertPackagePathNotExported(consumerRequire, forbiddenSpecifier);
  }
  for (const forbiddenPath of ["apps/docs", "repo-split-output", "node_modules"]) {
    if (fs.existsSync(path.join(packageRoot, forbiddenPath))) {
      throw new Error(`Installed package must not include ${forbiddenPath}.`);
    }
  }
  const offenders = [];
  for (const file of listFiles(packageRoot)) {
    if (!/\.(?:js|mjs|d\.ts|css)$/.test(file)) continue;
    const relative = path.relative(packageRoot, file);
    const source = fs.readFileSync(file, "utf8");
    if (source.includes("apps/docs") || source.includes("#design-system/docs")) {
      offenders.push(`${relative}: docs dependency`);
    }
    if (relative.startsWith("packages/react/dist/") && source.includes("../../components/src")) {
      offenders.push(`${relative}: deep component source import`);
    }
    if (relative.startsWith("packages/react/dist/") && source.includes("@design-system/components")) {
      offenders.push(`${relative}: workspace component import`);
    }
    if (relative.startsWith("packages/react/dist/") && relative.endsWith(".d.ts")) {
      const missing = missingInheritedDomEscapeOmissions(source);
      if (missing.length) offenders.push(`${relative}: inherited DOM escape props ${missing.join(", ")}`);
    }
  }
  if (offenders.length) {
    throw new Error(`Installed package has consumer boundary offenders: ${offenders.slice(0, 20).join(", ")}`);
  }
}

function assertInstalledExportInventory(installedPackage) {
  const expectedExportMap = {
    "./tokens": "./packages/tokens/src/index.js",
    "./tokens.json": "./packages/tokens/tokens.json",
    "./tokens/styles.css": "./packages/tokens/styles/tokens.css",
    "./components": "./packages/components/src/index.js",
    "./components/contracts": "./packages/components/src/contracts.js",
    "./components/platforms": "./packages/components/src/platforms/index.js",
    "./components/styles.css": "./packages/components/styles/components.css",
    "./react": {
      types: "./packages/react/dist/index.d.ts",
      default: "./packages/react/dist/index.js",
    },
    ...Object.fromEntries(goldComponents.map((component) => {
      const componentName = pascalCase(component);
      return [`./react/${component}`, {
        types: `./packages/react/dist/${componentName}.d.ts`,
        default: `./packages/react/dist/${componentName}.js`,
      }];
    })),
    "./content/catalog": "./packages/content/content/catalog.json",
    "./content/component-docs": "./packages/content/content/component-docs.json",
    "./content/component-copy": "./packages/content/content/component-copy.json",
    "./content/pattern-copy": "./packages/content/content/pattern-copy.json",
    "./content/component-implementation-status": "./packages/content/content/component-implementation-status.json",
    "./content/foundation-copy": "./packages/content/content/foundation-copy.json",
    "./content/primitive-copy": "./packages/content/content/primitive-copy.json",
    "./content/reference-copy": "./packages/content/content/reference-copy.json",
    "./content/template-blueprints": "./packages/content/content/template-blueprints.json",
    "./content/home": "./packages/content/content/home.json",
    "./content/i18n-ui": "./packages/content/content/i18n/ui.json",
    "./specs/system": "./packages/specs/specs/unison.system.json",
    "./specs/foundations/*": "./packages/specs/specs/unison-system/artifacts/foundations/*.json",
    "./specs/primitives/*": "./packages/specs/specs/unison-system/artifacts/primitives/*.json",
  };
  const expectedExports = Object.keys(expectedExportMap).sort();
  const actualExports = Object.keys(installedPackage.exports ?? {}).sort();
  const missing = expectedExports.filter((entry) => !actualExports.includes(entry));
  const extra = actualExports.filter((entry) => !expectedExports.includes(entry));
  if (missing.length || extra.length) {
    throw new Error(`Installed package export inventory mismatch: missing ${missing.join(", ") || "none"}; extra ${extra.join(", ") || "none"}.`);
  }
  const mistargeted = expectedExports.filter((entry) => {
    const actual = installedPackage.exports?.[entry];
    const expected = expectedExportMap[entry];
    return JSON.stringify(actual) !== JSON.stringify(expected);
  });
  if (mistargeted.length) {
    throw new Error(`Installed package exports point to unexpected targets: ${mistargeted.slice(0, 30).join(", ")}.`);
  }
}

function assertPackagePathNotExported(consumerRequire, specifier) {
  try {
    consumerRequire.resolve(specifier);
  } catch (error) {
    if (error?.code === "ERR_PACKAGE_PATH_NOT_EXPORTED") return;
    throw error;
  }
  throw new Error(`Installed package must not allow deep import outside public exports: ${specifier}.`);
}

function missingInheritedDomEscapeOmissions(source) {
  const missing = new Set();
  for (const match of source.matchAll(/^export interface [A-Za-z][A-Za-z0-9]* extends ([^{]+)\{/gm)) {
    const inherited = match[1];
    const inheritsDomAttributes = /(?:^|[^A-Za-z])(?:HTMLAttributes|ButtonHTMLAttributes|InputHTMLAttributes|TextareaHTMLAttributes)\b/.test(inherited);
    if (!inheritsDomAttributes) continue;
    for (const prop of forbiddenInheritedDomProps) {
      if (!inherited.includes(`"${prop}"`)) missing.add(prop);
    }
  }
  return [...missing].sort();
}

function assertInstalledContentContracts({ consumerRequire, packageRoot, realPackageRoot }) {
  const shardExports = [
    ["@alohasoyrico-eng/flow/content/catalog", "packages/content/content", 15],
    ["@alohasoyrico-eng/flow/content/component-docs", "packages/content/content", 2],
    ["@alohasoyrico-eng/flow/content/component-copy", "packages/content/content", 180],
    ["@alohasoyrico-eng/flow/content/foundation-copy", "packages/content/content", 20],
    ["@alohasoyrico-eng/flow/content/primitive-copy", "packages/content/content", 20],
    ["@alohasoyrico-eng/flow/specs/system", "packages/specs/specs", 140],
  ];
  for (const [specifier, shardRoot, minimumShards] of shardExports) {
    const file = consumerRequire.resolve(specifier);
    if (!fs.realpathSync(file).startsWith(realPackageRoot)) {
      throw new Error(`Installed content export ${specifier} must resolve inside the Flow package.`);
    }
    const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
    const shards = manifest.$systemShards ?? [];
    if (shards.length < minimumShards) {
      throw new Error(`Installed content export ${specifier} is missing shard coverage: expected at least ${minimumShards}, got ${shards.length}.`);
    }
    const missingShards = shards.filter((shard) => !fs.existsSync(path.join(packageRoot, shardRoot, shard)));
    if (missingShards.length) {
      throw new Error(`Installed content export ${specifier} points to missing shards: ${missingShards.slice(0, 20).join(", ")}.`);
    }
  }

  for (const specifier of [
    "@alohasoyrico-eng/flow/content/pattern-copy",
    "@alohasoyrico-eng/flow/content/reference-copy",
    "@alohasoyrico-eng/flow/content/template-blueprints",
    "@alohasoyrico-eng/flow/content/home",
    "@alohasoyrico-eng/flow/content/i18n-ui",
  ]) {
    const file = consumerRequire.resolve(specifier);
    if (!fs.realpathSync(file).startsWith(realPackageRoot)) {
      throw new Error(`Installed content export ${specifier} must resolve inside the Flow package.`);
    }
    const contract = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!contract || typeof contract !== "object" || !Object.keys(contract).length) {
      throw new Error(`Installed content export ${specifier} must contain a non-empty JSON contract.`);
    }
  }

  const implementationStatus = JSON.parse(fs.readFileSync(consumerRequire.resolve("@alohasoyrico-eng/flow/content/component-implementation-status"), "utf8"));
  const statusComponents = Object.values(implementationStatus.components ?? {});
  const packageComponents = statusComponents.filter((component) => component.status === "package-component");
  if (statusComponents.length !== 56 || packageComponents.length !== 56) {
    throw new Error(`Installed implementation status must preserve 56/56 package components; got ${packageComponents.length}/${statusComponents.length}.`);
  }
}

function assertReactGovernanceBaselines() {
  const primary = readAuditReport("docs/audits/react-primary-coverage-audit.json");
  assertReportStatus(primary, "React primary coverage");
  assertInventory(primary, {
    components: 56,
    primaryImplementationDebt: 0,
    pass: 56,
    fail: 0,
    forwardRef: 56,
    realTypes: 56,
    platformContract: 56,
    densityResolved: 56,
    restSanitized: 56,
    noDocsDependency: 56,
    noDomFactory: 56,
    publishedImports: 56,
    cssContractCoverage: 56,
    directCssContracts: 52,
    familyCssContracts: 4,
  }, "React primary coverage");

  const legacyDomSource = readAuditReport("docs/audits/legacy-dom-source-governance-audit.json");
  assertReportStatus(legacyDomSource, "Legacy DOM source governance");
  assertInventory(legacyDomSource, {
    filesScanned: 376,
    violations: 0,
    legacyDomSourceDebt: 0,
  }, "Legacy DOM source governance");

  const foundationPrimitiveExport = readAuditReport("docs/audits/foundation-primitive-export-contract-audit.json");
  assertReportStatus(foundationPrimitiveExport, "Foundation primitive export contract");
  assertInventory(foundationPrimitiveExport, {
    foundations: 11,
    primitives: 22,
    tokenCount: 1078,
    missingFoundationArtifacts: 0,
    missingPrimitiveArtifacts: 0,
    artifactShapeErrors: 0,
    missingPackageExports: 0,
    requirementFailures: 0,
    baselineMismatches: 0,
    foundationPrimitiveExportDebt: 0,
  }, "Foundation primitive export contract");

  const defaults = readAuditReport("docs/audits/react-default-governance-audit.json");
  assertReportStatus(defaults, "React default governance");
  assertInventory(defaults, {
    components: 56,
    defaultDebt: 0,
    prohibitedDefaults: 0,
    semanticDefaultDecisions: 112,
    contractBackedSemanticDefaultDecisions: 112,
    unbackedSemanticDefaultDecisions: 0,
    semanticDefaultDecisionContractGaps: 0,
  }, "React default governance");

  const styles = readAuditReport("docs/audits/react-style-governance-audit.json");
  assertReportStatus(styles, "React style governance");
  assertInventory(styles, {
    components: 56,
    styleEscapeDebt: 0,
    approvedInlineVars: 10,
    styleProps: 10,
    setPropertyCalls: 2,
    violations: 0,
  }, "React style governance");

  const composition = readAuditReport("docs/audits/react-composition-governance-audit.json");
  assertReportStatus(composition, "React composition governance");
  assertInventory(composition, {
    components: 56,
    compositionDebt: 0,
    compositionalComponents: 23,
    compositionEdges: 39,
    unexpectedImports: 0,
    missingImports: 0,
    missingReasons: 0,
    duplicateAllowed: 0,
    unknownAllowed: 0,
    unknownContractOwners: 0,
  }, "React composition governance");

  const classOwnership = readAuditReport("docs/audits/react-class-ownership-audit.json");
  assertReportStatus(classOwnership, "React class ownership");
  assertInventory(classOwnership, {
    components: 56,
    componentClassRoots: 59,
    protectedComponentRoots: 6,
    supportClassRoots: 5,
    packageCssRoots: 66,
    componentsWithFamilyRoots: 13,
    observedRootAssignments: 72,
    observedSupportRootAssignments: 20,
    violations: 0,
    classOwnershipDebt: 0,
  }, "React class ownership");

  const packageCssRoots = readAuditReport("docs/audits/package-css-root-governance-audit.json");
  assertReportStatus(packageCssRoots, "Package CSS root governance");
  assertInventory(packageCssRoots, {
    selectors: 1169,
    componentAliases: 3221,
    componentAliasRoots: 62,
    unknownComponentAliases: 0,
    cssRoots: 66,
    componentRoots: 58,
    observedComponentRoots: 58,
    unobservedComponentRoots: 0,
    classifiedNonComponentRoots: 8,
    unclassifiedRoots: 0,
    packageCssRootDebt: 0,
  }, "Package CSS root governance");

  const propAlignment = readAuditReport("docs/audits/react-contract-prop-alignment-audit.json");
  assertReportStatus(propAlignment, "React contract prop alignment");
  assertInventory(propAlignment, {
    components: 56,
    propAlignmentDebt: 0,
    pass: 56,
    fail: 0,
    extraReactProps: 0,
    missingReactProps: 0,
    requiredMismatches: 0,
    typeValueMismatches: 0,
    unreferencedPublicProps: 0,
  }, "React contract prop alignment");

  const controlled = readAuditReport("docs/audits/react-controlled-governance-audit.json");
  assertReportStatus(controlled, "React controlled governance");
  assertInventory(controlled, {
    components: 56,
    controlledDebt: 0,
    controlledComponents: 29,
    openControlledComponents: 10,
    totalControlledEdges: 38,
    totalTestCoveredEdges: 38,
    failures: 0,
  }, "React controlled governance");

  const interactions = readAuditReport("docs/audits/react-interaction-coverage-audit.json");
  assertReportStatus(interactions, "React interaction coverage");
  assertInventory(interactions, {
    components: 56,
    interactionDebt: 0,
    withCallbacks: 40,
    pass: 56,
    review: 0,
    fail: 0,
    missingTestCallbacks: 0,
    missingEventParams: 0,
    manualAccessibilityCritical: 10,
    manualAccessibilityCriticalPass: 10,
  }, "React interaction coverage");

  const accessibility = readAuditReport("docs/audits/react-accessibility-governance-audit.json");
  assertReportStatus(accessibility, "React accessibility governance");
  assertInventory(accessibility, {
    components: 56,
    accessibilityDebt: 0,
    criticalComponents: 10,
    criticalPassing: 10,
    failures: 0,
    interactionFailures: 0,
  }, "React accessibility governance");
}

function readAuditReport(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function assertReportStatus(report, label) {
  if (report.status !== "pass") {
    throw new Error(`${label} report must pass before package consumer adoption.`);
  }
}

function assertInventory(report, expected, label) {
  const inventory = report.inventory ?? {};
  const mismatches = Object.entries(expected)
    .filter(([key, value]) => inventory[key] !== value)
    .map(([key, value]) => `${key}: expected ${value}, got ${inventory[key]}`);
  if (mismatches.length) {
    throw new Error(`${label} inventory baseline changed: ${mismatches.join(", ")}.`);
  }
}

function exportTargets(value) {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return [value.default, value.types].filter(Boolean);
}

function pascalCase(value) {
  return value.split("-").map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join("");
}

function camelCase(value) {
  const pascal = pascalCase(value);
  return `${pascal.slice(0, 1).toLowerCase()}${pascal.slice(1)}`;
}

function cssSelectorRootObserved(css, rootToken) {
  return new RegExp(`\\.${escapeRegExp(rootToken)}(?:\\b|__|\\[|[\\s:{.#>+~])`).test(css);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}

function run(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`${command} ${args.join(" ")} failed in ${cwd}`);
  }
  return result;
}
