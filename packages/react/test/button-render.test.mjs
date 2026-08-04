import assert from "node:assert/strict";
import React, { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, Checkbox, IconButton, Input, RadioButton, Select, Switch, TextArea } from "../src/index.js";
import { buttonPlatformContract, checkboxPlatformContract, iconButtonPlatformContract, inputPlatformContract, radioButtonPlatformContract, selectPlatformContract, switchPlatformContract, textAreaPlatformContract } from "@design-system/components/platforms";

assert.equal(Button.displayName, "Button");
assert.equal(Button.platformContract, buttonPlatformContract);
assert.equal(Checkbox.displayName, "Checkbox");
assert.equal(Checkbox.platformContract, checkboxPlatformContract);
assert.equal(IconButton.displayName, "IconButton");
assert.equal(IconButton.platformContract, iconButtonPlatformContract);
assert.equal(Input.displayName, "Input");
assert.equal(Input.platformContract, inputPlatformContract);
assert.equal(RadioButton.displayName, "RadioButton");
assert.equal(RadioButton.platformContract, radioButtonPlatformContract);
assert.equal(Select.displayName, "Select");
assert.equal(Select.platformContract, selectPlatformContract);
assert.equal(Switch.displayName, "Switch");
assert.equal(Switch.platformContract, switchPlatformContract);
assert.equal(TextArea.displayName, "TextArea");
assert.equal(TextArea.platformContract, textAreaPlatformContract);

const markup = renderToStaticMarkup(React.createElement(Button, {
  label: "Approve",
  variant: "outlined",
  density: "sm",
  state: "pressed",
  icon: "check",
  trailingIcon: "arrow_forward",
  fullWidth: true,
}));

assert.match(markup, /class="button button--outlined"/);
assert.match(markup, /data-density="sm"/);
assert.match(markup, /data-state="pressed"/);
assert.match(markup, /data-full-width="true"/);
assert.match(markup, /class="button__icon"/);
assert.match(markup, /class="button__label">Approve<\/span>/);
assert.match(markup, /button__icon--trailing/);

const loadingMarkup = renderToStaticMarkup(React.createElement(Button, {
  label: "Saving",
  loading: true,
}));

assert.match(loadingMarkup, /disabled=""/);
assert.match(loadingMarkup, /aria-busy="true"/);
assert.doesNotMatch(loadingMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);
assert.match(loadingMarkup, /class="spinner"/);
assert.match(loadingMarkup, /class="spinner__svg"/);
assert.match(loadingMarkup, /class="spinner__arc"/);

const checkboxMarkup = renderToStaticMarkup(React.createElement(Checkbox, {
  label: "Enable fuel card",
  description: "Applies to active drivers.",
  checked: true,
  density: "sm",
  variant: "descriptive",
}));
assert.match(checkboxMarkup, /class="choice checkbox"/);
assert.match(checkboxMarkup, /data-density="sm"/);
assert.match(checkboxMarkup, /data-variant="descriptive"/);
assert.match(checkboxMarkup, /data-state="checked"/);
assert.match(checkboxMarkup, /type="checkbox"/);
assert.match(checkboxMarkup, /aria-checked="true"/);
assert.match(checkboxMarkup, /class="choice__mark"/);
assert.match(checkboxMarkup, /class="choice__indicator material-symbol"/);
assert.match(checkboxMarkup, /class="choice__label">Enable fuel card<\/span>/);
assert.match(checkboxMarkup, /class="choice__description"/);

const radioButtonMarkup = renderToStaticMarkup(React.createElement(RadioButton, {
  label: "Fastest route",
  description: "Prioritize arrival time.",
  checked: true,
  density: "sm",
  name: "route",
  value: "fastest",
}));
assert.match(radioButtonMarkup, /class="choice radio"/);
assert.match(radioButtonMarkup, /data-density="sm"/);
assert.match(radioButtonMarkup, /data-state="selected"/);
assert.match(radioButtonMarkup, /type="radio"/);
assert.match(radioButtonMarkup, /name="route"/);
assert.match(radioButtonMarkup, /class="choice__mark"/);
assert.match(radioButtonMarkup, /class="choice__label">Fastest route<\/span>/);
assert.match(radioButtonMarkup, /class="choice__description"/);

const switchMarkup = renderToStaticMarkup(React.createElement(Switch, {
  label: "Route alerts",
  description: "Notify drivers before changes.",
  checked: true,
  density: "sm",
  name: "route-alerts",
}));
assert.match(switchMarkup, /class="switch"/);
assert.match(switchMarkup, /data-density="sm"/);
assert.match(switchMarkup, /data-state="on"/);
assert.match(switchMarkup, /type="checkbox"/);
assert.match(switchMarkup, /role="switch"/);
assert.match(switchMarkup, /aria-checked="true"/);
assert.match(switchMarkup, /class="switch__track"/);
assert.match(switchMarkup, /class="switch__thumb"/);
assert.match(switchMarkup, /class="switch__label">Route alerts<\/span>/);
assert.match(switchMarkup, /class="switch__description"/);

const textAreaMarkup = renderToStaticMarkup(React.createElement(TextArea, {
  label: "Driver notes",
  helper: "Visible to assigned driver.",
  value: "Customer requests child seat.",
  density: "sm",
  rows: 3,
  maxLength: 120,
}));
assert.match(textAreaMarkup, /class="field"/);
assert.match(textAreaMarkup, /data-density="sm"/);
assert.match(textAreaMarkup, /data-state="filled"/);
assert.match(textAreaMarkup, /class="text-area__surface"/);
assert.match(textAreaMarkup, /data-has-counter="true"/);
assert.match(textAreaMarkup, /class="text-area"/);
assert.match(textAreaMarkup, /class="text-area__counter"/);
assert.match(textAreaMarkup, /29\/120/);
assert.match(textAreaMarkup, /aria-describedby="[^"]+-helper [^"]+-counter"/);

const ref = createRef();
React.createElement(Button, { ref, label: "Ref" });

const iconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  ariaLabel: "Open notifications",
  icon: "notifications",
  variant: "tonal",
  density: "lg",
  selected: true,
  badge: true,
}));

assert.match(iconButtonMarkup, /class="icon-button icon-button--tonal"/);
assert.match(iconButtonMarkup, /aria-label="Open notifications"/);
assert.match(iconButtonMarkup, /aria-pressed="true"/);
assert.match(iconButtonMarkup, /data-density="lg"/);
assert.match(iconButtonMarkup, /class="icon-button__icon"/);
assert.match(iconButtonMarkup, /class="icon-button__badge"/);

const inheritedIconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  ariaLabel: "More actions",
  icon: "more_horiz",
}));
assert.doesNotMatch(inheritedIconButtonMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);

const inputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Amount",
  helper: "Use settlement currency.",
  value: "2400",
  variant: "currency",
  density: "sm",
  suffix: "MXN",
  icon: "payments",
  state: "focus",
}));

assert.match(inputMarkup, /class="field"/);
assert.match(inputMarkup, /data-density="sm"/);
assert.match(inputMarkup, /data-variant="currency"/);
assert.match(inputMarkup, /data-align="end"/);
assert.match(inputMarkup, /class="field__label"/);
assert.match(inputMarkup, /class="field__control"/);
assert.match(inputMarkup, /class="field__icon"/);
assert.match(inputMarkup, /class="input"/);
assert.match(inputMarkup, /inputMode="decimal"|inputmode="decimal"/);
assert.match(inputMarkup, /class="field__suffix"/);
assert.match(inputMarkup, /class="field__helper"/);

const inheritedInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Driver",
  value: "Alex",
}));
assert.doesNotMatch(inheritedInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const selectMarkup = renderToStaticMarkup(React.createElement(Select, {
  label: "Fleet",
  helper: "Choose a fleet.",
  value: "north",
  name: "fleet",
  density: "sm",
  icon: "local_taxi",
  state: "focus",
  options: [
    { label: "North", value: "north" },
    { label: "South", value: "south", disabled: true },
  ],
}));
assert.match(selectMarkup, /class="field"/);
assert.match(selectMarkup, /data-density="sm"/);
assert.match(selectMarkup, /class="select-control"/);
assert.match(selectMarkup, /data-select-control=""/);
assert.match(selectMarkup, /role="combobox"/);
assert.match(selectMarkup, /class="select-control__icon"/);
assert.match(selectMarkup, /class="select-control__value"/);
assert.match(selectMarkup, /class="select-control__chevron"/);
assert.match(selectMarkup, /class="select-control__listbox"/);
assert.match(selectMarkup, /data-select-option=""/);
assert.match(selectMarkup, /type="hidden"/);

const inheritedSelectMarkup = renderToStaticMarkup(React.createElement(Select, {
  label: "Country code",
  value: "MX",
  options: [
    { label: "Mexico", value: "MX", meta: "+52" },
    { label: "Cuba", value: "CU", meta: "+53" },
  ],
}));
assert.doesNotMatch(inheritedSelectMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedSelectMarkup.match(/^<span[^>]+class="field"[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedSelectMarkup.match(/<span class="select-control"[^>]+>/)?.[0] ?? "", /data-density=/);

console.log("react action and field component render tests passed");
