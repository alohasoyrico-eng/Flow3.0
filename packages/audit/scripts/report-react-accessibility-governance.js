#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-accessibility-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-accessibility-governance-audit.md");

const criticalRequirements = {
  Dialog: [
    ["role dialog", /role:\s*"dialog"/],
    ["modal", /"aria-modal":\s*"true"/],
    ["labelledby", /"aria-labelledby"/],
    ["escape", /event\.key\s*!==\s*"Escape"|event\.key\s*===\s*"Escape"/],
    ["focus restoration", /\.focus\(\)/],
  ],
  Drawer: [
    ["role dialog", /role:\s*"dialog"/],
    ["modal", /"aria-modal":\s*"true"/],
    ["labelledby", /"aria-labelledby"/],
    ["escape", /event\.key\s*!==\s*"Escape"|event\.key\s*===\s*"Escape"/],
    ["focus restoration", /\.focus\(\)/],
  ],
  Menu: [
    ["menu trigger", /"aria-haspopup":\s*"menu"/],
    ["expanded state", /"aria-expanded"/],
    ["role menu", /role:\s*"menu"/],
    ["role menuitem", /role:\s*"menuitem"/],
    ["keyboard", /onKeyDown/],
    ["escape", /event\.key\s*===\s*"Escape"/],
    ["focus management", /\.focus\(\)/],
  ],
  Popover: [
    ["dialog trigger", /"aria-haspopup":\s*"dialog"/],
    ["expanded state", /"aria-expanded"/],
    ["role dialog", /role:\s*"dialog"/],
    ["labelledby", /"aria-labelledby"/],
    ["keyboard", /onKeyDown/],
    ["escape", /event\.key\s*!==\s*"Escape"|event\.key\s*===\s*"Escape"/],
    ["focus restoration", /\.focus\(\)/],
  ],
  Tooltip: [
    ["describedby", /"aria-describedby"/],
    ["role tooltip", /role:\s*"tooltip"/],
    ["keyboard", /onKeyDown/],
    ["escape", /event\.key\s*!==\s*"Escape"|event\.key\s*===\s*"Escape"/],
    ["focus trigger", /onFocus/],
  ],
  Select: [
    ["role combobox", /role:\s*"combobox"/],
    ["expanded state", /"aria-expanded"/],
    ["listbox", /role:\s*"listbox"/],
    ["option", /role:\s*"option"/],
    ["active descendant", /"aria-activedescendant"/],
    ["keyboard", /onKeyDown/],
    ["escape", /event\.key\s*===\s*"Escape"/],
  ],
  Combobox: [
    ["role combobox", /role:\s*"combobox"/],
    ["autocomplete", /"aria-autocomplete":\s*"list"/],
    ["expanded state", /"aria-expanded"/],
    ["listbox", /role:\s*"listbox"/],
    ["option", /role:\s*"option"/],
    ["active descendant", /"aria-activedescendant"/],
    ["keyboard", /onKeyDown/],
    ["escape", /event\.key\s*===\s*"Escape"/],
  ],
  CountrySelector: [
    ["role combobox", /role:\s*"combobox"/],
    ["expanded state", /"aria-expanded"/],
    ["listbox", /role:\s*"listbox"/],
    ["option", /role:\s*"option"/],
    ["active descendant", /"aria-activedescendant"/],
    ["keyboard", /onKeyDown/],
    ["escape", /event\.key\s*===\s*"Escape"/],
  ],
  DatePicker: [
    ["dialog trigger", /"aria-haspopup":\s*"dialog"/],
    ["expanded state", /"aria-expanded"/],
    ["role dialog", /role:\s*"dialog"/],
    ["grid", /role:\s*"grid"/],
    ["gridcell", /role:\s*"gridcell"/],
    ["keyboard", /onKeyDown/],
    ["escape", /event\.key\s*!==\s*"Escape"|event\.key\s*===\s*"Escape"/],
    ["focus restoration", /\.focus\(\)/],
  ],
  DateRangePicker: [
    ["dialog trigger", /"aria-haspopup":\s*"dialog"/],
    ["expanded state", /"aria-expanded"/],
    ["role dialog", /role:\s*"dialog"/],
    ["grid", /role:\s*"grid"/],
    ["gridcell", /role:\s*"gridcell"/],
    ["keyboard", /onKeyDown/],
    ["escape", /event\.key\s*!==\s*"Escape"|event\.key\s*===\s*"Escape"/],
    ["focus restoration", /\.focus\(\)/],
  ],
};

function componentFiles() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .sort()
    .map((file) => path.join(reactSrcDir, file));
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function createReport() {
  const components = componentFiles().map((file) => {
    const component = path.basename(file, ".js");
    const source = read(file);
    const requirements = (criticalRequirements[component] ?? []).map(([label, pattern]) => ({
      label,
      present: pattern.test(source),
    }));
    const missing = requirements.filter((item) => !item.present).map((item) => item.label);
    return {
      component,
      file: rel(file),
      critical: Boolean(criticalRequirements[component]),
      requirements,
      missing,
      signals: {
        roles: countMatches(source, /\brole:/g),
        aria: countMatches(source, /"aria-[^"]+"/g),
        tabIndex: countMatches(source, /\btabIndex\b/g),
        keyboardHandlers: countMatches(source, /\bonKeyDown\b/g),
        usesId: /\buseId\b/.test(source),
        focusCalls: countMatches(source, /\.focus\(\)/g),
      },
      status: missing.length ? "fail" : "pass",
    };
  });
  const critical = components.filter((component) => component.critical);
  return {
    status: components.some((component) => component.status === "fail") ? "fail" : "pass",
    audit: "react accessibility governance",
    principle: "React components with accessibility-critical interaction must keep explicit role, ARIA, keyboard, and focus contracts visible in source and gated in validation.",
    inventory: {
      components: components.length,
      criticalComponents: critical.length,
      criticalPassing: critical.filter((component) => component.status === "pass").length,
      totalRoles: components.reduce((total, component) => total + component.signals.roles, 0),
      totalAria: components.reduce((total, component) => total + component.signals.aria, 0),
      keyboardHandlers: components.reduce((total, component) => total + component.signals.keyboardHandlers, 0),
      focusCalls: components.reduce((total, component) => total + component.signals.focusCalls, 0),
      failures: components.reduce((total, component) => total + component.missing.length, 0),
    },
    components,
  };
}

function toMarkdown(report) {
  const criticalRows = report.components
    .filter((component) => component.critical)
    .map((component) => `| ${component.component} | ${component.status} | ${component.requirements.filter((item) => item.present).map((item) => item.label).join(", ") || "None"} | ${component.missing.join(", ") || "None"} |`);
  const signalRows = report.components
    .filter((component) => component.signals.roles || component.signals.aria || component.signals.keyboardHandlers || component.signals.focusCalls)
    .map((component) => `| ${component.component} | ${component.signals.roles} | ${component.signals.aria} | ${component.signals.keyboardHandlers} | ${component.signals.tabIndex} | ${component.signals.focusCalls} | ${component.signals.usesId ? "yes" : "no"} |`);
  return [
    "# React Accessibility Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- React components scanned: ${report.inventory.components}`,
    `- Accessibility-critical components: ${report.inventory.criticalComponents}`,
    `- Critical passing: ${report.inventory.criticalPassing}`,
    `- Role declarations: ${report.inventory.totalRoles}`,
    `- ARIA declarations: ${report.inventory.totalAria}`,
    `- Keyboard handlers: ${report.inventory.keyboardHandlers}`,
    `- Focus calls: ${report.inventory.focusCalls}`,
    `- Failures: ${report.inventory.failures}`,
    "",
    "## Critical Components",
    "",
    "| Component | Status | Present requirements | Missing |",
    "| --- | --- | --- | --- |",
    ...criticalRows,
    "",
    "## Signal Inventory",
    "",
    "| Component | Roles | ARIA | Keyboard | tabIndex | Focus calls | useId |",
    "| --- | ---: | ---: | ---: | ---: | ---: | --- |",
    ...signalRows,
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
      console.error("React accessibility governance report is stale. Run: node packages/audit/scripts/report-react-accessibility-governance.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    criticalComponents: report.inventory.criticalComponents,
    criticalPassing: report.inventory.criticalPassing,
    failures: report.inventory.failures,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
