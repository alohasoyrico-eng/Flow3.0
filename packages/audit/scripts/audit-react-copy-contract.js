const { fs, path, root, read, add } = require("./audit-context.js");

const reactSrcDir = path.join(root, "packages/react/src");
const localeSpecificTerms = ["Selecciona", "Rango de fechas", " dias", "días"];
const componentContentDefaults = ["Short value", "Keep this field local", "Recent activity", "Apply", "Cancel", "Confirm", "Continue", "Save"];
const displayFallbackTermsByFile = new Map([
  ["Card.js", ["Card"]],
  ["CardSummary.js", ["Card"]],
  ["ChartPanel.js", ["Chart"]],
  ["EmptyState.js", ["No results"]],
  ["KpiTile.js", ["KPI"]],
  ["List.js", ["List item", "Loading item"]],
  ["Dialog.js", ["Action"]],
  ["Drawer.js", ["Action"]],
  ["Popover.js", ["Action"]],
  ["RouteSummary.js", ["Action"]],
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
