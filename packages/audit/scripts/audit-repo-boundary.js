const { fs, path, root, read, readJson, add } = require("./audit-context.js");

const packageJsonFile = path.join(root, "package.json");
const systemAuditFile = path.join(root, "packages/audit/scripts/audit-system-scope.js");
const docsAuditFile = path.join(root, "packages/audit/scripts/audit-docs.js");
const integrationAuditFile = path.join(root, "packages/audit/scripts/audit-integration.js");
const repoSplitPlanFile = path.join(root, "docs/repo-split-plan.md");
const boundaryAuditFile = path.join(root, "packages/content/content/repo-boundary-audit.md");
const systemSplitManifestFile = path.join(root, "docs/repo-split/system.package.json");
const docsSplitManifestFile = path.join(root, "docs/repo-split/docs.package.json");
const systemFilesManifestFile = path.join(root, "docs/repo-split/system.files.json");
const docsFilesManifestFile = path.join(root, "docs/repo-split/docs.files.json");
const docsAuditFilesManifestFile = path.join(root, "docs/repo-split/docs.audit-files.json");
const extractionMatrixFile = path.join(root, "docs/repo-split/extraction-matrix.md");
const integrationChecksManifestFile = path.join(root, "docs/repo-split/integration-checks.json");
const systemSplitAuditFile = path.join(root, "scripts/audit-system-split.mjs");
const docsSplitAuditFile = path.join(root, "scripts/audit-docs-split.mjs");
const extractReposFile = path.join(root, "scripts/extract-repos.mjs");
const hasDocsApp = fs.existsSync(path.join(root, "apps/docs"));
const hasExtractionManifests = fs.existsSync(path.join(root, "docs/repo-split"));
const isExtractedSystemRepo = !hasDocsApp && !hasExtractionManifests;

const systemOnlyForbidden = [
  "audit-docs",
  "audit-integration",
  "audit-docs-runtime",
  "audit-component-demo-registry",
  "audit-component-demo-interactions",
  "apps/docs",
  "build:docs",
];

const systemAuditForbidden = [
  "audit-docs.js",
  "audit-integration.js",
  "audit-docs-runtime.mjs",
  "apps/docs",
  "build:docs",
];

const docsOnlyForbidden = [
  "audit-system-split",
  "audit:system",
  "npm test",
];

const boundaryImports = [
  "#design-system/components",
  "#design-system/react",
  "#design-system/components-css",
  "#design-system/content/catalog",
  "#design-system/content/component-docs",
  "#design-system/content/component-copy",
  "#design-system/content/pattern-copy",
  "#design-system/content/component-implementation-status",
  "#design-system/content/foundation-copy",
  "#design-system/content/primitive-copy",
  "#design-system/content/reference-copy",
  "#design-system/content/template-blueprints",
  "#design-system/content/home",
  "#design-system/content/i18n-ui",
  "#design-system/specs/system",
  "#design-system/tokens-css",
];

const installExports = [
  "./tokens",
  "./tokens/styles.css",
  "./components",
  "./components/contracts",
  "./components/platforms",
  "./components/styles.css",
  "./react",
  "./react/button",
  "./react/icon-button",
  "./react/input",
  "./react/select",
  "./content/catalog",
  "./content/component-docs",
  "./content/component-copy",
  "./content/pattern-copy",
  "./content/component-implementation-status",
  "./content/foundation-copy",
  "./content/primitive-copy",
  "./content/reference-copy",
  "./content/template-blueprints",
  "./content/home",
  "./content/i18n-ui",
  "./specs/system",
];

function checkCommandScope(scriptName, command, forbiddenTerms, expectedOwner) {
  for (const term of forbiddenTerms) {
    if (command?.includes(term)) {
      add("errors", packageJsonFile, 1, `${scriptName} must stay ${expectedOwner}; it cannot call ${term}.`);
    }
  }
}

function requireSnippet(file, snippet, message) {
  if (!fs.existsSync(file)) {
    add("errors", file, 1, message);
    return;
  }
  if (!read(file).includes(snippet)) add("errors", file, 1, message);
}

function checkSplitManifest(file, owner, requiredScripts, forbiddenImportPrefix) {
  const manifest = readJson(file);
  if (!manifest) {
    add("errors", file, 1, `${owner} split manifest is required and must be valid JSON.`);
    return;
  }
  for (const importName of boundaryImports) {
    if (!manifest.imports?.[importName]) add("errors", file, 1, `${owner} split manifest missing import alias: ${importName}.`);
    if (forbiddenImportPrefix && manifest.imports?.[importName]?.includes(forbiddenImportPrefix)) {
      add("errors", file, 1, `${owner} split manifest must not import from ${forbiddenImportPrefix}.`);
    }
  }
  for (const [script, command] of Object.entries(requiredScripts)) {
    if (manifest.scripts?.[script] !== command) add("errors", file, 1, `${owner} split manifest must expose ${script}.`);
  }
  if (owner === "Design System") {
    for (const requiredExport of installExports) {
      if (!manifest.exports?.[requiredExport]) add("errors", file, 1, `${owner} split manifest missing public export: ${requiredExport}.`);
    }
    if (manifest.repository?.url !== "https://github.com/alohasoyrico-eng/Flow3.0.git") {
      add("errors", file, 1, "Design System split manifest must point to the Flow3.0 repository.");
    }
  }
  if (owner === "Docs") {
    if (manifest.repository?.url !== "https://github.com/alohasoyrico-eng/FlowDocs.git") {
      add("errors", file, 1, "Docs split manifest must point to the FlowDocs repository.");
    }
    if (manifest.dependencies?.flow !== "file:../Flow3.0") {
      add("errors", file, 1, "Docs split manifest must consume the adjacent Flow3.0 package.");
    }
    for (const value of Object.values(manifest.imports ?? {})) {
      if (String(value).startsWith("flow/packages/")) add("errors", file, 1, "Docs split manifest must use public flow exports instead of flow/packages internals.");
    }
  }
}

function checkSplitAuditUsesManifest(file, manifestPath, owner) {
  const source = fs.existsSync(file) ? read(file) : "";
  if (!source.includes(manifestPath)) add("errors", file, 1, `${owner} split audit must use ${manifestPath}.`);
  if (/writeJson\s*\(\s*path\.join\(splitRoot,\s*"package\.json"/.test(source)) {
    add("errors", file, 1, `${owner} split audit must not synthesize package.json by hand; use the extraction manifest.`);
  }
}

function checkSplitAuditUsesFileManifest(file, manifestPath, owner) {
  const source = fs.existsSync(file) ? read(file) : "";
  if (!source.includes(manifestPath)) add("errors", file, 1, `${owner} split audit must use ${manifestPath}.`);
}

function checkDocsSplitRunsFullValidation() {
  const source = fs.existsSync(docsSplitAuditFile) ? read(docsSplitAuditFile) : "";
  if (!source.includes('run("npm", ["run", "validate:docs"])')) {
    add("errors", docsSplitAuditFile, 1, "Docs split audit must run validate:docs, not only build:docs.");
  }
  if (!source.includes("docs/repo-split/docs.audit-files.json")) {
    add("errors", docsSplitAuditFile, 1, "Docs split audit must read its audit file list from docs/repo-split/docs.audit-files.json.");
  }
}

function checkExtractReposScript(scripts) {
  if (scripts["extract:repos"] !== "node scripts/extract-repos.mjs") {
    add("errors", packageJsonFile, 1, "Root package must expose extract:repos for physical local repo extraction.");
  }
  const source = fs.existsSync(extractReposFile) ? read(extractReposFile) : "";
  for (const required of [
    "docs/repo-split/system.files.json",
    "docs/repo-split/docs.files.json",
    "docs/repo-split/docs.audit-files.json",
    "validate:system",
    "validate:docs",
  ]) {
    if (!source.includes(required)) add("errors", extractReposFile, 1, `extract:repos must use ${required}.`);
  }
}

function checkDocsAuditFilesManifest() {
  const manifest = readJson(docsAuditFilesManifestFile);
  if (!manifest) {
    add("errors", docsAuditFilesManifestFile, 1, "Docs audit files manifest is required and must be valid JSON.");
    return;
  }
  const requiredAuditFiles = ["audit-docs.js", "audit-docs-runtime.mjs", "audit-context.js", "audit-result.js"];
  for (const file of requiredAuditFiles) {
    if (!manifest.auditFiles?.includes(file)) add("errors", docsAuditFilesManifestFile, 1, `Docs audit files manifest missing ${file}.`);
  }
  if (manifest.packageBoundary?.path !== "audit/package.json" || manifest.packageBoundary?.type !== "commonjs") {
    add("errors", docsAuditFilesManifestFile, 1, "Docs audit files manifest must declare audit/package.json as commonjs.");
  }
}

function checkFileManifest(file, owner, requiredSources, options = {}) {
  const manifest = readJson(file);
  if (!manifest) {
    add("errors", file, 1, `${owner} file manifest is required and must be valid JSON.`);
    return;
  }
  for (const source of requiredSources) {
    if (!manifest.copy?.some((entry) => entry.source === source)) add("errors", file, 1, `${owner} file manifest missing source: ${source}.`);
  }
  for (const entry of manifest.copy ?? []) {
    const target = entry.target ?? entry.source;
    for (const forbiddenTarget of options.forbiddenTargets ?? []) {
      if (target === forbiddenTarget || target.startsWith(`${forbiddenTarget}/`)) {
        add("errors", file, 1, `${owner} file manifest must not copy into ${forbiddenTarget}: ${target}.`);
      }
    }
    for (const forbiddenSource of options.forbiddenSources ?? []) {
      if (entry.source === forbiddenSource || entry.source.startsWith(`${forbiddenSource}/`)) {
        add("errors", file, 1, `${owner} file manifest must not copy from ${forbiddenSource}: ${entry.source}.`);
      }
    }
  }
}

function checkIntegrationChecksManifest(scripts) {
  const manifest = readJson(integrationChecksManifestFile);
  if (!manifest) {
    add("errors", integrationChecksManifestFile, 1, "Integration checks manifest is required and must be valid JSON.");
    return;
  }
  for (const command of manifest.commands ?? []) {
    if (!scripts["validate:integration"]?.includes(command)) {
      add("errors", packageJsonFile, 1, `validate:integration must include ${command} from integration-checks.json.`);
    }
  }
  const integrationAudit = fs.existsSync(integrationAuditFile) ? read(integrationAuditFile) : "";
  for (const check of manifest.mixedCheckFunctions ?? []) {
    if (!integrationAudit.includes(check)) {
      add("errors", integrationAuditFile, 1, `${check} belongs in audit:integration while it compares package contracts with docs evidence.`);
    }
  }
  if (!String(manifest.rule ?? "").includes("Design System package truth") || !String(manifest.rule ?? "").includes("docs evidence")) {
    add("errors", integrationChecksManifestFile, 1, "Integration checks manifest must explain why these checks are integration-owned.");
  }
}

function checkRepoBoundary() {
  const packageJson = readJson(packageJsonFile);
  const scripts = packageJson?.scripts ?? {};

  checkCommandScope("validate:system", scripts["validate:system"], systemOnlyForbidden, "Design System-only");
  checkCommandScope("audit:system", scripts["audit:system"], systemOnlyForbidden, "Design System-only");
  checkCommandScope("validate:docs", scripts["validate:docs"], docsOnlyForbidden, "docs-only");
  checkCommandScope("audit:docs", scripts["audit:docs"], docsOnlyForbidden, "docs-only");

  const systemAudit = fs.existsSync(systemAuditFile) ? read(systemAuditFile) : "";
  for (const term of systemAuditForbidden) {
    if (systemAudit.includes(term)) add("errors", systemAuditFile, 1, `audit:system must not import or mention ${term}.`);
  }

  if (isExtractedSystemRepo) {
    if (scripts["audit:system"] !== "node packages/audit/scripts/audit-system-scope.js") {
      add("errors", packageJsonFile, 1, "Extracted system repo must expose audit:system through audit-system-scope.js.");
    }
    if (scripts["audit:consumer-install"] !== "node packages/audit/scripts/audit-consumer-install.mjs") {
      add("errors", packageJsonFile, 1, "Extracted system repo must expose audit:consumer-install.");
    }
    if (scripts["audit:complete"] !== "node packages/audit/scripts/audit-complete.mjs") {
      add("errors", packageJsonFile, 1, "Extracted system repo must expose audit:complete.");
    }
    if (scripts["build:tokens"] !== "node scripts/build-tokens.mjs") {
      add("errors", packageJsonFile, 1, "Extracted system repo must expose build:tokens.");
    }
    if (scripts["audit:ds-release-gate"] !== "node packages/audit/scripts/audit-ds-release-gate.js") {
      add("errors", packageJsonFile, 1, "Extracted system repo must expose audit:ds-release-gate.");
    }
    if (scripts["validate:flow-core"] !== "npm run build:tokens && npm run build:react && npm run typecheck && npm run test:react && npm run audit:ds-release-gate") {
      add("errors", packageJsonFile, 1, "Extracted system repo must run build:tokens, build:react, typecheck, test:react, and audit:ds-release-gate as the Flow core release gate.");
    }
    if (scripts["validate:system"] !== "npm run validate:flow-core") {
      add("errors", packageJsonFile, 1, "Extracted system repo must keep validate:system as a compatibility alias to validate:flow-core.");
    }
    return;
  }

  if (!scripts["audit:repo-boundary"]) {
    add("errors", packageJsonFile, 1, "Root package must expose audit:repo-boundary for split governance.");
  }
  if (!scripts["validate:integration"]?.includes("audit:repo-boundary")) {
    add("errors", packageJsonFile, 1, "validate:integration must run audit:repo-boundary before cross-repo checks.");
  }
  checkExtractReposScript(scripts);

  const docsAudit = fs.existsSync(docsAuditFile) ? read(docsAuditFile) : "";
  for (const term of docsOnlyForbidden) {
    if (docsAudit.includes(term)) add("errors", docsAuditFile, 1, `audit:docs must not import or mention ${term}.`);
  }

  requireSnippet(repoSplitPlanFile, "Design System remains the source of truth.", "Repo split plan must state that Design System remains the source of truth.");
  requireSnippet(repoSplitPlanFile, "Docs runtime must not reference `../../packages/`.", "Repo split plan must document the docs runtime boundary.");
  requireSnippet(repoSplitPlanFile, "docs/repo-split/system.package.json", "Repo split plan must reference the Design System extraction manifest.");
  requireSnippet(repoSplitPlanFile, "docs/repo-split/docs.package.json", "Repo split plan must reference the docs extraction manifest.");
  requireSnippet(repoSplitPlanFile, "docs/repo-split/system.files.json", "Repo split plan must reference the Design System file manifest.");
  requireSnippet(repoSplitPlanFile, "docs/repo-split/docs.files.json", "Repo split plan must reference the docs file manifest.");
  requireSnippet(repoSplitPlanFile, "docs/repo-split/docs.audit-files.json", "Repo split plan must reference the docs audit files manifest.");
  requireSnippet(repoSplitPlanFile, "docs/repo-split/integration-checks.json", "Repo split plan must reference the integration checks manifest.");
  requireSnippet(repoSplitPlanFile, "docs/repo-split/extraction-matrix.md", "Repo split plan must reference the extraction matrix.");
  requireSnippet(boundaryAuditFile, "runtime now reads only", "Repo boundary audit must document that docs content is runtime-generated.");
  requireSnippet(boundaryAuditFile, "docs/repo-split/extraction-matrix.md", "Repo boundary audit must reference the extraction matrix.");
  for (const snippet of [
    "## Design System Repo",
    "## Docs Repo",
    "## Integration Ownership",
    "## Reference Assets",
    "`packages/components/**`",
    "`apps/docs/**`",
    "`apps/docs/generated/components/**`",
    "Docs runtime must not reference `../../packages/` or `packages/system-*`.",
    "Public UI classes must not use `system-*`.",
  ]) {
    requireSnippet(extractionMatrixFile, snippet, `Extraction matrix must include ${snippet}.`);
  }

  checkSplitManifest(systemSplitManifestFile, "Design System", {
    "audit:system": "node packages/audit/scripts/audit-system-scope.js",
    "audit:consumer-install": "node packages/audit/scripts/audit-consumer-install.mjs",
    test: "node packages/components/test/smoke.test.mjs",
    "validate:system": "npm run audit:system && npm test && npm run build:react && npm run test:react && npm run audit:consumer-install",
  });
  checkSplitManifest(docsSplitManifestFile, "Docs", {
    "build:docs-content": "node scripts/build-docs-content.mjs",
    "build:docs-assets": "node scripts/build-docs-assets.mjs",
    "build:docs": "npm run build:docs-content && npm run build:docs-assets",
    "audit:docs": "node audit/audit-docs.js",
    "audit:docs-runtime": "node audit/audit-docs-runtime.mjs",
    "validate:docs": "npm run build:docs && npm run audit:docs && npm run audit:docs-runtime",
  }, "packages/system-");
  checkFileManifest(systemFilesManifestFile, "Design System", [
    "packages/components",
    "packages/tokens",
    "packages/content",
    "packages/specs",
    "packages/audit",
    "system.manifest.json",
    "scripts/generate-component-contracts.mjs",
    "scripts/generate-pattern-contracts.mjs",
    "README.md",
    "docs/architecture.md",
    "starter-kits",
    "prompts",
    "agents",
  ], { forbiddenSources: ["apps/docs"], forbiddenTargets: ["apps/docs"] });
  checkFileManifest(docsFilesManifestFile, "Docs", [
    "apps/docs",
    "scripts/build-docs-content.mjs",
    "scripts/build-docs-assets.mjs",
    "docs/repo-split/docs.package.json",
    "docs/repo-split/docs.gitignore",
  ], { forbiddenTargets: ["packages/components", "packages/content", "packages/specs", "packages/tokens", "packages/audit"] });
  checkSplitAuditUsesManifest(systemSplitAuditFile, "docs/repo-split/system.package.json", "Design System");
  checkSplitAuditUsesManifest(docsSplitAuditFile, "docs/repo-split/docs.package.json", "Docs");
  checkSplitAuditUsesFileManifest(systemSplitAuditFile, "docs/repo-split/system.files.json", "Design System");
  checkSplitAuditUsesFileManifest(docsSplitAuditFile, "docs/repo-split/docs.files.json", "Docs");
  checkDocsAuditFilesManifest();
  checkIntegrationChecksManifest(scripts);
  checkDocsSplitRunsFullValidation();
}

module.exports = { checkRepoBoundary };
