#!/usr/bin/env node

const { spawnSync } = require("node:child_process");

const commands = [
  ["node", "packages/audit/scripts/report-flowdocs-runtime-inventory.js"],
  ["node", "packages/audit/scripts/report-flowdocs-content-source-of-truth.js"],
  ["node", "packages/audit/scripts/report-flowdocs-shell-decision.js"],
  ["node", "packages/audit/scripts/report-flowdocs-demo-boundary.js"],
  ["node", "packages/audit/scripts/report-flowdocs-template-boundary.js"],
  ["node", "packages/audit/scripts/report-flowdocs-safe-cleanup-plan.js"],
  ["node", "packages/audit/scripts/report-flowdocs-legacy-slot-quarantine.js"],
  ["node", "packages/audit/scripts/report-flowdocs-consumer-contract.js"],
  ["node", "packages/audit/scripts/report-flowdocs-trustworthy-checkpoint.js"],
];

let failed = false;
for (const command of commands) {
  const result = spawnSync(command[0], command.slice(1), { stdio: "inherit" });
  if (result.status !== 0) failed = true;
}

if (failed) process.exitCode = 1;
