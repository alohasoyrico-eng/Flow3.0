#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createRequire } = require("module");

const root = process.cwd();
const packageName = "@alohasoyrico-eng/flow";
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-react-export-parity.json");
const markdownOutput = path.join(outputDir, "system-react-export-parity.md");
const checkMode = process.argv.includes("--check");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(absolute);
    return [absolute];
  });
}

function normalizeTarget(target) {
  return target.replace(/^\.\//, "");
}

function normalizeExportTargets(value) {
  const targets = [];
  function visit(entry) {
    if (!entry) return;
    if (typeof entry === "string") {
      targets.push(entry);
      return;
    }
    if (Array.isArray(entry)) {
      entry.forEach(visit);
      return;
    }
    if (typeof entry === "object") {
      Object.values(entry).forEach(visit);
    }
  }
  visit(value);
  return [...new Set(targets)];
}

function exportSpecifier(exportKey) {
  if (exportKey === ".") return packageName;
  return `${packageName}/${exportKey.replace(/^\.\//, "")}`;
}

function wildcardRows(exportKey, target) {
  const targetParts = target.split("*");
  const keyParts = exportKey.split("*");
  if (targetParts.length !== 2 || keyParts.length !== 2) return [];
  const targetPrefix = normalizeTarget(targetParts[0]);
  const targetSuffix = targetParts[1];
  const keyPrefix = keyParts[0].replace(/^\.\//, "");
  const keySuffix = keyParts[1];
  const directory = targetPrefix.endsWith(path.sep) || targetPrefix.endsWith("/")
    ? path.join(root, targetPrefix)
    : path.dirname(path.join(root, targetPrefix));
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((file) => file.endsWith(targetSuffix))
    .map((file) => {
      const wildcardValue = file.slice(0, file.length - targetSuffix.length);
      return {
        exportKey,
        specifier: `${packageName}/${keyPrefix}${wildcardValue}${keySuffix}`,
        target: `${targetPrefix}${wildcardValue}${targetSuffix}`,
      };
    });
}

function buildReport() {
  const packageJson = readJson(path.join(root, "package.json"));
  const requireFromRoot = createRequire(path.join(root, "package.json"));
  const packageRoot = fs.realpathSync(root);
  const entries = Object.entries(packageJson.exports ?? {});
  const directEntries = entries.filter(([, value]) => !normalizeExportTargets(value).some((target) => target.includes("*")));
  const wildcardEntries = entries.filter(([, value]) => normalizeExportTargets(value).some((target) => target.includes("*")));
  const directTargets = directEntries.flatMap(([exportKey, value]) => normalizeExportTargets(value).map((target) => ({ exportKey, target })));
  const missingDirectTargets = directTargets.filter(({ target }) => !fs.existsSync(path.join(root, normalizeTarget(target))));
  const targetOutsidePackage = directTargets.filter(({ target }) => {
    const absolute = path.resolve(root, normalizeTarget(target));
    return !absolute.startsWith(packageRoot);
  });
  const reactExportsWithoutTypesOrDefault = directEntries
    .filter(([exportKey]) => exportKey === "./react" || exportKey.startsWith("./react/"))
    .filter(([, value]) => typeof value !== "object" || !value.types || !value.default)
    .map(([exportKey]) => exportKey);
  const missingObjectTypes = directEntries
    .filter(([, value]) => value && typeof value === "object" && value.types)
    .filter(([, value]) => !fs.existsSync(path.join(root, normalizeTarget(value.types))))
    .map(([exportKey, value]) => ({ exportKey, target: value.types }));
  const missingObjectDefault = directEntries
    .filter(([, value]) => value && typeof value === "object" && value.default)
    .filter(([, value]) => !fs.existsSync(path.join(root, normalizeTarget(value.default))))
    .map(([exportKey, value]) => ({ exportKey, target: value.default }));
  const resolvedDirectExports = [];
  const unresolvedDirectExports = [];
  for (const [exportKey] of directEntries) {
    const specifier = exportSpecifier(exportKey);
    try {
      const resolved = requireFromRoot.resolve(specifier);
      if (!fs.realpathSync(resolved).startsWith(packageRoot)) {
        unresolvedDirectExports.push({ exportKey, specifier, error: "resolved outside package root" });
      } else {
        resolvedDirectExports.push({ exportKey, specifier, resolved: path.relative(root, resolved) });
      }
    } catch (error) {
      unresolvedDirectExports.push({ exportKey, specifier, error: error.message });
    }
  }
  const wildcardResolvedTargets = wildcardEntries.flatMap(([exportKey, value]) => {
    return normalizeExportTargets(value).flatMap((target) => wildcardRows(exportKey, target));
  });
  const unresolvedWildcardExports = [];
  for (const row of wildcardResolvedTargets) {
    try {
      const resolved = requireFromRoot.resolve(row.specifier);
      if (!fs.realpathSync(resolved).startsWith(packageRoot)) {
        unresolvedWildcardExports.push({ ...row, error: "resolved outside package root" });
      }
    } catch (error) {
      unresolvedWildcardExports.push({ ...row, error: error.message });
    }
  }
  const exportedRuntimeTargets = new Set(
    entries
      .flatMap(([, value]) => normalizeExportTargets(value))
      .filter((target) => target.endsWith(".js"))
      .map(normalizeTarget)
  );
  const reactDistRuntimeFiles = listFiles(path.join(root, "packages/react/dist"))
    .filter((file) => file.endsWith(".js"))
    .map((file) => path.relative(root, file))
    .sort();
  const allowedInternalReactDistRuntimeFiles = reactDistRuntimeFiles.filter((file) => file.includes("/internal/"));
  const orphanReactDistRuntimeFiles = reactDistRuntimeFiles
    .filter((file) => !exportedRuntimeTargets.has(file))
    .filter((file) => !allowedInternalReactDistRuntimeFiles.includes(file));
  const exportParityDebt = [
    ...missingDirectTargets,
    ...targetOutsidePackage,
    ...reactExportsWithoutTypesOrDefault,
    ...missingObjectTypes,
    ...missingObjectDefault,
    ...unresolvedDirectExports,
    ...unresolvedWildcardExports,
    ...orphanReactDistRuntimeFiles,
  ].length;
  return {
    schemaVersion: "flow-system-react-export-parity@1",
    generatedAt: "2026-08-14",
    status: exportParityDebt ? "fail" : "pass",
    inventory: {
      exportEntries: entries.length,
      directExportEntries: directEntries.length,
      wildcardExportEntries: wildcardEntries.length,
      reactExportEntries: directEntries.filter(([exportKey]) => exportKey === "./react" || exportKey.startsWith("./react/")).length,
      directTargets: directTargets.length,
      wildcardResolvedTargets: wildcardResolvedTargets.length,
      resolvedDirectExports: resolvedDirectExports.length,
      missingDirectTargets: missingDirectTargets.length,
      targetOutsidePackage: targetOutsidePackage.length,
      reactExportsWithoutTypesOrDefault: reactExportsWithoutTypesOrDefault.length,
      missingObjectTypes: missingObjectTypes.length,
      missingObjectDefault: missingObjectDefault.length,
      unresolvedDirectExports: unresolvedDirectExports.length,
      unresolvedWildcardExports: unresolvedWildcardExports.length,
      reactDistRuntimeFiles: reactDistRuntimeFiles.length,
      exportedReactDistRuntimeFiles: reactDistRuntimeFiles.filter((file) => exportedRuntimeTargets.has(file)).length,
      allowedInternalReactDistRuntimeFiles: allowedInternalReactDistRuntimeFiles.length,
      orphanReactDistRuntimeFiles: orphanReactDistRuntimeFiles.length,
      exportParityDebt,
    },
    issues: {
      missingDirectTargets,
      targetOutsidePackage,
      reactExportsWithoutTypesOrDefault,
      missingObjectTypes,
      missingObjectDefault,
      unresolvedDirectExports,
      unresolvedWildcardExports,
      orphanReactDistRuntimeFiles,
    },
    policy: {
      reactExports: "Every ./react subpath must publish both types and default runtime targets.",
      directTargets: "Every direct package export target must exist inside the package root.",
      wildcardTargets: "Every spec wildcard artifact must resolve through the package exports map.",
      reactDistRuntime: "Every public React dist runtime file must be reachable through exports; internal runtime files may remain private.",
    },
  };
}

function renderMarkdown(report) {
  const issueRows = Object.entries(report.issues)
    .filter(([, rows]) => rows.length)
    .map(([key, rows]) => `- ${key}: ${rows.length}`)
    .join("\n");
  return [
    "# System React export parity",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Export entries: ${report.inventory.exportEntries}`,
    `- Direct export entries: ${report.inventory.directExportEntries}`,
    `- Wildcard export entries: ${report.inventory.wildcardExportEntries}`,
    `- React export entries: ${report.inventory.reactExportEntries}`,
    `- Direct targets: ${report.inventory.directTargets}`,
    `- Wildcard resolved targets: ${report.inventory.wildcardResolvedTargets}`,
    `- Resolved direct exports: ${report.inventory.resolvedDirectExports}`,
    `- React dist runtime files: ${report.inventory.reactDistRuntimeFiles}`,
    `- Exported React dist runtime files: ${report.inventory.exportedReactDistRuntimeFiles}`,
    `- Allowed internal React dist runtime files: ${report.inventory.allowedInternalReactDistRuntimeFiles}`,
    `- Orphan public React dist runtime files: ${report.inventory.orphanReactDistRuntimeFiles}`,
    `- Export parity debt: ${report.inventory.exportParityDebt}`,
    "",
    "## Issues",
    "",
    issueRows || "- None",
    "",
    "## Policy",
    "",
    `- React exports: ${report.policy.reactExports}`,
    `- Direct targets: ${report.policy.directTargets}`,
    `- Wildcard targets: ${report.policy.wildcardTargets}`,
    `- React dist runtime: ${report.policy.reactDistRuntime}`,
    "",
  ].join("\n");
}

function main() {
  const report = buildReport();
  if (checkMode) {
    if (!fs.existsSync(jsonOutput)) {
      console.error("React export parity report is missing. Run: node packages/audit/scripts/report-system-react-export-parity.js");
      process.exit(1);
    }
    const existing = fs.readFileSync(jsonOutput, "utf8");
    const expected = `${JSON.stringify(report, null, 2)}\n`;
    if (existing !== expected) {
      console.error("React export parity report is stale. Run: node packages/audit/scripts/report-system-react-export-parity.js");
      process.exit(1);
    }
    if (report.inventory.exportParityDebt) {
      console.error(`React export parity debt detected: ${report.inventory.exportParityDebt}`);
      process.exit(1);
    }
    console.log(JSON.stringify({
      status: report.status,
      exportParityDebt: report.inventory.exportParityDebt,
      reactExportEntries: report.inventory.reactExportEntries,
      wildcardResolvedTargets: report.inventory.wildcardResolvedTargets,
    }, null, 2));
    return;
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    exportParityDebt: report.inventory.exportParityDebt,
    reactExportEntries: report.inventory.reactExportEntries,
    wildcardResolvedTargets: report.inventory.wildcardResolvedTargets,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));
  if (report.inventory.exportParityDebt) process.exit(1);
}

main();
