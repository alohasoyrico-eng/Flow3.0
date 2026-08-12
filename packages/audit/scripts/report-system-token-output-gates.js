const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../..");
const TOKEN_CONTRACT = path.join(ROOT, "packages/tokens/tokens.json");
const OUT_JSON = path.join(ROOT, "docs/audits/system-token-output-gates.json");
const OUT_MD = path.join(ROOT, "docs/audits/system-token-output-gates.md");

const outputs = [
  {
    id: "css",
    file: "packages/tokens/styles/tokens.css",
    count(content) {
      return (content.match(/^\s*--[a-z0-9-]+:/gm) ?? []).length;
    },
  },
  {
    id: "json",
    file: "packages/tokens/tokens.json",
    count(content) {
      return Object.keys(JSON.parse(content).tokens ?? {}).length;
    },
  },
  {
    id: "typescript",
    file: "packages/tokens/src/generated/tokens.ts",
    count(content) {
      return (content.match(/^\s{2}\| "/gm) ?? []).length;
    },
  },
  {
    id: "flutter-dart",
    file: "packages/tokens/dist/flutter/flow_tokens.dart",
    count(content) {
      return (content.match(/^\s{4}"/gm) ?? []).length;
    },
  },
  {
    id: "android-xml",
    file: "packages/tokens/dist/android/flow_tokens.xml",
    count(content) {
      return (content.match(/<string name="/g) ?? []).length;
    },
  },
  {
    id: "ios-swift",
    file: "packages/tokens/dist/ios/FlowTokens.swift",
    count(content) {
      return (content.match(/^\s{4}"/gm) ?? []).length;
    },
  },
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
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
  const tokenCount = Object.keys(JSON.parse(fs.readFileSync(TOKEN_CONTRACT, "utf8")).tokens ?? {}).length;
  const outputRows = outputs.map((output) => {
    const fullPath = path.join(ROOT, output.file);
    const exists = fs.existsSync(fullPath);
    const count = exists ? output.count(read(output.file)) : 0;
    return {
      id: output.id,
      file: output.file,
      exists,
      tokenCount: count,
      matchesContract: exists && count === tokenCount,
    };
  });
  const gates = [
    gate(
      "contract-has-tokens",
      tokenCount > 0,
      { tokenCount },
      "Token contract is empty.",
    ),
    ...outputRows.map((row) => gate(
      `${row.id}-output-matches-contract`,
      row.matchesContract,
      row,
      `${row.id} output is missing or does not match the JSON contract token count.`,
    )),
  ];
  const status = gates.every((item) => item.status === "PASS") ? "PASS" : "FAIL";
  const report = {
    generatedAt: new Date().toISOString(),
    scope: "Style Dictionary multiplatform output gates",
    status,
    tokenCount,
    outputs: outputRows,
    gates,
  };
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`);

  const lines = [
    "# Token Output Gates",
    "",
    `Status: **${status}**`,
    "",
    `Contract token count: ${tokenCount}`,
    "",
    "| Output | Status | Tokens | File |",
    "| --- | --- | ---: | --- |",
    ...outputRows.map((row) => `| ${row.id} | ${row.matchesContract ? "PASS" : "FAIL"} | ${row.tokenCount} | \`${row.file}\` |`),
    "",
  ];
  fs.writeFileSync(OUT_MD, `${lines.join("\n")}\n`);
  console.log(JSON.stringify({
    status,
    tokenCount,
    outputs: outputRows.map((row) => [row.id, row.tokenCount, row.matchesContract ? "PASS" : "FAIL"]),
  }, null, 2));
  if (status !== "PASS") process.exitCode = 1;
}

main();
