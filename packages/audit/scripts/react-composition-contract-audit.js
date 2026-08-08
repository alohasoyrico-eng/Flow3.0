const allowedReactComponentComposition = {
  BiometricPrompt: ["Button"],
  Button: ["Spinner"],
  Card: ["Button", "IconButton", "Spinner"],
  CardExpiryInput: ["Spinner"],
  CardNumberInput: ["Spinner"],
  CardSecurityCodeInput: ["Spinner"],
  CardSummary: ["Badge"],
  Dialog: ["Button", "IconButton", "Input"],
  Drawer: ["Badge", "Button", "IconButton", "Input", "ProgressIndicator"],
  EmptyState: ["Button", "Spinner"],
  ErrorPanel: ["Button", "Spinner"],
  FloatingActionButton: ["Spinner"],
  InlineValidation: ["Input"],
  Input: ["Spinner"],
  Menu: ["Avatar", "Button", "IconButton"],
  PhoneInput: ["CountrySelector"],
  Popover: ["Button", "Input"],
  QuickAction: ["Badge", "Spinner"],
  RouteSummary: ["Button", "IconButton"],
  Table: ["Badge"],
  Tabs: ["Badge"],
  Toast: ["Button", "IconButton"],
  TreeView: ["Button"],
};

function checkReactComponentComposition({ add, name, sourceFile, source }) {
  const allowed = new Set(allowedReactComponentComposition[name] ?? []);
  const localComponentImports = [...source.matchAll(/import\s+\{\s*([A-Z][A-Za-z0-9]*)\s*\}\s+from\s+"\.\/([A-Z][A-Za-z0-9]*)\.js"/g)]
    .map((match) => match[1]);
  const unexpected = localComponentImports.filter((item) => !allowed.has(item));
  const missing = [...allowed].filter((item) => !localComponentImports.includes(item));

  if (unexpected.length) {
    add("errors", sourceFile, 1, `${name} React source imports undeclared component composition: ${unexpected.join(", ")}. Add it to allowedReactComponentComposition only when it is intentional reuse, not duplicate visual behavior.`);
  }
  if (missing.length) {
    add("errors", sourceFile, 1, `${name} React composition contract is stale; expected imports missing: ${missing.join(", ")}.`);
  }
}

module.exports = { checkReactComponentComposition };
