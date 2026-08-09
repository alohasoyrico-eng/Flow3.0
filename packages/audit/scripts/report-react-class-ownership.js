#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");
const {
  allowedClassRootsForReactComponent,
  classRootTokensFromClassExpression,
  classRootsFromClassExpression,
  componentClassRoots,
  ownerClassRootForReactComponent,
  packageCssClassRoots,
  protectedComponentRoots,
  reactSupportClassRoots,
} = require("./audit-anti-duplication.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-class-ownership-audit.json");
const markdownOutput = path.join(outputDir, "react-class-ownership-audit.md");

function componentFiles() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .sort()
    .map((file) => path.join(reactSrcDir, file));
}

function lineForIndex(text, index) {
  return text.slice(0, index).split("\n").length;
}

function sourceClassRoots(source) {
  return [...source.matchAll(/\bclassName\s*:\s*(?:\[([^\]]+)\]|["'`]([^"'`]+)["'`])/g)].map((match) => ({
    index: match.index,
    allRoots: [...classRootTokensFromClassExpression(match[1] ?? match[2] ?? "")].sort(),
    roots: [...classRootsFromClassExpression(match[1] ?? match[2] ?? "")].sort(),
    text: match[0].trim(),
  })).filter((match) => match.allRoots.length);
}

function createReport() {
  const packageRoots = packageCssClassRoots();
  const components = componentFiles().map((file) => {
    const component = path.basename(file, ".js");
    const source = read(file);
    const ownerRoot = ownerClassRootForReactComponent(component);
    const allowedRoots = [...allowedClassRootsForReactComponent(component)].sort();
    const classMatches = sourceClassRoots(source);
    const observedRoots = [...new Set(classMatches.flatMap((match) => match.roots))].sort();
    const observedSupportRoots = [...new Set(classMatches.flatMap((match) => match.allRoots.filter((rootToken) => reactSupportClassRoots.has(rootToken))))].sort();
    const violations = classMatches.flatMap((match) => {
      const protectedCrossRoots = match.roots.filter((rootToken) => protectedComponentRoots.has(rootToken) && rootToken !== ownerRoot);
      const unknownRoots = match.allRoots.filter((rootToken) => packageRoots.has(rootToken) && !componentClassRoots.has(rootToken) && !reactSupportClassRoots.has(rootToken));
      const illegalRoots = [...new Set(match.roots.filter((rootToken) => !allowedRoots.includes(rootToken)).concat(protectedCrossRoots, unknownRoots))].sort();
      return illegalRoots.map((rootToken) => ({
        root: rootToken,
        protected: protectedComponentRoots.has(rootToken),
        support: reactSupportClassRoots.has(rootToken),
        unknown: !componentClassRoots.has(rootToken) && !reactSupportClassRoots.has(rootToken),
        line: lineForIndex(source, match.index),
        text: match.text,
      }));
    });
    return {
      component,
      file: rel(file),
      ownerRoot,
      allowedRoots,
      observedRoots,
      observedSupportRoots,
      protectedRootsObserved: observedRoots.filter((rootToken) => protectedComponentRoots.has(rootToken)),
      violations,
      status: violations.length ? "fail" : "pass",
    };
  });
  const violations = components.reduce((total, item) => total + item.violations.length, 0);
  const classOwnershipDebt = violations;
  return {
    status: classOwnershipDebt ? "fail" : "pass",
    audit: "react class ownership",
    principle: "React components may only author their own visual class roots or explicit family roots; protected roots must be reused through real component composition. The actionable debt metric is classOwnershipDebt.",
    inventory: {
      components: components.length,
      componentClassRoots: componentClassRoots.size,
      protectedComponentRoots: protectedComponentRoots.size,
      supportClassRoots: reactSupportClassRoots.size,
      packageCssRoots: packageRoots.size,
      componentsWithFamilyRoots: components.filter((item) => item.allowedRoots.length > 1).length,
      observedRootAssignments: components.reduce((total, item) => total + item.observedRoots.length, 0),
      observedSupportRootAssignments: components.reduce((total, item) => total + item.observedSupportRoots.length, 0),
      violations,
      classOwnershipDebt,
    },
    protectedComponentRoots: [...protectedComponentRoots].sort(),
    reactSupportClassRoots: [...reactSupportClassRoots].sort(),
    packageCssRoots: [...packageRoots].sort(),
    components,
  };
}

function toMarkdown(report) {
  const componentRows = report.components.map((item) => `| ${item.component} | ${item.status} | ${item.ownerRoot} | ${item.allowedRoots.join(", ") || "None"} | ${item.observedRoots.join(", ") || "None"} | ${item.observedSupportRoots.join(", ") || "None"} | ${item.violations.length} |`);
  const violationRows = report.components.flatMap((item) => item.violations.map((violation) => `| ${item.component} | ${violation.root} | ${violation.protected ? "yes" : "no"} | ${violation.unknown ? "yes" : "no"} | ${item.file}:${violation.line} | \`${violation.text.replaceAll("|", "\\|")}\` |`));
  return [
    "# React Class Ownership Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- React components scanned: ${report.inventory.components}`,
    `- Component class roots known: ${report.inventory.componentClassRoots}`,
    `- Protected class roots: ${report.protectedComponentRoots.join(", ")}`,
    `- Support class roots: ${report.reactSupportClassRoots.join(", ")}`,
    `- Package CSS roots visible to React governance: ${report.inventory.packageCssRoots}`,
    `- Components with family roots: ${report.inventory.componentsWithFamilyRoots}`,
    `- Observed root assignments: ${report.inventory.observedRootAssignments}`,
    `- Observed support root assignments: ${report.inventory.observedSupportRootAssignments}`,
    `- Violations: ${report.inventory.violations}`,
    `- Class ownership debt: ${report.inventory.classOwnershipDebt}`,
    "",
    "## Components",
    "",
    "| Component | Status | Owner root | Allowed roots | Observed component roots | Observed support roots | Violations |",
    "| --- | --- | --- | --- | --- | --- | ---: |",
    ...componentRows,
    "",
    "## Violations",
    "",
    "| Component | Root | Protected | Unknown | Location | Source |",
    "| --- | --- | --- | --- | --- | --- |",
    ...(violationRows.length ? violationRows : ["| None | None | None | None | None | None |"]),
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${toMarkdown(report)}\n`);
}

function main() {
  const report = createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("React class ownership report is stale. Run: node packages/audit/scripts/report-react-class-ownership.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    observedRootAssignments: report.inventory.observedRootAssignments,
    observedSupportRootAssignments: report.inventory.observedSupportRootAssignments,
    violations: report.inventory.violations,
    classOwnershipDebt: report.inventory.classOwnershipDebt,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
