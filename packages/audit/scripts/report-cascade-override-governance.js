#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { add, lineNumber } = require("./audit-context.js");

const root = process.cwd();
const outputDir = path.join(root, "docs/audits");
const flowCoreOnly = process.argv.includes("--flow-core-only");
const ownershipFile = path.join(root, "packages/audit/contracts/foundation-primitive-ownership.json");
const ownership = JSON.parse(fs.readFileSync(ownershipFile, "utf8"));
const ownershipDomains = [...ownership.foundationDomains, ...ownership.primitiveDomains];
const domainById = new Map(ownershipDomains.map((domain) => [domain.id, domain]));
const foundationDomainIds = new Set(ownership.foundationDomains.map((domain) => domain.id));
const primitiveDomainIds = new Set(ownership.primitiveDomains.map((domain) => domain.id));
const componentFamilyDomains = [
  ["field-control", /(?:^|[-_\s])(field|input|select|combobox|placeholder|helper|affix)(?:[-_\s]|$)/],
  ["choice-control", /(?:^|[-_\s])(checkbox|radio|switch|choice)(?:[-_\s]|$)/],
  ["option-listbox", /(?:^|[-_\s])(option|listbox|menu-item)(?:[-_\s]|$)/],
  ["action-appearance", /(?:^|[-_\s])(action|button|fab|floating-action-button|quick-action|icon-button)(?:[-_\s]|$)/],
  ["content-surface", /(?:^|[-_\s])(surface|card|section|panel)(?:[-_\s]|$)/],
  ["asset-rendering", /(?:^|[-_\s])(illustration|animation-asset|chart|map|flag|library-source)(?:[-_\s]|$)/],
];
const propertyDomains = [
  ["motion", /(?:transition|animation|duration|ease|transform|scale|motion)/],
  ["elevation-depth", /(?:shadow|depth|elevation|halo)/],
  ["radius", /(?:radius|borderradius|rounded)/],
  ["focus", /(?:focus|ring)/],
  ["iconography", /(?:icon|symbol|glyph|check|marker)/],
  ["color-theme", /(?:color|backgroundcolor|bg|fg|text|border|danger|warning|success|info|action|energy|theme|contrast)/],
  ["typography", /(?:voice|font|fontsize|fontweight|fontfamily|lineheight|line-height|letter|label|textdecoration)/],
  ["spacing", /(?:space|spacing|gap|padding|margin|inset)/],
  ["frame-control-geometry", /(?:frame|control|(?:inline|block)-?size|height|width)/],
  ["state", /(?:state|disabled|loading|selected|active|hover|pressed|error|valid)/],
  ["overlay-layer", /(?:overlay|layer|popover|dialog|drawer|listbox|menu|z-index)/],
  ["surface", /(?:surface|panel|card|canvas)/],
  ["density", /(?:density)/],
  ["breakpoints-responsive", /(?:breakpoint|grid|responsive|columns|gutter)/],
];
const foundationPolicyRules = [
  {
    domain: "color-theme",
    property: /^(?:color|background|background-color|border-color|outline-color|fill|stroke|caret-color)$/,
    raw: /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(?:white|black|red|blue|green|yellow|orange|purple|gray|grey|transparent)\b|(?:linear|radial)-gradient\(/i,
  },
  {
    domain: "spacing",
    property: /^(?:gap|row-gap|column-gap|padding|padding-inline|padding-block|padding-top|padding-right|padding-bottom|padding-left|margin|margin-inline|margin-block|margin-top|margin-right|margin-bottom|margin-left|inset|inset-inline|inset-block|top|right|bottom|left)$/,
    raw: /\b(?!0(?:px|rem|em)?\b)\d+(?:\.\d+)?(?:px|rem|em)\b/,
  },
  {
    domain: "frame-control-geometry",
    property: /^(?:width|height|min-width|min-height|max-width|max-height|inline-size|block-size|min-inline-size|min-block-size|max-inline-size|max-block-size)$/,
    raw: /\b(?!0(?:px|rem|em)?\b)\d+(?:\.\d+)?(?:px|rem|em)\b/,
  },
  {
    domain: "radius",
    property: /^(?:border-radius|border-top-left-radius|border-top-right-radius|border-bottom-right-radius|border-bottom-left-radius)$/,
    raw: /\b(?!0(?:px|rem|em)?\b)\d+(?:\.\d+)?(?:px|rem|em)\b/,
  },
  {
    domain: "elevation-depth",
    property: /^(?:box-shadow|text-shadow|filter)$/,
    raw: /\b\d+(?:\.\d+)?(?:px|rem|em)\b|drop-shadow\(|rgba?\(|#[0-9a-f]{3,8}\b/i,
  },
  {
    domain: "motion",
    property: /^(?:transition|transition-duration|transition-timing-function|animation|animation-duration|animation-timing-function|transform)$/,
    raw: /\b\d+(?:\.\d+)?m?s\b|cubic-bezier\(|(?:translate|scale|rotate)(?:X|Y)?\(/i,
  },
  {
    domain: "typography",
    property: /^(?:font|font-size|font-family|font-weight|line-height|letter-spacing|text-decoration|text-transform)$/,
    raw: /\b\d+(?:\.\d+)?(?:px|rem|em)\b|\b(?:system-ui|sans-serif|serif|uppercase|lowercase|capitalize|none|bold|normal|[4567]00)\b/i,
  },
  {
    domain: "focus",
    property: /^(?:outline|outline-width|outline-color|outline-offset)$/,
    raw: /\b\d+(?:\.\d+)?px\b|#[0-9a-f]{3,8}\b|rgba?\(|\b(?:none|0)\b/i,
  },
  {
    domain: "overlay-layer",
    property: /^z-index$/,
    raw: /\b\d+\b/,
  },
];

const flowCoreScanRoots = [
  "style-dictionary.config.mjs",
  "packages/tokens/src",
  "packages/tokens/styles",
  "packages/components/src",
  "packages/components/styles",
  "packages/react/src",
  "packages/specs",
  "packages/content",
].map((entry) => path.resolve(root, entry));
const allScanRoots = [
  ...flowCoreScanRoots,
  "docs",
  "../FlowDocs/apps/docs",
].map((entry) => path.resolve(root, entry));

const allowedExtensions = new Set([".css", ".js", ".mjs", ".ts", ".tsx", ".json", ".md", ".html"]);
const generatedDirs = [
  `${path.sep}docs${path.sep}audits${path.sep}`,
  `${path.sep}packages${path.sep}react${path.sep}dist${path.sep}`,
  `${path.sep}apps${path.sep}docs${path.sep}generated${path.sep}`,
  `${path.sep}FlowDocs${path.sep}apps${path.sep}docs${path.sep}generated${path.sep}`,
  `${path.sep}packages${path.sep}tokens${path.sep}dist${path.sep}`,
  `${path.sep}packages${path.sep}tokens${path.sep}src${path.sep}generated${path.sep}`,
];

function rel(file) {
  const relative = path.relative(root, file);
  return relative.startsWith("..") ? relative : relative.replaceAll(path.sep, "/");
}

function exists(file) {
  return fs.existsSync(file);
}

function listFiles(entry) {
  if (!exists(entry)) return [];
  if (isGenerated(entry)) return [];
  const stat = fs.statSync(entry);
  if (stat.isFile()) return allowedExtensions.has(path.extname(entry)) ? [entry] : [];
  const out = [];
  for (const child of fs.readdirSync(entry)) {
    if (child === "node_modules" || child === ".git" || child === "vendor") continue;
    out.push(...listFiles(path.join(entry, child)));
  }
  return out;
}

function layerFor(file) {
  const relative = rel(file);
  if (relative === "style-dictionary.config.mjs") return "token-generator";
  if (relative.startsWith("packages/tokens/src/")) return "token-source";
  if (relative.startsWith("packages/tokens/styles/")) return "token-output";
  if (relative.startsWith("packages/components/src/primitives/")) return "primitive-source";
  if (relative.startsWith("packages/components/src/")) return "component-source";
  if (relative.startsWith("packages/components/styles/")) return "component-css";
  if (relative.startsWith("packages/react/src/patterns/")) return "pattern-source";
  if (relative.startsWith("packages/react/src/")) return "react-component-source";
  if (relative.startsWith("packages/content/")) return "content";
  if (relative.startsWith("packages/specs/")) return "spec";
  if (relative.startsWith("docs/")) return "system-docs";
  if (relative.includes("FlowDocs/apps/docs")) return "flowdocs";
  return "unknown";
}

function isGenerated(file) {
  return generatedDirs.some((dir) => file.includes(dir));
}

function isGeneratedSource(source) {
  return /@generated|Do not edit this compatibility runtime directly/.test(source.slice(0, 260));
}

function isEmailChannelInlinePattern(file, source) {
  const relative = rel(file);
  return relative.startsWith("packages/react/src/patterns/EmailTemplateLayout.")
    && /emailTokenValues|sys-email-|EmailTemplateLayout/.test(source);
}

function isAllowedDynamicStyle(styleContext) {
  const bodyMatch = styleContext.match(/style\s*:\s*\{([\s\S]*?)(?:\}\s*(?:satisfies|as|,|\)|$))/);
  const body = bodyMatch?.[1] ?? styleContext;
  const entries = [...body.matchAll(/(["']?)([A-Za-z_][\w-]*|--[\w-]+)\1\s*:/g)].map((match) => match[2]);
  return entries.length > 0 && entries.every((key) => key.startsWith("--"));
}

function styleMutationProperty(text) {
  const setProperty = text.match(/\.style\.setProperty\(\s*["'`]([^"'`]+)["'`]/);
  if (setProperty) return setProperty[1];
  const directProperty = text.match(/\.style\.([A-Za-z][\w-]*)\s*=/);
  if (directProperty) return directProperty[1];
  if (/setAttribute\(\s*["'`]style["'`]/.test(text)) return "style";
  return null;
}

function selectorContext(selector) {
  const contexts = [];
  if (/\bdata-theme\b|data-contrast\b|prefers-color-scheme/.test(selector)) contexts.push("theme");
  if (/\bdata-density\b|data-density-context\b|density-/.test(selector)) contexts.push("density");
  if (/\bdata-state\b|:hover|:active|:focus|:disabled|aria-pressed/.test(selector)) contexts.push("state");
  if (/\bdata-variant\b|--[a-z0-9-]+(?:--|__)/.test(selector)) contexts.push("variant");
  if (/\bdata-tone\b|\bdata-intent\b/.test(selector)) contexts.push("tone-intent");
  if (/^@media/.test(selector.trim())) contexts.push("media");
  return contexts.length ? contexts : ["base"];
}

function variableScope(name) {
  if (name.startsWith("--ref-")) return "reference";
  if (name.startsWith("--sys-")) return "system";
  if (name.startsWith("--component-")) return "component-role";
  if (name.startsWith("--comp-")) return "component-local";
  if (name.startsWith("--docs-") || name.startsWith("--flowdocs-")) return "docs-local";
  return "custom";
}

function domainKind(domain) {
  if (foundationDomainIds.has(domain)) return "foundation";
  if (primitiveDomainIds.has(domain)) return "primitive";
  return "unknown";
}

function domainFor({ variable = "", selector = "", source = "" }) {
  const haystack = [variable, selector, source].join(" ").toLowerCase().replace(/[A-Z]/g, (char) => char.toLowerCase());
  const familyMatch = variable.startsWith("--comp-") || /\.[a-z0-9-]+(__|--)/.test(selector) || /\bclassName\b|\bclass=/.test(source)
    ? componentFamilyDomains.find(([, pattern]) => pattern.test(haystack))
    : null;
  const propertyMatch = propertyDomains.find(([, pattern]) => pattern.test(haystack));
  const domain = domainById.get((familyMatch ?? propertyMatch)?.[0])
    ?? ownershipDomains.find((entry) => entry.patterns.some((pattern) => haystack.includes(pattern)));
  return domain
    ? { domain: domain.id, domainKind: domainKind(domain.id), owner: domain.owner }
    : { domain: "unknown", domainKind: "unknown", owner: "unassigned" };
}

function classifyCssDefinition({ file, selector, variable, line }) {
  const layer = layerFor(file);
  const contexts = selectorContext(selector);
  const scope = variableScope(variable);
  const generated = isGenerated(file);
  const fileRel = rel(file);
  const allowedTokenThemeContext = layer === "token-generator"
    || (layer === "token-output" && fileRel === "packages/tokens/styles/token-contexts.css");
  const blockingSystemLayer = ["component-css", "token-source", "token-generator", "token-output"].includes(layer);

  if (generated) {
    return {
      severity: "info",
      reason: "Generated output mirrors source decisions; fix the source if this override is wrong.",
    };
  }

  if (contexts.includes("theme") && ["reference", "system", "component-role"].includes(scope) && !allowedTokenThemeContext) {
    return {
      severity: blockingSystemLayer ? "error" : "warning",
      reason: "Theme-context reference/system/component-role overrides must be emitted by Style Dictionary token contexts.",
    };
  }

  if (["reference", "system"].includes(scope) && !["token-source", "token-generator", "token-output"].includes(layer)) {
    return {
      severity: blockingSystemLayer ? "error" : "warning",
      reason: "Reference/system token overrides outside token layers break cascade ownership.",
    };
  }

  if (contexts.includes("theme") && scope === "component-local" && layer === "component-css") {
    return {
      severity: "warning",
      reason: "Component-local dark overrides are visible debt unless backed by a family-level primitive contract.",
    };
  }

  if (contexts.includes("density") && ["reference", "system", "component-role"].includes(scope) && !allowedTokenThemeContext && layer !== "component-css") {
    return {
      severity: "warning",
      reason: "Density-context role overrides outside token/component CSS need explicit primitive ownership.",
    };
  }

  return {
    severity: "info",
    reason: "Contextual variable definition captured for cascade review.",
  };
}

function classifyFoundationPolicy({ file, selector, property, value }) {
  const layer = layerFor(file);
  const generated = isGenerated(file);
  const fileRel = rel(file);
  const tokenOwnedLayer = layer === "token-source"
    || layer === "token-generator"
    || layer === "token-output";
  const localPolicyLayer = [
    "component-css",
    "component-source",
    "primitive-source",
    "react-component-source",
    "pattern-source",
    "flowdocs",
    "content",
    "system-docs",
  ].includes(layer);
  const normalizedProperty = property.trim().toLowerCase();
  const normalizedValue = value.trim();
  const normalizedSelector = selector.trim().toLowerCase();
  const rule = foundationPolicyRules.find((entry) => entry.property.test(normalizedProperty) && entry.raw.test(normalizedValue));

  if (!rule) return null;
  if (generated) return null;
  if (tokenOwnedLayer) return null;
  if (normalizedSelector.startsWith("@font-face")) return null;
  if (/var\(--(?:ref|sys|component|comp|docs|flowdocs)-/.test(normalizedValue)) return null;
  if (normalizedProperty === "transform" && /\b(?:none|translateZ\(0\))\b/.test(normalizedValue)) return null;
  if (
    normalizedProperty === "transform"
    && /\btranslate(?:x|y)?\(/i.test(normalizedValue)
    && !/(?:@keyframes|:hover|:active|:focus|:focus-visible|data-state|aria-expanded|aria-pressed|is-open|is-active|nav-open)/i.test(selector)
  ) {
    return null;
  }
  if (normalizedProperty === "filter" && normalizedValue === "none") return null;
  if (fileRel.endsWith(".md") || fileRel.endsWith(".json")) return null;

  const domain = domainById.get(rule.domain);
  return {
    severity: localPolicyLayer ? "warning" : "info",
    domain: rule.domain,
    domainKind: domainKind(rule.domain),
    owner: domain?.owner ?? "unassigned",
    reason: `${domain?.label ?? rule.domain} policy is expressed as a raw CSS value outside its owning foundation/primitive contract.`,
  };
}

function scanCssFile(file, source) {
  const findings = [];
  const blockPattern = /([^{}]+)\{([^{}]*)\}/g;
  for (const match of source.matchAll(blockPattern)) {
    const selector = match[1].trim().replace(/\s+/g, " ");
    const body = match[2];
    const contextualSelector = /\bdata-|:hover|:active|:focus|:disabled|@media|--[a-z0-9-]+(?:--|__)/.test(selector);
    if (contextualSelector) {
      for (const declaration of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
        const variable = declaration[1];
        const line = lineNumber(source, match.index + declaration.index);
        const classification = classifyCssDefinition({ file, selector, variable, line });
        findings.push({
          type: "css-variable-override",
          severity: classification.severity,
          layer: layerFor(file),
          file: rel(file),
          line,
          selector,
          contexts: selectorContext(selector),
          variable,
          scope: variableScope(variable),
          ...domainFor({ variable, selector }),
          reason: classification.reason,
        });
      }
    }
    for (const declaration of body.matchAll(/([-\w]+)\s*:\s*([^;]+);/g)) {
      const property = declaration[1];
      if (property.startsWith("--")) continue;
      const value = declaration[2];
      const classification = classifyFoundationPolicy({ file, selector, property, value });
      if (!classification) continue;
      findings.push({
        type: "foundation-policy-declaration",
        severity: classification.severity,
        layer: layerFor(file),
        file: rel(file),
        line: lineNumber(source, match.index + declaration.index),
        selector,
        contexts: selectorContext(selector),
        property,
        value: value.trim(),
        domain: classification.domain,
        domainKind: classification.domainKind,
        owner: classification.owner,
        reason: classification.reason,
      });
    }
  }
  return findings;
}

function scanSourceFile(file, source) {
  const findings = [];
  const layer = layerFor(file);
  const generated = isGenerated(file) || isGeneratedSource(source);
  const emailChannelInlinePattern = isEmailChannelInlinePattern(file, source);
  const lines = source.split("\n");

  lines.forEach((text, index) => {
    const line = index + 1;
    if (/(?:^|[^\w-])style\s*[:=]\s*\{/.test(text) || /(?:^|[^\w-])style=\{/.test(text) || /(?:^|[^\w-])style="/.test(text)) {
      const styleContext = lines.slice(index, index + 8).join(" ");
      const allowedDynamicStyle = isAllowedDynamicStyle(styleContext);
      const severity = generated || emailChannelInlinePattern || allowedDynamicStyle
        ? "info"
        : ["react-component-source", "component-source", "primitive-source"].includes(layer)
          ? "error"
          : ["pattern-source", "flowdocs"].includes(layer)
            ? "warning"
            : "info";
      findings.push({
        type: "inline-style",
        severity,
        layer,
        file: rel(file),
        line,
        ...domainFor({ source: styleContext }),
        reason: generated
          ? "Generated inline style mirrors source; review source ownership if it affects cascade."
          : emailChannelInlinePattern
            ? "Email channel markup requires email-safe inline styles backed by generated sys-email tokens."
            : allowedDynamicStyle
              ? "Inline style is limited to dynamic CSS custom properties that feed governed component CSS."
              : "Inline style defines visual policy outside CSS/tokens and bypasses the Flow cascade.",
      });
    }
    const mutatedStyleProperty = styleMutationProperty(text);
    if (mutatedStyleProperty) {
      const customProperty = mutatedStyleProperty.startsWith("--");
      const severity = generated || customProperty
        ? "info"
        : ["react-component-source", "component-source", "primitive-source"].includes(layer)
          ? "error"
          : ["pattern-source", "flowdocs"].includes(layer)
            ? "warning"
            : "info";
      findings.push({
        type: "style-mutation",
        severity,
        layer,
        file: rel(file),
        line,
        property: mutatedStyleProperty,
        ...domainFor({ variable: customProperty ? mutatedStyleProperty : "", source: text }),
        reason: generated
          ? "Generated style mutation mirrors source; review source ownership if it affects cascade."
          : customProperty
            ? "Style mutation is limited to dynamic CSS custom properties that feed governed component CSS."
            : "Style mutation writes visual policy outside CSS/tokens and bypasses the Flow cascade.",
      });
    }
    for (const declaration of text.matchAll(/(["'`])(--(?:ref|sys|component|comp|docs|flowdocs)-[\w-]+)\s*:/g)) {
      const variable = declaration[2];
      const scope = variableScope(variable);
      const blocksCascade = ["reference", "system"].includes(scope)
        && ["component-source", "primitive-source", "component-css", "react-component-source"].includes(layer);
      const severity = generated
        ? "info"
        : blocksCascade
          ? "error"
          : ["component-role", "component-local"].includes(scope) && ["component-source", "primitive-source", "react-component-source", "pattern-source", "flowdocs"].includes(layer)
            ? "warning"
            : "info";
      findings.push({
        type: "source-variable-override",
        severity,
        layer,
        file: rel(file),
        line,
        variable,
        scope,
        ...domainFor({ variable, source: text }),
        reason: generated
          ? "Generated source mirrors source decisions."
          : "Source-defined custom properties must not own cascade policy outside token/component CSS.",
      });
    }
  });

  return findings;
}

function createReport(options = {}) {
  const scope = options.scope ?? (flowCoreOnly ? "flow-core" : "all");
  const scanRoots = scope === "flow-core" ? flowCoreScanRoots : allScanRoots;
  const files = [...new Set(scanRoots.flatMap(listFiles))].sort();
  const findings = [];
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    findings.push(...(path.extname(file) === ".css" ? scanCssFile(file, source) : scanSourceFile(file, source)));
  }

  const errors = findings.filter((finding) => finding.severity === "error");
  const warnings = findings.filter((finding) => finding.severity === "warning");
  const byLayer = {};
  const byType = {};
  const byDomain = {};
  const byDomainKind = {};
  const debtByDomain = {};
  const debtByDomainKind = {};
  const debtByOwner = {};
  const debtByLayer = {};
  for (const finding of findings) {
    byLayer[finding.layer] = (byLayer[finding.layer] ?? 0) + 1;
    byType[finding.type] = (byType[finding.type] ?? 0) + 1;
    byDomain[finding.domain] = (byDomain[finding.domain] ?? 0) + 1;
    byDomainKind[finding.domainKind] = (byDomainKind[finding.domainKind] ?? 0) + 1;
    if (finding.severity !== "info") {
      debtByDomain[finding.domain] = (debtByDomain[finding.domain] ?? 0) + 1;
      debtByDomainKind[finding.domainKind] = (debtByDomainKind[finding.domainKind] ?? 0) + 1;
      debtByOwner[finding.owner] = (debtByOwner[finding.owner] ?? 0) + 1;
      debtByLayer[finding.layer] = (debtByLayer[finding.layer] ?? 0) + 1;
    }
  }
  const unassignedDebt = findings.filter((finding) => finding.severity !== "info" && finding.domain === "unknown");
  const remediationQueue = Object.values(findings
    .filter((finding) => finding.severity !== "info")
    .reduce((acc, finding) => {
      const key = [finding.domainKind, finding.domain, finding.owner, finding.layer, finding.type].join("|");
      acc[key] ??= {
        domainKind: finding.domainKind,
        domain: finding.domain,
        owner: finding.owner,
        layer: finding.layer,
        type: finding.type,
        findings: 0,
        firstLocation: `${finding.file}:${finding.line}`,
      };
      acc[key].findings += 1;
      return acc;
    }, {}))
    .sort((a, b) => b.findings - a.findings || a.domain.localeCompare(b.domain))
    .slice(0, 16);

  return {
    schemaVersion: "cascade-override-governance@1",
    scope,
    status: errors.length || unassignedDebt.length ? "fail" : warnings.length ? "warning" : "pass",
    principle: scope === "flow-core"
      ? "Flow core cascade overrides must be owned by the DS layer that defines the contract: tokens/theme in Style Dictionary token contexts, foundations/primitives in token or primitive sources, component-local aliases in component CSS, and React source only through dynamic CSS custom properties."
      : "Cascade overrides must be owned by the layer that defines the contract: tokens/theme in Style Dictionary token contexts, foundations/primitives in token or primitive sources, component-local aliases in component CSS, and docs/templates only through public Flow APIs.",
    inventory: {
      filesScanned: files.length,
      findings: findings.length,
      overrideDebt: errors.length + warnings.length,
      errors: errors.length,
      warnings: warnings.length,
      byLayer,
      byType,
      byDomain,
      byDomainKind,
      debtByDomain,
      debtByDomainKind,
      debtByOwner,
      debtByLayer,
      unassignedDebt: unassignedDebt.length,
    },
    ownership: {
      file: path.relative(root, ownershipFile),
      foundationDomains: ownership.foundationDomains.map(({ id, owner }) => ({ id, owner })),
      primitiveDomains: ownership.primitiveDomains.map(({ id, owner }) => ({ id, owner })),
    },
    remediationQueue,
    findings,
  };
}

function renderMarkdown(report) {
  const domainRows = Object.entries(report.inventory.debtByDomain)
    .sort((a, b) => b[1] - a[1])
    .map(([domain, count]) => `| ${domain} | ${count} |`);
  const ownerRows = Object.entries(report.inventory.debtByOwner)
    .sort((a, b) => b[1] - a[1])
    .map(([owner, count]) => `| ${owner} | ${count} |`);
  const kindRows = Object.entries(report.inventory.debtByDomainKind)
    .sort((a, b) => b[1] - a[1])
    .map(([kind, count]) => `| ${kind} | ${count} |`);
  const layerRows = Object.entries(report.inventory.debtByLayer)
    .sort((a, b) => b[1] - a[1])
    .map(([layer, count]) => `| ${layer} | ${count} |`);
  const remediationRows = report.remediationQueue
    .map((item, index) => `| ${index + 1} | ${item.domainKind} | ${item.domain} | ${item.owner} | ${item.layer} | ${item.type} | ${item.findings} | ${item.firstLocation} |`);
  const criticalRows = report.findings
    .filter((finding) => finding.severity !== "info")
    .slice(0, 80)
    .map((finding) => `| ${finding.severity} | ${finding.domainKind} | ${finding.domain} | ${finding.layer} | ${finding.file}:${finding.line} | ${finding.type} | ${finding.variable ?? finding.property ?? ""} | ${finding.reason} |`);
  return [
    "# Cascade Override Governance",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Files scanned: ${report.inventory.filesScanned}`,
    `- Findings: ${report.inventory.findings}`,
    `- Override debt: ${report.inventory.overrideDebt}`,
    `- Errors: ${report.inventory.errors}`,
    `- Warnings: ${report.inventory.warnings}`,
    `- Unassigned debt: ${report.inventory.unassignedDebt}`,
    `- Ownership map: ${report.ownership.file}`,
    "",
    "## Debt By Domain Kind",
    "",
    kindRows.length
      ? ["| Kind | Findings |", "| --- | ---: |", ...kindRows].join("\n")
      : "- None",
    "",
    "## Debt By Layer",
    "",
    layerRows.length
      ? ["| Layer | Findings |", "| --- | ---: |", ...layerRows].join("\n")
      : "- None",
    "",
    "## Debt By Domain",
    "",
    domainRows.length
      ? ["| Domain | Findings |", "| --- | ---: |", ...domainRows].join("\n")
      : "- None",
    "",
    "## Debt By Owner",
    "",
    ownerRows.length
      ? ["| Owner | Findings |", "| --- | ---: |", ...ownerRows].join("\n")
      : "- None",
    "",
    "## Remediation Queue",
    "",
    remediationRows.length
      ? ["| Order | Kind | Domain | Owner | Layer | Type | Findings | First location |", "| ---: | --- | --- | --- | --- | --- | ---: | --- |", ...remediationRows].join("\n")
      : "- None",
    "",
    "## Debt Findings",
    "",
    criticalRows.length
      ? ["| Severity | Kind | Domain | Layer | Location | Type | Property/Variable | Reason |", "| --- | --- | --- | --- | --- | --- | --- | --- |", ...criticalRows].join("\n")
      : "- None",
    "",
  ].join("\n");
}

function outputFilesForScope(scope) {
  const baseName = scope === "flow-core" ? "flow-core-cascade-override-governance" : "cascade-override-governance";
  return {
    jsonOutput: path.join(outputDir, `${baseName}.json`),
    markdownOutput: path.join(outputDir, `${baseName}.md`),
  };
}

function writeReport(report) {
  const { jsonOutput, markdownOutput } = outputFilesForScope(report.scope);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
}

function checkCascadeOverrideGovernance(options = {}) {
  const report = createReport({ scope: options.scope ?? "flow-core" });
  writeReport(report);
  for (const finding of report.findings.filter((item) => item.severity === "error")) {
    add("errors", path.join(root, finding.file), finding.line, `${finding.type}: ${finding.reason}${finding.variable ? ` (${finding.variable})` : ""}`);
  }
}

if (require.main === module) {
  const report = createReport();
  writeReport(report);
  const { jsonOutput, markdownOutput } = outputFilesForScope(report.scope);
  console.log(JSON.stringify({
    status: report.status,
    overrideDebt: report.inventory.overrideDebt,
    errors: report.inventory.errors,
    warnings: report.inventory.warnings,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));
  if (process.argv.includes("--check") && report.status === "fail") process.exitCode = 1;
}

module.exports = { createReport, checkCascadeOverrideGovernance };
