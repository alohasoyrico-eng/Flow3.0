import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const PRIMITIVES_META = path.join(ROOT, "packages/specs/specs/unison-system/meta/primitivefamilies.json");
const PRIMITIVES_DIR = path.join(ROOT, "packages/specs/specs/unison-system/artifacts/primitives");
const TOKENS_CONTRACT = path.join(ROOT, "packages/tokens/tokens.json");
const OUT_DIR = path.join(ROOT, "packages/tokens/src/primitives");

const P0_RUNTIME_PRIMITIVES = new Set([
  "Color",
  "Typography",
  "Spacing",
  "Radius",
  "Elevation",
  "Density",
  "Focus",
  "Surface",
  "Breakpoints",
  "Disabled",
  "Loading",
  "Duration",
  "Motion Curves",
  "Measurement",
  "Message",
  "Field Action",
  "Charts",
  "Maps",
]);

const POLICY_PRIMITIVES = new Set([
  "Iconography",
  "Library Sources",
  "Country Flags",
  "Animation Assets",
  "Illustration Assets",
  "Research",
]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function slugify(name) {
  return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function camelCase(slug) {
  return slug.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function tokenMatchesPrimitive(tokenName, primitive) {
  const slug = primitive.slug;
  const compactSlug = slug.replace(/-/g, "");
  if (tokenName.startsWith(`sys-${slug}-`)) return true;
  if (tokenName.startsWith(`ref-${slug}-`)) return true;
  if (tokenName.startsWith(`${slug}-`)) return true;
  if (slug === "color" && tokenName.startsWith("sys-color-")) return true;
  if (slug === "typography" && tokenName.startsWith("sys-voice-")) return true;
  if (slug === "spacing" && (tokenName.startsWith("sys-space-") || tokenName.startsWith("sys-spacing-"))) return true;
  if (slug === "radius" && tokenName.startsWith("sys-radius-")) return true;
  if (slug === "elevation" && tokenName.startsWith("sys-elevation-")) return true;
  if (slug === "motion-curves" && tokenName.startsWith("sys-motion-")) return true;
  if (slug === "duration" && tokenName.startsWith("sys-duration-")) return true;
  if (slug === "breakpoints" && tokenName.startsWith("sys-breakpoint-")) return true;
  if (slug === "density" && (tokenName.startsWith("sys-density-") || tokenName.startsWith("density-"))) return true;
  if (slug === "field-action" && tokenName.startsWith("sys-field-action-")) return true;
  if (slug === "surface" && (tokenName.startsWith("sys-color-surface") || tokenName.includes("surface"))) return true;
  if (slug === "charts" && (tokenName.startsWith("sys-chart-") || tokenName.startsWith("chart-"))) return true;
  if (slug === "maps" && (tokenName.startsWith("sys-map-") || tokenName.startsWith("map-"))) return true;
  return tokenName.startsWith(`sys-${compactSlug}-`) || tokenName.startsWith(`ref-${compactSlug}-`);
}

function loadPrimitive(name) {
  const slug = slugify(name);
  const artifact = readJson(path.join(PRIMITIVES_DIR, `${slug}.json`)).artifacts.primitives[slug];
  return {
    name,
    slug,
    purpose: artifact.purpose,
    governingFoundations: artifact.governingFoundations ?? [],
    coordinatesPrimitives: artifact.coordinatesPrimitives ?? [],
    roles: (artifact.roles ?? []).map((role) => ({
      id: role.id,
      token: role.token,
      use: role.use,
    })),
    states: artifact.states ?? [],
    tokenDependencies: artifact.tokenDependencies ?? [],
    rejectIf: artifact.rejectIf ?? [],
    p0RuntimeRequired: P0_RUNTIME_PRIMITIVES.has(name),
    policyPrimitive: POLICY_PRIMITIVES.has(name),
  };
}

function primitiveFile(primitive, tokenNames) {
  const exportName = `${camelCase(primitive.slug)}Primitive`;
  const tokenTypeName = `${exportName[0].toUpperCase()}${exportName.slice(1)}TokenName`;
  return [
    "import type { FlowTokenName } from \"../generated/tokens\";",
    "import { createPrimitiveTokenResolver } from \"./runtime\";",
    "",
    `export type ${tokenTypeName} = Extract<FlowTokenName, ${tokenNames.map((name) => JSON.stringify(name)).join(" | ") || "never"}>;`,
    "",
    `export const ${exportName} = {`,
    `  name: ${JSON.stringify(primitive.name)},`,
    `  slug: ${JSON.stringify(primitive.slug)},`,
    `  layer: "Primitive",`,
    `  runtimeKind: ${JSON.stringify(primitive.p0RuntimeRequired ? "runtime-contract" : "policy-contract")},`,
    `  p0RuntimeRequired: ${primitive.p0RuntimeRequired},`,
    `  policyPrimitive: ${primitive.policyPrimitive},`,
    `  purpose: ${JSON.stringify(primitive.purpose)},`,
    `  governingFoundations: ${JSON.stringify(primitive.governingFoundations, null, 2)},`,
    `  coordinatesPrimitives: ${JSON.stringify(primitive.coordinatesPrimitives, null, 2)},`,
    `  tokenDependencies: ${JSON.stringify(primitive.tokenDependencies, null, 2)},`,
    `  roles: ${JSON.stringify(primitive.roles, null, 2)},`,
    `  states: ${JSON.stringify(primitive.states, null, 2)},`,
    `  rejectIf: ${JSON.stringify(primitive.rejectIf, null, 2)},`,
    `  tokenNames: ${JSON.stringify(tokenNames, null, 2)} as const satisfies readonly ${tokenTypeName}[],`,
    `  token: createPrimitiveTokenResolver<${tokenTypeName}>(${JSON.stringify(tokenNames)}),`,
    "} as const;",
    "",
  ].join("\n");
}

function runtimeFile() {
  return [
    "import { flowTokens } from \"../generated/tokens\";",
    "import type { FlowTokenName, FlowToken } from \"../generated/tokens\";",
    "",
    "export type PrimitiveTokenResolver<TName extends FlowTokenName> = {",
    "  readonly names: readonly TName[];",
    "  readonly has: (name: FlowTokenName | string) => name is TName;",
    "  readonly get: (name: TName) => FlowToken;",
    "  readonly cssVariable: (name: TName) => `var(--${string})`;",
    "};",
    "",
    "export function createPrimitiveTokenResolver<TName extends FlowTokenName>(",
    "  names: readonly TName[],",
    "): PrimitiveTokenResolver<TName> {",
    "  const allowed = new Set<string>(names);",
    "  return {",
    "    names,",
    "    has(name): name is TName {",
    "      return allowed.has(String(name));",
    "    },",
    "    get(name) {",
    "      return flowTokens[name];",
    "    },",
    "    cssVariable(name) {",
    "      return `var(${flowTokens[name].cssVariable})`;",
    "    },",
    "  };",
    "}",
    "",
  ].join("\n");
}

function indexFile(primitives) {
  return [
    "export * from \"./runtime\";",
    ...primitives.map((primitive) => `export * from "./${primitive.slug}";`),
    "",
  ].join("\n");
}

const primitiveNames = readJson(PRIMITIVES_META).primitiveFamilies;
const primitives = primitiveNames.map(loadPrimitive);
const tokenNames = Object.keys(readJson(TOKENS_CONTRACT).tokens).sort();

write(path.join(OUT_DIR, "runtime.ts"), runtimeFile());
for (const primitive of primitives) {
  const matches = tokenNames.filter((name) => tokenMatchesPrimitive(name, primitive));
  write(path.join(OUT_DIR, `${primitive.slug}.ts`), primitiveFile(primitive, matches));
}
write(path.join(OUT_DIR, "index.ts"), indexFile(primitives));

console.log(JSON.stringify({
  primitives: primitives.length,
  files: primitives.length + 2,
  outDir: path.relative(ROOT, OUT_DIR),
}, null, 2));
