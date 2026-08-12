const {
  fs,
  path,
  primitiveArtifacts,
  root,
  requiredPatternContracts,
  add,
  read,
  readJson,
} = require("./audit-context.js");
const { readPatternContractGovernance } = require("./pattern-contract-governance.js");

const contractsDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const sourceDir = path.join(root, "packages/content/content/pattern-copy/patterns");
const patternArtifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const catalogDir = path.join(root, "packages/content/content/catalog");
const docsDirs = [
  path.join(root, "apps/docs"),
  path.join(root, "../FlowDocs/apps/docs"),
];
const docsFile = (fileName) => docsDirs.map((dir) => path.join(dir, fileName)).find((file) => fs.existsSync(file)) ?? path.join(docsDirs[0], fileName);
const patternTabsFile = docsFile("pattern-contract-tabs.js");
const candidatePatternDemosFile = docsFile("pattern-candidate-demos.js");
const patternSearchSlotFile = docsFile("search-slot.js");
const notificationPanelSlotFile = docsFile("notification-panel-slot.js");
const docsIndexFile = docsFile("index.html");
const docsChromeFile = docsFile("docs-chrome.js");
const patternFocusedDesignFile = docsFile("pattern-focused-design.js");
const patternShellRenderersFile = docsFile("pattern-shell-renderers.js");
const avatarMenuSlotFile = docsFile("avatar-menu-slot.js");
const mobilePatternDemosFile = docsFile("pattern-mobile-demos.js");
const desktopPatternDemosFile = docsFile("pattern-desktop-demos.js");
const utilityPatternDemosFile = docsFile("pattern-utility-demos.js");
const journeyPatternDemosFile = docsFile("pattern-journey-demos.js");
const operationalPatternDemosFile = docsFile("pattern-operational-demos.js");
const reactPatternDir = docsFile("generated/react/patterns");
const patternContractGovernance = readPatternContractGovernance();
const demoPolicyFiles = {
  candidate: candidatePatternDemosFile,
  mobile: mobilePatternDemosFile,
};

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function primitiveIds() {
  return new Set(primitiveArtifacts);
}

function primitiveSlotNamesFromCopy(copy, primitives) {
  return [...new Set((copy.slots ?? []).flatMap((row) => String(row[1])
    .split(/\s*\|\s*/)
    .map((part) => part.replace(/\[\]$/, "").trim())
    .filter((part) => primitives.has(slug(part)))))];
}

function pascalCase(value) {
  return String(value)
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function reactPatternSource(patternId) {
  const file = path.join(reactPatternDir, `${pascalCase(patternId)}.js`);
  return fs.existsSync(file) ? read(file) : "";
}

function reactPatternComposesComponent(patternId, component) {
  const source = reactPatternSource(patternId);
  if (!source) return false;
  const componentName = pascalCase(component);
  return source.includes(`import { ${componentName} } from "../${componentName}.js"`);
}

function generatedPatternContractIds() {
  if (!fs.existsSync(sourceDir)) return [...requiredPatternContracts].sort();
  const sourceIds = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(sourceDir, id, "all.json")));
  return [...new Set([...requiredPatternContracts, ...sourceIds])].sort();
}

function checkPatternCatalogIds() {
  const ids = new Map();
  for (const catalogFile of fs.readdirSync(catalogDir).filter((file) => /^patterns-.*\.json$/.test(file)).sort()) {
    const file = path.join(catalogDir, catalogFile);
    const patterns = readJson(file).patterns ?? [];
    for (const pattern of patterns) {
      const seen = ids.get(pattern.id) ?? [];
      seen.push(file);
      ids.set(pattern.id, seen);
    }
  }
  for (const [id, files] of ids.entries()) {
    if (files.length > 1) {
      add("errors", files[1], 1, `Duplicate pattern id in catalog: ${id}.`);
    }
  }
}

function checkPatternContracts() {
  checkPatternCatalogIds();
  checkPatternDemoComposition();
  for (const issue of patternContractGovernance.issues) {
    add("errors", patternContractGovernance.file, 1, `Pattern contract governance issue: ${issue}`);
  }
  const primitives = primitiveIds();
  for (const id of generatedPatternContractIds()) {
    const file = path.join(contractsDir, `${id}.md`);
    const sourceFile = path.join(sourceDir, id, "all.json");
    if (!fs.existsSync(file)) {
      add("errors", file, 1, `Missing portable Markdown contract for pattern: ${id}.`);
      continue;
    }

    const markdown = read(file);
    for (const required of patternContractGovernance.requiredMarkdownSections) {
      if (!markdown.includes(required)) {
        add("errors", file, 1, `Pattern contract ${id} missing required section: ${required}.`);
      }
    }

    if (!markdown.includes("Generated portable agent contract for Design System.")) {
      add("errors", file, 1, `Pattern contract ${id} must be generated by npm run build:pattern-contracts.`);
    }
    const artifactFile = path.join(patternArtifactDir, `${id}.json`);
    if (!markdown.includes(`packages/specs/specs/unison-system/artifacts/patterns/${id}.json`) || !fs.existsSync(artifactFile)) {
      add("errors", file, 1, `Pattern contract ${id} points to missing formal pattern artifact.`);
    }
    const copy = fs.existsSync(sourceFile) ? readJson(sourceFile).patterns?.[id] ?? {} : {};
    const primitiveSlots = primitiveSlotNamesFromCopy(copy, primitives);
    const declaresPrimitiveSlots = primitiveSlots.length > 0;
    if (declaresPrimitiveSlots && !markdown.includes("## Primitive Slot Ownership")) {
      add("errors", file, 1, `Pattern contract ${id} must separate primitive slot ownership from component usage.`);
    }
    if (!declaresPrimitiveSlots && markdown.includes("## Primitive Slot Ownership")) {
      add("errors", file, 1, `Pattern contract ${id} must not include empty primitive slot ownership.`);
    }
    const artifact = fs.existsSync(artifactFile) ? readJson(artifactFile).artifacts?.patterns?.[id] ?? {} : {};
    const artifactPrimitiveDependencies = new Set((artifact.primitiveDependencies ?? []).map(slug));
    const artifactPrimitiveSlots = new Set((artifact.slots ?? []).flatMap((slot) => slot.uses ?? []).map(slug));
    for (const primitive of primitiveSlots) {
      if (!artifactPrimitiveDependencies.has(slug(primitive))) {
        add("errors", sourceFile, 1, `Pattern copy ${id} mentions primitive slot ${primitive} but formal artifact does not declare it in primitiveDependencies.`);
      }
      if (!artifactPrimitiveSlots.has(slug(primitive))) {
        add("errors", sourceFile, 1, `Pattern copy ${id} mentions primitive slot ${primitive} but formal artifact does not declare a matching primitive slot.`);
      }
    }
    if (!markdown.includes(`packages/content/content/pattern-copy/patterns/${id}/all.json`) || !fs.existsSync(sourceFile)) {
      add("errors", file, 1, `Pattern contract ${id} points to missing pattern-copy source.`);
    }
    if (id === "sidebar" && /Collapsed rail.+\|\s*(Current|Candidate|Supported)/i.test(markdown)) {
      add("errors", file, 1, "Sidebar contract must not document collapsed rail as a supported variant.");
    }
    if (id === "sidebar" && !markdown.includes("drawer")) {
      add("errors", file, 1, "Sidebar contract must include drawer behavior.");
    }
    if (id === "topbar" && (!markdown.includes("notifications") || !markdown.includes("account"))) {
      add("errors", file, 1, "Topbar contract must include notifications and account slot coverage.");
    }
  }
}

function checkPatternDemoComposition() {
  if (!fs.existsSync(patternTabsFile)) return;
  checkPatternDemoLocalControls();
  checkSearchSlotSingleSource();
  const source = [
    patternTabsFile,
    candidatePatternDemosFile,
    desktopPatternDemosFile,
    mobilePatternDemosFile,
    utilityPatternDemosFile,
    journeyPatternDemosFile,
    operationalPatternDemosFile,
  ]
    .filter((file) => fs.existsSync(file))
    .map((file) => read(file))
    .join("\n");
  const requiredDemos = patternContractGovernance.requiredDemos;
  for (const [id, contract] of Object.entries(requiredDemos)) {
    const start = source.indexOf(`function ${contract.fn}()`);
    if (start === -1) {
      add("errors", patternTabsFile, 1, `Pattern ${id} must expose a real overview demo.`);
      continue;
    }
    const nextFunction = source.indexOf("\nfunction ", start + 1);
    const block = source.slice(start, nextFunction === -1 ? source.length : nextFunction);
    for (const component of contract.components) {
      const mountsReactPattern = block.includes(`patternReactDemo("${id}"`) || block.includes(`patternReactDemo('${id}'`);
      const composed =
        block.includes(`packageDemo("${component}"`) ||
        (mountsReactPattern && reactPatternComposesComponent(id, component)) ||
        (component === "input" && block.includes("searchSlotMarkup(") && fs.existsSync(patternSearchSlotFile) && read(patternSearchSlotFile).includes(`patternPackageDemo("input"`)) ||
        (id === "notification-panel" && block.includes("notificationPanelMarkup(") && fs.existsSync(notificationPanelSlotFile) && read(notificationPanelSlotFile).includes(`patternPackageDemo("${component}"`)) ||
        (id === "avatar-menu" && block.includes("avatarMenuMarkup(") && fs.existsSync(avatarMenuSlotFile) && (
          (component === "menu" && read(avatarMenuSlotFile).includes(`patternPackageDemo("menu"`)) ||
          (component === "avatar" && read(avatarMenuSlotFile).includes(`variant: "avatar-trigger"`))
        ));
      if (!composed) {
        add("errors", patternTabsFile, 1, `Pattern ${id} demo must compose Design System ${component} through packageDemo, not local markup.`);
      }
    }
    for (const rule of patternContractGovernance.demoCompositionPolicy.specificRules.filter((item) => item.id === id)) {
      if (new RegExp(rule.pattern).test(block)) {
        add("errors", demoPolicyFiles[rule.file] ?? patternTabsFile, 1, rule.message);
      }
    }
    for (const rule of patternContractGovernance.demoCompositionPolicy.localControlRules.filter((item) => item.ids.includes(id))) {
      const tagPattern = rule.tags.join("|");
      if (new RegExp(`<(${tagPattern})\\b(?![^>]*data-pattern-component)`).test(block)) {
        add("errors", demoPolicyFiles[rule.file] ?? patternTabsFile, 1, `Pattern ${id} ${rule.message.charAt(0).toLowerCase()}${rule.message.slice(1)}`);
      }
    }
  }
}

function checkSearchSlotSingleSource() {
  for (const file of [docsIndexFile, docsChromeFile, patternFocusedDesignFile, candidatePatternDemosFile, patternShellRenderersFile].filter((item) => fs.existsSync(item))) {
    const source = read(file);
    if (/<div[^>]+class="[^"]*\b(top-search|search-slot)\b[^"]*"[\s\S]*?<input\b/i.test(source)) {
      add("errors", file, 1, "Search must use shared searchSlotMarkup; do not create local search-slot input markup.");
    }
  }
  if (fs.existsSync(docsChromeFile) && !read(docsChromeFile).includes("searchSlotMarkup")) {
    add("errors", docsChromeFile, 1, "Docs topbar search must be mounted from shared searchSlotMarkup.");
  }
  if (fs.existsSync(patternFocusedDesignFile)) {
    const focusedSource = read(patternFocusedDesignFile);
    for (const helper of patternContractGovernance.demoCompositionPolicy.sharedHelperNames) {
      if (!focusedSource.includes(helper)) add("errors", patternFocusedDesignFile, 1, `Topbar focused demos must consume shared ${helper}.`);
    }
    if (!focusedSource.includes('actionVariant: "account"') || !focusedSource.includes('navVariant: "sections"')) {
      add("errors", patternFocusedDesignFile, 1, "Topbar focused demos must cover sections plus account/notification slots.");
    }
  }
}

function checkPatternDemoLocalControls() {
  for (const file of [
    patternTabsFile,
    candidatePatternDemosFile,
    desktopPatternDemosFile,
    mobilePatternDemosFile,
    utilityPatternDemosFile,
    journeyPatternDemosFile,
  ].filter((item) => fs.existsSync(item))) {
    const source = read(file);
    const rawControl = /<(button|input|select|textarea|progress)\b/i.exec(source);
    if (rawControl) {
      add("errors", file, 1, `Pattern demos must not create local <${rawControl[1].toLowerCase()}> controls; compose Package components through packageDemo or use a documented shell pattern exception.`);
    }
  }
  if (fs.existsSync(patternShellRenderersFile) && read(patternShellRenderersFile).includes("pattern-account-menu")) {
    add("errors", patternShellRenderersFile, 1, "Shell pattern renderers must not create a parallel account menu; use avatarMenuMarkup.");
  }
}

module.exports = { checkPatternContracts };
