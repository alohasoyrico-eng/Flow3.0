const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "../../..");
const OUT_JSON = path.join(ROOT, "docs/audits/system-typescript-project-setup.json");
const OUT_MD = path.join(ROOT, "docs/audits/system-typescript-project-setup.md");
const CHECK = process.argv.includes("--check");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function gate(id, passed, evidence, failMessage) {
  return {
    id,
    status: passed ? "PASS" : "FAIL",
    evidence,
    failMessage: passed ? null : failMessage,
  };
}

function runTypecheck() {
  const bin = path.join(ROOT, "node_modules/.bin/tsc");
  const result = spawnSync(bin, ["--noEmit", "--project", "tsconfig.json"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "pipe",
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function main() {
  const packageJson = readJson("package.json");
  const tsconfigExists = exists("tsconfig.json");
  const tsconfig = tsconfigExists ? readJson("tsconfig.json") : {};
  const compilerOptions = tsconfig.compilerOptions ?? {};
  const include = Array.isArray(tsconfig.include) ? tsconfig.include : [];
  const typecheck = runTypecheck();
  const gates = [
    gate(
      "tsconfig-exists",
      tsconfigExists,
      { file: "tsconfig.json", exists: tsconfigExists },
      "Root tsconfig.json is missing.",
    ),
    gate(
      "typecheck-script-owned",
      packageJson.scripts?.typecheck === "tsc --noEmit --project tsconfig.json",
      { typecheckScript: packageJson.scripts?.typecheck ?? null },
      "package.json must expose typecheck through tsc --noEmit --project tsconfig.json.",
    ),
    gate(
      "strict-no-emit-configuration",
      compilerOptions.strict === true
        && compilerOptions.noEmit === true
        && compilerOptions.allowJs === false,
      {
        strict: compilerOptions.strict ?? null,
        noEmit: compilerOptions.noEmit ?? null,
        allowJs: compilerOptions.allowJs ?? null,
      },
      "TypeScript setup must be strict, noEmit, and must not typecheck JS as a substitute for TS migration.",
    ),
    gate(
      "typed-source-included",
      include.includes("packages/tokens/src/**/*.ts")
        && include.includes("packages/tokens/src/**/*.tsx")
        && include.includes("packages/components/src/contracts.ts")
        && include.includes("packages/components/src/index.ts")
        && include.includes("packages/components/src/registry.ts")
        && include.includes("packages/components/src/platforms/**/*.ts")
        && include.includes("packages/components/src/primitives/**/*.ts")
        && include.includes("packages/react/src/internal/**/*.ts")
        && include.includes("packages/react/src/Surface.tsx")
        && include.includes("packages/react/src/Button.tsx")
        && include.includes("packages/react/src/Input.tsx")
        && include.includes("packages/react/src/Card.tsx")
        && include.includes("packages/react/src/Tabs.tsx")
        && include.includes("packages/react/src/Dialog.tsx")
        && include.includes("packages/react/src/Drawer.tsx")
        && include.includes("packages/react/src/Menu.tsx")
        && include.includes("packages/react/src/Popover.tsx"),
      { include },
      "tsconfig must include the current real TypeScript source surface.",
    ),
    gate(
      "tsc-no-emit-passes",
      typecheck.status === 0,
      {
        status: typecheck.status,
        stdout: typecheck.stdout.slice(-2000),
        stderr: typecheck.stderr.slice(-2000),
      },
      "tsc --noEmit --project tsconfig.json failed.",
    ),
  ];
  const status = gates.every((item) => item.status === "PASS") ? "pass" : "fail";
  const typescriptProjectSetupDebt = gates.filter((item) => item.status !== "PASS").length;
  const report = {
    generatedAt: new Date().toISOString(),
    scope: "TypeScript project setup checkpoint",
    status,
    typescriptProjectSetupDebt,
    gates,
    tsconfig: {
      compilerOptions,
      include,
      exclude: tsconfig.exclude ?? [],
    },
  };
  const summary = {
    status,
    typescriptProjectSetupDebt,
    gates: gates.map((item) => [item.id, item.status]),
  };

  if (CHECK) {
    console.log(JSON.stringify(summary, null, 2));
    if (status !== "pass") process.exitCode = 1;
    return;
  }

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`);
  const lines = [
    "# TypeScript Project Setup",
    "",
    `Status: **${status}**`,
    "",
    `TypeScript project setup debt: ${typescriptProjectSetupDebt}`,
    "",
    "## Gates",
    "",
    "| Gate | Status | Evidence |",
    "| --- | --- | --- |",
    ...gates.map((item) => `| \`${item.id}\` | ${item.status} | \`${JSON.stringify(item.evidence)}\` |`),
    "",
  ];
  fs.writeFileSync(OUT_MD, `${lines.join("\n")}\n`);
  console.log(JSON.stringify(summary, null, 2));
  if (status !== "pass") process.exitCode = 1;
}

main();
