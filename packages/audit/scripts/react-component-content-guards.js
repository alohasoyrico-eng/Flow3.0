function checkReactComponentContentGuards({ add, name, sourceFile, source }) {
  if (name === "Select" && /options\.find\(\(option\) => !option\.disabled\)/.test(source)) add("errors", sourceFile, 1, "Select must not auto-select the first enabled option; selected value belongs to product code or user interaction.");
  if (["CardSummary", "RouteSummary"].includes(name) && /metric\?\.(?:label|value)\s*\?\?\s*""/.test(source)) add("errors", sourceFile, 1, `${name} metrics must not render empty text nodes; filter incomplete metrics before rendering.`);
  if (name === "Menu" && /item\.label\s*\?\?\s*""/.test(source)) add("errors", sourceFile, 1, "Menu items must not render empty labels; filter unlabeled menu items before rendering.");
  if (name === "Menu" && !source.includes("const hasTrigger = resolvedVariant")) add("errors", sourceFile, 1, "Menu must gate trigger composition on a visible or accessible trigger name.");
  if (name === "Popover" && /^\s*React\.createElement\(Button,\s*\{\n\s*ref:\s*triggerRef/m.test(source)) add("errors", sourceFile, 1, "Popover must not render an unnamed trigger; gate trigger composition on triggerLabel or triggerAriaLabel.");
  if (name === "Popover" && /const hasField = Boolean\(field\?\.(?:value|placeholder|helper)/.test(source)) add("errors", sourceFile, 1, "Popover form field must require a visible label before composing Input.");
  if (name === "Drawer" && /item\.(?:copy|label)\s*\?\?\s*""|label:\s*item\.label\s*\?\?\s*""/.test(source)) add("errors", sourceFile, 1, "Drawer content must not render empty rows; filter incomplete content before composing child components.");
  if (name === "TreeView" && /label:\s*node\?\.label\s*\?\?\s*""/.test(source)) add("errors", sourceFile, 1, "TreeView must not render unlabeled treeitems; filter nodes without visible labels before normalizing.");
  if (name === "Accordion" && /ariaLabel:\s*item\.ariaLabel\s*\?\?\s*item\["aria-label"\]\s*\?\?\s*""/.test(source)) add("errors", sourceFile, 1, "Accordion must not render unlabeled triggers; filter items without title, label, or ariaLabel before normalizing.");
  if (name === "Tabs" && /label:\s*item\?\.label\s*\?\?\s*""/.test(source)) add("errors", sourceFile, 1, "Tabs must not render unlabeled tabs; filter items without visible labels before normalizing.");
  if (name === "SegmentedControl" && /label:\s*item\?\.label\s*\?\?\s*""/.test(source)) add("errors", sourceFile, 1, "SegmentedControl must not render unlabeled segments; filter items without visible labels before normalizing.");
  if (name === "Stepper" && /label:\s*step\?\.label\s*\?\?\s*""/.test(source)) add("errors", sourceFile, 1, "Stepper must not render unlabeled progress steps; filter steps without visible labels before normalizing.");
  if (name === "Breadcrumbs" && /label:\s*item\.label\s*\?\?\s*""/.test(source)) add("errors", sourceFile, 1, "Breadcrumbs must not render unlabeled path items; filter items without visible labels before resolving layout.");
  if (name === "Card" && /actions\.map\(\(action,\s*index\)\s*=>\s*cardAction/.test(source)) add("errors", sourceFile, 1, "Card must filter actions that cannot render a visible or accessible control before composing Button or IconButton.");
  if (name === "RouteSummary" && /actions\.map\(\(action,\s*index\)\s*=>\s*renderAction/.test(source)) add("errors", sourceFile, 1, "RouteSummary must filter actions that cannot render a visible or accessible control before composing Button or IconButton.");
  if (name === "Dialog" && /^\s*React\.createElement\(Button,\s*\{\n\s*ref:\s*triggerRef/m.test(source)) add("errors", sourceFile, 1, "Dialog must not render an unnamed trigger; gate trigger composition on triggerLabel or triggerAriaLabel.");
  if (name === "Dialog" && /^\s*React\.createElement\(IconButton,\s*\{\n\s*ref:\s*closeRef/m.test(source)) add("errors", sourceFile, 1, "Dialog must not render an unnamed close button; gate close composition on closeLabel.");
  if (name === "Dialog" && /fields\.map\(\(field,\s*index\)\s*=>\s*React\.createElement\(Input/.test(source)) add("errors", sourceFile, 1, "Dialog must filter fields without visible labels before composing Input.");
  if (name === "Drawer" && /^\s*React\.createElement\(Button,\s*\{\n\s*ref:\s*triggerRef/m.test(source)) add("errors", sourceFile, 1, "Drawer must not render an unnamed trigger; gate trigger composition on triggerLabel or triggerAriaLabel.");
  if (name === "Drawer" && /^\s*React\.createElement\(IconButton,\s*\{\n\s*ref:\s*closeRef/m.test(source)) add("errors", sourceFile, 1, "Drawer must not render an unnamed close button; gate close composition on closeLabel.");
  if (name === "Drawer" && /fields\.map\(\(field,\s*index\)\s*=>/.test(source)) add("errors", sourceFile, 1, "Drawer must filter fields without visible labels before composing Input.");
  if (name === "Toast" && /dismissible\s*\?\s*React\.createElement\(IconButton/.test(source)) add("errors", sourceFile, 1, "Toast must gate dismiss IconButton on dismissLabel, not dismissible alone.");
  if (name === "FloatingActionButton" && !source.includes("if (!resolvedLabel) return null;")) add("errors", sourceFile, 1, "FloatingActionButton must not render without an accessible label.");
  if (name === "QuickAction" && !source.includes("if (!resolvedLabel) return null;")) add("errors", sourceFile, 1, "QuickAction must not render without an accessible label.");
  if (name === "Chip" && !source.includes("const canRemove = Boolean(removable && onRemoveLabel);")) add("errors", sourceFile, 1, "Chip must gate removable behavior on onRemoveLabel instead of removable alone.");
  if (name === "Table" && !source.includes("const canRenderExpanders = expandable && typeof getExpandLabel === \"function\";")) add("errors", sourceFile, 1, "Table must gate expandable controls on getExpandLabel instead of expandable alone.");
  if (name === "Table" && /"aria-label":\s*expandLabel\s*\|\|\s*undefined/.test(source)) add("errors", sourceFile, 1, "Table expander labels must be required before composing expandable controls.");
  if (name === "StationPin" && !source.includes("if (!accessibleLabel) return null;")) add("errors", sourceFile, 1, "StationPin must not render without an accessible label.");
  if (name === "KpiTile" && !source.includes("const interactive = requestedInteraction && Boolean(accessibleLabel);")) add("errors", sourceFile, 1, "KpiTile must gate interactive behavior on an accessible label.");
  if (name === "List" && !source.includes("const itemCanInteract = isInteractive && Boolean(item.label || item.meta || item.value);")) add("errors", sourceFile, 1, "List must gate interactive rows on visible item content.");
  if (name === "Card" && !source.includes("const isInteractive = !hasActions && hasInteractiveContent && requestedInteraction;")) add("errors", sourceFile, 1, "Card must gate interactive behavior on visible card content.");
}

module.exports = { checkReactComponentContentGuards };
