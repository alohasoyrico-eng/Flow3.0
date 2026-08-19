#!/usr/bin/env node

const { spawnSync } = require("node:child_process");

const commands = [
  ["node", "packages/audit/scripts/report-system-gate-boundary-classification.js"],
  ["node", "packages/audit/scripts/report-flowdocs-stale-audit-classification.js"],
  ["node", "packages/audit/scripts/report-flowdocs-safe-cleanup-plan.js"],
  ["node", "packages/audit/scripts/report-flowdocs-trustworthy-checkpoint.js"],
];

let failed = false;
for (const command of commands) {
  const result = spawnSync(command[0], command.slice(1), { stdio: "inherit" });
  if (result.status !== 0) failed = true;
}

if (failed) process.exitCode = 1;
