#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const root = process.cwd();
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
  const tarball = packFlow();
  packedTarball = tarball;
  const consumerDir = path.join(tempRoot, "consumer");
  fs.mkdirSync(consumerDir, { recursive: true });
  writeConsumerPackage(consumerDir, tarball);
  run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], consumerDir, {
    npm_config_cache: cacheDir,
  });
  writeConsumerScreen(consumerDir);
  run("node", ["screen.mjs"], consumerDir);
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
  return tarball;
}

function writeConsumerPackage(consumerDir, tarball) {
  const packageJson = {
    type: "module",
    private: true,
    dependencies: {
      "@alohasoyrico-eng/flow": `file:${tarball}`,
      react: `file:${path.join(root, "node_modules/react")}`,
      "react-dom": `file:${path.join(root, "node_modules/react-dom")}`,
    },
  };
  fs.writeFileSync(path.join(consumerDir, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
}

function writeConsumerScreen(consumerDir) {
  const source = `
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, Card, Input, Table } from "@alohasoyrico-eng/flow/react";
import { Dialog } from "@alohasoyrico-eng/flow/react/dialog";

const require = createRequire(import.meta.url);
for (const exportedPath of [
  "@alohasoyrico-eng/flow/tokens/styles.css",
  "@alohasoyrico-eng/flow/components/styles.css",
  "@alohasoyrico-eng/flow/components",
  "@alohasoyrico-eng/flow/components/platforms",
]) {
  assert.ok(require.resolve(exportedPath), \`Expected package export to resolve: \${exportedPath}\`);
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
    title: "Confirm route",
    description: "This dialog renders outside FlowDocs.",
    open: true,
    actions: [
      { label: "Cancel", variant: "secondary" },
      { label: "Confirm", variant: "primary" },
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

function auditInstalledPackage(consumerDir) {
  const packageRoot = path.join(consumerDir, "node_modules/@alohasoyrico-eng/flow");
  const consumerRequire = createRequire(path.join(consumerDir, "package.json"));
  const installedPackage = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  for (const [key, value] of Object.entries(installedPackage.exports ?? {})) {
    if (!key.startsWith("./react")) continue;
    const packagePath = key === "./react" ? "@alohasoyrico-eng/flow/react" : `@alohasoyrico-eng/flow/${key.slice(2)}`;
    consumerRequire.resolve(packagePath);
    if (!value?.types || !value?.default) throw new Error(`React export ${key} must publish types and default targets.`);
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
