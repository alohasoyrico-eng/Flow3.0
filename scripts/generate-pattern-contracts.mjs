#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "packages/content/content/pattern-copy/patterns");
const targetDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const artifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const checkMode = process.argv.includes("--check");

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function primitiveNames() {
  if (!fs.existsSync(primitiveDir)) return new Set();
  return new Set(fs.readdirSync(primitiveDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, "")));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function titleFromId(id) {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sentence(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function list(items) {
  const values = [...new Set((items ?? []).filter(Boolean).map((item) => String(item).trim()).filter(Boolean))];
  return values.length ? `${values.map((item) => `- ${item}`).join("\n")}\n` : "";
}

function cell(value) {
  if (Array.isArray(value)) return value.join(", ").replace(/\|/g, "\\|");
  return String(value ?? "").replace(/\n/g, " ").replace(/\|/g, "\\|");
}

function table(headers, rows) {
  if (!rows?.length) return "";
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
    "",
  ].join("\n");
}

function readPattern(id) {
  const file = path.join(sourceDir, id, "all.json");
  const json = readJson(file);
  return {
    sourceFiles: [file],
    content: json.patterns?.[id] ?? {},
  };
}

function readArtifact(id) {
  const file = path.join(artifactDir, `${id}.json`);
  if (!fs.existsSync(file)) {
    return {
      artifactFiles: [],
      artifact: {},
    };
  }
  const json = readJson(file);
  return {
    artifactFiles: [file],
    artifact: json.artifacts?.patterns?.[id] ?? {},
  };
}

function renderPurpose(content) {
  return ["## Purpose", "", sentence(content.purpose), ""].join("\n");
}

function renderUseWhen(content) {
  return ["## Use When", "", list(content.useWhen)].join("\n");
}

function renderDoNotUse(content) {
  return ["## Do Not Use Without Review", "", list(content.doNotUseWithoutReview)].join("\n");
}

function renderFoundations(content) {
  return ["## Foundations", "", table(["Foundation", "Contract"], content.foundations ?? [])].join("\n");
}

function renderFormalPurpose(artifact) {
  return ["## Formal Purpose", "", sentence(artifact.purpose), ""].join("\n");
}

function renderFormalStates(artifact) {
  return ["## Formal States", "", list(artifact.states?.map((state) => `\`${state}\``))].join("\n");
}

function renderFormalScope(artifact) {
  const rows = [
    ["Layer", artifact.layer],
    ["Platform", artifact.platform],
    ["Audiences", artifact.audiences?.map((value) => `\`${value}\``).join(", ")],
    ["Density Context", artifact.densityContext?.map((value) => `\`${value}\``).join(", ")],
    ["Template Dependencies", artifact.templateDependencies?.map((value) => `\`${value}\``).join(", ")],
  ].filter(([, value]) => value);
  return ["## Formal Scope", "", table(["Field", "Value"], rows)].join("\n");
}

function renderFormalDependencies(artifact) {
  const sections = [
    ["Foundations", artifact.governingFoundations],
    ["Foundation Dependencies", artifact.foundationDependencies],
    ["Primitives", artifact.primitiveDependencies],
    ["Components", artifact.componentDependencies],
    ["Patterns", artifact.patternDependencies],
    ["Tokens", artifact.tokenDependencies],
  ]
    .filter(([, values]) => values?.length)
    .flatMap(([label, values]) => [`### ${label}`, "", list(values.map((value) => `\`${value}\``))]);
  return sections.length ? ["## Formal Dependencies", "", ...sections].join("\n") : "";
}

function renderFormalSlots(artifact) {
  const rows = (artifact.slots ?? []).map((slot) => [
    `\`${slot.name}\``,
    `\`${slot.owner}\``,
    (slot.uses ?? []).map((use) => `\`${use}\``).join(", "),
  ]);
  return ["## Formal Slots", "", table(["Slot", "Owner", "Uses"], rows)].join("\n");
}

function renderFormalGovernance(artifact) {
  const sections = [
    ["Entry Conditions", artifact.entryConditions],
    ["Decision Tree", artifact.decisionTree],
    ["Failure Modes", artifact.failureModes],
    ["Success Metrics", artifact.successMetrics],
    ["Accessibility", artifact.accessibility],
    ["Tests", artifact.tests],
    ["Agent Instructions", artifact.agentInstructions],
    ["Reject If", artifact.rejectIf],
  ]
    .filter(([, values]) => values?.length)
    .flatMap(([label, values]) => [`### ${label}`, "", list(values)]);
  return sections.length ? ["## Formal Governance", "", ...sections].join("\n") : "";
}

function renderSlots(content) {
  return ["## Slot Contract", "", table(["Slot", "Type", "Required", "Notes"], content.slots ?? [])].join("\n");
}

function renderComponents(content) {
  return ["## Components Used", "", list(content.componentsUsed)].join("\n");
}

function renderPrimitiveSlots(content, primitiveIds) {
  const rows = (content.slots ?? []).flatMap(([slot, type, required, notes]) => String(type)
    .split(/\s*\|\s*/)
    .map((part) => part.replace(/\[\]$/, "").trim())
    .filter((part) => primitiveIds.has(slug(part)))
    .map((primitive) => [slot, primitive, required, notes]));
  if (!rows.length) return "";
  return ["## Primitive Slot Ownership", "", table(["Slot", "Primitive", "Required", "Notes"], rows)].join("\n");
}

function renderVariants(content) {
  return ["## Variants", "", table(["Variant", "Status", "Rule"], content.variants ?? [])].join("\n");
}

function renderMotion(content) {
  return ["## Motion Contract", "", table(["Behavior", "Rule"], content.motion ?? [])].join("\n");
}

function renderAccessibility(content) {
  return ["## Accessibility", "", list(content.accessibility)].join("\n");
}

function renderTests(content) {
  return ["## Tests And Rejection Rules", "", "Must test:", "", list(content.tests), "Reject if:", "", list(content.miel?.rejectIf)].join("\n");
}

function renderMiel(content) {
  const miel = content.miel ?? {};
  const lines = ["## MIEL", ""];
  if (miel.canDecide?.length) lines.push("Agents can decide:", "", list(miel.canDecide));
  if (miel.mustAsk?.length) lines.push("Agents must ask:", "", list(miel.mustAsk));
  if (miel.rejectIf?.length) lines.push("Agents must reject:", "", list(miel.rejectIf));
  if (sentence(miel.handoff)) lines.push("Handoff language:", "", `> ${miel.handoff}`, "");
  return lines.join("\n");
}

function renderImplementationChecklist(content) {
  const slotItems = (content.slots ?? [])
    .filter((row) => String(row[2]).toLowerCase() === "yes")
    .map((row) => `Declare \`${row[0]}\`: ${row[3]}`);
  const testItems = content.tests ?? [];
  const items = [...slotItems, ...testItems];
  return ["## Implementation Checklist", "", list(items)].join("\n");
}

function renderContract(id, sourceFiles, content, primitiveIds, artifact) {
  const sources = sourceFiles.map((file) => `- \`${path.relative(root, file)}\``).join("\n");
  const sections = [
    renderPurpose(content),
    renderUseWhen(content),
    renderDoNotUse(content),
    renderFoundations(content),
    renderFormalPurpose(artifact),
    renderFormalScope(artifact),
    renderFormalStates(artifact),
    renderFormalDependencies(artifact),
    renderFormalSlots(artifact),
    renderFormalGovernance(artifact),
    renderSlots(content),
    renderComponents(content),
    renderPrimitiveSlots(content, primitiveIds),
    renderVariants(content),
    renderMotion(content),
    renderAccessibility(content),
    renderImplementationChecklist(content),
    renderTests(content),
    renderMiel(content),
  ].filter(Boolean);

  return [
    `# ${titleFromId(id)}`,
    "",
    "Generated portable agent contract for Design System.",
    "",
    "Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.",
    "",
    "Source content:",
    "",
    sources,
    "",
    ...sections,
  ].join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

const patternIds = fs.readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((id) => fs.existsSync(path.join(sourceDir, id, "all.json")))
  .sort();

function generatedContracts() {
  const primitiveIds = primitiveNames();
  return patternIds.map((id) => {
    const { sourceFiles, content } = readPattern(id);
    const { artifactFiles, artifact } = readArtifact(id);
    return {
      id,
      file: path.join(targetDir, `${id}.md`),
      content: renderContract(id, [...sourceFiles, ...artifactFiles], content, primitiveIds, artifact),
    };
  });
}

const contracts = generatedContracts();

if (checkMode) {
  const expectedFiles = new Set(contracts.map(({ file }) => file));
  const stale = [];

  for (const { file, content } of contracts) {
    if (!fs.existsSync(file)) {
      stale.push(`${path.relative(root, file)} missing`);
      continue;
    }
    if (fs.readFileSync(file, "utf8") !== content) {
      stale.push(`${path.relative(root, file)} stale`);
    }
  }

  if (fs.existsSync(targetDir)) {
    for (const entry of fs.readdirSync(targetDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        const file = path.join(targetDir, entry.name);
        if (!expectedFiles.has(file)) {
          stale.push(`${path.relative(root, file)} extra`);
        }
      }
    }
  }

  if (stale.length) {
    console.error("Pattern contracts are stale. Run: npm run build:pattern-contracts");
    console.error(stale.slice(0, 20).map((item) => `- ${item}`).join("\n"));
    if (stale.length > 20) console.error(`- ...and ${stale.length - 20} more`);
    process.exit(1);
  }

  console.log(`Pattern contracts are fresh (${contracts.length}).`);
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const id of patternIds) {
  const contract = contracts.find((item) => item.id === id);
  fs.writeFileSync(contract.file, contract.content);
}

console.log(`Generated ${patternIds.length} pattern contracts.`);
