#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const {
  inheritedReactPropNames,
  ownReactPropsFor,
  reactAllowedValues,
  semanticInheritedPropsFor,
} = require("./react-contract-shared.js");

const root = process.cwd();
const checkMode = process.argv.includes("--check");
const reviewedMode = process.argv.includes("--reviewed");
const componentArgs = process.argv
  .filter((arg) => arg.startsWith("--component="))
  .map((arg) => arg.slice("--component=".length))
  .filter(Boolean);

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "component-source-of-truth-drift.json");
const markdownOutput = path.join(outputDir, "component-source-of-truth-drift.md");
const specDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const contentDir = path.join(root, "packages/content/content/component-copy/components");
const generatedContractDir = path.join(root, "packages/content/content/component-contracts/components");
const reactSrcDir = path.join(root, "packages/react/src");
const platformDir = path.join(root, "packages/components/src/platforms");

const activeReviewedIds = new Set([
  "accordion",
  "breadcrumbs",
  "button",
  "card",
  "card-expiry-input",
  "card-number-input",
  "card-security-code-input",
  "checkbox",
  "chip",
  "code-input",
  "combobox",
  "country-selector",
  "date-picker",
  "date-range-picker",
  "dialog",
  "drawer",
  "input",
  "input-amount",
  "pagination",
  "phone-input",
  "radio-button",
  "select",
  "slider",
  "table",
  "text-area",
]);

function slugToCamel(id) {
  return id.replace(/-([a-z0-9])/g, (_, value) => value.toUpperCase());
}

function slugToPascal(id) {
  return id
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listComponentIds() {
  const ids = fs.readdirSync(specDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""))
    .sort();
  if (componentArgs.length) return ids.filter((id) => componentArgs.includes(id));
  if (reviewedMode) return ids.filter((id) => activeReviewedIds.has(id));
  return ids;
}

function readSpec(id) {
  const file = path.join(specDir, `${id}.json`);
  return readJson(file).artifacts?.components?.[id] ?? {};
}

function normalizeVariant(variant) {
  if (typeof variant === "string") return variant;
  return variant?.id;
}

function normalizeProp(prop) {
  if (typeof prop === "string") return { name: prop };
  return prop ?? {};
}

function names(items, normalizer = (item) => item) {
  return [...new Set((items ?? [])
    .map(normalizer)
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim()))].sort();
}

function compareSets(left, right) {
  return {
    missingInLeft: right.filter((item) => !left.includes(item)),
    missingInRight: left.filter((item) => !right.includes(item)),
  };
}

function readContent(id) {
  const file = path.join(contentDir, id, "all.json");
  if (!fs.existsSync(file)) return {};
  return readJson(file).components?.[id] ?? {};
}

function contentApiProps(content) {
  return names(content["api-foundations"]?.props, (prop) => normalizeProp(prop).name);
}

function contentVariants(content) {
  return names(content.variants?.demos, (demo) => demo.variant
    ?? demo.button?.variant
    ?? demo.select?.variant
    ?? demo.card?.variant
    ?? demo.checkbox?.variant
    ?? demo.switch?.variant
    ?? demo.radio?.variant
    ?? demo.field?.variant
    ?? demo.badge?.variant
    ?? demo.chip?.variant);
}

function contentStates(content) {
  return names(content.states?.states ?? content.states?.demos, (state) => typeof state === "string" ? state : state?.state);
}

function readReactTypes(id) {
  const componentName = slugToPascal(id);
  const file = path.join(reactSrcDir, `${componentName}.d.ts`);
  if (!fs.existsSync(file)) return { componentName, file, props: [], variants: [], states: [] };
  const text = fs.readFileSync(file, "utf8");
  return {
    componentName,
    file,
    props: names(ownReactPropsFor(text, componentName), (prop) => prop.name),
    variants: names(reactAllowedValues(text, componentName, "variant")),
    states: names(reactAllowedValues(text, componentName, "state")),
  };
}

function readPlatformProps(id) {
  const file = path.join(platformDir, `${id}.js`);
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, "utf8");
  return names([...text.matchAll(/props:\s*([A-Za-z0-9]+)Contract\.props\.map/g)].map(() => []));
}

function packageScripts() {
  return readJson(path.join(root, "package.json")).scripts ?? {};
}

function generatorGovernanceFindings(scripts) {
  const findings = [];
  const generatorFile = path.join(root, "scripts/generate-component-contracts.mjs");
  const generatorText = fs.existsSync(generatorFile) ? fs.readFileSync(generatorFile, "utf8") : "";
  if (scripts["build:component-contracts"] !== "node scripts/generate-component-contracts.mjs") {
    findings.push({
      severity: "high",
      source: "generator-governance",
      message: "package.json is missing the build:component-contracts source-of-truth generator script.",
      files: ["package.json"],
    });
  }
  for (const requiredText of ["--component=", "requestedComponents", "Missing component-copy source"]) {
    if (!generatorText.includes(requiredText)) {
      findings.push({
        severity: "high",
        source: "generator-governance",
        message: `Component contract generator is missing scoped guard: ${requiredText}.`,
        files: [relative(generatorFile)],
      });
    }
  }
  return findings;
}

function generatedContractCommandFindings(id, scripts) {
  const file = path.join(generatedContractDir, `${id}.md`);
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, "utf8");
  const commands = [...text.matchAll(/npm run ([a-z0-9:.-]+)/gi)].map((match) => match[1]);
  return commands
    .filter((command) => !scripts[command])
    .map((command) => ({
      severity: "high",
      source: "generated-contract",
      file: relative(file),
      message: `${id} generated contract references missing script npm run ${command}.`,
    }));
}

function driftFindings(id, label, sourceA, sourceB, comparison, severity = "high") {
  const findings = [];
  if (comparison.missingInLeft.length) {
    findings.push({
      severity,
      source: label,
      component: id,
      message: `${sourceA.name} is missing ${sourceB.name} ${label}: ${comparison.missingInLeft.join(", ")}.`,
      files: [sourceA.file, sourceB.file].filter(Boolean).map(relative),
    });
  }
  if (comparison.missingInRight.length) {
    findings.push({
      severity,
      source: label,
      component: id,
      message: `${sourceB.name} is missing ${sourceA.name} ${label}: ${comparison.missingInRight.join(", ")}.`,
      files: [sourceA.file, sourceB.file].filter(Boolean).map(relative),
    });
  }
  return findings;
}

function comparableReactContractProps(componentName, contractProps) {
  const semanticInherited = new Set(semanticInheritedPropsFor(componentName));
  return contractProps.filter((prop) => !inheritedReactPropNames.has(prop) || semanticInherited.has(prop));
}

function compareReactToContractProps(componentName, reactProps, contractProps) {
  return {
    missingInLeft: comparableReactContractProps(componentName, contractProps).filter((prop) => !reactProps.includes(prop)),
    missingInRight: comparableReactContractProps(componentName, reactProps).filter((prop) => !contractProps.includes(prop)),
  };
}

async function buildReport() {
  const scripts = packageScripts();
  const { componentContracts } = await import(`${pathToFileURL(path.join(root, "packages/components/src/contracts.js")).href}?t=${Date.now()}`);
  const ids = listComponentIds();
  const findings = generatorGovernanceFindings(scripts);
  const componentReports = [];

  for (const id of ids) {
    const key = slugToCamel(id);
    const spec = readSpec(id);
    const contract = componentContracts[key];
    const content = readContent(id);
    const react = readReactTypes(id);
    const sources = {
      spec: {
        name: "spec",
        file: path.join(specDir, `${id}.json`),
        props: names(spec.props, (prop) => normalizeProp(prop).name),
        variants: names(spec.variants, normalizeVariant),
        states: names(spec.states),
      },
      contract: {
        name: "componentContracts",
        file: path.join(root, "packages/components/src/contracts.ts"),
        props: names(contract?.props, (prop) => normalizeProp(prop).name),
        variants: names(contract?.variants),
        states: names(contract?.states),
      },
      content: {
        name: "component-copy",
        file: path.join(contentDir, id, "all.json"),
        props: contentApiProps(content),
        variants: contentVariants(content),
        states: contentStates(content),
      },
      react: {
        name: "React types",
        file: react.file,
        props: react.props,
        variants: react.variants,
        states: react.states,
      },
    };

    findings.push(...generatedContractCommandFindings(id, scripts));
    for (const facet of ["props", "variants", "states"]) {
      findings.push(...driftFindings(id, facet, sources.spec, sources.contract, compareSets(sources.spec[facet], sources.contract[facet])));
      if (sources.content[facet].length) {
        findings.push(...driftFindings(id, facet, sources.content, sources.contract, compareSets(sources.content[facet], sources.contract[facet]), "medium"));
      }
      if (sources.react[facet].length) {
        const comparison = facet === "props"
          ? compareReactToContractProps(react.componentName, sources.react.props, sources.contract.props)
          : compareSets(sources.react[facet], sources.contract[facet]);
        findings.push(...driftFindings(id, facet, sources.react, sources.contract, comparison, "medium"));
      }
    }
    componentReports.push({
      id,
      status: findings.some((finding) => finding.component === id || finding.message.startsWith(`${id} `)) ? "drift" : "aligned",
      sources: Object.fromEntries(Object.entries(sources).map(([name, source]) => [name, {
        props: source.props,
        variants: source.variants,
        states: source.states,
      }])),
    });
  }

  const report = {
    schemaVersion: "flow-component-source-of-truth-drift@1",
    generatedAt: new Date().toISOString(),
    status: findings.length ? "fail" : "pass",
    scope: componentArgs.length ? componentArgs : reviewedMode ? [...activeReviewedIds].sort() : "all-components",
    decision: {
      editableApiTruth: "packages/specs/specs/unison-system/artifacts/components/*.json",
      editableCopyTruth: "packages/content/content/component-copy/components/*/*.json",
      runtimeContractTruth: "packages/components/src/contracts.ts, compiled to packages/components/src/contracts.js",
      reactTruth: "packages/react/src/*.tsx and packages/react/src/*.d.ts, compiled to packages/react/dist",
      generatedContractTruth: "packages/content/content/component-contracts/components/*.md is generated and must not define new API truth",
      generatorTruth: "npm run build:component-contracts -- --component=<id> is the scoped generator path; missing components must fail instead of silently writing drift",
      localDemoTruth: "packages/audit/scripts/build-local-react-qa-demo.mjs must consume React runtime and may not introduce undocumented variants or props",
    },
    summary: {
      componentsChecked: ids.length,
      aligned: componentReports.filter((component) => component.status === "aligned").length,
      drift: componentReports.filter((component) => component.status === "drift").length,
      findings: findings.length,
      highFindings: findings.filter((finding) => finding.severity === "high").length,
      mediumFindings: findings.filter((finding) => finding.severity === "medium").length,
    },
    findings,
    components: componentReports,
  };
  return report;
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(report, null, 2) + "\n");
  const lines = [
    "# Component Source Of Truth Drift",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Scope: ${Array.isArray(report.scope) ? report.scope.join(", ") : report.scope}`,
    "",
    "## Summary",
    "",
    `- Components checked: ${report.summary.componentsChecked}`,
    `- Aligned: ${report.summary.aligned}`,
    `- Drift: ${report.summary.drift}`,
    `- Findings: ${report.summary.findings}`,
    `- High findings: ${report.summary.highFindings}`,
    `- Medium findings: ${report.summary.mediumFindings}`,
    "",
    "## Ownership",
    "",
    ...Object.entries(report.decision).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Findings",
    "",
  ];
  if (!report.findings.length) {
    lines.push("- None.");
  } else {
    for (const finding of report.findings.slice(0, 200)) {
      lines.push(`- [${finding.severity}] ${finding.message}`);
      if (finding.files?.length) lines.push(`  Files: ${finding.files.join(", ")}`);
    }
    if (report.findings.length > 200) lines.push(`- Truncated: ${report.findings.length - 200} additional findings are in the JSON report.`);
  }
  fs.writeFileSync(markdownOutput, `${lines.join("\n")}\n`);
}

buildReport()
  .then((report) => {
    writeReport(report);
    console.log(JSON.stringify({
      status: report.status,
      summary: report.summary,
      output: {
        json: relative(jsonOutput),
        markdown: relative(markdownOutput),
      },
    }, null, 2));
    if (checkMode && report.status !== "pass") process.exitCode = 1;
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
