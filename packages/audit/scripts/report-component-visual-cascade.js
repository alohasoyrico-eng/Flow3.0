#!/usr/bin/env node

const {
  docsStyleModuleFiles,
  docsAppDir,
  fs,
  goldComponents,
  add,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "component-visual-cascade-audit.json");
const markdownOutput = path.join(outputDir, "component-visual-cascade-audit.md");
const systemRoot = fs.existsSync(path.join(root, "packages/react/src"))
  ? root
  : path.join(root, "node_modules/flow");
const reactDir = path.join(systemRoot, "packages/react/src");
const componentCssFile = path.join(systemRoot, "packages/components/styles/components.css");
const docsRendererFile = path.join(docsAppDir, "component-demo.js");

const componentClassAliases = {
  "button": ["button"],
  "select": ["select-control", "select-listbox", "select-option"],
  "combobox": ["combobox"],
  "country-selector": ["country-selector"],
  "card": ["card"],
  "input": ["field", "field-control", "field-input"],
  "checkbox": ["checkbox"],
  "switch": ["switch"],
  "radio-button": ["radio"],
  "text-area": ["text-area"],
  "icon-button": ["icon-button"],
  "badge": ["badge"],
  "chip": ["chip"],
  "tag": ["tag"],
  "tabs": ["tabs"],
  "tooltip": ["tooltip"],
  "toast": ["toast"],
  "inline-validation": ["inline-validation"],
  "progress-indicator": ["progress"],
  "spinner": ["spinner"],
  "skeleton": ["skeleton"],
  "dialog": ["dialog"],
  "menu": ["menu"],
  "drawer": ["drawer"],
  "accordion": ["accordion"],
  "empty-state": ["empty-state"],
  "table": ["table"],
  "avatar": ["avatar"],
  "slider": ["slider"],
  "stepper": ["stepper"],
  "list": ["list"],
  "kpi-tile": ["kpi-tile"],
  "chart-panel": ["chart-panel"],
  "station-pin": ["station-pin"],
  "route-summary": ["route-summary"],
  "code-input": ["code-input"],
  "phone-input": ["phone-input"],
  "card-number-input": ["card-number-input"],
  "card-expiry-input": ["card-expiry-input"],
  "card-security-code-input": ["card-security-code-input"],
  "date-picker": ["date-picker"],
  "date-range-picker": ["date-range-picker"],
  "segmented-control": ["segmented-control"],
  "popover": ["popover"],
  "floating-action-button": ["fab", "floating-action-button"],
  "card-summary": ["card-summary"],
  "movement-row": ["movement-row"],
  "quick-action": ["quick-action"],
  "biometric-prompt": ["biometric-prompt"],
  "breadcrumbs": ["breadcrumbs"],
  "pagination": ["pagination"],
  "audit-event": ["audit-event"],
  "error-panel": ["error-panel"],
  "tree-view": ["tree-view"],
  "motion-boundary": ["motion-boundary"],
  "animated-moment": ["animated-moment"],
};

const componentTokenAliases = {
  "floating-action-button": ["floating-action-button"],
  "progress-indicator": ["progress-indicator"],
  "radio-button": ["radio-button"],
  "select": ["select"],
};

const componentQualityRequirements = {
  "card": {
    cssSelectors: [
      '.card[data-density="sm"]',
      '.card[data-density="lg"]',
      '.card[data-composition="compact"]',
      '.card[data-composition="media"]',
      '.card[data-composition="stats"]',
      ".card__header",
      ".card__title",
      ".card__actions",
    ],
    reactSnippets: [
      '"data-composition": resolvedComposition',
      'className: "card__header"',
      'className: "card__actions"',
    ],
  },
  "table": {
    cssSelectors: [
      '.table[data-density="sm"]',
      '.table[data-density="lg"]',
      ".table th",
      ".table td",
      ".table__sort",
      ".table__expander",
      ".table__detail",
    ],
    reactSnippets: [
      'flowDensityProps(resolvedDensity)',
      'className: "table__sort"',
      'className: "table__detail"',
    ],
  },
  "code-input": {
    cssSelectors: [
      ".code-input .code-input__control",
      ".code-input .code-input__slots",
      ".code-input .code-input__slot",
      '.code-input[data-density="sm"]',
      '.code-input[data-density="lg"]',
    ],
    reactSnippets: [
      'className: "code-input__control"',
      'className: "code-input__slots"',
      'className: "code-input__slot"',
    ],
  },
  "chart-panel": {
    cssSelectors: [
      '.chart-panel[data-density="sm"]',
      '.chart-panel[data-density="lg"]',
      '.chart-panel[data-variant="donut"] .chart-panel__plot',
      '.chart-panel[data-variant="bullet"] .chart-panel__plot',
      '.chart-panel[data-variant="comparison"] .chart-panel__plot',
      '.chart-panel[data-variant="pareto"] .chart-panel__plot',
      ".chart-panel__tooltip",
      ".chart-panel__echarts",
    ],
    reactSnippets: [
      'data-chart-engine": "echarts-option"',
      'className: "chart-panel__tooltip"',
      'className: "chart-panel__echarts"',
      'className: "chart-panel__option"',
    ],
  },
};

const allowedRawGeometry = [
  /^0(?:px|rem|em)?$/,
  /^1px$/,
  /^100%$/,
  /^50%$/,
  /^auto$/,
  /^none$/,
  /^inherit$/,
  /^currentColor$/,
];

function slugToPascal(slug) {
  return slug
    .split("-")
    .map((part) => part === "kpi" ? "Kpi" : part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ruleMatchesComponent(selector, aliases) {
  return aliases.some((alias) => new RegExp(`\\.${escapeRegExp(alias)}(?=$|[\\s.#>+~:,\\[]|__|--)`).test(selector));
}

function collectCssRules(css, component, aliases) {
  const findings = [];
  const rulePattern = /(?<selector>[^{}]+)\{(?<body>[^{}]+)\}/g;
  let match;
  while ((match = rulePattern.exec(css))) {
    const selector = match.groups.selector.trim();
    if (!ruleMatchesComponent(selector, aliases)) continue;
    findings.push({
      component,
      selector,
      body: match.groups.body,
      line: lineNumber(css, match.index),
    });
  }
  return findings;
}

function isAllowedRaw(value) {
  const normalized = String(value).trim();
  return allowedRawGeometry.some((pattern) => pattern.test(normalized));
}

function collectDeclarationFindings(rule) {
  const hardcodedColors = [];
  const rawGeometry = [];
  const rawTypography = [];
  const localRadiusComposition = [];
  const componentTokenUses = [];
  const compTokenUses = [];
  const foundationTokenUses = [];
  const declarations = [...rule.body.matchAll(/(?<property>[-a-z0-9]+|--[-a-z0-9]+)\s*:\s*(?<value>[^;]+);/g)];
  for (const declaration of declarations) {
    const property = declaration.groups.property;
    const value = declaration.groups.value.trim();
    const line = rule.line + rule.body.slice(0, declaration.index).split("\n").length - 1;
    const item = { selector: rule.selector, line, property, value };

    if (/(?:^|[\s,(])(?:#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i.test(value)) hardcodedColors.push(item);

    if (/radius/.test(property) && /calc\(\s*var\(--sys-radius-[^)]+\)\s*[+*]\s*var\(--sys-space-/i.test(value)) {
      localRadiusComposition.push({
        ...item,
        reason: "Radius is being composed locally from spacing instead of using a Frame/Radius role.",
      });
    }

    if (/^(?:padding|padding-inline|padding-block|padding-inline-start|padding-inline-end|padding-block-start|padding-block-end|gap|row-gap|column-gap|margin|margin-inline|margin-block|width|height|inline-size|block-size|min-inline-size|min-block-size|max-inline-size|max-block-size|inset|top|right|bottom|left|border-radius)$/.test(property)) {
      if (/(^|[\s(,+-])[-+]?\d*\.?\d+(?:px|rem|em)\b/.test(value) && !/var\(--(?:sys|component|comp|density|ref)-/.test(value) && !isAllowedRaw(value)) {
        rawGeometry.push({
          ...item,
          reason: "Geometry bypasses Frame/Spacing/Radius/Density aliases.",
        });
      }
    }

    if (/^(?:font-size|font-weight|line-height|letter-spacing)$/.test(property)) {
      if (/(^|[\s(,+-])[-+]?\d*\.?\d+(?:px|rem|em)\b/.test(value) && !/var\(--(?:sys|component|comp|density|ref)-/.test(value)) {
        rawTypography.push({
          ...item,
          reason: "Typography bypasses Voice/Typography aliases.",
        });
      }
    }

    for (const token of value.matchAll(/var\(\s*(--(?:component|comp)-[a-z0-9-]+)/g)) {
      componentTokenUses.push(token[1]);
      if (token[1].startsWith("--comp-")) compTokenUses.push(token[1]);
    }
    for (const token of value.matchAll(/var\(\s*(--sys-[a-z0-9-]+)/g)) foundationTokenUses.push(token[1]);
  }

  return {
    hardcodedColors,
    rawGeometry,
    rawTypography,
    localRadiusComposition,
    componentTokenUses,
    compTokenUses,
    foundationTokenUses,
  };
}

function collectDocsFindings(component) {
  const findings = [];
  const suspiciousGrids = [];
  if (!fs.existsSync(docsAppDir)) return { legacyDemoSelectors: findings, narrowDemoGrids: suspiciousGrids, audited: false };
  const docsFiles = docsStyleModuleFiles.filter((file) => fs.existsSync(file));
  const componentKey = component.replace(/-/g, "[ -]?");
  const componentPattern = new RegExp(componentKey, "i");

  for (const file of docsFiles) {
    const source = read(file);
    const basename = path.basename(file).replace(/_/g, "-");
    if (!componentPattern.test(basename)) continue;

    let match;
    const legacyPattern = /\.([a-z0-9-]*demo[a-z0-9-]*)\b/g;
    while ((match = legacyPattern.exec(source))) {
      const selector = match[1];
      if (selector.startsWith("docs-")) continue;
      const isDirectComponentDemo = selector === `${component}-demo` || selector === `${component}-doc-demo`;
      if (isDirectComponentDemo) {
        findings.push({
          file: rel(file),
          line: lineNumber(source, match.index),
          selector: `.${selector}`,
          reason: "Docs demo selector may be legacy; React demos should hang layout from docs-demo-layout/data attributes or package classes.",
        });
      }
    }

    const narrowGridPattern = /grid-template-columns\s*:\s*repeat\([^;]*minmax\(min\(100%,\s*(?<size>1[0-7](?:\.\d+)?rem)\)/g;
    while ((match = narrowGridPattern.exec(source))) {
      suspiciousGrids.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value: match.groups.size,
        reason: "Demo grid is narrower than the component review baseline and may hide density/layout issues.",
      });
    }
  }

  return { legacyDemoSelectors: findings, narrowDemoGrids: suspiciousGrids, audited: true };
}

function hasSelector(css, selector) {
  return css.includes(selector);
}

function createReport() {
  const css = readIfExists(componentCssFile);
  const docsRenderer = readIfExists(docsRendererFile);
  const components = goldComponents.map((component) => {
    const pascal = slugToPascal(component);
    const reactFile = path.join(reactDir, `${pascal}.js`);
    const dtsFile = path.join(reactDir, `${pascal}.d.ts`);
    const aliases = componentClassAliases[component] ?? [component];
    const rules = collectCssRules(css, component, aliases);
    const declarationFindings = rules.map(collectDeclarationFindings);
    const flatten = (key) => declarationFindings.flatMap((finding) => finding[key]);
    const docsFindings = collectDocsFindings(component);
    const reactSource = readIfExists(reactFile);
    const dtsSource = readIfExists(dtsFile);
    const hasReactFile = fs.existsSync(reactFile);
    const hasDtsFile = fs.existsSync(dtsFile);
    const hasForwardRef = /forwardRef\(/.test(reactSource);
    const hasPlatformContract = /platformContract\s*=/.test(reactSource);
    const hasDocsDemoRenderer = docsFindings.audited && fs.existsSync(docsRendererFile);
    const hasDemoIsland = hasDocsDemoRenderer
      ? docsRenderer.includes(`data-react-component="${component}"`) || docsRenderer.includes(`reactIsland("${component}"`)
      : null;
    const componentTokenUses = [...new Set(flatten("componentTokenUses"))].sort();
    const compTokenUses = [...new Set(flatten("compTokenUses"))].sort();
    const foundationTokenUses = [...new Set(flatten("foundationTokenUses"))].sort();
    const tokenAliases = componentTokenAliases[component] ?? [component];
    const qualityRequirements = componentQualityRequirements[component];
    const componentTokenFamilyUses = compTokenUses.filter((token) => (
      tokenAliases.some((alias) => token === `--comp-${alias}` || token.startsWith(`--comp-${alias}-`))
    ));
    const blockers = [];
    const reviews = [];

    if (!hasReactFile) blockers.push("Missing React component source.");
    if (!hasDtsFile) blockers.push("Missing generated React .d.ts contract.");
    if (hasDocsDemoRenderer && !hasDemoIsland) blockers.push("Docs demo does not mount this component as a React island.");
    if (hasReactFile && !hasForwardRef) reviews.push("React component should expose a stable ref contract.");
    if (hasReactFile && !hasPlatformContract) reviews.push("React component does not declare its platform contract.");
    if (!rules.length) reviews.push("No component CSS rules matched this component; it may be piggybacking on another component or missing explicit styling.");
    if (!componentTokenUses.length && !foundationTokenUses.length) reviews.push("Matched CSS rules do not reference Flow component/foundation tokens.");
    if (!componentTokenFamilyUses.length) reviews.push(`Matched CSS rules do not consume this component's own token family: ${tokenAliases.map((alias) => `--comp-${alias}-*`).join(" or ")}.`);

    const hardcodedColors = flatten("hardcodedColors");
    const rawGeometry = flatten("rawGeometry");
    const rawTypography = flatten("rawTypography");
    const localRadiusComposition = flatten("localRadiusComposition");
    if (hardcodedColors.length) reviews.push("Hardcoded color values found in component CSS.");
    if (rawGeometry.length) reviews.push("Raw geometry lengths found outside Flow aliases.");
    if (rawTypography.length) reviews.push("Raw typography lengths found outside Flow aliases.");
    if (localRadiusComposition.length) reviews.push("Local radius composition found instead of a Frame/Radius role.");
    if (docsFindings.legacyDemoSelectors.length) reviews.push("Docs contains legacy-looking demo selectors for this component.");
    if (docsFindings.narrowDemoGrids.length) reviews.push("Docs demo grid may be too narrow for reliable density/layout QA.");
    if (qualityRequirements) {
      const missingSelectors = qualityRequirements.cssSelectors.filter((selector) => !hasSelector(css, selector));
      const missingReactSnippets = qualityRequirements.reactSnippets.filter((snippet) => !reactSource.includes(snippet));
      if (missingSelectors.length) reviews.push(`High-risk visual cascade requirement missing CSS selectors: ${missingSelectors.join(", ")}.`);
      if (missingReactSnippets.length) reviews.push(`High-risk visual cascade requirement missing React slots/contracts: ${missingReactSnippets.join(", ")}.`);
    }

    return {
      id: component,
      react: {
        file: rel(reactFile),
        exists: hasReactFile,
        dts: hasDtsFile,
        forwardRef: hasForwardRef,
        platformContract: hasPlatformContract,
      },
      docs: {
        audited: docsFindings.audited,
        reactIsland: hasDemoIsland,
        legacyDemoSelectors: docsFindings.legacyDemoSelectors,
        narrowDemoGrids: docsFindings.narrowDemoGrids,
      },
      css: {
        aliases,
        matchedRules: rules.length,
        tokenAliases,
        componentTokenUses,
        compTokenUses,
        componentTokenFamilyUses,
        foundationTokenUses,
        hardcodedColors,
        rawGeometry,
        rawTypography,
        localRadiusComposition,
      },
      status: blockers.length ? "fail" : reviews.length ? "review" : "pass",
      blockers,
      reviews,
    };
  });

  const blockers = components.flatMap((component) => component.blockers.map((message) => `${component.id}: ${message}`));
  const reviewItems = components.filter((component) => component.status === "review").length;
  const failItems = components.filter((component) => component.status === "fail").length;
  const visualCascadeDebt = reviewItems + failItems;
  const report = {
    status: blockers.length ? "fail" : reviewItems ? "review" : "pass",
    audit: "component visual cascade",
    principle: "Every component must render through the React package, consume Flow visual roles through CSS/tokens, and use docs demos that expose layout/density problems instead of hiding them behind local styling. The actionable debt metric is visualCascadeDebt.",
    inventory: {
      components: components.length,
      pass: components.filter((component) => component.status === "pass").length,
      review: reviewItems,
      fail: failItems,
      visualCascadeDebt,
    },
    blockers,
    components,
  };
  return report;
}

function checkComponentVisualCascade() {
  const report = createReport();
  if (report.status === "pass") return;
  const reviewSummary = report.components
    .filter((component) => component.status === "review")
    .map((component) => `${component.id}: ${component.reviews[0]}`)
    .slice(0, 12)
    .join("; ");
  for (const blocker of report.blockers) add("errors", componentCssFile, 1, blocker);
  if (!report.blockers.length) add("errors", componentCssFile, 1, `Component visual cascade audit ${report.status}: ${reviewSummary}`);
}

function toMarkdown(report) {
  const lines = [
    "# Component Visual Cascade Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Components audited: ${report.inventory.components}`,
    `- Pass: ${report.inventory.pass}`,
    `- Review: ${report.inventory.review}`,
    `- Fail: ${report.inventory.fail}`,
    `- Visual cascade debt: ${report.inventory.visualCascadeDebt}`,
    "",
    "## Blockers",
    "",
    ...(report.blockers.length ? report.blockers.map((item) => `- ${item}`) : ["- None"]),
    "",
    "## Review Queue",
    "",
  ];

  const reviewComponents = report.components.filter((component) => component.status === "review");
  if (!reviewComponents.length) {
    lines.push("- None");
  } else {
    lines.push("| Component | Findings | React | CSS Rules |");
    lines.push("| --- | --- | --- | ---: |");
    for (const component of reviewComponents) {
      lines.push(`| ${component.id} | ${component.reviews.join("<br>")} | ${component.react.exists ? "yes" : "no"} | ${component.css.matchedRules} |`);
    }
  }

  lines.push("");
  lines.push("## High Signal Findings");
  lines.push("");
  for (const component of report.components) {
    const highSignal = [
      ...component.css.localRadiusComposition.slice(0, 2).map((item) => `${item.property}: \`${item.value}\` (${item.line})`),
      ...component.css.rawGeometry.slice(0, 2).map((item) => `${item.property}: \`${item.value}\` (${item.line})`),
      ...component.docs.legacyDemoSelectors.slice(0, 2).map((item) => `${item.file}:${item.line} ${item.selector}`),
    ];
    if (!highSignal.length) continue;
    lines.push(`- ${component.id}: ${highSignal.join("; ")}`);
  }
  if (!report.components.some((component) => component.css.localRadiusComposition.length || component.css.rawGeometry.length || component.docs.legacyDemoSelectors.length)) {
    lines.push("- None");
  }
  lines.push("");
  return `${lines.join("\n")}`;
}

function readExisting(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function main() {
  const report = createReport();
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = `${toMarkdown(report)}\n`;

  if (checkMode) {
    if (readExisting(jsonOutput) !== json || readExisting(markdownOutput) !== markdown) {
      console.error("Component visual cascade report is stale. Run: node packages/audit/scripts/report-component-visual-cascade.js");
      process.exit(1);
    }
    if (report.status !== "pass") {
      const reviewSummary = report.components
        .filter((component) => component.status === "review")
        .map((component) => `${component.id}: ${component.reviews[0]}`)
        .slice(0, 12)
        .join("; ");
      console.error(`Component visual cascade audit ${report.status}: ${report.blockers.join("; ") || reviewSummary}`);
      process.exit(1);
    }
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, markdown);
  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    pass: report.inventory.pass,
    review: report.inventory.review,
    fail: report.inventory.fail,
    visualCascadeDebt: report.inventory.visualCascadeDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exit(1);
}

if (require.main === module) main();

module.exports = { checkComponentVisualCascade, createReport };
