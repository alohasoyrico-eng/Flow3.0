const { fs, path, root, read, add } = require("./audit-context.js");
const { checkRuntimeDomMutationContract } = require("./react-runtime-dom-mutation-audit.js");
const { governedReactPrimitivesPolicy } = require("./react-primary-governance-policy.js");

const reactSrcDir = path.join(root, "packages/react/src");
const reactDistDir = path.join(root, "packages/react/dist");
const reactIndexFile = path.join(reactSrcDir, "index.js");
const reactTypesIndexFile = path.join(reactSrcDir, "index.d.ts");
const reactPackageFile = path.join(root, "packages/react/package.json");
const rootPackageFile = path.join(root, "package.json");

const primitivePolicy = governedReactPrimitivesPolicy();
const governedReactPrimitiveExports = primitivePolicy.exports;
const governedReactPrimitiveSources = primitivePolicy.primitives;

function checkReactPrimitiveSources(shared) {
  for (const issue of primitivePolicy.governance.issues) {
    add("errors", reactSrcDir, 1, issue);
  }
  for (const primitive of governedReactPrimitiveSources) {
    const sourceFile = path.join(reactSrcDir, primitive.file);
    const typesFile = path.join(reactSrcDir, primitive.typeFile);
    const distFile = path.join(reactDistDir, primitive.file);
    const distTypesFile = path.join(reactDistDir, primitive.typeFile);
    const source = fs.existsSync(sourceFile) ? read(sourceFile) : "";
    const types = fs.existsSync(typesFile) ? read(typesFile) : "";
    const dist = fs.existsSync(distFile) ? read(distFile) : "";
    const distTypes = fs.existsSync(distTypesFile) ? read(distTypesFile) : "";
    const propsName = `${primitive.name}Props`;
    const componentName = `${primitive.name}Component`;

    for (const requiredFile of [sourceFile, typesFile, distFile, distTypesFile]) {
      if (!fs.existsSync(requiredFile)) {
        add("errors", requiredFile, 1, `${primitive.name} React primitive must have source and built dist artifacts.`);
      }
    }
    for (const snippet of [
      "forwardRef(function",
      `export const ${primitive.name} = forwardRef`,
      `${primitive.name}.displayName = "${primitive.name}"`,
      primitive.dataAttribute,
      "flowRestProps(rest)",
      "flowDensityProps(resolvedDensity)",
      "React.createElement(",
    ]) {
      if (!source.includes(snippet)) {
        add("errors", sourceFile, 1, `${primitive.name} React primitive source missing governed primitive snippet: ${snippet}.`);
      }
    }
    for (const snippet of [
      "ForwardRefExoticComponent",
      "RefAttributes<",
      "FlowDataAttributes",
      `export interface ${propsName}`,
      `export interface ${componentName}`,
      `displayName: "${primitive.name}"`,
      `export const ${primitive.name}: ${componentName}`,
    ]) {
      if (!types.includes(snippet)) {
        add("errors", typesFile, 1, `${primitive.name} React primitive types missing governed primitive snippet: ${snippet}.`);
      }
    }
    checkPrimitiveIndexesAndExports({ primitive, shared });
    checkPrimitivePublishedArtifacts({ primitive, distFile, distTypesFile, dist, distTypes });
    checkPrimitiveSourceEscapes({ primitive, sourceFile, source });
  }
}

function checkPrimitiveIndexesAndExports({ primitive, shared }) {
  const propsName = `${primitive.name}Props`;
  const componentName = `${primitive.name}Component`;
  if (!shared.reactIndex.includes(`export { ${primitive.name} } from "./${primitive.file}"`)) {
    add("errors", reactIndexFile, 1, `React index must export ${primitive.name} from ${primitive.file}.`);
  }
  if (!shared.reactTypesIndex.includes(`${propsName}`) || !shared.reactTypesIndex.includes(`${componentName}`)) {
    add("errors", reactTypesIndexFile, 1, `React type index must export ${primitive.name} props and component contracts.`);
  }
  const reactExport = shared.reactPackage.exports?.[primitive.packagePath];
  if (!reactExport || reactExport.default !== `./dist/${primitive.file}` || reactExport.types !== `./dist/${primitive.typeFile}`) {
    add("errors", reactPackageFile, 1, `@design-system/react must export ${primitive.packagePath} with primitive default and types dist targets.`);
  }
  const rootReactExport = shared.rootPackage.exports?.[primitive.rootPackagePath];
  if (!rootReactExport || rootReactExport.default !== `./packages/react/dist/${primitive.file}` || rootReactExport.types !== `./packages/react/dist/${primitive.typeFile}`) {
    add("errors", rootPackageFile, 1, `Root package must export ${primitive.rootPackagePath} with primitive React dist default and types targets.`);
  }
}

function checkPrimitivePublishedArtifacts({ primitive, distFile, distTypesFile, dist, distTypes }) {
  for (const [artifact, artifactSource] of [[distFile, dist], [distTypesFile, distTypes]]) {
    if (artifactSource.includes("@design-system/components") || artifactSource.includes("../../components/src")) {
      add("errors", artifact, 1, `${primitive.name} published React primitive must not depend on workspace component internals.`);
    }
    if (artifactSource.includes("apps/docs") || artifactSource.includes("#design-system/docs")) {
      add("errors", artifact, 1, `${primitive.name} published React primitive must not depend on docs.`);
    }
    for (const match of artifactSource.matchAll(/from\s+"(\.[^"]+)"/g)) {
      const importPath = match[1];
      const resolved = path.join(path.dirname(artifact), importPath);
      const candidates = path.extname(resolved) ? [resolved] : [`${resolved}.js`, `${resolved}.d.ts`];
      if (!candidates.some((candidate) => fs.existsSync(candidate))) {
        add("errors", artifact, 1, `${primitive.name} published React primitive imports missing local file ${importPath}.`);
      }
    }
  }
}

function checkPrimitiveSourceEscapes({ primitive, sourceFile, source }) {
  if (source.includes("innerHTML") || source.includes("insertAdjacentHTML")) {
    add("errors", sourceFile, 1, `${primitive.name} React primitive must not inject HTML strings as a parallel DOM implementation.`);
  }
  if (source.search(/\brest\.style\b/) >= 0 || source.search(/^\s*\.\.\.rest,\s*$/m) >= 0) {
    add("errors", sourceFile, 1, `${primitive.name} React primitive must sanitize rest props with flowRestProps(rest).`);
  }
  checkRuntimeDomMutationContract({ name: primitive.name, sourceFile, source });
}

module.exports = { checkReactPrimitiveSources, governedReactPrimitiveExports };
