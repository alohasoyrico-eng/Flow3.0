#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const auditScriptsDir = path.join(root, "packages/audit/scripts");
const forbiddenPrefix = "fl" + "ow-";
const hasDocsApp = fs.existsSync(path.join(root, "apps/docs"));
const hasDocsConsumerApp = [
  path.join(root, "../FlowDocs/apps/docs"),
  path.join(root, "apps/docs"),
].some((dir) => fs.existsSync(dir));
const hasFoundationDependencyMatrix = hasRepoFile("docs/audits/foundation-dependency-matrix.json");
const hasPrimitiveCascadeGate = hasFoundationDependencyMatrix
  && hasRepoFile("docs/audits/foundation-frame-cascade-audit.json")
  && hasRepoFile("docs/audits/primitive-density-cascade-audit.json")
  && hasRepoFile("docs/audits/primitive-spacing-cascade-audit.json");

function hasRepoFile(file) {
  return fs.existsSync(path.join(root, file));
}

const expectedAuditFiles = new Set([
  "audit-adoption-readiness.js",
  "audit-anti-duplication.js",
  "audit-accessibility-contracts.js",
  "audit-accordion-css-contract.js",
  "audit-architecture-gate.js",
  "audit-animated-moment-css-contract.js",
  "audit-audit-event-css-contract.js",
  "audit-avatar-css-contract.js",
  "audit-batch-zip-parity.js",
  "audit-badge-css-contract.js",
  "audit-biometric-prompt-css-contract.js",
  "audit-breadcrumbs-css-contract.js",
  "audit-breakpoint-contracts.js",
  "audit-button-css-contract.js",
  "audit-card-css-contract.js",
  "audit-card-summary-css-contract.js",
  "audit-chart-panel-css-contract.js",
  "audit-chip-css-contract.js",
  "audit-choice-css-contract.js",
  "audit-code-input-css-contract.js",
  "audit-complete.mjs",
  "audit-component-1to1-quality-matrix.js",
  "audit-component-alias-literals.js",
  "audit-component-api-prop-alignment.js",
  "audit-component-behavior-contracts.js",
  "audit-component-catalog-classification.mjs",
  "audit-component-contract-alignment.js",
  "audit-component-contracts.js",
  "audit-component-cross-aliases.js",
  "audit-component-css-contracts.js",
  "audit-component-demo-interactions.mjs",
  "audit-component-demo-registry.mjs",
  "audit-consumer-install.mjs",
  "audit-component-implementation-status.js",
  "audit-component-modules.js",
  "audit-component-motion-role-coverage.js",
  "audit-component-registry.js",
  "audit-component-remediation-coverage.js",
  "audit-component-var-fallbacks.js",
  "audit-content-ownership.js",
  "audit-context.js",
  "audit-css-ownership.js",
  "audit-css.js",
  "audit-date-picker-css-contract.js",
  "audit-demo-layout-contracts.js",
  "audit-density-contracts.js",
  "audit-dialog-css-contract.js",
  "audit-docs-component-demo-ownership.js",
  "audit-docs-content.js",
  "audit-docs-runtime.mjs",
  "audit-docs.js",
  "audit-drawer-css-contract.js",
  "audit-empty-state-css-contract.js",
  "audit-energy-contracts.js",
  "audit-error-panel-css-contract.js",
  "audit-field-css-contract.js",
  "audit-floating-action-button-css-contract.js",
  "audit-frame-contracts.js",
  "audit-foundation-cascade-contracts.js",
  "audit-foundation-contracts.js",
  "audit-gold-components.js",
  "audit-gold-copy.js",
  "audit-gold-demo-quality.js",
  "audit-gold-docs.js",
  "audit-gold-page-parity.js",
  "audit-icon-button-css-contract.js",
  "audit-inline-validation-css-contract.js",
  "audit-integration.js",
  "audit-kpi-tile-css-contract.js",
  "audit-layout-contracts.js",
  "audit-list-css-contract.js",
  "audit-manual-accessibility.js",
  "audit-menu-css-contract.js",
  "audit-motion-boundary-css-contract.js",
  "audit-motion-contracts.js",
  "audit-movement-row-css-contract.js",
  "audit-package-api.js",
  "audit-platform-adapters.js",
  "audit-package-css-contracts.js",
  "audit-package-css-namespace.js",
  "audit-pagination-css-contract.js",
  "audit-pattern-contracts.js",
  "audit-platform.js",
  "audit-popover-css-contract.js",
  "audit-primitive-contracts.js",
  "audit-progress-indicator-css-contract.js",
  "audit-quick-action-css-contract.js",
  "audit-react-contract-triangle.js",
  "audit-react-copy-contract.js",
  "audit-repo-boundary-runner.js",
  "audit-repo-boundary.js",
  "audit-react-primary-contract.js",
  "audit-react-primary-inventory.js",
  "audit-result.js",
  "audit-route-summary-css-contract.js",
  "audit-routes.js",
  "audit-segmented-control-css-contract.js",
  "audit-select-css-contract.js",
  "audit-skeleton-css-contract.js",
  "audit-slider-css-contract.js",
  "audit-spec.js",
  "audit-spinner-css-contract.js",
  "audit-state-contracts.js",
  "audit-station-pin-css-contract.js",
  "audit-stepper-css-contract.js",
  "audit-switch-css-contract.js",
  "audit-system-scope.js",
  "audit-system.js",
  "audit-table-contracts.js",
  "audit-table-css-contract.js",
  "audit-tabs-css-contract.js",
  "audit-tag-css-contract.js",
  "audit-taxonomy-boundaries.js",
  "audit-template-composition.js",
  "audit-toast-css-contract.js",
  "audit-tokenized-css-properties.js",
  "audit-tooltip-css-contract.js",
  "audit-tree-view-css-contract.js",
  "audit-voice-contracts.js",
  "report-foundation-accessibility-cascade.js",
  "report-legacy-dom-source-governance.js",
  "report-react-accessibility-governance.js",
  "report-anti-duplication-coverage.js",
  "report-component-css-contract-coverage.js",
  "report-component-visual-cascade.js",
  "report-react-class-ownership.js",
  "report-react-composition-governance.js",
  "report-react-contract-prop-alignment.js",
  "report-react-controlled-governance.js",
  "report-react-default-governance.js",
  "report-react-primary-coverage.js",
  "report-react-style-governance.js",
  "report-foundation-depth-cascade.js",
  "report-foundation-energy-cascade.js",
  "report-foundation-frame-cascade.js",
  "report-foundation-growth-cascade.js",
  "report-foundation-iconography-cascade.js",
  "report-foundation-momentum-cascade.js",
  "report-foundation-state-cascade.js",
  "report-foundation-symbol-cascade.js",
  "report-foundation-tone-cascade.js",
  "report-foundation-voice-cascade.js",
  "report-primitive-breakpoints-cascade.js",
  "report-primitive-charts-cascade.js",
  "report-primitive-country-flags-cascade.js",
  "report-primitive-animation-assets-cascade.js",
  "report-primitive-illustration-assets-cascade.js",
  "report-primitive-library-sources-cascade.js",
  "report-primitive-color-cascade.js",
  "report-primitive-density-cascade.js",
  "report-primitive-disabled-cascade.js",
  "report-primitive-duration-cascade.js",
  "report-primitive-elevation-cascade.js",
  "report-primitive-focus-cascade.js",
  "report-primitive-iconography-cascade.js",
  "report-primitive-loading-cascade.js",
  "report-primitive-maps-cascade.js",
  "report-primitive-measurement-cascade.js",
  "report-primitive-message-cascade.js",
  "report-primitive-motion-curves-cascade.js",
  "report-primitive-radius-cascade.js",
  "report-primitive-research-cascade.js",
  "report-primitive-spacing-cascade.js",
  "report-primitive-typography-cascade.js",
  "report-foundation-quality.js",
  "report-react-interaction-coverage.js",
]);

const primitiveCascadeChecks = [
  ["breakpoints primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-breakpoints-cascade.js", "--check"])],
  ["charts primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-charts-cascade.js", "--check"])],
  ["country flags primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-country-flags-cascade.js", "--check"])],
  ["animation assets primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-animation-assets-cascade.js", "--check"])],
  ["illustration assets primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-illustration-assets-cascade.js", "--check"])],
  ["library sources primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-library-sources-cascade.js", "--check"])],
  ["color primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-color-cascade.js", "--check"])],
  ["density primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-density-cascade.js", "--check"])],
  ["disabled primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-disabled-cascade.js", "--check"])],
  ["duration primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-duration-cascade.js", "--check"])],
  ["elevation primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-elevation-cascade.js", "--check"])],
  ["focus primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-focus-cascade.js", "--check"])],
  ["iconography primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-iconography-cascade.js", "--check"])],
  ["loading primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-loading-cascade.js", "--check"])],
  ["maps primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-maps-cascade.js", "--check"])],
  ["measurement primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-measurement-cascade.js", "--check"])],
  ["message primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-message-cascade.js", "--check"])],
  ["motion curves primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-motion-curves-cascade.js", "--check"])],
  ["radius primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-radius-cascade.js", "--check"])],
  ["research primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-research-cascade.js", "--check"])],
  ["spacing primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-spacing-cascade.js", "--check"])],
  ["typography primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-typography-cascade.js", "--check"])],
];

const checks = [
  ["audit registry", auditRegistry],
  ["audit entrypoints", auditEntrypoints],
  ["public prefix", auditPublicPrefix],
  ...(hasRepoFile("scripts/generate-token-contract.mjs")
    ? [["token contract freshness", () => run("node", ["scripts/generate-token-contract.mjs", "--check"])]]
    : []),
  ...(hasRepoFile("packages/react/scripts/build.mjs")
    ? [["react dist freshness", () => run("node", ["packages/react/scripts/build.mjs", "--check"])]]
    : []),
  ...(hasRepoFile("scripts/generate-foundation-contracts.mjs")
    ? [["foundation contracts", () => run("node", ["scripts/generate-foundation-contracts.mjs", "--check"])]]
    : []),
  ...(hasFoundationDependencyMatrix ? [
    ["accessibility cascade report", () => run("node", ["packages/audit/scripts/report-foundation-accessibility-cascade.js", "--check"])],
    ["depth cascade report", () => run("node", ["packages/audit/scripts/report-foundation-depth-cascade.js", "--check"])],
    ["energy cascade report", () => run("node", ["packages/audit/scripts/report-foundation-energy-cascade.js", "--check"])],
    ["frame cascade report", () => run("node", ["packages/audit/scripts/report-foundation-frame-cascade.js", "--check"])],
    ["growth cascade report", () => run("node", ["packages/audit/scripts/report-foundation-growth-cascade.js", "--check"])],
    ["iconography cascade report", () => run("node", ["packages/audit/scripts/report-foundation-iconography-cascade.js", "--check"])],
    ["momentum cascade report", () => run("node", ["packages/audit/scripts/report-foundation-momentum-cascade.js", "--check"])],
    ["state cascade report", () => run("node", ["packages/audit/scripts/report-foundation-state-cascade.js", "--check"])],
    ["symbol cascade report", () => run("node", ["packages/audit/scripts/report-foundation-symbol-cascade.js", "--check"])],
    ["tone cascade report", () => run("node", ["packages/audit/scripts/report-foundation-tone-cascade.js", "--check"])],
    ["voice cascade report", () => run("node", ["packages/audit/scripts/report-foundation-voice-cascade.js", "--check"])],
    ["foundation cascade readiness", auditFoundationCascadeReadiness],
  ] : []),
  ...(hasRepoFile("scripts/generate-primitive-contracts.mjs")
    ? [["primitive contracts", () => run("node", ["scripts/generate-primitive-contracts.mjs", "--check"])]]
    : []),
  ...(hasPrimitiveCascadeGate ? primitiveCascadeChecks : []),
  ...(hasDocsApp ? [["docs build", () => run("npm", ["run", "build:docs"])]] : []),
  ...(hasDocsApp ? [["static system/docs/integration", () => run("node", ["packages/audit/scripts/audit-system.js"])]] : []),
  ["platform adapters", () => run("node", ["packages/audit/scripts/audit-system-scope.js"])],
  ["component smoke tests", () => run("npm", ["test"])],
  ...(hasDocsApp ? [["docs runtime", () => run("node", ["packages/audit/scripts/audit-docs-runtime.mjs"])]] : []),
  ["repo boundary", () => run("node", ["packages/audit/scripts/audit-repo-boundary-runner.js"])],
  ["consumer install", () => run("node", ["packages/audit/scripts/audit-consumer-install.mjs"])],
  ...(hasRepoFile("scripts/audit-system-split.mjs")
    ? [["system split", () => run("node", ["scripts/audit-system-split.mjs"])]]
    : []),
  ...(hasRepoFile("scripts/audit-docs-split.mjs")
    ? [["docs split", () => run("node", ["scripts/audit-docs-split.mjs"])]]
    : []),
  ["component demo registry", () => run("node", ["packages/audit/scripts/audit-component-demo-registry.mjs"])],
  ...(hasDocsConsumerApp ? [["component catalog classification", () => run("node", ["packages/audit/scripts/audit-component-catalog-classification.mjs"])]] : []),
  ["component demo interactions", () => run("node", ["packages/audit/scripts/audit-component-demo-interactions.mjs"])],
  ["legacy DOM source governance report", () => run("node", ["packages/audit/scripts/report-legacy-dom-source-governance.js", "--check"])],
  ["anti duplication coverage report", () => run("node", ["packages/audit/scripts/report-anti-duplication-coverage.js", "--check"])],
  ["react accessibility governance report", () => run("node", ["packages/audit/scripts/report-react-accessibility-governance.js", "--check"])],
  ["react class ownership report", () => run("node", ["packages/audit/scripts/report-react-class-ownership.js", "--check"])],
  ["react composition governance report", () => run("node", ["packages/audit/scripts/report-react-composition-governance.js", "--check"])],
  ["react contract prop alignment report", () => run("node", ["packages/audit/scripts/report-react-contract-prop-alignment.js", "--check"])],
  ["react controlled governance report", () => run("node", ["packages/audit/scripts/report-react-controlled-governance.js", "--check"])],
  ["react default governance report", () => run("node", ["packages/audit/scripts/report-react-default-governance.js", "--check"])],
  ["react primary coverage report", () => run("node", ["packages/audit/scripts/report-react-primary-coverage.js", "--check"])],
  ["react style governance report", () => run("node", ["packages/audit/scripts/report-react-style-governance.js", "--check"])],
  ["react interaction coverage report", () => run("node", ["packages/audit/scripts/report-react-interaction-coverage.js", "--check"])],
  ["component css contract coverage report", () => run("node", ["packages/audit/scripts/report-component-css-contract-coverage.js", "--check"])],
  ["component visual cascade report", () => run("node", ["packages/audit/scripts/report-component-visual-cascade.js", "--check"])],
];

const summary = {
  status: "pass",
  checks: [],
};

for (const [name, check] of checks) {
  try {
    const started = Date.now();
    check();
    summary.checks.push({ name, status: "pass", ms: Date.now() - started });
  } catch (error) {
    summary.status = "fail";
    summary.checks.push({ name, status: "fail", message: error.message });
    break;
  }
}

console.log(JSON.stringify(summary, null, 2));
if (summary.status !== "pass") process.exitCode = 1;

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

function auditRegistry() {
  const actual = fs.readdirSync(auditScriptsDir)
    .filter((file) => /^(audit-|report-).*\.(?:js|mjs)$/.test(file))
    .sort();
  const missing = [...expectedAuditFiles].filter((file) => !actual.includes(file));
  const unregistered = actual.filter((file) => !expectedAuditFiles.has(file));
  if (missing.length || unregistered.length) {
    throw new Error(`Audit registry mismatch. Missing: ${missing.join(", ") || "none"}. Unregistered: ${unregistered.join(", ") || "none"}.`);
  }
}

function auditEntrypoints() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  if (hasDocsApp) {
    if (packageJson.scripts?.audit !== "node packages/audit/scripts/audit-complete.mjs") {
      throw new Error("npm run audit must point at audit-complete.mjs.");
    }
    if (packageJson.scripts?.validate !== "npm run audit") {
      throw new Error("npm run validate must delegate to the single complete audit.");
    }
  } else {
    if (packageJson.scripts?.["audit:system"] !== "node packages/audit/scripts/audit-system-scope.js") {
      throw new Error("split system package must expose audit:system through audit-system-scope.js.");
    }
    if (packageJson.scripts?.["audit:complete"] !== "node packages/audit/scripts/audit-complete.mjs") {
      throw new Error("split system package must expose audit:complete through audit-complete.mjs.");
    }
    if (packageJson.scripts?.["build:tokens"] !== "node scripts/generate-token-contract.mjs") {
      throw new Error("split system package must expose build:tokens through generate-token-contract.mjs.");
    }
    if (packageJson.scripts?.["validate:system"] !== "npm run build:tokens && npm run build:react && npm run test:react && npm run audit:complete") {
      throw new Error("split system package must run build:tokens, build:react, test:react, and audit:complete as the full system gate.");
    }
  }

  for (const file of ["audit-system.js", "audit-docs.js", "audit-integration.js", "audit-system-scope.js"]) {
    const source = fs.readFileSync(path.join(auditScriptsDir, file), "utf8");
    const calls = [...source.matchAll(/\b(check[A-Z][A-Za-z0-9]+)\(\);/g)].map((match) => match[1]);
    const duplicates = calls.filter((call, index) => calls.indexOf(call) !== index);
    if (duplicates.length) {
      throw new Error(`${file} invokes duplicate checks: ${[...new Set(duplicates)].join(", ")}.`);
    }
  }
}

function auditPublicPrefix() {
  const roots = ["packages", "apps", "docs"];
  const offenders = [];
  for (const entry of roots) scan(path.join(root, entry), offenders);
  if (offenders.length) {
    throw new Error(`Forbidden public prefix found: ${offenders.slice(0, 20).join(", ")}`);
  }
}

function auditFoundationCascadeReadiness() {
  const auditDir = path.join(root, "docs/audits");
  const reports = fs.readdirSync(auditDir)
    .filter((file) => /^foundation-.*-cascade-audit\.json$/.test(file))
    .sort();
  const blockers = [];
  for (const reportFile of reports) {
    const report = JSON.parse(fs.readFileSync(path.join(auditDir, reportFile), "utf8"));
    if (report.status !== "pass") {
      blockers.push(`${report.foundation ?? reportFile}: ${report.status} (${(report.gaps ?? []).length} gaps)`);
    }
  }
  if (blockers.length) {
    throw new Error(`Foundation cascade is not ready for primitives. Blocking reports: ${blockers.join("; ")}.`);
  }
}

function scan(target, offenders) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    if (target.includes(`${path.sep}repo-split-output${path.sep}`)) return;
    for (const entry of fs.readdirSync(target)) scan(path.join(target, entry), offenders);
    return;
  }
  if (!/\.(?:css|html|js|mjs|json|md)$/.test(target)) return;
  const text = fs.readFileSync(target, "utf8");
  if (new RegExp(`(?<!over)${forbiddenPrefix}`).test(text)) offenders.push(path.relative(root, target));
}
