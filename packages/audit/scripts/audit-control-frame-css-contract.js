const { path, root, read, add, lineNumber } = require("./audit-context.js");

const packageCssFile = path.join(root, "packages/components/styles/components.css");

function checkControlFrameCssContract() {
  const css = read(packageCssFile);
  const required = [
    ["--component-control-frame-size-sm: var(--sys-space-9);", "ControlFrame sm must own the shared rendered control height."],
    ["--component-control-frame-size-md: var(--component-control-min-size);", "ControlFrame md must own the shared rendered control height."],
    ["--component-control-frame-size-lg: calc(var(--sys-space-12) + var(--sys-space-xs));", "ControlFrame lg must own the shared rendered control height."],
    ["--component-control-frame-font-size-sm: var(--component-font-size-small);", "ControlFrame sm must own shared control typography."],
    ["--component-control-frame-font-size-md: var(--component-font-size-label);", "ControlFrame md must own shared control typography."],
    ["--component-control-frame-font-size-lg: var(--component-font-size-body);", "ControlFrame lg must own shared control typography."],
    ["--component-control-frame-radius-action: var(--component-radius-pill);", "Action controls must keep their own radius role."],
    ["--component-control-frame-radius-field: var(--component-radius-control);", "Field controls must keep their own radius role."],
    ["--component-control-frame-radius-navigation: var(--component-radius-sm);", "Navigation controls must keep their own radius role."],
    ["--component-action-bg-primary: var(--component-color-action);", "Action appearance must expose a shared primary background role."],
    ["--component-action-bg-secondary: var(--component-color-surface);", "Action appearance must expose a shared secondary background role."],
    ["--component-action-bg-tertiary: var(--component-color-surface-raised);", "Action appearance must expose a shared tertiary background role."],
    ["--component-action-bg-outlined: var(--component-color-surface);", "Action appearance must expose a shared outlined background role."],
    ["--component-action-bg-ghost: var(--component-surface-transparent);", "Action appearance must expose a shared ghost background role."],
    ["--component-action-bg-danger-hover: var(--component-tone-danger-bg-hover);", "Danger action hover must stay in the danger tone family."],
    ["--component-action-bg-warning-hover: var(--component-tone-warning-bg-hover);", "Warning action hover must stay in the warning tone family."],
    ["--component-radius-surface: var(--sys-radius-surface);", "Structural surfaces must consume the surface radius primitive."],
    ["--component-overlay-panel-radius: var(--component-control-frame-radius-field);", "Overlay/listbox panels must consume a shared field-aligned radius role."],
    ["--component-listbox-radius: var(--component-overlay-panel-radius);", "Listbox panels must inherit the overlay panel radius role."],
    ["--component-option-row-radius: calc(var(--component-control-frame-radius-field) - var(--component-frame-space-micro));", "Option rows must derive from the field radius role instead of inventing a curve."],
    ["--component-button-size-sm: var(--component-control-frame-size-sm);", "Button sm must consume ControlFrame directly."],
    ["--component-button-size-md: var(--component-control-frame-size-md);", "Button md must consume ControlFrame directly."],
    ["--component-button-size-lg: var(--component-control-frame-size-lg);", "Button lg must consume ControlFrame directly."],
    ["--component-field-control-size-sm: var(--component-control-frame-size-sm);", "Field sm must consume ControlFrame directly."],
    ["--component-field-control-size-md: var(--component-control-frame-size-md);", "Field md must consume ControlFrame directly."],
    ["--component-field-control-size-lg: var(--component-control-frame-size-lg);", "Field lg must consume ControlFrame directly."],
    ["--comp-button-radius: var(--component-control-frame-radius-action);", "Button must use the action radius role."],
    ["--component-surface-radius: var(--component-radius-surface);", "Surface must default to the surface radius role."],
    ['.surface[data-surface-role="canvas"]', "Surface canvas role must be explicit."],
    ["--component-surface-radius: var(--component-radius-none);", "Canvas Surface must remove object radius."],
    ['.surface[data-surface-role="inline"]', "Surface inline role must be explicit."],
    ["--component-surface-radius: var(--component-radius-control);", "Inline Surface must use control radius rather than panel radius."],
    ["border-radius: var(--component-control-frame-radius-field);", "Field and Select must use the field radius role."],
    ["block-size: var(--comp-button-current-size);", "Button must render exact frame height, not only min-height."],
    ["block-size: var(--comp-field-control-size);", "Input/Field must render exact frame height, not only min-height."],
    ["block-size: var(--comp-select-current-control-size);", "Select must render exact frame height, not only min-height."],
    ["block-size: var(--comp-breadcrumbs-target-block);", "Breadcrumbs targets must render exact navigation frame height, not only min-height."],
    ["box-sizing: border-box;", "Control frame consumers must include border in rendered size."],
  ];

  for (const [snippet, message] of required) {
    const index = css.indexOf(snippet);
    if (index < 0) add("errors", packageCssFile, 1, `${message} Missing: ${snippet}`);
  }

  for (const stale of [
    "--component-field-control-size-sm: var(--component-button-size-sm);",
    "--component-field-control-size-md: var(--component-button-size-md);",
    "--component-field-control-size-lg: var(--component-button-size-lg);",
  ]) {
    const index = css.indexOf(stale);
    if (index >= 0) add("errors", packageCssFile, lineNumber(css, index), `Field controls must not be coupled to Button aliases. Use ControlFrame instead: ${stale}`);
  }
}

module.exports = { checkControlFrameCssContract };
