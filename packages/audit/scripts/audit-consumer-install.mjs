#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const auditRequire = createRequire(import.meta.url);
const {
  foundations,
  goldComponents,
  primitiveNames,
  slug,
} = auditRequire("./audit-context.js");
const {
  allowedClassRootsForReactComponent,
  ownerClassRootForReactComponent,
} = auditRequire("./audit-anti-duplication.js");
const { componentCssContractCoverage } = auditRequire("./audit-component-css-contracts.js");
const { packageCssRootInventory } = auditRequire("./class-root-governance.js");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "consumer-install-"));
const cacheDir = path.join(tempRoot, "npm-cache");
let packedTarball = "";
const forbiddenInheritedDomProps = [
  "contentEditable",
  "dangerouslySetInnerHTML",
  "style",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
];

try {
  const { tarball, pack } = packFlow();
  packedTarball = tarball;
  auditPackedTarball(pack);
  const consumerDir = path.join(tempRoot, "consumer");
  fs.mkdirSync(consumerDir, { recursive: true });
  writeConsumerPackage(consumerDir, tarball);
  run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], consumerDir, {
    npm_config_cache: cacheDir,
  });
  writeConsumerScreen(consumerDir);
  run("node", ["screen.mjs"], consumerDir);
  writeConsumerCssEntrypoint(consumerDir);
  run("node", ["css-entrypoint.mjs"], consumerDir);
  writeConsumerRefRuntime(consumerDir);
  run("node", ["ref-runtime.mjs"], consumerDir);
  writeConsumerInteractionRuntime(consumerDir);
  run("node", ["interaction-runtime.mjs"], consumerDir);
  writeConsumerTypes(consumerDir);
  run(path.join(root, "node_modules/.bin/tsc"), ["--project", "tsconfig.json"], consumerDir);
  auditInstalledPackage(consumerDir);
  console.log(JSON.stringify({
    status: "pass",
    check: "consumer install",
    package: "@alohasoyrico-eng/flow",
    consumerDir,
  }, null, 2));
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
  if (packedTarball) fs.rmSync(packedTarball, { force: true });
}

function packFlow() {
  const result = run("npm", ["pack", "--json", "--ignore-scripts"], root, {
    npm_config_cache: cacheDir,
  });
  const pack = JSON.parse(result.stdout)[0];
  const tarball = path.join(root, pack.filename);
  if (!fs.existsSync(tarball)) {
    throw new Error(`npm pack did not create ${pack.filename}.`);
  }
  return { tarball, pack };
}

function auditPackedTarball(pack) {
  const rootPackage = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const paths = new Set((pack.files ?? []).map((file) => file.path));
  if (pack.name !== rootPackage.name) {
    throw new Error(`Packed package name mismatch: expected ${rootPackage.name}, received ${pack.name}`);
  }
  if (pack.version !== rootPackage.version) {
    throw new Error(`Packed package version mismatch: expected ${rootPackage.version}, received ${pack.version}`);
  }
  const publicFileAllowlist = rootPackage.files ?? [];
  const publicPackageReadmeAllowlist = new Set(
    publicFileAllowlist
      .filter((entry) => entry.startsWith("packages/"))
      .map((entry) => entry.split("/").slice(0, 2).join("/"))
      .map((entry) => `${entry}/README.md`),
  );
  const undeclaredFiles = [...paths].filter(
    (file) =>
      file !== "package.json" &&
      !publicPackageReadmeAllowlist.has(file) &&
      !publicFileAllowlist.some((entry) => file === entry || file.startsWith(`${entry}/`)),
  );
  if (undeclaredFiles.length) {
    throw new Error(
      `Packed package includes files outside package.json files allowlist: ${undeclaredFiles.slice(0, 30).join(", ")}`,
    );
  }
  const requiredPaths = new Set([
    "package.json",
    "README.md",
    "RELEASE.md",
    "START.md",
    "CHANGELOG.md",
    "packages/tokens/tokens.json",
    "packages/tokens/styles/tokens.css",
    "packages/components/styles/components.css",
    "packages/components/src/contracts.js",
    "packages/components/src/platforms/index.js",
    "packages/react/dist/index.js",
    "packages/react/dist/index.d.ts",
  ]);
  for (const componentId of goldComponents) {
    const componentName = pascalCase(componentId);
    requiredPaths.add(`packages/react/dist/${componentName}.js`);
    requiredPaths.add(`packages/react/dist/${componentName}.d.ts`);
  }
  for (const target of Object.values(rootPackage.exports ?? {}).flatMap(exportTargets)) {
    if (!target.startsWith("./")) continue;
    const fileTarget = target.replace(/^\.\//, "");
    if (!fileTarget.includes("*")) {
      requiredPaths.add(fileTarget);
      continue;
    }
    const [prefix, suffix = ""] = fileTarget.split("*");
    const matches = [...paths].filter((file) => file.startsWith(prefix) && file.endsWith(suffix));
    if (!matches.length) requiredPaths.add(fileTarget);
    for (const match of matches) requiredPaths.add(match);
  }

  const missing = [...requiredPaths].filter((file) => !paths.has(file));
  if (missing.length) {
    throw new Error(`Packed package is missing required public artifacts: ${missing.slice(0, 30).join(", ")}`);
  }
  const filesByPath = new Map((pack.files ?? []).map((file) => [file.path, file]));
  const undersizedDocs = ["README.md", "RELEASE.md", "START.md", "CHANGELOG.md"].filter(
    (file) => (filesByPath.get(file)?.size ?? 0) < 1000,
  );
  if (undersizedDocs.length) {
    throw new Error(`Packed package includes public docs that look incomplete: ${undersizedDocs.join(", ")}`);
  }

  const forbiddenPrefixes = [
    "apps/",
    "docs/",
    "node_modules/",
    "packages/audit/",
    "packages/react/src/",
    "repo-split-output/",
  ];
  const forbidden = [...paths].filter((file) => forbiddenPrefixes.some((prefix) => file.startsWith(prefix)));
  if (forbidden.length) {
    throw new Error(`Packed package includes internal artifacts: ${forbidden.slice(0, 30).join(", ")}`);
  }

  const reactSourceFiles = [...paths].filter((file) => file.startsWith("packages/react/") && !file.startsWith("packages/react/dist/"));
  if (reactSourceFiles.length) {
    throw new Error(`Packed React package must only include dist artifacts: ${reactSourceFiles.slice(0, 30).join(", ")}`);
  }
}

function writeConsumerPackage(consumerDir, tarball) {
  const packageJson = {
    type: "module",
    private: true,
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

function dependencyPackagePath(packageName) {
  return `file:${fs.realpathSync(path.join(root, "node_modules", packageName))}`;
}

function writeConsumerScreen(consumerDir) {
  const reactSubpathAssertions = goldComponents.map((componentId) => ({
    componentId,
    packagePath: `@alohasoyrico-eng/flow/react/${componentId}`,
    exportName: pascalCase(componentId),
  }));
  const platformContractAssertions = goldComponents.map((componentId) => ({
    componentId,
    exportName: `${camelCase(componentId)}PlatformContract`,
  }));
  const forbiddenComponentFactories = goldComponents.flatMap((componentId) => {
    const componentName = pascalCase(componentId);
    return [`create${componentName}`, `hydrate${componentName}`];
  });
  const source = `
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, Card, Input, Table } from "@alohasoyrico-eng/flow/react";
import { Dialog } from "@alohasoyrico-eng/flow/react/dialog";
import { Surface } from "@alohasoyrico-eng/flow/react/surface";
import { ActionSheet } from "@alohasoyrico-eng/flow/react/patterns/action-sheet";
import { AdvancedFilters } from "@alohasoyrico-eng/flow/react/patterns/advanced-filters";
import { AuthenticationLoginBiometricsAndOtp } from "@alohasoyrico-eng/flow/react/patterns/authentication-login-biometrics-and-otp";
import { AvatarGroup } from "@alohasoyrico-eng/flow/react/patterns/avatar-group";
import { AvatarMenu } from "@alohasoyrico-eng/flow/react/patterns/avatar-menu";
import { Autocomplete } from "@alohasoyrico-eng/flow/react/patterns/autocomplete";
import { BulkActions } from "@alohasoyrico-eng/flow/react/patterns/bulk-actions";
import { CalendarView } from "@alohasoyrico-eng/flow/react/patterns/calendar-view";
import { ChartLegendItem } from "@alohasoyrico-eng/flow/react/patterns/chart-legend-item";
import { ChartWrapper } from "@alohasoyrico-eng/flow/react/patterns/chart-wrapper";
import { ColumnConfigurator } from "@alohasoyrico-eng/flow/react/patterns/column-configurator";
import { CommandPalette } from "@alohasoyrico-eng/flow/react/patterns/command-palette";
import { ConfirmationDialog } from "@alohasoyrico-eng/flow/react/patterns/confirmation-dialog";
import { DragSortableList } from "@alohasoyrico-eng/flow/react/patterns/drag-sortable-list";
import { DriverAndVehicleAdministration } from "@alohasoyrico-eng/flow/react/patterns/driver-and-vehicle-administration";
import { DriverOnboardingMobile } from "@alohasoyrico-eng/flow/react/patterns/driver-onboarding-mobile";
import { DrawerAdapter } from "@alohasoyrico-eng/flow/react/patterns/drawer-adapter";
import { FileUpload } from "@alohasoyrico-eng/flow/react/patterns/file-upload";
import { FleetManagerOnboardingDesktop } from "@alohasoyrico-eng/flow/react/patterns/fleet-manager-onboarding-desktop";
import { FilterChipGroup } from "@alohasoyrico-eng/flow/react/patterns/filter-chip-group";
import { FormSection } from "@alohasoyrico-eng/flow/react/patterns/form-section";
import { FullscreenSheet } from "@alohasoyrico-eng/flow/react/patterns/fullscreen-sheet";
import { HelpCenter } from "@alohasoyrico-eng/flow/react/patterns/help-center";
import { KpiCard } from "@alohasoyrico-eng/flow/react/patterns/kpi-card";
import { MultiSelect } from "@alohasoyrico-eng/flow/react/patterns/multi-select";
import { MultiStepForm } from "@alohasoyrico-eng/flow/react/patterns/multi-step-form";
import { NotificationPanel } from "@alohasoyrico-eng/flow/react/patterns/notification-panel";
import { PullToRefresh } from "@alohasoyrico-eng/flow/react/patterns/pull-to-refresh";
import { QuickActionsGrid } from "@alohasoyrico-eng/flow/react/patterns/quick-actions-grid";
import { RolesAndPermissions } from "@alohasoyrico-eng/flow/react/patterns/roles-and-permissions";
import { Search } from "@alohasoyrico-eng/flow/react/patterns/search";
import { SectionHeader } from "@alohasoyrico-eng/flow/react/patterns/section-header";
import { VirtualDataTable } from "@alohasoyrico-eng/flow/react/patterns/virtual-data-table";
import { SelectOptionLayer } from "@alohasoyrico-eng/flow/react/patterns/select-option-layer";
import { Settings } from "@alohasoyrico-eng/flow/react/patterns/settings";
import { Sidebar } from "@alohasoyrico-eng/flow/react/patterns/sidebar";
import { SnackbarProvider } from "@alohasoyrico-eng/flow/react/patterns/snackbar-provider";
import { StationDiscovery } from "@alohasoyrico-eng/flow/react/patterns/station-discovery";
import { SwipeActions } from "@alohasoyrico-eng/flow/react/patterns/swipe-actions";
import { Timeline } from "@alohasoyrico-eng/flow/react/patterns/timeline";
import { Toolbar } from "@alohasoyrico-eng/flow/react/patterns/toolbar";
import { Topbar } from "@alohasoyrico-eng/flow/react/patterns/topbar";
import { TransferList } from "@alohasoyrico-eng/flow/react/patterns/transfer-list";
import { ConfigurationConsole } from "@alohasoyrico-eng/flow/react/templates/configuration-console";
import { DriverCardWallet } from "@alohasoyrico-eng/flow/react/templates/driver-card-wallet";
import { DriverMobileApp } from "@alohasoyrico-eng/flow/react/templates/driver-mobile-app";
import { FleetDashboardSuite } from "@alohasoyrico-eng/flow/react/templates/fleet-dashboard-suite";
import { FleetManagerDesktop } from "@alohasoyrico-eng/flow/react/templates/fleet-manager-desktop";
import { RoutesAndStations } from "@alohasoyrico-eng/flow/react/templates/routes-and-stations";
import { componentContracts } from "@alohasoyrico-eng/flow/components/contracts";

const require = createRequire(import.meta.url);
for (const exportedPath of [
  "@alohasoyrico-eng/flow/tokens.json",
  "@alohasoyrico-eng/flow/tokens/styles.css",
  "@alohasoyrico-eng/flow/components/styles.css",
  "@alohasoyrico-eng/flow/components",
  "@alohasoyrico-eng/flow/components/platforms",
  "@alohasoyrico-eng/flow/react/surface",
  "@alohasoyrico-eng/flow/react/templates",
  "@alohasoyrico-eng/flow/react/templates/configuration-console",
  "@alohasoyrico-eng/flow/react/templates/driver-card-wallet",
  "@alohasoyrico-eng/flow/react/templates/driver-mobile-app",
  "@alohasoyrico-eng/flow/react/templates/fleet-manager-desktop",
  "@alohasoyrico-eng/flow/react/templates/routes-and-stations",
  "@alohasoyrico-eng/flow/react/patterns",
  "@alohasoyrico-eng/flow/react/patterns/action-sheet",
  "@alohasoyrico-eng/flow/react/patterns/advanced-filters",
  "@alohasoyrico-eng/flow/react/patterns/authentication-login-biometrics-and-otp",
  "@alohasoyrico-eng/flow/react/patterns/avatar-group",
  "@alohasoyrico-eng/flow/react/patterns/avatar-menu",
  "@alohasoyrico-eng/flow/react/patterns/autocomplete",
  "@alohasoyrico-eng/flow/react/patterns/bulk-actions",
  "@alohasoyrico-eng/flow/react/patterns/calendar-view",
  "@alohasoyrico-eng/flow/react/patterns/chart-legend-item",
  "@alohasoyrico-eng/flow/react/patterns/chart-wrapper",
  "@alohasoyrico-eng/flow/react/patterns/column-configurator",
  "@alohasoyrico-eng/flow/react/patterns/command-palette",
  "@alohasoyrico-eng/flow/react/patterns/confirmation-dialog",
  "@alohasoyrico-eng/flow/react/patterns/drag-sortable-list",
  "@alohasoyrico-eng/flow/react/patterns/driver-and-vehicle-administration",
  "@alohasoyrico-eng/flow/react/patterns/driver-onboarding-mobile",
  "@alohasoyrico-eng/flow/react/patterns/drawer-adapter",
  "@alohasoyrico-eng/flow/react/patterns/file-upload",
  "@alohasoyrico-eng/flow/react/patterns/fleet-manager-onboarding-desktop",
  "@alohasoyrico-eng/flow/react/patterns/filter-chip-group",
  "@alohasoyrico-eng/flow/react/patterns/form-section",
  "@alohasoyrico-eng/flow/react/patterns/fullscreen-sheet",
  "@alohasoyrico-eng/flow/react/patterns/help-center",
  "@alohasoyrico-eng/flow/react/patterns/kpi-card",
  "@alohasoyrico-eng/flow/react/patterns/multi-select",
  "@alohasoyrico-eng/flow/react/patterns/multi-step-form",
  "@alohasoyrico-eng/flow/react/patterns/notification-panel",
  "@alohasoyrico-eng/flow/react/patterns/pull-to-refresh",
  "@alohasoyrico-eng/flow/react/patterns/quick-actions-grid",
  "@alohasoyrico-eng/flow/react/patterns/roles-and-permissions",
  "@alohasoyrico-eng/flow/react/patterns/search",
  "@alohasoyrico-eng/flow/react/patterns/section-header",
  "@alohasoyrico-eng/flow/react/patterns/virtual-data-table",
  "@alohasoyrico-eng/flow/react/patterns/select-option-layer",
  "@alohasoyrico-eng/flow/react/patterns/settings",
  "@alohasoyrico-eng/flow/react/patterns/sidebar",
  "@alohasoyrico-eng/flow/react/patterns/snackbar-provider",
  "@alohasoyrico-eng/flow/react/patterns/station-discovery",
  "@alohasoyrico-eng/flow/react/patterns/swipe-actions",
  "@alohasoyrico-eng/flow/react/patterns/timeline",
  "@alohasoyrico-eng/flow/react/patterns/toolbar",
  "@alohasoyrico-eng/flow/react/patterns/topbar",
  "@alohasoyrico-eng/flow/react/patterns/transfer-list",
]) {
  assert.ok(require.resolve(exportedPath), \`Expected package export to resolve: \${exportedPath}\`);
}
const tokenContract = require("@alohasoyrico-eng/flow/tokens.json");
assert.equal(tokenContract.format, "flow-token-contract@2");
assert.ok(tokenContract.compatibleWith.includes("style-dictionary"));
assert.ok(Object.keys(tokenContract.tokens).length >= 1000);

const tokenCss = fs.readFileSync(require.resolve("@alohasoyrico-eng/flow/tokens/styles.css"), "utf8");
const componentCss = fs.readFileSync(require.resolve("@alohasoyrico-eng/flow/components/styles.css"), "utf8");
assert.match(tokenCss, /--sys-color-surface:/);
assert.match(tokenCss, /--sys-density-control-height:/);
for (const expectedContract of [
  "--comp-button-bg-primary:",
  "--comp-card-bg:",
  "--comp-field-control-size:",
  "--comp-table-bg:",
  ".button[data-density=\\"sm\\"]",
  ".card[data-density=\\"lg\\"]",
  ".field[data-density=\\"sm\\"]",
  ".dialog[data-density=\\"lg\\"]",
  ".table[data-density=\\"sm\\"]",
]) {
  assert.ok(componentCss.includes(expectedContract), \`Expected installed component CSS contract: \${expectedContract}\`);
}

const reactBarrel = await import("@alohasoyrico-eng/flow/react");
const componentsSurface = await import("@alohasoyrico-eng/flow/components");
const platformSurface = await import("@alohasoyrico-eng/flow/components/platforms");
const reactSubpathAssertions = ${JSON.stringify(reactSubpathAssertions, null, 2)};
assert.equal(typeof componentsSurface.createChartsPrimitive, "function");
assert.equal(typeof componentsSurface.createMapsPrimitive, "function");
assert.equal(typeof componentsSurface.componentDemoProps, "function");
for (const exportName of ${JSON.stringify(forbiddenComponentFactories, null, 2)}) {
  assert.equal(componentsSurface[exportName], undefined, \`Installed components surface must not expose product component factory \${exportName}\`);
}
for (const { componentId, exportName } of ${JSON.stringify(platformContractAssertions, null, 2)}) {
  assert.ok(platformSurface[exportName], \`Expected installed platform surface to export \${exportName} for \${componentId}\`);
}
for (const { componentId, packagePath, exportName } of reactSubpathAssertions) {
  const module = await import(packagePath);
  const platformContractName = \`\${contractKeyForComponent(componentId)}PlatformContract\`;
  assert.ok(module[exportName], \`Expected \${packagePath} to export \${exportName}\`);
  assert.ok(
    typeof module[exportName] === "function" || typeof module[exportName] === "object",
    \`Expected \${packagePath} export \${exportName} to be a React component-like value\`,
  );
  assert.equal(module[exportName].displayName, exportName, \`Expected installed \${componentId} displayName to be \${exportName}\`);
  assert.equal(module[exportName].platformContract, platformSurface[platformContractName], \`Expected installed \${componentId} to expose \${platformContractName}\`);
  assert.equal(module[exportName], reactBarrel[exportName], \`Expected \${componentId} subpath export to match React barrel export\`);
}

function contractKeyForComponent(componentId) {
  return componentId.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function fixtureForContract(componentId, contract) {
  const props = {};
  for (const prop of contract.props ?? []) {
    if (!prop.required) continue;
    props[prop.name] = valueForRequiredProp(prop.name);
  }
  if (componentId === "button") props.label = "Reference";
  if (componentId === "chart-panel") {
    props.values = [1, 2, 3];
    props.labels = ["One", "Two", "Three"];
  }
  if (componentId === "chat-message") props.body = "Reference message";
  if (componentId === "icon-button") props.ariaLabel = "Reference action";
  if (["dialog", "drawer", "popover", "tooltip"].includes(componentId)) props.open = true;
  return props;
}

function valueForRequiredProp(name) {
  switch (name) {
    case "ariaLabel":
      return "Reference action";
    case "columns":
      return [{ key: "name", label: "Name" }];
    case "fallback":
      return "Use your passcode";
    case "getPageLabel":
      return (page) => \`Reference page \${page}\`;
    case "icon":
      return "check";
    case "items":
      return [
        { id: "one", key: "one", label: "One", title: "One", content: "One content", value: "one" },
        { id: "two", key: "two", label: "Two", title: "Two", content: "Two content", value: "two" },
      ];
    case "label":
      return "Reference";
    case "name":
      return "reference";
    case "nodes":
      return [{ key: "root", label: "Root", children: [{ key: "child", label: "Child" }] }];
    case "options":
      return [{ label: "One", value: "one", meta: "Option" }];
    case "page":
      return 1;
    case "pageCount":
      return 3;
    case "previousLabel":
      return "Previous reference page";
    case "nextLabel":
      return "Next reference page";
    case "rowKey":
      return "id";
    case "rows":
      return [{ id: "row-1", name: "Row one" }];
    case "steps":
      return [{ id: "one", label: "One" }, { id: "two", label: "Two" }];
    case "title":
      return "Reference";
    case "triggerLabel":
      return "Open reference";
    case "value":
      return "Reference";
    default:
      return "Reference";
  }
}

const installedRenderFailures = [];
for (const { componentId, exportName } of reactSubpathAssertions) {
  const Component = reactBarrel[exportName];
  const contract = componentContracts[contractKeyForComponent(componentId)];
  try {
    assert.ok(contract, \`Expected installed contract for \${componentId}\`);
    const installedMarkup = renderToStaticMarkup(React.createElement(Component, {
      ...fixtureForContract(componentId, contract),
      className: "flow-consumer-hook",
      density: "lg",
      "data-installed-render": componentId,
      contentEditable: true,
      dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
      style: { color: "rgb(255, 0, 0)", marginTop: 77 },
      suppressContentEditableWarning: true,
      suppressHydrationWarning: true,
    }));
    assert.ok(installedMarkup.length > 0, \`\${componentId} rendered empty installed markup\`);
    assert.equal(installedMarkup.match(/flow-consumer-hook/g)?.length ?? 0, 1, \`\${componentId} must expose className once on the root integration surface\`);
    const rootTag = installedMarkup.match(/^<[^>]+>/)?.[0] ?? "";
    assert.match(rootTag, /data-density="lg"/, \`\${componentId} must expose density on the root integration surface\`);
    assert.match(rootTag, new RegExp(\`data-installed-render="\${componentId}"\`), \`\${componentId} must expose consumer data attributes on the root integration surface\`);
    assert.doesNotMatch(installedMarkup, /rgb\\(255,\\s*0,\\s*0\\)|margin-top:\\s*77px/i, \`\${componentId} leaked external style prop\`);
    assert.doesNotMatch(installedMarkup, /Injected markup|contenteditable=/i, \`\${componentId} leaked external DOM escape props\`);
    assert.doesNotMatch(installedMarkup, /apps\\/docs|docs-demo|gold-/i, \`\${componentId} leaked docs-only markup\`);
  } catch (error) {
    installedRenderFailures.push(\`\${componentId}: \${error.message}\`);
  }
}
assert.deepEqual(installedRenderFailures, []);

const screen = React.createElement("main", { className: "product-screen", "data-density": "md", "data-theme": "light" },
  React.createElement(Card, {
    title: "Fleet health",
    value: "96",
    unit: "",
    detail: "Vehicles available",
    status: "On track",
    composition: "stats",
    actions: [{ label: "Review", variant: "secondary" }],
  }),
  React.createElement(Input, {
    label: "Search vehicle",
    value: "MX-4821",
    helper: "Consumer controlled input",
  }),
  React.createElement(Surface, {
    surfaceRole: "section",
    density: "sm",
    "data-installed-primitive": "surface",
  }, "Primitive surface"),
  React.createElement(Table, {
    label: "Vehicles",
    columns: [
      { key: "unit", label: "Unit", sortable: true },
      { key: "status", label: "Status" },
    ],
    rows: [
      { id: "mx-4821", unit: "MX-4821", status: { label: "Active", tone: "success" } },
      { id: "mx-8840", unit: "MX-8840", status: { label: "Review", tone: "warning" } },
    ],
    variant: "sortable",
  }),
  React.createElement(Dialog, {
    label: "Confirm route",
    description: "This dialog renders outside FlowDocs.",
    open: true,
    actions: [
      { key: "cancel", label: "Cancel", variant: "secondary" },
      { key: "confirm", label: "Confirm", variant: "primary" },
    ],
  }),
  React.createElement(SelectOptionLayer, {
    label: "Vehicle",
    helper: "Pattern composed from Flow Select contracts.",
    density: "sm",
    state: "open",
    options: [
      { label: "MX-4821", value: "mx-4821" },
      { label: "MX-8840", value: "mx-8840", unavailable: true, reason: "Maintenance" },
    ],
    validation: { message: "Unavailable options keep reasons.", state: "warning" },
    "data-installed-pattern": "select-option-layer",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(FilterChipGroup, {
    label: "Applied filters",
    density: "sm",
    resultCount: 12,
    filters: [
      { key: "status", label: "Status: Active" },
      { key: "city", label: "City: CDMX", tone: "warning" },
    ],
    reset: { label: "Clear filters" },
    feedback: { label: "Filters updated", description: "12 results available" },
    "data-installed-pattern": "filter-chip-group",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(AvatarGroup, {
    label: "Dispatch team",
    density: "sm",
    maxVisible: 2,
    identities: [
      { key: "ana", name: "Ana Torres", status: "online", role: "Dispatcher" },
      { key: "leo", name: "Leo Marin", status: "busy", role: "Ops" },
      { key: "maya", name: "Maya Chen", status: "offline", role: "Support" },
    ],
    overflow: { triggerLabel: "View more people", title: "Dispatch team", open: true },
    tooltip: { triggerLabel: "Team visibility", content: "Visible identities are available to this role." },
    validation: { message: "One identity is unavailable.", state: "warning" },
    "data-installed-pattern": "avatar-group",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(SnackbarProvider, {
    label: "Route notifications",
    density: "sm",
    maxVisible: 1,
    messages: [
      { key: "saved", label: "Route saved", tone: "success", actionLabel: "Undo" },
      { key: "sync", label: "Sync queued", tone: "warning" },
    ],
    action: { label: "Dismiss all" },
    "data-installed-pattern": "snackbar-provider",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(StationDiscovery, {
    label: "Nearby stations",
    description: "Choose a station or search manually.",
    permission: "denied",
    stations: [{ id: "centro", label: "Centro Norte", value: "1.2 km", meta: "Open", route: "8 min" }],
    route: { label: "Route to Centro Norte", eta: "8 min", distance: "1.2 km", actions: [{ key: "start", label: "Start route" }] },
    "data-installed-pattern": "station-discovery",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(Autocomplete, {
    label: "Vehicle",
    helper: "Type to choose a vehicle",
    density: "sm",
    state: "suggesting",
    suggestions: [
      { key: "mx-4821", label: "MX-4821", meta: "Active" },
      { key: "mx-8840", label: "MX-8840", meta: "Maintenance", disabled: true },
    ],
    validation: { message: "Selection is required.", state: "warning" },
    "data-installed-pattern": "autocomplete",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(KpiCard, {
    label: "Fleet availability",
    value: 96,
    unit: "%",
    delta: "+4%",
    trend: "up",
    tone: "success",
    density: "sm",
    status: { label: "Healthy", tone: "success" },
    tag: { label: "Live", tone: "info" },
    action: { label: "Review" },
    "data-installed-pattern": "kpi-card",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(ConfirmationDialog, {
    label: "Delete route",
    description: "This action cannot be undone.",
    open: true,
    destructive: true,
    density: "sm",
    confirm: { label: "Delete" },
    cancel: { label: "Keep route" },
    validation: { message: "Review impacted assignments.", state: "warning" },
    recovery: { label: "Delete failed", description: "Try again later." },
    feedback: { label: "Route delete queued", actionLabel: "Undo" },
    "data-installed-pattern": "confirmation-dialog",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(DrawerAdapter, {
    label: "Operations drawer",
    density: "sm",
    open: true,
    responsive: true,
    drawer: { triggerLabel: "Open operations", closeLabel: "Close operations" },
    dialog: { label: "Review drawer", open: true },
    list: { items: [{ key: "routes", label: "Routes" }] },
    cards: [{ title: "Open tasks", value: "12" }],
    menu: { triggerLabel: "Drawer options", open: true, items: [{ key: "pin", label: "Pin drawer" }] },
    actions: [{ key: "apply", label: "Apply", variant: "primary" }],
    topbar: { label: "Operations topbar", mobile: true, search: { label: "Search operations", query: "routes" } },
    sidebar: { groups: [{ title: "Operations", routes: [{ key: "routes", label: "Routes" }] }] },
    multiStepForm: { label: "Task flow boundary" },
    feedback: { label: "Drawer adapted", tone: "info" },
    "data-installed-pattern": "drawer-adapter",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(FileUpload, {
    label: "Proof of delivery",
    description: "Upload a PDF or image.",
    density: "sm",
    state: "uploading",
    files: [{ key: "pod", name: "pod.pdf", size: "1.2 MB", type: "PDF", status: "Uploading" }],
    progress: { label: "Upload progress", value: 64, showValue: true },
    chooseAction: { label: "Choose file" },
    removeAction: { label: "Remove" },
    validation: { message: "PDF, PNG, or JPG only.", state: "warning" },
    feedback: { label: "Upload queued", description: "Processing file." },
    "data-installed-pattern": "file-upload",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(MultiSelect, {
    label: "Regions",
    helper: "Choose every active service region.",
    density: "sm",
    open: true,
    value: ["north", "central"],
    options: [
      { label: "North", value: "north", meta: "12 routes" },
      { label: "Central", value: "central", meta: "8 routes" },
      { label: "South", value: "south", meta: "Unavailable", disabled: true },
    ],
    clearAction: { label: "Clear regions" },
    validation: { message: "At least one region is required.", state: "warning" },
    "data-installed-pattern": "multi-select",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(MultiStepForm, {
    label: "Driver onboarding",
    density: "sm",
    dirty: true,
    steps: [{ id: "profile", label: "Profile" }, { id: "review", label: "Review" }],
    currentStep: 1,
    summary: { title: "Onboarding progress" },
    fields: [{ key: "name", label: "Driver name", value: "Ana" }, { key: "region", kind: "select", label: "Region", value: "north", options: [{ label: "North", value: "north" }] }],
    formSection: { title: "License details", fields: [{ label: "License number", value: "MX-123" }] },
    validation: { message: "Review license details.", state: "warning" },
    primaryAction: { label: "Continue" },
    feedback: { label: "Draft saved", tone: "info" },
    "data-installed-pattern": "multi-step-form",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(FormSection, {
    title: "Driver profile",
    description: "Keep dispatch records current.",
    density: "sm",
    state: "dirty",
    fields: [
      { key: "name", label: "Driver name", value: "Ana Torres", required: true },
      { key: "notes", kind: "text-area", label: "Notes", value: "Prefers morning routes.", maxLength: 120 },
    ],
    primaryAction: { label: "Save profile" },
    secondaryAction: { label: "Cancel" },
    validation: { message: "Review required fields.", state: "warning", summary: "2 fields changed" },
    feedback: { label: "Profile saved", description: "Changes will sync shortly." },
    "data-installed-pattern": "form-section",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(FullscreenSheet, {
    label: "Edit vehicle",
    description: "Review mobile task state.",
    density: "sm",
    open: true,
    dirty: true,
    summary: { label: "Vehicle MX-4821", status: "Draft" },
    steps: [{ id: "details", label: "Details" }, { id: "review", label: "Review" }],
    currentStep: 1,
    fields: [
      { key: "driver", label: "Driver", value: "Ana" },
      { key: "region", kind: "select", label: "Region", value: "north", options: [{ label: "North", value: "north" }] },
    ],
    validation: { message: "Unsaved changes remain.", state: "warning" },
    primaryAction: { label: "Save vehicle" },
    actionSheet: { label: "More actions", actions: [{ key: "delete", label: "Delete", intent: "danger", tone: "danger" }] },
    feedback: { label: "Draft ready", tone: "info" },
    "data-installed-pattern": "fullscreen-sheet",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(RolesAndPermissions, {
    label: "Roles and permissions",
    density: "sm",
    state: "dirty",
    roles: [{ key: "admin", label: "Admin" }, { key: "dispatcher", label: "Dispatcher" }],
    permissions: [{ key: "cards.view", label: "View cards", badge: "Cards" }, { key: "drivers.suspend", label: "Suspend drivers", disabled: true, disabledReason: "Requires owner approval." }],
    values: { admin: { "cards.view": true, "drivers.suspend": true }, dispatcher: { "cards.view": true } },
    validation: { message: "Review risky permissions.", state: "warning" },
    audit: { label: "Last edited by Ana", status: "verified" },
    confirmation: { label: "Confirm permission change", open: true, actions: [{ label: "Cancel" }, { label: "Apply", variant: "danger", intent: "danger" }] },
    actions: [{ label: "Save permissions", variant: "primary" }],
    feedback: { label: "Permissions updated", tone: "success" },
    "data-installed-pattern": "roles-and-permissions",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(AvatarMenu, {
    name: "Ana Torres",
    status: "online",
    density: "sm",
    open: true,
    items: [{ key: "profile", label: "Profile" }, { key: "settings", label: "Settings" }, { key: "sign-out", label: "Sign out", tone: "danger" }],
    "data-installed-pattern": "avatar-menu",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(NotificationPanel, {
    label: "Notifications",
    density: "sm",
    open: true,
    notifications: [{ key: "route", label: "Route delayed", unread: true }, { key: "sync", label: "Sync complete" }],
    markAllAction: { label: "Mark all read" },
    feedback: { label: "Notifications updated", tone: "success" },
    "data-installed-pattern": "notification-panel",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(PullToRefresh, {
    label: "Route updates",
    density: "sm",
    state: "refreshing",
    progress: 45,
    list: { items: [{ key: "route", label: "Route delayed", meta: "Updated now" }] },
    cards: [{ title: "Fleet status", value: "Stale", detail: "Pull or press refresh." }],
    fallbackAction: { label: "Refresh now" },
    validation: { message: "Refresh status is announced.", state: "info" },
    feedback: { label: "Refreshing routes", tone: "info" },
    "data-installed-pattern": "pull-to-refresh",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(QuickActionsGrid, {
    label: "Frequent actions",
    density: "sm",
    actions: [
      { key: "assign", label: "Assign driver", icon: "person", badge: "2", status: { label: "Ready", tone: "success" }, tooltip: { content: "Assign selected driver." } },
      { key: "delete", label: "Delete trip", intent: "danger", tone: "danger", tooltip: { content: "Requires confirmation." } },
    ],
    search: { label: "Find target", query: "Ana", results: [{ key: "ana", label: "Ana Torres" }] },
    confirmation: { label: "Confirm delete", open: true },
    feedback: { label: "Actions ready", tone: "info" },
    "data-installed-pattern": "quick-actions-grid",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(CommandPalette, {
    label: "Command palette",
    density: "sm",
    open: true,
    query: "route",
    commands: [{ key: "open-route", label: "Open route" }],
    primaryAction: { label: "Run command" },
    feedback: { label: "Command queued", tone: "success" },
    "data-installed-pattern": "command-palette",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(DragSortableList, {
    label: "Dashboard module order",
    density: "sm",
    dirty: true,
    movingKey: "alerts",
    items: [
      { key: "summary", label: "Summary", locked: true, lockedReason: "Required first module" },
      { key: "alerts", label: "Alerts", description: "Moved with keyboard controls" },
      { key: "map", label: "Map" },
    ],
    settings: { label: "Order preferences" },
    saveAction: { label: "Save order" },
    undoAction: { label: "Undo move" },
    feedback: { label: "Order ready to save", tone: "info" },
    "data-installed-pattern": "drag-sortable-list",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(Settings, {
    label: "Workspace settings",
    density: "sm",
    dirty: true,
    summary: { title: "Preferences", value: "3" },
    groups: [{ title: "Profile", controls: [{ label: "Display name", value: "Ana" }, { kind: "switch", label: "Alerts", checked: true }] }],
    saveAction: { label: "Save settings" },
    resetAction: { label: "Reset" },
    feedback: { label: "Settings saved", tone: "success" },
    "data-installed-pattern": "settings",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(Sidebar, {
    label: "Fleet navigation",
    density: "sm",
    activeKey: "routes",
    breadcrumbs: [{ label: "Fleet" }, { label: "Routes", current: true }],
    groups: [{ title: "Operations", routes: [{ key: "routes", label: "Routes", badge: "4", active: true }] }],
    "data-installed-pattern": "sidebar",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(SwipeActions, {
    label: "Transaction actions",
    density: "sm",
    revealed: true,
    row: { label: "Fuel charge", meta: "MX-4821", amount: "$82.00", status: "Pending", category: "fuel" },
    actions: [
      { key: "approve", label: "Approve", icon: "check" },
      { key: "decline", label: "Decline", icon: "close", intent: "danger", tone: "danger", fallbackLabel: "Decline without swipe" },
    ],
    confirmation: { label: "Confirm decline", open: true },
    recovery: { label: "Action can be undone", tone: "info", actionLabel: "Undo" },
    "data-installed-pattern": "swipe-actions",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(Timeline, {
    label: "Route audit timeline",
    density: "sm",
    filtered: true,
    filters: [{ key: "status", label: "Status: warning", removable: true }],
    status: { label: "2 audit events", tone: "warning" },
    events: [
      { key: "assigned", label: "Driver assigned", actor: "Ana Torres", timestamp: "2026-08-09 09:00", status: "success", statusLabel: "Verified" },
      { key: "delay", label: "Delay reported", description: "Route Centro", timestamp: "2026-08-09 09:30", status: "warning", statusLabel: "Needs review" },
    ],
    clearAction: { label: "Clear filters" },
    "data-installed-pattern": "timeline",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(Topbar, {
    label: "Fleet shell",
    density: "sm",
    mobile: true,
    search: {
      label: "Search fleet",
      query: "MX",
      active: true,
      delegate: { label: "Search vehicles", query: "MX", results: [{ key: "mx-4821", label: "MX-4821" }] },
    },
    account: {
      name: "Ana Torres",
      status: "online",
      open: true,
      items: [{ key: "profile", label: "Profile" }],
      delegate: { name: "Ana Torres", items: [{ key: "profile", label: "Profile" }] },
    },
    commandPalette: { label: "Command palette", open: true, commands: [{ key: "open-route", label: "Open route" }] },
    notifications: { label: "Notifications", open: true, notifications: [{ key: "route", label: "Route delayed", unread: true }] },
    settings: { groups: [{ title: "Profile", controls: [{ label: "Display name", value: "Ana" }] }] },
    sidebar: { groups: [{ title: "Operations", routes: [{ key: "routes", label: "Routes" }] }], drawerOpen: true },
    actions: [{ key: "settings", label: "Settings", icon: "settings" }],
    "data-installed-pattern": "topbar",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(Toolbar, {
    label: "Vehicle table actions",
    density: "sm",
    search: {
      label: "Search vehicles",
      query: "MX",
      input: { label: "Search vehicles", value: "MX" },
      delegate: { label: "Search vehicles", query: "MX", results: [{ key: "mx-4821", label: "MX-4821" }] },
    },
    filters: [{ key: "active", label: "Status: active", removable: true }],
    badges: [{ key: "selected", label: "2 selected", tone: "info" }],
    actions: [{ key: "assign", label: "Assign", variant: "primary" }],
    overflow: { triggerLabel: "More actions", open: true, items: [{ key: "export", label: "Export" }] },
    feedback: { label: "Toolbar updated", tone: "success" },
    "data-installed-pattern": "toolbar",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(BulkActions, {
    label: "Vehicle bulk actions",
    density: "sm",
    selectedCount: 2,
    totalCount: 5,
    eligibleCount: 1,
    selection: { label: "Select vehicles" },
    table: {
      label: "Selected vehicles",
      columns: [{ key: "unit", label: "Unit" }, { key: "eligibility", label: "Eligibility" }],
      rows: [{ id: "mx-4821", unit: "MX-4821", eligibility: "Eligible" }],
    },
    toolbar: { label: "Bulk action host", actions: [{ key: "assign", label: "Assign", variant: "primary" }] },
    actions: [{ key: "assign", label: "Assign", variant: "primary" }],
    overflow: { triggerLabel: "More bulk actions", open: true, items: [{ key: "export", label: "Export" }] },
    confirmation: { label: "Confirm assignment", open: true, actions: [{ key: "cancel", label: "Cancel" }, { key: "confirm", label: "Apply", variant: "primary" }] },
    progress: { label: "Applying bulk action", value: 60, showValue: true, state: "active" },
    feedback: { label: "Bulk action queued", tone: "info" },
    "data-installed-pattern": "bulk-actions",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(ChartWrapper, {
    label: "Route completion",
    density: "sm",
    chart: { values: [12, 18, 22], labels: ["Mon", "Tue", "Wed"], variant: "line", value: "22" },
    summary: { label: "Completed", value: "22", tone: "success" },
    status: { label: "Filtered", tone: "warning" },
    primaryAction: { label: "Export" },
    overflow: { triggerLabel: "Chart actions", open: true, items: [{ key: "compare", label: "Compare" }] },
    table: { columns: [{ key: "day", label: "Day" }, { key: "routes", label: "Routes" }], rows: [{ id: "mon", day: "Mon", routes: "12" }] },
    "data-installed-pattern": "chart-wrapper",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(ChartLegendItem, {
    label: "Fuel spend",
    value: "$84.2k",
    selected: true,
    status: { label: "Visible", tone: "info" },
    "data-installed-pattern": "chart-legend-item",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(CalendarView, {
    label: "Maintenance calendar",
    density: "sm",
    selectedDate: "2026-08-09",
    rangeLabel: "Aug 2026",
    timezoneLabel: "America/Mexico_City",
    dateControl: { label: "Schedule date", value: "2026-08-09" },
    events: [
      { key: "oil", label: "Oil change", time: "09:00", description: "Unit MX-4821", status: "warning", statusLabel: "Due soon" },
      { key: "renewal", label: "Permit renewal", time: "14:00", description: "Owner: Fleet ops", status: "success", statusLabel: "Confirmed" },
    ],
    selectedKey: "oil",
    actions: [{ label: "Create event" }],
    detail: { triggerLabel: "Open event details", title: "Oil change", open: true },
    "data-installed-pattern": "calendar-view",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(ColumnConfigurator, {
    label: "Vehicle columns",
    density: "sm",
    open: true,
    surface: { mode: "drawer", triggerLabel: "Columns" },
    columns: [
      { key: "unit", label: "Unit", required: true, requiredReason: "Identity column" },
      { key: "status", label: "Status", visible: true },
      { key: "route", label: "Route", visible: false },
    ],
    rows: [{ id: "mx-4821", unit: "MX-4821", status: "Active", route: "Centro" }],
    applyAction: { label: "Apply columns" },
    resetAction: { label: "Reset" },
    validation: { message: "Required identity columns stay visible.", state: "info" },
    feedback: { label: "Columns updated", tone: "success" },
    "data-installed-pattern": "column-configurator",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(TransferList, {
    label: "Assign drivers",
    density: "sm",
    source: [{ key: "ana", label: "Ana Torres", selected: true }, { key: "luis", label: "Luis Perez" }],
    target: [{ key: "mia", label: "Mia Chen" }],
    selectedSourceKeys: ["ana"],
    search: { label: "Search drivers", query: "Ana", results: [{ key: "ana", label: "Ana Torres" }] },
    multiSelect: { label: "Selected drivers", options: [{ label: "Ana Torres", value: "ana" }], value: ["ana"] },
    moveToTargetAction: { label: "Assign selected" },
    moveToSourceAction: { label: "Remove selected" },
    validation: { message: "Review transfer state.", state: "warning" },
    feedback: { label: "Transfer ready", tone: "info" },
    "data-installed-pattern": "transfer-list",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(HelpCenter, {
    label: "Fleet help",
    description: "Find support articles without leaving the workflow.",
    density: "sm",
    open: true,
    query: "drivers",
    selectedTopicKey: "drivers",
    topics: [{ key: "drivers", label: "Drivers", count: 4 }, { key: "billing", label: "Billing" }],
    articles: [{ id: "assign-driver", title: "Assign a driver", topic: "Drivers", summary: "Use assignment tools.", open: true }],
    search: { label: "Search help", query: "drivers", results: [{ key: "assign-driver", label: "Assign a driver" }] },
    sidebar: { label: "Help topics" },
    topicInput: { label: "Topic filter", value: "drivers" },
    recovery: { action: { label: "Contact support" } },
    "data-installed-pattern": "help-center",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(AdvancedFilters, {
    label: "Advanced vehicle filters",
    description: "Refine vehicles before applying.",
    density: "sm",
    open: true,
    dirty: true,
    fields: [
      { key: "unit", kind: "input", label: "Unit", value: "MX", placeholder: "Search unit" },
      { key: "status", kind: "select", label: "Status", value: "active", options: [{ label: "Active", value: "active" }] },
      { key: "service-window", kind: "date-range", label: "Service window", from: "2026-08-01", to: "2026-08-09", open: true },
    ],
    appliedFilters: [{ key: "active", label: "Status: active", removable: true }],
    validation: { label: "Advanced vehicle filters", message: "Review filter combinations.", state: "warning" },
    applyAction: { label: "Apply filters" },
    resetAction: { label: "Reset" },
    savedViews: { triggerLabel: "Saved filters", open: true, items: [{ key: "recent", label: "Recently active" }] },
    overflow: { triggerLabel: "More filter actions", open: true, items: [{ key: "save", label: "Save view" }] },
    feedback: { label: "Filters updated", tone: "success" },
    toolbar: { label: "Filter host", actions: [{ key: "open", label: "Advanced filters" }], filters: [{ key: "status", label: "Status: active" }] },
    "data-installed-pattern": "advanced-filters",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(AuthenticationLoginBiometricsAndOtp, {
    label: "Secure sign in",
    density: "sm",
    otpSent: true,
    credential: { label: "Email", value: "ana@example.com" },
    phone: { label: "Phone number", value: "5551234567", country: "MX" },
    otp: { label: "Security code", value: "123456", length: 6 },
    biometric: { label: "Use device biometrics", fallback: "Use code instead" },
    validation: { message: "Code sent to trusted channel.", state: "info" },
    primaryAction: { label: "Verify code" },
    feedback: { label: "Security check ready", tone: "info" },
    "data-installed-pattern": "authentication-login-biometrics-and-otp",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(DriverAndVehicleAdministration, {
    label: "Driver and vehicle admin",
    description: "Review local administration records.",
    density: "sm",
    selectedKey: "ana",
    toolbar: {
      label: "Admin toolbar",
      actions: [{ key: "export", label: "Export" }],
      filters: [{ key: "active", label: "Active" }],
    },
    summary: { label: "Administration", number: "2 records", status: "Active" },
    records: [
      { key: "ana", driver: "Ana Torres", vehicle: "MX-4821", type: "Driver", status: "active" },
      { key: "unit", driver: "Fleet Unit", vehicle: "MX-8840", type: "Vehicle", status: "review" },
    ],
    actions: [{ key: "assign", label: "Assign", icon: "person_add" }],
    primaryAction: { label: "Save changes" },
    dialog: { label: "Review admin action", open: true, actions: [{ key: "confirm", label: "Confirm" }] },
    audit: { label: "Ana Torres updated", meta: "Today", status: "Verified" },
    pagination: { page: 1, pageCount: 2 },
    feedback: { label: "Administration ready", tone: "info" },
    "data-installed-pattern": "driver-and-vehicle-administration",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(DriverOnboardingMobile, {
    label: "Driver onboarding",
    density: "sm",
    inProgress: true,
    reducedMotion: true,
    steps: [{ id: "identity", label: "Identity" }, { id: "verify", label: "Verify" }],
    summary: { label: "Mobile setup", number: "1/2", status: "In progress" },
    identityCard: { title: "Ana Torres", value: "MX-4821" },
    formSection: { title: "License", fields: [{ label: "License number", value: "A123" }] },
    identity: { label: "Driver name", value: "Ana Torres" },
    phone: { label: "Phone number", value: "5551234567", country: "MX" },
    code: { label: "Verification code", value: "123456" },
    biometricPrompt: { label: "Use biometrics", fallback: "Use code instead" },
    primaryAction: { label: "Continue" },
    animatedMoment: { label: "Verification ready", animationSource: "driver.json" },
    feedback: { label: "Onboarding ready", tone: "info" },
    "data-installed-pattern": "driver-onboarding-mobile",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(FleetManagerOnboardingDesktop, {
    label: "Fleet manager onboarding",
    density: "sm",
    inProgress: true,
    metrics: [{ key: "progress", label: "Progress", value: "2/3", tone: "info" }],
    tasks: [{ key: "vehicles", label: "Add vehicles", checked: true }],
    fields: [{ key: "fleet", label: "Fleet name", value: "North" }],
    selects: [{ key: "region", label: "Region", value: "north", options: [{ label: "North", value: "north" }] }],
    reviewColumns: [{ key: "name", label: "Name" }],
    reviewRows: [{ id: "vehicle", name: "MX-4821" }],
    settings: { label: "Setup settings", groups: [{ label: "Preferences", controls: [{ key: "alerts", kind: "checkbox", label: "Alerts", checked: true }] }] },
    primaryAction: { label: "Finish setup" },
    feedback: { label: "Setup ready", tone: "info" },
    "data-installed-pattern": "fleet-manager-onboarding-desktop",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(ActionSheet, {
    label: "Vehicle action sheet",
    description: "Choose a contextual action.",
    density: "sm",
    open: true,
    actions: [
      { key: "assign", label: "Assign driver", prominent: true },
      { key: "remove", label: "Remove vehicle", intent: "danger", tone: "danger" },
    ],
    overflow: { triggerLabel: "More vehicle actions", open: true, items: [{ key: "share", label: "Share" }] },
    search: { label: "Find target", query: "Ana", results: [{ key: "ana", label: "Ana Torres" }] },
    feedback: { label: "Action ready", tone: "info" },
    "data-installed-pattern": "action-sheet",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(SectionHeader, {
    title: "Vehicle assignments",
    description: "Review local assignment state.",
    headingLevel: 3,
    density: "sm",
    badge: { label: "12 ready", tone: "info", variant: "status" },
    tag: { label: "Draft", tone: "warning" },
    dirty: true,
    actions: [{ key: "save", label: "Save", variant: "primary" }],
    overflow: { triggerLabel: "More section actions", open: true, items: [{ key: "export", label: "Export" }] },
    toolbar: { label: "Section actions", actions: [{ key: "refresh", label: "Refresh" }] },
    settings: { groups: [{ title: "Display", controls: [{ label: "Compact view", checked: true }] }] },
    formSection: { title: "Assignment details", fields: [{ label: "Owner", value: "Ana" }] },
    "data-installed-pattern": "section-header",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(Search, {
    label: "Search vehicles",
    density: "sm",
    query: "MX",
    scopes: [{ label: "Vehicles", value: "vehicles" }, { label: "Drivers", value: "drivers" }],
    scopeValue: "vehicles",
    results: [{ key: "mx-4821", label: "MX-4821", meta: "Active" }],
    resultCount: 1,
    submitAction: { label: "Search" },
    clearAction: { label: "Clear" },
    "data-installed-pattern": "search",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(VirtualDataTable, {
    label: "Vehicles",
    density: "sm",
    virtualized: true,
    columns: [{ key: "unit", label: "Unit" }, { key: "status", label: "Status" }],
    rows: [{ id: "mx-4821", unit: "MX-4821", status: "Active" }, { id: "mx-8840", unit: "MX-8840", status: "Maintenance" }],
    selectedKeys: ["mx-4821"],
    selection: { enabled: true, label: "Select vehicles" },
    bulkActions: [{ label: "Assign", variant: "secondary" }],
    page: 1,
    pageCount: 3,
    pagination: { label: "Vehicle pages" },
    "data-installed-pattern": "virtual-data-table",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(ConfigurationConsole, {
    label: "Configuration console",
    density: "sm",
    selectedModule: "drivers",
    "data-installed-template": "configuration-console",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(DriverCardWallet, {
    label: "Driver card wallet",
    density: "sm",
    selectedSection: "movements",
    "data-installed-template": "driver-card-wallet",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(DriverMobileApp, {
    label: "Driver mobile app",
    density: "sm",
    selectedTab: "routes",
    "data-installed-template": "driver-mobile-app",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(FleetDashboardSuite, {
    label: "Fleet dashboard suite",
    density: "sm",
    selectedDashboard: "finance",
    drawerOpen: true,
    financeVisible: false,
    "data-installed-template": "fleet-dashboard-suite",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(FleetManagerDesktop, {
    label: "Fleet manager desktop",
    density: "sm",
    selectedDashboard: "fuel",
    "data-installed-template": "fleet-manager-desktop",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(RoutesAndStations, {
    label: "Routes and stations",
    density: "sm",
    selectedStationKey: "industrial",
    "data-installed-template": "routes-and-stations",
    style: { color: "red" },
    dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
  }),
  React.createElement(Button, { label: "Continue", variant: "primary" }),
);

const markup = renderToStaticMarkup(screen);
assert.match(markup, /product-screen/);
assert.match(markup, /class="card/);
assert.match(markup, /class="input/);
assert.match(markup, /data-installed-primitive="surface"/);
assert.match(markup, /class="table/);
assert.match(markup, /class="dialog/);
assert.match(markup, /data-flow-pattern="select-option-layer"/);
assert.match(markup, /class="select-control/);
assert.match(markup, /class="inline-validation/);
assert.match(markup, /data-flow-pattern="filter-chip-group"/);
assert.match(markup, /class="chip/);
assert.match(markup, /class="toast/);
assert.match(markup, /data-flow-pattern="avatar-group"/);
assert.match(markup, /class="avatar/);
assert.match(markup, /class="popover/);
assert.match(markup, /class="list/);
assert.match(markup, /data-flow-pattern="snackbar-provider"/);
assert.match(markup, /data-flow-pattern="autocomplete"/);
assert.match(markup, /class="combobox/);
assert.match(markup, /data-flow-pattern="kpi-card"/);
assert.match(markup, /class="kpi-tile/);
assert.match(markup, /data-flow-pattern="confirmation-dialog"/);
assert.match(markup, /data-flow-pattern="drawer-adapter"/);
assert.match(markup, /data-installed-pattern="drawer-adapter"/);
assert.match(markup, /data-multi-step-form-boundary="true"/);
assert.match(markup, /data-flow-pattern="file-upload"/);
assert.match(markup, /data-flow-primitive="surface"/);
assert.match(markup, /class="progress/);
assert.match(markup, /data-flow-pattern="multi-select"/);
assert.match(markup, /class="choice checkbox/);
assert.match(markup, /data-flow-pattern="multi-step-form"/);
assert.match(markup, /data-installed-pattern="multi-step-form"/);
assert.match(markup, /data-form-section-boundary="true"/);
assert.match(markup, /data-flow-pattern="form-section"/);
assert.match(markup, /class="surface/);
assert.match(markup, /class="text-area/);
assert.match(markup, /data-flow-pattern="fullscreen-sheet"/);
assert.match(markup, /data-installed-pattern="fullscreen-sheet"/);
assert.match(markup, /data-action-sheet-boundary="true"/);
assert.match(markup, /class="stepper/);
assert.match(markup, /data-flow-pattern="roles-and-permissions"/);
assert.match(markup, /data-role-count="2"/);
assert.match(markup, /class="switch/);
assert.match(markup, /class="audit-event/);
assert.match(markup, /data-flow-pattern="avatar-menu"/);
assert.match(markup, /data-action-count="3"/);
assert.match(markup, /data-flow-pattern="notification-panel"/);
assert.match(markup, /data-notification-count="2"/);
assert.match(markup, /data-flow-pattern="pull-to-refresh"/);
assert.match(markup, /data-installed-pattern="pull-to-refresh"/);
assert.match(markup, /data-flow-pattern="quick-actions-grid"/);
assert.match(markup, /data-installed-pattern="quick-actions-grid"/);
assert.match(markup, /data-search-boundary="true"/);
assert.match(markup, /data-flow-pattern="command-palette"/);
assert.match(markup, /data-command-count="1"/);
assert.match(markup, /data-flow-pattern="drag-sortable-list"/);
assert.match(markup, /data-installed-pattern="drag-sortable-list"/);
assert.match(markup, /data-flow-pattern="settings"/);
assert.match(markup, /class="surface/);
assert.match(markup, /data-flow-pattern="sidebar"/);
assert.match(markup, /class="accordion/);
assert.match(markup, /data-flow-pattern="swipe-actions"/);
assert.match(markup, /data-installed-pattern="swipe-actions"/);
assert.match(markup, /data-non-swipe-access="true"/);
assert.match(markup, /data-flow-pattern="timeline"/);
assert.match(markup, /data-installed-pattern="timeline"/);
assert.match(markup, /data-flow-pattern="topbar"/);
assert.match(markup, /data-installed-pattern="topbar"/);
assert.match(markup, /data-mobile="true"/);
assert.match(markup, /class="drawer/);
assert.match(markup, /class="icon-button/);
assert.match(markup, /class="badge/);
assert.match(markup, /class="menu/);
assert.match(markup, /data-flow-pattern="toolbar"/);
assert.match(markup, /data-installed-pattern="toolbar"/);
assert.match(markup, /data-flow-pattern="bulk-actions"/);
assert.match(markup, /data-installed-pattern="bulk-actions"/);
assert.match(markup, /data-flow-pattern="calendar-view"/);
assert.match(markup, /data-installed-pattern="calendar-view"/);
assert.match(markup, /data-flow-pattern="chart-wrapper"/);
assert.match(markup, /data-installed-pattern="chart-wrapper"/);
assert.match(markup, /data-flow-pattern="chart-legend-item"/);
assert.match(markup, /data-installed-pattern="chart-legend-item"/);
assert.match(markup, /data-flow-pattern="column-configurator"/);
assert.match(markup, /data-installed-pattern="column-configurator"/);
assert.match(markup, /class="choice checkbox"/);
assert.match(markup, /class="progress/);
assert.match(markup, /data-flow-pattern="transfer-list"/);
assert.match(markup, /data-installed-pattern="transfer-list"/);
assert.match(markup, /data-multi-select-boundary="true"/);
assert.match(markup, /data-flow-pattern="help-center"/);
assert.match(markup, /data-installed-pattern="help-center"/);
assert.match(markup, /data-search-boundary="true"/);
assert.match(markup, /data-sidebar-boundary="true"/);
assert.match(markup, /data-flow-pattern="advanced-filters"/);
assert.match(markup, /data-installed-pattern="advanced-filters"/);
assert.match(markup, /class="drawer/);
assert.match(markup, /class="select-control/);
assert.match(markup, /class="field date-picker date-range-picker"/);
assert.match(markup, /data-flow-pattern="authentication-login-biometrics-and-otp"/);
assert.match(markup, /data-installed-pattern="authentication-login-biometrics-and-otp"/);
assert.match(markup, /data-flow-pattern="driver-and-vehicle-administration"/);
assert.match(markup, /data-installed-pattern="driver-and-vehicle-administration"/);
assert.match(markup, /data-admin-toolbar-boundary="true"/);
assert.match(markup, /data-admin-surface="true"/);
assert.match(markup, /data-flow-pattern="driver-onboarding-mobile"/);
assert.match(markup, /data-installed-pattern="driver-onboarding-mobile"/);
assert.match(markup, /data-driver-onboarding-surface="true"/);
assert.match(markup, /data-form-section-boundary="true"/);
assert.match(markup, /data-flow-pattern="fleet-manager-onboarding-desktop"/);
assert.match(markup, /data-installed-pattern="fleet-manager-onboarding-desktop"/);
assert.match(markup, /data-fleet-manager-onboarding-surface="true"/);
assert.match(markup, /data-settings-boundary="true"/);
assert.match(markup, /data-flow-pattern="action-sheet"/);
assert.match(markup, /data-installed-pattern="action-sheet"/);
assert.match(markup, /data-search-handoff="true"/);
assert.match(markup, /data-flow-pattern="section-header"/);
assert.match(markup, /data-installed-pattern="section-header"/);
assert.match(markup, /Vehicle assignments/);
assert.match(markup, /data-flow-pattern="search"/);
assert.match(markup, /data-flow-pattern="station-discovery"/);
assert.match(markup, /data-installed-pattern="station-discovery"/);
assert.match(markup, /data-map-primitive="maps"/);
assert.match(markup, /data-result-count="1"/);
assert.match(markup, /class="select/);
assert.match(markup, /data-flow-pattern="virtual-data-table"/);
assert.match(markup, /data-virtualized="true"/);
assert.match(markup, /data-flow-template="configuration-console"/);
assert.match(markup, /data-installed-template="configuration-console"/);
assert.match(markup, /data-template-slot="global-shell"/);
assert.match(markup, /data-template-module="permission-matrix"/);
assert.match(markup, /data-selected-module="drivers"/);
assert.match(markup, /data-flow-template="driver-card-wallet"/);
assert.match(markup, /data-installed-template="driver-card-wallet"/);
assert.match(markup, /data-template-slot="wallet-shell"/);
assert.match(markup, /data-template-module="card-status-block"/);
assert.match(markup, /data-template-module="quick-actions"/);
assert.match(markup, /data-template-module="movement-receipt-detail"/);
assert.match(markup, /data-selected-section="movements"/);
assert.match(markup, /data-flow-template="driver-mobile-app"/);
assert.match(markup, /data-installed-template="driver-mobile-app"/);
assert.match(markup, /data-template-slot="mobile-shell"/);
assert.match(markup, /data-template-module="mobile-card-overview"/);
assert.match(markup, /data-template-module="driver-readiness-onboarding"/);
assert.match(markup, /data-template-module="routes-and-nearby-stations-mobile"/);
assert.match(markup, /data-selected-tab="routes"/);
assert.match(markup, /data-flow-template="fleet-dashboard-suite"/);
assert.match(markup, /data-installed-template="fleet-dashboard-suite"/);
assert.match(markup, /data-template-module="dashboard-switcher"/);
assert.match(markup, /data-template-module="shared-filter-bar"/);
assert.match(markup, /data-template-module="domain-kpi-stack"/);
assert.match(markup, /data-template-module="drill-down-table"/);
assert.match(markup, /data-chart-primitive="charts"/);
assert.match(markup, /data-selected-dashboard="finance"/);
assert.match(markup, /data-flow-template="fleet-manager-desktop"/);
assert.match(markup, /data-installed-template="fleet-manager-desktop"/);
assert.match(markup, /data-template-module="executive-kpi-band"/);
assert.match(markup, /data-template-module="exception-inbox"/);
assert.match(markup, /data-template-module="cost-center-scope-permissions"/);
assert.match(markup, /data-selected-dashboard="fuel"/);
assert.match(markup, /data-flow-template="routes-and-stations"/);
assert.match(markup, /data-installed-template="routes-and-stations"/);
assert.match(markup, /data-template-slot="discovery-region"/);
assert.match(markup, /data-template-module="routes-and-nearby-stations-mobile"/);
assert.match(markup, /data-template-module="station-services-panel"/);
assert.match(markup, /data-template-module="route-handoff"/);
assert.match(markup, /data-selected-station="industrial"/);
assert.match(markup, /class="pagination/);
assert.match(markup, /class="button button--primary"/);
assert.doesNotMatch(markup, /apps\\/docs|docs-demo|gold-|<form|data-multi-select-count|type="file"|rgb\\(255,\\s*0,\\s*0\\)|margin-top|Injected markup/);
console.log(markup.length);
`;
  fs.writeFileSync(path.join(consumerDir, "screen.mjs"), source.trimStart());
}

function writeConsumerCssEntrypoint(consumerDir) {
  const source = `
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const cssExports = [
  {
    specifier: "@alohasoyrico-eng/flow/tokens/styles.css",
    marker: "--sys-color-surface:",
  },
  {
    specifier: "@alohasoyrico-eng/flow/components/styles.css",
    marker: "--comp-button-bg-primary:",
  },
];
const resolved = cssExports.map((item) => ({ ...item, file: require.resolve(item.specifier) }));
for (const item of resolved) {
  assert.match(
    item.file,
    /node_modules\\/@alohasoyrico-eng\\/flow\\//,
    \`Expected \${item.specifier} to resolve from the installed Flow package.\`,
  );
  const css = fs.readFileSync(item.file, "utf8");
  assert.ok(css.includes(item.marker), \`Expected \${item.specifier} to include \${item.marker}\`);
  assert.doesNotMatch(css, /apps\\/docs|docs-demo|sourceMappingURL|@design-system\\/components/);
  for (const importMatch of css.matchAll(/@import\\s+"([^"]+)"/g)) {
    const importPath = importMatch[1].replace(/\\?.*$/, "");
    const resolvedImport = importPath.startsWith(".")
      ? new URL(importPath, \`file://\${item.file}\`).pathname
      : require.resolve(importPath);
    assert.match(
      resolvedImport,
      /node_modules\\/@alohasoyrico-eng\\/flow\\//,
      \`Expected CSS import \${importMatch[1]} from \${item.specifier} to resolve inside Flow.\`,
    );
  }
}

const entrypoint = [
  '@import "@alohasoyrico-eng/flow/tokens/styles.css";',
  '@import "@alohasoyrico-eng/flow/components/styles.css";',
  ".product-screen {",
  "  color: var(--sys-color-text);",
  "  background: var(--sys-color-surface);",
  "}",
].join("\\n");
fs.writeFileSync("consumer-flow.css", \`\${entrypoint}\\n\`);
const importedSpecifiers = [...entrypoint.matchAll(/@import\\s+"([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(importedSpecifiers, cssExports.map((item) => item.specifier));

const combinedCss = importedSpecifiers
  .map((specifier) => fs.readFileSync(require.resolve(specifier), "utf8"))
  .join("\\n");
assert.ok(
  combinedCss.indexOf("--sys-color-surface:") < combinedCss.indexOf("--comp-button-bg-primary:"),
  "Expected product CSS entrypoints to load tokens before component aliases.",
);
for (const expectedCascadeHook of [
  '.button[data-density="sm"]',
  '.card[data-density="lg"]',
  '.field[data-density="sm"]',
  '.table[data-density="sm"]',
]) {
  assert.ok(combinedCss.includes(expectedCascadeHook), \`Expected consumer CSS entrypoint to preserve \${expectedCascadeHook}\`);
}
`;
  fs.writeFileSync(path.join(consumerDir, "css-entrypoint.mjs"), source.trimStart());
}

function writeConsumerRefRuntime(consumerDir) {
  const reactSubpathAssertions = goldComponents.map((componentId) => ({
    componentId,
    exportName: pascalCase(componentId),
  }));
  const jsdomUrl = pathToFileURL(auditRequire.resolve("jsdom")).href;
  const source = `
import assert from "node:assert/strict";
import jsdomModule from ${JSON.stringify(jsdomUrl)};
import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { componentContracts } from "@alohasoyrico-eng/flow/components/contracts";

const { JSDOM } = jsdomModule;
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const reactBarrel = await import("@alohasoyrico-eng/flow/react");
const platformSurface = await import("@alohasoyrico-eng/flow/components/platforms");
const reactSubpathAssertions = ${JSON.stringify(reactSubpathAssertions, null, 2)};

function contractKeyForComponent(componentId) {
  return componentId.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function fixtureForContract(componentId, contract) {
  const props = {};
  for (const prop of contract.props ?? []) {
    if (!prop.required) continue;
    props[prop.name] = valueForRequiredProp(prop.name);
  }
  if (componentId === "button") props.label = "Reference";
  if (componentId === "chart-panel") {
    props.values = [1, 2, 3];
    props.labels = ["One", "Two", "Three"];
  }
  if (componentId === "chat-message") props.body = "Reference message";
  if (componentId === "icon-button") props.ariaLabel = "Reference action";
  if (["dialog", "drawer"].includes(componentId)) props.open = true;
  return props;
}

function valueForRequiredProp(name) {
  switch (name) {
    case "ariaLabel":
      return "Reference action";
    case "columns":
      return [{ key: "name", label: "Name" }];
    case "fallback":
      return "Use your passcode";
    case "getPageLabel":
      return (page) => \`Reference page \${page}\`;
    case "icon":
      return "check";
    case "items":
      return [
        { id: "one", key: "one", label: "One", title: "One", content: "One content", value: "one" },
        { id: "two", key: "two", label: "Two", title: "Two", content: "Two content", value: "two" },
      ];
    case "label":
      return "Reference";
    case "name":
      return "reference";
    case "nodes":
      return [{ key: "root", label: "Root", children: [{ key: "child", label: "Child" }] }];
    case "options":
      return [{ label: "One", value: "one", meta: "Option" }];
    case "page":
      return 1;
    case "pageCount":
      return 3;
    case "previousLabel":
      return "Previous reference page";
    case "nextLabel":
      return "Next reference page";
    case "rowKey":
      return "id";
    case "rows":
      return [{ id: "row-1", name: "Row one" }];
    case "steps":
      return [{ id: "one", label: "One" }, { id: "two", label: "Two" }];
    case "title":
      return "Reference";
    case "triggerLabel":
      return "Open reference";
    case "value":
      return "Reference";
    default:
      return "Reference";
  }
}

function hasClasses(element, classNames) {
  return classNames.every((className) => element.classList.contains(className));
}

function contractualRefTarget(element, rootClass) {
  const rootClasses = String(rootClass ?? "").split(/\\s+/).filter(Boolean);
  for (let node = element; node; node = node.parentElement) {
    if (hasClasses(node, rootClasses)) return node;
  }
  return null;
}

const failures = [];
for (const { componentId, exportName } of reactSubpathAssertions) {
  const Component = reactBarrel[exportName];
  const contractKey = contractKeyForComponent(componentId);
  const contract = componentContracts[contractKey];
  const platformContract = platformSurface[\`\${contractKey}PlatformContract\`];
  const rootClass = platformContract?.source?.cssClass;
  const ref = React.createRef();
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    assert.ok(contract, \`Expected installed contract for \${componentId}\`);
    assert.ok(rootClass, \`Expected installed platform root cssClass for \${componentId}\`);
    flushSync(() => {
      root.render(React.createElement(Component, {
        ...fixtureForContract(componentId, contract),
        ref,
      }));
    });
    assert.ok(ref.current instanceof HTMLElement, \`\${componentId} did not forward ref to an HTMLElement\`);
    assert.ok(
      contractualRefTarget(ref.current, rootClass),
      \`\${componentId} forwarded ref outside contractual root .\${rootClass}: \${ref.current?.className || ref.current?.tagName}\`,
    );
  } catch (error) {
    failures.push(\`\${componentId}: \${error.message}\`);
  } finally {
    root.unmount();
    container.remove();
  }
}
assert.deepEqual(failures, []);
`;
  fs.writeFileSync(path.join(consumerDir, "ref-runtime.mjs"), source.trimStart());
}

function writeConsumerInteractionRuntime(consumerDir) {
  const jsdomUrl = pathToFileURL(auditRequire.resolve("jsdom")).href;
  const source = `
import assert from "node:assert/strict";
import jsdomModule from ${JSON.stringify(jsdomUrl)};
import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { Accordion, Button, Card, Checkbox, Input, Select, Switch } from "@alohasoyrico-eng/flow/react";
import { ConfigurationConsole } from "@alohasoyrico-eng/flow/react/templates/configuration-console";
import { DriverCardWallet } from "@alohasoyrico-eng/flow/react/templates/driver-card-wallet";
import { DriverMobileApp } from "@alohasoyrico-eng/flow/react/templates/driver-mobile-app";
import { FleetDashboardSuite } from "@alohasoyrico-eng/flow/react/templates/fleet-dashboard-suite";
import { FleetManagerDesktop } from "@alohasoyrico-eng/flow/react/templates/fleet-manager-desktop";
import { RoutesAndStations } from "@alohasoyrico-eng/flow/react/templates/routes-and-stations";

const { JSDOM } = jsdomModule;
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.HTMLInputElement = dom.window.HTMLInputElement;
globalThis.Node = dom.window.Node;
globalThis.Event = dom.window.Event;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.MouseEvent = dom.window.MouseEvent;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

function mount(element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  flushSync(() => root.render(element));
  return {
    container,
    rerender(nextElement) {
      flushSync(() => root.render(nextElement));
    },
    unmount() {
      root.unmount();
      container.remove();
    },
  };
}

function click(element) {
  flushSync(() => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
}

function keyDown(element, key) {
  flushSync(() => {
    element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  });
}

function templateRoot(container, id) {
  const root = container.querySelector(\`[data-flow-template="\${id}"]\`);
  assert.ok(root, \`Expected \${id} template root.\`);
  return root;
}

function clickTarget(container, targetSelector) {
  const target = [...container.querySelectorAll(targetSelector)].at(-1);
  assert.ok(target, \`Expected target \${targetSelector}.\`);
  click(target);
  return target;
}

function clickLastButtonByLabel(container, label) {
  const buttons = [...container.querySelectorAll("button")].filter((button) => button.getAttribute("aria-label") === label);
  const button = buttons.at(-1);
  assert.ok(button, \`Expected button \${label}.\`);
  click(button);
  return button;
}

function assertInstalledTemplateUncontrolledSelection({ Component, id, selectedAttribute, defaultProp, callbackProp, initial, targetSelector, expected }) {
  const events = [];
  const harness = mount(React.createElement(Component, {
    [defaultProp]: initial,
    [callbackProp]: (...args) => events.push([args[0], args.at(-1)?.type]),
  }));
  assert.equal(templateRoot(harness.container, id).getAttribute(selectedAttribute), initial);
  clickTarget(harness.container, targetSelector);
  assert.equal(templateRoot(harness.container, id).getAttribute(selectedAttribute), expected);
  assert.deepEqual(events.at(-1), [expected, "click"]);
  harness.unmount();
}

function assertInstalledTemplateControlledSelection({ Component, id, selectedAttribute, selectedProp, callbackProp, initial, targetSelector, expected }) {
  const events = [];
  const harness = mount(React.createElement(Component, {
    [selectedProp]: initial,
    [callbackProp]: (...args) => events.push([args[0], args.at(-1)?.type]),
  }));
  assert.equal(templateRoot(harness.container, id).getAttribute(selectedAttribute), initial);
  clickTarget(harness.container, targetSelector);
  assert.deepEqual(events.at(-1), [expected, "click"]);
  assert.equal(templateRoot(harness.container, id).getAttribute(selectedAttribute), initial);
  harness.rerender(React.createElement(Component, {
    [selectedProp]: expected,
    [callbackProp]: (...args) => events.push([args[0], args.at(-1)?.type]),
  }));
  assert.equal(templateRoot(harness.container, id).getAttribute(selectedAttribute), expected);
  harness.unmount();
}

function assertInstalledTemplateShellDrawerToggle({ Component, id }) {
  const events = [];
  const harness = mount(React.createElement(Component, {
    drawerOpen: true,
    onDrawerOpenChange: (open, event) => events.push([open, event?.type]),
  }));
  assert.equal(templateRoot(harness.container, id).getAttribute("data-flow-template"), id);
  const parallelCloseButtons = [...harness.container.querySelectorAll("button")]
    .filter((button) => button.getAttribute("aria-label") === "Close navigation");
  assert.equal(parallelCloseButtons.length, 0, "Shell navigation drawer must not render a parallel close button by default.");
  clickLastButtonByLabel(harness.container, "Open navigation");
  assert.deepEqual(events.at(-1), [false, "click"]);
  harness.unmount();
}

const accordionChanges = [];
const accordionHarness = mount(React.createElement(Accordion, {
  items: [
    { id: "overview", title: "Overview", content: "Route overview" },
    { id: "pricing", title: "Pricing", content: "Route pricing" },
  ],
  onExpandedChange: (expandedIds, event) => accordionChanges.push({ expandedIds, eventType: event.type }),
}));
const accordionTriggers = accordionHarness.container.querySelectorAll("[data-accordion-trigger]");
assert.equal(accordionTriggers[0].getAttribute("aria-expanded"), "false");
click(accordionTriggers[0]);
assert.equal(accordionTriggers[0].getAttribute("aria-expanded"), "true");
assert.deepEqual(accordionChanges.at(-1), { expandedIds: ["overview"], eventType: "click" });
click(accordionTriggers[1]);
assert.equal(accordionTriggers[0].getAttribute("aria-expanded"), "false");
assert.equal(accordionTriggers[1].getAttribute("aria-expanded"), "true");
assert.deepEqual(accordionChanges.at(-1), { expandedIds: ["pricing"], eventType: "click" });
accordionHarness.unmount();

const buttonClicks = [];
const buttonHarness = mount(React.createElement(Button, {
  label: "Continue",
  onClick: (event) => buttonClicks.push(event.type),
}));
click(buttonHarness.container.querySelector("button"));
assert.deepEqual(buttonClicks, ["click"]);
buttonHarness.unmount();

const cardActions = [];
const cardHarness = mount(React.createElement(Card, {
  title: "Wallet balance",
  value: "$8,412.50",
  interactive: true,
  actionKey: "wallet-balance",
  onAction: (key, action, event) => cardActions.push({ key, action, eventType: event.type, eventKey: event.key }),
}));
const cardControl = cardHarness.container.querySelector(".card");
click(cardControl);
keyDown(cardControl, "Enter");
assert.deepEqual(cardActions, [
  { key: "wallet-balance", action: undefined, eventType: "click", eventKey: undefined },
  { key: "wallet-balance", action: undefined, eventType: "keydown", eventKey: "Enter" },
]);
cardHarness.unmount();

const checkboxChanges = [];
const checkboxHarness = mount(React.createElement(Checkbox, {
  label: "Accept terms",
  value: "terms",
  onCheckedChange: (checked, meta, event) => checkboxChanges.push({ checked, meta, eventType: event.type }),
}));
const checkboxInput = checkboxHarness.container.querySelector("input[type='checkbox']");
click(checkboxInput);
assert.deepEqual(checkboxChanges.at(-1), {
  checked: true,
  meta: { indeterminate: false, value: "terms" },
  eventType: "change",
});
assert.equal(checkboxInput.checked, true);
checkboxHarness.unmount();

const controlledCheckboxChanges = [];
let controlledCheckboxChecked = false;
const controlledCheckboxHarness = mount(React.createElement(Checkbox, {
  label: "Controlled terms",
  value: "terms",
  checked: controlledCheckboxChecked,
  onCheckedChange: (checked) => controlledCheckboxChanges.push(checked),
}));
const controlledCheckboxInput = controlledCheckboxHarness.container.querySelector("input[type='checkbox']");
click(controlledCheckboxInput);
assert.deepEqual(controlledCheckboxChanges, [true]);
assert.equal(controlledCheckboxInput.checked, false);
controlledCheckboxChecked = true;
controlledCheckboxHarness.rerender(React.createElement(Checkbox, {
  label: "Controlled terms",
  value: "terms",
  checked: controlledCheckboxChecked,
  onCheckedChange: (checked) => controlledCheckboxChanges.push(checked),
}));
assert.equal(controlledCheckboxHarness.container.querySelector("input[type='checkbox']").checked, true);
controlledCheckboxHarness.unmount();

const inputChanges = [];
const inputHarness = mount(React.createElement(Input, {
  label: "Password",
  type: "password",
  value: "secret",
  revealable: true,
  revealLabel: "Show password",
  hideLabel: "Hide password",
  onRevealChange: (revealed, event) => inputChanges.push({ revealed, eventType: event.type }),
}));
const inputControl = inputHarness.container.querySelector("input");
assert.equal(inputControl.type, "password");
click(inputHarness.container.querySelector(".field-action"));
assert.deepEqual(inputChanges.at(-1), { revealed: true, eventType: "click" });
assert.equal(inputControl.type, "text");
inputHarness.unmount();

const selectOpenChanges = [];
const selectValueChanges = [];
let selectedValue = "one";
let selectOpen = false;
const selectHarness = mount(React.createElement(Select, {
  label: "Status",
  value: selectedValue,
  open: selectOpen,
  options: [
    { label: "One", value: "one", meta: "Current" },
    { label: "Two", value: "two", meta: "Next" },
  ],
  onOpenChange: (open, event) => selectOpenChanges.push({ open, eventType: event?.type }),
  onValueChange: (value, meta, event) => selectValueChanges.push({ value, meta, eventType: event.type }),
}));
const selectTrigger = selectHarness.container.querySelector("[data-select-trigger]");
click(selectTrigger);
assert.deepEqual(selectOpenChanges.at(-1), { open: true, eventType: "click" });
assert.equal(selectTrigger.getAttribute("aria-expanded"), "false");
selectOpen = true;
selectHarness.rerender(React.createElement(Select, {
  label: "Status",
  value: selectedValue,
  open: selectOpen,
  options: [
    { label: "One", value: "one", meta: "Current" },
    { label: "Two", value: "two", meta: "Next" },
  ],
  onOpenChange: (open, event) => selectOpenChanges.push({ open, eventType: event?.type }),
  onValueChange: (value, meta, event) => selectValueChanges.push({ value, meta, eventType: event.type }),
}));
assert.equal(selectHarness.container.querySelector("[data-select-trigger]").getAttribute("aria-expanded"), "true");
click(selectHarness.container.querySelector("[data-value='two']"));
assert.deepEqual(selectValueChanges.at(-1), { value: "two", meta: { label: "Two", meta: "Next" }, eventType: "click" });
selectHarness.unmount();

const switchChanges = [];
const switchHarness = mount(React.createElement(Switch, {
  label: "Active route",
  name: "active-route",
  onCheckedChange: (checked, meta, event) => switchChanges.push({ checked, meta, eventType: event.type }),
}));
const switchInput = switchHarness.container.querySelector("input[role='switch']");
click(switchInput);
assert.deepEqual(switchChanges.at(-1), {
  checked: true,
  meta: { name: "active-route" },
  eventType: "change",
});
assert.equal(switchInput.checked, true);
switchHarness.unmount();

const controlledSwitchChanges = [];
let controlledSwitchChecked = false;
const controlledSwitchHarness = mount(React.createElement(Switch, {
  label: "Controlled route",
  checked: controlledSwitchChecked,
  onCheckedChange: (checked) => controlledSwitchChanges.push(checked),
}));
const controlledSwitchInput = controlledSwitchHarness.container.querySelector("input[role='switch']");
click(controlledSwitchInput);
assert.deepEqual(controlledSwitchChanges, [true]);
assert.equal(controlledSwitchInput.checked, false);
controlledSwitchChecked = true;
controlledSwitchHarness.rerender(React.createElement(Switch, {
  label: "Controlled route",
  checked: controlledSwitchChecked,
  onCheckedChange: (checked) => controlledSwitchChanges.push(checked),
}));
assert.equal(controlledSwitchHarness.container.querySelector("input[role='switch']").checked, true);
controlledSwitchHarness.unmount();

assertInstalledTemplateUncontrolledSelection({
  Component: ConfigurationConsole,
  id: "configuration-console",
  selectedAttribute: "data-selected-module",
  defaultProp: "defaultSelectedModule",
  callbackProp: "onSelectedModuleChange",
  initial: "permissions",
  targetSelector: '[data-sidebar-route="drivers"] button',
  expected: "drivers",
});
assertInstalledTemplateControlledSelection({
  Component: ConfigurationConsole,
  id: "configuration-console",
  selectedAttribute: "data-selected-module",
  selectedProp: "selectedModule",
  callbackProp: "onSelectedModuleChange",
  initial: "permissions",
  targetSelector: '[data-sidebar-route="drivers"] button',
  expected: "drivers",
});
assertInstalledTemplateShellDrawerToggle({ Component: ConfigurationConsole, id: "configuration-console" });

assertInstalledTemplateUncontrolledSelection({
  Component: DriverCardWallet,
  id: "driver-card-wallet",
  selectedAttribute: "data-selected-section",
  defaultProp: "defaultSelectedSection",
  callbackProp: "onSelectedSectionChange",
  initial: "card",
  targetSelector: '[data-template-section="help"]',
  expected: "help",
});
assertInstalledTemplateControlledSelection({
  Component: DriverCardWallet,
  id: "driver-card-wallet",
  selectedAttribute: "data-selected-section",
  selectedProp: "selectedSection",
  callbackProp: "onSelectedSectionChange",
  initial: "card",
  targetSelector: '[data-template-section="help"]',
  expected: "help",
});

assertInstalledTemplateUncontrolledSelection({
  Component: DriverMobileApp,
  id: "driver-mobile-app",
  selectedAttribute: "data-selected-tab",
  defaultProp: "defaultSelectedTab",
  callbackProp: "onSelectedTabChange",
  initial: "home",
  targetSelector: '[data-template-tab="support"]',
  expected: "support",
});
assertInstalledTemplateControlledSelection({
  Component: DriverMobileApp,
  id: "driver-mobile-app",
  selectedAttribute: "data-selected-tab",
  selectedProp: "selectedTab",
  callbackProp: "onSelectedTabChange",
  initial: "home",
  targetSelector: '[data-template-tab="support"]',
  expected: "support",
});

assertInstalledTemplateUncontrolledSelection({
  Component: FleetDashboardSuite,
  id: "fleet-dashboard-suite",
  selectedAttribute: "data-selected-dashboard",
  defaultProp: "defaultSelectedDashboard",
  callbackProp: "onSelectedDashboardChange",
  initial: "overview",
  targetSelector: '[data-sidebar-route="finance"] button',
  expected: "finance",
});
assertInstalledTemplateControlledSelection({
  Component: FleetDashboardSuite,
  id: "fleet-dashboard-suite",
  selectedAttribute: "data-selected-dashboard",
  selectedProp: "selectedDashboard",
  callbackProp: "onSelectedDashboardChange",
  initial: "overview",
  targetSelector: '[data-sidebar-route="finance"] button',
  expected: "finance",
});
assertInstalledTemplateShellDrawerToggle({ Component: FleetDashboardSuite, id: "fleet-dashboard-suite" });

assertInstalledTemplateUncontrolledSelection({
  Component: FleetManagerDesktop,
  id: "fleet-manager-desktop",
  selectedAttribute: "data-selected-dashboard",
  defaultProp: "defaultSelectedDashboard",
  callbackProp: "onSelectedDashboardChange",
  initial: "overview",
  targetSelector: '[data-sidebar-route="fuel"] button',
  expected: "fuel",
});
assertInstalledTemplateControlledSelection({
  Component: FleetManagerDesktop,
  id: "fleet-manager-desktop",
  selectedAttribute: "data-selected-dashboard",
  selectedProp: "selectedDashboard",
  callbackProp: "onSelectedDashboardChange",
  initial: "overview",
  targetSelector: '[data-sidebar-route="fuel"] button',
  expected: "fuel",
});
assertInstalledTemplateShellDrawerToggle({ Component: FleetManagerDesktop, id: "fleet-manager-desktop" });

assertInstalledTemplateUncontrolledSelection({
  Component: RoutesAndStations,
  id: "routes-and-stations",
  selectedAttribute: "data-selected-station",
  defaultProp: "defaultSelectedStationKey",
  callbackProp: "onSelectedStationChange",
  initial: "centro",
  targetSelector: '[aria-label*="Industrial Sur"]',
  expected: "industrial",
});
assertInstalledTemplateControlledSelection({
  Component: RoutesAndStations,
  id: "routes-and-stations",
  selectedAttribute: "data-selected-station",
  selectedProp: "selectedStationKey",
  callbackProp: "onSelectedStationChange",
  initial: "centro",
  targetSelector: '[aria-label*="Industrial Sur"]',
  expected: "industrial",
});
`;
  fs.writeFileSync(path.join(consumerDir, "interaction-runtime.mjs"), source.trimStart());
}

function writeConsumerTypes(consumerDir) {
  const templateTypeContracts = [
    {
      id: "configuration-console",
      componentName: "ConfigurationConsole",
      selectedProp: "selectedModule",
      defaultProp: "defaultSelectedModule",
      callbackProp: "onSelectedModuleChange",
      selectedValue: "drivers",
      callback: `(key, route, event) => {
  key.toUpperCase();
  route.label.toUpperCase();
  event.currentTarget.focus();
}`,
      drawer: true,
      extraProps: `sidebar: { groups: [{ title: "Admin", routes: [{ key: "drivers", label: "Drivers" }] }] },
  topbar: { label: "Configuration" },`,
    },
    {
      id: "driver-card-wallet",
      componentName: "DriverCardWallet",
      selectedProp: "selectedSection",
      defaultProp: "defaultSelectedSection",
      callbackProp: "onSelectedSectionChange",
      selectedValue: "movements",
      callback: `(key, event) => {
  key.toUpperCase();
  event.currentTarget.focus();
}`,
      drawer: false,
      extraProps: `movements: [{ key: "fuel", label: "Fuel charge", amount: "$42" }],
  actions: [{ label: "Freeze card" }],`,
    },
    {
      id: "driver-mobile-app",
      componentName: "DriverMobileApp",
      selectedProp: "selectedTab",
      defaultProp: "defaultSelectedTab",
      callbackProp: "onSelectedTabChange",
      selectedValue: "routes",
      callback: `(key, event) => {
  key.toUpperCase();
  event.currentTarget.focus();
}`,
      drawer: false,
      extraProps: `driverOnboarding: { phone: { label: "Phone number" }, primaryAction: { label: "Continue" } },
  stationDiscovery: { label: "Nearby stations", stations: [{ label: "Centro Norte" }] },`,
    },
    {
      id: "fleet-dashboard-suite",
      componentName: "FleetDashboardSuite",
      selectedProp: "selectedDashboard",
      defaultProp: "defaultSelectedDashboard",
      callbackProp: "onSelectedDashboardChange",
      selectedValue: "finance",
      callback: `(key, route, event) => {
  key.toUpperCase();
  route.label.toUpperCase();
  event.currentTarget.focus();
}`,
      drawer: true,
      extraProps: `filters: [{ key: "region", label: "Region", value: "North" }],
  kpis: [{ key: "availability", label: "Availability", value: "96%" }],`,
    },
    {
      id: "fleet-manager-desktop",
      componentName: "FleetManagerDesktop",
      selectedProp: "selectedDashboard",
      defaultProp: "defaultSelectedDashboard",
      callbackProp: "onSelectedDashboardChange",
      selectedValue: "fuel",
      callback: `(key, route, event) => {
  key.toUpperCase();
  route.label.toUpperCase();
  event.currentTarget.focus();
}`,
      drawer: true,
      extraProps: `metrics: [{ key: "availability", label: "Availability", value: "96%" }],
  exceptions: [{ key: "fuel", label: "Fuel exception", severity: "High" }],`,
    },
    {
      id: "routes-and-stations",
      componentName: "RoutesAndStations",
      selectedProp: "selectedStationKey",
      defaultProp: "defaultSelectedStationKey",
      callbackProp: "onSelectedStationChange",
      selectedValue: "industrial",
      callback: `(key, station, event) => {
  key.toUpperCase();
  String(station.label).toUpperCase();
  event.currentTarget.focus();
}`,
      drawer: false,
      extraProps: `stations: [{ key: "industrial", label: "Industrial", meta: "Diesel" }],
  route: { label: "Route 12", distance: "14 km" },`,
    },
  ];
  const reactRootTypeImports = goldComponents.map((componentId) => {
    const componentName = pascalCase(componentId);
    return `${componentName}Props as ${componentName}RootProps, ${componentName}Component as ${componentName}RootComponent`;
  }).join(", ");
  const templateRootTypeImports = templateTypeContracts.map(({ componentName }) => (
    `${componentName}Props as ${componentName}RootProps, ${componentName}Component as ${componentName}RootComponent`
  )).join(", ");
  const templateSubpathTypeImports = templateTypeContracts.map(({ id, componentName }) => (
    `import { ${componentName} as ${componentName}Subpath } from "@alohasoyrico-eng/flow/react/templates/${id}";\nimport type { ${componentName}Props as ${componentName}SubpathProps } from "@alohasoyrico-eng/flow/react/templates/${id}";`
  )).join("\n");
  const templateTypeAssertions = templateTypeContracts.map(({ id, componentName, selectedProp, defaultProp, callbackProp, selectedValue, callback, drawer, extraProps }) => {
    const baseName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}`;
    const drawerProps = drawer ? `\n  drawerOpen: true,\n  defaultDrawerOpen: false,\n  onDrawerOpenChange: (open, event) => {\n    Boolean(open);\n    event?.preventDefault?.();\n  },` : "";
    return `const ${baseName}Props: ${componentName}SubpathProps = {
  density: "sm",
  state: "loaded",
  ${selectedProp}: "${selectedValue}",
  ${defaultProp}: "${selectedValue}",
  ${callbackProp}: ${callback},${drawerProps}
  ${extraProps}
  "data-product-hook": "${id}",
  "aria-label": "${componentName}",
};
const ${baseName}RootProps: ${componentName}RootProps = ${baseName}Props;
const ${baseName}RootComponent: ${componentName}RootComponent = ${componentName}Subpath;
const ${baseName}Element = React.createElement(${componentName}Subpath, { ...${baseName}Props, ref: React.createRef<HTMLDivElement>() });
const ${baseName}PartialProps: Partial<React.ComponentProps<typeof ${componentName}Subpath>> = { ref: React.createRef<HTMLDivElement>(), "data-product-hook": "${id}" };
// @ts-expect-error Flow templates own visual styling; consumers cannot bypass tokens with inline style.
const ${baseName}BadStyle: ${componentName}SubpathProps = { style: { color: "red" } };
// @ts-expect-error Flow templates own rendered structure; consumers cannot inject HTML.
const ${baseName}BadHtml: ${componentName}SubpathProps = { dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Flow templates expose controlled state through ${selectedProp}, not an arbitrary selected prop.
const ${baseName}BadSelectedProp: ${componentName}SubpathProps = { selected: "${selectedValue}" };
void ${baseName}Props;
void ${baseName}RootProps;
void ${baseName}RootComponent;
void ${baseName}Element;
void ${baseName}PartialProps;
void ${baseName}BadStyle;
void ${baseName}BadHtml;
void ${baseName}BadSelectedProp;`;
  }).join("\n");
  const reactSubpathTypeImports = goldComponents.map((componentId) => {
    const componentName = pascalCase(componentId);
    return `import { ${componentName} as ${componentName}Subpath } from "@alohasoyrico-eng/flow/react/${componentId}";\nimport type { ${componentName}Props as ${componentName}SubpathProps } from "@alohasoyrico-eng/flow/react/${componentId}";`;
  }).join("\n");
  const reactSubpathTypeAssertions = goldComponents.map((componentId) => {
    const componentName = pascalCase(componentId);
    const variableName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}SubpathProps`;
    const rootVariableName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}RootProps`;
    const rootComponentName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}RootComponent`;
    return `const ${variableName}: Partial<${componentName}SubpathProps> = {};\nconst ${rootVariableName}: Partial<${componentName}RootProps> = ${variableName};\nconst ${rootComponentName}: ${componentName}RootComponent = ${componentName}Subpath;\nvoid ${componentName}Subpath;\nvoid ${variableName};\nvoid ${rootVariableName};\nvoid ${rootComponentName};`;
  }).join("\n");
  const reactSubpathIntegrationTypeAssertions = goldComponents.map((componentId) => {
    const componentName = pascalCase(componentId);
    const variableName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}IntegrationProps`;
    const badStyleName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}BadStyle`;
    const badHtmlName = `${componentName.slice(0, 1).toLowerCase()}${componentName.slice(1)}BadHtml`;
    return `const ${variableName}: Partial<React.ComponentProps<typeof ${componentName}Subpath>> = { ref: React.createRef<never>(), "data-product-hook": "${componentId}" };\n// @ts-expect-error Flow owns visual styling; consumers cannot bypass tokens with inline style.\nconst ${badStyleName}: Partial<React.ComponentProps<typeof ${componentName}Subpath>> = { style: { color: "red" } };\n// @ts-expect-error Flow owns rendered structure; consumers cannot inject HTML.\nconst ${badHtmlName}: Partial<React.ComponentProps<typeof ${componentName}Subpath>> = { dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };\nvoid ${variableName};\nvoid ${badStyleName};\nvoid ${badHtmlName};`;
  }).join("\n");
  const tsconfig = {
    compilerOptions: {
      module: "NodeNext",
      moduleResolution: "NodeNext",
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: "ES2022",
    },
    include: ["screen-types.ts"],
  };
  fs.writeFileSync(path.join(consumerDir, "tsconfig.json"), `${JSON.stringify(tsconfig, null, 2)}\n`);
  const source = `
import React from "react";
import type { ActionSheetComponent as ActionSheetRootComponent, ActionSheetProps as ActionSheetRootProps, AdvancedFiltersComponent as AdvancedFiltersRootComponent, AdvancedFiltersProps as AdvancedFiltersRootProps, AuthenticationLoginBiometricsAndOtpComponent as AuthenticationLoginBiometricsAndOtpRootComponent, AuthenticationLoginBiometricsAndOtpProps as AuthenticationLoginBiometricsAndOtpRootProps, AvatarGroupComponent as AvatarGroupRootComponent, AvatarGroupProps as AvatarGroupRootProps, AvatarMenuComponent as AvatarMenuRootComponent, AvatarMenuProps as AvatarMenuRootProps, AutocompleteComponent as AutocompleteRootComponent, AutocompleteProps as AutocompleteRootProps, BulkActionsComponent as BulkActionsRootComponent, BulkActionsProps as BulkActionsRootProps, ButtonProps, CalendarViewComponent as CalendarViewRootComponent, CalendarViewProps as CalendarViewRootProps, CardProps, ChartLegendItemComponent as ChartLegendItemRootComponent, ChartLegendItemProps as ChartLegendItemRootProps, ChartWrapperComponent as ChartWrapperRootComponent, ChartWrapperProps as ChartWrapperRootProps, ColumnConfiguratorComponent as ColumnConfiguratorRootComponent, ColumnConfiguratorProps as ColumnConfiguratorRootProps, CommandPaletteComponent as CommandPaletteRootComponent, CommandPaletteProps as CommandPaletteRootProps, ConfirmationDialogComponent as ConfirmationDialogRootComponent, ConfirmationDialogProps as ConfirmationDialogRootProps, DialogProps, DragSortableListComponent as DragSortableListRootComponent, DragSortableListProps as DragSortableListRootProps, DriverAndVehicleAdministrationComponent as DriverAndVehicleAdministrationRootComponent, DriverAndVehicleAdministrationProps as DriverAndVehicleAdministrationRootProps, DriverOnboardingMobileComponent as DriverOnboardingMobileRootComponent, DriverOnboardingMobileProps as DriverOnboardingMobileRootProps, DrawerAdapterComponent as DrawerAdapterRootComponent, DrawerAdapterProps as DrawerAdapterRootProps, FileUploadComponent as FileUploadRootComponent, FileUploadProps as FileUploadRootProps, FleetManagerOnboardingDesktopComponent as FleetManagerOnboardingDesktopRootComponent, FleetManagerOnboardingDesktopProps as FleetManagerOnboardingDesktopRootProps, FilterChipGroupComponent as FilterChipGroupRootComponent, FilterChipGroupProps as FilterChipGroupRootProps, FormSectionComponent as FormSectionRootComponent, FormSectionProps as FormSectionRootProps, FullscreenSheetComponent as FullscreenSheetRootComponent, FullscreenSheetProps as FullscreenSheetRootProps, HelpCenterComponent as HelpCenterRootComponent, HelpCenterProps as HelpCenterRootProps, InputProps, KpiCardComponent as KpiCardRootComponent, KpiCardProps as KpiCardRootProps, MultiSelectComponent as MultiSelectRootComponent, MultiSelectProps as MultiSelectRootProps, MultiStepFormComponent as MultiStepFormRootComponent, MultiStepFormProps as MultiStepFormRootProps, NotificationPanelComponent as NotificationPanelRootComponent, NotificationPanelProps as NotificationPanelRootProps, PullToRefreshComponent as PullToRefreshRootComponent, PullToRefreshProps as PullToRefreshRootProps, QuickActionsGridComponent as QuickActionsGridRootComponent, QuickActionsGridProps as QuickActionsGridRootProps, RolesAndPermissionsComponent as RolesAndPermissionsRootComponent, RolesAndPermissionsProps as RolesAndPermissionsRootProps, SearchComponent as SearchRootComponent, SearchProps as SearchRootProps, SectionHeaderComponent as SectionHeaderRootComponent, SectionHeaderProps as SectionHeaderRootProps, SelectOptionLayerComponent as SelectOptionLayerRootComponent, SelectOptionLayerProps as SelectOptionLayerRootProps, SettingsComponent as SettingsRootComponent, SettingsProps as SettingsRootProps, SidebarComponent as SidebarRootComponent, SidebarProps as SidebarRootProps, SnackbarProviderComponent as SnackbarProviderRootComponent, SnackbarProviderProps as SnackbarProviderRootProps, StationDiscoveryComponent as StationDiscoveryRootComponent, StationDiscoveryProps as StationDiscoveryRootProps, SwipeActionsComponent as SwipeActionsRootComponent, SwipeActionsProps as SwipeActionsRootProps, TableProps, TimelineComponent as TimelineRootComponent, TimelineProps as TimelineRootProps, ToolbarComponent as ToolbarRootComponent, ToolbarProps as ToolbarRootProps, TopbarComponent as TopbarRootComponent, TopbarProps as TopbarRootProps, TransferListComponent as TransferListRootComponent, TransferListProps as TransferListRootProps, VirtualDataTableComponent as VirtualDataTableRootComponent, VirtualDataTableProps as VirtualDataTableRootProps } from "@alohasoyrico-eng/flow/react";
import type { SurfaceComponent as SurfaceRootComponent, SurfaceProps as SurfaceRootProps } from "@alohasoyrico-eng/flow/react";
import type { ${reactRootTypeImports} } from "@alohasoyrico-eng/flow/react";
import type { ${templateRootTypeImports} } from "@alohasoyrico-eng/flow/react";
import { Button, Card, Input, Table } from "@alohasoyrico-eng/flow/react";
import { Dialog } from "@alohasoyrico-eng/flow/react/dialog";
import { Surface as SurfaceSubpath } from "@alohasoyrico-eng/flow/react/surface";
import type { SurfaceComponent as SurfaceSubpathComponent, SurfaceProps as SurfaceSubpathProps } from "@alohasoyrico-eng/flow/react/surface";
import { ActionSheet as ActionSheetSubpath } from "@alohasoyrico-eng/flow/react/patterns/action-sheet";
import type { ActionSheetProps as ActionSheetSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/action-sheet";
import { AdvancedFilters as AdvancedFiltersSubpath } from "@alohasoyrico-eng/flow/react/patterns/advanced-filters";
import type { AdvancedFiltersProps as AdvancedFiltersSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/advanced-filters";
import { AuthenticationLoginBiometricsAndOtp as AuthenticationLoginBiometricsAndOtpSubpath } from "@alohasoyrico-eng/flow/react/patterns/authentication-login-biometrics-and-otp";
import type { AuthenticationLoginBiometricsAndOtpProps as AuthenticationLoginBiometricsAndOtpSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/authentication-login-biometrics-and-otp";
import { AvatarGroup as AvatarGroupSubpath } from "@alohasoyrico-eng/flow/react/patterns/avatar-group";
import type { AvatarGroupProps as AvatarGroupSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/avatar-group";
import { AvatarMenu as AvatarMenuSubpath } from "@alohasoyrico-eng/flow/react/patterns/avatar-menu";
import type { AvatarMenuProps as AvatarMenuSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/avatar-menu";
import { Autocomplete as AutocompleteSubpath } from "@alohasoyrico-eng/flow/react/patterns/autocomplete";
import type { AutocompleteProps as AutocompleteSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/autocomplete";
import { BulkActions as BulkActionsSubpath } from "@alohasoyrico-eng/flow/react/patterns/bulk-actions";
import type { BulkActionsProps as BulkActionsSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/bulk-actions";
import { CalendarView as CalendarViewSubpath } from "@alohasoyrico-eng/flow/react/patterns/calendar-view";
import type { CalendarViewProps as CalendarViewSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/calendar-view";
import { ChartLegendItem as ChartLegendItemSubpath } from "@alohasoyrico-eng/flow/react/patterns/chart-legend-item";
import type { ChartLegendItemProps as ChartLegendItemSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/chart-legend-item";
import { ChartWrapper as ChartWrapperSubpath } from "@alohasoyrico-eng/flow/react/patterns/chart-wrapper";
import type { ChartWrapperProps as ChartWrapperSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/chart-wrapper";
import { ColumnConfigurator as ColumnConfiguratorSubpath } from "@alohasoyrico-eng/flow/react/patterns/column-configurator";
import type { ColumnConfiguratorProps as ColumnConfiguratorSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/column-configurator";
import { CommandPalette as CommandPaletteSubpath } from "@alohasoyrico-eng/flow/react/patterns/command-palette";
import type { CommandPaletteProps as CommandPaletteSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/command-palette";
import { ConfirmationDialog as ConfirmationDialogSubpath } from "@alohasoyrico-eng/flow/react/patterns/confirmation-dialog";
import type { ConfirmationDialogProps as ConfirmationDialogSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/confirmation-dialog";
import { DragSortableList as DragSortableListSubpath } from "@alohasoyrico-eng/flow/react/patterns/drag-sortable-list";
import type { DragSortableListProps as DragSortableListSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/drag-sortable-list";
import { DriverAndVehicleAdministration as DriverAndVehicleAdministrationSubpath } from "@alohasoyrico-eng/flow/react/patterns/driver-and-vehicle-administration";
import type { DriverAndVehicleAdministrationProps as DriverAndVehicleAdministrationSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/driver-and-vehicle-administration";
import { DriverOnboardingMobile as DriverOnboardingMobileSubpath } from "@alohasoyrico-eng/flow/react/patterns/driver-onboarding-mobile";
import type { DriverOnboardingMobileProps as DriverOnboardingMobileSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/driver-onboarding-mobile";
import { DrawerAdapter as DrawerAdapterSubpath } from "@alohasoyrico-eng/flow/react/patterns/drawer-adapter";
import type { DrawerAdapterProps as DrawerAdapterSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/drawer-adapter";
import { FileUpload as FileUploadSubpath } from "@alohasoyrico-eng/flow/react/patterns/file-upload";
import type { FileUploadProps as FileUploadSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/file-upload";
import { FleetManagerOnboardingDesktop as FleetManagerOnboardingDesktopSubpath } from "@alohasoyrico-eng/flow/react/patterns/fleet-manager-onboarding-desktop";
import type { FleetManagerOnboardingDesktopProps as FleetManagerOnboardingDesktopSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/fleet-manager-onboarding-desktop";
import { FilterChipGroup as FilterChipGroupSubpath } from "@alohasoyrico-eng/flow/react/patterns/filter-chip-group";
import type { FilterChipGroupProps as FilterChipGroupSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/filter-chip-group";
import { FormSection as FormSectionSubpath } from "@alohasoyrico-eng/flow/react/patterns/form-section";
import type { FormSectionProps as FormSectionSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/form-section";
import { FullscreenSheet as FullscreenSheetSubpath } from "@alohasoyrico-eng/flow/react/patterns/fullscreen-sheet";
import type { FullscreenSheetProps as FullscreenSheetSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/fullscreen-sheet";
import { HelpCenter as HelpCenterSubpath } from "@alohasoyrico-eng/flow/react/patterns/help-center";
import type { HelpCenterProps as HelpCenterSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/help-center";
import { KpiCard as KpiCardSubpath } from "@alohasoyrico-eng/flow/react/patterns/kpi-card";
import type { KpiCardProps as KpiCardSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/kpi-card";
import { MultiSelect as MultiSelectSubpath } from "@alohasoyrico-eng/flow/react/patterns/multi-select";
import type { MultiSelectProps as MultiSelectSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/multi-select";
import { MultiStepForm as MultiStepFormSubpath } from "@alohasoyrico-eng/flow/react/patterns/multi-step-form";
import type { MultiStepFormProps as MultiStepFormSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/multi-step-form";
import { NotificationPanel as NotificationPanelSubpath } from "@alohasoyrico-eng/flow/react/patterns/notification-panel";
import type { NotificationPanelProps as NotificationPanelSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/notification-panel";
import { PullToRefresh as PullToRefreshSubpath } from "@alohasoyrico-eng/flow/react/patterns/pull-to-refresh";
import type { PullToRefreshProps as PullToRefreshSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/pull-to-refresh";
import { QuickActionsGrid as QuickActionsGridSubpath } from "@alohasoyrico-eng/flow/react/patterns/quick-actions-grid";
import type { QuickActionsGridProps as QuickActionsGridSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/quick-actions-grid";
import { RolesAndPermissions as RolesAndPermissionsSubpath } from "@alohasoyrico-eng/flow/react/patterns/roles-and-permissions";
import type { RolesAndPermissionsProps as RolesAndPermissionsSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/roles-and-permissions";
import { Search as SearchSubpath } from "@alohasoyrico-eng/flow/react/patterns/search";
import type { SearchProps as SearchSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/search";
import { SectionHeader as SectionHeaderSubpath } from "@alohasoyrico-eng/flow/react/patterns/section-header";
import type { SectionHeaderProps as SectionHeaderSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/section-header";
import { VirtualDataTable as VirtualDataTableSubpath } from "@alohasoyrico-eng/flow/react/patterns/virtual-data-table";
import type { VirtualDataTableProps as VirtualDataTableSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/virtual-data-table";
import { SelectOptionLayer as SelectOptionLayerSubpath } from "@alohasoyrico-eng/flow/react/patterns/select-option-layer";
import type { SelectOptionLayerProps as SelectOptionLayerSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/select-option-layer";
import { Settings as SettingsSubpath } from "@alohasoyrico-eng/flow/react/patterns/settings";
import type { SettingsProps as SettingsSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/settings";
import { Sidebar as SidebarSubpath } from "@alohasoyrico-eng/flow/react/patterns/sidebar";
import type { SidebarProps as SidebarSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/sidebar";
import { SnackbarProvider as SnackbarProviderSubpath } from "@alohasoyrico-eng/flow/react/patterns/snackbar-provider";
import type { SnackbarProviderProps as SnackbarProviderSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/snackbar-provider";
import { StationDiscovery as StationDiscoverySubpath } from "@alohasoyrico-eng/flow/react/patterns/station-discovery";
import type { StationDiscoveryProps as StationDiscoverySubpathProps } from "@alohasoyrico-eng/flow/react/patterns/station-discovery";
import { SwipeActions as SwipeActionsSubpath } from "@alohasoyrico-eng/flow/react/patterns/swipe-actions";
import type { SwipeActionsProps as SwipeActionsSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/swipe-actions";
import { Timeline as TimelineSubpath } from "@alohasoyrico-eng/flow/react/patterns/timeline";
import type { TimelineProps as TimelineSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/timeline";
import { Toolbar as ToolbarSubpath } from "@alohasoyrico-eng/flow/react/patterns/toolbar";
import type { ToolbarProps as ToolbarSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/toolbar";
import { Topbar as TopbarSubpath } from "@alohasoyrico-eng/flow/react/patterns/topbar";
import type { TopbarProps as TopbarSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/topbar";
import { TransferList as TransferListSubpath } from "@alohasoyrico-eng/flow/react/patterns/transfer-list";
import type { TransferListProps as TransferListSubpathProps } from "@alohasoyrico-eng/flow/react/patterns/transfer-list";
${reactSubpathTypeImports}
${templateSubpathTypeImports}

const buttonRef = React.createRef<HTMLButtonElement>();
const button = React.createElement(Button, { ref: buttonRef, label: "Continue", variant: "primary", onClick: (event) => event.currentTarget.focus() });

const cardProps: CardProps = { title: "Fleet health", value: "96", actions: [{ label: "Review", variant: "secondary" }] };
const inputProps: InputProps = { label: "Search", value: "MX-4821", onValueChange: (value) => value.toUpperCase() };
const tableProps: TableProps = { label: "Vehicles", columns: [{ key: "unit", label: "Unit" }], rows: [{ id: "1", unit: "MX-4821" }] };
const dialogProps: DialogProps = { label: "Confirm route", open: true, onOpenChange: (open) => Boolean(open) };
const surfaceProps: SurfaceSubpathProps = { surfaceRole: "section", density: "sm", "data-product-hook": "surface" };
const surfaceRootProps: SurfaceRootProps = surfaceProps;
const surfaceRootComponent: SurfaceRootComponent = SurfaceSubpath;
const surfaceSubpathComponent: SurfaceSubpathComponent = SurfaceSubpath;
const actionSheetProps: ActionSheetSubpathProps = { label: "Vehicle actions", actions: [{ key: "assign", label: "Assign driver" }], "data-product-hook": "action-sheet" };
const actionSheetRootProps: ActionSheetRootProps = actionSheetProps;
const actionSheetRootComponent: ActionSheetRootComponent = ActionSheetSubpath;
const advancedFiltersProps: AdvancedFiltersSubpathProps = { fields: [{ label: "Unit", value: "MX" }], appliedFilters: [{ label: "Status: active" }], "data-product-hook": "advanced-filters" };
const advancedFiltersRootProps: AdvancedFiltersRootProps = advancedFiltersProps;
const advancedFiltersRootComponent: AdvancedFiltersRootComponent = AdvancedFiltersSubpath;
const authenticationLoginBiometricsAndOtpProps: AuthenticationLoginBiometricsAndOtpSubpathProps = { phone: { label: "Phone number" }, otp: { label: "Code", value: "123456" }, biometric: { label: "Use biometrics" }, "data-product-hook": "authentication-login-biometrics-and-otp" };
const authenticationLoginBiometricsAndOtpRootProps: AuthenticationLoginBiometricsAndOtpRootProps = authenticationLoginBiometricsAndOtpProps;
const authenticationLoginBiometricsAndOtpRootComponent: AuthenticationLoginBiometricsAndOtpRootComponent = AuthenticationLoginBiometricsAndOtpSubpath;
const avatarGroupProps: AvatarGroupSubpathProps = { identities: [{ name: "Ana Torres" }], "data-product-hook": "avatar-group" };
const avatarGroupRootProps: AvatarGroupRootProps = avatarGroupProps;
const avatarGroupRootComponent: AvatarGroupRootComponent = AvatarGroupSubpath;
const avatarMenuProps: AvatarMenuSubpathProps = { name: "Ana Torres", items: [{ key: "profile", label: "Profile" }], "data-product-hook": "avatar-menu" };
const avatarMenuRootProps: AvatarMenuRootProps = avatarMenuProps;
const avatarMenuRootComponent: AvatarMenuRootComponent = AvatarMenuSubpath;
const autocompleteProps: AutocompleteSubpathProps = { label: "Vehicle", suggestions: [{ label: "MX-4821", value: "mx-4821" }], "data-product-hook": "autocomplete" };
const autocompleteRootProps: AutocompleteRootProps = autocompleteProps;
const autocompleteRootComponent: AutocompleteRootComponent = AutocompleteSubpath;
const bulkActionsProps: BulkActionsSubpathProps = { selectedCount: 2, totalCount: 5, actions: [{ label: "Assign" }], "data-product-hook": "bulk-actions" };
const bulkActionsRootProps: BulkActionsRootProps = bulkActionsProps;
const bulkActionsRootComponent: BulkActionsRootComponent = BulkActionsSubpath;
const calendarViewProps: CalendarViewSubpathProps = { selectedDate: "2026-08-09", events: [{ key: "oil", label: "Oil change" }], dateControl: { label: "Schedule date" }, "data-product-hook": "calendar-view" };
const calendarViewRootProps: CalendarViewRootProps = calendarViewProps;
const calendarViewRootComponent: CalendarViewRootComponent = CalendarViewSubpath;
const chartLegendItemProps: ChartLegendItemSubpathProps = { label: "Fuel spend", value: "$84.2k", selected: true, "data-product-hook": "chart-legend-item" };
const chartLegendItemRootProps: ChartLegendItemRootProps = chartLegendItemProps;
const chartLegendItemRootComponent: ChartLegendItemRootComponent = ChartLegendItemSubpath;
const chartWrapperProps: ChartWrapperSubpathProps = { chart: { values: [1, 2], labels: ["A", "B"] }, table: { columns: [{ key: "period", label: "Period" }], rows: [{ id: "a", period: "A" }] }, "data-product-hook": "chart-wrapper" };
const chartWrapperRootProps: ChartWrapperRootProps = chartWrapperProps;
const chartWrapperRootComponent: ChartWrapperRootComponent = ChartWrapperSubpath;
const columnConfiguratorProps: ColumnConfiguratorSubpathProps = { columns: [{ key: "unit", label: "Unit", required: true }, { key: "status", label: "Status" }], rows: [{ id: "mx-4821", unit: "MX-4821", status: "Active" }], applyAction: { label: "Apply" }, "data-product-hook": "column-configurator" };
const columnConfiguratorRootProps: ColumnConfiguratorRootProps = columnConfiguratorProps;
const columnConfiguratorRootComponent: ColumnConfiguratorRootComponent = ColumnConfiguratorSubpath;
const commandPaletteProps: CommandPaletteSubpathProps = { open: true, commands: [{ key: "open-route", label: "Open route" }], "data-product-hook": "command-palette" };
const commandPaletteRootProps: CommandPaletteRootProps = commandPaletteProps;
const commandPaletteRootComponent: CommandPaletteRootComponent = CommandPaletteSubpath;
const confirmationDialogProps: ConfirmationDialogSubpathProps = { label: "Delete route", open: true, "data-product-hook": "confirmation-dialog" };
const confirmationDialogRootProps: ConfirmationDialogRootProps = confirmationDialogProps;
const confirmationDialogRootComponent: ConfirmationDialogRootComponent = ConfirmationDialogSubpath;
const dragSortableListProps: DragSortableListSubpathProps = { items: [{ key: "summary", label: "Summary", locked: true }, { key: "alerts", label: "Alerts" }], saveAction: { label: "Save" }, undoAction: { label: "Undo" }, "data-product-hook": "drag-sortable-list" };
const dragSortableListRootProps: DragSortableListRootProps = dragSortableListProps;
const dragSortableListRootComponent: DragSortableListRootComponent = DragSortableListSubpath;
const driverAndVehicleAdministrationProps: DriverAndVehicleAdministrationSubpathProps = { records: [{ key: "ana", driver: "Ana Torres", vehicle: "MX-4821" }], toolbar: { actions: [{ label: "Export" }] }, actions: [{ label: "Assign" }], "data-product-hook": "driver-and-vehicle-administration" };
const driverAndVehicleAdministrationRootProps: DriverAndVehicleAdministrationRootProps = driverAndVehicleAdministrationProps;
const driverAndVehicleAdministrationRootComponent: DriverAndVehicleAdministrationRootComponent = DriverAndVehicleAdministrationSubpath;
const driverOnboardingMobileProps: DriverOnboardingMobileSubpathProps = { phone: { label: "Phone number" }, steps: [{ id: "identity", label: "Identity" }], primaryAction: { label: "Continue" }, "data-product-hook": "driver-onboarding-mobile" };
const driverOnboardingMobileRootProps: DriverOnboardingMobileRootProps = driverOnboardingMobileProps;
const driverOnboardingMobileRootComponent: DriverOnboardingMobileRootComponent = DriverOnboardingMobileSubpath;
const drawerAdapterProps: DrawerAdapterSubpathProps = { label: "Operations drawer", open: true, cards: [{ title: "Open tasks" }], list: { items: [{ key: "routes", label: "Routes" }] }, "data-product-hook": "drawer-adapter" };
const drawerAdapterRootProps: DrawerAdapterRootProps = drawerAdapterProps;
const drawerAdapterRootComponent: DrawerAdapterRootComponent = DrawerAdapterSubpath;
const fileUploadProps: FileUploadSubpathProps = { label: "Proof of delivery", files: [{ name: "pod.pdf" }], "data-product-hook": "file-upload" };
const fileUploadRootProps: FileUploadRootProps = fileUploadProps;
const fileUploadRootComponent: FileUploadRootComponent = FileUploadSubpath;
const fleetManagerOnboardingDesktopProps: FleetManagerOnboardingDesktopSubpathProps = { tasks: [{ key: "vehicles", label: "Add vehicles" }], metrics: [{ key: "progress", label: "Progress", value: "1/3" }], "data-product-hook": "fleet-manager-onboarding-desktop" };
const fleetManagerOnboardingDesktopRootProps: FleetManagerOnboardingDesktopRootProps = fleetManagerOnboardingDesktopProps;
const fleetManagerOnboardingDesktopRootComponent: FleetManagerOnboardingDesktopRootComponent = FleetManagerOnboardingDesktopSubpath;
const filterChipGroupProps: FilterChipGroupSubpathProps = { filters: [{ label: "Status: Active" }], "data-product-hook": "filter-chip-group" };
const filterChipGroupRootProps: FilterChipGroupRootProps = filterChipGroupProps;
const filterChipGroupRootComponent: FilterChipGroupRootComponent = FilterChipGroupSubpath;
const formSectionProps: FormSectionSubpathProps = { title: "Driver profile", fields: [{ label: "Driver name" }], "data-product-hook": "form-section" };
const formSectionRootProps: FormSectionRootProps = formSectionProps;
const formSectionRootComponent: FormSectionRootComponent = FormSectionSubpath;
const fullscreenSheetProps: FullscreenSheetSubpathProps = { label: "Edit vehicle", open: true, fields: [{ label: "Driver", value: "Ana" }], actionSheet: { actions: [{ label: "Delete", intent: "danger", tone: "danger" }] }, "data-product-hook": "fullscreen-sheet" };
const fullscreenSheetRootProps: FullscreenSheetRootProps = fullscreenSheetProps;
const fullscreenSheetRootComponent: FullscreenSheetRootComponent = FullscreenSheetSubpath;
const helpCenterProps: HelpCenterSubpathProps = { open: true, query: "drivers", topics: [{ key: "drivers", label: "Drivers" }], articles: [{ id: "assign-driver", title: "Assign a driver" }], "data-product-hook": "help-center" };
const helpCenterRootProps: HelpCenterRootProps = helpCenterProps;
const helpCenterRootComponent: HelpCenterRootComponent = HelpCenterSubpath;
const kpiCardProps: KpiCardSubpathProps = { label: "Fleet availability", value: 96, "data-product-hook": "kpi-card" };
const kpiCardRootProps: KpiCardRootProps = kpiCardProps;
const kpiCardRootComponent: KpiCardRootComponent = KpiCardSubpath;
const multiSelectProps: MultiSelectSubpathProps = { label: "Regions", options: [{ label: "North", value: "north" }], value: ["north"], "data-product-hook": "multi-select" };
const multiSelectRootProps: MultiSelectRootProps = multiSelectProps;
const multiSelectRootComponent: MultiSelectRootComponent = MultiSelectSubpath;
const multiStepFormProps: MultiStepFormSubpathProps = { steps: [{ id: "profile", label: "Profile" }], fields: [{ label: "Driver name" }], formSection: { title: "License", fields: [{ label: "License number" }] }, "data-product-hook": "multi-step-form" };
const multiStepFormRootProps: MultiStepFormRootProps = multiStepFormProps;
const multiStepFormRootComponent: MultiStepFormRootComponent = MultiStepFormSubpath;
const notificationPanelProps: NotificationPanelSubpathProps = { notifications: [{ label: "Route delayed", unread: true }], "data-product-hook": "notification-panel" };
const notificationPanelRootProps: NotificationPanelRootProps = notificationPanelProps;
const notificationPanelRootComponent: NotificationPanelRootComponent = NotificationPanelSubpath;
const pullToRefreshProps: PullToRefreshSubpathProps = { list: { items: [{ key: "route", label: "Route delayed" }] }, fallbackAction: { label: "Refresh" }, "data-product-hook": "pull-to-refresh" };
const pullToRefreshRootProps: PullToRefreshRootProps = pullToRefreshProps;
const pullToRefreshRootComponent: PullToRefreshRootComponent = PullToRefreshSubpath;
const quickActionsGridProps: QuickActionsGridSubpathProps = { actions: [{ label: "Assign driver", status: { label: "Ready" }, tooltip: { content: "Assign selected driver." } }], "data-product-hook": "quick-actions-grid" };
const quickActionsGridRootProps: QuickActionsGridRootProps = quickActionsGridProps;
const quickActionsGridRootComponent: QuickActionsGridRootComponent = QuickActionsGridSubpath;
const rolesAndPermissionsProps: RolesAndPermissionsSubpathProps = { roles: [{ label: "Admin" }], permissions: [{ label: "View cards" }], values: { Admin: { "View cards": true } }, "data-product-hook": "roles-and-permissions" };
const rolesAndPermissionsRootProps: RolesAndPermissionsRootProps = rolesAndPermissionsProps;
const rolesAndPermissionsRootComponent: RolesAndPermissionsRootComponent = RolesAndPermissionsSubpath;
const searchProps: SearchSubpathProps = { label: "Search vehicles", query: "MX", results: [{ label: "MX-4821" }], "data-product-hook": "search" };
const searchRootProps: SearchRootProps = searchProps;
const searchRootComponent: SearchRootComponent = SearchSubpath;
const sectionHeaderProps: SectionHeaderSubpathProps = { title: "Vehicle assignments", actions: [{ label: "Save" }], "data-product-hook": "section-header" };
const sectionHeaderRootProps: SectionHeaderRootProps = sectionHeaderProps;
const sectionHeaderRootComponent: SectionHeaderRootComponent = SectionHeaderSubpath;
const virtualDataTableProps: VirtualDataTableSubpathProps = { label: "Vehicles", columns: [{ key: "unit", label: "Unit" }], rows: [{ id: "mx-4821", unit: "MX-4821" }], "data-product-hook": "virtual-data-table" };
const virtualDataTableRootProps: VirtualDataTableRootProps = virtualDataTableProps;
const virtualDataTableRootComponent: VirtualDataTableRootComponent = VirtualDataTableSubpath;
const selectOptionLayerProps: SelectOptionLayerSubpathProps = { label: "Vehicle", options: [{ label: "MX-4821", value: "mx-4821" }], "data-product-hook": "select-option-layer" };
const selectOptionLayerRootProps: SelectOptionLayerRootProps = selectOptionLayerProps;
const selectOptionLayerRootComponent: SelectOptionLayerRootComponent = SelectOptionLayerSubpath;
const settingsProps: SettingsSubpathProps = { groups: [{ title: "Profile", controls: [{ label: "Display name", value: "Ana" }] }], "data-product-hook": "settings" };
const settingsRootProps: SettingsRootProps = settingsProps;
const settingsRootComponent: SettingsRootComponent = SettingsSubpath;
const sidebarProps: SidebarSubpathProps = { groups: [{ title: "Operations", routes: [{ label: "Routes" }] }], "data-product-hook": "sidebar" };
const sidebarRootProps: SidebarRootProps = sidebarProps;
const sidebarRootComponent: SidebarRootComponent = SidebarSubpath;
const snackbarProviderProps: SnackbarProviderSubpathProps = { messages: [{ label: "Saved" }], "data-product-hook": "snackbar-provider" };
const snackbarProviderRootProps: SnackbarProviderRootProps = snackbarProviderProps;
const snackbarProviderRootComponent: SnackbarProviderRootComponent = SnackbarProviderSubpath;
const stationDiscoveryProps: StationDiscoverySubpathProps = { label: "Nearby stations", permission: "denied", stations: [{ label: "Centro Norte" }], "data-product-hook": "station-discovery" };
const stationDiscoveryRootProps: StationDiscoveryRootProps = stationDiscoveryProps;
const stationDiscoveryRootComponent: StationDiscoveryRootComponent = StationDiscoverySubpath;
const swipeActionsProps: SwipeActionsSubpathProps = { row: { label: "Fuel charge" }, actions: [{ label: "Approve" }], "data-product-hook": "swipe-actions" };
const swipeActionsRootProps: SwipeActionsRootProps = swipeActionsProps;
const swipeActionsRootComponent: SwipeActionsRootComponent = SwipeActionsSubpath;
const timelineProps: TimelineSubpathProps = { events: [{ key: "assigned", label: "Driver assigned", timestamp: "2026-08-09 09:00" }], filters: [{ key: "status", label: "Status: verified" }], "data-product-hook": "timeline" };
const timelineRootProps: TimelineRootProps = timelineProps;
const timelineRootComponent: TimelineRootComponent = TimelineSubpath;
const toolbarProps: ToolbarSubpathProps = { actions: [{ label: "Assign" }], filters: [{ label: "Status: active" }], "data-product-hook": "toolbar" };
const toolbarRootProps: ToolbarRootProps = toolbarProps;
const toolbarRootComponent: ToolbarRootComponent = ToolbarSubpath;
const topbarProps: TopbarSubpathProps = { search: { label: "Search fleet", query: "MX" }, account: { name: "Ana Torres", items: [{ key: "profile", label: "Profile" }] }, "data-product-hook": "topbar" };
const topbarRootProps: TopbarRootProps = topbarProps;
const topbarRootComponent: TopbarRootComponent = TopbarSubpath;
const transferListProps: TransferListSubpathProps = { source: [{ key: "ana", label: "Ana Torres", selected: true }], target: [{ key: "mia", label: "Mia Chen" }], selectedSourceKeys: ["ana"], moveToTargetAction: { label: "Assign" }, "data-product-hook": "transfer-list" };
const transferListRootProps: TransferListRootProps = transferListProps;
const transferListRootComponent: TransferListRootComponent = TransferListSubpath;

React.createElement(Card, cardProps);
React.createElement(Input, inputProps);
React.createElement(Table, tableProps);
React.createElement(Dialog, dialogProps);
React.createElement(ActionSheetSubpath, actionSheetProps);
React.createElement(AdvancedFiltersSubpath, advancedFiltersProps);
React.createElement(AuthenticationLoginBiometricsAndOtpSubpath, authenticationLoginBiometricsAndOtpProps);
React.createElement(AvatarGroupSubpath, avatarGroupProps);
React.createElement(AvatarMenuSubpath, avatarMenuProps);
React.createElement(AutocompleteSubpath, autocompleteProps);
React.createElement(BulkActionsSubpath, bulkActionsProps);
React.createElement(CalendarViewSubpath, calendarViewProps);
React.createElement(ChartWrapperSubpath, chartWrapperProps);
React.createElement(ColumnConfiguratorSubpath, columnConfiguratorProps);
React.createElement(CommandPaletteSubpath, commandPaletteProps);
React.createElement(ConfirmationDialogSubpath, confirmationDialogProps);
React.createElement(DragSortableListSubpath, dragSortableListProps);
React.createElement(DriverAndVehicleAdministrationSubpath, driverAndVehicleAdministrationProps);
React.createElement(DriverOnboardingMobileSubpath, driverOnboardingMobileProps);
React.createElement(DrawerAdapterSubpath, drawerAdapterProps);
React.createElement(FileUploadSubpath, fileUploadProps);
React.createElement(FleetManagerOnboardingDesktopSubpath, fleetManagerOnboardingDesktopProps);
React.createElement(FilterChipGroupSubpath, filterChipGroupProps);
React.createElement(FormSectionSubpath, formSectionProps);
React.createElement(FullscreenSheetSubpath, fullscreenSheetProps);
React.createElement(HelpCenterSubpath, helpCenterProps);
React.createElement(KpiCardSubpath, kpiCardProps);
React.createElement(MultiSelectSubpath, multiSelectProps);
React.createElement(MultiStepFormSubpath, multiStepFormProps);
React.createElement(NotificationPanelSubpath, notificationPanelProps);
React.createElement(PullToRefreshSubpath, pullToRefreshProps);
React.createElement(QuickActionsGridSubpath, quickActionsGridProps);
React.createElement(RolesAndPermissionsSubpath, rolesAndPermissionsProps);
React.createElement(SearchSubpath, searchProps);
React.createElement(SectionHeaderSubpath, sectionHeaderProps);
React.createElement(VirtualDataTableSubpath, virtualDataTableProps);
React.createElement(SelectOptionLayerSubpath, selectOptionLayerProps);
React.createElement(SettingsSubpath, settingsProps);
React.createElement(SidebarSubpath, sidebarProps);
React.createElement(SnackbarProviderSubpath, snackbarProviderProps);
React.createElement(StationDiscoverySubpath, stationDiscoveryProps);
React.createElement(SwipeActionsSubpath, swipeActionsProps);
React.createElement(TimelineSubpath, timelineProps);
React.createElement(ToolbarSubpath, toolbarProps);
React.createElement(TopbarSubpath, topbarProps);
React.createElement(TransferListSubpath, transferListProps);
${reactSubpathTypeAssertions}
${reactSubpathIntegrationTypeAssertions}
${templateTypeAssertions}
// @ts-expect-error Flow patterns own visual styling; consumers cannot bypass tokens with inline style.
const badAvatarGroupStyle: AvatarGroupSubpathProps = { style: { color: "red" } };
// @ts-expect-error Flow patterns own rendered structure; consumers cannot inject HTML.
const badAvatarGroupHtml: AvatarGroupSubpathProps = { dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Flow patterns own visual styling; consumers cannot bypass tokens with inline style.
const badAutocompleteStyle: AutocompleteSubpathProps = { label: "Bad", style: { color: "red" } };
// @ts-expect-error Flow patterns own rendered structure; consumers cannot inject HTML.
const badAutocompleteHtml: AutocompleteSubpathProps = { label: "Bad", dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Flow patterns own visual styling; consumers cannot bypass tokens with inline style.
const badConfirmationDialogStyle: ConfirmationDialogSubpathProps = { label: "Bad", style: { color: "red" } };
// @ts-expect-error Flow patterns own rendered structure; consumers cannot inject HTML.
const badConfirmationDialogHtml: ConfirmationDialogSubpathProps = { label: "Bad", dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Flow patterns own visual styling; consumers cannot bypass tokens with inline style.
const badFileUploadStyle: FileUploadSubpathProps = { label: "Bad", style: { color: "red" } };
// @ts-expect-error Flow patterns own rendered structure; consumers cannot inject HTML.
const badFileUploadHtml: FileUploadSubpathProps = { label: "Bad", dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Flow patterns own visual styling; consumers cannot bypass tokens with inline style.
const badFilterChipGroupStyle: FilterChipGroupSubpathProps = { style: { color: "red" } };
// @ts-expect-error Flow patterns own rendered structure; consumers cannot inject HTML.
const badFilterChipGroupHtml: FilterChipGroupSubpathProps = { dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Flow patterns own visual styling; consumers cannot bypass tokens with inline style.
const badFormSectionStyle: FormSectionSubpathProps = { title: "Bad", style: { color: "red" } };
// @ts-expect-error Flow patterns own rendered structure; consumers cannot inject HTML.
const badFormSectionHtml: FormSectionSubpathProps = { title: "Bad", dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Flow patterns own visual styling; consumers cannot bypass tokens with inline style.
const badKpiCardStyle: KpiCardSubpathProps = { label: "Bad", style: { color: "red" } };
// @ts-expect-error Flow patterns own rendered structure; consumers cannot inject HTML.
const badKpiCardHtml: KpiCardSubpathProps = { label: "Bad", dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Flow patterns own visual styling; consumers cannot bypass tokens with inline style.
const badMultiSelectStyle: MultiSelectSubpathProps = { label: "Bad", style: { color: "red" } };
// @ts-expect-error Flow patterns own rendered structure; consumers cannot inject HTML.
const badMultiSelectHtml: MultiSelectSubpathProps = { label: "Bad", dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Flow patterns own visual styling; consumers cannot bypass tokens with inline style.
const badSelectOptionLayerStyle: SelectOptionLayerSubpathProps = { label: "Bad", style: { color: "red" } };
// @ts-expect-error Flow patterns own rendered structure; consumers cannot inject HTML.
const badSelectOptionLayerHtml: SelectOptionLayerSubpathProps = { label: "Bad", dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };
// @ts-expect-error Flow patterns own visual styling; consumers cannot bypass tokens with inline style.
const badSnackbarProviderStyle: SnackbarProviderSubpathProps = { style: { color: "red" } };
// @ts-expect-error Flow patterns own rendered structure; consumers cannot inject HTML.
const badSnackbarProviderHtml: SnackbarProviderSubpathProps = { dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };

// @ts-expect-error Flow owns visual styling; consumers cannot bypass tokens with inline style.
const badButtonStyle: ButtonProps = { label: "Bad", style: { color: "red" } };
// @ts-expect-error Flow owns rendered structure; consumers cannot inject HTML.
const badButtonHtml: ButtonProps = { label: "Bad", dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" } };

void button;
void avatarGroupRootProps;
void avatarGroupRootComponent;
void badAvatarGroupStyle;
void badAvatarGroupHtml;
void autocompleteRootProps;
void autocompleteRootComponent;
void badAutocompleteStyle;
void badAutocompleteHtml;
void confirmationDialogRootProps;
void confirmationDialogRootComponent;
void badConfirmationDialogStyle;
void badConfirmationDialogHtml;
void fileUploadRootProps;
void fileUploadRootComponent;
void badFileUploadStyle;
void badFileUploadHtml;
void filterChipGroupRootProps;
void filterChipGroupRootComponent;
void badFilterChipGroupStyle;
void badFilterChipGroupHtml;
void formSectionRootProps;
void formSectionRootComponent;
void badFormSectionStyle;
void badFormSectionHtml;
void kpiCardRootProps;
void kpiCardRootComponent;
void badKpiCardStyle;
void badKpiCardHtml;
void multiSelectRootProps;
void multiSelectRootComponent;
void badMultiSelectStyle;
void badMultiSelectHtml;
void selectOptionLayerRootProps;
void selectOptionLayerRootComponent;
void snackbarProviderRootProps;
void snackbarProviderRootComponent;
void badSelectOptionLayerStyle;
void badSelectOptionLayerHtml;
void badSnackbarProviderStyle;
void badSnackbarProviderHtml;
void badButtonStyle;
void badButtonHtml;
`;
  fs.writeFileSync(path.join(consumerDir, "screen-types.ts"), source.trimStart());
}

function auditInstalledPackage(consumerDir) {
  const packageRoot = path.join(consumerDir, "node_modules/@alohasoyrico-eng/flow");
  const realPackageRoot = fs.realpathSync(packageRoot);
  const consumerRequire = createRequire(path.join(consumerDir, "package.json"));
  const installedPackage = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  const installedTokenContract = JSON.parse(fs.readFileSync(path.join(packageRoot, "packages/tokens/tokens.json"), "utf8"));
  if (!Array.isArray(installedPackage.sideEffects) || !installedPackage.sideEffects.includes("**/*.css")) {
    throw new Error("Installed package must preserve CSS sideEffects for consumer bundlers.");
  }
  assertInstalledExportInventory(installedPackage);
  for (const [exportPath, expectedTarget] of Object.entries({
    "./tokens/styles.css": "./packages/tokens/styles/tokens.css",
    "./tokens/context-styles.css": "./packages/tokens/styles/token-contexts.css",
    "./components/styles.css": "./packages/components/styles/components.css",
  })) {
    if (installedPackage.exports?.[exportPath] !== expectedTarget) {
      throw new Error(`Installed package must publish ${exportPath} as ${expectedTarget}.`);
    }
    const packageSpecifier = `@alohasoyrico-eng/flow/${exportPath.slice(2)}`;
    const resolved = consumerRequire.resolve(packageSpecifier);
    if (!fs.realpathSync(resolved).startsWith(realPackageRoot)) {
      throw new Error(`Installed CSS export ${packageSpecifier} must resolve inside the Flow package.`);
    }
    if (fs.readFileSync(resolved, "utf8").trim().length < 1000) {
      throw new Error(`Installed CSS export ${packageSpecifier} is unexpectedly small.`);
    }
  }
  if (installedTokenContract.format !== "flow-token-contract@2" || !installedTokenContract.compatibleWith?.includes("style-dictionary")) {
    throw new Error("Installed package must include the platform-neutral token JSON contract.");
  }
  if (Object.keys(installedTokenContract.tokens ?? {}).length < 1000) {
    throw new Error("Installed token JSON contract must include the full token inventory.");
  }
  assertInstalledSpecArtifactSubpathExports({ consumerRequire, realPackageRoot });
  assertInstalledContentContracts({ consumerRequire, packageRoot, realPackageRoot });
  const installedCssInventory = packageCssRootInventory(packageRoot);
  const installedCssRoots = installedCssInventory.roots;
  if (installedCssRoots.size !== 71) {
    throw new Error(`Installed component CSS must preserve the governed root baseline: expected 71 roots, got ${installedCssRoots.size}.`);
  }
  if (installedCssInventory.selectors < 1100) {
    throw new Error(`Installed component CSS selector inventory is unexpectedly small: expected at least 1100 selectors, got ${installedCssInventory.selectors}.`);
  }
  const cssCoverage = componentCssContractCoverage();
  if (cssCoverage.direct !== 55 || cssCoverage.family !== 5 || cssCoverage.missing.length) {
    throw new Error(`Installed package must preserve the resolved CSS contract baseline: expected 55 direct, 5 family, 0 missing; got ${cssCoverage.direct} direct, ${cssCoverage.family} family, ${cssCoverage.missing.length} missing.`);
  }
  assertReactGovernanceBaselines();
  const missingInstalledCssCoverage = goldComponents
    .map((componentId) => {
      const reactComponentName = pascalCase(componentId);
      const ownerRoot = ownerClassRootForReactComponent(reactComponentName);
      const allowedRoots = [...allowedClassRootsForReactComponent(reactComponentName)].sort();
      const installedRoots = allowedRoots.filter((rootToken) => installedCssRoots.has(rootToken));
      return {
        componentId,
        ownerRoot,
        allowedRoots,
        installedRoots,
        coverage: installedRoots.includes(ownerRoot) ? "direct" : installedRoots.length ? "family" : "missing",
      };
    })
    .filter((item) => item.coverage === "missing");
  if (missingInstalledCssCoverage.length) {
    throw new Error(`Installed component CSS is missing accepted React visual coverage: ${missingInstalledCssCoverage.map((item) => `${item.componentId}->${item.allowedRoots.join("|")}`).join(", ")}`);
  }
  const installedComponentCss = fs.readFileSync(consumerRequire.resolve("@alohasoyrico-eng/flow/components/styles.css"), "utf8");
  const missingInstalledCssContracts = cssCoverage.components
    .filter((item) => item.coverage !== "missing")
    .flatMap((item) => {
      const selectorRoots = [item.requiredRoot, ...(item.allowedExtensionRoots ?? [])];
      const aliasPrefixes = [item.contract, ...(item.allowedExtensionRoots ?? [])];
      return [
        ...selectorRoots
          .filter((rootToken) => !cssSelectorRootObserved(installedComponentCss, rootToken))
          .map((rootToken) => `${item.componentId ?? item.component}: selector .${rootToken}`),
        ...aliasPrefixes
          .filter((prefix) => !installedComponentCss.includes(`--comp-${prefix}-`))
          .map((prefix) => `${item.componentId ?? item.component}: alias --comp-${prefix}-*`),
      ];
    });
  if (missingInstalledCssContracts.length) {
    throw new Error(`Installed component CSS is missing cascade contract selectors or aliases: ${missingInstalledCssContracts.slice(0, 30).join(", ")}`);
  }
  for (const [key, value] of Object.entries(installedPackage.exports ?? {})) {
    if (!key.startsWith("./react")) continue;
    const packagePath = key === "./react" ? "@alohasoyrico-eng/flow/react" : `@alohasoyrico-eng/flow/${key.slice(2)}`;
    consumerRequire.resolve(packagePath);
    if (!value?.types || !value?.default) throw new Error(`React export ${key} must publish types and default targets.`);
  }
  for (const componentId of goldComponents) {
    consumerRequire.resolve(`@alohasoyrico-eng/flow/react/${componentId}`);
  }
  for (const forbiddenSpecifier of [
    "@alohasoyrico-eng/flow/packages/react/dist/Button.js",
    "@alohasoyrico-eng/flow/packages/components/src/contracts.js",
    "@alohasoyrico-eng/flow/packages/tokens/tokens.json",
    "@alohasoyrico-eng/flow/packages/content/content/catalog.json",
  ]) {
    assertPackagePathNotExported(consumerRequire, forbiddenSpecifier);
  }
  for (const forbiddenPath of ["apps/docs", "repo-split-output", "node_modules"]) {
    if (fs.existsSync(path.join(packageRoot, forbiddenPath))) {
      throw new Error(`Installed package must not include ${forbiddenPath}.`);
    }
  }
  const offenders = [];
  for (const file of listFiles(packageRoot)) {
    if (!/\.(?:js|mjs|d\.ts|css)$/.test(file)) continue;
    const relative = path.relative(packageRoot, file);
    const source = fs.readFileSync(file, "utf8");
    if (source.includes("apps/docs") || source.includes("#design-system/docs")) {
      offenders.push(`${relative}: docs dependency`);
    }
    if (relative.startsWith("packages/react/dist/") && source.includes("../../components/src")) {
      offenders.push(`${relative}: deep component source import`);
    }
    if (relative.startsWith("packages/react/dist/") && source.includes("@design-system/components")) {
      offenders.push(`${relative}: workspace component import`);
    }
    if (relative.startsWith("packages/react/dist/") && relative.endsWith(".d.ts")) {
      const missing = missingInheritedDomEscapeOmissions(source);
      if (missing.length) offenders.push(`${relative}: inherited DOM escape props ${missing.join(", ")}`);
    }
  }
  if (offenders.length) {
    throw new Error(`Installed package has consumer boundary offenders: ${offenders.slice(0, 20).join(", ")}`);
  }
}

function artifactIdsForLayer(layer) {
  const dir = path.join(root, "packages/specs/specs/unison-system/artifacts", layer);
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""))
    .sort();
}

function assertInstalledSpecArtifactSubpathExports({ consumerRequire, realPackageRoot }) {
  for (const { layer, ids, names } of [
    { layer: "foundations", ids: foundations.map(slug), names: foundations },
    { layer: "primitives", ids: primitiveNames.map(slug), names: primitiveNames },
    { layer: "patterns", ids: artifactIdsForLayer("patterns"), names: [] },
    { layer: "templates", ids: artifactIdsForLayer("templates"), names: [] },
  ]) {
    for (const id of ids) {
      const specifier = `@alohasoyrico-eng/flow/specs/${layer}/${id}`;
      const resolved = consumerRequire.resolve(specifier);
      if (!fs.realpathSync(resolved).startsWith(realPackageRoot)) {
        throw new Error(`Installed ${specifier} must resolve inside the Flow package.`);
      }
      const artifact = JSON.parse(fs.readFileSync(resolved, "utf8"));
      const record = artifact.artifacts?.[layer]?.[id];
      const expectedName = names[ids.indexOf(id)];
      if (!record || (expectedName && record.name !== expectedName) || record.layer?.toLowerCase() !== layer.replace(/s$/, "")) {
        throw new Error(`Installed ${specifier} must expose a valid ${layer} JSON contract for ${expectedName ?? id}.`);
      }
    }
  }
}

function assertInstalledExportInventory(installedPackage) {
  const expectedExportMap = {
    "./tokens": "./packages/tokens/src/index.js",
    "./tokens.json": "./packages/tokens/tokens.json",
    "./tokens/styles.css": "./packages/tokens/styles/tokens.css",
    "./tokens/context-styles.css": "./packages/tokens/styles/token-contexts.css",
    "./tokens/android": "./packages/tokens/dist/android/flow_tokens.xml",
    "./tokens/flutter": "./packages/tokens/dist/flutter/flow_tokens.dart",
    "./tokens/ios": "./packages/tokens/dist/ios/FlowTokens.swift",
    "./components": "./packages/components/src/index.js",
    "./components/contracts": "./packages/components/src/contracts.js",
    "./components/platforms": "./packages/components/src/platforms/index.js",
    "./components/styles.css": "./packages/components/styles/components.css",
    "./react": {
      types: "./packages/react/dist/index.d.ts",
      default: "./packages/react/dist/index.js",
    },
    "./react/surface": {
      types: "./packages/react/dist/Surface.d.ts",
      default: "./packages/react/dist/Surface.js",
    },
    "./react/patterns": {
      types: "./packages/react/dist/patterns/index.d.ts",
      default: "./packages/react/dist/patterns/index.js",
    },
    "./react/patterns/account-operations": {
      types: "./packages/react/dist/patterns/AccountOperations.d.ts",
      default: "./packages/react/dist/patterns/AccountOperations.js",
    },
    "./react/patterns/action-sheet": {
      types: "./packages/react/dist/patterns/ActionSheet.d.ts",
      default: "./packages/react/dist/patterns/ActionSheet.js",
    },
    "./react/patterns/bottom-sheet": {
      types: "./packages/react/dist/patterns/BottomSheet.d.ts",
      default: "./packages/react/dist/patterns/BottomSheet.js",
    },
    "./react/patterns/advanced-filters": {
      types: "./packages/react/dist/patterns/AdvancedFilters.d.ts",
      default: "./packages/react/dist/patterns/AdvancedFilters.js",
    },
    "./react/patterns/agent-conversation": {
      types: "./packages/react/dist/patterns/AgentConversation.d.ts",
      default: "./packages/react/dist/patterns/AgentConversation.js",
    },
    "./react/patterns/authentication-login-biometrics-and-otp": {
      types: "./packages/react/dist/patterns/AuthenticationLoginBiometricsAndOtp.d.ts",
      default: "./packages/react/dist/patterns/AuthenticationLoginBiometricsAndOtp.js",
    },
    "./react/patterns/avatar-group": {
      types: "./packages/react/dist/patterns/AvatarGroup.d.ts",
      default: "./packages/react/dist/patterns/AvatarGroup.js",
    },
    "./react/patterns/avatar-menu": {
      types: "./packages/react/dist/patterns/AvatarMenu.d.ts",
      default: "./packages/react/dist/patterns/AvatarMenu.js",
    },
    "./react/patterns/backoffice-approval": {
      types: "./packages/react/dist/patterns/BackofficeApproval.d.ts",
      default: "./packages/react/dist/patterns/BackofficeApproval.js",
    },
    "./react/patterns/autocomplete": {
      types: "./packages/react/dist/patterns/Autocomplete.d.ts",
      default: "./packages/react/dist/patterns/Autocomplete.js",
    },
    "./react/patterns/bulk-actions": {
      types: "./packages/react/dist/patterns/BulkActions.d.ts",
      default: "./packages/react/dist/patterns/BulkActions.js",
    },
    "./react/patterns/calendar-view": {
      types: "./packages/react/dist/patterns/CalendarView.d.ts",
      default: "./packages/react/dist/patterns/CalendarView.js",
    },
    "./react/patterns/case-management": {
      types: "./packages/react/dist/patterns/CaseManagement.d.ts",
      default: "./packages/react/dist/patterns/CaseManagement.js",
    },
    "./react/patterns/chart-legend-item": {
      types: "./packages/react/dist/patterns/ChartLegendItem.d.ts",
      default: "./packages/react/dist/patterns/ChartLegendItem.js",
    },
    "./react/patterns/chart-wrapper": {
      types: "./packages/react/dist/patterns/ChartWrapper.d.ts",
      default: "./packages/react/dist/patterns/ChartWrapper.js",
    },
    "./react/patterns/checkbox-group": {
      types: "./packages/react/dist/patterns/CheckboxGroup.d.ts",
      default: "./packages/react/dist/patterns/CheckboxGroup.js",
    },
    "./react/patterns/column-configurator": {
      types: "./packages/react/dist/patterns/ColumnConfigurator.d.ts",
      default: "./packages/react/dist/patterns/ColumnConfigurator.js",
    },
    "./react/patterns/command-palette": {
      types: "./packages/react/dist/patterns/CommandPalette.d.ts",
      default: "./packages/react/dist/patterns/CommandPalette.js",
    },
    "./react/patterns/confirmation-dialog": {
      types: "./packages/react/dist/patterns/ConfirmationDialog.d.ts",
      default: "./packages/react/dist/patterns/ConfirmationDialog.js",
    },
    "./react/patterns/dense-operational-list": {
      types: "./packages/react/dist/patterns/DenseOperationalList.d.ts",
      default: "./packages/react/dist/patterns/DenseOperationalList.js",
    },
    "./react/patterns/drag-sortable-list": {
      types: "./packages/react/dist/patterns/DragSortableList.d.ts",
      default: "./packages/react/dist/patterns/DragSortableList.js",
    },
    "./react/patterns/driver-and-vehicle-administration": {
      types: "./packages/react/dist/patterns/DriverAndVehicleAdministration.d.ts",
      default: "./packages/react/dist/patterns/DriverAndVehicleAdministration.js",
    },
    "./react/patterns/driver-onboarding-mobile": {
      types: "./packages/react/dist/patterns/DriverOnboardingMobile.d.ts",
      default: "./packages/react/dist/patterns/DriverOnboardingMobile.js",
    },
    "./react/patterns/drawer-adapter": {
      types: "./packages/react/dist/patterns/DrawerAdapter.d.ts",
      default: "./packages/react/dist/patterns/DrawerAdapter.js",
    },
    "./react/patterns/email-template-layout": {
      types: "./packages/react/dist/patterns/EmailTemplateLayout.d.ts",
      default: "./packages/react/dist/patterns/EmailTemplateLayout.js",
    },
    "./react/patterns/expandable-detail-table": {
      types: "./packages/react/dist/patterns/ExpandableDetailTable.d.ts",
      default: "./packages/react/dist/patterns/ExpandableDetailTable.js",
    },
    "./react/patterns/file-upload": {
      types: "./packages/react/dist/patterns/FileUpload.d.ts",
      default: "./packages/react/dist/patterns/FileUpload.js",
    },
    "./react/patterns/fleet-manager-onboarding-desktop": {
      types: "./packages/react/dist/patterns/FleetManagerOnboardingDesktop.d.ts",
      default: "./packages/react/dist/patterns/FleetManagerOnboardingDesktop.js",
    },
    "./react/patterns/filter-chip-group": {
      types: "./packages/react/dist/patterns/FilterChipGroup.d.ts",
      default: "./packages/react/dist/patterns/FilterChipGroup.js",
    },
    "./react/patterns/filterable-editable-table": {
      types: "./packages/react/dist/patterns/FilterableEditableTable.d.ts",
      default: "./packages/react/dist/patterns/FilterableEditableTable.js",
    },
    "./react/patterns/form-section": {
      types: "./packages/react/dist/patterns/FormSection.d.ts",
      default: "./packages/react/dist/patterns/FormSection.js",
    },
    "./react/patterns/fullscreen-sheet": {
      types: "./packages/react/dist/patterns/FullscreenSheet.d.ts",
      default: "./packages/react/dist/patterns/FullscreenSheet.js",
    },
    "./react/patterns/gantt-chart": {
      types: "./packages/react/dist/patterns/GanttChart.d.ts",
      default: "./packages/react/dist/patterns/GanttChart.js",
    },
    "./react/patterns/help-center": {
      types: "./packages/react/dist/patterns/HelpCenter.d.ts",
      default: "./packages/react/dist/patterns/HelpCenter.js",
    },
    "./react/patterns/kanban-board": {
      types: "./packages/react/dist/patterns/KanbanBoard.d.ts",
      default: "./packages/react/dist/patterns/KanbanBoard.js",
    },
    "./react/patterns/kpi-card": {
      types: "./packages/react/dist/patterns/KpiCard.d.ts",
      default: "./packages/react/dist/patterns/KpiCard.js",
    },
    "./react/patterns/multi-select": {
      types: "./packages/react/dist/patterns/MultiSelect.d.ts",
      default: "./packages/react/dist/patterns/MultiSelect.js",
    },
    "./react/patterns/multi-step-form": {
      types: "./packages/react/dist/patterns/MultiStepForm.d.ts",
      default: "./packages/react/dist/patterns/MultiStepForm.js",
    },
    "./react/patterns/notification-panel": {
      types: "./packages/react/dist/patterns/NotificationPanel.d.ts",
      default: "./packages/react/dist/patterns/NotificationPanel.js",
    },
    "./react/patterns/payment-form": {
      types: "./packages/react/dist/patterns/PaymentForm.d.ts",
      default: "./packages/react/dist/patterns/PaymentForm.js",
    },
    "./react/patterns/polar-chart": {
      types: "./packages/react/dist/patterns/PolarChart.d.ts",
      default: "./packages/react/dist/patterns/PolarChart.js",
    },
    "./react/patterns/preference-management": {
      types: "./packages/react/dist/patterns/PreferenceManagement.d.ts",
      default: "./packages/react/dist/patterns/PreferenceManagement.js",
    },
    "./react/patterns/pricing-operations": {
      types: "./packages/react/dist/patterns/PricingOperations.d.ts",
      default: "./packages/react/dist/patterns/PricingOperations.js",
    },
    "./react/patterns/pull-to-refresh": {
      types: "./packages/react/dist/patterns/PullToRefresh.d.ts",
      default: "./packages/react/dist/patterns/PullToRefresh.js",
    },
    "./react/patterns/quick-actions-grid": {
      types: "./packages/react/dist/patterns/QuickActionsGrid.d.ts",
      default: "./packages/react/dist/patterns/QuickActionsGrid.js",
    },
    "./react/patterns/radio-group": {
      types: "./packages/react/dist/patterns/RadioGroup.d.ts",
      default: "./packages/react/dist/patterns/RadioGroup.js",
    },
    "./react/patterns/roles-and-permissions": {
      types: "./packages/react/dist/patterns/RolesAndPermissions.d.ts",
      default: "./packages/react/dist/patterns/RolesAndPermissions.js",
    },
    "./react/patterns/search": {
      types: "./packages/react/dist/patterns/Search.d.ts",
      default: "./packages/react/dist/patterns/Search.js",
    },
    "./react/patterns/section-header": {
      types: "./packages/react/dist/patterns/SectionHeader.d.ts",
      default: "./packages/react/dist/patterns/SectionHeader.js",
    },
    "./react/patterns/virtual-data-table": {
      types: "./packages/react/dist/patterns/VirtualDataTable.d.ts",
      default: "./packages/react/dist/patterns/VirtualDataTable.js",
    },
    "./react/patterns/select-option-layer": {
      types: "./packages/react/dist/patterns/SelectOptionLayer.d.ts",
      default: "./packages/react/dist/patterns/SelectOptionLayer.js",
    },
    "./react/patterns/settings": {
      types: "./packages/react/dist/patterns/Settings.d.ts",
      default: "./packages/react/dist/patterns/Settings.js",
    },
    "./react/patterns/sidebar": {
      types: "./packages/react/dist/patterns/Sidebar.d.ts",
      default: "./packages/react/dist/patterns/Sidebar.js",
    },
    "./react/patterns/snackbar-provider": {
      types: "./packages/react/dist/patterns/SnackbarProvider.d.ts",
      default: "./packages/react/dist/patterns/SnackbarProvider.js",
    },
    "./react/patterns/station-discovery": {
      types: "./packages/react/dist/patterns/StationDiscovery.d.ts",
      default: "./packages/react/dist/patterns/StationDiscovery.js",
    },
    "./react/patterns/status-feedback-view": {
      types: "./packages/react/dist/patterns/StatusFeedbackView.d.ts",
      default: "./packages/react/dist/patterns/StatusFeedbackView.js",
    },
    "./react/patterns/swipe-actions": {
      types: "./packages/react/dist/patterns/SwipeActions.d.ts",
      default: "./packages/react/dist/patterns/SwipeActions.js",
    },
    "./react/patterns/timeline": {
      types: "./packages/react/dist/patterns/Timeline.d.ts",
      default: "./packages/react/dist/patterns/Timeline.js",
    },
    "./react/patterns/toolbar": {
      types: "./packages/react/dist/patterns/Toolbar.d.ts",
      default: "./packages/react/dist/patterns/Toolbar.js",
    },
    "./react/patterns/topbar": {
      types: "./packages/react/dist/patterns/Topbar.d.ts",
      default: "./packages/react/dist/patterns/Topbar.js",
    },
    "./react/patterns/transfer-list": {
      types: "./packages/react/dist/patterns/TransferList.d.ts",
      default: "./packages/react/dist/patterns/TransferList.js",
    },
    "./react/patterns/ticket-queue": {
      types: "./packages/react/dist/patterns/TicketQueue.d.ts",
      default: "./packages/react/dist/patterns/TicketQueue.js",
    },
    "./react/patterns/waterfall-chart": {
      types: "./packages/react/dist/patterns/WaterfallChart.d.ts",
      default: "./packages/react/dist/patterns/WaterfallChart.js",
    },
    "./react/templates": {
      types: "./packages/react/dist/templates/index.d.ts",
      default: "./packages/react/dist/templates/index.js",
    },
    "./react/templates/agent-workspace": {
      types: "./packages/react/dist/templates/AgentWorkspace.d.ts",
      default: "./packages/react/dist/templates/AgentWorkspace.js",
    },
    "./react/templates/configuration-console": {
      types: "./packages/react/dist/templates/ConfigurationConsole.d.ts",
      default: "./packages/react/dist/templates/ConfigurationConsole.js",
    },
    "./react/templates/driver-card-wallet": {
      types: "./packages/react/dist/templates/DriverCardWallet.d.ts",
      default: "./packages/react/dist/templates/DriverCardWallet.js",
    },
    "./react/templates/driver-mobile-app": {
      types: "./packages/react/dist/templates/DriverMobileApp.d.ts",
      default: "./packages/react/dist/templates/DriverMobileApp.js",
    },
    "./react/templates/fleet-dashboard-suite": {
      types: "./packages/react/dist/templates/FleetDashboardSuite.d.ts",
      default: "./packages/react/dist/templates/FleetDashboardSuite.js",
    },
    "./react/templates/fleet-manager-desktop": {
      types: "./packages/react/dist/templates/FleetManagerDesktop.d.ts",
      default: "./packages/react/dist/templates/FleetManagerDesktop.js",
    },
    "./react/templates/internal-operations-console": {
      types: "./packages/react/dist/templates/InternalOperationsConsole.d.ts",
      default: "./packages/react/dist/templates/InternalOperationsConsole.js",
    },
    "./react/templates/routes-and-stations": {
      types: "./packages/react/dist/templates/RoutesAndStations.d.ts",
      default: "./packages/react/dist/templates/RoutesAndStations.js",
    },
    "./react/templates/settings-workspace": {
      types: "./packages/react/dist/templates/SettingsWorkspace.d.ts",
      default: "./packages/react/dist/templates/SettingsWorkspace.js",
    },
    ...Object.fromEntries(goldComponents.map((component) => {
      const componentName = pascalCase(component);
      return [`./react/${component}`, {
        types: `./packages/react/dist/${componentName}.d.ts`,
        default: `./packages/react/dist/${componentName}.js`,
      }];
    })),
    "./content/catalog": "./packages/content/content/catalog.json",
    "./content/component-docs": "./packages/content/content/component-docs.json",
    "./content/component-copy": "./packages/content/content/component-copy.json",
    "./content/pattern-copy": "./packages/content/content/pattern-copy.json",
    "./content/component-implementation-status": "./packages/content/content/component-implementation-status.json",
    "./content/foundation-copy": "./packages/content/content/foundation-copy.json",
    "./content/primitive-copy": "./packages/content/content/primitive-copy.json",
    "./content/reference-copy": "./packages/content/content/reference-copy.json",
    "./content/template-blueprints": "./packages/content/content/template-blueprints.json",
    "./content/home": "./packages/content/content/home.json",
    "./content/i18n-ui": "./packages/content/content/i18n/ui.json",
    "./specs/system": "./packages/specs/specs/unison.system.json",
    "./specs/foundations/*": "./packages/specs/specs/unison-system/artifacts/foundations/*.json",
    "./specs/primitives/*": "./packages/specs/specs/unison-system/artifacts/primitives/*.json",
    "./specs/patterns/*": "./packages/specs/specs/unison-system/artifacts/patterns/*.json",
    "./specs/templates/*": "./packages/specs/specs/unison-system/artifacts/templates/*.json",
  };
  const expectedExports = Object.keys(expectedExportMap).sort();
  const actualExports = Object.keys(installedPackage.exports ?? {}).sort();
  const missing = expectedExports.filter((entry) => !actualExports.includes(entry));
  const extra = actualExports.filter((entry) => !expectedExports.includes(entry));
  if (missing.length || extra.length) {
    throw new Error(`Installed package export inventory mismatch: missing ${missing.join(", ") || "none"}; extra ${extra.join(", ") || "none"}.`);
  }
  const mistargeted = expectedExports.filter((entry) => {
    const actual = installedPackage.exports?.[entry];
    const expected = expectedExportMap[entry];
    return JSON.stringify(actual) !== JSON.stringify(expected);
  });
  if (mistargeted.length) {
    throw new Error(`Installed package exports point to unexpected targets: ${mistargeted.slice(0, 30).join(", ")}.`);
  }
}

function assertPackagePathNotExported(consumerRequire, specifier) {
  try {
    consumerRequire.resolve(specifier);
  } catch (error) {
    if (error?.code === "ERR_PACKAGE_PATH_NOT_EXPORTED") return;
    throw error;
  }
  throw new Error(`Installed package must not allow deep import outside public exports: ${specifier}.`);
}

function missingInheritedDomEscapeOmissions(source) {
  const missing = new Set();
  for (const match of source.matchAll(/^export interface [A-Za-z][A-Za-z0-9]* extends ([^{]+)\{/gm)) {
    const inherited = match[1];
    const inheritsDomAttributes = /(?:^|[^A-Za-z])(?:HTMLAttributes|ButtonHTMLAttributes|InputHTMLAttributes|TextareaHTMLAttributes)\b/.test(inherited);
    if (!inheritsDomAttributes) continue;
    for (const prop of forbiddenInheritedDomProps) {
      if (!inherited.includes(`"${prop}"`)) missing.add(prop);
    }
  }
  return [...missing].sort();
}

function assertInstalledContentContracts({ consumerRequire, packageRoot, realPackageRoot }) {
  const shardExports = [
    ["@alohasoyrico-eng/flow/content/catalog", "packages/content/content", 15],
    ["@alohasoyrico-eng/flow/content/component-docs", "packages/content/content", 2],
    ["@alohasoyrico-eng/flow/content/component-copy", "packages/content/content", 180],
    ["@alohasoyrico-eng/flow/content/foundation-copy", "packages/content/content", 20],
    ["@alohasoyrico-eng/flow/content/primitive-copy", "packages/content/content", 20],
    ["@alohasoyrico-eng/flow/specs/system", "packages/specs/specs", 140],
  ];
  for (const [specifier, shardRoot, minimumShards] of shardExports) {
    const file = consumerRequire.resolve(specifier);
    if (!fs.realpathSync(file).startsWith(realPackageRoot)) {
      throw new Error(`Installed content export ${specifier} must resolve inside the Flow package.`);
    }
    const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
    const shards = manifest.$systemShards ?? [];
    if (shards.length < minimumShards) {
      throw new Error(`Installed content export ${specifier} is missing shard coverage: expected at least ${minimumShards}, got ${shards.length}.`);
    }
    const missingShards = shards.filter((shard) => !fs.existsSync(path.join(packageRoot, shardRoot, shard)));
    if (missingShards.length) {
      throw new Error(`Installed content export ${specifier} points to missing shards: ${missingShards.slice(0, 20).join(", ")}.`);
    }
  }

  for (const specifier of [
    "@alohasoyrico-eng/flow/content/pattern-copy",
    "@alohasoyrico-eng/flow/content/reference-copy",
    "@alohasoyrico-eng/flow/content/template-blueprints",
    "@alohasoyrico-eng/flow/content/home",
    "@alohasoyrico-eng/flow/content/i18n-ui",
  ]) {
    const file = consumerRequire.resolve(specifier);
    if (!fs.realpathSync(file).startsWith(realPackageRoot)) {
      throw new Error(`Installed content export ${specifier} must resolve inside the Flow package.`);
    }
    const contract = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!contract || typeof contract !== "object" || !Object.keys(contract).length) {
      throw new Error(`Installed content export ${specifier} must contain a non-empty JSON contract.`);
    }
  }

  const implementationStatus = JSON.parse(fs.readFileSync(consumerRequire.resolve("@alohasoyrico-eng/flow/content/component-implementation-status"), "utf8"));
  const statusComponents = Object.values(implementationStatus.components ?? {});
  const packageComponents = statusComponents.filter((component) => component.status === "package-component");
  if (statusComponents.length !== 60 || packageComponents.length !== 60) {
    throw new Error(`Installed implementation status must preserve 60/60 package components; got ${packageComponents.length}/${statusComponents.length}.`);
  }
}

function assertReactGovernanceBaselines() {
  const primary = readAuditReport("docs/audits/react-primary-coverage-audit.json");
  assertReportStatus(primary, "React primary coverage");
  assertInventory(primary, {
    components: 60,
    primaryImplementationDebt: 0,
    pass: 60,
    fail: 0,
    forwardRef: 60,
    realTypes: 60,
    platformContract: 60,
    densityResolved: 60,
    restSanitized: 60,
    noDocsDependency: 60,
    noDomFactory: 60,
    publishedImports: 60,
    cssContractCoverage: 60,
    directCssContracts: 55,
    familyCssContracts: 5,
  }, "React primary coverage");

  const legacyDomSource = readAuditReport("docs/audits/legacy-dom-source-governance-audit.json");
  assertReportStatus(legacyDomSource, "Legacy DOM source governance");
  assertInventory(legacyDomSource, {
    filesScanned: 825,
    violations: 0,
    legacyDomSourceDebt: 0,
  }, "Legacy DOM source governance");

  const foundationPrimitiveExport = readAuditReport("docs/audits/foundation-primitive-export-contract-audit.json");
  assertReportStatus(foundationPrimitiveExport, "Foundation primitive export contract");
  assertInventory(foundationPrimitiveExport, {
    foundations: 11,
    primitives: 24,
    patterns: 63,
    templates: 9,
    tokenCount: 1131,
    missingFoundationArtifacts: 0,
    missingPrimitiveArtifacts: 0,
    missingPatternArtifacts: 0,
    missingTemplateArtifacts: 0,
    missingFoundationSubpathExports: 0,
    missingPrimitiveSubpathExports: 0,
    missingPatternSubpathExports: 0,
    missingTemplateSubpathExports: 0,
    invalidFoundationSubpathExports: 0,
    invalidPrimitiveSubpathExports: 0,
    invalidPatternSubpathExports: 0,
    invalidTemplateSubpathExports: 0,
    artifactShapeErrors: 0,
    missingPackageExports: 0,
    requirementFailures: 0,
    baselineMismatches: 0,
    foundationPrimitiveExportDebt: 0,
  }, "Foundation primitive export contract");

  const taxonomyBoundaries = readAuditReport("docs/audits/taxonomy-boundaries-audit.json");
  assertReportStatus(taxonomyBoundaries, "Taxonomy boundaries");
  assertInventory(taxonomyBoundaries, {
    rules: 5,
    decisions: 20,
    patternDecisions: 10,
    templateDecisions: 9,
    nonComponentDecisions: 1,
    artifactsScanned: 167,
    crossLayerArtifactIds: 1,
    unapprovedCrossLayerArtifactIds: 0,
    artifactLayerMismatches: 0,
    missingNestedArtifactRecords: 0,
    templateArtifactsWithoutDecisions: 0,
    templateBlueprintsWithoutArtifacts: 0,
    templateArtifactBlueprintMismatches: 0,
    templateDependencyReferenceErrors: 0,
    templateCatalogSyncErrors: 0,
    duplicateIds: 0,
    auditErrors: 0,
    taxonomyBoundaryDebt: 0,
  }, "Taxonomy boundaries");

  const docsSystemBoundary = readAuditReport("docs/audits/docs-system-boundary-audit.json");
  assertReportStatus(docsSystemBoundary, "Docs system boundary");
  assertInventory(docsSystemBoundary, {
    sourceFilesScanned: 210,
    generatedFiles: 355,
    flowDependencyPresent: 1,
    flowBoundaryAliases: 20,
    missingFlowAliases: 0,
    localFlowImportViolations: 0,
    docsComponentTokenDefinitions: 0,
    docsComponentTokenDefinitionFiles: 0,
    docsProtectedFlowClassRoots: 69,
    docsComponentClassDefinitions: 0,
    docsComponentClassDefinitionFiles: 0,
    docsPatternClassDefinitions: 290,
    docsPatternClassRoots: 113,
    docsContractualPatternClassDefinitions: 0,
    docsContractualPatternClassDefinitionFiles: 0,
    generatedComponentCssPresent: 1,
    generatedTokenCssPresent: 1,
    docsSystemBoundaryDebt: 0,
  }, "Docs system boundary");

  const defaults = readAuditReport("docs/audits/react-default-governance-audit.json");
  assertReportStatus(defaults, "React default governance");
  assertInventory(defaults, {
    components: 60,
    defaultDebt: 0,
    prohibitedDefaults: 0,
    semanticDefaultDecisions: 115,
    contractBackedSemanticDefaultDecisions: 115,
    unbackedSemanticDefaultDecisions: 0,
    semanticDefaultDecisionContractGaps: 0,
  }, "React default governance");

  const styles = readAuditReport("docs/audits/react-style-governance-audit.json");
  assertReportStatus(styles, "React style governance");
  assertInventory(styles, {
    components: 60,
    styleEscapeDebt: 0,
    approvedInlineVars: 12,
    styleProps: 10,
    setPropertyCalls: 2,
    violations: 0,
  }, "React style governance");

  const composition = readAuditReport("docs/audits/react-composition-governance-audit.json");
  assertReportStatus(composition, "React composition governance");
  assertInventory(composition, {
    components: 60,
    compositionDebt: 0,
    compositionalComponents: 27,
    compositionEdges: 50,
    unexpectedImports: 0,
    missingImports: 0,
    missingReasons: 0,
    duplicateAllowed: 0,
    unknownAllowed: 0,
    unknownContractOwners: 0,
  }, "React composition governance");

  const classOwnership = readAuditReport("docs/audits/react-class-ownership-audit.json");
  assertReportStatus(classOwnership, "React class ownership");
  assertInventory(classOwnership, {
    components: 60,
    componentClassRoots: 63,
    protectedComponentRoots: 7,
    supportClassRoots: 6,
    packageCssRoots: 71,
    componentsWithFamilyRoots: 14,
    observedRootAssignments: 77,
    observedSupportRootAssignments: 21,
    violations: 0,
    classOwnershipDebt: 0,
  }, "React class ownership");

  const antiDuplication = readAuditReport("docs/audits/anti-duplication-coverage.json");
  assertReportStatus(antiDuplication, "Anti-duplication coverage");
  assertInventory(antiDuplication, {
    checks: 18,
    componentClassRoots: 63,
    acceptedComponents: 60,
    ownerRoots: 60,
    missingOwnerRoots: 0,
    extensionRoots: 3,
    protectedComponentRoots: 7,
    blockedConceptRules: 21,
    blockedConceptClassNames: 167,
    liveDuplicateConceptViolations: 0,
    docsApps: 1,
    docsAllowedComponentAuthors: 0,
    docsAllowedPackageClassTokenFiles: 1,
    antiDuplicationDebt: 0,
  }, "Anti-duplication coverage");

  const packageCssRoots = readAuditReport("docs/audits/package-css-root-governance-audit.json");
  assertReportStatus(packageCssRoots, "Package CSS root governance");
  assertInventory(packageCssRoots, {
    selectors: 1224,
    componentAliases: 3250,
    componentAliasRoots: 66,
    unknownComponentAliases: 0,
    cssRoots: 71,
    componentRoots: 62,
    observedComponentRoots: 62,
    unobservedComponentRoots: 0,
    classifiedNonComponentRoots: 9,
    unclassifiedRoots: 0,
    packageCssRootDebt: 0,
  }, "Package CSS root governance");

  const componentCssContracts = readAuditReport("docs/audits/component-css-contract-coverage.json");
  assertReportStatus(componentCssContracts, "Component CSS contract coverage");
  assertInventory(componentCssContracts, {
    total: 60,
    cssContractDebt: 0,
    direct: 55,
    family: 5,
    missing: 0,
    directRootGaps: 0,
    familyRootGaps: 0,
    familyUnexpectedRoots: 0,
  }, "Component CSS contract coverage");

  const visualCascade = readAuditReport("docs/audits/component-visual-cascade-audit.json");
  assertReportStatus(visualCascade, "Component visual cascade");
  assertInventory(visualCascade, {
    components: 60,
    pass: 60,
    review: 0,
    fail: 0,
    visualCascadeDebt: 0,
  }, "Component visual cascade");

  const familyCssMaturity = readAuditReport("docs/audits/family-css-contract-maturity.json");
  assertReportStatus(familyCssMaturity, "Family CSS contract maturity");
  assertInventory(familyCssMaturity, {
    familyComponents: 5,
    reviewCandidates: 0,
    watchlist: 0,
    familyCssMaturityDebt: 0,
  }, "Family CSS contract maturity");

  const patternReadiness = readAuditReport("docs/audits/pattern-readiness-audit.json");
  assertReportStatus(patternReadiness, "Pattern readiness");
  assertInventory(patternReadiness, {
    metaPatterns: 58,
    catalogPatterns: 63,
    uniqueCatalogPatterns: 63,
    copyPatterns: 63,
    markdownContracts: 63,
    requiredPatternContracts: 23,
    requiredContractsPresent: 23,
    requiredCopyPresent: 23,
    formalArtifacts: 63,
    duplicateCatalogIds: 0,
    requiredContractGaps: 0,
    requiredCopyGaps: 0,
    staleMarkdownContracts: 0,
    formalArtifactBacklog: 0,
    catalogOnlyPatterns: 0,
    approvedCatalogOnlyPatterns: 0,
    unapprovedCatalogOnlyPatterns: 0,
    formalArtifactsMissingCatalog: 0,
    catalogComponentReferenceErrors: 0,
    catalogArtifactDependencyMismatches: 0,
    patternReadinessDebt: 0,
  }, "Pattern readiness");

  const patternArchitecture = readAuditReport("docs/audits/pattern-1to1-architecture-audit.json");
  assertReportStatus(patternArchitecture, "Pattern 1:1 architecture");
  assertInventory(patternArchitecture, {
    patterns: 63,
    formalArtifacts: 63,
    markdownContracts: 63,
    catalogEntries: 63,
    patternsWithDeclaredPrimitives: 63,
    patternsWithOnlyInferredPrimitives: 0,
    patternsWithUnknownComponents: 0,
    patternsWithComponentArtifactGaps: 0,
    patternsWithPatternCrossings: 45,
    patternsReferencedByTemplates: 16,
    templatePatternDependencies: 50,
    templatePatternDependencyGaps: 0,
    templateModuleDependencyMismatches: 0,
    missingFormalTemplatePatternDependencies: 0,
    templateModuleDependencies: 29,
    unknownTemplateModuleDependencies: 0,
    docsAppAvailable: 1,
    patternsReferencedByDocs: 45,
    formalArtifactBacklog: 0,
    primitiveDeclarationBacklog: 0,
    patternArchitectureBacklog: 0,
    patternArchitectureDebt: 0,
  }, "Pattern 1:1 architecture");

  const reactPatternBehavior = readAuditReport("docs/audits/react-pattern-behavior-governance-audit.json");
  assertReportStatus(reactPatternBehavior, "React pattern behavior governance");
  assertInventory(reactPatternBehavior, {
    formalPatternArtifacts: 63,
    implementedReactPatterns: 63,
    typedPatternDeclarations: 63,
    forwardRefPatterns: 63,
    patternsWithRefAttributes: 63,
    patternsWithDensityProp: 63,
    callbackPropsDeclared: 269,
    callbackPropsTested: 269,
    missingCallbackTests: 0,
    declaredProps: 211,
    unusedDeclaredProps: 0,
    unusedCallbackProps: 0,
    formalStates: 476,
    typedStates: 476,
    statesMissingFromTypes: 0,
    statesMissingFromArtifact: 0,
    controlledPropPairs: 10,
    controlledPairIssues: 0,
    rawGlobalDomRefs: 0,
    forbiddenPropsDeclared: 0,
    unsafeRestSpreads: 0,
    structuralSurfaceSlotPatterns: 28,
    structuralSurfaceSlots: 28,
    missingStructuralSurfaceUsage: 0,
    patternsWithAccessibilityContracts: 60,
    patternsWithDirectAccessibilitySignals: 62,
    patternsWithDelegatedAccessibility: 49,
    missingAccessibilityImplementation: 0,
    missingDataFlowPattern: 0,
    patternsWithBehaviorDebt: 0,
    reactPatternBehaviorDebt: 0,
  }, "React pattern behavior governance");

  const reactPatternComposition = readAuditReport("docs/audits/react-pattern-composition-governance-audit.json");
  assertReportStatus(reactPatternComposition, "React pattern composition governance");
  assertInventory(reactPatternComposition, {
    formalPatternArtifacts: 63,
    implementedReactPatterns: 63,
    missingFormalArtifacts: 0,
    patternsWithDeclaredFoundations: 63,
    patternsWithDeclaredPrimitives: 63,
    missingRequiredComponentImports: 0,
    undeclaredComponentImports: 0,
    unknownComponentImports: 0,
    rawDomVisuals: 0,
    docsDependencies: 0,
    workspaceDependencies: 0,
    visualClassLiterals: 0,
    declaredPatternDependencies: 85,
    runtimePatternImports: 75,
    boundaryOnlyPatternDependencies: 10,
    undocumentedPatternBoundaries: 0,
    undeclaredPatternImports: 0,
    slotCount: 311,
    slotUseCount: 481,
    slotIssues: 0,
    slotRenderEvidenceIssues: 0,
    primitiveSlotUses: 34,
    primitiveSurfaceSlotUses: 28,
    primitiveMapsSlotUses: 1,
    primitiveSlotRuntimeEvidence: 29,
    tokenDependencies: 829,
    tokenIssues: 0,
    missingDataFlowPattern: 0,
    reactPatternCompositionDebt: 0,
  }, "React pattern composition governance");

  const patternFoundationPrimitive = readAuditReport("docs/audits/pattern-foundation-primitive-1to1-audit.json");
  assertReportStatus(patternFoundationPrimitive, "Pattern foundation primitive 1:1");
  assertInventory(patternFoundationPrimitive, {
    formalPatternArtifacts: 63,
    primitiveArtifacts: 24,
    foundationArtifacts: 11,
    componentArtifacts: 60,
    implementedReactPatterns: 63,
    patternsWithExplicitFoundations: 63,
    patternsMissingExplicitFoundations: 0,
    patternsWithMissingPrimitiveRefs: 0,
    patternsWithMissingInferredPrimitiveArtifacts: 0,
    formalDependencyLayerErrors: 0,
    patternsWithUndeclaredComponentPrimitives: 0,
    patternsRequiringSurfacePrimitive: 42,
    patternsRequiringDirectSurfaceRuntime: 27,
    patternsMissingDirectSurfaceRuntime: 0,
    patternsWithStructuralSurfaceDebt: 0,
    cardStructuralWrapperViolations: 0,
    implementedReactPatternsWithArchitectureDebt: 0,
    patternsWithTaxonomyWarnings: 0,
    primitiveArtifactsUnusedByPatterns: 2,
    primitiveArtifactsUnreferencedBySystem: 0,
    unusedPrimitiveArtifactsRequiringPattern: 0,
    foundationArtifactsUnusedByPatterns: 0,
    readyPatterns: 63,
    blockedPatterns: 0,
  }, "Pattern foundation primitive 1:1");

  const patternMigrationPlan = readAuditReport("docs/audits/pattern-react-migration-plan.json");
  assertReportStatus(patternMigrationPlan, "Pattern React migration plan");
  assertInventory(patternMigrationPlan, {
    patterns: 63,
    reactSources: 63,
    typeSources: 63,
    forwardRefPatterns: 63,
    densityPropPatterns: 63,
    callbackPropsDeclared: 269,
    callbackPropsTested: 269,
    surfaceRequired: 44,
    primitiveRuntimeRequired: 9,
    boundaryOnlyPatternDependencies: 10,
    migrationAuditDebt: 0,
    docsReactPatternDemosMigrated: 1,
    docsReactPatternDemoCoverageDebt: 0,
    migrationPlanValidationDebt: 0,
  }, "Pattern React migration plan");
  assertPatternMigrationPlanContract(patternMigrationPlan);

  const templateCascadeGovernance = readAuditReport("docs/audits/template-cascade-governance-audit.json");
  assertReportStatus(templateCascadeGovernance, "Template cascade governance");
  assertInventory(templateCascadeGovernance, {
    templates: 9,
    templateArtifacts: 9,
    catalogTemplates: 9,
    templateBlueprints: 9,
    templatesWithSurfacePrimitive: 9,
    templatesWithDensityPrimitive: 9,
    templatePatternDependencies: 25,
    uniqueTemplatePatternDependencies: 16,
    reactPatternSources: 25,
    reactPatternTypes: 25,
    reactPatternExports: 25,
    patternSurfaceContracts: 18,
    patternSurfaceImports: 18,
    requiredReactTemplateRuntimes: 9,
    templatesWithReactRuntime: 9,
    templateReactRuntimeBacklog: 0,
    missingRequiredReactTemplateRuntimes: 0,
    missingRequiredTemplateSurfaceRoots: 0,
    missingRequiredTemplateExports: 0,
    requiredTemplateControlledStateGaps: 0,
    templateDocsRuntimeReferences: 0,
    templateVanillaDomReferences: 0,
    missingRequiredSections: 0,
    missingFoundationTokens: 0,
    missingPrimitiveTokens: 0,
    templateCascadeGovernanceDebt: 0,
  }, "Template cascade governance");

  const reactTemplateRuntimeGovernance = readAuditReport("docs/audits/react-template-runtime-governance-audit.json");
  assertReportStatus(reactTemplateRuntimeGovernance, "React template runtime governance");
  assertInventory(reactTemplateRuntimeGovernance, {
    templatesAudited: 9,
    renderCases: 72,
    passingRenderCases: 72,
    sourceFiles: 9,
    typeFiles: 9,
    sourceContractChecks: 128,
    typeContractChecks: 114,
    surfaceRootTemplates: 9,
    templatesWithControlledPrimarySelection: 9,
    templatesWithControlledDrawer: 4,
    templateSlotAssertions: 24,
    templateModuleAssertions: 40,
    childPatternAssertions: 24,
    uniqueChildPatternAssertions: 15,
    childComponentAssertions: 6,
    uniqueChildComponentAssertions: 6,
    densityCases: 3,
    stateCases: 7,
    docsRuntimeReferences: 0,
    vanillaDomReferences: 0,
    forbiddenDirectComponentImports: 0,
    forbiddenMarkupFindings: 0,
    exportGaps: 0,
    typeContractGaps: 0,
    reactTemplateRuntimeGovernanceDebt: 0,
  }, "React template runtime governance");

  const reactTemplateCompositionGovernance = readAuditReport("docs/audits/react-template-composition-governance-audit.json");
  assertReportStatus(reactTemplateCompositionGovernance, "React template composition governance");
  assertInventory(reactTemplateCompositionGovernance, {
    templatesAudited: 9,
    templatesWithPassingComposition: 9,
    formalPatternDependencies: 25,
    runtimePatternImports: 25,
    missingDeclaredPatternImports: 0,
    undeclaredPatternImports: 0,
    formalModuleMarkers: 37,
    approvedSupportModuleMarkers: 6,
    runtimeModuleMarkers: 43,
    missingFormalModuleMarkers: 0,
    undeclaredRuntimeModuleMarkers: 0,
    directComponentImports: 6,
    unapprovedDirectComponentImports: 0,
    surfacePrimitiveImports: 9,
    compositionContractGaps: 0,
    reactTemplateCompositionGovernanceDebt: 0,
  }, "React template composition governance");

  const reactTemplateInteractionGovernance = readAuditReport("docs/audits/react-template-interaction-governance-audit.json");
  assertReportStatus(reactTemplateInteractionGovernance, "React template interaction governance");
  assertInventory(reactTemplateInteractionGovernance, {
    templatesAudited: 9,
    sourceFiles: 9,
    typeFiles: 9,
    interactionTestFiles: 1,
    packageTestScriptReferences: 1,
    templatesWithPassingInteractionContracts: 9,
    uncontrolledSelectionCases: 9,
    controlledSelectionCases: 9,
    drawerCloseCases: 4,
    templatesWithSelectionState: 9,
    templatesWithSelectionCallbacks: 9,
    templatesWithControlledSelectionGuard: 9,
    templatesWithDrawerCallbacks: 4,
    templatesWithControlledDrawerGuard: 4,
    testSelectorAssertions: 9,
    testMutationGuards: 9,
    docsRuntimeReferences: 0,
    vanillaDomReferences: 0,
    interactionContractGaps: 0,
    reactTemplateInteractionGovernanceDebt: 0,
  }, "React template interaction governance");

  const reactTemplateVisualGovernance = readAuditReport("docs/audits/react-template-visual-governance-audit.json");
  assertReportStatus(reactTemplateVisualGovernance, "React template visual governance");
  assertInventory(reactTemplateVisualGovernance, {
    templatesAudited: 9,
    visualCases: 27,
    passingVisualCases: 27,
    screenshotsCaptured: 27,
    viewportProfiles: 2,
    densityCases: 3,
    stateCases: 3,
    horizontalOverflowFindings: 0,
    blankOrShallowRenderFindings: 0,
    zeroSizeFindings: 0,
    slotOverlapFindings: 0,
    missingSlotOrModuleFindings: 0,
    reactTemplateVisualGovernanceDebt: 0,
  }, "React template visual governance");

  const primitiveBreakpointsCascade = readAuditReport("docs/audits/primitive-breakpoints-cascade-audit.json");
  assertReportStatus(primitiveBreakpointsCascade, "Primitive Breakpoints cascade");

  const primitiveDensityCascade = readAuditReport("docs/audits/primitive-density-cascade-audit.json");
  assertReportStatus(primitiveDensityCascade, "Primitive Density cascade");

  const primitiveSpacingCascade = readAuditReport("docs/audits/primitive-spacing-cascade-audit.json");
  assertReportStatus(primitiveSpacingCascade, "Primitive Spacing cascade");

  const primitiveSurfaceCascade = readAuditReport("docs/audits/primitive-surface-cascade-audit.json");
  assertReportStatus(primitiveSurfaceCascade, "Primitive Surface cascade");
  assertInventory(primitiveSurfaceCascade, {
    artifactPresent: 1,
    roles: 5,
    states: 8,
    governingFoundations: 5,
    coordinatedPrimitives: 8,
    apiProps: 7,
    reactProps: 9,
    missingReactProps: 0,
    apiOutputs: 5,
    tokenDependencies: 9,
    missingTokenDependencies: 0,
    missingTypeRoles: 0,
    missingTypeStates: 0,
    missingRuntimeRoles: 0,
    missingRuntimeStates: 0,
    missingCssRoleSelectors: 0,
    missingCssStateSelectors: 0,
    missingSourceSnippets: 0,
    missingTypeSnippets: 0,
    missingCssSelectors: 0,
    rawVisualCss: 0,
    patternSurfaceImports: 38,
    structuralSurfacePolicyIssues: 0,
    distGaps: 0,
    surfaceCascadeDebt: 0,
  }, "Primitive Surface cascade");

  const primitiveTypographyCascade = readAuditReport("docs/audits/primitive-typography-cascade-audit.json");
  assertReportStatus(primitiveTypographyCascade, "Primitive Typography cascade");

  const primitiveCascadeGovernance = readAuditReport("docs/audits/primitive-cascade-governance-audit.json");
  assertReportStatus(primitiveCascadeGovernance, "Primitive cascade governance");
  assertInventory(primitiveCascadeGovernance, {
    availablePrimitiveCascadeReports: 23,
    activePrimitiveCascadeReports: 23,
    backlogPrimitiveCascadeReports: 0,
    unknownActivePrimitiveCascadeReports: 0,
    unknownBacklogPrimitiveCascadeReports: 0,
    duplicateActivePrimitiveCascadeReports: 0,
    activeBacklogOverlaps: 0,
    missingPrimitiveCascadeDispositions: 0,
    invalidBacklogEntries: 0,
    missingBacklogFields: 0,
    emptyBacklogReasons: 0,
    invalidBacklogBlockerTypes: 0,
    invalidBacklogActivationEvidence: 0,
    missingActiveLedgerCategories: 0,
    activeReportsMissingArtifacts: 0,
    primitiveCascadeGovernanceDebt: 0,
  }, "Primitive cascade governance");

  const primitiveCascadeActivationPlan = readAuditReport("docs/audits/primitive-cascade-activation-plan.json");
  assertReportStatus(primitiveCascadeActivationPlan, "Primitive cascade activation plan");
  assertInventory(primitiveCascadeActivationPlan, {
    backlogPrimitiveCascadeReports: 0,
    activationWaves: 4,
    emptyActivationWaves: 4,
    backlogWithoutActivationEvidence: 0,
    backlogWithoutActivationWave: 0,
    unknownBlockerTypes: 0,
    uncoveredBlockerTypes: 0,
    activationCandidates: 0,
    blockedActivationCandidates: 0,
    primitiveCascadeActivationPlanDebt: 0,
  }, "Primitive cascade activation plan");

  const tokenTypescriptSurface = readAuditReport("docs/audits/system-token-typescript-surface.json");
  assertReportStatus(tokenTypescriptSurface, "System token TypeScript surface");
  assertInventory(tokenTypescriptSurface, {
    tokenTypescriptSurfaceDebt: 0,
  }, "System token TypeScript surface");

  const componentContractTypescriptSurface = readAuditReport("docs/audits/system-component-contract-typescript-surface.json");
  assertReportStatus(componentContractTypescriptSurface, "System component contract TypeScript surface");
  assertInventory(componentContractTypescriptSurface, {
    componentContractTypescriptSurfaceDebt: 0,
  }, "System component contract TypeScript surface");

  const componentIndexTypescriptSurface = readAuditReport("docs/audits/system-component-index-typescript-surface.json");
  assertReportStatus(componentIndexTypescriptSurface, "System component index TypeScript surface");
  assertInventory(componentIndexTypescriptSurface, {
    indexRuntimeFiles: 1,
    indexTypeScriptSourceFiles: 1,
    staleRuntimeFiles: 0,
    componentIndexTypescriptSurfaceDebt: 0,
  }, "System component index TypeScript surface");

  const componentPlatformTypescriptSurface = readAuditReport("docs/audits/system-component-platform-typescript-surface.json");
  assertReportStatus(componentPlatformTypescriptSurface, "System component platform TypeScript surface");
  assertInventory(componentPlatformTypescriptSurface, {
    platformRuntimeFiles: 61,
    platformTypeScriptSourceFiles: 61,
    missingTypeScriptSources: 0,
    staleRuntimeFiles: 0,
    componentPlatformTypescriptSurfaceDebt: 0,
  }, "System component platform TypeScript surface");

  const componentPrimitiveTypescriptSurface = readAuditReport("docs/audits/system-component-primitive-typescript-surface.json");
  assertReportStatus(componentPrimitiveTypescriptSurface, "System component primitive TypeScript surface");
  assertInventory(componentPrimitiveTypescriptSurface, {
    primitiveRuntimeFiles: 8,
    primitiveTypeScriptSourceFiles: 8,
    missingTypeScriptSources: 0,
    staleRuntimeFiles: 0,
    componentPrimitiveTypescriptSurfaceDebt: 0,
  }, "System component primitive TypeScript surface");

  const componentRegistryTypescriptSurface = readAuditReport("docs/audits/system-component-registry-typescript-surface.json");
  assertReportStatus(componentRegistryTypescriptSurface, "System component registry TypeScript surface");
  assertInventory(componentRegistryTypescriptSurface, {
    registryRuntimeFiles: 1,
    registryTypeScriptSourceFiles: 1,
    staleRuntimeFiles: 0,
    componentRegistryTypescriptSurfaceDebt: 0,
  }, "System component registry TypeScript surface");

  const reactInternalPropsTypescriptSurface = readAuditReport("docs/audits/system-react-internal-props-typescript-surface.json");
  assertReportStatus(reactInternalPropsTypescriptSurface, "React internal props TypeScript surface");
  assertInventory(reactInternalPropsTypescriptSurface, {
    runtimeFiles: 1,
    typeScriptSourceFiles: 1,
    declarationFiles: 1,
    staleRuntimeFiles: 0,
    reactInternalPropsTypescriptSurfaceDebt: 0,
  }, "React internal props TypeScript surface");

  const reactBaseComponentsTypescriptSurface = readAuditReport("docs/audits/system-react-base-components-typescript-surface.json");
  assertReportStatus(reactBaseComponentsTypescriptSurface, "React base components TypeScript surface");
  assertInventory(reactBaseComponentsTypescriptSurface, {
    componentsAudited: 4,
    runtimeFiles: 4,
    tsxSourceFiles: 4,
    declarationFiles: 4,
    staleRuntimeFiles: 0,
    reactBaseComponentTypescriptSurfaceDebt: 0,
  }, "React base components TypeScript surface");

  const reactOverlayComponentsTypescriptSurface = readAuditReport("docs/audits/system-react-overlay-components-typescript-surface.json");
  assertReportStatus(reactOverlayComponentsTypescriptSurface, "React overlay components TypeScript surface");
  assertInventory(reactOverlayComponentsTypescriptSurface, {
    componentsAudited: 5,
    runtimeFiles: 5,
    tsxSourceFiles: 5,
    declarationFiles: 5,
    staleRuntimeFiles: 0,
    reactOverlayComponentTypescriptSurfaceDebt: 0,
  }, "React overlay components TypeScript surface");

  const reactFormControlsTypescriptSurface = readAuditReport("docs/audits/system-react-form-controls-typescript-surface.json");
  assertReportStatus(reactFormControlsTypescriptSurface, "React form controls TypeScript surface");
  assertInventory(reactFormControlsTypescriptSurface, {
    componentsAudited: 5,
    runtimeFiles: 5,
    tsxSourceFiles: 5,
    declarationFiles: 5,
    staleRuntimeFiles: 0,
    reactFormControlComponentTypescriptSurfaceDebt: 0,
  }, "React form controls TypeScript surface");

  const reactLeafComponentsTypescriptSurface = readAuditReport("docs/audits/system-react-leaf-components-typescript-surface.json");
  assertReportStatus(reactLeafComponentsTypescriptSurface, "React leaf components TypeScript surface");
  assertInventory(reactLeafComponentsTypescriptSurface, {
    componentsAudited: 7,
    runtimeFiles: 7,
    tsxSourceFiles: 7,
    declarationFiles: 7,
    staleRuntimeFiles: 0,
    reactLeafComponentTypescriptSurfaceDebt: 0,
  }, "React leaf components TypeScript surface");

  const reactNavigationControlsTypescriptSurface = readAuditReport("docs/audits/system-react-navigation-controls-typescript-surface.json");
  assertReportStatus(reactNavigationControlsTypescriptSurface, "React navigation controls TypeScript surface");
  assertInventory(reactNavigationControlsTypescriptSurface, {
    componentsAudited: 4,
    runtimeFiles: 4,
    tsxSourceFiles: 4,
    declarationFiles: 4,
    staleRuntimeFiles: 0,
    reactNavigationControlTypescriptSurfaceDebt: 0,
  }, "React navigation controls TypeScript surface");

  const reactDataSelectionTypescriptSurface = readAuditReport("docs/audits/system-react-data-selection-typescript-surface.json");
  assertReportStatus(reactDataSelectionTypescriptSurface, "React data selection TypeScript surface");
  assertInventory(reactDataSelectionTypescriptSurface, {
    componentsAudited: 3,
    runtimeFiles: 3,
    tsxSourceFiles: 3,
    declarationFiles: 3,
    staleRuntimeFiles: 0,
    reactDataSelectionTypescriptSurfaceDebt: 0,
  }, "React data selection TypeScript surface");

  const reactPaymentInputsTypescriptSurface = readAuditReport("docs/audits/system-react-payment-inputs-typescript-surface.json");
  assertReportStatus(reactPaymentInputsTypescriptSurface, "React payment inputs TypeScript surface");
  assertInventory(reactPaymentInputsTypescriptSurface, {
    componentsAudited: 3,
    runtimeFiles: 3,
    tsxSourceFiles: 3,
    declarationFiles: 3,
    staleRuntimeFiles: 0,
    reactPaymentInputsTypescriptSurfaceDebt: 0,
  }, "React payment inputs TypeScript surface");

  const reactDateInputsTypescriptSurface = readAuditReport("docs/audits/system-react-date-inputs-typescript-surface.json");
  assertReportStatus(reactDateInputsTypescriptSurface, "React date inputs TypeScript surface");
  assertInventory(reactDateInputsTypescriptSurface, {
    componentsAudited: 2,
    runtimeFiles: 2,
    tsxSourceFiles: 2,
    declarationFiles: 2,
    staleRuntimeFiles: 0,
    reactDateInputsTypescriptSurfaceDebt: 0,
  }, "React date inputs TypeScript surface");

  const reactChatComponentsTypescriptSurface = readAuditReport("docs/audits/system-react-chat-components-typescript-surface.json");
  assertReportStatus(reactChatComponentsTypescriptSurface, "React chat components TypeScript surface");
  assertInventory(reactChatComponentsTypescriptSurface, {
    componentsAudited: 3,
    runtimeFiles: 3,
    tsxSourceFiles: 3,
    declarationFiles: 3,
    staleRuntimeFiles: 0,
    reactChatComponentsTypescriptSurfaceDebt: 0,
  }, "React chat components TypeScript surface");

  const reactFeedbackComponentsTypescriptSurface = readAuditReport("docs/audits/system-react-feedback-components-typescript-surface.json");
  assertReportStatus(reactFeedbackComponentsTypescriptSurface, "React feedback components TypeScript surface");
  assertInventory(reactFeedbackComponentsTypescriptSurface, {
    componentsAudited: 4,
    runtimeFiles: 4,
    tsxSourceFiles: 4,
    declarationFiles: 4,
    staleRuntimeFiles: 0,
    reactFeedbackComponentsTypescriptSurfaceDebt: 0,
  }, "React feedback components TypeScript surface");

  const reactNavigationStructureTypescriptSurface = readAuditReport("docs/audits/system-react-navigation-structure-typescript-surface.json");
  assertReportStatus(reactNavigationStructureTypescriptSurface, "React navigation structure TypeScript surface");
  assertInventory(reactNavigationStructureTypescriptSurface, {
    componentsAudited: 4,
    runtimeFiles: 4,
    tsxSourceFiles: 4,
    declarationFiles: 4,
    staleRuntimeFiles: 0,
    reactNavigationStructureTypescriptSurfaceDebt: 0,
  }, "React navigation structure TypeScript surface");

  const reactMotionEventTypescriptSurface = readAuditReport("docs/audits/system-react-motion-event-typescript-surface.json");
  assertReportStatus(reactMotionEventTypescriptSurface, "React motion/event TypeScript surface");
  assertInventory(reactMotionEventTypescriptSurface, {
    componentsAudited: 4,
    runtimeFiles: 4,
    tsxSourceFiles: 4,
    declarationFiles: 4,
    staleRuntimeFiles: 0,
    reactMotionEventTypescriptSurfaceDebt: 0,
  }, "React motion/event TypeScript surface");

  const reactInputLocalizationTypescriptSurface = readAuditReport("docs/audits/system-react-input-localization-typescript-surface.json");
  assertReportStatus(reactInputLocalizationTypescriptSurface, "React input/localization TypeScript surface");
  assertInventory(reactInputLocalizationTypescriptSurface, {
    componentsAudited: 4,
    runtimeFiles: 4,
    tsxSourceFiles: 4,
    declarationFiles: 4,
    staleRuntimeFiles: 0,
    reactInputLocalizationTypescriptSurfaceDebt: 0,
  }, "React input/localization TypeScript surface");

  const reactAffordanceTypescriptSurface = readAuditReport("docs/audits/system-react-affordance-typescript-surface.json");
  assertReportStatus(reactAffordanceTypescriptSurface, "React affordance TypeScript surface");
  assertInventory(reactAffordanceTypescriptSurface, {
    componentsAudited: 4,
    runtimeFiles: 4,
    tsxSourceFiles: 4,
    declarationFiles: 4,
    staleRuntimeFiles: 0,
    reactAffordanceTypescriptSurfaceDebt: 0,
  }, "React affordance TypeScript surface");

  const reactSummaryActionTypescriptSurface = readAuditReport("docs/audits/system-react-summary-action-typescript-surface.json");
  assertReportStatus(reactSummaryActionTypescriptSurface, "React summary/action TypeScript surface");
  assertInventory(reactSummaryActionTypescriptSurface, {
    componentsAudited: 5,
    runtimeFiles: 5,
    tsxSourceFiles: 5,
    declarationFiles: 5,
    staleRuntimeFiles: 0,
    reactSummaryActionTypescriptSurfaceDebt: 0,
  }, "React summary/action TypeScript surface");

  const reactRootIndexTypescriptSurface = readAuditReport("docs/audits/system-react-root-index-typescript-surface.json");
  assertReportStatus(reactRootIndexTypescriptSurface, "React root index TypeScript surface");
  assertInventory(reactRootIndexTypescriptSurface, {
    sourceExports: 124,
    runtimeExports: 124,
    declarationExports: 124,
    sourceTypeExportGroups: 124,
    declarationTypeExportGroups: 124,
    staleRuntimeFiles: 0,
    reactRootIndexTypescriptSurfaceDebt: 0,
  }, "React root index TypeScript surface");

  const reactSectionIndexesTypescriptSurface = readAuditReport("docs/audits/system-react-section-indexes-typescript-surface.json");
  assertReportStatus(reactSectionIndexesTypescriptSurface, "React section indexes TypeScript surface");
  assertInventory(reactSectionIndexesTypescriptSurface, {
    sectionIndexesAudited: 2,
    sourceExports: 72,
    runtimeExports: 72,
    declarationExports: 72,
    sourceTypeExportGroups: 72,
    declarationTypeExportGroups: 72,
    staleRuntimeFiles: 0,
    reactSectionIndexTypescriptSurfaceDebt: 0,
  }, "React section indexes TypeScript surface");

  const systemDebtLedger = readAuditReport("docs/audits/system-debt-ledger.json");
  assertReportStatus(systemDebtLedger, "System debt ledger");
  assertInventory(systemDebtLedger, {
    reports: 107,
    categoryMappings: 97,
    systemDebtGovernanceIssues: 0,
    staleCategoryMappings: 0,
    reportsWithDebtMetrics: 107,
    debtMetrics: 123,
    categories: 8,
    categoryMinimums: 8,
    categoryPrinciples: 8,
    categoryMinimumDebt: 0,
    statusDebt: 0,
    nonPassReports: 0,
    categoriesMissingMinimums: 0,
    unexpectedCategoryMinimums: 0,
    categoriesMissingPrinciples: 0,
    unexpectedCategoryPrinciples: 0,
    categoriesWithDebt: 0,
    undercoveredStrategicCategories: 0,
    uncategorizedReports: 0,
    unexpectedCategories: 0,
    missingStrategicCategories: 0,
    emptyStrategicCategories: 0,
    nonNumericDebtMetrics: 0,
    totalDebt: 0,
    categoryDebt: 0,
    categoryCoverageDebt: 0,
    systemDebt: 0,
  }, "System debt ledger");
  assertSystemDebtCategories(systemDebtLedger);

  const propAlignment = readAuditReport("docs/audits/react-contract-prop-alignment-audit.json");
  assertReportStatus(propAlignment, "React contract prop alignment");
  assertInventory(propAlignment, {
    components: 60,
    propAlignmentDebt: 0,
    pass: 60,
    fail: 0,
    extraReactProps: 0,
    missingReactProps: 0,
    requiredMismatches: 0,
    typeValueMismatches: 0,
    unreferencedPublicProps: 0,
  }, "React contract prop alignment");

  const controlled = readAuditReport("docs/audits/react-controlled-governance-audit.json");
  assertReportStatus(controlled, "React controlled governance");
  assertInventory(controlled, {
    components: 60,
    controlledDebt: 0,
    controlledComponents: 31,
    openControlledComponents: 10,
    totalControlledEdges: 40,
    totalTestCoveredEdges: 40,
    failures: 0,
  }, "React controlled governance");

  const interactions = readAuditReport("docs/audits/react-interaction-coverage-audit.json");
  assertReportStatus(interactions, "React interaction coverage");
  assertInventory(interactions, {
    components: 60,
    interactionDebt: 0,
    withCallbacks: 44,
    pass: 60,
    review: 0,
    fail: 0,
    missingTestCallbacks: 0,
    missingEventParams: 0,
    manualAccessibilityCritical: 10,
    manualAccessibilityCriticalPass: 10,
  }, "React interaction coverage");

  const accessibility = readAuditReport("docs/audits/react-accessibility-governance-audit.json");
  assertReportStatus(accessibility, "React accessibility governance");
  assertInventory(accessibility, {
    components: 60,
    accessibilityDebt: 0,
    criticalComponents: 10,
    criticalPassing: 10,
    failures: 0,
    interactionFailures: 0,
  }, "React accessibility governance");
}

function readAuditReport(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function readContentContract(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, "packages/content/content", relativePath), "utf8"));
}

function assertReportStatus(report, label, expectedStatus = "pass") {
  if (report.status !== expectedStatus) {
    throw new Error(`${label} report status changed: expected ${expectedStatus}, got ${report.status}.`);
  }
}

function assertInventory(report, expected, label) {
  const inventory = report.inventory ?? {};
  const mismatches = Object.entries(expected)
    .filter(([key, value]) => inventory[key] !== value)
    .map(([key, value]) => `${key}: expected ${value}, got ${inventory[key]}`);
  if (mismatches.length) {
    throw new Error(`${label} inventory baseline changed: ${mismatches.join(", ")}.`);
  }
}

function assertSystemDebtCategories(report) {
  const governance = readContentContract("system-debt-governance.json");
  const categories = report.categories ?? [];
  const actualCategoryIds = categories.map((category) => category.category);
  if (JSON.stringify(actualCategoryIds) !== JSON.stringify(governance.expectedStrategicCategories)) {
    throw new Error("System debt ledger category ids changed.");
  }
  const categoryIssues = categories.flatMap((category) => {
    const issues = [];
    const expectedPrinciple = governance.categoryPrinciples[category.category];
    const expectedMinimum = governance.categoryReportMinimums[category.category];
    if (category.principle !== expectedPrinciple) issues.push(`${category.category}: principle changed`);
    if (category.minimumReports !== expectedMinimum) issues.push(`${category.category}: minimum changed`);
    if (category.reports < expectedMinimum) issues.push(`${category.category}: below minimum reports`);
    if (category.coverageGap !== 0) issues.push(`${category.category}: coverage gap ${category.coverageGap}`);
    if (category.debtMetrics < category.reports) issues.push(`${category.category}: missing debt metrics`);
    if (category.totalDebt !== 0) issues.push(`${category.category}: debt ${category.totalDebt}`);
    return issues;
  });
  if (categoryIssues.length) {
    throw new Error(`System debt ledger category contract changed: ${categoryIssues.join(", ")}.`);
  }
}

function assertPatternMigrationPlanContract(report) {
  const expectedGlobalGates = {
    architectureDebt: 0,
    architectureBlockingDebt: 0,
    patternsWithDeclaredPrimitives: 63,
    patternsWithOnlyInferredPrimitives: 0,
    templateDependencyGaps: 0,
    surfaceRequiredPatterns: 42,
    directSurfaceRuntimeRequired: 27,
    missingDirectSurfaceRuntime: 0,
    structuralSurfaceDebt: 0,
    cardStructuralWrapperViolations: 0,
    unclassifiedUnusedPrimitiveArtifacts: 0,
    foundationPrimitiveBlockingDebt: 0,
  };
  const expectedWaves = [
    ["base Flow composition", { patterns: 8, surfacePatterns: 0, runtimePrimitives: 0, patternBoundaries: 2, templateRefs: 0, componentRefs: 17 }],
    ["stateful Flow composition", { patterns: 23, surfacePatterns: 18, runtimePrimitives: 0, patternBoundaries: 9, templateRefs: 0, componentRefs: 35 }],
    ["cross-pattern composition", { patterns: 9, surfacePatterns: 5, runtimePrimitives: 0, patternBoundaries: 12, templateRefs: 0, componentRefs: 19 }],
    ["primitive-runtime composition", { patterns: 6, surfacePatterns: 6, runtimePrimitives: 2, patternBoundaries: 1, templateRefs: 0, componentRefs: 19 }],
    ["template-facing orchestrator", { patterns: 17, surfacePatterns: 15, runtimePrimitives: 3, patternBoundaries: 21, templateRefs: 8, componentRefs: 36 }],
  ];
  const issues = [];
  for (const [key, expected] of Object.entries(expectedGlobalGates)) {
    if (report.globalGates?.[key] !== expected) {
      issues.push(`globalGates.${key}: expected ${expected}, got ${report.globalGates?.[key]}`);
    }
  }
  const waves = report.waveExecutionPackages ?? [];
  if (waves.length !== expectedWaves.length) {
    issues.push(`waveExecutionPackages: expected ${expectedWaves.length}, got ${waves.length}`);
  }
  for (const [index, [mode, expectedCounts]] of expectedWaves.entries()) {
    const wave = waves[index];
    if (!wave) continue;
    if (wave.mode !== mode) issues.push(`wave ${index + 1} mode: expected ${mode}, got ${wave.mode}`);
    for (const [key, expected] of Object.entries(expectedCounts)) {
      if (wave.counts?.[key] !== expected) {
        issues.push(`wave ${mode} counts.${key}: expected ${expected}, got ${wave.counts?.[key]}`);
      }
    }
    if ((wave.exitGates ?? []).length < 5) {
      issues.push(`wave ${mode} must keep at least five exit gates`);
    }
  }
  const patterns = report.patterns ?? [];
  const surfaceChecklist = patterns.filter((pattern) => pattern.executionChecklist?.some((gate) => gate.id === "surface-primitive"));
  const runtimeChecklist = patterns.filter((pattern) => pattern.executionChecklist?.some((gate) => gate.id === "runtime-primitives"));
  const patternBoundaryChecklist = patterns.filter((pattern) => pattern.executionChecklist?.some((gate) => gate.id === "pattern-boundaries"));
  const templateBoundaryChecklist = patterns.filter((pattern) => pattern.executionChecklist?.some((gate) => gate.id === "template-boundaries"));
  const baseGateIds = ["formal-artifact", "react-primary", "types-contract", "flow-composition", "docs-system-boundary", "verification"];
  if (patterns.length !== 63) issues.push(`patterns: expected 63, got ${patterns.length}`);
  if (surfaceChecklist.length !== 44) issues.push(`surface checklist count: expected 44, got ${surfaceChecklist.length}`);
  if (runtimeChecklist.length !== 9) issues.push(`runtime checklist count: expected 9, got ${runtimeChecklist.length}`);
  if (patternBoundaryChecklist.length !== 42) issues.push(`pattern boundary checklist count: expected 42, got ${patternBoundaryChecklist.length}`);
  if (templateBoundaryChecklist.length !== 16) issues.push(`template boundary checklist count: expected 16, got ${templateBoundaryChecklist.length}`);
  for (const pattern of patterns) {
    const checklistIds = (pattern.executionChecklist ?? []).map((gate) => gate.id);
    for (const gate of baseGateIds) {
      if (!checklistIds.includes(gate)) issues.push(`${pattern.id} missing checklist gate ${gate}`);
    }
    if (Boolean(pattern.requiresSurface) !== checklistIds.includes("surface-primitive")) {
      issues.push(`${pattern.id} Surface checklist does not match requiresSurface`);
    }
    if ((pattern.executionChecklist ?? []).some((gate) => /Card as a generic wrapper/i.test(gate.gate) && gate.id !== "surface-primitive")) {
      issues.push(`${pattern.id} contains Card wrapper policy outside Surface primitive gate`);
    }
  }
  if ((report.validationIssues ?? []).length !== 0) issues.push(`validationIssues: expected 0, got ${report.validationIssues.length}`);
  if ((report.boundaryOnlyPatternDependencies ?? []).length !== 10) issues.push("boundary-only dependency count changed");
  if ((report.templatePatternDependencies ?? []).length !== 50) issues.push("template dependency count changed");
  if ((report.governedUnusedPrimitives ?? []).length !== 2) issues.push("governed unused primitive count changed");
  const docsCoverage = report.docsReactPatternDemoCoverage ?? [];
  const docsCoveragePatterns = docsCoverage.map((row) => row.pattern).sort();
  if (JSON.stringify(docsCoveragePatterns) !== JSON.stringify(["timeline"])) {
    issues.push(`docs React pattern demo coverage changed: expected timeline, got ${docsCoveragePatterns.join(", ") || "none"}`);
  }
  for (const row of docsCoverage) {
    if (row.status !== "pass") issues.push(`${row.pattern} docs React pattern demo coverage status: expected pass, got ${row.status}`);
    if ((row.debts ?? []).length) issues.push(`${row.pattern} docs React pattern demo coverage debt: ${row.debts.join(", ")}`);
  }
  if (issues.length) {
    throw new Error(`Pattern React migration plan contract changed: ${issues.join(", ")}.`);
  }
}

function exportTargets(value) {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return [value.default, value.types].filter(Boolean);
}

function pascalCase(value) {
  return value.split("-").map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join("");
}

function camelCase(value) {
  const pascal = pascalCase(value);
  return `${pascal.slice(0, 1).toLowerCase()}${pascal.slice(1)}`;
}

function cssSelectorRootObserved(css, rootToken) {
  return new RegExp(`\\.${escapeRegExp(rootToken)}(?:\\b|__|\\[|[\\s:{.#>+~])`).test(css);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}

function run(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`${command} ${args.join(" ")} failed in ${cwd}`);
  }
  return result;
}
