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
const jsonOutput = path.join(outputDir, "email-channel-governance-audit.json");
const markdownOutput = path.join(outputDir, "email-channel-governance-audit.md");
const zipRoot = "/private/tmp/flow-zip-audit";
const governanceFile = path.join(root, "packages/content/content/email-channel-governance.json");
const patternFile = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns/email-template-layout.json");
const patternSourceFile = path.join(root, "packages/react/src/patterns/EmailTemplateLayout.js");
const patternTypesFile = path.join(root, "packages/react/src/patterns/EmailTemplateLayout.d.ts");
const parityReportFile = path.join(root, "docs/audits/zip-template-parity-audit.json");

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function htmlSignals(source) {
  const classAndTagSource = source.toLowerCase();
  return {
    doctype: /<!doctype html>/i.test(source),
    htmlLang: /<html[^>]+\blang=/.test(source),
    head: /<head[\s>]/i.test(source),
    title: /<title>[^<]+<\/title>/i.test(source),
    viewport: /name=["']viewport["']/i.test(source),
    body: /<body[\s>]/i.test(source),
    hiddenPreheader: /display\s*:\s*none/i.test(source) && /mso-hide\s*:\s*all/i.test(source),
    presentationTable: /<table[^>]+role=["']presentation["']/i.test(source),
    container600: /width=["']600["']|width\s*:\s*600px|max-width\s*:\s*600px/i.test(source),
    contentCard: /background-color\s*:\s*#ffffff/i.test(source) && /border-radius\s*:\s*20px/i.test(source),
    footer: /Darse de baja|Preferencias|© 2026 Flow Mobility/i.test(source),
    cta: /<a\b[^>]+href=/i.test(source) && /Acci[oó]n|Ver |Abrir|Aceptar|protege/i.test(source),
    dataRows: /<strong>|Tarjeta|Categoria|Consumo|Conductor/i.test(source),
    metricsGrid: /Viajes|Ingreso|Gasto en combustible|Alertas abiertas/i.test(source),
    otpBlock: /C[óo]DIGO DE VERIFICACI[ÓO]N|482 917|V[áa]lido por 10 minutos/i.test(source),
    securityCopy: /dispositivo nuevo|protege tu cuenta|inicio de sesi[oó]n/i.test(source),
    expiryCopy: /expira en 7 d[ií]as/i.test(source),
    steps: /<td[^>]*>\s*1\s*<\/td>|siguientes pasos/i.test(source),
    script: /<script\b|javascript:/i.test(source),
    cssCustomProperties: /--[a-z0-9-]+\s*:|var\(--/i.test(source),
    flexbox: /display\s*:\s*flex|flex-direction|align-items|justify-content/i.test(source),
    grid: /display\s*:\s*grid|grid-template|grid-column/i.test(source),
    flowWebComponents: /\b(flow-button|flow-card|flow-table|flow-toast|flow-dialog|flow-drawer|data-flow-component)\b/i.test(classAndTagSource),
    dangerousHtml: /innerHTML|dangerouslySetInnerHTML/i.test(source),
    formControls: /<(button|input|select|textarea|form)\b/i.test(source),
    reactMount: /createRoot|hydrateRoot|data-reactroot|<script[^>]+react/i.test(source),
  };
}

function usedTags(source) {
  return [...new Set([...source.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9:-]*)\b/g)].map((match) => match[1].toLowerCase()))].sort();
}

function artifactRecord() {
  const json = readJson(patternFile);
  return json.artifacts?.patterns?.["email-template-layout"] ?? {};
}

function rendererSignals(source, types, variants) {
  const imports = [...source.matchAll(/^import\s+(.+?)\s+from\s+["'](.+?)["'];/gm)].map((match) => ({
    specifier: match[1],
    source: match[2],
  }));
  const allowedImports = new Set([
    "react",
    "../internal/email-token-values.js",
  ]);
  return {
    forwardRef: /forwardRef\(function EmailTemplateLayout/.test(source),
    dataFlowPattern: /"data-flow-pattern":\s*"email-template-layout"/.test(source),
    dataFlowChannel: /"data-flow-channel":\s*"email"/.test(source),
    variantDefaults: variants.every((variant) => variant === "base" || source.includes(`variant === "${variant}"`)),
    sanitizeRestProps: /function sanitizeRestProps/.test(source) && /key\.startsWith\("data-"\)|key\.startsWith\("aria-"\)/.test(source),
    presentationTables: (source.match(/role:\s*"presentation"/g) ?? []).length,
    anchorCta: /React\.createElement\("a"/.test(source) && /href:\s*action\.href/.test(source),
    hiddenPreheader: /msoHide:\s*"all"/.test(source) && /hiddenPreheader/.test(source),
    noComponentImports: imports.every((row) => allowedImports.has(row.source)),
    typeVariants: variants.filter((variant) => types.includes(`| "${variant}"`)).length,
    imports,
  };
}

function createReport() {
  const governance = readJson(governanceFile);
  const artifact = artifactRecord();
  const parity = fs.existsSync(parityReportFile) ? readJson(parityReportFile) : { kits: [] };
  const mailKit = (parity.kits ?? []).find((kit) => kit.id === governance.zipKitId);
  const variants = governance.expectedVariants ?? [];
  const source = read(patternSourceFile);
  const types = read(patternTypesFile);
  const slotRows = artifact.slots ?? [];
  const zipRows = variants.map((variant) => {
    const zipPath = governance.zipVariantFiles?.[variant];
    const file = zipPath ? path.join(zipRoot, zipPath) : "";
    const html = read(file);
    const signals = htmlSignals(html);
    const missingRequired = (governance.requiredHtmlSignals ?? []).filter((signal) => !signals[signal]);
    const missingConditional = (governance.conditionalVariantSignals?.[variant] ?? []).filter((signal) => !signals[signal]);
    const forbiddenSignals = (governance.forbiddenHtmlSignals ?? []).filter((signal) => signals[signal]);
    const disallowedTags = usedTags(html).filter((tag) => !(governance.allowedHtmlTags ?? []).includes(tag));
    return {
      variant,
      zipPath,
      exists: Boolean(zipPath && fs.existsSync(file)),
      signals,
      usedTags: usedTags(html),
      missingRequired,
      missingConditional,
      forbiddenSignals,
      disallowedTags,
    };
  });
  const renderer = rendererSignals(source, types, variants);
  const rendererMissingSignals = (governance.rendererRequiredSignals ?? []).filter((signal) => {
    if (signal === "noComponentImports") return !renderer.noComponentImports;
    return !renderer[signal];
  });
  const artifactIssues = [
    ...(artifact.platform === "Email channel" ? [] : ["email-template-layout artifact must declare platform Email channel."]),
    ...(artifact.componentDependencies?.length === 0 ? [] : ["email-template-layout must not depend on web components."]),
    ...(artifact.patternDependencies?.length === 0 ? [] : ["email-template-layout must not depend on web patterns."]),
    ...(slotRows.some((slot) => slot.owner === "channel") ? [] : ["email-template-layout must include channel-owned slots."]),
  ];
  const issues = [
    ...(mailKit?.classification === "covered-separate-channel" ? [] : ["mailings ZIP kit must remain covered-separate-channel."]),
    ...artifactIssues,
    ...zipRows.filter((row) => !row.exists).map((row) => `${row.variant}: missing ZIP variant file ${row.zipPath}.`),
    ...zipRows.flatMap((row) => row.missingRequired.map((signal) => `${row.variant}: missing required email signal ${signal}.`)),
    ...zipRows.flatMap((row) => row.missingConditional.map((signal) => `${row.variant}: missing conditional email signal ${signal}.`)),
    ...zipRows.flatMap((row) => row.forbiddenSignals.map((signal) => `${row.variant}: forbidden email signal ${signal}.`)),
    ...zipRows.flatMap((row) => row.disallowedTags.map((tag) => `${row.variant}: disallowed email tag ${tag}.`)),
    ...rendererMissingSignals.map((signal) => `renderer missing required signal ${signal}.`),
    ...(renderer.typeVariants === variants.length ? [] : [`renderer types expose ${renderer.typeVariants}/${variants.length} variants.`]),
  ];
  const inventory = {
    zipEmailVariants: zipRows.filter((row) => row.exists).length,
    zipEmailReadmes: mailKit?.zipPaths?.filter((zipPath) => zipPath.endsWith("README.md")).length ?? 0,
    declaredVariants: variants.length,
    artifactSlots: slotRows.length,
    channelSlots: slotRows.filter((slot) => slot.owner === "channel").length,
    primitiveSlots: slotRows.filter((slot) => slot.owner === "primitive").length,
    rendererVariants: renderer.typeVariants,
    rendererForbiddenImports: renderer.imports.filter((row) => !["react", "../internal/email-token-values.js"].includes(row.source)).length,
    zipForbiddenSignals: zipRows.reduce((sum, row) => sum + row.forbiddenSignals.length, 0),
    zipDisallowedTags: zipRows.reduce((sum, row) => sum + row.disallowedTags.length, 0),
    zipMissingRequiredSignals: zipRows.reduce((sum, row) => sum + row.missingRequired.length + row.missingConditional.length, 0),
    emailChannelDebt: issues.length,
  };
  const expectedIssues = Object.entries(governance.expectedInventory ?? {})
    .filter(([key, expected]) => inventory[key] !== expected)
    .map(([key, expected]) => `expectedInventory.${key}: expected ${expected}, got ${inventory[key]}.`);
  const allIssues = [...expectedIssues, ...issues];
  return {
    status: allIssues.length ? "fail" : "pass",
    audit: "email channel governance",
    principle: governance.principle,
    generatedAt: new Date().toISOString(),
    inventory,
    artifact: {
      file: rel(patternFile),
      platform: artifact.platform,
      slots: slotRows.map((slot) => ({ name: slot.name, owner: slot.owner, uses: slot.uses, required: slot.required })),
    },
    renderer,
    variants: zipRows,
    issues: allIssues,
  };
}

function markdown(report) {
  return [
    "# Email channel governance audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Variants",
    "",
    "| Variant | File | Required gaps | Conditional gaps | Forbidden | Disallowed tags |",
    "| --- | --- | ---: | ---: | ---: | ---: |",
    ...report.variants.map((row) => `| ${row.variant} | ${row.zipPath} | ${row.missingRequired.length} | ${row.missingConditional.length} | ${row.forbiddenSignals.length} | ${row.disallowedTags.length} |`),
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
    throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-email-channel-governance.js.`);
  }
}
fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownOutput, `${markdown(report)}\n`);

if (report.status !== "pass") {
  throw new Error(`Email channel governance failed with ${report.issues.length} issue(s).`);
}
