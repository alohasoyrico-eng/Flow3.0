const {
  fs,
  path,
  root,
  add,
  read,
} = require("./audit-context.js");

const moduleRules = [
  {
    id: "actions",
    file: "packages/components/src/components/actions.js",
    exports: ["createTransitionalActionButton", "createTransitionalActionIconButton"],
    publicExports: [],
    internalExports: ["createTransitionalActionButton", "createTransitionalActionIconButton"],
  },
  {
    id: "choices",
    file: "packages/components/src/components/choices.js",
    exports: ["createTransitionalChoiceCheckbox", "createTransitionalChoiceRadioButton", "createTransitionalChoiceSwitch"],
    publicExports: [],
    internalExports: ["createTransitionalChoiceCheckbox", "createTransitionalChoiceRadioButton", "createTransitionalChoiceSwitch"],
  },
  {
    id: "commerce",
    file: "packages/components/src/components/commerce.js",
    exports: [
      "createCardSummary",
      "createChartPanel",
      "createMovementRow",
      "createQuickAction",
      "createRouteSummary",
      "createStationPin",
      "createTable",
    ],
    publicExports: ["createCardSummary", "createChartPanel", "createRouteSummary", "createStationPin"],
    internalExports: ["createMovementRow", "createQuickAction", "createTable"],
  },
  {
    id: "display",
    file: "packages/components/src/components/display.js",
    exports: ["createAuditEvent", "createTransitionalAvatar", "createKpiTile", "createList"],
    publicExports: ["createAuditEvent"],
    internalExports: ["createTransitionalAvatar", "createKpiTile", "createList"],
  },
  {
    id: "feedback",
    file: "packages/components/src/components/feedback.js",
    exports: ["createEmptyState", "createErrorPanel", "createProgressIndicator", "createSkeleton", "createSpinner"],
    publicExports: [],
    internalExports: ["createEmptyState", "createErrorPanel", "createProgressIndicator", "createSkeleton", "createSpinner"],
  },
  {
    id: "fields",
    file: "packages/components/src/components/fields.js",
    exports: ["createCombobox", "createTransitionalFieldSelect", "createTransitionalFieldTextArea", "createTransitionalFieldInput"],
    publicExports: [],
    internalExports: ["createCombobox", "createTransitionalFieldSelect", "createTransitionalFieldTextArea", "createTransitionalFieldInput"],
  },
  {
    id: "interactions",
    file: "packages/components/src/components/interactions.js",
    exports: ["createAccordion", "createSegmentedControl", "createSlider", "createTabs", "createTreeView"],
    publicExports: [],
    internalExports: ["createAccordion", "createSegmentedControl", "createSlider", "createTabs", "createTreeView"],
  },
  {
    id: "navigation",
    file: "packages/components/src/components/navigation.js",
    exports: ["createBreadcrumbs", "createPagination", "createStepper"],
    publicExports: [],
    internalExports: ["createBreadcrumbs", "createPagination", "createStepper"],
  },
  {
    id: "motion",
    file: "packages/components/src/components/motion.js",
    exports: ["createAnimatedMoment", "createMotionBoundary"],
  },
  {
    id: "overlays",
    file: "packages/components/src/components/overlays.js",
    exports: [
      "createDialog",
      "createDrawer",
      "createMenu",
      "createPopover",
      "createToast",
      "createTransitionalTooltip",
    ],
    publicExports: [],
    internalExports: ["createDialog", "createDrawer", "createMenu", "createPopover", "createToast", "createTransitionalTooltip"],
  },
  {
    id: "specialized-inputs",
    file: "packages/components/src/components/specialized-inputs.js",
    exports: ["createCountrySelector", "hydrateCountrySelector", "createTransitionalDatePicker", "createTransitionalDateRangePicker", "createTransitionalPhoneInput", "createTransitionalSecurityCodeInput"],
    publicExports: [],
    internalExports: ["createCountrySelector", "hydrateCountrySelector", "createTransitionalDatePicker", "createTransitionalDateRangePicker", "createTransitionalPhoneInput", "createTransitionalSecurityCodeInput"],
  },
  {
    id: "security",
    file: "packages/components/src/components/security.js",
    exports: ["createBiometricPrompt"],
  },
  {
    id: "status",
    file: "packages/components/src/components/status.js",
    exports: ["createTransitionalBadge", "createTransitionalChip", "createTransitionalTag"],
    publicExports: [],
    internalExports: ["createTransitionalBadge", "createTransitionalChip", "createTransitionalTag"],
  },
  {
    id: "surfaces",
    file: "packages/components/src/components/surfaces.js",
    exports: ["createCard", "createFloatingActionButton", "createInlineValidation"],
    publicExports: [],
    internalExports: ["createCard", "createFloatingActionButton", "createInlineValidation"],
  },
];

function checkComponentModules() {
  const indexFile = path.join(root, "packages/components/src/index.js");
  const index = read(indexFile);
  if (/^export function create/m.test(index)) {
    add("errors", indexFile, 1, "Public component index must stay declarative; place component factories in focused modules.");
  }

  for (const rule of moduleRules) {
    const file = path.join(root, rule.file);
    if (!fs.existsSync(file)) {
      add("errors", file, 1, `Missing component module: ${rule.id}.`);
      continue;
    }
    const source = read(file);
    const publicExports = rule.publicExports ?? rule.exports;
    const internalExports = rule.internalExports ?? [];
    for (const exportName of rule.exports) {
      if (!source.includes(`export function ${exportName}`) && !source.includes(`export const ${exportName}`)) {
        add("errors", file, 1, `Component module ${rule.id} must export ${exportName}.`);
      }
      if (publicExports.includes(exportName) && (!hasNamedExport(index, exportName) || !index.includes(`./components/${rule.id}.js`))) {
        add("errors", indexFile, 1, `Public component index must re-export ${exportName} from ${rule.id} module.`);
      }
      if (internalExports.includes(exportName) && hasNamedExport(index, exportName)) {
        add("errors", indexFile, 1, `${exportName} is internal-only while React is the public component target; do not re-export it from the package index.`);
      }
      if (index.includes(`export function ${exportName}`)) {
        add("errors", indexFile, 1, `Public component index must not redefine ${exportName}; keep it in ${rule.id} module.`);
      }
    }
  }
}

function hasNamedExport(source, name) {
  return new RegExp(`\\b${name}\\b`).test(source);
}

module.exports = { checkComponentModules };
