#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

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
const cacheDir = path.join(os.tmpdir(), "ds-npm-cache");
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
    if (target.startsWith("./")) requiredPaths.add(target.replace(/^\.\//, ""));
  }

  const missing = [...requiredPaths].filter((file) => !paths.has(file));
  if (missing.length) {
    throw new Error(`Packed package is missing required public artifacts: ${missing.slice(0, 30).join(", ")}`);
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
  const source = `
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, Card, Input, Table } from "@alohasoyrico-eng/flow/react";
import { Dialog } from "@alohasoyrico-eng/flow/react/dialog";

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
for (const { componentId, packagePath, exportName } of ${JSON.stringify(reactSubpathAssertions, null, 2)}) {
  const module = await import(packagePath);
  assert.ok(module[exportName], \`Expected \${packagePath} to export \${exportName}\`);
  assert.ok(
    typeof module[exportName] === "function" || typeof module[exportName] === "object",
    \`Expected \${packagePath} export \${exportName} to be a React component-like value\`,
  );
  assert.equal(module[exportName], reactBarrel[exportName], \`Expected \${componentId} subpath export to match React barrel export\`);
}

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

function writeConsumerTypes(consumerDir) {
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
import { Button, Card, Input, Table } from "@alohasoyrico-eng/flow/react";
import { Dialog } from "@alohasoyrico-eng/flow/react/dialog";

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
  const consumerRequire = createRequire(path.join(consumerDir, "package.json"));
  const installedPackage = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  const installedTokenContract = JSON.parse(fs.readFileSync(path.join(packageRoot, "packages/tokens/tokens.json"), "utf8"));
  if (installedTokenContract.format !== "flow-token-contract@1" || !installedTokenContract.compatibleWith?.includes("style-dictionary")) {
    throw new Error("Installed package must include the platform-neutral token JSON contract.");
  }
  if (Object.keys(installedTokenContract.tokens ?? {}).length < 1000) {
    throw new Error("Installed token JSON contract must include the full token inventory.");
  }
  const installedCssRoots = packageCssRootInventory(packageRoot).roots;
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
  const missingInstalledCssContracts = componentCssContractCoverage().components
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

function exportTargets(value) {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return [value.default, value.types].filter(Boolean);
}

function pascalCase(value) {
  return value.split("-").map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join("");
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
