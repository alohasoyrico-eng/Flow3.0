#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
  slug,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "zip-system-intake-audit.json");
const markdownOutput = path.join(outputDir, "zip-system-intake-audit.md");
const zipRoot = "/private/tmp/flow-zip-audit";
const zipFlowGapFile = path.join(outputDir, "zip-flow-gap-audit.json");
const zipTemplateParityFile = path.join(outputDir, "zip-template-parity-audit.json");
const artifactsDir = path.join(root, "packages/specs/specs/unison-system/artifacts");
const reactSrcDir = path.join(root, "packages/react/src");

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function walk(dir, predicate, rows = []) {
  if (!fs.existsSync(dir)) return rows;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, predicate, rows);
    else if (predicate(file)) rows.push(file);
  }
  return rows;
}

function artifactIds(kind) {
  const dir = path.join(artifactsDir, kind);
  if (!fs.existsSync(dir)) return new Set();
  return new Set(fs.readdirSync(dir).filter((file) => file.endsWith(".json")).map((file) => file.replace(/\.json$/, "")));
}

function pascalCase(value) {
  return slug(value).split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function inferTaxonomy(row) {
  if (row.flowLayer === "component") return "Component";
  if (row.flowLayer === "pattern") return "Pattern";
  if (row.flowLayer === "template") return "Template";
  if (row.flowLayer === "primitive") return "Primitive";
  if (row.flowLayer === "contract") return "Contract";
  if (row.flowLayer === "missing-pattern") return "Pattern";
  if (row.flowLayer === "missing-component") return "Component";
  return "Needs decision";
}

function literalValues(source) {
  const values = [];
  for (const match of source.matchAll(/"([^"]+)"|'([^']+)'/g)) {
    const value = match[1] ?? match[2];
    if (/^[a-z][a-z0-9-]{2,30}$/.test(value)) values.push(value);
  }
  return unique(values);
}

function typeSignal(source) {
  const props = unique([...source.matchAll(/\b([a-zA-Z][a-zA-Z0-9]+)\??:/g)].map((match) => match[1]));
  const callbackProps = props.filter((prop) => /^on[A-Z]/.test(prop));
  const unions = unique([...source.matchAll(/"([^"]+)"|'([^']+)'/g)].map((match) => match[1] ?? match[2]));
  return {
    props,
    callbackProps,
    unionValues: unions,
  };
}

function jsxSignal(source) {
  const dataAttrs = unique([...source.matchAll(/\bdata-([a-z0-9-]+)/g)].map((match) => `data-${match[1]}`));
  const ariaAttrs = unique([...source.matchAll(/\baria-([a-z0-9-]+)/g)].map((match) => `aria-${match[1]}`));
  const roles = unique([...source.matchAll(/\brole=["']([^"']+)["']/g)].map((match) => match[1]));
  const classRoots = unique([...source.matchAll(/className=\{?`?["']?([^"'`}]*)/g)]
    .flatMap((match) => String(match[1]).split(/\s+/))
    .filter((value) => value && !/[${}]/.test(value))
    .map((value) => value.replace(/^flow-/, "")));
  const literals = literalValues(source);
  const stateWords = literals.filter((value) => /^(default|active|open|closed|loading|success|warning|danger|error|disabled|selected|empty|offline|sending|handoff|dirty|readonly|compact|comfortable|spacious)$/.test(value));
  return {
    dataAttrs,
    ariaAttrs,
    roles,
    classRoots,
    stateWords,
    usesInlineStyle: /\bstyle=\{\{/.test(source),
    usesDangerousHtml: /dangerouslySetInnerHTML|innerHTML/.test(source),
  };
}

function sourceSignals(files) {
  const source = files.map((file) => read(path.join(zipRoot, file))).join("\n");
  return {
    hasForm: /<form\b/.test(source),
    hasNav: /<nav\b|<aside\b/.test(source),
    hasTable: /<table\b/.test(source),
    hasSvgOrCanvas: /<svg\b|<canvas\b/.test(source),
    hasInlineToken: /--[a-z0-9-]+:|#[0-9a-fA-F]{3,8}|data-theme=/.test(source),
    hasMailMarkup: /<table\b|mso-|<!--[if mso]/i.test(source),
    hasIosFrame: /iphone|ios|safe-area|status-bar/i.test(source),
  };
}

function componentRows(flowGap) {
  const rowsByName = new Map((flowGap.components ?? []).map((row) => [row.name, row]));
  return walk(path.join(zipRoot, "components"), (file) => file.endsWith(".jsx")).map((file) => {
    const name = path.basename(file, ".jsx");
    const dtsFile = file.replace(/\.jsx$/, ".d.ts");
    const promptFile = file.replace(/\.jsx$/, ".prompt.md");
    const resolution = rowsByName.get(name) ?? {
      name,
      zipPath: path.relative(zipRoot, file),
      flowLayer: "missing-component",
      flowOwner: "none",
      decision: "needs-decision",
      isGap: true,
    };
    const source = read(file);
    const types = read(dtsFile);
    return {
      name,
      zipPath: path.relative(zipRoot, file),
      category: path.relative(path.join(zipRoot, "components"), path.dirname(file)),
      taxonomyTarget: inferTaxonomy(resolution),
      flowLayer: resolution.flowLayer,
      flowOwner: resolution.flowOwner,
      decision: resolution.decision,
      exactOrAbsorbed: !resolution.isGap,
      hasTypes: fs.existsSync(dtsFile),
      hasPrompt: fs.existsSync(promptFile),
      typeSignal: typeSignal(types),
      jsxSignal: jsxSignal(source),
      promotionNeeded: resolution.isGap || resolution.decision === "absorbed-partial" || resolution.decision === "needs-react-export-review",
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

function kitRows(parity) {
  return (parity.kits ?? []).map((kit) => {
    const channels = [
      ...(kit.id === "mailings" ? ["email-html"] : []),
      ...(kit.id === "ios-frame" ? ["ios-preview"] : []),
      ...((kit.zipPaths ?? []).some((file) => file.endsWith(".jsx")) ? ["react-preview"] : []),
      ...((kit.zipPaths ?? []).some((file) => file.endsWith(".html")) ? ["web-html"] : []),
    ];
    const owners = kit.owners ?? {};
    const templates = (owners.templates ?? []).map((row) => row.name);
    const patterns = (owners.patterns ?? []).map((row) => row.name);
    const components = (owners.components ?? []).map((row) => row.name);
    const primitives = (owners.primitives ?? []).map((row) => row.name);
    const foundations = (owners.foundations ?? []).map((row) => row.name);
    const signals = sourceSignals(kit.zipPaths ?? []);
    const promotionTarget = kit.classification === "template-candidate"
      ? "Template"
      : kit.classification === "covered-by-template"
        ? "Template validation"
        : kit.classification === "covered-by-pattern"
          ? "Pattern validation"
          : kit.id === "mailings"
            ? "Email channel template"
            : kit.id === "ios-frame"
              ? "iOS preview adapter"
              : "Channel contract";
    return {
      id: kit.id,
      classification: kit.classification,
      status: kit.status,
      candidateName: kit.candidateName,
      zipPaths: kit.zipPaths,
      channels,
      promotionTarget,
      owners: { foundations, primitives, components, patterns, templates },
      sourceSignals: signals,
      cascadeRisks: kit.cascadeRisks ?? [],
      issues: kit.issues ?? [],
      promotionNeeded: kit.classification === "template-candidate" || kit.classification === "blocked-separate-channel" || kit.classification === "covered-separate-channel",
    };
  });
}

function fileCoverage(parity) {
  const zipFiles = walk(path.join(zipRoot, "ui_kits"), (file) => /\.(html|jsx|md)$/.test(file)).map((file) => path.relative(zipRoot, file)).sort();
  const declared = new Set((parity.kits ?? []).flatMap((kit) => kit.zipPaths ?? []));
  return {
    zipFiles,
    declaredFiles: zipFiles.filter((file) => declared.has(file)),
    undeclaredFiles: zipFiles.filter((file) => !declared.has(file)),
  };
}

function promotionPlan(components, kits) {
  const componentGaps = components.filter((row) => row.promotionNeeded);
  const channelKits = kits.filter((kit) => kit.channels.includes("email-html") || kit.channels.includes("ios-preview"));
  const templateValidationKits = kits.filter((kit) => ["covered-by-template", "covered-by-pattern"].includes(kit.classification));
  return [
    {
      wave: 1,
      name: "Intake lock",
      scope: "Freeze ZIP file coverage, taxonomy decisions, aliases, variants, states, and channel disposition.",
      items: components.length + kits.length,
      exitGates: ["no undeclared ZIP kit files", "every component has taxonomy target", "every kit has owners or channel contract"],
    },
    {
      wave: 2,
      name: "Foundation and primitive validation",
      scope: "Confirm ZIP guidelines, tokens, platforms, Surface, Field Action, Message, Charts, Maps, and Density coverage before UI promotion.",
      items: 15 + 7 + 6,
      exitGates: ["guidelines mapped to foundations", "token outputs mapped to export contract", "runtime primitive gaps explicit"],
    },
    {
      wave: 3,
      name: "Component and variant closure",
      scope: "Promote only true missing component contracts or variants; keep aliases and wrappers absorbed by existing Flow owners.",
      items: componentGaps.length,
      exitGates: ["React + types + ref", "CSS contract or governed primitive", "states and callbacks tested"],
    },
    {
      wave: 4,
      name: "Pattern closure",
      scope: "Promote ZIP concepts that are composition behavior into patterns before any template uses them.",
      items: kits.filter((kit) => kit.owners.patterns.length).length,
      exitGates: ["formal artifact", "Surface where structural", "component and primitive slot coverage", "no Card-as-wrapper"],
    },
    {
      wave: 5,
      name: "Template and channel promotion",
      scope: "Validate covered templates and formalize email/iOS as channel contracts without pretending they share the same React runtime.",
      items: templateValidationKits.length + channelKits.length,
      exitGates: ["template cascade audit", "visual/runtime evidence", "email table-safe contract", "iOS adapter contract"],
    },
  ];
}

function createReport() {
  const issues = [];
  if (!fs.existsSync(zipRoot)) issues.push(`Missing extracted ZIP root ${zipRoot}.`);
  if (!fs.existsSync(zipFlowGapFile)) issues.push(`Missing ${rel(zipFlowGapFile)}.`);
  if (!fs.existsSync(zipTemplateParityFile)) issues.push(`Missing ${rel(zipTemplateParityFile)}.`);
  const flowGap = fs.existsSync(zipFlowGapFile) ? readJson(zipFlowGapFile) : { components: [] };
  const parity = fs.existsSync(zipTemplateParityFile) ? readJson(zipTemplateParityFile) : { kits: [] };
  const components = fs.existsSync(zipRoot) ? componentRows(flowGap) : [];
  const kits = fs.existsSync(zipRoot) ? kitRows(parity) : [];
  const coverage = fs.existsSync(zipRoot) ? fileCoverage(parity) : { zipFiles: [], declaredFiles: [], undeclaredFiles: [] };
  const sets = {
    foundations: artifactIds("foundations"),
    primitives: artifactIds("primitives"),
    components: artifactIds("components"),
    patterns: artifactIds("patterns"),
    templates: artifactIds("templates"),
  };
  const promotion = promotionPlan(components, kits);
  const promotionComponentGaps = components.filter((row) => row.promotionNeeded);
  const channelFamilies = kits.filter((kit) => kit.channels.includes("email-html") || kit.channels.includes("ios-preview"));
  const inventory = {
    zipComponents: components.length,
    zipComponentsWithTypes: components.filter((row) => row.hasTypes).length,
    zipComponentsWithPrompts: components.filter((row) => row.hasPrompt).length,
    componentPromotionItems: promotionComponentGaps.length,
    componentExactOrAbsorbed: components.filter((row) => row.exactOrAbsorbed).length,
    componentNeedsDecision: components.filter((row) => row.decision === "needs-decision").length,
    zipUiKitFiles: coverage.zipFiles.length,
    declaredUiKitFiles: coverage.declaredFiles.length,
    undeclaredUiKitFiles: coverage.undeclaredFiles.length,
    zipKits: kits.length,
    coveredTemplateKits: kits.filter((kit) => kit.classification === "covered-by-template").length,
    coveredPatternKits: kits.filter((kit) => kit.classification === "covered-by-pattern").length,
    channelFamilies: channelFamilies.length,
    emailChannelFamilies: channelFamilies.filter((kit) => kit.channels.includes("email-html")).length,
    iosPreviewFamilies: channelFamilies.filter((kit) => kit.channels.includes("ios-preview")).length,
    flowFoundations: sets.foundations.size,
    flowPrimitives: sets.primitives.size,
    flowComponents: sets.components.size,
    flowPatterns: sets.patterns.size,
    flowTemplates: sets.templates.size,
    zipGuidelineFiles: walk(path.join(zipRoot, "guidelines"), (file) => file.endsWith(".html")).length,
    zipTokenFiles: walk(path.join(zipRoot, "tokens"), (file) => file.endsWith(".css")).length,
    zipPlatformFiles: walk(path.join(zipRoot, "platforms"), (file) => /\.(json|scss|dart|mjs|md)$/.test(file)).length,
    promotionWaves: promotion.length,
    intakeDebt: issues.length + coverage.undeclaredFiles.length + components.filter((row) => row.decision === "needs-decision").length + kits.reduce((sum, kit) => sum + kit.issues.length, 0),
  };
  const allIssues = [
    ...issues,
    ...coverage.undeclaredFiles.map((file) => `ZIP ui_kit file is not classified: ${file}.`),
    ...components.filter((row) => row.decision === "needs-decision").map((row) => `${row.name} has no Flow taxonomy decision.`),
    ...kits.flatMap((kit) => kit.issues.map((issue) => `${kit.id}: ${issue}`)),
  ];
  return {
    status: allIssues.length ? "fail" : "pass",
    audit: "zip system intake",
    principle: "Every ZIP component, guideline, token output, kit, template screen, email, and iOS preview must have a Flow taxonomy target and promotion path before new implementation work starts.",
    generatedAt: new Date().toISOString(),
    inventory,
    promotionPlan: promotion,
    componentPromotionItems: promotionComponentGaps,
    channelFamilies,
    uiKitFileCoverage: coverage,
    components,
    kits,
    issues: allIssues,
  };
}

function markdown(report) {
  return [
    "# ZIP system intake audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Promotion Waves",
    "",
    ...report.promotionPlan.map((wave) => `- ${wave.wave}. ${wave.name}: ${wave.items} item(s). ${wave.scope}`),
    "",
    "## Component Promotion Items",
    "",
    ...(report.componentPromotionItems.length
      ? report.componentPromotionItems.map((item) => `- ${item.name}: ${item.taxonomyTarget} -> ${item.flowOwner} (${item.decision})`)
      : ["- None."]),
    "",
    "## Channel Families",
    "",
    ...(report.channelFamilies.length
      ? report.channelFamilies.map((kit) => `- ${kit.id}: ${kit.promotionTarget} (${kit.channels.join(", ")})`)
      : ["- None."]),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None."]),
    "",
  ].join("\n");
}

const report = createReport();
fs.mkdirSync(outputDir, { recursive: true });
if (checkMode && fs.existsSync(jsonOutput)) {
  const previous = JSON.parse(fs.readFileSync(jsonOutput, "utf8"));
  const previousStable = { ...previous, generatedAt: report.generatedAt };
  if (JSON.stringify(previousStable, null, 2) !== JSON.stringify(report, null, 2)) {
    throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-zip-system-intake.js.`);
  }
}
fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownOutput, `${markdown(report)}\n`);

if (report.status !== "pass") {
  throw new Error(`ZIP system intake failed with ${report.issues.length} issue(s).`);
}
