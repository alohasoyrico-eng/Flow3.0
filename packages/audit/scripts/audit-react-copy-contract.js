const { fs, path, root, read, add } = require("./audit-context.js");

const reactSrcDir = path.join(root, "packages/react/src");
const localeSpecificTerms = ["Selecciona", "Rango de fechas", " dias", "días", "es-MX", "\"L\", \"M\", \"X\", \"J\", \"V\", \"S\", \"D\""];
const componentContentDefaults = ["Short value", "Keep this field local", "Recent activity", "Apply", "Cancel", "Confirm", "Continue", "Save", "7 days", "30 days", "90 days"];
const validationContentDefaults = ["Check the", "Enter the", "Use a card"];
const visibleTriggerDefaultsByFile = new Map([
  ["Avatar.js", ["Unknown avatar"]],
  ["Dialog.js", ["Dialog", "Open dialog"]],
  ["Drawer.js", ["Drawer", "Open drawer", "Progress"]],
  ["ErrorPanel.js", ["Something needs attention"]],
  ["Menu.js", ["Actions", "Menu", "Edit", "Duplicate", "Delete", "Archive"]],
  ["Popover.js", ["Open"]],
  ["Pagination.js", ["Pagination", "Previous page", "Next page", "Page"]],
  ["SegmentedControl.js", ["First", "Second", "Third", "Option"]],
  ["Skeleton.js", ["Content loading"]],
  ["StationPin.js", ["Station", "Station pin"]],
  ["Stepper.js", ["Step", "Progress"]],
  ["InlineValidation.js", ["Input"]],
  ["CountrySelector.js", ["No results", "Country", "MX"]],
  ["PhoneInput.js", ["No results", "MX", "+1"]],
  ["List.js", ["Loading"]],
  ["Tabs.js", ["Overview", "Details", "Settings", "Tab"]],
  ["Table.js", ["Table", "Expand", "Collapse"]],
  ["Tooltip.js", ["Info", "Tooltip"]],
  ["Toast.js", ["Toast"]],
  ["TreeView.js", ["Fleet", "Cards", "Tree item", "Tree view"]],
  ["Breadcrumbs.js", ["Home", "Breadcrumbs", "Collapsed breadcrumb items"]],
]);
const displayFallbackTermsByFile = new Map([
  ["Accordion.js", ["Section"]],
  ["Card.js", ["Card", "Loading"]],
  ["CardSummary.js", ["Card", "Active", "Frozen", "Review"]],
  ["ChartPanel.js", ["Chart", "Value", "Series", "Current", "Previous"]],
  ["EmptyState.js", ["No results"]],
  ["KpiTile.js", ["KPI"]],
  ["List.js", ["List item", "Loading item"]],
  ["Dialog.js", ["Action"]],
  ["Drawer.js", ["Action"]],
  ["Popover.js", ["Action"]],
  ["RouteSummary.js", ["Action", "Route"]],
  ["AuditEvent.js", ["Audit event", "Verified", "Review", "Critical"]],
  ["AnimatedMoment.js", ["Animated moment", "Action complete"]],
  ["Badge.js", ["Badge"]],
  ["Button.js", ["Button"]],
  ["Checkbox.js", ["Checkbox"]],
  ["Chip.js", ["Chip"]],
  ["CardNumberInput.js", ["Card number"]],
  ["CardExpiryInput.js", ["Expiry date"]],
  ["CodeInput.js", ["Security code"]],
  ["CardSecurityCodeInput.js", ["Security code"]],
  ["DatePicker.js", ["Date"]],
  ["DateRangePicker.js", ["Date range"]],
  ["FloatingActionButton.js", ["Create"]],
  ["IconButton.js", ["Action"]],
  ["Input.js", ["Input"]],
  ["PhoneInput.js", ["Phone number"]],
  ["ProgressIndicator.js", ["Progress"]],
  ["Select.js", ["Select"]],
  ["Combobox.js", ["Combobox"]],
  ["Slider.js", ["Slider"]],
  ["TextArea.js", ["Text area"]],
  ["MovementRow.js", ["Movement", "Pending", "Declined"]],
  ["MotionBoundary.js", ["Panel transition", "Controls the entrance"]],
  ["QuickAction.js", ["Action"]],
  ["RadioButton.js", ["Radio button"]],
  ["Switch.js", ["Switch"]],
  ["Tag.js", ["Tag"]],
]);

function isFormatMask(value) {
  return /^[A-Z0-9\s/+()-]+$/.test(value);
}

function checkReactCopyContract() {
  if (!fs.existsSync(reactSrcDir)) return;

  for (const fileName of fs.readdirSync(reactSrcDir).filter((file) => /^[A-Z].*\.js$/.test(file))) {
    const file = path.join(reactSrcDir, fileName);
    const lines = read(file).split("\n");

    lines.forEach((line, index) => {
      if (!/["'`]/.test(line)) return;
      const isReactMetadata = line.includes(".displayName") || line.includes(".platformContract");
      const isAriaName = line.includes('"aria-label"') || line.includes("'aria-label'") || line.includes("ariaLabel");
      const matchedTerm = localeSpecificTerms.find((term) => line.includes(term));
      if (matchedTerm) {
        add(
          "errors",
          file,
          index + 1,
          `React Copy Contract: locale-specific copy "${matchedTerm.trim()}" cannot live in the React component package. Pass it from content/docs/consumer props instead.`
        );
      }

      const matchedContentDefault = componentContentDefaults.find((term) => line.includes(`"${term}`) || line.includes(`'${term}`));
      if (matchedContentDefault) {
        add(
          "errors",
          file,
          index + 1,
          `React Copy Contract: component-visible default copy "${matchedContentDefault}" belongs in content/docs/consumer props.`
        );
      }

      const matchedValidationDefault = validationContentDefaults.find((term) => line.includes(`"${term}`) || line.includes(`'${term}`));
      if (matchedValidationDefault) {
        add(
          "errors",
          file,
          index + 1,
          `React Copy Contract: validation copy "${matchedValidationDefault}" belongs in content/docs/consumer props.`
        );
      }

      const displayFallbackTerms = displayFallbackTermsByFile.get(fileName) ?? [];
      const matchedDisplayFallback = displayFallbackTerms.find((term) => line.includes(`?? "${term}"`) || line.includes(`?? '${term}'`));
      if (matchedDisplayFallback) {
        add(
          "errors",
          file,
          index + 1,
          `React Copy Contract: display component fallback "${matchedDisplayFallback}" belongs in content/docs/consumer props.`
        );
      }

      const visibleTriggerDefaults = visibleTriggerDefaultsByFile.get(fileName) ?? [];
      const matchedTriggerDefault = isReactMetadata || isAriaName ? undefined : visibleTriggerDefaults.find((term) => line.includes(`= "${term}"`) || line.includes(`= '${term}'`) || line.includes(`?? "${term}"`) || line.includes(`?? '${term}'`));
      if (matchedTriggerDefault) {
        add(
          "errors",
          file,
          index + 1,
          `React Copy Contract: visible trigger/content fallback "${matchedTriggerDefault}" belongs in content/docs/consumer props.`
        );
      }

      const placeholderMatch = line.match(/\b(?:searchPlaceholder|placeholder)\s*=\s*"([^"]+)"/);
      if (placeholderMatch && !isFormatMask(placeholderMatch[1])) {
        add(
          "errors",
          file,
          index + 1,
          `React Copy Contract: default placeholders must be empty or format masks; "${placeholderMatch[1]}" belongs in content/docs/consumer props.`
        );
      }

      const emptyTextMatch = line.match(/\bemptyText\s*=\s*"([^"]+)"/);
      if (!emptyTextMatch) return;

      add(
        "errors",
        file,
        index + 1,
        `React Copy Contract: default empty-state copy "${emptyTextMatch[1]}" belongs in content/docs/consumer props.`
      );
    });
  }
}

module.exports = { checkReactCopyContract };
