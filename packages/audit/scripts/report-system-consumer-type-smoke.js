#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-consumer-type-smoke.json");
const markdownOutput = path.join(outputDir, "system-consumer-type-smoke.md");
const checkMode = process.argv.includes("--check");

function run(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed:\n${result.stdout}\n${result.stderr}`);
  }
  return result;
}

function dependencyPackagePath(packageName) {
  return `file:${fs.realpathSync(path.join(root, "node_modules", packageName))}`;
}

function packFlow(cacheDir) {
  const result = run("npm", ["pack", "--json", "--ignore-scripts"], root, {
    npm_config_cache: cacheDir,
  });
  const pack = JSON.parse(result.stdout)[0];
  const tarball = path.join(root, pack.filename);
  if (!fs.existsSync(tarball)) throw new Error(`npm pack did not create ${pack.filename}.`);
  return { pack, tarball };
}

function writeConsumerPackage(consumerDir, tarball) {
  const packageJson = {
    private: true,
    type: "module",
    dependencies: {
      "@alohasoyrico-eng/flow": `file:${tarball}`,
      "@types/react": dependencyPackagePath("@types/react"),
      "@types/react-dom": dependencyPackagePath("@types/react-dom"),
      react: dependencyPackagePath("react"),
      "react-dom": dependencyPackagePath("react-dom"),
    },
  };
  fs.writeFileSync(path.join(consumerDir, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
}

function writeTypeSmoke(consumerDir) {
  const tsconfig = {
    compilerOptions: {
      module: "NodeNext",
      moduleResolution: "NodeNext",
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: "ES2022",
      jsx: "react-jsx",
    },
    include: ["consumer-types.tsx"],
  };
  fs.writeFileSync(path.join(consumerDir, "tsconfig.json"), `${JSON.stringify(tsconfig, null, 2)}\n`);
  const source = `
import React from "react";
import {
  Button,
  Card,
  CodeBlock,
  Input,
  Select,
  Table,
  type ButtonProps,
  type CardProps,
  type CodeBlockProps,
  type InputProps,
  type SelectProps,
  type TableProps,
} from "@alohasoyrico-eng/flow/react";
import {
  Search,
  Sidebar,
  Topbar,
  DocumentationHero,
  DocumentationSection,
  DemoPreviewFrame,
  ArtifactMetadataBar,
  OnThisPageNav,
  type SearchProps,
  type SidebarProps,
  type TopbarProps,
  type DocumentationHeroProps,
  type DocumentationSectionProps,
  type DemoPreviewFrameProps,
  type ArtifactMetadataBarProps,
  type OnThisPageNavProps,
} from "@alohasoyrico-eng/flow/react/patterns";
import {
  DocsShellTemplate,
  DocsHomeTemplate,
  ComponentDetailTemplate,
  PatternDetailTemplate,
  FleetDashboardSuite,
  type DocsShellTemplateProps,
  type DocsHomeTemplateProps,
  type ComponentDetailTemplateProps,
  type PatternDetailTemplateProps,
  type FleetDashboardSuiteProps,
} from "@alohasoyrico-eng/flow/react/templates";

const buttonProps: ButtonProps = {
  label: "Continue",
  variant: "primary",
  density: "md",
  onClick: (event) => event.currentTarget.focus(),
};
const cardProps: CardProps = {
  title: "Fleet health",
  value: "96%",
  actions: [{ label: "Review", variant: "secondary" }],
};
const inputProps: InputProps = {
  label: "Vehicle",
  value: "MX-4821",
  onValueChange: (value) => value.toUpperCase(),
};
const selectProps: SelectProps = {
  label: "Status",
  value: "active",
  options: [{ label: "Active", value: "active" }],
  onValueChange: (value) => value.toUpperCase(),
};
const tableProps: TableProps = {
  label: "Vehicles",
  columns: [{ key: "unit", label: "Unit", sortable: true }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
  rowKey: "id",
};
const codeBlockProps: CodeBlockProps = {
  code: "export const ready = true;",
  language: "ts",
  copyable: true,
  copyAction: {
    label: "Copy code",
    onCopied: (meta, event) => {
      meta.value.toUpperCase();
      event.currentTarget.focus();
    },
  },
};

const navGroups: SidebarProps["groups"] = [
  {
    title: "Components",
    open: true,
    routes: [{ key: "button", label: "Button", active: true }],
  },
];
const searchResults: NonNullable<SearchProps["results"]> = [
  { key: "button", label: "Button" },
];
const topbarSearchResults: NonNullable<NonNullable<TopbarProps["search"]>["results"]> = [
  { key: "button", label: "Button" },
];
const metadata: NonNullable<ArtifactMetadataBarProps["items"]> = [
  { key: "status", label: "Status", value: "Ready" },
];
const heroMetadata: NonNullable<DocumentationHeroProps["metadata"]> = [
  { key: "status", label: "Status", value: "Ready", kind: "badge" },
];
const navItems: NonNullable<OnThisPageNavProps["items"]> = [
  { id: "usage", label: "Usage", href: "#usage" },
];

const searchProps: SearchProps = {
  label: "Search docs",
  query: "button",
  results: searchResults,
  onResultSelect: (key) => key.toUpperCase(),
};
const sidebarProps: SidebarProps = {
  label: "Docs navigation",
  groups: navGroups,
  activeKey: "button",
  expandedIds: ["Components"],
};
const topbarProps: TopbarProps = {
  label: "Flow docs",
  search: { label: "Search docs", query: "button", results: topbarSearchResults },
};
const heroProps: DocumentationHeroProps = {
  kicker: "Components",
  title: "Button",
  description: "Action primitive.",
  metadata: heroMetadata,
  background: "gradient-grid",
};
const sectionProps: DocumentationSectionProps = {
  title: "Usage",
  description: "Use for primary actions.",
};
const frameProps: DemoPreviewFrameProps = {
  label: "Preview",
  preview: React.createElement(Button, buttonProps),
};
const metadataProps: ArtifactMetadataBarProps = { items: metadata };
const onThisPageProps: OnThisPageNavProps = { label: "On this page", items: navItems };

const docsShellProps: DocsShellTemplateProps = {
  label: "Flow documentation",
  sidebar: sidebarProps,
  topbar: topbarProps,
  children: React.createElement("main", null, "Docs content"),
};
const docsHomeProps: DocsHomeTemplateProps = {
  title: "Flow",
  description: "Design system documentation.",
  metadata,
};
const componentDetailProps: ComponentDetailTemplateProps = {
  title: "Button",
  description: "Action component.",
  metadata,
  navItems,
  demo: React.createElement(Button, buttonProps),
};
const patternDetailProps: PatternDetailTemplateProps = {
  title: "Sidebar",
  description: "Navigation pattern.",
  metadata,
  navItems,
  demo: React.createElement(Sidebar, sidebarProps),
};
const fleetDashboardProps: FleetDashboardSuiteProps = {
  defaultSelectedDashboard: "overview",
  onSelectedDashboardChange: (key) => key.toUpperCase(),
};

const nodes = [
  React.createElement(Button, buttonProps),
  React.createElement(Card, cardProps),
  React.createElement(Input, inputProps),
  React.createElement(Select, selectProps),
  React.createElement(Table, tableProps),
  React.createElement(CodeBlock, codeBlockProps),
  React.createElement(Search, searchProps),
  React.createElement(Sidebar, sidebarProps),
  React.createElement(Topbar, topbarProps),
  React.createElement(DocumentationHero, heroProps),
  React.createElement(DocumentationSection, sectionProps),
  React.createElement(DemoPreviewFrame, frameProps),
  React.createElement(ArtifactMetadataBar, metadataProps),
  React.createElement(OnThisPageNav, onThisPageProps),
  React.createElement(DocsShellTemplate, docsShellProps),
  React.createElement(DocsHomeTemplate, docsHomeProps),
  React.createElement(ComponentDetailTemplate, componentDetailProps),
  React.createElement(PatternDetailTemplate, patternDetailProps),
  React.createElement(FleetDashboardSuite, fleetDashboardProps),
];

// @ts-expect-error Components own visual styling; consumers cannot bypass tokens with inline style.
const badButtonStyle: ButtonProps = { label: "Bad", style: { color: "red" } };
// @ts-expect-error Components own rendered structure; consumers cannot inject HTML.
const badCodeBlockHtml: CodeBlockProps = { code: "bad", dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Patterns own visual styling; consumers cannot bypass tokens with inline style.
const badSearchStyle: SearchProps = { label: "Bad", style: { color: "red" } };
// @ts-expect-error Templates own visual styling; consumers cannot bypass tokens with inline style.
const badDocsShellStyle: DocsShellTemplateProps = { label: "Bad", style: { color: "red" } };

void nodes;
void badButtonStyle;
void badCodeBlockHtml;
void badSearchStyle;
void badDocsShellStyle;
`;
  fs.writeFileSync(path.join(consumerDir, "consumer-types.tsx"), source.trimStart());
}

function runConsumerTypeSmoke() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "consumer-type-smoke-"));
  const cacheDir = path.join(tempRoot, "npm-cache");
  let tarball = "";
  try {
    const packed = packFlow(cacheDir);
    tarball = packed.tarball;
    const consumerDir = path.join(tempRoot, "consumer");
    fs.mkdirSync(consumerDir, { recursive: true });
    writeConsumerPackage(consumerDir, tarball);
    run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], consumerDir, {
      npm_config_cache: cacheDir,
    });
    writeTypeSmoke(consumerDir);
    const tsc = path.join(root, "node_modules/.bin/tsc");
    const result = run(tsc, ["--project", "tsconfig.json"], consumerDir);
    return {
      status: "pass",
      pack: {
        name: packed.pack.name,
        version: packed.pack.version,
        files: packed.pack.files?.length ?? 0,
      },
      tsc: {
        status: result.status,
        stdout: result.stdout.trim(),
        stderr: result.stderr.trim(),
      },
    };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    if (tarball) fs.rmSync(tarball, { force: true });
  }
}

function buildReport() {
  const result = runConsumerTypeSmoke();
  const consumerTypeSmokeDebt = result.status === "pass" && result.tsc.status === 0 ? 0 : 1;
  return {
    schemaVersion: "flow-system-consumer-type-smoke@1",
    generatedAt: "2026-08-14",
    status: consumerTypeSmokeDebt ? "fail" : "pass",
    inventory: {
      packedFiles: result.pack.files,
      typedComponents: 7,
      typedPatterns: 8,
      typedTemplates: 5,
      negativeTypeAssertions: 4,
      tscStatus: result.tsc.status,
      consumerTypeSmokeDebt,
    },
    policy: {
      packageBoundary: "Type smoke must import runtime and types through public package exports only.",
      typeBoundary: "Representative components, patterns, and templates must be consumable from an installed TypeScript project.",
      escapeBoundary: "Representative surfaces must reject inline style and dangerous HTML escape props.",
    },
  };
}

function renderMarkdown(report) {
  return [
    "# System consumer type smoke",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Packed files: ${report.inventory.packedFiles}`,
    `- Typed components: ${report.inventory.typedComponents}`,
    `- Typed patterns: ${report.inventory.typedPatterns}`,
    `- Typed templates: ${report.inventory.typedTemplates}`,
    `- Negative type assertions: ${report.inventory.negativeTypeAssertions}`,
    `- TSC status: ${report.inventory.tscStatus}`,
    `- Consumer type smoke debt: ${report.inventory.consumerTypeSmokeDebt}`,
    "",
    "## Policy",
    "",
    `- Package boundary: ${report.policy.packageBoundary}`,
    `- Type boundary: ${report.policy.typeBoundary}`,
    `- Escape boundary: ${report.policy.escapeBoundary}`,
    "",
  ].join("\n");
}

function main() {
  const report = buildReport();
  if (checkMode) {
    if (!fs.existsSync(jsonOutput)) {
      console.error("Consumer type smoke report is missing. Run: node packages/audit/scripts/report-system-consumer-type-smoke.js");
      process.exit(1);
    }
    const existing = fs.readFileSync(jsonOutput, "utf8");
    const expected = `${JSON.stringify(report, null, 2)}\n`;
    if (existing !== expected) {
      console.error("Consumer type smoke report is stale. Run: node packages/audit/scripts/report-system-consumer-type-smoke.js");
      process.exit(1);
    }
    if (report.inventory.consumerTypeSmokeDebt) {
      console.error(`Consumer type smoke debt detected: ${report.inventory.consumerTypeSmokeDebt}`);
      process.exit(1);
    }
    console.log(JSON.stringify({
      status: report.status,
      consumerTypeSmokeDebt: report.inventory.consumerTypeSmokeDebt,
      typedComponents: report.inventory.typedComponents,
      typedPatterns: report.inventory.typedPatterns,
      typedTemplates: report.inventory.typedTemplates,
    }, null, 2));
    return;
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    consumerTypeSmokeDebt: report.inventory.consumerTypeSmokeDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));
  if (report.inventory.consumerTypeSmokeDebt) process.exit(1);
}

main();
