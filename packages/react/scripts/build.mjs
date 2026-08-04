import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of fs.readdirSync(src).filter((entry) => entry.endsWith(".js") || entry.endsWith(".d.ts"))) {
  fs.copyFileSync(path.join(src, file), path.join(dist, file));
}

console.log(JSON.stringify({ status: "pass", package: "@design-system/react", outDir: "dist" }));
