#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const { result } = require("./audit-context.js");
const { checkSystemArchitectureGate } = require("./audit-architecture-gate.js");
const { checkAdoptionReadiness } = require("./audit-adoption-readiness.js");
const { checkMachineReadableSpec } = require("./audit-spec.js");
const { checkComponentContracts } = require("./audit-component-contracts.js");
const { checkPatternContracts } = require("./audit-pattern-contracts.js");
const { checkTaxonomyBoundaries } = require("./audit-taxonomy-boundaries.js");
const { checkComponentBehaviorContracts } = require("./audit-component-behavior-contracts.js");
const { checkComponentModules } = require("./audit-component-modules.js");
const { checkPackageApiBoundary } = require("./audit-package-api.js");
const { checkPackageCssNamespace } = require("./audit-package-css-namespace.js");
const { checkPackageCssContracts } = require("./audit-package-css-contracts.js");
const { checkControlFrameCssContract } = require("./audit-control-frame-css-contract.js");
const { checkTokenCssValueContract } = require("./audit-token-css-value-contract.js");
const { checkPlatformAdapters } = require("./audit-platform-adapters.js");
const { checkDensityContracts } = require("./audit-density-contracts.js");
const { checkMotionContracts } = require("./audit-motion-contracts.js");
const { checkPriorityComponentMotionRoles } = require("./audit-component-motion-role-coverage.js");
const { checkBreakpointContracts } = require("./audit-breakpoint-contracts.js");
const { checkStateContracts } = require("./audit-state-contracts.js");
const { checkReactPrimaryContract } = require("./audit-react-primary-contract.js");
const { checkReactContractTriangle } = require("./audit-react-contract-triangle.js");
const { checkReactCopyContract } = require("./audit-react-copy-contract.js");
const { checkAntiDuplicationGovernance } = require("./audit-anti-duplication.js");
const { checkAccessibilityContracts } = require("./audit-accessibility-contracts.js");
const { checkManualAccessibility } = require("./audit-manual-accessibility.js");
const { finishAudit } = require("./audit-result.js");

const coreCheckpointChecks = [
  {
    id: "phase1-style-dictionary",
    args: ["packages/audit/scripts/report-system-phase1-style-dictionary-checkpoint.js", "--check"],
    owns: "Style Dictionary source ownership, reproducible token outputs, generated output governance, and raw token value blocking",
  },
  {
    id: "phase3-foundations-primitives",
    args: ["packages/audit/scripts/report-system-phase3-foundations-primitives-checkpoint.js", "--check"],
    owns: "foundation/primitive cascade closure, export contracts, runtime/policy primitive contracts, generated tokens, and source-boundary governance",
  },
];

function checkCoreCheckpointReports() {
  const checks = coreCheckpointChecks.map((check) => {
    const child = spawnSync("node", check.args, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return {
      ...check,
      commandLine: ["node", ...check.args].join(" "),
      status: child.status === 0 ? "pass" : "fail",
      stdoutTail: String(child.stdout ?? "").split("\n").filter(Boolean).slice(-8),
      stderrTail: String(child.stderr ?? "").split("\n").filter(Boolean).slice(-8),
    };
  });
  result.inventory.coreCheckpointReports = checks.length;
  result.inventory.coreCheckpointReportsPassing = checks.filter((check) => check.status === "pass").length;
  result.info.push({
    check: "core checkpoint reports",
    checks: checks.map(({ id, status, commandLine, owns }) => ({ id, status, commandLine, owns })),
  });
  for (const check of checks.filter((item) => item.status !== "pass")) {
    result.errors.push({
      check: "core checkpoint reports",
      message: `${check.id} failed`,
      command: check.commandLine,
      stdoutTail: check.stdoutTail,
      stderrTail: check.stderrTail,
    });
  }
}

checkSystemArchitectureGate();
checkAdoptionReadiness();
checkMachineReadableSpec();
checkComponentContracts();
checkPatternContracts();
checkTaxonomyBoundaries();
checkComponentBehaviorContracts();
checkComponentModules();
checkPackageApiBoundary();
checkPackageCssNamespace();
checkPackageCssContracts();
checkControlFrameCssContract();
checkTokenCssValueContract();
checkPlatformAdapters();
checkDensityContracts();
checkMotionContracts();
checkPriorityComponentMotionRoles();
checkBreakpointContracts();
checkStateContracts({ scope: "package" });
checkReactPrimaryContract();
checkReactContractTriangle();
checkReactCopyContract();
checkAntiDuplicationGovernance();
checkAccessibilityContracts({ scope: "package" });
checkManualAccessibility();
checkCoreCheckpointReports();

finishAudit();
