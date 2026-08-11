#!/usr/bin/env node

const {
  fs,
  path,
  patternArtifacts: patternArtifactIds,
  rel,
  root,
} = require("./audit-context.js");
const { readPatternArchitecturePolicy } = require("./pattern-architecture-policy.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-pattern-behavior-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-pattern-behavior-governance-audit.md");
const reactPatternDir = path.join(root, "packages/react/src/patterns");
const reactSrcDir = path.join(root, "packages/react/src");
const patternArtifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const patternContractDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const patternInteractionTestFile = path.join(root, "packages/react/test/pattern-interaction.test.mjs");
const patternArchitecturePolicy = readPatternArchitecturePolicy();
const {
  forbiddenTypeProps,
  controlledPropPairs,
  displayOnlyProps,
  inheritedDomProps,
  inheritedDomPropPrefixes,
  accessibilityDelegatingComponents,
  patternContractGovernanceGroups,
  literalContractProps,
  stateCascadeCarrierProps,
  patternRuntimeMarkers,
  patternContractRequiredHeadings,
  behaviorExpectedInventory: expectedInventory,
} = patternArchitecturePolicy;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function kebabCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function listFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) return listFiles(file, predicate);
      return predicate(file) ? [file] : [];
    })
    .sort();
}

function listPatternArtifacts() {
  return patternArtifactIds
    .map((id) => {
      const artifactFile = path.join(patternArtifactDir, `${id}.json`);
      const json = readJson(artifactFile);
      return {
        id,
        artifactFile,
        artifact: json.artifacts?.patterns?.[id] ?? {},
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function callbackProps(types) {
  return [...types.matchAll(/\b(on[A-Z][A-Za-z0-9_]*)\?:/g)]
    .map((match) => match[1])
    .filter((name, index, all) => all.indexOf(name) === index)
    .sort();
}

function declaredProps(types) {
  const propsInterface = types.match(/export interface [A-Za-z0-9]+Props \{([\s\S]*?)\n\}/);
  if (!propsInterface) return [];
  return [...propsInterface[1].matchAll(/^  ([A-Za-z_][A-Za-z0-9_]*)\??:/gm)]
    .map((match) => match[1])
    .filter((name, index, all) => all.indexOf(name) === index)
    .sort();
}

function implementationBody(source) {
  const signature = source.match(/forwardRef\(function\s+[A-Za-z0-9_]+\s*\(\s*\{[\s\S]*?\}\s*,\s*ref\s*\)\s*\{/);
  return signature ? source.slice(signature.index + signature[0].length) : source;
}

function sourceUsesName(source, name) {
  return new RegExp(`\\b${name}\\b`).test(source);
}

function patternInteractionBlocks(testSource, patternName) {
  if (!testSource || !patternName) return [];
  const marker = `React.createElement(${patternName},`;
  const blocks = [];
  let index = testSource.indexOf(marker);
  while (index !== -1) {
    const cleanupIndex = testSource.indexOf("cleanup();", index);
    blocks.push(testSource.slice(index, cleanupIndex === -1 ? index + 5000 : cleanupIndex));
    index = testSource.indexOf(marker, index + marker.length);
  }
  return blocks;
}

function testCoversCallback(testSource, patternName, callback) {
  return patternInteractionBlocks(testSource, patternName)
    .some((block) => block.includes(callback));
}

function stateUnionValues(types, patternName) {
  const union = types.match(new RegExp(`export type ${patternName}State\\s*=([\\s\\S]*?);`));
  if (!union) return [];
  return [...union[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]).sort();
}

function declaredForbiddenProps(types) {
  return forbiddenTypeProps.filter((prop) => new RegExp(`\\b${prop}\\??\\s*:`).test(types));
}

function structuralSurfaceSlots(artifact) {
  return (artifact.slots ?? [])
    .filter((slot) => slot.owner === "primitive" && (slot.uses ?? []).includes("Surface"))
    .map((slot) => slot.name)
    .sort();
}

function patternContractStateIssues(id, formalStates) {
  const contractFile = path.join(patternContractDir, `${id}.md`);
  if (!formalStates.length) return [];
  if (!fs.existsSync(contractFile)) {
    return [`Missing portable pattern contract: ${rel(contractFile)}.`];
  }
  const markdown = fs.readFileSync(contractFile, "utf8");
  if (!new RegExp(`^${escapeRegExp(patternContractRequiredHeadings.states)}$`, "m").test(markdown)) {
    return ["Portable pattern contract is missing a Formal States section."];
  }
  const missing = formalStates.filter((state) => !markdown.includes(`\`${state}\``));
  return missing.length
    ? [`Portable pattern contract is missing formal states: ${missing.join(", ")}.`]
    : [];
}

function patternContractGovernanceIssues(id, artifact) {
  const governanceGroups = [...patternContractGovernanceGroups.entries()]
    .map(([label, field]) => [label, artifact[field] ?? []])
    .filter(([, values]) => values.length);
  if (!governanceGroups.length) return [];
  const contractFile = path.join(patternContractDir, `${id}.md`);
  if (!fs.existsSync(contractFile)) {
    return [`Missing portable pattern contract: ${rel(contractFile)}.`];
  }
  const markdown = fs.readFileSync(contractFile, "utf8");
  if (!new RegExp(`^${escapeRegExp(patternContractRequiredHeadings.governance)}$`, "m").test(markdown)) {
    return ["Portable pattern contract is missing a Formal Governance section."];
  }
  return governanceGroups.flatMap(([label, values]) => {
    const missingHeading = !new RegExp(`^### ${label}$`, "m").test(markdown);
    const missingValues = values.filter((value) => !markdown.includes(value));
    return [
      ...(missingHeading ? [`Portable pattern contract is missing ${label} governance group.`] : []),
      ...(missingValues.length ? [`Portable pattern contract is missing ${label} rules: ${missingValues.join(" | ")}.`] : []),
    ];
  });
}

function importNames(source, prefix) {
  return [...source.matchAll(/import\s+\{\s*([^}]+)\s*\}\s+from\s+"([^"]+)"/g)]
    .filter((match) => match[2].startsWith(prefix))
    .flatMap((match) => match[1]
      .split(",")
      .map((entry) => entry.trim().split(/\s+as\s+/).pop())
      .filter(Boolean))
    .sort();
}

function importEntries(source, prefix) {
  return [...source.matchAll(/import\s+\{\s*([^}]+)\s*\}\s+from\s+"([^"]+)"/g)]
    .filter((match) => match[2].startsWith(prefix))
    .flatMap((match) => match[1]
      .split(",")
      .map((entry) => {
        const [importedName, alias] = entry.trim().split(/\s+as\s+/).map((part) => part.trim());
        return { name: alias || importedName, importedName, from: match[2] };
      })
      .filter((entry) => entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function balancedObjectAt(source, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(openIndex, index + 1);
    }
  }
  return "";
}

function lineForIndex(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function localObjectsWithDensity(source) {
  const objects = new Set();
  for (const match of source.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*\{/g)) {
    const openIndex = source.indexOf("{", match.index);
    const objectSource = balancedObjectAt(source, openIndex);
    if (/\bdensity\b/.test(objectSource)) objects.add(match[1]);
  }
  return objects;
}

function localObjectsWithState(source) {
  const objects = new Set();
  for (const match of source.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*\{/g)) {
    const openIndex = source.indexOf("{", match.index);
    const objectSource = balancedObjectAt(source, openIndex);
    if (/\b(state|disabled|loading|open|selected|checked|error)\b/.test(objectSource)) objects.add(match[1]);
  }
  return objects;
}

function typeFileForImport(from, name) {
  if (from.startsWith("../")) return path.join(reactSrcDir, `${name}.d.ts`);
  if (from.startsWith("./")) return path.join(reactPatternDir, `${name}.d.ts`);
  return null;
}

function isStatefulFlowChild(entry) {
  const typeFile = typeFileForImport(entry.from, entry.importedName ?? entry.name);
  if (!typeFile || !fs.existsSync(typeFile)) return false;
  const types = fs.readFileSync(typeFile, "utf8");
  return /\b(state|disabled|loading|open|selected|checked|error)\?:/.test(types);
}

function topLevelPropEntries(objectSource) {
  const entries = [];
  let depth = 0;
  let quote = null;
  let escaped = false;
  let start = 1;
  for (let index = 1; index < objectSource.length - 1; index += 1) {
    const char = objectSource[index];
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{" || char === "(" || char === "[") depth += 1;
    if (char === "}" || char === ")" || char === "]") depth -= 1;
    if (char === "," && depth === 0) {
      entries.push(objectSource.slice(start, index));
      start = index + 1;
    }
  }
  entries.push(objectSource.slice(start, -1));
  return entries;
}

function allowedLiteralValues(types, componentName, propName) {
  const typeName = `${componentName}${propName.charAt(0).toUpperCase()}${propName.slice(1)}`;
  const typeUnion = types.match(new RegExp(`export type ${typeName}\\s*=([\\s\\S]*?);`));
  if (typeUnion) return [...typeUnion[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  const propUnion = types.match(new RegExp(`\\b${propName}\\??:\\s*([^;]+);`));
  return propUnion ? [...propUnion[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]) : [];
}

function declaredComponentProps(types, componentName) {
  const propsInterface = types.match(new RegExp(`export interface ${componentName}Props[^{]*\\{([\\s\\S]*?)\\n\\}`));
  if (!propsInterface) return new Set();
  return new Set([...propsInterface[1].matchAll(/^  (?:"([^"]+)"|([A-Za-z_][A-Za-z0-9_]*))\??:/gm)]
    .map((match) => match[1] || match[2])
    .filter(Boolean));
}

function directPropNames(objectSource) {
  return topLevelPropEntries(objectSource)
    .map((entrySource) => entrySource.match(/^\s*(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:/))
    .filter(Boolean)
    .map((match) => match[1] || match[2]);
}

function isInheritedDomProp(propName) {
  return inheritedDomProps.has(propName)
    || inheritedDomPropPrefixes.some((prefix) => propName.startsWith(prefix));
}

function propContractIssues(source) {
  const flowImports = new Map(importEntries(source, "../").concat(importEntries(source, "./"))
    .map((entry) => [entry.name, entry]));
  const issues = [];
  const validated = [];
  for (const match of source.matchAll(/React\.createElement\(\s*([A-Z][A-Za-z0-9]*)\s*,\s*\{/g)) {
    const name = match[1];
    const entry = flowImports.get(name);
    if (!entry) continue;
    const componentName = entry.importedName ?? name;
    const typeFile = typeFileForImport(entry.from, componentName);
    if (!typeFile || !fs.existsSync(typeFile)) continue;
    const types = fs.readFileSync(typeFile, "utf8");
    const allowedProps = declaredComponentProps(types, componentName);
    if (!allowedProps.size) continue;
    const openIndex = source.indexOf("{", match.index);
    const propsSource = balancedObjectAt(source, openIndex);
    for (const propName of directPropNames(propsSource)) {
      if (isInheritedDomProp(propName)) continue;
      const line = lineForIndex(source, match.index);
      validated.push(`${componentName}.${propName}@${line}`);
      if (allowedProps.has(propName)) continue;
      issues.push(`${componentName}.${propName}@line ${line} is not declared by ${componentName}Props`);
    }
  }
  return { validated, issues };
}

function literalContractIssues(source) {
  const flowImports = new Map(importEntries(source, "../").concat(importEntries(source, "./"))
    .map((entry) => [entry.name, entry]));
  const issues = [];
  const validated = [];
  for (const match of source.matchAll(/React\.createElement\(\s*([A-Z][A-Za-z0-9]*)\s*,\s*\{/g)) {
    const name = match[1];
    const entry = flowImports.get(name);
    if (!entry) continue;
    const typeFile = typeFileForImport(entry.from, entry.importedName ?? entry.name);
    if (!typeFile || !fs.existsSync(typeFile)) continue;
    const types = fs.readFileSync(typeFile, "utf8");
    const openIndex = source.indexOf("{", match.index);
    const propsSource = balancedObjectAt(source, openIndex);
    for (const propName of literalContractProps) {
      const allowedValues = allowedLiteralValues(types, entry.importedName ?? name, propName);
      if (!allowedValues.length) continue;
      const literalValues = topLevelPropEntries(propsSource)
        .map((entrySource) => entrySource.match(new RegExp(`^\\s*${propName}\\s*:\\s*"([^"]+)"`)))
        .filter(Boolean)
        .map((literal) => literal[1]);
      for (const value of literalValues) {
        validated.push(`${name}.${propName}@${lineForIndex(source, match.index)}`);
        if (!allowedValues.includes(value)) {
          issues.push(`${name}.${propName}="${value}" at line ${lineForIndex(source, match.index)} is not in ${allowedValues.join(", ")}`);
        }
      }
    }
  }
  return { validated, issues };
}

function densityCascadeIssues(source) {
  const flowImports = new Set([
    ...importNames(source, "../"),
    ...importNames(source, "./"),
  ]);
  const densityObjects = localObjectsWithDensity(source);
  const children = [];
  const issues = [];
  for (const match of source.matchAll(/React\.createElement\(\s*([A-Z][A-Za-z0-9]*)\s*,\s*\{/g)) {
    const name = match[1];
    if (!flowImports.has(name)) continue;
    const openIndex = source.indexOf("{", match.index);
    const propsSource = balancedObjectAt(source, openIndex);
    const spreadNames = [...propsSource.matchAll(/\.\.\.([A-Za-z_$][\w$]*)/g)].map((spread) => spread[1]);
    const cascadesDensity = /\bdensity\b/.test(propsSource) || spreadNames.some((spread) => densityObjects.has(spread));
    children.push(`${name}@${lineForIndex(source, match.index)}`);
    if (!cascadesDensity) issues.push(`${name}@line ${lineForIndex(source, match.index)} missing density cascade`);
  }
  return { children, issues };
}

function stateCascadeIssues(source) {
  const flowImports = importEntries(source, "../").concat(importEntries(source, "./"));
  const statefulImports = new Map(flowImports
    .filter(isStatefulFlowChild)
    .map((entry) => [entry.name, entry]));
  const stateObjects = localObjectsWithState(source);
  const carrierPattern = new RegExp(`\\b(${stateCascadeCarrierProps.map(escapeRegExp).join("|")})\\b`);
  const children = [];
  const direct = [];
  const boundary = [];
  const issues = [];
  for (const match of source.matchAll(/React\.createElement\(\s*([A-Z][A-Za-z0-9]*)\s*,\s*\{/g)) {
    const name = match[1];
    if (!statefulImports.has(name)) continue;
    const line = lineForIndex(source, match.index);
    const openIndex = source.indexOf("{", match.index);
    const propsSource = balancedObjectAt(source, openIndex);
    const spreadNames = [...propsSource.matchAll(/\.\.\.([A-Za-z_$][\w$]*)/g)].map((spread) => spread[1]);
    const hasDirectStateCarrier = carrierPattern.test(propsSource)
      || spreadNames.some((spread) => stateObjects.has(spread));
    const hasExternalBoundary = spreadNames.some((spread) => !stateObjects.has(spread));
    children.push(`${name}@${line}`);
    if (hasDirectStateCarrier) direct.push(`${name}@${line}`);
    else if (hasExternalBoundary) boundary.push(`${name}@${line}`);
    else issues.push(`${name}@line ${line} missing state carrier`);
  }
  return { children, direct, boundary, issues };
}

function controlledPairIssues(patternName, props) {
  const propSet = new Set(props);
  const displayOnly = displayOnlyProps[patternName] ?? new Set();
  return Object.entries(controlledPropPairs).flatMap(([prop, callbacks]) => {
    if (!propSet.has(prop) || displayOnly.has(prop)) return [];
    return callbacks.some((callback) => propSet.has(callback))
      ? []
      : [`${prop} lacks paired callback (${callbacks.join(" or ")}).`];
  });
}

function analyzePattern({ id, artifactFile, artifact }, implementationById, interactionTestSource) {
  const sourceFile = implementationById.get(id) ?? null;
  const typeFile = sourceFile ? sourceFile.replace(/\.js$/, ".d.ts") : null;
  const source = sourceFile && fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const types = typeFile && fs.existsSync(typeFile) ? fs.readFileSync(typeFile, "utf8") : "";
  const body = implementationBody(source);
  const props = declaredProps(types);
  const callbacks = callbackProps(types);
  const patternName = sourceFile ? path.basename(sourceFile, ".js") : "";
  const testedCallbacks = callbacks.filter((callback) => testCoversCallback(interactionTestSource, patternName, callback));
  const missingCallbackTests = callbacks.filter((callback) => !testedCallbacks.includes(callback));
  const formalStates = (artifact.states ?? []).sort();
  const typedStates = stateUnionValues(types, patternName);
  const statesMissingFromTypes = formalStates.filter((state) => !typedStates.includes(state));
  const statesMissingFromArtifact = typedStates.filter((state) => !formalStates.includes(state));
  const contractStateIssues = patternContractStateIssues(id, formalStates);
  const contractGovernanceIssues = patternContractGovernanceIssues(id, artifact);
  const controlledIssues = controlledPairIssues(patternName, props);
  const unusedDeclaredProps = props.filter((prop) => !sourceUsesName(body, prop));
  const unusedCallbacks = callbacks.filter((callback) => unusedDeclaredProps.includes(callback));
  const surfaceSlots = structuralSurfaceSlots(artifact);
  const importsSurface = /import\s+\{\s*[^}]*\bSurface\b[^}]*\}\s+from\s+"..\/Surface\.js"/.test(source);
  const usesSurfaceElement = /React\.createElement\(\s*Surface\b/.test(source);
  const missingSurfaceSlotMarkers = surfaceSlots
    .filter((slot) => !source.includes(`"${patternRuntimeMarkers.slot}": "${slot}"`) && !source.includes(`"${patternRuntimeMarkers.slot}": '${slot}'`));
  const missingStructuralSurfaceUsage = surfaceSlots.length && (!importsSurface || !usesSurfaceElement);
  const hasSource = Boolean(sourceFile);
  const hasTypes = Boolean(typeFile && fs.existsSync(typeFile));
  const hasForwardRef = /\bforwardRef\(/.test(source);
  const hasRefAttributes = /\bRefAttributes\s*<\s*HTML/.test(types);
  const hasDataFlowPattern = source.includes(`${patternRuntimeMarkers.pattern}": "${id}"`) || source.includes(`${patternRuntimeMarkers.pattern}": '${id}'`);
  const hasDensityProp = /\bdensity\?:/.test(types);
  const componentImports = importNames(source, "../");
  const densityCascade = densityCascadeIssues(source);
  const stateCascade = stateCascadeIssues(source);
  const literalContracts = literalContractIssues(source);
  const propContracts = propContractIssues(source);
  const formalAccessibility = artifact.accessibility ?? [];
  const directAccessibilitySignals = [
    ...source.matchAll(/"(aria-[^"]+)"/g),
    ...source.matchAll(/\brole\s*:/g),
  ].length;
  const delegatedAccessibilityComponents = componentImports
    .filter((name) => accessibilityDelegatingComponents.has(name));
  const missingAccessibilityImplementation = formalAccessibility.length > 0
    && directAccessibilitySignals === 0
    && delegatedAccessibilityComponents.length === 0;
  const rawGlobalDomRefs = [...source.matchAll(/\b(document|window)\b/g)].map((match) => match[1]);
  const forbiddenPropsDeclared = declaredForbiddenProps(types);
  const hasRestSanitizer = /sanitizeRestProps|flowRestProps/.test(source)
    || (/Object\.fromEntries\(Object\.entries\(rest\)\.filter/.test(source)
      && /key\.startsWith\("data-"\)/.test(source)
      && /key\.startsWith\("aria-"\)/.test(source));
  const hasUnsafeRestSpread = /\.\.\.rest/.test(source) && !hasRestSanitizer;
  const debts = [
    ...(!hasSource ? ["Missing React implementation."] : []),
    ...(!hasTypes ? ["Missing TypeScript declaration."] : []),
    ...(hasSource && !hasForwardRef ? ["Pattern does not use forwardRef."] : []),
    ...(hasTypes && !hasRefAttributes ? ["Pattern declaration does not expose RefAttributes."] : []),
    ...(hasSource && !hasDataFlowPattern ? [`Pattern does not stamp data-flow-pattern="${id}".`] : []),
    ...(hasTypes && !hasDensityProp ? ["Pattern declaration does not expose density for cascade."] : []),
    ...(densityCascade.issues.length ? [`Flow children missing density cascade: ${densityCascade.issues.join(", ")}.`] : []),
    ...(stateCascade.issues.length ? [`Stateful Flow children missing state cascade: ${stateCascade.issues.join(", ")}.`] : []),
    ...(literalContracts.issues.length ? [`Flow child literal contract mismatches: ${literalContracts.issues.join(", ")}.`] : []),
    ...(propContracts.issues.length ? [`Flow child prop contract mismatches: ${propContracts.issues.join(", ")}.`] : []),
    ...(unusedCallbacks.length ? [`Declared callbacks are not wired in React source: ${unusedCallbacks.join(", ")}.`] : []),
    ...(missingCallbackTests.length ? [`Declared callbacks are missing pattern interaction coverage: ${missingCallbackTests.join(", ")}.`] : []),
    ...(unusedDeclaredProps.length ? [`Declared props are not used by the implementation body: ${unusedDeclaredProps.join(", ")}.`] : []),
    ...(statesMissingFromTypes.length ? [`Formal states are missing from TypeScript state union: ${statesMissingFromTypes.join(", ")}.`] : []),
    ...(statesMissingFromArtifact.length ? [`TypeScript state union exposes states missing from the formal artifact: ${statesMissingFromArtifact.join(", ")}.`] : []),
    ...contractStateIssues,
    ...contractGovernanceIssues,
    ...(controlledIssues.length ? controlledIssues : []),
    ...(rawGlobalDomRefs.length ? [`Source references browser globals directly: ${[...new Set(rawGlobalDomRefs)].join(", ")}.`] : []),
    ...(forbiddenPropsDeclared.length ? [`Forbidden inherited props are declared: ${forbiddenPropsDeclared.join(", ")}.`] : []),
    ...(hasUnsafeRestSpread ? ["Pattern spreads rest props without Flow/data/aria sanitization."] : []),
    ...(missingStructuralSurfaceUsage ? [`Structural Surface slots are not backed by the Surface primitive: ${surfaceSlots.join(", ")}.`] : []),
    ...(missingSurfaceSlotMarkers.length ? [`Structural Surface slots are missing data-flow-slot markers: ${missingSurfaceSlotMarkers.join(", ")}.`] : []),
    ...(missingAccessibilityImplementation ? ["Formal accessibility contract has no direct aria/role signals and no delegated accessible Flow component."] : []),
  ];
  return {
    patternId: id,
    source: sourceFile ? rel(sourceFile) : null,
    types: hasTypes ? rel(typeFile) : null,
    artifact: rel(artifactFile),
    primitiveDependencies: artifact.primitiveDependencies ?? [],
    governingFoundations: artifact.governingFoundations ?? [],
    structuralSurfaceSlots: surfaceSlots,
    formalAccessibility,
    directAccessibilitySignals,
    delegatedAccessibilityComponents,
    missingAccessibilityImplementation,
    hasSource,
    hasTypes,
    hasForwardRef,
    hasRefAttributes,
    hasDataFlowPattern,
    hasDensityProp,
    flowChildren: densityCascade.children,
    densityCascadeIssues: densityCascade.issues,
    statefulFlowChildren: stateCascade.children,
    directStateCascadeChildren: stateCascade.direct,
    boundaryStateCascadeChildren: stateCascade.boundary,
    stateCascadeIssues: stateCascade.issues,
    validatedLiteralProps: literalContracts.validated,
    literalContractIssues: literalContracts.issues,
    validatedFlowChildProps: propContracts.validated,
    propContractIssues: propContracts.issues,
    callbacks,
    testedCallbacks,
    missingCallbackTests,
    declaredProps: props,
    unusedDeclaredProps,
    formalStates,
    typedStates,
    statesMissingFromTypes,
    statesMissingFromArtifact,
    contractStateIssues,
    contractGovernanceIssues,
    controlledIssues,
    unusedCallbacks,
    rawGlobalDomRefs: [...new Set(rawGlobalDomRefs)],
    forbiddenPropsDeclared,
    hasUnsafeRestSpread,
    importsSurface,
    usesSurfaceElement,
    missingSurfaceSlotMarkers,
    missingStructuralSurfaceUsage: Boolean(missingStructuralSurfaceUsage),
    debts,
  };
}

function createReport() {
  const artifacts = listPatternArtifacts();
  const interactionTestSource = fs.existsSync(patternInteractionTestFile)
    ? fs.readFileSync(patternInteractionTestFile, "utf8")
    : "";
  const implementationById = new Map(listFiles(reactPatternDir, (file) => /^[A-Z].*\.js$/.test(path.basename(file)))
    .map((file) => [kebabCase(path.basename(file, ".js")), file]));
  const patterns = artifacts.map((artifact) => analyzePattern(artifact, implementationById, interactionTestSource));
  const inventory = {
    formalPatternArtifacts: artifacts.length,
    patternArchitecturePolicyIssues: patternArchitecturePolicy.issues.length,
    forbiddenTypePropPolicy: forbiddenTypeProps.length,
    controlledPropPairPolicy: Object.keys(controlledPropPairs).length,
    displayOnlyPropPolicy: Object.keys(displayOnlyProps).length,
    inheritedDomPropPolicy: inheritedDomProps.size,
    inheritedDomPropPrefixPolicy: inheritedDomPropPrefixes.length,
    accessibilityDelegatingComponentPolicy: accessibilityDelegatingComponents.size,
    patternContractGovernanceGroupPolicy: patternContractGovernanceGroups.size,
    literalContractPropPolicy: literalContractProps.length,
    stateCascadeCarrierPropPolicy: stateCascadeCarrierProps.length,
    patternRuntimeMarkerPolicy: Object.keys(patternRuntimeMarkers).length,
    patternContractRequiredHeadingPolicy: Object.keys(patternContractRequiredHeadings).length,
    implementedReactPatterns: patterns.filter((pattern) => pattern.hasSource).length,
    typedPatternDeclarations: patterns.filter((pattern) => pattern.hasTypes).length,
    forwardRefPatterns: patterns.filter((pattern) => pattern.hasForwardRef).length,
    patternsWithRefAttributes: patterns.filter((pattern) => pattern.hasRefAttributes).length,
    patternsWithDensityProp: patterns.filter((pattern) => pattern.hasDensityProp).length,
    flowChildElements: patterns.reduce((total, pattern) => total + pattern.flowChildren.length, 0),
    flowChildDensityCascadeIssues: patterns.reduce((total, pattern) => total + pattern.densityCascadeIssues.length, 0),
    statefulFlowChildElements: patterns.reduce((total, pattern) => total + pattern.statefulFlowChildren.length, 0),
    directStateCascadeChildren: patterns.reduce((total, pattern) => total + pattern.directStateCascadeChildren.length, 0),
    boundaryStateCascadeChildren: patterns.reduce((total, pattern) => total + pattern.boundaryStateCascadeChildren.length, 0),
    stateCascadeIssues: patterns.reduce((total, pattern) => total + pattern.stateCascadeIssues.length, 0),
    validatedFlowLiteralProps: patterns.reduce((total, pattern) => total + pattern.validatedLiteralProps.length, 0),
    flowLiteralContractIssues: patterns.reduce((total, pattern) => total + pattern.literalContractIssues.length, 0),
    validatedFlowChildProps: patterns.reduce((total, pattern) => total + pattern.validatedFlowChildProps.length, 0),
    flowChildPropContractIssues: patterns.reduce((total, pattern) => total + pattern.propContractIssues.length, 0),
    callbackPropsDeclared: patterns.reduce((total, pattern) => total + pattern.callbacks.length, 0),
    callbackPropsTested: patterns.reduce((total, pattern) => total + pattern.testedCallbacks.length, 0),
    missingCallbackTests: patterns.reduce((total, pattern) => total + pattern.missingCallbackTests.length, 0),
    declaredProps: patterns.reduce((total, pattern) => total + pattern.declaredProps.length, 0),
    unusedDeclaredProps: patterns.reduce((total, pattern) => total + pattern.unusedDeclaredProps.length, 0),
    unusedCallbackProps: patterns.reduce((total, pattern) => total + pattern.unusedCallbacks.length, 0),
    formalStates: patterns.reduce((total, pattern) => total + pattern.formalStates.length, 0),
    typedStates: patterns.reduce((total, pattern) => total + pattern.typedStates.length, 0),
    statesMissingFromTypes: patterns.reduce((total, pattern) => total + pattern.statesMissingFromTypes.length, 0),
    statesMissingFromArtifact: patterns.reduce((total, pattern) => total + pattern.statesMissingFromArtifact.length, 0),
    patternContractStateIssues: patterns.reduce((total, pattern) => total + pattern.contractStateIssues.length, 0),
    patternContractGovernanceIssues: patterns.reduce((total, pattern) => total + pattern.contractGovernanceIssues.length, 0),
    controlledPropPairs: patterns.reduce((total, pattern) => total + pattern.declaredProps
      .filter((prop) => Object.prototype.hasOwnProperty.call(controlledPropPairs, prop)
        && !(displayOnlyProps[path.basename(pattern.source ?? "", ".js")] ?? new Set()).has(prop))
      .length, 0),
    controlledPairIssues: patterns.reduce((total, pattern) => total + pattern.controlledIssues.length, 0),
    rawGlobalDomRefs: patterns.reduce((total, pattern) => total + pattern.rawGlobalDomRefs.length, 0),
    forbiddenPropsDeclared: patterns.reduce((total, pattern) => total + pattern.forbiddenPropsDeclared.length, 0),
    unsafeRestSpreads: patterns.filter((pattern) => pattern.hasUnsafeRestSpread).length,
    structuralSurfaceSlotPatterns: patterns.filter((pattern) => pattern.structuralSurfaceSlots.length).length,
    structuralSurfaceSlots: patterns.reduce((total, pattern) => total + pattern.structuralSurfaceSlots.length, 0),
    missingSurfaceSlotMarkers: patterns.reduce((total, pattern) => total + pattern.missingSurfaceSlotMarkers.length, 0),
    missingStructuralSurfaceUsage: patterns.filter((pattern) => pattern.missingStructuralSurfaceUsage).length,
    patternsWithAccessibilityContracts: patterns.filter((pattern) => pattern.formalAccessibility.length).length,
    patternsWithDirectAccessibilitySignals: patterns.filter((pattern) => pattern.directAccessibilitySignals > 0).length,
    patternsWithDelegatedAccessibility: patterns.filter((pattern) => pattern.delegatedAccessibilityComponents.length).length,
    missingAccessibilityImplementation: patterns.filter((pattern) => pattern.missingAccessibilityImplementation).length,
    missingDataFlowPattern: patterns.filter((pattern) => !pattern.hasDataFlowPattern).length,
    patternsWithBehaviorDebt: patterns.filter((pattern) => pattern.debts.length).length,
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => key !== "reactPatternBehaviorDebt" && inventory[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: inventory[key] }));
  const unexpectedInventoryMetrics = Object.keys(inventory)
    .filter((key) => expectedInventory[key] === undefined)
    .sort()
    .map((key) => ({ key, actual: inventory[key] }));
  inventory.reactPatternBehaviorDebt = patterns.reduce((total, pattern) => total + pattern.debts.length, 0)
    + patternArchitecturePolicy.issues.length
    + baselineMismatches.length
    + unexpectedInventoryMetrics.length;
  return {
    status: inventory.reactPatternBehaviorDebt ? "fail" : "pass",
    audit: "react pattern behavior governance",
    principle: "React patterns must be primary Flow implementations with typed refs, wired events, density cascade, sanitized extensibility, and structural primitive ownership for Surface-backed slots.",
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
      unexpectedInventoryMetrics,
    },
    patterns,
  };
}

function toMarkdown(report) {
  const inventoryRows = Object.entries(report.inventory).map(([key, value]) => `| ${key} | ${value} |`);
  const mismatchRows = report.baseline.mismatches.map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const unexpectedMetricRows = report.baseline.unexpectedInventoryMetrics.map((item) => `| ${item.key} | ${item.actual} |`);
  const patternRows = report.patterns.map((pattern) => `| ${pattern.patternId} | ${pattern.hasSource ? "yes" : "no"} | ${pattern.hasForwardRef ? "yes" : "no"} | ${pattern.hasRefAttributes ? "yes" : "no"} | ${pattern.hasDensityProp ? "yes" : "no"} | ${pattern.flowChildren.length} | ${pattern.densityCascadeIssues.join("; ") || "None"} | ${pattern.statefulFlowChildren.length} | ${pattern.directStateCascadeChildren.length} | ${pattern.boundaryStateCascadeChildren.length} | ${pattern.stateCascadeIssues.join("; ") || "None"} | ${pattern.validatedLiteralProps.length} | ${pattern.literalContractIssues.join("; ") || "None"} | ${pattern.callbacks.join(", ") || "None"} | ${pattern.testedCallbacks.length}/${pattern.callbacks.length} | ${pattern.missingCallbackTests.join(", ") || "None"} | ${pattern.unusedDeclaredProps.join(", ") || "None"} | ${pattern.controlledIssues.join(" ") || "None"} | ${pattern.formalStates.length}/${pattern.typedStates.length} | ${pattern.statesMissingFromTypes.join(", ") || "None"} | ${pattern.statesMissingFromArtifact.join(", ") || "None"} | ${pattern.contractStateIssues.join(" ") || "None"} | ${pattern.contractGovernanceIssues.join(" ") || "None"} | ${pattern.formalAccessibility.length} | ${pattern.directAccessibilitySignals} | ${pattern.delegatedAccessibilityComponents.join(", ") || "None"} | ${pattern.structuralSurfaceSlots.join(", ") || "None"} | ${pattern.missingSurfaceSlotMarkers.join(", ") || "None"} | ${pattern.missingStructuralSurfaceUsage ? "yes" : "no"} | ${pattern.debts.join(" ") || "None"} |`);
  return [
    "# React Pattern Behavior Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    "| Metric | Value |",
    "| --- | ---: |",
    ...inventoryRows,
    "",
    "## Baseline Mismatches",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...(mismatchRows.length ? mismatchRows : ["| None | None | None |"]),
    "",
    "## Unexpected Inventory Metrics",
    "",
    "| Metric | Actual |",
    "| --- | ---: |",
    ...(unexpectedMetricRows.length ? unexpectedMetricRows : ["| None | None |"]),
    "",
    "## Pattern Contract Matrix",
    "",
    "| Pattern | Source | forwardRef | RefAttributes | Density prop | Flow children | Density cascade issues | Stateful children | Direct state cascade | Boundary state cascade | State cascade issues | Literal props checked | Literal contract issues | Callback props | Callback tests | Missing callback tests | Unused declared props | Controlled issues | States formal/typed | Missing typed states | Missing artifact states | Contract state issues | Contract governance issues | A11y contract items | Direct a11y signals | Delegated a11y components | Structural Surface slots | Missing Surface slot markers | Missing Surface usage | Debt |",
    "| --- | --- | --- | --- | --- | ---: | --- | ---: | ---: | ---: | --- | ---: | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- |",
    ...(patternRows.length ? patternRows : ["| None | no | no | no | no | 0 | None | 0 | 0 | 0 | None | 0 | None | None | 0/0 | None | None | None | 0/0 | None | None | None | None | 0 | 0 | None | None | None | no | None |"]),
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
  if (checkMode) {
    const existing = fs.existsSync(jsonOutput) ? readJson(jsonOutput) : null;
    if (!existing || JSON.stringify(existing) !== JSON.stringify(report)) {
      console.error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-react-pattern-behavior-governance.js.`);
      process.exitCode = 1;
      return;
    }
  } else {
    writeReport(report);
  }
  if (report.status !== "pass") process.exitCode = 1;
  console.log(JSON.stringify({
    status: report.status,
    audit: report.audit,
    inventory: report.inventory,
  }, null, 2));
}

main();
