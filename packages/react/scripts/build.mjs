import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

function rewritePublishedImports(source) {
  return source
    .replaceAll('"@design-system/components/platforms"', '"#flow/platforms"')
    .replaceAll('"@design-system/components"', '"#flow/components"');
}

function copySourceTree(fromDir, toDir) {
  fs.mkdirSync(toDir, { recursive: true });
  for (const entry of fs.readdirSync(fromDir, { withFileTypes: true })) {
    const from = path.join(fromDir, entry.name);
    const to = path.join(toDir, entry.name);
    if (entry.isDirectory()) {
      copySourceTree(from, to);
      continue;
    }
    if (!entry.name.endsWith(".js") && !entry.name.endsWith(".d.ts")) continue;
    const source = fs.readFileSync(from, "utf8");
    fs.writeFileSync(to, rewritePublishedImports(source));
  }
}

copySourceTree(src, dist);

console.log(JSON.stringify({ status: "pass", package: "@design-system/react", outDir: "dist" }));
