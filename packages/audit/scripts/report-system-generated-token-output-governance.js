const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../..");
const SOURCE_DIR = path.join(ROOT, "packages/tokens/source");
const MANIFEST = path.join(ROOT, "packages/tokens/dist/token-output-manifest.json");
const OUT_JSON = path.join(ROOT, "docs/audits/system-generated-token-output-governance.json");
const OUT_MD = path.join(ROOT, "docs/audits/system-generated-token-output-governance.md");
const CHECK = process.argv.includes("--check");

function sha256Content(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function walkTokenFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTokenFiles(fullPath, out);
    if (entry.isFile() && entry.name.endsWith(".tokens.json")) out.push(fullPath);
  }
  return out.sort();
}

function mergedSourceSnapshot() {
  const mergedTokens = {};
  for (const file of walkTokenFiles(SOURCE_DIR)) {
    const tokens = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const [name, token] of Object.entries(tokens)) {
      if (Object.prototype.hasOwnProperty.call(mergedTokens, name)) {
        throw new Error(`Duplicate token "${name}" while auditing generated output governance`);
      }
      mergedTokens[name] = token;
    }
  }
  return {
    content: `${JSON.stringify(mergedTokens, null, 2)}\n`,
    tokenCount: Object.keys(mergedTokens).length,
  };
}

function gate(id, passed, evidence, failMessage) {
  return {
    id,
    status: passed ? "PASS" : "FAIL",
    evidence,
    failMessage: passed ? null : failMessage,
  };
}

function main() {
  const manifestExists = fs.existsSync(MANIFEST);
  const manifest = manifestExists ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : null;
  const source = mergedSourceSnapshot();
  const sourceHash = sha256Content(source.content);
  const outputRows = (manifest?.outputs ?? []).map((output) => {
    const fullPath = path.join(ROOT, output.file);
    const exists = fs.existsSync(fullPath);
    const actualSha = exists ? sha256File(fullPath) : null;
    return {
      file: output.file,
      exists,
      expectedSha: output.sha256,
      actualSha,
      matchesManifest: exists && actualSha === output.sha256,
    };
  });
  const gates = [
    gate(
      "generated-output-manifest-exists",
      manifestExists,
      { file: path.relative(ROOT, MANIFEST), exists: manifestExists },
      "Generated token output manifest is missing. Run npm run build:tokens.",
    ),
    gate(
      "token-source-matches-manifest",
      Boolean(manifest) && manifest.source?.sha256 === sourceHash && manifest.source?.tokenCount === source.tokenCount,
      {
        manifestSourceSha: manifest?.source?.sha256 ?? null,
        actualSourceSha: sourceHash,
        manifestTokenCount: manifest?.source?.tokenCount ?? null,
        actualTokenCount: source.tokenCount,
      },
      "Token source changed without regenerating outputs. Run npm run build:tokens.",
    ),
    gate(
      "generated-outputs-match-manifest",
      outputRows.length > 0 && outputRows.every((row) => row.matchesManifest),
      { outputs: outputRows },
      "One or more generated token outputs differ from the build manifest.",
    ),
  ];
  const status = gates.every((item) => item.status === "PASS") ? "PASS" : "FAIL";
  const report = {
    generatedAt: new Date().toISOString(),
    scope: "Generated token output edit governance",
    status,
    manifest: manifestExists ? path.relative(ROOT, MANIFEST) : null,
    totals: {
      outputs: outputRows.length,
      matchingOutputs: outputRows.filter((row) => row.matchesManifest).length,
      tokenCount: source.tokenCount,
    },
    gates,
    outputs: outputRows,
  };
  const consoleSummary = {
    status,
    totals: report.totals,
    gates: gates.map((item) => [item.id, item.status]),
  };

  if (CHECK) {
    console.log(JSON.stringify(consoleSummary, null, 2));
    if (status !== "PASS") process.exitCode = 1;
    return;
  }

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`);

  const lines = [
    "# Generated Token Output Governance",
    "",
    `Status: **${status}**`,
    "",
    "This report compares current token source and generated outputs against the build manifest produced by `npm run build:tokens`.",
    "",
    "## Gates",
    "",
    "| Gate | Status | Evidence |",
    "| --- | --- | --- |",
    ...gates.map((item) => `| \`${item.id}\` | ${item.status} | \`${JSON.stringify(item.evidence)}\` |`),
    "",
    "## Outputs",
    "",
    "| File | Status |",
    "| --- | --- |",
    ...outputRows.map((row) => `| \`${row.file}\` | ${row.matchesManifest ? "PASS" : "FAIL"} |`),
    "",
  ];
  fs.writeFileSync(OUT_MD, `${lines.join("\n")}\n`);

  console.log(JSON.stringify(consoleSummary, null, 2));
  if (status !== "PASS") process.exitCode = 1;
}

main();
