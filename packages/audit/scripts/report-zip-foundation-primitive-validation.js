#!/usr/bin/env node

const {
  fs,
  path,
  root,
  slug,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "zip-foundation-primitive-validation-audit.json");
const markdownOutput = path.join(outputDir, "zip-foundation-primitive-validation-audit.md");
const zipRoot = "/private/tmp/flow-zip-audit";
const artifactsDir = path.join(root, "packages/specs/specs/unison-system/artifacts");
const flowTokenFile = path.join(root, "packages/tokens/tokens.json");

const guidelineMap = {
  "a11y-focus.html": { foundations: ["Accessibility", "State"], primitives: ["Focus"] },
  "brand-logo.html": { foundations: ["Symbol", "Voice"], primitives: ["Illustration Assets"] },
  "colors-brand.html": { foundations: ["Tone"], primitives: ["Color"] },
  "colors-dark.html": { foundations: ["Tone", "State"], primitives: ["Color", "Surface"] },
  "colors-neutrals.html": { foundations: ["Tone"], primitives: ["Color", "Surface"] },
  "colors-status.html": { foundations: ["Tone", "State"], primitives: ["Color", "Message"] },
  "elevation.html": { foundations: ["Depth"], primitives: ["Elevation", "Surface"] },
  "icons.html": { foundations: ["Iconography", "Symbol"], primitives: ["Iconography"] },
  "motion.html": { foundations: ["Momentum", "Energy"], primitives: ["Motion Curves", "Duration", "Animation Assets"] },
  "shape-radii.html": { foundations: ["Frame"], primitives: ["Radius"] },
  "spacing-scale.html": { foundations: ["Frame"], primitives: ["Spacing", "Measurement"] },
  "spacing-use.html": { foundations: ["Frame", "Growth"], primitives: ["Spacing", "Density"] },
  "type-body.html": { foundations: ["Voice"], primitives: ["Typography"] },
  "type-data.html": { foundations: ["Voice"], primitives: ["Typography", "Measurement"] },
  "type-display.html": { foundations: ["Voice", "Energy"], primitives: ["Typography"] },
};

const tokenFileMap = {
  "colors.css": { foundations: ["Tone"], primitives: ["Color", "Surface", "Message"] },
  "elevation.css": { foundations: ["Depth"], primitives: ["Elevation"] },
  "fonts.css": { foundations: ["Voice", "Iconography"], primitives: ["Typography", "Iconography", "Library Sources"] },
  "motion.css": { foundations: ["Momentum"], primitives: ["Motion Curves", "Duration"] },
  "shape.css": { foundations: ["Frame"], primitives: ["Radius"] },
  "spacing.css": { foundations: ["Frame"], primitives: ["Spacing", "Density"] },
  "typography.css": { foundations: ["Voice"], primitives: ["Typography"] },
};

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function artifactIds(kind) {
  const dir = path.join(artifactsDir, kind);
  if (!fs.existsSync(dir)) return new Set();
  return new Set(fs.readdirSync(dir).filter((file) => file.endsWith(".json")).map((file) => file.replace(/\.json$/, "")));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function cssCustomProperties(source) {
  return unique([...source.matchAll(/--([a-z0-9-]+)\s*:/g)].map((match) => `--${match[1]}`));
}

function flattenW3cTokens(node, prefix = [], rows = []) {
  if (!node || typeof node !== "object") return rows;
  if (Object.prototype.hasOwnProperty.call(node, "$value")) {
    rows.push({
      path: prefix.join("."),
      type: node.$type ?? "unknown",
      value: node.$value,
      description: node.$description,
    });
    return rows;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    flattenW3cTokens(value, [...prefix, key], rows);
  }
  return rows;
}

function platformRows() {
  const flowTokensPath = path.join(zipRoot, "platforms/flow.tokens.json");
  const angularPath = path.join(zipRoot, "platforms/angular/_flow-tokens.scss");
  const flutterPath = path.join(zipRoot, "platforms/flutter/flow_tokens.dart");
  const buildScriptPath = path.join(zipRoot, "platforms/build-tokens.mjs");
  const flowTokens = fs.existsSync(flowTokensPath) ? readJson(flowTokensPath) : {};
  const tokenRows = flattenW3cTokens(flowTokens.flow);
  const tokenTypes = unique(tokenRows.map((row) => row.type));
  const angular = read(angularPath);
  const flutter = read(flutterPath);
  const buildScript = read(buildScriptPath);
  return {
    w3cSource: {
      file: "platforms/flow.tokens.json",
      exists: fs.existsSync(flowTokensPath),
      tokens: tokenRows.length,
      tokenTypes,
      hasSchema: Boolean(flowTokens.$schema),
      hasFlowRoot: Boolean(flowTokens.flow),
    },
    buildPipeline: {
      file: "platforms/build-tokens.mjs",
      exists: fs.existsSync(buildScriptPath),
      readsW3cSource: buildScript.includes("flow.tokens.json"),
      writesAngular: buildScript.includes("_flow-tokens.scss"),
      writesFlutter: buildScript.includes("flow_tokens.dart"),
      dependencyFree: !/from ['"][^node:]/.test(buildScript),
    },
    angular: {
      file: "platforms/angular/_flow-tokens.scss",
      exists: fs.existsSync(angularPath),
      generatedMarker: /GENERATED/.test(angular),
      variables: unique([...angular.matchAll(/\$([a-zA-Z0-9-]+)\s*:/g)].map((match) => `$${match[1]}`)).length,
      exposesDarkTheme: /dark/i.test(angular),
    },
    flutter: {
      file: "platforms/flutter/flow_tokens.dart",
      exists: fs.existsSync(flutterPath),
      generatedMarker: /GENERATED/.test(flutter),
      colorConstants: unique([...flutter.matchAll(/static const [a-zA-Z0-9]+\s*=/g)].map((match) => match[0])).length,
      exposesScheme: /class FlowScheme/.test(flutter),
    },
  };
}

function createReport() {
  const foundationIds = artifactIds("foundations");
  const primitiveIds = artifactIds("primitives");
  const flowTokens = fs.existsSync(flowTokenFile) ? readJson(flowTokenFile) : { tokens: {} };
  const guidelineFiles = fs.existsSync(path.join(zipRoot, "guidelines"))
    ? fs.readdirSync(path.join(zipRoot, "guidelines")).filter((file) => file.endsWith(".html")).sort()
    : [];
  const tokenFiles = fs.existsSync(path.join(zipRoot, "tokens"))
    ? fs.readdirSync(path.join(zipRoot, "tokens")).filter((file) => file.endsWith(".css")).sort()
    : [];
  const guidelines = guidelineFiles.map((file) => {
    const mapping = guidelineMap[file] ?? { foundations: [], primitives: [] };
    const missingFoundations = mapping.foundations.filter((name) => !foundationIds.has(slug(name)));
    const missingPrimitives = mapping.primitives.filter((name) => !primitiveIds.has(slug(name)));
    const source = read(path.join(zipRoot, "guidelines", file));
    return {
      file: `guidelines/${file}`,
      foundations: mapping.foundations,
      primitives: mapping.primitives,
      sourceSignals: {
        customProperties: cssCustomProperties(source).length,
        hasColor: /#[0-9a-fA-F]{3,8}|rgb\(/.test(source),
        hasMotion: /transition|animation|duration|cubic-bezier/i.test(source),
        hasType: /font-|line-height|letter-spacing/i.test(source),
      },
      missingFoundations,
      missingPrimitives,
    };
  });
  const zipTokens = tokenFiles.map((file) => {
    const mapping = tokenFileMap[file] ?? { foundations: [], primitives: [] };
    const source = read(path.join(zipRoot, "tokens", file));
    const customProperties = cssCustomProperties(source);
    const missingFoundations = mapping.foundations.filter((name) => !foundationIds.has(slug(name)));
    const missingPrimitives = mapping.primitives.filter((name) => !primitiveIds.has(slug(name)));
    return {
      file: `tokens/${file}`,
      customProperties: customProperties.length,
      fontAssetSource: /@import\s+url\(|@font-face|font-family:\s*['"]?Material Symbols/i.test(source),
      foundations: mapping.foundations,
      primitives: mapping.primitives,
      missingFoundations,
      missingPrimitives,
    };
  });
  const platform = platformRows();
  const mappedFoundationNames = unique([...guidelines, ...zipTokens].flatMap((row) => row.foundations));
  const mappedPrimitiveNames = unique([...guidelines, ...zipTokens].flatMap((row) => row.primitives));
  const issues = [
    ...guidelines.filter((row) => !row.foundations.length && !row.primitives.length).map((row) => `${row.file} has no Flow foundation/primitive mapping.`),
    ...zipTokens.filter((row) => !row.customProperties && !row.fontAssetSource).map((row) => `${row.file} has no CSS custom properties or font asset source.`),
    ...guidelines.flatMap((row) => row.missingFoundations.map((name) => `${row.file} references missing foundation ${name}.`)),
    ...guidelines.flatMap((row) => row.missingPrimitives.map((name) => `${row.file} references missing primitive ${name}.`)),
    ...zipTokens.flatMap((row) => row.missingFoundations.map((name) => `${row.file} references missing foundation ${name}.`)),
    ...zipTokens.flatMap((row) => row.missingPrimitives.map((name) => `${row.file} references missing primitive ${name}.`)),
    ...(platform.w3cSource.exists ? [] : ["platforms/flow.tokens.json is missing."]),
    ...(platform.w3cSource.hasSchema ? [] : ["platforms/flow.tokens.json is missing W3C schema marker."]),
    ...(platform.w3cSource.hasFlowRoot ? [] : ["platforms/flow.tokens.json is missing flow root."]),
    ...(platform.buildPipeline.readsW3cSource && platform.buildPipeline.writesAngular && platform.buildPipeline.writesFlutter ? [] : ["platform token build pipeline does not prove Angular and Flutter output generation."]),
    ...(platform.angular.generatedMarker && platform.angular.variables > 0 ? [] : ["Angular token output is missing generated marker or variables."]),
    ...(platform.flutter.generatedMarker && platform.flutter.colorConstants > 0 && platform.flutter.exposesScheme ? [] : ["Flutter token output is missing generated marker, constants, or scheme."]),
  ];
  const inventory = {
    zipGuidelineFiles: guidelines.length,
    mappedGuidelineFiles: guidelines.filter((row) => row.foundations.length || row.primitives.length).length,
    zipTokenCssFiles: zipTokens.length,
    mappedTokenCssFiles: zipTokens.filter((row) => row.foundations.length || row.primitives.length).length,
    zipCssCustomProperties: zipTokens.reduce((sum, row) => sum + row.customProperties, 0),
    zipW3cTokens: platform.w3cSource.tokens,
    zipW3cTokenTypes: platform.w3cSource.tokenTypes.length,
    angularTokenVariables: platform.angular.variables,
    flutterColorConstants: platform.flutter.colorConstants,
    flowTokenContractTokens: Object.keys(flowTokens.tokens ?? {}).length,
    flowFoundations: foundationIds.size,
    flowPrimitives: primitiveIds.size,
    mappedFlowFoundations: mappedFoundationNames.length,
    mappedFlowPrimitives: mappedPrimitiveNames.length,
    missingMappedFoundations: guidelines.reduce((sum, row) => sum + row.missingFoundations.length, 0) + zipTokens.reduce((sum, row) => sum + row.missingFoundations.length, 0),
    missingMappedPrimitives: guidelines.reduce((sum, row) => sum + row.missingPrimitives.length, 0) + zipTokens.reduce((sum, row) => sum + row.missingPrimitives.length, 0),
    platformOutputs: 3,
    platformOutputGaps: [
      platform.w3cSource.exists && platform.w3cSource.hasSchema && platform.w3cSource.hasFlowRoot,
      platform.angular.exists && platform.angular.generatedMarker,
      platform.flutter.exists && platform.flutter.generatedMarker && platform.flutter.exposesScheme,
    ].filter((ok) => !ok).length,
    zipFoundationPrimitiveValidationDebt: issues.length,
  };
  return {
    status: issues.length ? "fail" : "pass",
    audit: "zip foundation primitive validation",
    principle: "ZIP guidelines, CSS token outputs, and platform token exports must resolve to Flow foundations/primitives before UI promotion.",
    generatedAt: new Date().toISOString(),
    inventory,
    guidelines,
    tokenCss: zipTokens,
    platform,
    issues,
  };
}

function markdown(report) {
  return [
    "# ZIP foundation primitive validation",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Guidelines",
    "",
    "| File | Foundations | Primitives | Issues |",
    "| --- | --- | --- | ---: |",
    ...report.guidelines.map((row) => `| ${row.file} | ${row.foundations.join(", ")} | ${row.primitives.join(", ")} | ${row.missingFoundations.length + row.missingPrimitives.length} |`),
    "",
    "## Token CSS",
    "",
    "| File | Custom properties | Foundations | Primitives | Issues |",
    "| --- | ---: | --- | --- | ---: |",
    ...report.tokenCss.map((row) => `| ${row.file} | ${row.customProperties} | ${row.foundations.join(", ")} | ${row.primitives.join(", ")} | ${row.missingFoundations.length + row.missingPrimitives.length} |`),
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
    throw new Error(`${jsonOutput} is stale. Run node packages/audit/scripts/report-zip-foundation-primitive-validation.js.`);
  }
}
if (!checkMode) {
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${markdown(report)}\n`);
}

if (report.status !== "pass") {
  throw new Error(`ZIP foundation primitive validation failed with ${report.issues.length} issue(s).`);
}
