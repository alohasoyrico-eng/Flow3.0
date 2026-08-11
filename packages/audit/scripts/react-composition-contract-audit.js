const reactComponentCompositionContracts = {
  BiometricPrompt: [{ component: "Button", reason: "primary fallback action" }],
  Button: [{ component: "Spinner", reason: "loading indicator slot" }],
  Card: [
    { component: "Button", reason: "declared action slot" },
    { component: "IconButton", reason: "declared icon action slot" },
    { component: "Spinner", reason: "loading indicator slot" },
  ],
  CardExpiryInput: [{ component: "Spinner", reason: "field loading indicator slot" }],
  CardNumberInput: [{ component: "Spinner", reason: "field loading indicator slot" }],
  CardSecurityCodeInput: [{ component: "Spinner", reason: "field loading indicator slot" }],
  CardSummary: [{ component: "Badge", reason: "status badge slot" }],
  ChatComposer: [
    { component: "Button", reason: "send action slot" },
    { component: "IconButton", reason: "attachment action slot" },
    { component: "TextArea", reason: "message field slot" },
    { component: "Surface", reason: "composer structural primitive boundary" },
  ],
  ChatMessage: [
    { component: "Avatar", reason: "author identity slot" },
    { component: "Button", reason: "recovery action slot" },
    { component: "Surface", reason: "message bubble structural primitive boundary" },
  ],
  ChatThread: [
    { component: "ChatMessage", reason: "governed message row slot" },
    { component: "EmptyState", reason: "unavailable conversation state slot" },
    { component: "Surface", reason: "thread log structural primitive boundary" },
  ],
  Dialog: [
    { component: "Button", reason: "dialog action slot" },
    { component: "IconButton", reason: "dismiss control" },
    { component: "Input", reason: "form field slot" },
  ],
  Drawer: [
    { component: "Badge", reason: "status badge slot" },
    { component: "Button", reason: "drawer action slot" },
    { component: "IconButton", reason: "dismiss control" },
    { component: "Input", reason: "form field slot" },
    { component: "ProgressIndicator", reason: "progress row slot" },
  ],
  EmptyState: [
    { component: "Button", reason: "recovery action slot" },
    { component: "Spinner", reason: "loading state slot" },
  ],
  ErrorPanel: [
    { component: "Button", reason: "recovery action slot" },
    { component: "Spinner", reason: "loading state slot" },
  ],
  FloatingActionButton: [{ component: "Spinner", reason: "loading indicator slot" }],
  InlineValidation: [{ component: "Input", reason: "field validation composition" }],
  Input: [{ component: "Spinner", reason: "field loading indicator slot" }],
  InputAmount: [{ component: "Spinner", reason: "field loading indicator slot" }],
  Menu: [
    { component: "Avatar", reason: "avatar trigger slot" },
    { component: "Button", reason: "button trigger slot" },
    { component: "IconButton", reason: "icon trigger slot" },
  ],
  PhoneInput: [{ component: "CountrySelector", reason: "country code selector slot" }],
  Popover: [
    { component: "Button", reason: "popover action slot" },
    { component: "Input", reason: "form field slot" },
  ],
  QuickAction: [
    { component: "Badge", reason: "counter badge slot" },
    { component: "Spinner", reason: "loading indicator slot" },
  ],
  RouteSummary: [
    { component: "Button", reason: "route action slot" },
    { component: "IconButton", reason: "compact action slot" },
  ],
  Table: [{ component: "Badge", reason: "cell status badge slot" }],
  Tabs: [{ component: "Badge", reason: "tab badge slot" }],
  Toast: [
    { component: "Button", reason: "toast action slot" },
    { component: "IconButton", reason: "dismiss control" },
  ],
  TreeView: [{ component: "Button", reason: "node action slot" }],
};

const allowedReactComponentComposition = Object.fromEntries(
  Object.entries(reactComponentCompositionContracts).map(([component, edges]) => [
    component,
    edges.map((edge) => edge.component),
  ]),
);

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

module.exports = { allowedReactComponentComposition, checkReactComponentComposition, reactComponentCompositionContracts };
