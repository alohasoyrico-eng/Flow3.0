#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-consumer-css-token-cascade.json");
const markdownOutput = path.join(outputDir, "system-consumer-css-token-cascade.md");
const checkMode = process.argv.includes("--check");

const tokenMarkers = [
  "--sys-color-surface:",
  "--sys-color-text:",
  "--sys-density-control-height:",
  "--sys-focus-ring:",
];

const componentAliasMarkers = [
  "--comp-button-bg-primary:",
  "--comp-card-bg:",
  "--comp-field-control-size:",
  "--comp-table-bg:",
  "--comp-code-block-bg:",
  "--comp-code-block-copy-copied-color:",
];

const componentRootMarkers = [
  ".button",
  ".card",
  ".field",
  ".table",
  ".code-block",
  ".code-block__copy-action",
];

const densityMarkers = [
  '.button[data-density="sm"]',
  '.card[data-density="lg"]',
  '.field[data-density="sm"]',
  '.table[data-density="sm"]',
];

const forbiddenCssMarkers = [
  "apps/docs",
  "docs-demo",
  "gold-",
  "@design-system/components",
  "@design-system/react",
  "sourceMappingURL",
];

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

function packFlow(cacheDir) {
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

function writeCssSmoke(consumerDir) {
  const source = `
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tokenMarkers = ${JSON.stringify(tokenMarkers, null, 2)};
const componentAliasMarkers = ${JSON.stringify(componentAliasMarkers, null, 2)};
const componentRootMarkers = ${JSON.stringify(componentRootMarkers, null, 2)};
const densityMarkers = ${JSON.stringify(densityMarkers, null, 2)};
const forbiddenCssMarkers = ${JSON.stringify(forbiddenCssMarkers, null, 2)};

const tokenFile = require.resolve("@alohasoyrico-eng/flow/tokens/styles.css");
const componentFile = require.resolve("@alohasoyrico-eng/flow/components/styles.css");
const tokenCss = fs.readFileSync(tokenFile, "utf8");
const componentCss = fs.readFileSync(componentFile, "utf8");
const combinedCss = [tokenCss, componentCss].join("\\n");

assert.match(tokenFile, /node_modules\\/@alohasoyrico-eng\\/flow\\//);
assert.match(componentFile, /node_modules\\/@alohasoyrico-eng\\/flow\\//);
for (const marker of tokenMarkers) assert.ok(tokenCss.includes(marker), \`Missing token marker \${marker}\`);
for (const marker of componentAliasMarkers) assert.ok(componentCss.includes(marker), \`Missing component alias \${marker}\`);
for (const marker of componentRootMarkers) assert.ok(componentCss.includes(marker), \`Missing component root marker \${marker}\`);
for (const marker of densityMarkers) assert.ok(componentCss.includes(marker), \`Missing density marker \${marker}\`);
for (const marker of forbiddenCssMarkers) {
  assert.ok(!tokenCss.includes(marker), \`Token CSS leaked forbidden marker \${marker}\`);
  assert.ok(!componentCss.includes(marker), \`Component CSS leaked forbidden marker \${marker}\`);
}
assert.ok(
  combinedCss.indexOf("--sys-color-surface:") < combinedCss.indexOf("--comp-button-bg-primary:"),
  "Expected consumer CSS cascade to load tokens before component aliases.",
);

const customEntry = [
  '@import "@alohasoyrico-eng/flow/tokens/styles.css";',
  '@import "@alohasoyrico-eng/flow/components/styles.css";',
  ".consumer-screen {",
  "  color: var(--sys-color-text);",
  "  background: var(--sys-color-surface);",
  "}",
].join("\\n");
fs.writeFileSync("consumer-cascade.css", \`\${customEntry}\\n\`);
assert.deepEqual(
  [...customEntry.matchAll(/@import\\s+"([^"]+)"/g)].map((match) => match[1]),
  ["@alohasoyrico-eng/flow/tokens/styles.css", "@alohasoyrico-eng/flow/components/styles.css"],
);

console.log(JSON.stringify({
  status: "pass",
  tokenCssBytes: tokenCss.length,
  componentCssBytes: componentCss.length,
  tokenMarkers: tokenMarkers.length,
  componentAliasMarkers: componentAliasMarkers.length,
  componentRootMarkers: componentRootMarkers.length,
  densityMarkers: densityMarkers.length,
  forbiddenCssMarkers: forbiddenCssMarkers.length,
}, null, 2));
`;
  fs.writeFileSync(path.join(consumerDir, "css-smoke.mjs"), source.trimStart());
}

function runConsumerCssSmoke() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "consumer-css-token-cascade-"));
  const cacheDir = path.join(tempRoot, "npm-cache");
  let tarball = "";
  try {
    const packed = packFlow(cacheDir);
    tarball = packed.tarball;
    const consumerDir = path.join(tempRoot, "consumer");
    fs.mkdirSync(consumerDir, { recursive: true });
    writeConsumerPackage(consumerDir, tarball);
    run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], consumerDir, {
      npm_config_cache: cacheDir,
    });
    writeCssSmoke(consumerDir);
    const result = run("node", ["css-smoke.mjs"], consumerDir);
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
  const result = runConsumerCssSmoke();
  const consumerCssTokenCascadeDebt = result.status === "pass" && result.smoke.status === "pass" ? 0 : 1;
  return {
    schemaVersion: "flow-system-consumer-css-token-cascade@1",
    generatedAt: "2026-08-14",
    status: consumerCssTokenCascadeDebt ? "fail" : "pass",
    inventory: {
      packedFiles: result.pack.files,
      tokenCssBytes: result.smoke.tokenCssBytes,
      componentCssBytes: result.smoke.componentCssBytes,
      tokenMarkers: result.smoke.tokenMarkers,
      componentAliasMarkers: result.smoke.componentAliasMarkers,
      componentRootMarkers: result.smoke.componentRootMarkers,
      densityMarkers: result.smoke.densityMarkers,
      forbiddenCssMarkers: result.smoke.forbiddenCssMarkers,
      consumerCssTokenCascadeDebt,
    },
    markers: {
      tokenMarkers,
      componentAliasMarkers,
      componentRootMarkers,
      densityMarkers,
      forbiddenCssMarkers,
    },
    policy: {
      packageBoundary: "CSS smoke must resolve CSS through public package exports only.",
      cascadeOrder: "Consumers must load token CSS before component CSS aliases.",
      leakBoundary: "Installed CSS must not leak FlowDocs, gold-* demo, sourcemap, or workspace import markers.",
    },
  };
}

function renderMarkdown(report) {
  return [
    "# System consumer CSS token cascade",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Packed files: ${report.inventory.packedFiles}`,
    `- Token CSS bytes: ${report.inventory.tokenCssBytes}`,
    `- Component CSS bytes: ${report.inventory.componentCssBytes}`,
    `- Token markers: ${report.inventory.tokenMarkers}`,
    `- Component alias markers: ${report.inventory.componentAliasMarkers}`,
    `- Component root markers: ${report.inventory.componentRootMarkers}`,
    `- Density markers: ${report.inventory.densityMarkers}`,
    `- Forbidden CSS markers checked: ${report.inventory.forbiddenCssMarkers}`,
    `- Consumer CSS token cascade debt: ${report.inventory.consumerCssTokenCascadeDebt}`,
    "",
    "## Policy",
    "",
    `- Package boundary: ${report.policy.packageBoundary}`,
    `- Cascade order: ${report.policy.cascadeOrder}`,
    `- Leak boundary: ${report.policy.leakBoundary}`,
    "",
  ].join("\n");
}

function main() {
  const report = buildReport();
  if (checkMode) {
    if (!fs.existsSync(jsonOutput)) {
      console.error("Consumer CSS token cascade report is missing. Run: node packages/audit/scripts/report-system-consumer-css-token-cascade.js");
      process.exit(1);
    }
    const existing = fs.readFileSync(jsonOutput, "utf8");
    const expected = `${JSON.stringify(report, null, 2)}\n`;
    if (existing !== expected) {
      console.error("Consumer CSS token cascade report is stale. Run: node packages/audit/scripts/report-system-consumer-css-token-cascade.js");
      process.exit(1);
    }
    if (report.inventory.consumerCssTokenCascadeDebt) {
      console.error(`Consumer CSS token cascade debt detected: ${report.inventory.consumerCssTokenCascadeDebt}`);
      process.exit(1);
    }
    console.log(JSON.stringify({
      status: report.status,
      consumerCssTokenCascadeDebt: report.inventory.consumerCssTokenCascadeDebt,
      tokenMarkers: report.inventory.tokenMarkers,
      componentAliasMarkers: report.inventory.componentAliasMarkers,
    }, null, 2));
    return;
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    consumerCssTokenCascadeDebt: report.inventory.consumerCssTokenCascadeDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));
  if (report.inventory.consumerCssTokenCascadeDebt) process.exit(1);
}

main();
