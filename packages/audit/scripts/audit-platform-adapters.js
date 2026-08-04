const { fs, path, root, read, add } = require("./audit-context.js");
const adapterIndexFile = path.join(root, "packages/components/src/platforms/index.js");
const componentIndexFile = path.join(root, "packages/components/src/index.js");
const componentPackageFile = path.join(root, "packages/components/package.json");
const componentCssFile = path.join(root, "packages/components/styles/components.css");
const contractsFile = path.join(root, "packages/components/src/contracts.js");
const reactIndexFile = path.join(root, "packages/react/src/index.js");
const reactIndexTypesFile = path.join(root, "packages/react/src/index.d.ts");
const reactPackageFile = path.join(root, "packages/react/package.json");
const reactExampleFile = path.join(root, "examples/prototyping/react-button.mjs");
const forbiddenPrefix = "fl" + "ow-";

const components = [
  {
    id: "avatar",
    label: "Avatar",
    contractKey: "avatar",
    className: "avatar",
    files: ["Avatar.js", "Avatar.d.ts"],
    exports: ["avatarPlatformAdapters", "avatarPlatformContract", "avatarPlatformProps"],
    requiredTokens: ["comp.avatar.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*", "sys.symbol.*", "sys.growth.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography"],
    props: ["name", "src", "size", "density", "status", "state", "ariaLabel"],
    jsSnippets: ["avatarPlatformContract", "className: [\"avatar\"", '"data-status": resolvedStatus', '"data-state": resolvedState', '"data-color-index": colorIndexFromName', "avatar__initials", "avatar__status"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLSpanElement>", "AvatarProps", "AvatarSize", "AvatarStatus", "AvatarState", "avatarPlatformContract"],
    packagePath: "./avatar",
    exportName: "Avatar",
    propsName: "AvatarProps",
  },
  {
    id: "tooltip",
    label: "Tooltip",
    contractKey: "tooltip",
    className: "tooltip",
    files: ["Tooltip.js", "Tooltip.d.ts"],
    exports: ["tooltipPlatformAdapters", "tooltipPlatformContract", "tooltipPlatformProps"],
    requiredTokens: ["comp.tooltip.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*", "sys.symbol.*", "sys.growth.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"],
    props: ["triggerLabel", "content", "id", "placement", "variant", "density", "state", "disabled", "onOpenChange"],
    jsSnippets: ["tooltipPlatformContract", "className: [\"tooltip\"", '"data-placement": resolvedPlacement', '"data-variant": resolvedVariant', '"data-density": resolvedDensity', '"data-state": interactionState', '"data-open": String(isOpen)', "tooltip__trigger", "tooltip__bubble", "onOpenChange"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLSpanElement>", "TooltipProps", "TooltipPlacement", "TooltipVariant", "TooltipDensity", "TooltipState", "tooltipPlatformContract"],
    packagePath: "./tooltip",
    exportName: "Tooltip",
    propsName: "TooltipProps",
  },
  {
    id: "badge",
    label: "Badge",
    contractKey: "badge",
    className: "badge",
    files: ["Badge.js", "Badge.d.ts"],
    exports: ["badgePlatformAdapters", "badgePlatformContract", "badgePlatformProps"],
    requiredTokens: ["comp.badge.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*", "sys.symbol.*", "sys.growth.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography"],
    props: ["label", "tone", "variant", "state", "hidden", "live", "ariaLabel"],
    jsSnippets: ["badgePlatformContract", "className: [\"badge\"", '"data-tone": resolvedTone', '"data-variant": resolvedVariant', '"data-state": resolvedState', "badge__label", "badge__icon", "badge__live"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLSpanElement>", "BadgeProps", "BadgeVariant", "BadgeTone", "BadgeState", "badgePlatformContract"],
    packagePath: "./badge",
    exportName: "Badge",
    propsName: "BadgeProps",
  },
  {
    id: "chip",
    label: "Chip",
    contractKey: "chip",
    className: "chip",
    files: ["Chip.js", "Chip.d.ts"],
    exports: ["chipPlatformAdapters", "chipPlatformContract", "chipPlatformProps"],
    requiredTokens: ["comp.chip.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*", "sys.symbol.*", "sys.growth.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography"],
    props: ["label", "selected", "disabled", "removable", "icon", "interactive", "onRemoveLabel"],
    jsSnippets: ["chipPlatformContract", "className: [\"chip\"", '"data-tone": resolvedTone', '"data-variant": resolvedVariant', '"data-state": resolvedState', "chip__label", "chip__icon", "chip__remove", "onSelectedChange", "onRemove"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLSpanElement | HTMLButtonElement>", "ChipProps", "ChipVariant", "ChipTone", "ChipState", "chipPlatformContract"],
    packagePath: "./chip",
    exportName: "Chip",
    propsName: "ChipProps",
  },
  {
    id: "tag",
    label: "Tag",
    contractKey: "tag",
    className: "tag",
    files: ["Tag.js", "Tag.d.ts"],
    exports: ["tagPlatformAdapters", "tagPlatformContract", "tagPlatformProps"],
    requiredTokens: ["comp.tag.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*", "sys.symbol.*", "sys.growth.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography"],
    props: ["label", "tone", "variant", "state", "icon", "interactive", "disabled"],
    jsSnippets: ["tagPlatformContract", "className: [\"tag\"", '"data-tone": resolvedTone', '"data-variant": resolvedVariant', '"data-state": resolvedState', "tag__label", "tag__icon", "data-interactive"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLSpanElement | HTMLButtonElement>", "TagProps", "TagVariant", "TagTone", "TagState", "tagPlatformContract"],
    packagePath: "./tag",
    exportName: "Tag",
    propsName: "TagProps",
  },
  {
    id: "card-number-input",
    label: "Card Number Input",
    contractKey: "cardNumberInput",
    className: "field card-number-input",
    files: ["CardNumberInput.js", "CardNumberInput.d.ts"],
    exports: ["cardNumberInputPlatformAdapters", "cardNumberInputPlatformContract", "cardNumberInputPlatformProps"],
    requiredTokens: ["comp.card-number-input.*", "comp.input.*", "component-field-*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*", "sys.symbol.*", "sys.growth.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography", "loading", "message", "measurement"],
    props: ["label", "value", "helper", "error", "disabled", "loading", "required", "density", "state", "name", "placeholder", "validationMessage", "onValueChange"],
    jsSnippets: ["cardNumberInputPlatformContract", "className: [\"field card-number-input\"", '"data-density": density || undefined', '"data-validity": validity', '"data-brand": brand', "cardNumberValidity", "isCardNumberLuhnValid", "card-number-input__control", "card-number-input__input", "card-number-input__brand", "onValueChange"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLInputElement>", "CardNumberInputProps", "CardNumberInputDensity", "CardNumberInputState", "CardNumberMeta", "cardNumberInputPlatformContract"],
    packagePath: "./card-number-input",
    exportName: "CardNumberInput",
    propsName: "CardNumberInputProps",
  },
  {
    id: "card-expiry-input",
    label: "Card Expiry Input",
    contractKey: "cardExpiryInput",
    className: "field card-expiry-input",
    files: ["CardExpiryInput.js", "CardExpiryInput.d.ts"],
    exports: ["cardExpiryInputPlatformAdapters", "cardExpiryInputPlatformContract", "cardExpiryInputPlatformProps"],
    requiredTokens: ["comp.card-expiry-input.*", "comp.input.*", "component-field-*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*", "sys.symbol.*", "sys.growth.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography", "loading", "message", "measurement"],
    props: ["label", "value", "helper", "error", "disabled", "loading", "required", "density", "state", "name", "placeholder", "validationMessage", "expiredMessage", "onValueChange"],
    jsSnippets: ["cardExpiryInputPlatformContract", "className: [\"field card-expiry-input\"", '"data-density": density || undefined', '"data-validity": validity', '"data-month": month', '"data-year": year', "cardExpiryValidity", "formatCardExpiry", "card-expiry-input__control", "card-expiry-input__input", "onValueChange"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLInputElement>", "CardExpiryInputProps", "CardExpiryInputDensity", "CardExpiryInputState", "CardExpiryMeta", "cardExpiryInputPlatformContract"],
    packagePath: "./card-expiry-input",
    exportName: "CardExpiryInput",
    propsName: "CardExpiryInputProps",
  },
  {
    id: "card-security-code-input",
    label: "Card Security Code Input",
    contractKey: "cardSecurityCodeInput",
    className: "field card-security-code-input",
    files: ["CardSecurityCodeInput.js", "CardSecurityCodeInput.d.ts"],
    exports: ["cardSecurityCodeInputPlatformAdapters", "cardSecurityCodeInputPlatformContract", "cardSecurityCodeInputPlatformProps"],
    requiredTokens: ["comp.card-security-code-input.*", "comp.input.*", "component-field-*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*", "sys.symbol.*", "sys.growth.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography", "loading", "message", "measurement"],
    props: ["label", "value", "helper", "error", "disabled", "loading", "required", "density", "state", "name", "placeholder", "expectedLength", "validationMessage", "revealable", "revealed", "onValueChange"],
    jsSnippets: ["cardSecurityCodeInputPlatformContract", "className: [\"field card-security-code-input\"", '"data-density": density || undefined', '"data-validity": validity', '"data-length": String(digits.length)', '"data-expected-length": String(resolvedLength)', "cardSecurityCodeValidity", "normalizeCardSecurityCode", "card-security-code-input__control", "card-security-code-input__input", "field-action card-security-code-input__action", "onValueChange"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLInputElement>", "CardSecurityCodeInputProps", "CardSecurityCodeInputDensity", "CardSecurityCodeInputState", "CardSecurityCodeMeta", "cardSecurityCodeInputPlatformContract"],
    packagePath: "./card-security-code-input",
    exportName: "CardSecurityCodeInput",
    propsName: "CardSecurityCodeInputProps",
  },
  {
    id: "button",
    label: "Button",
    contractKey: "button",
    className: "button",
    files: ["Button.js", "Button.d.ts"],
    exports: ["buttonPlatformAdapters", "buttonPlatformContract", "buttonPlatformProps"],
    requiredTokens: ["comp.button.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves"],
    props: ["label", "variant", "intent", "density", "state", "disabled", "loading", "fullWidth", "icon", "trailingIcon", "type"],
    jsSnippets: ["buttonPlatformContract", "className: buttonClassName", '"data-density": density || undefined', '"data-state": resolvedState', "button__label", "spinner__svg", "spinner__arc"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLButtonElement>", "ButtonProps", "ButtonVariant", "ButtonDensity", "ButtonState", "buttonPlatformContract"],
    packagePath: "./button",
    exportName: "Button",
    propsName: "ButtonProps",
  },
  {
    id: "checkbox",
    label: "Checkbox",
    contractKey: "checkbox",
    className: "choice checkbox",
    files: ["Checkbox.js", "Checkbox.d.ts"],
    exports: ["checkboxPlatformAdapters", "checkboxPlatformContract", "checkboxPlatformProps"],
    requiredTokens: ["comp.checkbox.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography", "message", "measurement"],
    props: ["label", "description", "error", "variant", "state", "density", "checked", "indeterminate", "disabled", "name", "value", "required"],
    jsSnippets: ["checkboxPlatformContract", "className: [\"choice checkbox\"", '"data-density": density || undefined', '"data-state": normalizedState', "choice__input", "choice__mark", "choice__indicator", "onCheckedChange"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLInputElement>", "CheckboxProps", "CheckboxVariant", "CheckboxDensity", "CheckboxState", "checkboxPlatformContract", "onCheckedChange"],
    packagePath: "./checkbox",
    exportName: "Checkbox",
    propsName: "CheckboxProps",
  },
  {
    id: "icon-button",
    label: "Icon Button",
    contractKey: "iconButton",
    className: "icon-button",
    files: ["IconButton.js", "IconButton.d.ts"],
    exports: ["iconButtonPlatformAdapters", "iconButtonPlatformContract", "iconButtonPlatformProps"],
    requiredTokens: ["comp.icon-button.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography"],
    props: [],
    jsSnippets: ["iconButtonPlatformContract", "className: iconButtonClassName", '"aria-label": resolvedLabel', '"aria-pressed": selected ? "true"', '"data-density": density || undefined', "icon-button__icon", "icon-button__badge"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLButtonElement>", "IconButtonProps", "IconButtonVariant", "IconButtonDensity", "iconButtonPlatformContract", "icon: string"],
    packagePath: "./icon-button",
    exportName: "IconButton",
    propsName: "IconButtonProps",
  },
  {
    id: "input",
    label: "Input",
    contractKey: "input",
    className: "field",
    files: ["Input.js", "Input.d.ts"],
    exports: ["inputPlatformAdapters", "inputPlatformContract", "inputPlatformProps"],
    requiredTokens: ["comp.input.*", "component-field-*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"],
    props: ["label", "helper", "error", "value", "density", "state", "variant", "icon", "prefix", "suffix", "inputMode", "autocomplete", "revealable"],
    jsSnippets: ["inputPlatformContract", "className: [\"field\"", '"data-density": density || undefined', '"data-state": resolvedState', "field__control", "field__helper", "field-action", "normalizeValue", "inputModeForVariant"],
    typeSnippets: ["InputProps", "InputVariant", "InputDensity", "InputState", "inputPlatformContract", "onValueChange"],
    packagePath: "./input",
    exportName: "Input",
    propsName: "InputProps",
  },
  {
    id: "radio-button",
    label: "Radio Button",
    contractKey: "radioButton",
    className: "choice radio",
    files: ["RadioButton.js", "RadioButton.d.ts"],
    exports: ["radioButtonPlatformAdapters", "radioButtonPlatformContract", "radioButtonPlatformProps"],
    requiredTokens: ["comp.radio-button.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"],
    props: [],
    jsSnippets: ["radioButtonPlatformContract", "className: [\"choice radio\"", '"data-density": density || undefined', '"data-state": normalizedState', "choice__input", "choice__mark", "onCheckedChange"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLInputElement>", "RadioButtonProps", "RadioButtonVariant", "RadioButtonDensity", "RadioButtonState", "radioButtonPlatformContract", "onCheckedChange"],
    packagePath: "./radio-button",
    exportName: "RadioButton",
    propsName: "RadioButtonProps",
  },
  {
    id: "select",
    label: "Select",
    contractKey: "select",
    className: "select-control",
    files: ["Select.js", "Select.d.ts"],
    exports: ["selectPlatformAdapters", "selectPlatformContract", "selectPlatformProps"],
    requiredTokens: ["comp.select.*", "comp.input.*", "component-field-*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"],
    props: ["label", "helper", "icon", "options", "value", "name", "disabled", "density", "variant", "state", "onValueChange"],
    jsSnippets: ["selectPlatformContract", "className: [\"select-control\"", '"data-density": density || undefined', "select-control__trigger", "select-control__listbox", "select-control__option", "onValueChange"],
    typeSnippets: ["SelectProps", "SelectVariant", "SelectDensity", "SelectState", "selectPlatformContract", "onValueChange"],
    packagePath: "./select",
    exportName: "Select",
    propsName: "SelectProps",
  },
  {
    id: "switch",
    label: "Switch",
    contractKey: "switch",
    className: "switch",
    files: ["Switch.js", "Switch.d.ts"],
    exports: ["switchPlatformAdapters", "switchPlatformContract", "switchPlatformProps"],
    requiredTokens: ["comp.switch.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"],
    props: [],
    jsSnippets: ["switchPlatformContract", "className: [\"switch\"", '"data-density": density || undefined', '"data-state": normalizedState', "switch__input", "switch__track", "switch__thumb", "onCheckedChange"],
    typeSnippets: ["ForwardRefExoticComponent", "RefAttributes<HTMLInputElement>", "SwitchProps", "SwitchDensity", "SwitchState", "switchPlatformContract", "onCheckedChange"],
    packagePath: "./switch",
    exportName: "Switch",
    propsName: "SwitchProps",
  },
  {
    id: "text-area",
    label: "Text Area",
    contractKey: "textArea",
    className: "field",
    files: ["TextArea.js", "TextArea.d.ts"],
    exports: ["textAreaPlatformAdapters", "textAreaPlatformContract", "textAreaPlatformProps"],
    requiredTokens: ["comp.text-area.*", "component-field-*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*"],
    primitives: ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"],
    props: [],
    jsSnippets: ["textAreaPlatformContract", "className: [\"field\"", '"data-density": density || undefined', "text-area__surface", "text-area__counter", "onChange"],
    typeSnippets: ["TextAreaProps", "TextAreaDensity", "TextAreaState", "textAreaPlatformContract", "onChange"],
    packagePath: "./text-area",
    exportName: "TextArea",
    propsName: "TextAreaProps",
  },
];

function checkPlatformAdapters() {
  const adapterIndex = read(adapterIndexFile);
  const componentIndex = read(componentIndexFile);
  const componentPackage = read(componentPackageFile);
  const componentCss = read(componentCssFile);
  const contracts = read(contractsFile);
  const reactIndex = read(reactIndexFile);
  const reactIndexTypes = read(reactIndexTypesFile);
  const reactPackage = read(reactPackageFile);
  const reactExample = read(reactExampleFile);

  if (!componentIndex.includes("./platforms/index.js")) {
    add("errors", componentIndexFile, 1, "Component package must export platform implementation contracts from the public entrypoint.");
  }
  if (!componentPackage.includes('"./platforms"')) {
    add("errors", componentPackageFile, 1, "@design-system/components must expose ./platforms as a public package boundary.");
  }

  for (const component of components) {
    checkComponent(component, { adapterIndex, contracts, reactIndex, reactIndexTypes, reactPackage });
  }

  if (!reactExample.includes('import { Button } from "@design-system/react"') || !reactExample.includes('import "@design-system/components/styles.css"')) {
    add("errors", reactExampleFile, 1, "React prototype example must consume the React component entrypoint and component CSS.");
  }

  for (const cssDependency of ["--comp-button-size: var(--sys-density-control-height)", "--comp-button-padding: var(--sys-density-control-padding-x)", "--comp-button-icon-size", ".button[data-density=\"md\"]"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Button CSS must expose cascade dependency ${cssDependency}.`);
  }
  for (const cssDependency of ["--comp-icon-button-size: var(--sys-density-control-height)", "--comp-icon-button-icon-size", ".icon-button[data-density=\"md\"]"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Icon Button CSS must expose cascade dependency ${cssDependency}.`);
  }
  for (const cssDependency of ["--comp-input-control-size: var(--sys-density-control-height)", "--comp-input-padding-x", ".field[data-density=\"sm\"]", ".field[data-density=\"lg\"]", ".field__control", ".input"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Input CSS must expose cascade dependency ${cssDependency}.`);
  }
  for (const cssDependency of ["--comp-select-control-size: var(--sys-density-control-height)", "--comp-select-padding-start", ".select-control[data-density=\"sm\"]", ".select-control[data-density=\"lg\"]", ".select-control__trigger"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Select CSS must expose cascade dependency ${cssDependency}.`);
  }
}

function checkComponent(component, shared) {
  const adapterFile = path.join(root, `packages/components/src/platforms/${component.id}.js`);
  const reactFile = path.join(root, `packages/react/src/${component.files[0]}`);
  const reactTypesFile = path.join(root, `packages/react/src/${component.files[1]}`);
  const reactDistFile = path.join(root, `packages/react/dist/${component.files[0]}`);
  const reactDistTypesFile = path.join(root, `packages/react/dist/${component.files[1]}`);

  for (const file of [adapterFile, reactFile, reactTypesFile, reactDistFile, reactDistTypesFile]) {
    if (!fs.existsSync(file)) {
      add("errors", file, 1, "Platform implementation contract is missing.");
      return;
    }
  }

  const adapter = read(adapterFile);
  const react = read(reactFile);
  const reactTypes = read(reactTypesFile);

  for (const exportName of component.exports) {
    if (!shared.adapterIndex.includes(exportName)) add("errors", adapterIndexFile, 1, `Platform index must export ${exportName}.`);
    if (!adapter.includes(exportName)) add("errors", adapterFile, 1, `${component.label} platform adapter must define ${exportName}.`);
  }
  for (const snippet of ["react:", 'renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true", `componentContracts.${component.contractKey}`]) {
    if (!adapter.includes(snippet)) add("errors", adapterFile, 1, `${component.label} platform contract missing ${snippet}.`);
  }
  if (adapter.includes("dom:") || adapter.includes('renderMode: "factory"') || adapter.includes('implementationRole: "transitional-static-renderer"')) {
    add("errors", adapterFile, 1, `${component.label} platform contract must not advertise a DOM target once React is the public product component.`);
  }
  for (const token of component.requiredTokens) {
    if (!adapter.includes(token)) add("errors", adapterFile, 1, `${component.label} platform contract must include token dependency ${token}.`);
  }
  for (const primitive of component.primitives) {
    if (!adapter.includes(`"${primitive}"`)) add("errors", adapterFile, 1, `${component.label} platform contract must include primitive dependency ${primitive}.`);
  }
  for (const prop of component.props) {
    if (!shared.contracts.includes(`name: "${prop}"`)) add("errors", contractsFile, 1, `${component.label} contract is missing prop ${prop}.`);
  }
  for (const snippet of component.jsSnippets) {
    if (!react.includes(snippet)) add("errors", reactFile, 1, `React primary component missing required snippet: ${snippet}.`);
  }
  for (const snippet of component.typeSnippets) {
    if (!reactTypes.includes(snippet)) add("errors", reactTypesFile, 1, `React primary component types missing required snippet: ${snippet}.`);
  }
  if (!shared.reactPackage.includes(`"${component.packagePath}"`)) {
    add("errors", reactPackageFile, 1, `React package must export ${component.packagePath}.`);
  }
  if (!shared.reactIndex.includes(component.exportName)) {
    add("errors", reactIndexFile, 1, `React index must export ${component.exportName}.`);
  }
  if (!shared.reactIndexTypes.includes(component.propsName)) {
    add("errors", reactIndexTypesFile, 1, `React type index must export ${component.propsName}.`);
  }
  for (const [file, source] of [[adapterFile, adapter], [reactFile, react]]) {
    if (source.includes(forbiddenPrefix)) {
      add("errors", file, 1, "Platform implementation contracts must not expose the forbidden public product prefix.");
    }
  }
}

module.exports = { checkPlatformAdapters };
