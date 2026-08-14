#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-consumer-runtime-smoke.json");
const markdownOutput = path.join(outputDir, "system-consumer-runtime-smoke.md");
const checkMode = process.argv.includes("--check");

function run(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed:\n${result.stdout}\n${result.stderr}`);
  }
  return result;
}

function dependencyPackagePath(packageName) {
  return `file:${fs.realpathSync(path.join(root, "node_modules", packageName))}`;
}

function packFlow(tempRoot, cacheDir) {
  const result = run("npm", ["pack", "--json", "--ignore-scripts"], root, {
    npm_config_cache: cacheDir,
  });
  const pack = JSON.parse(result.stdout)[0];
  const tarball = path.join(root, pack.filename);
  if (!fs.existsSync(tarball)) throw new Error(`npm pack did not create ${pack.filename}.`);
  return { pack, tarball };
}

function writeConsumerPackage(consumerDir, tarball) {
  const packageJson = {
    private: true,
    type: "module",
    dependencies: {
      "@alohasoyrico-eng/flow": `file:${tarball}`,
      react: dependencyPackagePath("react"),
      "react-dom": dependencyPackagePath("react-dom"),
    },
  };
  fs.writeFileSync(path.join(consumerDir, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
}

function writeSmokeRuntime(consumerDir) {
  const source = `
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Button, Card, CodeBlock, CopyButton, Input, Select, Table } from "@alohasoyrico-eng/flow/react";
import { Search } from "@alohasoyrico-eng/flow/react/patterns/search";
import { Sidebar } from "@alohasoyrico-eng/flow/react/patterns/sidebar";
import { Topbar } from "@alohasoyrico-eng/flow/react/patterns/topbar";
import { DocumentationHero } from "@alohasoyrico-eng/flow/react/patterns/documentation-hero";
import { DocumentationSection } from "@alohasoyrico-eng/flow/react/patterns/documentation-section";
import { DemoPreviewFrame } from "@alohasoyrico-eng/flow/react/patterns/demo-preview-frame";
import { ArtifactMetadataBar } from "@alohasoyrico-eng/flow/react/patterns/artifact-metadata-bar";
import { OnThisPageNav } from "@alohasoyrico-eng/flow/react/patterns/on-this-page-nav";
import { DocsShellTemplate } from "@alohasoyrico-eng/flow/react/templates/docs-shell-template";
import { DocsHomeTemplate } from "@alohasoyrico-eng/flow/react/templates/docs-home-template";
import { ComponentDetailTemplate } from "@alohasoyrico-eng/flow/react/templates/component-detail-template";
import { PatternDetailTemplate } from "@alohasoyrico-eng/flow/react/templates/pattern-detail-template";
import { FleetDashboardSuite } from "@alohasoyrico-eng/flow/react/templates/fleet-dashboard-suite";

const require = createRequire(import.meta.url);
const resolvedExports = [
  "@alohasoyrico-eng/flow/react",
  "@alohasoyrico-eng/flow/react/button",
  "@alohasoyrico-eng/flow/react/code-block",
  "@alohasoyrico-eng/flow/react/copy-button",
  "@alohasoyrico-eng/flow/react/patterns/topbar",
  "@alohasoyrico-eng/flow/react/patterns/sidebar",
  "@alohasoyrico-eng/flow/react/patterns/search",
  "@alohasoyrico-eng/flow/react/patterns/documentation-hero",
  "@alohasoyrico-eng/flow/react/patterns/documentation-section",
  "@alohasoyrico-eng/flow/react/patterns/demo-preview-frame",
  "@alohasoyrico-eng/flow/react/templates/docs-shell-template",
  "@alohasoyrico-eng/flow/react/templates/docs-home-template",
  "@alohasoyrico-eng/flow/react/templates/component-detail-template",
  "@alohasoyrico-eng/flow/react/templates/pattern-detail-template",
  "@alohasoyrico-eng/flow/tokens/styles.css",
  "@alohasoyrico-eng/flow/components/styles.css",
];
for (const specifier of resolvedExports) {
  assert.ok(require.resolve(specifier), \`Expected public export to resolve: \${specifier}\`);
}

const navGroups = [
  {
    title: "Components",
    icon: "box",
    open: true,
    routes: [
      { key: "button", label: "Button", active: true },
      { key: "card", label: "Card" },
    ],
  },
];
const searchResults = [
  { key: "button", label: "Button", description: "Primary action" },
  { key: "sidebar", label: "Sidebar", description: "Navigation pattern" },
];
const metadata = [
  { key: "status", label: "Status", value: "Ready" },
  { key: "layer", label: "Layer", value: "React" },
];
const navItems = [
  { key: "usage", label: "Usage", href: "#usage" },
  { key: "api", label: "API", href: "#api" },
];

const cases = [
  ["Button", React.createElement(Button, { label: "Continue", density: "md" })],
  ["Card", React.createElement(Card, { title: "Balance", value: "$1,240", density: "md" })],
  ["Input", React.createElement(Input, { label: "Search", value: "Fuel", density: "md" })],
  ["Select", React.createElement(Select, {
    label: "Status",
    value: "active",
    options: [{ label: "Active", value: "active" }],
    density: "md",
  })],
  ["Table", React.createElement(Table, {
    label: "Stations",
    columns: [{ key: "name", label: "Name" }],
    rows: [{ id: "row-1", name: "North station" }],
    rowKey: "id",
    density: "md",
  })],
  ["CodeBlock", React.createElement(CodeBlock, { language: "tsx", code: "export const ok = true;" })],
  ["CopyButton", React.createElement(CopyButton, { label: "Copy", value: "copy-value" })],
  ["Search", React.createElement(Search, {
    label: "Search docs",
    value: "button",
    results: searchResults,
    resultCount: 2,
  })],
  ["Sidebar", React.createElement(Sidebar, {
    label: "Documentation navigation",
    groups: navGroups,
    activeKey: "button",
    expandedIds: ["Components"],
  })],
  ["Topbar", React.createElement(Topbar, {
    label: "Flow docs",
    search: { label: "Search docs", value: "button", results: searchResults },
    actions: [{ key: "theme", label: "Theme", ariaLabel: "Theme", icon: "sun" }],
  })],
  ["DocumentationHero", React.createElement(DocumentationHero, {
    kicker: "Components",
    title: "Button",
    description: "Actions that move the workflow forward.",
    metadata,
    background: "gradient-grid",
  })],
  ["DocumentationSection", React.createElement(DocumentationSection, {
    title: "Usage",
    description: "Use the component for primary actions.",
  }, React.createElement(Button, { label: "Save" }))],
  ["DemoPreviewFrame", React.createElement(DemoPreviewFrame, {
    label: "Preview",
    preview: React.createElement(Button, { label: "Preview action" }),
  })],
  ["ArtifactMetadataBar", React.createElement(ArtifactMetadataBar, { items: metadata })],
  ["OnThisPageNav", React.createElement(OnThisPageNav, { label: "On this page", items: navItems })],
  ["DocsShellTemplate", React.createElement(DocsShellTemplate, {
    label: "Flow documentation",
    sidebar: { label: "Docs", groups: navGroups, activeKey: "button", expandedIds: ["Components"] },
    topbar: { label: "Flow docs", search: { label: "Search docs", value: "button", results: searchResults } },
  }, React.createElement("main", null, "Docs content"))],
  ["DocsHomeTemplate", React.createElement(DocsHomeTemplate, {
    title: "Flow",
    description: "Design system documentation.",
    metadata,
  }, React.createElement(DocumentationSection, { title: "Start" }))],
  ["ComponentDetailTemplate", React.createElement(ComponentDetailTemplate, {
    title: "Button",
    description: "Action component.",
    metadata,
    navItems,
    demo: React.createElement(Button, { label: "Save" }),
  }, React.createElement(DocumentationSection, { title: "API" }))],
  ["PatternDetailTemplate", React.createElement(PatternDetailTemplate, {
    title: "Sidebar",
    description: "Navigation pattern.",
    metadata,
    navItems,
    demo: React.createElement(Sidebar, { label: "Pattern", groups: navGroups }),
  }, React.createElement(DocumentationSection, { title: "Behavior" }))],
  ["FleetDashboardSuite", React.createElement(FleetDashboardSuite, { defaultSelectedDashboard: "overview" })],
];

const failures = [];
const rendered = [];
for (const [name, element] of cases) {
  try {
    const markup = renderToStaticMarkup(element);
    assert.ok(markup.length > 0, \`\${name} rendered empty markup\`);
    assert.doesNotMatch(markup, /apps\\/docs|docs-demo|gold-|sourceMappingURL/i, \`\${name} leaked docs-only/runtime-local markup\`);
    rendered.push({ name, markupLength: markup.length });
  } catch (error) {
    failures.push({ name, message: error.message });
  }
}

assert.deepEqual(failures, []);
console.log(JSON.stringify({
  status: "pass",
  resolvedExports: resolvedExports.length,
  renderedArtifacts: rendered.length,
  rendered,
}, null, 2));
`;
  fs.writeFileSync(path.join(consumerDir, "runtime-smoke.mjs"), source.trimStart());
}

function runConsumerRuntimeSmoke() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "consumer-runtime-smoke-"));
  const cacheDir = path.join(tempRoot, "npm-cache");
  let tarball = "";
  try {
    const packed = packFlow(tempRoot, cacheDir);
    tarball = packed.tarball;
    const consumerDir = path.join(tempRoot, "consumer");
    fs.mkdirSync(consumerDir, { recursive: true });
    writeConsumerPackage(consumerDir, tarball);
    run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], consumerDir, {
      npm_config_cache: cacheDir,
    });
    writeSmokeRuntime(consumerDir);
    const result = run("node", ["runtime-smoke.mjs"], consumerDir);
    return {
      status: "pass",
      pack: {
        name: packed.pack.name,
        version: packed.pack.version,
        files: packed.pack.files?.length ?? 0,
      },
      smoke: JSON.parse(result.stdout),
    };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    if (tarball) fs.rmSync(tarball, { force: true });
  }
}

function buildReport() {
  const result = runConsumerRuntimeSmoke();
  const consumerRuntimeSmokeDebt = result.status === "pass" && result.smoke.status === "pass" ? 0 : 1;
  return {
    schemaVersion: "flow-system-consumer-runtime-smoke@1",
    generatedAt: "2026-08-14",
    status: consumerRuntimeSmokeDebt ? "fail" : "pass",
    inventory: {
      packedFiles: result.pack.files,
      resolvedExports: result.smoke.resolvedExports,
      renderedArtifacts: result.smoke.renderedArtifacts,
      consumerRuntimeSmokeDebt,
    },
    renderedArtifacts: result.smoke.rendered,
    policy: {
      packageBoundary: "Runtime smoke must import through public @alohasoyrico-eng/flow exports only.",
      renderBoundary: "Representative components, documentation patterns, and templates must render outside FlowDocs.",
      docsLeakBoundary: "Rendered markup must not leak apps/docs, docs-demo, gold-* or sourcemap markers.",
    },
  };
}

function renderMarkdown(report) {
  const rows = report.renderedArtifacts
    .map((item) => `| ${item.name} | ${item.markupLength} |`)
    .join("\n");
  return [
    "# System consumer runtime smoke",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Packed files: ${report.inventory.packedFiles}`,
    `- Resolved exports: ${report.inventory.resolvedExports}`,
    `- Rendered artifacts: ${report.inventory.renderedArtifacts}`,
    `- Consumer runtime smoke debt: ${report.inventory.consumerRuntimeSmokeDebt}`,
    "",
    "## Rendered Artifacts",
    "",
    "| Artifact | Markup length |",
    "| --- | ---: |",
    rows || "| None | 0 |",
    "",
    "## Policy",
    "",
    `- Package boundary: ${report.policy.packageBoundary}`,
    `- Render boundary: ${report.policy.renderBoundary}`,
    `- Docs leak boundary: ${report.policy.docsLeakBoundary}`,
    "",
  ].join("\n");
}

function main() {
  const report = buildReport();
  if (checkMode) {
    if (!fs.existsSync(jsonOutput)) {
      console.error("Consumer runtime smoke report is missing. Run: node packages/audit/scripts/report-system-consumer-runtime-smoke.js");
      process.exit(1);
    }
    const existing = fs.readFileSync(jsonOutput, "utf8");
    const expected = `${JSON.stringify(report, null, 2)}\n`;
    if (existing !== expected) {
      console.error("Consumer runtime smoke report is stale. Run: node packages/audit/scripts/report-system-consumer-runtime-smoke.js");
      process.exit(1);
    }
    if (report.inventory.consumerRuntimeSmokeDebt) {
      console.error(`Consumer runtime smoke debt detected: ${report.inventory.consumerRuntimeSmokeDebt}`);
      process.exit(1);
    }
    console.log(JSON.stringify({
      status: report.status,
      renderedArtifacts: report.inventory.renderedArtifacts,
      consumerRuntimeSmokeDebt: report.inventory.consumerRuntimeSmokeDebt,
    }, null, 2));
    return;
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    renderedArtifacts: report.inventory.renderedArtifacts,
    consumerRuntimeSmokeDebt: report.inventory.consumerRuntimeSmokeDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));
  if (report.inventory.consumerRuntimeSmokeDebt) process.exit(1);
}

main();
