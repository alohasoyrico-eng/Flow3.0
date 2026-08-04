const { fs, path, root, read, add } = require("./audit-context.js");

const adapterIndexFile = path.join(root, "packages/components/src/platforms/index.js");
const buttonAdapterFile = path.join(root, "packages/components/src/platforms/button.js");
const checkboxAdapterFile = path.join(root, "packages/components/src/platforms/checkbox.js");
const iconButtonAdapterFile = path.join(root, "packages/components/src/platforms/icon-button.js");
const inputAdapterFile = path.join(root, "packages/components/src/platforms/input.js");
const radioButtonAdapterFile = path.join(root, "packages/components/src/platforms/radio-button.js");
const selectAdapterFile = path.join(root, "packages/components/src/platforms/select.js");
const switchAdapterFile = path.join(root, "packages/components/src/platforms/switch.js");
const textAreaAdapterFile = path.join(root, "packages/components/src/platforms/text-area.js");
const componentIndexFile = path.join(root, "packages/components/src/index.js");
const componentPackageFile = path.join(root, "packages/components/package.json");
const componentCssFile = path.join(root, "packages/components/styles/components.css");
const contractsFile = path.join(root, "packages/components/src/contracts.js");
const reactButtonFile = path.join(root, "packages/react/src/Button.js");
const reactButtonTypesFile = path.join(root, "packages/react/src/Button.d.ts");
const reactCheckboxFile = path.join(root, "packages/react/src/Checkbox.js");
const reactCheckboxTypesFile = path.join(root, "packages/react/src/Checkbox.d.ts");
const reactIconButtonFile = path.join(root, "packages/react/src/IconButton.js");
const reactIconButtonTypesFile = path.join(root, "packages/react/src/IconButton.d.ts");
const reactInputFile = path.join(root, "packages/react/src/Input.js");
const reactInputTypesFile = path.join(root, "packages/react/src/Input.d.ts");
const reactRadioButtonFile = path.join(root, "packages/react/src/RadioButton.js");
const reactRadioButtonTypesFile = path.join(root, "packages/react/src/RadioButton.d.ts");
const reactSelectFile = path.join(root, "packages/react/src/Select.js");
const reactSelectTypesFile = path.join(root, "packages/react/src/Select.d.ts");
const reactSwitchFile = path.join(root, "packages/react/src/Switch.js"), reactSwitchTypesFile = path.join(root, "packages/react/src/Switch.d.ts");
const reactTextAreaFile = path.join(root, "packages/react/src/TextArea.js"), reactTextAreaTypesFile = path.join(root, "packages/react/src/TextArea.d.ts");
const reactIndexFile = path.join(root, "packages/react/src/index.js");
const reactIndexTypesFile = path.join(root, "packages/react/src/index.d.ts");
const reactDistButtonFile = path.join(root, "packages/react/dist/Button.js");
const reactDistButtonTypesFile = path.join(root, "packages/react/dist/Button.d.ts");
const reactDistCheckboxFile = path.join(root, "packages/react/dist/Checkbox.js");
const reactDistCheckboxTypesFile = path.join(root, "packages/react/dist/Checkbox.d.ts");
const reactDistIconButtonFile = path.join(root, "packages/react/dist/IconButton.js");
const reactDistIconButtonTypesFile = path.join(root, "packages/react/dist/IconButton.d.ts");
const reactDistInputFile = path.join(root, "packages/react/dist/Input.js");
const reactDistInputTypesFile = path.join(root, "packages/react/dist/Input.d.ts");
const reactDistRadioButtonFile = path.join(root, "packages/react/dist/RadioButton.js");
const reactDistRadioButtonTypesFile = path.join(root, "packages/react/dist/RadioButton.d.ts");
const reactDistSelectFile = path.join(root, "packages/react/dist/Select.js");
const reactDistSelectTypesFile = path.join(root, "packages/react/dist/Select.d.ts");
const reactDistSwitchFile = path.join(root, "packages/react/dist/Switch.js"), reactDistSwitchTypesFile = path.join(root, "packages/react/dist/Switch.d.ts");
const reactDistTextAreaFile = path.join(root, "packages/react/dist/TextArea.js"), reactDistTextAreaTypesFile = path.join(root, "packages/react/dist/TextArea.d.ts");
const reactPackageFile = path.join(root, "packages/react/package.json");
const reactExampleFile = path.join(root, "examples/prototyping/react-button.mjs");
const forbiddenPrefix = "fl" + "ow-";

function checkPlatformAdapters() {
  for (const file of [adapterIndexFile, buttonAdapterFile, checkboxAdapterFile, iconButtonAdapterFile, inputAdapterFile, radioButtonAdapterFile, selectAdapterFile, switchAdapterFile, textAreaAdapterFile, reactButtonFile, reactButtonTypesFile, reactCheckboxFile, reactCheckboxTypesFile, reactIconButtonFile, reactIconButtonTypesFile, reactInputFile, reactInputTypesFile, reactRadioButtonFile, reactRadioButtonTypesFile, reactSelectFile, reactSelectTypesFile, reactSwitchFile, reactSwitchTypesFile, reactTextAreaFile, reactTextAreaTypesFile, reactIndexFile, reactIndexTypesFile, reactDistButtonFile, reactDistButtonTypesFile, reactDistCheckboxFile, reactDistCheckboxTypesFile, reactDistIconButtonFile, reactDistIconButtonTypesFile, reactDistInputFile, reactDistInputTypesFile, reactDistRadioButtonFile, reactDistRadioButtonTypesFile, reactDistSelectFile, reactDistSelectTypesFile, reactDistSwitchFile, reactDistSwitchTypesFile, reactDistTextAreaFile, reactDistTextAreaTypesFile, reactPackageFile, reactExampleFile]) {
    if (!fs.existsSync(file)) {
      add("errors", file, 1, "Platform implementation contract is missing.");
      return;
    }
  }

  const adapterIndex = read(adapterIndexFile);
  const buttonAdapter = read(buttonAdapterFile);
  const checkboxAdapter = read(checkboxAdapterFile);
  const iconButtonAdapter = read(iconButtonAdapterFile);
  const inputAdapter = read(inputAdapterFile);
  const radioButtonAdapter = read(radioButtonAdapterFile);
  const selectAdapter = read(selectAdapterFile);
  const switchAdapter = read(switchAdapterFile);
  const textAreaAdapter = read(textAreaAdapterFile);
  const componentIndex = read(componentIndexFile);
  const componentPackage = read(componentPackageFile);
  const componentCss = read(componentCssFile);
  const contracts = read(contractsFile);
  const reactButton = read(reactButtonFile);
  const reactButtonTypes = read(reactButtonTypesFile);
  const reactCheckbox = read(reactCheckboxFile);
  const reactCheckboxTypes = read(reactCheckboxTypesFile);
  const reactIconButton = read(reactIconButtonFile);
  const reactIconButtonTypes = read(reactIconButtonTypesFile);
  const reactInput = read(reactInputFile);
  const reactInputTypes = read(reactInputTypesFile);
  const reactRadioButton = read(reactRadioButtonFile);
  const reactRadioButtonTypes = read(reactRadioButtonTypesFile);
  const reactSelect = read(reactSelectFile);
  const reactSelectTypes = read(reactSelectTypesFile);
  const reactSwitch = read(reactSwitchFile), reactSwitchTypes = read(reactSwitchTypesFile);
  const reactTextArea = read(reactTextAreaFile), reactTextAreaTypes = read(reactTextAreaTypesFile);
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
  for (const exportName of ["buttonPlatformAdapters", "buttonPlatformContract", "buttonPlatformProps"]) {
    if (!adapterIndex.includes(exportName)) {
      add("errors", adapterIndexFile, 1, `Platform index must export ${exportName}.`);
    }
    if (!buttonAdapter.includes(exportName)) {
      add("errors", buttonAdapterFile, 1, `Button platform adapter must define ${exportName}.`);
    }
  }
  for (const exportName of ["checkboxPlatformAdapters", "checkboxPlatformContract", "checkboxPlatformProps"]) {
    if (!adapterIndex.includes(exportName)) add("errors", adapterIndexFile, 1, `Platform index must export ${exportName}.`);
    if (!checkboxAdapter.includes(exportName)) add("errors", checkboxAdapterFile, 1, `Checkbox platform adapter must define ${exportName}.`);
  }
  for (const exportName of ["iconButtonPlatformAdapters", "iconButtonPlatformContract", "iconButtonPlatformProps"]) {
    if (!adapterIndex.includes(exportName)) {
      add("errors", adapterIndexFile, 1, `Platform index must export ${exportName}.`);
    }
    if (!iconButtonAdapter.includes(exportName)) {
      add("errors", iconButtonAdapterFile, 1, `Icon Button platform adapter must define ${exportName}.`);
    }
  }
  for (const exportName of ["inputPlatformAdapters", "inputPlatformContract", "inputPlatformProps"]) {
    if (!adapterIndex.includes(exportName)) {
      add("errors", adapterIndexFile, 1, `Platform index must export ${exportName}.`);
    }
    if (!inputAdapter.includes(exportName)) {
      add("errors", inputAdapterFile, 1, `Input platform adapter must define ${exportName}.`);
    }
  }
  for (const exportName of ["selectPlatformAdapters", "selectPlatformContract", "selectPlatformProps"]) {
    if (!adapterIndex.includes(exportName)) {
      add("errors", adapterIndexFile, 1, `Platform index must export ${exportName}.`);
    }
    if (!selectAdapter.includes(exportName)) {
      add("errors", selectAdapterFile, 1, `Select platform adapter must define ${exportName}.`);
    }
  }

  if (buttonAdapter.includes("dom:") || buttonAdapter.includes('renderMode: "factory"') || buttonAdapter.includes('implementationRole: "transitional-static-renderer"')) add("errors", buttonAdapterFile, 1, "Button platform contract must not advertise a DOM target once React is the public product component.");
  if (!buttonAdapter.includes("react:")) add("errors", buttonAdapterFile, 1, "Button platform contract must declare React as its implementation target.");
  if (checkboxAdapter.includes("dom:") || checkboxAdapter.includes('renderMode: "factory"') || checkboxAdapter.includes('implementationRole: "transitional-static-renderer"')) add("errors", checkboxAdapterFile, 1, "Checkbox platform contract must not advertise a DOM target once React is the public product component.");
  if (!checkboxAdapter.includes("react:")) add("errors", checkboxAdapterFile, 1, "Checkbox platform contract must declare React as its implementation target.");
  if (iconButtonAdapter.includes("dom:") || iconButtonAdapter.includes('renderMode: "factory"') || iconButtonAdapter.includes('implementationRole: "transitional-static-renderer"')) add("errors", iconButtonAdapterFile, 1, "Icon Button platform contract must not advertise a DOM target once React is the public product component.");
  if (!iconButtonAdapter.includes("react:")) add("errors", iconButtonAdapterFile, 1, "Icon Button platform contract must declare React as its implementation target.");
  if (inputAdapter.includes("dom:") || inputAdapter.includes('renderMode: "factory"') || inputAdapter.includes('implementationRole: "transitional-static-renderer"')) add("errors", inputAdapterFile, 1, "Input platform contract must not advertise a DOM target once React is the public product component.");
  if (!inputAdapter.includes("react:")) add("errors", inputAdapterFile, 1, "Input platform contract must declare React as its implementation target.");
  if (selectAdapter.includes("dom:") || selectAdapter.includes('renderMode: "factory"') || selectAdapter.includes('implementationRole: "transitional-static-renderer"')) add("errors", selectAdapterFile, 1, "Select platform contract must not advertise a DOM target once React is the public product component.");
  if (!selectAdapter.includes("react:")) add("errors", selectAdapterFile, 1, "Select platform contract must declare React as its implementation target.");
  for (const snippet of ['renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true"]) if (!buttonAdapter.includes(snippet)) add("errors", buttonAdapterFile, 1, `Button platform contract must mark React as the only public component target; missing ${snippet}.`);
  for (const snippet of ['renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true"]) if (!checkboxAdapter.includes(snippet)) add("errors", checkboxAdapterFile, 1, `Checkbox platform contract must mark React as the only public component target; missing ${snippet}.`);
  for (const snippet of ['renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true"]) if (!iconButtonAdapter.includes(snippet)) add("errors", iconButtonAdapterFile, 1, `Icon Button platform contract must mark React as the only public component target; missing ${snippet}.`);
  for (const snippet of ['renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true"]) if (!inputAdapter.includes(snippet)) add("errors", inputAdapterFile, 1, `Input platform contract must mark React as the only public component target; missing ${snippet}.`);
  for (const snippet of ['renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true"]) if (!selectAdapter.includes(snippet)) add("errors", selectAdapterFile, 1, `Select platform contract must mark React as the only public component target; missing ${snippet}.`);
  for (const token of [
    "comp.button.*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
  ]) {
    if (!buttonAdapter.includes(token)) {
      add("errors", buttonAdapterFile, 1, `Button platform contract must include token dependency ${token}.`);
    }
  }
  for (const primitive of ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves"]) {
    if (!buttonAdapter.includes(`"${primitive}"`)) {
      add("errors", buttonAdapterFile, 1, `Button platform contract must include primitive dependency ${primitive}.`);
    }
  }
  for (const prop of ["label", "variant", "intent", "density", "state", "disabled", "loading", "fullWidth", "icon", "trailingIcon", "type"]) {
    if (!contracts.includes(`name: "${prop}"`)) {
      add("errors", contractsFile, 1, `Button contract is missing prop ${prop}.`);
    }
  }
  if (!buttonAdapter.includes("componentContracts.button")) {
    add("errors", buttonAdapterFile, 1, "Button platform contract must derive props, variants, states, and accessibility from componentContracts.button.");
  }
  if (!checkboxAdapter.includes("componentContracts.checkbox")) {
    add("errors", checkboxAdapterFile, 1, "Checkbox platform contract must derive props, variants, states, and accessibility from componentContracts.checkbox.");
  }
  if (!iconButtonAdapter.includes("componentContracts.iconButton")) {
    add("errors", iconButtonAdapterFile, 1, "Icon Button platform contract must derive props, variants, states, and accessibility from componentContracts.iconButton.");
  }
  if (!inputAdapter.includes("componentContracts.input")) {
    add("errors", inputAdapterFile, 1, "Input platform contract must derive props, variants, states, and accessibility from componentContracts.input.");
  }
  if (!selectAdapter.includes("componentContracts.select")) {
    add("errors", selectAdapterFile, 1, "Select platform contract must derive props, variants, states, and accessibility from componentContracts.select.");
  }
  if (!adapterIndex.includes("radioButtonPlatformContract")) {
    add("errors", adapterIndexFile, 1, "Platform index must export Radio Button platform contracts.");
  }
  if (radioButtonAdapter.includes("dom:") || radioButtonAdapter.includes('renderMode: "factory"') || radioButtonAdapter.includes('implementationRole: "transitional-static-renderer"')) {
    add("errors", radioButtonAdapterFile, 1, "Radio Button platform contract must not advertise a DOM target once React is the public product component.");
  }
  for (const snippet of ['renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true", "componentContracts.radioButton"]) {
    if (!radioButtonAdapter.includes(snippet)) add("errors", radioButtonAdapterFile, 1, `Radio Button platform contract missing ${snippet}.`);
  }
  for (const token of ["comp.radio-button.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*"]) {
    if (!radioButtonAdapter.includes(token)) add("errors", radioButtonAdapterFile, 1, `Radio Button platform contract must include token dependency ${token}.`);
  }
  for (const primitive of ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"]) {
    if (!radioButtonAdapter.includes(`"${primitive}"`)) add("errors", radioButtonAdapterFile, 1, `Radio Button platform contract must include primitive dependency ${primitive}.`);
  }
  if (!adapterIndex.includes("switchPlatformContract")) add("errors", adapterIndexFile, 1, "Platform index must export Switch platform contracts.");
  if (switchAdapter.includes("dom:") || switchAdapter.includes('renderMode: "factory"') || switchAdapter.includes('implementationRole: "transitional-static-renderer"')) add("errors", switchAdapterFile, 1, "Switch platform contract must not advertise a DOM target once React is the public product component.");
  for (const snippet of ['renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true", "componentContracts.switch"]) if (!switchAdapter.includes(snippet)) add("errors", switchAdapterFile, 1, `Switch platform contract missing ${snippet}.`);
  for (const token of ["comp.switch.*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*"]) if (!switchAdapter.includes(token)) add("errors", switchAdapterFile, 1, `Switch platform contract must include token dependency ${token}.`);
  for (const primitive of ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"]) if (!switchAdapter.includes(`"${primitive}"`)) add("errors", switchAdapterFile, 1, `Switch platform contract must include primitive dependency ${primitive}.`);
  if (!adapterIndex.includes("textAreaPlatformContract")) add("errors", adapterIndexFile, 1, "Platform index must export Text Area platform contracts.");
  if (textAreaAdapter.includes("dom:") || textAreaAdapter.includes('renderMode: "factory"') || textAreaAdapter.includes('implementationRole: "transitional-static-renderer"')) add("errors", textAreaAdapterFile, 1, "Text Area platform contract must not advertise a DOM target once React is the public product component.");
  for (const snippet of ['renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true", "componentContracts.textArea"]) if (!textAreaAdapter.includes(snippet)) add("errors", textAreaAdapterFile, 1, `Text Area platform contract missing ${snippet}.`);
  for (const token of ["comp.text-area.*", "component-field-*", "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*"]) if (!textAreaAdapter.includes(token)) add("errors", textAreaAdapterFile, 1, `Text Area platform contract must include token dependency ${token}.`);
  for (const primitive of ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"]) if (!textAreaAdapter.includes(`"${primitive}"`)) add("errors", textAreaAdapterFile, 1, `Text Area platform contract must include primitive dependency ${primitive}.`);
  for (const token of [
    "comp.input.*",
    "component-field-*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.iconography.*",
  ]) {
    if (!inputAdapter.includes(token)) {
      add("errors", inputAdapterFile, 1, `Input platform contract must include token dependency ${token}.`);
    }
  }
  for (const primitive of ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"]) {
    if (!inputAdapter.includes(`"${primitive}"`)) {
      add("errors", inputAdapterFile, 1, `Input platform contract must include primitive dependency ${primitive}.`);
    }
  }
  for (const prop of ["label", "helper", "error", "value", "density", "state", "variant", "icon", "prefix", "suffix", "inputMode", "autocomplete", "revealable"]) {
    if (!contracts.includes(`name: "${prop}"`)) {
      add("errors", contractsFile, 1, `Input contract is missing prop ${prop}.`);
    }
  }
  for (const token of [
    "comp.select.*",
    "comp.input.*",
    "component-field-*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.iconography.*",
  ]) {
    if (!selectAdapter.includes(token)) {
      add("errors", selectAdapterFile, 1, `Select platform contract must include token dependency ${token}.`);
    }
  }
  for (const primitive of ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "message", "measurement"]) {
    if (!selectAdapter.includes(`"${primitive}"`)) {
      add("errors", selectAdapterFile, 1, `Select platform contract must include primitive dependency ${primitive}.`);
    }
  }
  for (const token of [
    "comp.checkbox.*",
    "sys.energy.*",
    "sys.voice.*",
    "sys.frame.*",
    "sys.state.*",
    "sys.momentum.*",
    "sys.accessibility.*",
    "sys.iconography.*",
  ]) {
    if (!checkboxAdapter.includes(token)) add("errors", checkboxAdapterFile, 1, `Checkbox platform contract must include token dependency ${token}.`);
  }
  for (const primitive of ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography", "message", "measurement"]) {
    if (!checkboxAdapter.includes(`"${primitive}"`)) add("errors", checkboxAdapterFile, 1, `Checkbox platform contract must include primitive dependency ${primitive}.`);
  }
  for (const prop of ["label", "description", "error", "variant", "state", "density", "checked", "indeterminate", "disabled", "name", "value", "required"]) {
    if (!contracts.includes(`name: "${prop}"`)) add("errors", contractsFile, 1, `Checkbox contract is missing prop ${prop}.`);
  }
  for (const prop of ["label", "helper", "icon", "options", "value", "name", "disabled", "density", "variant", "state", "onValueChange"]) {
    if (!contracts.includes(`name: "${prop}"`)) {
      add("errors", contractsFile, 1, `Select contract is missing prop ${prop}.`);
    }
  }
  for (const [file, source, required] of [
    [reactButtonFile, reactButton, ["buttonPlatformContract", "className: buttonClassName", '"data-density": density || undefined', '"data-state": resolvedState', "button__label", "spinner__svg", "spinner__arc"]],
    [reactButtonTypesFile, reactButtonTypes, ["ButtonProps", "ButtonVariant", "ButtonDensity", "ButtonState", "buttonPlatformContract"]],
    [reactCheckboxFile, reactCheckbox, ["checkboxPlatformContract", "className: [\"choice checkbox\"", '"data-density": density || undefined', '"data-state": normalizedState', "choice__input", "choice__mark", "choice__indicator", "onCheckedChange"]],
    [reactCheckboxTypesFile, reactCheckboxTypes, ["CheckboxProps", "CheckboxVariant", "CheckboxDensity", "CheckboxState", "checkboxPlatformContract", "onCheckedChange"]],
    [reactPackageFile, reactPackage, ['"build": "node scripts/build.mjs"', '"test": "node test/button-render.test.mjs"', '"types": "./dist/index.d.ts"', '"./button"', '"./checkbox"', '"./radio-button"', '"./select"', '"./switch"', '"./text-area"']],
    [reactExampleFile, reactExample, ['import { Button } from "@design-system/react"', 'import "@design-system/components/styles.css"']],
    [reactIconButtonFile, reactIconButton, ["iconButtonPlatformContract", "className: iconButtonClassName", '"aria-label": resolvedLabel', '"aria-pressed": selected ? "true"', '"data-density": density || undefined', "icon-button__icon", "icon-button__badge"]],
    [reactIconButtonTypesFile, reactIconButtonTypes, ["IconButtonProps", "IconButtonVariant", "IconButtonDensity", "iconButtonPlatformContract", "icon: string"]],
    [reactInputFile, reactInput, ["inputPlatformContract", "className: [\"field\"", '"data-density": density || undefined', '"data-state": resolvedState', "field__control", "field__helper", "field-action", "normalizeValue", "inputModeForVariant"]],
    [reactInputTypesFile, reactInputTypes, ["InputProps", "InputVariant", "InputDensity", "InputState", "inputPlatformContract", "onValueChange"]],
    [reactRadioButtonFile, reactRadioButton, ["radioButtonPlatformContract", "className: [\"choice radio\"", '"data-density": density || undefined', '"data-state": normalizedState', "choice__input", "choice__mark", "onCheckedChange"]],
    [reactRadioButtonTypesFile, reactRadioButtonTypes, ["RadioButtonProps", "RadioButtonVariant", "RadioButtonDensity", "RadioButtonState", "radioButtonPlatformContract", "onCheckedChange"]],
    [reactSelectFile, reactSelect, ["selectPlatformContract", "className: [\"select-control\"", '"data-density": density || undefined', "select-control__trigger", "select-control__listbox", "select-control__option", "onValueChange"]],
    [reactSelectTypesFile, reactSelectTypes, ["SelectProps", "SelectVariant", "SelectDensity", "SelectState", "selectPlatformContract", "onValueChange"]],
    [reactSwitchFile, reactSwitch, ["switchPlatformContract", "className: [\"switch\"", '"data-density": density || undefined', '"data-state": normalizedState', "switch__input", "switch__track", "switch__thumb", "onCheckedChange"]],
    [reactSwitchTypesFile, reactSwitchTypes, ["SwitchProps", "SwitchDensity", "SwitchState", "switchPlatformContract", "onCheckedChange"]],
    [reactTextAreaFile, reactTextArea, ["textAreaPlatformContract", "className: [\"field\"", '"data-density": density || undefined', "text-area__surface", "text-area__counter", "onChange"]],
    [reactTextAreaTypesFile, reactTextAreaTypes, ["TextAreaProps", "TextAreaDensity", "TextAreaState", "textAreaPlatformContract", "onChange"]],
    [reactIndexFile, reactIndex, ["Button", "Checkbox", "IconButton", "Input", "RadioButton", "Select", "Switch", "TextArea"]],
    [reactIndexTypesFile, reactIndexTypes, ["ButtonProps", "CheckboxProps", "IconButtonProps", "InputProps", "RadioButtonProps", "SelectProps", "SwitchProps", "TextAreaProps"]],
  ]) {
    for (const snippet of required) {
      if (!source.includes(snippet)) {
        add("errors", file, 1, `React primary component or platform contract missing required snippet: ${snippet}.`);
      }
    }
  }
  for (const cssDependency of ["--comp-button-size: var(--sys-density-control-height)", "--comp-button-padding: var(--sys-density-control-padding-x)", "--comp-button-icon-size", ".button[data-density=\"md\"]"]) {
    if (!componentCss.includes(cssDependency)) {
      add("errors", componentCssFile, 1, `Button CSS must expose cascade dependency ${cssDependency}.`);
    }
  }
  for (const cssDependency of ["--comp-icon-button-size: var(--sys-density-control-height)", "--comp-icon-button-icon-size", ".icon-button[data-density=\"md\"]"]) {
    if (!componentCss.includes(cssDependency)) {
      add("errors", componentCssFile, 1, `Icon Button CSS must expose cascade dependency ${cssDependency}.`);
    }
  }
  for (const cssDependency of ["--comp-input-control-size: var(--sys-density-control-height)", "--comp-input-padding-x", ".field[data-density=\"sm\"]", ".field[data-density=\"lg\"]", ".field__control", ".input"]) {
    if (!componentCss.includes(cssDependency)) {
      add("errors", componentCssFile, 1, `Input CSS must expose cascade dependency ${cssDependency}.`);
    }
  }
  for (const cssDependency of ["--comp-select-control-size: var(--sys-density-control-height)", "--comp-select-padding-start", ".select-control[data-density=\"sm\"]", ".select-control[data-density=\"lg\"]", ".select-control__trigger"]) {
    if (!componentCss.includes(cssDependency)) {
      add("errors", componentCssFile, 1, `Select CSS must expose cascade dependency ${cssDependency}.`);
    }
  }
  for (const [file, source] of [
    [buttonAdapterFile, buttonAdapter],
    [iconButtonAdapterFile, iconButtonAdapter],
    [checkboxAdapterFile, checkboxAdapter],
    [inputAdapterFile, inputAdapter],
    [radioButtonAdapterFile, radioButtonAdapter],
    [selectAdapterFile, selectAdapter],
    [reactButtonFile, reactButton],
    [reactIconButtonFile, reactIconButton],
    [reactCheckboxFile, reactCheckbox],
    [reactInputFile, reactInput],
    [reactRadioButtonFile, reactRadioButton],
    [reactSelectFile, reactSelect],
    [reactSwitchFile, reactSwitch],
    [reactTextAreaFile, reactTextArea],
  ]) {
    if (source.includes(forbiddenPrefix)) {
      add("errors", file, 1, "Platform implementation contracts must not expose the forbidden public product prefix.");
    }
  }
}

module.exports = { checkPlatformAdapters };
