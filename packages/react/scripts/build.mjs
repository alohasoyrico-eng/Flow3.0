import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

function rewritePublishedImports(source) {
  return source
    .replaceAll('"@design-system/components/platforms"', '"../../components/src/platforms/index.js"')
    .replaceAll('"@design-system/components"', '"../../components/src/index.js"');
}

for (const file of fs.readdirSync(src).filter((entry) => entry.endsWith(".js") || entry.endsWith(".d.ts"))) {
  const source = fs.readFileSync(path.join(src, file), "utf8");
  fs.writeFileSync(path.join(dist, file), rewritePublishedImports(source));
}

console.log(JSON.stringify({ status: "pass", package: "@design-system/react", outDir: "dist" }));
