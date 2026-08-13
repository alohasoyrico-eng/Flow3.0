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
        && include.includes("packages/react/src/Popover.tsx")
        && include.includes("packages/react/src/IconButton.tsx")
        && include.includes("packages/react/src/Checkbox.tsx")
        && include.includes("packages/react/src/RadioButton.tsx")
        && include.includes("packages/react/src/Switch.tsx")
        && include.includes("packages/react/src/TextArea.tsx")
        && include.includes("packages/react/src/Avatar.tsx")
        && include.includes("packages/react/src/Badge.tsx")
        && include.includes("packages/react/src/ProgressIndicator.tsx")
        && include.includes("packages/react/src/Spinner.tsx")
        && include.includes("packages/react/src/Skeleton.tsx")
        && include.includes("packages/react/src/Tag.tsx")
        && include.includes("packages/react/src/Chip.tsx")
        && include.includes("packages/react/src/Breadcrumbs.tsx")
        && include.includes("packages/react/src/Pagination.tsx")
        && include.includes("packages/react/src/SegmentedControl.tsx")
        && include.includes("packages/react/src/Slider.tsx")
        && include.includes("packages/react/src/Select.tsx")
        && include.includes("packages/react/src/Combobox.tsx")
        && include.includes("packages/react/src/Table.tsx")
        && include.includes("packages/react/src/CardNumberInput.tsx")
        && include.includes("packages/react/src/CardExpiryInput.tsx")
        && include.includes("packages/react/src/CardSecurityCodeInput.tsx")
        && include.includes("packages/react/src/DatePicker.tsx")
        && include.includes("packages/react/src/DateRangePicker.tsx")
        && include.includes("packages/react/src/ChatComposer.tsx")
        && include.includes("packages/react/src/ChatMessage.tsx")
        && include.includes("packages/react/src/ChatThread.tsx")
        && include.includes("packages/react/src/EmptyState.tsx")
        && include.includes("packages/react/src/ErrorPanel.tsx")
        && include.includes("packages/react/src/InlineValidation.tsx")
        && include.includes("packages/react/src/Toast.tsx")
        && include.includes("packages/react/src/Accordion.tsx")
        && include.includes("packages/react/src/TreeView.tsx")
        && include.includes("packages/react/src/List.tsx")
        && include.includes("packages/react/src/Stepper.tsx")
        && include.includes("packages/react/src/AnimatedMoment.tsx")
        && include.includes("packages/react/src/MotionBoundary.tsx")
        && include.includes("packages/react/src/MovementRow.tsx")
        && include.includes("packages/react/src/AuditEvent.tsx")
        && include.includes("packages/react/src/CodeInput.tsx")
        && include.includes("packages/react/src/PhoneInput.tsx")
        && include.includes("packages/react/src/CountrySelector.tsx")
        && include.includes("packages/react/src/InputAmount.tsx")
        && include.includes("packages/react/src/BiometricPrompt.tsx")
        && include.includes("packages/react/src/FloatingActionButton.tsx")
        && include.includes("packages/react/src/StationPin.tsx")
        && include.includes("packages/react/src/Tooltip.tsx")
        && include.includes("packages/react/src/CardSummary.tsx")
        && include.includes("packages/react/src/ChartPanel.tsx")
        && include.includes("packages/react/src/KpiTile.tsx")
        && include.includes("packages/react/src/QuickAction.tsx")
        && include.includes("packages/react/src/RouteSummary.tsx")
        && include.includes("packages/react/src/index.ts")
        && include.includes("packages/react/src/patterns/index.ts")
        && include.includes("packages/react/src/patterns/AccountOperations.ts")
        && include.includes("packages/react/src/patterns/ActionSheet.ts")
        && include.includes("packages/react/src/patterns/AdvancedFilters.ts")
        && include.includes("packages/react/src/patterns/AgentConversation.ts")
        && include.includes("packages/react/src/patterns/AuthenticationLoginBiometricsAndOtp.ts")
        && include.includes("packages/react/src/patterns/Autocomplete.ts")
        && include.includes("packages/react/src/patterns/AvatarGroup.ts")
        && include.includes("packages/react/src/patterns/AvatarMenu.ts")
        && include.includes("packages/react/src/patterns/BackofficeApproval.ts")
        && include.includes("packages/react/src/patterns/BottomSheet.ts")
        && include.includes("packages/react/src/patterns/BulkActions.ts")
        && include.includes("packages/react/src/patterns/CalendarView.ts")
        && include.includes("packages/react/src/patterns/CaseManagement.ts")
        && include.includes("packages/react/src/patterns/ChartLegendItem.ts")
        && include.includes("packages/react/src/patterns/ChartWrapper.ts")
        && include.includes("packages/react/src/patterns/CheckboxGroup.ts")
        && include.includes("packages/react/src/patterns/ColumnConfigurator.ts")
        && include.includes("packages/react/src/patterns/CommandPalette.ts")
        && include.includes("packages/react/src/patterns/ConfirmationDialog.ts")
        && include.includes("packages/react/src/patterns/DenseOperationalList.ts")
        && include.includes("packages/react/src/patterns/DragSortableList.ts")
        && include.includes("packages/react/src/patterns/DrawerAdapter.ts")
        && include.includes("packages/react/src/patterns/DriverAndVehicleAdministration.ts")
        && include.includes("packages/react/src/patterns/DriverOnboardingMobile.ts")
        && include.includes("packages/react/src/patterns/EmailTemplateLayout.ts")
        && include.includes("packages/react/src/patterns/ExpandableDetailTable.ts")
        && include.includes("packages/react/src/patterns/FileUpload.ts")
        && include.includes("packages/react/src/patterns/FilterChipGroup.ts")
        && include.includes("packages/react/src/patterns/FilterableEditableTable.ts")
        && include.includes("packages/react/src/patterns/FleetManagerOnboardingDesktop.ts")
        && include.includes("packages/react/src/patterns/FormSection.ts")
        && include.includes("packages/react/src/patterns/FullscreenSheet.ts")
        && include.includes("packages/react/src/patterns/GanttChart.ts")
        && include.includes("packages/react/src/patterns/HelpCenter.ts")
        && include.includes("packages/react/src/patterns/KanbanBoard.ts")
        && include.includes("packages/react/src/patterns/KpiCard.ts")
        && include.includes("packages/react/src/patterns/MultiSelect.ts")
        && include.includes("packages/react/src/patterns/MultiStepForm.ts")
        && include.includes("packages/react/src/patterns/NotificationPanel.ts")
        && include.includes("packages/react/src/patterns/PaymentForm.ts")
        && include.includes("packages/react/src/patterns/PolarChart.ts")
        && include.includes("packages/react/src/patterns/PreferenceManagement.ts")
        && include.includes("packages/react/src/patterns/PricingOperations.ts")
        && include.includes("packages/react/src/patterns/PullToRefresh.ts")
        && include.includes("packages/react/src/patterns/RadioGroup.ts")
        && include.includes("packages/react/src/patterns/RolesAndPermissions.ts")
        && include.includes("packages/react/src/patterns/SectionHeader.ts")
        && include.includes("packages/react/src/patterns/SelectOptionLayer.ts")
        && include.includes("packages/react/src/patterns/Settings.ts")
        && include.includes("packages/react/src/patterns/SnackbarProvider.ts")
        && include.includes("packages/react/src/patterns/StationDiscovery.ts")
        && include.includes("packages/react/src/patterns/StatusFeedbackView.ts")
        && include.includes("packages/react/src/patterns/SwipeActions.ts")
        && include.includes("packages/react/src/patterns/TicketQueue.ts")
        && include.includes("packages/react/src/patterns/Timeline.ts")
        && include.includes("packages/react/src/patterns/Toolbar.ts")
        && include.includes("packages/react/src/patterns/TransferList.ts")
        && include.includes("packages/react/src/patterns/VirtualDataTable.ts")
        && include.includes("packages/react/src/patterns/WaterfallChart.ts")
        && include.includes("packages/react/src/patterns/QuickActionsGrid.ts")
        && include.includes("packages/react/src/templates/AgentWorkspace.ts")
        && include.includes("packages/react/src/templates/ConfigurationConsole.ts")
        && include.includes("packages/react/src/templates/DriverCardWallet.ts")
        && include.includes("packages/react/src/templates/DriverMobileApp.ts")
        && include.includes("packages/react/src/templates/FleetDashboardSuite.ts")
        && include.includes("packages/react/src/templates/FleetManagerDesktop.ts")
        && include.includes("packages/react/src/templates/index.ts"),
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
