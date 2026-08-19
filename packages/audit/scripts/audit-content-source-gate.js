#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const {
  checkDocsContentOwnership,
  checkFoundationCopyOwnership,
  checkHomeContentOwnership,
  checkPrimitiveCopyOwnership,
  checkReferenceCopyOwnership,
} = require("./audit-content-ownership.js");
const { finishAudit } = require("./audit-result.js");

spawnSync("node", ["packages/audit/scripts/report-flowdocs-content-source-of-truth.js"], { stdio: "inherit" });

checkHomeContentOwnership();
checkFoundationCopyOwnership();
checkPrimitiveCopyOwnership();
checkReferenceCopyOwnership();
checkDocsContentOwnership();

finishAudit();
